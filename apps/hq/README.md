# Kinetika HQ Portal

This repository contains a lightweight static launcher for internal tools and service navigation.

The public repository ships with safe example data only. Real private routes, hostnames, IPs, and service endpoints should live in a local config file on the deployment host and must not be committed.

## Repository layout

- `.github/` repository defaults and collaboration templates
- `site/` static HTML, CSS, JavaScript, and local assets
- `docker-compose.yml` local container runtime
- `Caddyfile` static file server and response headers
- `.env.example` safe local bind defaults
- `docs/` setup and maintenance notes

## Public-safe configuration model

The tracked app catalog in `site/app.js` is a demo dataset.

For a real private deployment:

1. Copy `site/config.local.example.js` to `site/config.local.js`
2. Replace the placeholder groups and URLs with your real internal routes
3. Keep `site/config.local.js` untracked

The launcher will automatically load `site/config.local.js` when it exists.

## Local run

```bash
cp .env.example .env
docker compose up -d
curl -I http://127.0.0.1:8088
```

## Editing the launcher

- `site/app.js` contains the public-safe fallback catalog and client behavior
- `site/config.local.example.js` shows the shape of a private local override
- `site/index.html` defines the shell and copy
- `site/styles.css` defines the visual system and responsive layout

## Publishing guidance

If this repository stays public:

- do not commit private IPs or internal DNS names
- do not commit live admin endpoints
- do not commit deployment-specific routes into tracked files
