import api from "../api";

const state = {
  Branches: [],
  Branch: {},
};

const getters = {
  allBranches: (state) => state.Branches,
};

const actions = {
  async getBranches({ commit }) {
    const response = await api().get("/branches");
    commit("SET_BRANCH", response.data);
  },

  async addBranch({ commit }, credentials) {
    const response = await api().post(`/branches`, credentials);
    commit("createBranch", response.data);
  },

  async deleteBranch({ commit }, id) {
    await api().delete(`branches/${id}`);
    commit("removeBranch", id);
  },

  async updateBranch({ commit }, payload) {
    const response = await api().put(`branches/${payload.id}`, payload);
    commit("updateBranch", response.data);
  },
};

const mutations = {
  SET_BRANCH: (state, data) => (state.Branches = data),
  createBranch: (state, data) => state.Branches.unshift(data),
  removeBranch: (state, id) =>
    (state.Branches = state.Branches.filter((branch) => branch.id !== id)),
  updateBranch: (state, data) => {
    // Find index
    const index = state.Branches.findIndex((branch) => branch.id === data.id);
    if (index !== -1) {
      state.Branches.splice(index, 1, data);
    }
  },
};

export const branches = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
