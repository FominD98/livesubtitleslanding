"""Add missing article-24 locale URLs (pt, tr, uk, ar, hi, nl) to sitemap.xml
and also update hreflang clusters in already-present article-24 entries.

Also fixes hreflang in 10 already-present article-24 sitemap entries to include
the new 6 locale alternates.
"""
import os
import re

ROOT = os.path.dirname(os.path.abspath(__file__))
ALL_LOCALES = ['en', 'ru', 'ja', 'zh', 'ko', 'ar', 'hi', 'de', 'es', 'fr', 'it', 'pl', 'pt', 'tr', 'uk', 'nl']
MISSING_LOCALES = ['pt', 'tr', 'uk', 'ar', 'hi', 'nl']


def build_block(loc_locale: str) -> str:
    hreflang_lines = ['        <xhtml:link rel="alternate" hreflang="x-default" href="https://live-subtitles.com/articles/en/article-24.html" />']
    for L in ALL_LOCALES:
        hreflang_lines.append(f'        <xhtml:link rel="alternate" hreflang="{L}" href="https://live-subtitles.com/articles/{L}/article-24.html" />')
    loc_url = f'https://live-subtitles.com/articles/{loc_locale}/article-24.html'
    return (
        '    <url>\n'
        f'        <loc>{loc_url}</loc>\n'
        f'        <lastmod>2026-05-28</lastmod>\n'
        '        <changefreq>weekly</changefreq>\n'
        '        <priority>0.7</priority>\n'
        + '\n'.join(hreflang_lines) + '\n'
        '    </url>'
    )


def main():
    fp = os.path.join(ROOT, 'sitemap.xml')
    with open(fp, 'r', encoding='utf-8') as f:
        text = f.read()

    # Append missing locale blocks
    blocks = [build_block(L) for L in MISSING_LOCALES]
    new_text = text.replace('</urlset>', '\n'.join(blocks) + '\n</urlset>')

    # Also fix hreflang in existing article-24 blocks to include all 16 locales.
    # Existing 10 blocks were built with only 10 hreflang entries; rewrite them with full 16-way cluster.
    # We do this by finding each existing article-24 block and replacing it.
    existing_locales = ['en', 'ru', 'ja', 'zh', 'ko', 'de', 'es', 'fr', 'it', 'pl']
    for L in existing_locales:
        # Match the entire <url>...</url> block whose <loc> is this locale's article-24
        pattern = re.compile(
            r'    <url>\s*\n'
            r'        <loc>https://live-subtitles\.com/articles/' + re.escape(L) + r'/article-24\.html</loc>\s*\n'
            r'        <lastmod>[^<]+</lastmod>\s*\n'
            r'        <changefreq>weekly</changefreq>\s*\n'
            r'        <priority>0\.7</priority>\s*\n'
            r'(?:        <xhtml:link[^>]+/>\s*\n)+'
            r'    </url>',
            re.MULTILINE
        )
        new_text = pattern.sub(build_block(L), new_text)

    with open(fp, 'w', encoding='utf-8') as f:
        f.write(new_text)
    print(f'Added {len(MISSING_LOCALES)} missing article-24 URL blocks; refreshed hreflang in {len(existing_locales)} existing blocks.')


if __name__ == '__main__':
    main()
