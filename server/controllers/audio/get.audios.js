import Audio from "../../models/audio.model.js";

/**
 * @param { import('express').Request } req
 * @param { import('express').Response } res
 */
export default async function getAudioFiles(req, res) {
  try {
    const audioFiles = await Audio.getAll();
    res.status(200).json(audioFiles);
  } catch (err) {
    res.status(404).json(err.message);
  }
}
