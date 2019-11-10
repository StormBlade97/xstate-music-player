<template>
  <div class="seeker-root">
    <span class="time-mark">{{ parse(value) }}</span>
    <div
      class="main-progress anchor"
      ref="progressBarContainer"
      @mouseenter="showButton"
      @mouseleave="hideButton"
      @mousemove="updatePos"
      @click="updatePosAndSeek"
    >
      <progress
        v-if="currentState.matches('main.ready.playback.playable')"
        :value="value"
        :max="max"
        class="progress seeker-progress is-primary is-marginless"
      ></progress>
      <progress
        v-if="currentState.matches('main.ready.playback.loadingAudioData')"
        class="progress seeker-progress is-marginless"
      ></progress>
      <progress
        v-if="currentState.matches('main.ready.playback.loadFailed')"
        class="progress seeker-progress load-failed is-marginless"
      ></progress>
      <div
        v-if="buttonShown || isAdjusting"
        class="progress-button has-background-grey-light"
        ref="progressButton"
        :style="{ transform: `translateX(calc(-0.25rem + ${delta}px))` }"
        :class="isAdjusting && 'has-background-primary'"
        @mousedown="activateDrag"
        @mouseup="seekTo"
      ></div>
    </div>
    <span class="time-mark">{{ parse(max) }}</span>
  </div>
</template>

<script>
import { parseDuration } from "@/util";
export default {
  data() {
    return {
      buttonShown: false,
      delta: 0,
      isAdjusting: false
    };
  },
  methods: {
    parse: parseDuration,
    getContainerRect() {
      return this.$refs.progressBarContainer.getBoundingClientRect();
    },
    showButton() {
      this.buttonShown = true;
      this.delta = this.progress * this.getContainerRect().width;
    },
    hideButton() {
      this.buttonShown = false;
    },
    activateDrag() {
      this.isAdjusting = true;
    },
    updatePos(event) {
      if (!this.isAdjusting) return;
      const x = event.clientX;
      this.delta = Math.min(
        x - this.getContainerRect().left,
        this.getContainerRect().width
      );
    },
    seekTo() {
      const { width } = this.getContainerRect();
      const dest = (this.delta / width) * this.max;
      this.send({
        type: "SEEK",
        payload: {
          toTime: dest
        }
      });
      this.isAdjusting = false;
    },
    updatePosAndSeek(event) {
      this.isAdjusting = true;
      this.updatePos(event);
      this.seekTo();
    }
  },
  computed: {
    max() {
      const { tracks, currentTrack } = this.currentState.context;
      return tracks[currentTrack].duration;
    },
    value() {
      return this.currentState.context.currentTime;
    },
    progress() {
      return this.value / this.max;
    }
  }
};
</script>

<style lang="scss" scoped>
.seeker-root {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  & > * {
    margin-right: 1rem;
  }
}
.main-progress {
  padding: 0.5rem 0;
  width: 100%;
}
.progress-button {
  width: 1rem;
  height: 1rem;
  position: absolute;
  border-radius: 100%;
  left: 0;
  top: 0.2rem;
}
.seeker-progress {
  height: 4px !important;
}
.time-mark {
  margin: 0 1rem;
}
.load-failed {
  opacity: 0.3;
}
</style>
