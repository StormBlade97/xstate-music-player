<template>
  <div>
    <div class="columns is-vcentered">
      <div class="column is-two-fifth">
        <div
          class="box is-paddingless is-shadowless has-background-grey-light track-art anchor is-clipped"
        >
          <img v-if="imgSrc" :src="imgSrc" class="image is-overlay" />
        </div>
      </div>

      <div class="column">
        <p class="title">{{ currentTrack.title || currentTrack.id }}</p>
        <p class="subtitle">
          {{ currentTrack.artist || "No artist information" }}
        </p>
      </div>
    </div>
    <div class="columns">
      <div class="column">
        <p class="lyric-box" v-if="lyrics">{{ lyrics }}</p>
      </div>
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
    currentTrack() {
      const { tracks, currentTrack } = this.currentState.context;
      return tracks[currentTrack];
    },
    imgSrc() {
      return this.currentTrack.albumArt;
    },
    lyrics() {
      return (
        this.currentTrack.metadata.common.lyrics &&
        this.currentTrack.metadata.common.lyrics[0]
      );
    }
  }
};
</script>
<style lang="scss">
.track-art {
  width: 15rem;
  height: 15rem;
  background-size: cover;
  background-image: linear-gradient(120deg, #f093fb 0%, #f5576c 100%);
}
.lyric-box {
  white-space: pre;
}
</style>
