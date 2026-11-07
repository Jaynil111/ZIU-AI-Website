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
const files = fs.readdirSync(path.join(ROOT, 'src/assets')).filter((f) => fs.statSync(path.join(ROOT, 'src/assets', f)).isFile());
const hash = crypto.createHash('sha1');
for (const f of files) hash.update(fs.readFileSync(path.join(ROOT, 'src/assets', f)));
export const V = hash.digest('hex').slice(0, 8);
for (const f of files) {
  let src = fs.readFileSync(path.join(ROOT, 'src/assets', f), 'utf8');
  if (f.endsWith('.js')) src = src.replace(/from '\.\/(\w+)\.js'/g, `from './$1.js?v=${V}'`).replace(/import\('\.\/(\w+)\.js'\)/g, `import('./$1.js?v=${V}')`);
  fs.writeFileSync(path.join(A, f), src);
}

// Recorded piano notes for the hero glass piano (Salamander Grand Piano, CC BY 3.0).
fs.mkdirSync(path.join(A, 'piano'), { recursive: true });
for (const f of fs.readdirSync(path.join(ROOT, 'src/assets/piano'))) fs.copyFileSync(path.join(ROOT, 'src/assets/piano', f), path.join(A, 'piano', f));

const fonts = [
  ['@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff2', 'instrument-serif-400.woff2'],
  ['@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2', 'instrument-serif-400-italic.woff2'],
  ['@fontsource-variable/inter-tight/files/inter-tight-latin-wght-normal.woff2', 'inter-tight-var.woff2'],
];
for (const [src, out] of fonts) fs.copyFileSync(path.join(ROOT, 'node_modules', src), path.join(A, 'fonts', out));

fs.writeFileSync(path.join(A, 'favicon.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><defs><linearGradient id="g" gradientUnits="userSpaceOnUse" x1="0" y1="14" x2="0" y2="34"><stop offset="0" stop-color="#F07080"/><stop offset="1" stop-color="#C52D3E"/></linearGradient></defs><rect width="48" height="48" rx="10" fill="#101010"/><rect x="7" y="9" width="34" height="6" rx=".5" fill="#F7F5F2"/><rect x="7" y="33" width="34" height="6" rx=".5" fill="#F7F5F2"/><g fill="url(#g)"><polygon points="28,15 41,15 20,33 7,33"/></g><path d="M19.5 15v18M29.5 15v18" stroke="#101010" stroke-width="1.3"/></svg>`);
fs.writeFileSync(path.join(DIST, 'robots.txt'), 'User-agent: *\nAllow: /\n');

let count = 0;
for (const page of [...PAGES, NOT_FOUND]) {
  const file = page.path.endsWith('.html') ? path.join(DIST, page.path) : path.join(DIST, page.path, 'index.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, layout(page).replace(/(\/assets\/[\w.-]+\.(?:css|js))"/g, `$1?v=${V}"`));
  count++;
}
console.log(`Built ${count} pages into dist/`);
