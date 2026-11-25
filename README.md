# AIO — Independent Creative Studio

Portfolio website of **Om Raval** — visual storytelling, video editing, motion graphics and digital creativity.

Plain HTML, CSS and JavaScript. No build step, no dependencies. Works on GitHub Pages.

---

## Folder structure

```
AIO/
├── index.html              The page
├── css/                    base.css · sections.css · projects.css
├── js/
│   ├── config.js           ← Edit site text: services, tools, socials, categories
│   ├── main.js             Entry point + project-view routing
│   ├── projects.js         Gallery, filters, featured, project pages
│   ├── media.js            Video/image link helpers
│   ├── ui.js               Nav, animations, static sections
│   └── contact.js          Inquiry form → WhatsApp
├── data/
│   ├── projects.json       ← Your projects live here
│   └── projects.example.json   Template to copy from (not loaded by the site)
├── assets/
│   ├── images/             Small site images (portrait etc.)
│   ├── videos/             Only tiny clips, if ever
│   ├── thumbnails/         Project thumbnails
│   └── icons/              Favicon and icons
└── projects/               Optional per-project local media, by category
    ├── motion-graphics/
    ├── video-editing/
    ├── photography/
    ├── graphic-design/
    ├── ai-experiments/
    └── client-projects/
```

---

## Adding a project

1. **Host the big media somewhere else** (see below). Do not put large videos or originals in this repository.
2. **Open `data/projects.json`** and add an object inside the `"projects"` array. Copy the template from `data/projects.example.json`.
3. **Commit and push.** The website shows the project automatically: on its category filter, in the gallery, and on its own project page (`#/project/<id>`). Set `"featured": true` to also show it in the **Selected work** section on the homepage.

Example (replace every value with your real details):

```json
{
  "projects": [
    {
      "id": "my-first-reel",
      "title": "My First Reel",
      "category": "video-editing",
      "shortDescription": "One sentence for the card.",
      "fullDescription": "The full story.\n\nBlank line = new paragraph.",
      "thumbnail": "https://example.com/thumb.jpg",
      "gallery": ["https://example.com/frame-1.jpg"],
      "videoUrl": "https://www.youtube.com/watch?v=XXXXXXXXXXX",
      "tools": ["Adobe Premiere Pro", "DaVinci Resolve"],
      "date": "2026-01-15",
      "featured": true,
      "clientProject": false
    }
  ]
}
```

Separate projects with commas. If the site shows nothing after an edit, check the file is valid JSON (jsonlint.com).

### Field reference

| Field | Required | Notes |
|---|---|---|
| `id` | yes | Short unique slug, lowercase, no spaces (`my-first-reel`). Used in the project link. |
| `title` | yes | Project title. |
| `category` | yes | One of: `motion-graphics`, `video-editing`, `photography`, `graphic-design`, `ai-experiments`, `client-projects` |
| `shortDescription` | no | Shown on the card. |
| `fullDescription` | no | Shown on the project page. Use `\n\n` for new paragraphs. |
| `thumbnail` | no | Image URL or path in this repo. If empty, a YouTube link supplies one automatically, otherwise the first gallery image, otherwise a typographic placeholder. |
| `gallery` | no | List of image URLs or paths. |
| `videoUrl` | no | YouTube, Vimeo, Google Drive link, or a direct `.mp4` / `.webm` link. YouTube, Vimeo and Drive play embedded; a direct file plays in a native player; any other link becomes a "Watch video" button. |
| `tools` | no | List of software used, e.g. `["Adobe Photoshop"]`. |
| `date` | no | `YYYY-MM-DD`. Newest projects appear first. |
| `featured` | no | `true` shows it on the homepage (first 3 featured projects). |
| `clientProject` | no | `true` adds a "Client" badge and a privacy note. |

Paths without `http` (for example `projects/video-editing/my-first-reel/thumb.webp`) are relative to the site root.

---

## Large media: keep the repository light

Original project files are big, so host them outside GitHub and paste the links:

- **Video:** upload to **YouTube** (set to *Unlisted* if you do not want it searchable) or **Vimeo**, then paste the link into `videoUrl`. Google Drive also works: set sharing to *Anyone with the link*.
- **Images:** small web versions (about 1600 px wide, `.webp` or `.jpg`, under 400 KB) can live in `projects/<category>/<project-id>/`. Anything bigger should be hosted externally and linked by URL.
- **Thumbnails:** 1600 × 1000 or 1200 × 1500 works well. Put small ones in `assets/thumbnails/` or the project's folder.

**Privacy:** this repository and website are public. Never commit original client files. Keep unblurred or unapproved originals private (your own drive) and publish only versions the client has approved. Mark those projects `"clientProject": true`.

---

## Editing other content

- Services, tools, social links, email, WhatsApp number, category names → `js/config.js`
- Headline, about text, section copy → `index.html`
- Colors and fonts → the `:root` block at the top of `css/base.css`

---

## Preview locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

(Opening `index.html` by double-click will not load `projects.json`; a local server is needed.)

---

## Deploying

The live site is served by GitHub Pages from the `main` branch. Redesign work happens on the `aio-redesign-preview` branch and is only merged to `main` after approval.
