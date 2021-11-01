import Competence from "../../models/competence.model.js";

/**
 * @param { import('express').Request } req
 * @param { import('express').Response } res
 */
export default async function deleteCompetence(req, res) {
  try {
    await Competence.delete(parseInt(req.params.competenceId));
    res.status(204).json(true);
  } catch (err) {
    console.log(err);
    res.status(404).json(err.message);
  }
}
