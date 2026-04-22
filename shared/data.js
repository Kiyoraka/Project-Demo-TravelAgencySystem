// Hardcoded demo data for HIJIR Travel & Tours demo system.
// All data lives in-memory. Mutations (add client, edit package, etc.) reset on page reload.

export const COMPANY = {
  name: "HIJIR TRAVEL & TOURS SDN. BHD.",
  regNo: "202401044176 (1590022-X)",
  address: [
    "8113 T-B, JALAN PASIR PUTEH,",
    "BANDAR SATELIT PASIR TUMBOH,",
    "15200 KOTA BHARU,",
    "KELANTAN."
  ],
  phone: "+60176108433",
  email: "hijir@example.com",
  bank: {
    name: "BANK ISLAM BERHAD",
    accountNo: "03120010028203",
    accountName: "HIJIR TRAVEL & TOURS SDN. BHD."
  },
  landing: {
    heroTitle: "Your Journey to Baitullah Starts Here",
    heroSubtitle: "Umrah, Haji & Ziarah Packages — Trusted Since 2024"
  }
};

export const USERS = [
  { email: "admin@gmail.com", password: "admin123", name: "Admin" }
];

export let CLIENTS = [
  {
    id: 1,
    name: "Ahmad Tariq Bin Abdul Mutalib",
    phone: "+60 12-493 5689",
    address: "No 57 Jalan Ecomajestic 8/1B, Merrydale Eco Majestic 43500, Semenyih Selangor"
  },
  {
    id: 2,
    name: "Hajjah Julia Binti Halim",
    phone: "+60 13-222 3344",
    address: "Lot 23 Jalan Dato Bandar, 71800 Nilai, Negeri Sembilan"
  },
  {
    id: 3,
    name: "Wan Rosliza Binti Wan Hussein",
    phone: "0178815082",
    address: "Kampung Pasir Tumboh, 15200 Kota Bharu, Kelantan"
  },
  {
    id: 4,
    name: "Muhammad Faiq Bin Khairul Sham",
    phone: "+60 11-2345 6789",
    address: "No 12 Taman Desa Putra, 43000 Kajang, Selangor"
  },
  {
    id: 5,
    name: "Izzah Insyirah Binti Khairul Sham",
    phone: "+60 14-567 8901",
    address: "No 12 Taman Desa Putra, 43000 Kajang, Selangor"
  },
  {
    id: 6,
    name: "Khairul Sham Bin Mohd Khalid",
    phone: "+60 19-888 1234",
    address: "No 12 Taman Desa Putra, 43000 Kajang, Selangor"
  }
];

// PACKAGES: used by landing page showcase, public Packages page, and line-item dropdowns in quotation/invoice/receipt forms.
// Only packages with category "Umrah" and an image path are rendered on the landing page.
export let PACKAGES = [
  { id: 1, code: "SAFWAH_BB",       name: "Safwah (BB)",              price:   990.00, category: "Umrah",  image: "assets/packages/safwah.jpg",  description: "Economy Umrah package, Bilik Berdua sharing" },
  { id: 2, code: "TAIBA_FRONT_BB",  name: "Taiba Front (BB)",         price:   850.00, category: "Umrah",  image: "assets/packages/taiba.jpg",   description: "Taiba Front hotel, Bilik Berdua sharing" },
  { id: 3, code: "AJYAD_COMBO",     name: "Ajyad Combo",              price: 12799.00, category: "Umrah",  image: "assets/packages/ajyad.jpg",   description: "Premium Ajyad combo — flight, hotel, meals" },
  { id: 4, code: "PREMIUM_QD",      name: "Premium QD",               price: 11088.00, category: "Umrah",  image: "assets/packages/premium.jpg", description: "Quadruple-share premium package" },
  { id: 5, code: "TRANSPORTATION",  name: "Transportation (4 trip)",  price:  1200.00, category: "Add-on", image: "", description: "Airport transfers & local transport, 4 trips" },
  { id: 6, code: "VISA",            name: "Visa",                     price:   550.00, category: "Add-on", image: "", description: "Saudi visa processing fee" },
  { id: 7, code: "GROUND_HANDLING", name: "Ground Handling",          price:  1120.00, category: "Add-on", image: "", description: "Ground handling services on arrival" },
  { id: 8, code: "BILIK_BERDUA",    name: "Tambahan Bilik Berdua",    price:  1200.00, category: "Add-on", image: "", description: "Upgrade to double-bed room" },
  { id: 9, code: "SET_BAGASI",      name: "Set Bagasi",               price:   180.00, category: "Add-on", image: "", description: "Branded luggage set" }
];

export const GALLERY = [
  { src: "assets/gallery/01.jpg", caption: "Umrah Batch February 2025" },
  { src: "assets/gallery/02.jpg", caption: "Masjid Nabawi evening" },
  { src: "assets/gallery/03.jpg", caption: "Group departure at KLIA" },
  { src: "assets/gallery/04.jpg", caption: "Madinah hotel lobby briefing" },
  { src: "assets/gallery/05.jpg", caption: "Rawdah visit" },
  { src: "assets/gallery/06.jpg", caption: "Mecca Masjidil Haram" },
  { src: "assets/gallery/07.jpg", caption: "Ziarah to Uhud" },
  { src: "assets/gallery/08.jpg", caption: "Group photo at Jabal Nur" },
  { src: "assets/gallery/09.jpg", caption: "Dinner in Madinah" },
  { src: "assets/gallery/10.jpg", caption: "Tawaf sunset" },
  { src: "assets/gallery/11.jpg", caption: "Sa'i walkway" },
  { src: "assets/gallery/12.jpg", caption: "Return home celebration" }
];

export const DASHBOARD_STATS = {
  totalClients: 42,
  totalQuotations: 18,
  totalInvoices: 27,
  totalReceipts: 23,
  revenueThisMonth: "RM 128,400"
};

export const RECENT_ACTIVITY = [
  { type: "Invoice",  docNo: "HJR101025",   clientName: "Ahmad Tariq Bin Abdul Mutalib",  date: "10 Oct 2025" },
  { type: "Receipt",  docNo: "HIJIR080126", clientName: "Wan Rosliza Binti Wan Hussein",  date: "08 Jan 2026" },
  { type: "Quote",    docNo: "LCS2956",     clientName: "Hajjah Julia Binti Halim",       date: "15 Mar 2024" },
  { type: "Invoice",  docNo: "HJR220426",   clientName: "Muhammad Faiq Bin Khairul Sham", date: "22 Apr 2026" },
  { type: "Quote",    docNo: "LCS2980",     clientName: "Khairul Sham Bin Mohd Khalid",   date: "18 Apr 2026" }
];

// Small helpers for in-memory CRUD used across admin pages.
export function nextClientId() {
  return CLIENTS.length ? Math.max(...CLIENTS.map(c => c.id)) + 1 : 1;
}
export function nextPackageId() {
  return PACKAGES.length ? Math.max(...PACKAGES.map(p => p.id)) + 1 : 1;
}
export function findClient(id) {
  return CLIENTS.find(c => c.id === Number(id)) || null;
}
export function findPackage(id) {
  return PACKAGES.find(p => p.id === Number(id)) || null;
}
