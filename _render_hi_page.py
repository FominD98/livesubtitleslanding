from pathlib import Path
import json
import re
import textwrap

ROOT = Path(r"C:\pet\livesubtitleslanding")
OUT_DIR = ROOT / "hi"


def source_parts(filename):
    src = (ROOT / filename).read_text(encoding="utf-8")
    hreflang = "".join(
        re.findall(r'    <link rel="alternate" hreflang=".*?" href=".*?" />\n', src)
    )
    if not hreflang:
        raise RuntimeError(f"No hreflang block found for {filename}")
    style_match = re.search(r"    <style>\n.*?    </style>", src, re.S)
    if not style_match:
        raise RuntimeError(f"No style block found for {filename}")
    return hreflang.rstrip("\n"), style_match.group(0)


def jsonld_block(obj):
    data = json.dumps(obj, ensure_ascii=False, indent=2)
    return (
        '    <script type="application/ld+json">\n'
        + textwrap.indent(data, "    ")
        + "\n    </script>"
    )


def howto(name, description, steps):
    return {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": name,
        "description": description,
        "step": [
            {"@type": "HowToStep", "position": i + 1, "name": step_name, "text": step_text}
            for i, (step_name, step_text) in enumerate(steps)
        ],
    }


def faq(items):
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": q,
                "acceptedAnswer": {"@type": "Answer", "text": a},
            }
            for q, a in items
        ],
    }


def render(filename, page):
    hreflang, style = source_parts(filename)
    canonical = f"https://live-subtitles.com/hi/{filename}"
    jsonld = "\n\n".join(jsonld_block(obj) for obj in page["jsonld"])
    body = page["body"].strip("\n")
    html = f'''<!DOCTYPE html>
<html lang="hi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{page["title"]}</title>
    <meta name="description" content="{page["description"]}">
    <meta name="keywords" content="{page["keywords"]}">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="{canonical}" />
{hreflang}

    <meta property="og:type" content="website">
    <meta property="og:title" content="{page["og_title"]}">
    <meta property="og:description" content="{page["og_description"]}">
    <meta property="og:url" content="{canonical}">
    <meta property="og:image" content="https://live-subtitles.com/preview.png">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{page["twitter_title"]}">
    <meta name="twitter:description" content="{page["twitter_description"]}">
    <meta name="twitter:image" content="https://live-subtitles.com/preview.png">

{jsonld}

{style}
</head>
<body>
{body}
</body>
</html>
'''
    (OUT_DIR / filename).write_text(html, encoding="utf-8", newline="\n")
