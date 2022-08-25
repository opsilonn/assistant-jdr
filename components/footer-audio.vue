<template>
  <!-- Dashboard (fixed to the bottom) -->
  <v-footer fixed padless>
    <v-card flat tile width="100%" class="text-center grey darken-3">
      <div v-for="(tab, i) in audioCategories" :key="tab.id">
        <v-row align="center">
          <!-- col 1 - category -->
          <v-col cols="3">
            <h3
              class="font-weight-bold text-right"
              :class="{ 'error--text': tab.hasError }"
              v-text="tab.title"
            />
          </v-col>

          <!-- col 2 - name -->
          <v-col cols="6">
            <v-card-text>
              <div :class="{ 'error--text': tab.hasError }">
                {{ tab.audio.surname || tab.audio.name || "..." }}
                <span
                  v-if="tab.audio.surname"
                  class="font-italic"
                  :class="{ 'error--text': tab.hasError }"
                >
                  ({{ tab.audio.name }})
                </span>
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
                <v-btn icon @click="setPlayOrPause(tab.id)">
                  <v-icon v-text="tab.play ? 'mdi-pause' : 'mdi-play'" />
                </v-btn>

                <!-- button loop -->
                <v-btn icon @click="setLoop(tab.id)">
                  <v-icon v-text="'mdi-autorenew'" :disabled="!tab.loop" />
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <!-- Divider, except last row -->
        <v-divider v-if="i !== audioCategories.length - 1" />
      </div>
    </v-card>
  </v-footer>
</template>

<script>
// Imports
import { mapMutations, mapState } from "vuex";

export default {
  name: "ComponentFooterAudio",

  data: () => ({}),

  computed: {
    // Imports
    ...mapState("audioPlayer", ["audioCategories"]),

    /** */
    audioCategoriesVolumes() {
      return this.audioCategories.map((_) => ({
        id: _.id,
        title: _.title,
        volume: _.volume
      }));
    },
  },

  watch: {
    /** */
    audioCategoriesVolumes(newValue, oldValue) {
      for (let i = 0; i < oldValue.length; i++) {
        if (oldValue[i].volume !== newValue[i].volume) {
          this.setVolume(oldValue[i].id);
          return;
        }
      }
    },
  },

  methods: {
    // Imports
    ...mapMutations("audioPlayer", ["setVolume", "setPlayOrPause", "setLoop"]),
  },
};
</script>
