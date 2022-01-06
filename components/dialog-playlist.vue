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
          <v-form ref="form" v-model="form" @submit.prevent>
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
    idPlaylist: {
      type: String,
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
        this.playlist = this.getPlaylistById(this.idPlaylist);
        this.playlistName = !!this.playlist ? this.playlist.name : "";
      }
    },
  },

  computed: {
    // Imports
    ...mapGetters("playlist", ["getPlaylistById"]),

    /** */
    isNewPlaylist() {
      return !this.idPlaylist || this.idPlaylist === "";
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
      await this.deletePlaylist({ id: this.idPlaylist }).then((response) => {
        this.$emit("close-dialog");
        this.$refs.form.reset();
      });
    },

    /** */
    async action() {
      // If the form is valid
      if (this.$refs.form.validate()) {
        if (this.isNewPlaylist) {
          this.add();
        } else {
          this.update();
        }
      }
    },

    /** */
    async add() {
      const newPlaylist = { name: this.playlistName };
      const res = await this.createPlaylist(newPlaylist);
      if (!!res) {
        this.$emit("close-dialog");
        this.$refs.form.reset();
      }
    },

    /** */
    async update() {
      const editedPlaylist = {
        id: this.playlist.id,
        name: this.playlistName,
      };
      const res = await this.updatePlaylist(editedPlaylist);
      if (!!res) {
        this.$emit("close-dialog");
        this.$refs.form.reset();
      }
    },
  },
};
</script>
