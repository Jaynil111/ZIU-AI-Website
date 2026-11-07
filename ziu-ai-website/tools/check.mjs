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
