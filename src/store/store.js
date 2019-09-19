import Vuex from "vuex";
import Vue from "vue";
import { musicPlayingService } from "@/machine.js";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    currentState: musicPlayingService.initialState
  },
  actions: {
    sendEvent(ctx, event) {
      musicPlayingService.send(event);
    }
  },
  mutations: {
    updateState(state, payload) {
      state.currentState = payload;
    }
  }
});

musicPlayingService
  .onTransition(state => {
    store.commit("updateState", state);
  })
  .start();

export default store;
