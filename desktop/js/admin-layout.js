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
      ${items.slice(0, 3).map(i => `
        <a href="${i.href}" class="${activeKey === i.key ? "active" : ""}">
          <span>${i.icon}</span><span>${i.label}</span>
        </a>
      `).join("")}
      <details ${["quotation","invoice","receipt"].includes(activeKey) ? "open" : ""}>
        <summary><span>➕</span><span>Create</span></summary>
        <a href="#" data-create="quotation" class="${activeKey==="quotation"?"active":""}">Quotation</a>
        <a href="#" data-create="invoice" class="${activeKey==="invoice"?"active":""}">Invoice</a>
        <a href="#" data-create="receipt" class="${activeKey==="receipt"?"active":""}">Receipt</a>
      </details>
      ${items.slice(3).map(i => `
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

  // Wire Create dropdown — show client-picker modal then route
  document.querySelectorAll("[data-create]").forEach(el => {
    el.addEventListener("click", e => {
      e.preventDefault();
      openClientPicker(el.dataset.create);
    });
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

// Client-picker modal used by Create dropdown. Creates the modal on demand.
async function openClientPicker(docType) {
  const { CLIENTS } = await import("../../shared/data.js");
  let backdrop = document.getElementById("clientPickerModal");
  if (!backdrop) {
    backdrop = document.createElement("div");
    backdrop.id = "clientPickerModal";
    backdrop.className = "modal-backdrop";
    backdrop.innerHTML = `
      <div class="modal">
        <button class="close-x" data-close>✕</button>
        <h3 id="cpTitle"></h3>
        <div class="form-group">
          <label>Select client</label>
          <select id="cpSelect"></select>
        </div>
        <div class="modal-actions">
          <a href="clients.html" class="btn btn-ghost">+ Add new client</a>
          <button class="btn btn-ghost" data-close>Cancel</button>
          <button class="btn" id="cpContinue">Continue</button>
        </div>
      </div>`;
    document.body.appendChild(backdrop);
    backdrop.addEventListener("click", e => {
      if (e.target === backdrop || e.target.matches("[data-close]")) backdrop.classList.remove("open");
    });
  }
  const { CLIENTS: list } = await import("../../shared/data.js");
  const sel = backdrop.querySelector("#cpSelect");
  sel.innerHTML = list.map(c => `<option value="${c.id}">${escapeHtml(c.name)}</option>`).join("");
  backdrop.querySelector("#cpTitle").textContent = "Create " + docType.charAt(0).toUpperCase() + docType.slice(1);
  const continueBtn = backdrop.querySelector("#cpContinue");
  continueBtn.onclick = () => {
    const id = sel.value;
    location.href = `${docType}.html?clientId=${id}`;
  };
  backdrop.classList.add("open");
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
