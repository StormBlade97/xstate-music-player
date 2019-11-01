import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "@/store/store";

Vue.config.productionTip = false;
export const machineMixin = {
  computed: {
    currentState() {
      return this.$store.state.currentState;
    }
  },
  methods: {
    send(event) {
      this.$store.dispatch("sendEvent", event);
    }
  }
};

Vue.mixin(machineMixin);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
