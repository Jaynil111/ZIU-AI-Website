// Real glass everywhere: one shared WebGL renderer draws a sharp, 4x
// anti-aliased still of the glass wall for each page header, call-to-action
// band and portrait frame as it nears the screen. Each still is drawn once
// (and again only if its size changes), so it costs nothing while scrolling.
// The CSS glass underneath stays as the fallback.
import { GlassWall, PANELS } from './glass.js';

const params = new URLSearchParams(location.search);
let lastScroll = 0;
addEventListener('scroll', () => { lastScroll = performance.now(); }, { passive: true });
// Wait for a quiet moment: not scrolling, and the browser idle.
const quiet = () => new Promise((resolve) => {
  const check = () => {
    if (performance.now() - lastScroll < 160) { setTimeout(check, 80); return; }
    if (window.requestIdleCallback) requestIdleCallback(() => resolve(), { timeout: 200 }); else setTimeout(resolve, 16);
  };
  check();
});
const targets = [...document.querySelectorAll('.cglass--page, .cglass--band, .cglass--portrait')];

if (targets.length && params.get('gl') !== '0') {
  let wall = null;
  let ready = null;
  const queue = [];
  let busy = false;
  const DPR = Math.min(devicePixelRatio || 1, 2);
  const MAX_PIXELS = 3.4e6;

  const getWall = () => {
    if (!ready) {
      const c = document.createElement('canvas');
      wall = new GlassWall(c);
      ready = wall.init().then(() => { wall.setPanels(PANELS); return wall; });
    }
    return ready;
  };

  // Framing per placement: the wall sits to the right of text on wide
  // headers and bands, centered in portraits and on phones.
  const camera = (el, aspect) => {
    if (el.classList.contains('cglass--portrait')) return { ro: [0.15, 0.1, -13.2], ta: [0.05, 0, 0.4], red: 0.5 };
    if (aspect < 1) return { ro: [0.2, -1.5, -15.5], ta: [0.1, -1.25, 0.5], red: 0.45 };
    const band = el.classList.contains('cglass--band');
    const shift = Math.min(1.8, Math.max(0, (aspect - 1.3) * 1.1));
    const x = (band ? -3.1 : -2.7) - shift;
    return { ro: [x, 0.1, band ? -12.6 : -11.8], ta: [x + 1.3, 0, 0.4], red: band ? 0.5 : 0.42 };
  };

  const render = async (el) => {
    const w = el.clientWidth, h = el.clientHeight;
    if (!w || !h) return;
    const key = `${w}x${h}`;
    if (el.dataset.still === key) return;
    let W = Math.round(w * DPR), H = Math.round(h * DPR);
    const k = Math.min(1, Math.sqrt(MAX_PIXELS / (W * H)));
    W = Math.round(W * k); H = Math.round(H * k);
    const gw = await getWall();
    const cam = camera(el, w / h);
    const state = { time: 3.7, ro: cam.ro, ta: cam.ta, focal: 1.6, door: 0.7, soft: 1, red: cam.red, caus: 1, expo: 0.95, haze: 0, lightY: 1.1, samples: 4 };
    // Draw in thin strips, one per quiet moment, into an off-screen buffer,
    // then show the finished image in one go. No single long GPU frame.
    const buf = document.createElement('canvas');
    buf.width = W; buf.height = H;
    const bctx = buf.getContext('2d');
    const gl = gw.gl;
    const STRIP = 72;
    for (let top = 0; top < H; top += STRIP) {
      await quiet();
      const sh = Math.min(STRIP, H - top);
      gw.setSize(W, H);
      gl.enable(gl.SCISSOR_TEST);
      gl.scissor(0, H - top - sh, W, sh);
      gw.draw(state);
      gl.disable(gl.SCISSOR_TEST);
      bctx.drawImage(gw.canvas, 0, top, W, sh, 0, top, W, sh);
      if (el.clientWidth !== w || el.clientHeight !== h) return; // resized meanwhile; a fresh render is queued
    }
    let out = el.querySelector('.cglass__still');
    if (!out) { out = document.createElement('canvas'); out.className = 'cglass__still'; out.setAttribute('aria-hidden', 'true'); el.prepend(out); }
    out.width = W; out.height = H;
    out.getContext('2d').drawImage(buf, 0, 0);
    el.dataset.still = key;
    el.classList.add('is-still');
  };

  // Render one still at a time so the page never stutters.
  const pump = async () => {
    if (busy) return;
    busy = true;
    while (queue.length) {
      const el = queue.shift();
      try { await render(el); } catch (e) { break; } // stay on the CSS glass
    }
    busy = false;
  };
  const enqueue = (el) => { if (!queue.includes(el)) queue.push(el); pump(); };

  const io = new IntersectionObserver((entries) => entries.forEach((en) => { if (en.isIntersecting) enqueue(en.target); }), { rootMargin: '400px 0px' });
  targets.forEach((el) => io.observe(el));
  let t = 0;
  addEventListener('resize', () => {
    clearTimeout(t);
    t = setTimeout(() => targets.forEach((el) => { const r = el.getBoundingClientRect(); if (r.bottom > -400 && r.top < innerHeight + 400) enqueue(el); else delete el.dataset.still; }), 250);
  });
}
