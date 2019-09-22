<template>
  <div id="app">
    <section class="section">
      <div class="container">
        <Bar></Bar>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <Player></Player>
      </div>
    </section>
  </div>
</template>

<script>
import Bar from "@/components/Bar.vue";
import Player from "@/components/Player.vue";

export default {
  name: "home",
  components: {
    Bar,
    Player
  }
};
</script>
