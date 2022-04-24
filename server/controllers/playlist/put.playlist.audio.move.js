import Playlist from "../../models/playlist.model.js";

/**
 * @param { import('express').Request } req
 * @param { import('express').Response } res
 */
export default async function putPlaylistItemMove(req, res) {
  try {
    const playlist = await Playlist.moveItem(
        req.params.idPlaylist,
        req.params.idItem,
        req.body.idFolderToMoveTo,
        parseInt(req.body.newIndex)
        );
    res.status(200).json(playlist);
  } catch (err) {
    res.status(404).json(err.message);
  }
}
