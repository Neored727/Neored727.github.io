// js/ui.js
// One job: connect data to the screen

import { initAuth, login, logout } from "./auth.js";
import { saveEntry, loadEntries, deleteEntry } from "./entries.js";
import { saveCategory, loadCategories, deleteCategory } from "./categories.js";
import { writeLog, EVENT, SEVERITY } from "./logger.js";

// ── Element references ──────────────────────────────────────────
const loginScreen      = document.getElementById("login-screen");
const blogScreen       = document.getElementById("blog-screen");
const userEmailEl      = document.getElementById("user-email");
const entriesContainer = document.getElementById("entries-container");
const titleInput       = document.getElementById("title");
const categoryInput    = document.getElementById("category");
const bodyInput        = document.getElementById("body");
const statusEl         = document.getElementById("status");
const catNameInput     = document.getElementById("cat-name");
const catColorInput    = document.getElementById("cat-color");
const catIconInput     = document.getElementById("cat-icon");
const catStatusEl      = document.getElementById("cat-status");
const categoryList     = document.getElementById("category-list");

// ── Auth state handler ──────────────────────────────────────────
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
    await renderCategories();
    await renderEntries();
  },
  () => {
    loginScreen.style.display = "flex";
    blogScreen.style.display = "none";
  }
);

// ── Render categories ───────────────────────────────────────────
async function renderCategories() {
  const categories = await loadCategories();

  // Update category dropdown in entry form
  categoryInput.innerHTML = '<option value="uncategorized">uncategorized</option>';
  categories.forEach(cat => {
    categoryInput.innerHTML += `
      <option value="${cat.name}">${cat.icon} ${cat.name}</option>`;
  });

  // Update category list in manager
  categoryList.innerHTML = "";
  if (categories.length === 0) {
    categoryList.innerHTML = '<div class="no-cats">> no categories yet</div>';
    return;
  }
  categories.forEach(cat => {
    categoryList.innerHTML += `
      <div class="cat-item" style="border-left-color: ${cat.color}">
        <span class="cat-icon">${cat.icon}</span>
        <span class="cat-name">${cat.name}</span>
        <button onclick="handleDeleteCategory('${cat.id}', '${cat.name}')">[ delete ]</button>
      </div>`;
  });
}

// ── Render entries ──────────────────────────────────────────────
async function renderEntries() {
  const categories = await loadCategories();
  const catMap = {};
  categories.forEach(cat => {
    catMap[cat.name] = { color: cat.color, icon: cat.icon };
  });

  const entries = await loadEntries();
  entriesContainer.innerHTML = "";

  if (entries.length === 0) {
    entriesContainer.innerHTML = '<div class="no-entries">> no entries yet</div>';
    return;
  }

  entries.forEach(entry => {
    const cat = catMap[entry.category];
    const color = cat ? cat.color : "#444";
    const icon = cat ? cat.icon : "📁";

    entriesContainer.innerHTML += `
      <div class="entry" style="border-left-color: ${color}">
        <h2>${icon} ${entry.title}</h2>
        <p>${entry.body}</p>
        <div class="entry-meta">
          <div>
            <span class="tag">${entry.category}</span>
            <span>${new Date(entry.date).toLocaleDateString()}</span>
          </div>
          <button onclick="handleDelete('${entry.id}', '${entry.title}', '${entry.category}')">[ delete ]</button>
        </div>
      </div>`;
  });
}

// ── Save category handler ───────────────────────────────────────
window.handleSaveCategory = async function() {
  const name  = catNameInput.value.trim();
  const color = catColorInput.value;
  const icon  = catIconInput.value.trim();

  if (!name) {
    catStatusEl.textContent = "please enter a category name!";
    return;
  }
  if (!icon) {
    catStatusEl.textContent = "please enter an emoji icon!";
    return;
  }

  catStatusEl.textContent = "saving...";
  await saveCategory(name, color, icon);

  catNameInput.value  = "";
  catIconInput.value  = "";
  catStatusEl.textContent = "category added!";

  await renderCategories();
  await renderEntries();
}

// ── Delete category handler ─────────────────────────────────────
window.handleDeleteCategory = async function(id, name) {
  const deleted = await deleteCategory(id, name);
  if (deleted) {
    await renderCategories();
    await renderEntries();
  }
}

// ── Save entry handler ──────────────────────────────────────────
window.handleSave = async function() {
  const title    = titleInput.value.trim();
  const body     = bodyInput.value.trim();
  const category = categoryInput.value;

  if (!title || !body) {
    statusEl.textContent = "please fill in all fields!";
    return;
  }

  statusEl.textContent = "saving...";
  await saveEntry(title, body, category);

  titleInput.value = "";
  bodyInput.value  = "";
  statusEl.textContent = "saved!";

  await renderEntries();
}

// ── Delete entry handler ────────────────────────────────────────
window.handleDelete = async function(id, title, category) {
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