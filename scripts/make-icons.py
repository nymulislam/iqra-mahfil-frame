#!/usr/bin/env python3
"""PWA আইকন ও og-image বানায়।  ব্যবহার:  python3 scripts/make-icons.py
নির্ভরতা: pip install pillow
আউটপুট: public/assets/icons/*, public/og-image.jpg"""
from PIL import Image, ImageDraw
import math, os
OUT = os.path.join(os.path.dirname(__file__), "..", "public")
T1, T2 = (27, 143, 157), (63, 196, 212)          # ব্র্যান্ড রঙ (CSS --teal, --teal2)

def star(d, cx, cy, r, fill):
    for rot in (0, math.pi / 4):                   # দুইটা বর্গ = আটকোণা তারা
        pts = [(cx + r * math.cos(rot + k * math.pi / 2 + math.pi / 4), cy + r * math.sin(rot + k * math.pi / 2 + math.pi / 4)) for k in range(4)]
        d.polygon(pts, fill=fill)

def icon(size, maskable=False):
    S = size * 4
    bg = Image.new("RGBA", (S, S))
    px = bg.load()
    for y in range(S):
        for x in range(S):
            t = (x + y) / (2 * S)
            px[x, y] = tuple(int(T1[i] + (T2[i] - T1[i]) * t) for i in range(3)) + (255,)
    if not maskable:                                # সাধারণ আইকনে গোল কোণ
        m = Image.new("L", (S, S), 0)
        ImageDraw.Draw(m).rounded_rectangle((0, 0, S, S), radius=int(S * .22), fill=255)
        bg.putalpha(m)
    d = ImageDraw.Draw(bg)
    star(d, S / 2, S / 2, S * (.26 if maskable else .31), (255, 255, 255, 255))
    d.ellipse((S/2 - S*.07, S/2 - S*.07, S/2 + S*.07, S/2 + S*.07), fill=(*T1, 255))
    return bg.resize((size, size), Image.LANCZOS)

d = os.path.join(OUT, "assets", "icons"); os.makedirs(d, exist_ok=True)
icon(192).save(f"{d}/icon-192.png"); icon(512).save(f"{d}/icon-512.png")
icon(512, True).save(f"{d}/icon-maskable-512.png")
icon(180, True).convert("RGB").save(f"{d}/apple-touch-icon.png")
icon(32).save(f"{d}/favicon-32.png")
# og-image: পোস্টারের উপরের অংশ ১২০০×৬৩০
p = Image.open(f"{OUT}/assets/poster.jpg").convert("RGB")
s = 1200 / p.width; p = p.resize((1200, int(p.height * s)), Image.LANCZOS)
p.crop((0, 0, 1200, 630)).save(f"{OUT}/og-image.jpg", quality=86)
print("icons + og-image ready")
