/**
 * KINETIKA — site.js
 * Theme toggle (honors OS preference, remembers choice) + mobile nav.
 * No framework, no dependencies.
 */
(function () {
  "use strict";

  var STORAGE_KEY = "kinetika-theme";
  var root = document.documentElement;

  // --- Theme: apply saved choice early; otherwise follow OS preference ---
  function systemTheme() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }
  function currentTheme() {
    return root.getAttribute("data-theme") || systemTheme();
  }
  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    var btn = document.querySelector(".theme-toggle");
    if (btn) {
      btn.textContent = theme === "light" ? "☾" : "☀";
      btn.setAttribute("aria-label", "Switch to " + (theme === "light" ? "dark" : "light") + " theme");
    }
  }

  var saved = null;
  try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) {}
  // Dark is the default; a saved choice still wins, OS preference is ignored.
  applyTheme(saved || "dark");

  document.addEventListener("click", function (e) {
    var toggle = e.target.closest(".theme-toggle");
    if (toggle) {
      var next = currentTheme() === "light" ? "dark" : "light";
      applyTheme(next);
      try { localStorage.setItem(STORAGE_KEY, next); } catch (e2) {}
      return;
    }
    var burger = e.target.closest(".nav-toggle");
    if (burger) {
      var nav = document.querySelector(".nav");
      if (nav) {
        var open = nav.getAttribute("data-open") === "true";
        nav.setAttribute("data-open", open ? "false" : "true");
        burger.setAttribute("aria-expanded", String(!open));
      }
    }
  });

  // Mark current nav item
  var here = location.pathname.replace(/\/index\.html$/, "/").replace(/\/$/, "") || "/";
  document.querySelectorAll(".nav a[href]").forEach(function (a) {
    var path = a.getAttribute("href").replace(/^\.+/, "").replace(/\/index\.html$/, "/").replace(/\/$/, "") || "/";
    if (path !== "/" && here.indexOf(path) === 0) a.setAttribute("aria-current", "page");
    if (path === "/" && here === "/") a.setAttribute("aria-current", "page");
  });

  // Footer year
  var y = document.querySelector("[data-year]");
  if (y) y.textContent = new Date().getFullYear();

  // --- Project filter chips ---
  var fgroup = document.querySelector("[data-filter-group]");
  if (fgroup) {
    fgroup.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-filter]");
      if (!b) return;
      var f = b.getAttribute("data-filter");
      fgroup.querySelectorAll("button").forEach(function (btn) {
        btn.setAttribute("aria-pressed", String(btn === b));
      });
      document.querySelectorAll(".proj-card").forEach(function (card) {
        var match = f === "all" || card.getAttribute("data-cat") === f;
        if (match) card.removeAttribute("hidden"); else card.setAttribute("hidden", "");
      });
    });
  }

  // --- Hero role toggles (visual only) ---
  document.querySelectorAll('.role-toggles [role="tab"]').forEach(function (tab) {
    tab.addEventListener("click", function () {
      document.querySelectorAll('.role-toggles [role="tab"]').forEach(function (t) {
        t.setAttribute("aria-selected", String(t === tab));
      });
    });
  });

  // --- Contact form → mailto (static-site friendly, no backend) ---
  var form = document.querySelector(".contact-form[data-mailto]");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var to = form.getAttribute("data-mailto");
      var name = (form.querySelector("#cf-name") || {}).value || "";
      var email = (form.querySelector("#cf-email") || {}).value || "";
      var msg = (form.querySelector("#cf-msg") || {}).value || "";
      var subject = encodeURIComponent("Kinetika — message from " + (name || "the site"));
      var body = encodeURIComponent(msg + "\n\n— " + name + " <" + email + ">");
      window.location.href = "mailto:" + to + "?subject=" + subject + "&body=" + body;
    });
  }
})();
