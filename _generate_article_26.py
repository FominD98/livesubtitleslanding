"""Generate article-26 (AirPods Live Translation iOS 26 review) in all 16 locales.
Author: Daniel Formind (Founder & Engineer)
Target keywords: airpods live translate 8.1k LOW, apple live translate 3.6k LOW
"""
import os

ROOT = os.path.dirname(os.path.abspath(__file__))

ALL_LOCALES = ['en', 'ru', 'ja', 'zh', 'ko', 'ar', 'hi', 'de', 'es', 'fr', 'it', 'pl', 'pt', 'tr', 'uk', 'nl']
OG_LOCALES = {'en': 'en_US', 'ru': 'ru_RU', 'ja': 'ja_JP', 'zh': 'zh_CN', 'ko': 'ko_KR', 'ar': 'ar_SA',
              'hi': 'hi_IN', 'de': 'de_DE', 'es': 'es_ES', 'fr': 'fr_FR', 'it': 'it_IT', 'pl': 'pl_PL',
              'pt': 'pt_BR', 'tr': 'tr_TR', 'uk': 'uk_UA', 'nl': 'nl_NL'}

AUTHOR_NAME = 'Daniel Formind'
AUTHOR_URL = 'https://live-subtitles.com/about/team/daniel-formind.html'
AUTHOR_ROLES = {
    'en': 'Founder & Engineer, Live Subtitles',
    'ru': 'основатель и инженер, Live Subtitles',
    'ja': '創業者・エンジニア, Live Subtitles',
    'zh': '创始人兼工程师, Live Subtitles',
    'ko': '창립자 및 엔지니어, Live Subtitles',
    'ar': 'مؤسس ومهندس, Live Subtitles',
    'hi': 'संस्थापक और इंजीनियर, Live Subtitles',
    'de': 'Gründer & Engineer, Live Subtitles',
    'es': 'fundador e ingeniero, Live Subtitles',
    'fr': 'fondateur et ingénieur, Live Subtitles',
    'it': 'fondatore e ingegnere, Live Subtitles',
    'pl': 'założyciel i inżynier, Live Subtitles',
    'pt': 'fundador e engenheiro, Live Subtitles',
    'tr': 'kurucu ve mühendis, Live Subtitles',
    'uk': 'засновник та інженер, Live Subtitles',
    'nl': 'oprichter en engineer, Live Subtitles',
}


def hreflang_block() -> str:
    lines = ['    <link rel="alternate" hreflang="x-default" href="https://live-subtitles.com/articles/en/article-26.html" />']
    for L in ALL_LOCALES:
        lines.append(f'    <link rel="alternate" hreflang="{L}" href="https://live-subtitles.com/articles/{L}/article-26.html" />')
    return '\n'.join(lines)


def render(locale: str, d: dict) -> str:
    dir_attr = ' dir="rtl"' if locale == 'ar' else ''
    og_locale = OG_LOCALES[locale]
    img_height = 781
    rel_links = '\n'.join(
        f'                    <li><a href="article-{n}.html" style="color: #00b8ff; text-decoration: none;">{title}</a></li>'
        for n, title in d['related']
    )

    return f'''<!DOCTYPE html>
<html lang="{locale}"{dir_attr}>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Yandex.Metrika counter -->
    <script src="/yandex-metrika.js"></script>
    <noscript><div><img src="https://mc.yandex.ru/watch/101009280" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
    <!-- /Yandex.Metrika counter -->
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=AW-17344614830"></script>
    <script src="/gtag-init.js"></script>
    <!-- cid passthrough + auto conversion onclick on Store links -->
    <script src="/cid-tracker.js" defer></script>
    <title>{d['title']} | Live Subtitles</title>
    <meta name="description" content="{d['description']}">
    <meta name="keywords" content="{d['keywords']}">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="https://live-subtitles.com/articles/{locale}/article-26.html" />
{hreflang_block()}
    <meta property="og:type" content="article">
    <meta property="og:title" content="{d['title']}">
    <meta property="og:description" content="{d['og_description']}">
    <meta property="og:url" content="https://live-subtitles.com/articles/{locale}/article-26.html">
    <meta property="og:image" content="https://live-subtitles.com/articles/img/{locale}/meetings.webp">
    <meta property="og:image:width" content="1280">
    <meta property="og:image:height" content="{img_height}">
    <meta property="og:image:alt" content="{d['image_alt']}">
    <meta property="og:locale" content="{og_locale}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{d['title']}">
    <meta name="twitter:description" content="{d['twitter_description']}">
    <meta name="twitter:image" content="https://live-subtitles.com/articles/img/{locale}/meetings.webp">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <style>
        body {{ background: #0a0a0a; color: #fff; font-family: 'Fira Code', monospace; }}
        .article-container {{ max-width: 920px; margin: 40px auto; background: rgba(255,255,255,0.04); border-radius: 8px; padding: 2.5rem; box-shadow: 0 2px 16px rgba(0,0,0,0.1); }}
        .article-title {{ color: #00ff9d; font-size: 2rem; margin-bottom: 1rem; }}
        .article-date {{ color: #aaa; font-size: 0.95rem; margin-bottom: 1.5rem; }}
        .back-link {{ color: #00b8ff; text-decoration: none; margin-bottom: 2rem; display: inline-block; }}
        .back-link:hover {{ text-decoration: underline; }}
        h2, h3 {{ color: #00ff9d; margin-top: 2rem; }}
        p, li, td, th {{ color: #eee; }}
        table {{ width: 100%; border-collapse: collapse; margin-top: 1rem; }}
        th, td {{ border: 1px solid rgba(255,255,255,0.18); padding: 0.65rem; vertical-align: top; }}
        th {{ background: rgba(0,255,157,0.08); color: #fff; }}
    </style>
    <script type="application/ld+json">
    {{
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "{d['title']}",
      "datePublished": "2026-05-28",
      "dateModified": "2026-05-28",
      "author": {{ "@type": "Person", "name": "{AUTHOR_NAME}", "url": "{AUTHOR_URL}", "jobTitle": "{AUTHOR_ROLES[locale]}" }},
      "publisher": {{ "@type": "Organization", "name": "Live Subtitles" }},
      "description": "{d['description']}",
      "mainEntityOfPage": "https://live-subtitles.com/articles/{locale}/article-26.html"
    }}
    </script>
    <script type="application/ld+json">
    {{
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {{ "@type": "ListItem", "position": 1, "name": "{d['home_label']}", "item": "https://live-subtitles.com/{locale}/" }},
        {{ "@type": "ListItem", "position": 2, "name": "{d['articles_label']}", "item": "https://live-subtitles.com/articles/{locale}/" }},
        {{ "@type": "ListItem", "position": 3, "name": "{d['breadcrumb_short']}", "item": "https://live-subtitles.com/articles/{locale}/article-26.html" }}
      ]
    }}
    </script>
    <link rel="preload" as="image" href="/articles/img/{locale}/meetings.webp">
</head>
<body>
    <div class="container article-container" itemscope itemtype="https://schema.org/Article">
        <a href="index.html" class="back-link">← {d['back_link']}</a>
        <h1 class="article-title" itemprop="headline">{d['title']}</h1>
        <div class="article-date" itemprop="datePublished" content="2026-05-28">{d['date_label']}</div>
        <div class="article-author" style="color:#aaa; font-size:0.95rem; margin-bottom:1.5rem;">{d['author_label']}: <a href="{AUTHOR_URL}" rel="author" style="color:#00b8ff; text-decoration:none;">{AUTHOR_NAME}</a> &middot; {AUTHOR_ROLES[locale]}</div>
        <div class="article-updated" itemprop="dateModified" content="2026-05-28" style="color:#888; font-size:0.9rem; margin-bottom:1.5rem;">{d['updated_label']}: {d['date_label']}</div>
        <img class="article-hero" src="/articles/img/{locale}/meetings.webp" alt="{d['image_alt']}" width="1280" height="{img_height}" loading="eager" decoding="async" fetchpriority="high" style="display:block; width:100%; height:auto; border-radius:8px; margin:0 0 1.5rem 0;">

        <div itemprop="articleBody">
            <p>{d['intro']}</p>

            <h2>{d['h2_1']}</h2>
            <p>{d['p_1']}</p>

            <h2>{d['h2_2']}</h2>
            <ul>
                <li>{d['li_2a']}</li>
                <li>{d['li_2b']}</li>
                <li>{d['li_2c']}</li>
            </ul>

            <h2>{d['h2_3']}</h2>
            <ul>
                <li>{d['li_3a']}</li>
                <li>{d['li_3b']}</li>
                <li>{d['li_3c']}</li>
            </ul>

            <h2>{d['h2_4']}</h2>
            <table>
                <thead>
                    <tr>
                        <th>{d['th_1']}</th>
                        <th>{d['th_2']}</th>
                        <th>{d['th_3']}</th>
                        <th>{d['th_4']}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>{d['t1c1']}</td><td>{d['t1c2']}</td><td>{d['t1c3']}</td><td>{d['t1c4']}</td></tr>
                    <tr><td>{d['t2c1']}</td><td>{d['t2c2']}</td><td>{d['t2c3']}</td><td>{d['t2c4']}</td></tr>
                    <tr><td>{d['t3c1']}</td><td>{d['t3c2']}</td><td>{d['t3c3']}</td><td>{d['t3c4']}</td></tr>
                    <tr><td>{d['t4c1']}</td><td>{d['t4c2']}</td><td>{d['t4c3']}</td><td>{d['t4c4']}</td></tr>
                </tbody>
            </table>

            <h2>{d['h2_5']}</h2>
            <h3>{d['h3_1']}</h3>
            <p>{d['p_5a']}</p>
            <h3>{d['h3_2']}</h3>
            <p>{d['p_5b']}</p>

            <h2>{d['h2_faq']}</h2>
            <p><strong>{d['q1']}</strong><br>{d['a1']}</p>
            <p><strong>{d['q2']}</strong><br>{d['a2']}</p>
            <p><strong>{d['q3']}</strong><br>{d['a3']}</p>

            <h2>{d['h2_refs']}</h2>
            <ul>
                <li><a href="{d['ref1_url']}" target="_blank" rel="noopener noreferrer" style="color:#00b8ff;">{d['ref1_label']}</a></li>
                <li><a href="{d['ref2_url']}" target="_blank" rel="noopener noreferrer" style="color:#00b8ff;">{d['ref2_label']}</a></li>
                <li><a href="{d['ref3_url']}" target="_blank" rel="noopener noreferrer" style="color:#00b8ff;">{d['ref3_label']}</a></li>
            </ul>

            <div style="background: rgba(0,184,255,0.08); border-left: 4px solid #00b8ff; padding: 1.2rem; border-radius: 0 8px 8px 0; margin: 2rem 0;">
                <h3 style="color: #00b8ff; margin-top: 0;">{d['related_label']}</h3>
                <ul style="list-style: none; padding-left: 0;">
{rel_links}
                </ul>
            </div>

            <div style="background: linear-gradient(135deg, rgba(0,255,157,0.1), rgba(0,184,255,0.1)); border: 1px solid rgba(0,255,157,0.3); border-radius: 12px; padding: 2rem; margin: 2rem 0; text-align: center;">
                <h3 style="color: #00ff9d; margin-top: 0;">{d['cta_title']}</h3>
                <p style="color: #eee; margin-bottom: 1.5rem;">{d['cta_body']}</p>
                <a href="https://apps.microsoft.com/store/detail/9PH1R9DJG47S" target="_blank" style="display: inline-block; padding: 0.8rem 2rem; background: linear-gradient(135deg, #00ff9d, #00b8ff); color: #0a0a0a; text-decoration: none; border-radius: 8px; font-weight: 600;">{d['cta_button']}</a>
            </div>
        </div>
    </div>
</body>
</html>
'''


# Common references used across all locales
REF1_URL = 'https://support.apple.com/guide/iphone/translate-text-voice-and-conversations-iphd74cb450f/ios'
REF2_URL = 'https://www.apple.com/airpods/'
REF3_URL = 'https://developer.apple.com/translation/'

ART26 = {
    'en': {
        'title': "AirPods Live Translation in iOS 26: What It Does Well and Where It Falls Short",
        'description': "Honest review of AirPods Live Translation in iOS 26: how Apple's on-device translation works, what use cases it nails, and what it doesn't do (meetings, broadcast, screen-based contexts).",
        'keywords': "airpods live translate, apple live translation, ios 26 live translation, airpods translation, apple translate review",
        'og_description': "What AirPods Live Translation does well — and what use cases need something else.",
        'image_alt': "AirPods translating speech live during a face-to-face conversation",
        'home_label': 'Home', 'articles_label': 'Articles',
        'breadcrumb_short': 'AirPods Live Translation iOS 26',
        'back_link': 'Back to articles', 'date_label': 'May 28, 2026',
        'author_label': 'By', 'updated_label': 'Updated',
        'twitter_description': "Honest review of AirPods Live Translation in iOS 26 — strengths, weaknesses, and complementary tools.",
        'intro': "Apple's <strong>AirPods Live Translation</strong> in iOS 26 is one of the most-discussed accessibility features of the year. It does conversation translation surprisingly well — and almost nothing else. Knowing what it can't do is what makes you pick the right tool for your actual workflow.",
        'h2_1': 'How AirPods Live Translation actually works',
        'p_1': 'Audio captured by the iPhone (microphone or system mic-routed AirPods) goes through Apple\'s on-device speech recognition, then through the Translation framework (also on-device on Apple Silicon). Translated text is read back through AirPods using Apple\'s text-to-speech. The whole pipeline runs without sending audio to a cloud server. Latency is around 1.5–2.5 seconds per turn.',
        'h2_2': 'Where AirPods Live Translation wins',
        'li_2a': "<strong>Face-to-face travel conversations:</strong> short turns, two speakers, one of whom may not have AirPods. Perfect fit. The translated audio plays in your ear while their voice plays in the air — natural back-and-forth.",
        'li_2b': "<strong>Privacy-sensitive moments:</strong> medical, legal, or personal conversations where you don't want cloud servers in the loop. On-device processing is the differentiator.",
        'li_2c': "<strong>Quick out-loud translation:</strong> reading a menu, asking directions, confirming a booking. Hands-free convenience over a phone-screen workflow.",
        'h2_3': "Where AirPods Live Translation falls short",
        'li_3a': "<strong>Multi-speaker meetings:</strong> the feature is designed for two-person turns. A Zoom meeting with 6 people speaking over each other isn't its workflow.",
        'li_3b': "<strong>Broadcast audio (lectures, films, streams, YouTube):</strong> AirPods Live Translation doesn't read system audio; it routes microphone input. Listening to a lecture and reading translation is a captioning workflow, not an AirPods workflow.",
        'li_3c': "<strong>Desktop/laptop work:</strong> the feature lives on iPhone/iPad. If your work happens on a desktop, you need a separate caption-and-translation layer for that screen.",
        'h2_4': "AirPods Live Translation vs alternatives",
        'th_1': 'Tool', 'th_2': 'Best workflow', 'th_3': 'Strengths', 'th_4': 'Limits',
        't1c1': 'AirPods Live Translation', 't1c2': 'Conversation, travel', 't1c3': 'On-device privacy, AirPods integration, hands-free', 't1c4': 'iPhone-only; no meeting/broadcast support',
        't2c1': 'Google Translate (Conversation mode)', 't2c2': 'Conversation, travel', 't2c3': 'Free, widest language coverage, cross-platform', 't2c4': 'Phone-screen workflow rather than hands-free',
        't3c1': 'Microsoft Translator', 't3c2': 'Conversation, multi-device', 't3c3': 'Multi-device sessions for group conversations', 't3c4': 'Planned-session bias; less natural turn-taking',
        't4c1': 'Live Subtitles', 't4c2': 'Broadcast, meetings, media on desktop', 't4c3': 'System-audio captions and translation across any desktop app', 't4c4': 'Not for hands-free in-ear travel scenarios',
        'h2_5': "What to use when",
        'h3_1': "Travel & in-person",
        'p_5a': "Use AirPods Live Translation. The hands-free in-ear delivery is genuinely better than picking up the phone for every reply. Have a fallback (Google Translate) for languages Apple doesn't cover.",
        'h3_2': "Meetings, lectures, media on desktop",
        'p_5b': "Use a system-level captioning layer (Windows Live Captions, macOS Live Captions, or a third-party like Live Subtitles that does cross-app captions with translation). AirPods Live Translation simply doesn't run there.",
        'h2_faq': 'FAQ',
        'q1': 'Does AirPods Live Translation work without internet?', 'a1': 'On Apple Silicon iPhones (iPhone 15 Pro and newer), the supported language packs run on-device once downloaded.',
        'q2': 'Can I use AirPods Live Translation in a Zoom call?', 'a2': "Not as designed. The feature is for in-person speech, not system audio. For Zoom translation, use Zoom's built-in translated captions or a desktop caption layer.",
        'q3': 'Does it replace dedicated translation apps?', 'a3': 'For conversation and travel, yes for most users. For meetings, broadcasts, and desktop workflows, no.',
        'h2_refs': 'References',
        'ref1_url': REF1_URL, 'ref1_label': 'Apple — Translate text, voice, and conversations',
        'ref2_url': REF2_URL, 'ref2_label': 'Apple — AirPods overview',
        'ref3_url': REF3_URL, 'ref3_label': 'Apple Developer — Translation framework',
        'related_label': 'Related reading',
        'related': [('23', 'Voice Translation Apps in 2026: Real-Time Tools Compared by Use Case'), ('25', 'Live Captions in 2026: How AI-Generated Captions Work and When to Use Them'), ('18', 'Google Meet vs Zoom vs Teams Translated Captions in 2026')],
        'cta_title': 'For meetings and desktop: get captions that AirPods Live Translation cannot',
        'cta_body': "Cross-app live captions and real-time translation on Windows and Mac — covering the workflows AirPods Live Translation doesn't.",
        'cta_button': 'Download from Microsoft Store',
    },
    'ja': {
        'title': "AirPods ライブ翻訳(iOS 26)：得意なことと苦手なこと",
        'description': "iOS 26のAirPodsライブ翻訳を正直レビュー：Appleのオンデバイス翻訳の仕組み、得意な用途、できないこと(会議、ブロードキャスト、画面ベースの状況)。",
        'keywords': "airpods ライブ翻訳, apple ライブ翻訳, ios 26 ライブ翻訳, airpods 翻訳, apple translate レビュー",
        'og_description': "AirPodsライブ翻訳が得意なこと — そして他のツールが必要な用途。",
        'image_alt': "対面会話中にAirPodsが音声を翻訳する様子",
        'home_label': 'ホーム', 'articles_label': '記事一覧',
        'breadcrumb_short': 'AirPods ライブ翻訳 iOS 26',
        'back_link': '記事一覧へ戻る', 'date_label': '2026年5月28日',
        'author_label': '著者', 'updated_label': '更新日',
        'twitter_description': "iOS 26のAirPodsライブ翻訳を正直レビュー — 長所、短所、補完ツール。",
        'intro': "Appleの<strong>AirPods ライブ翻訳</strong>(iOS 26)は今年最も話題のアクセシビリティ機能の1つです。会話翻訳は驚くほどよく動作し — それ以外はほぼ何もしません。できないことを知ることが、自分のワークフローに合うツールを選ぶ鍵です。",
        'h2_1': 'AirPods ライブ翻訳の実際の仕組み',
        'p_1': 'iPhoneがキャプチャした音声(マイクまたはシステムマイク経由のAirPods)は、Appleのオンデバイス音声認識に通り、その後Translationフレームワーク(Apple Silicon上ではこちらもオンデバイス)に渡されます。翻訳されたテキストはAppleのテキスト音声合成でAirPodsから読み上げられます。パイプライン全体がクラウドサーバに音声を送ることなく動作します。レイテンシはターンあたり約1.5〜2.5秒。',
        'h2_2': 'AirPods ライブ翻訳が勝つ場面',
        'li_2a': "<strong>対面の旅行会話:</strong> 短いターン、2人の話者、一方はAirPodsを持っていないかもしれません。完璧なフィット。翻訳音声があなたの耳で再生され、相手の声が空気中に再生されます — 自然な往復会話。",
        'li_2b': "<strong>プライバシー重視の場面:</strong> 医療、法律、個人的な会話でクラウドサーバを介在させたくない場合。オンデバイス処理が差別化要因です。",
        'li_2c': "<strong>すぐに口頭翻訳:</strong> メニューを読む、道を尋ねる、予約を確認する。電話画面のワークフローよりハンズフリーが便利。",
        'h2_3': "AirPods ライブ翻訳が苦手なところ",
        'li_3a': "<strong>マルチスピーカー会議:</strong> この機能は2人のターン用に設計されています。6人が重なって話すZoomミーティングはこのワークフローではありません。",
        'li_3b': "<strong>ブロードキャスト音声(講義、映画、ストリーム、YouTube):</strong> AirPodsライブ翻訳はシステム音声を読みません — マイク入力をルーティングします。講義を聞きながら翻訳を読むのは字幕ワークフローで、AirPodsワークフローではありません。",
        'li_3c': "<strong>デスクトップ/ラップトップ作業:</strong> この機能はiPhone/iPad上にあります。仕事がデスクトップで起きるなら、その画面用に別のキャプション+翻訳レイヤが必要です。",
        'h2_4': "AirPods ライブ翻訳 vs 代替",
        'th_1': 'ツール', 'th_2': '最適ワークフロー', 'th_3': '強み', 'th_4': '制限',
        't1c1': 'AirPods ライブ翻訳', 't1c2': '会話、旅行', 't1c3': 'オンデバイスのプライバシー、AirPods統合、ハンズフリー', 't1c4': 'iPhone限定; 会議/ブロードキャスト未対応',
        't2c1': 'Google 翻訳(会話モード)', 't2c2': '会話、旅行', 't2c3': '無料、最も広い言語対応、クロスプラットフォーム', 't2c4': 'ハンズフリーよりも電話画面のワークフロー',
        't3c1': 'Microsoft Translator', 't3c2': '会話、複数デバイス', 't3c3': 'グループ会話用の複数デバイスセッション', 't3c4': '計画されたセッションが得意、自然な順番取りは苦手',
        't4c1': 'Live Subtitles', 't4c2': 'ブロードキャスト、会議、デスクトップのメディア', 't4c3': 'あらゆるデスクトップアプリでシステム音声字幕と翻訳', 't4c4': '耳に入れるハンズフリー旅行シナリオには不向き',
        'h2_5': "いつ何を使うか",
        'h3_1': "旅行・対面",
        'p_5a': "AirPods ライブ翻訳を使います。ハンズフリーの耳内配信は、毎回電話を取り出すより本当に優れています。Appleがカバーしていない言語のフォールバック(Google翻訳)を持っておきましょう。",
        'h3_2': "会議、講義、デスクトップのメディア",
        'p_5b': "システムレベルの字幕レイヤを使います(Windows Live Captions、macOS Live Captions、または翻訳付きクロスアプリ字幕を行うLive Subtitlesのようなサードパーティ)。AirPodsライブ翻訳はそこでは動作しません。",
        'h2_faq': 'よくある質問',
        'q1': 'AirPods ライブ翻訳はインターネットなしで動作しますか？', 'a1': 'Apple Silicon iPhone(iPhone 15 Pro以降)では、サポートされている言語パックは一度ダウンロードすればオンデバイスで動作します。',
        'q2': 'Zoom通話でAirPodsライブ翻訳を使えますか？', 'a2': "設計上はできません。この機能は対面の発話用で、システム音声用ではありません。Zoom翻訳には、Zoomの組み込みの翻訳字幕またはデスクトップキャプションレイヤを使ってください。",
        'q3': '専用翻訳アプリを置き換えますか？', 'a3': '会話と旅行については、ほとんどのユーザーで はい。会議、ブロードキャスト、デスクトップワークフローでは いいえ。',
        'h2_refs': '参考資料',
        'ref1_url': REF1_URL, 'ref1_label': 'Apple — テキスト、音声、会話の翻訳',
        'ref2_url': REF2_URL, 'ref2_label': 'Apple — AirPods 概要',
        'ref3_url': REF3_URL, 'ref3_label': 'Apple Developer — Translation フレームワーク',
        'related_label': '関連記事',
        'related': [('23', '音声翻訳アプリ 2026年版：用途別リアルタイム比較'), ('25', 'ライブ字幕 2026年版：AI字幕の仕組みと使いどころ'), ('18', 'Google Meet・Zoom・Teams 翻訳字幕 2026年版比較')],
        'cta_title': '会議とデスクトップに：AirPodsライブ翻訳ができない字幕を',
        'cta_body': "WindowsとMacでクロスアプリのライブ字幕とリアルタイム翻訳 — AirPodsライブ翻訳がカバーしないワークフローを。",
        'cta_button': 'Microsoft Storeからダウンロード',
    },
    'de': {
        'title': "AirPods Live Translation in iOS 26: Was sie gut kann und wo sie versagt",
        'description': "Ehrlicher Test von AirPods Live Translation in iOS 26: wie Apples On-Device-Übersetzung funktioniert, welche Anwendungsfälle sie meistert und was sie nicht abdeckt (Meetings, Broadcast, Bildschirm-Kontexte).",
        'keywords': "airpods live translation, apple live übersetzung, ios 26 live translation, airpods übersetzung, apple translate test",
        'og_description': "Was AirPods Live Translation gut kann — und wofür Sie etwas anderes brauchen.",
        'image_alt': "AirPods übersetzen Sprache live während eines persönlichen Gesprächs",
        'home_label': 'Startseite', 'articles_label': 'Artikel',
        'breadcrumb_short': 'AirPods Live Translation iOS 26',
        'back_link': 'Zurück zu Artikeln', 'date_label': '28. Mai 2026',
        'author_label': 'Autor', 'updated_label': 'Aktualisiert',
        'twitter_description': "Ehrlicher Test von AirPods Live Translation iOS 26 — Stärken, Schwächen und ergänzende Tools.",
        'intro': "Apples <strong>AirPods Live Translation</strong> in iOS 26 ist eines der meistdiskutierten Accessibility-Features des Jahres. Es übersetzt Gespräche überraschend gut — und sonst fast nichts. Zu wissen, was es nicht kann, hilft beim Auswählen des richtigen Tools für den eigenen Workflow.",
        'h2_1': 'Wie AirPods Live Translation tatsächlich funktioniert',
        'p_1': 'Vom iPhone aufgenommenes Audio (Mikrofon oder System-Mic-geroutet via AirPods) durchläuft Apples On-Device-Spracherkennung und das Translation-Framework (auf Apple Silicon ebenfalls On-Device). Übersetzter Text wird über Apples Text-to-Speech in die AirPods zurückgespielt. Die gesamte Pipeline läuft, ohne Audio an einen Cloud-Server zu senden. Latenz: 1,5–2,5 Sekunden pro Sprechabschnitt.',
        'h2_2': 'Wo AirPods Live Translation gewinnt',
        'li_2a': "<strong>Persönliche Reisegespräche:</strong> kurze Abschnitte, zwei Sprecher, einer evtl. ohne AirPods. Perfekt. Die Übersetzung kommt in dein Ohr, die Originalstimme in den Raum — natürlicher Wechsel.",
        'li_2b': "<strong>Privatsphäre-sensible Momente:</strong> medizinische, rechtliche oder persönliche Gespräche ohne Cloud-Server im Loop. On-Device-Verarbeitung ist der Differenziator.",
        'li_2c': "<strong>Schnelle laute Übersetzung:</strong> Menü lesen, Wegbeschreibung, Buchung bestätigen. Hands-free ist bequemer als ein Telefon-Bildschirm-Workflow.",
        'h2_3': "Wo AirPods Live Translation versagt",
        'li_3a': "<strong>Mehrsprecher-Meetings:</strong> das Feature ist für Zwei-Personen-Wechsel ausgelegt. Ein Zoom-Call mit 6 sich überlappenden Sprechenden ist nicht sein Workflow.",
        'li_3b': "<strong>Broadcast-Audio (Vorlesungen, Filme, Streams, YouTube):</strong> AirPods Live Translation liest kein System-Audio; sie routet Mikrofon-Eingang. Vortrag hören und Übersetzung lesen ist ein Untertitel-Workflow.",
        'li_3c': "<strong>Desktop-/Laptop-Arbeit:</strong> das Feature lebt auf iPhone/iPad. Wer am Desktop arbeitet, braucht einen separaten Untertitel-und-Übersetzungs-Layer dafür.",
        'h2_4': "AirPods Live Translation vs Alternativen",
        'th_1': 'Tool', 'th_2': 'Bester Workflow', 'th_3': 'Stärken', 'th_4': 'Grenzen',
        't1c1': 'AirPods Live Translation', 't1c2': 'Gespräch, Reisen', 't1c3': 'On-Device-Privatsphäre, AirPods-Integration, Hands-free', 't1c4': 'Nur iPhone; kein Meeting/Broadcast',
        't2c1': 'Google Übersetzer (Konversation)', 't2c2': 'Gespräch, Reisen', 't2c3': 'Kostenlos, breiteste Sprachabdeckung, plattformübergreifend', 't2c4': 'Eher Telefon-Bildschirm- als Hands-free-Workflow',
        't3c1': 'Microsoft Translator', 't3c2': 'Gespräch, Multi-Device', 't3c3': 'Multi-Device-Sessions für Gruppengespräche', 't3c4': 'Geplante Sessions; weniger natürlicher Wechsel',
        't4c1': 'Live Subtitles', 't4c2': 'Broadcast, Meetings, Medien am Desktop', 't4c3': 'Systemaudio-Untertitel und Übersetzung in jeder Desktop-App', 't4c4': 'Nicht für Hands-free-In-Ear-Reise',
        'h2_5': "Wann was nutzen",
        'h3_1': "Reisen & persönlich",
        'p_5a': "AirPods Live Translation. Die Hands-free-In-Ear-Ausgabe ist wirklich besser als das Telefon für jede Antwort zu zücken. Fallback (Google Übersetzer) für Sprachen bereithalten, die Apple nicht abdeckt.",
        'h3_2': "Meetings, Vorlesungen, Medien am Desktop",
        'p_5b': "Einen system-weiten Untertitel-Layer (Windows Live Captions, macOS Live Captions oder einen Drittanbieter wie Live Subtitles mit App-übergreifenden Untertiteln und Übersetzung). AirPods Live Translation läuft dort schlicht nicht.",
        'h2_faq': 'FAQ',
        'q1': 'Funktioniert AirPods Live Translation ohne Internet?', 'a1': 'Auf Apple-Silicon-iPhones (iPhone 15 Pro und neuer) laufen unterstützte Sprachpakete nach dem Download On-Device.',
        'q2': 'Kann ich AirPods Live Translation in einem Zoom-Call nutzen?', 'a2': "So nicht vorgesehen. Das Feature ist für In-Person-Sprache, nicht für System-Audio. Für Zoom-Übersetzung Zooms eigene übersetzte Untertitel oder einen Desktop-Untertitel-Layer nutzen.",
        'q3': 'Ersetzt es dedizierte Übersetzungs-Apps?', 'a3': 'Für Gespräch und Reisen ja, für die meisten. Für Meetings, Broadcasts und Desktop-Workflows nein.',
        'h2_refs': 'Quellen',
        'ref1_url': REF1_URL, 'ref1_label': 'Apple — Text, Sprache und Gespräche übersetzen',
        'ref2_url': REF2_URL, 'ref2_label': 'Apple — AirPods Überblick',
        'ref3_url': REF3_URL, 'ref3_label': 'Apple Developer — Translation Framework',
        'related_label': 'Weiterführende Artikel',
        'related': [('23', 'Sprachübersetzung-Apps 2026: Echtzeit-Tools nach Anwendungsfall verglichen'), ('25', 'Live-Untertitel 2026: Wie KI-Untertitel funktionieren und wann sie einzusetzen sind'), ('18', 'Google Meet vs. Zoom vs. Teams: übersetzte Untertitel 2026')],
        'cta_title': 'Für Meetings und Desktop: Untertitel, die AirPods Live Translation nicht bietet',
        'cta_body': "App-übergreifende Live-Untertitel und Echtzeit-Übersetzung auf Windows und Mac — für die Workflows, die AirPods Live Translation nicht abdeckt.",
        'cta_button': 'Aus dem Microsoft Store herunterladen',
    },
    'ru': {
        'title': "AirPods Live Translation в iOS 26: что получается хорошо и где провал",
        'description': "Честный обзор AirPods Live Translation в iOS 26: как работает on-device перевод Apple, в каких сценариях он силён и что не делает (встречи, broadcast, экранные контексты).",
        'keywords': "airpods live translate, apple live translation, ios 26 live translation, airpods перевод, apple translate обзор",
        'og_description': "Что AirPods Live Translation делает хорошо — и где нужен другой инструмент.",
        'image_alt': "AirPods переводят речь в реальном времени во время личной беседы",
        'home_label': 'Главная', 'articles_label': 'Статьи',
        'breadcrumb_short': 'AirPods Live Translation iOS 26',
        'back_link': 'Назад к статьям', 'date_label': '28 мая 2026',
        'author_label': 'Автор', 'updated_label': 'Обновлено',
        'twitter_description': "Честный обзор AirPods Live Translation в iOS 26 — сильные, слабые стороны и дополняющие инструменты.",
        'intro': "Apple <strong>AirPods Live Translation</strong> в iOS 26 — одна из самых обсуждаемых accessibility-фич года. Перевод разговоров она делает на удивление хорошо — и почти ничего больше. Знание того, чего она НЕ делает, помогает выбрать правильный инструмент под реальный workflow.",
        'h2_1': 'Как AirPods Live Translation реально работает',
        'p_1': 'Аудио, захваченное iPhone (микрофон или системный микрофон через AirPods), проходит on-device распознавание речи Apple, затем фреймворк Translation (на Apple Silicon тоже on-device). Переведённый текст зачитывается через AirPods с помощью TTS Apple. Весь пайплайн работает без отправки аудио в облако. Латентность около 1,5–2,5 секунд на реплику.',
        'h2_2': 'Где AirPods Live Translation выигрывает',
        'li_2a': "<strong>Личные разговоры в путешествиях:</strong> короткие реплики, два собеседника, один из которых может быть без AirPods. Идеальное соответствие. Переведённый звук играет в твоём ухе, голос собеседника — в воздухе. Естественный обмен.",
        'li_2b': "<strong>Приватные моменты:</strong> медицинские, юридические или личные беседы, где не хочется отправлять аудио в облако. On-device обработка — главное отличие.",
        'li_2c': "<strong>Быстрый перевод вслух:</strong> прочитать меню, спросить дорогу, подтвердить бронирование. Hands-free удобнее, чем работа с экраном телефона.",
        'h2_3': "Где AirPods Live Translation провисает",
        'li_3a': "<strong>Многоговорящие встречи:</strong> фича рассчитана на двусторонние реплики. Zoom с 6 перекрикивающими друг друга — не её workflow.",
        'li_3b': "<strong>Broadcast-аудио (лекции, фильмы, стримы, YouTube):</strong> AirPods Live Translation не читает системное аудио, она маршрутизирует микрофонный вход. Слушать лекцию и читать перевод — это caption-workflow, а не AirPods-workflow.",
        'li_3c': "<strong>Десктоп/лэптоп:</strong> фича живёт в iPhone/iPad. Если работа на десктопе — нужен отдельный слой субтитров+перевода для этого экрана.",
        'h2_4': "AirPods Live Translation vs альтернативы",
        'th_1': 'Инструмент', 'th_2': 'Лучший workflow', 'th_3': 'Сильные стороны', 'th_4': 'Ограничения',
        't1c1': 'AirPods Live Translation', 't1c2': 'Разговор, путешествия', 't1c3': 'On-device приватность, интеграция с AirPods, hands-free', 't1c4': 'Только iPhone; нет встреч/broadcast',
        't2c1': 'Google Translate (Разговор)', 't2c2': 'Разговор, путешествия', 't2c3': 'Бесплатно, широчайшее покрытие языков, кросс-платформенность', 't2c4': 'Workflow с экраном телефона, а не hands-free',
        't3c1': 'Microsoft Translator', 't3c2': 'Разговор, мультидевайс', 't3c3': 'Мультидевайс-сессии для групп', 't3c4': 'Заточен под плановые сессии, меньше под спонтанные',
        't4c1': 'Live Subtitles', 't4c2': 'Broadcast, встречи, медиа на десктопе', 't4c3': 'Системные субтитры и перевод во всех десктоп-приложениях', 't4c4': 'Не для hands-free in-ear путешествий',
        'h2_5': "Что когда использовать",
        'h3_1': "Путешествия и личное общение",
        'p_5a': "AirPods Live Translation. Hands-free in-ear доставка реально лучше, чем доставать телефон на каждый ответ. Запасной (Google Translate) для языков, которых Apple не поддерживает.",
        'h3_2': "Встречи, лекции, медиа на десктопе",
        'p_5b': "Системный слой субтитров (Windows Live Captions, macOS Live Captions или сторонний типа Live Subtitles с кросс-приложенческими субтитрами и переводом). AirPods Live Translation там просто не работает.",
        'h2_faq': 'Часто задаваемые вопросы',
        'q1': 'Работает ли AirPods Live Translation без интернета?', 'a1': 'На iPhone с Apple Silicon (iPhone 15 Pro и новее) поддерживаемые языковые пакеты работают на устройстве после загрузки.',
        'q2': 'Можно ли использовать AirPods Live Translation в Zoom?', 'a2': "По задумке — нет. Фича для личной речи, не для системного аудио. Для перевода Zoom используйте встроенные переведённые субтитры Zoom или десктопный слой субтитров.",
        'q3': 'Заменяет ли это специализированные переводчики?', 'a3': 'Для разговоров и путешествий — да, для большинства. Для встреч, broadcast и десктопа — нет.',
        'h2_refs': 'Источники',
        'ref1_url': REF1_URL, 'ref1_label': 'Apple — перевод текста, голоса и разговоров',
        'ref2_url': REF2_URL, 'ref2_label': 'Apple — обзор AirPods',
        'ref3_url': REF3_URL, 'ref3_label': 'Apple Developer — Translation framework',
        'related_label': 'Похожие материалы',
        'related': [('23', 'Голосовой переводчик в 2026 году: реал-тайм инструменты по сценариям'), ('25', 'Живые субтитры 2026: как работают AI-субтитры и когда их использовать'), ('18', 'Google Meet vs Zoom vs Teams: переведённые субтитры в 2026 году')],
        'cta_title': 'Для встреч и десктопа — субтитры, которых AirPods Live Translation не даёт',
        'cta_body': "Кросс-приложенческие живые субтитры и реал-тайм перевод на Windows и Mac — закрывают workflow, который AirPods Live Translation не закрывает.",
        'cta_button': 'Скачать из Microsoft Store',
    },
    'zh': {
        'title': "iOS 26 中的 AirPods 实时翻译：它擅长什么、不擅长什么",
        'description': "诚实评测 iOS 26 中的 AirPods 实时翻译：Apple 设备端翻译的工作原理、它擅长的使用场景，以及它做不到的事（会议、广播、屏幕场景）。",
        'keywords': "airpods 实时翻译, apple 实时翻译, ios 26 实时翻译, airpods 翻译, apple translate 评测",
        'og_description': "AirPods 实时翻译擅长什么 —— 以及哪些场景需要别的工具。",
        'image_alt': "面对面交谈中 AirPods 实时翻译语音",
        'home_label': '首页', 'articles_label': '文章',
        'breadcrumb_short': 'iOS 26 中的 AirPods 实时翻译',
        'back_link': '返回文章', 'date_label': '2026 年 5 月 28 日',
        'author_label': '作者', 'updated_label': '更新',
        'twitter_description': "iOS 26 AirPods 实时翻译诚实评测 —— 优势、不足与互补工具。",
        'intro': "Apple 在 iOS 26 中的 <strong>AirPods 实时翻译</strong> 是今年讨论度最高的无障碍功能之一。它对话翻译做得出奇地好 —— 几乎没有其他能力。知道它做不到什么，能帮你为实际工作流挑选正确工具。",
        'h2_1': 'AirPods 实时翻译实际如何工作',
        'p_1': 'iPhone 捕获的音频（麦克风或通过 AirPods 路由的系统麦克风）经过 Apple 设备端语音识别，然后通过 Translation 框架（在 Apple Silicon 上同样设备端运行）。翻译后的文本通过 Apple 的 TTS 在 AirPods 中播报。整个流水线在不向云端发送音频的情况下运行。延迟约每轮 1.5–2.5 秒。',
        'h2_2': 'AirPods 实时翻译胜出的场景',
        'li_2a': "<strong>面对面旅行对话：</strong>短轮次，两个说话人，其中一个可能没有 AirPods。完美契合。翻译音频在你的耳朵里播放，对方的声音在空气中传播 —— 自然的来回。",
        'li_2b': "<strong>隐私敏感时刻：</strong>医疗、法律或个人对话，你不想让云服务器参与。设备端处理就是差异化所在。",
        'li_2c': "<strong>快速朗读翻译：</strong>读菜单、问路、确认预订。免提便利胜过手机屏幕工作流。",
        'h2_3': "AirPods 实时翻译做不到的",
        'li_3a': "<strong>多人会议：</strong>这个功能为两人轮换设计。6 人互相打断的 Zoom 会议不是它的工作流。",
        'li_3b': "<strong>广播音频（讲座、电影、流媒体、YouTube）：</strong>AirPods 实时翻译不读系统音频；它路由麦克风输入。边听讲座边读翻译是字幕工作流，不是 AirPods 工作流。",
        'li_3c': "<strong>桌面/笔记本工作：</strong>该功能存在于 iPhone/iPad。如果工作在桌面发生，你需要另一个屏幕的字幕+翻译层。",
        'h2_4': "AirPods 实时翻译 vs 替代方案",
        'th_1': '工具', 'th_2': '最佳工作流', 'th_3': '优势', 'th_4': '限制',
        't1c1': 'AirPods 实时翻译', 't1c2': '对话、旅行', 't1c3': '设备端隐私、AirPods 集成、免提', 't1c4': '仅 iPhone；不支持会议/广播',
        't2c1': 'Google 翻译（对话模式）', 't2c2': '对话、旅行', 't2c3': '免费、最广语言覆盖、跨平台', 't2c4': '手机屏幕工作流而非免提',
        't3c1': 'Microsoft Translator', 't3c2': '对话、多设备', 't3c3': '多设备会话用于群组对话', 't3c4': '偏好计划会话；轮次切换不如对话自然',
        't4c1': 'Live Subtitles', 't4c2': '广播、会议、桌面媒体', 't4c3': '任何桌面应用上的系统音频字幕和翻译', 't4c4': '不适合入耳免提旅行场景',
        'h2_5': "何时使用什么",
        'h3_1': "旅行和当面",
        'p_5a': "使用 AirPods 实时翻译。入耳免提的传递确实比每次回应都拿起手机更好。为 Apple 不覆盖的语言准备备选（Google 翻译）。",
        'h3_2': "会议、讲座、桌面媒体",
        'p_5b': "使用系统级字幕层（Windows Live Captions、macOS Live Captions，或像 Live Subtitles 这样的第三方做跨应用字幕和翻译）。AirPods 实时翻译在那里根本不运行。",
        'h2_faq': '常见问题',
        'q1': 'AirPods 实时翻译能离线工作吗？', 'a1': '在 Apple Silicon iPhone（iPhone 15 Pro 及以上）上，受支持的语言包下载后可设备端运行。',
        'q2': '我能在 Zoom 通话中使用 AirPods 实时翻译吗？', 'a2': "按设计不能。该功能用于当面话语，不用于系统音频。Zoom 翻译请使用 Zoom 内置的翻译字幕或桌面字幕层。",
        'q3': '它会取代专门的翻译应用吗？', 'a3': '对于对话和旅行，对大多数用户是的。对于会议、广播和桌面工作流，否。',
        'h2_refs': '参考资料',
        'ref1_url': REF1_URL, 'ref1_label': 'Apple — 翻译文本、语音和对话',
        'ref2_url': REF2_URL, 'ref2_label': 'Apple — AirPods 概览',
        'ref3_url': REF3_URL, 'ref3_label': 'Apple Developer — Translation 框架',
        'related_label': '相关阅读',
        'related': [('23', '2026 年语音翻译应用：按使用场景比较实时工具'), ('25', '2026 年实时字幕：AI 字幕的工作原理及使用场景'), ('18', '2026 年 Google Meet vs Zoom vs Teams 翻译字幕')],
        'cta_title': '会议与桌面：获取 AirPods 实时翻译无法提供的字幕',
        'cta_body': "Windows 与 Mac 上的跨应用实时字幕和实时翻译 —— 覆盖 AirPods 实时翻译做不到的工作流。",
        'cta_button': '从 Microsoft Store 下载',
    },
    'ko': {
        'title': "iOS 26의 AirPods 라이브 번역: 잘하는 것과 부족한 것",
        'description': "iOS 26 AirPods 라이브 번역 솔직 리뷰: Apple의 온디바이스 번역 작동 방식, 잘 처리하는 사용 사례, 그리고 못하는 것(회의, 방송, 화면 기반 컨텍스트).",
        'keywords': "airpods 라이브 번역, apple 라이브 번역, ios 26 라이브 번역, airpods 번역, apple translate 리뷰",
        'og_description': "AirPods 라이브 번역이 잘하는 것 — 그리고 다른 도구가 필요한 사용 사례.",
        'image_alt': "대면 대화 중 AirPods로 실시간 음성 번역",
        'home_label': '홈', 'articles_label': '기사',
        'breadcrumb_short': 'iOS 26 AirPods 라이브 번역',
        'back_link': '기사 목록으로 돌아가기', 'date_label': '2026년 5월 28일',
        'author_label': '저자', 'updated_label': '업데이트',
        'twitter_description': "iOS 26 AirPods 라이브 번역 솔직 리뷰 — 강점, 약점, 보완 도구.",
        'intro': "Apple의 iOS 26 <strong>AirPods 라이브 번역</strong>은 올해 가장 많이 논의된 접근성 기능 중 하나입니다. 대화 번역은 놀랍도록 잘하지만 — 그 외에는 거의 아무것도 하지 않습니다. 못하는 것을 아는 것이 실제 워크플로에 맞는 도구를 선택하는 열쇠입니다.",
        'h2_1': 'AirPods 라이브 번역의 실제 작동 방식',
        'p_1': 'iPhone이 캡처한 오디오(마이크 또는 시스템 마이크를 통한 AirPods)는 Apple의 온디바이스 음성 인식을 거친 후, Translation 프레임워크(Apple Silicon에서도 온디바이스)를 통과합니다. 번역된 텍스트는 Apple의 텍스트-음성으로 AirPods를 통해 재생됩니다. 전체 파이프라인은 오디오를 클라우드 서버로 보내지 않고 실행됩니다. 지연 시간은 턴당 약 1.5–2.5초입니다.',
        'h2_2': 'AirPods 라이브 번역이 승리하는 곳',
        'li_2a': "<strong>대면 여행 대화:</strong> 짧은 턴, 두 명의 화자, 한 명은 AirPods가 없을 수 있음. 완벽한 적합성. 번역된 오디오가 귀에서 재생되고, 상대방의 목소리가 공기에서 재생됩니다 — 자연스러운 주고받기.",
        'li_2b': "<strong>프라이버시 민감 순간:</strong> 클라우드 서버를 루프에 두고 싶지 않은 의료, 법률 또는 개인적 대화. 온디바이스 처리가 차별화 요소입니다.",
        'li_2c': "<strong>빠른 소리 내어 번역:</strong> 메뉴 읽기, 길 묻기, 예약 확인. 핸즈프리 편의가 전화 화면 워크플로보다 우수합니다.",
        'h2_3': "AirPods 라이브 번역이 부족한 곳",
        'li_3a': "<strong>다중 화자 회의:</strong> 이 기능은 2인 턴용으로 설계되었습니다. 6명이 서로 위에서 말하는 Zoom 회의는 그 워크플로가 아닙니다.",
        'li_3b': "<strong>방송 오디오(강의, 영화, 스트림, YouTube):</strong> AirPods 라이브 번역은 시스템 오디오를 읽지 않습니다 — 마이크 입력을 라우팅합니다. 강의를 들으며 번역을 읽는 것은 자막 워크플로이지 AirPods 워크플로가 아닙니다.",
        'li_3c': "<strong>데스크톱/노트북 작업:</strong> 이 기능은 iPhone/iPad에 존재합니다. 작업이 데스크톱에서 일어나면 그 화면용 별도의 자막+번역 레이어가 필요합니다.",
        'h2_4': "AirPods 라이브 번역 vs 대안",
        'th_1': '도구', 'th_2': '최적 워크플로', 'th_3': '강점', 'th_4': '제약',
        't1c1': 'AirPods 라이브 번역', 't1c2': '대화, 여행', 't1c3': '온디바이스 프라이버시, AirPods 통합, 핸즈프리', 't1c4': 'iPhone 전용; 회의/방송 미지원',
        't2c1': 'Google 번역(대화 모드)', 't2c2': '대화, 여행', 't2c3': '무료, 가장 넓은 언어 커버리지, 크로스플랫폼', 't2c4': '핸즈프리보다 폰 화면 워크플로',
        't3c1': 'Microsoft Translator', 't3c2': '대화, 멀티 디바이스', 't3c3': '그룹 대화를 위한 멀티 디바이스 세션', 't3c4': '계획된 세션 편향; 자연스러운 턴테이킹 덜 함',
        't4c1': 'Live Subtitles', 't4c2': '방송, 회의, 데스크톱의 미디어', 't4c3': '모든 데스크톱 앱에서 시스템 오디오 자막과 번역', 't4c4': '귀에 넣는 핸즈프리 여행 시나리오에 적합하지 않음',
        'h2_5': "언제 무엇을 사용할지",
        'h3_1': "여행 및 대면",
        'p_5a': "AirPods 라이브 번역을 사용하세요. 핸즈프리 인이어 전달은 매번 답변을 위해 전화를 들어 올리는 것보다 진짜로 더 좋습니다. Apple이 커버하지 않는 언어를 위한 백업(Google 번역)을 준비하세요.",
        'h3_2': "회의, 강의, 데스크톱의 미디어",
        'p_5b': "시스템 레벨 자막 레이어를 사용하세요(Windows Live Captions, macOS Live Captions 또는 번역과 함께 앱 간 자막을 하는 Live Subtitles 같은 제3자). AirPods 라이브 번역은 거기서 단순히 실행되지 않습니다.",
        'h2_faq': '자주 묻는 질문',
        'q1': 'AirPods 라이브 번역은 인터넷 없이 작동합니까?', 'a1': 'Apple Silicon iPhone(iPhone 15 Pro 이상)에서 지원되는 언어 팩은 다운로드 후 온디바이스에서 실행됩니다.',
        'q2': 'Zoom 통화에서 AirPods 라이브 번역을 사용할 수 있나요?', 'a2': "설계된 대로는 안 됩니다. 이 기능은 대면 발화용이지 시스템 오디오용이 아닙니다. Zoom 번역에는 Zoom 내장 번역 자막이나 데스크톱 자막 레이어를 사용하세요.",
        'q3': '전용 번역 앱을 대체합니까?', 'a3': '대화와 여행에는 대부분의 사용자에게 예. 회의, 방송, 데스크톱 워크플로에는 아니오.',
        'h2_refs': '참고 자료',
        'ref1_url': REF1_URL, 'ref1_label': 'Apple — 텍스트, 음성 및 대화 번역',
        'ref2_url': REF2_URL, 'ref2_label': 'Apple — AirPods 개요',
        'ref3_url': REF3_URL, 'ref3_label': 'Apple Developer — Translation 프레임워크',
        'related_label': '관련 기사',
        'related': [('23', '2026년 음성 번역 앱: 실시간 도구를 사용 사례별 비교'), ('25', '2026년 라이브 자막: AI 자막이 작동하는 방식과 사용 시점'), ('18', '2026년 Google Meet vs Zoom vs Teams 번역 자막')],
        'cta_title': '회의와 데스크톱: AirPods 라이브 번역이 제공할 수 없는 자막',
        'cta_body': "Windows와 Mac의 앱 간 실시간 자막 및 실시간 번역 — AirPods 라이브 번역이 커버하지 않는 워크플로.",
        'cta_button': 'Microsoft Store에서 다운로드',
    },
    'ar': {
        'title': "ترجمة AirPods الحية في iOS 26: ما الذي تتقنه وأين تخفق",
        'description': "مراجعة صادقة لترجمة AirPods الحية في iOS 26: كيف تعمل ترجمة Apple على الجهاز، وما حالات الاستخدام التي تتقنها، وما الذي لا تفعله (الاجتماعات، البث، السياقات القائمة على الشاشة).",
        'keywords': "ترجمة airpods الحية, ترجمة apple الحية, ios 26 ترجمة حية, ترجمة airpods, مراجعة apple translate",
        'og_description': "ما تتقنه ترجمة AirPods الحية — وما حالات الاستخدام التي تحتاج إلى شيء آخر.",
        'image_alt': "AirPods تترجم الكلام مباشرة أثناء محادثة وجهًا لوجه",
        'home_label': 'الرئيسية', 'articles_label': 'المقالات',
        'breadcrumb_short': 'ترجمة AirPods الحية iOS 26',
        'back_link': 'العودة إلى المقالات', 'date_label': '28 مايو 2026',
        'author_label': 'الكاتب', 'updated_label': 'آخر تحديث',
        'twitter_description': "مراجعة صادقة لترجمة AirPods الحية iOS 26 — نقاط القوة والضعف والأدوات المكمّلة.",
        'intro': "<strong>ترجمة AirPods الحية</strong> من Apple في iOS 26 هي إحدى أكثر ميزات إمكانية الوصول مناقشةً هذا العام. تترجم المحادثات بشكل جيد بشكل مفاجئ — ولا تكاد تفعل شيئًا آخر. معرفة ما لا تفعله هو ما يساعدك على اختيار الأداة المناسبة لسير العمل الفعلي.",
        'h2_1': 'كيف تعمل ترجمة AirPods الحية فعلًا',
        'p_1': 'الصوت الذي يلتقطه iPhone (الميكروفون أو AirPods عبر توجيه ميكروفون النظام) يمر عبر التعرّف على الكلام على جهاز Apple، ثم عبر إطار العمل Translation (أيضًا على الجهاز على Apple Silicon). يُعاد قراءة النص المترجم عبر AirPods باستخدام تحويل النص إلى كلام من Apple. تعمل خط الأنابيب بالكامل دون إرسال الصوت إلى خادم سحابي. زمن الاستجابة حوالي 1.5–2.5 ثانية لكل دور.',
        'h2_2': 'حيث تفوز ترجمة AirPods الحية',
        'li_2a': "<strong>محادثات السفر وجهًا لوجه:</strong> أدوار قصيرة، متحدثان، قد لا يمتلك أحدهما AirPods. ملاءمة مثالية. الصوت المترجم يُشغّل في أذنك بينما يُشغّل صوت الشخص الآخر في الهواء — تبادل طبيعي.",
        'li_2b': "<strong>لحظات حسّاسة للخصوصية:</strong> المحادثات الطبية أو القانونية أو الشخصية حيث لا تريد خوادم سحابية في الحلقة. المعالجة على الجهاز هي العامل المميّز.",
        'li_2c': "<strong>ترجمة سريعة بصوت عالٍ:</strong> قراءة قائمة طعام، السؤال عن الاتجاهات، تأكيد حجز. ميزة عدم استخدام اليدين تفوق سير العمل عبر شاشة الهاتف.",
        'h2_3': "حيث تخفق ترجمة AirPods الحية",
        'li_3a': "<strong>اجتماعات متعدّدة المتحدثين:</strong> الميزة مصمّمة لأدوار شخصين. اجتماع Zoom مع 6 أشخاص يتحدّثون فوق بعضهم ليس سير عملها.",
        'li_3b': "<strong>الصوت المُذاع (المحاضرات والأفلام والبث وYouTube):</strong> ترجمة AirPods الحية لا تقرأ صوت النظام؛ بل توجّه إدخال الميكروفون. الاستماع إلى محاضرة وقراءة الترجمة هو سير عمل تعليقات، لا سير عمل AirPods.",
        'li_3c': "<strong>أعمال سطح المكتب/الحاسوب المحمول:</strong> الميزة تعيش على iPhone/iPad. إذا كان عملك يحدث على سطح المكتب، فأنت بحاجة إلى طبقة تعليقات وترجمة منفصلة لتلك الشاشة.",
        'h2_4': "ترجمة AirPods الحية مقابل البدائل",
        'th_1': 'الأداة', 'th_2': 'أفضل سير عمل', 'th_3': 'نقاط القوة', 'th_4': 'القيود',
        't1c1': 'ترجمة AirPods الحية', 't1c2': 'محادثة، سفر', 't1c3': 'خصوصية على الجهاز، تكامل AirPods، عدم استخدام اليدين', 't1c4': 'iPhone فقط؛ بدون دعم اجتماعات/بث',
        't2c1': 'ترجمة Google (وضع المحادثة)', 't2c2': 'محادثة، سفر', 't2c3': 'مجانية، أوسع تغطية لغوية، عبر المنصات', 't2c4': 'سير عمل عبر شاشة الهاتف بدلاً من بدون استخدام اليدين',
        't3c1': 'Microsoft Translator', 't3c2': 'محادثة، متعدّد الأجهزة', 't3c3': 'جلسات متعدّدة الأجهزة لمحادثات المجموعات', 't3c4': 'تحيّز للجلسات المُخطّط لها؛ تبادل أدوار أقل طبيعية',
        't4c1': 'Live Subtitles', 't4c2': 'بث، اجتماعات، وسائط على سطح المكتب', 't4c3': 'تعليقات صوت النظام والترجمة عبر أي تطبيق سطح مكتب', 't4c4': 'ليس لسيناريوهات السفر بدون استخدام اليدين في الأذن',
        'h2_5': "ماذا تستخدم ومتى",
        'h3_1': "السفر والتواصل المباشر",
        'p_5a': "استخدم ترجمة AirPods الحية. التوصيل بدون استخدام اليدين في الأذن أفضل حقًا من التقاط الهاتف لكل رد. احتفظ ببديل (Google Translate) للغات التي لا تغطّيها Apple.",
        'h3_2': "الاجتماعات والمحاضرات والوسائط على سطح المكتب",
        'p_5b': "استخدم طبقة تعليقات على مستوى النظام (Windows Live Captions، macOS Live Captions، أو طرف ثالث مثل Live Subtitles يقدّم تعليقات عبر التطبيقات مع الترجمة). ترجمة AirPods الحية ببساطة لا تعمل هناك.",
        'h2_faq': 'الأسئلة الشائعة',
        'q1': 'هل تعمل ترجمة AirPods الحية بدون إنترنت؟', 'a1': 'على هواتف iPhone بمعالج Apple Silicon (iPhone 15 Pro والأحدث)، تعمل حزم اللغات المدعومة على الجهاز بعد التنزيل.',
        'q2': 'هل يمكنني استخدام ترجمة AirPods الحية في مكالمة Zoom؟', 'a2': "ليس وفق التصميم. الميزة للكلام الشخصي، وليس لصوت النظام. لترجمة Zoom استخدم تعليقات Zoom المترجمة المدمجة أو طبقة تعليقات سطح المكتب.",
        'q3': 'هل تستبدل تطبيقات الترجمة المخصّصة؟', 'a3': 'للمحادثة والسفر، نعم لمعظم المستخدمين. للاجتماعات والبث وسير عمل سطح المكتب، لا.',
        'h2_refs': 'المراجع',
        'ref1_url': REF1_URL, 'ref1_label': 'Apple — ترجمة النص والصوت والمحادثات',
        'ref2_url': REF2_URL, 'ref2_label': 'Apple — نظرة عامة على AirPods',
        'ref3_url': REF3_URL, 'ref3_label': 'Apple Developer — إطار Translation',
        'related_label': 'قراءات ذات صلة',
        'related': [('23', 'تطبيقات الترجمة الصوتية في 2026: مقارنة الأدوات الفورية حسب الاستخدام'), ('25', 'التعليقات الحية في 2026: كيف تعمل تعليقات الذكاء الاصطناعي ومتى تستخدمها'), ('18', 'Google Meet مقابل Zoom مقابل Teams: التعليقات المترجمة في 2026')],
        'cta_title': 'للاجتماعات وسطح المكتب: احصل على التعليقات التي لا توفّرها ترجمة AirPods الحية',
        'cta_body': "تعليقات حية عبر التطبيقات وترجمة فورية على Windows وMac — تغطّي سير العمل الذي لا تغطّيه ترجمة AirPods الحية.",
        'cta_button': 'تنزيل من Microsoft Store',
    },
    'hi': {
        'title': "iOS 26 में AirPods लाइव अनुवाद: यह क्या अच्छा करता है और कहाँ कम पड़ता है",
        'description': "iOS 26 में AirPods लाइव अनुवाद की ईमानदार समीक्षा: Apple का ऑन-डिवाइस अनुवाद कैसे काम करता है, यह किन उपयोग के मामलों में अच्छा है, और क्या नहीं करता (मीटिंग, ब्रॉडकास्ट, स्क्रीन-आधारित संदर्भ)।",
        'keywords': "airpods लाइव अनुवाद, apple लाइव अनुवाद, ios 26 लाइव अनुवाद, airpods अनुवाद, apple translate समीक्षा",
        'og_description': "AirPods लाइव अनुवाद क्या अच्छा करता है — और किन उपयोग के मामलों के लिए कुछ और चाहिए।",
        'image_alt': "आमने-सामने बातचीत के दौरान AirPods लाइव भाषा अनुवाद कर रहे हैं",
        'home_label': 'मुखपृष्ठ', 'articles_label': 'लेख',
        'breadcrumb_short': 'iOS 26 में AirPods लाइव अनुवाद',
        'back_link': 'लेखों पर वापस', 'date_label': '28 मई 2026',
        'author_label': 'लेखक', 'updated_label': 'अद्यतन',
        'twitter_description': "iOS 26 AirPods लाइव अनुवाद ईमानदार समीक्षा — ताक़तें, कमज़ोरियाँ और पूरक टूल।",
        'intro': "Apple का iOS 26 में <strong>AirPods लाइव अनुवाद</strong> इस वर्ष की सबसे चर्चित एक्सेसिबिलिटी सुविधाओं में से एक है। यह बातचीत अनुवाद आश्चर्यजनक रूप से अच्छा करता है — और लगभग कुछ और नहीं। यह जानना कि यह क्या नहीं कर सकता, आपके वास्तविक वर्कफ़्लो के लिए सही टूल चुनने में मदद करता है।",
        'h2_1': 'AirPods लाइव अनुवाद वास्तव में कैसे काम करता है',
        'p_1': 'iPhone द्वारा कैप्चर किया गया ऑडियो (माइक्रोफ़ोन या सिस्टम माइक के माध्यम से रूट किए गए AirPods) Apple की ऑन-डिवाइस वाक् पहचान से गुज़रता है, फिर Translation फ़्रेमवर्क (Apple Silicon पर भी ऑन-डिवाइस) के माध्यम से। अनुवादित पाठ Apple के टेक्स्ट-टू-स्पीच का उपयोग करके AirPods के माध्यम से वापस पढ़ा जाता है। पूरी पाइपलाइन ऑडियो को क्लाउड सर्वर पर भेजे बिना चलती है। प्रति टर्न लगभग 1.5–2.5 सेकंड की लेटेंसी।',
        'h2_2': 'AirPods लाइव अनुवाद कहाँ जीतता है',
        'li_2a': "<strong>आमने-सामने यात्रा बातचीत:</strong> छोटी टर्न, दो बोलने वाले, जिनमें से एक के पास AirPods न हो। पूर्ण फिट। अनुवादित ऑडियो आपके कान में चलता है जबकि उनकी आवाज़ हवा में चलती है — स्वाभाविक आगे-पीछे।",
        'li_2b': "<strong>गोपनीयता-संवेदनशील क्षण:</strong> चिकित्सा, क़ानूनी, या व्यक्तिगत बातचीत जहाँ आप क्लाउड सर्वर लूप में नहीं चाहते। ऑन-डिवाइस प्रसंस्करण विभेदक है।",
        'li_2c': "<strong>त्वरित ज़ोर से अनुवाद:</strong> मेनू पढ़ना, दिशाएँ पूछना, बुकिंग की पुष्टि करना। फ़ोन-स्क्रीन वर्कफ़्लो की तुलना में हैंड्स-फ़्री सुविधा।",
        'h2_3': "AirPods लाइव अनुवाद कहाँ कम पड़ता है",
        'li_3a': "<strong>बहु-वक्ता मीटिंग:</strong> यह सुविधा दो-व्यक्ति टर्न के लिए डिज़ाइन की गई है। 6 लोग एक-दूसरे के ऊपर बोलते हुए Zoom मीटिंग इसका वर्कफ़्लो नहीं है।",
        'li_3b': "<strong>ब्रॉडकास्ट ऑडियो (व्याख्यान, फ़िल्में, स्ट्रीम, YouTube):</strong> AirPods लाइव अनुवाद सिस्टम ऑडियो नहीं पढ़ता; यह माइक्रोफ़ोन इनपुट रूट करता है। व्याख्यान सुनना और अनुवाद पढ़ना एक कैप्शनिंग वर्कफ़्लो है, AirPods वर्कफ़्लो नहीं।",
        'li_3c': "<strong>डेस्कटॉप/लैपटॉप काम:</strong> यह सुविधा iPhone/iPad पर रहती है। यदि आपका काम डेस्कटॉप पर होता है, तो आपको उस स्क्रीन के लिए एक अलग कैप्शन-और-अनुवाद परत की आवश्यकता है।",
        'h2_4': "AirPods लाइव अनुवाद बनाम विकल्प",
        'th_1': 'टूल', 'th_2': 'सर्वोत्तम वर्कफ़्लो', 'th_3': 'मज़बूती', 'th_4': 'सीमाएँ',
        't1c1': 'AirPods लाइव अनुवाद', 't1c2': 'बातचीत, यात्रा', 't1c3': 'ऑन-डिवाइस गोपनीयता, AirPods एकीकरण, हैंड्स-फ़्री', 't1c4': 'केवल iPhone; मीटिंग/ब्रॉडकास्ट समर्थन नहीं',
        't2c1': 'Google अनुवाद (वार्तालाप मोड)', 't2c2': 'बातचीत, यात्रा', 't2c3': 'मुफ़्त, सबसे व्यापक भाषा कवरेज, क्रॉस-प्लेटफ़ॉर्म', 't2c4': 'हैंड्स-फ़्री के बजाय फ़ोन-स्क्रीन वर्कफ़्लो',
        't3c1': 'Microsoft Translator', 't3c2': 'बातचीत, बहु-डिवाइस', 't3c3': 'समूह बातचीत के लिए बहु-डिवाइस सत्र', 't3c4': 'योजनाबद्ध सत्र पूर्वाग्रह; स्वाभाविक टर्न-टेकिंग कम',
        't4c1': 'Live Subtitles', 't4c2': 'ब्रॉडकास्ट, मीटिंग, डेस्कटॉप पर मीडिया', 't4c3': 'किसी भी डेस्कटॉप ऐप में सिस्टम-ऑडियो कैप्शन और अनुवाद', 't4c4': 'हैंड्स-फ़्री इन-ईयर यात्रा परिदृश्यों के लिए नहीं',
        'h2_5': "कब क्या उपयोग करें",
        'h3_1': "यात्रा और आमने-सामने",
        'p_5a': "AirPods लाइव अनुवाद का उपयोग करें। हैंड्स-फ़्री इन-ईयर डिलीवरी हर उत्तर के लिए फ़ोन उठाने से वास्तव में बेहतर है। उन भाषाओं के लिए बैकअप (Google अनुवाद) रखें जिन्हें Apple कवर नहीं करता।",
        'h3_2': "मीटिंग, व्याख्यान, डेस्कटॉप पर मीडिया",
        'p_5b': "एक सिस्टम-स्तरीय कैप्शनिंग परत का उपयोग करें (Windows Live Captions, macOS Live Captions, या Live Subtitles जैसा तृतीय-पक्ष जो अनुवाद के साथ क्रॉस-ऐप कैप्शन करता है)। AirPods लाइव अनुवाद वहाँ बस नहीं चलता।",
        'h2_faq': 'पूछे जाने वाले प्रश्न',
        'q1': 'क्या AirPods लाइव अनुवाद इंटरनेट के बिना काम करता है?', 'a1': 'Apple Silicon iPhones (iPhone 15 Pro और नए) पर, समर्थित भाषा पैक डाउनलोड होने के बाद ऑन-डिवाइस चलते हैं।',
        'q2': 'क्या मैं Zoom कॉल में AirPods लाइव अनुवाद का उपयोग कर सकता हूँ?', 'a2': "डिज़ाइन के अनुसार नहीं। यह सुविधा व्यक्तिगत भाषण के लिए है, सिस्टम ऑडियो के लिए नहीं। Zoom अनुवाद के लिए, Zoom के अंतर्निहित अनुवादित कैप्शन या डेस्कटॉप कैप्शन परत का उपयोग करें।",
        'q3': 'क्या यह समर्पित अनुवाद ऐप्स को बदलता है?', 'a3': 'बातचीत और यात्रा के लिए, अधिकांश उपयोगकर्ताओं के लिए हाँ। मीटिंग, ब्रॉडकास्ट और डेस्कटॉप वर्कफ़्लो के लिए, नहीं।',
        'h2_refs': 'संदर्भ',
        'ref1_url': REF1_URL, 'ref1_label': 'Apple — पाठ, आवाज़ और बातचीत का अनुवाद',
        'ref2_url': REF2_URL, 'ref2_label': 'Apple — AirPods अवलोकन',
        'ref3_url': REF3_URL, 'ref3_label': 'Apple Developer — Translation फ़्रेमवर्क',
        'related_label': 'संबंधित पठन',
        'related': [('23', '2026 में आवाज़ अनुवाद ऐप्स: उपयोग के मामले के अनुसार रीयल-टाइम तुलना'), ('25', '2026 में लाइव कैप्शन: AI कैप्शन कैसे काम करते हैं और कब उपयोग करें'), ('18', '2026 में Google Meet बनाम Zoom बनाम Teams अनुवादित कैप्शन')],
        'cta_title': 'मीटिंग और डेस्कटॉप के लिए: ऐसे कैप्शन जो AirPods लाइव अनुवाद नहीं दे सकता',
        'cta_body': "Windows और Mac पर क्रॉस-ऐप लाइव कैप्शन और रीयल-टाइम अनुवाद — उन वर्कफ़्लो को कवर करते हैं जिन्हें AirPods लाइव अनुवाद नहीं करता।",
        'cta_button': 'Microsoft Store से डाउनलोड करें',
    },
    'es': {
        'title': "AirPods Live Translation en iOS 26: lo que hace bien y lo que falla",
        'description': "Reseña honesta de AirPods Live Translation en iOS 26: cómo funciona la traducción en dispositivo de Apple, qué casos de uso domina, y qué no hace (reuniones, broadcast, contextos de pantalla).",
        'keywords': "airpods live translate, apple live translation, ios 26 live translation, airpods traducción, apple translate reseña",
        'og_description': "Lo que AirPods Live Translation hace bien — y los casos donde necesitas otra cosa.",
        'image_alt': "AirPods traduciendo voz en directo durante una conversación cara a cara",
        'home_label': 'Inicio', 'articles_label': 'Artículos',
        'breadcrumb_short': 'AirPods Live Translation iOS 26',
        'back_link': 'Volver a artículos', 'date_label': '28 de mayo de 2026',
        'author_label': 'Autor', 'updated_label': 'Actualizado',
        'twitter_description': "Reseña honesta de AirPods Live Translation iOS 26 — fortalezas, debilidades y herramientas complementarias.",
        'intro': "<strong>AirPods Live Translation</strong> de Apple en iOS 26 es una de las funciones de accesibilidad más discutidas del año. Hace traducción de conversación sorprendentemente bien — y casi nada más. Saber lo que no hace te ayuda a elegir la herramienta correcta para tu flujo real.",
        'h2_1': 'Cómo funciona realmente AirPods Live Translation',
        'p_1': 'El audio capturado por el iPhone (micrófono o AirPods enrutados como mic del sistema) pasa por el reconocimiento de voz en dispositivo de Apple, luego por el framework Translation (también en dispositivo en Apple Silicon). El texto traducido se reproduce a través de los AirPods con el text-to-speech de Apple. Toda la canalización corre sin enviar audio a un servidor en la nube. Latencia: 1,5–2,5 s por turno.',
        'h2_2': 'Dónde gana AirPods Live Translation',
        'li_2a': "<strong>Conversaciones de viaje cara a cara:</strong> turnos cortos, dos hablantes, uno puede no tener AirPods. Encaje perfecto. El audio traducido suena en tu oído mientras la voz del otro suena en el aire — ida y vuelta natural.",
        'li_2b': "<strong>Momentos sensibles a la privacidad:</strong> conversaciones médicas, legales o personales en las que no quieres servidores en la nube. Procesamiento en dispositivo es el diferenciador.",
        'li_2c': "<strong>Traducción rápida en voz alta:</strong> leer un menú, pedir direcciones, confirmar una reserva. Manos libres supera al flujo en pantalla de teléfono.",
        'h2_3': "Dónde falla AirPods Live Translation",
        'li_3a': "<strong>Reuniones multi-hablante:</strong> la función está diseñada para turnos de dos. Un Zoom con 6 personas hablando encima no es su flujo.",
        'li_3b': "<strong>Audio broadcast (clases, películas, streams, YouTube):</strong> AirPods Live Translation no lee audio del sistema; enruta entrada de micrófono. Escuchar una clase y leer traducción es flujo de subtítulos, no flujo de AirPods.",
        'li_3c': "<strong>Trabajo en escritorio/portátil:</strong> la función vive en iPhone/iPad. Si tu trabajo ocurre en escritorio, necesitas una capa separada de subtítulos+traducción para esa pantalla.",
        'h2_4': "AirPods Live Translation vs alternativas",
        'th_1': 'Herramienta', 'th_2': 'Mejor flujo', 'th_3': 'Fortalezas', 'th_4': 'Límites',
        't1c1': 'AirPods Live Translation', 't1c2': 'Conversación, viaje', 't1c3': 'Privacidad en dispositivo, integración AirPods, manos libres', 't1c4': 'Solo iPhone; sin reunión/broadcast',
        't2c1': 'Google Traductor (Conversación)', 't2c2': 'Conversación, viaje', 't2c3': 'Gratis, cobertura lingüística más amplia, multiplataforma', 't2c4': 'Flujo de pantalla del teléfono en lugar de manos libres',
        't3c1': 'Microsoft Translator', 't3c2': 'Conversación, multi-dispositivo', 't3c3': 'Sesiones multi-dispositivo para conversaciones grupales', 't3c4': 'Sesiones planificadas; turno menos natural',
        't4c1': 'Live Subtitles', 't4c2': 'Broadcast, reuniones, medios en escritorio', 't4c3': 'Subtítulos de audio de sistema y traducción en cualquier app de escritorio', 't4c4': 'No para escenarios de viaje en oído manos libres',
        'h2_5': "Qué usar cuándo",
        'h3_1': "Viaje y en persona",
        'p_5a': "Usa AirPods Live Translation. La entrega en oído manos libres es genuinamente mejor que sacar el teléfono para cada respuesta. Ten un respaldo (Google Traductor) para idiomas que Apple no cubre.",
        'h3_2': "Reuniones, clases, medios en escritorio",
        'p_5b': "Usa una capa de subtítulos a nivel sistema (Windows Live Captions, macOS Live Captions, o un terceros como Live Subtitles que haga subtítulos entre apps con traducción). AirPods Live Translation simplemente no corre allí.",
        'h2_faq': 'Preguntas frecuentes',
        'q1': '¿Funciona AirPods Live Translation sin internet?', 'a1': 'En iPhones Apple Silicon (iPhone 15 Pro y posteriores), los packs de idiomas soportados corren en dispositivo una vez descargados.',
        'q2': '¿Puedo usar AirPods Live Translation en una llamada de Zoom?', 'a2': "No como está diseñado. La función es para habla en persona, no para audio del sistema. Para traducción Zoom usa los subtítulos traducidos integrados de Zoom o una capa de subtítulos de escritorio.",
        'q3': '¿Reemplaza apps de traducción dedicadas?', 'a3': 'Para conversación y viaje, sí para la mayoría. Para reuniones, broadcasts y flujos de escritorio, no.',
        'h2_refs': 'Referencias',
        'ref1_url': REF1_URL, 'ref1_label': 'Apple — Traducir texto, voz y conversaciones',
        'ref2_url': REF2_URL, 'ref2_label': 'Apple — visión general de AirPods',
        'ref3_url': REF3_URL, 'ref3_label': 'Apple Developer — Translation framework',
        'related_label': 'Lectura relacionada',
        'related': [('23', 'Traductor de voz en 2026: herramientas en tiempo real comparadas por caso de uso'), ('25', 'Subtítulos en vivo 2026: cómo funcionan los subtítulos con IA y cuándo usarlos'), ('18', 'Google Meet vs Zoom vs Teams: subtítulos traducidos en 2026')],
        'cta_title': 'Para reuniones y escritorio: obtén los subtítulos que AirPods Live Translation no puede',
        'cta_body': "Subtítulos en vivo entre apps y traducción en tiempo real en Windows y Mac — cubriendo los flujos que AirPods Live Translation no.",
        'cta_button': 'Descargar de Microsoft Store',
    },
    'fr': {
        'title': "AirPods Live Translation dans iOS 26 : ce qu'elle fait bien et où elle échoue",
        'description': "Test honnête d'AirPods Live Translation dans iOS 26 : comment fonctionne la traduction sur appareil d'Apple, quels cas elle gère bien, et ce qu'elle ne fait pas (réunions, broadcast, contextes écran).",
        'keywords': "airpods live translate, apple live translation, ios 26 live translation, airpods traduction, apple translate test",
        'og_description': "Ce qu'AirPods Live Translation fait bien — et où il vous faut autre chose.",
        'image_alt': "AirPods traduisant la parole en direct lors d'une conversation en face-à-face",
        'home_label': 'Accueil', 'articles_label': 'Articles',
        'breadcrumb_short': 'AirPods Live Translation iOS 26',
        'back_link': 'Retour aux articles', 'date_label': '28 mai 2026',
        'author_label': 'Auteur', 'updated_label': 'Mis à jour',
        'twitter_description': "Test honnête d'AirPods Live Translation iOS 26 — forces, faiblesses et outils complémentaires.",
        'intro': "<strong>AirPods Live Translation</strong> d'Apple dans iOS 26 est l'une des fonctions d'accessibilité les plus discutées de l'année. Elle fait la traduction de conversation étonnamment bien — et presque rien d'autre. Savoir ce qu'elle ne fait pas est ce qui vous fait choisir le bon outil pour votre vrai workflow.",
        'h2_1': "Comment AirPods Live Translation fonctionne vraiment",
        'p_1': "L'audio capté par l'iPhone (micro ou AirPods routés en micro système) passe par la reconnaissance vocale sur appareil d'Apple, puis par le framework Translation (aussi sur appareil sur Apple Silicon). Le texte traduit est lu via AirPods avec le text-to-speech d'Apple. Tout le pipeline tourne sans envoyer d'audio vers un serveur cloud. Latence : 1,5–2,5 s par tour.",
        'h2_2': "Où AirPods Live Translation gagne",
        'li_2a': "<strong>Conversations de voyage en face-à-face :</strong> tours courts, deux locuteurs, l'un peut être sans AirPods. Adéquation parfaite. L'audio traduit joue dans votre oreille pendant que la voix de l'autre passe dans l'air — échange naturel.",
        'li_2b': "<strong>Moments sensibles à la confidentialité :</strong> conversations médicales, juridiques ou personnelles sans serveurs cloud dans la boucle. Traitement sur appareil = différenciateur.",
        'li_2c': "<strong>Traduction rapide à voix haute :</strong> lire un menu, demander un chemin, confirmer une réservation. Mains libres bat le workflow écran du téléphone.",
        'h2_3': "Où AirPods Live Translation faillit",
        'li_3a': "<strong>Réunions multi-locuteurs :</strong> la fonction est conçue pour des tours à deux personnes. Un Zoom avec 6 personnes qui se chevauchent n'est pas son workflow.",
        'li_3b': "<strong>Audio broadcast (cours, films, streams, YouTube) :</strong> AirPods Live Translation ne lit pas l'audio système ; elle route l'entrée micro. Écouter un cours et lire la traduction est un workflow sous-titre, pas un workflow AirPods.",
        'li_3c': "<strong>Bureau/portable :</strong> la fonction vit sur iPhone/iPad. Si votre travail se passe sur ordinateur, il vous faut une couche séparée de sous-titres+traduction pour cet écran.",
        'h2_4': "AirPods Live Translation vs alternatives",
        'th_1': 'Outil', 'th_2': 'Meilleur workflow', 'th_3': 'Forces', 'th_4': 'Limites',
        't1c1': 'AirPods Live Translation', 't1c2': 'Conversation, voyage', 't1c3': 'Confidentialité sur appareil, intégration AirPods, mains libres', 't1c4': 'iPhone uniquement ; pas de réunion/broadcast',
        't2c1': 'Google Traduction (Conversation)', 't2c2': 'Conversation, voyage', 't2c3': 'Gratuit, couverture linguistique la plus large, multi-plateforme', 't2c4': "Workflow écran téléphone plutôt que mains libres",
        't3c1': 'Microsoft Translator', 't3c2': 'Conversation, multi-appareil', 't3c3': 'Sessions multi-appareil pour conversations de groupe', 't3c4': 'Biais session planifiée ; tour moins naturel',
        't4c1': 'Live Subtitles', 't4c2': 'Broadcast, réunions, médias bureau', 't4c3': 'Sous-titres audio système et traduction dans toute appli bureau', 't4c4': "Pas pour scénarios voyage mains libres dans l'oreille",
        'h2_5': "Quoi utiliser quand",
        'h3_1': "Voyage et en personne",
        'p_5a': "Utilisez AirPods Live Translation. La livraison mains libres dans l'oreille est vraiment meilleure que sortir le téléphone à chaque réponse. Gardez un repli (Google Traduction) pour les langues qu'Apple ne couvre pas.",
        'h3_2': "Réunions, cours, médias sur bureau",
        'p_5b': "Utilisez une couche de sous-titres au niveau système (Windows Live Captions, macOS Live Captions, ou un tiers comme Live Subtitles qui fait sous-titres inter-apps avec traduction). AirPods Live Translation simplement n'y tourne pas.",
        'h2_faq': 'FAQ',
        'q1': "AirPods Live Translation fonctionne-t-elle sans internet ?", 'a1': "Sur iPhone Apple Silicon (iPhone 15 Pro et plus récents), les packs linguistiques pris en charge tournent sur appareil après téléchargement.",
        'q2': "Puis-je utiliser AirPods Live Translation dans un appel Zoom ?", 'a2': "Pas par conception. La fonction est pour la parole en personne, pas l'audio système. Pour la traduction Zoom utilisez les sous-titres traduits intégrés de Zoom ou une couche bureau.",
        'q3': "Remplace-t-elle les applis de traduction dédiées ?", 'a3': "Pour conversation et voyage oui pour la plupart. Pour réunions, broadcasts et workflows bureau non.",
        'h2_refs': 'Références',
        'ref1_url': REF1_URL, 'ref1_label': 'Apple — Traduire texte, voix et conversations',
        'ref2_url': REF2_URL, 'ref2_label': "Apple — vue d'ensemble AirPods",
        'ref3_url': REF3_URL, 'ref3_label': 'Apple Developer — framework Translation',
        'related_label': 'Lecture connexe',
        'related': [('23', "Traducteur vocal en 2026 : outils en temps réel comparés par cas d'usage"), ('25', "Sous-titres en direct 2026 : comment fonctionnent les sous-titres IA et quand les utiliser"), ('18', "Google Meet vs Zoom vs Teams : sous-titres traduits en 2026")],
        'cta_title': "Pour réunions et bureau : les sous-titres qu'AirPods Live Translation ne peut pas",
        'cta_body': "Sous-titres en direct inter-apps et traduction en temps réel sur Windows et Mac — couvrant les workflows qu'AirPods Live Translation ne gère pas.",
        'cta_button': 'Télécharger depuis Microsoft Store',
    },
    'it': {
        'title': "AirPods Live Translation in iOS 26: cosa fa bene e dove fallisce",
        'description': "Recensione onesta di AirPods Live Translation in iOS 26: come funziona la traduzione on-device di Apple, quali casi d'uso domina, e cosa non fa (riunioni, broadcast, contesti su schermo).",
        'keywords': "airpods live translate, apple live translation, ios 26 live translation, airpods traduzione, apple translate recensione",
        'og_description': "Cosa fa bene AirPods Live Translation — e dove serve qualcos'altro.",
        'image_alt': "AirPods che traducono il parlato in diretta durante una conversazione faccia a faccia",
        'home_label': 'Home', 'articles_label': 'Articoli',
        'breadcrumb_short': 'AirPods Live Translation iOS 26',
        'back_link': 'Torna agli articoli', 'date_label': '28 maggio 2026',
        'author_label': 'Autore', 'updated_label': 'Aggiornato',
        'twitter_description': "Recensione onesta di AirPods Live Translation iOS 26 — punti forti, deboli e strumenti complementari.",
        'intro': "<strong>AirPods Live Translation</strong> di Apple in iOS 26 è una delle funzioni di accessibilità più discusse dell'anno. Fa la traduzione di conversazioni sorprendentemente bene — e quasi nient'altro. Sapere cosa non può fare è ciò che ti aiuta a scegliere lo strumento giusto per il tuo flusso reale.",
        'h2_1': 'Come funziona davvero AirPods Live Translation',
        'p_1': "L'audio catturato dall'iPhone (microfono o AirPods instradati come mic di sistema) passa attraverso il riconoscimento vocale on-device di Apple, poi attraverso il framework Translation (anch'esso on-device su Apple Silicon). Il testo tradotto viene riprodotto attraverso gli AirPods tramite il text-to-speech di Apple. L'intera pipeline gira senza inviare audio a un server cloud. Latenza circa 1,5–2,5 secondi per turno.",
        'h2_2': 'Dove vince AirPods Live Translation',
        'li_2a': "<strong>Conversazioni di viaggio faccia a faccia:</strong> turni brevi, due parlanti, uno potrebbe non avere AirPods. Calzata perfetta. L'audio tradotto suona nel tuo orecchio mentre la voce dell'altro nell'aria — scambio naturale.",
        'li_2b': "<strong>Momenti sensibili alla privacy:</strong> conversazioni mediche, legali o personali dove non vuoi server cloud nel ciclo. L'elaborazione on-device è il differenziatore.",
        'li_2c': "<strong>Traduzione rapida ad alta voce:</strong> leggere un menu, chiedere indicazioni, confermare una prenotazione. Mani libere batte il flusso schermo del telefono.",
        'h2_3': "Dove fallisce AirPods Live Translation",
        'li_3a': "<strong>Riunioni multi-parlante:</strong> la funzione è progettata per turni a due. Uno Zoom con 6 persone che si parlano sopra non è il suo flusso.",
        'li_3b': "<strong>Audio broadcast (lezioni, film, stream, YouTube):</strong> AirPods Live Translation non legge l'audio di sistema; instrada l'input del microfono. Ascoltare una lezione e leggere la traduzione è un flusso di sottotitoli, non di AirPods.",
        'li_3c': "<strong>Lavoro desktop/laptop:</strong> la funzione vive su iPhone/iPad. Se il lavoro avviene su desktop, serve un layer separato di sottotitoli+traduzione per quello schermo.",
        'h2_4': "AirPods Live Translation vs alternative",
        'th_1': 'Strumento', 'th_2': 'Workflow migliore', 'th_3': 'Punti di forza', 'th_4': 'Limiti',
        't1c1': 'AirPods Live Translation', 't1c2': 'Conversazione, viaggio', 't1c3': 'Privacy on-device, integrazione AirPods, mani libere', 't1c4': 'Solo iPhone; nessun supporto riunione/broadcast',
        't2c1': 'Google Translate (Conversazione)', 't2c2': 'Conversazione, viaggio', 't2c3': 'Gratis, copertura linguistica più ampia, multipiattaforma', 't2c4': 'Flusso schermo telefono invece di mani libere',
        't3c1': 'Microsoft Translator', 't3c2': 'Conversazione, multi-dispositivo', 't3c3': 'Sessioni multi-dispositivo per conversazioni di gruppo', 't3c4': 'Sessioni pianificate; turn-taking meno naturale',
        't4c1': 'Live Subtitles', 't4c2': 'Broadcast, riunioni, media su desktop', 't4c3': "Sottotitoli audio di sistema e traduzione in qualsiasi app desktop", 't4c4': "Non per scenari di viaggio in-ear mani libere",
        'h2_5': "Cosa usare quando",
        'h3_1': "Viaggio e di persona",
        'p_5a': "Usa AirPods Live Translation. La consegna in-ear mani libere è davvero meglio che tirare fuori il telefono per ogni risposta. Tieni un ripiego (Google Translate) per le lingue che Apple non copre.",
        'h3_2': "Riunioni, lezioni, media su desktop",
        'p_5b': "Usa un layer di sottotitoli a livello sistema (Windows Live Captions, macOS Live Captions, o un terzo come Live Subtitles che fa sottotitoli inter-app con traduzione). AirPods Live Translation semplicemente non gira lì.",
        'h2_faq': 'FAQ',
        'q1': 'AirPods Live Translation funziona senza internet?', 'a1': 'Su iPhone Apple Silicon (iPhone 15 Pro e più recenti), i pack linguistici supportati girano on-device dopo il download.',
        'q2': 'Posso usare AirPods Live Translation in una chiamata Zoom?', 'a2': "Non come progettato. La funzione è per il parlato di persona, non per l'audio di sistema. Per la traduzione Zoom usa i sottotitoli tradotti integrati di Zoom o un layer di sottotitoli desktop.",
        'q3': 'Sostituisce le app di traduzione dedicate?', 'a3': 'Per conversazione e viaggio, sì per la maggior parte. Per riunioni, broadcast e flussi desktop, no.',
        'h2_refs': 'Riferimenti',
        'ref1_url': REF1_URL, 'ref1_label': 'Apple — Tradurre testo, voce e conversazioni',
        'ref2_url': REF2_URL, 'ref2_label': 'Apple — panoramica AirPods',
        'ref3_url': REF3_URL, 'ref3_label': 'Apple Developer — framework Translation',
        'related_label': 'Letture correlate',
        'related': [('23', "Traduzione vocale 2026: strumenti in tempo reale a confronto per caso d'uso"), ('25', "Sottotitoli live 2026: come funzionano i sottotitoli IA e quando usarli"), ('18', "Google Meet vs Zoom vs Teams: sottotitoli tradotti nel 2026")],
        'cta_title': "Per riunioni e desktop: sottotitoli che AirPods Live Translation non può dare",
        'cta_body': "Sottotitoli live inter-app e traduzione in tempo reale su Windows e Mac — coprendo i flussi che AirPods Live Translation non gestisce.",
        'cta_button': 'Scarica da Microsoft Store',
    },
    'pl': {
        'title': "AirPods Live Translation w iOS 26: co robi dobrze, a gdzie zawodzi",
        'description': "Uczciwa recenzja AirPods Live Translation w iOS 26: jak działa tłumaczenie Apple na urządzeniu, jakie przypadki użycia opanowuje, i czego nie robi (spotkania, broadcast, konteksty ekranowe).",
        'keywords': "airpods live translate, apple live translation, ios 26 live translation, airpods tłumaczenie, apple translate recenzja",
        'og_description': "Co AirPods Live Translation robi dobrze — i jakie przypadki użycia wymagają czegoś innego.",
        'image_alt': "AirPods tłumaczące mowę na żywo podczas rozmowy twarzą w twarz",
        'home_label': 'Strona główna', 'articles_label': 'Artykuły',
        'breadcrumb_short': 'AirPods Live Translation iOS 26',
        'back_link': 'Powrót do artykułów', 'date_label': '28 maja 2026',
        'author_label': 'Autor', 'updated_label': 'Zaktualizowano',
        'twitter_description': "Uczciwa recenzja AirPods Live Translation iOS 26 — mocne strony, słabości i narzędzia uzupełniające.",
        'intro': "<strong>AirPods Live Translation</strong> Apple w iOS 26 to jedna z najczęściej omawianych funkcji dostępności tego roku. Robi tłumaczenie rozmów zaskakująco dobrze — i prawie nic więcej. Wiedza o tym, czego nie robi, pomaga wybrać właściwe narzędzie do prawdziwego workflow.",
        'h2_1': 'Jak AirPods Live Translation faktycznie działa',
        'p_1': 'Dźwięk uchwycony przez iPhone (mikrofon lub AirPods routowane jako mikrofon systemu) przechodzi przez rozpoznawanie mowy Apple na urządzeniu, a następnie przez framework Translation (również na urządzeniu na Apple Silicon). Przetłumaczony tekst jest odtwarzany przez AirPods używając Apple text-to-speech. Cała pipeline działa bez wysyłania dźwięku do chmury. Opóźnienie około 1,5–2,5 sekundy na turę.',
        'h2_2': 'Gdzie AirPods Live Translation wygrywa',
        'li_2a': "<strong>Rozmowy podróżne twarzą w twarz:</strong> krótkie tury, dwóch mówców, jeden może nie mieć AirPods. Idealne dopasowanie. Przetłumaczone audio odtwarza się w twoim uchu, podczas gdy ich głos rozlega się w powietrzu — naturalna wymiana.",
        'li_2b': "<strong>Momenty wrażliwe na prywatność:</strong> rozmowy medyczne, prawne lub osobiste, w których nie chcesz serwerów w chmurze w pętli. Przetwarzanie na urządzeniu to wyróżnik.",
        'li_2c': "<strong>Szybkie tłumaczenie na głos:</strong> czytanie menu, pytanie o drogę, potwierdzenie rezerwacji. Wygoda bez użycia rąk przewyższa workflow ekranu telefonu.",
        'h2_3': "Gdzie AirPods Live Translation zawodzi",
        'li_3a': "<strong>Spotkania z wieloma mówcami:</strong> funkcja jest zaprojektowana dla tur dwuosobowych. Zoom z 6 osobami mówiącymi na siebie nie jest jego workflow.",
        'li_3b': "<strong>Audio broadcast (wykłady, filmy, stream, YouTube):</strong> AirPods Live Translation nie czyta dźwięku systemu; routuje wejście mikrofonu. Słuchanie wykładu i czytanie tłumaczenia to workflow napisów, nie AirPods.",
        'li_3c': "<strong>Praca na pulpicie/laptopie:</strong> funkcja żyje na iPhone/iPad. Jeśli twoja praca dzieje się na pulpicie, potrzebujesz osobnej warstwy napisów+tłumaczenia dla tego ekranu.",
        'h2_4': "AirPods Live Translation vs alternatywy",
        'th_1': 'Narzędzie', 'th_2': 'Najlepszy workflow', 'th_3': 'Mocne strony', 'th_4': 'Ograniczenia',
        't1c1': 'AirPods Live Translation', 't1c2': 'Rozmowa, podróż', 't1c3': 'Prywatność na urządzeniu, integracja AirPods, bez użycia rąk', 't1c4': 'Tylko iPhone; brak obsługi spotkań/broadcastu',
        't2c1': 'Google Translate (Konwersacja)', 't2c2': 'Rozmowa, podróż', 't2c3': 'Darmowe, najszersze pokrycie języków, międzyplatformowe', 't2c4': 'Workflow ekranu telefonu zamiast bez użycia rąk',
        't3c1': 'Microsoft Translator', 't3c2': 'Rozmowa, multi-urządzenie', 't3c3': 'Sesje multi-urządzenie dla rozmów grupowych', 't3c4': 'Skłonność do sesji planowanych; mniej naturalne tury',
        't4c1': 'Live Subtitles', 't4c2': 'Broadcast, spotkania, media na pulpicie', 't4c3': 'Napisy audio systemu i tłumaczenie w każdej aplikacji pulpitu', 't4c4': 'Nie dla scenariuszy podróży bez użycia rąk w uchu',
        'h2_5': "Czego używać kiedy",
        'h3_1': "Podróż i osobiście",
        'p_5a': "Użyj AirPods Live Translation. Dostarczanie do ucha bez użycia rąk jest naprawdę lepsze niż wyciąganie telefonu na każdą odpowiedź. Miej zapas (Google Translate) dla języków, których Apple nie obsługuje.",
        'h3_2': "Spotkania, wykłady, media na pulpicie",
        'p_5b': "Użyj warstwy napisów na poziomie systemu (Windows Live Captions, macOS Live Captions lub trzecia strona jak Live Subtitles, która robi napisy między aplikacjami z tłumaczeniem). AirPods Live Translation po prostu tam nie działa.",
        'h2_faq': 'FAQ',
        'q1': 'Czy AirPods Live Translation działa bez internetu?', 'a1': 'Na iPhone z Apple Silicon (iPhone 15 Pro i nowsze) obsługiwane pakiety języków działają na urządzeniu po pobraniu.',
        'q2': 'Czy mogę używać AirPods Live Translation w połączeniu Zoom?', 'a2': "Nie zgodnie z projektem. Funkcja jest do mowy osobistej, nie do dźwięku systemu. Do tłumaczenia Zoom użyj wbudowanych przetłumaczonych napisów Zoom lub warstwy napisów pulpitu.",
        'q3': 'Czy zastępuje dedykowane aplikacje tłumaczeniowe?', 'a3': 'Dla rozmowy i podróży, tak dla większości użytkowników. Dla spotkań, broadcastów i workflow pulpitu, nie.',
        'h2_refs': 'Źródła',
        'ref1_url': REF1_URL, 'ref1_label': 'Apple — Tłumaczenie tekstu, głosu i rozmów',
        'ref2_url': REF2_URL, 'ref2_label': 'Apple — przegląd AirPods',
        'ref3_url': REF3_URL, 'ref3_label': 'Apple Developer — framework Translation',
        'related_label': 'Powiązane artykuły',
        'related': [('23', 'Tłumacz głosowy 2026: narzędzia w czasie rzeczywistym według zastosowania'), ('25', 'Napisy na żywo 2026: jak działają napisy AI i kiedy ich używać'), ('18', 'Google Meet vs Zoom vs Teams: przetłumaczone napisy w 2026')],
        'cta_title': 'Do spotkań i pulpitu: napisy, których AirPods Live Translation nie może dać',
        'cta_body': "Napisy na żywo między aplikacjami i tłumaczenie w czasie rzeczywistym na Windows i Mac — pokrywają workflow, którego AirPods Live Translation nie obsługuje.",
        'cta_button': 'Pobierz z Microsoft Store',
    },
    'pt': {
        'title': "AirPods Live Translation no iOS 26: o que faz bem e onde falha",
        'description': "Análise honesta de AirPods Live Translation no iOS 26: como funciona a tradução no dispositivo da Apple, quais casos de uso domina, e o que não faz (reuniões, broadcast, contextos de tela).",
        'keywords': "airpods live translate, apple live translation, ios 26 live translation, airpods tradução, apple translate análise",
        'og_description': "O que AirPods Live Translation faz bem — e onde você precisa de outra coisa.",
        'image_alt': "AirPods traduzindo fala ao vivo durante uma conversa cara a cara",
        'home_label': 'Início', 'articles_label': 'Artigos',
        'breadcrumb_short': 'AirPods Live Translation iOS 26',
        'back_link': 'Voltar aos artigos', 'date_label': '28 de maio de 2026',
        'author_label': 'Autor', 'updated_label': 'Atualizado',
        'twitter_description': "Análise honesta de AirPods Live Translation iOS 26 — pontos fortes, fracos e ferramentas complementares.",
        'intro': "O <strong>AirPods Live Translation</strong> da Apple no iOS 26 é um dos recursos de acessibilidade mais discutidos do ano. Faz tradução de conversa surpreendentemente bem — e quase nada mais. Saber o que ele não pode fazer é o que ajuda você a escolher a ferramenta certa para seu workflow real.",
        'h2_1': 'Como o AirPods Live Translation realmente funciona',
        'p_1': 'O áudio capturado pelo iPhone (microfone ou AirPods roteados como microfone do sistema) passa pelo reconhecimento de voz no dispositivo da Apple, depois pelo framework Translation (também no dispositivo em Apple Silicon). O texto traduzido é reproduzido através dos AirPods usando o text-to-speech da Apple. Todo o pipeline roda sem enviar áudio para um servidor em nuvem. Latência cerca de 1,5–2,5 segundos por turno.',
        'h2_2': 'Onde o AirPods Live Translation vence',
        'li_2a': "<strong>Conversas de viagem cara a cara:</strong> turnos curtos, dois falantes, um pode não ter AirPods. Encaixe perfeito. O áudio traduzido toca no seu ouvido enquanto a voz da outra pessoa toca no ar — vai e vem natural.",
        'li_2b': "<strong>Momentos sensíveis à privacidade:</strong> conversas médicas, jurídicas ou pessoais onde você não quer servidores na nuvem no loop. Processamento no dispositivo é o diferencial.",
        'li_2c': "<strong>Tradução rápida em voz alta:</strong> ler um cardápio, pedir direções, confirmar uma reserva. Mãos livres bate o workflow de tela do telefone.",
        'h2_3': "Onde o AirPods Live Translation falha",
        'li_3a': "<strong>Reuniões multi-falantes:</strong> o recurso é projetado para turnos de duas pessoas. Um Zoom com 6 pessoas falando uma sobre a outra não é o workflow dele.",
        'li_3b': "<strong>Áudio broadcast (palestras, filmes, streams, YouTube):</strong> AirPods Live Translation não lê áudio do sistema; ele roteia entrada de microfone. Ouvir uma palestra e ler tradução é workflow de legendas, não de AirPods.",
        'li_3c': "<strong>Trabalho de desktop/laptop:</strong> o recurso vive no iPhone/iPad. Se seu trabalho acontece no desktop, você precisa de uma camada separada de legenda+tradução para essa tela.",
        'h2_4': "AirPods Live Translation vs alternativas",
        'th_1': 'Ferramenta', 'th_2': 'Melhor workflow', 'th_3': 'Pontos fortes', 'th_4': 'Limites',
        't1c1': 'AirPods Live Translation', 't1c2': 'Conversa, viagem', 't1c3': 'Privacidade no dispositivo, integração AirPods, mãos livres', 't1c4': 'Apenas iPhone; sem suporte a reunião/broadcast',
        't2c1': 'Google Tradutor (modo Conversa)', 't2c2': 'Conversa, viagem', 't2c3': 'Grátis, cobertura linguística mais ampla, multiplataforma', 't2c4': 'Workflow de tela do telefone em vez de mãos livres',
        't3c1': 'Microsoft Translator', 't3c2': 'Conversa, multi-dispositivo', 't3c3': 'Sessões multi-dispositivo para conversas em grupo', 't3c4': 'Tendência a sessões planejadas; turnos menos naturais',
        't4c1': 'Live Subtitles', 't4c2': 'Broadcast, reuniões, mídia em desktop', 't4c3': 'Legendas de áudio do sistema e tradução em qualquer app de desktop', 't4c4': 'Não para cenários de viagem no ouvido mãos livres',
        'h2_5': "O que usar quando",
        'h3_1': "Viagem e pessoalmente",
        'p_5a': "Use AirPods Live Translation. A entrega no ouvido mãos livres é genuinamente melhor do que pegar o telefone para cada resposta. Tenha um backup (Google Tradutor) para idiomas que a Apple não cobre.",
        'h3_2': "Reuniões, palestras, mídia no desktop",
        'p_5b': "Use uma camada de legendas em nível de sistema (Windows Live Captions, macOS Live Captions, ou um terceiro como Live Subtitles que faz legendas entre apps com tradução). AirPods Live Translation simplesmente não roda lá.",
        'h2_faq': 'Perguntas frequentes',
        'q1': 'O AirPods Live Translation funciona sem internet?', 'a1': 'Em iPhones Apple Silicon (iPhone 15 Pro e mais recentes), pacotes de idiomas suportados rodam no dispositivo após o download.',
        'q2': 'Posso usar AirPods Live Translation em uma chamada Zoom?', 'a2': "Não como projetado. O recurso é para fala em pessoa, não para áudio do sistema. Para tradução Zoom use as legendas traduzidas integradas do Zoom ou uma camada de legendas de desktop.",
        'q3': 'Ele substitui aplicativos de tradução dedicados?', 'a3': 'Para conversa e viagem, sim para a maioria. Para reuniões, broadcasts e workflows de desktop, não.',
        'h2_refs': 'Referências',
        'ref1_url': REF1_URL, 'ref1_label': 'Apple — Traduzir texto, voz e conversas',
        'ref2_url': REF2_URL, 'ref2_label': 'Apple — visão geral AirPods',
        'ref3_url': REF3_URL, 'ref3_label': 'Apple Developer — framework Translation',
        'related_label': 'Leitura relacionada',
        'related': [('23', 'Tradutor de voz em 2026: ferramentas em tempo real comparadas por caso de uso'), ('25', 'Legendas ao vivo em 2026: como funcionam as legendas com IA e quando usá-las'), ('18', 'Google Meet vs Zoom vs Teams: legendas traduzidas em 2026')],
        'cta_title': 'Para reuniões e desktop: obtenha as legendas que AirPods Live Translation não pode',
        'cta_body': "Legendas ao vivo entre apps e tradução em tempo real no Windows e Mac — cobrindo os workflows que AirPods Live Translation não cobre.",
        'cta_button': 'Baixar na Microsoft Store',
    },
    'tr': {
        'title': "iOS 26'da AirPods Canlı Çeviri: neyi iyi yapıyor ve nerede yetersiz kalıyor",
        'description': "iOS 26 AirPods Canlı Çeviri dürüst incelemesi: Apple'ın cihaz üzerindeki çevirisinin nasıl çalıştığı, hangi kullanım senaryolarını başardığı ve neleri yapmadığı (toplantılar, yayın, ekran tabanlı bağlamlar).",
        'keywords': "airpods canlı çeviri, apple canlı çeviri, ios 26 canlı çeviri, airpods çeviri, apple translate inceleme",
        'og_description': "AirPods Canlı Çeviri'nin iyi yaptıkları — ve başka bir şey gerektiren kullanım senaryoları.",
        'image_alt': "Yüz yüze konuşma sırasında AirPods'un konuşmayı canlı olarak çevirmesi",
        'home_label': 'Ana Sayfa', 'articles_label': 'Makaleler',
        'breadcrumb_short': "iOS 26'da AirPods Canlı Çeviri",
        'back_link': 'Makalelere dön', 'date_label': '28 Mayıs 2026',
        'author_label': 'Yazar', 'updated_label': 'Güncellendi',
        'twitter_description': "iOS 26 AirPods Canlı Çeviri dürüst incelemesi — güçlü yönler, zayıflıklar ve tamamlayıcı araçlar.",
        'intro': "Apple'ın iOS 26'daki <strong>AirPods Canlı Çeviri</strong>'si, yılın en çok tartışılan erişilebilirlik özelliklerinden biridir. Konuşma çevirisini şaşırtıcı derecede iyi yapar — ve neredeyse başka hiçbir şey yapmaz. Neyi yapamadığını bilmek, gerçek iş akışınız için doğru aracı seçmenize yardımcı olur.",
        'h2_1': "AirPods Canlı Çeviri aslında nasıl çalışıyor",
        'p_1': "iPhone tarafından yakalanan ses (mikrofon veya sistem mikrofonu olarak yönlendirilmiş AirPods), Apple'ın cihaz üzerindeki konuşma tanımasından, ardından Translation çerçevesinden (Apple Silicon üzerinde de cihaz üzerinde) geçer. Çevrilmiş metin, Apple'ın text-to-speech'i kullanılarak AirPods aracılığıyla geri okunur. Tüm boru hattı sesi bir bulut sunucusuna göndermeden çalışır. Gecikme: dönüş başına 1,5–2,5 saniye.",
        'h2_2': "AirPods Canlı Çeviri'nin kazandığı yerler",
        'li_2a': "<strong>Yüz yüze seyahat konuşmaları:</strong> kısa turlar, iki konuşmacı, biri AirPods'a sahip olmayabilir. Mükemmel uyum. Çevrilmiş ses kulağınızda çalarken karşıdakinin sesi havada çalar — doğal gidip gelme.",
        'li_2b': "<strong>Gizliliğe duyarlı anlar:</strong> bulut sunucularını döngüde istemediğiniz tıbbi, hukuki veya kişisel konuşmalar. Cihaz üzerinde işleme farklılaştırıcıdır.",
        'li_2c': "<strong>Hızlı sesli çeviri:</strong> menü okuma, yol sorma, rezervasyon onayı. Eller serbest rahatlık telefon-ekran iş akışını yener.",
        'h2_3': "AirPods Canlı Çeviri'nin yetersiz kaldığı yerler",
        'li_3a': "<strong>Çok konuşmacılı toplantılar:</strong> özellik iki kişilik turlar için tasarlandı. Birbiri üzerine konuşan 6 kişiyle bir Zoom toplantısı onun iş akışı değil.",
        'li_3b': "<strong>Yayın sesi (dersler, filmler, yayınlar, YouTube):</strong> AirPods Canlı Çeviri sistem sesini okumaz; mikrofon girişini yönlendirir. Ders dinleme ve çeviri okuma altyazı iş akışıdır, AirPods iş akışı değil.",
        'li_3c': "<strong>Masaüstü/dizüstü çalışma:</strong> özellik iPhone/iPad'de yaşar. İşiniz masaüstünde olursa, o ekran için ayrı bir altyazı+çeviri katmanına ihtiyacınız var.",
        'h2_4': "AirPods Canlı Çeviri vs alternatifler",
        'th_1': 'Araç', 'th_2': 'En iyi iş akışı', 'th_3': 'Güçlü yönler', 'th_4': 'Sınırlar',
        't1c1': 'AirPods Canlı Çeviri', 't1c2': 'Konuşma, seyahat', 't1c3': 'Cihaz üzerinde gizlilik, AirPods entegrasyonu, eller serbest', 't1c4': 'Yalnızca iPhone; toplantı/yayın desteği yok',
        't2c1': 'Google Çeviri (Konuşma modu)', 't2c2': 'Konuşma, seyahat', 't2c3': 'Ücretsiz, en geniş dil kapsamı, platformlar arası', 't2c4': 'Eller serbest yerine telefon-ekran iş akışı',
        't3c1': 'Microsoft Translator', 't3c2': 'Konuşma, çoklu cihaz', 't3c3': 'Grup konuşmaları için çoklu cihaz oturumları', 't3c4': 'Planlı oturum eğilimi; daha az doğal sıra alma',
        't4c1': 'Live Subtitles', 't4c2': 'Yayın, toplantılar, masaüstünde medya', 't4c3': 'Herhangi bir masaüstü uygulamasında sistem sesi altyazıları ve çeviri', 't4c4': "Eller serbest kulak içi seyahat senaryoları için değil",
        'h2_5': "Ne zaman ne kullanmalı",
        'h3_1': "Seyahat ve yüz yüze",
        'p_5a': "AirPods Canlı Çeviri'yi kullanın. Eller serbest kulak içi sunum, her yanıt için telefonu çıkarmaktan gerçekten daha iyidir. Apple'ın kapsamadığı diller için yedek (Google Çeviri) tutun.",
        'h3_2': "Toplantılar, dersler, masaüstünde medya",
        'p_5b': "Sistem seviyesi bir altyazı katmanı kullanın (Windows Live Captions, macOS Live Captions veya çeviri ile uygulamalar arası altyazılar yapan Live Subtitles gibi üçüncü taraf). AirPods Canlı Çeviri orada basitçe çalışmaz.",
        'h2_faq': 'SSS',
        'q1': 'AirPods Canlı Çeviri internet olmadan çalışır mı?', 'a1': 'Apple Silicon iPhone\'larda (iPhone 15 Pro ve daha yeni), desteklenen dil paketleri indirildikten sonra cihaz üzerinde çalışır.',
        'q2': 'Bir Zoom çağrısında AirPods Canlı Çeviri kullanabilir miyim?', 'a2': "Tasarlandığı gibi değil. Özellik yüz yüze konuşma içindir, sistem sesi için değil. Zoom çevirisi için Zoom'un yerleşik çevrilmiş altyazılarını veya bir masaüstü altyazı katmanını kullanın.",
        'q3': 'Özel çeviri uygulamalarının yerini alır mı?', 'a3': 'Konuşma ve seyahat için çoğu kullanıcı için evet. Toplantılar, yayınlar ve masaüstü iş akışları için hayır.',
        'h2_refs': 'Kaynaklar',
        'ref1_url': REF1_URL, 'ref1_label': 'Apple — Metin, ses ve konuşmaları çevirme',
        'ref2_url': REF2_URL, 'ref2_label': 'Apple — AirPods genel bakış',
        'ref3_url': REF3_URL, 'ref3_label': 'Apple Developer — Translation çerçevesi',
        'related_label': 'İlgili okumalar',
        'related': [('23', 'Sesli çeviri 2026: gerçek zamanlı araçlar kullanım senaryosuna göre karşılaştırıldı'), ('25', "Canlı altyazılar 2026: AI tarafından üretilen altyazılar nasıl çalışır ve ne zaman kullanılır"), ('18', "2026'da Google Meet vs Zoom vs Teams çevrilmiş altyazılar")],
        'cta_title': 'Toplantılar ve masaüstü için: AirPods Canlı Çeviri\'nin veremediği altyazılar',
        'cta_body': "Windows ve Mac'te uygulamalar arası canlı altyazılar ve gerçek zamanlı çeviri — AirPods Canlı Çeviri'nin kapsamadığı iş akışlarını kapsar.",
        'cta_button': "Microsoft Store'dan indir",
    },
    'uk': {
        'title': "AirPods Live Translation в iOS 26: що добре виходить і де провал",
        'description': "Чесний огляд AirPods Live Translation в iOS 26: як працює on-device переклад Apple, в яких сценаріях він сильний і що не робить (зустрічі, broadcast, екранні контексти).",
        'keywords': "airpods live translate, apple live translation, ios 26 live translation, airpods переклад, apple translate огляд",
        'og_description': "Що AirPods Live Translation робить добре — і де потрібен інший інструмент.",
        'image_alt': "AirPods перекладають мову в реальному часі під час особистої бесіди",
        'home_label': 'Головна', 'articles_label': 'Статті',
        'breadcrumb_short': 'AirPods Live Translation iOS 26',
        'back_link': 'Назад до статей', 'date_label': '28 травня 2026',
        'author_label': 'Автор', 'updated_label': 'Оновлено',
        'twitter_description': "Чесний огляд AirPods Live Translation в iOS 26 — сильні, слабкі сторони та доповнюючі інструменти.",
        'intro': "Apple <strong>AirPods Live Translation</strong> в iOS 26 — одна з найбільш обговорюваних accessibility-фіч року. Переклад розмов вона робить напрочуд добре — і майже нічого більше. Знання того, чого вона НЕ робить, допомагає вибрати правильний інструмент під реальний workflow.",
        'h2_1': 'Як AirPods Live Translation реально працює',
        'p_1': "Аудіо, захоплене iPhone (мікрофон або системний мікрофон через AirPods), проходить on-device розпізнавання мовлення Apple, потім фреймворк Translation (на Apple Silicon теж on-device). Перекладений текст зачитується через AirPods за допомогою TTS Apple. Весь пайплайн працює без відправки аудіо в хмару. Латентність приблизно 1,5–2,5 секунди на репліку.",
        'h2_2': 'Де AirPods Live Translation виграє',
        'li_2a': "<strong>Особисті розмови в подорожах:</strong> короткі репліки, два співрозмовники, один з яких може бути без AirPods. Ідеальне поєднання. Перекладене аудіо звучить у твоєму вусі, а голос співрозмовника — у повітрі. Природний обмін.",
        'li_2b': "<strong>Приватні моменти:</strong> медичні, юридичні чи особисті бесіди, де не хочеться відправляти аудіо у хмару. On-device обробка — головна відмінність.",
        'li_2c': "<strong>Швидкий переклад уголос:</strong> прочитати меню, спитати дорогу, підтвердити бронювання. Hands-free зручніше, ніж робота з екраном телефона.",
        'h2_3': "Де AirPods Live Translation провисає",
        'li_3a': "<strong>Багатоговорящі зустрічі:</strong> функція розрахована на двосторонні репліки. Zoom з 6 перекрикуючими один одного — не її workflow.",
        'li_3b': "<strong>Broadcast-аудіо (лекції, фільми, стріми, YouTube):</strong> AirPods Live Translation не читає системне аудіо, вона маршрутизує мікрофонний вхід. Слухати лекцію і читати переклад — це caption-workflow, а не AirPods-workflow.",
        'li_3c': "<strong>Десктоп/ноутбук:</strong> функція живе в iPhone/iPad. Якщо робота на десктопі — потрібен окремий шар субтитрів+перекладу для цього екрана.",
        'h2_4': "AirPods Live Translation vs альтернативи",
        'th_1': 'Інструмент', 'th_2': 'Найкращий workflow', 'th_3': 'Сильні сторони', 'th_4': 'Обмеження',
        't1c1': 'AirPods Live Translation', 't1c2': 'Розмова, подорожі', 't1c3': 'On-device приватність, інтеграція з AirPods, hands-free', 't1c4': 'Тільки iPhone; немає зустрічей/broadcast',
        't2c1': 'Google Translate (Розмова)', 't2c2': 'Розмова, подорожі', 't2c3': 'Безкоштовно, найширше покриття мов, кросплатформенність', 't2c4': 'Workflow з екраном телефона, а не hands-free',
        't3c1': 'Microsoft Translator', 't3c2': 'Розмова, мультидевайс', 't3c3': 'Мультидевайс-сесії для груп', 't3c4': 'Заточений під планові сесії, менше під спонтанні',
        't4c1': 'Live Subtitles', 't4c2': 'Broadcast, зустрічі, медіа на десктопі', 't4c3': 'Системні субтитри та переклад у всіх десктоп-застосунках', 't4c4': 'Не для hands-free in-ear подорожей',
        'h2_5': "Що коли використовувати",
        'h3_1': "Подорожі та особисте спілкування",
        'p_5a': "AirPods Live Translation. Hands-free in-ear доставка реально краща, ніж діставати телефон на кожну відповідь. Запасний (Google Translate) для мов, які Apple не підтримує.",
        'h3_2': "Зустрічі, лекції, медіа на десктопі",
        'p_5b': "Системний шар субтитрів (Windows Live Captions, macOS Live Captions або сторонній на кшталт Live Subtitles з крос-застосунковими субтитрами і перекладом). AirPods Live Translation там просто не працює.",
        'h2_faq': 'Поширені запитання',
        'q1': 'Чи працює AirPods Live Translation без інтернету?', 'a1': 'На iPhone з Apple Silicon (iPhone 15 Pro і новіше) підтримувані мовні пакети працюють на пристрої після завантаження.',
        'q2': 'Чи можна використовувати AirPods Live Translation у Zoom?', 'a2': "За задумом — ні. Функція для особистого мовлення, не для системного аудіо. Для перекладу Zoom використовуйте вбудовані перекладені субтитри Zoom або десктопний шар субтитрів.",
        'q3': 'Чи замінює це спеціалізовані перекладачі?', 'a3': 'Для розмов і подорожей — так, для більшості. Для зустрічей, broadcast і десктопу — ні.',
        'h2_refs': 'Джерела',
        'ref1_url': REF1_URL, 'ref1_label': 'Apple — переклад тексту, голосу і розмов',
        'ref2_url': REF2_URL, 'ref2_label': 'Apple — огляд AirPods',
        'ref3_url': REF3_URL, 'ref3_label': 'Apple Developer — Translation framework',
        'related_label': 'Схожі матеріали',
        'related': [('23', 'Голосовий перекладач у 2026 році: інструменти реального часу за сценаріями'), ('25', 'Живі субтитри 2026: як працюють AI-субтитри і коли їх використовувати'), ('18', 'Google Meet vs Zoom vs Teams: перекладені субтитри у 2026 році')],
        'cta_title': 'Для зустрічей і десктопу — субтитри, яких AirPods Live Translation не дає',
        'cta_body': "Крос-застосункові живі субтитри і реал-тайм переклад на Windows і Mac — закривають workflow, який AirPods Live Translation не закриває.",
        'cta_button': 'Завантажити з Microsoft Store',
    },
    'nl': {
        'title': "AirPods Live Translation in iOS 26: wat het goed doet en waar het tekortschiet",
        'description': "Eerlijke beoordeling van AirPods Live Translation in iOS 26: hoe Apple's on-device vertaling werkt, welke use cases het beheerst, en wat het niet doet (vergaderingen, broadcast, schermcontexten).",
        'keywords': "airpods live translate, apple live translation, ios 26 live translation, airpods vertaling, apple translate review",
        'og_description': "Wat AirPods Live Translation goed doet — en welke use cases iets anders nodig hebben.",
        'image_alt': "AirPods vertalen spraak live tijdens een persoonlijk gesprek",
        'home_label': 'Home', 'articles_label': 'Artikelen',
        'breadcrumb_short': 'AirPods Live Translation iOS 26',
        'back_link': 'Terug naar artikelen', 'date_label': '28 mei 2026',
        'author_label': 'Auteur', 'updated_label': 'Bijgewerkt',
        'twitter_description': "Eerlijke beoordeling van AirPods Live Translation iOS 26 — sterke punten, zwakheden en aanvullende tools.",
        'intro': "Apple's <strong>AirPods Live Translation</strong> in iOS 26 is een van de meest besproken toegankelijkheidsfuncties van het jaar. Het doet gespreksvertaling verrassend goed — en bijna niets anders. Weten wat het niet kan doen helpt je de juiste tool kiezen voor je echte workflow.",
        'h2_1': 'Hoe AirPods Live Translation eigenlijk werkt',
        'p_1': 'Audio die door de iPhone wordt vastgelegd (microfoon of AirPods gerouteerd als systeem-mic) gaat door Apple\'s on-device spraakherkenning, en dan door het Translation-framework (ook on-device op Apple Silicon). Vertaalde tekst wordt teruggespeeld via AirPods met Apple\'s text-to-speech. De hele pipeline draait zonder audio naar een cloudserver te sturen. Latency: 1,5–2,5 seconden per beurt.',
        'h2_2': 'Waar AirPods Live Translation wint',
        'li_2a': "<strong>Persoonlijke reisgesprekken:</strong> korte beurten, twee sprekers, een heeft mogelijk geen AirPods. Perfecte match. De vertaalde audio speelt in je oor terwijl hun stem in de lucht klinkt — natuurlijke heen-en-weer.",
        'li_2b': "<strong>Privacygevoelige momenten:</strong> medische, juridische of persoonlijke gesprekken waarbij je geen cloudservers in de loop wil. On-device verwerking is het onderscheid.",
        'li_2c': "<strong>Snelle hardop vertaling:</strong> een menu lezen, de weg vragen, een boeking bevestigen. Handsfree gemak slaat een telefoon-scherm workflow.",
        'h2_3': "Waar AirPods Live Translation tekortschiet",
        'li_3a': "<strong>Multi-sprekersvergaderingen:</strong> de functie is ontworpen voor twee-persoonbeurten. Een Zoom-vergadering met 6 mensen die door elkaar praten is niet zijn workflow.",
        'li_3b': "<strong>Broadcast-audio (lezingen, films, streams, YouTube):</strong> AirPods Live Translation leest geen systeemaudio; het routeert microfooninvoer. Een lezing beluisteren en vertaling lezen is een ondertitelingsworkflow, geen AirPods-workflow.",
        'li_3c': "<strong>Desktop-/laptopwerk:</strong> de functie leeft op iPhone/iPad. Als je werk op desktop gebeurt, heb je een aparte ondertiteling+vertaling-laag nodig voor dat scherm.",
        'h2_4': "AirPods Live Translation vs alternatieven",
        'th_1': 'Tool', 'th_2': 'Beste workflow', 'th_3': 'Sterke punten', 'th_4': 'Beperkingen',
        't1c1': 'AirPods Live Translation', 't1c2': 'Gesprek, reizen', 't1c3': 'On-device privacy, AirPods-integratie, handsfree', 't1c4': 'Alleen iPhone; geen vergadering/broadcast',
        't2c1': 'Google Translate (Gesprek)', 't2c2': 'Gesprek, reizen', 't2c3': 'Gratis, breedste taaldekking, cross-platform', 't2c4': 'Telefoonscherm-workflow in plaats van handsfree',
        't3c1': 'Microsoft Translator', 't3c2': 'Gesprek, multi-device', 't3c3': 'Multi-device sessies voor groepsgesprekken', 't3c4': 'Voorkeur voor geplande sessies; minder natuurlijke beurt',
        't4c1': 'Live Subtitles', 't4c2': 'Broadcast, vergaderingen, media op desktop', 't4c3': 'Systeemaudio-ondertiteling en vertaling in elke desktop-app', 't4c4': "Niet voor handsfree in-ear reisscenario's",
        'h2_5': "Wat wanneer gebruiken",
        'h3_1': "Reizen en persoonlijk",
        'p_5a': "Gebruik AirPods Live Translation. De handsfree in-ear levering is echt beter dan voor elke reactie de telefoon pakken. Heb een fallback (Google Translate) klaar voor talen die Apple niet dekt.",
        'h3_2': "Vergaderingen, lezingen, media op desktop",
        'p_5b': "Gebruik een systeemniveau ondertiteling-laag (Windows Live Captions, macOS Live Captions, of een derde partij zoals Live Subtitles die cross-app ondertiteling met vertaling doet). AirPods Live Translation draait daar simpelweg niet.",
        'h2_faq': 'Veelgestelde vragen',
        'q1': 'Werkt AirPods Live Translation zonder internet?', 'a1': 'Op Apple Silicon iPhones (iPhone 15 Pro en nieuwer) draaien ondersteunde taalpakketten on-device na download.',
        'q2': 'Kan ik AirPods Live Translation in een Zoom-gesprek gebruiken?', 'a2': "Niet zoals ontworpen. De functie is voor persoonlijke spraak, niet voor systeemaudio. Voor Zoom-vertaling gebruik je Zoom's ingebouwde vertaalde ondertiteling of een desktop ondertitelinglaag.",
        'q3': 'Vervangt het toegewijde vertaalapps?', 'a3': 'Voor gesprek en reizen, ja voor de meeste gebruikers. Voor vergaderingen, broadcasts en desktop-workflows, nee.',
        'h2_refs': 'Bronnen',
        'ref1_url': REF1_URL, 'ref1_label': 'Apple — Tekst, spraak en gesprekken vertalen',
        'ref2_url': REF2_URL, 'ref2_label': 'Apple — AirPods overzicht',
        'ref3_url': REF3_URL, 'ref3_label': 'Apple Developer — Translation framework',
        'related_label': 'Gerelateerde artikelen',
        'related': [('23', 'Spraakvertaling in 2026: realtime tools vergeleken per use case'), ('25', 'Live ondertiteling in 2026: hoe AI-ondertiteling werkt en wanneer te gebruiken'), ('18', 'Google Meet vs Zoom vs Teams: vertaalde ondertiteling in 2026')],
        'cta_title': 'Voor vergaderingen en desktop: ondertiteling die AirPods Live Translation niet kan',
        'cta_body': "Cross-app live ondertiteling en realtime vertaling op Windows en Mac — dekt de workflows die AirPods Live Translation niet doet.",
        'cta_button': 'Download via Microsoft Store',
    },
}


def main():
    for locale, data in ART26.items():
        fp = os.path.join(ROOT, 'articles', locale, 'article-26.html')
        if os.path.exists(fp):
            print(f'  SKIP articles/{locale}/article-26.html (exists)')
            continue
        html = render(locale, data)
        with open(fp, 'w', encoding='utf-8') as f:
            f.write(html)
        print(f'  WROTE articles/{locale}/article-26.html')

    print(f'\nDone. article-26 generated for {len(ART26)} locales.')


if __name__ == '__main__':
    main()
