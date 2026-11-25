/* =========================================================
   AIO — Editable site content.
   Change text, services, tools and links here.
   Projects live in data/projects.json (not here).
   ========================================================= */

export const SITE = {
  name: "AIO",
  owner: "Om Raval",
  location: "Surat, Gujarat, India",
  email: "ravalom642@gmail.com",
  whatsapp: "918758115051" // international format, no leading +
};

/* Category slugs here must match the "category" value used in data/projects.json */
export const CATEGORIES = [
  { slug: "motion-graphics", label: "Motion Graphics", blurb: "Animated titles, graphics and motion-led visuals." },
  { slug: "video-editing",   label: "Video Editing",   blurb: "Reels, short-form edits and cinematic cuts." },
  { slug: "photography",     label: "Photography",     blurb: "Stills and visual storytelling through the lens." },
  { slug: "graphic-design",  label: "Graphic Design",  blurb: "Posters, thumbnails, social creatives and layouts." },
  { slug: "ai-experiments",  label: "AI Experiments",  blurb: "Creative explorations with modern AI tools." },
  { slug: "client-projects", label: "Client Projects", blurb: "Commissioned work, shown in approved, privacy-safe versions." }
];

export const SERVICES = [
  { title: "Video Editing",              text: "Short-form videos, reels, social edits and cinematic cuts shaped around the story." },
  { title: "Motion Graphics",            text: "Animated titles, graphics and motion that give video and social content a distinct look." },
  { title: "Graphic Design",             text: "Posters, thumbnails, social media creatives and promotional graphics." },
  { title: "Photography & Videography",  text: "Creative shoots, content shoots and planned video production." },
  { title: "AI Creative Content",        text: "Visual concepts and content made with modern AI tools, directed with a creative eye." },
  { title: "Visual Branding",            text: "A consistent look and feel carried across content, graphics and video." }
];

export const TOOLS = [
  "Adobe Premiere Pro",
  "Adobe Photoshop",
  "DaVinci Resolve",
  "CapCut",
  "Canva"
];

export const SOCIALS = [
  { label: "Instagram",             handle: "@raval0m",   href: "https://www.instagram.com/raval0m?igsh=d2hjYTVmMTIwbWh1" },
  { label: "Instagram — Creative",  handle: "@0m.raw0",   href: "https://www.instagram.com/0m.raw0?igsh=MWw1dmQydW90cWdjOA==" },
  { label: "LinkedIn",              handle: "Om Raval",   href: "https://www.linkedin.com/in/om-raval-9549a9244/" },
  { label: "GitHub",                handle: "rom490",     href: "https://github.com/rom490" }
];
