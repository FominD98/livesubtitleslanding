"""Generate article-25 (Live Captions explainer) and article-26 (AirPods Live Translation)
in remaining locales using a shared HTML template + per-locale content data.

Article-25: needs 12 more locales (zh, ko, ar, hi, es, fr, it, pl, pt, tr, uk, nl)
Article-26: needs all 16 locales (en, ja, de, ru, zh, ko, ar, hi, es, fr, it, pl, pt, tr, uk, nl)

Run idempotently — skips locales where file already exists.
"""
import os

ROOT = os.path.dirname(os.path.abspath(__file__))

ALL_LOCALES = ['en', 'ru', 'ja', 'zh', 'ko', 'ar', 'hi', 'de', 'es', 'fr', 'it', 'pl', 'pt', 'tr', 'uk', 'nl']
OG_LOCALES = {'en': 'en_US', 'ru': 'ru_RU', 'ja': 'ja_JP', 'zh': 'zh_CN', 'ko': 'ko_KR', 'ar': 'ar_SA',
              'hi': 'hi_IN', 'de': 'de_DE', 'es': 'es_ES', 'fr': 'fr_FR', 'it': 'it_IT', 'pl': 'pl_PL',
              'pt': 'pt_BR', 'tr': 'tr_TR', 'uk': 'uk_UA', 'nl': 'nl_NL'}


def hreflang_block(article_num: int) -> str:
    lines = [f'    <link rel="alternate" hreflang="x-default" href="https://live-subtitles.com/articles/en/article-{article_num}.html" />']
    for L in ALL_LOCALES:
        lines.append(f'    <link rel="alternate" hreflang="{L}" href="https://live-subtitles.com/articles/{L}/article-{article_num}.html" />')
    return '\n'.join(lines)


def render(locale: str, article_num: int, d: dict) -> str:
    """Render a single article HTML file."""
    dir_attr = ' dir="rtl"' if locale == 'ar' else ''
    og_locale = OG_LOCALES[locale]
    img_height = d.get('img_height', 781)
    # Related reading links to other articles (always use same-locale URLs)
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
    <link rel="canonical" href="https://live-subtitles.com/articles/{locale}/article-{article_num}.html" />
{hreflang_block(article_num)}
    <meta property="og:type" content="article">
    <meta property="og:title" content="{d['title']}">
    <meta property="og:description" content="{d['og_description']}">
    <meta property="og:url" content="https://live-subtitles.com/articles/{locale}/article-{article_num}.html">
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
      "author": {{ "@type": "Person", "name": "{d['author_name']}", "url": "{d['author_url']}", "jobTitle": "{d['author_role']}" }},
      "publisher": {{ "@type": "Organization", "name": "Live Subtitles" }},
      "description": "{d['description']}",
      "mainEntityOfPage": "https://live-subtitles.com/articles/{locale}/article-{article_num}.html"
    }}
    </script>
    <script type="application/ld+json">
    {{
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {{ "@type": "ListItem", "position": 1, "name": "{d['home_label']}", "item": "https://live-subtitles.com/{locale}/" }},
        {{ "@type": "ListItem", "position": 2, "name": "{d['articles_label']}", "item": "https://live-subtitles.com/articles/{locale}/" }},
        {{ "@type": "ListItem", "position": 3, "name": "{d['breadcrumb_short']}", "item": "https://live-subtitles.com/articles/{locale}/article-{article_num}.html" }}
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
        <div class="article-author" style="color:#aaa; font-size:0.95rem; margin-bottom:1.5rem;">{d['author_label']}: <a href="{d['author_url']}" rel="author" style="color:#00b8ff; text-decoration:none;">{d['author_name']}</a> &middot; {d['author_role']}</div>
        <div class="article-updated" itemprop="dateModified" content="2026-05-28" style="color:#888; font-size:0.9rem; margin-bottom:1.5rem;">{d['updated_label']}: {d['date_label']}</div>
        <img class="article-hero" src="/articles/img/{locale}/meetings.webp" alt="{d['image_alt']}" width="1280" height="{img_height}" loading="eager" decoding="async" fetchpriority="high" style="display:block; width:100%; height:auto; border-radius:8px; margin:0 0 1.5rem 0;">

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
                    <tr><td>{d['t5c1']}</td><td>{d['t5c2']}</td><td>{d['t5c3']}</td><td>{d['t5c4']}</td></tr>
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

            <h2>{d['h2_faq']}</h2>
            <p><strong>{d['q1']}</strong><br>{d['a1']}</p>
            <p><strong>{d['q2']}</strong><br>{d['a2']}</p>
            <p><strong>{d['q3']}</strong><br>{d['a3']}</p>

            <h2>{d['h2_refs']}</h2>
            <ul>
                <li><a href="{d['ref1_url']}" target="_blank" rel="noopener noreferrer" style="color:#00b8ff;">{d['ref1_label']}</a></li>
                <li><a href="{d['ref2_url']}" target="_blank" rel="noopener noreferrer" style="color:#00b8ff;">{d['ref2_label']}</a></li>
                <li><a href="{d['ref3_url']}" target="_blank" rel="noopener noreferrer" style="color:#00b8ff;">{d['ref3_label']}</a></li>
                <li><a href="{d['ref4_url']}" target="_blank" rel="noopener noreferrer" style="color:#00b8ff;">{d['ref4_label']}</a></li>
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


# ============================================================================
# ARTICLE-25 CONTENT DATA (Live Captions explainer)
# Author: Hiroshi Tanaka - Gaming Overlay Engineer
# ============================================================================

ART25_AUTHOR_NAME = 'Hiroshi Tanaka'
ART25_AUTHOR_URL = 'https://live-subtitles.com/about/team/hiroshi-tanaka.html'
ART25_AUTHOR_ROLES = {
    'en': 'Gaming Overlay Engineer, Live Subtitles',
    'zh': '游戏覆盖层工程师, Live Subtitles',
    'ko': '게이밍 오버레이 엔지니어, Live Subtitles',
    'ar': 'مهندس واجهات الألعاب, Live Subtitles',
    'hi': 'गेमिंग ओवरले इंजीनियर, Live Subtitles',
    'es': 'ingeniero de overlays de gaming, Live Subtitles',
    'fr': 'ingénieur overlays gaming, Live Subtitles',
    'it': 'ingegnere overlay gaming, Live Subtitles',
    'pl': 'inżynier nakładek gamingowych, Live Subtitles',
    'pt': 'engenheiro de overlays de games, Live Subtitles',
    'tr': 'oyun overlay mühendisi, Live Subtitles',
    'uk': 'інженер ігрових оверлеїв, Live Subtitles',
    'nl': 'gaming overlay engineer, Live Subtitles',
}

ART25 = {
    'zh': {
        'title': '2026 年实时字幕：AI 字幕的工作原理及使用场景',
        'description': '解析实时字幕：AI 如何在 2 秒内将语音转为文本，它们在 Windows、Mac、Android、iOS 与 Chrome 上出现在哪里，何时哪种方案胜出。',
        'keywords': '实时字幕, 直播字幕, AI 字幕, 实时副标题, 自动字幕, 实时字幕 2026',
        'og_description': 'AI 实时字幕的工作原理，跨 OS、浏览器、应用层的展示位置，以及各自的胜出场景。',
        'image_alt': '实时对话中屏幕上出现的实时字幕',
        'home_label': '首页', 'articles_label': '文章',
        'breadcrumb_short': '2026 年实时字幕',
        'back_link': '返回文章', 'date_label': '2026 年 5 月 28 日',
        'author_label': '作者', 'updated_label': '更新',
        'twitter_description': '关于 Windows、Apple、Android、Chrome 和第三方实时字幕层的 2026 年解说。',
        'intro': '<strong>实时字幕</strong>听起来像单一功能，但这个词背后藏着三种截然不同的实现：操作系统覆盖层、浏览器内置字幕和第三方字幕层。每种都在不同场景下取胜，「直接打开字幕」会掩盖出人意料的平台不对称。',
        'h2_1': '三种出现实时字幕的层',
        'p_1': '同一个「字幕」隐藏了三种非常不同的实现：',
        'li_1a': '<strong>OS 级字幕：</strong>操作系统监听系统音频并在浮动窗口渲染字幕。例：Windows 11 Live Captions、macOS Live Captions、Android Live Caption。',
        'li_1b': '<strong>浏览器级字幕：</strong>浏览器从任意标签页捕获音频，只为该标签页显示字幕。例：Chrome Live Caption。',
        'li_1c': '<strong>应用级字幕：</strong>会议或媒体应用在自己的窗口生成字幕。例：Zoom、Microsoft Teams、Google Meet、YouTube。',
        'h2_2': '2026 年比较：何时使用哪种实时字幕',
        'th_1': '提供方', 'th_2': '层', 'th_3': '优势', 'th_4': '限制',
        't1c1': 'Windows 11 Live Captions', 't1c2': 'OS 级', 't1c3': '跨所有桌面应用，设备端隐私，免费', 't1c4': '英语以外的语言覆盖有限',
        't2c1': 'macOS Live Captions', 't2c2': 'OS 级', 't2c3': 'Apple Silicon 上的系统级字幕，设备端', 't2c4': '需要较新 macOS；语言列表较窄',
        't3c1': 'Chrome Live Caption', 't3c2': '浏览器级', 't3c3': '在任何播放音频的标签页工作；本地运行', 't3c4': '仅限标签页；在很多地区仅英语',
        't4c1': 'Zoom / Teams / Meet 字幕', 't4c2': '应用级', 't4c3': '最佳的说话人标签与会议上下文', 't4c4': '各平台覆盖与管理员策略不同',
        't5c1': 'Live Subtitles', 't5c2': 'OS 级 + 双语', 't5c3': '跨应用字幕加实时翻译；跨 Windows 与 macOS 工作', 't5c4': '需要第三方安装；OS 未预装',
        'h2_3': '哪种层在什么时候取胜',
        'h3_1': 'OS 级取胜，当', 'p_3a': '你一天在不同应用间切换 —— 早上会议、午餐 Netflix、下午播客。一个 OS 层跟着你。注重隐私的用例也偏好 OS 级，因为音频不离开设备。',
        'h3_2': '应用级取胜，当', 'p_3b': '你整天待在同一个会议平台，需要参会者名字作为说话人标签，或管理员在 Teams/Meet/Zoom 中部署了翻译字幕。',
        'h3_3': '第三方跨应用取胜，当', 'p_3c': '你需要字幕之外的翻译（OS 原生通常同语言），双语显示用于学习，或在不附带原生字幕的平台（Discord 语音、OBS 流、录制视频文件）上需要字幕。',
        'h2_4': '设置清单',
        'li_4a': '识别你的主要场景：桌面、移动、浏览器或特定应用。',
        'li_4b': '先尝试原生 OS 字幕 —— 免费且无需安装。',
        'li_4c': '如果需要翻译或多应用覆盖，添加第三方层。',
        'li_4d': '不要在同一上下文堆叠两个字幕层：它们会视觉错位。',
        'h2_faq': '常见问题',
        'q1': '实时字幕离线工作吗？', 'a1': 'Windows 11、macOS 和近期 Android 的 OS 级字幕是设备端。应用级通常需要服务器。',
        'q2': '我能同时获得两种语言的实时字幕吗？', 'a2': '原生 OS 字幕通常只是源语言。双语需要第三方层。',
        'q3': '实时字幕会取代字幕吗？', 'a3': '对于直播音频是的；对于预录制的影视则否 —— 脚本字幕仍在工艺上胜过 ASR。',
        'h2_refs': '参考资料',
        'ref1_url': 'https://support.microsoft.com/en-us/windows/use-live-captions-to-better-understand-audio-4ffec0d6-5999-4b86-a39e-fe779ac15f04', 'ref1_label': 'Microsoft — 在 Windows 上使用 Live Captions',
        'ref2_url': 'https://support.apple.com/en-us/HT213295', 'ref2_label': 'Apple — Mac 上的 Live Captions',
        'ref3_url': 'https://support.google.com/accessibility/android/answer/9350862', 'ref3_label': 'Google — Android Live Caption',
        'ref4_url': 'https://support.google.com/chrome/answer/10538231', 'ref4_label': 'Google — Chrome Live Caption',
        'related_label': '相关阅读',
        'related': [('24', '2026 年音频转文字：实时 vs 批量转录对比'), ('23', '2026 年语音翻译应用：按使用场景比较实时工具'), ('18', '2026 年 Google Meet vs Zoom vs Teams 翻译字幕')],
        'cta_title': '跨所有应用的实时字幕，附带实时翻译',
        'cta_body': '跨应用实时字幕与双语翻译 —— 任何有音频的地方。',
        'cta_button': '从 Microsoft Store 下载',
        'img_height': 781,
    },
    'ko': {
        'title': '2026년 라이브 자막: AI 자막이 작동하는 방식과 사용 시점',
        'description': '라이브 자막 설명: AI가 2초 이내에 음성을 텍스트로 변환하는 방법, Windows · Mac · Android · iOS · Chrome 어디에 나타나는지, 어느 옵션이 언제 승리하는지.',
        'keywords': '라이브 자막, 실시간 자막, AI 자막, 자동 자막, 라이브 캡션 2026',
        'og_description': 'AI 라이브 자막의 작동 방식, OS · 브라우저 · 앱 레이어별 표시 위치, 어느 옵션이 언제 승리하는지.',
        'image_alt': '실시간 대화 중 화면에 표시되는 라이브 자막',
        'home_label': '홈', 'articles_label': '기사',
        'breadcrumb_short': '2026년 라이브 자막',
        'back_link': '기사 목록으로 돌아가기', 'date_label': '2026년 5월 28일',
        'author_label': '저자', 'updated_label': '업데이트',
        'twitter_description': 'Windows, Apple, Android, Chrome 및 제3자 라이브 자막 레이어를 다루는 2026 가이드.',
        'intro': '<strong>라이브 자막</strong>은 하나의 기능처럼 들리지만, 이 용어는 매우 다른 세 가지 구현을 숨깁니다: OS 오버레이, 브라우저 내장 자막, 제3자 자막 레이어. 각각 다른 시나리오에서 승리하며, "그냥 자막 켜기"는 놀라운 플랫폼 비대칭을 가립니다.',
        'h2_1': '라이브 자막이 나타나는 세 가지 레이어',
        'p_1': '같은 "자막"이 매우 다른 세 가지 구현을 숨깁니다:',
        'li_1a': '<strong>OS 레벨 자막:</strong> 운영 체제가 시스템 오디오를 듣고 플로팅 창에 자막을 렌더링. 예: Windows 11 Live Captions, macOS Live Captions, Android Live Caption.',
        'li_1b': '<strong>브라우저 레벨 자막:</strong> 브라우저가 임의의 탭에서 오디오를 캡처하고 해당 탭에만 자막 표시. 예: Chrome Live Caption.',
        'li_1c': '<strong>앱 레벨 자막:</strong> 회의 또는 미디어 앱이 앱 자체 창에 자막 생성. 예: Zoom, Microsoft Teams, Google Meet, YouTube.',
        'h2_2': '2026 비교: 언제 어떤 라이브 자막을 사용할지',
        'th_1': '제공자', 'th_2': '레이어', 'th_3': '강점', 'th_4': '제약',
        't1c1': 'Windows 11 Live Captions', 't1c2': 'OS 레벨', 't1c3': '모든 데스크톱 앱에서 작동, 온디바이스 프라이버시, 무료', 't1c4': '영어 외 언어 커버리지 제한',
        't2c1': 'macOS Live Captions', 't2c2': 'OS 레벨', 't2c3': 'Apple Silicon에서 시스템 전체 자막, 온디바이스', 't2c4': '최신 macOS 필요; 언어 목록이 Windows보다 좁음',
        't3c1': 'Chrome Live Caption', 't3c2': '브라우저 레벨', 't3c3': '오디오가 있는 모든 탭에서 작동; 로컬 실행', 't3c4': '탭 범위; 많은 지역에서 영어만',
        't4c1': 'Zoom / Teams / Meet 자막', 't4c2': '앱 레벨', 't4c3': '최고의 화자 라벨링과 회의 컨텍스트', 't4c4': '플랫폼별 커버리지 및 관리자 정책이 다름',
        't5c1': 'Live Subtitles', 't5c2': 'OS 레벨 + 이중 언어', 't5c3': '앱 간 자막과 실시간 번역; Windows와 macOS 앱 전반에서 작동', 't5c4': '제3자 설치 필요; OS에 사전 번들되지 않음',
        'h2_3': '각 레이어가 언제 승리하는가',
        'h3_1': 'OS 레벨이 승리할 때', 'p_3a': '하루 동안 앱 사이를 이동할 때 — 아침에 회의, 점심에 Netflix, 오후에 팟캐스트. 하나의 OS 레이어가 모든 곳에서 따라옵니다. 프라이버시 민감 사례도 OS 레벨을 선호 — 오디오가 기기를 떠나지 않기 때문.',
        'h3_2': '앱 레벨이 승리할 때', 'p_3b': '하루 종일 한 회의 플랫폼 내부에 머무를 때, 참석자 명단에서 이름으로 화자 라벨이 필요할 때, 또는 관리자가 Teams/Meet/Zoom에 번역 자막을 배포한 경우.',
        'h3_3': '제3자 앱 간이 승리할 때', 'p_3c': '자막과 함께 번역이 필요할 때(OS 네이티브는 주로 동일 언어), 학습용 이중 언어 표시, 또는 자체 자막을 제공하지 않는 플랫폼(Discord 음성 채팅, OBS 스트림, 녹화된 비디오 파일)에서 자막이 필요할 때.',
        'h2_4': '설정 체크리스트',
        'li_4a': '주요 컨텍스트 식별: 데스크톱, 모바일, 브라우저 또는 특정 앱.',
        'li_4b': '먼저 네이티브 OS 자막 시도 — 무료이며 설치 필요 없음.',
        'li_4c': '번역이나 다중 앱 커버리지가 필요하면 제3자 레이어 추가.',
        'li_4d': '같은 컨텍스트에 두 자막 레이어를 쌓지 마세요: 시각적으로 어긋나고 눈을 혼란시킵니다.',
        'h2_faq': '자주 묻는 질문',
        'q1': '라이브 자막은 오프라인에서 작동하나요?', 'a1': 'Windows 11, macOS, 최근 Android의 OS 레벨 자막은 온디바이스입니다. 앱 레벨 자막은 보통 서버가 필요합니다.',
        'q2': '두 언어로 동시에 라이브 자막을 받을 수 있나요?', 'a2': '네이티브 OS 자막은 보통 소스 언어만. 이중 언어는 제3자 레이어가 필요합니다.',
        'q3': '라이브 자막이 자막을 대체하나요?', 'a3': '라이브 오디오의 경우 예; 사전 녹화된 영화/TV는 아니오 — 스크립트 자막이 여전히 ASR보다 우수합니다.',
        'h2_refs': '참고 자료',
        'ref1_url': 'https://support.microsoft.com/en-us/windows/use-live-captions-to-better-understand-audio-4ffec0d6-5999-4b86-a39e-fe779ac15f04', 'ref1_label': 'Microsoft — Windows에서 Live Captions 사용',
        'ref2_url': 'https://support.apple.com/en-us/HT213295', 'ref2_label': 'Apple — Mac의 Live Captions',
        'ref3_url': 'https://support.google.com/accessibility/android/answer/9350862', 'ref3_label': 'Google — Android Live Caption',
        'ref4_url': 'https://support.google.com/chrome/answer/10538231', 'ref4_label': 'Google — Chrome Live Caption',
        'related_label': '관련 기사',
        'related': [('24', '2026년 오디오를 텍스트로 변환: 실시간 vs 배치 전사 비교'), ('23', '2026년 음성 번역 앱: 실시간 도구를 사용 사례별 비교'), ('18', '2026년 Google Meet vs Zoom vs Teams 번역 자막')],
        'cta_title': '모든 앱의 라이브 자막, 실시간 번역과 함께',
        'cta_body': '앱 간 라이브 자막과 이중 언어 번역 — 오디오가 있는 모든 곳에서.',
        'cta_button': 'Microsoft Store에서 다운로드',
    },
    'ar': {
        'title': 'التعليقات الحية في 2026: كيف تعمل تعليقات الذكاء الاصطناعي ومتى تستخدمها',
        'description': 'شرح التعليقات الحية: كيف يحوّل الذكاء الاصطناعي الكلام إلى نص في أقل من ثانيتين، وأين تظهر على Windows وMac وAndroid وiOS وChrome، ومتى يفوز كل خيار.',
        'keywords': 'تعليقات حية, ترجمة فورية على الشاشة, تعليقات بالذكاء الاصطناعي, تعليقات تلقائية, تعليقات حية 2026',
        'og_description': 'كيف تعمل التعليقات الحية بالذكاء الاصطناعي، وأين تظهر على مستويات النظام والمتصفح والتطبيق، ومتى يفوز كل خيار.',
        'image_alt': 'تعليقات حية تظهر على الشاشة أثناء محادثة في الوقت الحقيقي',
        'home_label': 'الرئيسية', 'articles_label': 'المقالات',
        'breadcrumb_short': 'التعليقات الحية في 2026',
        'back_link': 'العودة إلى المقالات', 'date_label': '28 مايو 2026',
        'author_label': 'الكاتب', 'updated_label': 'آخر تحديث',
        'twitter_description': 'شرح 2026 يغطي Windows وApple وAndroid وChrome وطبقات التعليقات من جهات خارجية.',
        'intro': 'تبدو <strong>التعليقات الحية</strong> ميزة واحدة، لكن المصطلح يخفي ثلاث تطبيقات مختلفة جدًا: تراكبات على مستوى نظام التشغيل، تعليقات مدمجة في المتصفح، وطبقات تعليقات من جهات خارجية. كل منها يفوز في سيناريو مختلف، و«مجرد تشغيل التعليقات» يحجب فروقًا مفاجئة بين المنصات.',
        'h2_1': 'ثلاث طبقات تظهر فيها التعليقات الحية',
        'p_1': 'كلمة «التعليقات» نفسها تخفي ثلاث تطبيقات مختلفة جدًا:',
        'li_1a': '<strong>على مستوى النظام:</strong> يستمع نظام التشغيل إلى صوت النظام ويعرض التعليقات في نافذة عائمة. أمثلة: Windows 11 Live Captions وmacOS Live Captions وAndroid Live Caption.',
        'li_1b': '<strong>على مستوى المتصفح:</strong> يلتقط المتصفح الصوت من أي تبويب ويعرض التعليقات لذلك التبويب فقط. مثال: Chrome Live Caption.',
        'li_1c': '<strong>على مستوى التطبيق:</strong> يولّد تطبيق الاجتماعات أو الوسائط تعليقاته الخاصة داخل نافذته. أمثلة: Zoom وMicrosoft Teams وGoogle Meet وYouTube.',
        'h2_2': 'مقارنة 2026: متى تستخدم أي تعليقات حية',
        'th_1': 'المزوّد', 'th_2': 'الطبقة', 'th_3': 'النقاط القوية', 'th_4': 'القيود',
        't1c1': 'Windows 11 Live Captions', 't1c2': 'مستوى النظام', 't1c3': 'تعمل عبر كل تطبيقات سطح المكتب، خصوصية على الجهاز، مجانية', 't1c4': 'تغطية لغات محدودة خارج الإنجليزية',
        't2c1': 'macOS Live Captions', 't2c2': 'مستوى النظام', 't2c3': 'تعليقات على مستوى النظام على Apple Silicon، على الجهاز', 't2c4': 'تحتاج macOS حديث؛ قائمة اللغات أضيق من Windows',
        't3c1': 'Chrome Live Caption', 't3c2': 'مستوى المتصفح', 't3c3': 'تعمل في أي تبويب يشغّل صوتًا؛ محليًا', 't3c4': 'محصورة بالتبويب؛ بالإنجليزية فقط في كثير من المناطق',
        't4c1': 'تعليقات Zoom / Teams / Meet', 't4c2': 'مستوى التطبيق', 't4c3': 'أفضل وضع لتسميات المتحدثين وسياق الاجتماع', 't4c4': 'تختلف التغطية وسياسة المسؤول حسب المنصة',
        't5c1': 'Live Subtitles', 't5c2': 'مستوى النظام + ثنائي اللغة', 't5c3': 'تعليقات عبر التطبيقات بالإضافة إلى ترجمة فورية؛ تعمل عبر تطبيقات Windows وmacOS', 't5c4': 'تحتاج تثبيتًا من جهة خارجية؛ غير مرفقة مع النظام',
        'h2_3': 'متى تفوز كل طبقة',
        'h3_1': 'تفوز طبقة النظام عندما', 'p_3a': 'تتنقّل بين التطبيقات خلال اليوم — اجتماع صباحًا، Netflix ظهرًا، بودكاست بعد الظهر. تتبعك طبقة نظام واحدة في كل مكان. حالات حساسة للخصوصية تفضّلها أيضًا لأن الصوت لا يغادر الجهاز.',
        'h3_2': 'تفوز طبقة التطبيق عندما', 'p_3b': 'تبقى داخل منصة اجتماعات واحدة طوال اليوم، تحتاج تسميات متحدثين بأسماء من قائمة المشاركين، أو نشر مسؤولك تعليقات مترجمة في Teams/Meet/Zoom.',
        'h3_3': 'تفوز الطبقة الخارجية متعددة التطبيقات عندما', 'p_3c': 'تحتاج الترجمة بجانب التعليقات (الأصلية للنظام غالبًا بنفس اللغة)، عرض ثنائي اللغة للتعلّم، أو تعليقات على منصات لا توفّر منها أصلًا (Discord الصوتي، بث OBS، ملفات فيديو مسجّلة).',
        'h2_4': 'قائمة الإعداد',
        'li_4a': 'حدّد سياقك المهيمن: سطح المكتب، الجوال، المتصفح، أو تطبيق محدد.',
        'li_4b': 'جرّب تعليقات النظام الأصلية أولًا — مجانية ولا تحتاج تثبيتًا.',
        'li_4c': 'إذا احتجت ترجمة أو تغطية متعددة التطبيقات، أضف طبقة خارجية.',
        'li_4d': 'تجنّب تكديس طبقتي تعليقات في السياق نفسه: تتباعد بصريًا وترهق العين.',
        'h2_faq': 'الأسئلة الشائعة',
        'q1': 'هل تعمل التعليقات الحية بدون اتصال؟', 'a1': 'تعليقات النظام على Windows 11 وmacOS وأجهزة Android الحديثة على الجهاز. تعليقات التطبيقات تحتاج عادةً خادمًا.',
        'q2': 'هل يمكنني الحصول على تعليقات حية بلغتين معًا؟', 'a2': 'تعليقات النظام الأصلية غالبًا بلغة المصدر فقط. الثنائية تحتاج طبقة خارجية.',
        'q3': 'هل ستحلّ التعليقات الحية محل الترجمات النصية؟', 'a3': 'بالنسبة للصوت الحي نعم؛ للأفلام والتلفاز المسجّلة لا — ترجمات السكربت لا تزال تتفوّق على ASR في الإتقان.',
        'h2_refs': 'المراجع',
        'ref1_url': 'https://support.microsoft.com/en-us/windows/use-live-captions-to-better-understand-audio-4ffec0d6-5999-4b86-a39e-fe779ac15f04', 'ref1_label': 'Microsoft — استخدام Live Captions على Windows',
        'ref2_url': 'https://support.apple.com/en-us/HT213295', 'ref2_label': 'Apple — Live Captions على Mac',
        'ref3_url': 'https://support.google.com/accessibility/android/answer/9350862', 'ref3_label': 'Google — Live Caption على Android',
        'ref4_url': 'https://support.google.com/chrome/answer/10538231', 'ref4_label': 'Google — Live Caption في Chrome',
        'related_label': 'قراءات ذات صلة',
        'related': [('24', 'تحويل الصوت إلى نص في 2026: مقارنة بين التفريغ الفوري والمجمّع'), ('23', 'تطبيقات الترجمة الصوتية في 2026: مقارنة الأدوات الفورية حسب الاستخدام'), ('18', 'Google Meet مقابل Zoom مقابل Teams: التعليقات المترجمة في 2026')],
        'cta_title': 'تعليقات حية عبر كل التطبيقات، مع ترجمة فورية',
        'cta_body': 'تعليقات حية عبر التطبيقات وترجمة ثنائية اللغة — أينما وُجد الصوت.',
        'cta_button': 'تنزيل من Microsoft Store',
    },
    'hi': {
        'title': '2026 में लाइव कैप्शन: AI कैप्शन कैसे काम करते हैं और कब उपयोग करें',
        'description': 'लाइव कैप्शन की व्याख्या: AI 2 सेकंड में भाषण को टेक्स्ट में कैसे बदलता है, Windows, Mac, Android, iOS और Chrome पर वे कहाँ दिखते हैं, और कब कौन सा विकल्प जीतता है।',
        'keywords': 'लाइव कैप्शन, रीयल-टाइम सबटाइटल, AI सबटाइटल, स्वचालित कैप्शन, लाइव कैप्शन 2026',
        'og_description': 'AI लाइव कैप्शन कैसे काम करते हैं, वे OS, ब्राउज़र, ऐप परतों पर कहाँ दिखाई देते हैं, और कब कौन सा जीतता है।',
        'image_alt': 'रीयल-टाइम बातचीत के दौरान स्क्रीन पर दिखाई देने वाले लाइव कैप्शन',
        'home_label': 'मुखपृष्ठ', 'articles_label': 'लेख',
        'breadcrumb_short': '2026 में लाइव कैप्शन',
        'back_link': 'लेखों पर वापस', 'date_label': '28 मई 2026',
        'author_label': 'लेखक', 'updated_label': 'अद्यतन',
        'twitter_description': 'Windows, Apple, Android, Chrome और तृतीय-पक्ष लाइव कैप्शन परतों को कवर करने वाली 2026 व्याख्या।',
        'intro': '<strong>लाइव कैप्शन</strong> एक ही फ़ीचर की तरह लगता है, लेकिन यह शब्द तीन बहुत अलग कार्यान्वयन छुपाता है: ऑपरेटिंग सिस्टम ओवरले, ब्राउज़र-निर्मित कैप्शन और तृतीय-पक्ष कैप्शन परतें। प्रत्येक एक अलग परिदृश्य में जीतता है, और "बस कैप्शन चालू कर दो" आश्चर्यजनक प्लेटफ़ॉर्म असमानताएँ छुपाता है।',
        'h2_1': 'तीन परतें जहाँ लाइव कैप्शन दिखाई देते हैं',
        'p_1': 'वही शब्द "कैप्शन" तीन बहुत अलग कार्यान्वयन छुपाता है:',
        'li_1a': '<strong>OS-स्तर कैप्शन:</strong> ऑपरेटिंग सिस्टम सिस्टम ऑडियो सुनता है और फ़्लोटिंग विंडो में कैप्शन रेंडर करता है। उदाहरण: Windows 11 Live Captions, macOS Live Captions, Android Live Caption।',
        'li_1b': '<strong>ब्राउज़र-स्तर कैप्शन:</strong> ब्राउज़र किसी भी टैब से ऑडियो कैप्चर करता है और केवल उस टैब के लिए कैप्शन दिखाता है। उदाहरण: Chrome Live Caption।',
        'li_1c': '<strong>ऐप-स्तर कैप्शन:</strong> मीटिंग या मीडिया ऐप ऐप की अपनी विंडो के अंदर अपने स्वयं के कैप्शन उत्पन्न करता है। उदाहरण: Zoom, Microsoft Teams, Google Meet, YouTube।',
        'h2_2': '2026 तुलना: कब कौन से लाइव कैप्शन का उपयोग करें',
        'th_1': 'प्रदाता', 'th_2': 'परत', 'th_3': 'मज़बूती', 'th_4': 'सीमाएँ',
        't1c1': 'Windows 11 Live Captions', 't1c2': 'OS-स्तर', 't1c3': 'सभी डेस्कटॉप ऐप्स में काम करता है, डिवाइस पर गोपनीयता, मुफ़्त', 't1c4': 'अंग्रेज़ी के बाहर सीमित भाषा कवरेज',
        't2c1': 'macOS Live Captions', 't2c2': 'OS-स्तर', 't2c3': 'Apple Silicon पर सिस्टम-व्यापी कैप्शन, डिवाइस पर', 't2c4': 'हाल का macOS आवश्यक; भाषा सूची Windows से संकीर्ण',
        't3c1': 'Chrome Live Caption', 't3c2': 'ब्राउज़र-स्तर', 't3c3': 'ऑडियो चलाने वाले किसी भी टैब पर काम करता है; स्थानीय रूप से चलता है', 't3c4': 'टैब-स्कोप्ड; कई क्षेत्रों में केवल अंग्रेज़ी',
        't4c1': 'Zoom / Teams / Meet कैप्शन', 't4c2': 'ऐप-स्तर', 't4c3': 'सबसे अच्छा स्पीकर लेबलिंग और मीटिंग संदर्भ', 't4c4': 'प्रत्येक प्लेटफ़ॉर्म का कवरेज और एडमिन नीति भिन्न होती है',
        't5c1': 'Live Subtitles', 't5c2': 'OS-स्तर + द्विभाषी', 't5c3': 'क्रॉस-ऐप कैप्शन साथ ही रीयल-टाइम अनुवाद; Windows और macOS ऐप्स पर काम करता है', 't5c4': 'तृतीय-पक्ष इंस्टॉल आवश्यक; OS के साथ पूर्व-बंडल नहीं',
        'h2_3': 'प्रत्येक परत कब जीतती है',
        'h3_1': 'OS-स्तर जीतता है जब', 'p_3a': 'आप दिन भर ऐप्स के बीच चलते हैं — सुबह में मीटिंग, दोपहर में Netflix, शाम को पॉडकास्ट। एक OS परत हर जगह आपका अनुसरण करती है। गोपनीयता-संवेदनशील उपयोग के मामले भी OS-स्तर को प्राथमिकता देते हैं क्योंकि ऑडियो डिवाइस से बाहर नहीं जाता।',
        'h3_2': 'ऐप-स्तर जीतता है जब', 'p_3b': 'आप पूरे दिन एक मीटिंग प्लेटफ़ॉर्म के अंदर रहते हैं, आपको मीटिंग प्रतिभागी सूची से नामों के साथ स्पीकर लेबल चाहिए, या आपके एडमिन ने Teams/Meet/Zoom के अंदर अनुवादित कैप्शन रोल आउट किए हैं।',
        'h3_3': 'तृतीय-पक्ष क्रॉस-ऐप जीतता है जब', 'p_3c': 'आपको कैप्शन के साथ अनुवाद चाहिए (OS नेटिव ज़्यादातर एक ही भाषा), सीखने के लिए द्विभाषी प्रदर्शन, या ऐसे प्लेटफ़ॉर्म पर कैप्शन जो स्वयं नहीं देते (Discord वॉइस चैट, OBS स्ट्रीम, रिकॉर्ड किए गए वीडियो फ़ाइलें)।',
        'h2_4': 'सेटअप चेकलिस्ट',
        'li_4a': 'अपना प्रमुख संदर्भ पहचानें: डेस्कटॉप, मोबाइल, ब्राउज़र, या विशिष्ट ऐप।',
        'li_4b': 'पहले नेटिव OS कैप्शन आज़माएँ — मुफ़्त और शून्य इंस्टॉल आवश्यक।',
        'li_4c': 'यदि आपको अनुवाद या बहु-ऐप कवरेज चाहिए, तो तृतीय-पक्ष परत जोड़ें।',
        'li_4d': 'एक ही संदर्भ में दो कैप्शन परतों को एक साथ न रखें: वे दृश्य रूप से डीसिंक होती हैं और आँख को भ्रमित करती हैं।',
        'h2_faq': 'पूछे जाने वाले प्रश्न',
        'q1': 'क्या लाइव कैप्शन ऑफ़लाइन काम करते हैं?', 'a1': 'Windows 11, macOS और हाल के Android पर OS-स्तर कैप्शन ऑन-डिवाइस हैं। ऐप-स्तर कैप्शन को आमतौर पर सर्वर की आवश्यकता होती है।',
        'q2': 'क्या मैं एक साथ दो भाषाओं में लाइव कैप्शन प्राप्त कर सकता हूँ?', 'a2': 'नेटिव OS कैप्शन आमतौर पर केवल स्रोत-भाषा होते हैं। द्विभाषी के लिए तृतीय-पक्ष परत की आवश्यकता होती है।',
        'q3': 'क्या लाइव कैप्शन सबटाइटल को बदल देंगे?', 'a3': 'लाइव ऑडियो के लिए हाँ; पूर्व-रिकॉर्ड किए गए फ़िल्म/टीवी के लिए नहीं — स्क्रिप्टेड सबटाइटल अभी भी शिल्प के मामले में ASR को हराते हैं।',
        'h2_refs': 'संदर्भ',
        'ref1_url': 'https://support.microsoft.com/en-us/windows/use-live-captions-to-better-understand-audio-4ffec0d6-5999-4b86-a39e-fe779ac15f04', 'ref1_label': 'Microsoft — Windows पर Live Captions का उपयोग करें',
        'ref2_url': 'https://support.apple.com/en-us/HT213295', 'ref2_label': 'Apple — Mac पर Live Captions',
        'ref3_url': 'https://support.google.com/accessibility/android/answer/9350862', 'ref3_label': 'Google — Android पर Live Caption',
        'ref4_url': 'https://support.google.com/chrome/answer/10538231', 'ref4_label': 'Google — Chrome में Live Caption',
        'related_label': 'संबंधित पठन',
        'related': [('24', '2026 में ऑडियो को टेक्स्ट में बदलें: रीयल-टाइम vs बैच ट्रांसक्रिप्शन'), ('23', '2026 में आवाज़ अनुवाद ऐप्स: उपयोग के मामले के अनुसार रीयल-टाइम तुलना'), ('18', '2026 में Google Meet बनाम Zoom बनाम Teams अनुवादित कैप्शन')],
        'cta_title': 'हर ऐप पर लाइव कैप्शन, रीयल-टाइम अनुवाद के साथ',
        'cta_body': 'क्रॉस-ऐप लाइव कैप्शन और द्विभाषी अनुवाद — जहाँ भी ऑडियो हो।',
        'cta_button': 'Microsoft Store से डाउनलोड करें',
    },
    'es': {
        'title': 'Subtítulos en vivo 2026: cómo funcionan los subtítulos con IA y cuándo usarlos',
        'description': 'Subtítulos en vivo explicados: cómo la IA convierte voz en texto en menos de 2 segundos, dónde aparecen en Windows, Mac, Android, iOS y Chrome, y cuándo gana cada opción.',
        'keywords': 'subtítulos en vivo, live caption, subtítulos ia, subtítulos en tiempo real, subtítulos automáticos, live caption 2026',
        'og_description': 'Cómo funcionan los subtítulos en vivo con IA, dónde aparecen en las capas de SO, navegador y app, y cuándo gana cada uno.',
        'image_alt': 'Subtítulos en vivo apareciendo en pantalla durante una conversación en tiempo real',
        'home_label': 'Inicio', 'articles_label': 'Artículos',
        'breadcrumb_short': 'Subtítulos en vivo 2026',
        'back_link': 'Volver a artículos', 'date_label': '28 de mayo de 2026',
        'author_label': 'Autor', 'updated_label': 'Actualizado',
        'twitter_description': 'Explicación 2026 cubriendo capas de subtítulos en vivo de Windows, Apple, Android, Chrome y terceros.',
        'intro': 'Los <strong>subtítulos en vivo</strong> suenan como una sola función, pero el término esconde tres implementaciones muy distintas: superposiciones del sistema operativo, subtítulos integrados en el navegador y capas de subtítulos de terceros. Cada una gana en un escenario diferente, y «solo activa los subtítulos» oculta asimetrías de plataforma sorprendentes.',
        'h2_1': 'Tres capas donde aparecen los subtítulos en vivo',
        'p_1': 'La misma palabra «subtítulos» oculta tres implementaciones muy distintas:',
        'li_1a': '<strong>Subtítulos a nivel SO:</strong> el sistema operativo escucha el audio del sistema y renderiza subtítulos en una ventana flotante. Ejemplos: Windows 11 Live Captions, macOS Live Captions, Android Live Caption.',
        'li_1b': '<strong>Subtítulos a nivel navegador:</strong> el navegador captura audio de cualquier pestaña y muestra subtítulos solo para esa pestaña. Ejemplo: Chrome Live Caption.',
        'li_1c': '<strong>Subtítulos a nivel app:</strong> la app de reuniones o medios genera sus propios subtítulos dentro de su ventana. Ejemplos: Zoom, Microsoft Teams, Google Meet, YouTube.',
        'h2_2': 'Comparativa 2026: cuándo usar cada subtítulo en vivo',
        'th_1': 'Proveedor', 'th_2': 'Capa', 'th_3': 'Fortalezas', 'th_4': 'Límites',
        't1c1': 'Windows 11 Live Captions', 't1c2': 'Nivel SO', 't1c3': 'Funciona en todas las apps de escritorio, privacidad en dispositivo, gratis', 't1c4': 'Cobertura de idiomas limitada fuera del inglés',
        't2c1': 'macOS Live Captions', 't2c2': 'Nivel SO', 't2c3': 'Subtítulos a nivel sistema en Apple Silicon, en dispositivo', 't2c4': 'Requiere macOS reciente; lista de idiomas más estrecha que Windows',
        't3c1': 'Chrome Live Caption', 't3c2': 'Nivel navegador', 't3c3': 'Funciona en cualquier pestaña con audio; corre localmente', 't3c4': 'Limitado a la pestaña; solo inglés en muchas regiones',
        't4c1': 'Subtítulos Zoom / Teams / Meet', 't4c2': 'Nivel app', 't4c3': 'Mejor etiquetado de hablantes y contexto de reunión', 't4c4': 'La cobertura y política de admin difiere por plataforma',
        't5c1': 'Live Subtitles', 't5c2': 'Nivel SO + bilingüe', 't5c3': 'Subtítulos entre apps más traducción en tiempo real; funciona en apps de Windows y macOS', 't5c4': 'Requiere instalación de terceros; no preinstalado con el SO',
        'h2_3': 'Cuándo gana cada capa',
        'h3_1': 'A nivel SO gana cuando', 'p_3a': 'Te mueves entre apps durante el día: reunión por la mañana, Netflix al mediodía, podcast por la tarde. Una capa del SO te acompaña a todas partes. Los casos sensibles a la privacidad también prefieren nivel SO porque el audio nunca sale del dispositivo.',
        'h3_2': 'A nivel app gana cuando', 'p_3b': 'Te quedas dentro de una plataforma de reuniones todo el día, necesitas etiquetas de hablante con nombres de la lista de asistentes, o tu admin ha desplegado subtítulos traducidos en Teams/Meet/Zoom.',
        'h3_3': 'A nivel terceros entre apps gana cuando', 'p_3c': 'Necesitas traducción junto con subtítulos (los nativos del SO suelen ser solo en el mismo idioma), visualización bilingüe para aprender, o subtítulos en plataformas que no traen los suyos (chat de voz de Discord, streams OBS, archivos de vídeo grabados).',
        'h2_4': 'Lista de configuración',
        'li_4a': 'Identifica tu contexto dominante: escritorio, móvil, navegador o app específica.',
        'li_4b': 'Prueba primero los subtítulos nativos del SO: gratis y sin instalación.',
        'li_4c': 'Si necesitas traducción o cobertura multi-app, añade una capa de terceros.',
        'li_4d': 'Evita apilar dos capas de subtítulos en el mismo contexto: se desincronizan visualmente.',
        'h2_faq': 'Preguntas frecuentes',
        'q1': '¿Funcionan los subtítulos en vivo sin conexión?', 'a1': 'Los subtítulos a nivel SO en Windows 11, macOS y Android reciente son en dispositivo. Los de app suelen necesitar servidor.',
        'q2': '¿Puedo tener subtítulos en vivo en dos idiomas a la vez?', 'a2': 'Los nativos del SO suelen ser solo idioma fuente. El bilingüe requiere una capa de terceros.',
        'q3': '¿Sustituirán los subtítulos en vivo a los subtítulos clásicos?', 'a3': 'Para audio en vivo sí; para cine/TV pregrabado no — los subtítulos escritos siguen ganando al ASR.',
        'h2_refs': 'Referencias',
        'ref1_url': 'https://support.microsoft.com/en-us/windows/use-live-captions-to-better-understand-audio-4ffec0d6-5999-4b86-a39e-fe779ac15f04', 'ref1_label': 'Microsoft — usar Live Captions en Windows',
        'ref2_url': 'https://support.apple.com/en-us/HT213295', 'ref2_label': 'Apple — Live Captions en Mac',
        'ref3_url': 'https://support.google.com/accessibility/android/answer/9350862', 'ref3_label': 'Google — Live Caption en Android',
        'ref4_url': 'https://support.google.com/chrome/answer/10538231', 'ref4_label': 'Google — Live Caption en Chrome',
        'related_label': 'Lectura relacionada',
        'related': [('24', 'Transcribir audio a texto 2026: transcripción en tiempo real vs por lotes'), ('23', 'Traductor de voz en 2026: herramientas en tiempo real comparadas por caso de uso'), ('18', 'Google Meet vs Zoom vs Teams: subtítulos traducidos en 2026')],
        'cta_title': 'Subtítulos en vivo en cada app, con traducción en tiempo real',
        'cta_body': 'Subtítulos en vivo entre apps y traducción bilingüe — donde sea que haya audio.',
        'cta_button': 'Descargar de Microsoft Store',
    },
    'fr': {
        'title': "Sous-titres en direct 2026 : comment fonctionnent les sous-titres IA et quand les utiliser",
        'description': "Sous-titres en direct expliqués : comment l'IA convertit la parole en texte en moins de 2 secondes, où ils apparaissent sur Windows, Mac, Android, iOS et Chrome, et quand chaque option gagne.",
        'keywords': "sous-titres en direct, live caption, sous-titres ia, sous-titres temps réel, sous-titres automatiques, live caption 2026",
        'og_description': "Comment fonctionnent les sous-titres IA, où ils apparaissent dans les couches OS/navigateur/app, et quand chacun gagne.",
        'image_alt': "Sous-titres en direct apparaissant à l'écran pendant une conversation en temps réel",
        'home_label': 'Accueil', 'articles_label': 'Articles',
        'breadcrumb_short': 'Sous-titres en direct 2026',
        'back_link': 'Retour aux articles', 'date_label': '28 mai 2026',
        'author_label': 'Auteur', 'updated_label': 'Mis à jour',
        'twitter_description': "Explication 2026 couvrant les couches Windows, Apple, Android, Chrome et tiers de sous-titres en direct.",
        'intro': "Les <strong>sous-titres en direct</strong> sonnent comme une fonctionnalité unique, mais le terme cache trois implémentations très différentes : superpositions OS, sous-titres intégrés au navigateur et couches tierces. Chacune gagne dans un scénario différent, et « il suffit d'activer les sous-titres » masque des asymétries de plateforme surprenantes.",
        'h2_1': 'Trois couches où les sous-titres en direct apparaissent',
        'p_1': "Le même mot « sous-titres » cache trois implémentations très différentes :",
        'li_1a': "<strong>Au niveau OS :</strong> l'OS écoute l'audio système et affiche les sous-titres dans une fenêtre flottante. Exemples : Windows 11 Live Captions, macOS Live Captions, Android Live Caption.",
        'li_1b': "<strong>Au niveau navigateur :</strong> le navigateur capture l'audio de tout onglet et affiche les sous-titres uniquement pour cet onglet. Exemple : Chrome Live Caption.",
        'li_1c': "<strong>Au niveau app :</strong> l'app de réunion ou de média génère ses propres sous-titres dans sa fenêtre. Exemples : Zoom, Microsoft Teams, Google Meet, YouTube.",
        'h2_2': 'Comparatif 2026 : quel sous-titre en direct utiliser quand',
        'th_1': 'Fournisseur', 'th_2': 'Couche', 'th_3': 'Forces', 'th_4': 'Limites',
        't1c1': 'Windows 11 Live Captions', 't1c2': 'Niveau OS', 't1c3': 'Fonctionne dans toutes les apps bureau, confidentialité sur appareil, gratuit', 't1c4': 'Couverture linguistique limitée hors anglais',
        't2c1': 'macOS Live Captions', 't2c2': 'Niveau OS', 't2c3': 'Sous-titres système sur Apple Silicon, sur appareil', 't2c4': 'Nécessite macOS récent ; liste de langues plus restreinte',
        't3c1': 'Chrome Live Caption', 't3c2': 'Niveau navigateur', 't3c3': "Fonctionne sur tout onglet diffusant de l'audio ; localement", 't3c4': 'Limité à l\'onglet ; anglais seul dans beaucoup de régions',
        't4c1': 'Sous-titres Zoom / Teams / Meet', 't4c2': 'Niveau app', 't4c3': 'Meilleur étiquetage des locuteurs et contexte de réunion', 't4c4': "La couverture et la politique d'admin diffèrent selon la plateforme",
        't5c1': 'Live Subtitles', 't5c2': 'Niveau OS + bilingue', 't5c3': "Sous-titres inter-apps et traduction en temps réel ; fonctionne sur Windows et macOS", 't5c4': "Installation tierce requise ; non pré-installé avec l'OS",
        'h2_3': 'Quand chaque couche gagne',
        'h3_1': 'Le niveau OS gagne quand', 'p_3a': 'Vous passez entre apps dans la journée — réunion le matin, Netflix à midi, podcast l\'après-midi. Une couche OS vous suit partout. Les cas sensibles à la vie privée préfèrent aussi le niveau OS car l\'audio ne quitte jamais l\'appareil.',
        'h3_2': "Le niveau app gagne quand", 'p_3b': 'Vous restez dans une plateforme de réunion toute la journée, avez besoin d\'étiquettes locuteurs avec noms de la liste de participants, ou votre admin a déployé des sous-titres traduits dans Teams/Meet/Zoom.',
        'h3_3': "Le tiers inter-apps gagne quand", 'p_3c': "Vous avez besoin de traduction en plus des sous-titres (les natifs OS sont surtout dans la même langue), affichage bilingue pour apprendre, ou sous-titres sur des plateformes qui n'en livrent pas (chat vocal Discord, streams OBS, fichiers vidéo enregistrés).",
        'h2_4': 'Liste de configuration',
        'li_4a': 'Identifiez votre contexte dominant : bureau, mobile, navigateur ou app spécifique.',
        'li_4b': "Essayez d'abord les sous-titres natifs OS — gratuits et zéro installation.",
        'li_4c': 'Si vous avez besoin de traduction ou couverture multi-app, ajoutez une couche tierce.',
        'li_4d': "Évitez d'empiler deux couches de sous-titres dans le même contexte : elles désynchronisent visuellement.",
        'h2_faq': 'FAQ',
        'q1': 'Les sous-titres en direct fonctionnent-ils hors ligne ?', 'a1': 'Les sous-titres niveau OS sur Windows 11, macOS et Android récent sont sur appareil. Les niveau app nécessitent généralement un serveur.',
        'q2': 'Puis-je obtenir des sous-titres en direct dans deux langues à la fois ?', 'a2': 'Les sous-titres natifs OS sont généralement uniquement en langue source. Le bilingue nécessite une couche tierce.',
        'q3': 'Les sous-titres en direct remplaceront-ils les sous-titres ?', 'a3': "Pour l'audio en direct oui ; pour le cinéma/TV préenregistré non — les sous-titres scriptés battent encore l'ASR sur la qualité.",
        'h2_refs': 'Références',
        'ref1_url': 'https://support.microsoft.com/en-us/windows/use-live-captions-to-better-understand-audio-4ffec0d6-5999-4b86-a39e-fe779ac15f04', 'ref1_label': 'Microsoft — utiliser Live Captions sur Windows',
        'ref2_url': 'https://support.apple.com/en-us/HT213295', 'ref2_label': 'Apple — Live Captions sur Mac',
        'ref3_url': 'https://support.google.com/accessibility/android/answer/9350862', 'ref3_label': 'Google — Live Caption sur Android',
        'ref4_url': 'https://support.google.com/chrome/answer/10538231', 'ref4_label': 'Google — Live Caption dans Chrome',
        'related_label': 'Lecture connexe',
        'related': [('24', "Transcrire l'audio en texte 2026 : transcription en temps réel vs par lots"), ('23', "Traducteur vocal en 2026 : outils en temps réel comparés par cas d'usage"), ('18', "Google Meet vs Zoom vs Teams : sous-titres traduits en 2026")],
        'cta_title': 'Sous-titres en direct sur toutes les apps, avec traduction en temps réel',
        'cta_body': "Sous-titres en direct inter-apps et traduction bilingue — partout où il y a de l'audio.",
        'cta_button': 'Télécharger depuis Microsoft Store',
    },
    'it': {
        'title': 'Sottotitoli live 2026: come funzionano i sottotitoli IA e quando usarli',
        'description': "Sottotitoli live spiegati: come l'IA converte la voce in testo in meno di 2 secondi, dove appaiono su Windows, Mac, Android, iOS e Chrome, e quando vince ciascuna opzione.",
        'keywords': 'sottotitoli live, live caption, sottotitoli ia, sottotitoli in tempo reale, sottotitoli automatici, live caption 2026',
        'og_description': "Come funzionano i sottotitoli live IA, dove appaiono nei livelli OS/browser/app, e quando vince ciascuno.",
        'image_alt': 'Sottotitoli live che appaiono sullo schermo durante una conversazione in tempo reale',
        'home_label': 'Home', 'articles_label': 'Articoli',
        'breadcrumb_short': 'Sottotitoli live 2026',
        'back_link': 'Torna agli articoli', 'date_label': '28 maggio 2026',
        'author_label': 'Autore', 'updated_label': 'Aggiornato',
        'twitter_description': 'Spiegazione 2026 dei livelli di sottotitoli live di Windows, Apple, Android, Chrome e terze parti.',
        'intro': 'I <strong>sottotitoli live</strong> sembrano una singola funzione, ma il termine nasconde tre implementazioni molto diverse: overlay del sistema operativo, sottotitoli integrati nel browser e livelli di sottotitoli di terze parti. Ognuno vince in uno scenario diverso, e «basta attivare i sottotitoli» nasconde sorprendenti asimmetrie di piattaforma.',
        'h2_1': 'Tre livelli dove appaiono i sottotitoli live',
        'p_1': 'La stessa parola «sottotitoli» nasconde tre implementazioni molto diverse:',
        'li_1a': '<strong>Sottotitoli a livello OS:</strong> il sistema operativo ascolta audio di sistema e disegna sottotitoli in una finestra fluttuante. Esempi: Windows 11 Live Captions, macOS Live Captions, Android Live Caption.',
        'li_1b': '<strong>Sottotitoli a livello browser:</strong> il browser cattura audio da qualsiasi tab e mostra sottotitoli solo per quella tab. Esempio: Chrome Live Caption.',
        'li_1c': '<strong>Sottotitoli a livello app:</strong> riunioni o app multimediali generano i propri sottotitoli nella propria finestra. Esempi: Zoom, Microsoft Teams, Google Meet, YouTube.',
        'h2_2': 'Confronto 2026: quali sottotitoli live usare quando',
        'th_1': 'Fornitore', 'th_2': 'Livello', 'th_3': 'Punti di forza', 'th_4': 'Limiti',
        't1c1': 'Windows 11 Live Captions', 't1c2': 'Livello OS', 't1c3': 'Funziona in tutte le app desktop, privacy sul dispositivo, gratis', 't1c4': 'Copertura linguistica limitata oltre l\'inglese',
        't2c1': 'macOS Live Captions', 't2c2': 'Livello OS', 't2c3': 'Sottotitoli di sistema su Apple Silicon, sul dispositivo', 't2c4': 'Richiede macOS recente; lista lingue più ristretta',
        't3c1': 'Chrome Live Caption', 't3c2': 'Livello browser', 't3c3': 'Funziona su qualsiasi tab con audio; localmente', 't3c4': 'Limitato alla tab; solo inglese in molte regioni',
        't4c1': 'Sottotitoli Zoom / Teams / Meet', 't4c2': 'Livello app', 't4c3': 'Migliori etichette dei relatori e contesto della riunione', 't4c4': 'Copertura e policy admin differiscono per piattaforma',
        't5c1': 'Live Subtitles', 't5c2': 'Livello OS + bilingue', 't5c3': 'Sottotitoli tra app più traduzione in tempo reale; funziona su Windows e macOS', 't5c4': 'Installazione di terze parti richiesta; non preinstallato con l\'OS',
        'h2_3': 'Quando vince ogni livello',
        'h3_1': 'A livello OS vince quando', 'p_3a': 'Ti muovi tra app durante il giorno — riunione la mattina, Netflix a pranzo, podcast il pomeriggio. Un livello OS ti segue ovunque. I casi sensibili alla privacy preferiscono anche il livello OS perché l\'audio non lascia il dispositivo.',
        'h3_2': 'A livello app vince quando', 'p_3b': 'Resti dentro una piattaforma di riunioni tutto il giorno, hai bisogno di etichette dei relatori con i nomi dalla lista partecipanti, o l\'admin ha distribuito sottotitoli tradotti in Teams/Meet/Zoom.',
        'h3_3': 'A livello terze parti tra app vince quando', 'p_3c': 'Hai bisogno di traduzione oltre ai sottotitoli (i nativi OS sono per lo più nella stessa lingua), display bilingue per apprendere, o sottotitoli su piattaforme che non ne offrono propri (chat vocale Discord, stream OBS, file video registrati).',
        'h2_4': 'Checklist di setup',
        'li_4a': 'Identifica il contesto dominante: desktop, mobile, browser o app specifica.',
        'li_4b': 'Prova prima i sottotitoli OS nativi — gratis e zero installazioni.',
        'li_4c': 'Se serve traduzione o copertura multi-app, aggiungi un livello terzo.',
        'li_4d': 'Evita di sovrapporre due livelli di sottotitoli nello stesso contesto: si desincronizzano visivamente.',
        'h2_faq': 'FAQ',
        'q1': 'I sottotitoli live funzionano offline?', 'a1': 'I sottotitoli a livello OS su Windows 11, macOS e Android recenti sono sul dispositivo. Quelli a livello app di solito richiedono un server.',
        'q2': 'Posso avere sottotitoli live in due lingue contemporaneamente?', 'a2': 'I sottotitoli OS nativi sono di solito solo nella lingua sorgente. Per il bilingue serve un livello terzo.',
        'q3': 'I sottotitoli live sostituiranno i sottotitoli?', 'a3': 'Per audio live sì; per film/TV preregistrati no — i sottotitoli scritti battono ancora l\'ASR per qualità.',
        'h2_refs': 'Riferimenti',
        'ref1_url': 'https://support.microsoft.com/en-us/windows/use-live-captions-to-better-understand-audio-4ffec0d6-5999-4b86-a39e-fe779ac15f04', 'ref1_label': 'Microsoft — usare Live Captions su Windows',
        'ref2_url': 'https://support.apple.com/en-us/HT213295', 'ref2_label': 'Apple — Live Captions su Mac',
        'ref3_url': 'https://support.google.com/accessibility/android/answer/9350862', 'ref3_label': 'Google — Live Caption su Android',
        'ref4_url': 'https://support.google.com/chrome/answer/10538231', 'ref4_label': 'Google — Live Caption in Chrome',
        'related_label': 'Letture correlate',
        'related': [('24', "Trascrivere audio in testo 2026: trascrizione in tempo reale vs in batch"), ('23', "Traduzione vocale 2026: strumenti in tempo reale a confronto per caso d'uso"), ('18', "Google Meet vs Zoom vs Teams: sottotitoli tradotti nel 2026")],
        'cta_title': 'Sottotitoli live su ogni app, con traduzione in tempo reale',
        'cta_body': "Sottotitoli live tra app e traduzione bilingue — ovunque ci sia audio.",
        'cta_button': 'Scarica da Microsoft Store',
    },
    'pl': {
        'title': 'Napisy na żywo 2026: jak działają napisy AI i kiedy ich używać',
        'description': 'Napisy na żywo wyjaśnione: jak AI zamienia mowę na tekst w mniej niż 2 sekundy, gdzie pojawiają się na Windows, Mac, Android, iOS i Chrome, oraz kiedy wygrywa każda opcja.',
        'keywords': 'napisy na żywo, live caption, napisy AI, napisy w czasie rzeczywistym, napisy automatyczne, live caption 2026',
        'og_description': 'Jak działają napisy AI na żywo, gdzie pojawiają się na poziomach OS/przeglądarka/aplikacja, kiedy wygrywa każda.',
        'image_alt': 'Napisy na żywo pojawiające się na ekranie podczas rozmowy w czasie rzeczywistym',
        'home_label': 'Strona główna', 'articles_label': 'Artykuły',
        'breadcrumb_short': 'Napisy na żywo 2026',
        'back_link': 'Powrót do artykułów', 'date_label': '28 maja 2026',
        'author_label': 'Autor', 'updated_label': 'Zaktualizowano',
        'twitter_description': 'Wyjaśnienie 2026 obejmujące warstwy napisów na żywo Windows, Apple, Android, Chrome i firm trzecich.',
        'intro': '<strong>Napisy na żywo</strong> brzmią jak pojedyncza funkcja, ale termin ten kryje trzy bardzo różne implementacje: nakładki systemu operacyjnego, napisy wbudowane w przeglądarce i warstwy napisów firm trzecich. Każda wygrywa w innym scenariuszu, a „po prostu włącz napisy" ukrywa zaskakujące asymetrie platform.',
        'h2_1': 'Trzy warstwy, gdzie pojawiają się napisy na żywo',
        'p_1': 'To samo słowo „napisy" kryje trzy bardzo różne implementacje:',
        'li_1a': '<strong>Napisy na poziomie OS:</strong> system operacyjny słucha dźwięku systemowego i renderuje napisy w pływającym oknie. Przykłady: Windows 11 Live Captions, macOS Live Captions, Android Live Caption.',
        'li_1b': '<strong>Napisy na poziomie przeglądarki:</strong> przeglądarka przechwytuje dźwięk z dowolnej karty i pokazuje napisy tylko dla tej karty. Przykład: Chrome Live Caption.',
        'li_1c': '<strong>Napisy na poziomie aplikacji:</strong> aplikacja do spotkań lub mediów generuje własne napisy w swoim oknie. Przykłady: Zoom, Microsoft Teams, Google Meet, YouTube.',
        'h2_2': 'Porównanie 2026: kiedy używać których napisów na żywo',
        'th_1': 'Dostawca', 'th_2': 'Warstwa', 'th_3': 'Mocne strony', 'th_4': 'Ograniczenia',
        't1c1': 'Windows 11 Live Captions', 't1c2': 'Poziom OS', 't1c3': 'Działa w każdej aplikacji pulpitu, prywatność na urządzeniu, darmowe', 't1c4': 'Ograniczona obsługa języków poza angielskim',
        't2c1': 'macOS Live Captions', 't2c2': 'Poziom OS', 't2c3': 'Napisy systemowe na Apple Silicon, na urządzeniu', 't2c4': 'Wymaga niedawnego macOS; lista języków węższa niż Windows',
        't3c1': 'Chrome Live Caption', 't3c2': 'Poziom przeglądarki', 't3c3': 'Działa w każdej karcie odtwarzającej dźwięk; lokalnie', 't3c4': 'Ograniczone do karty; tylko angielski w wielu regionach',
        't4c1': 'Napisy Zoom / Teams / Meet', 't4c2': 'Poziom aplikacji', 't4c3': 'Najlepsze etykiety mówców i kontekst spotkania', 't4c4': 'Zakres i polityka admina różnią się dla każdej platformy',
        't5c1': 'Live Subtitles', 't5c2': 'Poziom OS + dwujęzyczne', 't5c3': 'Napisy między aplikacjami plus tłumaczenie w czasie rzeczywistym; działa w aplikacjach Windows i macOS', 't5c4': 'Wymagana instalacja firmy trzeciej; nieprzedinstalowane z OS',
        'h2_3': 'Kiedy każda warstwa wygrywa',
        'h3_1': 'Poziom OS wygrywa, gdy', 'p_3a': 'Poruszasz się między aplikacjami w ciągu dnia — rano spotkanie, w południe Netflix, po południu podcast. Jedna warstwa OS podąża za tobą wszędzie. Przypadki wrażliwe na prywatność też preferują poziom OS, bo dźwięk nigdy nie opuszcza urządzenia.',
        'h3_2': 'Poziom aplikacji wygrywa, gdy', 'p_3b': 'Cały dzień zostajesz wewnątrz jednej platformy spotkań, potrzebujesz etykiet mówców z imionami z listy uczestników, lub administrator rozwinął przetłumaczone napisy w Teams/Meet/Zoom.',
        'h3_3': 'Trzecia strona między aplikacjami wygrywa, gdy', 'p_3c': 'Potrzebujesz tłumaczenia wraz z napisami (natywne OS to przeważnie ta sama język), wyświetlania dwujęzycznego do nauki, lub napisów na platformach, które nie dostarczają własnych (czat głosowy Discord, strumienie OBS, nagrane pliki wideo).',
        'h2_4': 'Lista kontrolna konfiguracji',
        'li_4a': 'Zidentyfikuj swój dominujący kontekst: pulpit, mobilny, przeglądarka lub konkretna aplikacja.',
        'li_4b': 'Najpierw spróbuj natywnych napisów OS — darmowe i bez instalacji.',
        'li_4c': 'Jeśli potrzebujesz tłumaczenia lub obsługi wielu aplikacji, dodaj warstwę firmy trzeciej.',
        'li_4d': 'Unikaj nakładania dwóch warstw napisów w tym samym kontekście: rozjeżdżają się wizualnie i mylą oko.',
        'h2_faq': 'FAQ',
        'q1': 'Czy napisy na żywo działają offline?', 'a1': 'Napisy na poziomie OS na Windows 11, macOS i niedawnych Androidach są na urządzeniu. Napisy na poziomie aplikacji zwykle potrzebują serwera.',
        'q2': 'Czy mogę otrzymać napisy na żywo w dwóch językach jednocześnie?', 'a2': 'Natywne napisy OS są zwykle tylko w języku źródłowym. Dwujęzyczne wymagają warstwy firmy trzeciej.',
        'q3': 'Czy napisy na żywo zastąpią napisy?', 'a3': 'Dla dźwięku na żywo tak; dla wstępnie nagranych filmów/TV nie — napisy ze skryptu nadal wygrywają z ASR pod względem rzemiosła.',
        'h2_refs': 'Źródła',
        'ref1_url': 'https://support.microsoft.com/en-us/windows/use-live-captions-to-better-understand-audio-4ffec0d6-5999-4b86-a39e-fe779ac15f04', 'ref1_label': 'Microsoft — używaj Live Captions na Windows',
        'ref2_url': 'https://support.apple.com/en-us/HT213295', 'ref2_label': 'Apple — Live Captions na Mac',
        'ref3_url': 'https://support.google.com/accessibility/android/answer/9350862', 'ref3_label': 'Google — Live Caption na Androidzie',
        'ref4_url': 'https://support.google.com/chrome/answer/10538231', 'ref4_label': 'Google — Live Caption w Chrome',
        'related_label': 'Powiązane artykuły',
        'related': [('24', 'Transkrypcja audio na tekst 2026: transkrypcja w czasie rzeczywistym vs wsadowa'), ('23', 'Tłumacz głosowy 2026: narzędzia w czasie rzeczywistym według zastosowania'), ('18', 'Google Meet vs Zoom vs Teams: przetłumaczone napisy w 2026')],
        'cta_title': 'Napisy na żywo w każdej aplikacji, z tłumaczeniem w czasie rzeczywistym',
        'cta_body': 'Napisy na żywo między aplikacjami i tłumaczenie dwujęzyczne — wszędzie, gdzie jest dźwięk.',
        'cta_button': 'Pobierz z Microsoft Store',
    },
    'pt': {
        'title': 'Legendas ao vivo em 2026: como funcionam as legendas com IA e quando usá-las',
        'description': 'Legendas ao vivo explicadas: como a IA converte fala em texto em menos de 2 segundos, onde aparecem em Windows, Mac, Android, iOS e Chrome, e quando cada opção vence.',
        'keywords': 'legendas ao vivo, live caption, legendas ia, legendas em tempo real, legendas automáticas, live caption 2026',
        'og_description': 'Como funcionam as legendas ao vivo com IA, onde aparecem nas camadas SO/navegador/app, e quando cada uma vence.',
        'image_alt': 'Legendas ao vivo aparecendo na tela durante uma conversa em tempo real',
        'home_label': 'Início', 'articles_label': 'Artigos',
        'breadcrumb_short': 'Legendas ao vivo em 2026',
        'back_link': 'Voltar aos artigos', 'date_label': '28 de maio de 2026',
        'author_label': 'Autor', 'updated_label': 'Atualizado',
        'twitter_description': 'Explicação 2026 cobrindo camadas de legendas ao vivo do Windows, Apple, Android, Chrome e terceiros.',
        'intro': 'As <strong>legendas ao vivo</strong> soam como um único recurso, mas o termo esconde três implementações muito diferentes: sobreposições do sistema operacional, legendas integradas ao navegador e camadas de legendas de terceiros. Cada uma vence em um cenário diferente, e «basta ligar as legendas» esconde assimetrias de plataforma surpreendentes.',
        'h2_1': 'Três camadas onde aparecem as legendas ao vivo',
        'p_1': 'A mesma palavra «legendas» esconde três implementações muito diferentes:',
        'li_1a': '<strong>Legendas em nível de SO:</strong> o sistema operacional escuta o áudio do sistema e desenha legendas em uma janela flutuante. Exemplos: Windows 11 Live Captions, macOS Live Captions, Android Live Caption.',
        'li_1b': '<strong>Legendas em nível de navegador:</strong> o navegador captura áudio de qualquer guia e mostra legendas apenas para essa guia. Exemplo: Chrome Live Caption.',
        'li_1c': '<strong>Legendas em nível de app:</strong> apps de reunião ou mídia geram suas próprias legendas na própria janela. Exemplos: Zoom, Microsoft Teams, Google Meet, YouTube.',
        'h2_2': 'Comparativo 2026: quais legendas ao vivo usar quando',
        'th_1': 'Provedor', 'th_2': 'Camada', 'th_3': 'Pontos fortes', 'th_4': 'Limites',
        't1c1': 'Windows 11 Live Captions', 't1c2': 'Nível SO', 't1c3': 'Funciona em todos os apps de desktop, privacidade no dispositivo, gratuito', 't1c4': 'Cobertura de idiomas limitada fora do inglês',
        't2c1': 'macOS Live Captions', 't2c2': 'Nível SO', 't2c3': 'Legendas em nível de sistema no Apple Silicon, no dispositivo', 't2c4': 'Requer macOS recente; lista de idiomas mais estreita que Windows',
        't3c1': 'Chrome Live Caption', 't3c2': 'Nível navegador', 't3c3': 'Funciona em qualquer guia tocando áudio; localmente', 't3c4': 'Limitado à guia; só inglês em muitas regiões',
        't4c1': 'Legendas Zoom / Teams / Meet', 't4c2': 'Nível app', 't4c3': 'Melhor rotulagem de oradores e contexto de reunião', 't4c4': 'Cobertura e política de admin diferem por plataforma',
        't5c1': 'Live Subtitles', 't5c2': 'Nível SO + bilíngue', 't5c3': 'Legendas entre apps mais tradução em tempo real; funciona em apps Windows e macOS', 't5c4': 'Instalação de terceiros necessária; não pré-instalado com o SO',
        'h2_3': 'Quando cada camada vence',
        'h3_1': 'Nível SO vence quando', 'p_3a': 'Você se move entre apps durante o dia — reunião de manhã, Netflix no almoço, podcast à tarde. Uma camada SO o segue em todos os lugares. Casos sensíveis à privacidade também preferem nível SO porque o áudio nunca sai do dispositivo.',
        'h3_2': 'Nível app vence quando', 'p_3b': 'Você fica dentro de uma plataforma de reunião o dia todo, precisa de rótulos de orador com nomes da lista de participantes, ou seu admin lançou legendas traduzidas em Teams/Meet/Zoom.',
        'h3_3': 'Terceiros entre apps vence quando', 'p_3c': 'Você precisa de tradução além das legendas (as nativas do SO são principalmente do mesmo idioma), exibição bilíngue para aprender, ou legendas em plataformas que não trazem as suas (chat de voz Discord, streams OBS, arquivos de vídeo gravados).',
        'h2_4': 'Lista de configuração',
        'li_4a': 'Identifique seu contexto dominante: desktop, mobile, navegador ou app específico.',
        'li_4b': 'Tente primeiro as legendas nativas do SO — gratuitas e sem instalação.',
        'li_4c': 'Se precisar de tradução ou cobertura multi-app, adicione uma camada de terceiros.',
        'li_4d': 'Evite empilhar duas camadas de legendas no mesmo contexto: desincronizam visualmente.',
        'h2_faq': 'Perguntas frequentes',
        'q1': 'As legendas ao vivo funcionam offline?', 'a1': 'Legendas em nível SO no Windows 11, macOS e Android recentes são no dispositivo. As de nível app geralmente precisam de um servidor.',
        'q2': 'Posso ter legendas ao vivo em dois idiomas ao mesmo tempo?', 'a2': 'As nativas do SO geralmente são apenas no idioma de origem. Bilíngue requer uma camada de terceiros.',
        'q3': 'As legendas ao vivo substituirão as legendas?', 'a3': 'Para áudio ao vivo sim; para filme/TV pré-gravado não — legendas escritas ainda batem o ASR em qualidade.',
        'h2_refs': 'Referências',
        'ref1_url': 'https://support.microsoft.com/en-us/windows/use-live-captions-to-better-understand-audio-4ffec0d6-5999-4b86-a39e-fe779ac15f04', 'ref1_label': 'Microsoft — usar Live Captions no Windows',
        'ref2_url': 'https://support.apple.com/en-us/HT213295', 'ref2_label': 'Apple — Live Captions no Mac',
        'ref3_url': 'https://support.google.com/accessibility/android/answer/9350862', 'ref3_label': 'Google — Live Caption no Android',
        'ref4_url': 'https://support.google.com/chrome/answer/10538231', 'ref4_label': 'Google — Live Caption no Chrome',
        'related_label': 'Leitura relacionada',
        'related': [('24', 'Transcrever áudio para texto em 2026: transcrição em tempo real vs em lotes'), ('23', 'Tradutor de voz em 2026: ferramentas em tempo real comparadas por caso de uso'), ('18', 'Google Meet vs Zoom vs Teams: legendas traduzidas em 2026')],
        'cta_title': 'Legendas ao vivo em todo app, com tradução em tempo real',
        'cta_body': 'Legendas ao vivo entre apps e tradução bilíngue — onde quer que haja áudio.',
        'cta_button': 'Baixar na Microsoft Store',
    },
    'tr': {
        'title': 'Canlı altyazılar 2026: AI tarafından üretilen altyazılar nasıl çalışır ve ne zaman kullanılır',
        'description': "Canlı altyazılar açıklandı: AI sesi 2 saniyenin altında metne nasıl dönüştürür, Windows, Mac, Android, iOS ve Chrome'da nerede görünürler ve hangi seçenek ne zaman kazanır.",
        'keywords': 'canlı altyazı, live caption, AI altyazı, gerçek zamanlı altyazı, otomatik altyazı, live caption 2026',
        'og_description': 'AI canlı altyazıların nasıl çalıştığı, OS/tarayıcı/uygulama katmanlarında nerede göründüğü ve hangisinin ne zaman kazandığı.',
        'image_alt': 'Gerçek zamanlı konuşma sırasında ekranda görünen canlı altyazılar',
        'home_label': 'Ana Sayfa', 'articles_label': 'Makaleler',
        'breadcrumb_short': '2026\'da canlı altyazılar',
        'back_link': 'Makalelere dön', 'date_label': '28 Mayıs 2026',
        'author_label': 'Yazar', 'updated_label': 'Güncellendi',
        'twitter_description': 'Windows, Apple, Android, Chrome ve üçüncü taraf canlı altyazı katmanlarını kapsayan 2026 açıklaması.',
        'intro': '<strong>Canlı altyazılar</strong> tek bir özellik gibi görünür, ancak terim üç çok farklı uygulama gizler: işletim sistemi yer paylaşımları, tarayıcıya yerleşik altyazılar ve üçüncü taraf altyazı katmanları. Her biri farklı bir senaryoda kazanır ve «sadece altyazıları aç» şaşırtıcı platform asimetrilerini gizler.',
        'h2_1': 'Canlı altyazıların göründüğü üç katman',
        'p_1': 'Aynı «altyazı» kelimesi üç çok farklı uygulamayı gizler:',
        'li_1a': '<strong>İşletim sistemi seviyesi altyazılar:</strong> işletim sistemi sistem sesini dinler ve kayan bir pencerede altyazıları render eder. Örnekler: Windows 11 Live Captions, macOS Live Captions, Android Live Caption.',
        'li_1b': '<strong>Tarayıcı seviyesi altyazılar:</strong> tarayıcı herhangi bir sekmeden ses yakalar ve yalnızca o sekme için altyazı gösterir. Örnek: Chrome Live Caption.',
        'li_1c': '<strong>Uygulama seviyesi altyazılar:</strong> toplantı veya medya uygulaması kendi penceresinde kendi altyazılarını üretir. Örnekler: Zoom, Microsoft Teams, Google Meet, YouTube.',
        'h2_2': '2026 karşılaştırması: hangi canlı altyazıları ne zaman kullanmalı',
        'th_1': 'Sağlayıcı', 'th_2': 'Katman', 'th_3': 'Güçlü yönler', 'th_4': 'Sınırlar',
        't1c1': 'Windows 11 Live Captions', 't1c2': 'OS seviyesi', 't1c3': 'Tüm masaüstü uygulamalarında çalışır, cihaz üzerinde gizlilik, ücretsiz', 't1c4': 'İngilizce dışında sınırlı dil kapsamı',
        't2c1': 'macOS Live Captions', 't2c2': 'OS seviyesi', 't2c3': 'Apple Silicon\'da sistem geneli altyazılar, cihaz üzerinde', 't2c4': 'Yeni macOS gerektirir; dil listesi Windows\'tan daha dar',
        't3c1': 'Chrome Live Caption', 't3c2': 'Tarayıcı seviyesi', 't3c3': 'Ses çalan herhangi bir sekmede çalışır; yerel olarak çalışır', 't3c4': 'Sekme kapsamlı; birçok bölgede yalnızca İngilizce',
        't4c1': 'Zoom / Teams / Meet altyazıları', 't4c2': 'Uygulama seviyesi', 't4c3': 'En iyi konuşmacı etiketleme ve toplantı bağlamı', 't4c4': 'Her platformun kapsamı ve yönetici politikası farklıdır',
        't5c1': 'Live Subtitles', 't5c2': 'OS seviyesi + iki dilli', 't5c3': 'Uygulamalar arası altyazılar artı gerçek zamanlı çeviri; Windows ve macOS uygulamalarında çalışır', 't5c4': 'Üçüncü taraf kurulum gerekli; OS ile önceden paketlenmemiş',
        'h2_3': 'Hangi katman ne zaman kazanır',
        'h3_1': 'OS seviyesi kazanır, ne zaman', 'p_3a': 'Gün boyunca uygulamalar arasında geçiş yaparsınız — sabah toplantı, öğle yemeğinde Netflix, öğleden sonra podcast. Bir OS katmanı sizi her yerde takip eder. Gizlilik hassasiyetli durumlar da OS seviyesini tercih eder çünkü ses cihazdan asla ayrılmaz.',
        'h3_2': 'Uygulama seviyesi kazanır, ne zaman', 'p_3b': 'Tüm gün bir toplantı platformunun içinde kalırsınız, toplantı katılımcı listesinden adlarla konuşmacı etiketleri istersiniz veya yöneticiniz Teams/Meet/Zoom\'a çevrilmiş altyazılar dağıttı.',
        'h3_3': 'Üçüncü taraf uygulamalar arası kazanır, ne zaman', 'p_3c': 'Altyazılarla birlikte çeviri ihtiyacınız var (OS yerel olanlar çoğunlukla aynı dildir), öğrenme için iki dilli görüntü veya kendi altyazılarını sağlamayan platformlarda (Discord sesli sohbet, OBS yayınları, kayıtlı video dosyaları) altyazı.',
        'h2_4': 'Kurulum kontrol listesi',
        'li_4a': 'Baskın bağlamınızı belirleyin: masaüstü, mobil, tarayıcı veya belirli uygulama.',
        'li_4b': 'Önce yerel OS altyazılarını deneyin — ücretsiz ve sıfır kurulum.',
        'li_4c': 'Çeviri veya çoklu uygulama kapsamı gerekiyorsa üçüncü taraf katmanı ekleyin.',
        'li_4d': 'Aynı bağlamda iki altyazı katmanını üst üste koymaktan kaçının: görsel olarak senkronizasyonu kaybeder ve göze yorucudur.',
        'h2_faq': 'SSS',
        'q1': 'Canlı altyazılar çevrimdışı çalışır mı?', 'a1': 'Windows 11, macOS ve son Android\'de OS seviyesi altyazılar cihaz üzerindedir. Uygulama seviyesi altyazılar genellikle sunucu gerektirir.',
        'q2': 'Aynı anda iki dilde canlı altyazı alabilir miyim?', 'a2': 'Yerel OS altyazıları genellikle yalnızca kaynak dilindedir. İki dilli üçüncü taraf bir katman gerektirir.',
        'q3': 'Canlı altyazılar altyazıların yerini alacak mı?', 'a3': 'Canlı ses için evet; önceden kaydedilmiş film/TV için hayır — yazılı altyazılar hala ASR\'yi sanat açısından yener.',
        'h2_refs': 'Kaynaklar',
        'ref1_url': 'https://support.microsoft.com/en-us/windows/use-live-captions-to-better-understand-audio-4ffec0d6-5999-4b86-a39e-fe779ac15f04', 'ref1_label': 'Microsoft — Windows\'ta Live Captions kullanın',
        'ref2_url': 'https://support.apple.com/en-us/HT213295', 'ref2_label': 'Apple — Mac\'te Live Captions',
        'ref3_url': 'https://support.google.com/accessibility/android/answer/9350862', 'ref3_label': 'Google — Android\'de Live Caption',
        'ref4_url': 'https://support.google.com/chrome/answer/10538231', 'ref4_label': 'Google — Chrome\'da Live Caption',
        'related_label': 'İlgili okumalar',
        'related': [('24', 'Sesi metne dönüştürme 2026: gerçek zamanlı vs toplu transkripsiyon karşılaştırması'), ('23', 'Sesli çeviri 2026: gerçek zamanlı araçlar kullanım senaryosuna göre karşılaştırıldı'), ('18', '2026\'da Google Meet vs Zoom vs Teams çevrilmiş altyazılar')],
        'cta_title': 'Her uygulamada canlı altyazılar, gerçek zamanlı çeviri ile',
        'cta_body': 'Uygulamalar arası canlı altyazılar ve iki dilli çeviri — sesin olduğu her yerde.',
        'cta_button': 'Microsoft Store\'dan indir',
    },
    'uk': {
        'title': 'Живі субтитри 2026: як працюють AI-субтитри і коли їх використовувати',
        'description': 'Живі субтитри розібрані: як AI перетворює мовлення на текст за 1–2 секунди, де вони з\'являються на Windows, Mac, Android, iOS і Chrome, і коли який варіант виграє.',
        'keywords': 'живі субтитри, live caption, AI субтитри, реал-тайм субтитри, автоматичні субтитри, живі субтитри 2026',
        'og_description': 'Як працюють AI-субтитри, на яких шарах вони з\'являються (OS/браузер/застосунок) і коли який виграє.',
        'image_alt': 'Живі субтитри на екрані під час реальної розмови',
        'home_label': 'Головна', 'articles_label': 'Статті',
        'breadcrumb_short': 'Живі субтитри 2026',
        'back_link': 'Назад до статей', 'date_label': '28 травня 2026',
        'author_label': 'Автор', 'updated_label': 'Оновлено',
        'twitter_description': 'Пояснення 2026 з шарами живих субтитрів Windows, Apple, Android, Chrome та сторонніх інструментів.',
        'intro': '<strong>Живі субтитри</strong> звучать як одна функція, але за словом ховаються три дуже різні реалізації: OS-оверлеї, вбудовані браузерні субтитри та сторонні шари субтитрів. Кожна виграє у своєму сценарії, і фраза «просто увімкни субтитри» приховує несподівані асиметрії платформ.',
        'h2_1': 'Три шари, де з\'являються живі субтитри',
        'p_1': 'Одне слово «субтитри» приховує три дуже різні реалізації:',
        'li_1a': '<strong>OS-рівень:</strong> ОС слухає системне аудіо і малює субтитри у плаваючому вікні. Приклади: Windows 11 Live Captions, macOS Live Captions, Android Live Caption.',
        'li_1b': '<strong>Рівень браузера:</strong> браузер захоплює аудіо з будь-якої вкладки і показує субтитри лише для цієї вкладки. Приклад: Chrome Live Caption.',
        'li_1c': '<strong>Рівень застосунку:</strong> застосунок зустрічей або медіа генерує свої субтитри у вікні застосунку. Приклади: Zoom, Microsoft Teams, Google Meet, YouTube.',
        'h2_2': 'Порівняння 2026: які живі субтитри використовувати коли',
        'th_1': 'Постачальник', 'th_2': 'Шар', 'th_3': 'Сильні сторони', 'th_4': 'Обмеження',
        't1c1': 'Windows 11 Live Captions', 't1c2': 'OS-рівень', 't1c3': 'Працює у всіх десктоп-застосунках, приватність на пристрої, безкоштовно', 't1c4': 'Обмежене покриття мов поза англійською',
        't2c1': 'macOS Live Captions', 't2c2': 'OS-рівень', 't2c3': 'Системні субтитри на Apple Silicon, на пристрої', 't2c4': 'Потрібен свіжий macOS; список мов вужчий за Windows',
        't3c1': 'Chrome Live Caption', 't3c2': 'Рівень браузера', 't3c3': 'Працює в будь-якій вкладці з аудіо; локально', 't3c4': 'Лише в одній вкладці; у багатьох регіонах лише англійська',
        't4c1': 'Субтитри Zoom / Teams / Meet', 't4c2': 'Рівень застосунку', 't4c3': 'Найкраща розмітка мовців і контекст зустрічі', 't4c4': 'Покриття та політика адміна відрізняються в кожної платформи',
        't5c1': 'Live Subtitles', 't5c2': 'OS-рівень + двомовний', 't5c3': 'Субтитри між застосунками плюс переклад у реальному часі; працює в застосунках Windows і macOS', 't5c4': 'Потрібна стороння встановка; не передустановлено в ОС',
        'h2_3': 'Коли який шар виграє',
        'h3_1': 'OS-рівень виграє, коли', 'p_3a': 'Ти рухаєшся між застосунками протягом дня — зранку зустріч, в обід Netflix, вдень подкаст. Один OS-шар йде за тобою всюди. Випадки, чутливі до приватності, також віддають перевагу OS-рівню, бо аудіо не покидає пристрій.',
        'h3_2': 'Рівень застосунку виграє, коли', 'p_3b': 'Ти весь день у одній meeting-платформі, потрібна розмітка мовців з іменами зі списку учасників, або адміністратор розгорнув перекладені субтитри в Teams/Meet/Zoom.',
        'h3_3': 'Сторонній крос-застосунковий виграє, коли', 'p_3c': 'Потрібні субтитри + переклад (OS-нативні зазвичай одномовні), двомовне відображення для навчання, або субтитри на платформах без власних (Discord голосовий чат, OBS-стріми, записані відео).',
        'h2_4': 'Чек-ліст налаштування',
        'li_4a': 'Визначте свій домінуючий контекст: десктоп, мобільний, браузер або конкретний застосунок.',
        'li_4b': 'Спочатку спробуйте нативні OS-субтитри — безкоштовно і без встановлення.',
        'li_4c': 'Якщо потрібен переклад або мульти-застосунковий охват — додайте сторонній шар.',
        'li_4d': 'Не накладайте два шари субтитрів в одному контексті: вони візуально розходяться і збивають око.',
        'h2_faq': 'Поширені запитання',
        'q1': 'Чи працюють живі субтитри офлайн?', 'a1': 'OS-субтитри на Windows 11, macOS та останніх Android — на пристрої. Субтитри застосунків зазвичай потребують сервера.',
        'q2': 'Чи можна отримати живі субтитри одразу двома мовами?', 'a2': 'Нативні OS зазвичай лише вихідна мова. Двомовні потребують стороннього шару.',
        'q3': 'Чи замінять живі субтитри звичайні?', 'a3': 'Для живого аудіо — так; для передзаписаних фільмів/ТБ — ні, рукописні субтитри все ще перевершують ASR за якістю.',
        'h2_refs': 'Джерела',
        'ref1_url': 'https://support.microsoft.com/en-us/windows/use-live-captions-to-better-understand-audio-4ffec0d6-5999-4b86-a39e-fe779ac15f04', 'ref1_label': 'Microsoft — Live Captions на Windows',
        'ref2_url': 'https://support.apple.com/en-us/HT213295', 'ref2_label': 'Apple — Live Captions на Mac',
        'ref3_url': 'https://support.google.com/accessibility/android/answer/9350862', 'ref3_label': 'Google — Live Caption на Android',
        'ref4_url': 'https://support.google.com/chrome/answer/10538231', 'ref4_label': 'Google — Live Caption у Chrome',
        'related_label': 'Схожі матеріали',
        'related': [('24', 'Транскрибація аудіо в текст 2026: реал-тайм vs батч-транскрипція'), ('23', 'Голосовий перекладач у 2026 році: інструменти реального часу за сценаріями'), ('18', 'Google Meet vs Zoom vs Teams: перекладені субтитри у 2026 році')],
        'cta_title': 'Живі субтитри у всіх застосунках із перекладом у реальному часі',
        'cta_body': 'Крос-застосункові живі субтитри та двомовний переклад — там, де є аудіо.',
        'cta_button': 'Завантажити з Microsoft Store',
    },
    'nl': {
        'title': 'Live ondertiteling in 2026: hoe AI-ondertiteling werkt en wanneer te gebruiken',
        'description': 'Live ondertiteling uitgelegd: hoe AI spraak omzet in tekst binnen 2 seconden, waar ze verschijnen op Windows, Mac, Android, iOS en Chrome, en wanneer elke optie wint.',
        'keywords': 'live ondertiteling, live caption, ai ondertiteling, realtime ondertiteling, automatische ondertiteling, live caption 2026',
        'og_description': 'Hoe AI-live-ondertiteling werkt, waar het verschijnt op OS/browser/app-lagen en wanneer elk wint.',
        'image_alt': 'Live ondertiteling op het scherm tijdens een realtime gesprek',
        'home_label': 'Home', 'articles_label': 'Artikelen',
        'breadcrumb_short': 'Live ondertiteling in 2026',
        'back_link': 'Terug naar artikelen', 'date_label': '28 mei 2026',
        'author_label': 'Auteur', 'updated_label': 'Bijgewerkt',
        'twitter_description': 'Uitleg 2026 over Windows, Apple, Android, Chrome en derde-partij live-ondertiteling-lagen.',
        'intro': '<strong>Live ondertiteling</strong> klinkt als één functie, maar de term verbergt drie zeer verschillende implementaties: OS-overlays, in de browser ingebouwde ondertiteling en derde-partij ondertitelingslagen. Elk wint in een ander scenario, en «zet gewoon de ondertiteling aan» verbergt verrassende platform-asymmetrieën.',
        'h2_1': 'Drie lagen waar live ondertiteling verschijnt',
        'p_1': 'Hetzelfde woord «ondertiteling» verbergt drie zeer verschillende implementaties:',
        'li_1a': '<strong>OS-niveau ondertiteling:</strong> het besturingssysteem luistert naar systeemaudio en rendert ondertiteling in een zwevend venster. Voorbeelden: Windows 11 Live Captions, macOS Live Captions, Android Live Caption.',
        'li_1b': '<strong>Browser-niveau ondertiteling:</strong> de browser legt audio vast van elke tab en toont ondertiteling alleen voor die tab. Voorbeeld: Chrome Live Caption.',
        'li_1c': '<strong>App-niveau ondertiteling:</strong> de vergader- of media-app genereert eigen ondertiteling binnen het eigen venster. Voorbeelden: Zoom, Microsoft Teams, Google Meet, YouTube.',
        'h2_2': '2026 vergelijking: welke live ondertiteling wanneer te gebruiken',
        'th_1': 'Aanbieder', 'th_2': 'Laag', 'th_3': 'Sterke punten', 'th_4': 'Beperkingen',
        't1c1': 'Windows 11 Live Captions', 't1c2': 'OS-niveau', 't1c3': 'Werkt in alle desktop-apps, privacy op apparaat, gratis', 't1c4': 'Beperkte taaldekking buiten Engels',
        't2c1': 'macOS Live Captions', 't2c2': 'OS-niveau', 't2c3': 'Systeembrede ondertiteling op Apple Silicon, op apparaat', 't2c4': 'Vereist recente macOS; talenlijst smaller dan Windows',
        't3c1': 'Chrome Live Caption', 't3c2': 'Browser-niveau', 't3c3': 'Werkt op elke tab die audio afspeelt; lokaal', 't3c4': 'Beperkt tot tab; alleen Engels in veel regio\'s',
        't4c1': 'Zoom / Teams / Meet ondertiteling', 't4c2': 'App-niveau', 't4c3': 'Beste sprekerlabels en vergadercontext', 't4c4': 'Dekking en admin-beleid verschilt per platform',
        't5c1': 'Live Subtitles', 't5c2': 'OS-niveau + tweetalig', 't5c3': 'Cross-app ondertiteling plus realtime vertaling; werkt op Windows en macOS apps', 't5c4': 'Derde-partij installatie vereist; niet vooraf gebundeld met OS',
        'h2_3': 'Wanneer wint elke laag',
        'h3_1': 'OS-niveau wint wanneer', 'p_3a': 'Je beweegt overdag tussen apps — vergadering in de ochtend, Netflix bij de lunch, podcast \'s middags. Eén OS-laag volgt je overal. Privacy-gevoelige use cases geven ook de voorkeur aan OS-niveau omdat audio nooit het apparaat verlaat.',
        'h3_2': 'App-niveau wint wanneer', 'p_3b': 'Je blijft de hele dag binnen één vergaderplatform, hebt sprekerlabels nodig met namen uit de deelnemerslijst, of je admin heeft vertaalde ondertiteling uitgerold in Teams/Meet/Zoom.',
        'h3_3': 'Derde-partij cross-app wint wanneer', 'p_3c': 'Je hebt vertaling naast ondertiteling nodig (OS-natief is meestal dezelfde taal), tweetalige weergave voor leren, of ondertiteling op platforms die geen eigen leveren (Discord voice chat, OBS streams, opgenomen videobestanden).',
        'h2_4': 'Setup-checklist',
        'li_4a': 'Identificeer je dominante context: desktop, mobiel, browser of specifieke app.',
        'li_4b': 'Probeer eerst de native OS-ondertiteling — gratis en geen installatie.',
        'li_4c': 'Als je vertaling of multi-app dekking nodig hebt, voeg een derde-partij laag toe.',
        'li_4d': 'Vermijd het stapelen van twee ondertitelingslagen in dezelfde context: ze raken visueel ontstemd en verwarren het oog.',
        'h2_faq': 'Veelgestelde vragen',
        'q1': 'Werkt live ondertiteling offline?', 'a1': 'OS-niveau ondertiteling op Windows 11, macOS en recente Android is op apparaat. App-niveau ondertiteling heeft meestal een server nodig.',
        'q2': 'Kan ik live ondertiteling tegelijk in twee talen krijgen?', 'a2': 'Native OS-ondertiteling is meestal alleen brontaal. Tweetalig vereist een derde-partij laag.',
        'q3': 'Zal live ondertiteling ondertitels vervangen?', 'a3': 'Voor live audio ja; voor vooraf opgenomen film/TV niet — gescripte ondertitels verslaan nog steeds ASR in vakmanschap.',
        'h2_refs': 'Bronnen',
        'ref1_url': 'https://support.microsoft.com/en-us/windows/use-live-captions-to-better-understand-audio-4ffec0d6-5999-4b86-a39e-fe779ac15f04', 'ref1_label': 'Microsoft — Live Captions gebruiken op Windows',
        'ref2_url': 'https://support.apple.com/en-us/HT213295', 'ref2_label': 'Apple — Live Captions op Mac',
        'ref3_url': 'https://support.google.com/accessibility/android/answer/9350862', 'ref3_label': 'Google — Live Caption op Android',
        'ref4_url': 'https://support.google.com/chrome/answer/10538231', 'ref4_label': 'Google — Live Caption in Chrome',
        'related_label': 'Gerelateerde artikelen',
        'related': [('24', 'Audio naar tekst transcriberen 2026: realtime vs batch-transcriptie vergeleken'), ('23', 'Spraakvertaling in 2026: realtime tools vergeleken per use case'), ('18', 'Google Meet vs Zoom vs Teams: vertaalde ondertiteling in 2026')],
        'cta_title': 'Live ondertiteling op elke app, met realtime vertaling',
        'cta_body': 'Cross-app live ondertiteling en tweetalige vertaling — overal waar audio is.',
        'cta_button': 'Download via Microsoft Store',
    },
}


def main():
    # Generate article-25 in remaining locales
    role_map = ART25_AUTHOR_ROLES
    for locale, data in ART25.items():
        data['author_name'] = ART25_AUTHOR_NAME
        data['author_url'] = ART25_AUTHOR_URL
        data['author_role'] = role_map.get(locale, role_map['en'])
        fp = os.path.join(ROOT, 'articles', locale, 'article-25.html')
        if os.path.exists(fp):
            print(f'  SKIP articles/{locale}/article-25.html (exists)')
            continue
        html = render(locale, 25, data)
        with open(fp, 'w', encoding='utf-8') as f:
            f.write(html)
        print(f'  WROTE articles/{locale}/article-25.html')

    print(f'\nDone. article-25 generated for {len(ART25)} locales.')


if __name__ == '__main__':
    main()
