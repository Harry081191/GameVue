import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "LoginView",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/LoginView.vue"),
  },
  {
    path: "/CreateAccount",
    name: "CreateAccount",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/CreateAccount.vue"),
  },
  {
    path: "/HomeView/:userId?",
    name: "HomeView",
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/HomeView.vue"),
  },
  {
    path: "/Officialnotificationarea/:userId?",
    name: "Officialnotificationarea",
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(
        /* webpackChunkName: "about" */ "../views/Officialnotificationarea.vue"
      ),
  },
  {
    path: "/ForgetPassword",
    name: "ForgetPassword",
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/ForgetPassword.vue"),
  },
  {
    path: "/ChangePassword",
    name: "ChangePassword",
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/ChangePassword.vue"),
  },
  {
    path: "/Playertalkarea/:userId?",
    name: "Playertalkarea",
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Playertalkarea.vue"),
  },
  {
    path: "/EmailBindingChangePassword",
    name: "EmailBindingChangePassword",
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(
        /* webpackChunkName: "about" */ "../views/EmailBindingChangePassword.vue"
      ),
  },
  {
    path: "/EmailVerification",
    name: "EmailVerification",
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/EmailVerification.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
