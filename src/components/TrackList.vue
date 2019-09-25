<template>
  <div>
    <div class="trackControl is-marginless level">
      <div class="level-left">
        <div class="level-item">
          <p class="subtitle is-5 has-text-weight-bold">Tracks</p>
        </div>
        <div class="level-item">
          <span class="tag is-rounded has-text-primary"
            >{{ trackList.length }} tracks</span
          >
        </div>
      </div>
      <div class="level-right">
        <div class="level-item">
          <UploadButton></UploadButton>
        </div>
      </div>
    </div>
    <div class="scroll-box outer">
      <div
        class="track-item"
        :class="[
          item === activeTrack && 'has-text-primary has-text-weight-medium'
        ]"
        v-for="(item, index) in trackList"
        :key="item"
        @click="() => selectTrack(index)"
      >
        <span>{{ item }}</span>
      </div>
    </div>
  </div>
</template>
<script>
import UploadButton from "@/components/UploadButton.vue";
import { mapArray } from "@/util.js";

export default {
  name: "TrackList",
  components: {
    UploadButton
  },
  methods: {
    selectTrack(index) {
      this.send({
        type: "SELECT_TRACK",
        index: index
      });
    }
  },
  computed: {
    trackList() {
      const { tracks, trackOrder } = this.currentState.context;
      return mapArray(tracks, trackOrder).map(f => f.name || f.filename);
    },
    activeTrack() {
      const { currentTrackIndex } = this.currentState.context;
      return this.trackList[currentTrackIndex];
    }
  }
};
</script>
<style lang="scss" scoped>
@import "@/main.scss";
@import "~bulma/sass/utilities/initial-variables.sass";
.outer {
  overflow-y: auto;
  width: 100%;
  height: 100%;
  padding: 0.5rem 0;
  max-height: 40vh;
}
.track-item {
  box-sizing: border-box;
  margin-bottom: -1px;
  padding: 0.75rem;
  border: 1px transparent solid;
  border-bottom: 1px lightgrey solid;
  border-radius: $radius-small;
  cursor: pointer;

  &:hover {
    background-color: $grey-lighter;
  }
}
.trackControl {
  padding: 0.5rem;
  padding-top: 0;
  border-bottom: 2px $grey solid;
}
</style>
