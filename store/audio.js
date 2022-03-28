const state = () => ({
  audios: [],
  audioFolder: [],
  audiosDatabase: [],
});

const getters = {};

const mutations = {
  /** */
  initAudio(state, audioData) {
    // Audios ordered in corresponding subfolders
    state.audioFolder = audioData.audioFolder;
    // Every audio gathered in a single list
    state.audiosDatabase = audioData.audiosDatabase;
  },
};

const actions = {
  /** Gets ALL the audio folder */
  async fetchAudioFolder({ commit }) {
    const audioData = await this.$axios.$get("/api/audios");
    commit("initAudio", audioData);
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
