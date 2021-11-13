<template>
  <v-container>
    <!-- Dialog -->
    <v-dialog v-model="dialog" max-width="500px" @click:outside="closeDialog">
      <v-card>
        <!-- Title -->
        <v-card-title
          class="headline primary--text"
          v-text="'Sélectionner les musiques de la playlist'"
        />

        <!-- Content -->
        <v-card-text> </v-card-text>

        <!-- Actions -->
        <v-card-actions>
          <v-spacer />
          <!-- Button : action -->
          <v-btn color="success" text v-text="'Valider'" />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
// Imports
import { EnumAudioCategory } from "@/models/enums";
import { mapGetters } from "vuex";

export default {
  name: "DialogPlaylistAudio",

  props: {
    playlistId: {
      type: Number,
      required: false,
    },
    dialog: {
      type: Boolean,
      required: true,
    },
  },

  data: () => ({
    form: false,
  }),

  watch: {
    /** whenever the dialog is opened */
    dialog() {
      if (this.dialog) {
        // get the Playlist
        const playlist = this.getPlaylist(this.playlistId);
      }
    },
  },

  async mounted() {
    console.log(EnumAudioCategory);
  },

  computed: {
    ...mapGetters("playlist", ["getPlaylist"]),
  },

  methods: {
    /** Emits the event to close the dialog */
    closeDialog() {
      this.$emit("close-dialog");
    },

    /** */
    remove() {},

    /** */
    action() {},
  },
};
</script>
