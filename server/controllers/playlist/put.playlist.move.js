import Playlist from "../../models/playlist.model.js";

/**
 * @param { import('express').Request } req
 * @param { import('express').Response } res
 */
export default async function putPlaylistMove(req, res) {
  try {
    const playlist = await Playlist.move(req.body.oldIndex, req.body.newIndex);
    res.status(200).json(playlist);
  } catch (err) {
    res.status(404).json(err.message);
  }
}
