import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/index";
import { initializeApp } from "firebase/app";
import "vue-toast-notification/dist/theme-sugar.css";
import VueToast from "vue-toast-notification";
import 'popper.js';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';

const app = createApp(App);

app.use(router).use(store).use(VueToast);

const firebaseConfig = {
  apiKey: "AIzaSyD1wfBa3TTGdR4xqXg9kU3HaKpkkyQQpE8",
  authDomain: "game-ab172.firebaseapp.com",
  databaseURL: "https://game-ab172-default-rtdb.firebaseio.com",
  projectId: "game-ab172",
  storageBucket: "game-ab172.appspot.com",
  messagingSenderId: "745485943638",
  appId: "1:745485943638:web:74890acde2bf5368710cf7",
  measurementId: "G-KG736KE2VM",
};

initializeApp(firebaseConfig);

app.mount("#app");
