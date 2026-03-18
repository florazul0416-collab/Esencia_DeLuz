/* =================================================
   MAIN.JS — Andre-Esencia_deluz
   Interacciones, animaciones y menú
   ================================================= */

/* ═══════════════════════════════════
   MENÚ HAMBURGUESA
   ═══════════════════════════════════ */

const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

if (menuToggle) {
  menuToggle.addEventListener("click", function () {
    navLinks.classList.toggle("active");

    // Toggle icon bars ↔ X
    const icon = menuToggle.querySelector("i");
    if (icon) {
      icon.classList.toggle("fa-bars");
      icon.classList.toggle("fa-xmark");
    }
  });

  // Cerrar menú al hacer click en un enlace
  const links = navLinks.querySelectorAll("a");
  links.forEach(function (link) {
    link.addEventListener("click", function () {
      navLinks.classList.remove("active");
      const icon = menuToggle.querySelector("i");
      if (icon) {
        icon.classList.add("fa-bars");
        icon.classList.remove("fa-xmark");
      }
    });
  });
}

/* ═══════════════════════════════════
   NAVBAR SCROLL EFFECT
   ═══════════════════════════════════ */

const navbar = document.getElementById("navbar");

if (navbar) {
  window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });
}

/* ═══════════════════════════════════
   INTERSECTION OBSERVER — Scroll Animations
   ═══════════════════════════════════ */

// Observar elementos con clase .fade-up, .fade-in, .product-card
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -40px 0px"
};

const observer = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Elementos a observar
function initObserver() {
  const fadeElements = document.querySelectorAll(
    ".fade-up, .fade-in, .product-card, .value-card, .step-item, .feature-item"
  );

  fadeElements.forEach(function (el) {
    observer.observe(el);
  });
}

/* ═══════════════════════════════════
   INICIALIZACIÓN
   ═══════════════════════════════════ */

document.addEventListener("DOMContentLoaded", function () {
  initObserver();
});

// También iniciar al cargar (por si DOMContentLoaded ya pasó)
window.addEventListener("load", function () {
  initObserver();
});

console.log("✨ Andre-Esencia_deluz cargado correctamente");
