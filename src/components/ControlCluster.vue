<template>
  <div class="box is-shadowless is-radiusless">
    <div class="container level">
      <div class="level-item">
        <div class="buttons">
          <button
            class="button is-borderless is-rounded is-transparent"
            @click="() => this.send('PREV')"
          >
            <span class="icon is-large">
              <i class="bx bx-skip-previous bx-sm"></i>
            </span>
          </button>
          <div v-if="this.currentState.matches('main.ready.playback.playable')">
            <button
              v-if="
                this.currentState.matches(
                  'main.ready.playback.playable.playing'
                )
              "
              class="button is-medium is-borderless is-rounded has-background-gradient has-neon-shadow has-text-white"
              @click="() => this.send('PAUSE')"
            >
              <span class="icon is-size-5">
                <i class="bx bx-pause bx-md"></i>
              </span>
            </button>

            <button
              v-else
              class="button is-medium is-borderless is-rounded has-background-gradient has-neon-shadow is-primary"
              @click="() => this.send('PLAY')"
            >
              <span class="icon is-size-5">
                <i class="bx bx-play bx-md"></i>
              </span>
            </button>
          </div>
          <button
            v-if="
              this.currentState.matches('main.ready.playback.loadingAudioData')
            "
            class="button is-medium is-borderless is-rounded is-dark anchor is-clipped"
          >
            <div ckass="is-marginless">
              <div
                class="is-marginless is-overlay loading-swiper has-translation-animation"
              ></div>
              <span class="icon is-marginless">
                <i class="bx bxs-hourglass"></i>
              </span>
            </div>
          </button>
          <button
            v-if="this.currentState.matches('main.ready.playback.loadFailed')"
            class="button is-medium is-borderless is-rounded is-danger is-primary"
            @click="() => this.send('RETRY_LOAD_BINARY')"
          >
            <span class="icon is-size-5">
              <i class="bx bx-redo"></i>
            </span>
          </button>
          <button
            class="button is-borderless is-transparent is-rounded"
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
            class="button is-borderless is-rounded is-transparent"
            @click="
              () => this.send({ type: 'SKIP_TEN', payload: { forward: false } })
            "
          >
            <span class="icon">
              <i class="bx bx-rewind bx-sm"></i>
            </span>
          </button>
          <button
            class="button is-borderless is-rounded is-transparent is-relative"
            @click="
              () => this.send({ type: 'SKIP_TEN', payload: { forward: true } })
            "
          >
            <span class="icon">
              <i class="bx bx-fast-forward bx-sm"></i>
            </span>
          </button>
          <button
            class="button is-borderless is-rounded is-transparent"
            :class="{
              'has-text-gradient has-neon-shadow-text': currentState.matches(
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
            class="button is-borderless is-rounded is-transparent"
            :class="{
              'has-text-gradient has-neon-shadow-text':
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

.grow-2 {
  flex-grow: 2;
  flex-shrink: 1;
  flex-basis: 50%;
}
.button {
  border: none !important;
  outline: transparent !important;
  transition: all 0.5s;
}
.button:hover {
  transform: scale(1.2);
}
</style>
