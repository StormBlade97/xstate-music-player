import { Machine, assign, sendParent } from "xstate";
import axios from "axios";
export const definition = {
  id: "enrichmentMachine",
  context: {
    id: "",
    query: "",
    matches: [],
    errorMessage: null,
    errorCode: null,
    selected: null,
    selectedDetail: null
  },
  initial: "searchingMatches",
  on: {
    GET_SPOTIFY_MATCH: {
      target: "searchingMatches",
      actions: "saveQuery"
    },
    RESTART_ENRICHMENT: {
      target: "searchingMatches"
    }
  },
  states: {
    searchingMatches: {
      invoke: {
        id: "h",
        src: "fetchSpotifyTrackService",
        onDone: {
          target: "confirmable",
          actions: "saveResponse"
        },
        onError: {
          target: "searchMatchesFailed",
          actions: "logError"
        }
      }
    },
    confirmable: {
      on: {
        CONFIRM_MATCH: {
          target: "fetchingMatchDetails",
          actions: ["saveSelection", "notifyMatchConfirmation"]
        }
      }
    },
    searchMatchesFailed: {
      on: {}
    },
    // confirmed: {
    //   entry: ["notifyMatchConfirmation"],
    //   after: {
    //     1000: "fetchingMatchDetails"
    //   }
    // },
    fetchingMatchDetails: {
      after: {
        5000: "fetchMatchDetailsFailed"
      },
      invoke: {
        id: "s",
        src: "fetchMoreTrackInfo",
        onDone: {
          target: "fetchMatchDetailsDone",
          actions: ["saveMatchDetails"]
        },
        onError: {
          target: "fetchMatchDetailsFailed"
        }
      }
    },
    fetchMatchDetailsFailed: {
      on: {
        RETRY_FETCH_MATCH_DETAILS: {
          target: "fetchingMatchDetails"
        }
      }
    },
    fetchMatchDetailsDone: {
      entry: "notifyMatchDetailReceived"
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
      query: (context, event) => event.payload.query
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
    notifyMatchConfirmation: sendParent(context => ({
      type: "RECEIVE_MATCH_CONFIRMATION",
      payload: {
        context
      }
    })),
    notifyMatchDetailReceived: sendParent(context => ({
      type: "RECEIVE_MATCH_DETAIL",
      payload: {
        context
      }
    }))
  },
  services: {
    fetchSpotifyTrackService: context =>
      axios.get(`/search?q=${context.query}`),
    fetchMoreTrackInfo: async context => {
      const s = await axios.get(
        `/enrichment?trackId=${context.matches[context.selected].spotifyId}`
      );
      return s;
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
