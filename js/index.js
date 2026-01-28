document.addEventListener("DOMContentLoaded", () => {
  /* =========================
     MOBILE MENU TOGGLE
  ========================= */
  const menuToggle = document.getElementById("menu-toggle");
  const links = document.querySelector(".links"); // ✅ your CSS uses .links
  const nav = document.querySelector(".nav");

  if (menuToggle && links) {
    menuToggle.addEventListener("click", () => {
      links.classList.toggle("open");
      menuToggle.setAttribute(
        "aria-expanded",
        links.classList.contains("open") ? "true" : "false"
      );
    });

    // Close menu when clicking a link
    links.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a) return;
      links.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!links.classList.contains("open")) return;
      if (e.target.closest(".nav")) return; // click inside nav => ignore
      links.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  }

  /* =========================
     NAVBAR SCROLL EFFECT
     - Desktop: toggles .scrolled based on scroll
     - Mobile <=1300: navbar stays at top always (no snap/slide)
  ========================= */
  function onScroll() {
    if (!nav || !links) return;

    const isMobile = window.matchMedia("(max-width: 1300px)").matches;

    if (isMobile) {
      // ✅ Keep nav pinned (CSS already does top:0). Avoid scroll-driven class changes that caused snap behavior.
      // Optional: keep "scrolled" style on mobile always for consistent glass look.
      nav.classList.add("scrolled");
      links.classList.remove("scrolled");

      // If menu is open, keep scrolled styling (harmless)
      if (links.classList.contains("open")) {
        nav.classList.add("scrolled");
      }
      return;
    }

    // Desktop behavior
    const scrolled = window.scrollY > 0;
    nav.classList.toggle("scrolled", scrolled);
    links.classList.toggle("scrolled", scrolled);

    // If menu open, keep nav scrolled styling
    if (links.classList.contains("open")) {
      nav.classList.add("scrolled");
      links.classList.add("scrolled");
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  /* =========================
     HERO SLIDER
     (Works with images OR videos)
  ========================= */
  const hero = document.querySelector(".hero");
  const slidesEl = hero?.querySelector(".slides");
  const slides = Array.from(hero?.querySelectorAll(".slide") || []);
  const btnPrev = hero?.querySelector(".hero-arrow.prev");
  const btnNext = hero?.querySelector(".hero-arrow.next");
  const dotsWrap = hero?.querySelector(".dots");

  // If slider not present on a page, don't kill the rest of the JS
  if (!hero || !slidesEl || !slides.length || !dotsWrap) return;

  let index = slides.findIndex((s) => s.classList.contains("is-active"));
  if (index < 0) index = 0;

  // Build dots
  dotsWrap.innerHTML = "";
  const dots = slides.map((_, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.setAttribute("aria-label", `Go to slide ${i + 1}`);
    b.addEventListener("click", () => goTo(i));
    dotsWrap.appendChild(b);
    return b;
  });

  function getVideo(node) {
    return node.querySelector("video.slide-video");
  }

  // Pause/reset all videos once (if you still have any)
  slides.forEach((s) => {
    const v = getVideo(s);
    if (v) {
      try { v.pause(); } catch {}
      try { v.currentTime = 0; } catch {}
      v.muted = true;
      v.playsInline = true;
    }
  });

  function activate(i) {
    slides.forEach((s, idx) => {
      const v = getVideo(s);

      if (idx === i) {
        s.classList.add("is-active");
        if (v) {
          v.muted = true;
          v.playsInline = true;
          v.play?.().catch(() => {});
        }
      } else {
        s.classList.remove("is-active");
        if (v) {
          try { v.pause(); } catch {}
          try { v.currentTime = 0; } catch {}
        }
      }
    });

    dots.forEach((d, idx) => d.classList.toggle("is-active", idx === i));
  }

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    activate(index);
    slidesEl.setAttribute("aria-live", "polite");
  }

  function next() { goTo(index + 1); }
  function prev() { goTo(index - 1); }

  btnNext?.addEventListener("click", next);
  btnPrev?.addEventListener("click", prev);

  // Keyboard
  hero.setAttribute("tabindex", "-1");
  hero.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); next(); }
    if (e.key === "ArrowLeft")  { e.preventDefault(); prev(); }
  });

  // Touch swipe
  let startX = null;
  hero.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  }, { passive: true });

  hero.addEventListener("touchend", (e) => {
    if (startX == null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) (dx < 0 ? next : prev)();
    startX = null;
  }, { passive: true });

  // Init
  activate(index);
  window.addEventListener("resize", () => activate(index));
});
