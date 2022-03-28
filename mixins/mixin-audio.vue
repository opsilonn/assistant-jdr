<script>
// Imports
import { mapState } from "vuex";

export default {
  name: "MixinAudio",

  computed: {
    // Imports
    ...mapState("audio", ["audioFolder"]),
  },

  methods: {
    /**
     *
     * @param {*} id
     * @param {*} folder
     * @returns
     */
    getAudioById(id, folder) {
      const arr = Array.isArray(folder) ? folder : [folder];
      for (let i = 0; i < arr.length; i++) {
        const fold = !!arr[i].children ? arr[i].children : arr;
        const item = this.getItemInFolderById(id, fold);
        if (!!item) {
          return item;
        }
      }
    },

    /**
     *
     * @param {*} id
     * @param {*} folder
     * @returns
     */
    getItemInFolderById(id, folder) {
      for (let i = 0; i < folder.length; i++) {
        const item = folder[i];

        if (item.id === id) {
          // Current matches
          return item;
        } else if (!!item.children) {
          // Current has children : we check if any matches
          const returnedItem = this.getItemInFolderById(id, item.children);
          if (!!returnedItem) {
            return returnedItem;
          }
        }
      }
    },

    /**
     * FIXME Returns a folder given its ID, or one of its children ID
     * @param {*} id
     * @param {*} folder
     * @returns
     */
    getSubfolderByItemId(id, folder) {
      for (let i = 0; i < folder.length; i++) {
        const item = folder[i];

        if (
          (!!item.children && item.id === id) ||
          !!(item.children || []).find((el) => !el.children && el.id === id)
        ) {
          return item;
        }

        if (!!item.children) {
          const returnedItem = this.getSubfolderByItemId(id, item.children);
          if (!!returnedItem) {
            return returnedItem;
          }
        }
      }
    },
  },
};
</script>
