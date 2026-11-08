// Glass cursor (desktop mouse/trackpad only).
//  - dot: exact pointer position, never lags
//  - lens: a small glass ring that trails smoothly and reacts to what is under it
// Off for touch, reduced motion, or ?cursor=0. Text fields keep the native caret.
const root = document.documentElement;
const params = new URLSearchParams(location.search);
const reduced = params.get('motion') === 'reduce' || matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

if (fine && !reduced && params.get('cursor') !== '0') {
  const make = (cls, html = '') => { const d = document.createElement('div'); d.className = cls; d.setAttribute('aria-hidden', 'true'); d.innerHTML = html; document.body.appendChild(d); return d; };
  const ring = make('cursor-ring', '<span class="cursor-ring__lens"></span>');
  const dot = make('cursor-dot');
  root.classList.add('has-cursor');

  let mx = -200, my = -200;   // pointer
  let rx = mx, ry = my;       // lens (trails)
  let running = false, lastT = 0, shown = false;

  const tick = (t) => {
    const dt = Math.min(0.05, (t - (lastT || t)) / 1000) || 1 / 60;
    lastT = t;
    rx += (mx - rx) * (1 - Math.exp(-dt * 16));
    ry += (my - ry) * (1 - Math.exp(-dt * 16));
    ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
    const settled = Math.abs(mx - rx) < 0.1 && Math.abs(my - ry) < 0.1;
    if (settled) { running = false; lastT = 0; return; }
    requestAnimationFrame(tick);
  };
  const wake = () => { if (!running) { running = true; requestAnimationFrame(tick); } };

  // What the cursor is over decides its state.
  const setState = (target) => {
    const el = target instanceof Element ? target : null;
    const text = el && el.closest('input:not([type=checkbox]):not([type=radio]):not([type=submit]), textarea, select, [contenteditable="true"]');
    const cta = el && el.closest('.btn--primary');
    const link = el && el.closest('a, button, summary, label.check, [role="button"], .stage__canvas, .hero.is-key-hover');
    const dark = el && el.closest('[data-theme="dark"], .site-footer, .mobile-menu, .founder .portrait, .walk, .dialog--video');
    root.classList.toggle('cursor-text', !!text);
    root.classList.toggle('cursor-cta', !!cta);
    root.classList.toggle('cursor-link', !!link && !cta);
    root.classList.toggle('cursor-dark', !!dark);
    root.classList.toggle('cursor-lamp', !!(el && el.closest('.signature')) && !link);
  };

  addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
    if (!shown) { shown = true; rx = mx; ry = my; root.classList.add('cursor-on'); }
    setState(e.target);
    wake();
  }, { passive: true });
  addEventListener('mousedown', () => root.classList.add('cursor-down'));
  addEventListener('mouseup', () => root.classList.remove('cursor-down'));
  document.addEventListener('mouseleave', () => { root.classList.remove('cursor-on'); shown = false; });
  // Content moves under a still cursor while scrolling: re-check what is under it.
  addEventListener('scroll', () => { if (shown) setState(document.elementFromPoint(mx, my)); }, { passive: true });
  // Keyboard users get the native focus ring and no custom cursor in the way.
  addEventListener('keydown', (e) => { if (e.key === 'Tab') root.classList.remove('cursor-on'); });
}
