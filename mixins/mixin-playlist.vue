<script>
// Imports
import { mapMutations, mapState } from "vuex";

export default {
  name: "MixinPlaylist",

  computed: {
    // Imports
    ...mapState("audio", ["audiosDatabase"]),
    ...mapState("playlists", ["playlists"]),
  },

  methods: {
    // Imports
    ...mapMutations("playlist", ["addPlaylist"]),

    /** */
    updateStatePlaylists() {
      let playlistsLocal = JSON.parse(JSON.stringify(this.playlists));
      playlistsLocal.forEach((playlist) => {
        this.updateFolder(playlist.rootFolder);
        this.addPlaylist(playlist);
      });
    },

    /** */
    updateFolder(folder) {
      folder.forEach((item) => {
        // If the item is a folder : we go through it
        if (item.children) {
          this.updateFolder(folder.children);
        } else {
          // If the item is an audio : we fetch it and update the current data
          const audio = this.audiosDatabase.find((a) => a.id === item.id);
          item.name = audio.name;
          item.path = audio.path;
        }
      });
    },
  },
};
</script>
