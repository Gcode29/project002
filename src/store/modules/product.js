import api from "../api";
// import Csrf from "../Csrf";

const state = {
  products: [],
  product: {},
};

const getters = {
  allProducts: (state) => state.products,
};

const actions = {
  async getProducts({ commit }) {
    const response = await api().get("/products");
    commit("SET_PRODUCTS", response.data);
  },

  async addProduct({ commit }, credentials) {
    const response = await api().post(`/products`, credentials);
    commit("createProduct", response.data);
  },

  async deleteProduct({ commit }, id) {
    await api().delete(`products/${id}`);
    commit("removeProduct", id);
  },

  async updateProduct({ commit }, payload) {
    const response = await api().put(`products/${payload.id}`, payload);
    commit("updateProduct", response.data);
  },
};

const mutations = {
  SET_PRODUCTS: (state, data) => (state.products = data),

  createProduct: (state, data) => state.products.unshift(data),
  removeProduct: (state, id) =>
    (state.products = state.products.filter((product) => product.id !== id)),
  updateProduct: (state, data) => {
    // Find index
    const index = state.products.findIndex((product) => product.id === data.id);
    if (index !== -1) {
      state.products.splice(index, 1, data);
    }
  },
};

export const products = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
