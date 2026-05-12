"""Inject 4 unique SEO content blocks before </main> on each thin language-pair page."""
import os, re, html
from _thin_page_data import PAGES

def render_block(slug, data):
    if 'lang_from' in data:
        lang_from = data['lang_from']
        lang_to = data['lang_to']
        native = data['native_name']
        # English-to-X variant
        title_pair = f'{lang_from} to {lang_to}'
    else:
        lang = data['lang']
        native = data['native_name']
        title_pair = f'{lang} to English'

    challenges = ''.join(f'<li>{c}</li>\n' for c in data['recognition_challenges'])

    # Idioms table
    idiom_rows = ''
    for tup in data['idioms']:
        if len(tup) == 3:
            literal_en = tup[1]
            meaning = tup[2]
            phrase = tup[0]
        else:
            phrase, literal_en, meaning = tup
        idiom_rows += f'<tr><td><strong>{phrase}</strong></td><td>{literal_en}</td><td>{meaning}</td></tr>\n'

    if 'lang_from' in data:
        # English -> Spanish variant: heading talks about source language differently
        section_title_a = f'Why {lang_from}-to-{lang_to} live translation is harder than it looks'
        section_title_b = f'5 {lang_from} idioms even Google Translate gets wrong in {lang_to}'
        section_title_c = f'Dual-subtitle workflows for {lang_to} learners'
        section_title_d = f'Live Subtitles vs Google Translate, DeepL, and Apple Translate for {lang_to}'
        intro_a = f'Generic translators were trained on news text, not on conference calls, podcasts, and movies. That is why live {lang_from}-to-{lang_to} translation routinely garbles three things:'
        intro_b = f'Idioms are the single biggest source of awkward AI translation. Below are five common {lang_from} expressions and what they should become in real {lang_to} — versus the literal output you usually get.'
        intro_c = f'Showing the original {lang_from} subtitle next to the {lang_to} translation is the fastest way for {lang_to} learners to lock in vocabulary and idiomatic phrasing in context.'
        intro_d = f'Three differences matter when picking a tool for live {lang_from}-to-{lang_to}:'
    else:
        section_title_a = f'Why {lang}-to-English live translation is harder than it looks'
        section_title_b = f'5 {lang} idioms even Google Translate gets wrong'
        section_title_c = f'Dual-subtitle workflows for {lang} learners'
        section_title_d = f'Live Subtitles vs Google Translate, DeepL, and Apple Translate for {lang}'
        intro_a = f'Generic translators were trained on news text, not on conference calls, podcasts, and movies. That is why live {lang}-to-English captions routinely garble three things:'
        intro_b = f'Idioms are the single biggest source of awkward AI translation. Below are five common {lang} expressions and what they should become in real English — versus the literal output you usually get.'
        intro_c = f'Showing the original {lang} subtitle next to the English translation is the fastest way for {lang} learners to lock in vocabulary and idiomatic phrasing in context.'
        intro_d = f'Three differences matter when picking a tool for live {lang}-to-English:'

    block = f'''
            <h2>{section_title_a}</h2>
            <p>{intro_a}</p>
            <ul>
                {challenges}
            </ul>
            <p>Live Subtitles handles all three by combining a recognizer trained on natural {data.get('lang', data.get('lang_from','source'))} speech with translation that uses sentence context, not raw token sequences. The result is captions that read like English (or {native}, when going the other way), not like a literal cipher.</p>

            <h2>{section_title_b}</h2>
            <p>{intro_b}</p>
            <table style="width:100%; border-collapse:collapse; margin:18px 0;">
                <thead>
                    <tr style="border-bottom:1px solid rgba(255,255,255,0.15);">
                        <th style="text-align:left; padding:8px;">{native} expression</th>
                        <th style="text-align:left; padding:8px;">Literal translation</th>
                        <th style="text-align:left; padding:8px;">What it really means</th>
                    </tr>
                </thead>
                <tbody>
                    {idiom_rows}
                </tbody>
            </table>
            <p class="muted">Live Subtitles applies idiom-aware AI translation, so phrases like the ones above are mapped to a natural English equivalent rather than rendered word-for-word.</p>

            <h2>{section_title_c}</h2>
            <p>{intro_c}</p>
            <ul>
                <li><strong>Shadowing practice</strong> — speak along with the {native} subtitle while glancing at the English translation only when you stall.</li>
                <li><strong>Active listening</strong> — hide the {native} line and only reveal it when comprehension breaks, then study the difference.</li>
                <li><strong>Vocabulary harvesting</strong> — pause on a phrase, copy the {native} text and the English equivalent into your spaced-repetition deck (Anki, RemNote).</li>
                <li><strong>Idiom hunting</strong> — actively look for non-literal expressions in {native} content and note how the AI handled them.</li>
            </ul>
            <p>Common content that {native} learners use this way: {data['use_contexts']}</p>

            <h2>{section_title_d}</h2>
            <p>{intro_d}</p>
            <ul>
                <li><strong>System-wide audio capture.</strong> Google Translate and DeepL want pasted text or a microphone. Live Subtitles taps Windows system audio directly, so any video, call, or stream becomes captionable without copy-paste.</li>
                <li><strong>Dual-line output.</strong> Apple Translate shows only one language at a time. Live Subtitles renders the {native} line and the English line simultaneously — the prerequisite for learning, not just translating.</li>
                <li><strong>{native} dialect coverage.</strong> Out of the box: {data['dialects']}</li>
            </ul>
            <p>For one-off text translation, DeepL is excellent. For continuous live audio in {native} — meetings, podcasts, drama, YouTube — only a system-audio + dual-subtitle workflow keeps up.</p>
'''
    return block

def main():
    for slug, data in PAGES.items():
        if not os.path.exists(slug):
            print(f'SKIP missing: {slug}'); continue
        text = open(slug, encoding='utf-8').read()
        if 'idioms even Google Translate gets wrong' in text:
            print(f'SKIP already expanded: {slug}'); continue
        block = render_block(slug, data)
        # Find the "Related platform guides" h2 — insert block BEFORE it.
        anchor = '<h2>Related platform guides</h2>'
        idx = text.find(anchor)
        if idx < 0:
            # fallback: insert before </main>
            idx = text.lower().find('</main>')
        if idx < 0:
            print(f'SKIP no anchor: {slug}'); continue
        new_text = text[:idx] + block + '\n            ' + text[idx:]
        open(slug, 'w', encoding='utf-8').write(new_text)
        print(f'EXPANDED: {slug}')

if __name__ == '__main__':
    main()
