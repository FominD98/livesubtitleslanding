// Adding "Android" pushed four locale meta descriptions past the 160-char cap
// in seo/seo-rules.md R3. Trim them back. Usage: node _trim_descriptions.js
const fs = require('fs');
const path = require('path');
const p = path.join(__dirname, 'translations.js');
let s = fs.readFileSync(p, 'utf8');

const PAIRS = [
    // es-ES 162 -> 148
    ['Subtítulos en vivo y duales para cualquier app en Windows, Mac, iOS y Android. Traducción IA en tiempo real a 60+ idiomas en Zoom, Teams y Netflix. Prueba gratis.',
     'Subtítulos en vivo y duales para cualquier app en Windows, Mac, iOS y Android. Traducción IA a 60+ idiomas en Zoom, Teams y Netflix. Prueba gratis.'],
    // hi-IN 163 -> 152
    ['किसी भी ऐप पर लाइव कैप्शन और डुअल सबटाइटल — Windows, Mac, iOS व Android पर। Zoom, Teams, Netflix के लिए 60+ भाषाओं में रियल-टाइम AI अनुवाद। बिना माइक, फ्री ट्रायल।',
     'किसी भी ऐप पर लाइव कैप्शन और डुअल सबटाइटल — Windows, Mac, iOS व Android पर। Zoom, Teams, Netflix के लिए 60+ भाषाओं में रियल-टाइम AI अनुवाद। फ्री ट्रायल।'],
    // pt-BR 167 -> 156
    ['Legendas ao vivo e duplas em qualquer app no Windows, Mac, iOS e Android. Tradução por IA em tempo real em mais de 50 idiomas para Zoom, Teams e Netflix. Teste grátis.',
     'Legendas ao vivo e duplas em qualquer app no Windows, Mac, iOS e Android. Tradução IA em tempo real em 60+ idiomas para Zoom, Teams e Netflix. Teste grátis.'],
    // uk-UA 167 -> 150
    ['Живі та подвійні субтитри для будь-якого застосунку на Windows, Mac, iOS та Android. AI-переклад у реальному часі 60+ мовами для Zoom, Teams і Netflix. Пробний доступ.',
     'Живі та подвійні субтитри для будь-якого застосунку на Windows, Mac, iOS та Android. AI-переклад 60+ мовами для Zoom, Teams і Netflix. Пробний доступ.'],
];

for (const [from, to] of PAIRS) {
    const n = s.split("'" + from + "'").length - 1;
    if (n === 0) { console.log(`  --    already trimmed: ${to.slice(0, 40)}...`); continue; }
    if (n !== 2) throw new Error(`expected 2 hits (description + meta.description), got ${n}`);
    s = s.split("'" + from + "'").join("'" + to + "'");
    console.log(`  ok    ${from.length} -> ${to.length} chars`);
}
fs.writeFileSync(p, s, 'utf8');
