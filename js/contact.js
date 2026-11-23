/* =========================================================
   AIO — Contact: project inquiry form -> WhatsApp
   (same behaviour as the previous site)
   ========================================================= */
import { SITE, SERVICES } from "./config.js";

export function buildWhatsAppUrl(data = {}) {
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
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`;
}

export function initContact() {
  const form = document.getElementById("contactForm");
  const note = document.getElementById("formNote");
  const select = document.getElementById("f_service");
  if (!form) return;

  if (select) {
    const opts = [...SERVICES.map((s) => s.title), "Other"];
    select.insertAdjacentHTML("beforeend", opts.map((o) => `<option>${o.replace(/&/g, "&amp;")}</option>`).join(""));
  }

  const float = document.getElementById("whatsappFloat");
  if (float) float.href = buildWhatsAppUrl();

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const required = [...form.elements].filter((el) => el.required);
    let firstBad = null;
    required.forEach((el) => {
      const bad = !el.value.trim() || !el.checkValidity();
      el.setAttribute("aria-invalid", String(bad));
      if (bad && !firstBad) firstBad = el;
    });

    if (firstBad) {
      note.textContent = "Please complete the highlighted fields.";
      note.classList.add("is-error");
      firstBad.focus();
      return;
    }

    const data = Object.fromEntries(new FormData(form).entries());
    note.classList.remove("is-error");
    note.textContent = "Opening WhatsApp with your project details…";
    window.open(buildWhatsAppUrl(data), "_blank", "noopener");
  });

  form.addEventListener("input", (e) => {
    if (e.target.getAttribute("aria-invalid") === "true" && e.target.value.trim()) e.target.setAttribute("aria-invalid", "false");
  });
}
