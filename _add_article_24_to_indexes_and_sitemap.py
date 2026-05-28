"""Add article-24 cards to articles/<locale>/index.html and sitemap entries
with hreflang clusters. Only includes locales where article-24.html actually exists.
"""
import os
import re

ROOT = os.path.dirname(os.path.abspath(__file__))
ALL_LOCALES = ['en', 'ru', 'ja', 'zh', 'ko', 'ar', 'hi', 'de', 'es', 'fr', 'it', 'pl', 'pt', 'tr', 'uk', 'nl']


def existing_locales():
    return [L for L in ALL_LOCALES if os.path.exists(os.path.join(ROOT, 'articles', L, 'article-24.html'))]


# Article-24 metadata per locale
CARDS = {
    'en': {'title': 'Transcribe Audio to Text in 2026: Real-Time vs Batch Transcription Compared', 'date_iso': '2026-05-28', 'date_label': 'May 28, 2026', 'desc': 'A 2026 comparison of audio-to-text tools by workflow — real-time live captions vs batch upload — picked by use case.'},
    'ru': {'title': 'Транскрибация аудио в текст 2026: реал-тайм vs батч-транскрипция', 'date_iso': '2026-05-28', 'date_label': '28 мая 2026 г.', 'desc': 'Сравнение инструментов транскрибации аудио в текст в 2026 году по рабочему процессу — реал-тайм vs батч.'},
    'ja': {'title': '音声を文字起こしする 2026年版：リアルタイム vs バッチ徹底比較', 'date_iso': '2026-05-28', 'date_label': '2026年5月28日', 'desc': '2026年の音声文字起こしツールをワークフロー別に比較：リアルタイムとバッチ。'},
    'zh': {'title': '2026 年音频转文字：实时 vs 批量转录对比', 'date_iso': '2026-05-28', 'date_label': '2026 年 5 月 28 日', 'desc': '2026 年按工作流对比音频转文字工具：实时实时字幕 vs 批量上传。'},
    'ko': {'title': '2026년 오디오를 텍스트로 변환: 실시간 vs 배치 전사 비교', 'date_iso': '2026-05-28', 'date_label': '2026년 5월 28일', 'desc': '2026년 오디오-텍스트 변환 도구를 워크플로별로 비교: 실시간 라이브 자막 vs 배치 업로드.'},
    'ar': {'title': 'تحويل الصوت إلى نص في 2026: مقارنة بين التفريغ الفوري والمجمّع', 'date_iso': '2026-05-28', 'date_label': '28 مايو 2026', 'desc': 'مقارنة 2026 لأدوات تحويل الصوت إلى نص حسب سير العمل: التعليقات الفورية مقابل التحميل المجمّع.'},
    'hi': {'title': '2026 में ऑडियो को टेक्स्ट में बदलें: रीयल-टाइम vs बैच ट्रांसक्रिप्शन', 'date_iso': '2026-05-28', 'date_label': '28 मई 2026', 'desc': '2026 में ऑडियो-टू-टेक्स्ट टूल्स की वर्कफ़्लो के अनुसार तुलना: रीयल-टाइम लाइव कैप्शन vs बैच अपलोड।'},
    'de': {'title': 'Audio in Text umwandeln 2026: Echtzeit- vs Batch-Transkription im Vergleich', 'date_iso': '2026-05-28', 'date_label': '28. Mai 2026', 'desc': 'Vergleich 2026 von Audio-zu-Text-Tools nach Workflow: Echtzeit-Live-Untertitel vs Batch-Upload.'},
    'es': {'title': 'Transcribir audio a texto 2026: transcripción en tiempo real vs por lotes', 'date_iso': '2026-05-28', 'date_label': '28 de mayo de 2026', 'desc': 'Comparativa 2026 de herramientas de transcripción de audio a texto por flujo: tiempo real vs por lotes.'},
    'fr': {'title': "Transcrire l'audio en texte 2026 : transcription en temps réel vs par lots", 'date_iso': '2026-05-28', 'date_label': '28 mai 2026', 'desc': "Comparatif 2026 des outils audio-vers-texte par workflow : temps réel vs lots."},
    'it': {'title': 'Trascrivere audio in testo 2026: trascrizione in tempo reale vs in batch', 'date_iso': '2026-05-28', 'date_label': '28 maggio 2026', 'desc': "Confronto 2026 di strumenti audio-in-testo per workflow: tempo reale vs batch."},
    'pl': {'title': 'Transkrypcja audio na tekst 2026: transkrypcja w czasie rzeczywistym vs wsadowa', 'date_iso': '2026-05-28', 'date_label': '28 maja 2026', 'desc': 'Porównanie 2026 narzędzi audio-na-tekst według workflow: czas rzeczywisty vs wsad.'},
    'pt': {'title': 'Transcrever áudio para texto em 2026: transcrição em tempo real vs em lotes', 'date_iso': '2026-05-28', 'date_label': '28 de maio de 2026', 'desc': 'Comparativo 2026 de ferramentas áudio-para-texto por workflow: tempo real vs em lotes.'},
    'tr': {'title': 'Sesi metne dönüştürme 2026: gerçek zamanlı vs toplu transkripsiyon karşılaştırması', 'date_iso': '2026-05-28', 'date_label': '28 Mayıs 2026', 'desc': "2026'da ses-metin araçlarını iş akışına göre karşılaştırma: gerçek zamanlı vs toplu yükleme."},
    'uk': {'title': 'Транскрибація аудіо в текст 2026: реал-тайм vs батч-транскрипція', 'date_iso': '2026-05-28', 'date_label': '28 травня 2026', 'desc': 'Порівняння інструментів транскрибації аудіо в текст у 2026 за робочим процесом: реал-тайм vs батч.'},
    'nl': {'title': 'Audio naar tekst transcriberen 2026: realtime vs batch-transcriptie vergeleken', 'date_iso': '2026-05-28', 'date_label': '28 mei 2026', 'desc': 'Vergelijking 2026 van audio-naar-tekst-tools per workflow: realtime live ondertiteling vs batch-upload.'},
}


def make_card(locale: str) -> str:
    c = CARDS[locale]
    return (
        '        <div class="article-card" itemscope itemtype="https://schema.org/Article">\n'
        f'            <a href="article-24.html" class="article-title" itemprop="headline">{c["title"]}</a>\n'
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
    if 'article-24.html' in text:
        return False

    card = make_card(locale)
    anchor = '<a href="article-23.html"'
    idx = text.find(anchor)
    if idx == -1:
        anchor = '<a href="article-17.html"'
        idx = text.find(anchor)
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


def build_sitemap_block(locales: list) -> str:
    """Build url blocks for article-24 across the provided locales with hreflang cluster."""
    hreflang_lines = [f'        <xhtml:link rel="alternate" hreflang="x-default" href="https://live-subtitles.com/articles/en/article-24.html" />']
    for L in locales:
        hreflang_lines.append(f'        <xhtml:link rel="alternate" hreflang="{L}" href="https://live-subtitles.com/articles/{L}/article-24.html" />')

    blocks = []
    for L in locales:
        loc_url = f'https://live-subtitles.com/articles/{L}/article-24.html'
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


def update_sitemap(locales: list) -> bool:
    fp = os.path.join(ROOT, 'sitemap.xml')
    with open(fp, 'r', encoding='utf-8') as f:
        text = f.read()
    if 'article-24.html' in text:
        return False
    new_blocks = build_sitemap_block(locales)
    text = text.replace('</urlset>', new_blocks + '\n</urlset>')
    with open(fp, 'w', encoding='utf-8') as f:
        f.write(text)
    return True


def main():
    locales = existing_locales()
    print(f'=== Found article-24 in {len(locales)} locales: {locales} ===')

    print('\n=== Updating article-index pages ===')
    for L in locales:
        ok = update_index(L)
        print(f'  articles/{L}/index.html: {"updated" if ok else "skipped"}')
    print('\n=== Updating sitemap.xml ===')
    ok = update_sitemap(locales)
    print(f'  sitemap.xml: {"appended" if ok else "skipped"} {len(locales)} article-24 entries')


if __name__ == '__main__':
    main()
