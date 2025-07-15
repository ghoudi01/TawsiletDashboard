// config/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
console.log("process.env",process.env.REACT_APP_FIREBASE_DB_URL)
const firebaseConfig = {
  apiKey: "AIzaSyAYr_x26klMsgyG3W1eeJUIiA-JC1Ol-tU",
  authDomain: "tawsiletdriver.firebaseapp.com",
  databaseURL: process.env.REACT_APP_FIREBASE_DB_URL,
  projectId: "tawsiletdriver",
  storageBucket: "tawsiletdriver.appspot.com",
  messagingSenderId: "960462603456",
  appId: "1:960462603456:web:your-app-id", // optional
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
