<template>
  <div class="is-fullwidth has-fade-in-animation anchor" v-if="enrichmentState">
    <div
      class="is-fullwidth"
      v-if="
        enrichmentState.matches('retrieveMatches.searchingMatches') ||
          enrichmentState.matches(
            'matchDetailedData.fetchable.fetchingMatchDetails'
          )
      "
    >
      <progress class="progress progress-bar is-primary"></progress>
    </div>
    <div class="box track-match-container">
      <div class="columns widget-name is-vcentered">
        <div class="column is-narrow">
          <p class="title is-5">Connect with Spotify</p>
        </div>

        <div class="field column is-fullwidth">
          <div
            class="control is-expanded has-icons-left has-background-black has-radius-medium"
          >
            <span class="icon is-left">
              <i class="bx bx-search"></i>
            </span>
            <input
              @input="manualSearch"
              :value="enrichmentState.context.query"
              type="text"
              class="input has-text-gradient is-borderless"
            />
          </div>
        </div>
      </div>

      <div class="columns">
        <div class="column is-two-fifths">
          <div
            v-if="enrichmentState.matches('retrieveMatches.searchingMatches')"
          >
            <p class="title is-4">Working on it</p>
            <p class="subtitle is-5">Getting you a match for</p>
            <p class="title is-5">{{ enrichmentState.context.query }}</p>
          </div>
          <div
            v-if="enrichmentState.matches('retrieveMatches.resolved.failed')"
          >
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
              enrichmentState.matches('retrieveMatches.resolved.confirmable')
            "
          >
            <p class="title is-4">This could be it</p>
            <div class="level">
              <TrackImg
                class="track-img"
                :src="enrichmentState.context.matches[0].album.images[0].url"
              />
            </div>

            <p class="title is-5">
              {{ enrichmentState.context.matches[0].name }}
            </p>
            <p class="subtitle is-6">
              {{
                enrichmentState.context.matches[0].album.artists
                  .map(a => a.name)
                  .join(" & ")
              }}
            </p>
            <button
              class="button is-rounded has-background-gradient"
              @click="confirmMatch(0)"
            >
              Confirm
            </button>
          </div>
          <div
            v-if="
              enrichmentState.matches(
                'matchDetailedData.fetchable.fetchingMatchDetails'
              )
            "
          >
            <p class="title is-4">A little more</p>
            <p class="subtitle is-6">
              Getting more information about the track, such as audio feature,
              etc
            </p>
            <div class="level">
              <TrackImg
                class="track-img"
                :src="enrichmentState.context.matches[0].album.images[0].url"
              />
            </div>
            <p class="title is-5">
              {{ enrichmentState.context.matches[0].name }}
            </p>
            <p class="subtitle is-6">
              {{
                enrichmentState.context.matches[0].album.artists
                  .map(a => a.name)
                  .join(" & ")
              }}
            </p>
          </div>
          <div
            v-if="enrichmentState.matches('matchDetailedData.fetchable.failed')"
          >
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
          <div
            v-if="enrichmentState.matches('matchDetailedData.fetchable.done')"
          >
            <p class="title is-4">All done, enjoy your music!</p>
          </div>
        </div>
        <div
          class="column"
          v-if="enrichmentState.matches('retrieveMatches.resolved.confirmable')"
        >
          <div class="anchor scrollbox">
            <TrackItem
              v-for="(item, index) in matches"
              :key="index"
              :item="item"
              :index="index"
              class="track-item"
              @track-selected="confirmMatch(index)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TrackImg from "@/components/TrackImg.vue";
import TrackItem from "@/components/TrackItem.vue";
export default {
  components: {
    TrackImg,
    TrackItem
  },
  data() {
    return {
      customSearch: ""
    };
  },
  methods: {
    enrich() {
      this.send("GET_SPOTIFY_MATCH");
    },
    manualSearch(e) {
      console.log("Inputting", e.target.value);
      this.send({
        type: "GET_SPOTIFY_MATCH",
        payload: {
          query: e.target.value
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
    refetchMatches() {
      this.send("RETRY_GET_MATCH");
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
      return this.enrichmentState
        ? this.enrichmentState.context.matches
            .map(item => ({
              title: item.name,
              albumArt: item.album.images[0].url,
              duration: item.duration_ms / 1000,
              artist: item.album.artists.map(a => a.name).join(" & "),
              explicit: item.explicit
            }))
            .filter((_, i) => i < 5)
        : [];
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
.track-match-container {
  background-color: $bg-sidebar;
  min-height: 30rem;
  & > * {
    margin: 1rem;
  }
}
.track-info {
  display: flex;
  flex-direction: column;
}
.track-img {
  width: 10rem;
  height: 10rem;
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
.widget-name {
  margin-top: -0.25rem;
}
.custom-input {
  background-color: white !important;
}
</style>
