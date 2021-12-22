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

  async addCategory() {
    //
    // const response = await api().post(`/employees`, credentials);
    // commit("createEmployee", response.data);
  },

  async deleteCategory() {
    // await api().delete(`employees/${id}`);
    // commit("removeEmployee", id);
  },

  async updateCategory() {
    // const response = await api().put(`employees/${payload.id}`, payload);
    // commit("updateEmployee", response.data);
  },
};

const mutations = {
  SET_CATEGORY: (state, data) => (state.categories = data),
  //   createEmployee: (state, data) => state.employees.unshift(data),
  //   removeEmployee: (state, id) =>
  //     (state.employees = state.employees.filter(
  //       (employee) => employee.id !== id
  //     )),
  //   updateEmployee: (state, data) => {
  //     // Find index
  //     const index = state.employees.findIndex(
  //       (employee) => employee.id === data.id
  //     );
  //     if (index !== -1) {
  //       state.employees.splice(index, 1, data);
  //     }
  //   },
};

export const categories = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
