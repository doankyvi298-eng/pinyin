const fs = require('fs');
const p = require('path');
function cnNum(n){
  const map = ['零','一','二','三','四','五','六','七','八','九'];
  if (n<=10) return n===10? '十' : map[n];
  if (n<20) return '十' + map[n-10];
  if (n===20) return '二十';
  return String(n);
}
const htmlFile = p.resolve(__dirname, '..', 'index.html');
let html = fs.readFileSync(htmlFile, 'utf8');
// Ensure UTF-8 meta exists
if (!/<meta[^>]*charset=.*utf-8/i.test(html)) {
  html = html.replace(/<head>/i, '<head>\n    <meta charset="utf-8" />');
}
// Replace label text to 关卡：
html = html.replace(/(<label[^>]*for="lesson"[^>]*>)([^<]*)/i, '$1关卡：');
// Rebuild options 第一关..第二十关
const opts = Array.from({length:20}, (_,i)=>{
  const n=i+1; const sel = n===1? ' selected' : '';
  return `          <option value="L${n}"${sel}>第${cnNum(n)}关</option>`;
}).join('\n');
html = html.replace(/(<select id="lesson"[^>]*>)[\s\S]*?(<\/select>)/, `$1\n${opts}\n        $2`);
fs.writeFileSync(htmlFile, html, 'utf8');
console.log('Fixed lesson label/options to 关卡，1-20 中文序号。');