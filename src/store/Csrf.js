import api from "../store/api";
import Cookies from "js-cookie";
// npm install js-cookie

export default {
  getCookie() {
    let token = Cookies.get("XSRF-TOKEN");

    if (token) {
      return new Promise((resolve) => {
        resolve(token);
      });
    }

    return api().get("/csrf-cookie");
  },
};
