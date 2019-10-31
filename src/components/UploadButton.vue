<template>
  <div class="file is-medium">
    <label class="file-label">
      <input
        type="file"
        accept="audio/*"
        multiple
        class="file-input"
        @change="updateTrack"
      />
      <div class="file-cta">
        <span class="file-icon icon is-size-4">
          <i class="bx bx-plus"></i>
        </span>
        <span class="file-label has-text-weight-semibold">Add tracks</span>
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
        payload: {
          files: event.target.files
        }
      });
    }
  }
};
</script>
