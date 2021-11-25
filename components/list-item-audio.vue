<template>
  <div>
    <!-- content - folders -->
    <v-list-item
      v-for="(folder, i) in audioFolder.folders"
      :key="`folder_${i}`"
    >
      <v-list-group sub-group>
        <!-- title -->
        <template v-slot:activator>
          <v-list-item-title class="font-weight-black" v-text="folder.name" />
        </template>

        <!-- recursive : call self -->
        <ListItemAudio
          :audioFolder="folder"
          :enableAudioMgmt="enableAudioMgmt"
          :enableEdit="enableEdit"
          :enableAddition="enableAddition"
          :idPlaylist="idPlaylist"
          :pathPlaylist="
            idPlaylist >= 0 ? `${pathPlaylist}/${folder.name}` : ''
          "
        />
      </v-list-group>
    </v-list-item>

    <!-- content - files -->
    <v-list-item
      v-for="(file, i) in files"
      :key="`file_${i}`"
      two-line
      @click="setAudioIfAllowed(file)"
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
          <v-list-item-title v-text="file.surname ? file.surname : file.name" />
          <v-list-item-subtitle v-if="file.surname" v-text="file.name" />
        </div>
      </v-list-item-content>

      <!-- actions -->
      <v-list-item-action class="d-flex flex-row ma-4">
        <!-- action : Edit -->
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
        </div>
        <!-- action : Add or Remove from playlist -->
        <div v-if="enableAddition">
          <v-icon
            v-if="true"
            class="zoom"
            color="grey lighten-1"
            v-text="'mdi-delete'"
          />
          <v-icon
            v-else
            class="zoom"
            color="grey lighten-1"
            v-text="'mdi-plus-circle'"
            @click="manageAddAudioToPlaylist(file)"
          />
        </div>
      </v-list-item-action>
    </v-list-item>
  </div>
</template>

<script>
// Imports
import { mapGetters, mapActions, mapMutations } from "vuex";
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

  data: () => ({
    parameters: [],
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

    currentPathPlaylist() {
      return `${pathPlaylist}/${folder.name}`;
    },

    doesPlaylistContainsAudio() {
      return (audio) =>
        this.getPlaylistById(this.idPlaylist).audios.some(
          (_) => _.path === audio.path
        );
    },
  },

  mounted() {
    /*
    if (this.enableEdit || this.enableAddition) {
      console.log(this.audioFolder);
      console.log(this.audioFolder.audios);
      const arr = this.audioFolder.audios
        ? this.audioFolder.audios
        : this.audioFolder.files;

      arr.forEach((audio) => {
        const curr = {};

        if (this.enableAddition) {
          curr.isAudioInPlaylist = this.getPlaylistById(
            this.idPlaylist
          ).audios.some((_) => _.path === audio.path);
        }

        this.parameters.push(curr);
      });

      console.log(this.parameters);
    }
    */
  },

  methods: {
    // Imports
    ...mapActions("playlist", ["updatePlaylistAudio", "addAudioToPlaylist"]),
    ...mapMutations("audioPlayer", ["setAudio"]),

    /** */
    setAudioIfAllowed(file) {
      if (this.enableAudioMgmt && !file.isEditing) {
        this.setAudio(file);
      }
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
    async editAudioFromPlaylist(file) {
      // If the form is valid
      const formId = `form_playlist_audio_${file.id}`;
      const form = this.$refs[formId][0];
      if (form.validate()) {
        // We update the playlist
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

        console.log(res);

        // We first edit the object
        this.$set(file, "isEditing", false);
        this.$set(file, "surname", file.surnameEdit);
      }
    },

    /** */
    removeAudioFromPlaylist(file) {},

    /** */
    async manageAddAudioToPlaylist(file) {
      const params = {
        idPlaylist: this.idPlaylist,
        audio: file,
      };
      await this.addAudioToPlaylist(params);
    },
  },
};
</script>
