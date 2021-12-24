import api from "../api";
// import Csrf from "../Csrf";

const state = {
  clients: [],
  collections: [],
  clientAddress: {},
  client: {},
};

const getters = {
  allClients: (state) => state.clients,
  clientCollections: (state) => state.collections,
  clientAddress: (state) => state.clientAddress,
};

const actions = {
  async getClients({ commit }) {
    const response = await api().get("/clients");
    commit("SET_CLIENT", response.data);
  },

  async getClientAddress({ commit }, id) {
    const response = await api().get(`/clients/${id}`);
    commit("GET_CLIENTADDRESS", response.data);
  },

  async getClietCollections({ commit }, id) {
    const response = await api().get(`/clients/${id}`);
    commit("GET_CLIENTDATA", response.data);
  },

  async addClient({ commit }, credentials) {
    const response = await api().post(`/clients`, credentials);
    commit("createClient", response.data);
  },

  async deleteClient({ commit }, id) {
    await api().delete(`clients/${id}`);
    commit("removeClient", id);
  },

  async updateClient({ commit }, payload) {
    const response = await api().put(`clients/${payload.id}`, payload);
    commit("updateClient", response.data);
  },
};

const mutations = {
  SET_CLIENT: (state, data) => (state.clients = data),
  GET_CLIENTDATA: (state, data) => (state.collections = data),

  GET_CLIENTADDRESS: (state, data) => (state.clientAddress = data),

  createClient: (state, data) => state.clients.unshift(data),
  removeClient: (state, id) =>
    (state.clients = state.clients.filter((client) => client.id !== id)),
  updateClient: (state, data) => {
    // Find index
    const index = state.clients.findIndex((client) => client.id === data.id);
    if (index !== -1) {
      state.clients.splice(index, 1, data);
    }
  },
};

export const clients = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
