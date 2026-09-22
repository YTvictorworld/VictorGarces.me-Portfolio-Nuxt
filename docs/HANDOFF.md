# Handoff · victorgarces.me dual-mode refactor

- `CLAUDE.md` → put at the repo root. Instructions Claude Code reads on every session.
- `PROMPT-CLAUDE-CODE.md` → the first message to paste, then one line per milestone.
- `docs/` → PLAN (order of work), DESIGN (tokens, type, motion), COMPONENTS (artboard → component map), PAGES (routes, SEO), CONTENT (collections, seeds, migration), MEDIA (manifest contract), 3D (GLB contract, TresJS + GSAP), PROMPT-3D (for Claude Design).
- `snippets/` → `tokens.css` and `content.config.ts`, ready to drop in.
- `design/` → the 23 approved artboards: F-* (first visit, homes, system sheet), D-* (day pages), N-* (night pages), S-* (legal, 404, cookies, OG, favicon), M-* (mobile homes). Plain HTML with inline styles; `{{accent}}` in a few files resolves to the mode accent (#1F7A63 day, #E2A15B night).

Canvas with the same boards: https://claude.ai/artifact/Tg2Dd361YwGCWfC4nHubF1
