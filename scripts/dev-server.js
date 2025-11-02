// scripts/dev-server.js
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const root = path.resolve(__dirname, '..');
const port = process.env.PORT ? Number(process.env.PORT) : 5175;

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
};

function send(res, code, body, headers = {}) { res.writeHead(code, Object.assign({ 'Cache-Control': 'no-cache' }, headers)); res.end(body); }
function serveFile(res, filePath) { fs.readFile(filePath, (err, data) => { if (err) return send(res, 404, 'Not Found'); send(res, 200, data, { 'Content-Type': mime[path.extname(filePath)] || 'application/octet-stream' }); }); }

http.createServer((req,res)=>{
  const parsed = url.parse(req.url); let p = decodeURIComponent(parsed.pathname||'/');
  if (p === '/') return serveFile(res, path.join(root, 'index.html'));
  if (p.includes('..')) return send(res, 400, 'Bad Request');
  const filePath = path.join(root, p);
  fs.stat(filePath, (err, stat)=>{ if(!err && stat.isFile()) return serveFile(res, filePath); return serveFile(res, path.join(root, 'index.html')); });
}).listen(port, ()=> console.log(`[dev] serving ${root} on http://localhost:${port}`));