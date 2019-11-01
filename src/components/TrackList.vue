<template>
  <div>
    <div class="scroll-box outer">
      <div
        class="track-item level is-marginless animation-on-hover is-clipped anchor fade-left"
        :class="[
          item === activeTrack && 'has-text-primary has-text-weight-medium'
        ]"
        v-for="(item, index) in trackList"
        :key="item.id"
        @click="() => selectTrack(index)"
      >
        <div class="level-left track-info">
          <img
            class="album-art is-marginless image level-item anchor"
            :src="item.albumArt"
          />
          <div class="track-name level-item anchor is-clipped fade-right">
            <div class="full-width">
              <div class="level is-vertical info-box marquee">
                <div class="level-item is-justified-start">
                  <p class="is-size-6 has-text-weight-semibold">
                    {{ item.title || item.id }}
                  </p>
                </div>
                <div class="level-item">
                  <p v-if="item.artist" class="is-size-6">{{ item.artist }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="track-duration">
          <p>{{ item.duration }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "TrackList",
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
<style lang="scss" scoped>
@import "@/main.scss";
@import "~bulma/sass/utilities/initial-variables.sass";

.outer {
  overflow-y: auto;
  width: 100%;
  height: 100%;
}
.track-item {
  padding: 0.5rem 0;
  cursor: pointer;
}
.album-art {
  width: 3rem;
  height: 3rem;
  border-radius: $radius-medium;
  background: linear-gradient(
    to right,
    #b8cbb8 0%,
    #b8cbb8 0%,
    #b465da 0%,
    #cf6cc9 33%,
    #ee609c 66%,
    #ee609c 100%
  );
}
.track-info {
  flex-grow: 2;
  flex-shrink: 1 !important;
  position: relative;
  justify-content: flex-start;
  & > .track-name {
    padding-left: 1rem;
  }
}
.track-duration {
  position: absolute;
  right: 0;
  top: 50%;
  z-index: 1;
  transform: translateY(-50%);
}
.info-box {
  align-items: flex-start !important;
}
.full-width {
  width: 100%;
}
</style>
