# Kinetika Design System — ir0nm0nk

> *Iron that rusts. Copper that oxidizes. Honest by material.*

The visual identity of Kinetika. Codenamed `ir0nm0nk`, after the edge compute node that inspired it — a system that works without rest, leaving a mark from every use.

**Version 2.5.0**

---

## Token Architecture

```
tokens.json          ← source of truth (W3C Design Tokens format)
    │
    └── build-tokens.mjs     node design/build-tokens.mjs
            │                (build fails if any contrast is below WCAG AA)
            ├── tokens.css   ← GENERATED — do not edit by hand
            └── (planned)    JS/TS export, SCSS, Tailwind preset
```

`tokens.json` was chosen as the source of truth for two reasons:

1. **Multi-target.** CSS isn't a good input for other outputs (typed JS/TS, SCSS, a Tailwind preset); JSON is an input for all of them.
2. **AX.** Agents read JSON far more reliably than CSS. Every token has a `$description` — this palette is self-documenting for humans *and* agents.

Three token layers:

| Layer | Prefix | Example | Role |
|---|---|---|---|
| Raw | `--raw-*` | `--raw-patina` | Brand palette — literal hex values |
| Semantic | `--color-*` | `--color-accent-primary` | Roles, change per theme |
| Component | `--card-*`, `--btn-*`, etc. | `--card-bg` | Component recipes, reference semantic tokens |

Semantic tokens reference raw values via `var()` wherever a matching raw value exists; the neutral shades in between (e.g. `#E8E3DB` for elevated light) are intentional one-offs that only live in the semantic layer.

---

## Visual Principles

**Warm-dark, not cold-dark.**
The base color is slightly warm/brownish (`--raw-ember` `#1C1C1B`), not pure black. This is what makes the metallic gray feel more material, more *present*.

**Monochromatic + oxidation.**
The main palette is a gray scale — from Linen to Soot. Color is a sign of a physical process, not decoration.

**Three typographic voices.**
Each typeface has a distinct role and they don't overlap.

**Readable is honest.**
A system that claims to be *honest* can't have text that's unreadable. Every text role passes WCAG AA — and the build fails if any of them drops below it.

---

## Color Tokens

### Gray Scale (warm gray)

| Token | Hex | Usage |
|---|---|---|
| `--raw-linen` | `#F5F1EB` | Warm near-white — button text on accents (light) |
| `--raw-cloud-dancer` | `#EDE8E0` | Primary text (dark) |
| `--raw-pale-alloy` | `#C8C4BE` | Secondary text (dark) |
| `--raw-iron-mist` | `#8A8680` | Tertiary text (dark), disabled (light) |
| `--raw-graphite` | `#4A4A48` | Disabled text (dark) |
| `--raw-ash` | `#3A3A38` | Ghost text, strong border (dark) |
| `--raw-forge` | `#252523` | Border, overlay (dark) |
| `--raw-coal` | `#1E1E1C` | Elevated surface, subtle border (dark) |
| `--raw-ember` | `#1C1C1B` | Base bg (dark) |
| `--raw-void` | `#161615` | Surface — cards, sidebar (dark) |
| `--raw-soot` | `#111110` | Sunken — statusbar (dark) |

### Accents — Oxidized Metal

| Token | Hex | Usage |
|---|---|---|
| `--raw-patina` | `#8C6A3A` | Accent primary — border, large UI |
| `--raw-patina-bright` | `#C0905A` | Patina **as text** on dark bg |
| `--raw-verdigris` | `#5A7A6A` | Accent secondary — border, large UI |
| `--raw-verdigris-bright` | `#85AE99` | Verdigris **as text** on dark bg |
| `--raw-copper` | `#BE8E50` | Spare warm accent (was Status live; Live is now azure blue) |
| `--raw-amber` | `#CFA268` | Status warning (dark) |
| `--raw-rust` | `#D4663F` | Status error (dark) |

**System states** use four deliberately distinct hues so they never blur into one another: **Live** = azure blue, **Online** = verdigris green, **Warning** = amber, **Error** = rust red. (Live previously used copper, which sat too close to amber.)

### Extended Accents — Mineral Palette

Patina and Verdigris are the brand defaults (primary/secondary). For a fuller, general-purpose palette — and to keep accents from blurring into one warm lane — there are four additional families, each named after a real oxidation/mineral and spread across the hue wheel so they never get confused:

| Family | Raw base | Hue | Mineral reason |
|---|---|---|---|
| `--raw-azure` | `#5E7693` | blue | Azurite — copper carbonate |
| `--raw-teal` | `#4E8890` | cyan | Chrysocolla — hydrated copper |
| `--raw-amethyst` | `#7E6C9E` | violet | Manganese oxide |
| `--raw-garnet` | `#A05E72` | rose | Iron-aluminium silicate |

Each family ships the same six-token set as patina/verdigris (`base`, `-bright` for text on dark, `-deep` badge bg, `-mid` border, `-light` badge bg, `-text-light` for text on light) and the same semantic tokens (`--color-accent-<family>`, `-bg`, `-border`, `-text`) in both themes. All pass the build's contrast gate (text ≥ 4.5:1, base/large-UI ≥ 3:1). Use them via the badge utilities `.k-badge-azure` / `.k-badge-teal` / `.k-badge-amethyst` / `.k-badge-garnet`.

**Why copper?**
The name `ir0nm0nk` contains *iron* — iron that meets air and time produces rust, then a copper tone, then verdigris. Every accent color has a "physical reason" to exist — the extended families extend that same logic to other oxidations and minerals.

**Two-tone accent rule:** `--raw-patina`/`--raw-verdigris` (3.4–3.6:1 on dark bg) are only for borders and large elements; for text, always use the `-bright` variant (≥6:1). The semantic tokens `--color-accent-*-text` already handle this automatically.

### Dark Mode vs Light Mode

| Semantic token | Dark | Light |
|---|---|---|
| `--color-bg-base` | `#1C1C1B` ember | `#F1F0EC` alloy white |
| `--color-bg-surface` | `#161615` void | `#E9E8E2` |
| `--color-text-primary` | `#EDE8E0` cloud dancer | `#1C1C1B` ember |
| `--color-text-secondary` | `#C8C4BE` pale alloy | `#2E2E2C` |
| `--color-text-tertiary` | `#8A8680` iron mist | `#5A5A58` |
| `--color-border-default` | `#252523` forge | `#D4CFC8` |
| `--color-accent-primary` | `#8C6A3A` *(same)* | `#8C6A3A` *(same)* |
| `--color-accent-primary-text` | `#C0905A` patina bright | `#7A5228` |
| `--color-status-error` | `#D4663F` rust | `#A32D2D` |

The base accent doesn't change between modes — oxidized copper doesn't change with the light. Its *text* variants adjust so they're always readable.

### Theming

```html
<html>                    <!-- follow OS preference (default warm-dark when OS is dark) -->
<html data-theme="dark">  <!-- force dark -->
<html data-theme="light"> <!-- force light -->
```

Each theme sets `color-scheme` so scrollbars and native form controls follow along.

---

## Typography

### Three Voices, One System

**Display — Cormorant Garamond**
```
Role      : Titles, hero text, editorial moments
Weight    : 300 (light), 400, 600
Style     : Italic as expression, not decoration
Character : The soul of the system — classic, calm, with depth
```

**Interface — Syne**
```
Role      : All UI labels, navigation, body text, headings
Weight    : 400, 500, 700, 800
Style     : Geometric, slightly quirky, very readable
Character : The structure of the system — firm, modern, purposeful
```

**Technical — DM Mono**
```
Role      : Data, terminal output, code, metric values
Weight    : 300 (light), 400, 500
Style     : A warm monospace, not too cold
Character : The honesty of the system — as-is, nothing hidden
```

### Scale

Sizes are in **rem** so the user's font-size preference is respected (the px values below assume a 16px root). The system minimum is `--text-xs` = 11px — no text goes below that. Spacing stays in px by design: the spatial rhythm doesn't scale up with text.

| Level | Font | Token | Weight | Usage |
|---|---|---|---|---|
| Hero | Cormorant Garamond | `--text-4xl`+ (36px+) | 300 italic | Main page titles |
| Section title | Syne | `--text-xl`–`--text-2xl` (18–22px) | 700 | Section headers |
| Body | Syne | `--text-md` (14px) | 400 | Descriptions, content |
| UI label | Syne | `--text-sm` (12px) | 500 | Navigation, labels |
| Data | DM Mono | `--text-base`–`--text-md` (13–14px) | 300–400 | Metric values, code |
| Caption | DM Mono | `--text-xs` (11px) | 400 | Metadata, timestamps |

Naming note: `--text-base` (13px) is the base for *dense code/UI*; body text uses `--text-md` (14px).

### Loading Fonts

In `<head>` (non-blocking, preferred):

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Syne:wght@400;500;700;800&family=DM+Mono:wght@300;400;500&display=swap">
```

For a pure-CSS context: `@import 'fonts.css';` (blocking — use only when `<link>` isn't possible). Roadmap: self-host (all three are OFL) so there are no external requests and the package is fully self-contained.

---

## Motion — Kinetics

A system named *Kinetika* must have a language of motion.

| Token | Value | Usage |
|---|---|---|
| `--duration-fast` | 120ms | Hover, focus, small states |
| `--duration-base` | 200ms | Most transitions |
| `--duration-slow` | 320ms | Panels, modals, theme switch |
| `--ease-standard` | `cubic-bezier(0.4, 0, 0.2, 1)` | Default — mechanical, purposeful |
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Entrances — settle like cooling metal |
| `--ease-in` | `cubic-bezier(0.7, 0, 0.84, 0)` | Exits |

### Motion recipes

Durations and easings are the raw material; the **recipes** are what you actually reach for. Each is a duration + easing fragment you slot into a `transition` or `animation` shorthand, so you never pair them by hand.

| Token | Composition | Usage |
|---|---|---|
| `--motion-transition` | base · standard | Default state change — hovers, toggles, theme |
| `--motion-transition-fast` | fast · standard | Quick feedback — focus, small controls |
| `--motion-enter` | base · ease-out · `both` | Entrances — settle like cooling metal |
| `--motion-exit` | fast · ease-in · `both` | Exits |
| `--motion-emphasis` | slow · standard · `both` | Deliberate, weighty motion — panels, modals |

```css
.card        { transition: transform var(--motion-transition); }
.toast-enter { animation: k-rise var(--motion-enter); }
```

### Kinetics — keyframes & utilities

A system named *Kinetika* ships a motion language, not just timing. The build emits five keyframes (`k-rise`, `k-fade`, `k-settle`, `k-slide`, `k-pulse`) and opt-in utility classes that compose them with the recipes above:

| Class | Effect |
|---|---|
| `.k-animate-rise` | Fade + 8px rise (entrance) |
| `.k-animate-fade` | Opacity only |
| `.k-animate-settle` | Fade + scale from 0.98 — "settles like cooling metal" |
| `.k-animate-slide` | Fade + slide in from the left |
| `.k-animate-pulse` | Subtle continuous opacity pulse — for live-status indicators |
| `.k-transition` | `transition: all var(--motion-transition)` |
| `.k-lift` | Lifts 4px on hover (transform + border-color) |

Because every utility pulls its duration from a `--duration-*` token, motion is fully token-driven: see the recipes live in [`preview.html`](./preview.html).

`prefers-reduced-motion: reduce` zeroes out all durations automatically (so recipe-driven motion becomes instant) and sets `animation: none` on any `.k-animate-*` element to stop infinite animations like the pulse — already handled in tokens.css.

---

## Elevation, Z-Index, Focus

- **Shadows** (`--shadow-sm/md/lg`) — warm-tinted, never pure black; values differ per theme.
- **Z-index** (`--z-base/sticky/dropdown/overlay/modal/toast`) — 0 / 100 / 200 / 300 / 400 / 500.
- **Focus ring** — `--focus-ring` (2px patina, 2px offset). Utility: `.k-focusable:focus-visible`.

---

## Borders

| Token | Value | Note |
|---|---|---|
| `--border-width-default` | `1px` | Default — consistent rendering across displays |
| `--border-width-hairline` | `0.5px` | Opt-in, hi-dpi only (renders 0 or 1px at 1×) |
| `--border-width-strong` | `2px` | |

Ready-made composites: `--border-default`, `--border-subtle`, `--border-strong`, `--border-accent`.

---

## Components

### Badges

Use the utility classes `.k-badge-patina` / `.k-badge-verdigris` — their colors follow the theme automatically via semantic tokens.

### Cards

```
bg      : var(--card-bg)        — surface
border  : var(--card-border)
radius  : var(--card-radius)    — 6px

Active  : bg var(--card-active-bg) (theme-scoped: #1A1410 dark / #EAE0D4 light)
          border var(--card-active-border) · top accent var(--card-active-accent)
```

### Buttons

```
Primary   : bg var(--btn-primary-bg) · text var(--btn-primary-text) · Syne 500 · uppercase · tracking 0.1em
Secondary : transparent · text var(--color-text-secondary) · border var(--border-strong)
```

---

## Accessibility

Contrast is verified **at build time** (`build-tokens.mjs`) for both themes, against `bg-base` and `bg-surface`:

- All text roles (primary/secondary/tertiary, accent-text, all statuses) — **≥ 4.5:1** (AA)
- Large/UI elements (base accent) — **≥ 3:1**; all four system states (live/online/warning/error) now meet the **4.5:1** text target in both themes
- `--color-text-disabled` and `--color-text-ghost` are intentionally below AA — **decorative only**, never for information that must be read

A live audit lives in [`preview.html`](./preview.html) — the contrast table recomputes itself on every theme switch.

---

## Roadmap

For where this is headed — turning ir0nm0nk from a personal system into one anyone can adopt (packaging, components, docs site, contribution path) — see [`ROADMAP.md`](./ROADMAP.md).

---

## Preview

Open [`design/preview.html`](./preview.html) in a browser — the whole palette, typography, components, motion, and contrast audit on a single page, with a System/Dark/Light toggle. No build step needed.

---

## Implementation

- [x] Design tokens source of truth (`tokens.json`)
- [x] CSS custom properties (`tokens.css`, generated)
- [x] Live preview + contrast audit (`preview.html`)
- [ ] npm package + multi-target build (JS/TS, SCSS, Tailwind preset) — see [`ROADMAP.md`](./ROADMAP.md)
- [ ] Framework-agnostic web components (`k-button`, `k-input`, `k-badge`, `k-card`…)
- [ ] Docs site (replaces `preview.html`)
- [ ] Self-hosted fonts
- [ ] Icon set (monochromatic/desaturated)
- [ ] Logo/wordmark guideline · voice & tone

---

## Changelog

### 2.5.0 (2026-06)
- **Light base re-derived to "Alloy White" `#F1F0EC`:** the old Linen base had a stronger amber cast (red–blue gap ≈10) than the rest of the metallic scale (gap ≈1–2 at the dark end), so it read as a chosen cream rather than the light end of the same ramp. The whole light neutral ramp (base/surface/elevated/sunken/overlay) is re-derived as a disciplined warm off-white that matches the gray scale
- `--raw-linen` / `--raw-cloud-dancer` keep their other roles (button text on accents; dark primary text); light neutrals are now intentional one-offs in the semantic layer
- All 122 contrast checks still pass in both themes

### 2.4.0 (2026-06)
- **System states made visually distinct:** Live moved from copper to **azure blue** — it was nearly the same hue as Warning (amber) and the two blurred. States are now four clearly separate hues: Live (azure) / Online (green) / Warning (amber) / Error (red)
- Live and Online now use the `-bright` / text variants so all four states meet the **4.5:1** text target (Online was previously dot-only at 3:1); contrast gate tightened to 4.5 for `status-online`
- `--raw-copper` is now a spare warm accent (no longer mapped to a state)

### 2.3.0 (2026-06)
- **Extended accent palette:** four new mineral-named accent families — `azure` (blue), `teal` (cyan), `amethyst` (violet), `garnet` (rose) — spread across the hue wheel so accents no longer blur into one warm lane. Previously only patina + verdigris were distinguishable
- Each family ships the full six raw tokens + semantic tokens (`--color-accent-<family>`, `-bg`, `-border`, `-text`) in both themes, plus a `.k-badge-<family>` utility
- **Contrast gate widened** to cover all new families (text ≥ 4.5:1, base ≥ 3:1, badge text ≥ 4.5:1) in both themes — all pass
- preview.html shows the new swatches and badges; live audit covers them too

### 2.2.0 (2026-06)
- **Motion layer ("Kinetics"):** the name now ships a real motion language, not just timing tokens. New `motion` block in `tokens.json` with semantic recipes (`--motion-transition`, `--motion-transition-fast`, `--motion-enter`, `--motion-exit`, `--motion-emphasis`)
- **Keyframes + utilities** emitted by `build-tokens.mjs`: `k-rise`/`k-fade`/`k-settle`/`k-slide`/`k-pulse` keyframes and `.k-animate-*`, `.k-transition`, `.k-lift` classes — each composes a keyframe with a recipe, so durations stay token-driven
- **Reduced motion hardened:** zeroed durations make recipe-driven motion instant *and* `.k-animate-*` gets `animation: none` (stops the infinite pulse)
- Live demos added to `preview.html` (Kinetics section, with a Replay button)

### 2.1.0 (2026-06)
- **AA fix:** primary button inverted — bg `patina-bright` + `ember` text (5.99:1, was 4.06:1); light mode: bg `patina-text-light` + `linen` text (6.09:1). New tokens: `--btn-primary-bg` / `--btn-primary-text`
- **WCAG 1.4.11 fix:** input border gets a dedicated color `--input-border-color` (≥3:1 on base/surface/elevated; dark: iron-mist, light: `#807C76`). `--border-strong` is now decorative-only
- **Component layer moved into `tokens.json`:** type roles, border composites, focus ring, and all component tokens (sidebar, topbar, card, badge, btn, input, nav, section-label) are no longer hardcoded in `build-tokens.mjs` — the source of truth is whole again
- **Contrast gate expanded into a matrix:** every text role × every allowed background + component pairs (button, patina/verdigris badge, input border) — 78 checks. Documented restriction: `text-tertiary` is not allowed on `bg-overlay`/`bg-sunken`
- New utility class: `.k-btn-primary`

### 2.0.0 (2026-06)
- `tokens.json` becomes the source of truth; `tokens.css` is generated by `build-tokens.mjs` with a WCAG contrast gate
- Dark mode made AA-compliant: tertiary text → iron mist, error → rust `#D4663F`, accents get a `-bright` variant for text
- Light mode status colors corrected (live/warning/online)
- Raw layer fully wired (semantic references `var(--raw-*)`); new raw values: ember, coal, soot, ash, patina-bright, verdigris-bright, copper, amber, rust
- Font sizes → rem; minimum raised from 9px to 11px
- New tokens: motion (duration/ease + reduced-motion), shadows (warm-tinted, per theme), z-index, focus ring
- `color-scheme` per theme; without `data-theme` it follows the OS preference
- Default border 0.5px → 1px (hairline still available as opt-in)
- Fonts split out of tokens.css (`fonts.css` / `<link>` preconnect)

### 1.0.0
- Initial draft: palette, typography, spacing, components
