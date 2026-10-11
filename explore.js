
/* ==========================================
   GEOWORLD — EXPLORE ENGINE
   Navigation, filters and card interactions
========================================== */

(() => {
  "use strict";

  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];

  /* MOBILE NAVIGATION */

  const menuButton = $("#menuButton");
  const navLinks = $("#navLinks");

  if (menuButton && navLinks) {
    menuButton.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");

      menuButton.setAttribute("aria-expanded", String(isOpen));
      menuButton.textContent = isOpen ? "✕" : "☰";
    });

    $$(".nav-links a", navLinks).forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.textContent = "☰";
      });
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        navLinks.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.textContent = "☰";
      }
    });

    document.addEventListener("click", event => {
      if (
        navLinks.classList.contains("open") &&
        !navLinks.contains(event.target) &&
        !menuButton.contains(event.target)
      ) {
        navLinks.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.textContent = "☰";
      }
    });
  }

  /* CATEGORY FILTERS */

  const filterButtons = $$(".filter-btn");
  const cards = $$(".explore-card");
  const resultCount = $("#resultCount");
  const emptyState = $("#emptyState");
  const grid = $("#exploreGrid");

  function filterCards(category) {
    let visibleCount = 0;

    cards.forEach((card, index) => {
      const matches =
        category === "all" ||
        card.dataset.category === category;

      card.hidden = !matches;

      if (matches) {
        visibleCount++;

        // Restart the subtle entrance animation.
        card.style.animation = "none";
        void card.offsetWidth;
        card.style.animation = `reveal .45s ${index * 0.04}s both`;
      }
    });

    if (resultCount) {
      resultCount.textContent =
        `${String(visibleCount).padStart(2, "0")} CATEGORIES`;
    }

    if (emptyState) {
      emptyState.hidden = visibleCount !== 0;
    }

    if (grid) {
      grid.setAttribute("aria-busy", "false");
    }
  }

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      filterButtons.forEach(item => {
        item.classList.remove("active");
        item.setAttribute("aria-pressed", "false");
      });

      button.classList.add("active");
      button.setAttribute("aria-pressed", "true");

      filterCards(button.dataset.filter || "all");
    });

    button.setAttribute(
      "aria-pressed",
      String(button.classList.contains("active"))
    );
  });

  /* IMAGE FALLBACKS */

  $$("img").forEach(img => {
    img.addEventListener("error", () => {
      img.classList.add("image-unavailable");
    }, { once: true });
  });

  /* CURRENT NAVIGATION */

  const currentPage = window.location.pathname
    .split("/")
    .pop()
    .toLowerCase() || "explore.html";

  $$(".nav-links a").forEach(link => {
    const target = link.getAttribute("href");

    if (target && target.toLowerCase() === currentPage) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });

  /* INITIALIZE */

  filterCards("all");

  console.info("GEOWORLD Explore initialized successfully.");
})();
