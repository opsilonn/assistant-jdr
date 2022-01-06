import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

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
    const folder = [];

    try {
      const files = fs.readdirSync(path);

      // We first add the folders
      files
        .filter((f) => !f.includes("."))
        .forEach((f) =>
          folder.push({
            id: uuidv4(),
            name: f,
            children: this.readFolder(path + "/" + f),
          })
        );

      // We then add the files
      files
        .filter((f) => f.includes("."))
        .forEach((f) =>
          folder.push({
            id: uuidv4(),
            name: f.substring(0, f.lastIndexOf(".")),
            path: `${path}/${f}`.replace("./static", ""),
          })
        );
    } catch (err) {
      console.log(err);
    }

    return folder;
  }
}
