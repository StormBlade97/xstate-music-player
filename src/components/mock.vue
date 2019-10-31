<template>
  <div
    v-if="this.$store.state.currentState.matches('main.ready')"
    class="buttonBar"
  >
    <!-- styles and layout parent tags -->
    <div class="playPauseButton">
      <button
        class="button"
        v-if="this.$store.state.currentState.matches('main.ready.paused')"
      >
        <!-- paused icon -->
        <span class="icon">
          <i class="bx bx-pause"></i>
        </span>
      </button>
      <button
        class="button"
        v-if="this.$store.state.currentState.matches('main.ready.playing')"
      >
        <!-- play icon -->
        <span class="icon">
          <i class="bx bx-play"></i>
        </span>
      </button>
    </div>
    <!-- close tags -->
  </div>
</template>
