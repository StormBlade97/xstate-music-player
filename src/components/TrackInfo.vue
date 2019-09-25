<template>
  <div
    class="box is-shadowless has-background-grey-light track-art"
    :style="{ 'background-image': `url(${imgSrc})` }"
  >
    <div class="progressPositioner">
      <progress
        class="progressBar progress is-primary"
        :value="currentProgress"
        max="100"
        @click="skipTo"
      ></progress>
    </div>
  </div>
</template>
<script>
export default {
  name: "TrackInfo",
  computed: {
    currentProgress() {
      return this.currentState.context.currentProgress * 100;
    },
    imgSrc() {
      const {
        trackOrder,
        tracks,
        currentTrackIndex
      } = this.currentState.context;
      const result = tracks[trackOrder[currentTrackIndex]].images[0].url;
      return result;
    }
  },
  methods: {
    skipTo(e) {
      const { left, width } = e.target.getBoundingClientRect();
      const time =
        ((e.clientX - left) / width) *
        this.currentState.context.currentTrackAudioElem.duration;
      this.send({ type: "SKIP_TO", time });
    }
  }
};
</script>
<style lang="scss">
.progressPositioner {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
}
.progressBar {
  width: 100%;
  height: 4px;
}
.track-art {
  width: 400px;
  height: 400px;
  position: relative;
  background-size: cover;
}
</style>
