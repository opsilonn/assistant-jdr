<template>
  <div>
    <!-- content - folders -->
    <v-list-item v-for="(folder, i) in audioFolder.folders" :key="i">
      <v-list-group sub-group>
        <!-- title -->
        <template v-slot:activator>
          <v-list-item-title class="font-weight-black" v-text="folder.name" />
        </template>

        <!-- recursive : call self -->
        <ListItemAudio
          :audioFolder="folder"
          @set-audio="setAudio"
          @edit-playlist-audio="forwardEditAudioFromPlaylist"
          :enableAudioMgmt="enableAudioMgmt"
          :enableEdit="enableEdit"
          :enableAddition="enableAddition"
        />
      </v-list-group>
    </v-list-item>

    <!-- content - files -->
    <v-list-item
      v-for="(file, i) in files"
      :key="i"
      two-line
      link
      @click="setAudio(file)"
      @keyup.enter.prevent
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
          <v-list-item-title v-text="file.surname ? file.surname : file.name" />
          <v-list-item-subtitle v-if="file.surname" v-text="file.name" />
        </div>
      </v-list-item-content>

      <!-- actions -->
      <v-list-item-action class="d-flex flex-row ma-4">
        <!-- action : Edit -->
        <v-icon
          v-if="enableEdit && !file.isEditing"
          class="zoom"
          color="grey lighten-1"
          v-text="'mdi-pencil'"
          @click.stop="beginEdit(file)"
        />
        <v-icon
          v-if="enableEdit && file.isEditing"
          class="zoom"
          color="grey lighten-1"
          v-text="'mdi-cancel'"
          @click.stop="cancelEdit(file)"
        />
        <!-- action : Add -->
        <v-icon
          v-if="enableAddition"
          class="zoom"
          color="grey lighten-1"
          v-text="'mdi-plus-circle'"
        />
        <!-- action : Remove -->
        <v-icon
          v-if="enableAddition"
          class="zoom"
          color="grey lighten-1"
          v-text="'mdi-delete'"
        />
      </v-list-item-action>
    </v-list-item>
  </div>
</template>

<script>
// Imports
import { mapActions, mapState, mapMutations } from "vuex";
import ListItemAudio from "@/components/list-item-audio";
import MixinRules from "@/mixins/mixin-rules";

export default {
  name: "ListItemAudio",

  components: { ListItemAudio },

  mixins: [MixinRules],

  props: {
    audioFolder: {
      type: [],
      required: false,
    },
    enableAudioMgmt: {
      type: Boolean,
      required: false,
      default: false,
    },
    enableEdit: {
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

  computed: {
    /** */
    files() {
      return !!this.audioFolder.files
        ? this.audioFolder.files
        : this.audioFolder.audios;
    },
  },

  methods: {
    // Imports
    ...mapMutations("audioPlayer", ["setAudio"]),

    /** */
    removeAudioFromPlaylist(file) {
      this.$emit("remove-audio-from-playlist", file);
    },

    /** */
    addAudioFromPlaylist(file) {
      this.$emit("add-audio-from-playlist", file);
    },

    /** */
    beginEdit(file) {
      this.$set(file, "isEditing", true);
      this.$set(file, "form", false);
      this.$set(file, "surnameEdit", file.surname);
    },

    /** */
    cancelEdit(file) {
      this.$set(file, "isEditing", false);
    },

    /** */
    forwardEditAudioFromPlaylist(file) {
      this.$emit("edit-playlist-audio", file);
    },

    /** */
    editAudioFromPlaylist(file) {
      // If the form is valid
      const formId = `form_playlist_audio_${file.id}`;
      const form = this.$refs[formId][0];
      if (form.validate()) {
        // We first edit the object
        this.$set(file, "isEditing", false);
        this.$set(file, "surname", file.surnameEdit);

        // We then send the event
        this.$emit("edit-playlist-audio", file);
      }
    },
  },
};
</script>
