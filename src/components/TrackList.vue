<template>
  <div class="full-width">
    <TrackItem
      class="track-item"
      v-for="(item, index) in trackList"
      :key="index"
      :item="item"
      :isPlaying="checkPlayStatus(item.id)"
      :isActive="activeTrack && activeTrack.id === item.id"
      :index="index"
      :canBePlayed="true"
      @track-selected="selectTrack"
    />
  </div>
</template>
<script>
import TrackItem from "@/components/TrackItem";

export default {
  name: "TrackList",
  components: {
    TrackItem
  },
  methods: {
    selectTrack(index) {
      this.send({
        type: "SELECT_TRACK",
        payload: {
          index
        }
      });
    },
    checkPlayStatus(id) {
      return (
        this.activeTrack.id === id &&
        this.currentState.matches("main.ready.playback.playing")
      );
    }
  },
  computed: {
    trackList() {
      const { tracks } = this.currentState.context;
      return tracks;
    },
    activeTrack() {
      const { currentTrack } = this.currentState.context;
      return this.trackList[currentTrack];
    }
  }
};
</script>
<style lang="scss">
@import "@/main.scss";

.track-item {
  padding: 0.5rem 0;
}

.full-width {
  width: 100%;
}
</style>
