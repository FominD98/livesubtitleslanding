"""Inject Yandex.Metrika counter into every HTML file that doesn't have it yet.

Idempotent:
- skips files that already reference mc.yandex.ru (inline snippet or external script)
- otherwise inserts the YM script tag + noscript fallback after <meta name="viewport">
"""
import os
import re
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))

YM_BLOCK = """
    <!-- Yandex.Metrika counter -->
    <script src="/yandex-metrika.js"></script>
    <noscript><div><img src="https://mc.yandex.ru/watch/101009280" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
    <!-- /Yandex.Metrika counter -->"""

VIEWPORT_RE = re.compile(r'(<meta\s+name="viewport"[^>]*>)', re.IGNORECASE)


def process(path: str) -> str:
    with open(path, 'r', encoding='utf-8') as f:
        html = f.read()

    if 'mc.yandex.ru' in html or 'yandex-metrika.js' in html:
        return 'skip'

    m = VIEWPORT_RE.search(html)
    if not m:
        return 'no-viewport'

    new_html = html[:m.end()] + YM_BLOCK + html[m.end():]
    with open(path, 'w', encoding='utf-8', newline='') as f:
        f.write(new_html)
    return 'injected'


def main():
    dry = '--dry-run' in sys.argv
    stats = {'skip': 0, 'injected': 0, 'no-viewport': 0}
    for dirpath, _, filenames in os.walk(ROOT):
        for fn in filenames:
            if not fn.endswith('.html'):
                continue
            path = os.path.join(dirpath, fn)
            if dry:
                with open(path, 'r', encoding='utf-8') as f:
                    html = f.read()
                if 'mc.yandex.ru' in html or 'yandex-metrika.js' in html:
                    stats['skip'] += 1
                elif not VIEWPORT_RE.search(html):
                    stats['no-viewport'] += 1
                else:
                    stats['injected'] += 1
            else:
                result = process(path)
                stats[result] += 1
                if result == 'no-viewport':
                    print(f'no-viewport: {path}')

    print(f"\n{'DRY-RUN ' if dry else ''}Summary:")
    for k, v in stats.items():
        print(f"  {k}: {v}")


if __name__ == '__main__':
    main()
