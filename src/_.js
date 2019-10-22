// const machine = Machine({
//   id: "musicPlayer",
//   type: "parallel",
//   states: {
//     upload: {
//       initial: "idle",
//       states: {
//         idle: {
//           on: {
//             LOAD: "loading"
//           }
//         },
//         loading: {
//           on: {
//             LOAD_SUCCESS: "idle",
//             LOAD_ERROR: "loading"
//           }
//         }
//       }
//     },
//     main: {
//       initial: "noTrack",
//       states: {
//         noTrack: {
//           on: {
//             LOAD_SUCCESS: "ready"
//           }
//         },
//         ready: {
//           type: "parallel",
//           entry: "selectDefault",
//           on: {
//             SELECT_TRACK: {
//               target: "ready",
//               actions: "setSelectedTrack"
//             }
//           },
//           states: {
//             playback: {
//               initial: "paused",
//               states: {
//                 paused: {
//                   on: {
//                     PLAY: {
//                       target: "attemptingPlay",
//                       actions: "play"
//                     }
//                   }
//                 },
//                 attemptingPlay: {
//                   on: {
//                     "": [
//                       {
//                         target: "playing",
//                         cond: "isPlaying"
//                       },
//                       {
//                         target: "paused",
//                         cond: "isNotPlaying"
//                       }
//                     ]
//                   }
//                 },
//                 playing: {
//                   on: {
//                     PAUSE: {
//                       target: "paused",
//                       actions: "pause"
//                     },
//                     END: {
//                       target: "paused",
//                       actions: ["pause", "resetToTrack"]
//                     }
//                   }
//                 }
//               }
//             },
//             repeat: {
//               initial: "off",
//               states: {
//                 off: {
//                   on: {
//                     TOGGLE_REPEAT: "once"
//                   }
//                 },
//                 once: {
//                   on: {
//                     TOGGLE_REPEAT: [
//                       {
//                         target: "all",
//                         cond: "hasMultipleTracks"
//                       },
//                       {
//                         target: "off",
//                         cond: "hasOneTrack"
//                       }
//                     ],
//                     NEXT: {
//                       target: "once",
//                       actions: ["resetToZero", "play"]
//                     },
//                     PREV: {
//                       target: "once",
//                       actions: ["resetToZero", "play"]
//                     },
//                     END: {
//                       target: "once",
//                       actions: ["resetToZero", "play"]
//                     }
//                   }
//                 },
//                 all: {
//                   on: {
//                     TOGGLE_REPEAT: {
//                       target: "off"
//                     },
//                     NEXT: {
//                       target: "all",
//                       actions: ["selectNextTrack", "play"]
//                     },
//                     PREV: {
//                       target: "all",
//                       actions: ["selectPrevTrack", "play"]
//                     },
//                     END: {
//                       target: "all",
//                       actions: ["selectNextTrack", "play"]
//                     }
//                   }
//                 }
//               }
//             },
//             shuffle: {
//               initial: "noShuffle",
//               states: {
//                 enabled: {
//                   on: {
//                     TOGGLE_SHUFFLE: "noShuffle"
//                   }
//                 },
//                 noShuffle: {
//                   on: {
//                     TOGGLE_SHUFFLE: "enabled"
//                   }
//                 }
//               }
//             }
//           }
//         }
//       }
//     }
//   }
// });
