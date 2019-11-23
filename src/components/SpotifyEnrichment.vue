<template>
  <div
    class="is-fullwidth has-fade-in-animation is-clipped anchor"
    v-if="enrichmentState"
  >
    <div
      class="is-fullwidth"
      v-if="
        enrichmentState.matches('searchingMatches') ||
          enrichmentState.matches('fetchingMatchDetails')
      "
    >
      <progress
        class="has-fade-in-animation progress progress-bar is-primary"
      ></progress>
    </div>
    <div class="box track-match-container has-min-height">
      <div
        class="columns widget-section is-vcentered"
        v-if="!enrichmentState.matches('fetchMatchDetailsDone')"
      >
        <div class="column is-narrow">
          <p class="title is-5">Connect with Spotify</p>
        </div>

        <div class="field column is-fullwidth">
          <div
            class="control is-expanded has-icons-left has-background-black has-radius-medium"
          >
            <span
              class="icon is-left"
              :class="emptyMatches && 'has-beat-animation'"
            >
              <i class="bx bx-search"></i>
            </span>
            <input
              @input="manualSearch"
              :value="enrichmentState.context.query"
              type="text"
              class="input has-text-white has-background-black is-borderless"
            />
          </div>
        </div>
      </div>

      <div class="columns main-section">
        <div class="column">
          <div v-if="enrichmentState.matches('searchMatchesFailed')">
            <p class="title">Oh no!</p>
            <p class="subtitle is-6 has-text-danger">
              Some thing went wrong with the network. Try again soon
            </p>
            <button
              class="button is-rounded is-borderless has-background-gradient"
              @click="refetchMatches"
            >
              Try again
            </button>
          </div>
          <div
            v-if="
              enrichmentState.matches('confirmable') ||
                enrichmentState.matches('searchingMatches')
            "
          >
            <div v-if="matches.length > 0">
              <p class="title is-4">This could be it</p>
              <div class="mb">
                <VerticalTrackItem
                  :albumArt="matches[0].albumArt"
                  :title="matches[0].title"
                  :artist="matches[0].artist"
                  :albumName="matches[0].albumName"
                />
              </div>

              <button
                class="button is-rounded has-background-gradient"
                @click="confirmMatch(0)"
              >
                Confirm
              </button>
            </div>
            <div v-else>
              <p class="title">Nothing was found</p>
              <p>I could not get a match with Spotify based on this</p>
              <p class="title is-6">{{ enrichmentState.context.query }}</p>
              <p>You can try to manually search with the text box above</p>
            </div>
          </div>
          <div
            v-if="
              enrichmentState.matches('fetchingMatchDetails') ||
                enrichmentState.matches('confirmed')
            "
          >
            <p class="title is-4">A little more</p>
            <p class="subtitle is-6">
              Getting more information about the track, such as audio feature,
              etc
            </p>

            <VerticalTrackItem
              :albumArt="selectedMatch.album.images[0].url"
              :title="selectedMatch.name"
              :artist="selectedMatch.artistString"
              :albumName="selectedMatch.album.name"
            />
          </div>
          <div v-if="enrichmentState.matches('fetchMatchDetailsFailed')">
            <p class="title">Could not load it :(</p>
            <p class="subtitle is-6 has-text-danger">
              For some reason, could not load more information about this track.
              You might wanna try again.
            </p>
            <button
              class="button is-rounded has-background-gradient"
              @click="retryFetchMatchDetails"
            >
              Try again
            </button>
          </div>
          <div v-if="enrichmentState.matches('fetchMatchDetailsDone')">
            <div
              class="is-overlay done-bg has-radius-medium is-flex-centerized"
            >
              <div>
                <div class="field is-grouped is-grouped-multiline">
                  <span class="title is-6 control">Enriched with</span>
                  <span class="icon is-size-4 is-dark control">
                    <i class="bx bxl-spotify"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="column" v-if="enrichmentState.matches('confirmable')">
          <div class="anchor scrollbox" v-if="matches.length > 1">
            <TrackItem
              v-for="(item, index) in matches"
              :key="index"
              :item="item"
              :index="index"
              :explicit="item.explicit"
              class="track-item"
              @track-selected="confirmMatch(index)"
            />
          </div>
          <div class="empty-matches is-flex-centerized is-fullheight" v-else>
            <p class="empty-icon">
              <span class="icon is-size-1">
                <i class="bx bx-music"></i>
              </span>
            </p>
            <p>Search results are here</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TrackItem from "@/components/TrackItem.vue";
import VerticalTrackItem from "@/components/VerticalTrackItem.vue";
export default {
  components: {
    TrackItem,
    VerticalTrackItem
  },
  methods: {
    manualSearch(e) {
      this.send({
        type: "GET_SPOTIFY_MATCH",
        payload: {
          query: e.target.value
        }
      });
    },
    refetchMatches() {
      this.send({
        type: "GET_SPOTIFY_MATCH",
        payload: {
          query: this.enrichmentState.context.query
        }
      });
    },
    confirmMatch(pos) {
      this.send({
        type: "CONFIRM_MATCH",
        payload: {
          index: pos
        }
      });
    },
    retryFetchMatchDetails() {
      this.send("RETRY_FETCH_MATCH_DETAILS");
    }
  },
  computed: {
    enrichmentState() {
      const { tracks, currentTrack } = this.currentState.context;
      try {
        return tracks[currentTrack].enrichment.state;
      } catch (error) {
        return null;
      }
    },
    matches() {
      return this.enrichmentState.context.matches
        .map(item => ({
          title: item.name,
          albumArt: item.album.images[0].url,
          duration: item.duration_ms / 1000,
          artist: item.artistString,
          explicit: item.explicit,
          albumName: item.album.name
        }))
        .filter((_, i) => i < 5);
    },
    emptyMatches() {
      return (
        this.enrichmentState.matches("confirmable") && this.matches.length < 1
      );
    },
    selectedMatch() {
      return this.enrichmentState.context.matches[
        this.enrichmentState.context.selected
      ];
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/main.scss";
.is-scrollable-horizontal {
  overflow-x: auto;
}
.is-fullwidth {
  width: 100%;
}
.is-fullheight {
  height: 100%;
}
.has-min-height {
  min-height: 25rem;
}
.track-match-container {
  background-color: $bg-sidebar;
  & > * {
    margin: 1rem;
  }
}
.track-info {
  display: flex;
  flex-direction: column;
}

.is-scrollable {
  overflow-y: auto;
}
.track-item {
  margin: 0.25rem;
}
.progress-bar {
  height: 4px !important;
  position: absolute;
  top: 0;
  left: 0;
}
.widget-section {
  margin-top: -0.25rem;
}
.main-section {
  min-height: 100%;
}
.empty-matches {
  color: rgba(255, 255, 255, 0.1);
}
.is-flex-centerized {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.custom-input {
  background-color: white !important;
}
.mb {
  margin-bottom: 1rem;
}
</style>
