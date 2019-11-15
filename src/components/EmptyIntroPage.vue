<template>
  <div class="empty-intro-container">
    <section class="section">
      <p class="title is-1">
        Unleash your
        <span class="has-text-gradient">TuneX</span>.
      </p>
      <p class="subtitle">A beautiful music player in your browser</p>
    </section>

    <section class="section">
      <p class="title is-3">Features</p>
      <p class="subtitle">Discover what you can do</p>
      <div class="columns is-marginless">
        <div class="column">
          <div class="box item is-clipped has-background-black anchor">
            <div class="is-overlay item-bg feature-playback"></div>
            <div>
              <p class="title has-text-weight-semibold">Play the music</p>
              <p class="subtitle tagline-text">that you own</p>
            </div>
            <div class="icon-art is-size-1">
              <i class="bx bx-dollar"></i>
            </div>
            <div>
              <p class="has-text-weight-medium">
                Works offline. Your musical experience starts with adding sounds
              </p>
            </div>
          </div>
        </div>
        <div class="column">
          <div class="box item is-clipped has-background-black anchor">
            <div class="is-overlay item-bg feature-knowledge"></div>
            <div>
              <p class="title has-text-weight-semibold">Fast & free</p>
              <p class="subtitle tagline-text has-text-weight-semibold">
                and no ads or privacy breach.
              </p>
            </div>
            <div class="icon-art is-size-1">
              <i class="bx bx-play"></i>
            </div>
            <div>
              <p class="has-text-weight-medium">
                No information about you is collected. Everything is stored
                locally.
              </p>
            </div>
          </div>
        </div>
        <div class="column">
          <div class="box item is-clipped has-background-black anchor">
            <div class="is-overlay item-bg feature-free"></div>

            <div>
              <p class="title has-text-weight-semibold">Hear more. Know more</p>
              <p class="subtitle tagline-text has-text-weight-semibold">
                learn more about your song
              </p>
            </div>
            <div class="icon-art is-size-1">
              <i class="bx bx-book"></i>
            </div>
            <div>
              <p class="has-text-weight-medium">
                Optionally scan and match your song with data from streaming
                services
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="section no-padding-top">
      <div class="columns is-vcentered">
        <div class="column field is-grouped is-grouped-multiline is-narrow">
          <TrackImg
            v-for="ad in ads"
            :src="ad"
            :key="ad"
            class="control track-img"
          />
        </div>
        <div class="column">
          <p class="title is-3">
            <span class="has-text-gradient">Start</span> your musical journey
            today
          </p>
          <p class="subtitle">It doesn't cost, so give this a try</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import TrackImg from "@/components/TrackImg";
export default {
  name: "EmptyIntroPage",
  components: {
    TrackImg
  },
  data() {
    return {
      adsEntered: null,
      ads: [
        "https://media.giphy.com/media/4KEWERMveVE5kttbQg/giphy.gif",
        "https://media.giphy.com/media/Oz5lMwsu1lLaM/giphy.gif",
        "https://media.giphy.com/media/rPX7AeMAdFAGY/giphy.gif",
        "https://media.giphy.com/media/YvlgQfLzhhmGk/giphy.gif"
      ]
    };
  },
  methods: {
    handleMouseEnter(i) {
      this.adsEntered = i;
    },
    handleMouseLeave() {
      this.adsEntered = null;
    }
  }
};
</script>

<style lang="scss">
@import "@/main.scss";
.track-img {
  width: 10rem;
  height: 10rem;
}
.divider-short {
  width: 15rem;
  border-radius: 4px;
  height: 2px;
}

.item {
  display: inline-flex !important;
  flex-direction: column;
  justify-content: space-between;
  height: 25rem;
  margin: 0;
  margin-right: 1rem;
  padding: 2rem !important;

  div {
    z-index: 2;
  }
}
.no-padding-top {
  padding-top: 0 !important;
}
.tagline-text {
  opacity: 0.76;
}
.icon-art {
  margin: auto;
}
.intro-logo {
  padding: 0.25rem;
}
.item-bg {
  &:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 60%, transparent);
  }
  background-size: cover;
  background-position: center center;
  filter: blur(4px);
}
.feature-playback {
  background-image: url("https://images.unsplash.com/photo-1473691955023-da1c49c95c78?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80");
}
.feature-knowledge {
  background-image: url("https://images.unsplash.com/photo-1535074153497-b08c5aa9c236?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80");
}
.feature-free {
  background-image: url("https://images.unsplash.com/photo-1504680177321-2e6a879aac86?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80");
}
</style>
