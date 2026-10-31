# Kinetika public website

This app serves `kinetika.id`: Landing, Docs, Portfolio, and Blog. It is
separate from the HQ administration portal in `apps/hq`.

## Files

- `Caddyfile` — static server, security headers, health endpoint, and 404 page
- `docker-compose.yml` — standalone Caddy container
- `.env.example` — safe local bind defaults
- `site/` — built website content

The canonical content and design source lives in `packages/design`. Publish a
fresh build into this app's `site/` directory; do not commit private runtime
configuration.

## Local run

```sh
cp .env.example .env
docker compose up -d kinetika-web
curl -H 'Host: kinetika.id' http://127.0.0.1:8090/healthz
```

For a private deployment, set `WEB_BIND_IP` and `WEB_HTTP_PORT` in the local,
untracked `.env`. Keep gateway addresses, internal routes, credentials, and
other infrastructure details in private operations documentation.
