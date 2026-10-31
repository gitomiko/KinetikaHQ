# Local Setup

The portal is a static site served by Caddy through Docker Compose.

## Quick start

1. Copy `.env.example` to `.env`.
2. Optional: copy `site/config.local.example.js` to `site/config.local.js`.
3. Start the stack with `docker compose up -d`.
4. Open `http://127.0.0.1:8088` or the bind IP defined in `.env`.

## Private deployment notes

- `site/config.local.js` is for real internal service URLs
- `site/config.local.js` is gitignored on purpose
- keep tracked files limited to safe sample values

## What to verify

- the home page renders without missing assets
- search works
- theme toggle works
- cards render correctly with and without a local config override
- layout still feels correct on narrow screens
