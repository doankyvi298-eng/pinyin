const fs=require('fs'); const p=require('path');
const file=p.resolve(__dirname,'..','src','lib','data.js');
let s=fs.readFileSync(file,'utf8');
s=s.replace(/'第'\+i\+'课'/g, "'第'+i+'关'");
fs.writeFileSync(file,s,'utf8');
console.log('data.js names -> 关');