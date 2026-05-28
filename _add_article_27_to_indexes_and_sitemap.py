"""Add article-27 cards to articles/<locale>/index.html and sitemap entries.
All 16 locales. Idempotent.
"""
import os

ROOT = os.path.dirname(os.path.abspath(__file__))
ALL_LOCALES = ['en', 'ru', 'ja', 'zh', 'ko', 'ar', 'hi', 'de', 'es', 'fr', 'it', 'pl', 'pt', 'tr', 'uk', 'nl']

CARDS_27 = {
    'en': {'title': 'Captions for Streamers in 2026: OBS, Twitch, YouTube Live Workflow', 'date_iso': '2026-05-28', 'date_label': 'May 28, 2026', 'desc': 'How to add live captions to your Twitch, YouTube Live, Kick, and Discord stream — using OBS overlay, native platform CC, and AI captioning tools without breaking your stream layout.'},
    'ru': {'title': 'Субтитры для стримеров в 2026: OBS, Twitch, YouTube Live workflow', 'date_iso': '2026-05-28', 'date_label': '28 мая 2026 г.', 'desc': 'Как добавить живые субтитры к стримам Twitch, YouTube Live, Kick и Discord — через OBS оверлей, нативный CC платформы и AI-инструменты субтитров, не ломая раскладку стрима.'},
    'ja': {'title': '配信者向けライブ字幕 2026年版：OBS・Twitch・YouTube Live ワークフロー', 'date_iso': '2026-05-28', 'date_label': '2026年5月28日', 'desc': 'Twitch、YouTube Live、Kick、Discord配信にライブ字幕を追加する方法 — OBS オーバーレイ、ネイティブ プラットフォーム CC、AI 字幕ツールを使って、配信レイアウトを崩さずに。'},
    'zh': {'title': '2026 年主播字幕：OBS、Twitch、YouTube Live 工作流', 'date_iso': '2026-05-28', 'date_label': '2026 年 5 月 28 日', 'desc': '如何为 Twitch、YouTube Live、Kick 和 Discord 直播添加实时字幕——使用 OBS 覆盖、平台原生 CC 与 AI 字幕工具，且不破坏直播布局。'},
    'ko': {'title': '2026년 스트리머용 자막: OBS, Twitch, YouTube Live 워크플로', 'date_iso': '2026-05-28', 'date_label': '2026년 5월 28일', 'desc': 'Twitch, YouTube Live, Kick, Discord 스트림에 라이브 자막을 추가하는 방법 — OBS 오버레이, 네이티브 플랫폼 CC, AI 자막 도구를 사용하여 스트림 레이아웃을 깨뜨리지 않고.'},
    'ar': {'title': 'تعليقات المذيعين في 2026: سير عمل OBS وTwitch وYouTube Live', 'date_iso': '2026-05-28', 'date_label': '28 مايو 2026', 'desc': 'كيفية إضافة تعليقات حية إلى بثك على Twitch وYouTube Live وKick وDiscord — باستخدام تراكب OBS وCC الأصلي للمنصة وأدوات التعليقات بالذكاء الاصطناعي دون كسر تخطيط البث.'},
    'hi': {'title': '2026 में स्ट्रीमर्स के लिए कैप्शन: OBS, Twitch, YouTube Live वर्कफ़्लो', 'date_iso': '2026-05-28', 'date_label': '28 मई 2026', 'desc': 'अपने Twitch, YouTube Live, Kick और Discord स्ट्रीम में लाइव कैप्शन कैसे जोड़ें — अपनी स्ट्रीम लेआउट को तोड़े बिना OBS ओवरले, नेटिव प्लेटफ़ॉर्म CC, और AI कैप्शनिंग टूल का उपयोग करके।'},
    'de': {'title': 'Untertitel für Streamer 2026: OBS-, Twitch-, YouTube-Live-Workflow', 'date_iso': '2026-05-28', 'date_label': '28. Mai 2026', 'desc': 'So fügen Sie Live-Untertitel zu Twitch, YouTube Live, Kick und Discord-Streams hinzu — mit OBS-Overlay, nativen Plattform-CCs und KI-Untertitelungs-Tools, ohne das Stream-Layout zu zerstören.'},
    'es': {'title': 'Subtítulos para streamers en 2026: workflow de OBS, Twitch, YouTube Live', 'date_iso': '2026-05-28', 'date_label': '28 de mayo de 2026', 'desc': 'Cómo añadir subtítulos en vivo a tu stream de Twitch, YouTube Live, Kick y Discord — usando overlay de OBS, CC nativo de la plataforma y herramientas de subtitulado IA sin romper tu layout de stream.'},
    'fr': {'title': 'Sous-titres pour streamers en 2026 : workflow OBS, Twitch, YouTube Live', 'date_iso': '2026-05-28', 'date_label': '28 mai 2026', 'desc': "Comment ajouter des sous-titres en direct à votre stream Twitch, YouTube Live, Kick et Discord — avec overlay OBS, CC natifs de plateforme et outils de sous-titrage IA sans casser votre mise en page."},
    'it': {'title': 'Sottotitoli per streamer nel 2026: workflow OBS, Twitch, YouTube Live', 'date_iso': '2026-05-28', 'date_label': '28 maggio 2026', 'desc': 'Come aggiungere sottotitoli live a stream Twitch, YouTube Live, Kick e Discord — usando overlay OBS, CC nativi della piattaforma e strumenti di sottotitolazione IA senza rompere il layout del tuo stream.'},
    'pl': {'title': 'Napisy dla streamerów w 2026: workflow OBS, Twitch, YouTube Live', 'date_iso': '2026-05-28', 'date_label': '28 maja 2026', 'desc': 'Jak dodać napisy na żywo do streamu Twitch, YouTube Live, Kick i Discord — używając nakładki OBS, natywnego CC platformy i narzędzi napisów AI bez psucia układu streamu.'},
    'pt': {'title': 'Legendas para streamers em 2026: workflow OBS, Twitch, YouTube Live', 'date_iso': '2026-05-28', 'date_label': '28 de maio de 2026', 'desc': 'Como adicionar legendas ao vivo ao seu stream do Twitch, YouTube Live, Kick e Discord — usando overlay do OBS, CC nativo da plataforma e ferramentas de legendagem IA sem quebrar o layout do seu stream.'},
    'tr': {'title': "2026'da streamerlar için altyazılar: OBS, Twitch, YouTube Live iş akışı", 'date_iso': '2026-05-28', 'date_label': '28 Mayıs 2026', 'desc': 'Twitch, YouTube Live, Kick ve Discord yayınınıza canlı altyazı ekleme — OBS overlay, platform yerel CC ve AI altyazı araçları kullanarak yayın düzeninizi bozmadan.'},
    'uk': {'title': 'Субтитри для стримерів у 2026: workflow OBS, Twitch, YouTube Live', 'date_iso': '2026-05-28', 'date_label': '28 травня 2026', 'desc': 'Як додати живі субтитри до стрімів Twitch, YouTube Live, Kick і Discord — використовуючи OBS оверлей, нативний CC платформи та AI-інструменти субтитрів, не ламаючи розкладку стріму.'},
    'nl': {'title': 'Ondertiteling voor streamers in 2026: OBS, Twitch, YouTube Live workflow', 'date_iso': '2026-05-28', 'date_label': '28 mei 2026', 'desc': 'Hoe je live ondertiteling toevoegt aan je Twitch-, YouTube Live-, Kick- en Discord-stream — met OBS-overlay, native platform CC en AI-ondertitelingstools zonder je stream-layout te verstoren.'},
}


def make_card(article_num: int, c: dict) -> str:
    return (
        '        <div class="article-card" itemscope itemtype="https://schema.org/Article">\n'
        f'            <a href="article-{article_num}.html" class="article-title" itemprop="headline">{c["title"]}</a>\n'
        f'            <div class="article-date" itemprop="datePublished" content="{c["date_iso"]}">{c["date_label"]}</div>\n'
        f'            <div class="article-desc" itemprop="description">{c["desc"]}</div>\n'
        '        </div>\n'
    )


def update_index(locale: str, article_num: int, c: dict) -> bool:
    fp = os.path.join(ROOT, 'articles', locale, 'index.html')
    if not os.path.exists(fp):
        return False
    with open(fp, 'r', encoding='utf-8') as f:
        text = f.read()
    if f'article-{article_num}.html' in text:
        return False
    card = make_card(article_num, c)
    # Insert before the most recent existing article (article-26, then 25, 24, 23, 17)
    idx = -1
    for anchor in ['<a href="article-26.html"', '<a href="article-25.html"', '<a href="article-24.html"', '<a href="article-23.html"', '<a href="article-17.html"']:
        idx = text.find(anchor)
        if idx != -1:
            break
    if idx == -1:
        return False
    card_open = text.rfind('<div class="article-card"', 0, idx)
    if card_open == -1:
        return False
    line_start = text.rfind('\n', 0, card_open) + 1
    new_text = text[:line_start] + card + text[line_start:]
    with open(fp, 'w', encoding='utf-8') as f:
        f.write(new_text)
    return True


def build_sitemap_block(article_num: int, locales: list) -> str:
    hreflang_lines = [f'        <xhtml:link rel="alternate" hreflang="x-default" href="https://live-subtitles.com/articles/en/article-{article_num}.html" />']
    for L in ALL_LOCALES:
        hreflang_lines.append(f'        <xhtml:link rel="alternate" hreflang="{L}" href="https://live-subtitles.com/articles/{L}/article-{article_num}.html" />')

    blocks = []
    for L in locales:
        loc_url = f'https://live-subtitles.com/articles/{L}/article-{article_num}.html'
        block = (
            '    <url>\n'
            f'        <loc>{loc_url}</loc>\n'
            f'        <lastmod>2026-05-28</lastmod>\n'
            '        <changefreq>weekly</changefreq>\n'
            '        <priority>0.7</priority>\n'
            + '\n'.join(hreflang_lines) + '\n'
            '    </url>'
        )
        blocks.append(block)
    return '\n'.join(blocks)


def update_sitemap(article_num: int):
    fp = os.path.join(ROOT, 'sitemap.xml')
    with open(fp, 'r', encoding='utf-8') as f:
        text = f.read()
    if f'article-{article_num}.html' in text:
        print(f'  SKIP sitemap article-{article_num} (already present)')
        return
    blocks = build_sitemap_block(article_num, ALL_LOCALES)
    text = text.replace('</urlset>', blocks + '\n</urlset>')
    with open(fp, 'w', encoding='utf-8') as f:
        f.write(text)
    print(f'  Added {len(ALL_LOCALES)} article-{article_num} URL blocks to sitemap')


def main():
    print('=== Adding article-27 cards ===')
    for L in ALL_LOCALES:
        c = CARDS_27[L]
        ok = update_index(L, 27, c)
        print(f'  articles/{L}/index.html (article-27): {"updated" if ok else "skipped"}')

    print('\n=== Sitemap updates ===')
    update_sitemap(27)


if __name__ == '__main__':
    main()
