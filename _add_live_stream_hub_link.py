"""Add the /live-stream-subtitles.html hub link to the 'Streaming & Social'
column of the root homepage and all 15 locale homepages.

The platform-link block is not translated (locale homepages link to the root EN
platform pages with English labels), so this is a uniform insert and needs no
i18n re-bake. Byte-level edit to preserve CRLF (core.autocrlf=true).
"""
import glob

NEEDLE = b'<h3>Streaming &amp; Social</h3>\r\n'
LINK = b'                        <a href="/live-stream-subtitles.html">Live Stream Subtitles</a>\r\n'

files = ['index.html'] + sorted(f.replace(chr(92), '/') for f in glob.glob('*/index.html'))
done, skipped = [], []
for f in files:
    raw = open(f, 'rb').read()
    if NEEDLE not in raw:
        continue
    if b'live-stream-subtitles' in raw:
        skipped.append(f)
        continue
    assert raw.count(NEEDLE) == 1, f
    open(f, 'wb').write(raw.replace(NEEDLE, NEEDLE + LINK))
    done.append(f)

print(f'{len(done)} updated: {" ".join(done)}')
if skipped:
    print(f'{len(skipped)} already linked: {" ".join(skipped)}')
