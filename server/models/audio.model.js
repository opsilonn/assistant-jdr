import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import validator from "validator";

const audioFolder = "./static/audio";

const UUID_LENGTH = 36;

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
    const audioFiles = await this.readFolder(audioFolder);
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

    const item = { id: id, name: name, path: fullPath.replace("./static", "") };
    if (isFolder) {
      item.children = this.readFolder(fullPath);
    }

    return item;
  }
}
