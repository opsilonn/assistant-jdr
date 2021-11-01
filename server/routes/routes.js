import { Router } from "express";
import competenceRouter from "./competences.js";

const router = Router();
router.use("/", competenceRouter);

export default router;
