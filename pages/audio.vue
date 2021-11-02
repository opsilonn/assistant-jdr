<template>
  <div>
    <v-tabs v-model="selectedTab" grow icons-and-text>
      <v-tab v-for="(tab, i) in tabs" :key="i">
        <span class="shrink d-none d-sm-flex">{{ tab.title }}</span>
        <v-icon>{{ tab.icon }}</v-icon>
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="selectedTab">
      <v-tab-item v-for="(tab, i) in tabs" :key="i">
        <v-btn block @click="playAudio()"> Block Button </v-btn>

        <v-list v-if="pageLoaded">
          <ListItemAudio :audioFolder="audioFolder.folders[1]"
        /></v-list>

        <br />
        <br />
        <br />
        <br />

        <v-list v-if="true">
          <v-list-group
            v-for="(item, j) in audioFolder.folders"
            :key="j"
            no-action
            sub-group
          >
            <!-- title -->
            <template v-slot:activator>
              <v-list-item-title> {{ item.name }}</v-list-item-title>
            </template>

            <!-- content - files -->
            <v-list-item v-for="(subItem, k) in item.files" :key="k" link>
              <v-list-item-title v-text="subItem.name" />

              <v-list-item-icon>
                <v-icon v-text="'mdi-account-box'" />
              </v-list-item-icon>
            </v-list-item>

            <!-- content - folders -->
            <v-list-item v-for="(subItem, k) in item.folders" :key="k" link>
              <v-list-item-title v-text="subItem.name" />

              <v-list-item-icon>
                <v-icon v-text="'mdi-account-box'" />
              </v-list-item-icon>
            </v-list-item>
          </v-list-group>
        </v-list>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
// Imports
import { Howl, Howler } from "howler";
import { mapActions, mapState } from "vuex";
import ListItemAudio from "@/components/list-item-audio";

export default {
  name: "PageAudio",
  transition: "slide-bottom",

  components: { ListItemAudio },

  props: {},

  data: () => ({
    pageLoaded: false,
    tabs: [
      { title: "Musique", icon: "mdi-account-box" },
      { title: "Ambiance", icon: "mdi-account-box" },
      { title: "SFX", icon: "mdi-account-box" },
      { title: "Playlist", icon: "mdi-account-box" },
    ],
    selectedTab: null,
  }),

  computed: {
    // Imports
    ...mapState("audio", ["audioFolder"]),
  },

  watch: {},

  async mounted() {
    // We fetch the audio data
    await this.fetchAudioFolder();
    console.log(this.audioFolder);

    this.pageLoaded = true;
  },

  methods: {
    // Imports
    ...mapActions("audio", ["fetchAudioFolder"]),

    /** */
    playAudio() {
      const sound = new Howl({
        src: ["/audio/musique/horror/Formidable Oak.mp3"],
      });

      sound.play();
    },
  },

  head() {
    return { title: "Audio" };
  },
};
</script>
