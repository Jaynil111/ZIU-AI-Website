// Static checks over dist/: internal links, anchors, ids, headings, alt/labels.
import fs from 'node:fs'; import path from 'node:path';
const DIST = process.argv[2] || path.resolve(import.meta.dirname, '../dist');
const titles = new Map(), descs = new Map();
const pages = [];
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).forEach((e) => { const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else if (e.name.endsWith('.html')) pages.push(p); });
walk(DIST);
const ids = new Map();
for (const p of pages) { const h = fs.readFileSync(p, 'utf8'); ids.set(p, new Set([...h.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]))); }
const problems = [];
for (const p of pages) {
  const h = fs.readFileSync(p, 'utf8'); const rel = path.relative(DIST, p);
  const content = h.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '').replace(/<!--[\s\S]*?-->/g, '');
  const text = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
  if (/class="[^"]*\bph\b/.test(content) || /\[[^\]]*\]/.test(text) || /\b(?:TODO|TBD|lorem ipsum|not yet supplied|replace before launch)\b/i.test(text)) problems.push(`${rel}: unfinished placeholder copy`);
  if (/(?:href|src)="\s*"|href="#"/.test(content)) problems.push(`${rel}: empty link or asset destination`);
  for (const [, tag, inner] of content.matchAll(/<(h[1-6]|dd|dt)\b[^>]*>([\s\S]*?)<\/\1>/gi)) {
    if (!inner.replace(/<[^>]*>/g, '').trim()) problems.push(`${rel}: empty ${tag}`);
  }
  for (const [img] of content.matchAll(/<img\b[^>]*>/gi)) if (!/\balt="[^"]*"/.test(img)) problems.push(`${rel}: image missing alt text`);
  for (const [, src] of content.matchAll(/\bsrc="([^"]+)"/g)) {
    if (/^(https?:|data:)/.test(src)) continue;
    const asset = src.split(/[?#]/)[0];
    const target = asset.startsWith('/') ? path.join(DIST, asset) : path.resolve(path.dirname(p), asset);
    if (!fs.existsSync(target)) problems.push(`${rel}: missing asset ${src}`);
  }
  const dup = [...h.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]).filter((v, i, a) => a.indexOf(v) !== i);
  if (dup.length) problems.push(`${rel}: duplicate ids ${[...new Set(dup)]}`);
  const h1 = (h.match(/<h1[\s>]/g) || []).length; if (h1 !== 1) problems.push(`${rel}: ${h1} h1`);
  for (const [, href] of h.matchAll(/href="([^"]+)"/g)) {
    if (/^(https?:|mailto:|tel:)/.test(href)) continue;
    const [pth, hash] = href.split('#'); const clean = pth.split('?')[0];
    let target = p;
    if (clean) { target = path.join(DIST, clean); if (clean.endsWith('/')) target = path.join(target, 'index.html'); }
    if (!fs.existsSync(target)) { problems.push(`${rel}: broken link ${href}`); continue; }
    if (hash && target.endsWith('.html') && !ids.get(target)?.has(hash)) problems.push(`${rel}: missing anchor ${href}`);
  }
  // Heading levels must not skip (h2 -> h4) inside <main>.
  const main = h.split('<main')[1]?.split('</main>')[0] || '';
  let prev = 1;
  for (const [, lvl] of main.matchAll(/<h([1-6])[\s>]/g)) { const l = +lvl; if (l > prev + 1) problems.push(`${rel}: heading jumps h${prev} -> h${l}`); prev = l; }
  const title = (h.match(/<title>([^<]*)/) || [])[1]; const desc = (h.match(/name="description" content="([^"]*)/) || [])[1];
  if (!title) problems.push(`${rel}: no <title>`); else { if (titles.has(title)) problems.push(`${rel}: title duplicates ${titles.get(title)}`); titles.set(title, rel); }
  if (!desc) problems.push(`${rel}: no meta description`); else { if (descs.has(desc)) problems.push(`${rel}: description duplicates ${descs.get(desc)}`); descs.set(desc, rel); }
  for (const [, id] of h.matchAll(/<(?:input|select|textarea)[^>]*\sid="([^"]+)"/g)) if (!h.includes(`for="${id}"`)) problems.push(`${rel}: no label for #${id}`);
}
console.log(`${pages.length} pages checked`); console.log(problems.length ? problems.join('\n') : 'No problems found');
if (problems.length) process.exitCode = 1;
