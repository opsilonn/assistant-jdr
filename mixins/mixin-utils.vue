<script>
// Imports
import { mapState } from "vuex";

export default {
  name: "MixinUtils",

  computed: {
    // Imports
    ...mapState("audio", ["audioFolder"]),
  },

  methods: {
    /**
     *
     * @param {*} folder
     * @param {*} path
     * @returns
     */
    getSubfolder(folder, path) {
      // If we delve deeper in the tree
      if (path[0] === "/") {
        // We remove the first "/"
        path = path.substring(1, path.length);

        const index = path.includes("/") ? path.indexOf("/") : path.length;
        const currentPath = path.substring(0, index);
        const nextPath = path.substring(index, path.length);
        const nextFolder = folder.folders.find((f) => f.name === currentPath);

        if (!nextFolder) {
          throw new Error("Invalid path !");
        }

        return this.getSubfolder(nextFolder, nextPath);
      }

      // Return current folder
      return folder;
    },

    /**
     *
     * @param {*} id
     * @returns
     */
    getAudioById(id) {
      for (let i = 0; i < this.audioFolder.length; i++) {
        const folder = this.audioFolder[i].children;
        const audio = this.getFile(id, folder);
        if (!!audio) {
          return audio;
        }
      }
    },

    /**
     *
     * @param {*} folder
     * @param {*} id
     * @returns
     */
    getFile(id, folder) {
      for (let i = 0; i < folder.length; i++) {
        const item = folder[i];

        if (item.id === id) {
          // Current matches
          return item;
        } else if (!!item.children) {
          // Current has children : we check if any matches
          const returnedItem = this.getFile(id, item.children);
          if (!!returnedItem) {
            return returnedItem;
          }
        }
      }
    },
  },
};
</script>
