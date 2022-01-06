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
                  <TreeviewAudio
                    :audioFolder="getAudioFolderByTitle(tab.title)"
                    :idPlaylist="idPlaylist"
                    :enableDnd="true"
                    :enablePlay="true"
                  />
                </v-list>
              </v-tab-item>
            </v-tabs-items>
          </v-col>
          <v-divider vertical />

          <!-- col 2 - playlist -->
          <v-col cols="6">
            <!-- No music warning -->
            <div v-if="!savedPlaylist.rootFolder.length">
              <center class="font-italic pa-8">
                Cette playlist est vide :'(
              </center>
            </div>

            <!-- playlist's audios -->
            <div v-else>
              <TreeviewAudio
                :audioFolder="savedPlaylist.rootFolder"
                :idPlaylist="idPlaylist"
                :enableDnd="true"
                :enableEdit="true"
                :enablePlay="true"
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
import TreeviewAudio from "@/components/treeview-audio";

export default {
  name: "DialogPlaylistAudio",

  components: { TreeviewAudio },

  mixins: [MixinUtils],

  props: {
    idPlaylist: {
      type: String,
      required: true,
    },
    dialog: {
      type: Boolean,
      required: true,
    },
  },

  data: () => ({
    isPlaylistUpdated: false,
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
    ...mapState("playlist", ["playlistDefault", "savedPlaylist"]),
  },

  mounted() {
    EventBus.$on(EventBus.ADD_TO_PLAYLIST, async (file) => this.addFile(file));
    EventBus.$on(EventBus.ADD_FOLDER, async (folderData) =>
      this.addFolder(folderData)
    );
  },

  methods: {
    // Imports
    ...mapActions("playlist", ["fetchSavedPlaylist", "addAudioToPlaylist"]),

    /**
     * Gets a specific folder from the audioFolder, given its title
     * @param {String} name Title of the folder to find
     */
    getAudioFolderByTitle(name) {
      return this.audioFolder.find((folder) => folder.name === name).children;
    },

    /** */
    async addFile(event) {
      console.log(event);
      const audio = this.getAudioById(event.from.id);
      const path = "";
      const index = 0;

      // await this.addAudioToPlaylist({
      //   idPlaylist: this.idPlaylist,
      //   audio: audio,
      //   path: this.currentPath,
      //   index: 0,
      // });
      this.isPlaylistUpdated = true;
    },

    /** */
    async addFolder(folderData) {
      console.log(
        `add folder at path ${folderData.path}, index ${folderData.index}`
      );
      // await this.addAudioToPlaylist({
      //   idPlaylist: this.idPlaylist,
      //   audio: file,
      //   path: '',
      // });
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
