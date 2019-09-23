import { Machine, interpret, send, assign } from "xstate";
import { getRandomInt, mapIndex } from "@/util.js";

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
              },
              SKIP_TO: {
                actions: "goToTime"
              },
              SKIP_10: {
                actions: "skip10"
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
              },
              SKIP_TO: {
                actions: "goToTime"
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
              },
              NEXT: {
                cond: "hasNextTrack",
                actions: [
                  send(context => ({
                    type: "SELECT_TRACK",
                    index: context.nextTrackIndex
                  })),
                  assign({
                    nextTrackIndex: context => context.currentTrackIndex + 1,
                    prevTrackIndex: context => context.currentTrackIndex - 1
                  })
                ]
              },
              PREV: {
                cond: "hasPrevTrack",
                actions: [
                  send(context => ({
                    type: "SELECT_TRACK",
                    index: context.prevTrackIndex
                  })),
                  assign({
                    nextTrackIndex: context => context.currentTrackIndex + 1,
                    prevTrackIndex: context => context.currentTrackIndex - 1
                  })
                ]
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
                target: "off",
                actions: "remapIndexes"
              }
            }
          },
          off: {
            on: {
              TOGGLE_SHUFFLE: {
                target: "on",
                actions: ["genRandomTrackOrder", "mapIndexes"],
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
      goToTime: (context, event) => {
        context.currentTrackAudioElem.currentTime = Math.max(
          Math.min(event.time, context.currentTrackAudioElem.duration),
          0
        );
      },
      skip10: (context, event) => {
        const { currentTrackAudioElem } = context;
        const { duration, currentTime } = currentTrackAudioElem;
        let time = 0;
        if (event.forward) {
          time = currentTime + 10;
        } else {
          time = currentTime - 10;
        }
        currentTrackAudioElem.currentTime = Math.max(
          Math.min(time, duration),
          0
        );
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
          const { audioElement } = context.tracks[
            mapIndex(event.index || 0, context.trackOrder)
          ];
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
      mapIndexes: assign({
        currentTrackIndex: context =>
          mapIndex(context.currentTrackIndex, context.trackOrder),
        prevTrackIndex: context => {
          return mapIndex(context.prevTrackIndex, context.trackOrder);
        },
        nextTrackIndex: context => {
          return mapIndex(context.nextTrackIndex, context.trackOrder);
        }
      }),
      remapIndexes: assign({
        currentTrackIndex: context => {
          return context.trackOrder[context.currentTrackIndex];
        },
        prevTrackIndex: context => {
          return context.trackOrder[context.prevTrackIndex];
        },
        nextTrackIndex: context => {
          return context.trackOrder[context.nextTrackIndex];
        },
        trackOrder: context => {
          return context.tracks.map((_, index) => index);
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
      },
      hasNextTrack: context => {
        return context.currentTrackIndex + 1 < context.tracks.length;
      },
      hasPrevTrack: context => {
        return context.currentTrackIndex > 0;
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
