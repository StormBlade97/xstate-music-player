<template>
  <section class="section empty-intro">
    <div class="container">
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
          <div class="item is-boxed" :key="id" v-for="(item, id) in ads">
            <div class="icon-art">
              <span class="icon is-size-1">
                <i class="bx" :class="`bx-${item.icon}`"></i>
              </span>
            </div>
            <div>
              <p class="is-size-6 has-text-weight-semibold">{{ item.main }}</p>
              <p class="tagline-text">{{ item.tagline }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "EmptyIntroPage",
  data() {
    return {
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
  }
};
</script>

<style lang="scss">
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
  box-shadow: 0px 0px 2px rgba(49, 49, 49, 0.25);
  border-radius: 1rem;

  &:hover {
    box-shadow: 0px 3px 12px rgba(255, 81, 162, 0.25),
      0px 12px 24px rgb(69, 18, 250, 0.15);
  }
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
.empty-intro {
  margin-top: 6rem;
}
</style>
