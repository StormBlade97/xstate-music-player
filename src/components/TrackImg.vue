<template>
  <div
    class="album-art anchor is-unshrinkable is-clipped"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div v-if="enableControl">
      <div
        class="playing-indicator is-overlay has-neon-shadow-text has-beat-animation centerize"
        v-if="isPlaying"
      >
        <span class="icon">
          <i class="bx bx-volume-full bx-sm"></i>
        </span>
      </div>
      <div
        class="hover-control is-overlay has-text-white centerize"
        v-else-if="showHoverControl"
      >
        <span class="icon">
          <i class="bx bx-play bx-sm"></i>
        </span>
      </div>
    </div>
    <img
      @load="handleImgLoad"
      @error="handleImgError"
      :src="src"
      alt
      :v-if="src && loadStatus == LoadStateEnum.SUCCESS"
      class="image is-overlay is-clipped has-fade-in-animation"
      key="ii"
      :class="(showHoverControl || isPlaying) && 'has-blur-animation'"
    />
    <div class="default-art is-overlay centerize">
      <span v-if="!showHoverControl && !isPlaying" class="icon">
        <i class="bx bxs-music bx-sm"></i>
      </span>
    </div>
  </div>
</template>
<script>
const LoadStateEnum = {
  INITIAL: "initial",
  PENDING: "pending",
  SUCCESS: "success",
  ERROR: "error"
};
export default {
  name: "TrackImg",
  data() {
    return {
      loadStatus: LoadStateEnum.INITIAL,
      showHoverControl: false
    };
  },
  props: {
    src: String,
    isPlaying: Boolean,
    enableControl: Boolean
  },
  methods: {
    handleImgLoad(e) {
      this.loadStatus = e.target.complete
        ? LoadStateEnum.SUCCESS
        : LoadStateEnum.PENDING;
    },
    handleImgError() {
      this.loadStatus = LoadStateEnum.ERROR;
    },
    handleMouseEnter() {
      if (this.enableControl) {
        this.showHoverControl = true;
      }
    },
    handleMouseLeave() {
      this.showHoverControl = false;
    }
  },
  computed: {
    LoadStateEnum() {
      return LoadStateEnum;
    }
  }
};
</script>
<style lang="scss" scoped>
@import "@/main.scss";

.album-art {
  border-radius: $radius-medium;

  & > * {
    border-radius: $radius-medium;
  }
  & > img {
    z-index: 3;
    object-fit: cover;
    height: 100%;
  }
}
.centerize {
  display: flex;
  justify-content: center;
  align-items: center;
}
.default-art {
  background-image: linear-gradient(60deg, #29323c 0%, #485563 100%);

  z-index: 1;
}
.hover-control {
  z-index: 10;
}
.playing-indicator {
  z-index: 10;
}
.blurred-cover {
  opacity: 0;
  transition: opacity 0.7s ease;
  filter: blur(8px);
  z-index: 4;
}
.blurred-cover-show {
  opacity: 1;
}
</style>
