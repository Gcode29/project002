import api from "../api";
// import Csrf from "../Csrf";

const state = {
  categories: [],
  category: {},
};

const getters = {
  allCategories: (state) => state.categories,
};

const actions = {
  async getCategories({ commit }) {
    const response = await api().get("/categories");
    commit("SET_CATEGORY", response.data);
  },

  async addCategory({ commit }, credentials) {
    const response = await api().post(`/categories`, credentials);
    commit("createCategory", response.data);
  },

  async deleteCategory({ commit }, id) {
    await api().delete(`categories/${id}`);
    commit("removeCategory", id);
  },

  async updateCategory({ commit }, payload) {
    const response = await api().put(`categories/${payload.id}`, payload);
    commit("updateCategory", response.data);
  },
};

const mutations = {
  SET_CATEGORY: (state, data) => (state.categories = data),
  createCategory: (state, data) => state.categories.unshift(data),
  removeCategory: (state, id) =>
    (state.categories = state.categories.filter(
      (category) => category.id !== id
    )),
  updateCategory: (state, data) => {
    // Find index
    const index = state.categories.findIndex(
      (category) => category.id === data.id
    );
    if (index !== -1) {
      state.categories.splice(index, 1, data);
    }
  },
};

export const categories = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
