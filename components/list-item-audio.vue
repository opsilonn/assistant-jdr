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
      v-for="(file, i) in files"
      :key="i"
      two-line
      link
      @click="setAudio(file)"
    >
      <!-- icon -->
      <v-list-item-icon>
        <v-icon v-text="'mdi-music-note'" />
      </v-list-item-icon>

      <!-- Text -->
      <v-list-item-content>
        <v-list-item-title v-text="file.surname ? file.surname : file.name" />
        <v-list-item-subtitle v-if="file.surname" v-text="file.name" />
      </v-list-item-content>

      <!-- actions -->
      <v-list-item-action class="d-flex flex-row ma-4">
        <v-icon class="zoom" color="grey lighten-1" v-text="'mdi-pencil'" />
        <v-icon
          class="zoom"
          color="grey lighten-1"
          v-text="'mdi-plus-circle'"
        />
        <v-icon class="zoom" color="grey lighten-1" v-text="'mdi-delete'" />
      </v-list-item-action>
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

  computed: {
    /** */
    files() {
      return !!this.audioFolder.files
        ? this.audioFolder.files
        : this.audioFolder.audios;
    },
  },

  methods: {
    /** */
    setAudio(file) {
      this.$emit("set-audio", file);
    },

    /** */
    removeAudioFromPlaylist(file) {
      this.$emit("remove-audio-from-playlist", file);
    },

    /** */
    addAudioFromPlaylist(file) {
      this.$emit("add-audio-from-playlist", file);
    },

    /** */
    editAudioFromPlaylist(file) {
      this.$emit("edit-audio-from-playlist", file);
    },
  },
};
</script>
