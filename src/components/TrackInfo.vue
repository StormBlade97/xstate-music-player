<template>
  <div class="track-info-root">
    <div class="columns is-vcentered">
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
        <p
          class="subtitle is-5"
          v-if="currentTrack.album && currentTrack.album.name"
        >
          {{ currentTrack.album.name }}
        </p>
        <div class="level">
          <div class="level-left">
            <div class="level-item" v-if="currentTrack.explicit">
              <span
                class="level-item tag is-black is-rounded is-medium has-text-danger"
              >
                <span class="icon">
                  <i class="bx bxs-no-entry bx-xs"></i>
                </span>
                <span class="has-text-weight-semibold">Explicit</span>
              </span>
            </div>
            <div class="level-item">
              <button
                class="button is-rounded done-bg is-borderless has-text-dark"
                v-if="currentTrack.enriched"
                @click="enrich"
              >
                <span class="icon">
                  <i class="bx bxl-spotify bx-sm"></i>
                </span>
                <span>Get a different match</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <section
      class="section"
      v-if="
        currentTrack.enrichment &&
          !currentTrack.enrichment.state.matches('fetchMatchDetailsDone')
      "
    >
      <SpotifyEnrichment />
    </section>
    <section class="section">
      <div class="columns">
        <div class="column" v-if="currentTrack.audioFeature">
          <AudioFeature />
        </div>
        <div class="column" v-if="currentTrack.album">
          <AlbumInfo />
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import TrackImg from "@/components/TrackImg";
import SpotifyEnrichment from "@/components/SpotifyEnrichment";
import AudioFeature from "@/components/AudioFeature";
import AlbumInfo from "@/components/AlbumInfo";

import { isObject, isArray } from "util";
export default {
  name: "TrackInfo",
  components: {
    TrackImg,
    SpotifyEnrichment,
    AudioFeature,
    AlbumInfo
  },
  methods: {
    enrich() {
      this.send("RESTART_ENRICHMENT");
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

  .section {
    padding-left: 0;
    padding-right: 0;
  }
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
  filter: blur(12px);
}
.track-title {
  overflow-wrap: break-word;
  padding: 2rem;
}

.full-width {
  width: 100%;
}
.done-bg {
  padding: 1rem;
  background-image: linear-gradient(
    135deg,
    #81fbb8 10%,
    #28c76f 100%
  ) !important;
}
.mb {
  margin-bottom: 1rem;
}
</style>
