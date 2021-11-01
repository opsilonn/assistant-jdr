import Competence from "../../models/competence.model.js";

/**
 * @param { import('express').Request } req
 * @param { import('express').Response } res
 */
export default async function getCompetences(req, res) {
  try {
    const competences = await Competence.getAll();
    res.status(200).json(competences);
  } catch (err) {
    res.status(404).json(err.message);
  }
}
