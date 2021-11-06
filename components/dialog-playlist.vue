<template>
  <v-container>
    <!-- Dialog to delete -->
    <v-dialog v-model="dialog" max-width="500px" @click:outside="closeDialog">
      <v-card>
        <!-- Title -->
        <v-card-title
          class="headline primary--text"
          v-text="isNewPlaylist ? 'Nouvelle playlist' : 'Modification playlist'"
        />

        <!-- Content -->
        <v-card-text>
          <!-- Content -->
          Veuillez entrer le nom de la playlist

          <!-- Universe's name (for verification) -->
          <v-form ref="form" v-model="form">
            <v-container>
              <v-text-field
                label="Nom de la Playlist"
                v-model="playlistName"
                clearable
                :rules="[rules.required, rules.max50, rules.ascii]"
                counter="50"
                type="text"
              />
            </v-container>
          </v-form>
        </v-card-text>

        <!-- Actions -->
        <v-card-actions>
          <v-spacer />

          <!-- Button : delete -->
          <v-btn
            v-if="!isNewPlaylist"
            color="error"
            text
            @click="remove"
            v-text="'Supprimer'"
          />

          <!-- Button : cancel -->
          <v-btn color="warning" text @click="closeDialog" v-text="'Annuler'" />

          <!-- Button : action -->
          <v-btn
            color="success"
            text
            @click="action"
            v-text="isNewPlaylist ? 'Créer' : 'Modifier'"
          />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
// Imports
import { mapGetters } from "vuex";
import MixinRules from "@/mixins/mixin-rules";

export default {
  name: "DialogPlaylist",

  mixins: [MixinRules],

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
    playlistName: "",
  }),

  watch: {
    /** whenever the dialog is opened */
    dialog() {
      if (this.dialog) {
        // get the Playlist
        const playlist = this.getPlaylist(this.playlistId);
        this.playlistName = !!playlist ? playlist.name : "";
      }
    },
  },

  computed: {
    ...mapGetters("playlist", ["getPlaylist"]),

    /** */
    isNewPlaylist() {
      return !this.playlistId || this.playlistId < 0;
    },
  },

  methods: {
    /** Emits the event to close the dialog */
    closeDialog() {
      this.$emit("close-dialog");
    },

    /** */
    remove() {},

    /** */
    action() {
      // If the form is valid
      if (this.$refs.form.validate()) {
        const playlist = { name: this.playlistName };

        if (this.isNewPlaylist) {
          this.$emit("playlist-new", playlist);
        }
        // We launch the method given as a prop
        // this.validate();
      }
    },
  },
};
</script>
