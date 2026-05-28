"""Localize byline 'By' label, English job titles, and breadcrumb Home/Articles
in all non-EN article files. Idempotent.
"""
import os
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))

LOCALES = {
    'ru': {
        'home': 'Главная', 'articles_label': 'Статьи', 'by': 'Автор:',
        'titles': {
            'Applied Linguistics Lead': 'руководитель направления прикладной лингвистики',
            'Gaming Overlay Engineer': 'инженер игровых оверлеев',
            'Real-time Pipelines Engineer': 'инженер real-time пайплайнов',
            'Speech Recognition Engineer': 'инженер распознавания речи',
            'Streaming Platforms Engineer': 'инженер по стриминговым платформам',
        }
    },
    'ja': {
        'home': 'ホーム', 'articles_label': '記事一覧', 'by': '著者:',
        'titles': {
            'Applied Linguistics Lead': '応用言語学リード',
            'Gaming Overlay Engineer': 'ゲーミングオーバーレイ エンジニア',
            'Real-time Pipelines Engineer': 'リアルタイム パイプライン エンジニア',
            'Speech Recognition Engineer': '音声認識エンジニア',
            'Streaming Platforms Engineer': 'ストリーミングプラットフォーム エンジニア',
        }
    },
    'zh': {
        'home': '首页', 'articles_label': '文章', 'by': '作者：',
        'titles': {
            'Applied Linguistics Lead': '应用语言学负责人',
            'Gaming Overlay Engineer': '游戏覆盖层工程师',
            'Real-time Pipelines Engineer': '实时流水线工程师',
            'Speech Recognition Engineer': '语音识别工程师',
            'Streaming Platforms Engineer': '流媒体平台工程师',
        }
    },
    'ko': {
        'home': '홈', 'articles_label': '기사', 'by': '저자:',
        'titles': {
            'Applied Linguistics Lead': '응용 언어학 리드',
            'Gaming Overlay Engineer': '게이밍 오버레이 엔지니어',
            'Real-time Pipelines Engineer': '실시간 파이프라인 엔지니어',
            'Speech Recognition Engineer': '음성 인식 엔지니어',
            'Streaming Platforms Engineer': '스트리밍 플랫폼 엔지니어',
        }
    },
    'ar': {
        'home': 'الرئيسية', 'articles_label': 'المقالات', 'by': 'الكاتب:',
        'titles': {
            'Applied Linguistics Lead': 'قائد علم اللغة التطبيقي',
            'Gaming Overlay Engineer': 'مهندس واجهات الألعاب',
            'Real-time Pipelines Engineer': 'مهندس الأنابيب الزمنية الحقيقية',
            'Speech Recognition Engineer': 'مهندس التعرف على الكلام',
            'Streaming Platforms Engineer': 'مهندس منصات البث',
        }
    },
    'hi': {
        'home': 'मुखपृष्ठ', 'articles_label': 'लेख', 'by': 'लेखक:',
        'titles': {
            'Applied Linguistics Lead': 'अनुप्रयुक्त भाषाविज्ञान प्रमुख',
            'Gaming Overlay Engineer': 'गेमिंग ओवरले इंजीनियर',
            'Real-time Pipelines Engineer': 'रियल-टाइम पाइपलाइन इंजीनियर',
            'Speech Recognition Engineer': 'वाक् पहचान इंजीनियर',
            'Streaming Platforms Engineer': 'स्ट्रीमिंग प्लेटफ़ॉर्म इंजीनियर',
        }
    },
    'de': {
        'home': 'Startseite', 'articles_label': 'Artikel', 'by': 'Autor:',
        'titles': {
            'Applied Linguistics Lead': 'Lead Angewandte Linguistik',
            'Gaming Overlay Engineer': 'Gaming-Overlay-Engineer',
            'Real-time Pipelines Engineer': 'Echtzeit-Pipelines-Engineer',
            'Speech Recognition Engineer': 'Spracherkennungs-Engineer',
            'Streaming Platforms Engineer': 'Streaming-Plattformen-Engineer',
        }
    },
    'es': {
        'home': 'Inicio', 'articles_label': 'Artículos', 'by': 'Autor:',
        'titles': {
            'Applied Linguistics Lead': 'líder de lingüística aplicada',
            'Gaming Overlay Engineer': 'ingeniero de overlays de gaming',
            'Real-time Pipelines Engineer': 'ingeniero de pipelines en tiempo real',
            'Speech Recognition Engineer': 'ingeniero de reconocimiento de voz',
            'Streaming Platforms Engineer': 'ingeniero de plataformas de streaming',
        }
    },
    'fr': {
        'home': 'Accueil', 'articles_label': 'Articles', 'by': 'Auteur :',
        'titles': {
            'Applied Linguistics Lead': 'responsable linguistique appliquée',
            'Gaming Overlay Engineer': 'ingénieur overlays gaming',
            'Real-time Pipelines Engineer': 'ingénieur pipelines temps réel',
            'Speech Recognition Engineer': 'ingénieur reconnaissance vocale',
            'Streaming Platforms Engineer': 'ingénieur plateformes de streaming',
        }
    },
    'it': {
        'home': 'Home', 'articles_label': 'Articoli', 'by': 'Autore:',
        'titles': {
            'Applied Linguistics Lead': 'responsabile linguistica applicata',
            'Gaming Overlay Engineer': 'ingegnere overlay gaming',
            'Real-time Pipelines Engineer': 'ingegnere pipeline real-time',
            'Speech Recognition Engineer': 'ingegnere riconoscimento vocale',
            'Streaming Platforms Engineer': 'ingegnere piattaforme streaming',
        }
    },
    'pl': {
        'home': 'Strona główna', 'articles_label': 'Artykuły', 'by': 'Autor:',
        'titles': {
            'Applied Linguistics Lead': 'kierownik lingwistyki stosowanej',
            'Gaming Overlay Engineer': 'inżynier nakładek gamingowych',
            'Real-time Pipelines Engineer': 'inżynier potoków czasu rzeczywistego',
            'Speech Recognition Engineer': 'inżynier rozpoznawania mowy',
            'Streaming Platforms Engineer': 'inżynier platform streamingowych',
        }
    },
    'pt': {
        'home': 'Início', 'articles_label': 'Artigos', 'by': 'Autor:',
        'titles': {
            'Applied Linguistics Lead': 'líder de linguística aplicada',
            'Gaming Overlay Engineer': 'engenheiro de overlays de games',
            'Real-time Pipelines Engineer': 'engenheiro de pipelines em tempo real',
            'Speech Recognition Engineer': 'engenheiro de reconhecimento de voz',
            'Streaming Platforms Engineer': 'engenheiro de plataformas de streaming',
        }
    },
    'tr': {
        'home': 'Ana Sayfa', 'articles_label': 'Makaleler', 'by': 'Yazar:',
        'titles': {
            'Applied Linguistics Lead': 'uygulamalı dilbilim lideri',
            'Gaming Overlay Engineer': 'oyun overlay mühendisi',
            'Real-time Pipelines Engineer': 'gerçek zamanlı pipeline mühendisi',
            'Speech Recognition Engineer': 'konuşma tanıma mühendisi',
            'Streaming Platforms Engineer': 'streaming platformları mühendisi',
        }
    },
    'uk': {
        'home': 'Головна', 'articles_label': 'Статті', 'by': 'Автор:',
        'titles': {
            'Applied Linguistics Lead': 'керівник прикладної лінгвістики',
            'Gaming Overlay Engineer': 'інженер ігрових оверлеїв',
            'Real-time Pipelines Engineer': 'інженер real-time пайплайнів',
            'Speech Recognition Engineer': 'інженер розпізнавання мовлення',
            'Streaming Platforms Engineer': 'інженер стрімінгових платформ',
        }
    },
    'nl': {
        'home': 'Home', 'articles_label': 'Artikelen', 'by': 'Auteur:',
        'titles': {
            'Applied Linguistics Lead': 'hoofd toegepaste taalkunde',
            'Gaming Overlay Engineer': 'gaming overlay engineer',
            'Real-time Pipelines Engineer': 'real-time pipeline engineer',
            'Speech Recognition Engineer': 'spraakherkenning engineer',
            'Streaming Platforms Engineer': 'streaming platforms engineer',
        }
    },
}

# Multi-line breadcrumb position 1 patterns to find (both compact and indented variants)
OLD_BC_HOME_INDENTED = '"name": "Home",\n                "item": "https://live-subtitles.com/"'
OLD_BC_HOME_COMPACT = '"name": "Home", "item": "https://live-subtitles.com/"'

# Breadcrumb position 2 'Articles' label
OLD_BC_ARTICLES = '"name": "Articles"'

# Author byline anchor (starts with " >By <a href=\"/about/team/")
OLD_BY = '>By <a href="/about/team/'


def fix_file(path: str, locale_key: str) -> int:
    loc = LOCALES[locale_key]
    with open(path, 'r', encoding='utf-8') as f:
        text = f.read()
    original = text

    # 1. Breadcrumb position 1: localize Home label + URL (handle both indented and compact)
    new_indented = f'"name": "{loc["home"]}",\n                "item": "https://live-subtitles.com/{locale_key}/"'
    new_compact = f'"name": "{loc["home"]}", "item": "https://live-subtitles.com/{locale_key}/"'
    text = text.replace(OLD_BC_HOME_INDENTED, new_indented)
    text = text.replace(OLD_BC_HOME_COMPACT, new_compact)

    # 1b. Fallback: 'Home' label with already-locale-correct URL (label-only fix).
    # This covers files where URL is already /<locale>/ but label is still 'Home'.
    if loc['home'] != 'Home':
        text = text.replace(
            f'"name": "Home", "item": "https://live-subtitles.com/{locale_key}/"',
            f'"name": "{loc["home"]}", "item": "https://live-subtitles.com/{locale_key}/"'
        )
        text = text.replace(
            f'"name": "Home",\n                "item": "https://live-subtitles.com/{locale_key}/"',
            f'"name": "{loc["home"]}",\n                "item": "https://live-subtitles.com/{locale_key}/"'
        )

    # 2. Breadcrumb position 2: localize 'Articles' label only (URL already locale-correct)
    text = text.replace(OLD_BC_ARTICLES, f'"name": "{loc["articles_label"]}"')

    # 3. Author byline: replace English 'By' with localized 'Author:'
    text = text.replace(OLD_BY, f'>{loc["by"]} <a href="/about/team/')

    # 4. Job titles after '&middot;' in author byline
    for en_title, local_title in loc['titles'].items():
        text = text.replace(
            f'&middot; {en_title}, Live Subtitles',
            f'&middot; {local_title}, Live Subtitles'
        )

    if text != original:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(text)
        return 1
    return 0


def main():
    total = 0
    skipped = 0
    for locale_key in LOCALES:
        locale_dir = os.path.join(ROOT, 'articles', locale_key)
        if not os.path.isdir(locale_dir):
            continue
        for fname in sorted(os.listdir(locale_dir)):
            if not fname.startswith('article-') or not fname.endswith('.html'):
                continue
            fp = os.path.join(locale_dir, fname)
            changed = fix_file(fp, locale_key)
            if changed:
                total += 1
                print(f'FIXED articles/{locale_key}/{fname}')
            else:
                skipped += 1
    print(f'\nTotal fixed: {total}; unchanged: {skipped}')


if __name__ == '__main__':
    main()
