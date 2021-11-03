<template>
  <v-app dark>
    <!-- App bar (navbar) -->
    <LayoutAppBar />

    <!-- Container for Nuxt's page -->
    <v-main class="background">
      <div class="fill-height" fluid>
        <nuxt />
      </div>
    </v-main>

    <!-- footer -->
    <LayoutFooter v-if="showFooter" />
  </v-app>
</template>

<script>
// Imports
import { EnumRouter } from "@/models/enums";
import LayoutAppBar from "@/components/layout-appbar";
import LayoutFooter from "@/components/layout-footer";

export default {
  components: {
    LayoutAppBar,
    LayoutFooter,
  },

  data: () => ({
    src: "",
    srcDefault: "",
    showFooter: false,
  }),

  watch: {
    $route(to, from) {
      this.setSourceImage();
    },
  },

  mounted() {
    this.setSourceImage();
  },

  methods: {
    /** Sets the value of the image to display, if any */
    setSourceImage() {
      let key = Object.keys(EnumRouter).find(
        (key) => EnumRouter[key].route === this.$route.path
      );
      this.src = !!EnumRouter[key] ? EnumRouter[key].src : this.srcDefault;
    },
  },
};
</script>
