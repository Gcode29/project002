import api from "../api";
import Csrf from "../Csrf";

const state = {
  token: localStorage.getItem("token") || "",
  user: null,
  isLoggedIn: !!localStorage.getItem("token"),
};

const getters = {
  isLogged: (state) => !!state.user,
  token: (state) => state.token,
  user: (state) => state.user,
};

const mutations = {
  SET_DATA(state, data) {
    state.user = data;

    localStorage.setItem(
      "token",
      (api().defaults.headers.common.Authorization = ` ${data.token}`)
    );

    localStorage.setItem("auth", "true");
  },
  SET_USER: (state, data) => (state.user = data),
};

const actions = {
  async login({ commit, dispatch }, credentials) {
    await Csrf.getCookie();
    return api()
      .post("/login", credentials)
      .then(({ data }) => {
        api().get("/csrf-cookie");

        commit("SET_DATA", data);

        dispatch("me");
      });
  },

  async me({ commit }) {
    const response = await api().get("/me");

    commit("SET_USER", response.data);
  },

  async logout() {
    await Csrf.getCookie();

    localStorage.removeItem("token");
  },
};

export const auth = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
