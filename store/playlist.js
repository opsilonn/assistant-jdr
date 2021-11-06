const state = () => ({
  playlists: [],
});

const getters = {
  /** */
  getPlaylist: (state) => (id) => state.playlists.find((_) => _.id === id),
};

const mutations = {
  addPlaylist(state, playlist) {
    const curr = state.playlists.find((_) => _.id === playlist.id);
    if (!curr) {
      state.playlists.push(playlist);
    } else {
      curr.description = playlist.description;
      curr.finished = playlist.finished;
    }
  },
};

const actions = {
  /** */
  async fetchAllPlaylists({ commit }) {
    const playlists = await this.$axios.$get("/api/playlists");
    playlists.forEach((t) => commit("addPlaylist", t));
  },

  /** */
  async createPlaylist({ commit }, { name }) {
    const playlist = await this.$axios.$post("/api/playlist", {
      name: name,
      audios: [],
    });
    commit("addPlaylist", playlist);
    return playlist;
  },

  /** */
  async updatePlaylist({ commit }, { id, name, audios }) {
    const playlist = await this.$axios.$put("/api/playlist", id, {
      id: id,
      name: name,
      audios: audios,
    });
    commit("addPlaylist", playlist);
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
