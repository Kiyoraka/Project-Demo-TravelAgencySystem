// Mobile shared layout: top bar, drawer, bottom nav
import { currentUser, logout, isLoggedIn } from "../../shared/auth.js";

export function renderPublicLayout(activeKey) {
  const top = document.getElementById("topbar");
  top.outerHTML = `
    <header class="topbar">
      <a href="index.html" class="brand">
        <span class="logo-box">LOGO</span>
        HIJIR
      </a>
      <button id="menuBtn" aria-label="Menu"><i class="fa-solid fa-bars"></i></button>
    </header>
    <div class="drawer-backdrop" id="drawerBg"></div>
    <aside class="drawer" id="drawer">
      <h3>Menu</h3>
      <a href="index.html">Home</a>
      <a href="about.html">About</a>
      <a href="packages.html">Packages</a>
      <a href="gallery.html">Gallery</a>
      <a href="contact.html">Contact</a>
      <a href="#" class="btn" id="drawerLogin">Login</a>
    </aside>
  `;
  const bn = document.getElementById("bottomnav");
  const nav = [
    { k: "home",     href: "index.html",    label: "Home",     icon: "fa-house" },
    { k: "packages", href: "packages.html", label: "Packages", icon: "fa-box" },
    { k: "gallery",  href: "gallery.html",  label: "Gallery",  icon: "fa-image" },
    { k: "about",    href: "about.html",    label: "About",    icon: "fa-circle-info" }
  ];
  bn.outerHTML = `
    <nav class="bottom-nav">
      ${nav.map(n => `<a href="${n.href}" class="${activeKey === n.k ? "active" : ""}"><i class="fa-solid ${n.icon} icon"></i><span>${n.label}</span></a>`).join("")}
    </nav>
  `;

  document.getElementById("menuBtn").addEventListener("click", () => {
    document.getElementById("drawer").classList.add("open");
    document.getElementById("drawerBg").classList.add("open");
  });
  document.getElementById("drawerBg").addEventListener("click", () => {
    document.getElementById("drawer").classList.remove("open");
    document.getElementById("drawerBg").classList.remove("open");
  });
  document.getElementById("drawerLogin").addEventListener("click", e => {
    e.preventDefault();
    if (isLoggedIn()) location.href = "admin/dashboard.html";
    else document.getElementById("loginModal")?.classList.add("open");
  });
}

export function renderAdminLayout(activeKey, title) {
  const top = document.getElementById("topbar");
  const user = currentUser();
  top.outerHTML = `
    <header class="admin-topbar-m">
      <div class="title">${escapeHtml(title || "HIJIR ADMIN")}</div>
      <button id="logoutBtn" class="btn btn-sm btn-ghost">Logout</button>
    </header>
  `;
  const bn = document.getElementById("bottomnav");
  const nav = [
    { k: "dashboard", href: "dashboard.html",      label: "Home",     icon: "fa-chart-line" },
    { k: "clients",   href: "clients.html",        label: "Clients",  icon: "fa-users" },
    { k: "packages",  href: "packages.html",       label: "Packages", icon: "fa-box" },
    { k: "gallery",   href: "gallery-manage.html", label: "Gallery",  icon: "fa-image" },
    { k: "settings",  href: "settings.html",       label: "Settings", icon: "fa-gear" }
  ];
  bn.outerHTML = `
    <nav class="bottom-nav admin">
      ${nav.map(n => `<a href="${n.href}" class="${activeKey === n.k ? "active" : ""}"><i class="fa-solid ${n.icon} icon"></i><span>${n.label}</span></a>`).join("")}
    </nav>
  `;
  document.getElementById("logoutBtn").addEventListener("click", () => {
    logout();
    location.href = "../index.html";
  });
}

export function showToast(msg) {
  let t = document.getElementById("toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "toast";
    t.className = "toast";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2000);
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
