import { Router } from "express";
import getCompetence from "../controllers/competences/get.competence.js";
import getCompetences from "../controllers/competences/get.competences.js";
import postCompetence from "../controllers/competences/post.competence.js";
import putCompetence from "../controllers/competences/put.competence.js";
import deleteCompetence from "../controllers/competences/delete.competence.js";

const router = Router();
router.get("/competence/:competenceId", getCompetence);
router.get("/competences", getCompetences);
router.post("/competence", postCompetence);
router.put("/competence/:competenceId", putCompetence);
router.delete("/competence/:competenceId", deleteCompetence);

export default router;
