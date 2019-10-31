import Vuex from "vuex";
import Vue from "vue";
import musicPlayerService from "@/machineReplacement.js";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    currentState: musicPlayerService.initialState
  },
  actions: {
    sendEvent(ctx, event) {
      musicPlayerService.send(event);
    }
  },
  mutations: {
    updateState(state, payload) {
      state.currentState = payload;
    }
  }
});

musicPlayerService
  .onTransition((state, event) => {
    console.log(state);
    console.log(event);
    store.commit("updateState", state);
  })
  .start();

export default store;
