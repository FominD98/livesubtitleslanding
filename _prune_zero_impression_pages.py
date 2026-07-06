"""Data-driven prune after the 2026-05-09 site-wide algorithmic demotion.

Noindexes generated pages that earned ZERO Google impressions in 6 months
(2026-01-01..07-04, per GSC API export seo/gsc-pages-with-impressions-2026-07-06.tsv):
  - locale inner pages (/xx/*.html except /xx/index.html)
  - non-EN article pages (/articles/<lang>/article-N.html, lang != en)

Kept regardless of impressions: home, all root pages, /about/*, locale homepages,
all EN articles, all article index hubs, and any page with >=1 impression.

For each noindexed page: inject robots noindex,follow + strip its hreflang cluster.
For every kept page: drop hreflang links that point to a noindexed URL.
Sitemap: remove noindexed URLs, add /pricing.html.
"""
import os, re

ROOT = os.path.dirname(os.path.abspath(__file__))
SITE = 'https://live-subtitles.com'
LOCALES = {'ar','de','es','fr','hi','it','ja','ko','nl','pl','pt','ru','tr','uk','zh'}

# --- load GSC data ---
impressed = set()
with open(os.path.join(ROOT, 'seo', 'gsc-pages-with-impressions-2026-07-06.tsv'), encoding='utf-8') as f:
    next(f)
    for line in f:
        impressed.add(line.split('\t')[0])

# --- load sitemap ---
sm_path = os.path.join(ROOT, 'sitemap.xml')
sm = open(sm_path, encoding='utf-8').read()
urls = re.findall(r'<loc>(.*?)</loc>', sm)
paths = [u.replace(SITE, '') for u in urls]

def is_prunable(p):
    if p in impressed:
        return False
    m = re.match(r'^/([a-z]{2})/(.+\.html)$', p)
    if m and m.group(1) in LOCALES and m.group(2) != 'index.html':
        return True
    m = re.match(r'^/articles/([a-z]{2})/article-\d+\.html$', p)
    if m and m.group(1) != 'en':
        return True
    return False

prune = sorted(p for p in paths if is_prunable(p))
keep = [p for p in paths if p not in set(prune)]
print(f'sitemap: {len(paths)} urls -> keep {len(keep)}, noindex {len(prune)}')

with open(os.path.join(ROOT, 'seo', 'prune-list-2026-07-06.txt'), 'w', encoding='utf-8') as f:
    f.write('\n'.join(prune) + '\n')

re_robots = re.compile(r'<meta\s+name=["\']robots["\']\s+content=["\'][^"\']*["\']\s*/?>', re.I)
re_alt_block = re.compile(
    r'(?:[\t ]*<link\s+rel=["\']alternate["\']\s+hreflang=["\'][^"\']+["\']\s+href=["\'][^"\']+["\']\s*/?>\s*\n?)+',
    re.I)

def path_to_file(p):
    fp = p.lstrip('/')
    if fp == '' or fp.endswith('/'):
        fp += 'index.html'
    return os.path.join(ROOT, fp.replace('/', os.sep))

# --- 1. noindex + strip hreflang cluster on pruned pages ---
stats = {'noindexed': 0, 'already': 0, 'missing': 0}
for p in prune:
    fp = path_to_file(p)
    if not os.path.exists(fp):
        stats['missing'] += 1
        print('MISSING file for', p)
        continue
    text = open(fp, encoding='utf-8').read()
    if 'noindex' in text:
        stats['already'] += 1
        continue
    new_meta = '<meta name="robots" content="noindex, follow">'
    new, n = re_robots.subn(new_meta, text, count=1)
    if n == 0:
        new = text.replace('</head>', '    ' + new_meta + '\n</head>', 1)
    new = re_alt_block.sub('', new, count=1)
    open(fp, 'w', encoding='utf-8').write(new)
    stats['noindexed'] += 1
print('prune stats:', stats)

# --- 2. drop hreflang links to pruned urls from ALL remaining html files ---
pruned_urls = {SITE + p for p in prune}
re_alt_line = re.compile(
    r'[\t ]*<link\s+rel=["\']alternate["\']\s+hreflang=["\'][^"\']+["\']\s+href=["\']([^"\']+)["\']\s*/?>\s*\n?',
    re.I)
touched = 0
for dirpath, dirnames, filenames in os.walk(ROOT):
    dirnames[:] = [d for d in dirnames if not d.startswith(('.', '__')) and d not in ('img', 'node_modules')]
    for fn in filenames:
        if not fn.endswith('.html'):
            continue
        fp = os.path.join(dirpath, fn)
        rel = '/' + os.path.relpath(fp, ROOT).replace(os.sep, '/')
        if rel.replace('/index.html', '/') in set(prune) or rel in set(prune):
            continue
        text = open(fp, encoding='utf-8').read()
        new = re_alt_line.sub(lambda m: '' if m.group(1).rstrip('/') in {u.rstrip('/') for u in pruned_urls} else m.group(0), text)
        if new != text:
            open(fp, 'w', encoding='utf-8').write(new)
            touched += 1
print(f'hreflang cleaned in {touched} kept files')

# --- 3. rebuild sitemap: drop pruned, add /pricing.html ---
blocks = re.findall(r'[\t ]*<url>.*?</url>\s*\n?', sm, re.S)
kept_blocks = []
for b in blocks:
    loc = re.search(r'<loc>(.*?)</loc>', b).group(1)
    if loc.replace(SITE, '') not in set(prune):
        kept_blocks.append(b)
head, tail = sm.split(blocks[0], 1)[0], '</urlset>\n'
if '/pricing.html' not in sm:
    kept_blocks.append('  <url>\n    <loc>https://live-subtitles.com/pricing.html</loc>\n    <lastmod>2026-07-06</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>\n')
new_sm = head + ''.join(kept_blocks) + tail
open(sm_path, 'w', encoding='utf-8').write(new_sm)
print('sitemap rebuilt:', len(kept_blocks), 'urls')
