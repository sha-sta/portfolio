# christianyoon.com — agent notes

Personal portfolio. One continuous charcoal line: the signature draws itself,
its flourish becomes the master line, scroll scrubs a camera along it across
a 2D world. Deployed by pushing `main` (Vercel auto-deploy, domain configured
in the dashboard, no vercel config in-repo).

## Commands

- `npm run dev` — dev server; add `/?editor` for the draggable world/waypoint editor
- `npm run build` / `npx eslint src/` — both must be green before pushing
- Signature retrace: `trace_signature.py` (session scratchpad; skeletonize + stitch + explicit Y assembly). Re-run only if `public/cy-signature.png` changes.
- Texture bakes: `bake_paper.py`, `bake_grain.py` → `public/paper.webp`, `public/charcoal-grain.webp`

## Architecture (single source of truth: `src/world/worldMap.js`)

- Sections have `box` (content), `anchor` (where the LINE passes: left margin),
  `view` (where the CAMERA centers on arrival). The camera rides its own
  Catmull-Rom spline through `view` points (`camera.js`), NOT the line.
- The line: per-segment paths in `WorldSVG.jsx`, dash-scrubbed with a +0.08
  lead, gated to the final 2% of the signature draw.
- Charcoal look: strokes are painted with the grain pattern
  (`GrainDefs.jsx` + `paint: 'grain'` in `strokeStyle.js`, fallback ink color
  in the paint string) with multiply blending. `strokeStyle.js` is the seam
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
- Strokes must not read as solid marker: grain INSIDE the body, soft tight
  edge, no wide translucent halos.
- Doodles: unlabeled, generic-nerdy, far from both the line and text.
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
