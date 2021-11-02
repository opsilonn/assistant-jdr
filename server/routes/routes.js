import { Router } from "express";
import audioRouter from "./audio.js";
import competenceRouter from "./competences.js";

const router = Router();
router.use("/", audioRouter);
router.use("/", competenceRouter);

export default router;
