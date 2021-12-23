import Vue from "vue";
import Vuex from "vuex";
// import axios from "axios";
import { auth } from "./modules/auth";
import { employees } from "./modules/employees";
import { categories } from "./modules/categories";
import { subcategories } from "./modules/subcategory";
import { products } from "./modules/product";
import { deliveries } from "./modules/deliveries";
import { branches } from "./modules/branch";

Vue.use(Vuex);

// axios.defaults.baseURL = process.env.VUE_APP_API_URL;

export default new Vuex.Store({
  modules: {
    auth,
    employees,
    categories,
    subcategories,
    products,
    deliveries,
    branches,
  },
});
