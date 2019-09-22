<template>
  <div>
    <div v-if="hasTrack" class="columns is-vcentered">
      <div class="column is-two-fifth">
        <TrackInfo v-if="hasSelectedTrack"></TrackInfo>
      </div>
      <div class="column">
        <TrackList />
      </div>
    </div>
    <UploadSound v-else></UploadSound>
  </div>
</template>
<script>
import UploadSound from "@/components/UploadSound.vue";
import TrackList from "@/components/TrackList.vue";
import TrackInfo from "@/components/TrackInfo.vue";

export default {
  name: "Player",
  components: {
    UploadSound,
    TrackList,
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
