import fs from "fs";
import path from "path";

const audioFolder = "./static/audio";

export default class Audio {
  /** @type {String} */
  name;
  /** @type {String} */
  path;

  /**
   * Constructor
   * @param {Audio} newObj
   */
  constructor(newObj) {
    this.name = newObj.name;
    this.path = newObj.path;
  }

  /**
   * @returns {Promise<[]>}
   */
  static async getAll() {
    const audioFiles = this.readFolder(audioFolder);
    return audioFiles;
  }

  /**
   * Reads a folder's content (subfolders and files) recursively
   * @param {*} path Path of the current folder
   * @returns An object containing all its content
   */
  static readFolder(path) {
    const folder = {
      name: path.substring(path.lastIndexOf("/") + 1, path.length),
      folders: [],
      files: [],
    };

    try {
      const files = fs.readdirSync(path);

      // files object contains all files names
      files.forEach((file) => {
        // Add accordingly to file or folder
        if (file.includes(".")) {
          folder.files.push({
            name: file.substring(0, file.indexOf(".")),
            path: `${path.substring(1, path.length)}/${file}`,
          });
        } else {
          folder.folders.push(this.readFolder(path + "/" + file));
        }
      });
    } catch (err) {
      console.log(err);
    }

    return folder;
  }
}
