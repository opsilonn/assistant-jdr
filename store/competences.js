const state = () => ({
  competences: [],
});

const getters = {
  /** */
  getCompetencesCombat: (state) => () =>
    state.competences.filter((_) => _.bIsCombat),

  /** */
  getCompetencesSocial: (state) => () =>
    state.competences.filter((_) => _.bIsSocial),

  /** */
  getCompetencesAutre: (state) => () =>
    state.competences.filter((_) => !_.bIsCombat && !_.bIsSocial),
};

const mutations = {
  addCompetence(state, competence) {
    const curr = state.competences.find((_) => _.id === competence.id);
    if (!curr) {
      state.competences.push(competence);
    } else {
      curr.description = competence.description;
      curr.finished = competence.finished;
    }
  },
};

const actions = {
  async fetchAllCompetences({ commit }) {
    const competences = await this.$axios.$get("/api/competences");
    competences.forEach((t) => commit("addCompetence", t));
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
