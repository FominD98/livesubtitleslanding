"""
Корректность hreflang по всему сайту.

Проверяются ровно те ошибки, из-за которых Google перестаёт доверять кластеру:
отсутствие обратной ссылки, отсутствие самоссылки, цель-404, цель под noindex,
невалидный код языка, расхождение с canonical. Само по себе число связей в
кластере дефектом не является — связывать полноценные переводы и есть
назначение hreflang.

Запуск:
    python _audit_hreflang.py
Код возврата 1, если найдена хотя бы одна ошибка.
"""
import collections
import glob
import os
import re
import sys
from urllib.parse import urlparse

HERE = os.path.dirname(os.path.abspath(__file__))
os.chdir(HERE)

VALID_CODE = re.compile(r"^(x-default|[a-z]{2}(-[a-zA-Z]{2})?)$")


def to_path(url: str) -> str:
    p = urlparse(url).path
    if p.endswith("/"):
        p += "index.html"
    return p.lstrip("/")


def load():
    pages = {}
    for f in glob.glob("**/*.html", recursive=True):
        if "__pycache__" in f:
            continue
        f = f.replace("\\", "/")
        s = open(f, encoding="utf-8", errors="replace").read()
        canon = re.search(r'(?is)<link[^>]*rel=["\']canonical["\'][^>]*href=["\']([^"\']+)', s)
        pages[f] = {
            "links": re.findall(
                r'(?is)<link[^>]*rel=["\']alternate["\'][^>]*hreflang=["\']([^"\']+)["\']'
                r'[^>]*href=["\']([^"\']+)', s),
            "canon": canon.group(1) if canon else None,
            "noindex": bool(re.search(r'name=["\']robots["\'][^>]*noindex', s, re.I)),
        }
    return pages


def main():
    pages = load()
    with_hl = {f: d for f, d in pages.items() if d["links"]}
    print(f"страниц всего: {len(pages)}, с hreflang: {len(with_hl)}")

    bad_code = collections.Counter()
    missing, no_self, not_recip, to_noindex, canon_bad = [], [], [], [], []

    for f, d in with_hl.items():
        targets = {}
        for code, url in d["links"]:
            if not VALID_CODE.match(code):
                bad_code[code] += 1
            p = to_path(url)
            targets[code] = p
            if p not in pages:
                missing.append((f, code, p))
            elif pages[p]["noindex"]:
                to_noindex.append((f, code, p))

        if f not in set(targets.values()):
            no_self.append(f)

        for code, p in targets.items():
            if code == "x-default" or p == f or p not in pages:
                continue
            if f not in {to_path(u) for _, u in pages[p]["links"]}:
                not_recip.append((f, p))

        if d["canon"] and to_path(d["canon"]) != f:
            canon_bad.append((f, d["canon"]))

    checks = [
        ("невалидный код языка", [f"{c} x{n}" for c, n in bad_code.items()]),
        ("цель не существует", missing),
        ("нет самоссылки", no_self),
        ("нет обратной ссылки", not_recip),
        ("цель под noindex", to_noindex),
        ("canonical не совпадает с URL", canon_bad),
    ]

    total = 0
    for title, items in checks:
        total += len(items)
        mark = "ok  " if not items else "FAIL"
        print(f"  {mark} {title}: {len(items)}")
        for x in items[:10]:
            print(f"        {x}")
        if len(items) > 10:
            print(f"        ... ещё {len(items) - 10}")

    print("\nОшибок нет." if not total else f"\nВсего ошибок: {total}")
    return 1 if total else 0


if __name__ == "__main__":
    sys.exit(main())
