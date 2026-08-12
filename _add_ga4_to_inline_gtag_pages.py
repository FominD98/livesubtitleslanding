"""
Добавляет config GA4 на страницы, где gtag инициализируется инлайном, а не через
общий /gtag-init.js. Остальные 892 страницы покрыты правкой самого gtag-init.js.

Идемпотентен: если G-... на странице уже есть, файл не трогается.

Запуск:
    python _add_ga4_to_inline_gtag_pages.py --dry-run
    python _add_ga4_to_inline_gtag_pages.py
"""
import argparse
import re
from pathlib import Path

HERE = Path(__file__).resolve().parent

GA4_ID = "G-2NVMGPL64K"
ADS_TAG = "AW-17344614830"

ANCHOR = f"gtag('config', '{ADS_TAG}');"
INSERT = ANCHOR + f"\n\n        gtag('config', '{GA4_ID}');"


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    files = [p for p in HERE.rglob("*.html") if "__pycache__" not in p.parts]

    inline = skipped = patched = 0
    for path in files:
        html = path.read_text(encoding="utf-8", errors="strict")

        if not re.search(r"gtag\(\s*'config',\s*'AW-", html):
            continue
        inline += 1

        if GA4_ID in html:
            skipped += 1
            continue

        if ANCHOR not in html:
            print(f"  ВНИМАНИЕ: якорь не найден, пропуск: {path.relative_to(HERE)}")
            continue

        patched += 1
        if not args.dry_run:
            path.write_text(html.replace(ANCHOR, INSERT, 1), encoding="utf-8")

    print("ПЛАН (ничего не записано)" if args.dry_run else "ПРИМЕНЕНО")
    print(f"  страниц с инлайновым gtag: {inline}")
    print(f"  уже с GA4 (пропущено):     {skipped}")
    print(f"  добавлено GA4:             {patched}")


if __name__ == "__main__":
    main()
