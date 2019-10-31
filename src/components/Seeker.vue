<template>
  <div class="seeker-root">
    <span class="time-mark">00:00</span>
    <progress class="progress seeker-progress is-primary"></progress>
    <span class="time-mark">4:00</span>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.seeker-root {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  & > * {
    margin-right: 1rem;
  }
}
.seeker-progress {
  height: 4px !important;
  margin: 0;
}
.time-mark {
  margin: 0 1rem;
}
</style>
