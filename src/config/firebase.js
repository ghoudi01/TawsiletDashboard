// config/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAYr_x26klMsgyG3W1eeJUIiA-JC1Ol-tU",
  authDomain: "tawsiletdriver.firebaseapp.com",
  databaseURL: "https://tawsiletdriver-default-rtdb.firebaseio.com",
  projectId: "tawsiletdriver",
  storageBucket: "tawsiletdriver.appspot.com",
  messagingSenderId: "960462603456",
  appId: "1:960462603456:web:your-app-id", // optional
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
