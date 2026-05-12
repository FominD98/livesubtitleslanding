"""Remove the stale '"author": { "name": "Live Subtitles", "@type": "Organization" }'
block from Article JSON-LD. The new per-article author was injected earlier and
appears BEFORE this stale block — but stale 'author' key wins by JSON parsing
(last-wins), so we must delete the stale block.
"""
import os, re, glob

ROOT = os.path.dirname(os.path.abspath(__file__))

# Match the stale author block in its various spaced forms.
# It is always: "author": { "name": "Live Subtitles", "@type": "Organization" }
# possibly multiline with weird indentation. The preceding/following commas vary.
PATTERN = re.compile(
    r',?\s*"author"\s*:\s*\{\s*'
    r'"name"\s*:\s*"Live Subtitles"\s*,\s*'
    r'"@type"\s*:\s*"Organization"\s*'
    r'\}\s*,?',
    re.DOTALL
)

stats = {'updated': 0, 'unchanged': 0}
for fp in sorted(glob.glob(os.path.join(ROOT, 'articles', '*', 'article-*.html'))):
    text = open(fp, encoding='utf-8').read()
    if '"author":  {' not in text and '"author": {\n' not in text:
        # quick reject: nothing to do
        if not re.search(r'"author"\s*:\s*\{\s*"name"\s*:\s*"Live Subtitles"', text):
            stats['unchanged'] += 1; continue

    new = PATTERN.sub(',', text, count=1)
    # If we ate the closing brace's comma badly, fix double comma or empty entry
    new = re.sub(r',\s*,', ',', new)
    new = re.sub(r',\s*\}', '\n}', new)

    if new != text:
        open(fp, 'w', encoding='utf-8').write(new)
        stats['updated'] += 1
        print(f'CLEANED: {fp.replace(os.sep, "/")}')
    else:
        stats['unchanged'] += 1

print('STATS:', stats)
