<template>
  <nav class="navbar">
    <div class="navbar-menu">
      <div class="navbar-start">
        <div class="navbar-item"></div>
      </div>
      <div class="navbar-end">
        <ControlCluster></ControlCluster>
      </div>
    </div>
  </nav>
</template>

<script>
import ControlCluster from "./ControlCluster";

export default {
  name: "Bar",
  components: {
    ControlCluster
  },
  props: {
    msg: String
  }
};
</script>

<style scoped lang="scss"></style>
