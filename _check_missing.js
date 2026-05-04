const fs = require('fs');
const vm = require('vm');
const src = fs.readFileSync('translations.js', 'utf8');
const objStart = src.indexOf('const translations');
const after = src.slice(objStart);
let depth = 0, end = -1, inStr = false, strCh = '', i = 0;
while (i < after.length && after[i] !== '{') i++;
for (; i < after.length; i++) {
  const c = after[i];
  if (inStr) {
    if (c === '\\') { i++; continue; }
    if (c === strCh) inStr = false;
    continue;
  }
  if (c === "'" || c === '"' || c === '`') { inStr = true; strCh = c; continue; }
  if (c === '{') depth++;
  else if (c === '}') { depth--; if (depth === 0) { end = i; break; } }
}
const literal = after.slice(after.indexOf('{'), end + 1);
const sandbox = {};
vm.createContext(sandbox);
vm.runInContext('var translations = ' + literal + ';', sandbox);
const tr = sandbox.translations;
const html = fs.readFileSync('index.html', 'utf8');
const keys = [...html.matchAll(/data-translate="([^"]+)"/g)].map(m => m[1]);
function lookup(o, k) { return k.split('.').reduce((a,p) => a ? a[p] : undefined, o); }
for (const lang of Object.keys(tr)) {
  const dict = tr[lang];
  const missing = [...new Set(keys.filter(k => typeof lookup(dict, k) !== 'string'))];
  if (missing.length) console.log(lang, '->', missing);
}
