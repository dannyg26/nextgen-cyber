document.addEventListener("DOMContentLoaded", () => {
  const nav = document.getElementById("site-nav") || document.querySelector(".nav");
  const menuToggle = document.getElementById("menu-toggle");
  const links = document.getElementById("nav-links") || document.querySelector(".links");

  if (!nav || !menuToggle || !links) return;

  const closeMenu = () => {
    links.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  };

  // Toggle menu
  menuToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = links.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  // Close menu when clicking a link
  links.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a) return;
    closeMenu();
  });

  // ✅ Close menu when clicking anywhere outside the nav (this is what you said was missing)
  document.addEventListener("click", (e) => {
    if (!links.classList.contains("open")) return;
    if (e.target.closest(".nav")) return; // clicking inside nav shouldn't close
    closeMenu();
  });

  // Close menu if resizing to desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth > 1300) closeMenu();
  });

  // Scrolled effect (same as others)
  const onScroll = () => {
    const scrolled = window.scrollY > 10;
    nav.classList.toggle("scrolled", scrolled);
    links.classList.toggle("scrolled", scrolled);

    // If menu open, keep scrolled styling
    if (links.classList.contains("open")) {
      nav.classList.add("scrolled");
      links.classList.add("scrolled");
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();
});
