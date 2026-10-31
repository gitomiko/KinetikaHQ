const ICON_CDN = "https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/svg";

const DEFAULT_PORTAL_CONFIG = {
  shell: {
    pageTitle: "Kinetika HQ",
    description: "Kinetika HQ portal template for internal tool launch and navigation.",
    eyebrow: "KINETIKA CONTROL PLANE",
    title: "Kinetika HQ",
    lead: "Configurable launcher template for internal tools, apps, and service navigation.",
    locationPill: "Template Build",
    modePill: "Public-safe Demo",
    versionLabel: "Public Template 1.0",
  },
  routing: {
    privateSuffix: ".internal.example",
    publicSuffix: ".example.com",
  },
  groups: [
    {
      title: "Operations",
      note: "Example administrative surfaces for an internal team portal.",
      items: [
        {
          name: "Admin Console",
          description: "Example control surface for operational workflows.",
          href: "https://example.com/admin-console",
          mark: "AC",
          status: "live",
        },
        {
          name: "Identity",
          description: "Example entry point for authentication and access flows.",
          href: "https://example.com/identity",
          mark: "ID",
          status: "live",
        },
        {
          name: "Observability",
          description: "Example metrics and status dashboard.",
          href: "https://example.com/observability",
          mark: "OB",
          status: "live",
        },
      ],
    },
    {
      title: "Workspace",
      note: "Example productivity and collaboration destinations.",
      items: [
        {
          name: "Files",
          description: "Example document and file workspace.",
          href: "https://example.com/files",
          mark: "FL",
          status: "live",
        },
        {
          name: "Photos",
          description: "Example media gallery destination.",
          href: "https://example.com/photos",
          mark: "PH",
          status: "live",
        },
        {
          name: "Requests",
          description: "Example service request surface.",
          href: "https://example.com/requests",
          mark: "RQ",
          status: "live",
        },
      ],
    },
    {
      title: "Automation",
      note: "Example queueing, jobs, and process lanes.",
      items: [
        {
          name: "Automations",
          description: "Example workflow and job launcher.",
          href: "https://example.com/automations",
          mark: "AU",
          status: "live",
        },
        {
          name: "Scheduled Jobs",
          description: "Example scheduled background process lane.",
          href: "https://example.com/jobs",
          mark: "JB",
          status: "live",
        },
        {
          name: "Upcoming Service",
          description: "Placeholder card showing the planned state.",
          mark: "SO",
          status: "soon",
        },
      ],
    },
  ],
};

let appGroups = DEFAULT_PORTAL_CONFIG.groups;
let PRIVATE_SUFFIX = DEFAULT_PORTAL_CONFIG.routing.privateSuffix;
let PUBLIC_SUFFIX = DEFAULT_PORTAL_CONFIG.routing.publicSuffix;

const navList = document.getElementById("navList");
const tilesHost = document.getElementById("tiles");
const panelEyebrow = document.getElementById("panelEyebrow");
const panelTitle = document.getElementById("panelTitle");
const panelNote = document.getElementById("panelNote");
const topBrand = document.getElementById("topBrand");
const searchInput = document.getElementById("searchInput");
const clock = document.getElementById("clock");
const themeToggle = document.getElementById("themeToggle");
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");
const eyebrowText = document.getElementById("eyebrowText");
const titleText = document.getElementById("titleText");
const modePill = document.getElementById("modePill");
const footerVersion = document.getElementById("footerVersion");
const liveCount = document.getElementById("liveCount");
const hostLabel = document.getElementById("hostLabel");
const datePill = document.getElementById("datePill");
const sidebarOverviewTitle = document.getElementById("sidebarOverviewTitle");
const descriptionMeta = document.querySelector('meta[name="description"]');

let highlightGroup = null; // group title being highlighted, or null = portal (all)
let searchQuery = "";

function slugify(str) {
  return (str || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function setHighlight(groupTitle) {
  highlightGroup = groupTitle;
  const slug = groupTitle ? slugify(groupTitle) : null;

  const foldersEl = tilesHost && tilesHost.querySelector(".folders");
  if (foldersEl) {
    foldersEl.classList.toggle("is-highlighting", Boolean(slug));
    foldersEl.querySelectorAll(".folder[data-group]").forEach((folder) => {
      folder.classList.toggle("folder-highlight", folder.dataset.group === slug);
    });
  }

  if (navList) {
    navList.querySelectorAll(".nav-item").forEach((btn) => {
      const isPortal = btn.dataset.portal === "true";
      const isMatch = !isPortal && btn.dataset.group === slug;
      btn.setAttribute("aria-selected", (slug ? isMatch : isPortal) ? "true" : "false");
    });
  }

  if (topBrand) {
    topBrand.textContent = groupTitle
      ? `kinetika hq · ${safeText(groupTitle).toLowerCase()}`
      : "kinetika hq · portal";
  }
  if (sidebarOverviewTitle) {
    sidebarOverviewTitle.textContent = groupTitle
      ? safeText(groupTitle)
      : "System Overview";
  }
}
const THEME_STORAGE_KEY = "kinetika-hq-theme";
const darkMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

function systemTheme() {
  return darkMediaQuery.matches ? "dark" : "light";
}

function loadTheme() {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "dark" || stored === "light") return stored;
  return systemTheme();
}

function updateThemeToggle(theme) {
  if (!themeToggle) return;
  const nextTheme = theme === "dark" ? "light" : "dark";
  themeToggle.textContent = `// ${theme}`;
  themeToggle.setAttribute("aria-label", `Switch to ${nextTheme} mode`);
  themeToggle.title = `Switch to ${nextTheme} mode`;
}

function applyTheme(theme) {
  const normalized = theme === "dark" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", normalized);
  updateThemeToggle(normalized);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  localStorage.setItem(THEME_STORAGE_KEY, next);
  applyTheme(next);
}

function formatNow() {
  const now = new Date();
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(now);
}

function formatDate() {
  const now = new Date();
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(now);
}

async function canReach(url, timeoutMs = 1400) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    await fetch(url, {
      method: "GET",
      mode: "no-cors",
      cache: "no-store",
      signal: controller.signal,
    });
    return true;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

function toPublicHref(url) {
  if (!url) return "";
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.endsWith(PRIVATE_SUFFIX)) return "";
    const prefix = parsed.hostname.slice(0, -PRIVATE_SUFFIX.length);
    parsed.hostname = `${prefix}${PUBLIC_SUFFIX}`;
    return parsed.toString();
  } catch {
    return "";
  }
}

function isIpv4Host(hostname) {
  return /^(?:\d{1,3}\.){3}\d{1,3}$/.test(hostname);
}

function resolvePortFromUrl(url, allowDefaultForDirectIp = false) {
  if (!url) return "";
  try {
    const parsed = new URL(url);
    if (parsed.port) return parsed.port;
    if (!allowDefaultForDirectIp || !isIpv4Host(parsed.hostname)) return "";
    if (parsed.protocol === "http:") return "80";
    if (parsed.protocol === "https:") return "443";
    return "";
  } catch {
    return "";
  }
}

function resolveNodePort(item) {
  const candidates = [item.fallbackHref, item.homeHref, item.href, item.publicHref];

  for (const candidate of candidates) {
    const port = resolvePortFromUrl(candidate);
    if (port) return port;
  }

  for (const candidate of candidates) {
    const port = resolvePortFromUrl(candidate, true);
    if (port) return port;
  }

  return "";
}

function resolveTargets(item) {
  const privatePreferred =
    typeof window !== "undefined" &&
    PRIVATE_SUFFIX &&
    window.location.hostname.endsWith(PRIVATE_SUFFIX);
  const homeHref = item.homeHref || item.href || "";
  const publicHref = item.publicHref || toPublicHref(homeHref);
  const targets = [];

  if (privatePreferred) {
    if (homeHref) targets.push(homeHref);
    if (publicHref && !targets.includes(publicHref)) targets.push(publicHref);
  } else {
    if (publicHref) targets.push(publicHref);
    if (homeHref && !targets.includes(homeHref)) targets.push(homeHref);
  }

  if (privatePreferred && item.fallbackHref && !targets.includes(item.fallbackHref)) {
    targets.push(item.fallbackHref);
  }

  return targets;
}

async function pickHref(item) {
  const targets = resolveTargets(item);
  if (targets.length === 0) return "";
  if (targets.length === 1) return targets[0];

  for (const candidate of targets) {
    if (await canReach(candidate, 3000)) return candidate;
  }

  return targets[0];
}

const INFRA_LEAK_RE = /\bnode\s*\d+\b|\b\d{1,3}(?:\.\d{1,3}){3}(?::\d+)?\b/gi;

function safeText(text) {
  if (typeof text !== "string") return text;
  return text
    .replace(INFRA_LEAK_RE, "")
    .replace(/\s{2,}/g, " ")
    .replace(/^[\s\-–—,.:]+/, "")
    .trim();
}

function resolveDisplayDomain(item) {
  const candidates = [item.publicHref, item.href, item.homeHref];
  for (const url of candidates) {
    if (!url) continue;
    try {
      const { hostname } = new URL(url);
      if (!isIpv4Host(hostname)) return hostname;
    } catch { /* skip */ }
  }
  return "";
}

function makeRow(item) {
  const live = item.status === "live";
  const row = document.createElement(live ? "a" : "div");
  row.className = `folder-row${live ? "" : " row-disabled"}`;

  if (live) {
    const targets = resolveTargets(item);
    const defaultHref = targets[0] || item.href || "#";
    row.href = defaultHref;
    row.target = "_blank";
    row.rel = "noopener noreferrer";

    row.addEventListener("click", (event) => {
      event.preventDefault();
      const popup = window.open("about:blank", "_blank");
      if (popup) popup.opener = null;
      pickHref(item).then((target) => {
        const finalTarget = target || defaultHref;
        if (popup && !popup.closed) {
          popup.location.replace(finalTarget);
          return;
        }
        window.open(finalTarget, "_blank", "noopener,noreferrer");
      });
    });
  }

  const dotClass = live ? "dot-live" : "dot-soon";
  const statusClass = live ? "row-status-live" : "row-status-soon";
  const statusText = live ? "live" : "soon";

  // Icon or text mark fallback
  const iconEl = document.createElement(item.logo ? "img" : "span");
  if (item.logo) {
    iconEl.className = "row-icon";
    iconEl.src = item.logo;
    iconEl.alt = "";
    iconEl.loading = "lazy";
    iconEl.referrerPolicy = "no-referrer";
    iconEl.addEventListener("error", () => {
      const mark = document.createElement("span");
      mark.className = "row-mark";
      mark.textContent = item.mark || "";
      iconEl.replaceWith(mark);
    }, { once: true });
  } else {
    iconEl.className = "row-mark";
    iconEl.textContent = item.mark || "";
  }

  const nameEl = document.createElement("span");
  nameEl.className = "row-name";
  nameEl.textContent = safeText(item.name);

  const domain = resolveDisplayDomain(item);
  const domainEl = document.createElement("span");
  domainEl.className = "row-domain";
  domainEl.textContent = domain;

  const descEl = document.createElement("span");
  descEl.className = "row-desc";
  descEl.textContent = safeText(item.description);

  const statusEl = document.createElement("span");
  statusEl.className = `row-status ${statusClass}`;
  statusEl.innerHTML = `<i class="dot ${dotClass}"></i>${statusText}`;

  row.append(iconEl, nameEl, descEl, domainEl, statusEl);
  return row;
}

function makeFolder(group) {
  const folder = document.createElement("details");
  folder.className = "folder";
  folder.dataset.group = slugify(group.title);
  folder.open = true;

  const summary = document.createElement("summary");
  summary.className = "folder-head";
  summary.innerHTML = `<span class="folder-arrow">▸</span><span>${safeText(group.title)}</span><span class="folder-count">${group.items.length}</span>`;

  const body = document.createElement("div");
  body.className = "folder-body";
  group.items.forEach((item) => body.appendChild(makeRow(item)));

  folder.appendChild(summary);
  folder.appendChild(body);
  return folder;
}

function itemMatches(item, group, keyword) {
  if (!keyword) return true;
  return [
    safeText(item.name),
    safeText(item.description),
    safeText(group.title),
    item.status,
  ]
    .join(" ")
    .toLowerCase()
    .includes(keyword);
}

function renderSidebar() {
  if (!navList) return;
  navList.innerHTML = "";

  // Portal — synthetic "show all, no highlight" item
  const portalLi = document.createElement("li");
  const portalBtn = document.createElement("button");
  portalBtn.type = "button";
  portalBtn.className = "nav-item";
  portalBtn.setAttribute("role", "tab");
  portalBtn.setAttribute("aria-selected", !highlightGroup ? "true" : "false");
  portalBtn.dataset.portal = "true";

  const portalLabel = document.createElement("span");
  portalLabel.textContent = "Portal";
  const portalCount = document.createElement("span");
  portalCount.className = "nav-count";
  portalCount.textContent = String(appGroups.reduce((n, g) => n + g.items.length, 0));

  portalBtn.appendChild(portalLabel);
  portalBtn.appendChild(portalCount);
  portalBtn.addEventListener("mouseenter", () => setHighlight(null));
  portalBtn.addEventListener("click", () => {
    setHighlight(null);
    toggleMenu(false);
  });
  portalLi.appendChild(portalBtn);
  navList.appendChild(portalLi);

  // Group items
  appGroups.forEach((group) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "nav-item";
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-selected", highlightGroup === group.title ? "true" : "false");
    btn.dataset.group = slugify(group.title);

    const label = document.createElement("span");
    label.textContent = safeText(group.title) || "—";
    const count = document.createElement("span");
    count.className = "nav-count";
    count.textContent = String(group.items.length);

    btn.appendChild(label);
    btn.appendChild(count);
    btn.addEventListener("mouseenter", () => setHighlight(group.title));
    btn.addEventListener("click", () => {
      setHighlight(group.title);
      toggleMenu(false);
    });
    li.appendChild(btn);
    navList.appendChild(li);
  });
}

function renderPanel() {
  if (!tilesHost) return;
  tilesHost.innerHTML = "";
  const keyword = searchQuery.trim().toLowerCase();

  if (keyword) {
    // Search: filtered folders, only showing matched rows
    if (panelEyebrow) panelEyebrow.textContent = "RESULTS";
    if (panelTitle) panelTitle.textContent = `Search: ${keyword}`;

    const foldersEl = document.createElement("div");
    foldersEl.className = "folders";

    let totalMatches = 0;
    let sectionsHit = 0;

    appGroups.forEach((group) => {
      const hits = group.items.filter((item) => itemMatches(item, group, keyword));
      if (hits.length === 0) return;
      sectionsHit += 1;
      totalMatches += hits.length;

      const pseudoGroup = { ...group, items: hits };
      foldersEl.appendChild(makeFolder(pseudoGroup));
    });

    if (panelNote) {
      panelNote.textContent = totalMatches
        ? `${totalMatches} match${totalMatches === 1 ? "" : "es"} across ${sectionsHit} section${sectionsHit === 1 ? "" : "s"}.`
        : "";
    }

    if (totalMatches === 0) {
      const empty = document.createElement("div");
      empty.className = "empty";
      empty.textContent = "no results.";
      tilesHost.appendChild(empty);
    } else {
      tilesHost.appendChild(foldersEl);
    }
    return;
  }

  // Portal: all groups as folders, highlight driven by sidebar hover
  if (panelEyebrow) panelEyebrow.textContent = "PORTAL";
  if (panelTitle) panelTitle.textContent = "System Overview";
  if (panelNote) panelNote.textContent = "Hover a section to highlight its services.";

  const foldersEl = document.createElement("div");
  foldersEl.className = "folders";
  appGroups.forEach((group) => foldersEl.appendChild(makeFolder(group)));
  tilesHost.appendChild(foldersEl);

  // Re-apply any active highlight after re-render
  setHighlight(highlightGroup);
}

function updateLiveCount() {
  if (!liveCount) return;
  const total = appGroups.reduce(
    (sum, g) => sum + g.items.filter((it) => it.status === "live").length,
    0,
  );
  liveCount.textContent = String(total);
}

function tickClock() {
  if (clock) clock.textContent = formatNow();
  if (datePill) datePill.textContent = formatDate();
}

function applyShell(shell) {
  document.title = shell.pageTitle || DEFAULT_PORTAL_CONFIG.shell.pageTitle;
  if (descriptionMeta) {
    descriptionMeta.setAttribute(
      "content",
      shell.description || DEFAULT_PORTAL_CONFIG.shell.description,
    );
  }
  if (eyebrowText) eyebrowText.textContent = safeText(shell.eyebrow);
  if (titleText) titleText.textContent = safeText(shell.title);
  if (modePill) {
    const clean = safeText(shell.modePill);
    modePill.textContent = clean;
    modePill.hidden = !clean;
  }
  if (footerVersion) footerVersion.textContent = safeText(shell.versionLabel);
  if (hostLabel && typeof window !== "undefined") {
    hostLabel.textContent = window.location.hostname;
  }
}

function normalizeConfig(override) {
  const config = override && typeof override === "object" ? override : {};
  const shell = { ...DEFAULT_PORTAL_CONFIG.shell, ...(config.shell || {}) };
  const routing = { ...DEFAULT_PORTAL_CONFIG.routing, ...(config.routing || {}) };
  const groups =
    Array.isArray(config.groups) && config.groups.length > 0
      ? config.groups
      : DEFAULT_PORTAL_CONFIG.groups;

  return { shell, routing, groups };
}

function loadLocalConfig() {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "config.local.js?v=" + Date.now();
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => resolve();
    document.head.appendChild(script);
  });
}

searchInput.addEventListener("input", (event) => {
  searchQuery = event.target.value || "";
  renderSidebar();
  renderPanel();
});

document.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();
  if ((event.ctrlKey || event.metaKey) && key === "k") {
    event.preventDefault();
    searchInput.focus();
    searchInput.select();
  }
});

if (themeToggle) {
  themeToggle.addEventListener("click", toggleTheme);
}

function toggleMenu(force) {
  if (!menuToggle || !sidebar) return;
  const expanded = typeof force === "boolean" ? force : menuToggle.getAttribute("aria-expanded") !== "true";
  menuToggle.setAttribute("aria-expanded", String(expanded));
  sidebar.classList.toggle("menu-open", expanded);
}

if (menuToggle) {
  menuToggle.addEventListener("click", () => toggleMenu());
}

// Close mobile menu on Escape or when clicking outside
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") toggleMenu(false);
});

document.addEventListener("click", (event) => {
  if (!sidebar || !menuToggle) return;
  const isInsideSidebar = sidebar.contains(event.target);
  const isMenuToggle = menuToggle.contains(event.target);
  if (!isInsideSidebar && !isMenuToggle) {
    toggleMenu(false);
  }
});

const handleSystemThemeChange = () => {
  if (localStorage.getItem(THEME_STORAGE_KEY)) return;
  applyTheme(systemTheme());
};

darkMediaQuery.addEventListener("change", handleSystemThemeChange);

async function bootstrap() {
  await loadLocalConfig();

  const config = normalizeConfig(window.KINETIKA_HQ_CONFIG);
  appGroups = config.groups;
  PRIVATE_SUFFIX = config.routing.privateSuffix;
  PUBLIC_SUFFIX = config.routing.publicSuffix;

  applyShell(config.shell);
  applyTheme(loadTheme());
  updateLiveCount();
  renderSidebar();
  renderPanel();

  // Single mouseleave on the sidebar to reset highlight when cursor leaves the nav
  const sidebar = document.querySelector(".sidebar");
  if (sidebar) sidebar.addEventListener("mouseleave", () => setHighlight(null));

  tickClock();
  setInterval(tickClock, 1000);
}

bootstrap();
