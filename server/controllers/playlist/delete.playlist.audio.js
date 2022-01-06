import Playlist from "../../models/playlist.model.js";

/**
 * @param { import('express').Request } req
 * @param { import('express').Response } res
 */
export default async function deletePlaylistAudio(req, res) {
  try {
    await Playlist.deleteAudio(
      req.params.idPlaylist,
      parseInt(req.params.idAudio),
      req.body.path
    );
    res.status(204).json(true);
  } catch (err) {
    console.log(err);
    res.status(404).json(err.message);
  }
}
