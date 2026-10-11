
/* =========================================
   GEOWORLD — AVATAR & FRAME SYSTEM
   Firebase profile: users/{uid}
========================================= */

import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

import {
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

const AVATARS = [
  { id: "explorer", icon: "🌍", name: "Explorer", level: 1 },
  { id: "astronaut", icon: "👨‍🚀", name: "Astronaut", level: 1 },
  { id: "scientist", icon: "🧑‍🔬", name: "Scientist", level: 3 },
  { id: "mountain", icon: "🏔️", name: "Summit", level: 5 },
  { id: "ocean", icon: "🐬", name: "Ocean", level: 8 },
  { id: "dragon", icon: "🐉", name: "Dragon", level: 12 },
  { id: "phoenix", icon: "🔥", name: "Phoenix", level: 18 },
  { id: "cosmos", icon: "🌌", name: "Cosmos", level: 25 }
];

const FRAMES = [
  { id: "default", name: "Starter", level: 1 },
  { id: "cyan", name: "Neon Cyan", level: 1 },
  { id: "gold", name: "Gold Elite", level: 5 },
  { id: "purple", name: "Void Purple", level: 10 },
  { id: "fire", name: "Inferno", level: 15 },
  { id: "legendary", name: "Legendary", level: 25 }
];

let currentUser = null;
let currentProfile = {};
let activeTab = "avatars";
let saving = false;

const $ = (selector, root = document) =>
  root.querySelector(selector);

const levelFromXP = xp =>
  Math.floor(Math.max(0, Number(xp) || 0) / 100) + 1;

function getAvatar(id) {
  return AVATARS.find(item => item.id === id) || AVATARS[0];
}

function getFrame(id) {
  return FRAMES.find(item => item.id === id) || FRAMES[0];
}

function ownedItems(profile, type) {
  const defaults = type === "avatars"
    ? ["explorer", "astronaut"]
    : ["default", "cyan"];

  const field = type === "avatars"
    ? "ownedAvatars"
    : "ownedFrames";

  return [...new Set([
    ...defaults,
    ...(Array.isArray(profile[field]) ? profile[field] : [])
  ])];
}

function ensureModal() {
  if ($("#geoworldAvatarOverlay")) return;

  const overlay = document.createElement("div");
  overlay.id = "geoworldAvatarOverlay";
  overlay.className = "avatar-overlay";
  overlay.hidden = true;

  overlay.innerHTML = `
    <section
      class="avatar-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="avatarModalTitle"
    >
      <header class="avatar-modal-header">
        <h2 id="avatarModalTitle">AVATAR LAB</h2>
        <button class="avatar-close" id="avatarCloseBtn" type="button">
          CLOSE ✕
        </button>
      </header>

      <div class="avatar-preview">
        <div id="avatarPreviewCircle" class="avatar-preview-circle frame-cyan">
          🌍
        </div>
        <strong id="avatarPreviewName">Explorer</strong>
        <span id="avatarPreviewFrame">Neon Cyan Frame</span>
      </div>

      <div class="avatar-section">
        <h3>Choose your avatar</h3>
        <div class="avatar-grid" id="avatarChoices"></div>
      </div>

      <div class="avatar-section">
        <h3>Choose your frame</h3>
        <div class="avatar-grid" id="frameChoices"></div>
      </div>

      <p class="avatar-message" id="avatarMessage" aria-live="polite"></p>
    </section>
  `;

  document.body.appendChild(overlay);

  $("#avatarCloseBtn").addEventListener("click", closeModal);

  overlay.addEventListener("click", event => {
    if (event.target === overlay) closeModal();
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !overlay.hidden) closeModal();
  });
}

function ensureLauncher() {
  const profileAvatar = $("#profileAvatar");
  if (!profileAvatar) return;

  if ($("#openAvatarLabBtn")) return;

  const button = document.createElement("button");
  button.id = "openAvatarLabBtn";
  button.className = "avatar-launcher";
  button.type = "button";
  button.textContent = "✦ AVATAR & FRAMES";

  button.addEventListener("click", openModal);

  profileAvatar.insertAdjacentElement("afterend", button);
}

function openModal() {
  if (!currentUser) return;

  ensureModal();
  renderCosmetics();

  $("#geoworldAvatarOverlay").hidden = false;
  document.body.style.overflow = "hidden";
}

function closeModal() {
  const overlay = $("#geoworldAvatarOverlay");
  if (overlay) overlay.hidden = true;

  document.body.style.overflow = "";
}

function renderCosmetics() {
  const level = levelFromXP(currentProfile.xp);
  const avatarContainer = $("#avatarChoices");
  const frameContainer = $("#frameChoices");

  avatarContainer.innerHTML = "";
  frameContainer.innerHTML = "";

  const ownedAvatars = ownedItems(currentProfile, "avatars");
  const ownedFrames = ownedItems(currentProfile, "frames");

  AVATARS.forEach(item => {
    const owned = ownedAvatars.includes(item.id);
    const unlocked = level >= item.level || owned;
    const selected = currentProfile.equippedAvatar === item.id;

    const button = document.createElement("button");
    button.type = "button";
    button.className =
      `avatar-choice ${selected ? "selected" : ""} ${unlocked ? "" : "locked"}`;

    button.innerHTML = `
      <span class="cosmetic-icon">${item.icon}</span>
      <span class="cosmetic-name">${item.name}</span>
      <span class="cosmetic-status">
        ${owned ? (selected ? "EQUIPPED" : "OWNED") : `LEVEL ${item.level}`}
      </span>
    `;

    button.addEventListener("click", () => {
      if (!unlocked) {
        showMessage(`Reach level ${item.level} to unlock ${item.name}.`);
        return;
      }

      equipCosmetic("equippedAvatar", item.id);
    });

    avatarContainer.appendChild(button);
  });

  FRAMES.forEach(item => {
    const owned = ownedFrames.includes(item.id);
    const unlocked = level >= item.level || owned;
    const selected = currentProfile.equippedFrame === item.id;

    const button = document.createElement("button");
    button.type = "button";
    button.className =
      `avatar-choice ${selected ? "selected" : ""} ${unlocked ? "" : "locked"}`;

    button.innerHTML = `
      <span class="cosmetic-icon">◉</span>
      <span class="cosmetic-name">${item.name}</span>
      <span class="cosmetic-status">
        ${owned ? (selected ? "EQUIPPED" : "OWNED") : `LEVEL ${item.level}`}
      </span>
    `;

    button.addEventListener("click", () => {
      if (!unlocked) {
        showMessage(`Reach level ${item.level} to unlock this frame.`);
        return;
      }

      equipCosmetic("equippedFrame", item.id);
    });

    frameContainer.appendChild(button);
  });

  updatePreview();
}

function updatePreview() {
  const avatar = getAvatar(currentProfile.equippedAvatar);
  const frame = getFrame(currentProfile.equippedFrame);

  const preview = $("#avatarPreviewCircle");
  preview.textContent = avatar.icon;
  preview.className = `avatar-preview-circle frame-${frame.id}`;

  $("#avatarPreviewName").textContent = avatar.name;
  $("#avatarPreviewFrame").textContent = `${frame.name} Frame`;

  const profileAvatar = $("#profileAvatar");

  if (profileAvatar) {
    // Keep existing profile markup; replace only its displayed content.
    profileAvatar.textContent = avatar.icon;
    profileAvatar.classList.add("geoworld-equipped-avatar");
    profileAvatar.dataset.avatar = avatar.id;
    profileAvatar.dataset.frame = frame.id;

    FRAMES.forEach(item => {
      profileAvatar.classList.remove(`frame-${item.id}`);
    });

    profileAvatar.classList.add(`frame-${frame.id}`);
  }
}

async function equipCosmetic(field, itemId) {
  if (!currentUser || saving) return;

  const isAvatar = field === "equippedAvatar";
  const item = isAvatar
    ? getAvatar(itemId)
    : getFrame(itemId);

  const type = isAvatar ? "avatars" : "frames";
  const owned = ownedItems(currentProfile, type);
  const level = levelFromXP(currentProfile.xp);

  if (level < item.level && !owned.includes(itemId)) {
    showMessage(`Unlock requirement: level ${item.level}.`);
    return;
  }

  saving = true;
  showMessage("Saving your equipment...");

  try {
    const fieldOwned = isAvatar ? "ownedAvatars" : "ownedFrames";

    const updated = {
      ...currentProfile,
      [field]: itemId,
      [fieldOwned]: owned,
      updatedAt: new Date().toISOString()
    };

    await setDoc(
      doc(db, "users", currentUser.uid),
      updated,
      { merge: true }
    );

    // Keep the existing leaderboard record in sync if it exists.
    const leaderboardRef = doc(db, "leaderboard", currentUser.uid);
    const leaderboardSnap = await getDoc(leaderboardRef);

    if (leaderboardSnap.exists()) {
      await setDoc(leaderboardRef, {
        avatar: updated.equippedAvatar || "explorer",
        frame: updated.equippedFrame || "default"
      }, { merge: true });
    }

    currentProfile = updated;

    updatePreview();
    renderCosmetics();
    showMessage("Equipment saved successfully.");
  } catch (error) {
    console.error("Avatar save failed:", error);
    showMessage("Could not save. Check your Firebase rules and connection.", true);
  } finally {
    saving = false;
  }
}

function showMessage(message, isError = false) {
  const element = $("#avatarMessage");
  if (!element) return;

  element.textContent = message;
  element.classList.toggle("error", isError);
}

async function initializeAvatarSystem(user) {
  currentUser = user;

  if (!user) {
    const button = $("#openAvatarLabBtn");
    if (button) button.remove();
    closeModal();
    currentProfile = {};
    return;
  }

  try {
    const profileRef = doc(db, "users", user.uid);
    const profileSnap = await getDoc(profileRef);

    currentProfile = profileSnap.exists() ? profileSnap.data() : {};

    const initialAvatar = currentProfile.equippedAvatar || "explorer";
    const initialFrame = currentProfile.equippedFrame || "default";

    const patch = {
      equippedAvatar: initialAvatar,
      equippedFrame: initialFrame,
      ownedAvatars: ownedItems(currentProfile, "avatars"),
      ownedFrames: ownedItems(currentProfile, "frames")
    };

    await setDoc(profileRef, patch, { merge: true });

    currentProfile = { ...currentProfile, ...patch };

    ensureModal();
    ensureLauncher();
    updatePreview();
  } catch (error) {
    console.error("Avatar system initialization failed:", error);
  }
}

// The lobby profile may render after authentication, so check briefly
// whenever the user enters the lobby or the profile avatar is inserted.
onAuthStateChanged(auth, user => {
  initializeAvatarSystem(user);
});

const profileObserver = new MutationObserver(() => {
  if (currentUser && $("#profileAvatar")) {
    ensureLauncher();
    updatePreview();
  }
});

profileObserver.observe(document.body, {
  childList: true,
  subtree: true
});
