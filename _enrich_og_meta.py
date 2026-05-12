"""For every articles/<locale>/article-N.html, add missing OpenGraph fields:
  - og:image:width, og:image:height (read from the actual hero webp)
  - og:image:alt (mirrors the visible <img alt>)
  - og:locale (BCP 47 form: ja_JP, ru_RU, etc.)
Idempotent. Skips files where each tag already exists.
"""
import os, re, glob
from PIL import Image

ROOT = os.path.dirname(os.path.abspath(__file__))

OG_LOCALE = {
    'en':'en_US', 'ru':'ru_RU', 'fr':'fr_FR', 'es':'es_ES', 'de':'de_DE',
    'it':'it_IT', 'ja':'ja_JP', 'ko':'ko_KR', 'zh':'zh_CN', 'ar':'ar_AR',
    'pt':'pt_BR', 'pl':'pl_PL', 'nl':'nl_NL', 'tr':'tr_TR', 'uk':'uk_UA',
    'hi':'hi_IN',
}

SIZE_CACHE = {}
def get_size(rel):
    if rel in SIZE_CACHE: return SIZE_CACHE[rel]
    p = os.path.join(ROOT, rel.lstrip('/'))
    if not os.path.exists(p):
        SIZE_CACHE[rel] = None; return None
    SIZE_CACHE[rel] = Image.open(p).size
    return SIZE_CACHE[rel]

re_hero_img = re.compile(
    r'<img[^>]*class=["\']article-hero["\'][^>]*src=["\']([^"\']+)["\'][^>]*alt=["\']([^"\']*)["\']',
    re.I
)
re_og_image_line = re.compile(r'<meta\s+property=["\']og:image["\'][^>]*>', re.I)
re_existing_og_extras = re.compile(
    r'<meta\s+property=["\']og:image:(?:width|height|alt)["\'][^>]*>\s*\n?',
    re.I
)
re_existing_og_locale = re.compile(
    r'<meta\s+property=["\']og:locale["\'][^>]*>\s*\n?',
    re.I
)

stats = {'updated':0, 'unchanged':0, 'no_hero':0}

for fp in sorted(glob.glob(os.path.join(ROOT, 'articles', '*', 'article-*.html'))):
    loc = fp.replace(os.sep,'/').split('/')[-2]
    text = open(fp, encoding='utf-8').read()
    orig = text

    m = re_hero_img.search(text)
    if not m:
        stats['no_hero'] += 1; continue
    src, alt = m.group(1), m.group(2)
    size = get_size(src)
    if size is None:
        stats['no_hero'] += 1; continue
    w, h = size

    # Strip any prior extras (idempotency) so we always write fresh
    text = re_existing_og_extras.sub('', text)
    text = re_existing_og_locale.sub('', text)

    # Build the new block, inserted right after the og:image line
    og_block = (
        f'    <meta property="og:image:width" content="{w}">\n'
        f'    <meta property="og:image:height" content="{h}">\n'
        f'    <meta property="og:image:alt" content="{alt}">\n'
        f'    <meta property="og:locale" content="{OG_LOCALE.get(loc, "en_US")}">\n'
    )

    og_img_m = re_og_image_line.search(text)
    if not og_img_m:
        stats['no_hero'] += 1; continue
    insert_at = og_img_m.end()
    # ensure we insert on a new line
    text = text[:insert_at] + '\n' + og_block.rstrip('\n') + text[insert_at:]

    if text != orig:
        open(fp, 'w', encoding='utf-8').write(text)
        stats['updated'] += 1
    else:
        stats['unchanged'] += 1

print('STATS:', stats)
