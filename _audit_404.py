"""Find internal links (and sitemap entries) that point at files not present on disk."""
import os, re, glob
from collections import Counter, defaultdict
from urllib.parse import urlparse, unquote

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_URL = 'https://live-subtitles.com'

# Map URL path -> exists on disk?
def path_exists(rel):
    rel = rel.split('#', 1)[0].split('?', 1)[0]
    rel = unquote(rel).lstrip('/')
    if rel == '' or rel.endswith('/'):
        candidate = os.path.join(ROOT_DIR, rel, 'index.html')
        return os.path.exists(candidate)
    candidate = os.path.join(ROOT_DIR, rel)
    if os.path.exists(candidate):
        return True
    if os.path.exists(candidate + '.html'):
        return True
    return False

# 1. Scan sitemap.xml
print('=== SITEMAP MISSING TARGETS ===')
sm_path = os.path.join(ROOT_DIR, 'sitemap.xml')
sm_missing = []
if os.path.exists(sm_path):
    sm = open(sm_path, encoding='utf-8').read()
    urls = re.findall(r'<loc>([^<]+)</loc>', sm)
    for u in urls:
        p = urlparse(u)
        if p.netloc and 'live-subtitles.com' not in p.netloc:
            continue
        if not path_exists(p.path):
            sm_missing.append(u)
    print(f'Total sitemap URLs: {len(urls)}')
    print(f'Missing on disk:    {len(sm_missing)}')
    for u in sm_missing[:30]:
        print('  MISSING ', u)

# 2. Scan internal href= links in HTML
print()
print('=== INTERNAL HREF MISSING TARGETS ===')
href_re = re.compile(r'href=["\']([^"\'#?][^"\']*)["\']', re.I)
missing_by_link = Counter()
missing_examples = defaultdict(set)  # bad_link -> {source files}
html_files = glob.glob(os.path.join(ROOT_DIR, '**', '*.html'), recursive=True)

def normalize_link(src_file, raw):
    """Resolve link relative to src_file. Return URL-style path starting with / or external."""
    if raw.startswith('mailto:') or raw.startswith('tel:') or raw.startswith('javascript:'):
        return None
    if raw.startswith('http://') or raw.startswith('https://'):
        p = urlparse(raw)
        if 'live-subtitles.com' not in p.netloc:
            return None
        return p.path
    # already absolute
    if raw.startswith('/'):
        return raw
    # relative
    src_dir = os.path.dirname(os.path.relpath(src_file, ROOT_DIR))
    rel = os.path.normpath(os.path.join(src_dir, raw)).replace(os.sep, '/')
    return '/' + rel

for hf in html_files:
    try:
        text = open(hf, encoding='utf-8', errors='ignore').read()
    except Exception:
        continue
    for m in href_re.finditer(text):
        raw = m.group(1)
        norm = normalize_link(hf, raw)
        if norm is None:
            continue
        # strip fragment/query
        clean = norm.split('#', 1)[0].split('?', 1)[0]
        if not clean:
            continue
        if not path_exists(clean):
            missing_by_link[clean] += 1
            missing_examples[clean].add(os.path.relpath(hf, ROOT_DIR).replace(os.sep, '/'))

print(f'Distinct missing href targets: {len(missing_by_link)}')
for link, n in missing_by_link.most_common(40):
    print(f'  x{n:4d}  {link}')
    for src in list(missing_examples[link])[:3]:
        print(f'         <- {src}')
