"""Reassign per-article authors. Maps article-N -> Person across all locales.
Idempotent: re-running overwrites existing author with the same mapped target.
"""
import os, re, glob

ROOT = os.path.dirname(os.path.abspath(__file__))

AUTHORS = {
    'sofia':   {'name': 'Sofia Almeida',   'slug': 'sofia-almeida',   'jobTitle': 'Applied Linguistics Lead, Live Subtitles'},
    'mei':     {'name': 'Mei Lin Chen',    'slug': 'mei-lin-chen',    'jobTitle': 'Speech Recognition Engineer, Live Subtitles'},
    'aarav':   {'name': 'Aarav Sharma',    'slug': 'aarav-sharma',    'jobTitle': 'Streaming Platforms Engineer, Live Subtitles'},
    'lukas':   {'name': 'Lukas Bergström', 'slug': 'lukas-bergstrom', 'jobTitle': 'Real-time Pipelines Engineer, Live Subtitles'},
    'hiroshi': {'name': 'Hiroshi Tanaka',  'slug': 'hiroshi-tanaka',  'jobTitle': 'Gaming Overlay Engineer, Live Subtitles'},
}

# article-N -> author key
MAPPING = {
    1: 'sofia', 2: 'sofia', 3: 'sofia', 7: 'sofia', 10: 'sofia',
    4: 'mei',   6: 'mei',   9: 'mei',
    5: 'aarav', 8: 'aarav', 11: 'aarav', 13: 'aarav', 17: 'aarav',
    12: 'lukas', 14: 'lukas', 16: 'lukas', 18: 'lukas',
    15: 'hiroshi', 19: 'hiroshi', 20: 'hiroshi', 21: 'hiroshi', 22: 'hiroshi',
}

# Regexes for the patterns we wrote earlier (Daniel Formind)
re_author_jsonld_inline = re.compile(
    r'"author"\s*:\s*\{\s*"@type"\s*:\s*"Person"\s*,\s*"name"\s*:\s*"[^"]+"\s*,\s*"url"\s*:\s*"https://live-subtitles\.com/about/team/[^"]+"\s*,\s*"jobTitle"\s*:\s*"[^"]+"\s*\}'
)
# multiline form (existed in some files)
re_author_jsonld_multi = re.compile(
    r'"author"\s*:\s*\{\s*\n?\s*"@type"\s*:\s*"Person"\s*,?\s*\n?\s*"name"\s*:\s*"[^"]+"\s*\n?\s*\}',
    re.S
)
# byline div we previously injected
re_byline = re.compile(
    r'<div class="article-author"[^>]*>.*?</div>',
    re.S
)

def author_jsonld_inline(a):
    return (
        '"author": { "@type": "Person", '
        f'"name": "{a["name"]}", '
        f'"url": "https://live-subtitles.com/about/team/{a["slug"]}.html", '
        f'"jobTitle": "{a["jobTitle"]}"'
        ' }'
    )

def byline_html(a):
    return (
        '<div class="article-author" style="color:#aaa; font-size:0.95rem; margin-bottom:1.5rem;">'
        f'By <a href="/about/team/{a["slug"]}.html" rel="author" style="color:#00b8ff; text-decoration:none;">{a["name"]}</a> '
        f'&middot; {a["jobTitle"]}'
        '</div>'
    )

def article_number(filename):
    m = re.match(r'article-(\d+)\.html$', filename)
    return int(m.group(1)) if m else None

stats = {'updated': 0, 'unchanged': 0, 'no_mapping': 0}

for fp in sorted(glob.glob(os.path.join(ROOT, 'articles', '*', 'article-*.html'))):
    fname = os.path.basename(fp)
    n = article_number(fname)
    if n is None or n not in MAPPING:
        stats['no_mapping'] += 1; continue
    a = AUTHORS[MAPPING[n]]
    orig = open(fp, encoding='utf-8').read()
    text = orig
    text = re_author_jsonld_inline.sub(author_jsonld_inline(a), text)
    text = re_author_jsonld_multi.sub(author_jsonld_inline(a), text)
    text = re_byline.sub(byline_html(a), text)
    if text != orig:
        open(fp, 'w', encoding='utf-8').write(text)
        stats['updated'] += 1
    else:
        stats['unchanged'] += 1

print('STATS:', stats)
