<template>
  <div class="level">
    <div class="level-item">
      <div class="field">
        <p class="subtitle is-5 has-text-grey mb3">
          You don't have any song yet
        </p>
        <div class="control"></div>
        <div class="file is-boxed is-centered is-primary">
          <label class="file-label full-width">
            <input
              type="file"
              accept="audio/*"
              multiple
              class="file-input"
              @change="updateTrack"
            />
            <div class="file-cta">
              <span class="file-icon icon is-size-5 is-marginless">
                <i class="bx bx-upload"></i>
              </span>
              <span class="has-text-weight-bold file-label">Upload</span>
            </div>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "UploadSound",
  methods: {
    updateTrack(event) {
      this.send({
        type: "UPLOAD_TRACK",
        files: event.target.files
      });
    }
  }
};
</script>
<style>
.full-width {
  width: 100%;
}
.mb3 {
  margin-bottom: 1rem !important;
}
</style>
