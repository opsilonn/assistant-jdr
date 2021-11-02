const state = () => ({
  audios: [],
  audioFolder: [],
});

const getters = {};

const mutations = {
  /** */
  setAudioFolder(state, audioFolder) {
    state.audioFolder = audioFolder;
  },
};

const actions = {
  /** Gets ALL the audio folder */
  async fetchAudioFolder({ commit }) {
    const audioFolder = await this.$axios.$get("/api/audios");
    commit("setAudioFolder", audioFolder);
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
