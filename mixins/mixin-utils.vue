<script>
export default {
  name: "MixinUtils",

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
  },
};
</script>
