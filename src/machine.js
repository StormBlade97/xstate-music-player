import { Machine, interpret, send, assign } from "xstate";

export const musicPlayer = Machine(
  {
    id: "player",
    context: {
      tracks: [],
      currentTrackIndex: 0,
      currentTrackAudioElem: null,
      currentProgress: 0
    },
    type: "parallel",
    states: {
      playback: {
        initial: "paused",
        states: {
          playbackRequested: {
            invoke: {
              src: context => context.currentTrackAudioElem.play(),
              onDone: {
                target: "playing"
              },
              onError: {
                target: "paused"
              }
            }
          },
          playing: {
            exit: "pause",
            invoke: {
              id: "playing",
              src: context => callback => {
                context.currentTrackAudioElem.onended = () => {
                  callback({ type: "END" });
                };
                context.currentTrackAudioElem.ontimeupdate = ev => {
                  callback({
                    type: "UPDATE_PROGRESS",
                    progress: ev.target.currentTime / ev.target.duration
                  });
                };
                return () => {
                  context.currentTrackAudioElem.onended = null;
                  context.currentTrackAudioElem.ontimeupdate = null;
                };
              }
            },
            on: {
              PAUSE: "paused",
              END: {
                target: "paused",
                actions: ["resetPos"]
              },
              SELECT_TRACK: {
                target: "playbackRequested",
                actions: "updateCurrentTrack"
              },
              UPDATE_PROGRESS: {
                actions: "updateProgress"
              }
            }
          },
          paused: {
            on: {
              PLAY: { target: "playbackRequested", cond: "canPlay" },
              SELECT_TRACK: {
                target: "playbackRequested",
                actions: "updateCurrentTrack"
              }
            }
          }
        }
      },
      repeat: {
        initial: "noRepeat",
        states: {
          noRepeat: {
            on: {
              TOGGLE_REPEAT: {
                target: "once",
                actions: "enableLoop",
                cond: "canPlay"
              }
            }
          },
          once: {
            on: {
              TOGGLE_REPEAT: {
                target: "noRepeat",
                actions: "disableLoop"
              }
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
      },
      upload: {
        initial: "idle",
        states: {
          idle: {
            on: {
              UPLOAD_TRACK: "inserting"
            }
          },
          inserting: {
            invoke: {
              id: "loadMoreTrack",
              src: "loadSongService",
              onDone: {
                target: "idle",
                actions: [
                  "updateTracks",
                  send({
                    type: "SELECT_TRACK",
                    index: 0
                  })
                ]
              },
              onError: {
                target: "idle"
              }
            }
          }
        }
      }
    }
  },
  {
    actions: {
      updateProgress: assign({
        currentProgress: (context, event) => event.progress
      }),
      enableLoop: context => (context.currentTrackAudioElem.loop = true),
      disableLoop: context => (context.currentTrackAudioElem.loop = false),
      resetPos: context => {
        context.currentTrackAudioElem.currentTime = 0;
      },
      pause: context => {
        context.currentTrackAudioElem.pause();
      },
      updateTracks: assign({
        tracks: (context, event) => {
          return context.tracks.concat(event.data);
        }
      }),
      updateCurrentTrack: assign({
        currentTrackIndex: (context, event) => event.index,
        currentTrackAudioElem: (context, event) => {
          const { audioElement } = context.tracks[event.index];
          return audioElement;
        }
      })
    },
    guards: {
      canPlay: context => {
        const result =
          context.currentTrackAudioElem &&
          context.currentTrackAudioElem.readyState === 4;
        return result;
      }
    },
    services: {
      loadSongService: (context, event) =>
        new Promise((resolve, reject) => {
          try {
            let tracks = [];
            const files = event.files;
            for (let i = 0; i < files.length; i++) {
              const file = files.item(i);
              const url = URL.createObjectURL(file);

              const newAudioElem = new Audio(url);
              tracks.push({
                name: file.name,
                src: url,
                audioElement: newAudioElem
              });
            }
            resolve(tracks);
          } catch (error) {
            reject(error);
          }
        })
    }
  }
);
export const musicPlayingService = interpret(musicPlayer);
