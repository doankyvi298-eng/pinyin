const fs = require('fs');
const p = require('path');
const file = p.resolve(__dirname, '..', 'src', 'game.js');
let js = fs.readFileSync(file, 'utf8');
js = js.replace(/本课完成！/g, '本关完成！');
fs.writeFileSync(file, js, 'utf8');
console.log('win text updated');