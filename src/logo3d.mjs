// Resolution-independent, extruded wordmark. All letter outlines are vector paths.
let instance = 0;
const letters = [
  ['Z', 'M0 0H145V29L43 150H145V180H0V151L102 30H0Z', true],
  ['I', 'M205 0H237V180H205Z', false],
  ['U', 'M300 0H333V112C333 140 346 151 372 151S411 140 411 112V0H444V113C444 160 418 183 372 183S300 160 300 113Z', true],
  ['A', 'M556 180L625 0H645L714 180H694L674 126H596L576 180ZM603 108H667L635 23Z', false],
  ['I', 'M778 0H797V180H778Z', true],
];
// One material and one outline source for every brand placement.
function artwork({ compact = false, mark = false, favicon = false } = {}) {
  const id = `glass-logo-${++instance}`;
  const shapes = mark ? letters.slice(0, 1) : letters;
  const box = mark ? '-18 -18 212 232' : compact ? '-10 -20 850 240' : '-92 -76 1000 400';
  const outlines = shapes.map(([, d], i) => `<path id="${id}-${i}" d="${d}" fill-rule="evenodd"/>`).join('');
  const use = (i, attrs = '') => `<use href="#${id}-${i}" ${attrs}/>`;
  return `<svg class="logo3d__art" viewBox="${box}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
    <defs>
      ${outlines}
      <linearGradient id="${id}-clear" x1="0" y1="0" x2=".75" y2="1">
        <stop stop-color="#e4f8ff" stop-opacity=".48"/><stop offset=".18" stop-color="#c3e8f8" stop-opacity=".07"/>
        <stop offset=".4" stop-color="#e9fbff" stop-opacity=".12"/><stop offset=".43" stop-color="#fff" stop-opacity=".64"/>
        <stop offset=".46" stop-color="#d3f3ff" stop-opacity=".12"/><stop offset=".7" stop-color="#a6cada" stop-opacity=".04"/>
        <stop offset=".92" stop-color="#badce8" stop-opacity=".25"/><stop offset="1" stop-color="#f4fcff" stop-opacity=".7"/>
      </linearGradient>
      <linearGradient id="${id}-ruby" x1="0" y1="0" x2=".2" y2="1">
        <stop stop-color="#f2fbff" stop-opacity=".36"/><stop offset=".34" stop-color="#cdeeff" stop-opacity=".06"/>
        <stop offset=".49" stop-color="#ffe7ef" stop-opacity=".22"/><stop offset=".52" stop-color="#ff8aa6" stop-opacity=".48"/>
        <stop offset=".7" stop-color="#e73265" stop-opacity=".25"/><stop offset=".92" stop-color="#b8184c" stop-opacity=".5"/>
        <stop offset="1" stop-color="#ffb1c5" stop-opacity=".85"/>
      </linearGradient>
      <linearGradient id="${id}-depth" x1="0" y1="0" x2="1" y2=".65">
        <stop stop-color="#c7f0ff" stop-opacity=".28"/><stop offset=".2" stop-color="#405c6c" stop-opacity=".06"/>
        <stop offset=".56" stop-color="#dbf6ff" stop-opacity=".22"/><stop offset=".6" stop-color="#6f8394" stop-opacity=".04"/>
        <stop offset="1" stop-color="#e0f5ff" stop-opacity=".35"/>
      </linearGradient>
      <linearGradient id="${id}-rim" x1="0" y1="0" x2=".6" y2="1">
        <stop stop-color="#fff"/><stop offset=".3" stop-color="#bcdce9" stop-opacity=".45"/>
        <stop offset=".49" stop-color="#fff" stop-opacity=".92"/><stop offset=".58" stop-color="#e9f6ff" stop-opacity=".1"/>
        <stop offset=".87" stop-color="#9ac3d5" stop-opacity=".3"/><stop offset="1" stop-color="#fff" stop-opacity=".85"/>
      </linearGradient>
      <linearGradient id="${id}-shine"><stop stop-color="#fff" stop-opacity="0"/><stop offset=".42" stop-color="#d9f6ff" stop-opacity=".04"/><stop offset=".5" stop-color="#fff" stop-opacity=".75"/><stop offset=".54" stop-color="#fff" stop-opacity=".12"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
      <radialGradient id="${id}-pool"><stop stop-color="#f23565" stop-opacity=".22"/><stop offset="1" stop-color="#f23565" stop-opacity="0"/></radialGradient>
      <clipPath id="${id}-clip">${shapes.map((_, i) => use(i)).join('')}</clipPath>
    </defs>
    ${favicon ? '<rect x="-18" y="-18" width="212" height="232" rx="35" fill="#11151c"/>' : ''}
    ${!compact && !mark ? `<ellipse class="logo3d__caustic" cx="410" cy="248" rx="410" ry="30" fill="url(#${id}-pool)"/>` : ''}
    <g class="logo3d__float">
    ${shapes.map(([, , ruby], i) => `<g class="logo3d__letter" style="--letter:${i}">
      ${use(i, `transform="translate(19 22)" fill="url(#${id}-${ruby ? 'ruby' : 'depth'})" stroke="url(#${id}-rim)" stroke-width="1" opacity=".7"`)}
      ${Array.from({ length: 18 }, (_, j) => 18 - j).map(n => use(i, `transform="translate(${n} ${n * 1.16})" fill="url(#${id}-depth)" opacity=".16"`)).join('')}
      ${use(i, `class="logo3d__contrast" fill="currentColor" fill-opacity=".035" stroke="currentColor" stroke-opacity=".35" stroke-width="2"`)}
      ${use(i, `fill="url(#${id}-${ruby ? 'ruby' : 'clear'})" stroke="url(#${id}-rim)" stroke-width="2" stroke-linejoin="round"`)}
      ${use(i, `transform="translate(2 2)" fill="none" stroke="url(#${id}-rim)" stroke-width=".65" opacity=".65"`)}
    </g>`).join('')}
    <g clip-path="url(#${id}-clip)" class="logo3d__reflections">
      <path d="M-50 152L850 15V29L-50 166Z" fill="#e3f8ff" opacity=".13"/>
      <path d="M-50 169L850 32" stroke="#fff" stroke-width=".7" opacity=".35"/>
      <rect class="logo3d__shine" x="-300" y="-60" width="230" height="320" fill="url(#${id}-shine)" transform="skewX(-22)"/>
    </g>
    </g>
  </svg>`;
}

export function logo3d(cls = '', { compact = false } = {}) {
  return `<span class="logo3d ${compact ? 'logo3d--compact' : 'logo3d--large'} ${cls}" aria-hidden="true">${artwork({ compact })}</span>`;
}

export function glassMark(cls = '') {
  return `<span class="logo3d logo3d--mark ${cls}" aria-hidden="true">${artwork({ mark: true })}</span>`;
}

// Favicons intentionally stay static for legibility at browser-tab size.
export function glassFavicon() { return artwork({ mark: true, favicon: true }); }
