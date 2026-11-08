// ZIU AI — shared site behavior (every page).
const root = document.documentElement;
const reduced = new URLSearchParams(location.search).get('motion') === 'reduce' || matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduced) root.classList.add('reduce-motion');

/* One scheduler for everything that reacts to scrolling: a single passive
   listener queues one animation frame; layout is read once per frame. */
const frameTasks = [];
let frameQueued = false;
const runFrame = () => { frameQueued = false; for (const f of frameTasks) f(); };
const queueFrame = () => { if (!frameQueued) { frameQueued = true; requestAnimationFrame(runFrame); } };
const onFrame = (fn) => { frameTasks.push(fn); fn(); };
addEventListener('scroll', queueFrame, { passive: true });
addEventListener('resize', queueFrame);

/* Header: transparent over cinematic tops, solid once scrolled. */
const header = document.querySelector('.site-header');
onFrame(() => header && header.classList.toggle('is-solid', scrollY > 24));
/* Mobile menu. */
const toggle = document.querySelector('.menu-toggle');
const menu = document.getElementById('mobile-menu');
function setMenu(open) {
  if (!toggle || !menu) return;
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  menu.hidden = !open;
  root.classList.toggle('menu-open', open);
  if (open) menu.querySelector('a')?.focus();
}
toggle?.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
menu?.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') { setMenu(false); toggle.focus(); }
});
document.addEventListener('ziu:close-menu', () => setMenu(false));
matchMedia('(min-width: 1080px)').addEventListener('change', (m) => m.matches && setMenu(false));

/* Smooth in-page anchors (respecting reduced motion and header height). */
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (e.defaultPrevented || !a || a.getAttribute('href').length < 2) return;
  const el = document.getElementById(a.getAttribute('href').slice(1));
  if (!el) return;
  e.preventDefault();
  el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  history.replaceState(null, '', a.getAttribute('href'));
  if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
});

/* Progressive reveals. Content is visible without JS; .js-reveal opts in. */
const reveals = document.querySelectorAll('[data-reveal]');
if (!reduced && 'IntersectionObserver' in window) {
  root.classList.add('js-reveal');
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
  }), { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  reveals.forEach((el) => io.observe(el));
}

/* Section index (scroll-spy) for the home page and long pages. */
const index = document.querySelector('[data-section-index]');
if (index) {
  const links = [...index.querySelectorAll('a[href^="#"]')];
  const map = new Map(links.map((l) => [l.getAttribute('href').slice(1), l]));
  const sections = [...map.keys()].map((id) => document.getElementById(id)).filter(Boolean);
  let active = null;
  onFrame(() => {
    const line = innerHeight * 0.38;
    let current = null;
    for (const s of sections) if (s.getBoundingClientRect().top <= line) current = s;
    if (current !== active) {
      active = current;
      links.forEach((l) => l.removeAttribute('aria-current'));
      if (current) map.get(current.id)?.setAttribute('aria-current', 'true');
      index.classList.toggle('on-dark', !!current && current.dataset.theme === 'dark');
    }
    index.classList.toggle('is-visible', scrollY > innerHeight * 0.6);
  });
}

/* Header color follows the section underneath it. */
const darkSections = [...document.querySelectorAll('[data-theme="dark"]')];
if (header && darkSections.length) {
  const headerMid = () => header.offsetHeight / 2;
  onFrame(() => {
    const y = headerMid();
    const over = darkSections.some((s) => { const r = s.getBoundingClientRect(); return r.top <= y && r.bottom >= y; });
    header.classList.toggle('over-dark', over);
  });
}

/* How it works: highlight the step in view and light its glass pane. */
const steps = document.querySelector('[data-steps]');
if (steps && 'IntersectionObserver' in window) {
  const items = [...steps.querySelectorAll('[data-step]')];
  const panes = [...steps.querySelectorAll('[data-pane]')];
  const set = (i) => {
    items.forEach((it, k) => it.classList.toggle('is-active', k === i));
    panes.forEach((p, k) => { p.classList.toggle('is-active', k === i); p.classList.toggle('is-past', k < i); });
  };
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) set(items.indexOf(en.target));
  }), { rootMargin: '-45% 0px -45% 0px' });
  items.forEach((it) => io.observe(it));
  set(0);
}

/* Problem: the bridge between demo and daily work completes in view. */
document.querySelectorAll('[data-bridge]').forEach((el) => {
  if (reduced || !('IntersectionObserver' in window)) { el.classList.add('is-built'); return; }
  const io = new IntersectionObserver(([en]) => { if (en.isIntersecting) { el.classList.add('is-built'); io.disconnect(); } }, { threshold: 0.5 });
  io.observe(el);
});

/* Interactive walkthrough: inquiry → CRM record → draft awaiting approval. */
document.querySelectorAll('[data-walkthrough]').forEach((w) => {
  const stages = [...w.querySelectorAll('[data-stage]')];
  const dots = [...w.querySelectorAll('[data-goto]')];
  const live = w.querySelector('[data-live]');
  const play = w.querySelector('[data-play]');
  const approve = w.querySelector('[data-approve]');
  const reset = w.querySelector('[data-reset]');
  let i = -1; let timer = 0;
  const show = (n) => {
    i = n;
    stages.forEach((s, k) => { s.classList.toggle('is-on', k <= n); s.classList.toggle('is-current', k === n); });
    dots.forEach((d, k) => d.setAttribute('aria-pressed', String(k === n)));
    if (live && stages[n]) live.textContent = stages[n].dataset.stage;
    w.classList.toggle('is-waiting', n === stages.length - 1 && !w.classList.contains('is-approved'));
  };
  const stop = () => { clearTimeout(timer); timer = 0; play && (play.textContent = 'Play walkthrough'); };
  const run = () => {
    if (i >= stages.length - 1) { stop(); approve?.focus(); return; }
    show(i + 1);
    timer = setTimeout(run, reduced ? 0 : 1400);
  };
  play?.addEventListener('click', () => {
    if (timer) { stop(); return; }
    w.classList.remove('is-approved');
    if (i >= stages.length - 1) show(-1);
    play.textContent = 'Pause';
    run();
  });
  dots.forEach((d, k) => d.addEventListener('click', () => { stop(); w.classList.remove('is-approved'); show(k); }));
  approve?.addEventListener('click', () => {
    if (i < stages.length - 1) return;
    w.classList.add('is-approved'); w.classList.remove('is-waiting');
    if (live) live.textContent = 'Approved by a person. Reply sent and logged in the CRM.';
  });
  reset?.addEventListener('click', () => { stop(); w.classList.remove('is-approved'); show(-1); if (live) live.textContent = 'Walkthrough reset.'; });
  show(-1);
});

/* Demo video modal (videos to be supplied). */
const modal = document.getElementById('demo-modal');
if (modal && typeof modal.showModal === 'function') {
  const title = modal.querySelector('[data-modal-title]');
  document.querySelectorAll('[data-demo]').forEach((b) => b.addEventListener('click', (e) => {
    e.preventDefault();
    title.textContent = b.dataset.demo;
    modal.showModal();
  }));
  modal.addEventListener('click', (e) => { if (e.target === modal || e.target.closest('[data-close]')) modal.close(); });
}

/* Forms: validation, step-by-step flow and delivery to the provider set in
   src/site.config.mjs (Formspree, Web3Forms, Netlify Forms or a custom endpoint). */
document.querySelectorAll('form[data-form]').forEach((form) => {
  const steps = [...form.querySelectorAll('[data-form-step]')];
  const counter = form.querySelector('[data-step-count]');
  const bar = form.querySelector('[data-step-bar]');
  let cur = 0;
  const showStep = (n) => {
    cur = n;
    steps.forEach((s, k) => { s.hidden = k !== n; });
    if (counter) counter.textContent = `Step ${n + 1} of ${steps.length}`;
    if (bar) bar.style.setProperty('--p', String((n + 1) / steps.length));
    form.querySelector('[data-prev]')?.toggleAttribute('hidden', n === 0);
    form.querySelector('[data-next]')?.toggleAttribute('hidden', n === steps.length - 1);
    form.querySelector('[type="submit"]')?.toggleAttribute('hidden', steps.length > 0 && n !== steps.length - 1);
  };
  const valid = (scope) => {
    const fields = [...scope.querySelectorAll('input, select, textarea')];
    for (const f of fields) { if (!f.checkValidity()) { f.reportValidity(); return false; } }
    return true;
  };
  if (steps.length) {
    showStep(0);
    form.querySelector('[data-next]')?.addEventListener('click', () => {
      if (!valid(steps[cur])) return;
      showStep(cur + 1);
      steps[cur].querySelector('input, select, textarea')?.focus();
    });
    form.querySelector('[data-prev]')?.addEventListener('click', () => showStep(cur - 1));
  }
  const done = form.parentElement.querySelector('[data-form-done]');
  const errorBox = form.querySelector('[data-form-error]');
  const submitBtn = form.querySelector('[type="submit"]');
  const provider = form.dataset.provider || '';
  let sending = false;
  const finish = () => { form.hidden = true; if (done) { done.hidden = false; done.focus(); } };
  const showError = (msg) => {
    if (!errorBox) return;
    errorBox.hidden = false;
    errorBox.innerHTML = msg;
    errorBox.focus?.();
  };
  const setSending = (on) => {
    sending = on;
    form.toggleAttribute('aria-busy', on);
    if (submitBtn) {
      submitBtn.disabled = on;
      const label = submitBtn.querySelector('span');
      if (label) { label.dataset.idle ||= label.textContent; label.textContent = on ? 'Sending…' : label.dataset.idle; }
    }
  };
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (sending || !valid(form)) return;
    if (errorBox) errorBox.hidden = true;
    const page = form.querySelector('input[name="page"]');
    if (page) page.value = location.pathname;
    const fd = new FormData(form);
    // Spam trap: real people never fill the hidden field. Pretend it worked.
    const trap = form.querySelector('.hp input');
    if (trap && trap.value) { finish(); return; }
    if (!provider) { finish(); return; } // not connected yet: see src/site.config.mjs

    let req;
    if (provider === 'netlify') {
      req = { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(fd).toString() };
    } else {
      const data = {};
      for (const [k, v] of fd.entries()) data[k] = k in data ? `${data[k]}, ${v}` : v;
      req = { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) };
    }
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 15000);
    setSending(true);
    try {
      const res = await fetch(form.getAttribute('action'), { ...req, signal: ctrl.signal });
      let ok = res.ok;
      try { const j = await res.clone().json(); if (j && j.success === false) ok = false; } catch (err) { /* non-JSON reply is fine */ }
      if (!ok) throw new Error(`HTTP ${res.status}`);
      finish();
    } catch (err) {
      const phone = document.querySelector('.footer__cols a[href^="tel:"]');
      showError(`We couldn't send this just now. Your answers are still here, so please try again${phone ? `, or call us on <a href="${phone.getAttribute('href')}">${phone.textContent}</a>` : ''}.`);
    } finally {
      clearTimeout(timer);
      setSending(false);
    }
  });
});

/* Cookie settings: the site sets no cookies yet. */
document.querySelectorAll('[data-cookie-settings]').forEach((b) => b.addEventListener('click', () => {
  const d = document.getElementById('cookie-dialog');
  d && typeof d.showModal === 'function' && d.showModal();
}));
document.getElementById('cookie-dialog')?.addEventListener('click', (e) => {
  if (e.target.closest('[data-close]') || e.target.id === 'cookie-dialog') e.currentTarget.close();
});

/* Founding-client inquiries arrive with the topic prefilled. */
if (new URLSearchParams(location.search).get('topic') === 'founding') {
  const msg = document.getElementById('c-msg');
  if (msg && !msg.value) msg.value = 'I would like to ask about a founding-client place.';
}

/* ---------------------------------------------------------------------------
   Motion layer: word reveals, scroll-linked progress, glass parallax.
   One passive scroll listener feeds one rAF loop; nothing runs when idle.
--------------------------------------------------------------------------- */

/* Headings reveal word by word. Text nodes are split; inline elements such as
   placeholders move as one unit. Screen readers still get the full sentence. */
// Calm: only page titles reveal word by word; section headings simply fade up.
const splitTargets = document.querySelectorAll('.phero .display');
if (!reduced) {
  splitTargets.forEach((h) => {
    if (h.closest('.hero') || h.dataset.split) return;
    h.dataset.split = '1';
    h.setAttribute('aria-label', h.textContent.replace(/\s+/g, ' ').trim());
    let wi = 0;
    const wrap = (node) => {
      const w = document.createElement('span'); w.className = 'w'; w.setAttribute('aria-hidden', 'true');
      const inner = document.createElement('span'); inner.style.setProperty('--wi', wi++);
      w.appendChild(inner); inner.appendChild(node); return w;
    };
    [...h.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          frag.appendChild(/^\s+$/.test(part) ? document.createTextNode(' ') : wrap(document.createTextNode(part)));
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1) {
        n.replaceWith(wrap(n.cloneNode(true)));
      }
    });
    // Headings outside a reveal container (page heroes) animate on load.
    if (!h.closest('[data-reveal]')) setTimeout(() => h.classList.add('w-in'), 60);
  });
}

/* Walkthrough plays once by itself the first time it scrolls into view. */
document.querySelectorAll('[data-autoplay]').forEach((w) => {
  if (reduced || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(([en]) => {
    if (!en.isIntersecting) return;
    io.disconnect();
    setTimeout(() => w.querySelector('[data-play]')?.click(), 500);
  }, { threshold: 0.55 });
  io.observe(w);
});

const bar = document.querySelector('.scroll-progress i');
const heroEl = document.querySelector('.hero, .phero');
const progressEls = [...document.querySelectorAll('[data-progress]')].map((el) => ({ el, items: [...el.querySelectorAll('[data-progress-item]')] }));
const glassSets = [...document.querySelectorAll('.cglass, .steps__wall')].map((el) => ({
  el, panes: [...el.querySelectorAll('i, .steps__pane')], visible: false,
}));
if ('IntersectionObserver' in window) {
  const gio = new IntersectionObserver((entries) => entries.forEach((en) => {
    const g = glassSets.find((s) => s.el === en.target); if (g) g.visible = en.isIntersecting;
  }));
  glassSets.forEach((g) => gio.observe(g.el));
}
const clamp01 = (v) => Math.min(1, Math.max(0, v));
let ticking = false;
function motionFrame() {
  ticking = false;
  const vh = innerHeight;
  const max = document.documentElement.scrollHeight - vh;
  if (bar) bar.style.transform = `scaleX(${max > 0 ? clamp01(scrollY / max) : 0})`;
  if (reduced) { progressEls.forEach(({ el, items }) => { el.style.setProperty('--p', 1); items.forEach((it) => it.classList.add('is-reached')); }); return; }

  // Hero hands over to the page: content drifts up and fades as you leave it.
  if (heroEl) {
    const hp = clamp01(scrollY / (heroEl.offsetHeight || vh));
    heroEl.style.setProperty('--hp', hp.toFixed(3));
  }
  // Timelines fill as they cross the middle of the screen.
  progressEls.forEach(({ el, items }) => {
    const r = el.getBoundingClientRect();
    const p = clamp01((vh * 0.85 - r.top) / (vh * 0.5 + r.height * 0.5));
    el.style.setProperty('--p', p.toFixed(3));
    items.forEach((it, i) => it.classList.toggle('is-reached', p >= (i + 0.35) / items.length));
  });
  // Glass panes move at different speeds by depth: real layered parallax.
  const k = innerWidth < 760 ? 0.5 : 1;
  glassSets.forEach((g) => {
    if (!g.visible || g.el.classList.contains('is-still')) return; // panes hidden behind a glass still
    const r = g.el.getBoundingClientRect();
    const t = (r.top + r.height / 2 - vh / 2) / vh; // -1..1 around the center
    g.panes.forEach((p, i) => p.style.setProperty('--py', `${(t * ((i % 4) + 1) * -6 * k).toFixed(1)}px`));
  });
}
onFrame(motionFrame);


/* Smooth wheel scrolling (desktop pointer only). The page still scrolls
   natively: this only eases wheel input towards its target, so keyboard,
   scrollbar, find-in-page and anchors behave exactly as normal. */
const smoothWheel = !reduced && matchMedia('(pointer: fine)').matches && !('ontouchstart' in window)
  && new URLSearchParams(location.search).get('smooth') !== '0';
if (smoothWheel) {
  let target = scrollY, current = scrollY, running = false, lastT = 0;
  const maxY = () => document.documentElement.scrollHeight - innerHeight;
  const scrollableParent = (el, dy) => {
    if (!(el instanceof Element)) return false;
    for (; el && el !== document.body && el !== root; el = el.parentElement) {
      const cs = getComputedStyle(el);
      if (/(auto|scroll)/.test(cs.overflowY) && el.scrollHeight > el.clientHeight + 1) {
        if ((dy < 0 && el.scrollTop > 0) || (dy > 0 && el.scrollTop + el.clientHeight < el.scrollHeight - 1)) return true;
      }
    }
    return false;
  };
  const blocked = (e) => e.ctrlKey || e.metaKey || e.shiftKey
    || root.classList.contains('intro-playing') || root.classList.contains('intro-loading') || root.classList.contains('menu-open')
    || document.querySelector('dialog[open]') || Math.abs(e.deltaX) > Math.abs(e.deltaY)
    || scrollableParent(e.target, e.deltaY);
  const step = (t) => {
    const dt = Math.min(0.05, (t - (lastT || t)) / 1000) || 1 / 60;
    lastT = t;
    current += (target - current) * (1 - Math.exp(-dt * 13));
    if (Math.abs(target - current) < 0.4) { current = target; running = false; }
    scrollTo(0, current);
    if (running) requestAnimationFrame(step); else lastT = 0;
  };
  addEventListener('wheel', (e) => {
    if (e.defaultPrevented || blocked(e)) return;
    e.preventDefault();
    const d = e.deltaMode === 1 ? e.deltaY * 32 : e.deltaMode === 2 ? e.deltaY * innerHeight : e.deltaY;
    if (!running) target = current = scrollY;
    target = Math.max(0, Math.min(maxY(), target + d));
    if (!running) { running = true; requestAnimationFrame(step); }
  }, { passive: false });
  // Anything else that scrolls (keys, scrollbar, anchors) takes over at once.
  const release = () => { running = false; target = current = scrollY; };
  addEventListener('scroll', () => { if (!running) target = current = scrollY; }, { passive: true });
  addEventListener('keydown', release);
  addEventListener('mousedown', release);
  document.addEventListener('click', (e) => { if (e.target.closest('a[href*="#"]')) release(); }, true);
}

/* Closing logo: the ZIU AI logo video plays each time the section comes into view and
   rests on its last frame (the finished logo). Until then, and under reduced motion,
   the poster shows that finished logo. */
const sig = document.querySelector('.signature');
const sigVideo = sig && sig.querySelector('.signature__video');
if (sigVideo && !reduced && 'IntersectionObserver' in window) {
  let played = false;
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting && e.intersectionRatio >= 0.55) {
      if (played) return;
      played = true;
      try { sigVideo.currentTime = 0; } catch (err) {}
      const p = sigVideo.play();
      if (p && p.catch) p.catch(() => {});
    } else if (!e.isIntersecting) {
      played = false; // replay next time it comes into view
    }
  }, { threshold: [0, 0.55] }).observe(sigVideo);
}

/* Savings calculator: uses only the visitor's own figures. */
document.querySelectorAll('[data-calc]').forEach((calc) => {
  const f = calc.querySelector('form');
  const out = (k) => calc.querySelector(`[data-out="${k}"]`);
  const shareOut = calc.querySelector('[data-share]');
  const send = calc.querySelector('[data-calc-send]');
  const num = (name, min, max) => {
    const v = parseFloat(f.elements[name].value);
    return Number.isFinite(v) ? Math.min(max, Math.max(min, v)) : 0;
  };
  const locale = (cur) => (cur === 'INR' ? 'en-IN' : cur === 'GBP' ? 'en-GB' : cur === 'EUR' ? 'en-IE' : cur === 'AED' ? 'en-AE' : 'en-US');
  const fmtNum = (n, d = 0) => n.toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: 0 });
  const fmtCur = (n, cur) => new Intl.NumberFormat(locale(cur), { style: 'currency', currency: cur, maximumFractionDigits: 0 }).format(n);

  // Numbers glide to their new value (instant under reduced motion).
  const shown = { yearHours: 0, weekHours: 0, days: 0, cost: 0 };
  let target = { ...shown }, cur = 'USD', raf = 0;
  const paint = () => {
    out('yearHours').textContent = fmtNum(shown.yearHours);
    out('weekHours').textContent = fmtNum(shown.weekHours, 1);
    out('days').textContent = fmtNum(shown.days, 1);
    out('cost').textContent = fmtCur(shown.cost, cur);
  };
  const glide = () => {
    let moving = false;
    for (const k in shown) {
      const d = target[k] - shown[k];
      if (Math.abs(d) > Math.max(0.05, Math.abs(target[k]) * 0.001)) { shown[k] += d * 0.18; moving = true; } else shown[k] = target[k];
    }
    paint();
    raf = moving ? requestAnimationFrame(glide) : 0;
  };

  const update = () => {
    const hours = num('hours', 0, 80), people = num('people', 1, 500), rate = num('rate', 0, 100000);
    const share = num('share', 10, 90) / 100, weeks = num('weeks', 1, 52);
    cur = f.elements.currency.value;
    shareOut.textContent = `${Math.round(share * 100)}%`;
    f.elements.share.style.setProperty('--fill', `${((share * 100 - 10) / 80) * 100}%`);
    const weekHours = hours * people * share;
    const yearHours = weekHours * weeks;
    target = { weekHours, yearHours, days: yearHours / 8, cost: yearHours * rate };
    out('formula').textContent = `${fmtNum(hours, 1)} h × ${fmtNum(people)} ${people === 1 ? 'person' : 'people'} × ${Math.round(share * 100)}% × ${fmtNum(weeks)} weeks × ${fmtCur(rate, cur)} an hour`;
    if (reduced) { Object.assign(shown, target); paint(); } else if (!raf) raf = requestAnimationFrame(glide);
    // Hand the figures to the contact form as a ready-made note.
    const task = f.elements.task.value.trim();
    const q = new URLSearchParams({ topic: 'calc', h: hours, p: people, r: rate, c: cur, s: Math.round(share * 100), w: weeks });
    if (task) q.set('t', task.slice(0, 80));
    send.href = `/contact/?${q}`;
  };
  f.addEventListener('input', update);
  f.addEventListener('change', update);
  update();
});

/* Contact form: arrive from the calculator with the estimate already written. */
{
  const q = new URLSearchParams(location.search);
  const msg = document.getElementById('c-msg');
  if (msg && !msg.value && q.get('topic') === 'calc') {
    const h = +q.get('h') || 0, p = +q.get('p') || 1, r = +q.get('r') || 0, s = +q.get('s') || 0, w = +q.get('w') || 0;
    const c = /^[A-Z]{3}$/.test(q.get('c') || '') ? q.get('c') : 'USD';
    const yearly = h * p * (s / 100) * w;
    let cost = '';
    try { cost = new Intl.NumberFormat(c === 'INR' ? 'en-IN' : 'en', { style: 'currency', currency: c, maximumFractionDigits: 0 }).format(yearly * r); } catch (e) { cost = `${Math.round(yearly * r)} ${c}`; }
    const task = (q.get('t') || '').slice(0, 80);
    msg.value = `${task ? `Task: ${task}\n` : ''}My estimate from the savings calculator: ${h} hours a week × ${p} ${p === 1 ? 'person' : 'people'}, about ${s}% automatable, ${w} working weeks → around ${Math.round(yearly)} hours a year (${cost} at ${r} ${c}/hour). I'd like to check whether this is worth automating.`;
  }
}

