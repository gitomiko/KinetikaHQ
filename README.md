# KinetikaHQ

Canonical monorepo for the Kinetika administration portal, public website,
and design system.

## Layout

- `apps/hq` — HQ administration portal and its lightweight Caddy runtime
- `apps/web` — deployable static public website for `kinetika.id`
- `packages/design` — Kinetika design tokens, components, content, and website source
- `docs` — shared architecture and contributor documentation
- `scripts` — repository safety and maintenance checks

## Safeguards

This is a public-safe repository. Never commit:

- `.env` files other than `.env.example`
- credentials, tokens, private keys, or secret directories
- private IP addresses, Tailscale addresses, or internal hostnames
- `config.local.js`, private service routes, or deployment-specific endpoints
- dependencies, runtime logs, editor state, or OS metadata

Run the built-in guard before publishing:

```sh
npm run check:sensitive
```

Private deployment values belong only in ignored local files on the runtime
hosts. Operational runbooks containing private infrastructure details remain
outside this public mirror.

## Development

Run the HQ Node server locally:

```sh
npm run dev:hq
```

Build the design system and regenerate the public website:

```sh
npm run build:web
```

See the app and package READMEs for component-specific instructions.
