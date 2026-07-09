# christianyoon.com

Personal portfolio. One continuous charcoal line is the protagonist: my real
signature draws itself, its final flourish becomes the line, and scrolling
scrubs a camera along it across a 2D world of sections.

## How it works

- **World/camera** — `src/world/`: sections live at fixed coordinates on a
  6000×3400 canvas (`worldMap.js`). A scroll proxy owns the native scrollbar;
  scroll progress maps to a position along the master line (sampled once into
  a lookup table, `camera.js`), driving a single `translate3d` on the world div.
- **The line** — `src/charcoal/`: every stroke is 2–3 stacked copies of the
  path, deterministically jittered (`roughen.js`, seeded PRNG) and scrubbed
  with `pathLength`-normalized dashoffset. No runtime SVG filters; paper
  texture is baked offline to `public/paper.webp`.
- **Signature** — `src/signature/`: centerline-traced from `cy-signature.png`
  into ordered strokes that draw in writing order.
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
