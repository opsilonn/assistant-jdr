import Playlist from "../../models/playlist.model.js";

/**
 * @param { import('express').Request } req
 * @param { import('express').Response } res
 */
export default async function deletePlaylist(req, res) {
  try {
    await Playlist.delete(parseInt(req.params.playlistId));
    res.status(204).json(true);
  } catch (err) {
    console.log(err);
    res.status(404).json(err.message);
  }
}
