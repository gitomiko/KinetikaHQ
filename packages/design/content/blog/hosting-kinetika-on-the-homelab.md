---
title: Why kinetika.id runs on my homelab
date: 2026-07-01
category: Infrastructure
summary: Choosing self-hosting over GitHub Pages for the Kinetika site, and how a Cloudflare Tunnel makes serving the apex from a homelab safe.
draft: false
---

The obvious way to host a static site is GitHub Pages. Free, fast, zero maintenance. For a brand whose whole premise is *built by hand, honest by default*, though, the obvious answer felt like a contradiction — and once I looked at what was already running, it stopped making sense on the merits too.

> Dependency is a choice, not a requirement.

## The homelab was already doing this

The cluster already serves public services — the dashboard, uptime monitoring, the property-management app — through a Cloudflare Tunnel into a reverse-proxy gateway. The tunnel is the important part: nothing is port-forwarded, my home IP is never exposed, and TLS terminates at the edge. Serving one more static site is a single new origin, not a new architecture.

## Jekyll was the wrong tool

GitHub Pages nudges you toward Jekyll, which is Ruby. My site is built by a Node pipeline — the design tokens compile from `tokens.json` with a small script, and the components bundle with esbuild. Bolting a Ruby static-site generator onto that means maintaining two toolchains that don't talk to each other. So the site is plain hand-authored HTML and CSS that consumes the same `tokens.css` the rest of the system uses. No generator, no lock-in.

## The one honest trade-off

Self-hosting has exactly one real cost: if the house loses power or the ISP drops, the public site goes down. Cloudflare caches enough to soften it, but it won't fully cover an outage. The hedge — if I want it — is to push the same built output to a static host as an always-on mirror. Build once, deploy to two places. That keeps ownership where it matters and borrows uptime where it's cheap.

## What it actually looks like

A Caddy container serves the built `site/` directory. The gateway proxies the apex to it. The tunnel exposes the apex as a **public** origin — deliberately without the access policy that guards the admin subdomains. Deploying a change is: rebuild, copy the folder to the node, restart one container.

Built by hand. Honest by default. It turned out the honest choice was also the practical one.
