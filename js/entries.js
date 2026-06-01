// js/entries.js
// One job: all database operations (save, load, delete)

import { db } from "./firebase.js";
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
    title: title,
    body: body,
    category: category,
    date: new Date().toISOString()
  });
}

// Load all entries ordered by date (newest first)
export async function loadEntries() {
  const q = query(
    collection(db, "entries"), 
    orderBy("date", "desc")
  );
  const snapshot = await getDocs(q);
  
  // Convert snapshot to a plain array of objects
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
export async function deleteEntry(id) {
  const confirmed = confirm("Are you sure you want to delete this entry?");
  if (!confirmed) return false;
  
  await deleteDoc(doc(db, "entries", id));
  return true;
}2