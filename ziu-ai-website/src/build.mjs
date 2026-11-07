// Static build: renders every page to dist/ and copies assets and fonts.
import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import { layout } from './components.mjs';
import { PAGES, NOT_FOUND } from './pages.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const DIST = path.join(ROOT, 'dist');
const A = path.join(DIST, 'assets');

fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(path.join(A, 'fonts'), { recursive: true });

// Content-hash versioning so returning visitors never get stale CSS/JS.
const files = fs.readdirSync(path.join(ROOT, 'src/assets'));
const hash = crypto.createHash('sha1');
for (const f of files) hash.update(fs.readFileSync(path.join(ROOT, 'src/assets', f)));
export const V = hash.digest('hex').slice(0, 8);
for (const f of files) {
  let src = fs.readFileSync(path.join(ROOT, 'src/assets', f), 'utf8');
  if (f.endsWith('.js')) src = src.replace(/from '\.\/(\w+)\.js'/g, `from './$1.js?v=${V}'`);
  fs.writeFileSync(path.join(A, f), src);
}

const fonts = [
  ['@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff2', 'instrument-serif-400.woff2'],
  ['@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2', 'instrument-serif-400-italic.woff2'],
  ['@fontsource-variable/inter-tight/files/inter-tight-latin-wght-normal.woff2', 'inter-tight-var.woff2'],
];
for (const [src, out] of fonts) fs.copyFileSync(path.join(ROOT, 'node_modules', src), path.join(A, 'fonts', out));

fs.writeFileSync(path.join(A, 'favicon.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" rx="4" fill="#101010"/><rect x="4" y="6" width="4" height="12" fill="#B9BCC2" opacity=".7"/><rect x="10" y="3.5" width="4" height="17" fill="#C52D3E"/><rect x="16" y="7.5" width="4" height="9" fill="#F7F5F2" opacity=".85"/></svg>`);
fs.writeFileSync(path.join(DIST, 'robots.txt'), 'User-agent: *\nAllow: /\n');

let count = 0;
for (const page of [...PAGES, NOT_FOUND]) {
  const file = page.path.endsWith('.html') ? path.join(DIST, page.path) : path.join(DIST, page.path, 'index.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, layout(page).replace(/(\/assets\/[\w.-]+\.(?:css|js))"/g, `$1?v=${V}"`));
  count++;
}
console.log(`Built ${count} pages into dist/`);
