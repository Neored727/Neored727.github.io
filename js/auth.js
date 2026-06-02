// js/auth.js
// One job: handle login, logout and protect the page

import { auth } from "./firebase.js";
import { writeLog, EVENT, SEVERITY  } from "./logger.js";
// GoogleAuthProvider → tells Firebase "we want to use Google as the login method"
// signInWithPopup → opens the Google login popup window
// signOut → logs the user out
// onAuthStateChanged → a listener that watches for login/logout changes automatically
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Watch for login state changes
export function initAuth(onLogin, onLogout) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      onLogin(user);
    } else {
      onLogout();
    }
  });
}

// Login with Google popup
export async function login() {
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider);
}

// Logout
export async function logout(email = "unknown") {
  await writeLog (EVENT.LOGOUT, SEVERITY.INFO, {email: email});
  await signOut(auth);
}