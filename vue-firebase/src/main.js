import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/index'
import { initializeApp } from 'firebase/app';
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

const firebaseApp = initializeApp(firebaseConfig);

// 使用異步等待確保 Firebase SDK 完全初始化
async function initializeFirebase() {
  return new Promise((resolve) => {
    const unsubscribe = firebaseApp.auth().onAuthStateChanged(() => {
      unsubscribe(); // 停止監聽
      resolve();
    });
  });
}

// 在這裡使用異步等待確保 Firebase SDK 完全初始化後再執行其他操作
async function startApp() {
  await initializeFirebase();
  app.mount('#app');
}

startApp();