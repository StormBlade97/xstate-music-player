<template>
  <div>
    <p class="has-text-weight-bold">Audio analysis</p>
    <div class="anchor">
      <div class="main-stat has-text-custom-gradient" :class="maxedStat[0]">
        <p class="title is-3 is-capitalized">{{ maxStatPhrase }}</p>
        <p class="subtitle is-6">{{ maxedStat[1] }}</p>
      </div>
      <div class="field is-grouped is-grouped-multiline">
        <div class="control" v-for="stat in stats" :key="stat[0]">
          <div class="box is-clipped analysis-item">
            <p
              class="is-capitalized has-text-weight-semibold is-size-6 has-text-custom-gradient"
              :class="stat[0]"
            >
              {{ stat[0] }}
            </p>
            <p class="is-size-5">{{ stat[1] }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
const statsKey = [
  "danceability",
  "energy",
  "loudness",
  "speechiness",
  "acousticness",
  "instrumentalness",
  "liveness",
  "valence"
];
export default {
  computed: {
    statsKey() {
      return statsKey;
    },
    stats() {
      const { tracks, currentTrack } = this.currentState.context;
      const temp = Object.entries(tracks[currentTrack].audioFeature).filter(a =>
        statsKey.includes(a[0])
      );
      temp.sort((a, b) => a[1] < b[1]);
      return temp;
    },
    maxedStat() {
      return this.stats[0];
    },
    maxStatPhrase() {
      const m = this.maxedStat[0];
      if (m === "danceability") {
        return "A very danceable one!";
      }
      if (m === "energy") {
        return "Powerful tune!";
      }
      if (m === "loudness") {
        return "Volume through the roof!";
      }
      if (m === "speechiness") {
        return "Is this a podcast?";
      }
      if (m === "acousticness") {
        return "Perfect for a morning coffee";
      }
      if (m === "instrumentalness") {
        return "Wordlessly melodic";
      }
      if (m === "liveness") {
        return "Live and fresh";
      }
      if (m === "valence") {
        return "Feels pretty happy";
      }
      return "No information";
    }
  }
};
</script>
<style lang="scss" scoped>
.danceability {
  background-image: linear-gradient(to right, #6a11cb 0%, #2575fc 100%);

  .blurred-background {
    background-image: url("https://images.unsplash.com/photo-1532452119098-a3650b3c46d3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2550&q=80");
  }
}
.energy {
  background-image: linear-gradient(
    -225deg,
    #ff057c 0%,
    #8d0b93 50%,
    #321575 100%
  );

  .blurred-background {
    background-image: url("https://images.unsplash.com/photo-1472145246862-b24cf25c4a36?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1951&q=80");
  }
}
.valence {
  background-image: linear-gradient(to top, #ff0844 0%, #ffb199 100%);
  .blurred-background {
    background-image: url("https://images.unsplash.com/photo-1535295972055-1c762f4483e5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80");
  }
}
.loudness {
  background-image: linear-gradient(to right, #243949 0%, #517fa4 100%);
  .blurred-background {
    background-image: url("https://images.unsplash.com/photo-1532452119098-a3650b3c46d3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2550&q=80");
  }
}
.acousticness {
  background-image: linear-gradient(120deg, #f6d365 0%, #fda085 100%);
  .blurred-background {
    background-image: url("https://images.unsplash.com/photo-1465847899084-d164df4dedc6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80");
  }
}
.instrumentalness {
  background-image: linear-gradient(-225deg, #7de2fc 0%, #b9b6e5 100%);
  .blurred-background {
    background-image: url("");
  }
}
.liveness {
  background-image: linear-gradient(
    -225deg,
    #d4ffec 0%,
    #57f2cc 48%,
    #4596fb 100%
  );
  .blurred-background {
    background-image: url("https://images.unsplash.com/photo-1522158637959-30385a09e0da?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80");
  }
}
.speechiness {
  background: linear-gradient(to bottom, #d5dee7 0%, #e8ebf2 50%, #e2e7ed 100%),
    linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.02) 50%,
      rgba(255, 255, 255, 0.02) 61%,
      rgba(0, 0, 0, 0.02) 73%
    ),
    linear-gradient(33deg, rgba(255, 255, 255, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%);
  background-blend-mode: normal, color-burn;
  .blurred-background {
    background-image: url("https://images.unsplash.com/photo-1556761175-129418cb2dfe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1567&q=80");
  }
}
.has-text-custom-gradient {
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.blurred-background {
  filter: blur(4px);
  background-size: cover;
  width: 110%;
  height: 100%;
}

.analysis-item {
  width: 10rem;
  height: 6rem;
}
.main-stat {
  margin-bottom: 1rem;
}
</style>
