import Vue from "vue";
import VueRouter from "vue-router";
// import Dashboard from "../views/Dashboard.vue";
import Login from "../views/Login.vue";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
    meta: {
      hideForAuth: true,
    },
  },

  {
    path: "/dashboard",
    meta: {
      requiresAuth: true,
    },
    component: Home,
    children: [
      {
        path: "/dashboard",
        name: "Home",
        component: () => import("@/views/Dashboard"),
      },
      {
        path: "/ProductCategories",
        component: () => import("@/views/admin/Category"),
      },
      {
        path: "/ProductSubCategories",
        component: () => import("@/views/admin/SubCategory"),
      },
      {
        path: "/ProductManagement",
        component: () => import("@/views/admin/ProductInformation"),
      },
      {
        path: "/Inbound",
        component: () => import("@/views/admin/Inbound"),
      },
      {
        path: "/Transaction",
        component: () => import("@/views/admin/Transaction"),
      },
      {
        path: "/Inventory",
        component: () => import("@/views/admin/Inventory"),
      },
      {
        path: "/UserManagement",
        component: () => import("@/views/admin/HRmanagement"),
      },
      {
        path: "/Sales",
        component: () => import("@/views/admin/Sales"),
      },
      {
        path: "/Collection",
        component: () => import("@/views/admin/Collection"),
      },
      {
        path: "/Profile",
        component: () => import("@/views/admin/Profile"),
      },
      {
        path: "/about",
        name: "About",
        component: () => import("../views/About.vue"),
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    component: () => import("@/views/PathNotFound"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const loggedIn = localStorage.getItem("token");

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!loggedIn) {
      next({ path: "/" });
    } else {
      next();
    }
  } else {
    next();
  }

  if (to.matched.some((record) => record.meta.hideForAuth)) {
    if (loggedIn) {
      next({ path: "/", name: "Home" });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
