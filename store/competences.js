const state = () => ({
  competences: [],
});

const getters = {
  getCompetencesBySocial: (state) => () =>
    state.competences.filter((_) => _.bIsSocial),
};

const mutations = {
  addCompetence(state, competence) {
    const curr = state.competences.find((t) => t.id === competence.id);
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

  async createCompetence({ commit }, { description }) {
    const competence = await this.$axios.$post("/api/competence", {
      description,
      finished: false,
    });
    commit("addCompetence", competence);
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
