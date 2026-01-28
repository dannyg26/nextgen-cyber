document.addEventListener("DOMContentLoaded", () => {
  /* =========================
     NAVBAR + HAMBURGER (Events)
     matches your events.html ids exactly
  ========================= */
  const nav = document.getElementById("site-nav");
  const toggle = document.getElementById("menu-toggle");
  const links = document.getElementById("nav-links");

  const closeMenu = () => {
    if (!links || !toggle) return;
    links.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  };

  // Guard: if nav markup is missing, don’t crash the page
  if (nav && toggle && links) {
    toggle.addEventListener("click", (e) => {
      e.preventDefault();
      const isOpen = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Close when clicking a link
    links.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a) return;
      closeMenu();
    });

    // Close when clicking outside nav
    document.addEventListener("click", (e) => {
      if (!links.classList.contains("open")) return;
      if (e.target.closest("#site-nav")) return;
      closeMenu();
    });

    // Close if resizing to desktop
    window.addEventListener("resize", () => {
      if (window.innerWidth > 1300) closeMenu();
    });

    // Scroll glass effect
    const setScrolled = () => {
      const scrolled = window.scrollY > 10;
      nav.classList.toggle("scrolled", scrolled);
      links.classList.toggle("scrolled", scrolled);

      // If menu open, keep nav styled
      if (links.classList.contains("open")) {
        nav.classList.add("scrolled");
      }
    };

    window.addEventListener("scroll", setScrolled, { passive: true });
    window.addEventListener("resize", setScrolled);
    setScrolled();
  }

  /* =========================
     EVENTS RAIL ARROWS
     IMPORTANT: do NOT return early and kill the menu
  ========================= */
  const rail = document.getElementById("latest-rail");
  const prev = document.querySelector(".arrow.prev");
  const next = document.querySelector(".arrow.next");

  if (rail && prev && next) {
    function updateArrows() {
      prev.disabled = rail.scrollLeft < 5;
      const max = rail.scrollWidth - rail.clientWidth - 5;
      next.disabled = rail.scrollLeft >= max;
    }

    function scrollByAmount(dir) {
      const amount = Math.max(rail.clientWidth * 0.9, 320);
      rail.scrollBy({ left: dir * amount, behavior: "smooth" });
    }

    prev.addEventListener("click", () => scrollByAmount(-1));
    next.addEventListener("click", () => scrollByAmount(1));
    rail.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);

    // Keyboard support
    rail.tabIndex = 0;
    rail.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") scrollByAmount(1);
      if (e.key === "ArrowLeft") scrollByAmount(-1);
    });

    updateArrows();
  }
});
