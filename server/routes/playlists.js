import { Router } from "express";
// Playlist
import getPlaylist from "../controllers/playlist/get.playlist.js";
import getPlaylists from "../controllers/playlist/get.playlists.js";
import getPlaylistSaved from "../controllers/playlist/get.playlist.saved.js";
import postPlaylist from "../controllers/playlist/post.playlist.js";
import putPlaylist from "../controllers/playlist/put.playlist.js";
import putPlaylistReset from "../controllers/playlist/put.playlist.reset.js";
import putPlaylistSave from "../controllers/playlist/put.playlist.save.js";
import deletePlaylist from "../controllers/playlist/delete.playlist.js";
// Playlist's audio
import postPlaylistAudio from "../controllers/playlist/post.playlist.audio.js";
import putPlaylistAudio from "../controllers/playlist/put.playlist.audio.js";
import deletePlaylistAudio from "../controllers/playlist/delete.playlist.audio.js";

const router = Router();
// Playlist
router.get("/playlist/:idPlaylist", getPlaylist);
router.get("/playlists", getPlaylists);
router.get("/playlist/:idPlaylist/saved", getPlaylistSaved);
router.post("/playlist", postPlaylist);
router.put("/playlist/:idPlaylist", putPlaylist);
router.put("/playlist/:idPlaylist/reset", putPlaylistReset);
router.put("/playlist/:idPlaylist/save", putPlaylistSave);
router.delete("/playlist/:idPlaylist", deletePlaylist);
// Playlist's audio
router.post("/playlist/:idPlaylist/audio", postPlaylistAudio);
router.put("/playlist/:idPlaylist/audio/:idAudio", putPlaylistAudio);
router.delete("/playlist/:idPlaylist/audio/:idItem", deletePlaylistAudio);

export default router;
