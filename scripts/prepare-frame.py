#!/usr/bin/env python3
"""নতুন ফ্রেম PNG → ওয়েবের জন্য WebP (স্বচ্ছ ছবির-জানালাসহ) + CFG.photo মাপ।

ব্যবহার:
  python3 scripts/prepare-frame.py ডিজাইনারের-ফ্রেম.png public/assets/frames/frame-3.webp

নিয়ম: ডিজাইনারের PNG-তে ছবির জায়গাটা স্বচ্ছ (transparent) থাকতে হবে।
স্ক্রিপ্ট সবচেয়ে বড় স্বচ্ছ অংশকে "জানালা" ধরে, ভেতরের প্লেসহোল্ডার আইকন/লেখা মুছে ফেলে,
২১৬০px-এ নামিয়ে WebP করে, আর js/config.js-এর `photo:{...}` মাপ ছাপে।
নির্ভরতা: pip install pillow numpy scipy"""
import sys, numpy as np, scipy.ndimage as nd
from PIL import Image

if len(sys.argv) < 3:
    sys.exit(__doc__)
src, dst = sys.argv[1], sys.argv[2]
im = Image.open(src).convert("RGBA")
a = np.array(im)
lab, n = nd.label(a[:, :, 3] < 128)
if n == 0:
    sys.exit("কোনো স্বচ্ছ জায়গা পাওয়া যায়নি — ফ্রেমে ছবির জায়গা স্বচ্ছ রাখুন।")
sizes = nd.sum(np.ones_like(lab), lab, range(1, n + 1))
win = lab == (int(np.argmax(sizes)) + 1)
win = nd.binary_fill_holes(win)                 # প্লেসহোল্ডার আইকন/লেখাও জানালার অংশ
a[win, 3] = 0
ys, xs = np.where(win)
k = 1080 / im.width                              # CFG ১০৮০ প্রস্থের হিসাবে চলে
x0, x1, y0, y1 = xs.min() * k, xs.max() * k, ys.min() * k, ys.max() * k
h2 = round(im.height * 2160 / im.width)
Image.fromarray(a, "RGBA").resize((2160, h2), Image.LANCZOS).save(dst, "WEBP", quality=88, alpha_quality=100, method=4)
print(f"সেভ হয়েছে: {dst}")
print(f"CFG.photo = {{x:{int(x0)-1},y:{int(y0)-1},w:{int(x1-x0)+3},h:{int(y1-y0)+3}}}")
print("নামের বক্স (CFG.box) আলাদাভাবে মেপে নিতে হবে — docs/MAINTENANCE.md দেখুন।")
