<template>
  <div class="level box is-shadowless is-radiusless">
    <div class="level-item">
      <div class="buttons">
        <button
          class="button is-borderless is-rounded is-white"
          @click="() => this.send('PREV')"
        >
          <span class="icon is-large">
            <i class="bx bx-skip-previous bx-sm"></i>
          </span>
        </button>
        <button
          v-if="this.currentState.matches('main.ready.playback.playing')"
          class="button is-medium is-borderless is-rounded is-white is-primary"
          @click="() => this.send('PAUSE')"
        >
          <span class="icon is-size-5">
            <i class="bx bx-pause bx-md"></i>
          </span>
        </button>
        <button
          v-else
          class="button is-medium is-borderless is-rounded is-white is-primary"
          @click="() => this.send('PLAY')"
        >
          <span class="icon is-size-5">
            <i class="bx bx-play bx-md"></i>
          </span>
        </button>

        <button
          class="button is-borderless is-white is-rounded"
          @click="() => this.send('NEXT')"
        >
          <span class="icon">
            <i class="bx bx-skip-next bx-sm"></i>
          </span>
        </button>
      </div>
    </div>
    <div class="level-item grow-2">
      <Seeker></Seeker>
    </div>
    <div class="level-item">
      <div class="buttons">
        <button
          class="button is-borderless is-rounded is-white"
          @click="
            () => this.send({ type: 'SKIP_TEN', payload: { forward: false } })
          "
        >
          <span class="icon">
            <i class="bx bx-rewind bx-sm"></i>
          </span>
        </button>
        <button
          class="button is-borderless is-rounded is-white is-relative"
          :class="{
            'is-primary': currentState.matches('playback.playing.fastfwd')
          }"
          @click="
            () => this.send({ type: 'SKIP_TEN', payload: { forward: true } })
          "
        >
          <span class="icon">
            <i class="bx bx-fast-forward bx-sm"></i>
          </span>
        </button>
      </div>
    </div>
    <div class="level-item">
      <div class="buttons">
        <button
          class="button is-borderless is-rounded is-white"
          :class="{
            'has-text-primary': currentState.matches(
              'main.ready.shuffle.enabled'
            )
          }"
          @click="() => this.send('TOGGLE_SHUFFLE')"
        >
          <span class="icon is-size-5">
            <i class="bx bx-shuffle"></i>
          </span>
        </button>
        <button
          class="button is-borderless is-rounded is-white"
          :class="{
            'has-text-primary':
              currentState.matches('main.ready.repeat.once') ||
              currentState.matches('main.ready.repeat.all')
          }"
          @click="() => this.send('TOGGLE_REPEAT')"
        >
          <span class="icon">
            <i
              v-if="!currentState.matches('main.ready.repeat.all')"
              class="bx bx-repeat bx-sm"
            ></i>
            <i v-else class="bx bx-infinite bx-sm"></i>
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Seeker from "@/components/Seeker.vue";
export default {
  name: "ControlCluster",
  components: {
    Seeker
  }
};
</script>
<style lang="scss" scoped>
@import "~bulma/sass/utilities/initial-variables.sass";
.is-borderless {
  border-color: transparent;
}
@keyframes pulse {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.checking {
  border: 1px $red solid !important;
}
.grow-2 {
  flex-grow: 2;
  flex-shrink: 1;
  flex-basis: 50%;
}
</style>
