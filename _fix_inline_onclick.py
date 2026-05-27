"""Replace hardcoded URL in inline gtag_report_conversion onclick with this.href.

Ensures cid-tracker's rewritten href reaches the Store, not the bare URL.
"""
import os
import re

ROOT = os.path.dirname(os.path.abspath(__file__))

PATTERN = re.compile(
    r'''onclick="return gtag_report_conversion\((['"])[^'"]+\1\);"''',
    re.IGNORECASE
)
REPLACEMENT = 'onclick="return gtag_report_conversion(this.href);"'


def main():
    changed = 0
    scanned = 0
    for dirpath, _, filenames in os.walk(ROOT):
        for fn in filenames:
            if not fn.endswith('.html'):
                continue
            path = os.path.join(dirpath, fn)
            scanned += 1
            with open(path, 'r', encoding='utf-8') as f:
                html = f.read()
            new = PATTERN.sub(REPLACEMENT, html)
            if new != html:
                with open(path, 'w', encoding='utf-8', newline='') as f:
                    f.write(new)
                changed += 1
    print(f"Scanned {scanned} files, normalized inline onclick in {changed}.")


if __name__ == '__main__':
    main()
