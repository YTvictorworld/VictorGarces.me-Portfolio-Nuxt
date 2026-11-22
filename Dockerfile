# The site as a container: built here, served by Caddy. The image holds only the prerendered
# files and a web server, about 120 MB with no Node at runtime, and uses about 15 MB of RAM.
# `docker compose up -d --build`; docs/HOMELAB.md has the rest.

# ---- Build: the same Node and pnpm as .github/workflows/deploy.yml ------------------------------
FROM node:22-bookworm-slim AS build

ENV PNPM_HOME=/pnpm \
    PATH=/pnpm:$PATH \
    NODE_OPTIONS=--max-old-space-size=4096 \
    NUXT_TELEMETRY_DISABLED=1
RUN corepack enable && corepack prepare pnpm@10.14.0 --activate

WORKDIR /app

# The lockfile alone fills the store, so a change to the site does not download every
# dependency again: only a change to pnpm-lock.yaml does
COPY pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm config set store-dir /pnpm/store && pnpm fetch

COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --offline

# `pnpm fetch` laid the packages out before package.json was here, so it never saw that
# better-sqlite3 may run its build script, and install takes the package as done. @nuxt/content
# opens a SQLite database while it generates, so the native binding is built explicitly.
RUN pnpm rebuild better-sqlite3

# Both are public by design (docs/MEDIA.md): the form key names the form, and the manifest URL
# is the CDN's. Without MEDIA_MANIFEST_URL the committed manifest and public/media are used.
ARG NUXT_PUBLIC_WEB3FORMS_KEY=""
ARG MEDIA_MANIFEST_URL=""
ENV NUXT_PUBLIC_WEB3FORMS_KEY=$NUXT_PUBLIC_WEB3FORMS_KEY \
    MEDIA_MANIFEST_URL=$MEDIA_MANIFEST_URL

RUN pnpm media:pull && pnpm generate

# ---- Serve: Caddy and the files, nothing else -----------------------------------------------------
FROM caddy:2-alpine

COPY deploy/Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/.output/public /srv

# Plain HTTP on an unprivileged port: TLS is the reverse proxy's or the tunnel's job, and a
# port above 1024 needs no capability, so the container can drop them all
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -q --spider http://127.0.0.1:8080/ || exit 1
