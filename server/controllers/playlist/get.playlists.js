import Playlist from "../../models/playlist.model.js";

/**
 * @param { import('express').Request } req
 * @param { import('express').Response } res
 */
export default async function getPlaylists(req, res) {
  try {
    const playlists = await Playlist.getAll();
    res.status(200).json(playlists);
  } catch (err) {
    res.status(404).json(err.message);
  }
}
