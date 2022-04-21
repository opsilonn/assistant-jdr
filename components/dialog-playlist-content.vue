<template>
  <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
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
          <v-btn text @click="callResetPlaylist" v-text="'Réinitialiser'" class="black--text" />
          <v-btn text @click="callSavePlaylist" v-text="'Sauvegarder'" />
        </v-toolbar-items>
      </v-toolbar>

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
            <div class="scroll">
              <!-- Dynamically create tab view for audio audioCategories -->
              <v-tab-item v-for="(tab, i) in audioCategories" :key="`tab_item_category${i}`" :transition="false">
                <v-list>
                  <TreeviewAudio :audioFolder="getAudioFolderByTitle(tab.title)" :idPlaylist="idPlaylist" :enableDnd="true" :enablePlay="true" />
                </v-list>
              </v-tab-item>
            </div>
          </v-tabs-items>
        </v-col>
        <v-divider vertical />

        <!-- col 2 - playlist -->
        <v-col cols="6">
          <div class="scroll">
            <draggable v-if="!savedPlaylist.rootFolder.length" class="playlist" :list="[]" group="node" id="prout">
              <v-row>
                <v-col>
                  <!-- No music warning -->
                  <div>
                    <center class="font-italic pa-8">Cette playlist est vide :'(</center>
                  </div>
                </v-col>
              </v-row>
            </draggable>

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
          </div>
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script>
// Imports
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";
import MixinAudio from "@/mixins/mixin-audio";
import EventBus from "@/EventBus.js";
import TreeviewAudio from "@/components/treeview-audio";
import draggable from "vuedraggable";

export default {
  name: "DialogPlaylistContent",

  components: { draggable, TreeviewAudio },

  mixins: [MixinAudio],

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
        this.resetSavedPlaylist({});
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
    EventBus.$on(EventBus.ADD_FOLDER, async (folderData) => this.addFolder(folderData));
  },

  methods: {
    // Imports
    ...mapActions("playlist", ["fetchSavedPlaylist", "addAudioToPlaylist", "resetPlaylist", "savePlaylist"]),
    ...mapMutations("playlist", ["resetSavedPlaylist"]),

    /**
     * Gets a specific folder from the audioFolder, given its title
     * @param {String} name Title of the folder to find
     */
    getAudioFolderByTitle(name) {
      return this.audioFolder.find((folder) => folder.name === name).children;
    },

    /** */
    async addFile(event) {
      const audioToAdd = this.getAudioById(event.from.id, this.audioFolder);
      let idFolder = "";
      let index = 0;

      if (event.to.className.includes("folder")) {
        idFolder = event.to.id;
        index = 0;
      } else {
        // We get the folder the audio is in (if root folder, id is undefined)
        const folder = this.getSubfolderByItemId(event.to.id, this.savedPlaylist.rootFolder);

        if (!!folder) {
          // found folder
          const audioNextTo = this.getAudioById(event.to.id, this.savedPlaylist.rootFolder);
          idFolder = folder.id;
          index = folder.children.indexOf(audioNextTo);
        } else {
          // root folder
          const audioNextTo = this.getAudioById(event.to.id, this.savedPlaylist.rootFolder);
          idFolder = "";
          index = Math.max(0, this.savedPlaylist.rootFolder.indexOf(audioNextTo));
        }
      }

      await this.addAudioToPlaylist({
        idPlaylist: this.idPlaylist,
        audio: audioToAdd,
        idFolder: idFolder,
        index: index,
      });
      this.isPlaylistUpdated = true;
    },

    /** */
    async addFolder(folderData) {
      // await this.addAudioToPlaylist({
      //   idPlaylist: this.idPlaylist,
      //   audio: file,
      //   path: '',
      // });
      this.isPlaylistUpdated = true;
    },

    /** Emits the event to close the dialog */
    closeDialog() {
      if (!this.isPlaylistUpdated || confirm("Vous avez fait des changements !\nÊtes-vous sûr de vouloir quitter ?")) {
        this.$emit("close-dialog");
      }
    },

    /** */
    async callResetPlaylist() {
      await this.resetPlaylist({ idPlaylist: this.idPlaylist });
    },

    /** */
    async callSavePlaylist() {
      this.savePlaylist({ idPlaylist: this.idPlaylist }).then(() => this.$emit("close-dialog"));
    },
  },
};
</script>

<style scoped>
.scroll {
  height: 750px;
  overflow: scroll;
  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
/* Hide scrollbar for Chrome, Safari and Opera */
.scroll::-webkit-scrollbar {
  display: none;
}
</style>
