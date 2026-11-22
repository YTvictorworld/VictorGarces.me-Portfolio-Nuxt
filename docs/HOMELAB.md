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
| `deploy/compose.yaml` | The same service for Arcane: pulls the image from GHCR instead of building it |
| `.github/workflows/container.yml` | Builds the image on every push to `master` and publishes it to GHCR |

## With Arcane (how the homelab runs it)

GitHub Actions builds the image on every push to `master` and publishes it as
`ghcr.io/ytvictorworld/garceslab-site`, tagged `latest` and with the commit. The homelab never
compiles anything: Arcane pulls the image and runs `deploy/compose.yaml`.

1. **Once, on GitHub:** after the first run of *Build the site image*, open the package
   (profile → Packages → `garceslab-site` → Package settings) and set its visibility to
   **Public**, so Arcane can pull it without credentials. The repository is public, so the image
   holds nothing that is not already there.
2. **In Arcane:** Projects → the menu next to *Create Project* → **From Git Repo**.
   - Repository: `https://github.com/YTvictorworld/VictorGarces.me-Portfolio-Nuxt.git`
   - Branch: `master`
   - Compose File Path: `deploy/compose.yaml`
3. **The project's `.env` in Arcane:** `SITE_PORT=8081` (the default). `SITE_TAG` pins a commit's image
   (`sha-074d6d4`, say) instead of `latest`, which is how to go back to an earlier build.
4. **Updates:** a push to `master` builds a new image in a couple of minutes. Arcane picks it up
   on its next scheduled pull and redeploy, or straight away with *Redeploy*.

## NixOS

- Docker comes from `virtualisation.docker.enable = true;`. Arcane only needs the socket.
- Docker publishes ports with its own iptables rules, ahead of NixOS's firewall: `8081` answers
  on the network even if `networking.firewall.allowedTCPPorts` does not list it. For a public
  website behind a home router that is harmless, but it is worth knowing.
- With a Cloudflare tunnel or a reverse proxy on the same machine, nothing needs opening on the
  router or in the firewall.

## Without Arcane

```bash
git clone https://github.com/YTvictorworld/VictorGarces.me-Portfolio-Nuxt.git site && cd site
cp .env.example .env          # and fill it in
docker compose up -d --build  # builds the image on this machine
curl -I http://localhost:8081 # 200
```

The build takes a minute or two on first run and less afterwards: the dependency download is
cached, and only a change to `pnpm-lock.yaml` repeats it.

## Putting it on the internet

The container speaks plain HTTP. Whatever is in front of it owns the domain and the certificate.

- **Cloudflare Tunnel** (no port opened on the router, works behind CGNAT). One tunnel for the
  whole homelab is simpler than one per project: run `cloudflared` once (its own Arcane project,
  with `network_mode: host`) and add a public hostname `garceslab.me` → `http://localhost:8081`
  in Cloudflare Zero Trust. Outside Arcane, the `tunnel` profile in `compose.yaml` does the same
  for this site alone: put the token in `.env` and `docker compose --profile tunnel up -d`.
  A tunnel's public hostnames only work for domains whose DNS Cloudflare runs: point
  `garceslab.me`'s nameservers at Cloudflare (free) in Namecheap first. Namecheap stays the
  registrar; email forwarding then moves to Cloudflare's Email Routing.
- **A reverse proxy already on the homelab** (Caddy, Traefik, Nginx Proxy Manager): point it at
  `http://<homelab>:${SITE_PORT}`, and let it request the certificate for `garceslab.me`.

Either way, send `www.garceslab.me` to `garceslab.me` with a redirect rather than a second copy.

## Updating

With Arcane, push to `master` (above). Without it:

```bash
git pull
docker compose up -d --build
```

The new container replaces the old one in a couple of seconds. Pages are revalidated on every
visit, so visitors see the new build at once; hashed bundles and fonts are cached for a year.

## When the media pipeline is live

Set `MEDIA_MANIFEST_URL` as a repository variable on GitHub (or in `.env` without Arcane) and
rebuild: the build pulls the manifest and validates it before generating. Without it, the
committed manifest and `public/media` are used.
