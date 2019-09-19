import { Machine, interpret, assign } from "xstate";

const musicPlayer = Machine(
  {
    id: "player",
    context: {
      playbackSpeed: 1,
      tracks: [1, 2, 3, 4, 5],
      currentTrackIndex: 1,
      repeatTogglePattern: ["none", "once", "all"]
    },
    type: "parallel",
    states: {
      playback: {
        initial: "stopped",
        states: {
          playing: {
            initial: "normal",
            on: {
              PAUSE: "paused",
              STOP: "stopped",
              PLAY: {
                target: ".normal",
                actions: "resetSpeed"
              }
            },
            states: {
              normal: {
                on: {
                  FAST_FWD: "fastfwd",
                  BACKWARD: "backward"
                }
              },
              fastfwd: {
                on: {
                  FAST_FWD: {
                    internal: false,
                    actions: "changePlaybackSpeed",
                    cond: "canScalePlaybackSpeed"
                  },
                  BACKWARD: {
                    target: "backward"
                  }
                }
              },
              backward: {
                on: {
                  BACKWARD: {
                    internal: false,
                    actions: "changePlaybackSpeed",
                    cond: { type: "canScalePlaybackSpeed" }
                  },
                  FAST_FWD: {
                    target: "fastfwd"
                  }
                }
              }
            }
          },
          paused: {
            on: {
              PLAY: "playing",
              STOP: "stopped"
            }
          },
          stopped: {
            on: {
              PLAY: "playing"
            }
          }
        }
      },
      repeat: {
        initial: "noRepeat",
        states: {
          noRepeat: {
            on: {
              TOGGLE_REPEAT: "once"
            }
          },
          once: {
            on: {
              TOGGLE_REPEAT: "noRepeat"
            }
          }
        }
      },
      shuffle: {
        initial: "off",
        states: {
          on: {
            on: {
              TOGGLE_SHUFFLE: "off"
            }
          },
          off: {
            on: {
              TOGGLE_SHUFFLE: "on"
            }
          }
        }
      }
    }
  },
  {
    actions: {
      changePlaybackSpeed: assign({
        playbackSpeed: context => {
          return context.playbackSpeed < 1
            ? 1
            : (context.playbackSpeed += 0.25);
        }
      }),
      resetSpeed: assign({ playbackSpeed: () => 1 })
    },
    guards: {
      canScalePlaybackSpeed: context => {
        return !(context.playbackSpeed >= 2 || context.playbackSpeed <= 0.25);
      }
    }
  }
);

const musicPlayingService = interpret(musicPlayer);

export { musicPlayer, musicPlayingService };
