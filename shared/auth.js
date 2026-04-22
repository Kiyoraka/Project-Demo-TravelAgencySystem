// Hardcoded admin authentication using sessionStorage.
// Logout on tab close is automatic because sessionStorage (not localStorage).

import { USERS } from "./data.js";

const STORAGE_KEY = "hijir_auth";

export function login(email, password) {
  const user = USERS.find(u => u.email === email && u.password === password);
  if (!user) {
    return { ok: false, error: "Invalid email or password" };
  }
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ email: user.email, name: user.name }));
  return { ok: true, user };
}

export function logout() {
  sessionStorage.removeItem(STORAGE_KEY);
}

export function isLoggedIn() {
  return !!sessionStorage.getItem(STORAGE_KEY);
}

export function currentUser() {
  const raw = sessionStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
}
