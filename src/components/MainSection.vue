<template>
  <div class="root">
    <div class="sideBar">
      <SideBar></SideBar>
    </div>
    <div class="main is-clipped">
      <div class="banner">
        <div
          class="banner-img"
          :style="{ backgroundImage: `url('${bannerUrl}')` }"
        ></div>
      </div>
      <EmptyIntroPage
        data-test="empty-intro-page"
        v-if="this.currentState.matches('empty')"
      ></EmptyIntroPage>
      <div class="control-bar" data-test="control-bar">
        <ControlCluster></ControlCluster>
      </div>
    </div>
  </div>
</template>

<script>
import SideBar from "./SideBar";
import EmptyIntroPage from "./EmptyIntroPage";
import ControlCluster from "./ControlCluster";
export default {
  name: "MainSection",
  components: {
    SideBar,
    EmptyIntroPage,
    ControlCluster
  },
  computed: {
    bannerUrl() {
      return "https://images.unsplash.com/photo-1444623151656-030273ddb785?ixlib=rb-1.2.1&auto=format&fit=crop&w=2250&q=80";
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
.root {
  overflow: hidden;
  position: relative;
  display: flex;
  height: 100%;
  width: 100%;
}
.main {
  width: 100%;
  height: 100%;
  background-color: #f9f9f9;
  padding: 3rem;
  position: relative;
}
.sideBar {
  width: 30rem;
  height: 100%;
  background-color: rgb(228, 228, 228);
}
.banner {
  position: absolute;
  width: 110%;
  height: 30%;
  top: -5%;
  left: -5%;
  z-index: 0;
}
.banner-img {
  background-size: cover;
  background-position: center center;
  width: 100%;
  height: 100%;
  position: relative;
  filter: blur(12px);

  &:after {
    content: "";
    position: absolute;
    width: 100%;
    height: 50%;
    left: 0;
    bottom: 0;
    z-index: 1;
    background: linear-gradient(to top, #f9f9f9, transparent);
  }
}
.control-bar {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
}</style
>>
