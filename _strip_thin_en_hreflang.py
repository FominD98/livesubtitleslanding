"""For articles/en/article-19..22, keep only x-default + en hreflang.
The non-EN locale versions are now noindex, so they should not appear in this
hreflang cluster."""
import os, re

ROOT = os.path.dirname(os.path.abspath(__file__))
FILES = ['article-19.html','article-20.html','article-21.html','article-22.html']

re_alt = re.compile(
    r'[\t ]*<link\s+rel=["\']alternate["\']\s+hreflang=["\']([^"\']+)["\']\s+href=["\']([^"\']+)["\']\s*/?>\s*\n',
    re.I
)

for fn in FILES:
    fp = os.path.join(ROOT, 'articles', 'en', fn)
    if not os.path.exists(fp): continue
    text = open(fp, encoding='utf-8').read()
    head_end = text.lower().find('</head>')
    if head_end < 0: continue
    head = text[:head_end]
    tail = text[head_end:]
    def keep(m):
        lang = m.group(1)
        if lang in ('x-default','en'):
            return m.group(0)
        return ''
    new_head, _ = re_alt.subn(keep, head)
    if new_head != head:
        open(fp, 'w', encoding='utf-8').write(new_head + tail)
        print(f'TRIMMED: articles/en/{fn}')
    else:
        print(f'SKIP unchanged: articles/en/{fn}')
