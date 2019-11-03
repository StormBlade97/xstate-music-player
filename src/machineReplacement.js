import { Machine, interpret, assign, spawn, send } from "xstate";
import loadNewTrackService from "./services/audio";

const statechartsDef = {
  id: "musicPlayer",
  context: {
    tracks: [],
    currentTrack: 0,
    currentTime: 0
  },
  initial: "empty",
  on: {
    UPLOAD_TRACK: {
      actions: "loadNewTrack",
      cond: "trackNotExist"
    },
    CHILD_UPDATE: {
      actions: "updateTrackInfo"
    },
    LOAD_TRACK_SUCCESS: {
      actions: "uploadFinalization"
    }
  },
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
              actions: ["setSelectedTrack", send("PLAY")]
            },
            SEEK: {
              actions: "seekTo"
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
                TOGGLE_REPEAT: "once"
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
                  target: "once",
                  actions: ["resetToZero", "play"]
                },
                PREV: {
                  target: "once",
                  actions: ["resetToZero", "play"]
                },
                END: {
                  target: "once",
                  actions: ["resetToZero", "play"]
                }
              }
            },
            all: {
              on: {
                TOGGLE_REPEAT: {
                  target: "off"
                },
                NEXT: {
                  target: "all",
                  actions: ["selectNextTrack", "play"]
                },
                PREV: {
                  target: "all",
                  actions: ["selectPrevTrack", "play"]
                },
                END: {
                  target: "all",
                  actions: ["selectNextTrack", "play"]
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
};

export const actionsAndServices = {
  actions: {
    loadNewTrack: assign({
      tracks: (context, event) => {
        const { fileArray } = event.payload;
        const newTracks = fileArray.map(fileRef => {
          const id = fileRef.name;
          return {
            childProcess: spawn(loadNewTrackService(fileRef, id)),
            id
          };
        });
        return context.tracks.concat(newTracks);
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
      currentTrack: (context, event) => event.payload.index
    }),
    pauseTrack: context => {
      const { tracks, currentTrack } = context;
      tracks[currentTrack].audioElem.pause();
    },
    seekTo: assign({
      currentTime: (context, event) => {
        const { tracks, currentTrack } = context;
        tracks[currentTrack].audioElem.currentTime = event.payload.toTime;
        return event.payload.toTime;
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
    })
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
    trackNotExist: (context, event) => {
      return !context.tracks.find(elem => elem.id === event.payload.id);
    },
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
