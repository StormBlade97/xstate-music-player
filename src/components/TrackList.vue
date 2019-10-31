<template>
  <div>
    <div class="scroll-box outer">
      <div
        class="track-item level"
        :class="[
          item === activeTrack && 'has-text-primary has-text-weight-medium'
        ]"
        v-for="(item, index) in trackList"
        :key="item.id"
        @click="() => selectTrack(index)"
      >
        <div class="level-left">
          <div
            class="album-art is-clipped level-item"
            :alt="item.id"
            :style="{ backgroundImage: `url('${item.albumArt}')` }"
          />
          <div class="level-item">
            <span class="is-size-6 has-text-weight-semibold"
              >{{ item.title }} -</span
            >
            <span class="is-size-6">{{ item.artist }}</span>
          </div>
        </div>
        <div class="level-right">
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
.is-flex-align {
  display: flex;
  align-items: center;
}
.outer {
  overflow-y: auto;
  width: 100%;
  height: 100%;
  padding: 0.5rem 0;
}
.track-item {
  box-sizing: border-box;
  border-radius: $radius-medium;
  cursor: pointer;

  &:hover {
    background-color: $grey-lighter;
  }
}
.album-art {
  width: 3rem;
  height: 3rem;
  margin-right: 2rem;
  border-radius: 1rem;
  background-size: cover;
  background-position: center center;
  position: relative;
  &:before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: -1;
    pbackground-image: linear-gradient(
      to right,
      #b8cbb8 0%,
      #b8cbb8 0%,
      #b465da 0%,
      #cf6cc9 33%,
      #ee609c 66%,
      #ee609c 100%
    );
  }
}
</style>
