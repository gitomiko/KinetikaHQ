# Kinetika Design System — Roadmap to General Use

> *How to take ir0nm0nk from "my system" to "a system anyone can adopt."*

This is a recommendations document, not a spec. It outlines what the design system needs in order to be usable by people other than Wak Gito — without losing the oxidized, honest identity that makes it *Kinetika*.

The single most important idea: **split the brand layer from the system layer.** Today the palette (ir0nm0nk's patina/verdigris) and the system (semantic roles + components) are fused. To go general, keep the three-layer token architecture but make the *raw brand layer* swappable. Others adopt the **system**; ir0nm0nk stays the **default skin**.

```
System layer   →  semantic roles, components, a11y rules, motion   (the reusable part)
Brand layer    →  --raw-* palette, fonts, voice                    (the Kinetika skin)
```

---

## Where it stands today (honest audit)

**Strong:**
- `tokens.json` as a real source of truth (W3C Design Tokens format) — already AX-friendly and self-documenting.
- A WCAG AA contrast gate that *fails the build* — this is rare and genuinely good.
- Three clean token layers (raw → semantic → component) with theming via `data-theme`.
- A self-contained `preview.html` with a live contrast audit.

**Gaps for general use:**
- **Zero shippable components.** Claude Design's bundle reports "0 components" because the system is tokens + CSS only. There's nothing to `import` and reuse.
- **No package / distribution.** No `package.json`, no npm publish, no versioned artifact. Consumers would copy-paste `tokens.css`.
- **Single output format.** Only `tokens.css`. No JS/TS, SCSS, Tailwind preset, or Style-Dictionary-style multi-target export.
- **No contribution path.** CC0 license (good for sharing) but no `CONTRIBUTING`, no issue templates, no versioning policy, and CC0 doesn't cover the *brand/trademark* "Kinetika" / "ir0nm0nk".
- **Docs are a single HTML file.** `preview.html` is great as a sandbox but not a navigable docs site.
- **Brand and system are fused.** No documented way for someone to keep the system but use their own palette.

---

## Priority 1 — Make it installable and consumable

The fastest path from "personal" to "general" is letting someone run one install command.

1. **Add a `package.json`** at the design-system root (name: `kinetika` — already matches the Claude Design / `.design-sync` config; consider scoping to `@kinetika/tokens`, `@kinetika/css`, `@kinetika/elements`).
2. **Multi-target token build.** Extend `build-tokens.mjs` (or adopt [Style Dictionary](https://amzn.github.io/style-dictionary/)) to emit, from the *same* `tokens.json`:
   - `tokens.css` (done) — CSS custom properties
   - `tokens.js` / `tokens.ts` — typed JS object for app code and chart palettes
   - `tokens.scss` — for SCSS consumers
   - `tailwind.preset.js` — a Tailwind theme preset (huge adoption lever)
   - keep `tokens.json` as the canonical artifact for Figma / other tools
3. **Publish.** npm (public) and/or a GitHub Pages-hosted CSS you can `<link>`. Tag releases with semver.

## Priority 2 — Ship real components (React first, for agentic design)

This is what makes Claude Design (and everyone else) actually pick the system up — right now its bundle reports **0 components** because the system is tokens-only.

**Decision: build the component layer in React.** Claude Design's agentic-design workflow bundles a design system as a React component library (it exposes components on a `window.Kinetika` global so an agent can render and compose them). Web Components are more universally portable, but Claude Design is React-oriented, so React is the pragmatic choice for the agentic-experience goal.

**This does not couple the *whole* system to React.** The split keeps it general:

- `tokens.json` stays the framework-neutral source of truth (and is exported to CSS / JS / SCSS / Tailwind in Priority 1). Any framework can consume the tokens.
- The **React components** are one consumer of those tokens — the first, because of Claude Design.
- Later, a Web Components / other-framework layer can be added on top of the same tokens without redoing anything.

Build the core set, each binding every value to a token (no hardcoded colors), with all interactive states (hover/focus/active/disabled), keyboard behaviour, and ARIA:

- `Button` (primary / secondary / ghost, sizes, loading, disabled)
- `Badge` (patina / verdigris / azure / teal / amethyst / garnet / status variants)
- `Card` (default + active)
- `Input` / `Field` (uses `--input-border-color`, label, error state)
- `Nav` / `NavItem`
- `Toast`, `Modal` (later)

Practical setup: a `package.json` with React as a **peer dependency**, esbuild (already present in `.ds-sync`) or Vite for bundling, and a single entry that registers every component on `window.Kinetika`. The `figma-generate-library` skill + Figma MCP can then mirror the same components into a Figma library so design and code stay in sync.

## Priority 3 — A real docs site

Promote `preview.html` into a small static site (still vanilla, deployable to any static host — GitHub Pages, Netlify, etc.):

- **Foundations:** Philosophy · Color · Typography · Spacing · Motion · Elevation
- **Components:** one page each, with live examples, the variant grid, do/don't, and copy-paste snippets
- **Theming guide:** how to override the brand layer (the system/brand split above)
- **For agents:** an "agent contract" page + a machine-readable component manifest (keeps the AX promise; consider an `llms.txt`)
- Keep the live contrast audit — it's a differentiator, put it front and center

## Priority 4 — Governance for outside contributors

- `CONTRIBUTING.md` — how to add a token/component, the rule that **the build's contrast gate is the law**, conventional-commit style.
- **Dual-clarify licensing.** CC0 is fine (even generous) for the tokens, CSS, and docs. But add a short `BRAND.md` / `NOTICE` clarifying that the *names* "Kinetika" and "ir0nm0nk" and the logo are not part of the CC0 dedication — so people adopt the system without implying endorsement. (Many open design systems pair an MIT/CC0 code license with a separate brand-usage note.)
- `CHANGELOG.md` already lives in `design/README.md` — split it into its own file and keep semver.
- Issue / PR templates; a simple `examples/` folder showing the system used in a fresh project.

## Priority 5 — Harden and extend

- **Control sizes + `pointer:coarse`** tokens (touch targets ≥ 44px) — already on your list.
- **Breakpoints in `tokens.json`** + a JS export; fluid display sizes.
- **Visual regression tests** (Playwright screenshots, or Storybook + a snapshot tool) so component changes can't silently break.
- **Token schema validation** in CI (validate `tokens.json` against the W3C draft on every commit).
- **Self-host the three fonts** (all OFL) — removes the external request and makes the package fully offline/general.
- **Color-vision check** added to the build gate, alongside contrast.

---

## Suggested sequence

```
1. package.json + token JS/TS export (+ tailwind preset)           ← lets components import tokens; unlocks adoption
2. First 3 React components (Button, Badge, Card) on window.Kinetika ← Claude Design picks them up
3. Self-host fonts                                                 ← removes external dep
4. Docs site scaffold + theming/brand-split guide                 ← teaches general use
5. CONTRIBUTING + BRAND note + semver/CHANGELOG split             ← invites contributors
6. Remaining components, visual-regression tests, control sizes   ← hardening
```

## The one-line test for "general, not just personal"

Someone should be able to run `npm i kinetika`, drop in `tokens.css` (or the Tailwind preset), use `<Button>` from the React layer, and — if they want — override the `--raw-*` brand layer with their own palette while keeping every accessibility guarantee. The tokens stay framework-neutral, so a non-React consumer can still use the full token set today. When that works end-to-end, the system is general.
