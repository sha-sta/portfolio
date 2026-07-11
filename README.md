# christianyoon.com

Personal portfolio. One continuous charcoal line is the protagonist: my real
signature draws itself, its final flourish becomes the line, and scrolling
scrubs a camera along it across a 2D world of sections.

## How it works

- **World/camera** — `src/world/`: sections live at fixed coordinates on a
  6000×3400 canvas (`worldMap.js`). A scroll proxy owns the native scrollbar;
  scroll progress maps to a position along the master line (sampled once into
  a lookup table, `camera.js`), driving a single `translate3d` on the world div.
- **The line** — `src/charcoal/`: strokes are painted with a baked
  ink-with-tooth grain tile (`public/charcoal-grain.webp`, wired in
  `GrainDefs.jsx`) over a deterministic jitter (`roughen.js`, seeded PRNG),
  scrubbed with `pathLength`-normalized dashoffset and composited with
  multiply blending. No runtime SVG filters; paper texture baked offline to
  `public/paper.webp`.
- **Signature** — `src/signature/`: centerline-traced from `cy-signature.png`
  into ordered strokes drawn in pen order; the Y and its flourish are one
  continuous stroke that the master line picks up tangent-matched.
- **Wall** — `src/world/Marginalia.jsx` (small charcoal doodles that sketch in
  on approach) and `src/world/ArtPiece.jsx` (a real charcoal drawing hung past
  the last section, museum label included).
- **Modes** — coarse pointers / small screens get a linear document
  (`src/linear/`); `prefers-reduced-motion` pre-draws all strokes and cuts the
  camera instead of panning.
- **Authoring** — `npm run dev`, then `/?editor` for a draggable waypoint
  editor over the whole world.

Real charcoal scans go in `art/` (gitignored) and get processed into web
assets; the simulated-vs-scanned texture seam is `src/charcoal/strokeStyle.js`.

## Stack

React 19 · Vite 7 · Tailwind v4 · framer-motion (as a MotionValue engine)

```sh
npm install
npm run dev
npm run build
```
