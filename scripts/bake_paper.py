"""Bake a tileable warm-paper texture with tooth + fibers -> public/paper.webp"""
import numpy as np
from PIL import Image, ImageFilter

S = 1024
rng = np.random.default_rng(7)

def tileable_noise(size, freq, rng):
    """Value noise made tileable by generating on a wrapped lattice."""
    lat = rng.random((freq, freq))
    lat = np.pad(lat, ((0, 1), (0, 1)), mode="wrap")
    xs = np.linspace(0, freq, size, endpoint=False)
    i = xs.astype(int)
    f = xs - i
    f = f * f * (3 - 2 * f)
    # bilinear interp on wrapped lattice
    n = (
        lat[np.ix_(i, i)] * np.outer(1 - f, 1 - f)
        + lat[np.ix_(i + 1, i)] * np.outer(f, 1 - f)
        + lat[np.ix_(i, i + 1)] * np.outer(1 - f, f)
        + lat[np.ix_(i + 1, i + 1)] * np.outer(f, f)
    )
    return n

# paper tooth: multi-octave fine noise
tooth = (
    0.45 * tileable_noise(S, 256, rng)
    + 0.35 * tileable_noise(S, 512, rng)
    + 0.20 * tileable_noise(S, 128, rng)
)
tooth = (tooth - tooth.min()) / (tooth.max() - tooth.min())

# sparse darker specks (charcoal dust in the grain)
specks = rng.random((S, S)) > 0.9991
speck_layer = np.zeros((S, S))
speck_layer[specks] = rng.random(specks.sum()) * 0.5

# base warm paper #f4efe4 with tooth modulating +-2.5% and specks darkening
base = np.array([244, 239, 228], float)
lum = 1 + (tooth - 0.5) * 0.033 - speck_layer * 0.12
img = np.clip(base[None, None, :] * lum[..., None], 0, 255).astype(np.uint8)

out = Image.fromarray(img).filter(ImageFilter.GaussianBlur(0.4))
out.save("/Users/christianyoon/Desktop/Projects/Portfolio/public/paper.webp", quality=82, method=6)
print("saved paper.webp", out.size)
