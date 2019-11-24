<template>
  <div class="sidebar-container anchor">
    <div class="upper">
      <div class="header">
        <div class="logo-container">
          <div class="columns is-vcentered">
            <p class="column is-narrow">
              <img
                class="image is-48x48 has-neon-shadow"
                :src="iconPath"
                alt="appicon"
              />
            </p>
            <div class="column">
              <p class="title is-2 has-text-weight-medium">
                <span class="has-neon-shadow-text">X</span>Tune
              </p>
            </div>
          </div>
        </div>
        <UploadButton @loadFile="uploadFile"></UploadButton>
      </div>
      <div class="body">
        <TrackList v-if="hasTracks"></TrackList>
        <div v-else data-test="sidebar-empty-intro" class="sidebar-empty-intro">
          <div class="text-box">
            <p class="title is-3">Hi there</p>
            <p class="subtitle is-5">This your playlist space</p>
            <p class="subtitle is-6">
              Here you can find all the tracks added to the app.
            </p>
            <p>
              There is nothing right now. Add some tracks to enjoy the music!
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom-side">
      <div>
        <p class="title is-6">
          With love from
          <a
            class="has-neon-shadow-text has-text-gradient"
            href="http://stormblade97.github.io"
            >Thanh Nguyen</a
          >
        </p>
        <p class="subtitle is-6">Part of his bachelor thesis</p>
      </div>
      <p class="is-marginless">
        Built with
        <span class="tags is-inline has-addons">
          <span class="tag is-small is-black has-text-weight-semibold">
            <span>Vue</span>
            <span class="icon">
              <i class="bx bxl-vuejs is-size-6"></i>
            </span>
          </span>
          <span class="tag is-small is-black has-text-weight-semibold"
            >Xstate</span
          >
          <span class="tag is-small is-black has-text-weight-semibold">
            <span>Coffee</span>
            <span class="icon">
              <i class="bx bx-coffee is-size-6"></i>
            </span>
          </span>
        </span>
      </p>
    </div>
  </div>
</template>

<script>
import TrackList from "@/components/TrackList";
import UploadButton from "@/components/UploadButton";
import appIcon from "@/assets/icon.png";
export default {
  components: {
    TrackList,
    UploadButton
  },
  methods: {
    uploadFile(fileArray) {
      console.log("Uploading track");
      this.send({
        type: "UPLOAD_TRACK",
        payload: {
          fileArray
        }
      });
    }
  },
  computed: {
    hasTracks() {
      return this.currentState.context.tracks.length > 0;
    },
    iconPath() {
      return appIcon;
    }
  }
};
</script>
<style lang="scss">
@import "@/main.scss";
.sidebar-empty-intro {
  margin: 1rem;
}
.upper {
  flex-grow: 2;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}
.body {
  padding: 1rem;
  display: flex;
  overflow-y: auto;
}
.logo-container {
  height: 3.5rem;
  width: 16rem;
  border-radius: 8px;
  margin: 1rem;
}

.sidebar-container {
  display: flex;
  flex-grow: 2;
}
.time-info {
  display: inline-flex;
  align-items: center;

  & > * {
    margin-right: 0.25rem;
  }
}
.text-box {
  margin-bottom: 2rem;
}
.bottom-side {
  position: absolute;
  width: 100%;
  bottom: 0;
  left: 0;
  padding: 1rem;
  padding-top: 3rem;
  padding-bottom: 0;
  z-index: 50;
  background: linear-gradient(to top, $bg-sidebar 60%, transparent);
}
</style>
