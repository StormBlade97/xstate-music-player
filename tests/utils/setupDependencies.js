import Vuex from "vuex";
import { machine } from "@/machineReplacement";
import { interpret } from "xstate";
import { machineMixin } from "@/main";

let intepreter = interpret(machine);

export function setup(VueInstance) {
  VueInstance.use(Vuex);
  VueInstance.use(machineMixin);

  const store = new Vuex.Store({
    state: {
      currentState: intepreter.initialState
    },
    actions: {
      sendEvent(ctx, event) {
        intepreter.send(event);
      }
    },
    mutations: {
      updateState(state, payload) {
        state.currentState = payload;
      }
    }
  });
  intepreter
    .onTransition(state => {
      store.commit("updateState", state);
    })
    .start();

  return store;
}
export function cleanup() {
  intepreter.stop();
}
