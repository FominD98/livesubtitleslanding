"""Add <meta name="robots" content="noindex, follow"> to non-EN locale copies of
articles 19-22. The EN versions are now substantively expanded; locales are not
translated and would otherwise be flagged as 'Duplicate, Google chose different canonical'.
"""
import os, re, glob

ROOT = os.path.dirname(os.path.abspath(__file__))
THIN_FILES = ['article-19.html', 'article-20.html', 'article-21.html', 'article-22.html']
LOCALES = ['ru','fr','es','de','it','ja','ko','zh','ar','hi','pt','pl','nl','tr','uk']

re_robots = re.compile(r'<meta\s+name=["\']robots["\']\s+content=["\'][^"\']*["\']\s*/?>', re.I)

count = 0
for loc in LOCALES:
    for fname in THIN_FILES:
        fp = os.path.join(ROOT, 'articles', loc, fname)
        if not os.path.exists(fp):
            continue
        text = open(fp, encoding='utf-8').read()
        new_meta = '<meta name="robots" content="noindex, follow">'
        if 'noindex' in text:
            print(f'SKIP already noindex: articles/{loc}/{fname}')
            continue
        new, n = re_robots.subn(new_meta, text, count=1)
        if n == 0:
            # insert before </head>
            new = text.replace('</head>', '    ' + new_meta + '\n</head>', 1)
        if new == text:
            print(f'SKIP no change: articles/{loc}/{fname}')
            continue
        open(fp, 'w', encoding='utf-8').write(new)
        count += 1
        print(f'NOINDEX: articles/{loc}/{fname}')

print(f'Total updated: {count}')
