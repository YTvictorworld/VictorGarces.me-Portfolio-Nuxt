# Prompt for Claude Design (3D)

Paste as is. The result goes to `public/models/page-exploded.glb`; rename meshes with gltf-transform if needed (see `docs/3D.md`).

```
Create a low-poly 3D model of a web page in an "exploded view", to be used as the hero object of a developer portfolio. Export as GLB.

Concept: a rounded, card-like web page that is assembled at rest and separates into its layers along the depth axis when the user scrolls. I will animate it in code, so the geometry must be built as separate, named parts.

Parts, top to bottom, each a separate mesh with its own centered pivot, all children of an empty named page_root:
- layer_01_nav: a slim pill-shaped bar (navigation), rounded ends.
- layer_02_hero: a rounded rectangle with two thin bars (headline lines) and one small pill (button) slightly raised on its surface.
- layer_03_cards: a group with three equal rounded tiles side by side, each a separate child mesh (card_a, card_b, card_c).
- layer_04_code: a dark rounded rectangle with three short raised bars of different lengths (a code block).
- layer_05_footer: a thin rounded bar.

Proportions: total page about 1 unit wide, 1.4 units tall, each layer about 0.03 units thick. Corner radius on everything, roughly 0.04 units. No sharp edges. Keep the whole model under 30,000 triangles.

Materials, flat and matte, no textures, no PBR maps:
- page and cards: warm white #FFFFFF with a very light warm grey #F7F7F4 on the back faces
- card tiles: pale mint #E6F1EC
- navigation bar and the small button: teal #1F7A63
- code block: near black #151617, code bars in teal #1F7A63 and grey #5F6266
- headline bars: light grey #E2E1DB

Lighting is not needed in the file; I light it in the scene. Use vertex colors or one simple material per color, and give materials clear names (mat_white, mat_mint, mat_teal, mat_dark, mat_grey).

Optional but useful: bake one animation clip named "explode", 0 to 100 frames, where each layer moves from its assembled position to an exploded position along +Z (nav highest, footer lowest), cards also fanning apart slightly in X. Frame 0 = assembled, frame 100 = fully exploded.

Coordinate system: +Y up, page facing +Z, origin at the center of the assembled page. Scale 1 unit = page width.

Deliver: the GLB, a short list of the mesh names and their exploded offsets, and a PNG render of the assembled and exploded states on a plain #F7F7F4 background.
```
