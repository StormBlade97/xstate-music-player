import { Machine, interpret, assign, spawn } from "xstate";
import loadNewTrackService from "./services/audio";

const statechartsDef = {
  id: "musicPlayer",
  context: {
    tracks: [],
    currentTrack: null
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
      entry: ["selectTrack", "play"],
      on: {
        SELECT_TRACK: {
          target: "ready",
          actions: "setSelectedTrack"
        }
      },
      states: {
        playback: {
          initial: "paused",
          states: {
            paused: {
              on: {
                PLAY: {
                  target: "attemptingPlay",
                  actions: "play"
                }
              }
            },
            attemptingPlay: {
              on: {
                "": [
                  {
                    target: "playing",
                    cond: "isPlaying"
                  },
                  {
                    target: "paused",
                    cond: "isNotPlaying"
                  }
                ]
              }
            },
            playing: {
              on: {
                PAUSE: {
                  target: "paused",
                  actions: "pause"
                },
                END: {
                  target: "paused",
                  actions: ["pause", "resetToTrack"]
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
        console.error("Initial update process");
        return context.tracks.concat(newTracks);
      }
    }),
    updateTrackInfo: assign({
      tracks: (context, event) => {
        console.error("Track update");
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
      console.error("This run!");
      const { id } = event.payload;
      const target = context.tracks.find(elem => elem.id === id);
      if (target) {
        target.childProcess.stop();
      } else {
        console.error(`Failed to clean up track upload process`);
      }
    }
  },
  guards: {
    trackNotExist: (context, event) => {
      return !context.tracks.find(elem => elem.id === event.payload.id);
    }
  }
};
export const machine = Machine(statechartsDef, actionsAndServices);

const musicPlayerService = interpret(machine);
export default musicPlayerService;
