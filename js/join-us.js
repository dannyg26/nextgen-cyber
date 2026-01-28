document.addEventListener("DOMContentLoaded", () => {

  const menuToggle = document.getElementById("menu-toggle");
  const navList = document.querySelector(".nav-list");
  const nav = document.querySelector(".nav");
  const links = document.querySelector(".links");

  const rail = document.getElementById("latest-rail");
  const prev = document.querySelector(".arrow.prev");
  const next = document.querySelector(".arrow.next");

  /* =========================
     MOBILE MENU BEHAVIOR
  ========================= */

  const closeMenu = () => {
    if (!navList || !menuToggle) return;
    navList.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  };

  if (menuToggle && navList) {

    // toggle hamburger
    menuToggle.addEventListener("click", (e) => {
      e.stopPropagation(); // prevents immediate close
      const isOpen = navList.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    // close when clicking a link
    navList.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a) return;
      closeMenu();
    });

    // close when clicking anywhere else
    document.addEventListener("click", (e) => {
      if (!navList.classList.contains("open")) return;
      if (e.target.closest(".nav")) return;
      closeMenu();
    });

    // close when resizing to desktop
    window.addEventListener("resize", () => {
      if (window.innerWidth > 1300) closeMenu();
    });
  }

  /* =========================
     NAVBAR SCROLL EFFECT
  ========================= */

  function onScroll() {
    if (!nav || !links) return;

    const isMobile = window.innerWidth <= 1300;

    if (isMobile) {
      nav.classList.add("scrolled");
      links.classList.remove("scrolled");
      return;
    }

    const scrolled = window.scrollY > 0;
    nav.classList.toggle("scrolled", scrolled);
    links.classList.toggle("scrolled", scrolled);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  /* =========================
     EVENTS RAIL
  ========================= */

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

    rail.tabIndex = 0;
    rail.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") scrollByAmount(1);
      if (e.key === "ArrowLeft") scrollByAmount(-1);
    });

    updateArrows();
  }
});
