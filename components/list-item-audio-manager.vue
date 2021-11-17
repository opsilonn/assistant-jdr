<template>
  <!-- call subcomponent -->
  <ListItemAudio
    @set-audio="setAudio"
    @edit-playlist-audio="editAudioFromPlaylist"
    :audioFolder="audioFolderClone"
    :enableAudioMgmt="enableAudioMgmt"
    :enableEdit="enableEdit"
    :enableAddition="enableAddition"
  />
</template>

<script>
// Imports
import { mapActions } from "vuex";
import ListItemAudio from "@/components/list-item-audio";

export default {
  name: "ListItemAudioManager",

  components: { ListItemAudio },

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

  data: () => ({
    audioFolderClone: {},
  }),

  watch: {
    /*
    "nested.audioFolder": function (newVal, oldVal) {
      this.audioFolderClone = JSON.parse(JSON.stringify(this.audioFolder));
    },
    */
  },

  mounted() {
    this.audioFolderClone = JSON.parse(JSON.stringify(this.audioFolder));
  },

  methods: {
    // Imports
    ...mapActions("playlist", ["updatePlaylistAudio"]),

    /**
     * Forwards the event of a file being selected
     * @param {Object} file Audio file to be played
     */
    setAudio(file) {
      // Send event only if allowed to play audio
      if (this.enableAudioMgmt) {
        this.$emit("set-audio", file);
      }
    },

    editAudioFromPlaylist(file) {
      const data = {
        idPlaylist: this.audioFolder.id,
        audio: file,
      };
      this.updatePlaylistAudio(data);
    },
  },
};
</script>
