"""Fix meta description + meta language tag in locale root index.html files.
14 of 15 locales had English meta description; all 15 had `language=English`.
"""
import os

ROOT = os.path.dirname(os.path.abspath(__file__))

# English meta description currently on most locale roots
OLD_DESCRIPTION = '"AI live captions & dual subtitles for Windows. Real-time translation in 50+ languages for Zoom, Teams, Netflix, YouTube & any app. Free trial — no microphone needed."'

# Localized descriptions and language names
LOCALES = {
    'ru': {
        'desc': 'AI-субтитры и двойные субтитры для Windows. Перевод речи в реальном времени на 50+ языков для Zoom, Teams, Netflix, YouTube и любых приложений. Бесплатный пробный период — микрофон не нужен.',
        'language': 'Russian',
    },
    'ja': {
        'desc': 'Windows向けAIライブ字幕とデュアル字幕。Zoom・Teams・Netflix・YouTubeなどあらゆるアプリ向けに50以上の言語へリアルタイム翻訳。マイク不要の無料試用版。',
        'language': 'Japanese',
    },
    'zh': {
        'desc': 'Windows端的AI实时字幕和双语字幕。为Zoom、Teams、Netflix、YouTube及任何应用提供50+语言的实时翻译。免费试用，无需麦克风。',
        'language': 'Chinese',
    },
    'ko': {
        'desc': 'Windows용 AI 실시간 자막 및 이중 자막. Zoom, Teams, Netflix, YouTube 등 모든 앱에서 50개 이상의 언어로 실시간 번역. 무료 체험 — 마이크 불필요.',
        'language': 'Korean',
    },
    'ar': {
        'desc': 'تعليقات توضيحية مباشرة وترجمة مزدوجة بالذكاء الاصطناعي لنظام Windows. ترجمة فورية بأكثر من 50 لغة لـ Zoom وTeams وNetflix وYouTube وأي تطبيق. تجربة مجانية — بدون ميكروفون.',
        'language': 'Arabic',
    },
    'hi': {
        'desc': 'Windows के लिए AI लाइव कैप्शन और दोहरे सबटाइटल। Zoom, Teams, Netflix, YouTube और किसी भी ऐप के लिए 50+ भाषाओं में रियल-टाइम अनुवाद। मुफ्त ट्रायल — माइक्रोफ़ोन की आवश्यकता नहीं।',
        'language': 'Hindi',
    },
    'de': {
        'desc': 'Live-Übersetzer für PC: übersetzt Sprache in Echtzeit in 50+ Sprachen. Funktioniert mit Zoom, Teams, Skype, Google Meet und jeder Anwendung. Kostenlose Testversion — ohne Mikrofon.',
        'language': 'German',
    },
    'es': {
        'desc': 'Subtítulos en vivo con IA y subtítulos duales para Windows. Traducción en tiempo real a 50+ idiomas para Zoom, Teams, Netflix, YouTube y cualquier aplicación. Prueba gratuita — sin micrófono.',
        'language': 'Spanish',
    },
    'fr': {
        'desc': 'Sous-titres en direct par IA et sous-titres doubles pour Windows. Traduction en temps réel dans 50+ langues pour Zoom, Teams, Netflix, YouTube et toute application. Essai gratuit — sans microphone.',
        'language': 'French',
    },
    'it': {
        'desc': 'Sottotitoli in tempo reale con IA e sottotitoli doppi per Windows. Traduzione live in oltre 50 lingue per Zoom, Teams, Netflix, YouTube e qualsiasi app. Prova gratuita — senza microfono.',
        'language': 'Italian',
    },
    'pl': {
        'desc': 'Napisy na żywo z AI i podwójne napisy dla Windows. Tłumaczenie w czasie rzeczywistym na 50+ języków dla Zoom, Teams, Netflix, YouTube i każdej aplikacji. Darmowy okres próbny — bez mikrofonu.',
        'language': 'Polish',
    },
    'pt': {
        'desc': 'Legendas ao vivo com IA e legendas duplas para Windows. Tradução em tempo real em 50+ idiomas para Zoom, Teams, Netflix, YouTube e qualquer aplicativo. Teste grátis — sem microfone.',
        'language': 'Portuguese',
    },
    'tr': {
        'desc': 'Windows için AI canlı altyazılar ve çift altyazılar. Zoom, Teams, Netflix, YouTube ve her uygulama için 50+ dilde gerçek zamanlı çeviri. Mikrofon gerektirmeyen ücretsiz deneme sürümü.',
        'language': 'Turkish',
    },
    'uk': {
        'desc': 'AI-субтитри та подвійні субтитри для Windows. Переклад мовлення в реальному часі на 50+ мов для Zoom, Teams, Netflix, YouTube та будь-яких застосунків. Безкоштовний пробний період — мікрофон не потрібен.',
        'language': 'Ukrainian',
    },
    'nl': {
        'desc': 'AI live ondertiteling en dubbele ondertitels voor Windows. Realtime vertaling in 50+ talen voor Zoom, Teams, Netflix, YouTube en elke app. Gratis proefperiode — geen microfoon nodig.',
        'language': 'Dutch',
    },
}


def fix_file(path: str, locale_key: str) -> int:
    loc = LOCALES[locale_key]
    with open(path, 'r', encoding='utf-8') as f:
        text = f.read()
    original = text

    # 1. Replace the English meta description (if still present)
    text = text.replace(OLD_DESCRIPTION, f'"{loc["desc"]}"')

    # 2. Fix meta language tag: always rewrite (idempotent — assigns the right value)
    text = text.replace(
        '<meta name="language" content="English">',
        f'<meta name="language" content="{loc["language"]}">'
    )

    if text != original:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(text)
        return 1
    return 0


def main():
    total = 0
    for locale_key in LOCALES:
        fp = os.path.join(ROOT, locale_key, 'index.html')
        if not os.path.exists(fp):
            print(f'MISSING: {locale_key}/index.html')
            continue
        if fix_file(fp, locale_key):
            print(f'FIXED {locale_key}/index.html')
            total += 1
        else:
            print(f'unchanged {locale_key}/index.html')
    print(f'\nTotal fixed: {total}')


if __name__ == '__main__':
    main()
