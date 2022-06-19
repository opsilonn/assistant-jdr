<template>
  <div>
    <!-- Waiting to load data... -->
    <Loader v-if="isPageLoading" message="Chargement des données..." />

    <!-- data loaded ! -->
    <div v-else>
      <!-- Tab selection -->
      <!-- TO DO : the tabs should stay displayed, and not be scrolled -->
      <v-tabs v-model="selectedTabIndex" grow icons-and-text>
        <v-tab v-for="(tab, i) in tabs" :key="`tab_${i}`">
          <span class="shrink d-none d-sm-flex">{{ tab.title }}</span>
          <v-icon>{{ tab.icon }}</v-icon>
        </v-tab>
      </v-tabs>

      <!-- Tab view -->
      <v-tabs-items v-model="selectedTabIndex">
        <!-- Dynamically create tab view for audio categories -->
        <v-tab-item v-for="(tab, i) in audioCategories" :key="`tab_item_category${i}`" :transition="false" class="scroll">
          <v-list>
            <TreeviewAudio :audioFolder="getAudioFolderByTitle(tab.title)" :enablePlay="true" />
          </v-list>
        </v-tab-item>

        <!-- Manually create tab view for audio playlists -->
        <v-tab-item :transition="false">
          <v-row>
            <!-- left : playlists -->
            <v-col cols="4">
              <!-- Create new playlist -->
              <center>
                <v-btn class="ma-4 zoom-sm primary" rounded @click="openDialogNew()">
                  <v-icon left> mdi-folder-plus </v-icon>
                  Nouvelle Playlist
                </v-btn>
              </center>

              <!-- then, we iterate through playlists -->
              <v-list shaped two-line>
                <v-list-item-group v-model="selectedPlaylistIndex" color="primary">
                  <draggable draggable=".item" :list="[]" @end="DnD_movePlaylist">
                    <div v-for="playlist in playlists" :key="playlist.id" class="item">
                      <v-list-item :key="`playlist_${playlist.id}`">
                        <v-list-item-icon>
                          <v-icon v-text="'mdi-music-note'" />
                        </v-list-item-icon>

                        <v-list-item-content>
                          <v-list-item-title v-text="playlist.name" />
                          <v-list-item-subtitle v-text="`piste${playlist.total ? 's' : ''} : ${playlist.total}`" />
                        </v-list-item-content>

                        <v-list-item-action>
                          <v-icon color="grey lighten-1" v-text="'mdi-dots-vertical'" @click="openDialogEdit(playlist.id)" />
                        </v-list-item-action>
                      </v-list-item>
                    </div>
                  </draggable>
                </v-list-item-group>
              </v-list>
            </v-col>

            <!-- divider -->
            <v-divider vertical />

            <!-- right - current playlist -->
            <v-col cols="8" v-if="selectedPlaylistIndex >= 0" class="scroll">
              <!-- Add audios -->
              <center>
                <v-btn class="ma-4 zoom-sm primary" rounded @click="openDialogPlaylist(playlists[selectedPlaylistIndex].id)">
                  <v-icon left v-text="'mdi-folder-plus'" />
                  Gérer musique
                </v-btn>
              </center>

              <!-- No music warning -->
              <div v-if="!playlists[selectedPlaylistIndex].rootFolder.length">
                <center class="font-italic pa-8">Cette playlist est vide :'(</center>
              </div>

              <!-- playlist's audios -->
              <div v-else>
                <TreeviewAudio
                  :audioFolder="playlists[selectedPlaylistIndex].rootFolder"
                  :idPlaylist="playlists[selectedPlaylistIndex].id"
                  :enablePlay="true"
                />
              </div>
            </v-col>
          </v-row>
        </v-tab-item>
      </v-tabs-items>

      <!-- Dashboard (fixed to the bottom) -->
      <FooterAudio />

      <!-- Dialog to create, update or delete a playlist -->
      <DialogPlaylistData @close-dialog="dialogPlaylist = false" :dialog="dialogPlaylist" :idPlaylist="currentPlaylistId" />

      <!-- Dialog to add or remove audios from a playlist -->
      <DialogPlaylistContent @close-dialog="closeDialogPlaylist()" :dialog="dialogPlaylistAudio" :idPlaylist="currentPlaylistId" />
    </div>
  </div>
</template>

<script>
// Imports
import { mapActions, mapMutations, mapState } from "vuex";
import DialogPlaylistData from "@/components/dialog-playlist-data";
import DialogPlaylistContent from "@/components/dialog-playlist-content";
import FooterAudio from "@/components/footer-audio";
import Loader from "@/components/loader";
import TreeviewAudio from "@/components/treeview-audio";
import draggable from "vuedraggable";

export default {
  name: "PageAudio",
  transition: "slide-bottom",

  components: {
    DialogPlaylistData,
    DialogPlaylistContent,
    FooterAudio,
    Loader,
    TreeviewAudio,
    draggable,
  },

  data: () => ({
    isPageLoading: true,

    // All tabs related
    tabPlaylist: { title: "Playlist", icon: "mdi-playlist-music" },
    tabs: [],
    selectedTabIndex: null,
    selectedPlaylistIndex: -1,

    dialogPlaylist: false,
    currentPlaylistId: "",
    dialogPlaylistAudio: false,
  }),

  computed: {
    // Imports
    ...mapState("audio", ["audioFolder", "audiosDatabase"]),
    ...mapState("playlist", ["playlists"]),
    ...mapState("audioPlayer", ["audioCategories"]),

    /** */
    playlistIds() {
      return this.playlists.map((_) => _.id);
    },
  },

  watch: {
    /** Allows to select the latest playlist if one is added, or deselect if one is deleted */
    playlistIds(newValue, oldValue) {
      if (oldValue.length < newValue.length) {
        // a playlist is added
        this.selectedPlaylistIndex = this.playlists.length - 1;
      } else if (oldValue.length > newValue.length) {
        // a playlist is deleted
        this.selectedPlaylistIndex = -1;
      }
    },
  },

  async mounted() {
    // We set the tabs
    const tabsCategory = JSON.parse(JSON.stringify(this.audioCategories));
    this.tabs = tabsCategory.concat([this.tabPlaylist]);

    // We fetch the audio data
    await this.fetchAudioFolder();

    // We load the audios Database in the playlist's store
    this.setAudiosDatabase(this.audiosDatabase);

    // We fetch the playlists
    await this.fetchAllPlaylists();

    this.selectedPlaylistIndex = -1;

    this.isPageLoading = false;
  },

  methods: {
    // Imports
    ...mapActions("audio", ["fetchAudioFolder"]),
    ...mapActions("playlist", ["fetchAllPlaylists", "createPlaylist", "movePlaylist"]),
    ...mapMutations("audioPlayer", ["stopAllAudioTracks"]),
    ...mapMutations("playlist", ["setAudiosDatabase"]),

    /**
     * Gets a specific folder from the audioFolder, given its title
     * @param {String} name Title of the folder to find
     */
    getAudioFolderByTitle(name) {
      const folder = this.audioFolder.find((folder) => folder.name === name);
      return folder ? folder.children : folder;
    },

    /** */
    openDialogNew() {
      this.currentPlaylistId = "";
      this.dialogPlaylist = true;
    },

    /** */
    openDialogEdit(id) {
      this.currentPlaylistId = id;
      this.dialogPlaylist = true;
    },

    /** */
    openDialogPlaylist(id) {
      this.currentPlaylistId = id;
      this.dialogPlaylistAudio = true;
    },

    /** */
    closeDialogPlaylist() {
      this.dialogPlaylistAudio = false;
    },

    /** */
    async newPlaylist(newPlaylist) {
      await this.createPlaylist(newPlaylist);
      this.dialogPlaylist = false;
    },

    /** */
    DnD_movePlaylist(event) {
      this.movePlaylist({ oldIndex: event.oldIndex, newIndex: event.newIndex });
    },
  },

  /** Whenever the page is exited : remove all audio tracks */
  beforeRouteLeave(to, from, next) {
    // Disable all audio tracks
    this.stopAllAudioTracks();

    // Go to next page
    return next();
  },

  head() {
    return { title: "Audio" };
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
