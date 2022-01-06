<template>
  <div>
    <!-- content - folders -->
    <template v-for="(folder, i) in audioFolder.folders">
      <v-list-item :key="`folder_${i}`">
        <v-list-group sub-group>
          <!-- title -->
          <template v-slot:activator>
            <v-list-item-title class="font-weight-black" v-text="folder.name" />
          </template>

          <!-- recursive : call self -->
          <ListItemAudio
            :audioFolder="folder"
            :enablePlay="enablePlay"
            :enableEdit="enableEdit"
            :enableAddition="enableAddition"
            :idPlaylist="idPlaylist"
            :pathPlaylist="
              idPlaylist >= 0 ? `${pathPlaylist}/${folder.name}` : ''
            "
          />
        </v-list-group>
      </v-list-item>
    </template>

    <!-- content - files -->
    <template v-for="(file, i) in files">
      <v-list-item
        :key="`file_${i}`"
        two-line
        @click.stop="itemClicked(file)"
        @keyup.enter.prevent
        extended
      >
        <!-- icon -->
        <v-list-item-icon>
          <v-icon v-text="'mdi-music-note'" />
        </v-list-item-icon>

        <!-- Text -->
        <v-list-item-content @keyup.enter.prevent>
          <!-- If editing -->
          <v-form
            v-if="!!file.isEditing"
            :ref="`form_playlist_audio_${file.id}`"
            v-model="file.form"
            @submit.prevent
          >
            <v-text-field
              v-model="file.surnameEdit"
              :rules="[rules.max50, rules.ascii]"
              :label="file.name"
              counter
              @click.stop
              @keyup.enter.stop="editAudioFromPlaylist(file)"
            >
              <template v-slot:append>
                <v-fade-transition leave-absolute>
                  <v-icon
                    v-text="'mdi-check'"
                    @click.stop="editAudioFromPlaylist(file)"
                  />
                </v-fade-transition>
              </template>
            </v-text-field>
          </v-form>

          <!-- Normal display -->
          <div v-else>
            <v-list-item-title
              v-text="file.surname ? file.surname : file.name"
            />
            <v-list-item-subtitle v-if="file.surname" v-text="file.name" />
          </div>
        </v-list-item-content>

        <!-- actions -->
        <v-list-item-action class="d-flex flex-row ma-4">
          <!-- action : Add to playlist -->
          <v-icon
            v-if="enableAddition"
            class="zoom"
            color="grey lighten-1"
            v-text="'mdi-plus-circle'"
            @click.stop="addAudioToPlaylist(file)"
          />

          <!-- action : Edit or remove -->
          <div v-if="enableEdit">
            <v-icon
              v-if="file.isEditing"
              class="zoom"
              color="grey lighten-1"
              v-text="'mdi-cancel'"
              @click.stop="cancelEdit(file)"
            />

            <v-icon
              v-else
              class="zoom"
              color="grey lighten-1"
              v-text="'mdi-pencil'"
              @click.stop="beginEdit(file)"
            />

            <!-- action : Remove from playlist -->
            <v-icon
              v-if="enableEdit"
              class="zoom"
              color="grey lighten-1"
              v-text="'mdi-delete'"
            />
          </div>
        </v-list-item-action>
      </v-list-item>
    </template>
  </div>
</template>

<script>
// Imports
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";
import EventBus from "@/EventBus.js";
import ListItemAudio from "@/components/list-item-audio";
import MixinRules from "@/mixins/mixin-rules";

export default {
  name: "ListItemAudio",

  components: { ListItemAudio },

  mixins: [MixinRules],

  props: {
    audioFolder: {
      type: Object,
      required: false,
      default: { folders: [], files: [], name: "" },
    },
    idPlaylist: {
      type: Number,
      required: false,
      default: -1,
    },
    pathPlaylist: {
      type: String,
      required: false,
      default: "",
    },
    enableEdit: {
      type: Boolean,
      required: false,
      default: false,
    },
    enablePlay: {
      type: Boolean,
      required: false,
      default: false,
    },
    enableAddition: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  data: () => ({
    parameters: [],
    newFolder: { name: "", isEditing: false, form: false },
  }),

  computed: {
    // Imports
    ...mapGetters("playlist", ["getPlaylistById"]),

    /** */
    files() {
      return !!this.audioFolder.files
        ? this.audioFolder.files
        : this.audioFolder.audios;
    },
  },

  methods: {
    // Imports
    ...mapActions("playlist", ["updatePlaylistAudio"]),
    ...mapMutations("audioPlayer", ["setAudio"]),

    /** */
    itemClicked(file) {
      if (this.enablePlay && !file.isEditing) {
        this.setAudio(file);
      }
    },

    /** */
    beginEdit(file) {
      this.$set(file, "isEditing", true);
      this.$set(file, "form", false);
      this.$set(file, "surnameEdit", file.surname || "");
    },

    /** */
    cancelEdit(file) {
      this.$set(file, "isEditing", false);
    },

    /** */
    async editAudioFromPlaylist(file) {
      // If the form is valid
      const formId = `form_playlist_audio_${file.id}`;
      const form = this.$refs[formId][0];

      if (form.validate()) {
        // We update the playlist if the surname is different
        if (file.surname !== file.surnameEdit) {
          const data = {
            idPlaylist: this.idPlaylist,
            audio: {
              id: file.id,
              name: file.name,
              surname: file.surnameEdit,
            },
            path: this.pathPlaylist || "",
          };
          const res = await this.updatePlaylistAudio(data);
        }

        // We first edit the object
        this.$set(file, "isEditing", false);
        this.$set(file, "surname", file.surnameEdit);
      }
    },

    /** */
    addAudioToPlaylist(file) {
      EventBus.$emit(EventBus.ADD_TO_PLAYLIST, file);
    },
  },
};
</script>
