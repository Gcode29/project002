import api from "../api";
// import Csrf from "../Csrf";

const getDefaultState = () => {
  return {
    categorysubdata: [],
  };
};

const state = {
  subcategories: [],
  // categories: [],
  subcategory: {},

  categorysubdata: [],
};

const getters = {
  allSubCategories: (state) => state.subcategories,
  allCategories: (state) => state.categories,
  categorysubdata: (state) => state.categorysubdata,
};

const actions = {
  async getSubCategories({ commit }) {
    const response = await api().get("/subcategories");
    commit("SET_SUBCATEGORY", response.data);
  },

  async resetCategorySub({ commit }) {
    commit("resetState");
  },

  async getCategorySub({ commit }, id) {
    const response = await api().get(`/subcategories/${id}`, id);

    commit("get_subcategory", response.data);
  },

  async addSubCategory({ commit }, credentials) {
    const response = await api().post(`/subcategories`, credentials);
    commit("createSubCategory", response.data);
  },

  async deleteSubCategory({ commit }, id) {
    await api().delete(`subcategories/${id}`);
    commit("removeSubCategory", id);
  },

  async updateSubCategory({ commit }, payload) {
    const response = await api().put(`subcategories/${payload.id}`, payload);
    commit("updateSubCategory", response.data);
  },
};

const mutations = {
  SET_SUBCATEGORY: (state, data) => (state.subcategories = data),
  createSubCategory: (state, data) => state.subcategories.unshift(data),
  removeSubCategory: (state, id) =>
    (state.subcategories = state.subcategories.filter(
      (subcategory) => subcategory.id !== id
    )),
  updateSubCategory: (state, data) => {
    // Find index
    const index = state.subcategories.findIndex(
      (subcategory) => subcategory.id === data.id
    );
    if (index !== -1) {
      state.subcategories.splice(index, 1, data);
    }
  },

  get_subcategory: (state, data) => (state.categorysubdata = data),
  resetState(state) {
    Object.assign(state.categorysubdata, getDefaultState());
  },
};

export const subcategories = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
