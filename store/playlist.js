/** @param {String} path */
function fillPlaylistWithData(currentPlaylistNode, database) {
  currentPlaylistNode.forEach((item) => {
    // If the item is a folder : we go through it
    if (!!item.children) {
      this.updateFolder(folder.children);
    } else {
      // If the item is an audio : we fetch it and update the current data
      const audio = database.find((a) => a.id === item.idAudio);
      item.name = audio.name;
      item.path = audio.path;
    }
  });
}

const state = () => ({
  playlists: [],
  savedPlaylist: { id: -1, name: "", rootFolder: [] },
  database: [],
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
    fillPlaylistWithData(playlist.rootFolder, state.database);
    const index = state.playlists.findIndex((_) => _.id === playlist.id);
    if (index < 0) {
      state.playlists.push(playlist);
    } else {
      state.playlists[index] = playlist;
      state.playlists = [...state.playlists];
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

  /**
   *
   * @param {*} state
   * @param {*} savedPlaylist
   */
  setSavedPlaylist(state, savedPlaylist) {
    fillPlaylistWithData(savedPlaylist.rootFolder, state.database);
    state.savedPlaylist = savedPlaylist;
  },

  /**
   *
   * @param {*} state
   */
  resetSavedPlaylist(state) {
    state.savedPlaylist = { id: -1, name: "", rootFolder: [] };
  },

  /**
   *
   * @param {*} state
   * @param {*} database
   */
  setAudiosDatabase(state, database) {
    state.database = database;
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
  async updatePlaylist({ commit }, { id, name, rootFolder, total }) {
    const playlist = await this.$axios.$put(`/api/playlist/${id}`, {
      id: id,
      name: name,
      rootFolder: rootFolder || undefined,
      total: total || undefined,
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
  async savePlaylist({ commit }, { idPlaylist }) {
    const url = `/api/playlist/${idPlaylist}/save`;
    this.$axios.$put(url).then((playlist) => commit("addPlaylist", playlist));
    return true;
  },

  // SAVED

  /** */
  async fetchSavedPlaylist({ commit }, { id }) {
    const savedPlaylist = await this.$axios.$get(`/api/playlist/${id}/saved`);
    commit("setSavedPlaylist", savedPlaylist);
  },

  /** */
  async addAudioToPlaylist({ commit }, { idPlaylist, audio = { id, path }, idFolder, index }) {
    const url = `/api/playlist/${idPlaylist}/audio`;
    const params = {
      audio: {
        id: audio.id,
        path: audio.path,
      },
      idFolder: idFolder,
      index: index,
    };
    this.$axios.$post(url, params).then((playlist) => commit("setSavedPlaylist", playlist));
  },

  /** */
  async moveItemWithinPlaylist({ commit }, { idPlaylist, idItem, idFolderToMoveTo, newIndex }) {
    const url = `/api/playlist/${idPlaylist}/audio/${idItem}/move`;
    const params = {
      idFolderToMoveTo: idFolderToMoveTo,
      newIndex: newIndex
    };
    this.$axios.$put(url, params).then((playlist) => commit("setSavedPlaylist", playlist));
  },

  /** */
  async updatePlaylistAudio({ commit }, { idPlaylist, audio = { id, idAudio, surname }, path }) {
    const url = `/api/playlist/${idPlaylist}/audio/${audio.id}`;
    const params = {
      audio: {
        id: audio.id,
        idAudio: audio.idAudio,
        surname: audio.surname,
      },
      path: path,
    };
    const playlist = await this.$axios.$put(url, params);
    commit("addPlaylist", playlist);
  },

  /** */
  async deleteFromPlaylist({ commit }, { idPlaylist, idItem }) {
    const url = `/api/playlist/${idPlaylist}/audio/${idItem}`;
    this.$axios.$delete(url).then((playlist) => commit("setSavedPlaylist", playlist));
  },

  /** */
  async resetPlaylist({ commit }, { idPlaylist }) {
    const url = `/api/playlist/${idPlaylist}/reset`;
    this.$axios.$put(url).then((playlist) => commit("setSavedPlaylist", playlist));
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
