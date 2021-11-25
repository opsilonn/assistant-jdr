const state = () => ({
  playlists: [],
});

const getters = {
  /** */
  getPlaylistById: (state) => (id) => state.playlists.find((_) => _.id === id),
};

const mutations = {
  /**
   *
   * @param {*} state
   * @param {*} playlist
   */
  addPlaylist(state, playlist) {
    const index = state.playlists.findIndex((_) => _.id === playlist.id);
    if (index < 0) {
      state.playlists.push(playlist);
    } else {
      state.playlists[index] = playlist;
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
    });
    commit("addPlaylist", playlist);
    return playlist;
  },

  /** */
  async updatePlaylist({ commit }, { id, name }) {
    const playlist = await this.$axios.$put(`/api/playlist/${id}`, {
      id: id,
      name: name,
    });
    commit("addPlaylist", playlist);
    return playlist;
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
    { idPlaylist, audio = { id, name, surname }, path }
  ) {
    const url = `/api/playlist/${idPlaylist}/audio/${audio.id}`;
    const params = {
      id: audio.id,
      name: audio.name,
      surname: audio.surname,
      audio: {
        id: audio.id,
        name: audio.name,
        surname: audio.surname,
      },
      path: path,
    };
    const playlist = await this.$axios.$put(url, params);
    commit("addPlaylist", playlist);
  },

  /** */
  async addAudioToPlaylist(
    { commit },
    { idPlaylist, audio = { id, name, path } }
  ) {
    const url = `/api/playlist/${idPlaylist}/audio`;
    const params = {
      id: audio.id,
      name: audio.name,
      path: audio.path,
    };
    this.$axios
      .$post(url, params)
      .then((playlist) => commit("addPlaylist", playlist));
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
