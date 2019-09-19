<template>
  <div class="bar-container box is-shadowless">
    <div class="field is-grouped is-grouped-multiline">
      <div class="control">
        <div class="field has-addons">
          <p class="control">
            <a
              class="button is-medium"
              :class="{
                'is-primary': this.currentState.matches('playback.playing')
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
          <p class="control">
            <a
              class="button is-medium"
              :class="{
                'is-primary': this.currentState.matches('playback.stopped')
              }"
              @click="() => this.send('STOP')"
            >
              <span class="icon">
                <i class="bx bx-stop"></i>
              </span>
            </a>
          </p>
        </div>
      </div>

      <div class="control">
        <div class="field has-addons">
          <p class="control">
            <a class="button is-medium">
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
              @click="() => this.send('BACKWARD')"
            >
              <span class="icon">
                <i class="bx bx-rewind"></i>
              </span>
            </a>
          </p>
          <p class="control">
            <a
              class="button is-medium"
              :class="{
                'is-primary': currentState.matches('playback.playing.fastfwd')
              }"
              @click="() => this.send('FAST_FWD')"
            >
              <span class="icon">
                <i class="bx bx-fast-forward"></i>
              </span>
            </a>
          </p>
          <p class="control">
            <a class="button is-medium">
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
              :class="{ 'is-primary': currentState.matches('repeat.once') }"
              @click="() => this.send('TOGGLE_REPEAT')"
            >
              <span class="icon">
                <i class="bx bx-repeat"></i>
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
.bar-container {
  display: flex;
  align-items: center;
}
</style>
