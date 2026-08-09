// The locale landings wrap the TRYFREE_STORES comment across two lines
// differently from the root, so the earlier rewrite only caught index.html and
// 15 pages still claim "Android has no app yet". Cosmetic, but wrong.
//
// Usage: node _fix_stale_tryfree_comment.js
const fs = require('fs');
const path = require('path');

const FILES = ['ru', 'fr', 'es', 'de', 'it', 'ja', 'ko', 'zh', 'ar', 'hi', 'pt', 'pl', 'nl', 'tr', 'uk'].map(l => `${l}/index.html`);

for (const rel of FILES) {
    const abs = path.join(__dirname, rel);
    const before = fs.readFileSync(abs, 'utf8');
    const out = before.replace(
        /\/\/ Route the navbar "Try Free" to the visitor's actual platform store \(Win\/Mac\/iOS;(\r?\n\s*)\/\/ Android has no app yet -> send to the #download section with the notify flow\)\./,
        '// Route the navbar "Try Free" to the visitor\'s actual platform store$1// (Win/Mac/iOS/Android; unknown platform falls back to the #download section).'
    );
    if (out === before) { console.log(`  --    ${rel}  (already patched)`); continue; }
    fs.writeFileSync(abs, out, 'utf8');
    console.log(`  ok    ${rel}`);
}
