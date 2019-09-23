<template>
  <div class="bar-container box is-shadowless">
    <div class="field is-grouped is-grouped-multiline">
      <div class="control">
        <div class="field has-addons">
          <p class="control">
            <a
              class="button is-medium is-rounded"
              :class="{
                'is-primary': this.currentState.matches('playback.playing'),
                'is-warning': this.currentState.matches(
                  'playback.playbackRequested'
                )
              }"
              @click="() => this.send('PLAY')"
            >
              <span class="icon">
                <i class="bx bx-play"></i>
              </span>
            </a>
          </p>
          <p class="control">
            <a
              class="button is-medium"
              :class="{
                'is-primary': this.currentState.matches('playback.paused')
              }"
              @click="() => this.send('PAUSE')"
            >
              <span class="icon">
                <i class="bx bx-pause"></i>
              </span>
            </a>
          </p>
        </div>
      </div>

      <div class="control">
        <div class="field has-addons">
          <p class="control">
            <a class="button is-medium" @click="() => this.send('PREV')">
              <span class="icon">
                <i class="bx bx-skip-previous"></i>
              </span>
            </a>
          </p>
          <p class="control">
            <a
              class="button is-medium"
              :class="{
                'is-primary': currentState.matches('playback.playing.backward')
              }"
              @click="() => this.send({ type: 'SKIP_10' })"
            >
              <span class="icon">
                <i class="bx bx-rewind"></i>
              </span>
            </a>
          </p>
          <p class="control">
            <a
              class="button is-medium is-relative"
              :class="{
                'is-primary': currentState.matches('playback.playing.fastfwd')
              }"
              @click="() => this.send({ type: 'SKIP_10', forward: true })"
            >
              <span class="icon">
                <i class="bx bx-fast-forward"></i>
              </span>
            </a>
          </p>
          <p class="control">
            <a class="button is-medium" @click="() => this.send('NEXT')">
              <span class="icon">
                <i class="bx bx-skip-next"></i>
              </span>
            </a>
          </p>
        </div>
      </div>
      <div class="control">
        <div class="field has-addons">
          <p class="control">
            <a
              class="button is-medium"
              :class="{ 'is-primary': currentState.matches('shuffle.on') }"
              @click="() => this.send('TOGGLE_SHUFFLE')"
            >
              <span class="icon">
                <i class="bx bx-shuffle"></i>
              </span>
            </a>
          </p>
          <p class="control">
            <a
              class="button is-medium"
              :class="{
                'is-primary': !currentState.matches('repeat.noRepeat')
              }"
              @click="() => this.send('TOGGLE_REPEAT')"
            >
              <span class="icon">
                <i
                  v-if="!currentState.matches('repeat.all')"
                  class="bx bx-repeat"
                ></i>
                <i v-else class="bx bx-infinite"></i>
              </span>
            </a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "ControlCluster"
};
</script>
<style lang="scss" scoped>
@import "~bulma/sass/utilities/initial-variables.sass";
.bar-container {
  display: flex;
  align-items: center;
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
</style>
