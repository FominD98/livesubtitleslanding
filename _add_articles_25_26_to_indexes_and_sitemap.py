"""Add article-25 and article-26 cards to articles/<locale>/index.html and sitemap entries.
All 16 locales for both articles. Idempotent.
"""
import os

ROOT = os.path.dirname(os.path.abspath(__file__))
ALL_LOCALES = ['en', 'ru', 'ja', 'zh', 'ko', 'ar', 'hi', 'de', 'es', 'fr', 'it', 'pl', 'pt', 'tr', 'uk', 'nl']

# Article-25 card metadata
CARDS_25 = {
    'en': {'title': 'Live Captions in 2026: How AI-Generated Captions Work and When to Use Them', 'date_iso': '2026-05-28', 'date_label': 'May 28, 2026', 'desc': 'Live captions explained: how AI converts speech to text in under 2 seconds, where they show up, and when each option wins.'},
    'ru': {'title': 'Живые субтитры 2026: как работают AI-субтитры и когда их использовать', 'date_iso': '2026-05-28', 'date_label': '28 мая 2026 г.', 'desc': 'Живые субтитры разобраны: где они появляются на Windows, Mac, Android, Chrome и когда какой вариант выигрывает.'},
    'ja': {'title': 'ライブ字幕 2026年版：AI字幕の仕組みと使いどころ', 'date_iso': '2026-05-28', 'date_label': '2026年5月28日', 'desc': 'AIライブ字幕の仕組み、各レイヤでの位置づけ、それぞれの勝ち場面を解説。'},
    'zh': {'title': '2026 年实时字幕：AI 字幕的工作原理及使用场景', 'date_iso': '2026-05-28', 'date_label': '2026 年 5 月 28 日', 'desc': '解析实时字幕的工作原理与跨平台展示位置，以及各自的胜出场景。'},
    'ko': {'title': '2026년 라이브 자막: AI 자막이 작동하는 방식과 사용 시점', 'date_iso': '2026-05-28', 'date_label': '2026년 5월 28일', 'desc': 'AI 라이브 자막의 작동 방식, 각 레이어별 표시 위치, 어느 옵션이 언제 승리하는지.'},
    'ar': {'title': 'التعليقات الحية في 2026: كيف تعمل تعليقات الذكاء الاصطناعي ومتى تستخدمها', 'date_iso': '2026-05-28', 'date_label': '28 مايو 2026', 'desc': 'كيف تعمل التعليقات الحية بالذكاء الاصطناعي وأين تظهر على مستويات النظام والمتصفح والتطبيق.'},
    'hi': {'title': '2026 में लाइव कैप्शन: AI कैप्शन कैसे काम करते हैं और कब उपयोग करें', 'date_iso': '2026-05-28', 'date_label': '28 मई 2026', 'desc': 'AI लाइव कैप्शन कैसे काम करते हैं और वे OS, ब्राउज़र, ऐप परतों पर कहाँ दिखाई देते हैं।'},
    'de': {'title': 'Live-Untertitel 2026: Wie KI-Untertitel funktionieren und wann sie einzusetzen sind', 'date_iso': '2026-05-28', 'date_label': '28. Mai 2026', 'desc': 'Wie KI-Live-Untertitel funktionieren und wo sie auf OS-, Browser- und App-Ebene erscheinen.'},
    'es': {'title': 'Subtítulos en vivo 2026: cómo funcionan los subtítulos con IA y cuándo usarlos', 'date_iso': '2026-05-28', 'date_label': '28 de mayo de 2026', 'desc': 'Cómo funcionan los subtítulos en vivo con IA y dónde aparecen en las capas de SO, navegador y app.'},
    'fr': {'title': "Sous-titres en direct 2026 : comment fonctionnent les sous-titres IA et quand les utiliser", 'date_iso': '2026-05-28', 'date_label': '28 mai 2026', 'desc': "Comment fonctionnent les sous-titres IA et où ils apparaissent dans les couches OS/navigateur/app."},
    'it': {'title': 'Sottotitoli live 2026: come funzionano i sottotitoli IA e quando usarli', 'date_iso': '2026-05-28', 'date_label': '28 maggio 2026', 'desc': "Come funzionano i sottotitoli live IA e dove appaiono nei livelli OS/browser/app."},
    'pl': {'title': 'Napisy na żywo 2026: jak działają napisy AI i kiedy ich używać', 'date_iso': '2026-05-28', 'date_label': '28 maja 2026', 'desc': 'Jak działają napisy AI na żywo i gdzie pojawiają się na poziomach OS/przeglądarka/aplikacja.'},
    'pt': {'title': 'Legendas ao vivo em 2026: como funcionam as legendas com IA e quando usá-las', 'date_iso': '2026-05-28', 'date_label': '28 de maio de 2026', 'desc': 'Como funcionam as legendas ao vivo com IA e onde aparecem nas camadas SO/navegador/app.'},
    'tr': {'title': 'Canlı altyazılar 2026: AI tarafından üretilen altyazılar nasıl çalışır ve ne zaman kullanılır', 'date_iso': '2026-05-28', 'date_label': '28 Mayıs 2026', 'desc': 'AI canlı altyazıların nasıl çalıştığı ve OS/tarayıcı/uygulama katmanlarında nerede göründüğü.'},
    'uk': {'title': 'Живі субтитри 2026: як працюють AI-субтитри і коли їх використовувати', 'date_iso': '2026-05-28', 'date_label': '28 травня 2026', 'desc': 'Як працюють AI-субтитри і де вони з\'являються на шарах OS/браузер/застосунок.'},
    'nl': {'title': 'Live ondertiteling in 2026: hoe AI-ondertiteling werkt en wanneer te gebruiken', 'date_iso': '2026-05-28', 'date_label': '28 mei 2026', 'desc': 'Hoe AI-live-ondertiteling werkt en waar het verschijnt op OS/browser/app-lagen.'},
}

# Article-26 card metadata
CARDS_26 = {
    'en': {'title': 'AirPods Live Translation in iOS 26: What It Does Well and Where It Falls Short', 'date_iso': '2026-05-28', 'date_label': 'May 28, 2026', 'desc': "Honest review of AirPods Live Translation in iOS 26 — strengths, weaknesses, and complementary tools."},
    'ru': {'title': 'AirPods Live Translation в iOS 26: что получается хорошо и где провал', 'date_iso': '2026-05-28', 'date_label': '28 мая 2026 г.', 'desc': 'Честный обзор AirPods Live Translation в iOS 26 — сильные, слабые стороны и дополняющие инструменты.'},
    'ja': {'title': 'AirPods ライブ翻訳(iOS 26)：得意なことと苦手なこと', 'date_iso': '2026-05-28', 'date_label': '2026年5月28日', 'desc': 'iOS 26のAirPodsライブ翻訳を正直レビュー — 長所、短所、補完ツール。'},
    'zh': {'title': 'iOS 26 中的 AirPods 实时翻译：它擅长什么、不擅长什么', 'date_iso': '2026-05-28', 'date_label': '2026 年 5 月 28 日', 'desc': '诚实评测 iOS 26 中的 AirPods 实时翻译 —— 优势、不足与互补工具。'},
    'ko': {'title': 'iOS 26의 AirPods 라이브 번역: 잘하는 것과 부족한 것', 'date_iso': '2026-05-28', 'date_label': '2026년 5월 28일', 'desc': 'iOS 26 AirPods 라이브 번역 솔직 리뷰 — 강점, 약점, 보완 도구.'},
    'ar': {'title': 'ترجمة AirPods الحية في iOS 26: ما الذي تتقنه وأين تخفق', 'date_iso': '2026-05-28', 'date_label': '28 مايو 2026', 'desc': 'مراجعة صادقة لترجمة AirPods الحية في iOS 26 — نقاط القوة والضعف والأدوات المكمّلة.'},
    'hi': {'title': 'iOS 26 में AirPods लाइव अनुवाद: यह क्या अच्छा करता है और कहाँ कम पड़ता है', 'date_iso': '2026-05-28', 'date_label': '28 मई 2026', 'desc': 'iOS 26 AirPods लाइव अनुवाद ईमानदार समीक्षा — ताक़तें, कमज़ोरियाँ और पूरक टूल।'},
    'de': {'title': 'AirPods Live Translation in iOS 26: Was sie gut kann und wo sie versagt', 'date_iso': '2026-05-28', 'date_label': '28. Mai 2026', 'desc': 'Ehrlicher Test von AirPods Live Translation iOS 26 — Stärken, Schwächen und ergänzende Tools.'},
    'es': {'title': 'AirPods Live Translation en iOS 26: lo que hace bien y lo que falla', 'date_iso': '2026-05-28', 'date_label': '28 de mayo de 2026', 'desc': 'Reseña honesta de AirPods Live Translation iOS 26 — fortalezas, debilidades y herramientas complementarias.'},
    'fr': {'title': "AirPods Live Translation dans iOS 26 : ce qu'elle fait bien et où elle échoue", 'date_iso': '2026-05-28', 'date_label': '28 mai 2026', 'desc': "Test honnête d'AirPods Live Translation iOS 26 — forces, faiblesses et outils complémentaires."},
    'it': {'title': 'AirPods Live Translation in iOS 26: cosa fa bene e dove fallisce', 'date_iso': '2026-05-28', 'date_label': '28 maggio 2026', 'desc': 'Recensione onesta di AirPods Live Translation iOS 26 — punti forti, deboli e strumenti complementari.'},
    'pl': {'title': 'AirPods Live Translation w iOS 26: co robi dobrze, a gdzie zawodzi', 'date_iso': '2026-05-28', 'date_label': '28 maja 2026', 'desc': 'Uczciwa recenzja AirPods Live Translation iOS 26 — mocne strony, słabości i narzędzia uzupełniające.'},
    'pt': {'title': 'AirPods Live Translation no iOS 26: o que faz bem e onde falha', 'date_iso': '2026-05-28', 'date_label': '28 de maio de 2026', 'desc': 'Análise honesta de AirPods Live Translation iOS 26 — pontos fortes, fracos e ferramentas complementares.'},
    'tr': {'title': "iOS 26'da AirPods Canlı Çeviri: neyi iyi yapıyor ve nerede yetersiz kalıyor", 'date_iso': '2026-05-28', 'date_label': '28 Mayıs 2026', 'desc': 'iOS 26 AirPods Canlı Çeviri dürüst incelemesi — güçlü yönler, zayıflıklar ve tamamlayıcı araçlar.'},
    'uk': {'title': 'AirPods Live Translation в iOS 26: що добре виходить і де провал', 'date_iso': '2026-05-28', 'date_label': '28 травня 2026', 'desc': 'Чесний огляд AirPods Live Translation в iOS 26 — сильні, слабкі сторони та доповнюючі інструменти.'},
    'nl': {'title': 'AirPods Live Translation in iOS 26: wat het goed doet en waar het tekortschiet', 'date_iso': '2026-05-28', 'date_label': '28 mei 2026', 'desc': 'Eerlijke beoordeling van AirPods Live Translation iOS 26 — sterke punten, zwakheden en aanvullende tools.'},
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
    # Insert before article-24, then article-23, then article-17
    for anchor in [f'<a href="article-24.html"', '<a href="article-23.html"', '<a href="article-17.html"']:
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
    print('=== Adding article-25 cards ===')
    for L in ALL_LOCALES:
        c = CARDS_25[L]
        ok = update_index(L, 25, c)
        print(f'  articles/{L}/index.html (article-25): {"updated" if ok else "skipped"}')

    print('\n=== Adding article-26 cards ===')
    for L in ALL_LOCALES:
        c = CARDS_26[L]
        ok = update_index(L, 26, c)
        print(f'  articles/{L}/index.html (article-26): {"updated" if ok else "skipped"}')

    print('\n=== Sitemap updates ===')
    update_sitemap(25)
    update_sitemap(26)


if __name__ == '__main__':
    main()
