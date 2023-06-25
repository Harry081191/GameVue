import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";



export default {
    apiKey: "AIzaSyD1wfBa3TTGdR4xqXg9kU3HaKpkkyQQpE8",
    authDomain: "game-ab172.firebaseapp.com",
    databaseURL: "https://game-ab172-default-rtdb.firebaseio.com",
    projectId: "game-ab172",
    storageBucket: "game-ab172.appspot.com",
    messagingSenderId: "745485943638",
    appId: "1:745485943638:web:74890acde2bf5368710cf7",
    measurementId: "G-KG736KE2VM"
};

const database = getDatabase();

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getDatabase(app)

export { db }