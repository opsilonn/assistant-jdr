<template>
  <div>
    <!-- Waiting to load data... -->
    <Loader v-if="!isPageLoaded" message="Chargement des données..." />

    <!-- data loaded ! -->
    <div v-else>
      <!-- Tab selection -->
      <v-tabs v-model="selectedTab" grow icons-and-text>
        <v-tab v-for="(tab, i) in tabs" :key="`tab_${i}`">
          <span class="shrink d-none d-sm-flex">{{ tab.title }}</span>
          <v-icon>{{ tab.icon }}</v-icon>
        </v-tab>
      </v-tabs>

      <!-- Tab view -->
      <v-tabs-items v-model="selectedTab">
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

        <!-- Manually create tab view for audio playlist -->
        <v-tab-item :transition="false">
          <h1>Work in progress, please come later</h1>
        </v-tab-item>
      </v-tabs-items>

      <br v-for="n in 5" :key="n" />

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
    </div>
  </div>
</template>

<script>
// Imports
import { Howl, Howler } from "howler";
import { mapActions, mapState } from "vuex";
import ListItemAudio from "@/components/list-item-audio";
import Loader from "@/components/loader";

export default {
  name: "PageAudio",
  transition: "slide-bottom",

  components: { ListItemAudio, Loader },

  props: {},

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
    selectedTab: null,
  }),

  computed: {
    // Imports
    ...mapState("audio", ["audioFolder"]),

    /** */
    category_0_volume: function () {
      return this.tabsCategory[0].volume;
    },
    /** */
    category_1_volume: function () {
      return this.tabsCategory[1].volume;
    },
    /** */
    category_2_volume: function () {
      return this.tabsCategory[2].volume;
    },
  },

  watch: {
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

    // Set tabs
    this.tabs = this.tabsCategory.concat([this.tabPlaylist]);

    // All is complete, we consider the page loaded
    this.isPageLoaded = true;
  },

  methods: {
    // Imports
    ...mapActions("audio", ["fetchAudioFolder"]),

    /** */
    setAudio(audio) {
      // We get the category
      const category = this.tabsCategory[this.selectedTab];

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
        // category.howl.pause();
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
