"""Bake the favicon set: lowercase "cy" in Fraunces (the site display serif),
ink #23201a on paper #f4efe4 -- the exact site colorway. Glyph outlines are
extracted from the shipped variable font (instanced at wght 600 to match the
heading weight), so the SVG favicon is vector-crisp with no font loading.

Outputs: public/favicon.svg, public/favicon.ico (16+32+48),
public/apple-touch-icon.png (180x180).
"""
import io
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.misc.transform import Transform
from PIL import Image, ImageDraw

REPO = "/Users/christianyoon/Desktop/Projects/Portfolio"
WOFF2 = f"{REPO}/node_modules/@fontsource-variable/fraunces/files/fraunces-latin-wght-normal.woff2"
INK = "#23201a"
PAPER = "#f4efe4"
WGHT = 600  # heading weight (font-semibold)

font = TTFont(WOFF2)
font.flavor = None  # decompress woff2 -> plain sfnt in memory
instantiateVariableFont(font, {"wght": WGHT}, inplace=True)

glyf = font.getGlyphSet()
cmap = font.getBestCmap()
upm = font["head"].unitsPerEm
hmtx = font["hmtx"]

def glyph_path(ch, dx):
    name = cmap[ord(ch)]
    pen = SVGPathPen(glyf)
    # font units are y-up; SVG is y-down: flip and shift by dx (font units)
    tpen = TransformPen(pen, Transform(1, 0, 0, -1, dx, 0))
    glyf[name].draw(tpen)
    return pen.getCommands(), hmtx[name][0]

d_c, adv_c = glyph_path("c", 0)
kern = -upm * 0.015  # tiny optical tuck between c and y
d_y, adv_y = glyph_path("y", adv_c + kern)
total_adv = adv_c + kern + adv_y

# x-height for vertical centering (lowercase-only mark)
x_height = getattr(font["OS/2"], "sxHeight", 0) or int(upm * 0.5)
# y descender depth, to keep the tail inside the tile
descender = font["OS/2"].sTypoDescender

# compose a 64x64 tile: paper rounded square, cy centered on the x-height
# band with room for the y descender
SIZE = 64
scale = SIZE * 0.62 / x_height  # cap the x-height at ~62% of the tile... scaled below by fit
# fit horizontally too
scale = min(scale, SIZE * 0.86 / (total_adv * 1.0))
w_px = total_adv * scale
x0 = (SIZE - w_px) / 2
# baseline: center the ink mass (x-height band plus half the descender)
ink_top = x_height * scale
ink_bottom = -descender * scale
baseline = (SIZE - (ink_top + ink_bottom)) / 2 + ink_top

svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {SIZE} {SIZE}">
  <rect width="{SIZE}" height="{SIZE}" rx="13" fill="{PAPER}"/>
  <g transform="translate({x0:.2f} {baseline:.2f}) scale({scale:.6f})" fill="{INK}">
    <path d="{d_c}"/>
    <path d="{d_y}"/>
  </g>
</svg>
'''
with open(f"{REPO}/public/favicon.svg", "w") as f:
    f.write(svg)
print(f"favicon.svg  (scale {scale:.4f}, baseline {baseline:.1f}, adv {total_adv})")

# ---- raster fallbacks: render the same geometry with PIL ------------------
try:
    import cairosvg  # noqa: F401
    HAVE_CAIRO = True
except ImportError:
    HAVE_CAIRO = False

def render_px(size):
    """Rasterize by drawing the glyph outlines as polygons at high supersample."""
    SS = 8
    img = Image.new("RGBA", (size * SS, size * SS), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    k = size * SS / SIZE
    draw.rounded_rectangle([0, 0, size * SS - 1, size * SS - 1], radius=13 * k, fill=PAPER)
    from fontTools.pens.basePen import BasePen

    class PolyPen(BasePen):
        skipMissingComponents = True
        def __init__(self, glyphSet, dx):
            super().__init__(glyphSet)
            self.polys, self.cur, self.dx = [], [], dx
        def _map(self, pt):
            x, y = pt
            return ((self.dx + x) * scale * k + x0 * k, (baseline - y * scale) * k)
        def _moveTo(self, pt):
            self.cur = [self._map(pt)]
        def _lineTo(self, pt):
            self.cur.append(self._map(pt))
        def _curveToOne(self, p1, p2, p3):
            p0f = self.cur[-1]
            a, b, c = self._map(p1), self._map(p2), self._map(p3)
            n = 24
            for t in (i / n for i in range(1, n + 1)):
                mt = 1 - t
                self.cur.append((
                    mt**3 * p0f[0] + 3 * mt**2 * t * a[0] + 3 * mt * t**2 * b[0] + t**3 * c[0],
                    mt**3 * p0f[1] + 3 * mt**2 * t * a[1] + 3 * mt * t**2 * b[1] + t**3 * c[1],
                ))
        def _qCurveToOne(self, p1, p2):
            p0f = self.cur[-1]
            a, b = self._map(p1), self._map(p2)
            n = 16
            for t in (i / n for i in range(1, n + 1)):
                mt = 1 - t
                self.cur.append((
                    mt**2 * p0f[0] + 2 * mt * t * a[0] + t**2 * b[0],
                    mt**2 * p0f[1] + 2 * mt * t * a[1] + t**2 * b[1],
                ))
        def _closePath(self):
            self.polys.append(self.cur)
            self.cur = []

    mask = Image.new("L", (size * SS, size * SS), 0)
    for ch, dx in (("c", 0), ("y", adv_c + kern)):
        pen = PolyPen(glyf, dx)
        glyf[cmap[ord(ch)]].draw(pen)
        # even-odd fill: xor each contour so counters (holes) punch out
        for poly in pen.polys:
            tmp = Image.new("L", mask.size, 0)
            ImageDraw.Draw(tmp).polygon(poly, fill=255)
            mask = Image.composite(Image.eval(mask, lambda v: 255 - v), mask, tmp)
    ink_layer = Image.new("RGBA", img.size, INK)
    img.paste(ink_layer, (0, 0), mask)
    return img.resize((size, size), Image.LANCZOS)

if HAVE_CAIRO:
    import cairosvg
    def render_px(size):  # noqa: F811 -- cairo renders the svg verbatim
        png = cairosvg.svg2png(bytestring=svg.encode(), output_width=size, output_height=size)
        return Image.open(io.BytesIO(png)).convert("RGBA")

render_px(180).save(f"{REPO}/public/apple-touch-icon.png")
icons = [render_px(s) for s in (16, 32, 48)]
icons[2].save(f"{REPO}/public/favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)],
              append_images=icons[:2])
print("apple-touch-icon.png + favicon.ico", "(cairosvg)" if HAVE_CAIRO else "(PIL polygons)")
