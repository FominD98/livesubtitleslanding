// _tr_util.js
// Shared loader for translations.js. The file executes DOM helpers at top level,
// so it cannot simply be required — this extracts the `const translations = {...}`
// object literal by brace matching and evaluates just that.
//
//   const { loadTranslations, flattenKeys } = require('./_tr_util.js');

const fs = require('fs');
const vm = require('vm');

function loadTranslations(filePath = require('path').join(__dirname, 'translations.js')) {
    const src = fs.readFileSync(filePath, 'utf8');
    const objStart = src.indexOf('const translations');
    if (objStart === -1) throw new Error('translations.js: `const translations` not found');

    const after = src.slice(objStart);
    let i = after.indexOf('{');
    if (i === -1) throw new Error('translations.js: opening brace not found');

    let depth = 0, end = -1, inStr = false, strCh = '';
    for (; i < after.length; i++) {
        const ch = after[i];
        if (inStr) {
            if (ch === '\\') { i++; continue; }
            if (ch === strCh) inStr = false;
            continue;
        }
        if (ch === '"' || ch === "'" || ch === '`') { inStr = true; strCh = ch; continue; }
        if (ch === '{') depth++;
        else if (ch === '}') { depth--; if (depth === 0) { end = i; break; } }
    }
    if (end === -1) throw new Error('translations.js: unbalanced braces');

    const objSrc = after.slice(after.indexOf('{'), end + 1);
    const sandbox = {};
    vm.createContext(sandbox);
    return vm.runInContext('(' + objSrc + ')', sandbox);
}

function flattenKeys(obj, prefix = '') {
    let out = [];
    for (const k of Object.keys(obj)) {
        const v = obj[k];
        if (v && typeof v === 'object' && !Array.isArray(v)) out = out.concat(flattenKeys(v, prefix + k + '.'));
        else out.push(prefix + k);
    }
    return out;
}

module.exports = { loadTranslations, flattenKeys };
