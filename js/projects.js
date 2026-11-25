/* =========================================================
   AIO — Projects: load, featured, gallery + filters, detail view
   ========================================================= */
import { CATEGORIES } from "./config.js";
import { esc, resolvePath, parseVideo, thumbOf, formatDate } from "./media.js";

let projects = [];
let activeCategory = "all";

const $ = (sel) => document.querySelector(sel);
const catLabel = (slug) => CATEGORIES.find((c) => c.slug === slug)?.label || slug || "Project";
const projectHref = (id) => `#/project/${encodeURIComponent(id)}`;

/* ---------- Load ---------- */
export async function loadProjects() {
  try {
    const res = await fetch("data/projects.json", { cache: "no-cache" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const list = Array.isArray(json) ? json : json.projects;
    projects = (Array.isArray(list) ? list : [])
      .filter((p) => p && p.id && p.title)
      .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
    projects.forEach((p) => {
      if (!CATEGORIES.some((c) => c.slug === p.category)) {
        console.warn(`[AIO] Project "${p.id}" has unknown category "${p.category}". Use one of: ${CATEGORIES.map((c) => c.slug).join(", ")}`);
      }
    });
  } catch (err) {
    console.warn("[AIO] Could not load data/projects.json —", err.message);
    projects = [];
  }
  return projects;
}

/* ---------- Cards ---------- */
function cardHTML(p) {
  const thumb = thumbOf(p);
  const hasVideo = !!parseVideo(p.videoUrl);
  const media = thumb
    ? `<img src="${esc(thumb)}" alt="" loading="lazy" decoding="async">`
    : `<div class="card-ph" aria-hidden="true"><span>${esc(catLabel(p.category))}</span></div>`;
  return `
    <a class="card reveal" href="${projectHref(p.id)}">
      <div class="card-media">
        ${media}
        ${hasVideo ? `<span class="card-play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></span>` : ""}
        ${p.clientProject ? `<span class="card-badge">Client</span>` : ""}
      </div>
      <div class="card-meta">
        <span class="card-cat">${esc(catLabel(p.category))}${p.date ? ` · ${esc(formatDate(p.date))}` : ""}</span>
        <h3 class="card-title">${esc(p.title)}</h3>
        ${p.shortDescription ? `<p class="card-desc">${esc(p.shortDescription)}</p>` : ""}
      </div>
    </a>`;
}

function emptyHTML({ title, text, cta = true }) {
  return `
    <div class="empty reveal">
      <span class="empty-mark" aria-hidden="true">( )</span>
      <h3 class="empty-title">${esc(title)}</h3>
      <p class="empty-text">${esc(text)}</p>
      ${cta ? `<a class="link" href="#contact">Start a project <span aria-hidden="true">→</span></a>` : ""}
    </div>`;
}

/* ---------- Featured (home preview) ---------- */
export function renderFeatured() {
  const el = $("#featuredGrid");
  if (!el) return;
  const featured = projects.filter((p) => p.featured).slice(0, 3);
  el.innerHTML = featured.length
    ? featured.map(cardHTML).join("")
    : emptyHTML({
        title: "Featured work is being curated.",
        text: "Selected projects will appear here as soon as they are uploaded.",
        cta: false
      });
  el.classList.toggle("is-empty", !featured.length);
}

/* ---------- Gallery + filters ---------- */
function renderFilters() {
  const el = $("#filters");
  if (!el) return;
  const count = (slug) => projects.filter((p) => p.category === slug).length;
  const items = [{ slug: "all", label: "All", n: projects.length }, ...CATEGORIES.map((c) => ({ slug: c.slug, label: c.label, n: count(c.slug) }))];
  el.innerHTML = items.map((i) => `
    <button type="button" class="chip" data-cat="${i.slug}" aria-pressed="${i.slug === activeCategory}">
      ${esc(i.label)}<sup>${i.n}</sup>
    </button>`).join("");
}

export function renderGallery() {
  const el = $("#galleryGrid");
  const status = $("#galleryStatus");
  if (!el) return;

  const list = activeCategory === "all" ? projects : projects.filter((p) => p.category === activeCategory);
  const cat = CATEGORIES.find((c) => c.slug === activeCategory);

  if (list.length) {
    el.innerHTML = list.map(cardHTML).join("");
    el.classList.remove("is-empty");
  } else if (cat) {
    el.innerHTML = emptyHTML({ title: `No ${cat.label} projects yet.`, text: `${cat.blurb} New work is on its way.` });
    el.classList.add("is-empty");
  } else {
    el.innerHTML = emptyHTML({
      title: "The archive is being prepared.",
      text: "Projects will appear here as they are added. In the meantime, say hello.",
    });
    el.classList.add("is-empty");
  }

  if (status) {
    const where = cat ? ` in ${cat.label}` : "";
    status.textContent = `Showing ${list.length} project${list.length === 1 ? "" : "s"}${where}.`;
  }
  document.dispatchEvent(new CustomEvent("aio:content-rendered"));
}

export function initGallery() {
  renderFilters();
  renderGallery();
  $("#filters")?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-cat]");
    if (!btn) return;
    activeCategory = btn.dataset.cat;
    $("#filters").querySelectorAll("[data-cat]").forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
    renderGallery();
  });
}

/* ---------- Detail view ---------- */
function paragraphs(text) {
  return String(text || "")
    .split(/\n{2,}/)
    .map((t) => t.trim())
    .filter(Boolean)
    .map((t) => `<p>${esc(t).replace(/\n/g, "<br>")}</p>`)
    .join("");
}

function videoHTML(p) {
  const v = parseVideo(p.videoUrl);
  if (!v) return "";
  if (v.type === "embed") {
    return `<div class="pv-video"><iframe src="${esc(v.src)}" title="${esc(p.title)} — video" loading="lazy" allow="fullscreen; picture-in-picture; encrypted-media" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div>`;
  }
  if (v.type === "file") {
    const poster = thumbOf(p);
    return `<div class="pv-video"><video controls playsinline preload="none" ${poster ? `poster="${esc(poster)}"` : ""} src="${esc(v.src)}"></video></div>`;
  }
  return `<a class="btn" href="${esc(v.src)}" target="_blank" rel="noopener">Watch video <span aria-hidden="true">↗</span></a>`;
}

function detailHTML(p, i) {
  const gallery = (Array.isArray(p.gallery) ? p.gallery : []).map(resolvePath).filter(Boolean);
  const tools = Array.isArray(p.tools) ? p.tools : [];
  const prev = projects[(i - 1 + projects.length) % projects.length];
  const next = projects[(i + 1) % projects.length];
  const body = p.fullDescription || p.shortDescription;

  return `
    <header class="pv-head">
      <p class="eyebrow">${esc(catLabel(p.category))}${p.clientProject ? " · Client project" : ""}</p>
      <h2 class="pv-title" id="pvTitle">${esc(p.title)}</h2>
      <dl class="pv-meta">
        ${p.date ? `<div><dt>Date</dt><dd>${esc(formatDate(p.date))}</dd></div>` : ""}
        <div><dt>Category</dt><dd>${esc(catLabel(p.category))}</dd></div>
        ${tools.length ? `<div><dt>Software &amp; tools</dt><dd>${tools.map(esc).join(", ")}</dd></div>` : ""}
      </dl>
    </header>
    ${videoHTML(p)}
    ${body ? `<div class="pv-body">${paragraphs(body)}</div>` : ""}
    ${p.clientProject ? `<p class="pv-note">Client work is shown only in approved, privacy-safe versions.</p>` : ""}
    ${gallery.length ? `<div class="pv-gallery">${gallery.map((src) => `<figure><img src="${esc(src)}" alt="" loading="lazy" decoding="async"></figure>`).join("")}</div>` : ""}
    ${projects.length > 1 ? `
      <nav class="pv-nav" aria-label="More projects">
        <a href="${projectHref(prev.id)}"><span>← Previous</span><strong>${esc(prev.title)}</strong></a>
        <a href="${projectHref(next.id)}"><span>Next →</span><strong>${esc(next.title)}</strong></a>
      </nav>` : ""}`;
}

let lastFocus = null;
let hideTimer = null;
const pageEls = () => document.querySelectorAll("[data-page]");

export function showProject(id) {
  const view = $("#projectView");
  const content = $("#pvContent");
  if (!view || !content) return;

  const i = projects.findIndex((p) => p.id === id);
  content.innerHTML = i === -1
    ? `<header class="pv-head"><h2 class="pv-title" id="pvTitle">Project not found</h2></header>
       <div class="pv-body"><p>This project doesn't exist (yet). It may have been moved or renamed.</p></div>`
    : detailHTML(projects[i], i);

  clearTimeout(hideTimer);
  if (view.hidden) {
    lastFocus = document.activeElement;
    view.hidden = false;
    view.getBoundingClientRect(); // force reflow so the transition runs
  }
  view.classList.add("open");
  view.scrollTop = 0;
  document.body.classList.add("no-scroll");
  pageEls().forEach((el) => { el.inert = true; });
  $("#pvClose")?.focus({ preventScroll: true });
  document.title = i === -1 ? "AIO | Project" : `${projects[i].title} | AIO`;
}

export function hideProject() {
  const view = $("#projectView");
  if (!view || view.hidden) return;
  view.classList.remove("open");
  document.body.classList.remove("no-scroll");
  pageEls().forEach((el) => { el.inert = false; });
  document.title = "AIO | Om Raval — Independent Creative Studio";
  hideTimer = setTimeout(() => {
    view.hidden = true;
    $("#pvContent").innerHTML = ""; // also stops any playing video
  }, 520);
  if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus({ preventScroll: true });
}
