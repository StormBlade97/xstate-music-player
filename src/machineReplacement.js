import { Machine, interpret, assign, send, spawn } from "xstate";
import metadataExtractor from "./services/metadataExtractor";
import { bound, shuffleArray } from "@/util";
import getEnrichmentMachine from "./services/enrichmentmachine";

const statechartsDef = {
  id: "musicPlayer",
  context: {
    loadManager: {
      jobQueue: []
    },
    tracks: [],
    currentTrack: 0,
    currentTime: 0,
    originalTracks: []
  },
  type: "parallel",
  states: {
    uploadable: {
      on: {
        UPLOAD_TRACK: {
          actions: ["registerTrack"]
        },
        JOB_COMPLETE: {
          actions: ["receiveMetadata", "spawnEnrichmentService"]
        }
      }
    },
    enrichable: {
      on: {
        RECEIVE_MATCH_CONFIRMATION: {
          actions: "receivedEnrichmentData"
        },
        RECEIVE_MATCH_DETAIL: {
          actions: "receivedMatchDetailedData"
        },
        /* forward these events to child */
        GET_SPOTIFY_MATCH: {
          actions: "forwardEnrichmentEvent"
        },
        CONFIRM_MATCH: {
          actions: "forwardEnrichmentEvent"
        },
        RETRY_FETCH_MATCH_DETAILS: {
          actions: "forwardEnrichmentEvent"
        }
      }
    },
    main: {
      initial: "empty",
      states: {
        empty: {
          on: {
            JOB_COMPLETE: "ready"
          }
        },
        ready: {
          type: "parallel",
          states: {
            playback: {
              initial: "checkingAudioLoaded",
              on: {
                SELECT_TRACK: {
                  target: "playback",
                  actions: ["setSelectedTrack"]
                }
              },
              states: {
                checkingAudioLoaded: {
                  on: {
                    "": [
                      {
                        target: "loadingAudioData",
                        cond: "isAudioNotLoaded"
                      },
                      {
                        target: "playable",
                        cond: "isAudioLoaded"
                      }
                    ]
                  }
                },
                loadingAudioData: {
                  after: {
                    5000: "loadFailed"
                  },
                  invoke: {
                    src: "loadBinaryData",
                    onDone: {
                      target: "playable",
                      actions: "updateLoadedBinary"
                    },
                    onError: {
                      target: "loadFailed"
                    }
                  }
                },
                loadFailed: {
                  on: {
                    RETRY_LOAD_BINARY: "loadingAudioData"
                  }
                },
                playable: {
                  initial: "attemptingPlay",
                  on: {
                    SEEK: {
                      actions: "seekTo"
                    },
                    SKIP_TEN: {
                      actions: "skip10"
                    }
                  },
                  states: {
                    paused: {
                      on: {
                        PLAY: {
                          target: "attemptingPlay"
                        }
                      }
                    },
                    attemptingPlay: {
                      invoke: {
                        id: "attemptPlayProcess",
                        src: "playAttempt",
                        onError: {
                          target: "paused"
                        },
                        onDone: {
                          target: "playing"
                        }
                      }
                    },
                    playing: {
                      invoke: {
                        id: "playingDaemon",
                        src: "playingProcess"
                      },
                      on: {
                        PAUSE: {
                          target: "paused",
                          actions: "pauseTrack"
                        },
                        END: {
                          target: "paused",
                          actions: ["pauseTrack", "resetToZero"]
                        },
                        UPDATE_TIME: {
                          actions: "updateTrackCurrentTime"
                        }
                      }
                    }
                  }
                }
              }
            },
            repeat: {
              initial: "off",
              states: {
                off: {
                  on: {
                    TOGGLE_REPEAT: "once",
                    NEXT: {
                      actions: ["resetToZero", "selectNextTrack", send("PLAY")]
                    },
                    PREV: {
                      actions: ["resetToZero", "selectPrevTrack", send("PLAY")]
                    },
                    END: {
                      actions: ["resetToZero", "selectNextTrack", send("PLAY")]
                    }
                  }
                },
                once: {
                  on: {
                    TOGGLE_REPEAT: [
                      {
                        target: "all",
                        cond: "hasMultipleTracks"
                      },
                      {
                        target: "off",
                        cond: "hasOneTrack"
                      }
                    ],
                    NEXT: {
                      actions: ["resetToZero", send("PLAY")]
                    },
                    PREV: {
                      actions: ["resetToZero", send("PLAY")]
                    },
                    END: {
                      actions: ["resetToZero", send("PLAY")]
                    }
                  }
                },
                all: {
                  on: {
                    TOGGLE_REPEAT: {
                      target: "off"
                    },
                    NEXT: {
                      actions: [
                        "resetToZero",
                        "selectNextTrackWrapped",
                        send("PLAY")
                      ]
                    },
                    PREV: {
                      actions: [
                        "resetToZero",
                        "selectPrevTrackWrapped",
                        send("PLAY")
                      ]
                    },
                    END: {
                      actions: [
                        "resetToZero",
                        "selectNextTrackWrapped",
                        send("PLAY")
                      ]
                    }
                  }
                }
              }
            },
            shuffle: {
              initial: "disabled",
              states: {
                enabled: {
                  on: {
                    TOGGLE_SHUFFLE: {
                      target: "disabled",
                      actions: "unshufflePlaylist"
                    }
                  }
                },
                disabled: {
                  on: {
                    TOGGLE_SHUFFLE: {
                      target: "enabled",
                      actions: "shufflePlaylist"
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

export const actionsAndServices = {
  actions: {
    registerTrack: assign({
      tracks: (context, event) => {
        const { fileArray } = event.payload;
        const newTracks = fileArray
          .filter(e1 => !context.tracks.find(e2 => e2.id === e1.name))
          .map(fileRef => {
            const id = fileRef.name;
            const proccess = spawn(metadataExtractor(fileRef));
            return {
              id,
              file: fileRef,
              childProcess: proccess,
              loaded: false
            };
          });
        const result = context.tracks.concat(newTracks);
        return result;
      }
    }),
    receiveMetadata: assign({
      tracks: (context, event) => {
        const { payload } = event;
        const foundIndex = context.tracks.findIndex(
          elem => elem.id === payload.id
        );
        if (foundIndex !== -1) {
          context.tracks.splice(foundIndex, 1, {
            ...context.tracks[foundIndex],
            ...payload,
            loaded: true
          });
          context.tracks[foundIndex].childProcess.stop();
          return context.tracks;
        } else {
          console.error(
            `Failed to handle event UPDATE_CHILDREN. Reason: TRACK_NOT_FOUND / trackID: ${payload.id}`
          );
        }
      }
    }),
    receivedEnrichmentData: assign({
      tracks: context => {
        const { tracks, currentTrack } = context;
        const enrichmentChildStateContext =
          tracks[currentTrack].enrichment.state.context;
        const { matches, selected } = enrichmentChildStateContext;
        const match = matches[selected];
        delete match.duration;

        tracks.splice(currentTrack, 1, {
          ...tracks[currentTrack],
          title: match.name,
          spotifyId: match.id,
          albumArt: match.album.images[0].url,
          artist: match.album.artists.map(a => a.name).join(" & "),
          album: match.album,
          ...match
        });
        return tracks;
      }
    }),
    forwardEnrichmentEvent: (context, event) => {
      context.tracks[context.currentTrack].enrichment.send(event);
    },
    updateLoadedBinary: assign({
      tracks: (context, event) => {
        const { tracks, currentTrack } = context;
        const b = [].concat(tracks);
        b.splice(currentTrack, 1, {
          ...context.tracks[currentTrack],
          ...event.data
        });
        return b;
      }
    }),
    setSelectedTrack: assign({
      currentTrack: (context, event) => {
        return event.payload.index;
      }
    }),
    spawnEnrichmentService: assign({
      tracks: (context, event) => {
        const { tracks } = context;
        const query =
          event.payload.metadata && event.payload.metadata.common.title
            ? `${event.payload.metadata.common.title} - ${event.payload.metadata.common.artist}`
            : event.payload.id.split(".")[0].replace(/\([^()]*\)/g, "");
        const index = tracks.findIndex(e => e.id === event.payload.id);
        tracks.splice(index, 1, {
          ...tracks[index],
          enrichment: spawn(getEnrichmentMachine({ query }))
        });
        return tracks;
      }
    }),
    pauseTrack: context => {
      const { tracks, currentTrack } = context;
      tracks[currentTrack].audioElem.pause();
    },
    seekTo: assign({
      currentTime: (context, event) => {
        const { tracks, currentTrack } = context;
        const duration = tracks[currentTrack].duration;
        const dest = bound(duration, 0)(event.payload.toTime);
        tracks[currentTrack].audioElem.currentTime = dest || 0;
        return dest;
      }
    }),
    resetToZero: send({
      type: "SEEK",
      payload: {
        toTime: 0
      }
    }),
    updateTrackCurrentTime: assign({
      currentTime: (c, e) => e.payload.currentTime
    }),
    selectNextTrack: send(context => ({
      type: "SELECT_TRACK",
      payload: {
        index: bound(context.tracks.length - 1, 0)(context.currentTrack + 1)
      }
    })),
    selectPrevTrack: send(context => ({
      type: "SELECT_TRACK",
      payload: {
        index: bound(context.tracks.length - 1, 0)(context.currentTrack - 1)
      }
    })),
    selectNextTrackWrapped: send(context => ({
      type: "SELECT_TRACK",
      payload: {
        index:
          context.currentTrack === context.tracks.length - 1
            ? 0
            : context.currentTrack + 1
      }
    })),
    selectPrevTrackWrapped: send(context => ({
      type: "SELECT_TRACK",
      payload: {
        index:
          context.currentTrack === 0
            ? context.tracks.length - 1
            : context.currentTrack - 1
      }
    })),
    skip10: send((context, event) => ({
      type: "SEEK",
      payload: {
        toTime: (context.currentTime += 10 * (event.payload.forward ? 1 : -1))
      }
    })),
    shufflePlaylist: assign(context => {
      const currentId = context.tracks[context.currentTrack].id;
      const result = {
        ...context,
        originalTracks: [...context.tracks]
      };
      shuffleArray(result.tracks);
      result.currentTrack = result.tracks.findIndex(e => e.id === currentId);
      return result;
    }),
    unshufflePlaylist: assign(context => {
      const { originalTracks, tracks, currentTrack } = context;
      const itemsToAppend = tracks.filter((_, i) => i >= originalTracks.length);
      const currentId = tracks[currentTrack].id;
      const restoredOriginal = originalTracks.concat(itemsToAppend);
      const result = {
        ...context,
        originalTracks: [],
        tracks: restoredOriginal,
        currentTrack: restoredOriginal.findIndex(e => e.id === currentId)
      };
      return result;
    })
  },
  services: {
    metadataExtractor,
    playAttempt: context => {
      return context.tracks[context.currentTrack].audioElem.play();
    },
    playingProcess: context => cb => {
      const { tracks, currentTrack } = context;
      const { audioElem } = tracks[currentTrack];
      const trackTimeCallback = event => {
        cb({
          type: "UPDATE_TIME",
          payload: {
            currentTime: event.target.currentTime
          }
        });
        if (event.target.ended) {
          cb("END");
        }
      };

      audioElem.addEventListener("timeupdate", trackTimeCallback);

      return () => {
        audioElem.removeEventListener("timeupdate", trackTimeCallback);
        audioElem.pause();
      };
    },
    loadBinaryData: context =>
      new Promise((resolve, reject) => {
        const { tracks, currentTrack } = context;
        // attempt to read file
        try {
          const src = URL.createObjectURL(tracks[currentTrack].file);
          const audioElem = new Audio(src);

          audioElem.addEventListener("canplaythrough", () => {
            resolve({
              audioElem,
              src
            });
          });
        } catch (error) {
          reject(error);
        }
      })
  },
  guards: {
    hasMultipleTracks: context => {
      return context.tracks.length > 1;
    },
    hasOneTrack: context => {
      return context.tracks.length <= 1;
    },
    isAudioLoaded: context => {
      const { tracks, currentTrack } = context;
      return tracks[currentTrack].audioElem;
    },
    isAudioNotLoaded: context => {
      const { tracks, currentTrack } = context;
      return !tracks[currentTrack].audioElem;
    }
  }
};
export const machine = Machine(statechartsDef, actionsAndServices);

const musicPlayerService = interpret(machine);
export default musicPlayerService;
