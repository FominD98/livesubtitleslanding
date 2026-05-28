"""Generate article-27 (Captions for Streamers: OBS, Twitch, YouTube Live workflow)
in all 16 locales. Author: Hiroshi Tanaka (Gaming Overlay Engineer).
Image: games.webp. Target: US 'captions for streamers' 5k/mo LOW.
"""
import os

ROOT = os.path.dirname(os.path.abspath(__file__))
ALL_LOCALES = ['en', 'ru', 'ja', 'zh', 'ko', 'ar', 'hi', 'de', 'es', 'fr', 'it', 'pl', 'pt', 'tr', 'uk', 'nl']
OG_LOCALES = {'en': 'en_US', 'ru': 'ru_RU', 'ja': 'ja_JP', 'zh': 'zh_CN', 'ko': 'ko_KR', 'ar': 'ar_SA',
              'hi': 'hi_IN', 'de': 'de_DE', 'es': 'es_ES', 'fr': 'fr_FR', 'it': 'it_IT', 'pl': 'pl_PL',
              'pt': 'pt_BR', 'tr': 'tr_TR', 'uk': 'uk_UA', 'nl': 'nl_NL'}

AUTHOR_NAME = 'Hiroshi Tanaka'
AUTHOR_URL = 'https://live-subtitles.com/about/team/hiroshi-tanaka.html'
AUTHOR_ROLES = {
    'en': 'Gaming Overlay Engineer, Live Subtitles',
    'ja': 'ゲーミングオーバーレイ エンジニア, Live Subtitles',
    'de': 'Gaming-Overlay-Engineer, Live Subtitles',
    'ru': 'инженер игровых оверлеев, Live Subtitles',
    'es': 'ingeniero de overlays de gaming, Live Subtitles',
    'fr': 'ingénieur overlays gaming, Live Subtitles',
    'it': 'ingegnere overlay gaming, Live Subtitles',
    'ko': '게이밍 오버레이 엔지니어, Live Subtitles',
    'zh': '游戏覆盖层工程师, Live Subtitles',
    'pl': 'inżynier nakładek gamingowych, Live Subtitles',
    'pt': 'engenheiro de overlays de games, Live Subtitles',
    'tr': 'oyun overlay mühendisi, Live Subtitles',
    'uk': 'інженер ігрових оверлеїв, Live Subtitles',
    'ar': 'مهندس واجهات الألعاب, Live Subtitles',
    'hi': 'गेमिंग ओवरले इंजीनियर, Live Subtitles',
    'nl': 'gaming overlay engineer, Live Subtitles',
}


def hreflang_block() -> str:
    lines = ['    <link rel="alternate" hreflang="x-default" href="https://live-subtitles.com/articles/en/article-27.html" />']
    for L in ALL_LOCALES:
        lines.append(f'    <link rel="alternate" hreflang="{L}" href="https://live-subtitles.com/articles/{L}/article-27.html" />')
    return '\n'.join(lines)


def render(locale: str, d: dict) -> str:
    dir_attr = ' dir="rtl"' if locale == 'ar' else ''
    og_locale = OG_LOCALES[locale]
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
    <link rel="canonical" href="https://live-subtitles.com/articles/{locale}/article-27.html" />
{hreflang_block()}
    <meta property="og:type" content="article">
    <meta property="og:title" content="{d['title']}">
    <meta property="og:description" content="{d['og_description']}">
    <meta property="og:url" content="https://live-subtitles.com/articles/{locale}/article-27.html">
    <meta property="og:image" content="https://live-subtitles.com/articles/img/{locale}/games.webp">
    <meta property="og:image:width" content="1280">
    <meta property="og:image:height" content="781">
    <meta property="og:image:alt" content="{d['image_alt']}">
    <meta property="og:locale" content="{og_locale}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="{d['title']}">
    <meta name="twitter:description" content="{d['twitter_description']}">
    <meta name="twitter:image" content="https://live-subtitles.com/articles/img/{locale}/games.webp">
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
      "mainEntityOfPage": "https://live-subtitles.com/articles/{locale}/article-27.html"
    }}
    </script>
    <script type="application/ld+json">
    {{
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {{ "@type": "ListItem", "position": 1, "name": "{d['home_label']}", "item": "https://live-subtitles.com/{locale}/" }},
        {{ "@type": "ListItem", "position": 2, "name": "{d['articles_label']}", "item": "https://live-subtitles.com/articles/{locale}/" }},
        {{ "@type": "ListItem", "position": 3, "name": "{d['breadcrumb_short']}", "item": "https://live-subtitles.com/articles/{locale}/article-27.html" }}
      ]
    }}
    </script>
    <link rel="preload" as="image" href="/articles/img/{locale}/games.webp">
</head>
<body>
    <div class="container article-container" itemscope itemtype="https://schema.org/Article">
        <a href="index.html" class="back-link">← {d['back_link']}</a>
        <h1 class="article-title" itemprop="headline">{d['title']}</h1>
        <div class="article-date" itemprop="datePublished" content="2026-05-28">{d['date_label']}</div>
        <div class="article-author" style="color:#aaa; font-size:0.95rem; margin-bottom:1.5rem;">{d['author_label']}: <a href="{AUTHOR_URL}" rel="author" style="color:#00b8ff; text-decoration:none;">{AUTHOR_NAME}</a> &middot; {AUTHOR_ROLES[locale]}</div>
        <div class="article-updated" itemprop="dateModified" content="2026-05-28" style="color:#888; font-size:0.9rem; margin-bottom:1.5rem;">{d['updated_label']}: {d['date_label']}</div>
        <img class="article-hero" src="/articles/img/{locale}/games.webp" alt="{d['image_alt']}" width="1280" height="781" loading="eager" decoding="async" fetchpriority="high" style="display:block; width:100%; height:auto; border-radius:8px; margin:0 0 1.5rem 0;">

        <div itemprop="articleBody">
            <p>{d['intro']}</p>

            <h2>{d['h2_1']}</h2>
            <p>{d['p_1']}</p>
            <ul>
                <li>{d['li_1a']}</li>
                <li>{d['li_1b']}</li>
                <li>{d['li_1c']}</li>
            </ul>

            <h2>{d['h2_2']}</h2>
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

            <h2>{d['h2_3']}</h2>
            <h3>{d['h3_1']}</h3>
            <p>{d['p_3a']}</p>
            <h3>{d['h3_2']}</h3>
            <p>{d['p_3b']}</p>
            <h3>{d['h3_3']}</h3>
            <p>{d['p_3c']}</p>

            <h2>{d['h2_4']}</h2>
            <ol>
                <li>{d['li_4a']}</li>
                <li>{d['li_4b']}</li>
                <li>{d['li_4c']}</li>
                <li>{d['li_4d']}</li>
            </ol>

            <h2>{d['h2_pitfalls']}</h2>
            <ul>
                <li>{d['pf_a']}</li>
                <li>{d['pf_b']}</li>
                <li>{d['pf_c']}</li>
            </ul>

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


# Common refs across all locales
REF1_URL = 'https://help.twitch.tv/s/article/closed-captions'
REF2_URL = 'https://obsproject.com/'
REF3_URL = 'https://support.google.com/youtube/answer/2734796'

ART27 = {
    'en': {
        'title': "Captions for Streamers in 2026: OBS, Twitch, YouTube Live Workflow",
        'description': "How to add live captions to your Twitch, YouTube Live, Kick, and Discord stream — using OBS overlay, native platform CC, and AI captioning tools without breaking your stream layout.",
        'keywords': "captions for streamers, twitch captions, youtube live captions, obs captions overlay, live caption streaming, stream subtitles 2026",
        'og_description': "Add live captions to your stream without breaking the layout — OBS overlay, native CC, AI captioning compared.",
        'image_alt': "Live captions overlaid on a Twitch streaming setup",
        'home_label': 'Home', 'articles_label': 'Articles',
        'breadcrumb_short': 'Captions for Streamers 2026',
        'back_link': 'Back to articles', 'date_label': 'May 28, 2026',
        'author_label': 'By', 'updated_label': 'Updated',
        'twitter_description': "Streamer captioning workflow: OBS, Twitch CC, AI tools compared.",
        'intro': "Live <strong>captions for streamers</strong> are a different problem from meeting captions. You have three audio sources (game, mic, system), three caption destinations (in-stream overlay, platform CC, post-VOD), and the worst possible failure mode: captions that lag and ruin your timing. Pick the wrong workflow and your stream layout breaks at the wrong moment.",
        'h2_1': 'Three audio sources, three caption destinations',
        'p_1': "Your captions can only be as good as the audio source they read. Start there:",
        'li_1a': "<strong>Mic-only captioning:</strong> reads your voice cleanly, ignores game audio. Best for talking-head streams (Just Chatting, IRL, podcasts). Lowest latency.",
        'li_1b': "<strong>System-audio captioning:</strong> reads game audio plus mic. Best for narrative games or watch parties where you want to caption everything happening on screen.",
        'li_1c': "<strong>Per-track captioning:</strong> OBS audio tracks separately routed to caption tool. Best for collab streams where you want to keep individual speakers identifiable.",
        'h2_2': '2026 streamer caption comparison',
        'th_1': 'Tool', 'th_2': 'Where captions appear', 'th_3': 'Strengths', 'th_4': 'Limits',
        't1c1': 'Twitch native Closed Captions', 't1c2': 'Twitch player only', 't1c3': "Built into Twitch, visible to viewers who toggle CC; works on mobile player", 't1c4': 'Requires CEA-608/708 caption stream; not all encoders support; limited language coverage',
        't2c1': 'YouTube Live automatic captions', 't2c2': 'YouTube player only', 't2c3': 'Free, auto-enabled for many languages, persists on VOD', 't2c4': 'Lag of 5–15 s; can drop during fast speech',
        't3c1': 'OBS overlay + AI caption source', 't3c2': 'Burned into your stream output', 't3c3': "Captions stay regardless of platform; same caption appears on every viewer's screen; full styling control", 't3c4': "Captions are permanent in the recording; viewers can't toggle off",
        't4c1': 'Live Subtitles (desktop overlay window)', 't4c2': 'On your screen and capturable by OBS', 't4c3': 'System-audio captioning + translation; captures game + voice; works across platforms', 't4c4': 'You must explicitly capture the window in OBS to share with viewers',
        'h2_3': 'How to choose by stream type',
        'h3_1': 'Just Chatting / IRL streamers',
        'p_3a': "Use mic-only captioning with an OBS overlay. Latency under 1.5 s and accuracy on your specific voice (after a few sessions of speech-profile warmup) is the differentiator. Twitch native CC is a fine fallback but you lose styling control.",
        'h3_2': 'Variety gaming streamers',
        'p_3b': "Run captions on system audio so game dialogue is captioned too. Lock the caption box to a corner that doesn't overlap your webcam frame. Test with at least three game genres before going live — game audio mix varies wildly between titles.",
        'h3_3': 'Multilingual / international audiences',
        'p_3c': "Use a desktop captioning layer that supports translation alongside the source language. Burn the bilingual captions into OBS so viewers in any region see them without toggling CC.",
        'h2_4': 'Pre-stream setup checklist (10 minutes)',
        'li_4a': 'Verify your microphone source and game audio source are on separate OBS tracks.',
        'li_4b': 'Configure caption tool to read either mic or system audio (depending on stream type).',
        'li_4c': 'Position the caption overlay in a fixed corner — never moving during stream.',
        'li_4d': 'Speak a 30-second test in your usual rhythm and check latency, accuracy, and overlap with HUD.',
        'h2_pitfalls': 'Common streamer captioning pitfalls',
        'pf_a': "<strong>Caption overlap with HUD:</strong> the second a clutch moment happens, your captions block the kill feed. Position captions outside the game HUD permanent zones.",
        'pf_b': "<strong>Latency drift over long streams:</strong> after 3+ hours, some AI captioners drift behind audio. Restart the caption tool every 2 hours during marathon streams.",
        'pf_c': "<strong>Mic-only setup capturing game audio:</strong> happens when your audio interface mixes back. Verify mic source is exclusive in OBS audio settings.",
        'h2_faq': 'FAQ',
        'q1': "Do Twitch viewers see captions automatically?", 'a1': "Only if your encoder sends CEA-608/708 captions AND viewers toggle CC in the player. Most streamers prefer OBS overlay so captions are always visible.",
        'q2': "Will captions hurt my stream's performance?", 'a2': "Captioning runs on your CPU or GPU. On modern systems the cost is under 5% CPU; on tight encoder budgets, use a smaller ASR model or offload to a second machine.",
        'q3': "Can I caption a stream in two languages at once?", 'a3': "Yes with a desktop captioning layer that supports source + target. Burn dual-language captions into OBS for global audiences.",
        'h2_refs': 'References',
        'ref1_url': REF1_URL, 'ref1_label': 'Twitch — Closed Captions documentation',
        'ref2_url': REF2_URL, 'ref2_label': 'OBS Studio official',
        'ref3_url': REF3_URL, 'ref3_label': 'YouTube Help — automatic captions',
        'related_label': 'Related reading',
        'related': [('25', 'Live Captions in 2026: How AI-Generated Captions Work and When to Use Them'), ('24', 'Transcribe Audio to Text in 2026: Real-Time vs Batch Transcription Compared'), ('23', 'Voice Translation Apps in 2026: Real-Time Tools Compared by Use Case')],
        'cta_title': 'Stream captions that capture game audio AND your voice',
        'cta_body': "System-audio captioning plus real-time translation for streamers — capture in OBS and ship a captioned stream in minutes.",
        'cta_button': 'Download from Microsoft Store',
    },
    'ja': {
        'title': "配信者向けライブ字幕 2026年版：OBS・Twitch・YouTube Live ワークフロー",
        'description': "Twitch、YouTube Live、Kick、Discord配信にライブ字幕を追加する方法 — OBS オーバーレイ、ネイティブ プラットフォーム CC、AI 字幕ツールを使って、配信レイアウトを崩さずに。",
        'keywords': "配信者 字幕, twitch 字幕, youtube live 字幕, obs 字幕 オーバーレイ, ライブ字幕 配信, 配信 サブタイトル 2026",
        'og_description': "レイアウトを崩さず配信に字幕を追加 — OBS オーバーレイ、ネイティブ CC、AI 字幕を比較。",
        'image_alt': "Twitch 配信セットアップに重ねられたライブ字幕",
        'home_label': 'ホーム', 'articles_label': '記事一覧',
        'breadcrumb_short': '配信者向けライブ字幕 2026',
        'back_link': '記事一覧へ戻る', 'date_label': '2026年5月28日',
        'author_label': '著者', 'updated_label': '更新日',
        'twitter_description': "配信者の字幕ワークフロー：OBS、Twitch CC、AI ツールを比較。",
        'intro': "<strong>配信者向けライブ字幕</strong>は、会議の字幕とは別の問題です。3つの音源(ゲーム・マイク・システム)、3つの字幕出力先(配信内オーバーレイ・プラットフォーム CC・VOD)、そして最悪の失敗パターン:遅延でタイミングを崩す字幕、があります。間違ったワークフローを選ぶと、肝心な瞬間にレイアウトが崩れます。",
        'h2_1': '3つの音源、3つの字幕出力先',
        'p_1': "字幕の質は、読み取る音源の質を超えません。まずそこから:",
        'li_1a': "<strong>マイクのみの字幕:</strong> 自分の声をクリアに読み、ゲーム音は無視。トーキングヘッド配信(雑談、IRL、ポッドキャスト)に最適。最低レイテンシ。",
        'li_1b': "<strong>システム音声の字幕:</strong> ゲーム音とマイクの両方を読みます。ナラティブゲームや視聴会で、画面で起きるすべてを字幕化したいときに最適。",
        'li_1c': "<strong>トラック別の字幕:</strong> OBS の音声トラックを字幕ツールに個別ルート。コラボ配信で個別の話者を識別できる状態を保ちたいときに最適。",
        'h2_2': '2026年の配信者字幕比較',
        'th_1': 'ツール', 'th_2': '字幕の表示先', 'th_3': '強み', 'th_4': '制約',
        't1c1': 'Twitch ネイティブ クローズドキャプション', 't1c2': 'Twitch プレイヤーのみ', 't1c3': "Twitch 内蔵、CC をオンにした視聴者が見られる、モバイルプレイヤー対応", 't1c4': 'CEA-608/708 字幕ストリームが必要、すべてのエンコーダで対応しない、対応言語が限定的',
        't2c1': 'YouTube Live 自動字幕', 't2c2': 'YouTube プレイヤーのみ', 't2c3': '無料、多言語で自動有効、VOD でも持続', 't2c4': '5〜15 秒の遅延、早口でドロップ',
        't3c1': 'OBS オーバーレイ + AI 字幕ソース', 't3c2': '配信出力に焼き込み', 't3c3': "プラットフォームに依存しない、全視聴者が同じ字幕を見る、スタイリングを完全制御", 't3c4': "録画では永続、視聴者がオフにできない",
        't4c1': 'Live Subtitles(デスクトップ オーバーレイ)', 't4c2': '画面上、OBS でキャプチャ可能', 't4c3': 'システム音声字幕 + 翻訳、ゲーム + 音声を捕捉、プラットフォーム横断', 't4c4': "OBS で明示的にウィンドウをキャプチャする必要がある",
        'h2_3': '配信タイプ別の選び方',
        'h3_1': '雑談/IRL 配信者',
        'p_3a': "OBS オーバーレイでマイクのみ字幕を使います。レイテンシ 1.5 秒未満と、自分の声に対する精度(数セッションのプロファイル準備後)が決定要因です。Twitch ネイティブ CC は問題ないフォールバックですが、スタイリング制御を失います。",
        'h3_2': '多ジャンル ゲーム配信者',
        'p_3b': "システム音声で字幕を実行し、ゲームのセリフも字幕化。字幕ボックスをウェブカム枠と重ならない角に固定。配信前に少なくとも 3 ジャンルでテスト — ゲーム音声ミックスはタイトルによって大きく異なります。",
        'h3_3': '多言語/国際視聴者向け配信者',
        'p_3c': "ソース言語と翻訳の両方をサポートするデスクトップ字幕レイヤを使用。二言語字幕を OBS に焼き込み、CC をオンにせずどの地域の視聴者にも見えるようにします。",
        'h2_4': '配信前セットアップ チェックリスト(10 分)',
        'li_4a': 'マイク音源とゲーム音源が別の OBS トラックにあることを確認。',
        'li_4b': '字幕ツールをマイクまたはシステム音声どちらかに設定(配信タイプ次第)。',
        'li_4c': '字幕オーバーレイを固定の角に配置 — 配信中は絶対に動かさない。',
        'li_4d': '通常のリズムで 30 秒テスト発話、レイテンシ、精度、HUD との重なりを確認。',
        'h2_pitfalls': '配信者の字幕でよくある落とし穴',
        'pf_a': "<strong>HUD との字幕重なり:</strong> 肝心な瞬間に字幕がキルフィードを隠す。ゲーム HUD の恒久ゾーン外に字幕を置きましょう。",
        'pf_b': "<strong>長時間配信でのレイテンシ ドリフト:</strong> 3 時間以上経つと、一部の AI 字幕ツールが音声に遅れます。マラソン配信中は 2 時間ごとに字幕ツールを再起動。",
        'pf_c': "<strong>マイクのみセットアップでゲーム音まで拾う:</strong> オーディオ インターフェースのミックスバックで起きます。OBS の音声設定でマイク ソースが排他的か確認。",
        'h2_faq': 'よくある質問',
        'q1': "Twitch 視聴者は字幕を自動で見られますか？", 'a1': "エンコーダが CEA-608/708 字幕を送り、視聴者がプレイヤーで CC をオンにした場合のみ。多くの配信者は字幕を常時表示できる OBS オーバーレイを好みます。",
        'q2': "字幕は配信パフォーマンスに影響しますか？", 'a2': "字幕処理は CPU か GPU を使います。最新システムでは 5% 未満。エンコーダ予算がタイトな場合は、より小さい ASR モデルか別マシンへオフロード。",
        'q3': "配信を 2 言語で同時に字幕化できますか？", 'a3': "はい、ソース + ターゲット対応のデスクトップ字幕レイヤがあれば。OBS に二言語字幕を焼き込んでグローバル視聴者に届けます。",
        'h2_refs': '参考資料',
        'ref1_url': REF1_URL, 'ref1_label': 'Twitch — クローズドキャプション ドキュメント',
        'ref2_url': REF2_URL, 'ref2_label': 'OBS Studio 公式',
        'ref3_url': REF3_URL, 'ref3_label': 'YouTube ヘルプ — 自動字幕',
        'related_label': '関連記事',
        'related': [('25', 'ライブ字幕 2026年版：AI字幕の仕組みと使いどころ'), ('24', '音声を文字起こしする 2026年版：リアルタイム vs バッチ徹底比較'), ('23', '音声翻訳アプリ 2026年版：用途別リアルタイム比較')],
        'cta_title': 'ゲーム音声と自分の声の両方を捉える配信字幕',
        'cta_body': "配信者向けシステム音声字幕とリアルタイム翻訳 — OBS でキャプチャして数分で字幕付き配信を開始。",
        'cta_button': 'Microsoft Storeからダウンロード',
    },
    'de': {
        'title': "Untertitel für Streamer 2026: OBS-, Twitch-, YouTube-Live-Workflow",
        'description': "So fügen Sie Live-Untertitel zu Twitch, YouTube Live, Kick und Discord-Streams hinzu — mit OBS-Overlay, nativen Plattform-CCs und KI-Untertitelungs-Tools, ohne das Stream-Layout zu zerstören.",
        'keywords': "untertitel für streamer, twitch untertitel, youtube live untertitel, obs untertitel overlay, live caption streaming, stream untertitel 2026",
        'og_description': "Live-Untertitel zu Ihrem Stream hinzufügen, ohne das Layout zu zerstören — OBS-Overlay, native CC und KI-Untertitelung im Vergleich.",
        'image_alt': "Live-Untertitel über einem Twitch-Streaming-Setup",
        'home_label': 'Startseite', 'articles_label': 'Artikel',
        'breadcrumb_short': 'Untertitel für Streamer 2026',
        'back_link': 'Zurück zu Artikeln', 'date_label': '28. Mai 2026',
        'author_label': 'Autor', 'updated_label': 'Aktualisiert',
        'twitter_description': "Untertitel-Workflow für Streamer: OBS, Twitch CC, KI-Tools im Vergleich.",
        'intro': "<strong>Untertitel für Streamer</strong> sind ein anderes Problem als Meeting-Untertitel. Sie haben drei Audioquellen (Game, Mikro, System), drei Untertitel-Zielorte (Stream-Overlay, Plattform-CC, Post-VOD) und den schlimmsten Ausfallmodus: Untertitel, die hinterherhinken und Ihr Timing ruinieren. Falsche Wahl, und Ihr Layout zerbricht im falschen Moment.",
        'h2_1': 'Drei Audioquellen, drei Untertitel-Zielorte',
        'p_1': "Ihre Untertitel sind nur so gut wie die Audioquelle, die sie lesen. Hier beginnen:",
        'li_1a': "<strong>Nur-Mikro-Untertitelung:</strong> liest Ihre Stimme sauber, ignoriert Game-Audio. Am besten für Talking-Head-Streams (Just Chatting, IRL, Podcasts). Niedrigste Latenz.",
        'li_1b': "<strong>System-Audio-Untertitelung:</strong> liest Game-Audio plus Mikro. Am besten für narrative Spiele oder Watch Partys, in denen Sie alles auf dem Bildschirm untertiteln möchten.",
        'li_1c': "<strong>Per-Track-Untertitelung:</strong> OBS-Audiotracks separat an das Untertitel-Tool routen. Am besten für Collab-Streams, wo Sie einzelne Sprecher unterscheidbar halten möchten.",
        'h2_2': 'Streamer-Untertitel-Vergleich 2026',
        'th_1': 'Tool', 'th_2': 'Wo Untertitel erscheinen', 'th_3': 'Stärken', 'th_4': 'Grenzen',
        't1c1': 'Twitch native Closed Captions', 't1c2': 'Nur Twitch-Player', 't1c3': "In Twitch integriert, sichtbar für Zuschauer, die CC umschalten; funktioniert im Mobile-Player", 't1c4': 'Erfordert CEA-608/708-Untertitelstream; nicht alle Encoder unterstützen; begrenzte Sprachabdeckung',
        't2c1': 'YouTube Live automatische Untertitel', 't2c2': 'Nur YouTube-Player', 't2c3': 'Kostenlos, für viele Sprachen automatisch aktiviert, bleibt im VOD', 't2c4': 'Latenz von 5–15 s; kann bei schneller Sprache abbrechen',
        't3c1': 'OBS-Overlay + KI-Untertitel-Quelle', 't3c2': 'In Stream-Output eingebrannt', 't3c3': "Untertitel bleiben unabhängig von der Plattform; jeder Zuschauer sieht denselben Untertitel; volle Styling-Kontrolle", 't3c4': "Untertitel sind dauerhaft in der Aufzeichnung; Zuschauer können sie nicht abschalten",
        't4c1': 'Live Subtitles (Desktop-Overlay-Fenster)', 't4c2': 'Auf Ihrem Bildschirm und in OBS erfassbar', 't4c3': 'System-Audio-Untertitelung + Übersetzung; erfasst Game + Stimme; über Plattformen hinweg', 't4c4': "Sie müssen das Fenster explizit in OBS erfassen, um es Zuschauern zu zeigen",
        'h2_3': 'Auswahl nach Stream-Typ',
        'h3_1': 'Just Chatting / IRL Streamer',
        'p_3a': "Nutzen Sie Nur-Mikro-Untertitelung mit OBS-Overlay. Latenz unter 1,5 s und Genauigkeit auf Ihrer spezifischen Stimme (nach einigen Aufwärmsitzungen mit Sprachprofil) sind der Unterschied. Twitch-natives CC ist ein ordentlicher Fallback, aber Sie verlieren Styling-Kontrolle.",
        'h3_2': 'Vielfältige Gaming-Streamer',
        'p_3b': "Lassen Sie Untertitel auf System-Audio laufen, damit Game-Dialoge mit-untertitelt werden. Verriegeln Sie die Untertitel-Box in eine Ecke, die nicht mit Ihrem Webcam-Frame überlappt. Mindestens drei Game-Genres vor dem Live-Gang testen — der Audio-Mix variiert stark zwischen Titeln.",
        'h3_3': 'Mehrsprachige / internationale Zielgruppen',
        'p_3c': "Nutzen Sie einen Desktop-Untertitel-Layer, der Übersetzung neben der Quellsprache unterstützt. Brennen Sie die zweisprachigen Untertitel in OBS ein, damit Zuschauer aus jeder Region sie ohne CC-Toggle sehen.",
        'h2_4': 'Pre-Stream-Setup-Checkliste (10 Minuten)',
        'li_4a': 'Mikrofonquelle und Game-Audioquelle sind auf getrennten OBS-Tracks — verifizieren.',
        'li_4b': 'Untertitel-Tool auf Mikro oder System-Audio konfigurieren (je nach Stream-Typ).',
        'li_4c': 'Untertitel-Overlay in fester Ecke positionieren — während des Streams niemals bewegen.',
        'li_4d': '30-Sekunden-Test in gewohntem Rhythmus, Latenz, Genauigkeit und HUD-Überlappung prüfen.',
        'h2_pitfalls': 'Häufige Streamer-Untertitel-Fallen',
        'pf_a': "<strong>Untertitel-Überlappung mit HUD:</strong> in dem Moment, in dem ein Clutch passiert, blockieren Ihre Untertitel den Kill-Feed. Untertitel außerhalb fester HUD-Zonen platzieren.",
        'pf_b': "<strong>Latenz-Drift über lange Streams:</strong> nach 3+ Stunden geraten manche KI-Untertitler hinter das Audio. Untertitel-Tool alle 2 Stunden bei Marathon-Streams neu starten.",
        'pf_c': "<strong>Nur-Mikro-Setup erfasst Game-Audio:</strong> passiert, wenn Ihr Audio-Interface zurückmischt. Mikro-Quelle in OBS-Audio-Einstellungen exklusiv prüfen.",
        'h2_faq': 'FAQ',
        'q1': "Sehen Twitch-Zuschauer Untertitel automatisch?", 'a1': "Nur wenn Ihr Encoder CEA-608/708-Untertitel sendet UND Zuschauer CC im Player umschalten. Die meisten Streamer bevorzugen OBS-Overlay, damit Untertitel immer sichtbar sind.",
        'q2': "Beeinträchtigen Untertitel meine Stream-Performance?", 'a2': "Untertitelung läuft auf Ihrer CPU oder GPU. Auf modernen Systemen unter 5 % CPU; bei engem Encoder-Budget kleineres ASR-Modell oder Auslagerung auf eine zweite Maschine.",
        'q3': "Kann ich einen Stream in zwei Sprachen gleichzeitig untertiteln?", 'a3': "Ja mit einem Desktop-Untertitel-Layer, der Quelle + Ziel unterstützt. Zweisprachige Untertitel in OBS einbrennen für globale Zielgruppen.",
        'h2_refs': 'Quellen',
        'ref1_url': REF1_URL, 'ref1_label': 'Twitch — Closed-Captions-Dokumentation',
        'ref2_url': REF2_URL, 'ref2_label': 'OBS Studio offiziell',
        'ref3_url': REF3_URL, 'ref3_label': 'YouTube-Hilfe — automatische Untertitel',
        'related_label': 'Weiterführende Artikel',
        'related': [('25', 'Live-Untertitel 2026: Wie KI-Untertitel funktionieren und wann sie einzusetzen sind'), ('24', 'Audio in Text umwandeln 2026: Echtzeit- vs Batch-Transkription im Vergleich'), ('23', 'Sprachübersetzung-Apps 2026: Echtzeit-Tools nach Anwendungsfall verglichen')],
        'cta_title': 'Stream-Untertitel, die Game-Audio UND Ihre Stimme erfassen',
        'cta_body': "System-Audio-Untertitelung plus Echtzeit-Übersetzung für Streamer — in OBS erfassen und in Minuten einen untertitelten Stream ausspielen.",
        'cta_button': 'Aus dem Microsoft Store herunterladen',
    },
    'ru': {
        'title': "Субтитры для стримеров в 2026: OBS, Twitch, YouTube Live workflow",
        'description': "Как добавить живые субтитры к стримам Twitch, YouTube Live, Kick и Discord — через OBS оверлей, нативный CC платформы и AI-инструменты субтитров, не ломая раскладку стрима.",
        'keywords': "субтитры для стримеров, twitch субтитры, youtube live субтитры, obs субтитры оверлей, лайв субтитры стрим, стрим субтитры 2026",
        'og_description': "Добавляй живые субтитры в стрим без поломки раскладки — сравнение OBS оверлея, нативного CC и AI-субтитров.",
        'image_alt': "Живые субтитры поверх Twitch-стрима",
        'home_label': 'Главная', 'articles_label': 'Статьи',
        'breadcrumb_short': 'Субтитры для стримеров 2026',
        'back_link': 'Назад к статьям', 'date_label': '28 мая 2026',
        'author_label': 'Автор', 'updated_label': 'Обновлено',
        'twitter_description': "Стримерский workflow субтитров: OBS, Twitch CC, AI-инструменты в сравнении.",
        'intro': "<strong>Субтитры для стримеров</strong> — это не та же задача что субтитры на встречах. У тебя три источника аудио (игра, микрофон, система), три места вывода субтитров (оверлей в стриме, CC платформы, пост-VOD) и худший возможный fail: лагающие субтитры, ломающие тайминг. Не тот workflow — и раскладка рассыпается в самый плохой момент.",
        'h2_1': 'Три источника аудио, три места вывода субтитров',
        'p_1': "Качество субтитров не выше качества источника аудио. Начни оттуда:",
        'li_1a': "<strong>Только-микрофон субтитры:</strong> читают твой голос чисто, игнорируют игровой звук. Лучше всего для talking-head стримов (Just Chatting, IRL, подкасты). Наименьшая латентность.",
        'li_1b': "<strong>Системное аудио субтитры:</strong> читают игровой звук + микрофон. Лучше для сюжетных игр или watch-party, где нужно субтитрировать всё происходящее на экране.",
        'li_1c': "<strong>Потрековые субтитры:</strong> аудио-треки OBS раздельно роутятся в инструмент субтитров. Лучше для коллаб-стримов, где важна идентификация говорящих.",
        'h2_2': 'Сравнение стримерских субтитров 2026',
        'th_1': 'Инструмент', 'th_2': 'Где появляются субтитры', 'th_3': 'Сильные стороны', 'th_4': 'Ограничения',
        't1c1': 'Twitch нативные Closed Captions', 't1c2': 'Только плеер Twitch', 't1c3': "Встроены в Twitch, видны включившим CC; работают в мобильном плеере", 't1c4': 'Нужен CEA-608/708 поток субтитров; не все энкодеры поддерживают; ограниченное покрытие языков',
        't2c1': 'YouTube Live автоматические субтитры', 't2c2': 'Только плеер YouTube', 't2c3': 'Бесплатно, авто-включение для многих языков, остаются на VOD', 't2c4': 'Лаг 5–15 с; могут дропать при быстрой речи',
        't3c1': 'OBS оверлей + AI источник субтитров', 't3c2': 'Запечены в выход стрима', 't3c3': "Субтитры стабильны независимо от платформы; одни и те же субтитры на экране каждого зрителя; полный контроль стайлинга", 't3c4': "Субтитры постоянны в записи; зрители не могут выключить",
        't4c1': 'Live Subtitles (десктоп оверлей-окно)', 't4c2': 'На твоём экране, захват в OBS', 't4c3': 'Субтитры системного аудио + перевод; ловит игру + голос; кросс-платформенно', 't4c4': "Нужно явно захватить окно в OBS, чтобы показать зрителям",
        'h2_3': 'Как выбирать по типу стрима',
        'h3_1': 'Just Chatting / IRL стримеры',
        'p_3a': "Используй только-микрофон субтитры с OBS оверлеем. Латентность до 1.5 с и точность на твоём конкретном голосе (после нескольких сессий разогрева голосового профиля) — это дифференциатор. Twitch нативный CC — нормальный фолбэк, но теряешь контроль стайлинга.",
        'h3_2': 'Стримеры разных игр',
        'p_3b': "Запускай субтитры по системному аудио, чтобы игровые диалоги тоже субтитрировались. Зафиксируй бокс субтитров в угол, не пересекающийся с рамкой вебки. Тестируй минимум 3 жанра игр до выхода в эфир — игровой микс сильно отличается между тайтлами.",
        'h3_3': 'Многоязычная / международная аудитория',
        'p_3c': "Используй десктопный слой субтитров, который поддерживает перевод рядом с исходным языком. Запекай двуязычные субтитры в OBS, чтобы зрители любого региона их видели без переключения CC.",
        'h2_4': 'Пре-стрим чек-лист настройки (10 минут)',
        'li_4a': 'Проверь, что источник микрофона и игровое аудио на разных треках OBS.',
        'li_4b': 'Сконфигурируй инструмент субтитров на чтение либо микрофона, либо системного аудио (по типу стрима).',
        'li_4c': 'Размести оверлей субтитров в фиксированном углу — никогда не двигай во время стрима.',
        'li_4d': 'Скажи 30 секунд теста в своём обычном ритме и проверь латентность, точность и пересечение с HUD.',
        'h2_pitfalls': 'Частые ловушки субтитров у стримеров',
        'pf_a': "<strong>Пересечение субтитров с HUD:</strong> в момент клатча субтитры закрывают киллфид. Помещай субтитры вне постоянных зон HUD игры.",
        'pf_b': "<strong>Дрейф латентности на долгих стримах:</strong> через 3+ часов некоторые AI-субтитры отстают. На марафонских стримах перезапускай инструмент каждые 2 часа.",
        'pf_c': "<strong>Микро-онли сетап ловит игровое аудио:</strong> случается при mix-back на аудио-интерфейсе. Проверь эксклюзивность источника микрофона в аудио-настройках OBS.",
        'h2_faq': 'Часто задаваемые вопросы',
        'q1': "Видят ли Twitch-зрители субтитры автоматически?", 'a1': "Только если твой энкодер шлёт CEA-608/708 субтитры И зрители включают CC в плеере. Большинство стримеров предпочитают OBS оверлей, чтобы субтитры всегда были видны.",
        'q2': "Снизят ли субтитры производительность стрима?", 'a2': "Субтитрирование грузит CPU или GPU. На современных системах меньше 5% CPU; на туго бюджете энкодера — меньше модель ASR или вынеси на вторую машину.",
        'q3': "Можно ли субтитрировать стрим сразу на двух языках?", 'a3': "Да, с десктопным слоем субтитров, поддерживающим источник + цель. Запекай двуязычные субтитры в OBS для мировой аудитории.",
        'h2_refs': 'Источники',
        'ref1_url': REF1_URL, 'ref1_label': 'Twitch — документация Closed Captions',
        'ref2_url': REF2_URL, 'ref2_label': 'OBS Studio официально',
        'ref3_url': REF3_URL, 'ref3_label': 'YouTube Help — автоматические субтитры',
        'related_label': 'Похожие материалы',
        'related': [('25', 'Живые субтитры 2026: как работают AI-субтитры и когда их использовать'), ('24', 'Транскрибация аудио в текст 2026: реал-тайм vs батч-транскрипция'), ('23', 'Голосовой переводчик в 2026 году: реал-тайм инструменты по сценариям')],
        'cta_title': 'Субтитры стрима, ловящие и игровой звук, И твой голос',
        'cta_body': "Системные субтитры + реал-тайм перевод для стримеров — захватывай в OBS и выпускай стрим с субтитрами за минуты.",
        'cta_button': 'Скачать из Microsoft Store',
    },
    'es': {
        'title': "Subtítulos para streamers en 2026: workflow de OBS, Twitch, YouTube Live",
        'description': "Cómo añadir subtítulos en vivo a tu stream de Twitch, YouTube Live, Kick y Discord — usando overlay de OBS, CC nativo de la plataforma y herramientas de subtitulado IA sin romper tu layout de stream.",
        'keywords': "subtítulos para streamers, subtítulos twitch, subtítulos youtube live, overlay subtítulos obs, subtítulos en vivo stream, stream subtítulos 2026",
        'og_description': "Añade subtítulos en vivo a tu stream sin romper el layout — comparación de overlay OBS, CC nativo y subtitulado IA.",
        'image_alt': "Subtítulos en vivo superpuestos a una configuración de stream en Twitch",
        'home_label': 'Inicio', 'articles_label': 'Artículos',
        'breadcrumb_short': 'Subtítulos para streamers 2026',
        'back_link': 'Volver a artículos', 'date_label': '28 de mayo de 2026',
        'author_label': 'Autor', 'updated_label': 'Actualizado',
        'twitter_description': "Workflow de subtitulado para streamers: OBS, Twitch CC, herramientas IA comparadas.",
        'intro': "Los <strong>subtítulos para streamers</strong> son un problema diferente al de los subtítulos de reuniones. Tienes tres fuentes de audio (juego, micro, sistema), tres destinos de subtítulos (overlay en stream, CC de plataforma, post-VOD) y el peor modo de fallo posible: subtítulos que se retrasan y arruinan tu timing. Workflow equivocado y tu layout se rompe en el peor momento.",
        'h2_1': 'Tres fuentes de audio, tres destinos de subtítulos',
        'p_1': "Tus subtítulos solo son tan buenos como la fuente de audio que leen. Empieza ahí:",
        'li_1a': "<strong>Subtítulos solo-micro:</strong> leen tu voz limpia, ignoran audio del juego. Mejor para streams de cabeza parlante (Just Chatting, IRL, podcasts). Mínima latencia.",
        'li_1b': "<strong>Subtítulos de audio del sistema:</strong> leen audio del juego más micro. Mejor para juegos narrativos o watch parties donde quieres subtitular todo lo que pasa en pantalla.",
        'li_1c': "<strong>Subtítulos por pista:</strong> pistas de audio de OBS enrutadas por separado al subtitulador. Mejor para streams colaborativos donde quieres mantener identificables a los oradores.",
        'h2_2': 'Comparativa de subtítulos para streamers 2026',
        'th_1': 'Herramienta', 'th_2': 'Dónde aparecen los subtítulos', 'th_3': 'Fortalezas', 'th_4': 'Límites',
        't1c1': 'Twitch Closed Captions nativos', 't1c2': 'Solo reproductor Twitch', 't1c3': "Integrado en Twitch, visible para espectadores que activan CC; funciona en móvil", 't1c4': 'Requiere stream CEA-608/708; no todos los encoders soportan; cobertura de idiomas limitada',
        't2c1': 'Subtítulos automáticos de YouTube Live', 't2c2': 'Solo reproductor YouTube', 't2c3': 'Gratis, autoactivados en muchos idiomas, persisten en VOD', 't2c4': 'Latencia de 5–15 s; pueden caerse con habla rápida',
        't3c1': 'Overlay OBS + fuente de subtítulos IA', 't3c2': 'Quemados en la salida del stream', 't3c3': "Subtítulos persisten independientemente de la plataforma; mismo subtítulo en pantalla de cada espectador; control total de estilo", 't3c4': "Subtítulos permanentes en la grabación; el espectador no puede desactivarlos",
        't4c1': 'Live Subtitles (ventana overlay de escritorio)', 't4c2': 'En tu pantalla, capturable por OBS', 't4c3': 'Subtítulos de audio del sistema + traducción; captura juego + voz; entre plataformas', 't4c4': "Debes capturar la ventana explícitamente en OBS para compartirla",
        'h2_3': 'Cómo elegir por tipo de stream',
        'h3_1': 'Streamers Just Chatting / IRL',
        'p_3a': "Usa subtitulado solo-micro con overlay OBS. Latencia bajo 1,5 s y precisión sobre tu voz específica (tras unas sesiones de calentamiento de perfil) son el diferencial. El CC nativo de Twitch es un fallback decente pero pierdes control de estilo.",
        'h3_2': 'Streamers de variedad gaming',
        'p_3b': "Ejecuta subtítulos sobre audio del sistema para que el diálogo del juego también se subtitule. Bloquea la caja de subtítulos en una esquina que no solape con el marco de la webcam. Prueba al menos tres géneros antes de salir en vivo — el audio mix de los juegos varía mucho.",
        'h3_3': 'Audiencias multilingües / internacionales',
        'p_3c': "Usa una capa de subtitulado de escritorio que soporte traducción junto al idioma fuente. Quema los subtítulos bilingües en OBS para que espectadores de cualquier región los vean sin alternar CC.",
        'h2_4': 'Lista de configuración pre-stream (10 minutos)',
        'li_4a': 'Verifica que el micrófono y el audio del juego están en pistas OBS separadas.',
        'li_4b': 'Configura el subtitulador para leer micro o audio del sistema (según tipo de stream).',
        'li_4c': 'Posiciona el overlay de subtítulos en esquina fija — nunca lo muevas durante el stream.',
        'li_4d': 'Habla 30 segundos de prueba en tu ritmo habitual y revisa latencia, precisión y solapamiento con HUD.',
        'h2_pitfalls': 'Trampas comunes de subtitulado para streamers',
        'pf_a': "<strong>Solapamiento con HUD:</strong> en el momento decisivo, los subtítulos bloquean el kill feed. Coloca subtítulos fuera de zonas permanentes del HUD del juego.",
        'pf_b': "<strong>Deriva de latencia en streams largos:</strong> tras 3+ horas, algunos subtituladores IA se retrasan. Reinicia la herramienta cada 2 horas en streams maratón.",
        'pf_c': "<strong>Setup solo-micro capturando audio del juego:</strong> pasa con mix-back de la interfaz. Verifica que la fuente del micro sea exclusiva en ajustes de audio de OBS.",
        'h2_faq': 'Preguntas frecuentes',
        'q1': "¿Los espectadores de Twitch ven subtítulos automáticamente?", 'a1': "Solo si tu encoder envía subtítulos CEA-608/708 Y los espectadores activan CC en el reproductor. La mayoría prefiere overlay OBS para que siempre se vean.",
        'q2': "¿Los subtítulos perjudican el rendimiento del stream?", 'a2': "El subtitulado corre en CPU o GPU. En sistemas modernos, bajo 5% de CPU; con presupuesto de encoder ajustado, usa un modelo ASR más pequeño u offload a otra máquina.",
        'q3': "¿Puedo subtitular un stream en dos idiomas a la vez?", 'a3': "Sí con una capa de escritorio que soporte fuente + objetivo. Quema subtítulos bilingües en OBS para audiencias globales.",
        'h2_refs': 'Referencias',
        'ref1_url': REF1_URL, 'ref1_label': 'Twitch — documentación de Closed Captions',
        'ref2_url': REF2_URL, 'ref2_label': 'OBS Studio oficial',
        'ref3_url': REF3_URL, 'ref3_label': 'Ayuda YouTube — subtítulos automáticos',
        'related_label': 'Lectura relacionada',
        'related': [('25', 'Subtítulos en vivo 2026: cómo funcionan los subtítulos con IA y cuándo usarlos'), ('24', 'Transcribir audio a texto 2026: transcripción en tiempo real vs por lotes'), ('23', 'Traductor de voz en 2026: herramientas en tiempo real comparadas por caso de uso')],
        'cta_title': 'Subtítulos de stream que capturan el audio del juego Y tu voz',
        'cta_body': "Subtitulado de audio del sistema más traducción en tiempo real para streamers — captura en OBS y lanza un stream subtitulado en minutos.",
        'cta_button': 'Descargar de Microsoft Store',
    },
    'fr': {
        'title': "Sous-titres pour streamers en 2026 : workflow OBS, Twitch, YouTube Live",
        'description': "Comment ajouter des sous-titres en direct à votre stream Twitch, YouTube Live, Kick et Discord — avec overlay OBS, CC natifs de plateforme et outils de sous-titrage IA sans casser votre mise en page.",
        'keywords': "sous-titres streamers, sous-titres twitch, sous-titres youtube live, overlay sous-titres obs, sous-titres en direct stream, stream sous-titres 2026",
        'og_description': "Ajoutez des sous-titres en direct sans casser la mise en page — overlay OBS, CC natif et sous-titrage IA comparés.",
        'image_alt': "Sous-titres en direct superposés à une configuration de stream Twitch",
        'home_label': 'Accueil', 'articles_label': 'Articles',
        'breadcrumb_short': 'Sous-titres pour streamers 2026',
        'back_link': 'Retour aux articles', 'date_label': '28 mai 2026',
        'author_label': 'Auteur', 'updated_label': 'Mis à jour',
        'twitter_description': "Workflow de sous-titrage pour streamers : OBS, Twitch CC, outils IA comparés.",
        'intro': "Les <strong>sous-titres pour streamers</strong> sont un problème différent de ceux des réunions. Vous avez trois sources audio (jeu, micro, système), trois destinations (overlay stream, CC plateforme, post-VOD) et le pire mode de défaillance : sous-titres qui traînent et ruinent votre timing. Mauvais workflow, et votre mise en page se casse au pire moment.",
        'h2_1': 'Trois sources audio, trois destinations de sous-titres',
        'p_1': "Vos sous-titres ne valent que la source audio qu'ils lisent. Commencez là :",
        'li_1a': "<strong>Sous-titrage micro seul :</strong> lit votre voix proprement, ignore l'audio du jeu. Idéal pour streams talking-head (Just Chatting, IRL, podcasts). Latence la plus basse.",
        'li_1b': "<strong>Sous-titrage audio système :</strong> lit l'audio du jeu plus le micro. Idéal pour jeux narratifs ou watch parties où vous voulez tout sous-titrer.",
        'li_1c': "<strong>Sous-titrage par piste :</strong> pistes audio OBS routées séparément vers l'outil. Idéal pour streams collab où vous voulez garder les locuteurs identifiables.",
        'h2_2': 'Comparatif sous-titres pour streamers 2026',
        'th_1': 'Outil', 'th_2': 'Où apparaissent les sous-titres', 'th_3': 'Forces', 'th_4': 'Limites',
        't1c1': 'Twitch Closed Captions natifs', 't1c2': 'Player Twitch uniquement', 't1c3': "Intégré à Twitch, visible aux spectateurs qui activent CC ; fonctionne sur mobile", 't1c4': 'Nécessite un flux CEA-608/708 ; pas tous les encodeurs supportent ; couverture linguistique limitée',
        't2c1': 'Sous-titres automatiques YouTube Live', 't2c2': 'Player YouTube uniquement', 't2c3': 'Gratuit, auto-activé dans plusieurs langues, persiste sur VOD', 't2c4': 'Latence 5–15 s ; peut décrocher en parole rapide',
        't3c1': 'Overlay OBS + source de sous-titres IA', 't3c2': 'Gravés dans la sortie stream', 't3c3': "Sous-titres restent quelle que soit la plateforme ; même sous-titre pour chaque spectateur ; contrôle total du style", 't3c4': "Sous-titres permanents dans l'enregistrement ; spectateur ne peut pas désactiver",
        't4c1': 'Live Subtitles (fenêtre overlay bureau)', 't4c2': 'Sur votre écran, capturable par OBS', 't4c3': "Sous-titres audio système + traduction ; capture jeu + voix ; inter-plateformes", 't4c4': "Vous devez capturer explicitement la fenêtre dans OBS pour la partager",
        'h2_3': "Comment choisir par type de stream",
        'h3_1': 'Streamers Just Chatting / IRL',
        'p_3a': "Utilisez un sous-titrage micro-seul avec overlay OBS. Latence sous 1,5 s et précision sur votre voix spécifique (après quelques sessions de chauffe du profil vocal) font la différence. CC natif Twitch est un fallback correct mais vous perdez le contrôle du style.",
        'h3_2': 'Streamers de jeux variés',
        'p_3b': "Lancez les sous-titres sur l'audio système pour que les dialogues de jeu soient aussi sous-titrés. Verrouillez la boîte de sous-titres dans un coin qui ne chevauche pas le cadre webcam. Testez au moins trois genres avant de passer en live — le mix audio varie beaucoup selon les titres.",
        'h3_3': 'Audiences multilingues / internationales',
        'p_3c': "Utilisez une couche de sous-titrage bureau qui supporte la traduction à côté de la langue source. Gravez les sous-titres bilingues dans OBS pour que les spectateurs de toute région les voient sans CC.",
        'h2_4': 'Checklist de setup pré-stream (10 minutes)',
        'li_4a': 'Vérifiez que micro et audio jeu sont sur des pistes OBS séparées.',
        'li_4b': "Configurez l'outil sur micro ou audio système (selon type de stream).",
        'li_4c': "Positionnez l'overlay sous-titres dans un coin fixe — ne le déplacez jamais pendant le stream.",
        'li_4d': 'Parlez 30 s de test à votre rythme habituel et vérifiez latence, précision et chevauchement avec HUD.',
        'h2_pitfalls': 'Pièges courants du sous-titrage streamer',
        'pf_a': "<strong>Chevauchement avec HUD :</strong> au moment crucial, les sous-titres bloquent le kill feed. Placez les sous-titres hors zones permanentes du HUD.",
        'pf_b': "<strong>Dérive de latence sur streams longs :</strong> après 3+ heures, certains sous-titreurs IA prennent du retard. Redémarrez l'outil toutes les 2 heures en marathon.",
        'pf_c': "<strong>Setup micro-seul captant l'audio jeu :</strong> arrive avec un mix-back d'interface. Vérifiez que la source micro est exclusive dans les paramètres audio OBS.",
        'h2_faq': 'FAQ',
        'q1': "Les spectateurs Twitch voient-ils les sous-titres automatiquement ?", 'a1': "Seulement si votre encodeur envoie des sous-titres CEA-608/708 ET que les spectateurs activent CC. La plupart préfèrent l'overlay OBS pour qu'ils soient toujours visibles.",
        'q2': "Les sous-titres nuisent-ils aux performances du stream ?", 'a2': "Le sous-titrage tourne sur CPU ou GPU. Sur systèmes modernes, sous 5 % CPU ; budget encodeur serré, plus petit modèle ASR ou décharger sur une seconde machine.",
        'q3': "Puis-je sous-titrer un stream en deux langues en même temps ?", 'a3': "Oui avec une couche bureau qui supporte source + cible. Gravez les sous-titres bilingues dans OBS pour audience mondiale.",
        'h2_refs': 'Références',
        'ref1_url': REF1_URL, 'ref1_label': 'Twitch — documentation Closed Captions',
        'ref2_url': REF2_URL, 'ref2_label': 'OBS Studio officiel',
        'ref3_url': REF3_URL, 'ref3_label': 'Aide YouTube — sous-titres automatiques',
        'related_label': 'Lecture connexe',
        'related': [('25', "Sous-titres en direct 2026 : comment fonctionnent les sous-titres IA et quand les utiliser"), ('24', "Transcrire l'audio en texte 2026 : transcription en temps réel vs par lots"), ('23', "Traducteur vocal en 2026 : outils en temps réel comparés par cas d'usage")],
        'cta_title': 'Sous-titres de stream capturant audio jeu ET votre voix',
        'cta_body': "Sous-titrage audio système plus traduction en temps réel pour streamers — capturez dans OBS et diffusez un stream sous-titré en minutes.",
        'cta_button': 'Télécharger depuis Microsoft Store',
    },
    'it': {
        'title': "Sottotitoli per streamer nel 2026: workflow OBS, Twitch, YouTube Live",
        'description': "Come aggiungere sottotitoli live a stream Twitch, YouTube Live, Kick e Discord — usando overlay OBS, CC nativi della piattaforma e strumenti di sottotitolazione IA senza rompere il layout del tuo stream.",
        'keywords': "sottotitoli per streamer, sottotitoli twitch, sottotitoli youtube live, overlay sottotitoli obs, sottotitoli live stream, stream sottotitoli 2026",
        'og_description': "Aggiungi sottotitoli live al tuo stream senza rompere il layout — overlay OBS, CC nativi e sottotitolazione IA a confronto.",
        'image_alt': "Sottotitoli live sovrapposti a una configurazione di stream Twitch",
        'home_label': 'Home', 'articles_label': 'Articoli',
        'breadcrumb_short': 'Sottotitoli per streamer 2026',
        'back_link': 'Torna agli articoli', 'date_label': '28 maggio 2026',
        'author_label': 'Autore', 'updated_label': 'Aggiornato',
        'twitter_description': "Workflow di sottotitolazione per streamer: OBS, Twitch CC, strumenti IA a confronto.",
        'intro': "I <strong>sottotitoli per streamer</strong> sono un problema diverso da quelli delle riunioni. Hai tre sorgenti audio (gioco, mic, sistema), tre destinazioni di sottotitoli (overlay in stream, CC piattaforma, post-VOD) e il peggior modo di fallimento: sottotitoli che ritardano e rovinano il tuo timing. Workflow sbagliato e il tuo layout si rompe nel momento peggiore.",
        'h2_1': 'Tre sorgenti audio, tre destinazioni di sottotitoli',
        'p_1': "I tuoi sottotitoli valgono solo quanto la sorgente audio che leggono. Inizia da lì:",
        'li_1a': "<strong>Sottotitoli solo-mic:</strong> leggono la tua voce pulita, ignorano l'audio del gioco. Migliore per stream talking-head (Just Chatting, IRL, podcast). Latenza più bassa.",
        'li_1b': "<strong>Sottotitoli audio di sistema:</strong> leggono audio del gioco più mic. Migliore per giochi narrativi o watch party dove vuoi sottotitolare tutto sullo schermo.",
        'li_1c': "<strong>Sottotitoli per traccia:</strong> tracce audio OBS instradate separatamente allo strumento. Migliore per stream collab dove vuoi mantenere identificabili gli oratori.",
        'h2_2': 'Confronto sottotitoli streamer 2026',
        'th_1': 'Strumento', 'th_2': 'Dove appaiono i sottotitoli', 'th_3': 'Punti di forza', 'th_4': 'Limiti',
        't1c1': 'Twitch Closed Captions nativi', 't1c2': 'Solo player Twitch', 't1c3': "Integrato in Twitch, visibile a spettatori che attivano CC; funziona su mobile", 't1c4': 'Richiede flusso CEA-608/708; non tutti gli encoder supportano; copertura lingue limitata',
        't2c1': 'Sottotitoli automatici YouTube Live', 't2c2': 'Solo player YouTube', 't2c3': 'Gratis, auto-attivati in molte lingue, persistono sul VOD', 't2c4': 'Ritardo 5–15 s; possono cadere con parlato veloce',
        't3c1': 'Overlay OBS + sorgente sottotitoli IA', 't3c2': 'Bruciati nell\'output stream', 't3c3': "Sottotitoli persistono indipendentemente dalla piattaforma; stesso sottotitolo per ogni spettatore; controllo stile completo", 't3c4': "Sottotitoli permanenti nella registrazione; spettatori non possono disattivare",
        't4c1': 'Live Subtitles (finestra overlay desktop)', 't4c2': 'Sul tuo schermo, catturabile da OBS', 't4c3': "Sottotitoli audio sistema + traduzione; cattura gioco + voce; tra piattaforme", 't4c4': "Devi catturare esplicitamente la finestra in OBS per condividerla",
        'h2_3': 'Come scegliere per tipo di stream',
        'h3_1': 'Streamer Just Chatting / IRL',
        'p_3a': "Usa sottotitolazione solo-mic con overlay OBS. Latenza sotto 1,5 s e accuratezza sulla tua voce specifica (dopo alcune sessioni di riscaldamento profilo) sono il differenziale. Il CC nativo Twitch è un fallback decente ma perdi controllo dello stile.",
        'h3_2': 'Streamer di giochi vari',
        'p_3b': "Esegui sottotitoli su audio di sistema così anche i dialoghi del gioco vengono sottotitolati. Blocca il box dei sottotitoli in un angolo che non si sovrapponga al frame webcam. Testa almeno tre generi prima del live — il mix audio varia molto tra titoli.",
        'h3_3': 'Audience multilingue / internazionale',
        'p_3c': "Usa un livello desktop di sottotitolazione che supporti traduzione accanto alla lingua sorgente. Brucia i sottotitoli bilingue in OBS così spettatori da ogni regione li vedono senza attivare CC.",
        'h2_4': 'Checklist setup pre-stream (10 minuti)',
        'li_4a': 'Verifica che mic e audio gioco siano su tracce OBS separate.',
        'li_4b': 'Configura lo strumento per leggere mic o audio di sistema (a seconda del tipo).',
        'li_4c': "Posiziona l'overlay in un angolo fisso — non spostarlo mai durante lo stream.",
        'li_4d': 'Parla 30 secondi di test al tuo ritmo abituale e controlla latenza, accuratezza e sovrapposizione con HUD.',
        'h2_pitfalls': 'Trappole comuni nella sottotitolazione streamer',
        'pf_a': "<strong>Sovrapposizione con HUD:</strong> nel momento clutch, i sottotitoli bloccano il kill feed. Posiziona i sottotitoli fuori da zone permanenti del HUD del gioco.",
        'pf_b': "<strong>Deriva di latenza su stream lunghi:</strong> dopo 3+ ore, alcuni sottotitolatori IA rallentano. Riavvia lo strumento ogni 2 ore in maratona.",
        'pf_c': "<strong>Setup solo-mic che cattura audio del gioco:</strong> accade con mix-back dell'interfaccia. Verifica che la sorgente mic sia esclusiva nelle impostazioni audio OBS.",
        'h2_faq': 'FAQ',
        'q1': "Gli spettatori Twitch vedono i sottotitoli automaticamente?", 'a1': "Solo se il tuo encoder invia sottotitoli CEA-608/708 E gli spettatori attivano CC. La maggior parte preferisce l'overlay OBS per essere sempre visibili.",
        'q2': "I sottotitoli danneggiano le prestazioni dello stream?", 'a2': "La sottotitolazione gira su CPU o GPU. Su sistemi moderni meno del 5% CPU; con budget encoder stretto, modello ASR più piccolo o offload su seconda macchina.",
        'q3': "Posso sottotitolare uno stream in due lingue contemporaneamente?", 'a3': "Sì con un livello desktop che supporti sorgente + target. Brucia sottotitoli bilingue in OBS per audience globale.",
        'h2_refs': 'Riferimenti',
        'ref1_url': REF1_URL, 'ref1_label': 'Twitch — documentazione Closed Captions',
        'ref2_url': REF2_URL, 'ref2_label': 'OBS Studio ufficiale',
        'ref3_url': REF3_URL, 'ref3_label': 'Aiuto YouTube — sottotitoli automatici',
        'related_label': 'Letture correlate',
        'related': [('25', "Sottotitoli live 2026: come funzionano i sottotitoli IA e quando usarli"), ('24', "Trascrivere audio in testo 2026: trascrizione in tempo reale vs in batch"), ('23', "Traduzione vocale 2026: strumenti in tempo reale a confronto per caso d'uso")],
        'cta_title': 'Sottotitoli stream che catturano audio gioco E la tua voce',
        'cta_body': "Sottotitolazione audio sistema più traduzione in tempo reale per streamer — cattura in OBS e lancia uno stream sottotitolato in minuti.",
        'cta_button': 'Scarica da Microsoft Store',
    },
    'ko': {
        'title': "2026년 스트리머용 자막: OBS, Twitch, YouTube Live 워크플로",
        'description': "Twitch, YouTube Live, Kick, Discord 스트림에 라이브 자막을 추가하는 방법 — OBS 오버레이, 네이티브 플랫폼 CC, AI 자막 도구를 사용하여 스트림 레이아웃을 깨뜨리지 않고.",
        'keywords': "스트리머 자막, twitch 자막, youtube live 자막, obs 자막 오버레이, 라이브 자막 스트리밍, 스트림 자막 2026",
        'og_description': "레이아웃을 깨뜨리지 않고 스트림에 라이브 자막 추가 — OBS 오버레이, 네이티브 CC, AI 자막 비교.",
        'image_alt': "Twitch 스트리밍 설정 위에 표시된 라이브 자막",
        'home_label': '홈', 'articles_label': '기사',
        'breadcrumb_short': '2026년 스트리머용 자막',
        'back_link': '기사 목록으로 돌아가기', 'date_label': '2026년 5월 28일',
        'author_label': '저자', 'updated_label': '업데이트',
        'twitter_description': "스트리머 자막 워크플로: OBS, Twitch CC, AI 도구 비교.",
        'intro': "<strong>스트리머용 자막</strong>은 회의 자막과는 다른 문제입니다. 세 가지 오디오 소스(게임, 마이크, 시스템), 세 가지 자막 대상(인-스트림 오버레이, 플랫폼 CC, 포스트-VOD), 그리고 최악의 실패 모드: 지연되어 타이밍을 망치는 자막. 잘못된 워크플로를 선택하면 가장 안 좋은 순간에 레이아웃이 깨집니다.",
        'h2_1': '세 가지 오디오 소스, 세 가지 자막 대상',
        'p_1': "자막은 읽는 오디오 소스만큼만 좋을 수 있습니다. 거기서 시작하세요:",
        'li_1a': "<strong>마이크 전용 자막:</strong> 목소리를 깨끗하게 읽고 게임 오디오를 무시합니다. 토킹헤드 스트림(저스트 채팅, IRL, 팟캐스트)에 최적. 최저 지연.",
        'li_1b': "<strong>시스템 오디오 자막:</strong> 게임 오디오와 마이크를 모두 읽습니다. 내러티브 게임이나 시청 파티에서 화면에서 일어나는 모든 것을 자막화하고 싶을 때 최적.",
        'li_1c': "<strong>트랙별 자막:</strong> OBS 오디오 트랙이 자막 도구에 별도로 라우팅됩니다. 콜랩 스트림에서 개별 스피커를 식별 가능하게 유지하고 싶을 때 최적.",
        'h2_2': '2026 스트리머 자막 비교',
        'th_1': '도구', 'th_2': '자막 표시 위치', 'th_3': '강점', 'th_4': '제한',
        't1c1': 'Twitch 네이티브 Closed Captions', 't1c2': 'Twitch 플레이어만', 't1c3': "Twitch에 내장, CC를 토글한 시청자에게 표시; 모바일 플레이어에서 작동", 't1c4': 'CEA-608/708 자막 스트림 필요; 모든 인코더가 지원하지 않음; 제한된 언어 커버리지',
        't2c1': 'YouTube Live 자동 자막', 't2c2': 'YouTube 플레이어만', 't2c3': '무료, 많은 언어에서 자동 활성화, VOD에서 유지', 't2c4': '5–15초 지연; 빠른 발화에서 떨어질 수 있음',
        't3c1': 'OBS 오버레이 + AI 자막 소스', 't3c2': '스트림 출력에 구워짐', 't3c3': "플랫폼과 관계없이 자막 지속; 모든 시청자 화면에 동일한 자막; 전체 스타일링 제어", 't3c4': "녹화에서 영구적; 시청자가 끌 수 없음",
        't4c1': 'Live Subtitles (데스크톱 오버레이 창)', 't4c2': '화면에 있고 OBS로 캡처 가능', 't4c3': '시스템 오디오 자막 + 번역; 게임 + 음성 캡처; 플랫폼 간', 't4c4': "시청자에게 공유하려면 OBS에서 창을 명시적으로 캡처해야 함",
        'h2_3': '스트림 유형별 선택 방법',
        'h3_1': '저스트 채팅 / IRL 스트리머',
        'p_3a': "OBS 오버레이와 함께 마이크 전용 자막을 사용하세요. 1.5초 미만의 지연과 특정 목소리에 대한 정확도(음성 프로필 워밍업 후)가 차별화 요인입니다. Twitch 네이티브 CC는 괜찮은 대안이지만 스타일링 제어를 잃습니다.",
        'h3_2': '다양한 게이밍 스트리머',
        'p_3b': "시스템 오디오에서 자막을 실행하여 게임 대화도 자막화하세요. 자막 상자를 웹캠 프레임과 겹치지 않는 모서리에 고정. 라이브 전 최소 세 가지 장르로 테스트하세요 — 게임 오디오 믹스는 타이틀에 따라 크게 다릅니다.",
        'h3_3': '다국어 / 국제 시청자',
        'p_3c': "소스 언어와 함께 번역을 지원하는 데스크톱 자막 레이어를 사용하세요. CC를 토글하지 않고 모든 지역의 시청자가 볼 수 있도록 OBS에 이중 언어 자막을 굽습니다.",
        'h2_4': '스트림 전 설정 체크리스트(10분)',
        'li_4a': '마이크와 게임 오디오 소스가 별도의 OBS 트랙에 있는지 확인.',
        'li_4b': '자막 도구를 마이크 또는 시스템 오디오로 구성(스트림 유형에 따라).',
        'li_4c': '자막 오버레이를 고정 모서리에 배치 — 스트림 중에 절대 이동시키지 마세요.',
        'li_4d': '평상시 리듬으로 30초 테스트를 말하고 지연, 정확도, HUD와의 겹침을 확인.',
        'h2_pitfalls': '일반적인 스트리머 자막 함정',
        'pf_a': "<strong>HUD와 자막 겹침:</strong> 클러치 순간에 자막이 킬피드를 가립니다. 게임 HUD의 영구 영역 외부에 자막을 배치하세요.",
        'pf_b': "<strong>긴 스트림에서 지연 표류:</strong> 3시간 이상 후 일부 AI 자막기는 오디오 뒤로 표류합니다. 마라톤 스트림에서는 자막 도구를 2시간마다 다시 시작하세요.",
        'pf_c': "<strong>마이크 전용 설정이 게임 오디오 캡처:</strong> 오디오 인터페이스가 다시 믹스할 때 발생합니다. OBS 오디오 설정에서 마이크 소스가 배타적인지 확인.",
        'h2_faq': '자주 묻는 질문',
        'q1': "Twitch 시청자가 자막을 자동으로 보나요?", 'a1': "인코더가 CEA-608/708 자막을 보내고 시청자가 플레이어에서 CC를 토글한 경우에만. 대부분의 스트리머는 자막이 항상 보이도록 OBS 오버레이를 선호합니다.",
        'q2': "자막이 스트림 성능에 영향을 미치나요?", 'a2': "자막화는 CPU 또는 GPU에서 실행됩니다. 현대 시스템에서는 5% CPU 미만; 인코더 예산이 빠듯하면 더 작은 ASR 모델을 사용하거나 두 번째 머신으로 오프로드.",
        'q3': "스트림을 두 언어로 동시에 자막화할 수 있나요?", 'a3': "예, 소스 + 타깃을 지원하는 데스크톱 자막 레이어로. 글로벌 시청자를 위해 OBS에 이중 언어 자막을 굽습니다.",
        'h2_refs': '참고 자료',
        'ref1_url': REF1_URL, 'ref1_label': 'Twitch — Closed Captions 문서',
        'ref2_url': REF2_URL, 'ref2_label': 'OBS Studio 공식',
        'ref3_url': REF3_URL, 'ref3_label': 'YouTube 도움말 — 자동 자막',
        'related_label': '관련 기사',
        'related': [('25', '2026년 라이브 자막: AI 자막이 작동하는 방식과 사용 시점'), ('24', '2026년 오디오를 텍스트로 변환: 실시간 vs 배치 전사 비교'), ('23', '2026년 음성 번역 앱: 실시간 도구를 사용 사례별 비교')],
        'cta_title': '게임 오디오와 목소리 모두를 캡처하는 스트림 자막',
        'cta_body': "스트리머용 시스템 오디오 자막과 실시간 번역 — OBS에서 캡처하고 몇 분 내에 자막이 있는 스트림을 출시.",
        'cta_button': 'Microsoft Store에서 다운로드',
    },
    'zh': {
        'title': "2026 年主播字幕：OBS、Twitch、YouTube Live 工作流",
        'description': "如何为 Twitch、YouTube Live、Kick 和 Discord 直播添加实时字幕——使用 OBS 覆盖、平台原生 CC 与 AI 字幕工具，且不破坏直播布局。",
        'keywords': "主播字幕, twitch 字幕, youtube live 字幕, obs 字幕覆盖, 直播实时字幕, 直播字幕 2026",
        'og_description': "为直播添加实时字幕而不破坏布局 —— 比较 OBS 覆盖、原生 CC 与 AI 字幕。",
        'image_alt': "覆盖在 Twitch 直播设置上的实时字幕",
        'home_label': '首页', 'articles_label': '文章',
        'breadcrumb_short': '2026 年主播字幕',
        'back_link': '返回文章', 'date_label': '2026 年 5 月 28 日',
        'author_label': '作者', 'updated_label': '更新',
        'twitter_description': "主播字幕工作流：OBS、Twitch CC、AI 工具对比。",
        'intro': "<strong>主播字幕</strong>与会议字幕是不同的问题。你有三个音频源（游戏、麦克风、系统），三个字幕目的地（直播内覆盖、平台 CC、后期 VOD），以及最糟糕的失败模式：滞后的字幕毁掉你的节奏。选错工作流，你的布局就会在最糟糕的时刻崩塌。",
        'h2_1': '三个音频源，三个字幕目的地',
        'p_1': "你的字幕只能与其读取的音频源一样好。从这里开始：",
        'li_1a': "<strong>仅麦克风字幕：</strong>清晰读取你的声音，忽略游戏音频。最适合谈话头直播（闲聊、IRL、播客）。最低延迟。",
        'li_1b': "<strong>系统音频字幕：</strong>读取游戏音频和麦克风。最适合叙事游戏或观影派对，你想为屏幕上发生的一切添加字幕。",
        'li_1c': "<strong>按轨字幕：</strong>OBS 音轨分别路由到字幕工具。最适合合作直播，你希望保留单独说话人可识别。",
        'h2_2': '2026 主播字幕对比',
        'th_1': '工具', 'th_2': '字幕出现位置', 'th_3': '优势', 'th_4': '限制',
        't1c1': 'Twitch 原生 Closed Captions', 't1c2': '仅 Twitch 播放器', 't1c3': "内置于 Twitch，切换 CC 的观众可见；在移动播放器上工作", 't1c4': '需要 CEA-608/708 字幕流；并非所有编码器都支持；语言覆盖有限',
        't2c1': 'YouTube Live 自动字幕', 't2c2': '仅 YouTube 播放器', 't2c3': '免费，多语言自动启用，VOD 中保留', 't2c4': '5–15 秒延迟；可能在快速讲话时掉帧',
        't3c1': 'OBS 覆盖 + AI 字幕源', 't3c2': '烧入到你的直播输出', 't3c3': "字幕不依赖于平台；每位观众屏幕上同一字幕；完全样式控制", 't3c4': "字幕在录像中永久；观众无法关闭",
        't4c1': 'Live Subtitles（桌面覆盖窗口）', 't4c2': '你的屏幕，OBS 可捕获', 't4c3': '系统音频字幕 + 翻译；捕获游戏 + 语音；跨平台', 't4c4': "你必须在 OBS 中明确捕获窗口才能与观众分享",
        'h2_3': '按直播类型如何选择',
        'h3_1': '闲聊 / IRL 主播',
        'p_3a': "使用 OBS 覆盖的仅麦克风字幕。低于 1.5 秒的延迟和对特定声音的准确度（在几个语音配置预热会话后）是关键。Twitch 原生 CC 是不错的备选，但会失去样式控制。",
        'h3_2': '多种游戏主播',
        'p_3b': "在系统音频上运行字幕，让游戏对话也被字幕化。将字幕框锁定到不与摄像头框重叠的角落。在直播之前用至少三种游戏类型进行测试 —— 游戏音频混音在不同标题之间差异很大。",
        'h3_3': '多语言 / 国际观众',
        'p_3c': "使用一个支持源语言旁边翻译的桌面字幕层。在 OBS 中烧入双语字幕，让任何地区的观众无需切换 CC 即可看到。",
        'h2_4': '直播前设置清单（10 分钟）',
        'li_4a': '验证麦克风源和游戏音频源在不同的 OBS 轨道上。',
        'li_4b': '配置字幕工具读取麦克风或系统音频（取决于直播类型）。',
        'li_4c': '将字幕覆盖放在固定的角落 —— 直播期间永远不要移动。',
        'li_4d': '以你通常的节奏说 30 秒测试，检查延迟、准确性和与 HUD 的重叠。',
        'h2_pitfalls': '主播字幕常见陷阱',
        'pf_a': "<strong>字幕与 HUD 重叠：</strong>在关键时刻，你的字幕会挡住击杀提示。将字幕放在游戏 HUD 永久区域之外。",
        'pf_b': "<strong>长时间直播的延迟漂移：</strong>3+ 小时后，一些 AI 字幕工具会落后于音频。马拉松直播期间每 2 小时重启字幕工具。",
        'pf_c': "<strong>仅麦克风设置捕获游戏音频：</strong>当你的音频接口混音回传时发生。在 OBS 音频设置中验证麦克风源是独占的。",
        'h2_faq': '常见问题',
        'q1': "Twitch 观众会自动看到字幕吗？", 'a1': "只有当你的编码器发送 CEA-608/708 字幕并且观众在播放器中切换 CC 时。大多数主播更喜欢 OBS 覆盖，这样字幕始终可见。",
        'q2': "字幕会影响我的直播性能吗？", 'a2': "字幕化在你的 CPU 或 GPU 上运行。在现代系统上 CPU 占用低于 5%；编码器预算紧张时使用更小的 ASR 模型或卸载到第二台机器。",
        'q3': "我能同时用两种语言为直播加字幕吗？", 'a3': "可以，使用支持源+目标的桌面字幕层。在 OBS 中烧入双语字幕以服务全球观众。",
        'h2_refs': '参考资料',
        'ref1_url': REF1_URL, 'ref1_label': 'Twitch —— Closed Captions 文档',
        'ref2_url': REF2_URL, 'ref2_label': 'OBS Studio 官方',
        'ref3_url': REF3_URL, 'ref3_label': 'YouTube 帮助 —— 自动字幕',
        'related_label': '相关阅读',
        'related': [('25', '2026 年实时字幕：AI 字幕的工作原理及使用场景'), ('24', '2026 年音频转文字：实时 vs 批量转录对比'), ('23', '2026 年语音翻译应用：按使用场景比较实时工具')],
        'cta_title': '同时捕获游戏音频和你的声音的直播字幕',
        'cta_body': "为主播提供的系统音频字幕和实时翻译 —— 在 OBS 中捕获，几分钟内推出带字幕的直播。",
        'cta_button': '从 Microsoft Store 下载',
    },
    'pl': {
        'title': "Napisy dla streamerów w 2026: workflow OBS, Twitch, YouTube Live",
        'description': "Jak dodać napisy na żywo do streamu Twitch, YouTube Live, Kick i Discord — używając nakładki OBS, natywnego CC platformy i narzędzi napisów AI bez psucia układu streamu.",
        'keywords': "napisy dla streamerów, napisy twitch, napisy youtube live, nakładka napisów obs, napisy na żywo stream, stream napisy 2026",
        'og_description': "Dodaj napisy na żywo do streamu bez psucia układu — porównanie nakładki OBS, natywnego CC i napisów AI.",
        'image_alt': "Napisy na żywo nałożone na konfigurację streamu Twitch",
        'home_label': 'Strona główna', 'articles_label': 'Artykuły',
        'breadcrumb_short': 'Napisy dla streamerów 2026',
        'back_link': 'Powrót do artykułów', 'date_label': '28 maja 2026',
        'author_label': 'Autor', 'updated_label': 'Zaktualizowano',
        'twitter_description': "Workflow napisów dla streamerów: OBS, Twitch CC, narzędzia AI porównane.",
        'intro': "<strong>Napisy dla streamerów</strong> to inny problem niż napisy na spotkaniach. Masz trzy źródła audio (gra, mikrofon, system), trzy miejsca docelowe napisów (nakładka w streamie, CC platformy, post-VOD) i najgorszy możliwy tryb awarii: napisy, które się opóźniają i niszczą twój timing. Zły workflow i twój układ rozpada się w najgorszym momencie.",
        'h2_1': 'Trzy źródła audio, trzy miejsca docelowe napisów',
        'p_1': "Twoje napisy są tylko tak dobre, jak źródło audio, które czytają. Zacznij stąd:",
        'li_1a': "<strong>Napisy tylko z mikrofonu:</strong> czyta twój głos czysto, ignoruje audio gry. Najlepsze dla streamów typu talking-head (Just Chatting, IRL, podcasty). Najniższe opóźnienie.",
        'li_1b': "<strong>Napisy z audio systemu:</strong> czyta audio gry plus mikrofon. Najlepsze dla gier narracyjnych lub watch party, gdzie chcesz dodać napisy do wszystkiego na ekranie.",
        'li_1c': "<strong>Napisy per ścieżka:</strong> ścieżki audio OBS osobno kierowane do narzędzia napisów. Najlepsze dla streamów kolaboracyjnych, gdzie chcesz zachować identyfikowalność poszczególnych mówców.",
        'h2_2': 'Porównanie napisów dla streamerów 2026',
        'th_1': 'Narzędzie', 'th_2': 'Gdzie pojawiają się napisy', 'th_3': 'Mocne strony', 'th_4': 'Ograniczenia',
        't1c1': 'Twitch natywne Closed Captions', 't1c2': 'Tylko odtwarzacz Twitch', 't1c3': "Wbudowane w Twitch, widoczne dla widzów przełączających CC; działa w odtwarzaczu mobilnym", 't1c4': 'Wymaga strumienia napisów CEA-608/708; nie wszystkie enkodery obsługują; ograniczone pokrycie języków',
        't2c1': 'Automatyczne napisy YouTube Live', 't2c2': 'Tylko odtwarzacz YouTube', 't2c3': 'Darmowe, automatycznie włączone dla wielu języków, utrzymują się w VOD', 't2c4': 'Opóźnienie 5–15 s; mogą zanikać przy szybkiej mowie',
        't3c1': 'Nakładka OBS + źródło napisów AI', 't3c2': 'Wypalone w wyjściu streamu', 't3c3': "Napisy pozostają niezależnie od platformy; ten sam napis pojawia się na ekranie każdego widza; pełna kontrola stylu", 't3c4': "Napisy są trwałe w nagraniu; widzowie nie mogą wyłączyć",
        't4c1': 'Live Subtitles (okno nakładki na pulpicie)', 't4c2': 'Na twoim ekranie, możliwe do przechwycenia przez OBS', 't4c3': 'Napisy audio systemu + tłumaczenie; przechwytuje grę + głos; między platformami', 't4c4': "Musisz jawnie przechwycić okno w OBS, aby udostępnić widzom",
        'h2_3': 'Jak wybierać według typu streamu',
        'h3_1': 'Streamerzy Just Chatting / IRL',
        'p_3a': "Użyj napisów tylko z mikrofonu z nakładką OBS. Opóźnienie poniżej 1,5 s i dokładność na twoim konkretnym głosie (po kilku sesjach rozgrzewki profilu mowy) to wyróżnik. Natywne Twitch CC to dobra alternatywa, ale tracisz kontrolę stylu.",
        'h3_2': 'Streamerzy różnych gier',
        'p_3b': "Uruchom napisy na audio systemu, aby dialogi gry też były z napisami. Zablokuj pudełko napisów w rogu, który nie nakłada się na ramkę kamery internetowej. Przetestuj co najmniej trzy gatunki gier przed transmisją na żywo — mix audio gier bardzo się różni między tytułami.",
        'h3_3': 'Wielojęzyczne / międzynarodowe odbiorcy',
        'p_3c': "Użyj warstwy napisów pulpitu obsługującej tłumaczenie obok języka źródłowego. Wypal dwujęzyczne napisy w OBS, aby widzowie z każdego regionu widzieli je bez przełączania CC.",
        'h2_4': 'Lista kontrolna konfiguracji przed streamem (10 minut)',
        'li_4a': 'Sprawdź, czy mikrofon i audio gry są na osobnych ścieżkach OBS.',
        'li_4b': 'Skonfiguruj narzędzie napisów na mikrofon lub audio systemu (w zależności od typu streamu).',
        'li_4c': 'Umieść nakładkę napisów w stałym rogu — nigdy nie przesuwaj podczas streamu.',
        'li_4d': 'Mów 30 sekund testu w swoim zwykłym rytmie i sprawdź opóźnienie, dokładność i nakładanie z HUD.',
        'h2_pitfalls': 'Częste pułapki napisów dla streamerów',
        'pf_a': "<strong>Nakładanie napisów z HUD:</strong> w momencie kluczowym napisy blokują kill feed. Umieść napisy poza stałymi strefami HUD gry.",
        'pf_b': "<strong>Dryf opóźnienia na długich streamach:</strong> po 3+ godzinach niektóre narzędzia napisów AI dryfują za audio. Uruchom ponownie narzędzie napisów co 2 godziny w streamach maratońskich.",
        'pf_c': "<strong>Konfiguracja tylko z mikrofonu przechwytująca audio gry:</strong> dzieje się, gdy interfejs audio miksuje z powrotem. Sprawdź, czy źródło mikrofonu jest wyłączne w ustawieniach audio OBS.",
        'h2_faq': 'FAQ',
        'q1': "Czy widzowie Twitch widzą napisy automatycznie?", 'a1': "Tylko jeśli twój enkoder wysyła napisy CEA-608/708 I widzowie przełączają CC w odtwarzaczu. Większość streamerów woli nakładkę OBS, aby napisy zawsze były widoczne.",
        'q2': "Czy napisy zaszkodzą wydajności mojego streamu?", 'a2': "Napisy działają na CPU lub GPU. Na nowoczesnych systemach koszt CPU wynosi poniżej 5%; przy ciasnym budżecie enkodera użyj mniejszego modelu ASR lub przerzuć na drugą maszynę.",
        'q3': "Czy mogę dodać napisy do streamu w dwóch językach jednocześnie?", 'a3': "Tak, z warstwą napisów pulpitu obsługującą źródło + cel. Wypal dwujęzyczne napisy w OBS dla globalnej publiczności.",
        'h2_refs': 'Źródła',
        'ref1_url': REF1_URL, 'ref1_label': 'Twitch — dokumentacja Closed Captions',
        'ref2_url': REF2_URL, 'ref2_label': 'OBS Studio oficjalnie',
        'ref3_url': REF3_URL, 'ref3_label': 'Pomoc YouTube — automatyczne napisy',
        'related_label': 'Powiązane artykuły',
        'related': [('25', 'Napisy na żywo 2026: jak działają napisy AI i kiedy ich używać'), ('24', 'Transkrypcja audio na tekst 2026: transkrypcja w czasie rzeczywistym vs wsadowa'), ('23', 'Tłumacz głosowy 2026: narzędzia w czasie rzeczywistym według zastosowania')],
        'cta_title': 'Napisy streamu przechwytujące audio gry I twój głos',
        'cta_body': "Napisy audio systemu plus tłumaczenie w czasie rzeczywistym dla streamerów — przechwytuj w OBS i wypuść stream z napisami w kilka minut.",
        'cta_button': 'Pobierz z Microsoft Store',
    },
    'pt': {
        'title': "Legendas para streamers em 2026: workflow OBS, Twitch, YouTube Live",
        'description': "Como adicionar legendas ao vivo ao seu stream do Twitch, YouTube Live, Kick e Discord — usando overlay do OBS, CC nativo da plataforma e ferramentas de legendagem IA sem quebrar o layout do seu stream.",
        'keywords': "legendas para streamers, legendas twitch, legendas youtube live, overlay legendas obs, legendas ao vivo stream, stream legendas 2026",
        'og_description': "Adicione legendas ao vivo ao seu stream sem quebrar o layout — overlay OBS, CC nativo e legendagem IA comparadas.",
        'image_alt': "Legendas ao vivo sobrepostas a uma configuração de stream do Twitch",
        'home_label': 'Início', 'articles_label': 'Artigos',
        'breadcrumb_short': 'Legendas para streamers 2026',
        'back_link': 'Voltar aos artigos', 'date_label': '28 de maio de 2026',
        'author_label': 'Autor', 'updated_label': 'Atualizado',
        'twitter_description': "Workflow de legendagem para streamers: OBS, Twitch CC, ferramentas IA comparadas.",
        'intro': "<strong>Legendas para streamers</strong> são um problema diferente das legendas de reuniões. Você tem três fontes de áudio (jogo, microfone, sistema), três destinos de legendas (overlay no stream, CC da plataforma, post-VOD) e o pior modo de falha possível: legendas que atrasam e arruínam seu timing. Workflow errado e seu layout quebra no pior momento.",
        'h2_1': 'Três fontes de áudio, três destinos de legendas',
        'p_1': "Suas legendas só são tão boas quanto a fonte de áudio que leem. Comece por aí:",
        'li_1a': "<strong>Legendas só-microfone:</strong> lê sua voz limpa, ignora áudio do jogo. Melhor para streams talking-head (Just Chatting, IRL, podcasts). Menor latência.",
        'li_1b': "<strong>Legendas de áudio do sistema:</strong> lê áudio do jogo mais microfone. Melhor para jogos narrativos ou watch parties onde quer legendar tudo na tela.",
        'li_1c': "<strong>Legendas por faixa:</strong> faixas de áudio OBS roteadas separadamente para ferramenta de legendas. Melhor para streams colaborativos onde quer manter falantes individuais identificáveis.",
        'h2_2': 'Comparativo de legendas para streamers 2026',
        'th_1': 'Ferramenta', 'th_2': 'Onde aparecem as legendas', 'th_3': 'Pontos fortes', 'th_4': 'Limites',
        't1c1': 'Twitch Closed Captions nativas', 't1c2': 'Apenas player Twitch', 't1c3': "Integrado ao Twitch, visível para espectadores que ativam CC; funciona no player mobile", 't1c4': 'Requer fluxo CEA-608/708; nem todos os encoders suportam; cobertura linguística limitada',
        't2c1': 'Legendas automáticas YouTube Live', 't2c2': 'Apenas player YouTube', 't2c3': 'Grátis, autoativadas em muitos idiomas, persistem no VOD', 't2c4': 'Latência de 5–15 s; podem cair em fala rápida',
        't3c1': 'Overlay OBS + fonte de legendas IA', 't3c2': 'Queimadas na saída do stream', 't3c3': "Legendas persistem independentemente da plataforma; mesma legenda na tela de cada espectador; controle total de estilo", 't3c4': "Legendas permanentes na gravação; espectador não pode desativar",
        't4c1': 'Live Subtitles (janela overlay de desktop)', 't4c2': 'Na sua tela, capturável pelo OBS', 't4c3': 'Legendas de áudio do sistema + tradução; captura jogo + voz; entre plataformas', 't4c4': "Você deve capturar a janela explicitamente no OBS para compartilhar",
        'h2_3': 'Como escolher por tipo de stream',
        'h3_1': 'Streamers Just Chatting / IRL',
        'p_3a': "Use legendagem só-microfone com overlay OBS. Latência abaixo de 1,5 s e precisão na sua voz específica (após algumas sessões de aquecimento de perfil) são o diferencial. CC nativo do Twitch é fallback decente mas você perde controle de estilo.",
        'h3_2': 'Streamers de games variados',
        'p_3b': "Execute legendas no áudio do sistema para que diálogos do jogo também sejam legendados. Trave a caixa de legendas em um canto que não sobreponha o frame da webcam. Teste pelo menos três gêneros antes de entrar ao vivo — o mix de áudio varia muito entre títulos.",
        'h3_3': 'Audiências multilíngues / internacionais',
        'p_3c': "Use uma camada de legendagem de desktop que suporte tradução ao lado do idioma fonte. Queime legendas bilíngues no OBS para que espectadores de qualquer região as vejam sem alternar CC.",
        'h2_4': 'Checklist de configuração pré-stream (10 minutos)',
        'li_4a': 'Verifique se microfone e áudio do jogo estão em faixas OBS separadas.',
        'li_4b': 'Configure a ferramenta de legendas para ler mic ou áudio do sistema (conforme tipo).',
        'li_4c': 'Posicione o overlay de legendas em um canto fixo — nunca mova durante o stream.',
        'li_4d': 'Fale 30 segundos de teste no seu ritmo habitual e verifique latência, precisão e sobreposição com HUD.',
        'h2_pitfalls': 'Armadilhas comuns de legendagem para streamers',
        'pf_a': "<strong>Sobreposição com HUD:</strong> no momento crucial, as legendas bloqueiam o kill feed. Posicione legendas fora das zonas permanentes do HUD do jogo.",
        'pf_b': "<strong>Deriva de latência em streams longos:</strong> após 3+ horas, alguns legendadores IA atrasam. Reinicie a ferramenta a cada 2 horas em streams maratona.",
        'pf_c': "<strong>Setup só-mic capturando áudio do jogo:</strong> acontece quando a interface de áudio mistura de volta. Verifique se a fonte do mic é exclusiva nas configurações de áudio do OBS.",
        'h2_faq': 'Perguntas frequentes',
        'q1': "Os espectadores do Twitch veem legendas automaticamente?", 'a1': "Apenas se o encoder enviar legendas CEA-608/708 E os espectadores alternarem CC. A maioria dos streamers prefere overlay OBS para que legendas sempre fiquem visíveis.",
        'q2': "Legendas prejudicam o desempenho do stream?", 'a2': "Legendagem roda no CPU ou GPU. Em sistemas modernos, abaixo de 5% CPU; com orçamento de encoder apertado, use modelo ASR menor ou descarregue para segunda máquina.",
        'q3': "Posso legendar um stream em duas línguas ao mesmo tempo?", 'a3': "Sim com uma camada de desktop que suporte fonte + alvo. Queime legendas bilíngues no OBS para audiência global.",
        'h2_refs': 'Referências',
        'ref1_url': REF1_URL, 'ref1_label': 'Twitch — documentação Closed Captions',
        'ref2_url': REF2_URL, 'ref2_label': 'OBS Studio oficial',
        'ref3_url': REF3_URL, 'ref3_label': 'Ajuda YouTube — legendas automáticas',
        'related_label': 'Leitura relacionada',
        'related': [('25', 'Legendas ao vivo em 2026: como funcionam as legendas com IA e quando usá-las'), ('24', 'Transcrever áudio para texto em 2026: transcrição em tempo real vs em lotes'), ('23', 'Tradutor de voz em 2026: ferramentas em tempo real comparadas por caso de uso')],
        'cta_title': 'Legendas de stream capturando áudio do jogo E sua voz',
        'cta_body': "Legendagem de áudio do sistema mais tradução em tempo real para streamers — capture no OBS e lance um stream legendado em minutos.",
        'cta_button': 'Baixar na Microsoft Store',
    },
    'tr': {
        'title': "2026'da streamerlar için altyazılar: OBS, Twitch, YouTube Live iş akışı",
        'description': "Twitch, YouTube Live, Kick ve Discord yayınınıza canlı altyazı ekleme — OBS overlay, platform yerel CC ve AI altyazı araçları kullanarak yayın düzeninizi bozmadan.",
        'keywords': "streamerlar için altyazı, twitch altyazı, youtube live altyazı, obs altyazı overlay, canlı altyazı yayın, yayın altyazı 2026",
        'og_description': "Düzeni bozmadan yayınınıza canlı altyazılar ekleyin — OBS overlay, yerel CC ve AI altyazısı karşılaştırması.",
        'image_alt': "Twitch yayın kurulumu üzerine bindirilmiş canlı altyazılar",
        'home_label': 'Ana Sayfa', 'articles_label': 'Makaleler',
        'breadcrumb_short': "2026'da streamerlar için altyazılar",
        'back_link': 'Makalelere dön', 'date_label': '28 Mayıs 2026',
        'author_label': 'Yazar', 'updated_label': 'Güncellendi',
        'twitter_description': "Streamer altyazı iş akışı: OBS, Twitch CC, AI araçları karşılaştırması.",
        'intro': "<strong>Streamerlar için altyazılar</strong>, toplantı altyazılarından farklı bir problemdir. Üç ses kaynağınız (oyun, mikrofon, sistem), üç altyazı hedefi (yayın içi overlay, platform CC, yayın sonrası VOD) ve mümkün olan en kötü hata modu vardır: gecikip zamanlamanızı bozan altyazılar. Yanlış iş akışı, en kötü anda düzeniniz bozulur.",
        'h2_1': 'Üç ses kaynağı, üç altyazı hedefi',
        'p_1': "Altyazılarınız ancak okudukları ses kaynağı kadar iyi olabilir. Oradan başlayın:",
        'li_1a': "<strong>Yalnızca mikrofon altyazısı:</strong> sesinizi temiz okur, oyun sesini yok sayar. Konuşma kafası yayınları (Just Chatting, IRL, podcastler) için en uygunudur. En düşük gecikme.",
        'li_1b': "<strong>Sistem sesi altyazısı:</strong> oyun sesini artı mikrofonu okur. Anlatımlı oyunlar veya ekranda olan her şeye altyazı eklemek istediğiniz izleme partileri için en uygunudur.",
        'li_1c': "<strong>İz başına altyazı:</strong> OBS ses izleri ayrı ayrı altyazı aracına yönlendirilir. Konuşmacıların ayırt edilebilir kalmasını istediğiniz işbirlikçi yayınlar için en uygunudur.",
        'h2_2': '2026 streamer altyazı karşılaştırması',
        'th_1': 'Araç', 'th_2': 'Altyazıların göründüğü yer', 'th_3': 'Güçlü yönler', 'th_4': 'Sınırlar',
        't1c1': 'Twitch yerel Closed Captions', 't1c2': 'Sadece Twitch oynatıcı', 't1c3': "Twitch'e gömülü, CC'yi açan izleyiciler için görünür; mobil oynatıcıda çalışır", 't1c4': 'CEA-608/708 altyazı akışı gerektirir; tüm kodlayıcılar desteklemez; sınırlı dil kapsamı',
        't2c1': 'YouTube Live otomatik altyazılar', 't2c2': 'Sadece YouTube oynatıcı', 't2c3': 'Ücretsiz, birçok dil için otomatik etkin, VOD\'da kalıcı', 't2c4': '5–15 saniye gecikme; hızlı konuşma sırasında düşebilir',
        't3c1': 'OBS overlay + AI altyazı kaynağı', 't3c2': 'Yayın çıktınıza yakıldı', 't3c3': "Altyazılar platformdan bağımsız kalır; her izleyicinin ekranında aynı altyazı görünür; tam stil kontrolü", 't3c4': "Altyazılar kayıtta kalıcı; izleyiciler kapatamaz",
        't4c1': 'Live Subtitles (masaüstü overlay penceresi)', 't4c2': 'Ekranınızda, OBS tarafından yakalanabilir', 't4c3': "Sistem sesi altyazıları + çeviri; oyun + sesi yakalar; platformlar arası", 't4c4': "İzleyicilerle paylaşmak için pencereyi OBS'de açıkça yakalamanız gerekir",
        'h2_3': 'Yayın türüne göre nasıl seçilir',
        'h3_1': 'Just Chatting / IRL streamerları',
        'p_3a': "OBS overlay ile yalnızca mikrofon altyazısını kullanın. 1,5 saniyenin altında gecikme ve belirli sesinizdeki doğruluk (konuşma profili ısınmasından sonra) farklılaştırıcıdır. Twitch yerel CC iyi bir yedektir ama stil kontrolünü kaybedersiniz.",
        'h3_2': 'Çeşitli oyun streamerları',
        'p_3b': "Oyun diyaloglarının da altyazılanması için altyazıları sistem sesinde çalıştırın. Altyazı kutusunu web kamerası çerçevesi ile örtüşmeyen bir köşeye sabitleyin. Canlıya geçmeden önce en az üç oyun türüyle test edin — oyun ses miksleri başlıklar arasında çok farklıdır.",
        'h3_3': 'Çok dilli / uluslararası izleyiciler',
        'p_3c': "Kaynak dilin yanı sıra çeviriyi destekleyen bir masaüstü altyazı katmanı kullanın. CC'yi açmadan herhangi bir bölgedeki izleyicilerin görmesi için iki dilli altyazıları OBS'ye yakın.",
        'h2_4': 'Yayın öncesi kurulum kontrol listesi (10 dakika)',
        'li_4a': 'Mikrofon ve oyun ses kaynaklarınızın ayrı OBS izlerinde olduğunu doğrulayın.',
        'li_4b': 'Altyazı aracını mikrofon veya sistem sesini okuyacak şekilde yapılandırın (yayın türüne bağlı olarak).',
        'li_4c': 'Altyazı overlay\'ini sabit bir köşeye yerleştirin — yayın sırasında asla hareket ettirmeyin.',
        'li_4d': 'Her zamanki ritminizde 30 saniyelik test konuşma yapın ve gecikmeyi, doğruluğu ve HUD ile çakışmayı kontrol edin.',
        'h2_pitfalls': 'Yaygın streamer altyazı tuzakları',
        'pf_a': "<strong>HUD ile altyazı çakışması:</strong> kritik bir anda altyazılarınız öldürme akışını engeller. Altyazıları oyun HUD'unun kalıcı bölgelerinin dışına yerleştirin.",
        'pf_b': "<strong>Uzun yayınlarda gecikme kayması:</strong> 3+ saat sonra bazı AI altyazıcıları ses altına kayar. Maraton yayınlarında altyazı aracını her 2 saatte bir yeniden başlatın.",
        'pf_c': "<strong>Oyun sesini yakalayan sadece mikrofon kurulumu:</strong> ses arayüzünüz geri karıştığında olur. OBS ses ayarlarında mikrofon kaynağının özel olduğunu doğrulayın.",
        'h2_faq': 'SSS',
        'q1': "Twitch izleyicileri altyazıları otomatik olarak görüyor mu?", 'a1': "Sadece kodlayıcınız CEA-608/708 altyazılar gönderiyorsa VE izleyiciler oynatıcıda CC'yi açıyorsa. Çoğu streamer altyazıların her zaman görünür olması için OBS overlay'i tercih eder.",
        'q2': "Altyazılar yayın performansımı etkiler mi?", 'a2': "Altyazı CPU veya GPU üzerinde çalışır. Modern sistemlerde CPU maliyeti %5'in altındadır; sıkı kodlayıcı bütçelerinde daha küçük bir ASR modeli kullanın veya ikinci bir makineye yükleyin.",
        'q3': "Bir yayını aynı anda iki dilde altyazılayabilir miyim?", 'a3': "Evet, kaynak + hedef destekleyen bir masaüstü altyazı katmanı ile. Küresel izleyici için OBS'ye iki dilli altyazıları yakın.",
        'h2_refs': 'Kaynaklar',
        'ref1_url': REF1_URL, 'ref1_label': 'Twitch — Closed Captions belgeleri',
        'ref2_url': REF2_URL, 'ref2_label': 'OBS Studio resmi',
        'ref3_url': REF3_URL, 'ref3_label': 'YouTube Yardım — otomatik altyazılar',
        'related_label': 'İlgili okumalar',
        'related': [('25', "Canlı altyazılar 2026: AI tarafından üretilen altyazılar nasıl çalışır ve ne zaman kullanılır"), ('24', "Sesi metne dönüştürme 2026: gerçek zamanlı vs toplu transkripsiyon karşılaştırması"), ('23', "Sesli çeviri 2026: gerçek zamanlı araçlar kullanım senaryosuna göre karşılaştırıldı")],
        'cta_title': 'Oyun sesini VE sesinizi yakalayan yayın altyazıları',
        'cta_body': "Streamerlar için sistem sesi altyazıları artı gerçek zamanlı çeviri — OBS'de yakalayın ve dakikalar içinde altyazılı bir yayın gönderin.",
        'cta_button': "Microsoft Store'dan indir",
    },
    'uk': {
        'title': "Субтитри для стримерів у 2026: workflow OBS, Twitch, YouTube Live",
        'description': "Як додати живі субтитри до стрімів Twitch, YouTube Live, Kick і Discord — використовуючи OBS оверлей, нативний CC платформи та AI-інструменти субтитрів, не ламаючи розкладку стріму.",
        'keywords': "субтитри для стримерів, twitch субтитри, youtube live субтитри, obs субтитри оверлей, лайв субтитри стрім, стрім субтитри 2026",
        'og_description': "Додавайте живі субтитри у стрім без поломки розкладки — порівняння OBS оверлея, нативного CC та AI-субтитрів.",
        'image_alt': "Живі субтитри поверх налаштування стріму Twitch",
        'home_label': 'Головна', 'articles_label': 'Статті',
        'breadcrumb_short': 'Субтитри для стримерів 2026',
        'back_link': 'Назад до статей', 'date_label': '28 травня 2026',
        'author_label': 'Автор', 'updated_label': 'Оновлено',
        'twitter_description': "Стримерський workflow субтитрів: OBS, Twitch CC, AI-інструменти у порівнянні.",
        'intro': "<strong>Субтитри для стримерів</strong> — це не та сама задача що субтитри на зустрічах. У вас три джерела аудіо (гра, мікрофон, система), три місця виводу субтитрів (оверлей у стрімі, CC платформи, пост-VOD) та найгірший можливий fail: лагуючі субтитри, що ламають тайминг. Не той workflow — і розкладка розпадається в найгірший момент.",
        'h2_1': 'Три джерела аудіо, три місця виводу субтитрів',
        'p_1': "Якість субтитрів не перевищує якості джерела аудіо. Почніть звідти:",
        'li_1a': "<strong>Тільки-мікрофон субтитри:</strong> читають ваш голос чисто, ігнорують ігровий звук. Найкраще для talking-head стрімів (Just Chatting, IRL, подкасти). Найменша затримка.",
        'li_1b': "<strong>Системне аудіо субтитри:</strong> читають ігровий звук + мікрофон. Найкраще для сюжетних ігор або watch-party, де потрібно субтитрувати все, що відбувається на екрані.",
        'li_1c': "<strong>Потрекові субтитри:</strong> аудіо-треки OBS окремо роутяться в інструмент субтитрів. Найкраще для колаб-стрімів, де важлива ідентифікація мовців.",
        'h2_2': 'Порівняння стримерських субтитрів 2026',
        'th_1': 'Інструмент', 'th_2': 'Де з\'являються субтитри', 'th_3': 'Сильні сторони', 'th_4': 'Обмеження',
        't1c1': 'Twitch нативні Closed Captions', 't1c2': 'Лише плеєр Twitch', 't1c3': "Вбудовано в Twitch, видно глядачам, що увімкнули CC; працює в мобільному плеєрі", 't1c4': 'Потрібен CEA-608/708 потік субтитрів; не всі енкодери підтримують; обмежене покриття мов',
        't2c1': 'YouTube Live автоматичні субтитри', 't2c2': 'Лише плеєр YouTube', 't2c3': 'Безкоштовно, авто-увімкнення для багатьох мов, залишаються на VOD', 't2c4': 'Лаг 5–15 с; можуть зриватися при швидкому мовленні',
        't3c1': 'OBS оверлей + AI джерело субтитрів', 't3c2': 'Запечені у вихід стріму', 't3c3': "Субтитри стабільні незалежно від платформи; одні й ті ж субтитри на екрані кожного глядача; повний контроль стилю", 't3c4': "Субтитри постійні в записі; глядачі не можуть вимкнути",
        't4c1': 'Live Subtitles (десктоп оверлей-вікно)', 't4c2': 'На вашому екрані, захоплення в OBS', 't4c3': 'Субтитри системного аудіо + переклад; ловить гру + голос; крос-платформенно', 't4c4': "Потрібно явно захопити вікно в OBS, щоб показати глядачам",
        'h2_3': 'Як обирати за типом стріму',
        'h3_1': 'Just Chatting / IRL стримери',
        'p_3a': "Використовуйте тільки-мікрофон субтитри з OBS оверлеєм. Затримка до 1.5 с та точність на вашому конкретному голосі (після кількох сесій розігріву голосового профілю) — це диференціатор. Twitch нативний CC — нормальний фолбек, але втрачаєте контроль стилю.",
        'h3_2': 'Стримери різних ігор',
        'p_3b': "Запускайте субтитри за системним аудіо, щоб ігрові діалоги також субтитрувалися. Зафіксуйте бокс субтитрів у куток, що не перетинається з рамкою вебки. Тестуйте мінімум 3 жанри ігор перед виходом в ефір — ігровий мікс сильно різниться між тайтлами.",
        'h3_3': 'Багатомовна / міжнародна аудиторія',
        'p_3c': "Використовуйте десктопний шар субтитрів, що підтримує переклад поряд із вихідною мовою. Запікайте двомовні субтитри в OBS, щоб глядачі будь-якого регіону їх бачили без перемикання CC.",
        'h2_4': 'Пре-стрім чек-ліст налаштування (10 хвилин)',
        'li_4a': 'Перевірте, що джерело мікрофона та ігрове аудіо на різних треках OBS.',
        'li_4b': 'Сконфігуруйте інструмент субтитрів на читання або мікрофона, або системного аудіо (за типом стріму).',
        'li_4c': 'Розмістіть оверлей субтитрів у фіксованому кутку — ніколи не рухайте під час стріму.',
        'li_4d': 'Скажіть 30 секунд тесту у своєму звичайному ритмі та перевірте затримку, точність і перетин з HUD.',
        'h2_pitfalls': 'Часті пастки субтитрів у стримерів',
        'pf_a': "<strong>Перетин субтитрів з HUD:</strong> у момент клатча субтитри закривають кіллфід. Розміщуйте субтитри поза постійними зонами HUD гри.",
        'pf_b': "<strong>Дрейф затримки на довгих стрімах:</strong> через 3+ годин деякі AI-субтитри відстають. На марафонських стрімах перезапускайте інструмент кожні 2 години.",
        'pf_c': "<strong>Мікро-онлі сетап ловить ігрове аудіо:</strong> трапляється при mix-back на аудіо-інтерфейсі. Перевірте ексклюзивність джерела мікрофона в аудіо-налаштуваннях OBS.",
        'h2_faq': 'Поширені запитання',
        'q1': "Чи бачать Twitch-глядачі субтитри автоматично?", 'a1': "Лише якщо ваш енкодер шле CEA-608/708 субтитри І глядачі вмикають CC у плеєрі. Більшість стримерів віддають перевагу OBS оверлею, щоб субтитри завжди були видні.",
        'q2': "Чи знизять субтитри продуктивність стріму?", 'a2': "Субтитрування навантажує CPU або GPU. На сучасних системах менше 5% CPU; на тугому бюджеті енкодера — менша модель ASR або винесення на другу машину.",
        'q3': "Чи можна субтитрувати стрім одразу двома мовами?", 'a3': "Так, з десктопним шаром субтитрів, що підтримує джерело + ціль. Запікайте двомовні субтитри в OBS для світової аудиторії.",
        'h2_refs': 'Джерела',
        'ref1_url': REF1_URL, 'ref1_label': 'Twitch — документація Closed Captions',
        'ref2_url': REF2_URL, 'ref2_label': 'OBS Studio офіційно',
        'ref3_url': REF3_URL, 'ref3_label': 'YouTube Help — автоматичні субтитри',
        'related_label': 'Схожі матеріали',
        'related': [('25', 'Живі субтитри 2026: як працюють AI-субтитри і коли їх використовувати'), ('24', 'Транскрибація аудіо в текст 2026: реал-тайм vs батч-транскрипція'), ('23', 'Голосовий перекладач у 2026 році: інструменти реального часу за сценаріями')],
        'cta_title': 'Субтитри стріму, що ловлять і ігровий звук, І ваш голос',
        'cta_body': "Системні субтитри + реал-тайм переклад для стримерів — захоплюйте в OBS і випускайте стрім із субтитрами за хвилини.",
        'cta_button': 'Завантажити з Microsoft Store',
    },
    'ar': {
        'title': "تعليقات المذيعين في 2026: سير عمل OBS وTwitch وYouTube Live",
        'description': "كيفية إضافة تعليقات حية إلى بثك على Twitch وYouTube Live وKick وDiscord — باستخدام تراكب OBS وCC الأصلي للمنصة وأدوات التعليقات بالذكاء الاصطناعي دون كسر تخطيط البث.",
        'keywords': "تعليقات للمذيعين, تعليقات twitch, تعليقات youtube live, تراكب تعليقات obs, بث تعليقات حية, تعليقات بث 2026",
        'og_description': "أضف تعليقات حية إلى بثك دون كسر التخطيط — مقارنة بين تراكب OBS وCC الأصلي وتعليقات الذكاء الاصطناعي.",
        'image_alt': "تعليقات حية مغطاة على إعداد بث Twitch",
        'home_label': 'الرئيسية', 'articles_label': 'المقالات',
        'breadcrumb_short': 'تعليقات المذيعين 2026',
        'back_link': 'العودة إلى المقالات', 'date_label': '28 مايو 2026',
        'author_label': 'الكاتب', 'updated_label': 'آخر تحديث',
        'twitter_description': "سير عمل التعليقات للمذيعين: مقارنة OBS وTwitch CC وأدوات الذكاء الاصطناعي.",
        'intro': "<strong>تعليقات المذيعين</strong> مشكلة مختلفة عن تعليقات الاجتماعات. لديك ثلاثة مصادر صوتية (اللعبة، الميكروفون، النظام)، وثلاثة وجهات للتعليقات (تراكب داخل البث، CC المنصة، VOD بعد البث)، وأسوأ نمط فشل ممكن: تعليقات تتأخر وتدمر توقيتك. اختيار سير عمل خاطئ، وتخطيطك ينهار في أسوأ لحظة.",
        'h2_1': 'ثلاثة مصادر صوتية، ثلاثة وجهات للتعليقات',
        'p_1': "جودة تعليقاتك لا تتجاوز جودة مصدر الصوت الذي تقرؤه. ابدأ من هناك:",
        'li_1a': "<strong>تعليقات الميكروفون فقط:</strong> تقرأ صوتك بنقاء، تتجاهل صوت اللعبة. الأفضل لبثوث الرأس الناطق (محادثة فقط، IRL، البودكاست). أقل تأخير.",
        'li_1b': "<strong>تعليقات صوت النظام:</strong> تقرأ صوت اللعبة بالإضافة إلى الميكروفون. الأفضل لألعاب السرد أو حفلات المشاهدة حيث تريد تعليقات لكل ما يحدث على الشاشة.",
        'li_1c': "<strong>تعليقات لكل مسار:</strong> مسارات صوت OBS موجهة بشكل منفصل إلى أداة التعليقات. الأفضل للبثوث التعاونية حيث تريد الحفاظ على إمكانية تحديد المتحدثين الفرديين.",
        'h2_2': 'مقارنة تعليقات المذيعين 2026',
        'th_1': 'الأداة', 'th_2': 'مكان ظهور التعليقات', 'th_3': 'نقاط القوة', 'th_4': 'القيود',
        't1c1': 'Twitch Closed Captions الأصلية', 't1c2': 'مشغل Twitch فقط', 't1c3': "مدمج في Twitch، مرئي للمشاهدين الذين يبدلون CC؛ يعمل في المشغل المحمول", 't1c4': 'يتطلب تدفق تعليقات CEA-608/708؛ ليست كل المُشفِّرات تدعم؛ تغطية لغوية محدودة',
        't2c1': 'تعليقات YouTube Live التلقائية', 't2c2': 'مشغل YouTube فقط', 't2c3': 'مجانية، مفعّلة تلقائيًا للعديد من اللغات، تستمر في VOD', 't2c4': 'تأخير 5–15 ثانية؛ قد تسقط في الكلام السريع',
        't3c1': 'تراكب OBS + مصدر تعليقات الذكاء الاصطناعي', 't3c2': 'محروقة في مخرجات البث', 't3c3': "التعليقات تبقى بصرف النظر عن المنصة؛ نفس التعليق على شاشة كل مشاهد؛ تحكم كامل في النمط", 't3c4': "التعليقات دائمة في التسجيل؛ لا يستطيع المشاهدون إيقافها",
        't4c1': 'Live Subtitles (نافذة تراكب سطح المكتب)', 't4c2': 'على شاشتك، قابل للالتقاط بواسطة OBS', 't4c3': "تعليقات صوت النظام + الترجمة؛ يلتقط اللعبة + الصوت؛ عبر المنصات", 't4c4': "يجب التقاط النافذة صراحةً في OBS للمشاركة مع المشاهدين",
        'h2_3': 'كيفية الاختيار حسب نوع البث',
        'h3_1': 'مذيعو Just Chatting / IRL',
        'p_3a': "استخدم تعليقات الميكروفون فقط مع تراكب OBS. التأخير أقل من 1.5 ثانية والدقة على صوتك المحدد (بعد عدة جلسات لتسخين ملف الكلام) هما المميِّز. CC Twitch الأصلي هو احتياط جيد ولكنك تفقد التحكم في النمط.",
        'h3_2': 'مذيعو الألعاب المتنوعة',
        'p_3b': "شغّل التعليقات على صوت النظام بحيث تظهر تعليقات حوار اللعبة أيضًا. اقفل صندوق التعليقات في زاوية لا تتداخل مع إطار كاميرا الويب. اختبر بثلاثة أنواع ألعاب على الأقل قبل البث المباشر — يختلف مزج صوت اللعبة بشكل كبير بين العناوين.",
        'h3_3': 'الجمهور متعدد اللغات / الدولي',
        'p_3c': "استخدم طبقة تعليقات سطح المكتب التي تدعم الترجمة جنبًا إلى جنب مع لغة المصدر. احرق التعليقات ثنائية اللغة في OBS بحيث يراها المشاهدون في أي منطقة دون تبديل CC.",
        'h2_4': 'قائمة فحص إعداد ما قبل البث (10 دقائق)',
        'li_4a': 'تحقق من أن مصدر الميكروفون ومصدر صوت اللعبة على مسارات OBS منفصلة.',
        'li_4b': 'قم بتكوين أداة التعليقات لقراءة الميكروفون أو صوت النظام (حسب نوع البث).',
        'li_4c': 'ضع تراكب التعليقات في زاوية ثابتة — لا تحركها أبدًا أثناء البث.',
        'li_4d': 'تحدث اختبار 30 ثانية بإيقاعك المعتاد وتحقق من التأخير والدقة والتداخل مع HUD.',
        'h2_pitfalls': 'مزالق التعليقات الشائعة للمذيعين',
        'pf_a': "<strong>تداخل التعليقات مع HUD:</strong> في اللحظة الحاسمة، تحجب تعليقاتك تغذية القتل. ضع التعليقات خارج المناطق الدائمة في HUD اللعبة.",
        'pf_b': "<strong>انجراف التأخير في البثوث الطويلة:</strong> بعد 3+ ساعات، تتأخر بعض أدوات التعليقات الذكية عن الصوت. أعد تشغيل أداة التعليقات كل ساعتين خلال بثوث الماراثون.",
        'pf_c': "<strong>إعداد الميكروفون فقط الذي يلتقط صوت اللعبة:</strong> يحدث عندما تختلط واجهة الصوت الخاصة بك للخلف. تحقق من أن مصدر الميكروفون حصري في إعدادات صوت OBS.",
        'h2_faq': 'الأسئلة الشائعة',
        'q1': "هل يرى مشاهدو Twitch التعليقات تلقائيًا؟", 'a1': "فقط إذا كان المُشفِّر الخاص بك يرسل تعليقات CEA-608/708 ومشاهديك يبدلون CC في المشغل. يفضل معظم المذيعين تراكب OBS لتكون التعليقات مرئية دائمًا.",
        'q2': "هل ستضر التعليقات بأداء البث؟", 'a2': "يعمل التعليق على وحدة المعالجة المركزية أو وحدة معالجة الرسومات. في الأنظمة الحديثة، تقل التكلفة عن 5٪ من وحدة المعالجة المركزية؛ في ميزانيات المُشفِّر الضيقة، استخدم نموذج ASR أصغر أو نقل الحمل إلى جهاز ثاني.",
        'q3': "هل يمكنني التعليق على بث بلغتين في وقت واحد؟", 'a3': "نعم مع طبقة تعليقات سطح المكتب التي تدعم المصدر + الهدف. احرق التعليقات ثنائية اللغة في OBS للجمهور العالمي.",
        'h2_refs': 'المراجع',
        'ref1_url': REF1_URL, 'ref1_label': 'Twitch — وثائق Closed Captions',
        'ref2_url': REF2_URL, 'ref2_label': 'OBS Studio الرسمي',
        'ref3_url': REF3_URL, 'ref3_label': 'مساعدة YouTube — التعليقات التلقائية',
        'related_label': 'قراءات ذات صلة',
        'related': [('25', 'التعليقات الحية في 2026: كيف تعمل تعليقات الذكاء الاصطناعي ومتى تستخدمها'), ('24', 'تحويل الصوت إلى نص في 2026: مقارنة بين التفريغ الفوري والمجمّع'), ('23', 'تطبيقات الترجمة الصوتية في 2026: مقارنة الأدوات الفورية حسب الاستخدام')],
        'cta_title': 'تعليقات بث تلتقط صوت اللعبة وصوتك',
        'cta_body': "تعليقات صوت النظام بالإضافة إلى الترجمة الفورية للمذيعين — التقط في OBS وأطلق بثًا مع تعليقات في دقائق.",
        'cta_button': 'تنزيل من Microsoft Store',
    },
    'hi': {
        'title': "2026 में स्ट्रीमर्स के लिए कैप्शन: OBS, Twitch, YouTube Live वर्कफ़्लो",
        'description': "अपने Twitch, YouTube Live, Kick और Discord स्ट्रीम में लाइव कैप्शन कैसे जोड़ें — अपनी स्ट्रीम लेआउट को तोड़े बिना OBS ओवरले, नेटिव प्लेटफ़ॉर्म CC, और AI कैप्शनिंग टूल का उपयोग करके।",
        'keywords': "स्ट्रीमर्स के लिए कैप्शन, twitch कैप्शन, youtube live कैप्शन, obs कैप्शन ओवरले, लाइव कैप्शन स्ट्रीमिंग, स्ट्रीम सबटाइटल 2026",
        'og_description': "लेआउट तोड़े बिना अपनी स्ट्रीम में लाइव कैप्शन जोड़ें — OBS ओवरले, नेटिव CC, AI कैप्शनिंग की तुलना।",
        'image_alt': "Twitch स्ट्रीमिंग सेटअप पर ओवरले किए गए लाइव कैप्शन",
        'home_label': 'मुखपृष्ठ', 'articles_label': 'लेख',
        'breadcrumb_short': '2026 में स्ट्रीमर्स के लिए कैप्शन',
        'back_link': 'लेखों पर वापस', 'date_label': '28 मई 2026',
        'author_label': 'लेखक', 'updated_label': 'अद्यतन',
        'twitter_description': "स्ट्रीमर कैप्शनिंग वर्कफ़्लो: OBS, Twitch CC, AI टूल की तुलना।",
        'intro': "<strong>स्ट्रीमर्स के लिए कैप्शन</strong> मीटिंग कैप्शन से अलग समस्या है। आपके पास तीन ऑडियो स्रोत हैं (गेम, माइक, सिस्टम), तीन कैप्शन गंतव्य (इन-स्ट्रीम ओवरले, प्लेटफ़ॉर्म CC, पोस्ट-VOD), और सबसे खराब संभव विफलता मोड: कैप्शन जो पिछड़ते हैं और आपका टाइमिंग बर्बाद करते हैं। ग़लत वर्कफ़्लो और आपका लेआउट सबसे ख़राब क्षण में टूट जाता है।",
        'h2_1': 'तीन ऑडियो स्रोत, तीन कैप्शन गंतव्य',
        'p_1': "आपके कैप्शन उतने ही अच्छे हो सकते हैं जितने वे जिस ऑडियो स्रोत को पढ़ते हैं। वहीं से शुरू करें:",
        'li_1a': "<strong>केवल-माइक कैप्शनिंग:</strong> आपकी आवाज़ को साफ़ पढ़ता है, गेम ऑडियो को अनदेखा करता है। टॉकिंग-हेड स्ट्रीम (Just Chatting, IRL, पॉडकास्ट) के लिए सबसे अच्छा। सबसे कम लेटेंसी।",
        'li_1b': "<strong>सिस्टम ऑडियो कैप्शनिंग:</strong> गेम ऑडियो और माइक दोनों पढ़ता है। नैरेटिव गेम या वॉच पार्टी के लिए सबसे अच्छा जहाँ आप स्क्रीन पर होने वाली हर चीज़ को कैप्शन करना चाहते हैं।",
        'li_1c': "<strong>प्रति ट्रैक कैप्शनिंग:</strong> OBS ऑडियो ट्रैक अलग-अलग कैप्शन टूल पर रूट किए जाते हैं। कोलैब स्ट्रीम के लिए सबसे अच्छा जहाँ आप अलग-अलग वक्ताओं को पहचानने योग्य रखना चाहते हैं।",
        'h2_2': '2026 स्ट्रीमर कैप्शन तुलना',
        'th_1': 'टूल', 'th_2': 'कैप्शन कहाँ दिखते हैं', 'th_3': 'मज़बूती', 'th_4': 'सीमाएँ',
        't1c1': 'Twitch नेटिव Closed Captions', 't1c2': 'केवल Twitch प्लेयर', 't1c3': "Twitch में निर्मित, CC टॉगल करने वाले दर्शकों को दिखाई देता है; मोबाइल प्लेयर पर काम करता है", 't1c4': 'CEA-608/708 कैप्शन स्ट्रीम की आवश्यकता; सभी एनकोडर समर्थन नहीं करते; सीमित भाषा कवरेज',
        't2c1': 'YouTube Live स्वचालित कैप्शन', 't2c2': 'केवल YouTube प्लेयर', 't2c3': 'मुफ़्त, कई भाषाओं के लिए स्वतः सक्षम, VOD पर बना रहता है', 't2c4': '5–15 सेकंड का अंतराल; तेज़ भाषण के दौरान गिर सकता है',
        't3c1': 'OBS ओवरले + AI कैप्शन स्रोत', 't3c2': 'आपके स्ट्रीम आउटपुट में जला हुआ', 't3c3': "प्लेटफ़ॉर्म से स्वतंत्र कैप्शन; हर दर्शक की स्क्रीन पर एक ही कैप्शन; पूर्ण स्टाइलिंग नियंत्रण", 't3c4': "रिकॉर्डिंग में स्थायी कैप्शन; दर्शक टॉगल ऑफ़ नहीं कर सकते",
        't4c1': 'Live Subtitles (डेस्कटॉप ओवरले विंडो)', 't4c2': 'आपकी स्क्रीन पर, OBS द्वारा कैप्चर योग्य', 't4c3': 'सिस्टम-ऑडियो कैप्शनिंग + अनुवाद; गेम + आवाज़ कैप्चर करता है; प्लेटफ़ॉर्म के पार', 't4c4': "दर्शकों के साथ साझा करने के लिए आपको OBS में स्पष्ट रूप से विंडो कैप्चर करनी होगी",
        'h2_3': 'स्ट्रीम प्रकार से कैसे चुनें',
        'h3_1': 'Just Chatting / IRL स्ट्रीमर',
        'p_3a': "OBS ओवरले के साथ केवल-माइक कैप्शनिंग का उपयोग करें। 1.5 सेकंड से कम की लेटेंसी और आपकी विशिष्ट आवाज़ पर सटीकता (कुछ स्पीच-प्रोफ़ाइल वार्मअप सत्रों के बाद) विभेदक है। Twitch नेटिव CC एक बढ़िया फ़ॉलबैक है लेकिन आप स्टाइलिंग नियंत्रण खो देते हैं।",
        'h3_2': 'विविधता वाले गेमिंग स्ट्रीमर',
        'p_3b': "सिस्टम ऑडियो पर कैप्शन चलाएँ ताकि गेम संवाद भी कैप्शन हो जाए। कैप्शन बॉक्स को एक कोने में लॉक करें जो आपके वेबकैम फ़्रेम के साथ ओवरलैप नहीं होता। लाइव होने से पहले कम से कम तीन गेम शैलियों के साथ परीक्षण करें — गेम ऑडियो मिक्स खिताबों के बीच काफ़ी भिन्न होता है।",
        'h3_3': 'बहुभाषी / अंतर्राष्ट्रीय दर्शक',
        'p_3c': "एक डेस्कटॉप कैप्शनिंग परत का उपयोग करें जो स्रोत भाषा के साथ अनुवाद का समर्थन करती है। द्विभाषी कैप्शन को OBS में जलाएँ ताकि किसी भी क्षेत्र के दर्शक उन्हें CC टॉगल किए बिना देख सकें।",
        'h2_4': 'प्री-स्ट्रीम सेटअप चेकलिस्ट (10 मिनट)',
        'li_4a': 'सत्यापित करें कि आपका माइक्रोफ़ोन स्रोत और गेम ऑडियो स्रोत अलग OBS ट्रैक पर हैं।',
        'li_4b': 'कैप्शन टूल को माइक या सिस्टम ऑडियो (स्ट्रीम प्रकार के अनुसार) पढ़ने के लिए कॉन्फ़िगर करें।',
        'li_4c': 'कैप्शन ओवरले को एक निश्चित कोने में रखें — स्ट्रीम के दौरान कभी न हिलाएँ।',
        'li_4d': 'अपनी सामान्य लय में 30 सेकंड का परीक्षण बोलें और लेटेंसी, सटीकता, और HUD के साथ ओवरलैप की जाँच करें।',
        'h2_pitfalls': 'सामान्य स्ट्रीमर कैप्शनिंग जाल',
        'pf_a': "<strong>HUD के साथ कैप्शन ओवरलैप:</strong> महत्वपूर्ण क्षण में आपके कैप्शन किल फ़ीड को ब्लॉक करते हैं। गेम HUD स्थायी ज़ोन के बाहर कैप्शन रखें।",
        'pf_b': "<strong>लंबे स्ट्रीम में लेटेंसी ड्रिफ़्ट:</strong> 3+ घंटे के बाद, कुछ AI कैप्शनर ऑडियो से पिछड़ जाते हैं। मैराथन स्ट्रीम के दौरान हर 2 घंटे में कैप्शन टूल को पुनरारंभ करें।",
        'pf_c': "<strong>गेम ऑडियो कैप्चर करने वाला माइक-ऑनली सेटअप:</strong> तब होता है जब आपका ऑडियो इंटरफ़ेस वापस मिक्स करता है। OBS ऑडियो सेटिंग्स में सत्यापित करें कि माइक स्रोत विशिष्ट है।",
        'h2_faq': 'पूछे जाने वाले प्रश्न',
        'q1': "क्या Twitch दर्शक स्वचालित रूप से कैप्शन देखते हैं?", 'a1': "केवल अगर आपका एनकोडर CEA-608/708 कैप्शन भेजता है और दर्शक प्लेयर में CC टॉगल करते हैं। अधिकांश स्ट्रीमर OBS ओवरले पसंद करते हैं ताकि कैप्शन हमेशा दिखाई दें।",
        'q2': "क्या कैप्शन मेरे स्ट्रीम के प्रदर्शन को नुकसान पहुँचाएँगे?", 'a2': "कैप्शनिंग आपके CPU या GPU पर चलती है। आधुनिक सिस्टम पर लागत 5% CPU से कम है; तंग एनकोडर बजट पर, छोटा ASR मॉडल उपयोग करें या दूसरी मशीन पर ऑफ़लोड करें।",
        'q3': "क्या मैं एक साथ दो भाषाओं में स्ट्रीम कैप्शन कर सकता हूँ?", 'a3': "हाँ, स्रोत + लक्ष्य का समर्थन करने वाली डेस्कटॉप कैप्शनिंग परत के साथ। वैश्विक दर्शकों के लिए OBS में द्विभाषी कैप्शन जलाएँ।",
        'h2_refs': 'संदर्भ',
        'ref1_url': REF1_URL, 'ref1_label': 'Twitch — Closed Captions दस्तावेज़',
        'ref2_url': REF2_URL, 'ref2_label': 'OBS Studio आधिकारिक',
        'ref3_url': REF3_URL, 'ref3_label': 'YouTube सहायता — स्वचालित कैप्शन',
        'related_label': 'संबंधित पठन',
        'related': [('25', '2026 में लाइव कैप्शन: AI कैप्शन कैसे काम करते हैं और कब उपयोग करें'), ('24', '2026 में ऑडियो को टेक्स्ट में बदलें: रीयल-टाइम vs बैच ट्रांसक्रिप्शन'), ('23', '2026 में आवाज़ अनुवाद ऐप्स: उपयोग के मामले के अनुसार रीयल-टाइम तुलना')],
        'cta_title': 'गेम ऑडियो और आपकी आवाज़ दोनों को कैप्चर करने वाले स्ट्रीम कैप्शन',
        'cta_body': "स्ट्रीमर्स के लिए सिस्टम-ऑडियो कैप्शनिंग और रीयल-टाइम अनुवाद — OBS में कैप्चर करें और मिनटों में कैप्शन वाली स्ट्रीम भेजें।",
        'cta_button': 'Microsoft Store से डाउनलोड करें',
    },
    'nl': {
        'title': "Ondertiteling voor streamers in 2026: OBS, Twitch, YouTube Live workflow",
        'description': "Hoe je live ondertiteling toevoegt aan je Twitch-, YouTube Live-, Kick- en Discord-stream — met OBS-overlay, native platform CC en AI-ondertitelingstools zonder je stream-layout te verstoren.",
        'keywords': "ondertiteling voor streamers, twitch ondertiteling, youtube live ondertiteling, obs ondertiteling overlay, live caption streaming, stream ondertiteling 2026",
        'og_description': "Voeg live ondertiteling toe aan je stream zonder de layout te verstoren — OBS-overlay, native CC en AI-ondertiteling vergeleken.",
        'image_alt': "Live ondertiteling over een Twitch-streamingopstelling",
        'home_label': 'Home', 'articles_label': 'Artikelen',
        'breadcrumb_short': 'Ondertiteling voor streamers 2026',
        'back_link': 'Terug naar artikelen', 'date_label': '28 mei 2026',
        'author_label': 'Auteur', 'updated_label': 'Bijgewerkt',
        'twitter_description': "Streamer-ondertitelingsworkflow: OBS, Twitch CC, AI-tools vergeleken.",
        'intro': "<strong>Ondertiteling voor streamers</strong> is een ander probleem dan vergader-ondertiteling. Je hebt drie audiobronnen (game, mic, systeem), drie ondertitelingsbestemmingen (in-stream overlay, platform CC, post-VOD), en de slechtst mogelijke faalmodus: ondertiteling die achterloopt en je timing verpest. Verkeerde workflow en je layout breekt op het slechtste moment.",
        'h2_1': 'Drie audiobronnen, drie ondertitelingsbestemmingen',
        'p_1': "Je ondertitels zijn alleen zo goed als de audiobron die ze lezen. Begin daar:",
        'li_1a': "<strong>Alleen-mic ondertiteling:</strong> leest je stem schoon, negeert game-audio. Beste voor talking-head streams (Just Chatting, IRL, podcasts). Laagste latency.",
        'li_1b': "<strong>Systeemaudio-ondertiteling:</strong> leest game-audio plus mic. Beste voor narratieve games of watch parties waar je alles op het scherm wilt ondertitelen.",
        'li_1c': "<strong>Per-track ondertiteling:</strong> OBS-audiotracks afzonderlijk gerouteerd naar de ondertitelingstool. Beste voor collab-streams waar je individuele sprekers herkenbaar wilt houden.",
        'h2_2': '2026 streamer-ondertiteling vergeleken',
        'th_1': 'Tool', 'th_2': 'Waar ondertiteling verschijnt', 'th_3': 'Sterke punten', 'th_4': 'Beperkingen',
        't1c1': 'Twitch native Closed Captions', 't1c2': 'Alleen Twitch-speler', 't1c3': "Ingebouwd in Twitch, zichtbaar voor kijkers die CC inschakelen; werkt op mobiele speler", 't1c4': 'Vereist CEA-608/708 ondertitelingsstroom; niet alle encoders ondersteunen; beperkte taaldekking',
        't2c1': 'YouTube Live automatische ondertiteling', 't2c2': 'Alleen YouTube-speler', 't2c3': 'Gratis, automatisch ingeschakeld voor veel talen, blijft op VOD', 't2c4': '5–15 s vertraging; kan wegvallen bij snel spreken',
        't3c1': 'OBS-overlay + AI-ondertitelingsbron', 't3c2': 'Ingebrand in je streamoutput', 't3c3': "Ondertiteling blijft ongeacht platform; zelfde ondertiteling op elk kijkerscherm; volledige stylingcontrole", 't3c4': "Ondertiteling permanent in de opname; kijkers kunnen niet uitschakelen",
        't4c1': 'Live Subtitles (desktop overlay-venster)', 't4c2': 'Op je scherm, vastlegbaar door OBS', 't4c3': 'Systeemaudio-ondertiteling + vertaling; vangt game + stem; tussen platforms', 't4c4': "Je moet het venster expliciet vastleggen in OBS om met kijkers te delen",
        'h2_3': 'Hoe te kiezen per streamtype',
        'h3_1': 'Just Chatting / IRL streamers',
        'p_3a': "Gebruik alleen-mic ondertiteling met OBS-overlay. Latency onder 1,5 s en nauwkeurigheid op je specifieke stem (na enkele opwarmingssessies met spraakprofiel) is het verschil. Twitch native CC is een prima fallback maar je verliest stylingcontrole.",
        'h3_2': 'Variëteit gaming streamers',
        'p_3b': "Draai ondertiteling op systeemaudio zodat ook gamedialoog wordt ondertiteld. Vergrendel de ondertitelingsbox in een hoek die niet overlapt met je webcam-frame. Test met minstens drie game-genres voordat je live gaat — game-audio mix verschilt sterk tussen titels.",
        'h3_3': 'Meertalige / internationale doelgroepen',
        'p_3c': "Gebruik een desktop ondertitelingslaag die vertaling naast de brontaal ondersteunt. Brand de tweetalige ondertiteling in OBS zodat kijkers in elke regio ze zonder CC-schakelen zien.",
        'h2_4': 'Pre-stream setup-checklist (10 minuten)',
        'li_4a': 'Verifieer dat je microfoonbron en game-audiobron op aparte OBS-tracks staan.',
        'li_4b': 'Configureer ondertitelingstool om mic of systeemaudio te lezen (afhankelijk van streamtype).',
        'li_4c': 'Positioneer de ondertitelingsoverlay in een vaste hoek — verplaats hem nooit tijdens de stream.',
        'li_4d': 'Spreek 30 seconden testend in je gebruikelijke ritme en controleer latency, nauwkeurigheid en overlap met HUD.',
        'h2_pitfalls': 'Gangbare valkuilen bij streamer-ondertiteling',
        'pf_a': "<strong>Ondertitelings-overlap met HUD:</strong> op het cruciale moment blokkeren je ondertitels de kill feed. Plaats ondertitels buiten permanente HUD-zones van het spel.",
        'pf_b': "<strong>Latency-drift over lange streams:</strong> na 3+ uur drijven sommige AI-ondertitelaars achter de audio aan. Herstart de ondertitelingstool elke 2 uur tijdens marathonstreams.",
        'pf_c': "<strong>Alleen-mic setup die game-audio vangt:</strong> gebeurt wanneer je audio-interface terug mixt. Verifieer dat de mic-bron exclusief is in OBS-audio-instellingen.",
        'h2_faq': 'Veelgestelde vragen',
        'q1': "Zien Twitch-kijkers automatisch ondertiteling?", 'a1': "Alleen als je encoder CEA-608/708 ondertiteling verzendt EN kijkers CC in de speler inschakelen. De meeste streamers prefereren OBS-overlay zodat ondertiteling altijd zichtbaar is.",
        'q2': "Schaden ondertitels de prestaties van mijn stream?", 'a2': "Ondertiteling draait op je CPU of GPU. Op moderne systemen is de kost onder 5% CPU; bij krap encoder-budget gebruik je een kleiner ASR-model of laad je af naar een tweede machine.",
        'q3': "Kan ik een stream tegelijk in twee talen ondertitelen?", 'a3': "Ja met een desktop ondertitelingslaag die bron + doel ondersteunt. Brand tweetalige ondertiteling in OBS voor wereldwijd publiek.",
        'h2_refs': 'Bronnen',
        'ref1_url': REF1_URL, 'ref1_label': 'Twitch — Closed Captions documentatie',
        'ref2_url': REF2_URL, 'ref2_label': 'OBS Studio officieel',
        'ref3_url': REF3_URL, 'ref3_label': 'YouTube-help — automatische ondertiteling',
        'related_label': 'Gerelateerde artikelen',
        'related': [('25', 'Live ondertiteling in 2026: hoe AI-ondertiteling werkt en wanneer te gebruiken'), ('24', 'Audio naar tekst transcriberen 2026: realtime vs batch-transcriptie vergeleken'), ('23', 'Spraakvertaling in 2026: realtime tools vergeleken per use case')],
        'cta_title': 'Stream-ondertiteling die game-audio EN je stem vangt',
        'cta_body': "Systeemaudio-ondertiteling plus realtime vertaling voor streamers — vang in OBS en lever een ondertitelde stream in minuten.",
        'cta_button': 'Download via Microsoft Store',
    },
}


def main():
    for locale, data in ART27.items():
        fp = os.path.join(ROOT, 'articles', locale, 'article-27.html')
        if os.path.exists(fp):
            print(f'  SKIP articles/{locale}/article-27.html (exists)')
            continue
        html = render(locale, data)
        with open(fp, 'w', encoding='utf-8') as f:
            f.write(html)
        print(f'  WROTE articles/{locale}/article-27.html')

    print(f'\nDone. article-27 generated for {len(ART27)} locales.')


if __name__ == '__main__':
    main()
