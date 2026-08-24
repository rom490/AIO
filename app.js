/* =========================================================
   AIO — Site behavior
   ========================================================= */

const ICONS = {
  instagram: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1"/></svg>`,
  linkedin: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.6c0-1.34-.02-3.06-1.87-3.06-1.87 0-2.15 1.46-2.15 2.96V21h-4V9Z"/></svg>`,
  whatsapp: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.02 2A10 10 0 0 0 3.4 17.4L2 22l4.75-1.35A10 10 0 1 0 12.02 2Zm5.5 14.2c-.23.66-1.33 1.26-1.84 1.33-.47.07-1.06.1-1.71-.1-.4-.13-.9-.3-1.56-.58-2.75-1.2-4.54-3.98-4.68-4.16-.14-.19-1.1-1.47-1.1-2.8 0-1.33.7-1.98.94-2.25.24-.27.53-.34.7-.34l.5.01c.16 0 .38-.06.6.46.23.53.77 1.87.84 2 .07.13.11.29.02.47-.09.19-.13.3-.26.46-.13.16-.28.36-.4.48-.13.13-.27.28-.12.55.16.27.7 1.16 1.5 1.88 1.04.93 1.9 1.22 2.17 1.35.27.14.43.12.6-.07.16-.19.68-.79.86-1.06.18-.27.35-.22.6-.13.24.09 1.55.73 1.82.86.27.13.45.2.51.31.07.12.07.68-.16 1.33Z"/></svg>`,
  email: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/></svg>`
};

function iconFor(name){ return ICONS[name] || ""; }

/* ---------- Render Services ---------- */
function renderServices(){
  const grid = document.getElementById("servicesGrid");
  grid.innerHTML = SERVICES.map(s => `
    <div class="service-card ${s.size}">
      <div class="service-num">${s.n}</div>
      <div>
        <div class="service-title">${s.title}</div>
        <p class="service-text">${s.text}</p>
      </div>
    </div>
  `).join("");
}

/* ---------- Render Digital Stack ---------- */
function renderStack(){
  const grid = document.getElementById("stackGrid");
  grid.innerHTML = STACK.map(s => `
    <div class="stack-card">
      <div class="stack-title">${s.title}</div>
      <div class="stack-note">${s.note}</div>
    </div>
  `).join("");
}

/* ---------- Render Process ---------- */
function renderProcess(){
  const track = document.getElementById("processTrack");
  track.innerHTML = PROCESS.map(p => `
    <div class="process-step">
      <div class="process-num">${p.n}</div>
      <div class="process-title">${p.title}</div>
      <p class="process-text">${p.text}</p>
    </div>
  `).join("");
}

/* ---------- Render Social Links ---------- */
function renderSocials(){
  const rows = [document.getElementById("socialRow"), document.getElementById("footerSocialRow")];
  const html = SOCIALS.map(s => {
    const isWhatsapp = s.icon === "whatsapp";
    const attrs = isWhatsapp
      ? `href="#" class="social-icon js-whatsapp-link"`
      : `href="${s.href}" class="social-icon" target="_blank" rel="noopener"`;
    return `<a ${attrs} aria-label="${s.label}">${iconFor(s.icon)}</a>`;
  }).join("");
  rows.forEach(r => { if (r) r.innerHTML = html; });
}

/* ---------- WhatsApp message builder ---------- */
function buildWhatsAppUrl(data){
  const lines = [
    "Hello Om, I would like to discuss a project.",
    "",
    `Name: ${data.name || "-"}`,
    `Email: ${data.email || "-"}`,
    `Phone: ${data.phone || "-"}`,
    `Service: ${data.service || "-"}`,
    `Project Details: ${data.details || "-"}`,
    `Budget: ${data.budget || "-"}`,
    `Deadline: ${data.deadline || "-"}`
  ];
  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

function wireWhatsAppLinks(){
  // Generic floating button + footer/contact icons open a blank pre-filled chat
  const genericUrl = buildWhatsAppUrl({});
  const floatBtn = document.getElementById("whatsappFloat");
  if (floatBtn) floatBtn.href = genericUrl;
  document.querySelectorAll(".js-whatsapp-link").forEach(el => {
    el.href = genericUrl;
    el.target = "_blank";
    el.rel = "noopener";
  });
}

/* ---------- Contact form -> WhatsApp ---------- */
function wireContactForm(){
  const form = document.getElementById("contactForm");
  const note = document.getElementById("formNote");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const data = Object.fromEntries(fd.entries());

    if (!data.name || !data.email || !data.phone || !data.service || !data.details){
      note.textContent = "Please fill in the required fields above.";
      note.style.color = "#c0392b";
      return;
    }

    const url = buildWhatsAppUrl(data);
    note.textContent = "Opening WhatsApp with your project details…";
    note.style.color = "";
    window.open(url, "_blank", "noopener");
  });
}

/* ---------- Nav behavior ---------- */
function wireNav(){
  const nav = document.getElementById("nav");
  const onScroll = () => {
    if (window.scrollY > 40) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");
  hamburger.addEventListener("click", () => {
    const isOpen = hamburger.classList.toggle("open");
    mobileMenu.classList.toggle("open", isOpen);
    hamburger.setAttribute("aria-expanded", String(isOpen));
  });
  mobileMenu.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      hamburger.classList.remove("open");
      mobileMenu.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
    });
  });

  // Active link on scroll
  const sections = ["about", "services", "contact"].map(id => document.getElementById(id)).filter(Boolean);
  const links = document.querySelectorAll('[data-nav]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        const id = entry.target.id;
        links.forEach(l => l.classList.toggle("active", l.getAttribute("href") === `#${id}`));
      }
    });
  }, { rootMargin: "-45% 0px -45% 0px" });
  sections.forEach(s => io.observe(s));
}

/* ---------- Magnetic buttons ---------- */
function wireMagnetic(){
  const items = document.querySelectorAll(".magnetic");
  items.forEach(el => {
    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.18}px, ${y * 0.35}px)`;
    });
    el.addEventListener("mouseleave", () => { el.style.transform = ""; });
  });
}

/* ---------- GSAP animations ---------- */
function wireAnimations(){
  if (typeof gsap === "undefined"){
    // GSAP failed to load (e.g. offline / CDN blocked) — fail gracefully, keep content visible.
    document.querySelectorAll(".reveal, .reveal-up").forEach(el => { el.style.opacity = 1; el.style.transform = "none"; });
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced){
    document.querySelectorAll(".reveal, .reveal-up").forEach(el => { el.style.opacity = 1; el.style.transform = "none"; });
    return;
  }

  // Hero entrance
  gsap.set(".hero-label", { opacity:0, y:24 });
  gsap.set(".hero-heading", { opacity:0, y:24 });
  gsap.set(".hero-photo", { opacity:0, y:24 });
  gsap.set(".hero-tag", { opacity:0, y:24 });
  gsap.timeline({ defaults: { ease: "power3.out" } })
    .to(".hero-label", { opacity:1, y:0, duration:0.6 })
    .to(".hero-heading", { opacity:1, y:0, duration:0.7 }, "-=0.35")
    .to(".hero-photo", { opacity:1, y:0, duration:0.8 }, "-=0.55")
    .to(".hero-tag", { opacity:1, y:0, duration:0.5, stagger:0.08 }, "-=0.4");

  // Scroll reveals for everything below the fold
  gsap.utils.toArray(".section .reveal-up, .section .big-type, .section .big-sub").forEach((el) => {
    gsap.set(el, { opacity:0, y:36 });
    gsap.to(el, {
      opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 85%" }
    });
  });

  // Staggered card entrances
  [".service-card", ".stack-card", ".process-step"].forEach(sel => {
    const items = gsap.utils.toArray(sel);
    if (!items.length) return;
    gsap.set(items, { opacity: 0, y: 26 });
    ScrollTrigger.batch(items, {
      start: "top 88%",
      onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "power3.out" })
    });
  });

  // Slight parallax on hero photo
  gsap.to(".hero-photo img", {
    yPercent: 6,
    ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
  });
}

/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", () => {
  renderServices();
  renderStack();
  renderProcess();
  renderSocials();
  wireWhatsAppLinks();
  wireContactForm();
  wireNav();
  wireMagnetic();
  wireAnimations();
});
