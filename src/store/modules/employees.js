import api from "../api";
// import Csrf from "../Csrf";

const state = {
  employees: [],
  employee: {},
};

const getters = {
  //   allEmployees: (state) => {
  //     return state.employees;
  //   },
  allEmployees: (state) => state.employees,
};

const actions = {
  async getEmployee({ commit }) {
    const response = await api().get("/employees");

    commit("SET_EMPLOYEE", response.data);
  },

  async addEmployee({ commit }, credentials) {
    //
    const response = await api().post(`/employees`, credentials);

    commit("createEmployee", response.data);
  },

  async deleteEmployee({ commit }, id) {
    await api().delete(`employees/${id}`);

    commit("removeEmployee", id);
  },

  async updateEmployee({ commit }, payload) {
    const response = await api().put(`employees/${payload.id}`, payload);

    commit("updateEmployee", response.data);
  },
};

const mutations = {
  SET_EMPLOYEE: (state, data) => (state.employees = data),

  createEmployee: (state, data) => state.employees.unshift(data),

  removeEmployee: (state, id) =>
    (state.employees = state.employees.filter(
      (employee) => employee.id !== id
    )),

  updateEmployee: (state, data) => {
    // Find index
    const index = state.employees.findIndex(
      (employee) => employee.id === data.id
    );

    if (index !== -1) {
      state.employees.splice(index, 1, data);
    }
  },
};

export const employees = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
