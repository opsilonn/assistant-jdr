<template>
  <v-container>
    <!-- Dialog -->
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

          <!-- Playlist's name (for verification) -->
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
import { mapActions, mapGetters } from "vuex";
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
    playlist: {},
    playlistName: "",
  }),

  watch: {
    /** whenever the dialog is opened */
    dialog() {
      if (this.dialog) {
        // get the Playlist
        this.playlist = this.getPlaylist(this.playlistId);
        this.playlistName = !!this.playlist ? this.playlist.name : "";
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
    // Imports
    ...mapActions("playlist", [
      "createPlaylist",
      "updatePlaylist",
      "deletePlaylist",
    ]),

    /** Emits the event to close the dialog */
    closeDialog() {
      this.$emit("close-dialog");
    },

    /** */
    async remove() {
      console.log("delete");
      await this.deletePlaylist({ id: this.playlistId }).then((response) => {
        console.log(response);
        if (true) {
          this.$emit("close-dialog");
        }
      });
    },

    /** */
    async action() {
      // If the form is valid
      if (this.$refs.form.validate()) {
        if (this.isNewPlaylist) {
          const newPlaylist = { name: this.playlistName };
          const isSuccess = await this.createPlaylist(newPlaylist);
          if (!!isSuccess) {
            this.$emit("close-dialog");
          }
        } else {
          const editedPlaylist = {
            id: this.playlist.id,
            name: this.playlistName,
            audios: this.playlist.audios,
          };
          const isSuccess = await this.updatePlaylist(editedPlaylist);
          if (!!isSuccess) {
            this.$emit("close-dialog");
          }
        }
      }
    },
  },
};
</script>
