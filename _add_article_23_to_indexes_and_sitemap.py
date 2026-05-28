"""Add article-23 link cards to articles/<locale>/index.html and sitemap entries
with proper hreflang clusters for all 17 locales.
"""
import os
import re

ROOT = os.path.dirname(os.path.abspath(__file__))
LOCALES = ['en', 'ru', 'ja', 'zh', 'ko', 'ar', 'hi', 'de', 'es', 'fr', 'it', 'pl', 'pt', 'tr', 'uk', 'nl']

# Article-23 metadata per locale (title for card + date label)
CARDS = {
    'en': {
        'title': 'Voice Translation Apps in 2026: Real-Time Tools Compared by Use Case',
        'date_iso': '2026-05-28', 'date_label': 'May 28, 2026',
        'desc': 'A practical 2026 comparison of voice translation apps by real use case — conversation, meetings, travel, and media.'
    },
    'ru': {
        'title': 'Голосовой переводчик в 2026 году: реал-тайм инструменты по сценариям',
        'date_iso': '2026-05-28', 'date_label': '28 мая 2026 г.',
        'desc': 'Практическое сравнение приложений голосового перевода 2026 по реальным сценариям — разговор, встречи, путешествия, медиа.'
    },
    'ja': {
        'title': '音声翻訳アプリ 2026年版：用途別リアルタイム比較',
        'date_iso': '2026-05-28', 'date_label': '2026年5月28日',
        'desc': '2026年の音声翻訳アプリを用途別に比較：会話、会議、旅行、動画視聴。'
    },
    'zh': {
        'title': '2026 年语音翻译应用：按使用场景比较实时工具',
        'date_iso': '2026-05-28', 'date_label': '2026 年 5 月 28 日',
        'desc': '2026 年按实际使用场景对比语音翻译应用：对话、会议、旅行和媒体。'
    },
    'ko': {
        'title': '2026년 음성 번역 앱: 실시간 도구를 사용 사례별 비교',
        'date_iso': '2026-05-28', 'date_label': '2026년 5월 28일',
        'desc': '2026년 음성 번역 앱을 실제 사용 사례별로 비교: 대화, 회의, 여행, 미디어.'
    },
    'ar': {
        'title': 'تطبيقات الترجمة الصوتية في 2026: مقارنة الأدوات الفورية حسب الاستخدام',
        'date_iso': '2026-05-28', 'date_label': '28 مايو 2026',
        'desc': 'مقارنة 2026 لتطبيقات الترجمة الصوتية حسب الاستخدام الفعلي: المحادثة والاجتماعات والسفر والوسائط.'
    },
    'hi': {
        'title': '2026 में आवाज़ अनुवाद ऐप्स: उपयोग के मामले के अनुसार रीयल-टाइम तुलना',
        'date_iso': '2026-05-28', 'date_label': '28 मई 2026',
        'desc': '2026 में आवाज़ अनुवाद ऐप्स की उपयोग के मामले के आधार पर तुलना: बातचीत, मीटिंग, यात्रा और मीडिया।'
    },
    'de': {
        'title': 'Sprachübersetzung-Apps 2026: Echtzeit-Tools nach Anwendungsfall verglichen',
        'date_iso': '2026-05-28', 'date_label': '28. Mai 2026',
        'desc': 'Praxisorientierter 2026-Vergleich von Sprachübersetzung-Apps nach Anwendungsfall — Konversation, Meetings, Reisen und Medien.'
    },
    'es': {
        'title': 'Traductor de voz en 2026: herramientas en tiempo real comparadas por caso de uso',
        'date_iso': '2026-05-28', 'date_label': '28 de mayo de 2026',
        'desc': 'Comparativa 2026 de apps de traducción de voz por caso de uso real: conversación, reuniones, viajes y medios.'
    },
    'fr': {
        'title': "Traducteur vocal en 2026 : outils en temps réel comparés par cas d'usage",
        'date_iso': '2026-05-28', 'date_label': '28 mai 2026',
        'desc': "Comparatif 2026 des applis de traduction vocale par cas d'usage : conversation, réunions, voyages et médias."
    },
    'it': {
        'title': "Traduzione vocale 2026: strumenti in tempo reale a confronto per caso d'uso",
        'date_iso': '2026-05-28', 'date_label': '28 maggio 2026',
        'desc': "Confronto 2026 delle app di traduzione vocale per caso d'uso reale: conversazione, riunioni, viaggi e media."
    },
    'pl': {
        'title': 'Tłumacz głosowy 2026: narzędzia w czasie rzeczywistym według zastosowania',
        'date_iso': '2026-05-28', 'date_label': '28 maja 2026',
        'desc': 'Porównanie 2026 tłumaczy głosowych według realnego zastosowania: rozmowa, spotkania, podróże i media.'
    },
    'pt': {
        'title': 'Tradutor de voz em 2026: ferramentas em tempo real comparadas por caso de uso',
        'date_iso': '2026-05-28', 'date_label': '28 de maio de 2026',
        'desc': 'Comparativo 2026 de apps de tradução de voz por caso de uso real: conversa, reuniões, viagens e mídia.'
    },
    'tr': {
        'title': 'Sesli çeviri 2026: gerçek zamanlı araçlar kullanım senaryosuna göre karşılaştırıldı',
        'date_iso': '2026-05-28', 'date_label': '28 Mayıs 2026',
        'desc': "2026'da sesli çeviri uygulamalarını gerçek kullanım senaryosuna göre karşılaştırma: konuşma, toplantılar, seyahat ve medya."
    },
    'uk': {
        'title': 'Голосовий перекладач у 2026 році: інструменти реального часу за сценаріями',
        'date_iso': '2026-05-28', 'date_label': '28 травня 2026',
        'desc': 'Порівняння застосунків голосового перекладу 2026 за реальними сценаріями: розмова, зустрічі, подорожі, медіа.'
    },
    'nl': {
        'title': 'Spraakvertaling in 2026: realtime tools vergeleken per use case',
        'date_iso': '2026-05-28', 'date_label': '28 mei 2026',
        'desc': 'Praktische 2026-vergelijking van spraakvertaalapps per use case: gesprek, vergaderingen, reizen en media.'
    },
}


def make_card(locale: str) -> str:
    c = CARDS[locale]
    return (
        '        <div class="article-card" itemscope itemtype="https://schema.org/Article">\n'
        f'            <a href="article-23.html" class="article-title" itemprop="headline">{c["title"]}</a>\n'
        f'            <div class="article-date" itemprop="datePublished" content="{c["date_iso"]}">{c["date_label"]}</div>\n'
        f'            <div class="article-desc" itemprop="description">{c["desc"]}</div>\n'
        '        </div>\n'
    )


def update_index(locale: str) -> bool:
    fp = os.path.join(ROOT, 'articles', locale, 'index.html')
    if not os.path.exists(fp):
        return False
    with open(fp, 'r', encoding='utf-8') as f:
        text = f.read()
    if 'article-23.html' in text:
        return False  # already added

    card = make_card(locale)

    # Insert the new card BEFORE the first existing article-17 card (top of newest section)
    # If article-17 not found, fall back to before article-1.
    anchor = '<a href="article-17.html"'
    idx = text.find(anchor)
    if idx == -1:
        anchor = '<a href="article-1.html"'
        idx = text.find(anchor)
    if idx == -1:
        return False

    # Walk back to the start of the enclosing <div class="article-card">
    card_open = text.rfind('<div class="article-card"', 0, idx)
    if card_open == -1:
        return False
    # Walk back further to include leading whitespace of that line
    line_start = text.rfind('\n', 0, card_open) + 1
    new_text = text[:line_start] + card + text[line_start:]
    with open(fp, 'w', encoding='utf-8') as f:
        f.write(new_text)
    return True


def build_sitemap_block() -> str:
    """Build a single <url> block per locale for article-23, with full hreflang cluster."""
    # The cluster: x-default → en, then all 16 hreflang entries
    hreflang_lines = ['        <xhtml:link rel="alternate" hreflang="x-default" href="https://live-subtitles.com/articles/en/article-23.html" />']
    for L in LOCALES:
        hreflang_lines.append(f'        <xhtml:link rel="alternate" hreflang="{L}" href="https://live-subtitles.com/articles/{L}/article-23.html" />')

    blocks = []
    for L in LOCALES:
        loc_url = f'https://live-subtitles.com/articles/{L}/article-23.html'
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


def update_sitemap() -> bool:
    fp = os.path.join(ROOT, 'sitemap.xml')
    with open(fp, 'r', encoding='utf-8') as f:
        text = f.read()
    if 'article-23.html' in text:
        return False  # already added

    new_blocks = build_sitemap_block()
    # Insert before </urlset>
    text = text.replace('</urlset>', new_blocks + '\n</urlset>')
    with open(fp, 'w', encoding='utf-8') as f:
        f.write(text)
    return True


def main():
    print('=== Updating article-index pages ===')
    for L in LOCALES:
        ok = update_index(L)
        print(f'  articles/{L}/index.html: {"updated" if ok else "skipped (already has card)"}')
    print('\n=== Updating sitemap.xml ===')
    ok = update_sitemap()
    print(f'  sitemap.xml: {"appended 17 article-23 entries" if ok else "skipped (already present)"}')


if __name__ == '__main__':
    main()
