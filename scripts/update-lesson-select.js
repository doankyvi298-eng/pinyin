const fs = require('fs');
const p = require('path');
const f = p.resolve(__dirname, '..', 'index.html');
let html = fs.readFileSync(f, 'utf8');
const opts = Array.from({length:20}, (_,i)=>{
  const n=i+1; const sel = n===1? ' selected' : '';
  return `          <option value="L${n}"${sel}>?${n}?</option>`;
}).join('\n');
html = html.replace(/(<select id="lesson"[^>]*>)[\s\S]*?(<\/select>)/, `$1\n${opts}\n        $2`);
fs.writeFileSync(f, html, 'utf8');
console.log('Updated lesson select to 20 options.');