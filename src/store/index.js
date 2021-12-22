import Vue from "vue";
import Vuex from "vuex";
// import axios from "axios";
import { auth } from "./modules/auth";
import { employees } from "./modules/employees";
import { categories } from "./modules/categories";

Vue.use(Vuex);

// axios.defaults.baseURL = process.env.VUE_APP_API_URL;

export default new Vuex.Store({
  modules: {
    auth,
    categories,
    employees,
  },
});
