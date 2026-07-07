#!/usr/bin/env python3
"""Normalize the hero "Try Free" CTA across root + 15 locales.

Bug fixed: the hero CTA on the root page was hardcoded to the Microsoft Store
(Windows only), sending Mac/iPhone visitors to the wrong store. The navbar CTA
already routes per-platform via routeTryFree(); the hero CTA was left out.

Target state for every index.html (root + locales):
  - hero anchor: href="#download" (safe no-JS fallback = all platforms shown),
    onclick conversion tracking, id="heroTryFree"
  - routeTryFree() routes BOTH navTryFree and heroTryFree to the visitor's
    actual store (Win->MS Store, Mac->Mac App Store, iOS->App Store,
    Android/unknown -> #download).
Idempotent.
"""
import re
import pathlib

LOCALES = ["ar","de","es","fr","hi","it","ja","ko","nl","pl","pt","ru","tr","uk","zh"]
FILES = ["index.html"] + [f"{l}/index.html" for l in LOCALES]

HERO_OPEN_RE = re.compile(r'<a\s+[^>]*id="heroTryFree"[^>]*>')
NEW_HERO_OPEN = (
    '<a href="#download" onclick="return gtag_report_conversion(this.href);" '
    'id="heroTryFree" class="btn-download-free" data-translate="header.downloadFree">'
)

root = pathlib.Path(__file__).parent

for rel in FILES:
    p = root / rel
    html = p.read_text(encoding="utf-8")
    orig = html

    # 1) Normalize the hero CTA opening tag (preserves inner text after the tag).
    m = HERO_OPEN_RE.search(html)
    if not m:
        print(f"WARN  {rel}: heroTryFree anchor not found, skipped")
    else:
        html = html[:m.start()] + NEW_HERO_OPEN + html[m.end():]

    # 2) Add heroTryFree to the routeTryFree() routing array (if not already there).
    if "'heroTryFree'" not in html and "'navTryFree', 'heroTryFree'" not in html:
        html = html.replace(
            "['navTryFree'].forEach(function (id) {",
            "['navTryFree', 'heroTryFree'].forEach(function (id) {",
        )

    # 3) In the #download fallback branch (Android/no-store), drop the onclick
    #    conversion handler. gtag_report_conversion() returns false + window.open(),
    #    so leaving onclick on a "#download" link opens a new tab instead of
    #    smooth-scrolling to the download section. (also fixes the navbar CTA.)
    OLD_BRANCH = "{ el.setAttribute('href', '#download'); el.removeAttribute('target'); }"
    NEW_BRANCH = "{ el.setAttribute('href', '#download'); el.removeAttribute('target'); el.removeAttribute('onclick'); }"
    if OLD_BRANCH in html:
        html = html.replace(OLD_BRANCH, NEW_BRANCH)

    if html != orig:
        p.write_text(html, encoding="utf-8")
        print(f"OK    {rel}")
    else:
        print(f"--    {rel}: no change")
