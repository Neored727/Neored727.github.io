// js/entries.js
// One job: all database operations (save, load, delete)

import { db } from "./firebase.js";
import { writeLog, EVENT, SEVERITY } from "./logger.js";
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  orderBy, 
  query 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Save a new entry to Firestore
export async function saveEntry(title, body, category) {
  await addDoc(collection(db, "entries"), {
    title:    title,
    body:     body,
    category: category,
    date:     new Date().toISOString()
  });
  await writeLog(EVENT.ENTRY_CREATED, SEVERITY.INFO, {
    title:    title,
    category: category
  });
}

// Load all entries ordered by date (newest first)
export async function loadEntries() {
  const q = query(
    collection(db, "entries"), 
    orderBy("date", "desc")
  );
  const snapshot = await getDocs(q);
  
  const entries = [];
  snapshot.forEach(docSnap => {
    entries.push({
      id: docSnap.id,
      ...docSnap.data()
    });
  });
  
  return entries;
}

// Delete an entry by its ID
export async function deleteEntry(id, title, category) {
  const confirmed = confirm("Are you sure you want to delete this entry?");
  if (!confirmed) return false;
  
  await deleteDoc(doc(db, "entries", id));
  await writeLog(EVENT.ENTRY_DELETED, SEVERITY.WARNING, {
    id:       id,
    title:    title,
    category: category
  });
  return true;
}