<template>
  <div>
    <input type="file" @change="uploadFile" />
    <span class="name">{{ filename }}</span>
  </div>
</template>
<script>
export default {
  data() {
    return {
      filename: ""
    };
  },
  methods: {
    uploadFile(e) {
      const files = e.target.value.files;
      console.error(files);
      this.filename = files.item(0).name;
    }
  }
};
</script>
