# christianyoon.com — agent notes

Personal portfolio. One continuous charcoal line: the signature draws itself,
its flourish becomes the master line, scroll scrubs a camera along it across
a 2D world. Deployed by pushing `main` (Vercel auto-deploy, domain configured
in the dashboard, no vercel config in-repo).

## Commands

- `npm run dev` — dev server; add `/?editor` for the draggable world/waypoint editor
- `npm run build` / `npx eslint src/` — both must be green before pushing
- Signature retrace: `scripts/trace_signature.py` (skeletonize + stitch + explicit Y
  assembly + lattice-scale smoothing with cusps pinned; fails if output deviates
  >1.5px from the raw skeleton, writes an overlay png for eyeballing). Re-run only
  if `public/cy-signature.png` changes.
- Texture bakes: `scripts/bake_paper.py`, `scripts/bake_grain.py`,
  `scripts/bake_tooth.py` → `public/paper.webp`, `public/charcoal-grain.webp`,
  `public/charcoal-tooth*.webp` (tooth = luminance masks that break stroke edges)
- Favicon: `scripts/bake_favicon.py` → `public/favicon.svg|.ico`,
  `public/apple-touch-icon.png` ("cy" in Fraunces wght 600, ink on paper,
  glyph outlines extracted from the shipped variable font)

## Architecture (single source of truth: `src/world/worldMap.js`)

- Sections have `box` (content), `anchor` (where the LINE passes: left margin),
  `view` (where the CAMERA centers on arrival). The camera rides its own
  Catmull-Rom spline through `view` points (`camera.js`), NOT the line.
- The line: per-segment paths in `WorldSVG.jsx`, dash-scrubbed with a +0.08
  lead that grows in over an eased `finish` MotionValue (~0.6s, owned by
  `App.jsx`) after the signature completes — never gate it on raw sig progress
  (the lead pops in over ~40ms).
- Charcoal look ("E", user-picked 2026-07-11): two near-equal-width dark grain
  passes + thin parallel ink FIBER lines (`off` = constant normal offset in
  `roughen.js`), all under a per-role baked paper-tooth luminance mask
  (`strokeMask` in `strokeStyle.js`, defs in `GrainDefs.jsx`), multiply
  blending. `defer: true` passes skip the draw animation and fade in via the
  `finish` MotionValue (owned by App/LinearApp). `strokeStyle.js` is the seam
  for swapping in real scanned charcoal from `art/` (gitignored drops).
- Modes: `useAppMode` — coarse pointer/small → `linear/LinearApp.jsx`;
  reduced motion → pre-drawn strokes + camera cuts (read matchMedia
  synchronously; framer's useReducedMotion is false on first render).
- Content is data-only in `src/content/*.js`; both layouts render it.

## Hard rules (user-confirmed, do not regress)

- NO em dashes anywhere in rendered copy.
- HazyEyes and Fumble: plain text, never linked (cofounder took over the
  hazyeyes domain; fumble link intentionally removed).
- No runtime SVG filters, ever (feTurbulence only in offline bakes).
- Strokes must not read as solid marker, and NEVER put a lower-opacity pass
  at the stroke edge (a wide soft pass under a darker core reads "laminated").
  Feathering = thin parallel fiber lines; texture = grain inside the body +
  tooth mask eating the edges.
- Doodles: currently none (graph doodle removed 2026-07-11 by request). If any
  return: unlabeled, generic-nerdy, far from both the line and text.
- After ANY route/content-size change, run the line-vs-text collision audit
  (sample master-line paths against section text rects in the browser; the
  snippet lives in git history and takes ~5 lines to reconstruct) and fix
  waypoints until it returns zero crossings.
- Bullet objects: strings have a legacy `.link` method — type-check before
  rendering optional bullet links.
- The Y + flourish is ONE stroke assembled in pen order (cup, stem, loop,
  flourish); the master line starts a hair past the flourish tip,
  tangent-matched, never overlapping (multiply darkens overlaps).
- Commits: conventional prefixes, no Co-Authored-By lines.
