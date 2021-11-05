import { Router } from "express";
import audioRouter from "./audio.js";
import competenceRouter from "./competences.js";
import playlistRouter from "./playlists.js";

const router = Router();
router.use("/", audioRouter);
router.use("/", competenceRouter);
router.use("/", playlistRouter);

export default router;
