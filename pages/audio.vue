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
          v-for="(tab, i) in tabsCategory"
          :key="`tab_item_category${i}`"
          :transition="false"
        >
          <v-list v-if="isPageLoaded">
            <ListItemAudio
              :audioFolder="getAudioFolderByTitle(tab.title)"
              @set-audio="setAudio"
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
                          `piste${playlist.audios.length > 1 ? 's' : ''} : ${
                            playlist.audios.length
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
                <v-btn class="ma-4 zoom-sm primary" rounded>
                  <v-icon left> mdi-folder-plus </v-icon>
                  Ajouter musique
                </v-btn>
              </center>

              <!-- No music warning -->
              <div v-if="playlists[selectedPlaylistIndex].audios.length === 0">
                <center class="font-italic pa-8">
                  Cette playlist est vide :'(
                </center>
              </div>

              <!-- playlist's audios -->
              <div v-else>
                <ListItemAudio
                  :audioFolder="playlists[selectedPlaylistIndex]"
                  @set-audio="setAudio"
                />
              </div>
            </v-col>
          </v-row>
        </v-tab-item>
      </v-tabs-items>

      <!-- TO DO : remove this "br" tag and find a proper way to ensure that the footer never covers any data -->
      <br v-for="n in 10" :key="n" />

      <!-- Dashboard (fixed to the bottom) -->
      <v-footer fixed padless>
        <v-card flat tile width="100%" class="text-center grey darken-3">
          <div v-for="(tab, i) in tabsCategory" :key="i">
            <v-row align="center">
              <!-- col 1 - category -->
              <v-col cols="3">
                <h3 class="font-weight-bold text-right" v-text="tab.title" />
              </v-col>

              <!-- col 2 - name -->
              <v-col cols="6">
                <v-card-text>
                  <div>
                    {{ tab.audio.surname || tab.audio.name || "..." }}
                  </div>
                  <div v-if="tab.audio.surname">
                    {{ tab.audio.name }}
                  </div>
                </v-card-text>
              </v-col>

              <!-- col 3 - buttons -->
              <v-col cols="3">
                <v-row align="center">
                  <!-- slider sound -->
                  <v-col cols="6">
                    <!-- TO DO : center vertically the slider -->
                    <v-slider
                      v-model="tab.volume"
                      track-color="grey darken-1"
                      step="0.05"
                      min="0"
                      max="1"
                      thumb-label
                      hide-detail
                    />
                  </v-col>
                  <v-col cols="6">
                    <!-- button play / pause -->
                    <v-btn icon @click="setPlayOrPause(tab.title)">
                      <v-icon v-text="tab.play ? 'mdi-pause' : 'mdi-play'" />
                    </v-btn>

                    <!-- button loop -->
                    <v-btn icon @click="setLoop(tab.title)">
                      <v-icon v-text="'mdi-autorenew'" :disabled="!tab.loop" />
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>

            <!-- Divider, except last row -->
            <v-divider v-if="i !== tabsCategory.length - 1" />
          </div>
        </v-card>
      </v-footer>

      <!-- Dialog to create, update or delete a playlist -->
      <DialogPlaylist
        @close-dialog="closeDialog()"
        :dialog="dialogPlaylist"
        :playlistId="dialogPlaylistId"
        @playlist-new="newPlaylist"
        @playlist-edit="editPlaylist"
        @playlist-delete="deletePlaylist"
      />
    </div>
  </div>
</template>

<script>
// Imports
import { Howl, Howler } from "howler";
import { mapActions, mapState } from "vuex";
import DialogPlaylist from "@/components/dialog-playlist";
import ListItemAudio from "@/components/list-item-audio";
import Loader from "@/components/loader";

export default {
  name: "PageAudio",
  transition: "slide-bottom",

  components: { DialogPlaylist, ListItemAudio, Loader },

  data: () => ({
    // Whether the page is loaded or not
    isPageLoaded: false,

    // All tabs related
    tabsCategory: [
      {
        title: "Ambiance",
        icon: "mdi-city-variant-outline",
        audio: {},
        howl: undefined,
        play: false,
        loop: false,
        volume: 1,
      },
      {
        title: "Musique",
        icon: "mdi-music-note",
        audio: {},
        howl: undefined,
        play: false,
        loop: false,
        volume: 1,
      },
      {
        title: "SFX",
        icon: "mdi-ear-hearing",
        audio: {},
        howl: undefined,
        play: false,
        loop: false,
        volume: 1,
      },
    ],
    tabPlaylist: { title: "Playlist", icon: "mdi-playlist-music" },
    tabs: [],
    selectedTabIndex: null,
    selectedPlaylistIndex: -1,

    dialogPlaylist: false,
    dialogPlaylistId: undefined,
  }),

  computed: {
    // Imports
    ...mapState("audio", ["audioFolder"]),
    ...mapState("playlist", ["playlists"]),

    /** */
    category_0_volume() {
      return this.tabsCategory[0].volume;
    },
    /** */
    category_1_volume() {
      return this.tabsCategory[1].volume;
    },
    /** */
    category_2_volume() {
      return this.tabsCategory[2].volume;
    },
  },

  watch: {
    selectedPlaylistIndex: function (val) {
      console.log(this.selectedPlaylistIndex);
    },
    /** */
    category_0_volume: function (val) {
      this.setVolume(this.tabsCategory[0].title);
    },
    /** */
    category_1_volume: function (val) {
      this.setVolume(this.tabsCategory[1].title);
    },
    /** */
    category_2_volume: function (val) {
      this.setVolume(this.tabsCategory[2].title);
    },
  },

  async mounted() {
    // We fetch the audio data
    await this.fetchAudioFolder();

    // We fetch the playlists
    await this.fetchAllPlaylists();

    // Set tabs
    this.tabs = this.tabsCategory.concat([this.tabPlaylist]);

    // All is complete, we consider the page loaded
    this.isPageLoaded = true;
  },

  methods: {
    // Imports
    ...mapActions("audio", ["fetchAudioFolder"]),
    ...mapActions("playlist", ["fetchAllPlaylists", "createPlaylist"]),

    /** */
    setAudio(audio) {
      // We get the category
      const category = this.tabsCategory[this.selectedTabIndex];

      // If an audio was already loaded : stop it
      if (!!category.howl) {
        category.howl.pause();
      }

      // We set some values
      category.audio = audio;
      category.play = true;
      category.howl = new Howl({
        src: [audio.path],
        loop: category.loop,
        volume: category.volume,
      });

      // We play the audio file
      category.howl.play();

      // When it ends, and if loop is disabled : disable the play flag
      category.howl.on("end", () => {
        if (!category.loop) {
          category.play = false;
        }
      });
    },

    /**
     * Sets the volume of a specific track
     * @param {String} title Title of the track to update
     */
    setVolume(title) {
      // We get the category
      const category = this.getCategoryByTitle(title);

      // If a file, is loaded, we set the volume accordingly
      if (!!category.howl) {
        category.howl.volume(category.volume);
      }
    },

    /**
     * Either plays or pauses a specific track
     * @param {String} title Title of the track to update
     */
    setPlayOrPause(title) {
      // We get the category
      const category = this.getCategoryByTitle(title);

      // If a file, is loaded, we play or pause it accordingly
      if (!!category.howl) {
        category.play = !category.play;
        if (category.play) {
          category.howl.play();
        } else {
          category.howl.pause();
        }
      }
    },

    /**
     * Either enables or disables the loop a specific track
     * @param {String} title Title of the track to update
     */
    setLoop(title) {
      // We get the category
      const category = this.getCategoryByTitle(title);

      // If a file, is loaded, we (dis)enable the loop it accordingly
      if (!!category.howl) {
        category.loop = !category.loop;
        category.howl.loop(category.loop);
      }
    },

    /**
     * Gets a specific folder from the audioFolder, given its title
     * @param {String} name Title of the folder to find
     */
    getAudioFolderByTitle(name) {
      return this.audioFolder.folders.find((folder) => folder.name === name);
    },

    /**
     * Gets a specific tab from the list, given its title
     * @param {String} title Title of the category to find
     */
    getCategoryByTitle(title) {
      return this.tabsCategory.find((tab) => tab.title === title);
    },

    closeDialog() {
      this.dialogPlaylist = false;
    },

    /** */
    openDialogNew() {
      this.dialogPlaylistId = undefined;
      this.dialogPlaylist = true;
    },

    /** */
    openDialogEdit(id) {
      this.dialogPlaylistId = id;
      this.dialogPlaylist = true;
    },

    /** */
    async newPlaylist(newPlaylist) {
      const x = await this.createPlaylist(newPlaylist);
      console.log(x);
      this.dialogPlaylist = false;
    },

    /** */
    editPlaylist(newPlaylist) {
      console.log(newPlaylist.name);
    },

    /** */
    deletePlaylist() {
      console.log("DELETE");
    },
  },

  /** Whenever the page is exited : remove all audio tracks */
  beforeRouteLeave(to, from, next) {
    // Disable all audio tracks
    this.tabsCategory.forEach((tab) => {
      if (!!tab.howl) {
        tab.howl.pause();
      }
    });

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
