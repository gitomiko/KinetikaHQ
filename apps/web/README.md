# Kinetika website

This is the standalone `kinetika.id` site: Landing, Docs, Portfolio, and Blog.
It is intentionally separate from `hq.kinetika.id`, which is served by the
`hq-portal` container.

## Current hosting

- Host: Biz VM `192.168.110.170`
- Deployment path: `/opt/homelab/kinetika-web`
- Container: `kinetika-web` (Caddy static file server)
- Origin: `192.168.110.170:8090`
- Gateway: NPM on `192.168.110.100` routes `kinetika.id` and `www.kinetika.id`
  to this origin.
- Cloudflare Access is managed at the edge for the site.

The HQ administration portal remains on Core VM `192.168.110.111` at port 80
in its own `hq-portal` container and has its own content and gateway route.

The public website was migrated from Core VM `111` to Biz VM `170` on
2026-11-01. The former origin remains available temporarily for rollback.

## Files

- `Caddyfile` — static server, security headers, health endpoint, and 404 page
- `docker-compose.yml` — standalone Caddy container
- `.env` — local bind address and port; copy from `.env.example` when restoring
- `site/` — built website content

## Start or update the service

From this directory on the Core VM:

```sh
docker compose up -d kinetika-web
curl -H 'Host: kinetika.id' http://192.168.110.111:8090/
```

The source files in `site/` are independent of the HQ site. Replace them only
when publishing a new Kinetika website build.
