import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import validator from "validator";

const audioFolderPath = "./static/audio";

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

  audiosDatabase = [];

  /**
   * @returns {Promise<[]>}
   */
  static async getAll() {
    this.audiosDatabase = [];
    const audioFolder = await this.readFolder(audioFolderPath);
    return {
      audioFolder: audioFolder,
      audiosDatabase: this.audiosDatabase
    };
  }

  /**
   * Reads a folder's content (subfolders and files) recursively
   * @param {*} path Path of the current folder
   * @returns An object containing all its content
   */
  static readFolder(path) {
    const folder = [];

    try {
      // We get all the files
      const filesName = fs.readdirSync(path);

      // We first add the folders
      filesName.filter((fileName) => !fileName.includes(".")).forEach((fileName) => folder.push(this.GetItem(fileName, path, true)));

      // We then add the files
      filesName.filter((fileName) => fileName.includes(".")).forEach((fileName) => folder.push(this.GetItem(fileName, path, false)));
    } catch (err) {
      console.log(err);
    }

    return folder;
  }

  /**
   *
   * @param {*} fileName
   * @param {*} path
   * @param {*} isFolder
   * @returns
   */
  static GetItem(fileName, path, isFolder) {
    // On déclare nos variables
    let id;
    let name;
    let fullPath;
    const fileId = fileName.substring(fileName.lastIndexOf(" ") + 1, isFolder ? fileName.length : fileName.lastIndexOf("."));

    if (validator.isUUID(fileId)) {
      id = fileId;
      name = fileName.substring(0, fileName.lastIndexOf(" "));
      fullPath = `${path}/${fileName}`;
    } else {
      id = uuidv4();
      name = isFolder ? fileName : fileName.substring(0, fileName.lastIndexOf("."));
      fullPath = `${path}/${name} ${id}` + (isFolder ? "" : fileName.substring(fileName.lastIndexOf("."), fileName.length));
      fs.renameSync(`${path}/${fileName}`, fullPath);
    }

    // On construit l'audio
    const item = { id: id, name: name, path: fullPath.replace("./static", "") };

    if (isFolder) {
      item.children = this.readFolder(fullPath);
    } else {
      this.audiosDatabase.push(item);
    }

    return item;
  }
}
