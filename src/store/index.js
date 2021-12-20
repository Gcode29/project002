import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

axios.defaults.baseURL = process.env.VUE_APP_API_URL;

export default new Vuex.Store({
  state: {
    token: localStorage.getItem("token") || "",
    user: null,
  },

  mutations: {
    setUserData(state, userData) {
      state.user = userData;
      localStorage.setItem("user", JSON.stringify(userData));
      axios.defaults.headers.common.Authorization = `Bearer ${userData.token}`;
    },

    clearUserData() {
      localStorage.removeItem("user");
      location.reload();
    },
  },

  actions: {
    login({ commit }, credentials) {
      return axios.post("/login", credentials).then(({ data }) => {
        commit("setUserData", data);
      });
    },

    logout({ commit }) {
      commit("clearUserData");
    },
  },

  getters: {
    isLogged: (state) => !!state.user,
  },
});
