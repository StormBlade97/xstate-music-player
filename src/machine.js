import { Machine, interpret, send, assign } from "xstate";
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
export const musicPlayer = Machine(
  {
    id: "player",
    context: {
      tracks: [],
      trackOrder: [],
      currentTrackIndex: 0,
      currentTrackAudioElem: null,
      prevTrackIndex: 0,
      nextTrackIndex: 1,
      currentProgress: 0
    },
    type: "parallel",
    states: {
      playback: {
        initial: "paused",
        states: {
          playbackRequested: {
            invoke: {
              src: context => {
                return context.currentTrackAudioElem.play();
              },
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
              TOGGLE_PLAYBACK: "paused",
              END: {
                target: "paused",
                actions: ["resetPos"]
              },
              SELECT_TRACK: {
                target: "playbackRequested",
                actions: ["pause", "selectTrack"]
              },
              UPDATE_PROGRESS: {
                actions: "updateProgress"
              }
            }
          },
          paused: {
            on: {
              PLAY: { target: "playbackRequested", cond: "canPlay" },
              TOGGLE_PLAYBACK: { target: "playbackRequested", cond: "canPlay" },
              SELECT_TRACK: {
                target: "playbackRequested",
                actions: "selectTrack"
              },
              SELECT_DEFAULT_TRACK: {
                target: "playbackRequested",
                actions: "selectTrack"
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
                cond: "canPlay"
              }
            }
          },
          once: {
            on: {
              TOGGLE_REPEAT: {
                target: "transitingToAll"
              },
              NEXT: {
                actions: send(context => ({
                  type: "SELECT_TRACK",
                  index: context.currentTrackIndex
                }))
              },
              PREV: {
                actions: send(context => ({
                  type: "SELECT_TRACK",
                  index: context.currentTrackIndex
                }))
              }
            }
          },
          transitingToAll: {
            on: {
              "": [
                {
                  target: "all",
                  cond: "hasMultipleTrack"
                },
                {
                  target: "noRepeat",
                  cond: "hasSingleTrack"
                }
              ]
            }
          },
          all: {
            on: {
              TOGGLE_REPEAT: {
                target: "noRepeat"
              },
              NEXT: {
                actions: [
                  send(context => ({
                    type: "SELECT_TRACK",
                    index: context.nextTrackIndex
                  })),
                  assign({
                    nextTrackIndex: context => {
                      const result =
                        context.currentTrackIndex >= context.tracks.length - 1
                          ? 0
                          : context.currentTrackIndex + 1;
                      return result;
                    },
                    prevTrackIndex: context =>
                      context.currentTrackIndex < 0
                        ? context.tracks.length - 1
                        : context.currentTrackIndex - 1
                  })
                ]
              },
              PREV: {
                actions: [
                  send(context => ({
                    type: "SELECT_TRACK",
                    index: context.prevTrackIndex
                  })),
                  assign({
                    nextTrackIndex: context =>
                      context.currentTrackIndex >= context.tracks.length - 1
                        ? 0
                        : context.currentTrackIndex + 1,
                    prevTrackIndex: context =>
                      context.currentTrackIndex < 0
                        ? context.tracks.length - 1
                        : context.currentTrackIndex - 1
                  })
                ]
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
              TOGGLE_SHUFFLE: {
                target: "off"
                // actions: "remapIndexes"
              }
            }
          },
          off: {
            on: {
              TOGGLE_SHUFFLE: {
                target: "on",
                actions: ["genRandomTrackOrder"],
                cond: "hasMultipleTrack"
              }
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
                actions: ["updateTracks", send("SELECT_DEFAULT_TRACK")]
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
      curse: () => console.log("FUCK!"),
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
        },
        trackOrder: (context, event) => {
          const clone = [...context.trackOrder];
          for (let i = context.trackOrder.length; i < event.data.length; i++) {
            clone.push(i);
          }
          return clone;
        }
      }),
      selectTrack: assign({
        currentTrackIndex: (context, event) => event.index || 0,
        currentTrackAudioElem: (context, event) => {
          if (context.currentTrackAudioElem) {
            context.currentTrackAudioElem.pause();
            context.currentTrackAudioElem.currentTime = 0;
          }
          const { audioElement } = context.tracks[event.index || 0];
          return audioElement;
        }
      }),
      genRandomTrackOrder: assign({
        trackOrder: context => {
          let order = [];
          for (let i = 0; i < context.tracks.length; i++) {
            // eslint-disable-next-line
            while (true) {
              const newPos = getRandomInt(0, context.tracks.length - 1);
              if (order.includes(newPos)) {
                continue;
              } else {
                order.push(newPos);
                break;
              }
            }
          }
          return order;
        }
      }),
      remapIndexes: assign({
        currentTrackIndex: context => {
          const answer = context.trackOrder.indexOf(context.currentTrackIndex);
          return answer;
        },
        prevTrackIndex: context => {
          return context.trackOrder.indexOf[context.prevTrackIndex];
        }
      }),
      mapIndexes: assign({
        currentTrackIndex: context => {
          return context.trackOrder[context.currentTrackIndex];
        },
        prevTrackIndex: context => {
          return context.trackOrder[context.prevTrackIndex];
        },
        nextTrackIndex: context => {
          return context.trackOrder[context.nextTrackIndex];
        }
      })
    },
    guards: {
      canPlay: context => {
        const result =
          context.currentTrackAudioElem &&
          context.currentTrackAudioElem.readyState === 4;
        return result;
      },
      hasMultipleTrack: context => {
        return context.tracks.length > 1;
      },
      hasSingleTrack: context => {
        return context.tracks.length < 2;
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
              if (context.tracks.find(track => track.name === file.name)) {
                continue;
              }
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
