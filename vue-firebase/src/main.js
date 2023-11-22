import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/index'
import firebase from 'firebase/app'; // 引入整個 Firebase
import 'firebase/auth'; // 引入 Firebase Authentication 模組
import 'firebase/firestore'; // 引入 Firebase Firestore 模組
import 'firebase/storage'; // 引入 Firebase Storage 模組
import 'vue-toast-notification/dist/theme-sugar.css';
import VueToast from 'vue-toast-notification';

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
    measurementId: "G-KG736KE2VM"
};

firebase.initializeApp(firebaseConfig);

async function initializeFirebase() {
  return new Promise((resolve) => {
    const unsubscribe = firebase.auth().onAuthStateChanged(() => {
      unsubscribe();
      resolve();
    });
  });
}

async function startApp() {
  await initializeFirebase();
  app.mount('#app');
}

startApp();