<template>
  <div
    class="selector"
    :class="currentPath === path && currentIndex === index ? 'active' : ''"
    @click="setSelectedFile()"
  ></div>
</template>

<script>
// Imports
import { mapMutations, mapState } from "vuex";

export default {
  name: "PlaylistSelector",

  props: {
    path: {
      type: String,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
  },

  computed: {
    // Imports
    ...mapState("playlist", ["currentPath", "currentIndex"]),
  },

  methods: {
    // Imports
    ...mapMutations("playlist", ["setPlaylistHelper"]),

    /** */
    setSelectedFile() {
      this.setPlaylistHelper({ path: this.path, index: this.index });
    },
  },
};
</script>

<style>
.selector {
  height: 10px;
  width: 20%;
  background-color: rgb(50, 50, 50);
  transition: all 0.15s linear;
}
.selector:hover {
  background-color: rgb(75, 75, 75);
  transform: scale(1.05);
}
.selector.active {
  background-color: rgb(79, 195, 247);
}
</style>
