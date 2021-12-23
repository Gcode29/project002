import api from "../api";
// import Csrf from "../Csrf";

const state = {
  deliveries: [],
  deliveryData: [],
  delivery: {},
};

const getters = {
  allDeliveries: (state) => state.deliveries,
  deliveryData: (state) => state.deliveryData,
};

const actions = {
  async getDeliveries({ commit }) {
    const response = await api().get("/deliveries");
    commit("SET_DELIVERIES", response.data);
  },

  async getDeliveryData({ commit }, id) {
    const response = await api().get(`/deliveries/${id}`);
    commit("GET_DELIVERYDATA", response.data);
  },

  async addDelivery({ commit }, credentials) {
    const response = await api().post(`/deliveries`, credentials);
    commit("createDelivery", response.data);
  },

  async deleteDelivery({ commit }, id) {
    await api().delete(`deliveries/${id}`);
    commit("removeDelivery", id);
  },

  async updateDelivery({ commit }, payload) {
    const response = await api().put(`deliveries/${payload.id}`, payload);
    commit("updateDelivery", response.data);
  },
};

const mutations = {
  SET_DELIVERIES: (state, data) => (state.deliveries = data),

  GET_DELIVERYDATA: (state, data) => (state.deliveryData = data),

  createDelivery: (state, data) => state.deliveries.unshift(data),
  removeDelivery: (state, id) =>
    (state.deliveries = state.deliveries.filter(
      (delivery) => delivery.id !== id
    )),
  updateDelivery: (state, data) => {
    // Find index
    const index = state.deliveries.findIndex(
      (delivery) => delivery.id === data.id
    );
    if (index !== -1) {
      state.deliveries.splice(index, 1, data);
    }
  },
};

export const deliveries = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
