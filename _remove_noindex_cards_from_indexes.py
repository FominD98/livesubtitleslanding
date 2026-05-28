"""Remove article-19/20/21/22 cards from non-EN articles/<locale>/index.html.
Those targets are noindex; index pages should not link to them.
Idempotent.
"""
import os
import re

ROOT = os.path.dirname(os.path.abspath(__file__))
LOCALES = ['ru', 'ja', 'zh', 'ko', 'ar', 'hi', 'de', 'es', 'fr', 'it', 'pl', 'pt', 'tr', 'uk', 'nl']

# Match a full <div class="article-card">...</div> block (non-greedy) that contains article-19/20/21/22 href
CARD_RE = re.compile(
    r'\s*<div class="article-card"[^>]*>\s*\n'
    r'\s*<a href="article-(19|20|21|22)\.html"[^>]*>.*?</a>\s*\n'
    r'(?:\s*<div[^>]*>.*?</div>\s*\n)+'
    r'\s*</div>\s*\n',
    re.DOTALL
)


def fix_file(path: str) -> int:
    with open(path, 'r', encoding='utf-8') as f:
        text = f.read()
    new, n = CARD_RE.subn('', text)
    if n > 0:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new)
    return n


def main():
    total_cards_removed = 0
    files_changed = 0
    for L in LOCALES:
        fp = os.path.join(ROOT, 'articles', L, 'index.html')
        if not os.path.exists(fp):
            continue
        n = fix_file(fp)
        if n > 0:
            files_changed += 1
            total_cards_removed += n
            print(f'REMOVED {n} cards from articles/{L}/index.html')
        else:
            print(f'unchanged articles/{L}/index.html')
    print(f'\nTotal: {total_cards_removed} cards removed across {files_changed} files')


if __name__ == '__main__':
    main()
