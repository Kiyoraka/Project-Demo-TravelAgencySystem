// Renders shared admin sidebar + topbar into the page on load.
// Each admin HTML has two placeholder divs: <div id="adminSidebar"></div> and <div id="adminTopbar"></div>.
// The `active` param tells the sidebar which nav item to highlight.

import { currentUser, logout } from "../../shared/auth.js";

export function renderAdminShell(activeKey) {
  const user = currentUser();
  const sidebar = document.getElementById("adminSidebar");
  const topbar = document.getElementById("adminTopbar");

  const items = [
    { key: "dashboard", href: "dashboard.html",      label: "Dashboard",  icon: "📊" },
    { key: "clients",   href: "clients.html",        label: "Clients",    icon: "👥" },
    { key: "packages",  href: "packages.html",       label: "Packages",   icon: "📦" },
    { key: "gallery",   href: "gallery-manage.html", label: "Gallery",    icon: "📸" },
    { key: "settings",  href: "settings.html",       label: "Settings",   icon: "⚙" }
  ];

  sidebar.outerHTML = `
    <aside class="admin-sidebar">
      <div class="brand">HIJIR ADMIN</div>
      ${items.map(i => `
        <a href="${i.href}" class="${activeKey === i.key ? "active" : ""}">
          <span>${i.icon}</span><span>${i.label}</span>
        </a>
      `).join("")}
      <a href="#" class="logout" id="logoutLink"><span>🚪</span><span>Logout</span></a>
    </aside>
  `;

  topbar.outerHTML = `
    <header class="admin-topbar">
      <div class="title">${titleFor(activeKey)}</div>
      <div class="user">Welcome, ${user ? escapeHtml(user.name) : "Admin"}</div>
    </header>
  `;

  // Wire logout
  document.getElementById("logoutLink").addEventListener("click", e => {
    e.preventDefault();
    logout();
    location.href = "../index.html";
  });
}

function titleFor(key) {
  return ({
    dashboard: "Dashboard",
    clients: "Client Management",
    packages: "Package Management",
    quotation: "Create Quotation",
    invoice: "Create Invoice",
    receipt: "Create Receipt",
    gallery: "Gallery Management",
    settings: "Site Settings"
  })[key] || "Admin";
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
