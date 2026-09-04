"""Inject meta-pixel.js into every HTML file.

Одного общего файла достаточно на весь сайт: страниц 909, общего <head> нет (GitHub Pages,
SSI недоступен), поэтому ссылка на скрипт ставится в каждый файл — как в своё время gtag.

Idempotent: пропускает файлы, где meta-pixel.js уже подключён.
Вставляет сразу после <meta name="viewport"> — канонического места блока аналитики.

Исключения:
- buy/index.html — там подключение без defer, инлайновый скрипт страницы открывает чекаут
  раньше, чем выполнились бы отложенные скрипты; правится руками.
- tapcard-privacy.html — privacy-страница другого приложения для Google Play, на ней нет
  никакой аналитики и не должно быть.

Чтение и запись — с newline='': в рабочей копии CRLF (core.autocrlf=true, .gitattributes нет),
а обычное чтение схлопнуло бы их в '\\n' и переписало бы весь сайт на LF. Блок вставки берёт
перевод строки у самого файла.
"""
import os
import re
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))

PIXEL_BLOCK = """
    <!-- Meta pixel (LiveSubtitles Web) -->
    <script src="/meta-pixel.js" defer></script>"""

MARKER = 'meta-pixel.js'

SKIP_DIRS = {'.git', '.notpush', 'node_modules'}
SKIP_FILES = {
    os.path.join(ROOT, 'buy', 'index.html'),
    os.path.join(ROOT, 'tapcard-privacy.html'),
}

VIEWPORT_RE = re.compile(r'(<meta\s+name="viewport"[^>]*>)', re.IGNORECASE)


def process(path: str, dry: bool) -> str:
    with open(path, 'r', encoding='utf-8', newline='') as f:
        html = f.read()

    if MARKER in html:
        return 'skip'

    m = VIEWPORT_RE.search(html)
    if not m:
        return 'no-viewport'

    if not dry:
        block = PIXEL_BLOCK.replace('\n', '\r\n') if '\r\n' in html else PIXEL_BLOCK
        new_html = html[:m.end()] + block + html[m.end():]
        with open(path, 'w', encoding='utf-8', newline='') as f:
            f.write(new_html)

    return 'injected'


def main():
    dry = '--dry-run' in sys.argv
    stats = {'skip': 0, 'injected': 0, 'no-viewport': 0, 'excluded': 0}

    for dirpath, dirnames, filenames in os.walk(ROOT):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for fn in sorted(filenames):
            if not fn.endswith('.html'):
                continue
            path = os.path.join(dirpath, fn)
            if path in SKIP_FILES:
                stats['excluded'] += 1
                continue
            result = process(path, dry)
            stats[result] += 1
            if result == 'no-viewport':
                print(f'no-viewport: {path}')

    print(f"\n{'DRY-RUN ' if dry else ''}Summary:")
    for k, v in stats.items():
        print(f"  {k}: {v}")


if __name__ == '__main__':
    main()
