import { Router } from "express";
import getAudioFiles from "../controllers/audio/get.audios.js";

const router = Router();
router.get("/audios", getAudioFiles);

export default router;
