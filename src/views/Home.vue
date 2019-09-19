<template>
  <div id="app">
    <section class="section">
      <div class="container">
        <Bar></Bar>
      </div>
      <div class="container">
        <!-- <Audio></Audio> -->
      </div>
    </section>
  </div>
</template>

<script>
import Bar from "@/components/Bar.vue";

export default {
  name: "home",
  components: {
    Bar
  }
};
</script>
