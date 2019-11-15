<template>
  <section class="bg">
    <p class="has-text-weight-semibold">Album info</p>
    <p class="title">{{ album.name }}</p>
    <p class="subtitle">Released on {{ album.release_date }}</p>
    <p class="subtitle">
      Total tracks:
      <strong>{{ album.total_tracks }}</strong>
    </p>
    <div class="level" v-for="item in itemsInAlbum" :key="item.track_number">
      <div class="level-left">
        <div class="level-item">
          <div
            class="box track-number"
            :class="
              track.track_number === item.track_number &&
                'has-background-gradient'
            "
          >
            <p class="title is-5">{{ item.track_number }}</p>
          </div>
        </div>
        <div class="level-item">
          <p class="title is-6">{{ item.name }}</p>
        </div>
      </div>
      <div class="level-right">
        <div class="level-item">{{ item.duration }}</div>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  computed: {
    track() {
      const { tracks, currentTrack } = this.currentState.context;
      return tracks[currentTrack];
    },
    album() {
      return this.track.album;
    },
    itemsInAlbum() {
      return this.album.items;
    }
  }
};
</script>
<style lang="scss" scoped>
.track-number {
  width: 3rem;
  height: 3rem;
  padding: 0.5rem;
}
</style>
