<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="closeDialog">
          <v-icon v-text="'mdi-close'" />
        </v-btn>

        <v-toolbar-title>
          Éditer playlist :
          <span class="font-italic">{{ playlist.name }} </span>
        </v-toolbar-title>

        <v-spacer />

        <v-toolbar-items>
          <v-btn text @click="closeDialog" v-text="'Sauvegarder'" />
        </v-toolbar-items>
      </v-toolbar>

      <v-container>
        <v-row justify="center">
          <!-- col 1 - audio to select from -->
          <v-col cols="6">
            <!-- TO DO : the tabs should stay displayed, and not be scrolled -->
            <v-tabs v-model="selectedTabIndex" grow icons-and-text>
              <v-tab v-for="(tab, i) in audioCategories" :key="`tab_${i}`">
                <span class="shrink d-none d-sm-flex" v-text="tab.title" />
                <v-icon v-text="tab.icon" />
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
                  <ListItemAudio
                    :audioFolder="getAudioFolderByTitle(tab.title)"
                    :idPlaylist="idPlaylist"
                  />
                </v-list>
              </v-tab-item>
            </v-tabs-items>
          </v-col>
          <v-divider vertical />

          <!-- col 2 - playlist -->
          <v-col cols="6">
            <!-- No music warning -->
            <div
              v-if="
                !playlist.rootFolder.folders.length &&
                !playlist.rootFolder.files.length
              "
            >
              <center class="font-italic pa-8">
                Cette playlist est vide :'(
              </center>
            </div>

            <!-- playlist's audios -->
            <div v-else>
              <ListItemAudio
                :audioFolder="playlist.rootFolder"
                :idPlaylist="playlist.id"
                :enableEdit="true"
              />
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
// Imports
import { mapActions, mapState, mapGetters } from "vuex";

export default {
  name: "DialogPlaylistAudio",

  props: {
    idPlaylist: {
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
    playlistEdited: {},
  }),

  watch: {
    /** whenever the dialog is opened */
    dialog() {
      if (this.dialog) {
        // get the Playlist
        this.playlistEdited = JSON.parse(JSON.stringify(this.playlist));
      }
    },
  },

  computed: {
    // Imports
    ...mapGetters("playlist", ["getPlaylistById"]),
    ...mapState("audio", ["audioFolder"]),
    ...mapState("audioPlayer", ["audioCategories"]),
    ...mapState("playlist", ["playlistDefault"]),

    /** Emits the event to close the dialog */
    playlist() {
      return this.getPlaylistById(this.idPlaylist) || this.playlistDefault;
    },
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
  },
};
</script>
