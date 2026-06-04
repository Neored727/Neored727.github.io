// js/categories.js
// One job: all category operations (save, load, delete)

import { db } from "./firebase.js";
import { writeLog, EVENT, SEVERITY } from "./logger.js";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  orderBy,
  query,
  writeBatch,
  where
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Save a new category
export async function saveCategory(name, color, icon) {
  await addDoc(collection(db, "categories"), {
    name:  name.toLowerCase().trim(),
    color: color,
    icon:  icon,
    date:  new Date().toISOString()
  });
  await writeLog(EVENT.ENTRY_CREATED, SEVERITY.INFO, {
    type: "category",
    name: name
  });
}

// Load all categories
export async function loadCategories() {
  const q = query(
    collection(db, "categories"),
    orderBy("date", "asc")
  );
  const snapshot = await getDocs(q);
  const categories = [];
  snapshot.forEach(docSnap => {
    categories.push({ id: docSnap.id, ...docSnap.data() });
  });
  return categories;
}

// Delete a category and mark its entries as uncategorized
export async function deleteCategory(id, name) {
  const confirmed = confirm(`Delete category "${name}"? Entries will be marked as uncategorized.`);
  if (!confirmed) return false;

  // Find all entries with this category
  const entriesQuery = query(
    collection(db, "entries"),
    where("category", "==", name)
  );
  const entriesSnapshot = await getDocs(entriesQuery);

  // Use a batch to update all affected entries at once
  const batch = writeBatch(db);

  entriesSnapshot.forEach(entryDoc => {
    batch.update(entryDoc.ref, { category: "uncategorized" });
  });

  // Delete the category
  batch.delete(doc(db, "categories", id));

  // Commit all changes at once
  await batch.commit();

  await writeLog(EVENT.ENTRY_DELETED, SEVERITY.WARNING, {
    type: "category",
    name: name
  });

  return true;
}