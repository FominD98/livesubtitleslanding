// The SoftwareApplication JSON-LD on every landing still advertised three
// platforms and only linked the Windows/Apple listings. Add Android + the Play
// Store URL (SEO rule R6 — schema must describe the actual product).
//
// Usage: node _fix_app_schema_android.js
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PLAY_URL = 'https://play.google.com/store/apps/details?id=com.livesubtitles.android';
const FILES = ['index.html', ...['ru', 'fr', 'es', 'de', 'it', 'ja', 'ko', 'zh', 'ar', 'hi', 'pt', 'pl', 'nl', 'tr', 'uk'].map(l => `${l}/index.html`)];

for (const rel of FILES) {
    const abs = path.join(ROOT, rel);
    const before = fs.readFileSync(abs, 'utf8');
    let out = before;

    out = out.replace(
        '"operatingSystem": "Windows 10, Windows 11, macOS, iOS"',
        '"operatingSystem": "Windows 10, Windows 11, macOS, iOS, Android"'
    );
    if (!out.includes(PLAY_URL + '"\n') && !out.includes(PLAY_URL + '"\r\n')) {
        out = out.replace(
            /("sameAs": \[\r?\n(\s*)"https:\/\/apps\.microsoft\.com\/store\/detail\/9PH1R9DJG47S",\r?\n\s*"https:\/\/apps\.apple\.com\/app\/live-captions-translator\/id6760197210\?platform=mac",\r?\n\s*"https:\/\/apps\.apple\.com\/app\/live-captions-translator\/id6760197210")(\r?\n)/,
            (m, head, indent, eol) => `${head},${eol}${indent}"${PLAY_URL}"${eol}`
        );
    }

    if (out === before) { console.log(`  --    ${rel}  (already patched)`); continue; }
    // Fail loudly rather than shipping broken schema.
    let m, re = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g, i = 0;
    while ((m = re.exec(out)) !== null) { i++; JSON.parse(m[1]); }
    fs.writeFileSync(abs, out, 'utf8');
    console.log(`  ok    ${rel}`);
}
