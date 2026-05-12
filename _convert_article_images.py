"""Convert staged PNG covers in _tmp_imgs/<locale>/ to optimized WebP in
articles/img/<locale>/<category>.webp. Also fan English out to locales without
a native cover set (hi, pl, nl, tr).
"""
import os, shutil
from PIL import Image

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(ROOT, '_tmp_imgs')
DST = os.path.join(ROOT, 'articles', 'img')

CATEGORIES = ('meetings', 'movies', 'games', 'learning')
# Locales that have a native cover set staged
SRC_LOCALES = ('en', 'ru', 'fr', 'es', 'de', 'it', 'ja', 'ko', 'zh', 'ar', 'pt', 'uk')
# Locales without a native set -> fallback to English copies
FALLBACK_LOCALES = ('hi', 'pl', 'nl', 'tr')

QUALITY = 82
TARGET_WIDTH = 1280  # downscale slightly from 1366 to 1280 (good hero size)

def convert_one(src_png, dst_webp):
    im = Image.open(src_png)
    if im.mode != 'RGB':
        # WebP supports RGBA but our covers are essentially opaque; convert to RGB for smaller file
        bg = Image.new('RGB', im.size, (10, 10, 10))
        if 'A' in im.mode:
            bg.paste(im, mask=im.split()[-1])
        else:
            bg.paste(im)
        im = bg
    w, h = im.size
    if w > TARGET_WIDTH:
        new_h = int(h * TARGET_WIDTH / w)
        im = im.resize((TARGET_WIDTH, new_h), Image.LANCZOS)
    im.save(dst_webp, 'WEBP', quality=QUALITY, method=6)
    return os.path.getsize(dst_webp), im.size

os.makedirs(DST, exist_ok=True)
total_before = 0
total_after = 0

for loc in SRC_LOCALES:
    src_dir = os.path.join(SRC, loc)
    dst_dir = os.path.join(DST, loc)
    os.makedirs(dst_dir, exist_ok=True)
    for cat in CATEGORIES:
        src = os.path.join(src_dir, cat + '.png')
        dst = os.path.join(dst_dir, cat + '.webp')
        if not os.path.exists(src):
            print(f'MISSING: {src}'); continue
        before = os.path.getsize(src)
        size, dims = convert_one(src, dst)
        total_before += before
        total_after += size
        pct = 100 * size / before
        print(f'  {loc}/{cat}: {before/1024:6.0f} KB -> {size/1024:6.0f} KB ({pct:.0f}%, {dims[0]}x{dims[1]})')

# Fallback: copy English webp to locales without covers
print()
print('=== FALLBACK COPIES ===')
for loc in FALLBACK_LOCALES:
    dst_dir = os.path.join(DST, loc)
    os.makedirs(dst_dir, exist_ok=True)
    for cat in CATEGORIES:
        src = os.path.join(DST, 'en', cat + '.webp')
        dst = os.path.join(dst_dir, cat + '.webp')
        shutil.copyfile(src, dst)
        print(f'  {loc}/{cat}: copied from en')

print()
print(f'Total PNG: {total_before/1024/1024:.1f} MB')
print(f'Total WebP: {total_after/1024/1024:.1f} MB')
print(f'Compression: {100*total_after/total_before:.0f}% of original')
