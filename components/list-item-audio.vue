<template>
  <v-list-group sub-group>
    <!-- title -->
    <template v-slot:activator>
      <v-list-item-title> {{ audioFolder.name }} </v-list-item-title>
    </template>

    <!-- content - folders -->
    <v-list-item v-for="(folder, i) in audioFolder.folders" :key="i" link>
      <ListItemAudio :audioFolder="folder" />
    </v-list-item>

    <!-- content - files -->
    <v-list-item v-for="(file, i) in audioFolder.files" :key="i" link>
      <v-list-item-title v-text="file.name" />

      <v-list-item-icon>
        <v-icon v-text="'mdi-account-box'" />
      </v-list-item-icon>
    </v-list-item>
  </v-list-group>
</template>

<script>
// Imports
import ListItemAudio from "@/components/list-item-audio";

export default {
  name: "ListItemAudio",

  components: { ListItemAudio },

  props: {
    audioFolder: {
      type: [],
      required: false,
    },
  },
};
</script>
