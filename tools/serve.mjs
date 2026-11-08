// Local dev server: serves dist/ (with the real 404 page) and a test form
// endpoint at POST /api/forms-dev that saves each submission to
// .form-submissions.jsonl so the whole form flow can be tested offline.
//   FORM_PROVIDER=custom FORM_ENDPOINT=/api/forms-dev npm run build
//   node tools/serve.mjs            (port 4174, or PORT=...)
// POST /api/forms-dev?fail=1 answers 500, to test the error state.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = path.join(ROOT, 'dist');
const LOG = path.join(ROOT, '.form-submissions.jsonl');
const PORT = +process.env.PORT || 4174;
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.txt': 'text/plain', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.mp4': 'video/mp4' };

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname === '/api/forms-dev') {
    if (req.method !== 'POST') { res.writeHead(405); res.end(); return; }
    let body = '';
    req.on('data', (c) => { body += c; if (body.length > 1e6) req.destroy(); });
    req.on('end', () => {
      let data;
      try { data = req.headers['content-type']?.includes('json') ? JSON.parse(body) : Object.fromEntries(new URLSearchParams(body)); }
      catch { res.writeHead(400, { 'Content-Type': 'application/json' }); res.end('{"success":false}'); return; }
      if (url.searchParams.has('fail')) { res.writeHead(500, { 'Content-Type': 'application/json' }); res.end('{"success":false}'); return; }
      fs.appendFileSync(LOG, JSON.stringify({ received: new Date().toISOString(), ...data }) + '\n');
      console.log(`[form] ${data.form || 'form'} from ${data.email || 'unknown'}`);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end('{"success":true}');
    });
    return;
  }
  let file = path.join(DIST, decodeURIComponent(url.pathname));
  if (!file.startsWith(DIST)) { res.writeHead(403); res.end(); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) {
    res.writeHead(404, { 'Content-Type': TYPES['.html'] });
    res.end(fs.readFileSync(path.join(DIST, '404.html')));
    return;
  }
  const type = TYPES[path.extname(file)] || 'application/octet-stream';
  const size = fs.statSync(file).size;
  // Byte ranges, so video seeks and plays in every browser (Safari requires them).
  const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || '');
  if (range) {
    const start = range[1] ? +range[1] : size - +range[2];
    const end = range[1] && range[2] ? Math.min(+range[2], size - 1) : size - 1;
    if (start >= size || start > end) { res.writeHead(416, { 'Content-Range': `bytes */${size}` }); res.end(); return; }
    res.writeHead(206, { 'Content-Type': type, 'Content-Range': `bytes ${start}-${end}/${size}`, 'Accept-Ranges': 'bytes', 'Content-Length': end - start + 1, 'Cache-Control': 'no-cache' });
    fs.createReadStream(file, { start, end }).pipe(res);
    return;
  }
  res.writeHead(200, { 'Content-Type': type, 'Content-Length': size, 'Accept-Ranges': 'bytes', 'Cache-Control': 'no-cache' });
  fs.createReadStream(file).pipe(res);
}).listen(PORT, () => console.log(`ZIU AI dev server on http://localhost:${PORT}`));
