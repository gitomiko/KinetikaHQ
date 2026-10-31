# Design Sync Notes — Kinetika

## Current state

As of 2026-06-18: **3 React components** (Button, Badge, Card) + v2.5.0 tokens. Authored previews for all 3 (in `.design-sync/previews/`). Render check verified via system Chrome. Project re-created after prior project (7c2a4b59) was deleted.

**Project URL:** https://claude.ai/design/p/05331ee3-d586-41cf-8232-0abb756c65b2

## Setup (current)

```bash
# 1. Install repo deps (use npm ci — restores correct platform binary for esbuild)
npm ci                          # fixes darwin vs linux esbuild binary mismatch

# 2. Build tokens + bundle
npm run build                   # build:tokens → build:bundle → dist/kinetika.js

# 3. Re-stage converter scripts (always — catches updates)
SKILL_DIR="<bundled-skills path from /design-sync invocation>"
cp -r "$SKILL_DIR/package-build.mjs" "$SKILL_DIR/package-validate.mjs" \
  "$SKILL_DIR/package-capture.mjs" "$SKILL_DIR/resync.mjs" \
  "$SKILL_DIR/lib" "$SKILL_DIR/storybook" .ds-sync/

# 4. Install real kinetika package into converter's node_modules
#    (do this once; the symlink survives between runs if .ds-sync/ exists)
#    NOTE: .ds-sync/node_modules already has esbuild, ts-morph, @types/react via:
#    cd .ds-sync && npm i esbuild ts-morph @types/react playwright && cd ..

# 5. Run converter
node .ds-sync/package-build.mjs \
  --config .design-sync/config.json \
  --node-modules .ds-sync/node_modules \
  --entry ./dist/kinetika.js \
  --out ./ds-bundle

# 6. Post-process _ds_bundle.css: strip the header comment (lines 1-23)
#    The comment contains @import in plain text → validator false positive [CSS_IMPORT_MISSING]
CLOSE_LINE=$(grep -n '^ \*/' ds-bundle/_ds_bundle.css | head -1 | cut -d: -f1)
tail -n +$((CLOSE_LINE + 1)) ds-bundle/_ds_bundle.css > /tmp/_ds_bundle_stripped.css
mv /tmp/_ds_bundle_stripped.css ds-bundle/_ds_bundle.css

# 7. Add Google Fonts to styles.css (converter only writes the _ds_bundle.css import)
cat > ds-bundle/styles.css << 'EOF'
@import "./_ds_bundle.css";
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Syne:wght@400;500;700;800&family=DM+Mono:wght@300;400;500&display=swap');
EOF

# 8. Validate (with render check via system Chrome)
DS_CHROMIUM_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  node .ds-sync/package-validate.mjs ./ds-bundle

# 9. Capture for grading
DS_CHROMIUM_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  node .ds-sync/package-capture.mjs --out ./ds-bundle
```

## Known validator warnings (non-blocking)

- **`[DTS_REACT]`** — `@types/react not found`. True: repo has no `@types/react`. Fixed via `cfg.dtsPropsFor` for all 3 components. Safe to ignore.
- **`[FONT_REMOTE]`** — Google Fonts `@import url()` in `styles.css`. Expected — families load at runtime. Non-blocking.

## Render check

- Playwright is installed in `.ds-sync/node_modules` (via `npm i playwright` in .ds-sync/).
- **Use system Chrome** via `DS_CHROMIUM_PATH`: `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`
- The `--no-render-check` flag is NO LONGER needed — use the DS_CHROMIUM_PATH approach above.

## Component discovery quirks

- **No `.d.ts` files in `src/`.** Components are plain `.jsx` with no TypeScript. Auto-discovery finds 0 components. Fix: `componentSrcMap` in config (already set).
- **Props body is empty without `@types/react`.** ts-morph can't infer prop types from `.jsx`. Fix: `dtsPropsFor` in config (already set for all 3 components).

## Re-sync risks

- **Google Fonts URL.** Hardcoded in step 7 above and in `design/fonts.css`. If font weights change, update both.
- **Token comment block length.** Step 6 finds the comment end by grepping for `^ */`. If `tokens.css` gains a nested comment, this grep may find the wrong line — double-check after running.
- **New components need `componentSrcMap` + `dtsPropsFor` entries.** When Badge/Button/Card get siblings, add to both config fields, and author `.design-sync/previews/<Name>.tsx`.
- **`dist/kinetika.js` must be pre-built.** `npm run build` must run before the converter. If `dist/` is missing, the converter will fail with `[NO_DIST]`.
- **Skill base dir path.** Re-stage step uses the bundled-skills path from the current Claude Code install, which changes on updates. Re-invoke `/design-sync` if the `cp` fails.
- **esbuild platform.** If node_modules was built on Linux (e.g. copied from CI), `npm run build:bundle` will fail with "installed esbuild for another platform." Fix: `npm ci`.
- **Chrome path.** `DS_CHROMIUM_PATH` is hardcoded to the macOS system Chrome. If Chrome moves or is absent, install playwright's own Chromium: `npx playwright install chromium` (in .ds-sync/ dir).
- **Conventions header.** `.design-sync/conventions.md` names all utility classes and tokens; verify these still exist after major token bumps (`grep` them against `ds-bundle/_ds_bundle.css`).
