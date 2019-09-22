<template>
  <div class="file is-primary">
    <label class="file-label">
      <input
        type="file"
        accept="audio/*"
        multiple
        class="file-input"
        @change="updateTrack"
      />
      <div class="file-cta">
        <span class="has-text-weight-bold file-label">Upload</span>
        <span class="file-icon icon is-size-5 is-marginless">
          <i class="bx bx-plus"></i>
        </span>
      </div>
    </label>
  </div>
</template>
<script>
export default {
  name: "UploadButton",
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
