import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue')
  },
  {
    path: '/CreateAccount',
    name: 'CreateAccount',
    component: () => import(/* webpackChunkName: "about" */ '../views/CreateAccount.vue')
  },
  {
    path: '/Home/:userId?',
    name: 'Home',
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Home.vue'),
  },
  {
    path: '/Officialnotificationarea/:userId?',
    name: 'Officialnotificationarea',
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Officialnotificationarea.vue')
  },
  {
    path: '/ForgetPassword',
    name: 'ForgetPassword',
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/ForgetPassword.vue')
  },
  {
    path: '/Playertalkarea/:userId?',
    name: 'Playertalkarea',
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Playertalkarea.vue')
  },
  {
    path: '/EmailBindingChangePassword',
    name: 'EmailBindingChangePassword',
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/EmailBindingChangePassword.vue')
  },
  {
    path: '/EmailVerification',
    name: 'EmailVerification',
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/EmailVerification.vue')
  }
]


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
