const fs = require('fs');
const p = require('path');
function toCN(n){
  const map = ['?','?','?','?','?','?','?','?','?','?'];
  if (n<=10) return (n===10)?'?':map[n];
  if (n<20) return '?' + map[n-10];
  if (n===20) return '??';
  return String(n);
}
const root = p.resolve(__dirname, '..');
const htmlFile = p.join(root, 'index.html');
let html = fs.readFileSync(htmlFile, 'utf8');
// label: ?? -> ??
html = html.replace(/(<label[^>]*for="lesson"[^>]*>)[^<]*/,'$1???');
// options -> ???..????
const opts = Array.from({length:20}, (_,i)=>{
  const n=i+1; const sel = n===1? ' selected' : '';
  return `          <option value="L${n}"${sel}>?${toCN(n)}?</option>`;
}).join('\n');
html = html.replace(/(<select id="lesson"[^>]*>)[\s\S]*?(<\/select>)/, `$1\n${opts}\n        $2`);
// modal title ???? -> ????
html = html.replace('?????','?????');
fs.writeFileSync(htmlFile, html, 'utf8');
console.log('Updated label to ???options ???..?????modal ?????');