//js / Firebase.js
// Objective - Connect to Firebase and share db + auth

// Imports from Firebase
//initializeApp → starts your Firebase connection
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
//getFirestore → gives you access to the database
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
// getAuth → gives you access to the login system
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// ok, I know this project, here's your data
// const means this variable cannot be reassigned
const firebaseConfig = {
  apiKey: "AIzaSyBuqRC47OFwMKImaHMlpVQuKYb8blrN_Xk",
  authDomain: "neos-arc.firebaseapp.com",
  projectId: "neos-arc",
  storageBucket: "neos-arc.firebasestorage.app",
  messagingSenderId: "258857364729",
  appId: "1:258857364729:web:4e5f13f9dd8468a471c628"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);

// Export db and auth so other files can use them
// getFirestore(app) → connects to your Firestore database specifically
export const db = getFirestore(app);
// getAuth(app) → connects to your authentication system
export const auth = getAuth(app);