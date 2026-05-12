"""Inject category hero image into every articles/<locale>/article-N.html:
  - update og:image / twitter:image to the category webp for this locale
  - add <link rel="preload" as="image"> for LCP
  - insert <img class="article-hero"> after the byline (or after h1 if no byline)
Idempotent: re-running updates URLs and skips already-inserted <img>.
"""
import os, re, glob

ROOT = os.path.dirname(os.path.abspath(__file__))
ROOT_URL = 'https://live-subtitles.com'

ARTICLE_CATEGORY = {
    1:'learning',  2:'learning',  3:'learning',  7:'learning',  10:'learning',
    4:'learning',  6:'learning',  9:'learning',
    5:'movies',    8:'movies',   11:'movies',   13:'movies',   17:'movies',
    12:'meetings',14:'meetings',16:'meetings', 18:'meetings',
    15:'games',   19:'games',   20:'games',    21:'games',    22:'games',
}

# Locales that should have an image (all article locale folders). Image files
# are pre-populated in articles/img/<locale>/ by _convert_article_images.py.
LOCALES_WITH_IMG = set([
    'en','ru','fr','es','de','it','ja','ko','zh','ar','pt','uk','hi','pl','nl','tr'
])

# Alt text per category, per locale (kept short, ~70 chars max).
ALT = {
    'meetings': {
        'en':'Live captions during a multilingual video meeting',
        'ru':'Живые субтитры во время многоязычной видеовстречи',
        'fr':'Sous-titres en direct pendant une visioconférence multilingue',
        'es':'Subtítulos en vivo durante una reunión por video multilingüe',
        'de':'Live-Untertitel während eines mehrsprachigen Videomeetings',
        'it':'Sottotitoli in diretta durante una riunione video multilingue',
        'pt':'Legendas ao vivo durante uma reunião por vídeo multilíngue',
        'nl':'Live ondertitels tijdens een meertalige videovergadering',
        'pl':'Napisy na żywo podczas wielojęzycznego spotkania wideo',
        'tr':'Çok dilli bir video toplantısı sırasında canlı altyazılar',
        'uk':'Живі субтитри під час багатомовної відеозустрічі',
        'ja':'多言語ビデオ会議中のライブ字幕',
        'ko':'다국어 화상 회의 중 실시간 자막',
        'zh':'多语言视频会议中的实时字幕',
        'ar':'ترجمات حية أثناء اجتماع فيديو متعدد اللغات',
        'hi':'बहुभाषी वीडियो मीटिंग के दौरान लाइव कैप्शन',
    },
    'movies': {
        'en':'Dual subtitles on a film for language learning',
        'ru':'Двойные субтитры в фильме для изучения языка',
        'fr':'Sous-titres bilingues sur un film pour apprendre une langue',
        'es':'Subtítulos duales en una película para aprender idiomas',
        'de':'Doppel-Untertitel in einem Film zum Sprachenlernen',
        'it':'Sottotitoli doppi su un film per imparare le lingue',
        'pt':'Legendas duplas em um filme para aprendizado de idiomas',
        'nl':'Dubbele ondertitels op een film voor het leren van talen',
        'pl':'Podwójne napisy w filmie do nauki języka',
        'tr':'Dil öğrenimi için bir filmde çift altyazı',
        'uk':'Подвійні субтитри у фільмі для вивчення мови',
        'ja':'語学学習のための映画のデュアル字幕',
        'ko':'언어 학습을 위한 영화 듀얼 자막',
        'zh':'用于语言学习的电影双语字幕',
        'ar':'ترجمات ثنائية على فيلم لتعلم اللغة',
        'hi':'भाषा सीखने के लिए फिल्म पर दोहरे उपशीर्षक',
    },
    'games': {
        'en':'Live subtitle overlay during a competitive game match',
        'ru':'Живые субтитры во время соревновательной игры',
        'fr':'Sous-titres en direct pendant un match compétitif',
        'es':'Subtítulos en vivo durante una partida competitiva',
        'de':'Live-Untertitel-Overlay während eines kompetitiven Spiels',
        'it':'Sottotitoli in diretta durante una partita competitiva',
        'pt':'Legendas ao vivo durante uma partida competitiva',
        'nl':'Live-ondertitels tijdens een competitieve wedstrijd',
        'pl':'Napisy na żywo podczas meczu rankingowego',
        'tr':'Rekabetçi bir maç sırasında canlı altyazı katmanı',
        'uk':'Живі субтитри під час змагальної гри',
        'ja':'競技ゲームのマッチ中のライブ字幕オーバーレイ',
        'ko':'경쟁 게임 매치 중 실시간 자막 오버레이',
        'zh':'竞技比赛中的实时字幕覆盖',
        'ar':'طبقة ترجمة حية أثناء مباراة لعبة تنافسية',
        'hi':'प्रतिस्पर्धी गेम मैच के दौरान लाइव सबटाइटल ओवरले',
    },
    'learning': {
        'en':'Dual subtitles on a video lesson for language learning',
        'ru':'Двойные субтитры в видеоуроке для изучения языка',
        'fr':'Sous-titres bilingues sur une leçon vidéo pour apprendre une langue',
        'es':'Subtítulos duales en una lección en video para aprender idiomas',
        'de':'Doppel-Untertitel in einer Videolektion zum Sprachenlernen',
        'it':'Sottotitoli doppi su una lezione video per imparare le lingue',
        'pt':'Legendas duplas em uma videoaula para aprendizado de idiomas',
        'nl':'Dubbele ondertitels bij een videoles voor het leren van talen',
        'pl':'Podwójne napisy w lekcji wideo do nauki języka',
        'tr':'Dil öğrenimi için bir video derste çift altyazı',
        'uk':'Подвійні субтитри у відеоуроці для вивчення мови',
        'ja':'語学学習のためのビデオレッスンのデュアル字幕',
        'ko':'언어 학습을 위한 비디오 강의의 듀얼 자막',
        'zh':'用于语言学习的视频课程的双语字幕',
        'ar':'ترجمات ثنائية على درس بالفيديو لتعلم اللغة',
        'hi':'भाषा सीखने के लिए वीडियो पाठ पर दोहरे उपशीर्षक',
    },
}

IMG_BLOCK_TPL = (
    '<img class="article-hero" src="{src}" alt="{alt}" '
    'width="1280" height="720" loading="eager" decoding="async" fetchpriority="high" '
    'style="display:block; width:100%; height:auto; border-radius:8px; margin:0 0 1.5rem 0;">'
)

re_og_img    = re.compile(r'(<meta\s+property=["\']og:image["\']\s+content=["\'])[^"\']+(["\'])', re.I)
re_tw_img    = re.compile(r'(<meta\s+name=["\']twitter:image["\']\s+content=["\'])[^"\']+(["\'])', re.I)
re_preload   = re.compile(r'<link\s+rel=["\']preload["\']\s+as=["\']image["\']\s+href=["\'][^"\']+["\']\s*/?>\s*\n?', re.I)
re_hero_img  = re.compile(r'<img[^>]*class=["\']article-hero["\'][^>]*>', re.I)

def article_number(filename):
    m = re.match(r'article-(\d+)\.html$', filename)
    return int(m.group(1)) if m else None

def insert_hero_img(text, img_html):
    """Insert the hero <img> after the article-updated div if present,
       else after the article-author div, else after article-date/meta,
       else after the first <h1>.
    """
    anchors = [
        r'<div class="article-updated"[^>]*>.*?</div>',
        r'<div class="article-author"[^>]*>.*?</div>',
        r'<div class="article-(?:date|meta)"[^>]*>.*?</div>',
        r'<h1[^>]*>.*?</h1>',
    ]
    for pat in anchors:
        m = re.search(pat, text, re.S)
        if m:
            return text[:m.end()] + '\n        ' + img_html + text[m.end():]
    return None

stats = {'updated':0, 'unchanged':0, 'no_anchor':0, 'no_category':0}
for fp in sorted(glob.glob(os.path.join(ROOT, 'articles', '*', 'article-*.html'))):
    fname = os.path.basename(fp)
    loc = fp.replace(os.sep, '/').split('/')[-2]
    n = article_number(fname)
    if n is None or n not in ARTICLE_CATEGORY:
        stats['no_category'] += 1; continue
    cat = ARTICLE_CATEGORY[n]
    if loc not in LOCALES_WITH_IMG:
        loc_eff = 'en'
    else:
        loc_eff = loc
    img_url = f'{ROOT_URL}/articles/img/{loc_eff}/{cat}.webp'
    img_path_local = f'/articles/img/{loc_eff}/{cat}.webp'
    alt = ALT[cat].get(loc, ALT[cat]['en'])

    orig = open(fp, encoding='utf-8').read()
    text = orig

    # 1) update og:image and twitter:image
    text = re_og_img.sub(lambda m: m.group(1) + img_url + m.group(2), text)
    text = re_tw_img.sub(lambda m: m.group(1) + img_url + m.group(2), text)

    # 2) ensure preload link in <head>
    preload_tag = f'<link rel="preload" as="image" href="{img_path_local}">'
    if 'article-hero-preload-anchor' not in text:
        # Remove any existing preload-as-image (idempotency)
        text = re_preload.sub('', text)
        # Insert preload right before </head>
        text = text.replace('</head>', '    ' + preload_tag + '\n</head>', 1)

    # 3) ensure hero <img> in body
    new_img = IMG_BLOCK_TPL.format(src=img_path_local, alt=alt)
    if re_hero_img.search(text):
        text = re_hero_img.sub(new_img, text, count=1)
    else:
        new_text = insert_hero_img(text, new_img)
        if new_text is None:
            stats['no_anchor'] += 1; continue
        text = new_text

    if text != orig:
        open(fp, 'w', encoding='utf-8').write(text)
        stats['updated'] += 1
    else:
        stats['unchanged'] += 1

print('STATS:', stats)
