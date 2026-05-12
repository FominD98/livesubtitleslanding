"""Audit canonical + hreflang. Group asymmetry by source folder."""
import os, re, glob
from collections import defaultdict, Counter

ROOT = 'https://live-subtitles.com'
LOCALES = ['ar','de','es','fr','hi','it','ja','ko','nl','pl','pt','ru','tr','uk','zh']

re_canonical = re.compile(r'<link\s+rel=["\']canonical["\']\s+href=["\']([^"\']+)["\']', re.I)
re_alt = re.compile(r'<link\s+rel=["\']alternate["\']\s+hreflang=["\']([^"\']+)["\']\s+href=["\']([^"\']+)["\']', re.I)

html_files = [f for f in glob.glob('**/*.html', recursive=True) if not f.startswith('_')]
all_alternates = {}

for hf in html_files:
    try: text = open(hf, encoding='utf-8', errors='ignore').read()
    except: continue
    head_end = text.lower().find('</head>')
    if head_end > 0: text = text[:head_end]
    cm = re_canonical.search(text)
    if not cm: continue
    canonical = cm.group(1).rstrip('/') + ('/' if cm.group(1).endswith('/') else '')
    alts = {}
    for am in re_alt.finditer(text):
        alts[am.group(1)] = am.group(2)
    all_alternates[canonical] = alts

# normalize keys (strip trailing slash for comparison)
def norm(u): return u.rstrip('/')

altset = {norm(c): a for c, a in all_alternates.items()}
keyset = set(altset.keys())

asym_buckets = defaultdict(list)  # bucket -> list of (src,lang,target,reason)
missing_target = defaultdict(int)
missing_back   = defaultdict(int)
missing_xdefault = []
no_alt_at_all = []

for canon, alts in all_alternates.items():
    src = norm(canon)
    if not alts:
        no_alt_at_all.append(src); continue
    if 'x-default' not in alts:
        missing_xdefault.append(src)
    for lang, href in alts.items():
        if lang == 'x-default': continue
        tgt = norm(href)
        if tgt not in keyset:
            bucket = src.replace(ROOT, '').split('/')[1] if '/' in src.replace(ROOT, '') else 'root'
            asym_buckets[f'target_missing/{bucket}'].append((src, lang, tgt))
            missing_target[tgt] += 1
            continue
        target_alts = altset[tgt]
        # target should reference src under SOME hreflang
        target_hrefs = [norm(v) for k, v in target_alts.items() if k != 'x-default']
        if src not in target_hrefs:
            bucket = src.replace(ROOT, '').split('/')[1] if '/' in src.replace(ROOT, '') else 'root'
            asym_buckets[f'no_back_link/{bucket}'].append((src, lang, tgt))
            missing_back[(src, tgt)] += 1

print('=== HREFLANG ASYMMETRY (grouped) ===')
for k in sorted(asym_buckets, key=lambda x: -len(asym_buckets[x])):
    print(f'\n[{k}] {len(asym_buckets[k])} edges')
    for row in asym_buckets[k][:5]:
        print('  ', row)

print(f'\n=== Top missing-target URLs (referenced via hreflang but no canonical found) ===')
for u, n in Counter(missing_target).most_common(20):
    print(f'  x{n}  {u}')

print(f'\n=== Pages with NO alternates at all: {len(no_alt_at_all)} ===')
for u in no_alt_at_all[:15]: print('  ', u)
if len(no_alt_at_all) > 15: print(f'  ... +{len(no_alt_at_all)-15} more')

print(f'\n=== Pages WITHOUT x-default: {len(missing_xdefault)} ===')
samp = Counter()
for u in missing_xdefault:
    bucket = u.replace(ROOT, '').split('/')[1] if '/' in u.replace(ROOT, '') and u.replace(ROOT, '') else 'root'
    samp[bucket] += 1
for b, n in samp.most_common():
    print(f'  bucket={b!r}: {n}')
