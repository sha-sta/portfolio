"""Bake tileable paper-tooth LUMINANCE masks (white = stroke shows, dark =
paper eats the stroke). Applied as an SVG <mask> over whole stroke groups so
the vector edge breaks up like dry media -- the piece the in-body grain
pattern can't do. Two intensities: subtle (graphite) and heavy (charcoal)."""
import numpy as np
from PIL import Image

S = 512  # displayed at 256 world units -> features are half-size

def tileable_noise(size, freq, rng):
    lat = rng.random((freq, freq))
    lat = np.pad(lat, ((0, 1), (0, 1)), mode="wrap")
    xs = np.linspace(0, freq, size, endpoint=False)
    i = xs.astype(int)
    f = xs - i
    f = f * f * (3 - 2 * f)
    return (
        lat[np.ix_(i, i)] * np.outer(1 - f, 1 - f)
        + lat[np.ix_(i + 1, i)] * np.outer(f, 1 - f)
        + lat[np.ix_(i, i + 1)] * np.outer(1 - f, f)
        + lat[np.ix_(i + 1, i + 1)] * np.outer(f, f)
    )

def bake(path, floor, pit_thresh, pit_depth, streak_amt, seed):
    rng = np.random.default_rng(seed)
    # fine speckle = paper tooth
    tooth = 0.55 * tileable_noise(S, 512, rng) + 0.45 * tileable_noise(S, 256, rng)
    tooth = (tooth - tooth.min()) / (tooth.max() - tooth.min())

    lum = floor + (1 - floor) * tooth

    # hard pits where the tooth is deepest -- these punch through the stroke
    pits = tooth < pit_thresh
    lum[pits] *= pit_depth + (1 - pit_depth) * (tooth[pits] / pit_thresh)

    # dry-drag skips: noise stretched along x (stroke direction-ish) so misses
    # read as streaks, not confetti. Stays medium-frequency; broad blotches
    # would read as marker smears.
    yy = tileable_noise(S, 64, rng)
    xx_stretch = np.roll(yy, S // 32, axis=1)
    streaks = 0.5 * (yy + xx_stretch)
    streaks = (streaks - streaks.min()) / (streaks.max() - streaks.min())
    lum *= 1 - streak_amt + streak_amt * (0.4 + 0.6 * streaks)

    img = np.clip(lum * 255, 0, 255).astype(np.uint8)
    Image.fromarray(img, mode="L").convert("RGB").save(
        path, quality=88, method=6, lossless=False, exact=True
    )
    print("saved", path, f"(mean lum {lum.mean():.2f})")

PUB = "/Users/christianyoon/Desktop/Projects/Portfolio/public"
# subtle: dry graphite -- mostly-open tooth, occasional punch-throughs
bake(f"{PUB}/charcoal-tooth.webp", floor=0.72, pit_thresh=0.10, pit_depth=0.25, streak_amt=0.10, seed=23)
# heavy: charcoal on rough paper -- deeper pits, stronger drag skips
bake(f"{PUB}/charcoal-tooth-heavy.webp", floor=0.52, pit_thresh=0.18, pit_depth=0.12, streak_amt=0.22, seed=29)
