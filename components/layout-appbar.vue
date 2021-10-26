<template>
  <div>
    <!-- Navigation Drawer -->
    <v-navigation-drawer :mini-variant="miniVariant" clipped fixed app>
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.route"
          class="zoom-sm"
          router
          exact
        >
          <v-list-item-avatar>
            <v-img :src="item.src" max-height="30" max-width="30" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- AppBar -->
    <v-app-bar clipped-left fixed app>
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon>mdi-{{ `chevron-${miniVariant ? "right" : "left"}` }}</v-icon>
      </v-btn>

      <router-link class="text-decoration-none" to="/">
        <v-toolbar-title class="zoom-sm" v-text="'Assistant JDR'" />
      </router-link>
      <v-spacer />
    </v-app-bar>
  </div>
</template>

<script>
// Imports
import { EnumRouter } from "@/models/enums";
import MixinCss from "@/mixins/mixin-css";

export default {
  mixins: [MixinCss],

  data: () => ({
    miniVariant: true,
    items: []
  }),

  mounted() {
    this.items = EnumRouter;
  }
};
</script>
