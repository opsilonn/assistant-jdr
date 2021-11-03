<template>
  <div>
    <!-- content - folders -->
    <v-list-item v-for="(folder, i) in audioFolder.folders" :key="i">
      <v-list-group sub-group>
        <!-- title -->
        <template v-slot:activator>
          <v-list-item-title class="font-weight-black" v-text="folder.name" />
        </template>

        <!-- recursive : call self -->
        <ListItemAudio :audioFolder="folder" @set-audio="setAudio" />
      </v-list-group>
    </v-list-item>

    <!-- content - files -->
    <v-list-item
      v-for="(file, i) in audioFolder.files"
      :key="i"
      two-line
      link
      @click="setAudio(file)"
    >
      <v-list-item-icon>
        <v-icon v-text="'mdi-music-note'" />
      </v-list-item-icon>

      <v-list-item-content>
        <v-list-item-title v-text="file.name" />
        <v-list-item-subtitle v-text="file.name" />
      </v-list-item-content>
    </v-list-item>
  </div>
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
  methods: {
    /** */
    setAudio(file) {
      this.$emit("set-audio", file);
    },
  },
};
</script>
