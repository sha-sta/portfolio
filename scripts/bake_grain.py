"""Bake a tileable charcoal-grain tile: ink with per-pixel alpha shaped like
paper tooth (dense core, speckle holes, faint fibers). Used as an SVG pattern
paint on every stroke -> grain lives INSIDE the stroke body."""
import numpy as np
from PIL import Image

S = 512  # displayed at 256 world units -> features are half-size (fine speckle)
rng = np.random.default_rng(11)

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

# tooth: ONLY high-frequency speckle — low-frequency octaves read as marker
# blotches, so they stay out of the alpha entirely
tooth = 0.6 * tileable_noise(S, 512, rng) + 0.4 * tileable_noise(S, 256, rng)
tooth = (tooth - tooth.min()) / (tooth.max() - tooth.min())

# alpha: dense with fine pits; tiny hard holes where tooth is deepest
alpha = 0.72 + 0.28 * tooth
holes = tooth < 0.1
alpha[holes] *= tooth[holes] / 0.1 * 0.55

# faint diagonal fiber streaks (paper drag direction)
yy, xx = np.mgrid[0:S, 0:S]
fibers = 0.5 + 0.5 * np.sin((xx + yy * 0.35) * (2 * np.pi * 18 / S))
alpha *= 0.94 + 0.06 * fibers

# slight tonal variation in the ink itself (pressure patches)
tone = tileable_noise(S, 32, rng)
ink = np.zeros((S, S, 4), dtype=np.uint8)
base = np.array([35, 32, 26], float)
rgb = base[None, None, :] * (0.92 + 0.16 * tone[..., None])
ink[..., :3] = np.clip(rgb, 0, 255).astype(np.uint8)
ink[..., 3] = np.clip(alpha * 255, 0, 255).astype(np.uint8)

Image.fromarray(ink).save(
    "/Users/christianyoon/Desktop/Projects/Portfolio/public/charcoal-grain.webp",
    quality=90, method=6, lossless=False, exact=True,
)
print("saved charcoal-grain.webp")
