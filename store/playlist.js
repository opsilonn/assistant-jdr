const state = () => ({
  playlists: [],
});

const getters = {
  /** */
  getPlaylist: (state) => (id) => state.playlists.find((_) => _.id === id),
};

const mutations = {
  /**
   *
   * @param {*} state
   * @param {*} playlist
   */
  addPlaylist(state, playlist) {
    const curr = state.playlists.find((_) => _.id === playlist.id);
    if (!curr) {
      state.playlists.push(playlist);
    } else {
      curr.description = playlist.description;
      curr.finished = playlist.finished;
    }
  },

  /**
   *
   * @param {*} state
   * @param {*} id
   */
  deletePlaylist(state, id) {
    const index = state.playlists.findIndex((_) => _.id === id);
    if (index >= 0) {
      state.playlists.splice(index, 1);
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
    const playlist = await this.$axios.$put(`/api/playlist/${id}`, {
      id: id,
      name: name,
      audios: audios,
    });
    commit("addPlaylist", playlist);
  },

  /** */
  async deletePlaylist({ commit }, { id }) {
    const result = await this.$axios.$delete(`/api/playlist/${id}`);
    commit("deletePlaylist", id);
    return result;
  },

  /** */
  async updatePlaylistAudio(
    { commit },
    { idPlaylist, audio = { id, name, surname } }
  ) {
    const url = `/api/playlist/${idPlaylist}/audio/${audio.id}`;
    const playlist = await this.$axios.$put(url, {
      id: audio.id,
      name: audio.name,
      surname: audio.surname,
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
