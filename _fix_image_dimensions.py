"""For each articles/<locale>/article-N.html, replace the placeholder
width=1280 height=720 on the .article-hero <img> with the REAL dimensions of
the WebP it points to. This fixes CLS for the 30 covers that aren't 16:9.
"""
import os, re, glob
from PIL import Image

ROOT = os.path.dirname(os.path.abspath(__file__))

# Cache: img path -> (w, h)
SIZE_CACHE = {}

def get_size(path):
    if path in SIZE_CACHE:
        return SIZE_CACHE[path]
    abspath = os.path.join(ROOT, path.lstrip('/'))
    if not os.path.exists(abspath):
        SIZE_CACHE[path] = None
        return None
    im = Image.open(abspath)
    SIZE_CACHE[path] = im.size
    return im.size

# Match the hero img tag and capture src, width, height
re_hero = re.compile(
    r'(<img[^>]*class=["\']article-hero["\'][^>]*src=["\'])([^"\']+)(["\'][^>]*?width=["\'])\d+(["\'][^>]*?height=["\'])\d+(["\'][^>]*?>)',
    re.I
)

stats = {'updated':0, 'unchanged':0, 'no_image':0}
for fp in sorted(glob.glob(os.path.join(ROOT, 'articles', '*', 'article-*.html'))):
    text = open(fp, encoding='utf-8').read()

    def replace(m):
        src = m.group(2)
        size = get_size(src)
        if size is None:
            stats['no_image'] += 1
            return m.group(0)
        w, h = size
        return f'{m.group(1)}{src}{m.group(3)}{w}{m.group(4)}{h}{m.group(5)}'

    new = re_hero.sub(replace, text)
    if new != text:
        open(fp, 'w', encoding='utf-8').write(new)
        stats['updated'] += 1
    else:
        stats['unchanged'] += 1

print('STATS:', stats)
print(f'Distinct images sized: {len([v for v in SIZE_CACHE.values() if v])}')
