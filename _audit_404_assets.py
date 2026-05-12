"""Find broken <link href>, <script src>, <img src> targets pointing at local files."""
import os, re, glob
from collections import Counter, defaultdict
from urllib.parse import urlparse, unquote

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))

def path_exists(rel):
    rel = rel.split('#', 1)[0].split('?', 1)[0]
    rel = unquote(rel).lstrip('/')
    if rel == '' or rel.endswith('/'):
        return os.path.exists(os.path.join(ROOT_DIR, rel, 'index.html'))
    cand = os.path.join(ROOT_DIR, rel)
    if os.path.exists(cand): return True
    if os.path.exists(cand + '.html'): return True
    return False

def normalize_link(src_file, raw):
    if raw.startswith(('mailto:', 'tel:', 'javascript:', 'data:')):
        return None
    if raw.startswith(('http://', 'https://', '//')):
        p = urlparse(raw if not raw.startswith('//') else 'https:' + raw)
        if 'live-subtitles.com' not in (p.netloc or ''):
            return None
        return p.path
    if raw.startswith('/'):
        return raw
    src_dir = os.path.dirname(os.path.relpath(src_file, ROOT_DIR))
    rel = os.path.normpath(os.path.join(src_dir, raw)).replace(os.sep, '/')
    return '/' + rel

patterns = {
    'img-src':    re.compile(r'<img[^>]+src=["\']([^"\']+)["\']', re.I),
    'script-src': re.compile(r'<script[^>]+src=["\']([^"\']+)["\']', re.I),
    'link-href':  re.compile(r'<link[^>]+href=["\']([^"\']+)["\']', re.I),
    'meta-img':   re.compile(r'<meta[^>]+(?:property|name)=["\'](?:og:image|twitter:image)["\'][^>]+content=["\']([^"\']+)["\']', re.I),
}

html_files = glob.glob(os.path.join(ROOT_DIR, '**', '*.html'), recursive=True)
missing_by_link = Counter()
missing_examples = defaultdict(lambda: defaultdict(set))  # bucket -> link -> {src}

for hf in html_files:
    try: text = open(hf, encoding='utf-8', errors='ignore').read()
    except: continue
    for bucket, rx in patterns.items():
        for m in rx.finditer(text):
            raw = m.group(1)
            norm = normalize_link(hf, raw)
            if norm is None: continue
            clean = norm.split('#', 1)[0].split('?', 1)[0]
            if not clean: continue
            if not path_exists(clean):
                missing_by_link[(bucket, clean)] += 1
                missing_examples[bucket][clean].add(os.path.relpath(hf, ROOT_DIR).replace(os.sep, '/'))

print('=== MISSING LOCAL ASSETS ===')
for (bucket, link), n in missing_by_link.most_common(40):
    print(f'[{bucket}] x{n}  {link}')
    for src in list(missing_examples[bucket][link])[:3]:
        print(f'           <- {src}')

print()
print(f'Total distinct missing: {len(missing_by_link)}')
