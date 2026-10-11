
import { auth, db } from "./firebase.js";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

import {
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

function showMessage(element, message, success = false) {
  if (!element) return;

  element.textContent = message;
  element.classList.toggle("success", success);
}

function friendlyError(error) {
  const messages = {
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/invalid-credential": "Email or password is incorrect.",
    "auth/invalid-login-credentials": "Email or password is incorrect.",
    "auth/user-not-found": "No account found. Please sign up first.",
    "auth/wrong-password": "Incorrect password. Try again.",
    "auth/email-already-in-use": "This email already has an account. Please log in.",
    "auth/weak-password": "Choose a stronger password with at least 6 characters.",
    "auth/network-request-failed": "Network error. Check your internet connection.",
    "auth/too-many-requests": "Too many attempts. Please wait and try again.",
    "permission-denied": "Database access denied. Check your Firestore rules."
  };

  return messages[error.code] ||
    "Something went wrong. Please try again.";
}

// LOGIN
if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    const message = document.getElementById("loginMessage");
    const button = loginForm.querySelector('button[type="submit"]');

    if (!email || !password) {
      showMessage(message, "Enter your email and password.");
      return;
    }

    button.disabled = true;
    showMessage(message, "Verifying your account...");

    try {
      await signInWithEmailAndPassword(auth, email, password);

      showMessage(message, "Login successful. Opening GEOWORLD...", true);

      window.location.replace("index.html");
    } catch (error) {
      console.error("Login failed:", error);
      showMessage(message, friendlyError(error));
      button.disabled = false;
    }
  });
}

// SIGN UP
if (signupForm) {
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document
      .getElementById("signupUsername").value.trim();

    const email = document
      .getElementById("signupEmail").value.trim();

    const password = document
      .getElementById("signupPassword").value;

    const confirmPassword = document
      .getElementById("signupConfirmPassword").value;

    const message = document.getElementById("signupMessage");
    const button = signupForm.querySelector('button[type="submit"]');

    if (username.length < 3) {
      showMessage(message, "Explorer name must contain at least 3 characters.");
      return;
    }

    if (password.length < 6) {
      showMessage(message, "Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      showMessage(message, "Passwords do not match.");
      return;
    }

    button.disabled = true;
    showMessage(message, "Creating your explorer account...");

    let createdUser = null;

    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      createdUser = result.user;

      await updateProfile(createdUser, {
        displayName: username
      });

      await setDoc(doc(db, "users", createdUser.uid), {
        username: username,
        email: createdUser.email,
        xp: 0,
        level: 1,
        createdAt: serverTimestamp()
      });

      showMessage(message, "Account created! Entering GEOWORLD...", true);

      window.location.replace("index.html");
    } catch (error) {
      console.error("Signup failed:", error);

      if (createdUser) {
        showMessage(
          message,
          "Your authentication account was created, but saving the profile failed. Please check Firestore rules before trying again."
        );
      } else {
        showMessage(message, friendlyError(error));
      }

      button.disabled = false;
    }
  });
}

console.log("GEOWORLD authentication page initialized.");
