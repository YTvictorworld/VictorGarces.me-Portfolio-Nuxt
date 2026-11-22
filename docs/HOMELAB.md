# Running the site on the homelab

The site is static: `pnpm generate` prerenders every route, and a container serves the files with
Caddy. No Node runs in production, nothing writes to disk, and the container idles at about 15 MB
of RAM.

| File | What it does |
| --- | --- |
| `Dockerfile` | Builds with the same Node 22 and pnpm 10.14 as CI, then copies only `.output/public` into a Caddy image |
| `deploy/Caddyfile` | Plain HTTP on `:8080`, the site's own 404, compression, caching per kind of file, security headers |
| `compose.yaml` | The `site` service, hardened (read-only, no capabilities), and an optional Cloudflare `tunnel` |
| `.env.example` | The settings: port, contact form key, manifest URL, tunnel token |

## First run

```bash
git clone https://github.com/YTvictorworld/VictorGarces.me-Portfolio-Nuxt.git site && cd site
cp .env.example .env          # and fill it in
docker compose up -d --build
curl -I http://localhost:8080 # 200
```

The build takes a minute or two on first run and less afterwards: the dependency download is
cached, and only a change to `pnpm-lock.yaml` repeats it.

## Putting it on the internet

The container speaks plain HTTP. Whatever is in front of it owns the domain and the certificate.

- **Cloudflare Tunnel** (no port opened on the router, works behind CGNAT). Create a tunnel in
  Cloudflare Zero Trust, put its token in `.env` as `TUNNEL_TOKEN`, and add a public hostname
  `garceslab.me` → `http://site:8080`. Then `docker compose --profile tunnel up -d`.
- **A reverse proxy already on the homelab** (Caddy, Traefik, Nginx Proxy Manager): point it at
  `http://<homelab>:${SITE_PORT}`, and let it request the certificate for `garceslab.me`.

Either way, send `www.garceslab.me` to `garceslab.me` with a redirect rather than a second copy.

## Updating

```bash
git pull
docker compose up -d --build
```

The new container replaces the old one in a couple of seconds. Pages are revalidated on every
visit, so visitors see the new build at once; hashed bundles and fonts are cached for a year.

## When the media pipeline is live

Set `MEDIA_MANIFEST_URL` in `.env` and rebuild: the build pulls the manifest and validates it
before generating, exactly as CI does. Without it, the committed manifest and `public/media` are
used.
