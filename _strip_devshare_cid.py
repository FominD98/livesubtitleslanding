"""Strip hardcoded ?cid=DevShareMCLPCS from MS Store URLs site-wide.

After this, cid-tracker.js owns cid attribution: either campaign UTM or 'site_organic'.
Idempotent.
"""
import os

ROOT = os.path.dirname(os.path.abspath(__file__))

PATTERNS = [
    '?cid=DevShareMCLPCS',
    '&cid=DevShareMCLPCS',
]

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
            new = html
            for p in PATTERNS:
                new = new.replace(p, '')
            if new != html:
                with open(path, 'w', encoding='utf-8', newline='') as f:
                    f.write(new)
                changed += 1
    print(f"Scanned {scanned} HTML files, stripped DevShareMCLPCS from {changed}.")


if __name__ == '__main__':
    main()
