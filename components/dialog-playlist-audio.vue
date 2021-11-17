<template>
  <v-container>
    <!-- Dialog -->
    <v-dialog v-model="dialog" max-width="500px" @click:outside="closeDialog">
      <v-card>
        <!-- Title -->
        <v-card-title
          class="headline primary--text"
          v-text="'Sélectionner les musiques de la playlist'"
        />

        <!-- Content -->
        <v-card-text>
          <!-- TO DO : the tabs should stay displayed, and not be scrolled -->
          <v-tabs v-model="selectedTabIndex" grow icons-and-text>
            <v-tab v-for="(tab, i) in audioCategories" :key="`tab_${i}`">
              <span class="shrink d-none d-sm-flex">{{ tab.title }}</span>
              <v-icon>{{ tab.icon }}</v-icon>
            </v-tab>
          </v-tabs>

          <!-- Tab view -->
          <v-tabs-items v-model="selectedTabIndex">
            <!-- Dynamically create tab view for audio audioCategories -->
            <v-tab-item
              v-for="(tab, i) in audioCategories"
              :key="`tab_item_category${i}`"
              :transition="false"
            >
              <v-list>
                <ListItemAudioManager
                  :audioFolder="getAudioFolderByTitle(tab.title)"
                  @set-audio="setAudio"
                  :enableAudioMgmt="true"
                />
              </v-list>
            </v-tab-item>
          </v-tabs-items>
        </v-card-text>

        <!-- Actions -->
        <v-card-actions>
          <v-spacer />
          <!-- Button : action -->
          <v-btn color="success" text v-text="'Valider'" />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
// Imports
import { mapActions, mapState, mapGetters } from "vuex";

export default {
  name: "DialogPlaylistAudio",

  props: {
    playlistId: {
      type: Number,
      required: false,
    },
    dialog: {
      type: Boolean,
      required: true,
    },
  },

  data: () => ({
    selectedTabIndex: null,
  }),

  watch: {
    /** whenever the dialog is opened */
    dialog() {
      if (this.dialog) {
        // get the Playlist
        const playlist = this.getPlaylist(this.playlistId);
      }
    },
  },

  computed: {
    // Imports
    ...mapState("audio", ["audioFolder"]),
    ...mapGetters("playlist", ["getPlaylist"]),
    ...mapState("audioPlayer", ["audioCategories"]),
  },

  methods: {
    /** Emits the event to close the dialog */
    closeDialog() {
      this.$emit("close-dialog");
    },

    /**
     * Gets a specific folder from the audioFolder, given its title
     * @param {String} name Title of the folder to find
     */
    getAudioFolderByTitle(name) {
      return this.audioFolder.folders.find((folder) => folder.name === name);
    },

    setAudio() {
      console.log("IMPLEMENT ME !!!");
    },

    /** */
    remove() {},

    /** */
    action() {},
  },
};
</script>
