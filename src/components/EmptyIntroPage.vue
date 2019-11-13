<template>
  <div class="empty-intro-container">
    <p class="title is-1">Unleash your tune.</p>
    <p class="subtitle">
      Play local music with ease from the browser. No download required
    </p>
    <hr class="has-background-dark divider-short" />
    <div class="ads">
      <p>
        Access your local musics with ease from any where. No download needed
      </p>
      <p>Empower your musical experience with lyrics and knowledge.</p>
      <div class="ads-grid">
        <div
          class="item is-boxed has-background-black"
          :key="id"
          :class="
            adsEntered === id && 'has-neon-shadow has-background-gradient'
          "
          v-for="(item, id) in ads"
          @mouseenter="handleMouseEnter(id)"
          @mouseleave="handleMouseLeave"
        >
          <div
            class="icon-art is-size-1"
            :class="
              adsEntered !== id ? 'has-text-gradient has-neon-shadow-text' : ''
            "
          >
            <i class="bx" :class="`bx-${item.icon}`"></i>
          </div>
          <div>
            <p class="is-size-6 has-text-weight-semibold">{{ item.main }}</p>
            <p class="tagline-text">{{ item.tagline }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "EmptyIntroPage",
  data() {
    return {
      adsEntered: null,
      ads: [
        {
          icon: "wifi-off",
          main: "Data friendly",
          tagline: "Your music stays local. No upload or download."
        },
        {
          icon: "book",
          main: "About the song",
          tagline: "Know more about what you are listening to"
        },
        {
          icon: "music",
          main: "Sing along",
          tagline: "Easily find lyrics for your karaoke session!"
        }
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
.empty-intro-container {
  margin-top: 6rem;
}
.divider-short {
  width: 15rem;
  border-radius: 4px;
  height: 2px;
}

.ads-grid {
  display: flex;
  align-items: center;
  margin-top: 2rem;
}
.item {
  display: inline-flex;
  flex-direction: column;
  justify-content: space-between;
  width: 18rem;
  height: 13rem;
  margin: 0;
  margin-right: 1rem;
  padding: 1rem;
}
.is-boxed {
  border-radius: 4px;
  transition: all 0.3s ease;
  border-radius: 1rem;
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
</style>
