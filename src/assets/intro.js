// Home page: branded loader, cinematic intro and hero glass wall.
import { GlassWall, PANELS } from './glass.js';

const root = document.documentElement;
const body = document.body;
const params = new URLSearchParams(location.search);
const reduced = params.get('motion') === 'reduce' || matchMedia('(prefers-reduced-motion: reduce)').matches;
const forceFallback = params.get('gl') === '0';
// Debug: ?p=0.5 freezes the intro at a given progress (for visual QA).
const freeze = params.has('p') ? parseFloat(params.get('p')) : null;
// Debug: ?b=0.5 freezes the logo reveal at a given progress.
const freezeB = params.has('b') ? parseFloat(params.get('b')) : null;

const hero = document.querySelector('.hero');
const canvas = document.querySelector('.hero__canvas');
const ui = document.querySelector('.intro');
const stepEls = [...document.querySelectorAll('[data-load-step]')];
const status = document.querySelector('.intro__status');
const skipBtn = document.querySelector('.intro__skip');
const hint = document.querySelector('.intro__hint');

const isNarrow = () => innerWidth < 760;

/* ---------- Brand reveal, after the glass flight ----------
   When the camera has passed through the wall, the logo appears big over the
   glass: the Z is written, the word arrives beside it, then the Z lets go and its
   four glass panes are pulled like magnets into the lower half of Z, U and the
   last I, each landing with a short shake. The word glides to the centre and
   then flies up into the header logo. It plays by itself, and the wheel, touch
   or arrow keys scrub it forwards and backwards. Everything is drawn from one
   progress value b (0..1), so it is identical either way. */
const brand = document.querySelector('.intro__brand');
const hintText = hint ? hint.textContent : '';
const BRAND_SECONDS = 3.6;
const PANE_PLAN = [[3, 0, 0.50], [2, 1, 0.545], [1, 2, 0.59], [0, 2, 0.615]]; // pane, letter (Z, U, I), start
const FLY = 0.12;
const bState = { active: false, target: 0, shown: 0, idleUntil: 0, geo: null };
const bezier = (x1, y1, x2, y2) => {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx, cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  return (x) => { let t = x; for (let i = 0; i < 8; i++) { const e = ((ax * t + bx) * t + cx) * t - x; const d = (3 * ax * t + 2 * bx) * t + cx; if (Math.abs(e) < 1e-6 || Math.abs(d) < 1e-6) break; t -= e / d; } t = clamp(t, 0, 1); return ((ay * t + by) * t + cy) * t; };
};
const eOut = bezier(0.2, 0.7, 0.1, 1), eIO = bezier(0.65, 0, 0.35, 1);
const seg = (x, a, d, f = eOut) => f(clamp((x - a) / d, 0, 1));
// magnetic travel: a small pull back, then accelerating hard into the letter
const pull = (x) => (x < 0.22 ? -0.045 * Math.sin((x / 0.22) * Math.PI / 2) : -0.045 + 1.045 * Math.pow((x - 0.22) / 0.78, 2.6));

function brandParts() {
  const mark = brand.querySelector('.mark');
  return {
    mark, word: brand.querySelector('.wm'),
    letters: [...brand.querySelectorAll('.wm__r')],
    panes: [...mark.querySelectorAll('.mark__pane')],
    bars: [...mark.querySelectorAll('.mark__bar')],
    edges: mark.querySelector('.mark__edges'), sheen: mark.querySelector('.mark__sheen'),
  };
}
// Measure the resting layout once (and again on resize).
function measureBrand() {
  const P = brandParts();
  const saved = [brand, P.mark, P.word, ...P.letters].map((el) => [el, el.style.transform]);
  saved.forEach(([el]) => { el.style.transform = 'none'; });
  const m = P.mark.getBoundingClientRect();
  const u = m.width / 48;
  const centroid = (el) => { const pts = el.getAttribute('points').split(' ').map((q) => q.split(',').map(Number)); return [pts.reduce((a, q) => a + q[0], 0) / pts.length, pts.reduce((a, q) => a + q[1], 0) / pts.length]; };
  const flights = PANE_PLAN.map(([pi, li, at]) => {
    const [cx, cy] = centroid(P.panes[pi]);
    const L = P.letters[li].getBoundingClientRect();
    return { pi, li, at, dx: (L.left + L.width / 2 - (m.left + cx * u)) / u, dy: (L.top + L.height * 0.7 - (m.top + cy * u)) / u };
  });
  const gap = parseFloat(getComputedStyle(brand).columnGap) || 0;
  const shift = (m.width + gap) / 2;
  // hand-off target: the header logo
  const w = P.word.getBoundingClientRect();
  const h = document.querySelector('.site-header .wm');
  const hr = h ? h.getBoundingClientRect() : null;
  const k = hr && w.width ? hr.width / w.width : 0.2;
  const fromX = w.left - shift + w.width / 2, fromY = w.top + w.height / 2;
  const to = hr ? { x: hr.left + hr.width / 2 - fromX, y: hr.top + hr.height / 2 - fromY, k } : { x: 0, y: -innerHeight * 0.4, k };
  saved.forEach(([el, t]) => { el.style.transform = t; });
  bState.geo = { u, flights, shift, to };
}
function renderBrand(b) {
  const P = brandParts(), g = bState.geo;
  if (!g) return;
  // 1. the Z is written
  brand.style.opacity = seg(b, 0, 0.06);
  P.mark.style.transform = `scale(${0.88 + 0.12 * seg(b, 0, 0.26)})`;
  const go = seg(b, 0.46, 0.08, eIO);
  const draw = [seg(b, 0.0, 0.1), seg(b, 0.16, 0.1)];
  P.bars.forEach((el, i) => {
    el.style.transformOrigin = go > 0 ? 'center' : 'left center';
    el.style.transform = `scaleX(${Math.max(0.0001, go > 0 ? 1 - go : draw[i])})`;
    el.style.opacity = 1 - go;
  });
  const lineOn = seg(b, 0.2, 0.1) * (1 - seg(b, 0.44, 0.04));
  P.edges.style.opacity = lineOn;
  P.sheen.style.opacity = lineOn;
  P.mark.style.setProperty('--sheen', -20 + 86 * seg(b, 0.2, 0.22, eIO));
  // 2. the word arrives
  const w = seg(b, 0.24, 0.16);
  P.word.style.opacity = w;
  P.word.style.clipPath = w < 1 ? `inset(-20% ${(1 - w) * 100}% -20% -5%)` : 'none';
  // 3. the panes fall into place, then are pulled into the letters
  const hit = [null, null, null];
  P.panes.forEach((el, i) => {
    el.style.transformOrigin = 'center';
    const f = g.flights.find((x) => x.pi === i);
    const k = seg(b, 0.06 + (3 - i) * 0.025, 0.12);
    const x = clamp((b - f.at) / FLY, 0, 1), q = pull(x);
    if (x <= 0) {
      el.style.transform = `translate(${(1 - k) * 1.4}px, ${(1 - k) * -2.8}px)`;
      el.style.opacity = k;
    } else {
      const arc = Math.sin(Math.PI * clamp(q, 0, 1)) * 2.2;
      const sc = 1 - 0.55 * clamp(q, 0, 1);
      el.style.transform = `translate(${f.dx * q}px, ${f.dy * q - arc}px) scale(${sc})`;
      el.style.opacity = x < 0.86 ? 1 : 1 - (x - 0.86) / 0.14;
    }
    const T = f.at + FLY;
    if (hit[f.li] == null || T < hit[f.li]) hit[f.li] = T;
  });
  P.letters.forEach((el, j) => {
    const v = b - hit[j];
    const dv = v >= 0 ? Math.exp(-v / 0.022) : 0;
    const lean = v < 0 && v > -0.05 ? -0.02 * Math.pow(1 + v / 0.05, 2) : 0;
    const sx = dv * 0.07 * Math.sin(2 * Math.PI * v / 0.016), sy = dv * 0.02 * Math.sin(2 * Math.PI * v / 0.021 + 1.2);
    el.style.transform = `translate(${lean + sx}em, ${sy}em)`;
    el.style.setProperty('--f', `${50 * seg(b, hit[j] - 0.004, 0.05)}%`);
    el.style.filter = dv > 0.01 ? `brightness(${1 + 0.6 * dv})` : '';
  });
  // 4. the word glides to the centre, then up into the header logo
  const gl = seg(b, 0.74, 0.1, eIO), h = seg(b, 0.88, 0.12, eIO);
  const s = 1 + (g.to.k - 1) * h;
  brand.style.transform = `translateX(${-g.shift * gl}px)`;
  P.word.style.transformOrigin = '50% 50%';
  P.word.style.transform = `translate(${g.to.x * h}px, ${g.to.y * h}px) translateX(${(1 - w) * -0.25}em) scale(${s})`;
  root.style.setProperty('--brand-bg', String(seg(b, 0, 0.07, eIO) * (1 - h)));
  if (hint) hint.classList.toggle('is-shown', b > 0.1 && b < 0.72);
}
function startBrand() {
  bState.active = true; bState.target = 0; bState.shown = 0; bState.idleUntil = 0;
  root.classList.add('intro-brand');
  if (hint) { hint.classList.remove('is-shown'); hint.textContent = 'Scroll to play the logo'; }
  measureBrand();
  renderBrand(0);
}
function tickBrand(dt) {
  if (freezeB != null) { renderBrand(freezeB); return; }
  const now = performance.now();
  if (now > bState.idleUntil) bState.target = clamp(bState.target + dt / BRAND_SECONDS, 0, 1);
  bState.shown += (bState.target - bState.shown) * (1 - Math.exp(-dt * 9));
  if (bState.target >= 1 && bState.shown > 0.996) bState.shown = 1;
  renderBrand(bState.shown);
  if (bState.shown >= 1) completeIntro();
}
function scrubBrand(d) { bState.target = clamp(bState.target + d, 0, 1); bState.idleUntil = performance.now() + 1100; }
function resetBrand() {
  bState.active = false;
  root.classList.remove('intro-brand');
  const P = brandParts();
  [brand, P.mark, P.word, ...P.letters, ...P.panes, ...P.bars, P.edges, P.sheen].forEach((el) => { el.removeAttribute('style'); });
  root.style.removeProperty('--brand-bg');
  if (hint) { hint.classList.remove('is-shown'); hint.textContent = hintText; }
}
addEventListener('resize', () => { if (bState.active) { measureBrand(); renderBrand(bState.shown); } });

// Panel layout: vertical slabs at different depths. A narrow corridor at x≈0
// is left open so the camera can travel between the layers.
// Mobile: fewer, slightly simpler panels.
const PANELS_MOBILE = [PANELS[1], PANELS[2], PANELS[3], PANELS[4], PANELS[5], PANELS[6], PANELS[7]];

// Camera keyframes for the intro: [progress, camera, target].
const KEYS = [
  [0.00, [0.9, 0.35, -12.5], [0.3, 0.1, 0.0]],
  [0.30, [-0.4, 0.15, -9.6], [0.0, 0.0, 0.0]],
  [0.55, [-1.7, 0.05, -6.0], [0.1, 0.0, 0.5]],
  [0.75, [-0.35, 0.0, -2.8], [0.0, 0.0, 2.0]],
  [0.86, [0.0, 0.0, -0.4], [0.0, 0.02, 4.0]],
  [0.93, [0.02, 0.0, 2.3], [0.0, 0.0, 6.0]],
];
const CUT = 0.93;
// Full timeline length; the scene cuts at 93%, so the visible flight is ~2.5 s.
const INTRO_SECONDS = 2.6;

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const sstep = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const lerp = (a, b, t) => a + (b - a) * t;
const cr = (p0, p1, p2, p3, t) => {
  const t2 = t * t, t3 = t2 * t;
  return 0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3);
};

function camAt(p, fit) {
  let i = 0;
  while (i < KEYS.length - 2 && p > KEYS[i + 1][0]) i++;
  const a = KEYS[i], b = KEYS[i + 1];
  const t = clamp((p - a[0]) / (b[0] - a[0]), 0, 1);
  const k0 = KEYS[Math.max(0, i - 1)], k3 = KEYS[Math.min(KEYS.length - 1, i + 2)];
  const out = (idx) => [0, 1, 2].map((c) => cr(k0[idx][c], a[idx][c], b[idx][c], k3[idx][c], t));
  const ro = out(1), ta = out(2);
  // Portrait screens: pull back early keyframes so the wall reads.
  const pull = (1 - sstep(0.55, 0.8, p)) * (fit - 1);
  ro[2] -= pull * 6;
  ro[0] *= 1 - 0.6 * (fit - 1);
  return { ro, ta };
}

function heroCam(scrollFrac, fit) {
  if (fit > 1.05) {
    return { ro: [0.25, -2.0 - scrollFrac * 0.5, -10.5 - (fit - 1) * 3 + scrollFrac * 1.4], ta: [0.15, -1.75, 0.5] };
  }
  return { ro: [-3.3, 0.1 - scrollFrac * 0.5, -11.6 + scrollFrac * 2.0], ta: [-2.0, 0.0, 0.4] };
}

let lastScroll = 0;
addEventListener('scroll', () => { lastScroll = performance.now(); }, { passive: true });

const state = {
  mode: 'loading', // loading | intro | hero | static | fallback
  target: 0, shown: 0,
  hazeStart: 0, hazeFrom: 0,
  last: 0, start: performance.now(), lastDraw: 0,
  visible: true,
};
let wall = null;
let raf = 0;

function setStep(i, text) {
  stepEls.forEach((el, k) => el.classList.toggle('is-done', k < i));
  if (status) status.textContent = text;
}

function fitFactor() {
  const aspect = hero.clientWidth / Math.max(1, hero.clientHeight);
  return clamp(1.25 / aspect, 1, 1.75);
}

function focal(fit) { return 1.6 / Math.pow(fit, 0.35); }

function frame(now) {
  raf = requestAnimationFrame(frame);
  const dt = Math.min(0.05, (now - (state.last || now)) / 1000);
  state.last = now;
  const time = (now - state.start) / 1000;
  const fit = fitFactor();

  if (state.mode === 'intro') {
    state.target = freeze != null ? freeze : clamp(state.target + dt / INTRO_SECONDS, 0, 1);
    state.shown = lerp(state.shown, state.target, 1 - Math.exp(-dt * 5));
    const p = state.shown;
    if (p >= CUT) { toBrand(); return; }
    const c = camAt(p, fit);
    wall.draw({
      time, ro: c.ro, ta: c.ta, focal: focal(fit),
      door: sstep(0.0, 0.14, p), soft: sstep(0.1, 0.34, p), red: 0.7 * sstep(0.22, 0.5, p), caus: sstep(0.32, 0.6, p),
      expo: 0.25 + 0.75 * sstep(0.0, 0.2, p), haze: sstep(0.82, CUT, p),
      lightY: Math.sin(time * 0.9) * 2.6,
    });
    wall.track(dt * 1000);
    hint && hint.classList.toggle('is-shown', p > 0.08 && p < 0.8);
    return;
  }

  if (state.mode === 'hero') {
    if (bState.active) tickBrand(dt);
    if (!state.visible) return;
    // While the page is scrolling, keep the last frame: scrolling stays smooth,
    // and the wall carries on as soon as you stop.
    if (now - lastScroll < 140) return;
    // The hero idles at ~30fps: the light moves slowly and this saves battery.
    if (now - state.lastDraw < 32) return;
    // The hero barely moves, so it can afford full resolution and 2x anti-aliasing;
    // the adaptive loop steps down on slower machines.
    if (!state.heroTuned) { state.heroTuned = true; wall.maxScale = isNarrow() ? 0.8 : 1; wall.budget = 38; wall.frameTimes.length = 0; }
    if (state.lastDraw) wall.track(now - state.lastDraw);
    state.lastDraw = now;
    drawHero(time, fit);
  }
}

// Mouse parallax on the hero wall (desktop pointer only): the camera shifts a
// little with the cursor so reflections slide across the glass.
const pointer = { x: 0, y: 0, sx: 0, sy: 0 };
if (!reduced && matchMedia('(hover: hover) and (pointer: fine)').matches) {
  addEventListener('mousemove', (e) => {
    pointer.x = (e.clientX / innerWidth) * 2 - 1;
    pointer.y = (e.clientY / innerHeight) * 2 - 1;
  }, { passive: true });
}

function drawHero(time, fit) {
  const c = heroCam(0, fit); // camera does not follow scroll (no jump after a pause)
  pointer.sx += (pointer.x - pointer.sx) * 0.08;
  pointer.sy += (pointer.y - pointer.sy) * 0.08;
  c.ro[0] += pointer.sx * 0.16; c.ro[1] -= pointer.sy * 0.08;
  c.ta[0] += pointer.sx * 0.05;
  const ht = clamp((performance.now() - state.hazeStart) / 1100, 0, 1);
  const haze = state.hazeFrom * (1 - sstep(0, 1, ht));
  state.cam = { ro: c.ro.slice(), ta: c.ta.slice(), focal: focal(fit) };
  wall.draw({
    time, ro: c.ro, ta: c.ta, focal: focal(fit), key: keyLight(),
    door: 0.8, soft: 1, red: 0.42, caus: 1, expo: 0.95, haze, samples: isNarrow() ? 1 : 2,
    lightY: Math.sin(time * 0.35) * 2.8,
  });
}

function onWheel(e) {
  if (state.mode !== 'intro' && !bState.active) return;
  e.preventDefault();
  const d = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
  if (bState.active) { scrubBrand(d / 1500); return; }
  state.target = clamp(state.target + d / 2600, 0, 1);
}
let touchY = null;
function onTouchStart(e) { touchY = e.touches[0].clientY; }
function onTouchMove(e) {
  if ((state.mode !== 'intro' && !bState.active) || touchY == null) return;
  e.preventDefault();
  const y = e.touches[0].clientY;
  if (bState.active) { scrubBrand((touchY - y) / 900); touchY = y; return; }
  state.target = clamp(state.target + (touchY - y) / 1400, 0, 1);
  touchY = y;
}
function onKey(e) {
  if (state.mode !== 'intro' && !bState.active) return;
  if (e.key === 'Escape') { finishIntro(0.6); return; }
  if (bState.active && e.target === body && [' ', 'ArrowDown', 'PageDown', 'Enter', 'ArrowUp', 'PageUp'].includes(e.key)) {
    e.preventDefault(); scrubBrand(['ArrowUp', 'PageUp'].includes(e.key) ? -0.12 : 0.12); return;
  }
  if ([' ', 'ArrowDown', 'PageDown', 'Enter'].includes(e.key) && e.target === body) {
    e.preventDefault();
    state.target = clamp(state.target + 0.12, 0, 1);
  }
}

function lockInput(on) {
  const fn = on ? 'addEventListener' : 'removeEventListener';
  window[fn]('wheel', onWheel, { passive: false });
  window[fn]('touchstart', onTouchStart, { passive: true });
  window[fn]('touchmove', onTouchMove, { passive: false });
  window[fn]('keydown', onKey);
}

// The flight has passed through the wall: the hero glass clears behind, and the
// logo takes the stage (input stays with the intro until it has played).
function toBrand() {
  state.mode = wall && wall.prog ? 'hero' : 'fallback';
  state.hazeFrom = wall ? 0.95 : 0;
  state.hazeStart = performance.now();
  hint && hint.classList.remove('is-shown');
  if (state.mode === 'hero') drawHero((performance.now() - state.start) / 1000, fitFactor());
  if (reduced || !brand) { bState.active = true; finishIntro(0); return; }
  startBrand();
}
function completeIntro() { finishIntro(0, true); }

function finishIntro(hazeFrom, handoff = false) {
  if (state.mode !== 'intro' && state.mode !== 'loading' && !bState.active) return;
  if (!bState.active) {
    state.mode = wall && wall.prog ? 'hero' : (state.mode === 'loading' ? 'loading' : 'fallback');
    state.hazeFrom = wall ? hazeFrom : 0;
    state.hazeStart = performance.now();
  }
  lockInput(false);
  root.classList.toggle('intro-handoff', handoff);
  root.classList.remove('intro-loading', 'intro-playing');
  root.classList.add('intro-done');
  resetBrand();
  hint && hint.classList.remove('is-shown');
  if (state.mode === 'hero') drawHero((performance.now() - state.start) / 1000, fitFactor());
  // Move keyboard focus to the page so the next Tab lands in the header.
  const skip = document.querySelector('.skip-link');
  if (document.activeElement === skipBtn && skip) skip.focus({ preventScroll: true });
}

function startIntro(replay = false) {
  scrollTo(0, 0);
  state.mode = 'intro';
  state.target = 0;
  state.shown = 0;
  state.last = 0;
  root.classList.remove('intro-loading', 'intro-done', 'intro-handoff');
  root.classList.add('intro-playing');
  lockInput(true);
  resetBrand();
}

function useFallback(reason) {
  if (reason) console.info('[ZIU] Glass wall fallback:', reason.message || reason);
  cancelAnimationFrame(raf);
  wall = null;
  hero.classList.add('gl-fallback');
  if (state.mode === 'intro' || state.mode === 'loading') finishIntro(0);
  state.mode = 'fallback';
}

async function boot() {
  history.scrollRestoration = 'manual';
  // Coming back with the Back button: no intro, return to where the visitor was.
  const returning = root.classList.contains('intro-return');
  addEventListener('pagehide', () => { try { sessionStorage.setItem('ziu-home-y', String(scrollY)); } catch (e) {} });
  if (returning) {
    let y = 0; try { y = +sessionStorage.getItem('ziu-home-y') || 0; } catch (e) {}
    const restore = () => scrollTo(0, y);
    setTimeout(restore, 0);
    if (document.readyState !== 'complete') addEventListener('load', restore, { once: true });
  } else {
    scrollTo(0, 0);
  }
  skipBtn && skipBtn.addEventListener('click', () => {
    finishIntro(state.mode === 'loading' ? 0.4 : 0.5);
  });

  // Step 1: typefaces (capped so a slow font server never blocks the page).
  setStep(0, 'Loading typefaces');
  const fonts = Promise.all([
    document.fonts.load('400 1em "ZIU Serif"'),
    document.fonts.load('500 1em "ZIU Sans"'),
  ]).catch(() => {});
  await Promise.race([fonts, new Promise((r) => setTimeout(r, 2500))]);

  // Step 2: compile the glass shader.
  setStep(1, 'Compiling the glass');
  if (forceFallback) { useFallback(new Error('forced by ?gl=0')); return; }
  try {
    wall = new GlassWall(canvas);
    // Quality: start sharp and let the adaptive loop find the device's limit.
    // (scale is relative to device pixels, capped at 2x.)
    if (isNarrow()) { wall.scale = 0.5; wall.maxScale = 0.7; wall.minScale = 0.3; wall.budget = 20; }
    else { wall.scale = 0.55; wall.maxScale = 0.85; wall.minScale = 0.3; wall.budget = 18; }
    performance.mark('ziu:compile-start');
    await wall.init();
    performance.measure('ziu:compile', 'ziu:compile-start');
    state.panels = isNarrow() ? PANELS_MOBILE : PANELS;
    wall.setPanels(state.panels);
    wall.onLost = () => useFallback(new Error('WebGL context lost'));
  } catch (err) {
    useFallback(err);
    return;
  }

  // Step 3: first frame.
  setStep(2, 'Lighting the wall');
  if (reduced) {
    // Reduced motion: no sequence, one still frame of the hero wall.
    finishIntro(0);
    state.mode = 'static';
    drawHero(4.2, fitFactor());
    addEventListener('resize', () => drawHero(4.2, fitFactor()));
    return;
  }
  const c0 = camAt(0, fitFactor());
  wall.draw({ time: 0, ro: c0.ro, ta: c0.ta, focal: focal(fitFactor()), door: 0, soft: 0, red: 0, caus: 0, expo: 0.25, haze: 0, lightY: 0 });
  await new Promise((r) => requestAnimationFrame(r));
  setStep(3, 'Ready');
  performance.measure('ziu:ready');

  new IntersectionObserver(([e]) => { state.visible = e.isIntersecting; }).observe(hero);
  state.start = performance.now();
  // Skipped while loading (or the loader safety net fired): go straight to the hero.
  if (root.classList.contains('intro-done') || (freeze != null && freeze >= CUT)) { state.mode = 'loading'; finishIntro(0.4); }
  else startIntro();
  if (freezeB != null && state.mode === 'intro') { toBrand(); renderBrand(freezeB); }
  raf = requestAnimationFrame(frame);
}

/* ---------- Glass piano (homepage hero only) ----------
   Each glass pane of the hero wall is a piano key: click (or tap) one and it
   plays a note and rings with light. Panes are tuned left to right to a
   pentatonic scale, so any run of clicks sounds musical. The pane under the
   pointer is found by casting the same camera ray the shader uses. */
const SCALE = [60, 62, 64, 67, 69, 72, 74, 76, 79, 81, 84]; // C major pentatonic, C4 up
const key = { idx: -1, t0: 0 };
const v3 = {
  sub: (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]],
  cross: (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]],
  norm: (a) => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; },
};
function paneAt(x, y) {
  const P = state.panels, cam = state.cam;
  if (!P || !cam) return -1;
  const r = canvas.getBoundingClientRect();
  if (x < r.left || x > r.right || y < r.top || y > r.bottom) return -1;
  const fw = v3.norm(v3.sub(cam.ta, cam.ro)), rt = v3.norm(v3.cross([0, 1, 0], fw)), up = v3.cross(fw, rt);
  const ux = (x - r.left - r.width / 2) / r.height, uy = (r.height / 2 - (y - r.top)) / r.height;
  const rd = v3.norm([0, 1, 2].map((k) => fw[k] * cam.focal + ux * rt[k] + uy * up[k]));
  let best = Infinity, hit = -1;
  P.forEach((p, i) => {
    const c = [p.x, p.y, p.z], h = [p.w, p.h, p.t];
    let t0 = -Infinity, t1 = Infinity;
    for (let k = 0; k < 3; k++) {
      const d = Math.abs(rd[k]) < 1e-6 ? 1e-6 : rd[k];
      let a = (c[k] - h[k] - cam.ro[k]) / d, b = (c[k] + h[k] - cam.ro[k]) / d;
      if (a > b) [a, b] = [b, a];
      t0 = Math.max(t0, a); t1 = Math.min(t1, b);
    }
    if (t0 <= t1 && t0 > 0 && t0 < best) { best = t0; hit = i; }
  });
  return hit;
}
// light on the struck pane: [index, strength, height of the travelling ring]
function keyLight() {
  if (params.has('key')) return [+params.get('key'), 0.9, 0.25]; // debug: ?key=3 lights pane 3
  if (key.idx < 0 || reduced) return [-1, 0, 0];
  const age = (performance.now() - key.t0) / 1000;
  if (age > 2.6) { key.idx = -1; return [-1, 0, 0]; }
  const p = state.panels[key.idx];
  const strength = Math.min(1, age / 0.03) * Math.exp(-age / 0.75);
  return [key.idx, strength, p.y - p.h + (age / 1.15) * p.h * 2.4];
}
const noteFor = (i) => {
  const order = state.panels.map((p, k) => [p.x, k]).sort((a, b) => a[0] - b[0]).map((q) => q[1]);
  return SCALE[Math.min(SCALE.length - 1, order.indexOf(i))];
};
const notKey = (el) => el.closest('a, button, input, textarea, select, label, summary, h1, h2, h3, p, li, .btn, .hero__scroll');
let piano = null;
function strike(i) {
  key.idx = i; key.t0 = performance.now();
  const p = state.panels[i];
  const play = (m) => m.playNote(noteFor(i), 0.66 + Math.random() * 0.12, Math.max(-1, Math.min(1, p.x / 2.6)));
  if (piano) play(piano);
  else import('./piano.js').then((m) => { piano = m; play(m); }).catch(() => {});
  if (state.mode === 'hero') state.lastDraw = 0; // draw the light at once
}
hero && hero.addEventListener('click', (e) => {
  if (state.mode !== 'hero' && state.mode !== 'static') return;
  if (bState.active || notKey(e.target)) return;
  const i = paneAt(e.clientX, e.clientY);
  if (i >= 0) strike(i);
});
let hoverRaf = 0, hoverEv = null;
hero && hero.addEventListener('pointermove', (e) => {
  hoverEv = e;
  if (hoverRaf) return;
  hoverRaf = requestAnimationFrame(() => {
    hoverRaf = 0;
    const ev = hoverEv;
    const on = (state.mode === 'hero' || state.mode === 'static') && !bState.active && !notKey(ev.target) && paneAt(ev.clientX, ev.clientY) >= 0;
    hero.classList.toggle('is-key-hover', on);
    if (on && !piano) import('./piano.js').then((m) => { piano = m; m.preload(); }).catch(() => {});
  });
}, { passive: true });
hero && hero.addEventListener('pointerleave', () => hero.classList.remove('is-key-hover'));

// Logo returns to the start and replays the intro (no reload; assets stay cached).
document.querySelectorAll('[data-logo]').forEach((a) => a.addEventListener('click', (e) => {
  if (location.pathname !== '/' && location.pathname !== '/index.html') return;
  e.preventDefault();
  document.dispatchEvent(new CustomEvent('ziu:close-menu'));
  if (state.mode === 'hero') { startIntro(true); }
  else { scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }); }
}));

boot().catch(useFallback);
