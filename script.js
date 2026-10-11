
/* =====================================================
   GEOWORLD ULTIMATE — DASHBOARD ENGINE
   Firebase Authentication + Firestore Profile
   ===================================================== */

import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

// -----------------------------------------------------
// ELEMENTS
// -----------------------------------------------------

const explorerName = document.getElementById("explorerName");
const explorerEmail = document.getElementById("explorerEmail");
const avatarInitial = document.getElementById("avatarInitial");
const explorerRank = document.getElementById("explorerRank");
const explorerLevel = document.getElementById("explorerLevel");
const explorerXp = document.getElementById("explorerXp");
const xpFill = document.getElementById("xpFill");
const xpProgressText = document.getElementById("xpProgressText");
const xpPercent = document.getElementById("xpPercent");
const discoveryCount = document.getElementById("discoveryCount");
const profileStatus = document.getElementById("profileStatus");
const logoutButton = document.getElementById("logoutButton");

// -----------------------------------------------------
// RANK SYSTEM
// -----------------------------------------------------

function getExplorerRank(level) {
  if (level >= 50) return "EARTH LEGEND";
  if (level >= 30) return "PLANETARY MASTER";
  if (level >= 20) return "ELITE EXPLORER";
  if (level >= 10) return "GEO SPECIALIST";
  if (level >= 5) return "FIELD EXPLORER";
  if (level >= 2) return "JUNIOR EXPLORER";

  return "ROOKIE EXPLORER";
}

// -----------------------------------------------------
// DISPLAY EXPLORER PROFILE
// -----------------------------------------------------

function displayProfile(user, data = {}) {
  const fallbackName =
    user.displayName ||
    (user.email ? user.email.split("@")[0] : "EXPLORER");

  const username = data.username || fallbackName;
  const xp = Math.max(0, Number(data.xp) || 0);

  // Use the stored level if available; otherwise estimate it.
  const level = Math.max(
    1,
    Number(data.level) || Math.floor(xp / 100) + 1
  );

  // This is a display progress bar, not an XP-writing system.
  const xpIntoLevel = xp % 100;
  const progress = xpIntoLevel;

  if (explorerName) {
    explorerName.textContent = username.toUpperCase();
  }

  if (explorerEmail) {
    explorerEmail.textContent = user.email || "Email unavailable";
  }

  if (avatarInitial) {
    avatarInitial.textContent =
      username.trim().charAt(0).toUpperCase() || "E";
  }

  if (explorerRank) {
    explorerRank.textContent = getExplorerRank(level);
  }

  if (explorerLevel) {
    explorerLevel.textContent = `LEVEL ${level}`;
  }

  if (explorerXp) {
    explorerXp.textContent = `${xp.toLocaleString()} XP`;
  }

  if (xpFill) {
    xpFill.style.width = `${progress}%`;
  }

  if (xpProgressText) {
    xpProgressText.textContent =
      `${progress} / 100 XP to next level`;
  }

  if (xpPercent) {
    xpPercent.textContent = `${progress}%`;
  }

  if (discoveryCount) {
    const discoveries = Math.max(
      0,
      Number(data.discoveries) || 0
    );

    discoveryCount.textContent = String(discoveries).padStart(2, "0");
  }

  if (profileStatus) {
    profileStatus.textContent = "Explorer profile synchronized.";
  }
}

// -----------------------------------------------------
// AUTHENTICATION GUARD + FIRESTORE PROFILE
// -----------------------------------------------------

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.replace("login.html");
    return;
  }

  if (profileStatus) {
    profileStatus.textContent = "Loading your explorer profile...";
  }

  // Show account information immediately while Firestore loads.
  displayProfile(user);

  try {
    const userRef = doc(db, "users", user.uid);
    const userSnapshot = await getDoc(userRef);

    if (userSnapshot.exists()) {
      displayProfile(user, userSnapshot.data());
    } else {
      // A signed-in account can exist without a Firestore profile.
      displayProfile(user);
      if (profileStatus) {
        profileStatus.textContent =
          "Signed in. No Firestore profile found yet; showing default stats.";
      }
    }
  } catch (error) {
    console.error("GEOWORLD profile error:", error);

    if (profileStatus) {
      profileStatus.textContent =
        "Signed in, but profile data could not be loaded. Check Firestore rules and connection.";
    }
  }
});

// -----------------------------------------------------
// LOG OUT
// -----------------------------------------------------

if (logoutButton) {
  logoutButton.addEventListener("click", async () => {
    const confirmed = window.confirm(
      "Are you sure you want to log out of GEOWORLD?"
    );

    if (!confirmed) return;

    logoutButton.disabled = true;
    logoutButton.textContent = "LOGGING OUT...";

    try {
      await signOut(auth);
      window.location.replace("login.html");
    } catch (error) {
      console.error("Logout failed:", error);
      window.alert("Logout failed. Please try again.");

      logoutButton.disabled = false;
      logoutButton.textContent = "LOG OUT ↗";
    }
  });
}

// -----------------------------------------------------
// MOBILE NAVIGATION
// -----------------------------------------------------

const menuButton = document.getElementById("menuButton");
const navLinks = document.getElementById("navLinks");

if (menuButton && navLinks) {
  menuButton.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");

    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.textContent = isOpen ? "✕" : "☰";
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.textContent = "☰";
    });
  });
}

// -----------------------------------------------------
// ACTIVE NAVIGATION LINK
// -----------------------------------------------------

const currentPage =
  window.location.pathname.split("/").pop() || "index.html";

document.querySelectorAll(".nav-links a").forEach((link) => {
  const linkPage = link.getAttribute("href");

  link.classList.toggle("active", linkPage === currentPage);
});

console.log("GEOWORLD ULTIMATE dashboard initialized.");
