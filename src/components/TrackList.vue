<template>
  <div class="full-width track-list">
    <TrackItem
      class="track-item"
      :class="index === trackList.length - 1 && 'last-item'"
      v-for="(item, index) in trackList"
      :key="index"
      :item="item"
      :isPlaying="checkPlayStatus(item.id)"
      :isActive="activeTrack && activeTrack.id === item.id"
      :isLoading="!item.loaded"
      :index="index"
      :canBePlayed="true"
      :explicit="item.explicit"
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
        this.currentState.matches("main.ready.playback.playable.playing")
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
.last-item {
  margin-bottom: 6rem;
}
.full-width {
  width: 100%;
}
</style>
