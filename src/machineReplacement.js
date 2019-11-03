import { Machine, interpret, assign, spawn, send } from "xstate";
import loadNewTrackService from "./services/audio";
import { bound } from "@/util";

const statechartsDef = {
  id: "musicPlayer",
  context: {
    tracks: [],
    currentTrack: 0,
    currentTime: 0
  },
  type: "parallel",
  states: {
    uploadable: {
      on: {
        UPLOAD_TRACK: {
          actions: "loadNewTrack"
        },
        CHILD_UPDATE: {
          actions: "updateTrackInfo"
        },
        LOAD_TRACK_SUCCESS: {
          actions: "uploadFinalization"
        }
      }
    },
    main: {
      initial: "empty",
      states: {
        empty: {
          on: {
            LOAD_TRACK_SUCCESS: "ready"
          }
        },
        ready: {
          type: "parallel",
          states: {
            playback: {
              initial: "paused",
              on: {
                SELECT_TRACK: {
                  target: ".paused",
                  actions: ["resetToZero", "setSelectedTrack", send("PLAY")]
                },
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
              initial: "noShuffle",
              states: {
                enabled: {
                  on: {
                    TOGGLE_SHUFFLE: "noShuffle"
                  }
                },
                noShuffle: {
                  on: {
                    TOGGLE_SHUFFLE: "enabled"
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
    loadNewTrack: assign({
      tracks: (context, event) => {
        const { fileArray } = event.payload;
        const newTracks = fileArray
          .filter(e1 => !context.tracks.find(e2 => e2.id === e1.name))
          .map(fileRef => {
            const id = fileRef.name;
            return {
              childProcess: spawn(loadNewTrackService(fileRef, id)),
              id
            };
          });
        const result = context.tracks.concat(newTracks);
        return result;
      }
    }),
    updateTrackInfo: assign({
      tracks: (context, event) => {
        const { payload } = event;
        const foundIndex = context.tracks.findIndex(
          elem => elem.id === payload.id
        );
        if (foundIndex !== -1) {
          context.tracks.splice(foundIndex, 1, {
            ...context.tracks[foundIndex],
            ...payload
          });
          return context.tracks;
        } else {
          console.error(
            `Failed to handle event UPDATE_CHILDREN. Reason: TRACK_NOT_FOUND / trackID: ${payload.id}`
          );
        }
      }
    }),
    uploadFinalization: (context, event) => {
      const { id } = event.payload;
      const target = context.tracks.find(elem => elem.id === id);
      if (target) {
        target.childProcess.stop();
      } else {
        console.error(`Failed to clean up track upload process`);
      }
    },
    setSelectedTrack: assign({
      currentTrack: (context, event) => {
        return event.payload.index;
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

        tracks[currentTrack].audioElem.currentTime = dest;
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
    }))
  },
  services: {
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
    }
  },
  guards: {
    hasMultipleTracks: context => {
      return context.tracks.length > 1;
    },
    hasOneTrack: context => {
      return context.tracks.length <= 1;
    }
  }
};
export const machine = Machine(statechartsDef, actionsAndServices);

const musicPlayerService = interpret(machine);
export default musicPlayerService;
