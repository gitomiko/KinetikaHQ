# Contributing

This repository tracks the Kinetika HQ portal template.

## Working agreement

1. Keep changes small and easy to verify in the browser.
2. Treat tracked launcher data as public-safe example content only.
3. Keep private routes and homelab-specific endpoints out of tracked files.
4. Update docs when deployment behavior or operating assumptions change.
5. Preserve the portal's lightweight nature; avoid adding heavy runtime dependencies unless there is a clear need.

## Where to change things

- `site/app.js` for cards, links, grouping, and launcher behavior
- `site/config.local.js` for private deployment-only routes and endpoints
- `site/index.html` for structure and copy
- `site/styles.css` for look, spacing, and responsive behavior
- `Caddyfile` and `docker-compose.yml` for runtime and delivery changes

## Pull requests

Before opening a pull request:

1. Confirm the portal still renders correctly on desktop and mobile widths.
2. Confirm no private infrastructure details were added to tracked files.
3. Include simple validation notes such as `docker compose up -d` or browser checks.

## Branching

Use short-lived branches with a clear purpose, for example:

- `feat/add-service-cards`
- `fix/mobile-layout`
- `chore/caddy-headers`
