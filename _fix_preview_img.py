"""Replace broken /preview.png references with the real /2sub.png across all HTML."""
import glob, re, os

ROOT = os.path.dirname(os.path.abspath(__file__))
files = glob.glob(os.path.join(ROOT, '**', '*.html'), recursive=True)

pat = re.compile(r'(["\'])(/preview\.png|https://live-subtitles\.com/preview\.png)\1')
count_files = 0
count_repl = 0
for fp in files:
    try:
        text = open(fp, encoding='utf-8').read()
    except Exception as e:
        print('SKIP', fp, e); continue
    if 'preview.png' not in text:
        continue
    new, n = pat.subn(lambda m: f'{m.group(1)}https://live-subtitles.com/2sub.png{m.group(1)}', text)
    if n:
        open(fp, 'w', encoding='utf-8').write(new)
        count_files += 1
        count_repl += n
print(f'Files updated: {count_files}, replacements: {count_repl}')
