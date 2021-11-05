import { Router } from "express";
// Playlist
import getPlaylist from "../controllers/playlist/get.playlist.js";
import getPlaylists from "../controllers/playlist/get.playlists.js";
import postPlaylist from "../controllers/playlist/post.playlist.js";
import putPlaylist from "../controllers/playlist/put.playlist.js";
import deletePlaylist from "../controllers/playlist/delete.playlist.js";
// Playlist's audio
import postPlaylistAudio from "../controllers/playlist/post.playlist.audio.js";
import putPlaylistAudio from "../controllers/playlist/put.playlist.audio.js";
import deletePlaylistAudio from "../controllers/playlist/delete.playlist.audio.js";

const router = Router();
// Playlist
router.get("/playlist/:playlistId", getPlaylist);
router.get("/playlists", getPlaylists);
router.post("/playlist", postPlaylist);
router.put("/playlist/:playlistId", putPlaylist);
router.delete("/playlist/:playlistId", deletePlaylist);
// Playlist's audio
router.post("/playlist/:playlistId/audio", postPlaylistAudio);
router.put("/playlist/:playlistId/audio/:audioId", putPlaylistAudio);
router.delete("/playlist/:playlistId/audio/:audioId", deletePlaylistAudio);

export default router;
