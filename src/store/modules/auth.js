import api from "../api";

const state = {
  token: localStorage.getItem("token") || "",
  user: null,
};

const mutations = {
  SET_DATA(state, data) {
    state.user = data;

    // localStorage.setItem("user", JSON.stringify(data));

    localStorage.setItem(
      "token",
      (api.defaults.headers.common.Authorization = ` ${data.token}`)
    );
  },

  SET_USER: (state, data) => (state.user = data),
};

const actions = {
  login({ commit, dispatch }, credentials) {
    return api.post("/login", credentials).then(({ data }) => {
      commit("SET_DATA", data);

      dispatch("user_data");
    });
  },

  async me({ commit }) {
    const response = await api.get("/me");

    commit("SET_USER", response.data);
  },
};

const getters = {
  isLogged: (state) => !!state.user,
  token: (state) => state.token,
  user: (state) => state.user,
};

export const auth = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
