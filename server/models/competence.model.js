import fs from "fs";
import path from "path";
import { promisify } from "util";

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const competencesFile = path.join(__dirname, "../data/competences.json");

export default class Competence {
  /** @type {Number} */
  id;
  /** @type {String} */
  name;
  /** @type {Number} */
  min;
  /** @type {Number} */
  range;
  /** @type {Array[Number]} */
  orientationsIndexes;
  /** @type {Boolean} */
  bIsCombat;
  /** @type {Boolean} */
  bIsSocial;

  /**
   * Constructor
   * @param {Competence} newCompetence
   */
  constructor(newCompetence) {
    this.id = newCompetence.id;
    this.name = newCompetence.name;
    this.min = newCompetence.min;
    this.range = newCompetence.range;
    this.orientationsIndexes = newCompetence.orientationsIndexes;
    this.bIsCombat = !!newCompetence.bIsCombat;
    this.bIsSocial = !!newCompetence.bIsSocial;
  }

  /**
   * @param {Number} id
   * @returns {Promise<Competence>}
   */
  static async get(id) {
    // Read the file
    const competences = await this.getAll();

    // Find the correct instance
    const competence = competences.find((_) => _.id === id);

    // If the instance was not found : throw error
    if (!competence) {
      throw new Error("Instance not found !");
    }

    return competence;
  }

  /**
   * @returns {Promise<Competence[]>}
   */
  static async getAll() {
    // Read the file
    const competences = await readFile(competencesFile, "utf8");

    // Parse the file as JSON
    return JSON.parse(competences);
  }

  /**
   * @param {Competence} competenceReceived
   * @returns {Promise<Todo>}
   */
  static async add(competenceReceived) {
    // Read the file
    const competences = await this.getAll();

    // Get and set the id
    const maxId = Math.max.apply(
      null,
      competences.map((_) => _.id)
    );
    competenceReceived.id = maxId + 1;

    // Create new Competence
    const competence = new Competence(competenceReceived);

    // Add new Competence
    competences.push(competence);
    writeFile(competencesFile, JSON.stringify(competences, null, 2), "utf8");

    return competence;
  }

  /**
   *
   * @param {Number} id
   * @param {Competence} competenceReceived
   * @returns {Promise<Todo>}
   */
  static async update(id, competenceReceived) {
    // Read the file
    let competences = await this.getAll();
    let competence = {};

    // We get the specific index
    const index = competences.findIndex((_) => _.id === id);

    // If we found an index : update ; if not : throw Error
    if (index >= 0) {
      competenceReceived.id = id;
      competence = new Competence(competenceReceived);
      competences[index] = competence;
      writeFile(competencesFile, JSON.stringify(competences, null, 2), "utf8");
    } else {
      throw new Error("Instance not found !");
    }

    return competence;
  }

  /**
   * @param {Number} id
   * @returns {Promise<Todo>}
   */
  static async delete(id) {
    // Read the file
    let competences = await this.getAll();

    // get index of the instance to remove
    const index = competences.findIndex((_) => _.id === id);

    // invalid index : throw Error
    if (index <= -1) {
      throw new Error("Instance not found !");
    }

    // Remove found Competence
    competences.splice(index, 1);

    // Re-write file
    writeFile(competencesFile, JSON.stringify(competences, null, 2), "utf8");
  }
}
