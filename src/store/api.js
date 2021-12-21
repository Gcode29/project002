import axios from "axios";

const BaseApi = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
});

let api = function () {
  let token = localStorage.getItem("token");

  if (token) {
    BaseApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  return BaseApi;
};

export default api;
