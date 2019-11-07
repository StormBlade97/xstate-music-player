<template>
  <div class="root">
    <div class="sideBar">
      <SideBar></SideBar>
    </div>
    <div class="main anchor is-clipped">
      <div class="inner-scroll anchor">
        <div class="banner">
          <div
            class="banner-img anchor"
            :style="{ backgroundImage: `url('${bannerUrl}')` }"
          ></div>
        </div>
        <section class="section">
          <div class="container">
            <EmptyIntroPage
              data-test="empty-intro-page"
              v-if="this.currentState.matches('main.empty')"
            ></EmptyIntroPage>
            <TrackInfo v-else />
          </div>
        </section>
      </div>

      <div class="control-bar" v-if="this.currentState.matches('main.ready')">
        <ControlCluster></ControlCluster>
      </div>
    </div>
  </div>
</template>

<script>
import SideBar from "./SideBar";
import EmptyIntroPage from "./EmptyIntroPage";
import ControlCluster from "./ControlCluster";
import TrackInfo from "./TrackInfo";
export default {
  name: "MainSection",
  components: {
    SideBar,
    EmptyIntroPage,
    ControlCluster,
    TrackInfo
  },
  computed: {
    bannerUrl() {
      const defaultImg =
        "https://images.unsplash.com/photo-1444623151656-030273ddb785?ixlib=rb-1.2.1&auto=format&fit=crop&w=2250&q=80";
      if (this.currentState.matches("main.ready")) {
        const { tracks, currentTrack } = this.currentState.context;
        const trackImg = tracks[currentTrack].albumArt;
        if (trackImg) {
          return trackImg;
        }
      }
      return defaultImg;
    }
  },
  created() {
    document.addEventListener("keydown", event => {
      if (event.code == "Space") {
        this.send("TOGGLE_PLAYBACK");
      }
    });
  }
};
</script>
<style lang="scss">
@import "@/main.scss";
.root {
  position: relative;
  display: flex;
  height: 100%;
  width: 100%;
}
.main {
  flex-grow: 2;
  background-color: $bg-main;
}
.inner-scroll {
  overflow: auto;
  width: 100%;
  height: 100%;
}
.sideBar {
  flex-basis: 25rem;
  flex-shrink: 0;
  display: flex;
  background-color: $bg-sidebar;
}
.banner {
  position: absolute;
  width: 100%;
  height: 30%;
  top: 0;
  left: 0;
  z-index: 0;
}
.banner-img {
  background-size: cover;
  background-position: center center;
  width: 100%;
  height: 100%;
  filter: blur(12px);

  &:after {
    content: "";
    position: absolute;
    width: 100%;
    height: 50%;
    left: 0;
    bottom: 0;
    z-index: 1;
    background: linear-gradient(to top, $bg-main, transparent);
  }
}
.control-bar {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
}
</style>
