import Playlist from "../../models/playlist.model.js";

/**
 * @param { import('express').Request } req
 * @param { import('express').Response } res
 */
export default async function savePlaylistChanges(req, res) {
  try {
    const playlist = await Playlist.saveChanges(req.params.idPlaylist);
    res.status(200).json(playlist);
  } catch (err) {
    res.status(404).json(err.message);
  }
}
