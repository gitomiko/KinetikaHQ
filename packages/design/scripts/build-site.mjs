/**
 * KINETIKA — build-site.mjs
 * Dependency-free static build. Renders editable content (content/*.json,
 * content/blog/*.md) into the hand-authored HTML in site/ via markers.
 *
 * Run: node scripts/build-site.mjs   (or: npm run build:site)
 *
 * Markers in HTML look like:
 *   <!-- build:KEY -->...generated...<!-- /build:KEY -->
 * Everything between the marker pair is replaced on each run (idempotent).
 *
 * Built by hand. Honest by default. No framework, no lock-in.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = join(ROOT, "site");
const CONTENT = join(ROOT, "content");

const read = (p) => readFileSync(p, "utf8");
const readJSON = (p) => JSON.parse(read(p));

/* ---------- helpers ---------- */
function inject(html, key, content) {
  const re = new RegExp(`(<!--\\s*build:${key}\\s*-->)([\\s\\S]*?)(<!--\\s*/build:${key}\\s*-->)`);
  if (!re.test(html)) { console.warn(`  ! marker "${key}" not found`); return html; }
  return html.replace(re, `$1\n${content}\n    $3`);
}
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* ---------- minimal markdown (trusted, authored content) ---------- */
function inline(s) {
  return s
    .replace(/`([^`]+)`/g, (_, c) => `<code>${esc(c)}</code>`)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}
function markdown(md) {
  const lines = md.split("\n");
  let html = "", para = [], list = [];
  const flushP = () => { if (para.length) { html += `<p>${inline(para.join(" "))}</p>\n`; para = []; } };
  const flushL = () => { if (list.length) { html += `<ul>${list.map((i) => `<li>${inline(i)}</li>`).join("")}</ul>\n`; list = []; } };
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) { flushP(); flushL(); continue; }
    let m;
    if ((m = line.match(/^(#{1,4})\s+(.*)$/))) { flushP(); flushL(); const n = m[1].length; html += `<h${n}>${inline(m[2])}</h${n}>\n`; }
    else if ((m = line.match(/^>\s?(.*)$/))) { flushP(); flushL(); html += `<blockquote>${inline(m[1])}</blockquote>\n`; }
    else if ((m = line.match(/^[-*]\s+(.*)$/))) { flushP(); list.push(m[1]); }
    else { flushL(); para.push(line); }
  }
  flushP(); flushL();
  return html.trim();
}
function frontmatter(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { data: {}, body: src };
  const data = {};
  for (const line of m[1].split("\n")) {
    const i = line.indexOf(":");
    if (i > 0) data[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return { data, body: m[2] };
}

/* ---------- shared shell (header/footer) for generated blog posts ---------- */
const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Syne:wght@400;500;700;800&family=DM+Mono:wght@300;400;500&display=swap">`;
const HEADER = `<header class="site-header">
    <div class="wrap">
      <a class="brand" href="/"><span class="mark" aria-hidden="true"></span> Kinetika</a>
      <button class="nav-toggle" aria-label="Menu" aria-expanded="false" aria-controls="nav">≡</button>
      <nav class="nav" id="nav" aria-label="Primary">
        <a href="/#about">About</a>
        <a href="/#projects">Projects</a>
        <a href="/docs/">Design System</a>
        <a href="/blog/">Blog</a>
        <button class="theme-toggle" aria-label="Switch theme">☀</button>
      </nav>
    </div>
  </header>`;
const FOOTER = `<footer class="site-footer">
    <div class="wrap">
      <div class="cols">
        <div><a class="footer-lockup" href="/" aria-label="Kinetika home"><span class="footer-symbol" aria-hidden="true"></span><span class="footer-wordmark" aria-hidden="true"></span></a><p class="meta" style="margin-top: var(--space-4)">Built by hand. Honest by default.</p></div>
        <div><h4>Explore</h4><a href="/#projects">Projects</a><a href="/docs/">Design System</a><a href="/blog/">Blog</a></div>
        <div><h4>Build</h4><a href="https://github.com/gitomiko/KinetikaOS">KinetikaOS</a><a href="https://github.com/gitomiko">GitHub</a></div>
      </div>
      <p class="colophon">© <span data-year>2026</span> Wak Gito · Kinetika. Design system released CC0. Self-hosted, hand-built.</p>
    </div>
  </footer>`;
const page = (title, desc, body) => `<!doctype html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)} — Kinetika</title>
  <meta name="description" content="${esc(desc)}">
  <meta name="color-scheme" content="light dark">
  ${FONTS}
  <link rel="stylesheet" href="/assets/tokens.css">
  <link rel="stylesheet" href="/assets/site.css">
  <link rel="stylesheet" href="/assets/brand.css">
  <script src="/assets/site.js" defer></script>
</head>
<body>
  ${HEADER}
  <main>
${body}
  </main>
  ${FOOTER}
</body>
</html>
`;

/* ---------- render fragments ---------- */
function projectCard(p) {
  const ext = p.ext ? `\n              <span class="ext">${esc(p.ext)}</span>` : "";
  return `          <a class="proj-card" data-cat="${esc(p.category)}" href="${esc(p.href)}">
            <div class="proj-cover ${esc(p.cover)}"><span class="glyph">${p.glyph}</span></div>
            <div class="proj-body">
              <div class="topline"><span>${esc(p.categoryLabel)}</span><span><span class="dot dot--${esc(p.statusDot)}"></span>${esc(p.status)}</span></div>
              <h3>${esc(p.title)}</h3>
              <p class="desc">${esc(p.desc)}</p>
              <div class="tags">${p.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>${ext}
            </div>
          </a>`;
}
function portfolioCard(p) {
  const idAttr = p.anchor ? ` id="${esc(p.anchor)}"` : "";
  const docLink = p.href === "/docs/" ? ' <a href="/docs/">See the docs →</a>' : "";
  return `          <article class="card"${idAttr}>
            <p class="meta"><span class="dot dot--${esc(p.statusDot)}"></span>${esc(p.status)}</p>
            <h3>${esc(p.title)}</h3>
            <p>${esc(p.longDesc)}${docLink}</p>
            <p class="meta">${esc(p.stackLine)}</p>
          </article>`;
}

/* ---------- build ---------- */
const site = readJSON(join(CONTENT, "site.json"));
const { projects } = readJSON(join(CONTENT, "projects.json"));
console.log(`Kinetika site build — ${projects.length} projects`);

/* index.html */
let index = read(join(SITE, "index.html"));
const heroLines = site.hero.name.split(/[.\n]+/).map((part) => part.trim()).filter(Boolean)
  .map((part) => `${esc(part)}.`).join("<br>");
index = inject(index, "hero", `        <div class="hero-main">
          <span class="chip"><span class="dot dot--live" aria-hidden="true"></span>${esc(site.hero.chip)}</span>
          <div class="hero-symbol"><img src="/assets/kinetika-logo.png" alt="Kinetika symbol" width="1254" height="1254" fetchpriority="high"></div>
          <h1 class="name">${heroLines}<span class="hero-caret" aria-hidden="true"></span></h1>
          <div class="hero-wordmark"><img src="/assets/kinetika-logo.png" alt="Kinetika" width="1254" height="1254"></div>
          <p class="headline"><span class="accent">${esc(site.hero.headlineAccent)}</span> <span class="plain">${esc(site.hero.headlinePlain)}</span></p>
        </div>`);
index = inject(index, "exploring", `          <span class="lbl">Currently exploring</span>
          ${site.exploring.map((t) => `<span class="tag">${esc(t)}</span>`).join("\n          ")}`);
index = inject(index, "projects", projects.map(projectCard).join("\n"));
index = inject(index, "contact-links", `              <a href="mailto:${esc(site.contact.email)}">${esc(site.contact.email)}</a>
              <a href="${esc(site.contact.github)}">GitHub ↗</a>
              <a href="${esc(site.contact.twitter)}">Twitter / X ↗</a>
              <span class="meta">📍 ${esc(site.contact.location)}</span>`);
writeFileSync(join(SITE, "index.html"), index);
console.log("  ✓ site/index.html");

/* portfolio/index.html */
let portfolio = read(join(SITE, "portfolio", "index.html"));
portfolio = inject(portfolio, "portfolio", projects.map(portfolioCard).join("\n\n"));
writeFileSync(join(SITE, "portfolio", "index.html"), portfolio);
console.log("  ✓ site/portfolio/index.html");

/* blog */
const blogDir = join(CONTENT, "blog");
const posts = readdirSync(blogDir).filter((f) => f.endsWith(".md")).map((f) => {
  const { data, body } = frontmatter(read(join(blogDir, f)));
  return { slug: f.replace(/\.md$/, ""), data, body, draft: String(data.draft) === "true" };
}).filter((p) => !p.draft).sort((a, b) => (a.data.date < b.data.date ? 1 : -1));

const postItems = posts.map((p) => `          <li>
            <p class="meta">${esc(p.data.date)} · ${esc(p.data.category || "Notes")}</p>
            <h3><a href="/blog/${esc(p.slug)}.html">${esc(p.data.title)}</a></h3>
            <p style="color: var(--color-text-secondary)">${esc(p.data.summary || "")}</p>
          </li>`).join("\n");
let blogIndex = read(join(SITE, "blog", "index.html"));
blogIndex = inject(blogIndex, "posts", postItems);
writeFileSync(join(SITE, "blog", "index.html"), blogIndex);
console.log(`  ✓ site/blog/index.html (${posts.length} posts)`);

for (const p of posts) {
  const body = `    <div class="page-head">
      <div class="wrap wrap--narrow">
        <p class="eyebrow">${esc(p.data.category || "Notes")} · ${esc(p.data.date)}</p>
        <h1>${esc(p.data.title)}</h1>
      </div>
    </div>
    <article class="section">
      <div class="wrap wrap--narrow article">
${markdown(p.body).split("\n").map((l) => "        " + l).join("\n")}
        <p style="margin-top: var(--space-10)"><a class="btn btn-ghost" href="/blog/">← Back to the blog</a></p>
      </div>
    </article>`;
  writeFileSync(join(SITE, "blog", `${p.slug}.html`), page(p.data.title, p.data.summary || p.data.title, body));
  console.log(`  ✓ site/blog/${p.slug}.html`);
}

console.log("Done.");
