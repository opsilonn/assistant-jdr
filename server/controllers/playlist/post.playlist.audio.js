import Playlist from "../../models/playlist.model.js";

/**
 * @param { import('express').Request } req
 * @param { import('express').Response } res
 */
export default async function postPlaylistAudio(req, res) {
  try {
    const playlist = await Playlist.addAudio(
      parseInt(req.params.playlistId),
      req.body
    );
    res.status(200).json(playlist);
  } catch (err) {
    res.status(404).json(err.message);
  }
}
