// Admin route guard. Every admin/*.html page imports and calls guard() at the top.
// If not authenticated, redirect to the landing page (public root).

import { isLoggedIn } from "./auth.js";

export function guard(redirectTo = "../index.html") {
  if (!isLoggedIn()) {
    location.replace(redirectTo);
    return false;
  }
  return true;
}

// Helper: read the clientId query param (used by quotation / invoice / receipt forms for pre-fill).
export function getQueryParam(key) {
  return new URLSearchParams(location.search).get(key);
}
