// js/logger.js
// One job: write audit log entries to Firestore

import { db } from "./firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Severity levels — like log levels in Python's logging module
export const SEVERITY = {
  INFO:     "INFO",
  WARNING:  "WARNING",
  CRITICAL: "CRITICAL"
};

// Event types
export const EVENT = {
  LOGIN_SUCCESS:  "LOGIN_SUCCESS",
  LOGIN_DENIED:   "LOGIN_DENIED",
  LOGOUT:         "LOGOUT",
  ENTRY_CREATED:  "ENTRY_CREATED",
  ENTRY_DELETED:  "ENTRY_DELETED"
};

// Core logging function
export async function writeLog(event, severity, details = {}) {
  await addDoc(collection(db, "audit_logs"), {
    event:     event,
    severity:  severity,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    details:   details
  });
}