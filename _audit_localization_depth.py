"""
Полнота локализованных статей относительно английского оригинала.

Меряется СТРУКТУРА (h2/h3/p/li/table), а не число символов: китайский и
японский передают тот же смысл заметно меньшим числом знаков, поэтому
посимвольное сравнение между письменностями даёт ложные "тонкие" страницы.
Дополнительно считается доля латиницы внутри нелатинских локалей — прямой
признак недопереведённых кусков.

Запуск:
    python _audit_localization_depth.py [порог]      # порог в процентах, по умолчанию 60
Код возврата 1, если есть страницы ниже порога.
"""
import collections
import glob
import html
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
os.chdir(HERE)

NON_LATIN = {"ru", "uk", "ja", "zh", "zh-tw", "ko", "ar", "hi", "he", "th"}

# Доля латиницы выше этого порога в нелатинской локали означает, что внутри
# остались английские абзацы. Исключение — статьи, где английские фразы сами
# являются предметом текста.
LATIN_SUSPECT = 0.35


def strip_chrome(s: str) -> str:
    return re.sub(r"(?is)<(script|style|nav|footer|header)[^>]*>.*?</\1>", " ", s)


def structure(s: str) -> dict:
    body = strip_chrome(s)
    return {tag: len(re.findall(rf"(?i)<{tag}[\s>]", body))
            for tag in ("h2", "h3", "p", "li", "table")}


def latin_share(s: str) -> float:
    t = html.unescape(re.sub(r"(?s)<[^>]+>", " ", strip_chrome(s)))
    letters = [c for c in t if c.isalpha()]
    if not letters:
        return 0.0
    return sum(1 for c in letters if "a" <= c.lower() <= "z") / len(letters)


def main():
    threshold = (int(sys.argv[1]) if len(sys.argv) > 1 else 60) / 100

    arts = collections.defaultdict(dict)
    for f in glob.glob("articles/*/article-*.html"):
        f = f.replace("\\", "/")
        m = re.match(r"articles/([a-z-]+)/(article-\d+)\.html$", f)
        if not m:
            continue
        s = open(f, encoding="utf-8", errors="replace").read()
        arts[m.group(2)][m.group(1)] = {
            "struct": structure(s),
            "noindex": bool(re.search(r'name=["\']robots["\'][^>]*noindex', s, re.I)),
            "latin": latin_share(s),
            "file": f,
        }

    rows = []
    for art, locs in sorted(arts.items()):
        base = locs.get("en")
        if not base:
            continue
        base_units = sum(base["struct"].values())
        if not base_units:
            continue
        for loc, d in locs.items():
            if loc == "en" or d["noindex"]:
                continue
            rows.append((sum(d["struct"].values()) / base_units, loc, d))

    by_loc = collections.defaultdict(list)
    for r in rows:
        by_loc[r[1]].append(r)

    print(f"индексируемых локализованных статей: {len(rows)}\n")
    print(f"  {'локаль':<8}{'стр':>5}{'медиана':>10}{'мин':>7}{'латиница':>11}")
    for loc, rs in sorted(by_loc.items(), key=lambda x: sorted(r[0] for r in x[1])[len(x[1]) // 2]):
        vals = sorted(r[0] for r in rs)
        lat = sorted(r[2]["latin"] for r in rs)
        print(f"  {loc:<8}{len(rs):>5}{vals[len(vals) // 2] * 100:>9.0f}%"
              f"{vals[0] * 100:>6.0f}%{lat[len(lat) // 2] * 100:>10.1f}%")

    thin = sorted([r for r in rows if r[0] < threshold])
    print(f"\nтоньше {threshold * 100:.0f}% от английской версии: {len(thin)}")
    for ratio, loc, d in thin:
        print(f"  {ratio * 100:>3.0f}%  {d['file']}")

    susp = [r for r in rows if r[1] in NON_LATIN and r[2]["latin"] > LATIN_SUSPECT]
    print(f"\nподозрение на недоперевод (латиницы > {LATIN_SUSPECT * 100:.0f}%): {len(susp)}")
    for ratio, loc, d in sorted(susp, key=lambda r: -r[2]["latin"]):
        print(f"  латиницы {d['latin'] * 100:>4.1f}%  структура {ratio * 100:>3.0f}%  {d['file']}")

    return 1 if thin else 0


if __name__ == "__main__":
    sys.exit(main())
