// Auto-switch between desktop/ and mobile/ when viewport crosses the 768px breakpoint.
// Fires on page load (catches direct deep-links) and on resize (catches DevTools F12 device toggle).
// Plain JS, no module imports, so it can be loaded via a classic <script> tag from any page depth.

(function () {
  var BREAKPOINT = 767; // max-width for mobile
  var MOBILE_DIR = "/mobile/";
  var DESKTOP_DIR = "/desktop/";

  function currentIsMobile() {
    return window.matchMedia("(max-width: " + BREAKPOINT + "px)").matches;
  }

  function redirectIfMismatch() {
    var path = location.pathname;
    var inMobile = path.indexOf(MOBILE_DIR) !== -1;
    var inDesktop = path.indexOf(DESKTOP_DIR) !== -1;
    if (!inMobile && !inDesktop) return; // root redirect page — let its own script handle

    var isMobileViewport = currentIsMobile();
    if (inDesktop && isMobileViewport) {
      location.replace(path.replace(DESKTOP_DIR, MOBILE_DIR) + location.search + location.hash);
    } else if (inMobile && !isMobileViewport) {
      location.replace(path.replace(MOBILE_DIR, DESKTOP_DIR) + location.search + location.hash);
    }
  }

  // Initial check (covers deep-links that land on the wrong variant directly)
  redirectIfMismatch();

  // Debounced resize watcher (covers DevTools F12 device emulation toggle and browser window resize)
  var debounce;
  window.addEventListener("resize", function () {
    clearTimeout(debounce);
    debounce = setTimeout(redirectIfMismatch, 250);
  });
})();
