import { Machine, assign, sendParent } from "xstate";
import axios from "axios";
export const definition = {
  id: "enrichmentMachine",
  context: {
    trackId: "",
    query: "",
    matches: [],
    errorMessage: null,
    errorCode: null,
    selected: null,
    selectedDetail: null
  },
  type: "parallel",
  states: {
    retrieveMatches: {
      initial: "searchingMatches",
      states: {
        resolved: {
          on: {
            GET_SPOTIFY_MATCH: {
              target: "searchingMatches",
              actions: "saveQuery"
            }
          },
          states: {
            confirmable: {
              on: {
                CONFIRM_MATCH: {
                  target: "confirmed",
                  actions: ["saveSelection"]
                }
              }
            },
            failed: {
              on: {}
            },
            confirmed: {
              entry: ["notifyMatchConfirmation"]
            }
          }
        },
        searchingMatches: {
          invoke: {
            id: "h",
            src: "fetchSpotifyTrackService",
            onDone: {
              target: "resolved.confirmable",
              actions: "saveResponse"
            },
            onError: {
              target: "resolved.failed",
              actions: "logError"
            }
          }
        }
      }
    },
    matchDetailedData: {
      initial: "idle",
      states: {
        idle: {
          on: {
            CONFIRM_MATCH: "fetchable"
          }
        },
        fetchable: {
          initial: "fetchingMatchDetails",

          on: {
            CONFIRM_MATCH: {
              target: "fetchable",
              internal: false
            }
          },
          states: {
            fetchingMatchDetails: {
              after: {
                5000: "failed"
              },
              invoke: {
                src: "fetchMoreTrackInfo",
                onDone: {
                  target: "done",
                  actions: "saveMatchDetails"
                },
                onError: {
                  target: "failed"
                }
              }
            },
            failed: {
              on: {
                RETRY_FETCH_MATCH_DETAILS: {
                  target: "fetchingMatchDetails"
                }
              }
            },
            done: {
              entry: "notifyMatchDetailReceived"
            }
          }
        }
      }
    }
  }
};

const servicesAndActions = {
  guards: {
    hasMatches: context => context.matches.length > 0,
    hasNoMatches: context => context.matches.length == 0
  },
  actions: {
    saveQuery: assign({
      query: (context, event) => event.payload.query.trim()
    }),
    saveResponse: assign({
      matches: (context, event) => event.data.data
    }),
    logError: assign({
      errorMessage: (context, event) => event.data.response.data.message,
      errorCode: (context, event) => event.data.response.status
    }),
    saveSelection: assign({
      selected: (context, event) => {
        return event.payload.index;
      }
    }),
    decrementRetryCounter: assign({
      automaticRetryLeft: context => context.automaticRetryLeft - 1
    }),
    saveMatchDetails: assign({
      selectedDetail: (c, event) => event.data.data
    }),
    notifyMatchConfirmation: sendParent("RECEIVE_MATCH_CONFIRMATION"),
    notifyMatchDetailReceived: sendParent("RECEIVE_MATCH_DETAIL")
  },
  services: {
    fetchSpotifyTrackService: context =>
      axios.get(`/search?q=${context.query}`),
    fetchMoreTrackInfo: context => {
      console.log(context.matches.map(m => m.name), context.selected);
      axios.get(`/enrichment?q=${context.matches[context.selected].id}`);
    }
  }
};

const getMachineWithContext = context => {
  const enrichmentMachine = Machine(definition, servicesAndActions).withContext(
    {
      ...definition.context,
      ...context
    }
  );
  return enrichmentMachine;
};

export default getMachineWithContext;
