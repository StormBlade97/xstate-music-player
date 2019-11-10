<template>
  <div class="sidebar-container anchor">
    <div class="upper">
      <div class="header">
        <div class="logo level"></div>
        <UploadButton @loadFile="uploadFile"></UploadButton>
      </div>
      <div class="body">
        <TrackList v-if="hasTracks"></TrackList>
        <div v-else data-test="sidebar-empty-intro">
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
          <a class="has-text-primary" href="http://stormblade97.github.io"
            >Thanh Nguyen</a
          >
        </p>
        <p class="subtitle is-6">Part of his bachelor thesis</p>
      </div>
      <p class="is-marginless">
        Built with
        <span class="tags is-inline has-addons">
          <span class="tag is-small is-black">
            <span>Vue</span>
            <span class="icon">
              <i class="bx bxl-vuejs is-size-6"></i>
            </span>
          </span>
          <span class="tag is-small is-black">Xstate</span>
          <span class="tag is-small is-black has-text-weight-semibold">
            <span>A lot of</span>
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
export default {
  components: {
    TrackList,
    UploadButton
  },
  methods: {
    uploadFile(fileArray) {
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
    }
  }
};
</script>
<style lang="scss">
@import "@/main.scss";
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
  margin-bottom: 2rem;
}
.logo {
  height: 3.5rem;
  width: 16rem;
  border-radius: 8px;
  margin: 1rem;
  background: linear-gradient(75deg, #252525, #c3c3c3);
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
