

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

// Your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDbXvv_3kW2djmXeDtaxkuH5FiMkzVEJC4",
  authDomain: "raven200807.firebaseapp.com",
  projectId: "raven200807",
  storageBucket: "raven200807.firebasestorage.app",
  messagingSenderId: "191417166797",
  appId: "1:191417166797:web:620105ee341ae38364b284"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Authentication
const auth = getAuth(app);

// Database
const db = getFirestore(app);

export { app, auth, db };
