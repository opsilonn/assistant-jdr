<template>
  <v-card>
    <v-toolbar>
      <template v-slot:extension>
        <v-btn fab color="cyan accent-2" bottom left absolute>
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>
    </v-toolbar>

    <v-list two-line subheader>
      <v-subheader inset> Folders </v-subheader>

      <v-list-item v-for="item in items" :key="item.title" link>
        <v-list-item-avatar>
          <v-icon :class="[item.iconClass]">
            {{ item.icon }}
          </v-icon>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>

          <v-list-item-subtitle>{{ item.subtitle }}</v-list-item-subtitle>
        </v-list-item-content>

        <v-list-item-action>
          <v-btn icon>
            <v-icon color="grey lighten-1"> mdi-information </v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>

      <v-divider inset></v-divider>
    </v-list>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
    items: [
      {
        icon: "mdi-folder",
        iconClass: "grey lighten-1 white--text",
        title: "Photos",
        subtitle: "Jan 9, 2014",
      },
      {
        icon: "mdi-folder",
        iconClass: "grey lighten-1 white--text",
        title: "Recipes",
        subtitle: "Jan 17, 2014",
      },
      {
        icon: "mdi-folder",
        iconClass: "grey lighten-1 white--text",
        title: "Work",
        subtitle: "Jan 28, 2014",
      },
    ],
  }),
};
</script>
