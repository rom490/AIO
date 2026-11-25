/* =========================================================
   AIO — Media helpers (paths, embeds, thumbnails, escaping)
   ========================================================= */

export function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));
}

const isAbsolute = (s) => /^(https?:)?\/\//i.test(s) || s.startsWith("data:");

/* Local paths are relative to the site root (works on GitHub Pages sub-paths). */
export function resolvePath(p) {
  if (!p || typeof p !== "string") return "";
  const s = p.trim();
  return isAbsolute(s) ? s : s.replace(/^\.?\//, "");
}

/* Works out how to show a video link: embed, native <video>, or plain link. */
export function parseVideo(url) {
  if (!url || typeof url !== "string") return null;
  const u = url.trim();
  let m;

  m = u.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/);
  if (m) {
    return {
      type: "embed", provider: "YouTube",
      src: `https://www.youtube-nocookie.com/embed/${m[1]}?rel=0`,
      thumb: `https://i.ytimg.com/vi/${m[1]}/hqdefault.jpg`
    };
  }

  m = u.match(/instagram\.com\/(?:[\w.]+\/)?(reel|reels|p|tv)\/([\w-]+)/i);
  if (m) {
    const kind = m[1].toLowerCase() === "reels" ? "reel" : m[1].toLowerCase();
    return {
      type: "embed", provider: "Instagram", portrait: true,
      src: `https://www.instagram.com/${kind}/${m[2]}/embed/`
    };
  }

  m = u.match(/vimeo\.com\/(?:video\/)?(\d+)(?:\/(\w+))?/);
  if (m) {
    return {
      type: "embed", provider: "Vimeo",
      src: `https://player.vimeo.com/video/${m[1]}${m[2] ? `?h=${m[2]}` : ""}`
    };
  }

  m = u.match(/drive\.google\.com\/file\/d\/([\w-]+)/);
  if (m) {
    return { type: "embed", provider: "Google Drive", src: `https://drive.google.com/file/d/${m[1]}/preview` };
  }

  if (/\.(mp4|webm|mov|m4v|ogv)(\?.*)?$/i.test(u)) {
    return { type: "file", provider: "Video", src: resolvePath(u) };
  }

  return { type: "link", provider: "Video", src: u };
}

/* Thumbnail priority: explicit thumbnail > YouTube auto thumbnail > first gallery image */
export function thumbOf(project) {
  if (project.thumbnail) return resolvePath(project.thumbnail);
  const video = parseVideo(project.videoUrl);
  if (video && video.thumb) return video.thumb;
  if (Array.isArray(project.gallery) && project.gallery.length) return resolvePath(project.gallery[0]);
  return "";
}

export function formatDate(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return new Intl.DateTimeFormat("en", { month: "short", year: "numeric" }).format(d);
}
