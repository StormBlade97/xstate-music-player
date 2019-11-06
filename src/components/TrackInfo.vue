<template>
  <div>
    <div class="level">
      <div class="level-left is-shrinkable is-flex-wrappable">
        <div class="anchor track-art-container">
          <div class="is-overlay">
            <TrackImg :src="imgSrc" class="track-art" />
          </div>
          <div class="track-art-blurred" is-overlay>
            <TrackImg :src="imgSrc" class="track-art" />
          </div>
        </div>

        <div class="track-title is-shrinkable">
          <p class="title">{{ currentTrack.title || currentTrack.id }}</p>
          <p class="subtitle">
            {{ currentTrack.artist || "No artist information" }}
          </p>
          <p class="enrichment-permission">
            <button class="button is-rounded has-background-gradient">
              <span>Enrich with spotify</span>
              <span class="icon">
                <i class="bx bxl-spotify bx-sm"></i>
              </span>
            </button>
          </p>
          <div>
            <span class="tag is-danger" v-if="currentTrack.explicit">
              <span class="icon">
                <i class="bx bxs-no-entry"></i>
              </span>
              <span>Explicit</span>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="columns">
      <div class="column"></div>
      <div class="column"></div>
    </div>
    <div class="columns">
      <div class="column is-two-fifths">
        <div class="box is-shadowless track-info-widget">
          <p class="title is-5">Track info</p>
          <p class="subtitle is-6">From file metadata</p>
          <div class="level" v-for="entry in commonMetadata" :key="entry[0]">
            <div class="level-left">
              <span
                class="info-title is-capitalized has-text-weight-semibold"
                >{{ entry[0] }}</span
              >
            </div>
            <div class="level-right overflow-wrap: break-word;">
              <span>{{ entry[1] }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="column"></div>
  </div>
</template>
<script>
import TrackImg from "@/components/TrackImg";
import { isObject, isArray } from "util";
export default {
  name: "TrackInfo",
  components: {
    TrackImg
  },
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
    },
    hasMetadata() {
      return this.currentTrack.metadata;
    },
    commonMetadata() {
      return Object.entries(this.currentTrack.metadata.common)
        .map(([k, v]) => {
          if (isObject(v)) return [k, "No information"];
          if (isArray(v)) return [k, v.join(";")];
          return [k, v];
        })
        .filter(entry => entry[1]);
    }
  }
};
</script>
<style lang="scss" scoped>
@import "@/main.scss";
.track-art-container {
  margin-right: 3rem;
  margin-bottom: 3rem;
}
.track-art {
  width: 15rem;
  height: 15rem;
  background-size: cover;
  margin: 0;
}
.track-art-blurred {
  width: 15rem;
  height: 15rem;
  transform: translateY(10%) scale(0.85);
  filter: blur(24px);
}
.lyric-box {
  white-space: pre;
}
.track-title {
  overflow-wrap: break-word;
  width: 50rem;
  min-width: 30rem;
  max-width: 60rem;
}

.full-width {
  width: 100%;
}
</style>
