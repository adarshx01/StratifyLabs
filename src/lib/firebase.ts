// firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDKVQ-3S48-PNhPQVWdEoOaCBI4qbPdddA",
  authDomain: "inkrit-3ebcf.firebaseapp.com",
  databaseURL: "https://inkrit-3ebcf-default-rtdb.firebaseio.com",
  projectId: "inkrit-3ebcf",
  storageBucket: "inkrit-3ebcf.appspot.com",
  messagingSenderId: "440105175644",
  appId: "1:440105175644:web:d2c8a63530207a38e67499",
  measurementId: "G-5S36EFQKVM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase instances
const db = getDatabase(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { db, auth, storage };
