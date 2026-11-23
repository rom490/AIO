/* =========================================================
   AIO — Entry point
   ========================================================= */
import { renderStatic, initNav, observeReveals, initTimecode } from "./ui.js";
import { initContact, buildWhatsAppUrl } from "./contact.js";
import { loadProjects, renderFeatured, initGallery, showProject, hideProject } from "./projects.js";

const view = () => document.getElementById("projectView");
let enteredFromPage = false; // true when the project view was opened from the normal page
let firstRoute = true;

function route() {
  const m = location.hash.match(/^#\/project\/(.+)$/);
  if (m) {
    const alreadyOpen = !view().hidden;
    if (!alreadyOpen && !firstRoute) enteredFromPage = true;
    showProject(decodeURIComponent(m[1]));
  } else {
    hideProject();
  }
  firstRoute = false;
}

function closeProject() {
  if (enteredFromPage) {
    enteredFromPage = false;
    history.back();
  } else {
    // Opened via a direct link: there is nothing to go back to, so land on the work section.
    history.replaceState(null, "", `${location.pathname}${location.search}#work`);
    hideProject();
    document.getElementById("work")?.scrollIntoView();
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  renderStatic(buildWhatsAppUrl());
  initContact();
  initNav();
  initTimecode();
  observeReveals();

  await loadProjects();
  renderFeatured();
  initGallery();
  observeReveals();
  document.addEventListener("aio:content-rendered", observeReveals);

  document.getElementById("pvClose").addEventListener("click", closeProject);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !view().hidden) closeProject(); });
  // Previous / Next replace the current history entry so "close" always returns to the page.
  document.getElementById("pvContent").addEventListener("click", (e) => {
    const a = e.target.closest(".pv-nav a");
    if (!a) return;
    e.preventDefault();
    location.replace(a.getAttribute("href"));
  });

  window.addEventListener("hashchange", route);
  route();
});
