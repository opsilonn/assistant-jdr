import fs from "fs";
import path from "path";
import { promisify } from "util";

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const playlistsFile = path.join(__dirname, "../data/playlists.json");

export default class Playlist {
  /** @type {Number} */
  id;
  /** @type {String} */
  name;
  /** @type {Playlist<[]>} */
  audios;

  /**
   * Constructor
   * @param {Playlist} newObj
   */
  constructor(newObj) {
    this.id = newObj.id;
    this.name = newObj.name;
    this.audios = [];
  }

  /**
   * @param {Number} id
   * @returns {Promise<Playlist>}
   */
  static async get(id) {
    // Read the file
    const playlists = await this.getAll();

    // Find the correct instance
    const playlist = playlists.find((_) => _.id === id);

    // If the instance was not found : throw error
    if (!playlist) {
      throw new Error("Instance not found !");
    }

    return playlist;
  }

  /**
   * @returns {Promise<Playlist[]>}
   */
  static async getAll() {
    // Read the file
    const playlists = await readFile(playlistsFile, "utf8");

    // Parse the file as JSON
    return JSON.parse(playlists);
  }

  /**
   * @param {Playlist} playlistReceived
   * @returns {Promise<Playlist>}
   */
  static async add(playlistReceived) {
    // Read the file
    const playlists = await this.getAll();

    // Get and set the id
    const maxId = Math.max.apply(
      null,
      playlists.map((_) => _.id)
    );
    playlistReceived.id = maxId + 1;

    // Create new Playlist
    const playlist = new Playlist(playlistReceived);

    // Add new Playlist
    playlists.push(playlist);
    writeFile(playlistsFile, JSON.stringify(playlists, null, 2), "utf8");

    return playlist;
  }

  /**
   *
   * @param {Number} id
   * @param {Playlist} playlistReceived
   * @returns {Promise<Playlist>}
   */
  static async update(id, playlistReceived) {
    // Read the file
    let playlists = await this.getAll();

    // We get the specific index
    const playlist = playlists.find((_) => _.id === id);

    // If not foundx : throw Error
    if (!playlist) {
      throw new Error("Instance not found !");
    }

    // We only update the name
    playlist.name = playlistReceived.name;
    writeFile(playlistsFile, JSON.stringify(playlists, null, 2), "utf8");

    return playlist;
  }

  /**
   * @param {Number} id
   */
  static async delete(id) {
    // Read the file
    let playlists = await this.getAll();

    // get index of the instance to remove
    const index = playlists.findIndex((_) => _.id === id);

    // invalid index : throw Error
    if (index <= -1) {
      throw new Error("Instance not found !");
    }

    // Remove found Playlist
    playlists.splice(index, 1);

    // Re-write file
    writeFile(playlistsFile, JSON.stringify(playlists, null, 2), "utf8");
  }

  /**
   *
   * @param {Number} id
   * @param {Audio} audio
   * @returns {Promise<Playlist>}
   */
  static async addAudio(id, audio) {
    // Read the file
    let playlists = await this.getAll();

    // We get the row
    const playlist = playlists.find((_) => _.id === id);

    // If not found : throw Error
    if (!playlist) {
      throw new Error("Instance not found !");
    }

    // If audio already in playlist : throw Error
    if (playlist.audios.some((_) => _.path === audio.path)) {
      throw new Error("Audio already in playlist !");
    }

    // Get and set the id
    const maxId = Math.max.apply(
      null,
      playlist.audios.map((_) => _.id)
    );
    audio.id = maxId + 1;

    // We add the audio
    playlist.audios.push(audio);
    writeFile(playlistsFile, JSON.stringify(playlists, null, 2), "utf8");

    return playlist;
  }

  /**
   *
   * @param {Number} playlistId
   * @param {Number} audioId
   * @param {Audio} audioReceived
   * @returns {Promise<Playlist>}
   */
  static async updateAudio(playlistId, audioId, audioReceived) {
    // Read the file
    let playlists = await this.getAll();

    // We get the row
    const playlist = playlists.find((_) => _.id === playlistId);

    // If not found : throw Error
    if (!playlist) {
      throw new Error("Instance not found !");
    }

    // We get the audio row
    const audio = playlist.audios.find((_) => _.id === audioId);

    // If not found : throw Error
    if (!audio) {
      throw new Error("Instance not found !");
    }

    // We only update the name
    audio.surname = audioReceived.surname;
    writeFile(playlistsFile, JSON.stringify(playlists, null, 2), "utf8");

    return playlist;
  }

  /**
   * @param {Number} playlistId
   * @param {Number} audioId
   */
  static async deleteAudio(playlistId, audioId) {
    // Read the file
    let playlists = await this.getAll();

    // get the row
    const playlist = playlists.find((_) => _.id === playlistId);

    // If not found : throw Error
    if (!playlist) {
      throw new Error("Instance not found !");
    }

    // get index of the instance to remove
    const indexAudio = playlist.audios.findIndex((_) => _.id === audioId);

    // If not found : throw Error
    if (indexAudio < 0) {
      throw new Error("Instance not found !");
    }

    // Remove from Playlist
    playlist.audios.splice(indexAudio, 1);

    // Re-write file
    writeFile(playlistsFile, JSON.stringify(playlists, null, 2), "utf8");
  }
}
