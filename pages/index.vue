<template>
  <v-container>
    <v-row>
      <v-col v-for="(item, i) in items" :key="i" class="d-flex child-flex">
        <v-card class="zoom-sm" max-width="374" :to="item.route">
          <v-img :src="item.src" contains />

          <v-divider class="mx-4"></v-divider>

          <v-card-title>{{ item.title }}</v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// Imports
import { EnumRouter } from "@/models/enums";
import MixinCss from "@/mixins/mixin-css";

export default {
  name: "PageIndex",
  transition: "slide-bottom",

  mixins: [MixinCss],

  data: () => ({
    items: []
  }),

  mounted() {
    this.items = EnumRouter;
  },

  head() {
    return { title: "index" };
  }
};
</script>
