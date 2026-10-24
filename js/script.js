/* =========================================================
   KEVIN ALVARO PORTFOLIO - JavaScript eksternal
   Materi: function, event listener, DOM, validasi form
   ========================================================= */

"use strict";

// Helper: pilih elemen HTML berdasarkan selector CSS.
const select = (selector) => document.querySelector(selector);

// Format angka menjadi Rupiah.
function formatRupiah(angka) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(angka);
}

// ---------------------------
// 1. Dark mode / light mode
// ---------------------------
const themeToggle = select("#themeToggle");
const themeIcon = select("#themeIcon");
const themeLabel = select("#themeLabel");

function setTheme(isLight) {
  document.body.dataset.theme = isLight ? "light" : "dark";
  themeToggle.setAttribute("aria-pressed", String(isLight));
  themeIcon.className = isLight ? "bi bi-moon-stars-fill" : "bi bi-sun-fill";
  themeLabel.textContent = isLight ? "Mode gelap" : "Mode terang";
}

themeToggle.addEventListener("click", () => {
  const currentlyLight = document.body.dataset.theme === "light";
  setTheme(!currentlyLight);
});

// ---------------------------
// 2. Filter dan pencarian proyek
// ---------------------------
const projectSearch = select("#projectSearch");
const filterButtons = document.querySelectorAll(".filter-btn");
const projectItems = document.querySelectorAll(".project-item");
const noProjects = select("#noProjects");
let activeCategory = "all";

function filterProjects() {
  const searchTerm = projectSearch.value.trim().toLowerCase();
  let visibleCount = 0;

  projectItems.forEach((item) => {
    const category = item.dataset.category;
    const searchableText = `${item.dataset.search} ${item.textContent}`.toLowerCase();
    const matchesCategory = activeCategory === "all" || category === activeCategory;
    const matchesSearch = searchableText.includes(searchTerm);
    const shouldShow = matchesCategory && matchesSearch;

    item.classList.toggle("d-none", !shouldShow);
    if (shouldShow) visibleCount += 1;
  });

  noProjects.classList.toggle("d-none", visibleCount !== 0);
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeCategory = button.dataset.filter;

    filterButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });

    filterProjects();
  });
});

projectSearch.addEventListener("input", filterProjects);

// ---------------------------
// 3. Kalkulator estimasi biaya
// ---------------------------
const calculatorForm = select("#calculatorForm");
const serviceType = select("#serviceType");
const quantityInput = select("#quantity");
const discountInput = select("#discount");
const estimateOutput = select("#estimateOutput");
const estimateBreakdown = select("#estimateBreakdown");
const calculatorFeedback = select("#calculatorFeedback");

function calculateEstimate(event) {
  event.preventDefault();

  const pricePerUnit = Number(serviceType.value);
  const quantity = Number(quantityInput.value);
  const discountPercent = Number(discountInput.value);

  if (!Number.isFinite(quantity) || quantity < 1 || quantity > 100 || !Number.isInteger(quantity)) {
    calculatorFeedback.textContent = "Jumlah unit harus berupa bilangan bulat antara 1 dan 100.";
    calculatorFeedback.className = "form-feedback mt-3 error";
    quantityInput.focus();
    return;
  }

  const subtotal = pricePerUnit * quantity;
  const discountAmount = subtotal * (discountPercent / 100);
  const total = subtotal - discountAmount;

  estimateOutput.textContent = formatRupiah(total);
  estimateBreakdown.textContent =
    `${quantity} unit × ${formatRupiah(pricePerUnit)} = ${formatRupiah(subtotal)}; diskon ${discountPercent}% (${formatRupiah(discountAmount)}).`;

  calculatorFeedback.textContent = "Estimasi berhasil dihitung.";
  calculatorFeedback.className = "form-feedback mt-3 success";
}

calculatorForm.addEventListener("submit", calculateEstimate);

// ---------------------------
// 4. Validasi formulir kontak
// ---------------------------
const contactForm = select("#contactForm");
const contactFeedback = select("#contactFeedback");
const contactName = select("#contactName");
const contactEmail = select("#contactEmail");
const contactSubject = select("#contactSubject");
const contactMessage = select("#contactMessage");

function validateField(field) {
  const value = field.value.trim();
  let valid = field.checkValidity() && value.length > 0;

  if (field === contactName) valid = valid && value.length >= 2;
  if (field === contactSubject) valid = valid && value.length >= 3;
  if (field === contactMessage) valid = valid && value.length >= 10;

  field.classList.toggle("is-invalid", !valid);
  field.classList.toggle("is-valid", valid);
  return valid;
}

[contactName, contactEmail, contactSubject, contactMessage].forEach((field) => {
  field.addEventListener("input", () => {
    if (field.classList.contains("is-invalid") || field.classList.contains("is-valid")) {
      validateField(field);
    }
  });
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const fields = [contactName, contactEmail, contactSubject, contactMessage];
  const results = fields.map(validateField);
  const allValid = results.every(Boolean);

  if (!allValid) {
    contactFeedback.textContent = "Masih ada kolom yang perlu diperbaiki. Periksa pesan validasi di setiap kolom.";
    contactFeedback.className = "form-feedback mt-3 error";
    const firstInvalid = fields.find((field) => !field.checkValidity() || !field.value.trim() ||
      (field === contactName && field.value.trim().length < 2) ||
      (field === contactSubject && field.value.trim().length < 3) ||
      (field === contactMessage && field.value.trim().length < 10));
    if (firstInvalid) firstInvalid.focus();
    return;
  }

  contactFeedback.textContent = "Validasi berhasil! Formulir ini belum mengirim email karena belum terhubung ke backend.";
  contactFeedback.className = "form-feedback mt-3 success";
});

// ---------------------------
// 5. Tahun otomatis pada footer
// ---------------------------
select("#currentYear").textContent = new Date().getFullYear();
