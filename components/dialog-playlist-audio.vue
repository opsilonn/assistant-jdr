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
          <span class="font-italic">{{ savedPlaylist.name }} </span>
        </v-toolbar-title>

        <v-spacer />

        <v-toolbar-items>
          <v-btn text @click="savePlaylist" v-text="'Sauvegarder'" />
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
                    :enablePlay="true"
                    :enableAddition="true"
                  />
                </v-list>
              </v-tab-item>
            </v-tabs-items>
          </v-col>
          <v-divider vertical />

          <!-- col 2 - playlist -->
          <v-col cols="6">
            <div class="d-flex justify-center align-center mb-6">
              <span>Décaler sélecteur à chaque ajout :</span>
              <v-switch v-model="moveSelector" />
            </div>

            <!-- No music warning -->
            <div
              v-if="
                !savedPlaylist.rootFolder.folders.length &&
                !savedPlaylist.rootFolder.files.length
              "
            >
              <center class="font-italic pa-8">
                Cette playlist est vide :'(
              </center>
            </div>

            <!-- playlist's audios -->
            <div v-else>
              <ListItemAudio
                :audioFolder="savedPlaylist.rootFolder"
                :idPlaylist="idPlaylist"
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
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";
import MixinUtils from "@/mixins/mixin-utils";
import EventBus from "@/EventBus.js";

export default {
  name: "DialogPlaylistAudio",

  mixins: [MixinUtils],

  props: {
    idPlaylist: {
      type: Number,
      required: true,
    },
    dialog: {
      type: Boolean,
      required: true,
    },
  },

  data: () => ({
    isPlaylistUpdated: false,
    moveSelector: true,
    selectedTabIndex: null,
  }),

  watch: {
    /** whenever the dialog is opened */
    dialog() {
      if (this.dialog) {
        // get the Playlist
        this.fetchSavedPlaylist({ id: this.idPlaylist });
        this.isPlaylistUpdated = false;
      }
    },
  },

  computed: {
    // Imports
    ...mapGetters("playlist", ["getPlaylistById"]),
    ...mapState("audio", ["audioFolder"]),
    ...mapState("audioPlayer", ["audioCategories"]),
    ...mapState("playlist", [
      "playlistDefault",
      "savedPlaylist",
      "currentPath",
      "currentIndex",
    ]),

    files() {
      return this.savedPlaylist.rootFolder.files;
    },
  },

  mounted() {
    EventBus.$on(EventBus.ADD_TO_PLAYLIST, async (file) =>
      this.addToPlaylist(file)
    );
  },

  methods: {
    // Imports
    ...mapActions("playlist", ["fetchSavedPlaylist", "addAudioToPlaylist"]),
    ...mapMutations("playlist", ["incrementPlaylistHelper"]),

    /**
     * Gets a specific folder from the audioFolder, given its title
     * @param {String} name Title of the folder to find
     */
    getAudioFolderByTitle(name) {
      return this.audioFolder.folders.find((folder) => folder.name === name);
    },

    /** */
    async addToPlaylist(file) {
      // If no index is set : error ?
      if (this.currentIndex < 0) {
        // Do something to show that an index should be selected
        return;
      }

      /*
      // We get the folder
      const folder = this.getSubfolder(
        this.playlistEdited.rootFolder,
        this.currentPath
      );
      // If found, we update the folder
      if (folder) {
        folder.files.splice(this.currentIndex, 0, file);
        this.playlistEdited.total++;

        // We update the selector if the user chose to
        if (this.moveSelector) {
          this.incrementPlaylistHelper();
        }
      }
      */
      await this.addAudioToPlaylist({
        idPlaylist: this.idPlaylist,
        audio: file,
        path: this.currentPath,
        index: this.currentIndex,
      });
      this.isPlaylistUpdated = true;
    },

    /** Emits the event to close the dialog */
    closeDialog() {
      if (
        !this.isPlaylistUpdated ||
        confirm(
          "Vous avez fait des changements !\nÊtes-vous sûr de vouloir quitter ?"
        )
      ) {
        this.$emit("close-dialog");
      }
    },

    /** */
    async savePlaylist() {
      // const params = {
      //   idPlaylist: this.idPlaylist,
      //   audio: file,
      // };
      // await this.addAudioToPlaylist(params);
      await this.$emit("close-dialog");
    },
  },
};
</script>
