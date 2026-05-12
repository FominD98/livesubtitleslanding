"""Remove the entire hreflang cluster from noindexed locale copies of
article-19..22. These pages should not appear in any hreflang graph, since
they are explicitly excluded from indexing.
"""
import os, re, glob

ROOT = os.path.dirname(os.path.abspath(__file__))
THIN = ('article-19.html','article-20.html','article-21.html','article-22.html')
LOCALES = ('ru','fr','es','de','it','ja','ko','zh','ar','hi','pt','pl','nl','tr','uk')

re_alt_block = re.compile(
    r'(?:[\t ]*<link\s+rel=["\']alternate["\']\s+hreflang=["\'][^"\']+["\']\s+href=["\'][^"\']+["\']\s*/?>\s*\n)+',
    re.I
)

stats = {'stripped':0, 'unchanged':0, 'missing':0}
for loc in LOCALES:
    for fname in THIN:
        fp = os.path.join(ROOT, 'articles', loc, fname)
        if not os.path.exists(fp):
            stats['missing'] += 1; continue
        text = open(fp, encoding='utf-8').read()
        new = re_alt_block.sub('', text, count=1)
        if new != text:
            open(fp, 'w', encoding='utf-8').write(new)
            stats['stripped'] += 1
        else:
            stats['unchanged'] += 1

print('STATS:', stats)
