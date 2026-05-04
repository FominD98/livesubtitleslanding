// bake-i18n-defaults.js
// Bake translations from translations.js into static HTML defaults so the page
// served before JS execution is in the page's declared <html lang>. Required
// by SEO rule R1 (see seo/seo-rules.md).
//
// Usage:  node bake-i18n-defaults.js
//
// Targets:
//   - ./index.html                  -> en-US
//   - ./<locale>/index.html         -> <locale>-XX (per LANG_MAP)
//
// The script is idempotent: running twice produces the same output. It only
// rewrites the inner text of <... data-translate="key.path">TEXT</...> nodes;
// markup, attributes, ordering, and whitespace outside the inner text are
// preserved.

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = __dirname;
const TRANSLATIONS_PATH = path.join(ROOT, 'translations.js');

// folder name -> BCP-47 key in translations.js
const LANG_MAP = {
    en: 'en-US',
    ru: 'ru-RU',
    fr: 'fr-FR',
    es: 'es-ES',
    de: 'de-DE',
    it: 'it-IT',
    ja: 'ja-JP',
    ko: 'ko-KR',
    zh: 'zh-CN',
    ar: 'ar-SA',
    hi: 'hi-IN',
    pt: 'pt-BR',
    pl: 'pl-PL',
    nl: 'nl-NL',
    tr: 'tr-TR',
    uk: 'uk-UA',
};

function loadTranslations() {
    const src = fs.readFileSync(TRANSLATIONS_PATH, 'utf8');
    // translations.js is a top-level `const translations = {...};` followed by
    // helper functions. Evaluate just the object literal in a sandbox.
    const sandbox = { module: {}, exports: {}, document: undefined, window: undefined, localStorage: undefined };
    vm.createContext(sandbox);
    // Strip the runtime helpers (everything after the last `};` that closes the object) by extracting up to that point.
    const objStart = src.indexOf('const translations');
    if (objStart === -1) throw new Error('translations.js: const translations = ... not found');
    // Find the matching closing brace + semicolon for the object literal.
    const after = src.slice(objStart);
    let depth = 0, end = -1, inStr = false, strCh = '', i = 0;
    // Skip to first '{'
    while (i < after.length && after[i] !== '{') i++;
    if (after[i] !== '{') throw new Error('translations.js: opening brace not found');
    for (; i < after.length; i++) {
        const c = after[i];
        if (inStr) {
            if (c === '\\') { i++; continue; }
            if (c === strCh) inStr = false;
            continue;
        }
        if (c === '\'' || c === '"' || c === '`') { inStr = true; strCh = c; continue; }
        if (c === '{') depth++;
        else if (c === '}') {
            depth--;
            if (depth === 0) { end = i; break; }
        }
    }
    if (end === -1) throw new Error('translations.js: object literal end not found');
    const literal = after.slice(after.indexOf('{'), end + 1);
    vm.runInContext('var translations = ' + literal + ';', sandbox);
    return sandbox.translations;
}

function lookup(obj, dottedKey) {
    const parts = dottedKey.split('.');
    let v = obj;
    for (const p of parts) {
        if (v == null) return undefined;
        v = v[p];
    }
    return typeof v === 'string' ? v : undefined;
}

// HTML escape only the characters that would break the surrounding markup if
// inserted as text content. We preserve & for entities like &amp; we don't
// want to double-encode existing entities — but translations.js values are
// plain strings with no entities, so encoding & is correct.
function escapeText(s) {
    return s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

// Replace inner text of every <ELEM ... data-translate="KEY">CONTENT</ELEM>
// with the matching translation, preserving the surrounding whitespace.
function bake(html, dict, fileLabel) {
    const reAttr = /data-translate\s*=\s*"([^"]+)"/g;
    let out = '';
    let cursor = 0;
    let touched = 0;
    let missing = 0;
    let m;
    while ((m = reAttr.exec(html)) !== null) {
        const key = m[1];
        // Find the '>' that closes this open tag (first '>' after the attribute,
        // accounting for attribute quotes that don't appear here since we already
        // matched a complete attribute).
        const openTagEnd = html.indexOf('>', m.index);
        if (openTagEnd === -1) continue;

        // Find the next '<' which starts the close tag (or a child). data-translate
        // elements in this codebase are leaf text nodes, so '<' marks the end of
        // the inner text.
        const closeTagStart = html.indexOf('<', openTagEnd + 1);
        if (closeTagStart === -1) continue;

        const inner = html.slice(openTagEnd + 1, closeTagStart);
        // Preserve leading + trailing whitespace exactly; replace the trimmed
        // text portion with the translation.
        const leadMatch = inner.match(/^\s*/);
        const trailMatch = inner.match(/\s*$/);
        const lead = leadMatch ? leadMatch[0] : '';
        const trail = trailMatch ? trailMatch[0] : '';

        const value = lookup(dict, key);
        if (value === undefined) {
            missing++;
            // Skip silently; do not modify
            out += html.slice(cursor, closeTagStart);
            cursor = closeTagStart;
            continue;
        }

        // Trim whitespace from the translation value before injecting; the
        // surrounding `lead` + `trail` already capture the structural
        // whitespace from the HTML, so re-adding the value's own trailing
        // space would compound on every run (idempotency bug).
        const newInner = lead + escapeText(value.trim()) + trail;
        out += html.slice(cursor, openTagEnd + 1) + newInner;
        cursor = closeTagStart;
        touched++;
    }
    out += html.slice(cursor);
    return { out, touched, missing };
}

function processFile(relPath, langCode, translations) {
    const abs = path.join(ROOT, relPath);
    if (!fs.existsSync(abs)) {
        console.log(`  SKIP  ${relPath} (not found)`);
        return;
    }
    const dict = translations[langCode];
    if (!dict) {
        console.log(`  SKIP  ${relPath} (no translations for ${langCode})`);
        return;
    }
    const before = fs.readFileSync(abs, 'utf8');
    const { out, touched, missing } = bake(before, dict, relPath);
    if (out === before) {
        console.log(`  ok    ${relPath}  (${langCode}, ${touched} keys, no changes)`);
        return;
    }
    fs.writeFileSync(abs, out, 'utf8');
    const note = missing ? ` (missing keys: ${missing})` : '';
    console.log(`  bake  ${relPath}  (${langCode}, ${touched} keys baked${note})`);
}

function main() {
    const translations = loadTranslations();
    const targets = [['index.html', 'en']];
    for (const folder of Object.keys(LANG_MAP)) {
        if (folder === 'en') continue;
        targets.push([path.join(folder, 'index.html'), folder]);
    }
    console.log(`Baking ${targets.length} files...`);
    for (const [relPath, folderLang] of targets) {
        processFile(relPath, LANG_MAP[folderLang], translations);
    }
    console.log('Done.');
}

main();
