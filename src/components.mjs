// Shared layout and components. Bracketed copy such as [baseline] is rendered
// as a visible placeholder (see placeholders() below) so nothing unverified
// can pass as real content.

import { OWNER, phoneLink, POSITIONING, SERVICE_DETAILS, USE_CASES, REGIONS } from './data.mjs';

export const NAV = [
  { label: 'Services', href: '/services/' },
  { label: 'Solutions', href: '/use-cases/' },
  { label: 'How we work', href: '/how-we-work/' },
  { label: 'Pricing', href: '/pricing/' },
  { label: 'About', href: '/about/' },
];

export const CTA = {
  book: { label: 'Book a 30-minute call', href: '/contact/#book' },
  check: { label: 'Take the 5-minute check', href: '/automation-check/' },
  how: { label: 'See how we work', href: '/how-we-work/' },
  pricing: { label: 'See pricing', href: '/pricing/' },
};

export const SERVICES = SERVICE_DETAILS.map(({ id, name }) => ({ id, name }));

export const esc = (s) => String(s).replace(/&(?![a-z#0-9]+;)/gi, '&amp;');

export const placeholders = (html) =>
  html.replace(/\[([^\]<>"=]{1,160})\]/g, '<span class="ph" title="Placeholder: replace before launch">[$1]</span>');

export const logoMark = (cls = '') => `<svg class="mark ${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
  <rect x="2.5" y="5" width="4.5" height="15" rx="0.4" class="mark__a"/>
  <rect x="9.75" y="2" width="4.5" height="20" rx="0.4" class="mark__b"/>
  <rect x="17" y="6.5" width="4.5" height="12" rx="0.4" class="mark__c"/>
</svg>`;

export const logo = () => `<a class="logo" href="/" data-logo aria-label="ZIU AI, home (replays the intro)">${logoMark()}<span class="logo__word">ZIU<span> AI</span></span></a>`;

export const btn = ({ label, href }, variant = 'primary', extra = '') =>
  `<a class="btn btn--${variant}" href="${href}" ${extra}><span>${label}</span><svg class="btn__arrow" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" fill="none" stroke="currentColor" stroke-width="1.4"/></svg></a>`;

export const link = (label, href) => `<a class="tlink" href="${href}">${label}<span aria-hidden="true"> →</span></a>`;

export const kicker = (num, text, tone = '') => `<p class="kicker ${tone}"><span class="kicker__n">${num}</span><span class="kicker__t">${text}</span></p>`;

// CSS glass wall: the static/fallback form of the signature visual.
const PANES = [
  [4, 70, 40, 0.0], [12, 86, -60, 0.6], [21, 78, 30, 1.2], [30, 94, -90, 0.3], [37, 72, 80, 1.6],
  [47, 88, -20, 0.9], [56, 82, -70, 2.1], [65, 76, 50, 0.5], [74, 92, -40, 1.4], [84, 80, 20, 2.4],
];
export const cglass = (variant = '') => `<div class="cglass ${variant}" aria-hidden="true"><div class="cglass__light"></div>${PANES.map(([x, h, z, d], i) =>
  `<i style="--x:${x}%;--h:${h}%;--z:${z}px;--d:${d}s;--r:${i % 3 === 1 ? 1 : 0}"></i>`).join('')}</div>`;

export const pageHero = ({ kick, title, sub, actions = '', variant = '' }) => `
<section class="phero ${variant}" data-theme="dark" aria-labelledby="page-title">
  ${cglass('cglass--page')}
  <div class="phero__shade" aria-hidden="true"></div>
  <div class="wrap phero__inner">
    ${kick ? `<p class="kicker kicker--light"><span class="kicker__t">${kick}</span></p>` : ''}
    <h1 id="page-title" class="display">${title}</h1>
    ${sub ? `<p class="phero__sub">${sub}</p>` : ''}
    ${actions ? `<div class="actions">${actions}</div>` : ''}
  </div>
</section>`;

export const ctaBand = ({ title = 'Find out where AI pays off for you.', sub = 'A 30-minute call. You leave with three processes worth automating, whether or not we work together.', actions } = {}) => `
<section class="cta-band" data-theme="dark" aria-labelledby="cta-title">
  ${cglass('cglass--band')}
  <div class="wrap cta-band__inner" data-reveal>
    <h2 id="cta-title" class="h1">${title}</h2>
    <p class="lede lede--light">${sub}</p>
    <div class="actions">${actions || btn(CTA.book) + btn(CTA.check, 'ghost-light')}</div>
  </div>
</section>`;

const footer = () => `
<footer class="site-footer" data-theme="dark">
  <div class="wrap">
    <div class="footer__top">
      <div class="footer__brand">
        ${logo()}
        <p class="footer__tag">${POSITIONING}</p>
        <p class="footer__line">ZIU AI advises on where AI pays off, then builds and runs the automations, tools and software, for businesses in the USA &amp; Canada, the UK &amp; Europe, the UAE &amp; Gulf, and India.</p>
        <div class="actions">${btn(CTA.book, 'primary', 'data-size="sm"')}</div>
      </div>
      <nav class="footer__cols" aria-label="Footer">
        <div><h2>Services</h2><ul>${SERVICES.map((s) => `<li><a href="/services/#${s.id}">${s.name}</a></li>`).join('')}</ul></div>
        <div><h2>Solutions</h2><ul>${USE_CASES.map((u) => `<li><a href="/use-cases/${u.slug}/">${u.name}</a></li>`).join('')}<li><a href="/industries/">Industries</a></li></ul></div>
        <div><h2>Company</h2><ul><li><a href="/about/">About</a></li><li><a href="/how-we-work/">How we work</a></li><li><a href="/case-studies/">Results</a></li><li><a href="/pricing/">Pricing</a></li><li><a href="/careers/">Careers</a></li></ul></div>
        <div><h2>Tools</h2><ul><li><a href="/automation-check/">Automation check</a></li><li><a href="/resources/#savings">Savings calculator</a></li><li><a href="/resources/#faq">FAQ</a></li><li><a href="/resources/#tool-guide">Tool guide</a></li></ul></div>
        <div><h2>Regions</h2><ul>${REGIONS.map((r) => `<li><a href="/regions/${r.slug}/">${esc(r.name)}</a></li>`).join('')}</ul></div>
        <div><h2>Contact</h2><ul><li>[email]</li><li>${phoneLink()}</li><li>[business address]</li><li><a href="/contact/">Contact page</a></li></ul></div>
      </nav>
    </div>
  </div>
  <section class="signature" aria-label="ZIU AI">
    <div class="signature__aurora" aria-hidden="true"><i></i><i></i><i></i></div>
    <video class="logo-video signature__video" src="/assets/media/ziu-logo.mp4" poster="/assets/media/ziu-logo-end.jpg" muted playsinline preload="metadata" disablepictureinpicture aria-hidden="true"></video>
  </section>
  <div class="wrap">
    <div class="footer__legal">
      <p>© 2026 [Registered company name]. All rights reserved.</p>
      <ul><li><a href="/privacy/">Privacy policy</a></li><li><a href="/terms/">Terms</a></li><li><button type="button" class="linklike" data-cookie-settings>Cookie settings</button></li></ul>
    </div>
  </div>
  <dialog id="cookie-dialog" class="dialog" aria-labelledby="cookie-title">
    <h2 id="cookie-title" class="h3">Cookie settings</h2>
    <p>This site does not currently set analytics or marketing cookies. [Update this panel if analytics or a booking widget that sets cookies is added.]</p>
    <button type="button" class="btn btn--primary" data-close><span>Close</span></button>
  </dialog>
</footer>`;

const header = (path) => `
<header class="site-header">
  <div class="scroll-progress" aria-hidden="true"><i></i></div>
  <div class="wrap header__inner">
    ${logo()}
    <nav class="nav" aria-label="Main">
      <ul>${NAV.map((n) => `<li><a href="${n.href}"${path.startsWith(n.href) ? ' aria-current="page"' : ''}>${n.label}</a></li>`).join('')}</ul>
    </nav>
    <div class="header__cta">
      <a class="btn btn--primary" data-size="sm" href="${CTA.book.href}"><span>${CTA.book.label}</span></a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="Open menu"><span></span><span></span></button>
    </div>
  </div>
</header>
<div id="mobile-menu" class="mobile-menu" hidden>
    <nav aria-label="Mobile">
      <ul>${NAV.map((n, i) => `<li><a href="${n.href}"${path.startsWith(n.href) ? ' aria-current="page"' : ''}><span class="mm__n">0${i + 1}</span>${n.label}</a></li>`).join('')}</ul>
    </nav>
    <div class="mobile-menu__ctas">${btn(CTA.book)}${btn(CTA.check, 'ghost-light')}</div>
</div>`;

export const sectionIndex = (items) => `
<nav class="section-index" data-section-index aria-label="On this page">
  <ol>${items.map(([id, label], i) => `<li><a href="#${id}"><span class="si__n">${String(i + 1).padStart(2, '0')}</span><span class="si__l">${label}</span></a></li>`).join('')}</ol>
</nav>`;

export const layout = ({ path, title, description, main, home = false, index = '', extraHead = '' }) => {
  const body = placeholders(`
<a class="skip-link" href="#main">Skip to content</a>
${header(path)}
${index}
<main id="main" tabindex="-1">
${main}
</main>
${footer()}`);
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${title}</title>
<meta name="description" content="${description}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="ZIU AI">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta name="twitter:card" content="summary">
<meta name="theme-color" content="#101010">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/assets/fonts/instrument-serif-400.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/inter-tight-var.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/styles.css">
<script>document.documentElement.classList.add('js');
/* Page transitions: a skipped transition (fast clicks) is expected, not an error. */
['pageswap','pagereveal'].forEach(function(t){addEventListener(t,function(e){var v=e.viewTransition;if(v){['ready','finished','updateCallbackDone'].forEach(function(k){v[k]&&v[k].catch(function(){});});}});});${home ? `
(function(){var d=document.documentElement;var nav=(performance.getEntriesByType&&performance.getEntriesByType('navigation')[0])||{};if(nav.type==='back_forward'){d.classList.add('intro-done','intro-return');return;}d.classList.add('intro-loading');
/* Safety net: never leave a visitor behind the loader. */
var arm=function(){if(document.visibilityState!=='visible')return;document.removeEventListener('visibilitychange',arm);setTimeout(function(){if(d.classList.contains('intro-loading')){d.classList.remove('intro-loading','intro-playing');d.classList.add('intro-done');}},8000);};
document.addEventListener('visibilitychange',arm);arm();})();` : ''}</script>
${extraHead}
<script type="module" src="/assets/main.js"></script>
<script type="module" src="/assets/cursor.js"></script>
<script type="module" src="/assets/glass-still.js"></script>
${home ? '<script type="module" src="/assets/intro.js"></script>' : ''}
</head>
<body${home ? ' class="is-home"' : ''}>
${body}
</body>
</html>
`;
};

// Line icons (24px grid, 1.5 stroke). Each shape uses pathLength=1 so it can
// be drawn on as it scrolls into view. Every icon names what its item does.
const P = (d) => `<path d="${d}" pathLength="1"/>`;
const C = (cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r}" pathLength="1"/>`;
export const ICONS = {
  // Use cases
  sales: P('M3 6h18v12H3z') + P('M3 7l9 6 9-6') + P('M15 21h6m-2-2 2 2-2 2'),
  support: P('M3 4h13v9H8l-4 3v-3H3z') + P('M19 8h2v9h-1v3l-3-3h-6v-2'),
  finance: P('M6 3h9l3 3v15H6z') + P('M9 9h6M9 13h6M9 17h3'),
  operations: P('M4 6h16v14H4z') + P('M4 10h16') + P('M8 3v5M16 3v5') + P('M9 15l2 2 4-4'),
  hr: P('M3 5h18v14H3z') + C(9, 11, 2.2) + P('M5.5 16.5c.7-1.7 1.9-2.6 3.5-2.6s2.8.9 3.5 2.6') + P('M15 10h3M15 14h3'),
  reporting: P('M4 20h16') + P('M7 16v-4M12 16V7M17 16v-7') + P('M5 9l5-4 4 3 5-4'),
  // Safety and control
  accounts: C(8, 12, 3.5) + P('M11.5 12H21M18 12v3M15 12v2'),
  approval: C(9, 8, 3) + P('M3 20c.8-3.5 3.2-5 6-5s5.2 1.5 6 5') + P('M15 11l2 2 4-4'),
  access: P('M6 11h12v9H6z') + P('M9 11V8a3 3 0 0 1 6 0v3') + P('M12 15v2'),
  held: C(12, 12, 8.5) + P('M10 9v6M14 9v6'),
  region: C(12, 12, 8.5) + P('M3.5 12h17') + P('M12 3.5c2.6 2.6 2.6 14.4 0 17M12 3.5c-2.6 2.6-2.6 14.4 0 17'),
  // Services
  strategy: C(12, 12, 8.5) + P('M15.2 8.8l-2 5.4-5.4 2 2-5.4z') + P('M12 3.5v2M12 18.5v2M3.5 12h2M18.5 12h2'),
  software: P('M8 7l-5 5 5 5') + P('M16 7l5 5-5 5') + P('M13.5 4.5l-3 15'),
  discovery: C(11, 11, 6.5) + P('M20.5 20.5 16 16') + P('M8 11h6M11 8v6'),
  workflow: C(5, 12, 2) + C(19, 6, 2) + C(19, 18, 2) + P('M7 12h4l6-5.2M11 12l6 5.2'),
  assistants: P('M4 4h16v11H9l-5 4z') + P('M8 8.5h8M8 11.5h5'),
  integration: P('M9 15l6-6') + P('M10.5 6.5l1.2-1.2a4 4 0 0 1 5.7 5.7l-1.2 1.2') + P('M13.5 17.5l-1.2 1.2a4 4 0 0 1-5.7-5.7l1.2-1.2'),
  run: P('M20 12a8 8 0 1 1-2.4-5.7') + P('M20 4v4.5h-4.5') + P('M12 8v4l2.5 2'),
  training: P('M3 5h6.5A2.5 2.5 0 0 1 12 7.5V20a2 2 0 0 0-2-2H3z') + P('M21 5h-6.5A2.5 2.5 0 0 0 12 7.5V20a2 2 0 0 1 2-2h7z'),
  // Industries
  'professional-services': P('M3 8h18v11H3z') + P('M9 8V5h6v3') + P('M3 13h18'),
  'real-estate': P('M4 20V9l8-5 8 5v11') + P('M9 20v-6h6v6') + P('M2.5 20h19'),
  ecommerce: P('M5 8h14l-1 12H6z') + P('M9 8V6a3 3 0 0 1 6 0v2'),
  healthcare: P('M9 3h6v6h6v6h-6v6H9v-6H3V9h6z'),
};
export const icon = (name, cls = '') => `<svg class="icon ${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICONS[name] || ''}</svg>`;

// Founder feature: glass portrait frame with name and direct contact.
export const founderFeature = ({ experience = '[One sentence on relevant experience, stated as fact.]', extra = '' } = {}) => `
<article class="founder" data-reveal>
  <figure class="portrait">
    ${cglass('cglass--portrait')}
    <div class="portrait__frame"><span class="portrait__ph">[Photo of ${OWNER.name}]</span></div>
    <span class="portrait__edge" aria-hidden="true"></span>
    <figcaption class="sr-only">${OWNER.name}, ${OWNER.role}</figcaption>
  </figure>
  <div class="founder__text">
    <p class="kicker"><span class="kicker__t">${OWNER.role}</span></p>
    <h3 class="founder__name">${OWNER.name}</h3>
    <p class="founder__exp">${experience}</p>
    <p class="founder__contact"><span>Direct line</span>${phoneLink('tlink')}</p>
    ${extra}
  </div>
</article>`;
