"""Widen the interior photograph so a full-screen hero can use object-cover
without cropping any of the original frame.

The extension is built from the outermost columns, softened and darkened, so it
reads as the room continuing into shadow rather than as a repeated pattern.
"""
from PIL import Image, ImageFilter
import math

SRC = "public/brand/interior.jpg"
OUT = "public/brand/interior-wide.jpg"
TARGET_ASPECT = 2.2

im = Image.open(SRC).convert("RGB")
w, h = im.size
target_w = int(round(h * TARGET_ASPECT))
pad = (target_w - w) // 2
target_w = w + pad * 2

canvas = Image.new("RGB", (target_w, h))
canvas.paste(im, (pad, 0))

# Per-row average of the outermost strip on each side, stretched outward.
STRIP = 10
for side in ("left", "right"):
    xs = range(0, STRIP) if side == "left" else range(w - STRIP, w)
    col = Image.new("RGB", (1, h))
    for y in range(h):
        px = [im.getpixel((x, y)) for x in xs]
        col.putpixel((0, y), tuple(sum(p[i] for p in px) // len(px) for i in range(3)))
    # Smooth the column down its length first, or a bright garment at the edge
    # smears outward as a horizontal streak.
    col = col.resize((1, max(8, h // 26)), Image.BOX).resize((1, h), Image.BICUBIC)
    col = col.filter(ImageFilter.GaussianBlur(6))
    ext = col.resize((pad, h), Image.BICUBIC)

    # Fade the extension toward a flat wall tone as it moves away from the
    # seam, so no garment colour survives as a visible band.
    wall = tuple(
        sum(im.getpixel((x, y))[i] for x in xs for y in range(0, h, 7))
        // (len(xs) * len(range(0, h, 7)))
        for i in range(3)
    )
    ep = ext.load()
    for x in range(pad):
        d = (pad - x) / pad if side == "left" else (x + 1) / pad
        t = min(1.0, (d * 1.35) ** 1.2)  # fully wall tone well before the edge
        for y in range(h):
            r, g, b = ep[x, y]
            ep[x, y] = (
                int(r + (wall[0] - r) * t),
                int(g + (wall[1] - g) * t),
                int(b + (wall[2] - b) * t),
            )

    canvas.paste(ext, (0, 0) if side == "left" else (pad + w, 0))

# Soften only the extensions, feathering across the seam.
blurred = canvas.filter(ImageFilter.GaussianBlur(28))
mask = Image.new("L", (target_w, h), 0)
mp = mask.load()
FEATHER = 90
for x in range(target_w):
    if x < pad:
        v = 255
    elif x < pad + FEATHER:
        v = int(255 * (1 - (x - pad) / FEATHER))
    elif x > target_w - pad:
        v = 255
    elif x > target_w - pad - FEATHER:
        v = int(255 * (1 - (target_w - pad - x) / FEATHER))
    else:
        v = 0
    for y in range(h):
        mp[x, y] = v
canvas = Image.composite(blurred, canvas, mask)

# Ease the extensions down slightly so the eye settles on the real photograph.
dark = canvas.load()
for x in range(target_w):
    d = 0.0
    if x < pad:
        d = (pad - x) / pad
    elif x >= pad + w:
        d = (x - (pad + w)) / pad
    if d <= 0:
        continue
    f = 1.0 - 0.22 * (d ** 1.5)
    for y in range(h):
        r, g, b = dark[x, y]
        dark[x, y] = (int(r * f), int(g * f), int(b * f))

canvas.save(OUT, quality=86, optimize=True, progressive=True)
print("wrote", OUT, canvas.size, "aspect %.3f" % (canvas.size[0] / canvas.size[1]),
      "pad", pad)
