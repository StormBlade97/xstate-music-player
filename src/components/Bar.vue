<template>
  <nav class="navbar">
    <div class="navbar-menu">
      <div class="navbar-start">
        <div class="navbar-item">
          <Info></Info>
        </div>
      </div>
      <div class="navbar-end">
        <ControlCluster></ControlCluster>
      </div>
    </div>
  </nav>
</template>

<script>
import ControlCluster from "./ControlCluster";
import Info from "./Info";

export default {
  name: "Bar",
  components: {
    ControlCluster,
    Info
  },
  props: {
    msg: String
  }
};
</script>

<style scoped lang="scss"></style>
