<template>
  <v-container>
    <v-btn block @click="clicked()"> Block Button </v-btn>
  </v-container>
</template>

<script>
// Imports
import { Howl, Howler } from "howler";

export default {
  name: "PageAudio",
  transition: "slide-bottom",

  components: {},

  props: {},

  data: () => ({
    path: "/../Formidable_Oak.mp3",
    // path: "@/static/audio/musique/horror/Formidable_Oak.mp3",
    // path: "https://assets.codepen.io/21542/howler-push.mp3",
  }),

  computed: {},

  watch: {},

  mounted() {},

  methods: {
    clicked() {
      const sound = new Howl({
        src: [this.path],
      });

      sound.play();
      console.log(sound);
    },
  },

  head() {
    return { title: "Audio" };
  },
};
</script>
