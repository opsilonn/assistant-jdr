import Competence from "../models/competence.model.js";

/**
 * @param { import('express').Request } req
 * @param { import('express').Response } res
 */
export default async function putCompetence(req, res) {
  try {
    const competence = await Competence.update(
      parseInt(req.params.competenceId),
      req.body
    );
    res.status(200).json(competence);
  } catch (err) {
    res.status(404).json(err.message);
  }
}
