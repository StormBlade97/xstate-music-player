<template>
  <div v-if="this.currentState.matches('ready')">
    <TrackInfo v-if="hasSelectedTrack"></TrackInfo>
  </div>
</template>
<script>
import TrackInfo from "@/components/TrackInfo.vue";

export default {
  name: "Player",
  components: {
    TrackInfo
  },
  computed: {
    hasTrack() {
      return this.currentState.context.tracks.length > 0;
    },
    hasSelectedTrack() {
      return this.currentState.context.currentTrackAudioElem;
    }
  }
};
</script>

<style>
.placeholder {
  width: 40vh;
  height: 40vh;
}
</style>
