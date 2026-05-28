"""Diversify hero images across pillar articles 23-26 to avoid Google Images
dedup signals from all 64 articles using the same meetings.webp.

Mapping:
- article-23 (voice translation) → meetings.webp (kept)
- article-24 (transcription)     → learning.webp (changed)
- article-25 (live captions)     → meetings.webp (kept)
- article-26 (AirPods)           → movies.webp   (changed)

Idempotent: only replaces 'meetings.webp' references in article-24 and article-26.
"""
import os

ROOT = os.path.dirname(os.path.abspath(__file__))
ALL_LOCALES = ['en', 'ru', 'ja', 'zh', 'ko', 'ar', 'hi', 'de', 'es', 'fr', 'it', 'pl', 'pt', 'tr', 'uk', 'nl']

# Image alt text per locale and per image type
ALTS = {
    'learning': {
        'en': 'Real-time audio transcription with live captions on a laptop screen',
        'ja': 'ノートPC画面上のリアルタイム音声文字起こしとライブ字幕',
        'de': 'Echtzeit-Audio-Transkription mit Live-Untertiteln auf einem Laptop-Bildschirm',
        'ru': 'Реал-тайм транскрипция аудио с живыми субтитрами на экране ноутбука',
        'es': 'Transcripción de audio en tiempo real con subtítulos en vivo en un portátil',
        'fr': "Transcription audio en temps réel avec sous-titres en direct sur un ordinateur portable",
        'it': 'Trascrizione audio in tempo reale con sottotitoli live su un laptop',
        'ko': '노트북 화면에 실시간 자막이 표시되는 실시간 오디오 전사',
        'zh': '笔记本电脑屏幕上的实时音频转录与实时字幕',
        'pl': 'Transkrypcja audio w czasie rzeczywistym z napisami na ekranie laptopa',
        'pt': 'Transcrição de áudio em tempo real com legendas ao vivo em um laptop',
        'tr': 'Dizüstü ekranda canlı altyazılarla gerçek zamanlı ses transkripsiyonu',
        'uk': 'Реал-тайм транскрипція аудіо з живими субтитрами на екрані ноутбука',
        'ar': 'تفريغ صوتي فوري مع تعليقات حية على شاشة الحاسوب المحمول',
        'hi': 'लैपटॉप स्क्रीन पर लाइव कैप्शन के साथ रियल-टाइम ऑडियो ट्रांसक्रिप्शन',
        'nl': 'Realtime audio-transcriptie met live ondertiteling op een laptopscherm',
    },
    'movies': {
        'en': 'AirPods translating speech live during a face-to-face conversation',
        'ja': '対面会話中にAirPodsが音声を翻訳する様子',
        'de': 'AirPods übersetzen Sprache live während eines persönlichen Gesprächs',
        'ru': 'AirPods переводят речь в реальном времени во время личной беседы',
        'es': 'AirPods traduciendo voz en directo durante una conversación cara a cara',
        'fr': "AirPods traduisant la parole en direct lors d'une conversation en face-à-face",
        'it': 'AirPods che traducono il parlato in diretta durante una conversazione faccia a faccia',
        'ko': '대면 대화 중 AirPods로 실시간 음성 번역',
        'zh': '面对面交谈中 AirPods 实时翻译语音',
        'pl': 'AirPods tłumaczące mowę na żywo podczas rozmowy twarzą w twarz',
        'pt': 'AirPods traduzindo fala ao vivo durante uma conversa cara a cara',
        'tr': "Yüz yüze konuşma sırasında AirPods'un konuşmayı canlı olarak çevirmesi",
        'uk': 'AirPods перекладають мову в реальному часі під час особистої бесіди',
        'ar': 'AirPods تترجم الكلام مباشرة أثناء محادثة وجهًا لوجه',
        'hi': "आमने-सामने बातचीत के दौरान AirPods लाइव भाषा अनुवाद कर रहे हैं",
        'nl': 'AirPods vertalen spraak live tijdens een persoonlijk gesprek',
    },
}

# Image dimensions (height varies per locale)
HEIGHTS = {
    'en': 719, 'ja': 781, 'de': 719, 'ru': 781, 'es': 719, 'fr': 781, 'it': 781,
    'ko': 781, 'zh': 781, 'pl': 781, 'pt': 781, 'tr': 781, 'uk': 781,
    'ar': 781, 'hi': 781, 'nl': 781,
}


def swap_image(article_num: int, new_image_name: str, alt_key: str):
    """Replace 'meetings.webp' references with the new image name + alt text."""
    for L in ALL_LOCALES:
        fp = os.path.join(ROOT, 'articles', L, f'article-{article_num}.html')
        if not os.path.exists(fp):
            continue
        with open(fp, 'r', encoding='utf-8') as f:
            text = f.read()
        if f'/{new_image_name}.webp' in text:
            print(f'  SKIP articles/{L}/article-{article_num}.html (already {new_image_name})')
            continue

        # Replace filename in all references
        text = text.replace(f'/articles/img/{L}/meetings.webp', f'/articles/img/{L}/{new_image_name}.webp')

        # Replace alt-text in two places: meta property="og:image:alt" and img alt attribute
        new_alt = ALTS[alt_key][L]
        # We don't know exact old alt - it was the meetings alt. Use a robust replacement:
        # The image hero line has alt="..." width="1280" height="..."
        # And og:image:alt has content="..."
        # We'll do best-effort regex-free replacement by looking for unique anchors.
        import re
        # 1) og:image:alt
        text = re.sub(
            r'(<meta property="og:image:alt" content=")[^"]*(")',
            r'\g<1>' + new_alt + r'\g<2>',
            text
        )
        # 2) img alt= in hero
        text = re.sub(
            r'(<img class="article-hero"[^>]*alt=")[^"]*(")',
            r'\g<1>' + new_alt + r'\g<2>',
            text
        )

        with open(fp, 'w', encoding='utf-8') as f:
            f.write(text)
        print(f'  CHANGED articles/{L}/article-{article_num}.html -> {new_image_name}.webp')


def main():
    print('=== article-24: meetings.webp -> learning.webp ===')
    swap_image(24, 'learning', 'learning')
    print('\n=== article-26: meetings.webp -> movies.webp ===')
    swap_image(26, 'movies', 'movies')
    print('\nDone.')


if __name__ == '__main__':
    main()
