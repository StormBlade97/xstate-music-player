<template>
  <div class="track-info-root">
    <div class="columns">
      <div class="column is-narrow">
        <div class="anchor track-art-container">
          <div class="is-overlay">
            <TrackImg :src="imgSrc" class="track-art" />
          </div>
          <div class="track-art-blurred" is-overlay>
            <TrackImg :src="imgSrc" class="track-art" />
          </div>
        </div>
      </div>

      <div class="column track-title">
        <p class="title">{{ currentTrack.title || currentTrack.id }}</p>
        <p class="subtitle">
          {{ currentTrack.artist || "No artist information" }}
        </p>
        <div>
          <button
            class="button is-rounded has-background-gradient is-borderless"
            @click="enrich"
          >
            <span>Enrich with Spotify</span>
            <span class="icon">
              <i class="bx bxl-spotify bx-sm"></i>
            </span>
          </button>
        </div>
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

    <div class="columns">
      <div class="column">
        <SpotifyEnrichment />
      </div>
      <div class="column is-two-third"></div>
    </div>
    <div class="column"></div>
  </div>
</template>
<script>
import TrackImg from "@/components/TrackImg";
import SpotifyEnrichment from "@/components/SpotifyEnrichment";

import { isObject, isArray } from "util";
export default {
  name: "TrackInfo",
  components: {
    TrackImg,
    SpotifyEnrichment
  },
  methods: {
    enrich() {
      this.send({
        type: "GET_SPOTIFY_MATCH"
      });
    }
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
    hasMetadata() {
      return this.currentTrack.metadata;
    },
    commonMetadata() {
      if (this.currentTrack.metadata) {
        return Object.entries(this.currentTrack.metadata.common)
          .map(([k, v]) => {
            if (isObject(v)) return [k, "No information"];
            if (isArray(v)) return [k, v.join(";")];
            return [k, v];
          })
          .filter(entry => entry[1]);
      }
      return null;
    }
  }
};
</script>
<style lang="scss" scoped>
@import "@/main.scss";
.track-info-root {
  margin: 3rem;
}
.track-art-container {
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
.track-title {
  overflow-wrap: break-word;
  padding: 2rem;
}

.full-width {
  width: 100%;
}
</style>
