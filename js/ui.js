// js/ui.js
// One job: connect data to the screen

import { initAuth, login, logout } from "./auth.js";
import { writeLog, EVENT, SEVERITY } from "./logger.js";
import { saveEntry, loadEntries, deleteEntry } from "./entries.js";

// ── Element references ──────────────────────────────────────────
// Think of these like variables pointing to HTML elements
// In Python terms: these are handles to the UI widgets

const loginScreen = document.getElementById("login-screen");
const blogScreen = document.getElementById("blog-screen");
const userEmailEl = document.getElementById("user-email");
const entriesContainer = document.getElementById("entries-container");
const titleInput = document.getElementById("title");
const categoryInput = document.getElementById("category");
const bodyInput = document.getElementById("body");
const statusEl = document.getElementById("status");

// ── Auth state handler ──────────────────────────────────────────
// initAuth watches login state and calls these callbacks

initAuth(
  async (user) => {
    if (user.email.toLowerCase() !== "neored727@gmail.com") {
      await writeLog(EVENT.LOGIN_DENIED, SEVERITY.CRITICAL, {
        email: user.email,
        reason: "Unauthorized email"
      });
      await logout(user.email);
      alert("Access denied. This is a private dictionary.");
      return;
    }
    await writeLog(EVENT.LOGIN_SUCCESS, SEVERITY.INFO, {
      email: user.email
    });
    loginScreen.style.display = "none";
    blogScreen.style.display = "block";
    userEmailEl.textContent = user.email;
    await renderEntries();
  },
  () => {
    loginScreen.style.display = "flex";
    blogScreen.style.display = "none";
  }
);

// ── Render entries on screen ────────────────────────────────────
async function renderEntries() {
  const entries = await loadEntries();
  entriesContainer.innerHTML = "";

  entries.forEach(entry => {
    entriesContainer.innerHTML += `
      <div class="entry ${entry.category}">
        <h2>${entry.title}</h2>
        <p>${entry.body}</p>
        <div class="entry-meta">
          <span class="tag">${entry.category}</span>
          <span>${new Date(entry.date).toLocaleDateString()}</span>
          <button onclick="handleDelete('${entry.id}', '${entry.title}', '${entry.category}')">delete</button>
        </div>
      </div>`;
  });
}

// ── Save handler ────────────────────────────────────────────────
window.handleSave = async function() {
  const title = titleInput.value.trim();
  const body = bodyInput.value.trim();
  const category = categoryInput.value;

  // Validation — same concept as input checking in Python
  if (!title || !body) {
    statusEl.textContent = "Please fill in all fields!";
    return;
  }

  statusEl.textContent = "Saving...";
  await saveEntry(title, body, category);

  // Clear form after saving
  titleInput.value = "";
  bodyInput.value = "";
  statusEl.textContent = "Saved!";

  await renderEntries();
}

// ── Delete handler ──────────────────────────────────────────────
window.handleDelete = async function(id) {
  const deleted = await deleteEntry(id, title, category);
  if (deleted) await renderEntries();
}

// ── Logout handler ──────────────────────────────────────────────
window.handleLogout = async function() {
  await logout(userEmailEl.textContent);
}

// ── Login handler ───────────────────────────────────────────────
window.handleLogin = async function() {
  await login();
}