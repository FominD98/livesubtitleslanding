"""Rewrite hreflang block in every articles/<locale>/article-N.html so
   that:
     - x-default points at /articles/en/article-N.html (if EN exists)
     - one hreflang per locale where the article actually exists
     - block is identical across all locale copies of the same article
"""
import os, re, glob
from collections import defaultdict

ROOT = 'https://live-subtitles.com'
LOCALE_ORDER = ['en','ru','fr','es','de','it','ja','ko','zh','ar','hi','pt','pl','nl','tr','uk']

# Map article_slug -> set of locales that have it
article_locales = defaultdict(set)
files_per_article = defaultdict(dict)  # slug -> {locale: filepath}
for hf in glob.glob('articles/*/*.html'):
    norm = hf.replace(os.sep, '/').split('/')
    if len(norm) != 3: continue
    loc, fname = norm[1], norm[2]
    if fname == 'index.html' or loc not in LOCALE_ORDER: continue
    article_locales[fname].add(loc)
    files_per_article[fname][loc] = hf

# regex: capture entire run of <link rel="alternate" hreflang="..."> lines
re_block = re.compile(
    r'(?:[\t ]*<link\s+rel=["\']alternate["\']\s+hreflang=["\'][^"\']+["\']\s+href=["\'][^"\']+["\']\s*/?>\s*\n)+',
    re.I
)

def build_block(slug, locales, indent='    '):
    locales = sorted(locales, key=lambda l: LOCALE_ORDER.index(l) if l in LOCALE_ORDER else 99)
    lines = []
    if 'en' in locales:
        lines.append(f'{indent}<link rel="alternate" hreflang="x-default" href="{ROOT}/articles/en/{slug}" />')
    else:
        # fallback: x-default to first locale alphabetically
        lines.append(f'{indent}<link rel="alternate" hreflang="x-default" href="{ROOT}/articles/{locales[0]}/{slug}" />')
    for loc in locales:
        lines.append(f'{indent}<link rel="alternate" hreflang="{loc}" href="{ROOT}/articles/{loc}/{slug}" />')
    return '\n'.join(lines) + '\n'

stats = {'rewritten': 0, 'inserted': 0, 'unchanged': 0}
for slug, locs in article_locales.items():
    block = build_block(slug, locs)
    for loc, fp in files_per_article[slug].items():
        text = open(fp, encoding='utf-8', errors='ignore').read()
        head_end = text.lower().find('</head>')
        if head_end < 0:
            print(f'WARN no </head>: {fp}'); continue
        head = text[:head_end]
        tail = text[head_end:]
        new_head, n = re_block.subn(block, head, count=1)
        if n == 0:
            # No existing block — insert before </head>, after canonical or at end of head
            cm = re.search(r'(<link\s+rel=["\']canonical["\'][^>]*>\s*\n)', head, re.I)
            if cm:
                new_head = head[:cm.end()] + block + head[cm.end():]
            else:
                new_head = head + block
            stats['inserted'] += 1
        else:
            if new_head == head:
                stats['unchanged'] += 1
                continue
            stats['rewritten'] += 1
        open(fp, 'w', encoding='utf-8').write(new_head + tail)

print('STATS:', stats)
