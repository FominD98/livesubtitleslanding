"""For every articles/<locale>/article-N.html:
  - replace JSON-LD author 'Editorial Team' with structured Person (Daniel Formind)
  - set dateModified to today's ISO date (in JSON-LD)
  - keep datePublished if present (else set to today)
  - inject visible 'By Daniel Formind' line next to the date
Idempotent.
"""
import os, re, glob, json, datetime

ROOT = os.path.dirname(os.path.abspath(__file__))
TODAY = datetime.date.today().isoformat()

AUTHOR_JSONLD = {
    "@type": "Person",
    "name": "Daniel Formind",
    "url": "https://live-subtitles.com/about/team/daniel-formind.html",
    "jobTitle": "Founder & Engineer, Live Subtitles"
}

# Compact JSON form to inject (matches existing indent style: 4-space, single-line dicts)
AUTHOR_INLINE = '"author": { "@type": "Person", "name": "Daniel Formind", "url": "https://live-subtitles.com/about/team/daniel-formind.html", "jobTitle": "Founder & Engineer, Live Subtitles" }'

# Visible byline HTML (inserted right after the date div if not already present)
BYLINE_HTML = '        <div class="article-author" style="color:#aaa; font-size:0.95rem; margin-bottom:1.5rem;">By <a href="/about/team/daniel-formind.html" rel="author" style="color:#00b8ff; text-decoration:none;">Daniel Formind</a> &middot; Founder &amp; Engineer, Live Subtitles</div>'

re_author = re.compile(
    r'"author"\s*:\s*\{\s*"@type"\s*:\s*"(?:Person|Organization)"\s*,\s*"name"\s*:\s*"(?:Editorial Team|Live Subtitles)"\s*\}'
)
re_datemod = re.compile(r'"dateModified"\s*:\s*"\d{4}-\d{2}-\d{2}"')
re_visible_editorial = re.compile(r'(?:By\s+)?Editorial Team', re.I)

files = sorted(glob.glob(os.path.join(ROOT, 'articles', '*', 'article-*.html')))
stats = {'updated': 0, 'unchanged': 0, 'no_author': 0, 'byline_added': 0}

for fp in files:
    text = open(fp, encoding='utf-8').read()
    orig = text

    # 1. Replace JSON-LD author
    if re_author.search(text):
        text = re_author.sub(AUTHOR_INLINE, text)

    # 2. Update dateModified to today
    text = re_datemod.sub(f'"dateModified": "{TODAY}"', text)

    # 3. Replace visible "Editorial Team" if it leaked into the body (rare)
    text = re_visible_editorial.sub('Daniel Formind', text)

    # 4. Inject visible byline if not present (after date/meta div or first h1)
    if 'article-author' not in text and 'rel="author"' not in text:
        anchor = re.search(r'(<div class="article-(?:date|meta)"[^>]*>.*?</div>)', text, re.S)
        if not anchor:
            # Fall back to first <h1> in body
            anchor = re.search(r'(<h1[^>]*>.*?</h1>)', text, re.S)
        if anchor:
            insert_at = anchor.end()
            text = text[:insert_at] + '\n        ' + BYLINE_HTML + text[insert_at:]
            stats['byline_added'] += 1

    if text != orig:
        open(fp, 'w', encoding='utf-8').write(text)
        stats['updated'] += 1
    else:
        stats['unchanged'] += 1

print('STATS:', stats)
print(f'Today = {TODAY}')
