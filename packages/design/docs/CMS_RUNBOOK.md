# Kinetika site — editing with the visual CMS

The public site (`kinetika.id`) is hand-authored HTML/CSS skinned in the Kinetika
Design System. The **content that changes often** — projects, blog posts, and a
few site-settings fields — lives in a Git-tracked content layer that a visual
CMS (Sveltia, Decap-compatible) edits. After editing you run one build and deploy.

## The model

```
content/site.json        ← hero text, "currently exploring" tags, contact info
content/projects.json    ← every project card (title, category, status, tags, link)
content/blog/*.md        ← blog posts (front-matter + markdown body)
        │
        │  npm run build   (regenerates HTML between <!-- build:KEY --> markers)
        ▼
site/index.html · site/portfolio/index.html · site/blog/*.html
        │
        ▼  deploy (rsync to node-136, restart Caddy)
kinetika.id
```

You never hand-edit the generated regions — you edit `content/` (via the CMS or
directly) and rebuild. The design, layout, tokens, and accessibility stay intact.

## Editing locally (no accounts, works today)

Sveltia's local mode edits the repo files directly in your browser — no auth, no
server. Use a Chromium browser (Chrome/Edge/Brave; needs the File System Access API).

```bash
cd ~/Documents/GitHub/Kinetika
npm run preview          # serves site/ at http://localhost:8080
```

Open `http://localhost:8080/admin/` → click **"Work with Local Repository"** →
pick the `Kinetika` repo folder. Edit Projects / Blog / Site settings with forms
and a live preview. Saving writes to `content/`. Then:

```bash
npm run build            # regenerate the site from content/
git add -A && git commit -m "content: update via CMS" && git push
```

## Editing from anywhere (hosted, GitHub backend)

`site/admin/config.yml` is already set to the GitHub backend (`gitomiko/Kinetika`,
branch `main`). To use `/admin` on the live site you need a GitHub OAuth app +
a tiny auth bridge (Sveltia can't hold a client secret in the browser). You have
Cloudflare already, so the simplest path is the **sveltia-cms-auth Cloudflare Worker**:

1. GitHub → Settings → Developer settings → **OAuth Apps** → New.
   - Homepage: `https://kinetika.id`
   - Authorization callback: your Worker URL (from step 2), e.g. `https://auth.kinetika.id/callback`
   - Copy the Client ID and generate a Client Secret. **You create this — I can't make accounts or hold secrets.**
2. Deploy the `sveltia-cms-auth` Worker (open source) to Cloudflare; set
   `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` as Worker secrets; map it to
   `auth.kinetika.id`.
3. Add to `config.yml`:
   ```yaml
   backend:
     name: github
     repo: gitomiko/Kinetika
     branch: main
     base_url: https://auth.kinetika.id
   ```
4. Visit `https://kinetika.id/admin/`, sign in with GitHub, edit, and **Publish**.
   Sveltia commits to `main`. A Gitea Actions / GitHub Actions job can then run
   `npm run build` and deploy automatically (see below).

> Gitea note: Sveltia/Decap don't have a native Gitea backend. Since the repo is
> mirrored on GitHub, use the GitHub backend above. If you prefer Gitea-only,
> keep using **local mode**.

> Security: `/admin` editing requires GitHub sign-in, but consider also putting
> `kinetika.id/admin` behind a Cloudflare Access policy so the page itself is
> only reachable by you.

## Auto-build on publish (optional)

Add a CI job (Gitea Actions or GitHub Actions) triggered on push to `main`:

```
npm ci
npm run build
rsync -a --delete site/ core@192.168.110.136:/opt/homelab/node-136-kinetika-web/site/
ssh core@192.168.110.136 'cd /opt/homelab/node-136-kinetika-web && docker compose restart kinetika-web'
```

Then publishing in the CMS → commit → CI builds and deploys, no terminal needed.

## Adding a project / post by hand (no CMS)

- **Project:** add an object to `content/projects.json` (copy an existing one;
  `category` ∈ infra/apps/design/os, `cover` ∈ c-infra/c-apps/c-design/c-os/c-hw,
  `statusDot` ∈ live/online/planned). Run `npm run build`.
- **Post:** add `content/blog/<slug>.md` with front-matter
  (`title`, `date`, `category`, `summary`, `draft`, then markdown body). Run `npm run build`.
