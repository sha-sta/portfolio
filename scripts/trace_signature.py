"""Centerline-vectorize cy-signature.png into ordered polyline strokes.

Binarize -> skeletonize -> walk the skeleton graph into polylines,
merging at junctions by straightest-continuation, then denoise ONLY at
pixel-lattice scale (sub-stroke-width gaussian, cusps pinned) so the real
handwriting survives. Every stroke is normalized to natural pen direction
("christian" left-to-right, Y assembled cup -> stem -> loop -> flourish).

The script fails loudly if any smoothed stroke deviates more than
MAX_DEV px from its raw skeleton chain, and writes an overlay image over
the reference PNG for eyeball confirmation.
"""

import json
import os
import numpy as np
from PIL import Image, ImageDraw
from skimage.morphology import skeletonize

IMG = "/Users/christianyoon/Desktop/Projects/Portfolio/public/cy-signature.png"
OUT = "/Users/christianyoon/Desktop/Projects/Portfolio/src/signature/signature.paths.js"
OVERLAY = os.environ.get("SIG_OVERLAY", "/tmp/sig_overlay.png")

SMOOTH_SIGMA = 1.2   # px; strictly sub-stroke-width, kills lattice jitter only
CUSP_DEG = 55.0      # turn sharper than this (over a 3px window) is a real cusp: pin it
RDP_EPS = 0.8        # simplification is NOT the smoothing mechanism; keep tight
MAX_DEV = 1.5        # px; hard ceiling on smoothed-vs-raw deviation
MAX_JOIN_GAP = 26.0  # px; largest pen-lift we bridge inside the Y chain

img = Image.open(IMG).convert("LA")
arr = np.array(img)
# ink = dark pixels with alpha
lum, alpha = arr[..., 0].astype(int), arr[..., 1].astype(int)
mask = (alpha > 128) & (lum < 128)
skel = skeletonize(mask)

H, W = skel.shape
pts = set(zip(*np.nonzero(skel)))

def neighbors(p):
    y, x = p
    out = []
    for dy in (-1, 0, 1):
        for dx in (-1, 0, 1):
            if dy == 0 and dx == 0:
                continue
            q = (y + dy, x + dx)
            if q in pts:
                out.append(q)
    return out

deg = {p: len(neighbors(p)) for p in pts}

# walk edges between endpoints/junctions
visited_edges = set()

def walk(start, first):
    """Walk from start through first until hitting endpoint or junction."""
    path = [start, first]
    prev, cur = start, first
    while True:
        if deg[cur] != 2:
            return path
        nxt = [q for q in neighbors(cur) if q != prev]
        if not nxt:
            return path
        prev, cur = cur, nxt[0]
        path.append(cur)

def edge_key(a, b):
    return (min(a, b), max(a, b))

segments = []
nodes = [p for p in pts if deg[p] != 2]
for n in nodes:
    for nb in neighbors(n):
        k = edge_key(n, nb)
        if k in visited_edges:
            continue
        path = walk(n, nb)
        ok = True
        for i in range(len(path) - 1):
            kk = edge_key(path[i], path[i + 1])
            if kk in visited_edges:
                ok = False
            visited_edges.add(kk)
        if ok and len(path) > 3:
            segments.append(path)

# recover pure loops (closed letter bowls whose every pixel is degree 2):
# they never touch a junction, so the edge walk above misses them entirely
visited_pts = set()
for s in segments:
    visited_pts.update(s)
for p in sorted(pts):
    if p in visited_pts or deg[p] != 2:
        continue
    loop = [p]
    visited_pts.add(p)
    prev, cur = None, p
    while True:
        nxt = [q for q in neighbors(cur) if q != prev and q not in visited_pts]
        if not nxt:
            break
        prev, cur = cur, nxt[0]
        loop.append(cur)
        visited_pts.add(cur)
    if len(loop) > 8:
        loop.append(loop[0])  # close it
        segments.append(loop)

def direction(path, at_end):
    a = np.array(path[-1] if at_end else path[0], float)
    b = np.array(path[-6 if len(path) > 6 else 0] if at_end else path[min(5, len(path) - 1)], float)
    v = a - b
    n = np.linalg.norm(v)
    return v / n if n else v

# merge segments at junctions by straightest continuation
def merge(segments):
    segs = [list(s) for s in segments]
    changed = True
    while changed:
        changed = False
        for i in range(len(segs)):
            if segs[i] is None:
                continue
            for end_i in (0, 1):
                tip = segs[i][-1] if end_i else segs[i][0]
                di = direction(segs[i], bool(end_i))
                best, best_dot, best_flip = None, 0.65, None
                for j in range(len(segs)):
                    if j == i or segs[j] is None:
                        continue
                    for end_j in (0, 1):
                        tip_j = segs[j][-1] if end_j else segs[j][0]
                        if abs(tip[0] - tip_j[0]) > 3 or abs(tip[1] - tip_j[1]) > 3:
                            continue
                        dj = direction(segs[j], bool(end_j))
                        dot = -float(np.dot(di, dj))
                        if dot > best_dot:
                            best, best_dot, best_flip = j, dot, end_j
                if best is not None:
                    other = segs[best] if best_flip == 0 else segs[best][::-1]
                    mine = segs[i] if end_i else segs[i][::-1]
                    segs[i] = mine + other
                    segs[best] = None
                    changed = True
                    break
            if changed:
                break
    return [s for s in segs if s]

merged = merge(segments)
merged = [s for s in merged if len(s) > 5]

# ---- from here on work in (x, y) image space, dense pixel chains ----
strokes = [[(float(x), float(y)) for (y, x) in s] for s in merged]

def dist(a, b):
    return ((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2) ** 0.5

def bbox_diag(s):
    xs = [p[0] for p in s]
    ys = [p[1] for p in s]
    return ((max(xs) - min(xs)) ** 2 + (max(ys) - min(ys)) ** 2) ** 0.5

def tip_dir(s, at_end, arc=9.0):
    """Direction at a chain tip measured over ~arc px of length, so the
    estimate is independent of point density (dense pixel chains vs
    simplified ones must stitch identically)."""
    tip = np.array(s[-1] if at_end else s[0], float)
    walk = reversed(s[:-1]) if at_end else s[1:]
    back = tip
    for p in walk:
        back = np.array(p, float)
        if np.linalg.norm(tip - back) >= arc:
            break
    v = tip - back
    n = np.linalg.norm(v)
    return v / n if n else v

# split off dots (the period tap) -- never stitched, dropped below
strokes = [s for s in strokes if bbox_diag(s) >= 14]

def rdp(points, eps):
    if len(points) < 3:
        return list(points)
    a, b = np.array(points[0], float), np.array(points[-1], float)
    ab = b - a
    lab = np.linalg.norm(ab)
    dmax, idx = 0.0, 0
    for i in range(1, len(points) - 1):
        p = np.array(points[i], float)
        ap = p - a
        d = abs(ab[0] * ap[1] - ab[1] * ap[0]) / lab if lab else np.linalg.norm(ap)
        if d > dmax:
            dmax, idx = d, i
    if dmax > eps:
        left = rdp(points[: idx + 1], eps)
        right = rdp(points[idx:], eps)
        return left[:-1] + right
    return [points[0], points[-1]]

# ---- topology: which fragments join into which pen stroke ----------------
# Decisions run on RDP-simplified geometry with the index-window direction
# estimate -- EXACTLY the setup that produced the known-good letter chains --
# while the dense pixel chains ride along for the later smoothing pass.
def tip_dir_idx(s, at_end):
    a = np.array(s[-1] if at_end else s[0], float)
    b = np.array(s[-3 if len(s) > 3 else 0] if at_end else s[min(2, len(s) - 1)], float)
    v = a - b
    n = np.linalg.norm(v)
    return v / n if n else v

def make_chain(dense):
    return {"simple": rdp(dense, 0.9), "dense": list(dense)}

def chain_concat(a, b):
    return {"simple": a["simple"] + b["simple"], "dense": a["dense"] + b["dense"]}

def chain_flip(c):
    return {"simple": c["simple"][::-1], "dense": c["dense"][::-1]}

# stitch pass: bridge small pen gaps (like the broken 'n') when the
# direction roughly continues, so letters read as one stroke
def stitch(chains, max_gap=21.0, min_dot=0.2):
    ss = list(chains)
    changed = True
    while changed:
        changed = False
        best = None
        for i in range(len(ss)):
            for j in range(len(ss)):
                if i == j:
                    continue
                tail = np.array(ss[i]["simple"][-1], float)
                for flip in (False, True):
                    head = np.array(ss[j]["simple"][-1] if flip else ss[j]["simple"][0], float)
                    gap = np.linalg.norm(tail - head)
                    if gap > max_gap:
                        continue
                    d_out = tip_dir_idx(ss[i]["simple"], True)
                    d_in = tip_dir_idx(ss[j]["simple"][::-1] if flip else ss[j]["simple"], False)
                    cont = float(np.dot(d_out, d_in))
                    if cont < min_dot:
                        continue
                    score = gap - cont * 6
                    if best is None or score < best[0]:
                        best = (score, i, j, flip)
        if best:
            _, i, j, flip = best
            other = chain_flip(ss[j]) if flip else ss[j]
            ss[i] = chain_concat(ss[i], other)
            ss.pop(j)
            changed = True
    return ss

# keep the Y's fragments raw -- they get assembled explicitly below
y_raw = [s for s in strokes if max(p[0] for p in s) >= 440]
chains = [make_chain(s) for s in strokes if max(p[0] for p in s) < 440]

chains = stitch(chains)

# the 'n' ends in an upward curl, so the direction test above refuses to join
# it to its finishing flick; bridge that specific junction unconditionally
def bridge_region(chains, x_lo, x_hi, max_gap=24.0):
    ss = list(chains)
    changed = True
    while changed:
        changed = False
        for i in range(len(ss)):
            for j in range(len(ss)):
                if i == j:
                    continue
                for fi in (False, True):
                    tail = ss[i]["simple"][0] if fi else ss[i]["simple"][-1]
                    for fj in (False, True):
                        head = ss[j]["simple"][-1] if fj else ss[j]["simple"][0]
                        if not (x_lo <= tail[0] <= x_hi and x_lo <= head[0] <= x_hi):
                            continue
                        gap = dist(tail, head)
                        if gap > max_gap:
                            continue
                        left = chain_flip(ss[i]) if fi else ss[i]
                        right = chain_flip(ss[j]) if fj else ss[j]
                        ss[i] = chain_concat(left, right)
                        ss.pop(j)
                        changed = True
                        break
                    if changed:
                        break
                if changed:
                    break
            if changed:
                break
    return ss

chains = bridge_region(chains, 340, 400)
strokes = [c["dense"] for c in chains]

# ---- the Y + flourish: assemble into ONE continuous pen stroke, in
# Christian's actual pen order:
#   1. the u-cup: from the top-left tip, down and back up to the top right
#   2. the descender: from the top right, down and around the big loop
#   3. out to the right: the flourish, where the master line picks up
def orient(s, start_near):
    return list(s) if dist(s[0], start_near) <= dist(s[-1], start_near) else list(s[::-1])

def join(chain, frag, label, report):
    """Append frag to chain, bridging small pen gaps so motion is continuous."""
    if not chain:
        return list(frag)
    gap = dist(chain[-1], frag[0])
    d_out = tip_dir(chain, True)
    d_in = tip_dir(frag, False)
    cont = float(np.dot(d_out, d_in))
    report.append((label, gap, cont))
    if gap < 1.5:
        # coincident endpoints: drop the duplicate
        return chain + list(frag[1:])
    if gap <= MAX_JOIN_GAP:
        # bridge with straight in-fill every ~2px so the chain never jumps
        n = max(1, int(gap / 2))
        a, b = np.array(chain[-1]), np.array(frag[0])
        fill = [tuple(a + (b - a) * (k / (n + 1))) for k in range(1, n + 1)]
        return chain + fill + list(frag)
    print(f"  WARNING: Y joint '{label}' gap {gap:.1f}px exceeds {MAX_JOIN_GAP}px, not bridged")
    return chain + list(frag)

def assemble_y(frags):
    if not frags:
        return [], []
    def w(s):
        xs = [p[0] for p in s]
        return max(xs) - min(xs)
    def h(s):
        ys = [p[1] for p in s]
        return max(ys) - min(ys)
    flourish = max(frags, key=lambda s: max(p[0] for p in s))
    others = [s for s in frags if s is not flourish]
    loop = max(others, key=w) if others else None
    others = [s for s in others if s is not loop]
    stem = max(others, key=h) if others else None
    cup = next((s for s in others if s is not stem), None)

    fl = orient(flourish, (503, 183))
    report = []
    chain = []
    if cup:
        chain = join(chain, orient(cup, (458, 101)), "cup", report)  # u-cup: top-left tip first
    if stem:
        chain = join(chain, orient(stem, chain[-1] if chain else (518, 14)), "stem", report)
    if loop:
        # loop: start at the end FARTHER from the flourish head so it finishes
        # beside the flourish; flip if it would start by rising instead of diving
        lp = orient(loop, max([loop[0], loop[-1]], key=lambda p: dist(p, fl[0])))
        if len(lp) > 2 and lp[1][1] < lp[0][1]:
            lp = lp[::-1]
        chain = join(chain, lp, "loop", report)
    chain = join(chain, fl, "flourish", report)
    return chain, report

y_chain, y_report = assemble_y(y_raw)

# ---- natural pen direction for every letter stroke: mostly-horizontal
# strokes run left -> right, mostly-vertical ones top -> down (the Y chain's
# direction is fixed by its explicit assembly above)
def normalize_direction(s):
    dx = s[-1][0] - s[0][0]
    dy = s[-1][1] - s[0][1]
    if abs(dx) >= abs(dy):
        return s if dx >= 0 else s[::-1]
    return s if dy >= 0 else s[::-1]

strokes = [normalize_direction(s) for s in strokes]

# writing order: 'christian' left to right, then the Y+flourish.
# (the period dot next to the Y is intentionally dropped)
def sort_key(s):
    xs = [p[0] for p in s]
    return min(xs) * 0.7 + s[0][0] * 0.3

strokes.sort(key=sort_key)

# the pen crosses a 't' AFTER writing the letters under the bar, not before:
# pull each crossbar (wide, flat, short stroke) out of the left-to-right
# order and re-insert it after the last stroke it substantially overlaps
def x_range(s):
    xs = [p[0] for p in s]
    return min(xs), max(xs)

def is_crossbar(s):
    x0, x1 = x_range(s)
    ys = [p[1] for p in s]
    return (x1 - x0) > 4 * (max(ys) - min(ys) + 1) and (x1 - x0) < 90

bars = [s for s in strokes if is_crossbar(s)]
letters = [s for s in strokes if not is_crossbar(s)]
ordered = []
for k, s in enumerate(letters):
    ordered.append(s)
    for b in list(bars):
        b0, b1 = x_range(b)
        s0, s1 = x_range(s)
        overlaps = min(s1, b1) - max(s0, b0) >= 5
        later = any(
            min(x_range(r)[1], b1) - max(x_range(r)[0], b0) >= 5 for r in letters[k + 1 :]
        )
        if overlaps and not later:
            ordered.append(b)
            bars.remove(b)
ordered += bars
strokes = ordered

raw_strokes = strokes + ([y_chain] if y_chain else [])

# ---- denoise at lattice scale ONLY --------------------------------------
# NOTE: no backtrack/spike removal. On a 1px grid a genuine pen hairpin (up
# to a tip, back down the adjacent pixel column) is indistinguishable from a
# retrace spike at the apex -- any remover eats real letters (it deleted the
# s-curl and the Y's stem tip). Lattice wiggles are the smoother's job.

def dedupe(s):
    out = [s[0]]
    for p in s[1:]:
        if dist(out[-1], p) > 0.3:
            out.append(p)
    return out

def find_cusps(s, window=3, thresh_deg=CUSP_DEG):
    """Indices where the path genuinely turns hard -- real handwriting corners."""
    cusps = set()
    for i in range(window, len(s) - window):
        a = np.array(s[i]) - np.array(s[i - window])
        b = np.array(s[i + window]) - np.array(s[i])
        na, nb = np.linalg.norm(a), np.linalg.norm(b)
        if not na or not nb:
            continue
        cos = np.clip(float(np.dot(a, b)) / (na * nb), -1, 1)
        if np.degrees(np.arccos(cos)) > thresh_deg:
            cusps.add(i)
    return cusps

def gaussian_smooth(s, sigma=SMOOTH_SIGMA):
    """Gaussian blur along the chain; endpoints and cusps stay pinned."""
    if len(s) < 5:
        return list(s)
    pin = {0, len(s) - 1} | find_cusps(s)
    xy = np.array(s, float)
    radius = max(1, int(3 * sigma))
    kernel = np.exp(-0.5 * (np.arange(-radius, radius + 1) / sigma) ** 2)
    kernel /= kernel.sum()
    padded = np.pad(xy, ((radius, radius), (0, 0)), mode="edge")
    sm = np.stack([np.convolve(padded[:, k], kernel, mode="valid") for k in (0, 1)], axis=1)
    for i in sorted(pin):
        sm[i] = xy[i]
    return [tuple(p) for p in sm]

def _pts_to_polyline(pts, poly):
    """Distance from each point to the nearest segment of poly."""
    poly_a = np.array(poly, float)
    seg_a = poly_a[:-1]
    seg_v = poly_a[1:] - seg_a
    seg_len2 = (seg_v ** 2).sum(axis=1)
    seg_len2[seg_len2 == 0] = 1e-9
    out = []
    for p in pts:
        pv = np.array(p, float) - seg_a
        t = np.clip((pv * seg_v).sum(axis=1) / seg_len2, 0, 1)
        proj = seg_a + seg_v * t[:, None]
        out.append(np.sqrt(((np.array(p, float) - proj) ** 2).sum(axis=1)).min())
    return out

def deviation(smooth, raw):
    """SYMMETRIC max/mean distance between the smoothed points and the raw
    dense chain. The raw->smooth direction is the one that catches LOST
    geometry (a dropped curl leaves every surviving point on-chain, so the
    one-way check passes while a letter disappears)."""
    fwd = _pts_to_polyline(smooth, raw)
    bwd = _pts_to_polyline(raw, smooth)
    both = fwd + bwd
    where = (smooth + list(raw))[int(np.argmax(both))]
    return max(both), float(np.mean(both)), (round(where[0]), round(where[1]))

final_strokes = []
print(f"image {W}x{H}")
if y_report:
    print("Y joints (gap px / tangent continuity):")
    for label, gap, cont in y_report:
        print(f"  {label:9s} gap {gap:5.1f}  cont {cont:+.2f}")
worst = 0.0
for i, raw in enumerate(raw_strokes):
    s = dedupe(raw)
    s = gaussian_smooth(s)
    simp = rdp(s, RDP_EPS)
    dmax, dmean, where = deviation(simp, raw)
    worst = max(worst, dmax)
    final_strokes.append([[round(x, 1), round(y, 1)] for x, y in simp])
    xs = [p[0] for p in simp]
    print(
        f"  {i}: {len(raw)} raw -> {len(simp)} pts, x {min(xs):.0f}-{max(xs):.0f}, "
        f"start ({simp[0][0]:.0f},{simp[0][1]:.0f}) -> end ({simp[-1][0]:.0f},{simp[-1][1]:.0f}), "
        f"dev max {dmax:.2f} mean {dmean:.2f} @ {where}"
    )

if worst > MAX_DEV:
    raise SystemExit(f"FAIL: max deviation {worst:.2f}px exceeds {MAX_DEV}px -- signal loss, not shipped")

# ---- overlay artifact: smoothed strokes over the reference, eyeball check
base = Image.open(IMG).convert("RGBA")
overlay = Image.new("RGBA", base.size, (255, 255, 255, 0))
drawer = ImageDraw.Draw(overlay)
for s in final_strokes:
    drawer.line([tuple(p) for p in s], fill=(200, 30, 30, 200), width=1)
    drawer.ellipse([s[0][0] - 2, s[0][1] - 2, s[0][0] + 2, s[0][1] + 2], fill=(30, 120, 220, 255))  # start = blue
    drawer.ellipse([s[-1][0] - 2, s[-1][1] - 2, s[-1][0] + 2, s[-1][1] + 2], fill=(30, 180, 60, 255))  # end = green
Image.alpha_composite(base, overlay).resize((W * 2, H * 2), Image.NEAREST).save(OVERLAY)
print(f"overlay -> {OVERLAY}")

total_pts = sum(len(s) for s in final_strokes)
print(f"strokes: {len(final_strokes)}, points: {total_pts}, worst dev {worst:.2f}px")

js = "// Auto-traced from public/cy-signature.png (skeleton centerline,\n"
js += "// lattice-scale smoothing only, cusps pinned, natural pen order).\n"
js += "// Points in image space; render with catmullRomToPath + charcoal Stroke.\n"
js += f"export const SIG_W = {W};\nexport const SIG_H = {H};\n\n"
js += "export const strokes = " + json.dumps(final_strokes) + ";\n"
with open(OUT, "w") as f:
    f.write(js)
print("wrote", OUT)
