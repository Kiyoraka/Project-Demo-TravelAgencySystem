// PDF builders for HIJIR Travel & Tours demo.
// Uses globally-loaded window.jspdf.jsPDF + autotable plugin (see <script> tags in form pages).
// Each builder renders A4 portrait, triggers jsPDF.save() on completion.

import { COMPANY } from "./data.js";

// ------------------------------------------------------------------
// Shared helpers
// ------------------------------------------------------------------

function getJsPDF() {
  const { jsPDF } = window.jspdf || {};
  if (!jsPDF) throw new Error("jsPDF not loaded. Ensure libs/jspdf.umd.min.js is included before this module.");
  return jsPDF;
}

function fmtRM(n) {
  return Number(n || 0).toLocaleString("en-MY", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Draws the HIJIR company header block in the top-left corner and a "LOGO" placeholder box on the top-right.
// Returns the Y position below the header where body content should start.
function drawHeader(doc) {
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFont("helvetica", "bold").setFontSize(10).setTextColor(20, 20, 20);
  doc.text(COMPANY.name, 14, 16);

  doc.setFont("helvetica", "normal").setFontSize(8.5).setTextColor(60, 60, 60);
  let y = 22;
  doc.text(COMPANY.regNo, 14, y); y += 4;
  COMPANY.address.forEach(line => { doc.text(line, 14, y); y += 4; });
  doc.text(COMPANY.phone, 14, y); y += 4;

  // Logo placeholder box on top-right
  doc.setDrawColor(15, 122, 74).setFillColor(230, 244, 236);
  doc.roundedRect(pageWidth - 44, 12, 30, 30, 3, 3, "FD");
  doc.setFontSize(8).setTextColor(15, 122, 74).setFont("helvetica", "bold");
  doc.text("HIJIR TRAVEL & TOURS", pageWidth - 29, 28, { align: "center" });
  doc.text("— SDN BHD —", pageWidth - 29, 33, { align: "center" });

  return y + 6; // bottom of header, with some spacing
}

function drawFooter(doc, text = "This is computer generated document, no signature required\nCompany copy") {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFont("helvetica", "normal").setFontSize(8).setTextColor(100, 100, 100);
  const lines = text.split("\n");
  lines.forEach((l, i) => {
    doc.text(l, pageWidth / 2, pageHeight - 14 + i * 4, { align: "center" });
  });
}

function addNewPage(doc) {
  doc.addPage();
  drawHeader(doc);
  drawFooter(doc);
}

// ------------------------------------------------------------------
// INVOICE (Ahmad Tariq style)
// ------------------------------------------------------------------
export function buildInvoice({ invoiceNo, date, client, rows, total }) {
  const jsPDF = getJsPDF();
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();

  let y = drawHeader(doc);

  // Right-aligned: NO. INVOIS + TARIKH
  doc.setFont("helvetica", "bold").setFontSize(10).setTextColor(20, 20, 20);
  doc.text(`NO. INVOIS : ${invoiceNo}`, pageWidth - 14, y, { align: "right" });
  y += 6;
  doc.text(`TARIKH : ${date}`, pageWidth - 14, y, { align: "right" });
  y += 16;

  // Centered title "INVOIS"
  doc.setFontSize(18);
  doc.text("INVOIS", pageWidth / 2, y, { align: "center" });
  y += 14;

  // KEPADA block
  doc.setFont("helvetica", "bold").setFontSize(10);
  doc.text(`KEPADA : ${client.name || ""}`, 14, y); y += 5;
  if (client.address) {
    doc.setFont("helvetica", "normal");
    const wrapped = doc.splitTextToSize(client.address, pageWidth - 28);
    wrapped.forEach(l => { doc.text(l, 14, y); y += 5; });
  }
  if (client.phone) {
    doc.setFont("helvetica", "bold");
    doc.text(`NO. TEL : ${client.phone}`, 14, y);
    y += 8;
  }

  // Line-items table
  doc.autoTable({
    startY: y,
    head: [["PACKAGE", "HARGA/PAX (RM)", "UNIT", "KUANTITI", "JUMLAH (RM)"]],
    body: rows.map(r => [r.pkg, fmtRM(r.price), String(r.unit ?? "-"), String(r.qty ?? ""), fmtRM(r.jumlah)]),
    theme: "grid",
    headStyles: { fillColor: [240, 240, 240], textColor: [20, 20, 20], fontStyle: "bold", halign: "center" },
    styles: { fontSize: 9, cellPadding: 3 },
    columnStyles: {
      0: { cellWidth: 62 },
      1: { halign: "right", cellWidth: 32 },
      2: { halign: "center", cellWidth: 20 },
      3: { halign: "center", cellWidth: 25 },
      4: { halign: "right" }
    },
    foot: [[
      { content: "JUMLAH KESELURUHAN (RM) :", colSpan: 4, styles: { halign: "right", fontStyle: "bold" } },
      { content: fmtRM(total), styles: { halign: "right", fontStyle: "bold" } }
    ]],
    footStyles: { fillColor: [250, 250, 250], textColor: [20, 20, 20] },
    margin: { left: 14, right: 14 }
  });

  drawFooter(doc);

  // Page 2+: Terma & Syarat (Ahmad Tariq style T&C)
  addNewPage(doc);
  drawTermsInvoice(doc);

  doc.save(`${invoiceNo}.pdf`);
}

function drawTermsInvoice(doc) {
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 52;
  doc.setFont("helvetica", "bold").setFontSize(12);
  doc.setDrawColor(20, 20, 20);
  doc.rect(pageWidth / 2 - 30, y, 60, 10);
  doc.text("TERMA DAN SYARAT", pageWidth / 2, y + 7, { align: "center" });
  y += 20;

  const sections = [
    ["1. Tempahan dan Pembayaran", [
      "Deposit minimum RM 600 seorang yang boleh dikembalikan diperlukan semasa tempahan dibuat.",
      "Bayaran penuh hendaklah dibuat sekurang-kurangnya 60 hari sebelum tarikh berlepas.",
      "Jika bayaran penuh tidak diterima sebelum tarikh akhir, tempahan akan dibatalkan dan deposit akan dilucutkan."
    ]],
    ["2. Dokumentasi Perjalanan", [
      "Pelanggan bertanggungjawab untuk mempunyai pasport sah sekurang-kurangnya 6 bulan, visa yang diperlukan, dan sijil vaksinasi.",
      "Syarikat boleh membantu dalam permohonan visa, tetapi kelulusan tidak dijamin.",
      "Jika visa ditolak, bayaran balik akan dibuat selepas ditolak caj pentadbiran."
    ]],
    ["3. Pembatalan (Pelancongan Individu FIT)", [
      "30 hari atau lebih: Caj pentadbiran RM50 atau 10% deposit.",
      "15-29 hari: 50% daripada deposit.",
      "8-14 hari: 20% tambang. 3-7 hari: 40% tambang. 2 hari atau kurang: 100% tambang."
    ]],
    ["4. Pembatalan oleh Syarikat", [
      "Syarikat boleh membatalkan lawatan atas sebab bencana alam, perang, mogok, rusuhan atau arahan kerajaan.",
      "Jika dibatalkan kerana kurang peserta, bayaran dikembalikan bersama pampasan RM50-RM100 mengikut tempoh."
    ]],
    ["5. Harga & Perubahan", [
      "Harga pakej boleh berubah mengikut kadar mata wang, cukai kerajaan, kos hotel, tambang penerbangan.",
      "Termasuk: tiket pergi balik, penginapan hotel kongsi bilik, makanan, lawatan, pengangkutan.",
      "Tidak termasuk: dobi, makanan tambahan, lawatan pilihan, upah porter, perbelanjaan peribadi."
    ]],
    ["6. Insurans dan Liabiliti", [
      "Insurans perjalanan adalah wajib dan mesti merangkumi perbelanjaan perubatan, pembatalan, kehilangan bagasi.",
      "Syarikat tidak bertanggungjawab ke atas kehilangan atau kerosakan yang dialami semasa perjalanan."
    ]],
    ["7. Bank Details", [
      `${COMPANY.bank.name}`,
      `Account Number : ${COMPANY.bank.accountNo}`,
      `Account Name : ${COMPANY.bank.accountName}`,
      "Deposits are non-refundable."
    ]]
  ];

  sections.forEach(([title, items]) => {
    if (y > 260) { addNewPage(doc); y = 52; }
    doc.setFont("helvetica", "bold").setFontSize(9.5).setTextColor(20, 20, 20);
    doc.text(title, 14, y);
    y += 6;
    doc.setFont("helvetica", "normal").setFontSize(8.5).setTextColor(60, 60, 60);
    items.forEach(bullet => {
      const wrapped = doc.splitTextToSize(`•  ${bullet}`, pageWidth - 30);
      wrapped.forEach(l => {
        if (y > 270) { addNewPage(doc); y = 52; }
        doc.text(l, 18, y);
        y += 4.5;
      });
      y += 1;
    });
    y += 3;
  });
}

// ------------------------------------------------------------------
// QUOTATION (Hajjah Julia style — 7-column table + yellow summary)
// ------------------------------------------------------------------
export function buildQuotation({ quoteNo, date, attentionTo, rows, totals }) {
  const jsPDF = getJsPDF();
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();

  let y = drawHeader(doc);

  // Left: QUOTATION big, right: Date + Qtn No
  doc.setFont("helvetica", "bold").setFontSize(22).setTextColor(20, 20, 20);
  doc.text("QUOTATION", 14, y + 6);
  doc.setFontSize(10);
  doc.text(`Date : ${date}`, pageWidth - 14, y, { align: "right" });
  doc.text(`Qtn No : ${quoteNo}`, pageWidth - 14, y + 6, { align: "right" });
  y += 20;

  // ATTENTION TO:
  doc.setFont("helvetica", "bold").setFontSize(10);
  doc.text(`ATTENTION TO : ${attentionTo}`, 14, y);
  y += 8;

  // Table
  doc.autoTable({
    startY: y,
    head: [["NO", "NAME", "PACKAGE", "PACKAGE (RM)", "ADDITIONAL (RM)", "DISCOUNT (RM)", "TOTAL (RM)"]],
    body: rows.map((r, i) => [
      String(i + 1),
      r.name,
      r.pkg || "",
      fmtRM(r.price),
      r.additional ? fmtRM(r.additional) : "",
      r.discount ? fmtRM(r.discount) : "",
      fmtRM(r.total)
    ]),
    theme: "grid",
    headStyles: { fillColor: [240, 240, 240], textColor: [20, 20, 20], fontStyle: "bold", halign: "center", fontSize: 8.5 },
    styles: { fontSize: 8.5, cellPadding: 3 },
    columnStyles: {
      0: { halign: "center", cellWidth: 10 },
      1: { cellWidth: 42 },
      2: { halign: "center", cellWidth: 24 },
      3: { halign: "right", cellWidth: 26 },
      4: { halign: "right", cellWidth: 26 },
      5: { halign: "right", cellWidth: 26 },
      6: { halign: "right" }
    },
    margin: { left: 14, right: 14 }
  });

  let after = doc.lastAutoTable.finalY + 4;

  // Yellow summary block (4 rows)
  doc.autoTable({
    startY: after,
    body: [
      ["TOTAL (RM)", fmtRM(totals.total)],
      ["DISCOUNT (RM)", fmtRM(totals.discount)],
      ["ADDITIONAL (RM)", totals.additional ? fmtRM(totals.additional) : ""],
      [{ content: "TOTAL AFTER DISCOUNT (RM)", styles: { textColor: [180, 60, 20], fontStyle: "bold" } },
       { content: fmtRM(totals.finalTotal), styles: { textColor: [180, 60, 20], fontStyle: "bold" } }]
    ],
    theme: "grid",
    styles: { fontSize: 9, cellPadding: 4, fillColor: [253, 230, 170], textColor: [60, 40, 10], fontStyle: "bold" },
    columnStyles: {
      0: { halign: "center" },
      1: { halign: "center" }
    },
    margin: { left: 14, right: 14 }
  });

  after = doc.lastAutoTable.finalY + 8;

  // Due date + bank details
  doc.setFont("helvetica", "bold").setFontSize(9).setTextColor(20, 20, 20);
  doc.text("*Due Date Full Payment:", 14, after); after += 5;
  doc.text("60 Days Before Departure", 14, after); after += 8;
  doc.setFont("helvetica", "normal").setFontSize(8.5).setTextColor(60, 60, 60);
  doc.text(`All cheques must be crossed and made payable to ${COMPANY.name}.`, 14, after); after += 4;
  doc.text(`The payment may also be credited into our ${COMPANY.bank.name} Account Number.`, 14, after); after += 7;
  doc.setFont("helvetica", "bold").setFontSize(9).setTextColor(20, 20, 20);
  doc.text(COMPANY.name, 14, after); after += 4;
  doc.text(`NO ACC : ${COMPANY.bank.accountNo}`, 14, after); after += 4;
  doc.text(`BANK : ${COMPANY.bank.name}`, 14, after);

  drawFooter(doc);

  // Page 2+: Jadual Keempat Terma & Syarat
  addNewPage(doc);
  drawTermsQuotation(doc);

  doc.save(`${quoteNo}.pdf`);
}

function drawTermsQuotation(doc) {
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 52;
  doc.setFont("helvetica", "bold").setFontSize(10).setTextColor(20, 20, 20);
  doc.text("JADUAL KEEMPAT (Subperenggan 6(1)(m)(ii))", pageWidth / 2, y, { align: "center" }); y += 5;
  doc.setFontSize(9);
  doc.text("AKTA INDUSTRI PELANCONGAN PERATURAN-PERATURAN INDUSTRI PELANCONGAN 1992", pageWidth / 2, y, { align: "center" }); y += 10;
  doc.text("Terma Dan Syarat Seragam Bagi Pakej Pelancongan Ke Luar Negeri", 14, y); y += 8;

  const sections = [
    ["1. Deposit Pelancongan", [
      "Deposit maksimum sebanyak 25% daripada tambang pelancongan setiap orang mesti dibayar sebagai fi penempahan.",
      "Bakinya atau bayaran penuh mesti dibuat dalam masa 60 hari sebelum tarikh berlepas bagi pakej FIT dan 45 hari bagi kumpulan.",
      "Kegagalan untuk mematuhi kehendak ini boleh mengakibatkan pembatalan penempahan dan perlucutan deposit."
    ]],
    ["2. Caj Pindaan", [
      "FIT: Caj pindaan RM50.00 seorang bagi setiap perubahan selepas pengesahan tempahan.",
      "Tiada perubahan boleh dibuat dalam masa 8 hari bekerja sebelum tarikh berlepas.",
      "Perubahan seluruh tempahan merupakan pembatalan tempahan asal."
    ]],
    ["3. Caj Pembatalan (FIT)", [
      "30 hari atau lebih sebelum berlepas: fi pentadbiran RM50 atau 10% daripada deposit (mana lebih rendah).",
      "15-29 hari: 50% daripada deposit.",
      "8-14 hari: 20% daripada tambang pelancongan.",
      "3-7 hari: 40% daripada tambang pelancongan.",
      "2 hari atau kurang: 100% daripada tambang pelancongan."
    ]],
    ["4. Caj Pembatalan (Kumpulan)", [
      "45 hari atau lebih: RM30 atau 2% tambang (mana lebih tinggi).",
      "22-44 hari: perlucutan deposit pelancongan.",
      "15-21 hari: 35% daripada deposit.",
      "8-14 hari: 50% daripada tambang.",
      "3-7 hari: 75% daripada tambang. 2 hari atau kurang: 100% tambang."
    ]],
    ["5. Pembatalan Oleh Syarikat", [
      "Atas sebab bencana alam, perang, mogok, rusuhan atau arahan Kerajaan Malaysia di luar kawalan syarikat.",
      "Jika pelancongan alternatif tidak diterima, semua wang yang telah dibayar akan dibayar balik selepas ditolak fi pentadbiran.",
      "Jika pembatalan kerana kurang peserta: 14-30 hari = refund + RM50, 1-7 hari = refund + RM75, hari berlepas = refund + RM100."
    ]],
    ["6. Dokumen Perjalanan", [
      "Anggota pelancongan mesti memiliki pasport sah sekurang-kurangnya 6 bulan dari tarikh pulang.",
      "Visa dan perakuan vaksin kesihatan yang dikehendaki adalah tanggungjawab pelancong.",
      "Jika permohonan visa ditolak, tambang pelancongan selepas ditolak fi pentadbiran akan dibayar balik."
    ]],
    ["7. Insurans, Bagasi dan Liabiliti", [
      "Semua anggota pelancongan digalakkan membeli insurans perjalanan yang mencukupi.",
      "Elaun bagasi percuma tertakluk kepada terma syarikat penerbangan dan pihak berkuasa lapangan terbang.",
      "Syarikat hendaklah bertanggungjawab bagi perkhidmatan yang disediakan seperti dalam brosur dan perjanjian."
    ]]
  ];

  sections.forEach(([title, items]) => {
    if (y > 260) { addNewPage(doc); y = 52; }
    doc.setFont("helvetica", "bold").setFontSize(9.5).setTextColor(20, 20, 20);
    doc.text(title, 14, y);
    y += 5;
    doc.setFont("helvetica", "normal").setFontSize(8.5).setTextColor(60, 60, 60);
    items.forEach(bullet => {
      const wrapped = doc.splitTextToSize(`•  ${bullet}`, pageWidth - 30);
      wrapped.forEach(l => {
        if (y > 272) { addNewPage(doc); y = 52; }
        doc.text(l, 18, y);
        y += 4.3;
      });
      y += 1;
    });
    y += 2;
  });
}

// ------------------------------------------------------------------
// RECEIPT (Wan Rosliza style — 4-column + PAID stamp)
// ------------------------------------------------------------------
export function buildReceipt({ receiptNo, date, client, rows, subtotal, deposit, balance, payment, paid }) {
  const jsPDF = getJsPDF();
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();

  let y = drawHeader(doc);

  // Centered title RESIT RASMI
  doc.setFont("helvetica", "bold").setFontSize(18).setTextColor(20, 20, 20);
  doc.text("RESIT RASMI", pageWidth / 2, y + 4, { align: "center" });
  y += 14;

  // Right: NO. RESIT + TARIKH
  doc.setFont("helvetica", "bold").setFontSize(10);
  doc.text(`NO. RESIT : ${receiptNo}`, pageWidth - 14, y, { align: "right" }); y += 6;
  doc.text(`TARIKH : ${date}`, pageWidth - 14, y, { align: "right" }); y += 12;

  // PAID stamp (drawn as red outlined ellipse with PAID text) if paid
  if (paid) {
    const cx = pageWidth - 44, cy = y + 6;
    doc.setDrawColor(200, 30, 30).setLineWidth(1.2);
    doc.ellipse(cx, cy, 16, 9, "S");
    doc.setFont("helvetica", "bold").setFontSize(14).setTextColor(200, 30, 30);
    doc.text("PAID", cx, cy + 2, { align: "center" });
    doc.setLineWidth(0.2);
  }

  // KEPADA block
  doc.setFont("helvetica", "bold").setFontSize(10).setTextColor(20, 20, 20);
  doc.text("KEPADA :", 14, y); y += 6;
  doc.text(`NAMA : ${client.name || ""}`, 14, y); y += 5;
  doc.text(`NO. TEL : ${client.phone || ""}`, 14, y); y += 10;

  // Products table
  doc.autoTable({
    startY: y,
    head: [["PRODUK", "HARGA (RM)", "KUANTITI", "JUMLAH (RM)"]],
    body: rows.map(r => [r.produk, fmtRM(r.price), String(r.qty ?? ""), fmtRM(r.jumlah)]),
    theme: "grid",
    headStyles: { fillColor: [230, 244, 236], textColor: [20, 70, 50], fontStyle: "bold", halign: "center" },
    styles: { fontSize: 9, cellPadding: 3.5 },
    columnStyles: {
      0: { cellWidth: 88 },
      1: { halign: "right", cellWidth: 32 },
      2: { halign: "center", cellWidth: 28 },
      3: { halign: "right" }
    },
    foot: [
      [{ content: "JUMLAH KESELURUHAN (RM) :", colSpan: 3, styles: { halign: "right", fontStyle: "bold" } },
       { content: fmtRM(subtotal), styles: { halign: "right", fontStyle: "bold" } }],
      [{ content: "DEPOSIT (RM) :", colSpan: 3, styles: { halign: "right" } },
       { content: fmtRM(deposit), styles: { halign: "right" } }],
      [{ content: "JUMLAH BAKI KESELURUHAN (RM) :", colSpan: 3, styles: { halign: "right", fontStyle: "bold" } },
       { content: fmtRM(balance), styles: { halign: "right", fontStyle: "bold" } }]
    ],
    footStyles: { fillColor: [250, 250, 250], textColor: [20, 20, 20] },
    margin: { left: 14, right: 14 }
  });

  let after = doc.lastAutoTable.finalY + 10;

  // Payment: strikethrough on unselected options
  doc.setFont("helvetica", "bold").setFontSize(10).setTextColor(20, 20, 20);
  const opts = ["TUNAI", "ONLINE", "CEK"];
  let x = 14;
  doc.text("PEMBAYARAN : ", x, after); x += 30;
  opts.forEach((o, i) => {
    const selected = o === payment;
    if (selected) {
      doc.setFont("helvetica", "bolditalic").setTextColor(20, 20, 20);
      doc.text(o, x, after);
    } else {
      doc.setFont("helvetica", "italic").setTextColor(120, 120, 120);
      doc.text(o, x, after);
      // Draw strikethrough line
      const width = doc.getTextWidth(o);
      doc.setDrawColor(120, 120, 120).setLineWidth(0.3);
      doc.line(x, after - 1.5, x + width, after - 1.5);
    }
    x += doc.getTextWidth(o) + 4;
    if (i < opts.length - 1) {
      doc.setFont("helvetica", "normal").setTextColor(20, 20, 20);
      doc.text("/", x, after);
      x += 4;
    }
  });

  drawFooter(doc, "This is computer generated receipt, no signature required\nCompany copy");

  doc.save(`${receiptNo}.pdf`);
}
