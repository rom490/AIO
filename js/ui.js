/* =========================================================
   AIO — UI: static sections, nav, reveals, timecode
   ========================================================= */
import { SITE, CATEGORIES, SERVICES, TOOLS, SOCIALS } from "./config.js";
import { esc } from "./media.js";

const $ = (sel) => document.querySelector(sel);
const pad = (n) => String(n).padStart(2, "0");
const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Static sections rendered from config ---------- */
export function renderStatic(whatsappUrl) {
  const marqueeItems = CATEGORIES.filter((c) => c.slug !== "client-projects").map((c) => c.label);
  const marqueeRun = marqueeItems.map((t) => `<span>${esc(t)}</span>`).join("");
  const marquee = $("#marqueeTrack");
  if (marquee) marquee.innerHTML = `<div class="marquee-run">${marqueeRun}</div><div class="marquee-run" aria-hidden="true">${marqueeRun}</div>`;

  const services = $("#servicesList");
  if (services) {
    services.innerHTML = SERVICES.map((s, i) => `
      <li class="service reveal">
        <span class="service-n">${pad(i + 1)}</span>
        <h3 class="service-title">${esc(s.title)}</h3>
        <p class="service-text">${esc(s.text)}</p>
      </li>`).join("");
  }

  const tools = $("#toolsList");
  if (tools) tools.innerHTML = TOOLS.map((t) => `<li class="reveal">${esc(t)}</li>`).join("");

  const links = $("#contactLinks");
  if (links) {
    const rows = [
      { label: "Email", value: SITE.email, href: `mailto:${SITE.email}` },
      { label: "WhatsApp", value: "Message on WhatsApp", href: whatsappUrl, external: true },
      ...SOCIALS.map((s) => ({ label: s.label, value: s.handle, href: s.href, external: true }))
    ];
    links.innerHTML = rows.map((r) => `
      <li>
        <a href="${esc(r.href)}"${r.external ? ' target="_blank" rel="noopener"' : ""}>
          <span class="cl-label">${esc(r.label)}</span>
          <span class="cl-value">${esc(r.value)} <span aria-hidden="true">${r.external ? "↗" : "→"}</span></span>
        </a>
      </li>`).join("");
  }

  document.querySelectorAll(".js-year").forEach((el) => { el.textContent = new Date().getFullYear(); });
  document.querySelectorAll(".js-location").forEach((el) => { el.textContent = SITE.location; });
}

/* ---------- Nav ---------- */
export function initNav() {
  const nav = $("#nav");
  const btn = $("#menuBtn");
  const menu = $("#mobileMenu");

  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 24);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const setMenu = (open) => {
    btn.setAttribute("aria-expanded", String(open));
    btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.classList.toggle("open", open);
    document.body.classList.toggle("menu-open", open);
  };
  btn.addEventListener("click", () => setMenu(btn.getAttribute("aria-expanded") !== "true"));
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

  // Highlight the link of the section in view
  const links = document.querySelectorAll("[data-nav]");
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === `#${entry.target.id}`));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  ["work", "about", "services", "contact"].forEach((id) => { const s = document.getElementById(id); if (s) io.observe(s); });
}

/* ---------- Scroll reveals ---------- */
let revealObserver = null;
export function observeReveals() {
  const items = document.querySelectorAll(".reveal:not(.in)");
  if (reducedMotion() || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("in"));
    return;
  }
  if (!revealObserver) {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
  }
  items.forEach((el, i) => {
    el.style.setProperty("--d", `${(i % 4) * 70}ms`);
    revealObserver.observe(el);
  });
}

/* ---------- Hero timecode (editor's timeline motif) ---------- */
export function initTimecode() {
  const el = $("#timecode");
  const hero = $("#home");
  if (!el || !hero || reducedMotion()) return;

  const FPS = 24;
  let start = performance.now();
  let raf = 0;

  const tick = (now) => {
    const frames = Math.floor(((now - start) / 1000) * FPS);
    const f = frames % FPS;
    const s = Math.floor(frames / FPS) % 60;
    const m = Math.floor(frames / (FPS * 60)) % 60;
    const h = Math.floor(frames / (FPS * 3600));
    el.textContent = `${pad(h)}:${pad(m)}:${pad(s)}:${pad(f)}`;
    raf = requestAnimationFrame(tick);
  };

  new IntersectionObserver(([entry]) => {
    cancelAnimationFrame(raf);
    if (entry.isIntersecting) raf = requestAnimationFrame(tick);
  }).observe(hero);
}
