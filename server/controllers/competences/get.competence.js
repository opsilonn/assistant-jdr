import Competence from "../../models/competence.model.js";

/**
 * @param { import('express').Request } req
 * @param { import('express').Response } res
 */
export default async function getCompetence(req, res) {
  try {
    const competence = await Competence.get(parseInt(req.params.competenceId));
    res.status(200).json(competence);
  } catch (err) {
    res.status(404).json(err.message);
  }
}
