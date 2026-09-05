"""Add article-28 and article-29 cards to articles/en/index.html.

EN only, on purpose — see the header of _generate_articles_28_29.py. Sitemap is
not touched here: generate-sitemap.ps1 discovers articles/<lang>/article-*.html
from disk and emits hreflang only for the locales that actually exist.

Idempotent.
"""
import os

ROOT = os.path.dirname(os.path.abspath(__file__))
INDEX = os.path.join(ROOT, 'articles', 'en', 'index.html')

CARDS = [
    (29, {
        'title': 'Web Captioner Alternatives in 2026: What to Use Now That It Is Gone',
        'date_iso': '2026-09-05',
        'date_label': 'September 5, 2026',
        'desc': 'Web Captioner went offline in 2023. Here are the real alternatives in 2026 for churches, classrooms, events and streams — browser tools, desktop overlays, OBS and platform-native captions compared.',
    }),
    (28, {
        'title': 'Twitch Closed Captions in 2026: Every Option Compared',
        'date_iso': '2026-09-05',
        'date_label': 'September 5, 2026',
        'desc': 'Every way to get closed captions on a Twitch stream in 2026 — the OBS plugin, Stream Closed Captioner, browser-source services and viewer-side apps, compared on cost, VOD support and translation.',
    }),
]

ANCHOR = '<div class="article-card" itemscope itemtype="https://schema.org/Article">'


def card(num: int, c: dict) -> str:
    return (
        '        <div class="article-card" itemscope itemtype="https://schema.org/Article">\n'
        f'            <a href="article-{num}.html" class="article-title" itemprop="headline">{c["title"]}</a>\n'
        f'            <div class="article-date" itemprop="datePublished" content="{c["date_iso"]}">{c["date_label"]}</div>\n'
        f'            <div class="article-desc" itemprop="description">{c["desc"]}</div>\n'
        '        </div>\n'
    )


def main():
    with open(INDEX, 'r', encoding='utf-8') as f:
        text = f.read()

    for num, c in CARDS:
        if f'article-{num}.html' in text:
            print(f'  article-{num}: already present, skipped')
            continue
        idx = text.find(ANCHOR)
        assert idx != -1, 'no article card found in the EN index'
        line_start = text.rfind('\n', 0, idx) + 1
        text = text[:line_start] + card(num, c) + text[line_start:]
        print(f'  article-{num}: card added')

    with open(INDEX, 'w', encoding='utf-8') as f:
        f.write(text)


if __name__ == '__main__':
    main()
