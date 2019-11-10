<template>
  <div
    class="full-width track-item-root anchor fade-left is-clipped"
    @click="$emit('track-selected', index)"
  >
    <div
      class="level-left track-info"
      :class="isLoading && 'has-flicker-animation'"
    >
      <div>
        <TrackImg
          :enableControl="canBePlayed"
          :src="item.albumArt"
          :isPlaying="isPlaying"
          class="album-art"
        />
      </div>

      <div
        class="track-name level-item anchor fade-right animation-on-hover"
        :class="isActive && 'has-text-gradient has-text-weight-medium'"
      >
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
      <p>{{ getTextDur(item.duration) }}</p>
    </div>
  </div>
</template>
<script>
import TrackImg from "@/components/TrackImg";
import { parseDuration } from "@/util";

export default {
  name: "TrackItem",
  components: {
    TrackImg
  },
  props: {
    item: Object,
    index: Number,
    isPlaying: Boolean,
    isActive: Boolean,
    canBePlayed: Boolean,
    isLoading: Boolean
  },
  methods: {
    getTextDur: parseDuration
  }
};
</script>
<style lang="scss" scoped>
@import "@/main.scss";
.track-item-root {
  cursor: pointer;
}
.album-art {
  width: 3rem;
  height: 3rem;
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
