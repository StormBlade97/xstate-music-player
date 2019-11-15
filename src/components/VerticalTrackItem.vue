<template>
  <div class="anchor">
    <div class="columns is-vcentered">
      <div class="column is-narrow">
        <TrackImg :src="albumArt" class="v-track-img" />
      </div>
      <div class="column">
        <p class="title is-4">{{ title }}</p>
        <p class="subtitle is-6">{{ artist }}</p>
        <div class="field is-grouped is-grouped-multiline">
          <span class="icon control">
            <i class="bx bxs-album bx-sm"></i>
          </span>
          <p class="subtitle is-6 control">{{ albumName }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import TrackImg from "@/components/TrackImg";
export default {
  components: {
    TrackImg
  },
  props: {
    title: String,
    artist: String,
    albumArt: String,
    imgClass: String,
    albumName: String
  }
};
</script>
<style lang="scss" scoped>
.img-wrapper {
  margin-bottom: 1rem;
}
.v-track-img {
  width: 10rem;
  height: 10rem;
}
</style>
