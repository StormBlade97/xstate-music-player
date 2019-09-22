<template>
  <div class="box is-shadowless has-background-grey-light track-art">
    <progress
      class="progressBar progress is-primary"
      :value="currentProgress"
      max="100"
    ></progress>
  </div>
</template>
<script>
export default {
  name: "TrackInfo",
  computed: {
    currentProgress() {
      return this.currentState.context.currentProgress * 100;
    }
  }
};
</script>
<style lang="scss">
.progressBar {
  width: 100%;
  border-radius: 4px;
  position: absolute;
  bottom: 0;
  left: 0;
  height: 4px;
}
.track-art {
  width: 400px;
  height: 400px;
  position: relative;
}
</style>
