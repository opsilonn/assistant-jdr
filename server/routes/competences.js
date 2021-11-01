import { Router } from "express";
import getCompetence from "../controllers/get.competence.js";
import getCompetences from "../controllers/get.competences.js";
import postCompetence from "../controllers/post.competence.js";
import putCompetence from "../controllers/put.competence.js";
import deleteCompetence from "../controllers/delete.competence.js";

const router = Router();
router.get("/competence/:competenceId", getCompetence);
router.get("/competences", getCompetences);
router.post("/competence", postCompetence);
router.put("/competence/:competenceId", putCompetence);
router.delete("/competence/:competenceId", deleteCompetence);

export default router;
