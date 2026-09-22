# First prompt for Claude Code

Open the repo (`VictorGarces.me-Portfolio-Nuxt`), copy the `handoff/` folder contents into the repo root so that `CLAUDE.md`, `docs/`, `design/` and `snippets/` sit next to `nuxt.config.ts`, then paste this:

```
Read CLAUDE.md, then docs/PLAN.md, docs/DESIGN.md, docs/COMPONENTS.md, docs/PAGES.md, docs/CONTENT.md, docs/MEDIA.md and docs/3D.md. The approved design is in design/ as self-contained HTML artboards (open them with the browser or read the markup; inline styles carry the exact values, {{accent}} means the mode accent token).

Start with milestone M0 from docs/PLAN.md: create the branch, audit the current repo, and write docs/MIGRATION.md mapping every existing module, content entry, locale string and route to its place in the new structure. Do not change any code in M0. Show me MIGRATION.md before moving to M1.

Rules that matter most: keep every module and every content entry the current site has; all colors and fonts through the tokens in snippets/tokens.css; routes decide the mode (/dev = day, /film = night); everything the design marks as placeholder comes from content or the media manifest, never hard-coded; GSAP is the only animation library; no em-dashes in UI copy; English default, Spanish in i18n.
```

Then, per milestone: `Continue with M<n>. Run lint, typecheck and generate before you report back, and list what you checked against the acceptance criteria.`
