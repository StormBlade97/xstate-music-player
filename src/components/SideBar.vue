<template>
  <div class="sidebar-container">
    <div class="header">
      <div class="logo level"></div>
    </div>
    <div class="body">
      <div v-if="this.currentState.matches('ready')" class="trackList">
        <TrackList></TrackList>
      </div>
      <div v-else data-test="sidebar-empty-intro">
        <div class="text-box">
          <p class="title is-3">Hi there</p>
          <p class="subtitle is-5 has-text-grey-dark">
            This your playlist space
          </p>
          <p class="subtitle is-6 has-text-grey-dark">
            Here you can find all the tracks added to the app.
          </p>
          <p>There is nothing right now. Add some tracks to enjoy the music!</p>
        </div>

        <UploadButton @loadFile="uploadFile"></UploadButton>
      </div>
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
  }
};
</script>

<style lang="scss">
.header {
  padding: 1rem;
}
.body {
  padding: 1rem;
}
.logo {
  height: 3.5rem;
  width: 16rem;
  border-radius: 8px;
  background: linear-gradient(75deg, #252525, #c3c3c3);
}
.sidebar-container {
  width: 100%;
  height: 100%;
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
</style>
