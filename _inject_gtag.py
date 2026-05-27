"""Inject gtag.js + gtag-init.js + cid-tracker.js into every HTML file.

Idempotent:
- skips files that already reference googletagmanager.com/gtag/js for the gtag block
- skips files that already reference cid-tracker.js for the cid block

Inserts right after the <meta name="viewport"> tag (canonical location in template).
"""
import os
import re
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))

GTAG_BLOCK = """
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=AW-17344614830"></script>
    <script src="/gtag-init.js"></script>"""

CID_BLOCK = """
    <!-- cid passthrough + auto conversion onclick on Store links -->
    <script src="/cid-tracker.js" defer></script>"""

VIEWPORT_RE = re.compile(r'(<meta\s+name="viewport"[^>]*>)', re.IGNORECASE)


def process(path: str) -> str:
    with open(path, 'r', encoding='utf-8') as f:
        html = f.read()

    has_gtag = 'googletagmanager.com/gtag/js' in html
    has_cid = 'cid-tracker.js' in html

    if has_gtag and has_cid:
        return 'skip'

    m = VIEWPORT_RE.search(html)
    if not m:
        return 'no-viewport'

    inject = ''
    if not has_gtag:
        inject += GTAG_BLOCK
    if not has_cid:
        inject += CID_BLOCK

    new_html = html[:m.end()] + inject + html[m.end():]
    with open(path, 'w', encoding='utf-8', newline='') as f:
        f.write(new_html)

    if not has_gtag and not has_cid:
        return 'injected-both'
    if not has_gtag:
        return 'injected-gtag'
    return 'injected-cid'


def main():
    dry = '--dry-run' in sys.argv
    stats = {'skip': 0, 'injected-both': 0, 'injected-gtag': 0, 'injected-cid': 0, 'no-viewport': 0}
    for dirpath, _, filenames in os.walk(ROOT):
        for fn in filenames:
            if not fn.endswith('.html'):
                continue
            path = os.path.join(dirpath, fn)
            if dry:
                with open(path, 'r', encoding='utf-8') as f:
                    html = f.read()
                has_gtag = 'googletagmanager.com/gtag/js' in html
                has_cid = 'cid-tracker.js' in html
                if has_gtag and has_cid:
                    stats['skip'] += 1
                elif not has_gtag and not has_cid:
                    stats['injected-both'] += 1
                elif not has_gtag:
                    stats['injected-gtag'] += 1
                else:
                    stats['injected-cid'] += 1
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
