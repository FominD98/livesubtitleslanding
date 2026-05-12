"""Add a visible 'Updated: <today>' line next to the existing 'Published' date in every article.
Idempotent — skips files that already include 'article-updated'."""
import os, re, glob, datetime

ROOT = os.path.dirname(os.path.abspath(__file__))
TODAY = datetime.date.today()

MONTH_NAMES = {
    'en': ['January','February','March','April','May','June','July','August','September','October','November','December'],
    'ru': ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'],
    'fr': ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'],
    'es': ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'],
    'de': ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'],
    'it': ['gennaio','febbraio','marzo','aprile','maggio','giugno','luglio','agosto','settembre','ottobre','novembre','dicembre'],
    'pt': ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'],
    'nl': ['januari','februari','maart','april','mei','juni','juli','augustus','september','oktober','november','december'],
    'pl': ['stycznia','lutego','marca','kwietnia','maja','czerwca','lipca','sierpnia','września','października','listopada','grudnia'],
    'tr': ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'],
    'uk': ['січня','лютого','березня','квітня','травня','червня','липня','серпня','вересня','жовтня','листопада','грудня'],
}
UPDATED_LABEL = {
    'en':'Updated','ru':'Обновлено','fr':'Mis à jour','es':'Actualizado','de':'Aktualisiert',
    'it':'Aggiornato','pt':'Atualizado','nl':'Bijgewerkt','pl':'Zaktualizowano','tr':'Güncellendi','uk':'Оновлено',
    'ja':'更新日','ko':'업데이트','zh':'更新','ar':'تم التحديث','hi':'अद्यतन',
}

def format_updated(loc):
    lbl = UPDATED_LABEL.get(loc, 'Updated')
    if loc in MONTH_NAMES:
        m = MONTH_NAMES[loc][TODAY.month - 1]
        if loc == 'en':
            return f'{lbl}: {m} {TODAY.day}, {TODAY.year}'
        if loc in ('ru','uk','pl'):
            return f'{lbl}: {TODAY.day} {m} {TODAY.year}'
        if loc == 'de':
            return f'{lbl}: {TODAY.day}. {m} {TODAY.year}'
        # generic "day month year"
        return f'{lbl}: {TODAY.day} {m} {TODAY.year}'
    # CJK / Arabic / Hindi — numeric form
    return f'{lbl}: {TODAY.year}-{TODAY.month:02d}-{TODAY.day:02d}'

UPDATED_LINE_TPL = '<div class="article-updated" itemprop="dateModified" content="{iso}" style="color:#888; font-size:0.9rem; margin-bottom:1.5rem;">{label}</div>'

stats = {'updated':0,'skipped':0,'no_anchor':0}
for fp in sorted(glob.glob(os.path.join(ROOT, 'articles', '*', 'article-*.html'))):
    loc = fp.replace(os.sep, '/').split('/')[-2]
    text = open(fp, encoding='utf-8').read()
    if 'article-updated' in text:
        stats['skipped'] += 1; continue
    label = format_updated(loc)
    line = UPDATED_LINE_TPL.format(iso=TODAY.isoformat(), label=label)
    # Insert immediately after the article-author block (if present) or article-date block.
    m = re.search(r'(<div class="article-author"[^>]*>.*?</div>)', text, re.S)
    if not m:
        m = re.search(r'(<div class="article-(?:date|meta)"[^>]*>.*?</div>)', text, re.S)
    if not m:
        m = re.search(r'(<h1[^>]*>.*?</h1>)', text, re.S)
    if not m:
        stats['no_anchor'] += 1; continue
    insert_at = m.end()
    new = text[:insert_at] + '\n        ' + line + text[insert_at:]
    open(fp, 'w', encoding='utf-8').write(new)
    stats['updated'] += 1

print('STATS:', stats)
