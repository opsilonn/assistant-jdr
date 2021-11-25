<template>
  <div>
    <!-- Waiting to load data... -->
    <Loader v-if="!isPageLoaded" message="Chargement des données..." />

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
        <v-tab-item
          v-for="(tab, i) in audioCategories"
          :key="`tab_item_category${i}`"
          :transition="false"
        >
          <v-list v-if="isPageLoaded">
            <ListItemAudio
              :audioFolder="getAudioFolderByTitle(tab.title)"
              :enableAudioMgmt="true"
            />
          </v-list>
        </v-tab-item>

        <!-- Manually create tab view for audio playlists -->
        <v-tab-item :transition="false">
          <v-row>
            <!-- left : playlists -->
            <v-col cols="4">
              <!-- Create new playlist -->
              <center>
                <v-btn
                  class="ma-4 zoom-sm primary"
                  rounded
                  @click="openDialogNew()"
                >
                  <v-icon left> mdi-folder-plus </v-icon>
                  Nouvelle Playlist
                </v-btn>
              </center>

              <!-- then, we iterate through playlists -->
              <v-list shaped two-line>
                <v-list-item-group
                  v-model="selectedPlaylistIndex"
                  color="primary"
                >
                  <v-list-item
                    v-for="(playlist, i) in playlists"
                    :key="`playlist_${playlist.id}`"
                  >
                    <v-list-item-icon>
                      <v-icon v-text="'mdi-music-note'" />
                    </v-list-item-icon>

                    <v-list-item-content>
                      <v-list-item-title v-text="playlist.name" />
                      <v-list-item-subtitle
                        v-text="
                          `piste${playlist.total ? 's' : ''} : ${
                            playlist.total
                          }`
                        "
                      />
                    </v-list-item-content>

                    <v-list-item-action>
                      <v-icon
                        color="grey lighten-1"
                        v-text="'mdi-dots-vertical'"
                        @click="openDialogEdit(playlist.id)"
                      />
                    </v-list-item-action>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-col>

            <!-- divider -->
            <v-divider vertical />

            <!-- right - current playlist -->
            <v-col cols="8" v-if="selectedPlaylistIndex >= 0">
              <!-- Add audios -->
              <center>
                <v-btn
                  class="ma-4 zoom-sm primary"
                  rounded
                  @click="
                    openDialogPlaylist(playlists[selectedPlaylistIndex].id)
                  "
                >
                  <v-icon left> mdi-folder-plus </v-icon>
                  Ajouter musique
                </v-btn>
              </center>

              <!-- No music warning -->
              <div
                v-if="
                  !playlists[selectedPlaylistIndex].rootFolder.folders.length &&
                  !playlists[selectedPlaylistIndex].rootFolder.files.length
                "
              >
                <center class="font-italic pa-8">
                  Cette playlist est vide :'(
                </center>
              </div>

              <!-- playlist's audios -->
              <div v-else>
                <ListItemAudio
                  :audioFolder="playlists[selectedPlaylistIndex].rootFolder"
                  :idPlaylist="playlists[selectedPlaylistIndex].id"
                  :enableAudioMgmt="true"
                  :enableEdit="true"
                />
              </div>
            </v-col>
          </v-row>
        </v-tab-item>
      </v-tabs-items>

      <!-- TO DO : remove this "br" tag and find a proper way to ensure that the footer never covers any data -->
      <br v-for="n in 10" :key="n" />

      <!-- Dashboard (fixed to the bottom) -->
      <FooterAudio />

      <!-- Dialog to create, update or delete a playlist -->
      <DialogPlaylist
        @close-dialog="dialogPlaylist = false"
        :dialog="dialogPlaylist"
        :idPlaylist="currentPlaylistId"
        @playlist-new="newPlaylist"
        @playlist-edit="editPlaylist"
        @playlist-delete="deletePlaylist"
      />

      <!-- Dialog to add or remove audios from a playlist -->
      <DialogPlaylistAudio
        @close-dialog="dialogPlaylistAudio = false"
        :dialog="dialogPlaylistAudio"
        :idPlaylist="currentPlaylistId"
      />
    </div>
  </div>
</template>

<script>
// Imports
import { Howl, Howler } from "howler";
import { mapActions, mapState, mapMutations } from "vuex";
import DialogPlaylist from "@/components/dialog-playlist";
import DialogPlaylistAudio from "@/components/dialog-playlist-audio";
import ListItemAudio from "@/components/list-item-audio";
import Loader from "@/components/loader";
import FooterAudio from "@/components/footer-audio";

export default {
  name: "PageAudio",
  transition: "slide-bottom",

  components: {
    DialogPlaylist,
    DialogPlaylistAudio,
    FooterAudio,
    ListItemAudio,
    Loader,
  },

  data: () => ({
    // Whether the page is loaded or not
    isPageLoaded: false,

    // All tabs related
    tabPlaylist: { title: "Playlist", icon: "mdi-playlist-music" },
    tabs: [],
    selectedTabIndex: null,
    selectedPlaylistIndex: -1,

    dialogPlaylist: false,
    currentPlaylistId: undefined,
    dialogPlaylistAudio: false,
  }),

  computed: {
    // Imports
    ...mapState("audio", ["audioFolder"]),
    ...mapState("playlist", ["playlists"]),
    ...mapState("audioPlayer", ["audioCategories"]),

    /** */
    playlistIds() {
      return this.playlists.map((_) => _.id);
    },
  },

  watch: {
    /** */
    playlistIds(newValue, oldValue) {
      if (oldValue.length < newValue.length) {
        this.selectedPlaylistIndex = this.playlists.length - 1;
      } else if (oldValue.length > newValue.length) {
        this.selectedPlaylistIndex = -1;
      }
    },
  },

  async mounted() {
    // We fetch the audio data
    await this.fetchAudioFolder();

    // We fetch the playlists
    await this.fetchAllPlaylists();

    // Set tabs
    const tabsCategory = JSON.parse(JSON.stringify(this.audioCategories));
    this.tabs = tabsCategory.concat([this.tabPlaylist]);

    this.selectedPlaylistIndex = -1;

    // All is complete, we consider the page loaded
    this.isPageLoaded = true;
  },

  methods: {
    // Imports
    ...mapActions("audio", ["fetchAudioFolder"]),
    ...mapActions("playlist", ["fetchAllPlaylists", "createPlaylist"]),
    ...mapMutations("audioPlayer", ["stopAllAudioTracks"]),

    /**
     * Gets a specific folder from the audioFolder, given its title
     * @param {String} name Title of the folder to find
     */
    getAudioFolderByTitle(name) {
      return this.audioFolder.folders.find((folder) => folder.name === name);
    },

    /** */
    openDialogNew() {
      this.currentPlaylistId = undefined;
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
    async newPlaylist(newPlaylist) {
      const x = await this.createPlaylist(newPlaylist);
      this.dialogPlaylist = false;
    },

    /** */
    editPlaylist(newPlaylist) {},

    /** */
    deletePlaylist() {},
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

<style>
/*
.v-list {
  height: 100%;
  overflow-y: auto;
}
*/
</style>
