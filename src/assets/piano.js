// Glass piano voice.
// Real piano: recorded notes of the Salamander Grand Piano (a Yamaha C5) by
// Alexander Holm, licensed CC BY 3.0, in ./piano/. Nine notes from C4 to C6
// are recorded; notes in between replay the nearest recording a semitone or
// so higher or lower, as sample pianos do. They load on the first click.
// Until a recording has loaded (or if it cannot), a synthesised piano plays.
//
// The synthesised voice is built the way a piano string sounds:
//  - stretched partials (string stiffness makes upper partials slightly sharp)
//  - each partial doubled by a second, slightly detuned string, so it beats
//    gently like the two or three strings of a real piano note
//  - a fast first decay then a long, soft ring (prompt sound and aftersound),
//    with higher partials dying sooner, so the tone darkens as it rings
//  - a felt-hammer knock and a short body thump at the attack
//  - a small concert-hall reverb
// The audio context starts on the first click, as browsers require.

let ctx = null;
let bus = null;

function hallImpulse(c, seconds) {
  const len = Math.floor(c.sampleRate * seconds);
  const buf = c.createBuffer(2, len, c.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    let lp = 0;
    for (let i = 0; i < len; i++) {
      const t = i / c.sampleRate;
      // early reflections, then a smooth, darkening tail
      const early = t < 0.08 && Math.random() < 0.004 ? (Math.random() * 2 - 1) * 0.8 : 0;
      const n = Math.random() * 2 - 1;
      lp += (n - lp) * (0.35 - 0.25 * Math.min(1, t / seconds));
      d[i] = (lp * 0.9 + early) * Math.pow(1 - t / seconds, 2.4);
    }
  }
  return buf;
}

function ensure() {
  if (ctx) return ctx;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -14; comp.knee.value = 12; comp.ratio.value = 3; comp.attack.value = 0.004; comp.release.value = 0.25;
  const master = ctx.createGain(); master.gain.value = 0.62;
  const dry = ctx.createGain(); dry.gain.value = 1;
  const verb = ctx.createConvolver(); verb.buffer = hallImpulse(ctx, 2.6);
  const wet = ctx.createGain(); wet.gain.value = 0.24;
  dry.connect(comp); verb.connect(wet); wet.connect(comp); comp.connect(master); master.connect(ctx.destination);
  bus = { dry, verb, wet };
  return ctx;
}

const SAMPLES = { 60: 'C4', 63: 'Ds4', 66: 'Fs4', 69: 'A4', 72: 'C5', 75: 'Ds5', 78: 'Fs5', 81: 'A5', 84: 'C6' };
const buffers = {};
let loading = null;
function loadSamples(c) {
  if (loading) return loading;
  loading = Promise.all(Object.entries(SAMPLES).map(([m, name]) =>
    fetch(new URL(`./piano/${name}.mp3`, import.meta.url))
      .then((r) => { if (!r.ok) throw new Error(r.status); return r.arrayBuffer(); })
      .then((b) => new Promise((ok, no) => c.decodeAudioData(b, ok, no)))
      .then((buf) => { buffers[m] = buf; })
      .catch(() => {})));
  return loading;
}
const nearest = (midi) => Object.keys(SAMPLES).map(Number).reduce((a, b) => (Math.abs(b - midi) < Math.abs(a - midi) ? b : a));

// A recorded note: replayed at the right pitch, softer notes a little darker,
// a gentle fade if it is still ringing after six seconds.
function playSample(c, midi, v, pan) {
  const base = nearest(midi), buf = buffers[base];
  if (!buf) return false;
  const t = c.currentTime + 0.003;
  const src = c.createBufferSource();
  src.buffer = buf;
  src.playbackRate.value = Math.pow(2, (midi - base) / 12);
  const tone = c.createBiquadFilter(); tone.type = 'lowpass'; tone.Q.value = 0.3;
  tone.frequency.value = 2400 + 15000 * Math.pow(v, 1.4);
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(1.15 * Math.pow(v, 1.3), t + 0.004);
  const end = t + Math.min(buf.duration / src.playbackRate.value, 7);
  g.gain.setTargetAtTime(0.0001, Math.max(t + 0.1, end - 1.2), 0.35);
  src.connect(tone); tone.connect(g);
  const pn = c.createStereoPanner ? c.createStereoPanner() : null;
  if (pn) { pn.pan.value = pan * 0.5; g.connect(pn); pn.connect(bus.dry); pn.connect(bus.verb); }
  else { g.connect(bus.dry); g.connect(bus.verb); }
  bus.wet.gain.value = 0.14; // the recording already has its own room
  src.start(t); src.stop(end + 0.2);
  src.onended = () => { try { g.disconnect(); tone.disconnect(); pn && pn.disconnect(); } catch (e) {} };
  return true;
}

let noiseBuf = null;
function noise(c) {
  if (noiseBuf) return noiseBuf;
  noiseBuf = c.createBuffer(1, Math.floor(c.sampleRate * 0.12), c.sampleRate);
  const d = noiseBuf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return noiseBuf;
}

/** Start fetching the recordings early (e.g. when the pointer first rests on a pane). */
export function preload() { const c = ensure(); if (c) loadSamples(c); }

/** Play one piano note. midi: 21..108; velocity 0..1; pan -1..1 */
export function playNote(midi, velocity = 0.75, pan = 0) {
  const c = ensure();
  if (!c) return;
  if (c.state === 'suspended') c.resume();
  const v0 = Math.max(0.05, Math.min(1, velocity));
  if (playSample(c, midi, v0, pan)) return;
  // First click: give the recordings a moment to arrive, then play.
  const started = performance.now();
  let done = false;
  loadSamples(c).then(() => { if (!done && performance.now() - started < 350 && playSample(c, midi, v0, pan)) done = true; });
  setTimeout(() => { if (!done) { done = true; synthNote(c, midi, v0, pan); } }, 360);
}

function synthNote(c, midi, velocity, pan) {
  bus.wet.gain.value = 0.24;
  const t = c.currentTime + 0.005;
  const f0 = 440 * Math.pow(2, (midi - 69) / 12);
  const v = Math.max(0.05, Math.min(1, velocity));
  const reg = Math.max(0, Math.min(1, (midi - 36) / 60)); // 0 low .. 1 high
  const ring = 7.5 - 5.2 * reg; // seconds: bass rings longer than treble
  const B = 0.00012 + 0.0009 * reg * reg; // string stiffness
  const hammer = 0.12; // strike point (1/8 of the string)

  // tone: brighter for harder notes, darkening over time
  const tone = c.createBiquadFilter(); tone.type = 'lowpass'; tone.Q.value = 0.4;
  const bright = Math.min(16000, f0 * (5 + 16 * v));
  tone.frequency.setValueAtTime(bright, t);
  tone.frequency.exponentialRampToValueAtTime(Math.max(f0 * 2.2, 400), t + ring * 0.7);
  const out = c.createGain(); out.gain.value = 0.9 * Math.pow(v, 1.15);
  const pn = c.createStereoPanner ? c.createStereoPanner() : null;
  tone.connect(out);
  if (pn) { pn.pan.value = pan * 0.6; out.connect(pn); pn.connect(bus.dry); pn.connect(bus.verb); }
  else { out.connect(bus.dry); out.connect(bus.verb); }

  const stopAt = t + ring + 0.5;
  const N = Math.min(18, Math.floor(12000 / f0));
  for (let n = 1; n <= N; n++) {
    const fn = n * f0 * Math.sqrt(1 + B * n * n);
    // partial strength: falls with order, shaped by where the hammer hits
    let a = Math.abs(Math.sin(Math.PI * n * hammer)) / Math.pow(n, 0.85 + 0.5 * (1 - v));
    if (n === 1) a *= 1.15;
    const g = c.createGain();
    const T = ring / (1 + 0.55 * (n - 1)); // higher partials die sooner
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(a, t + 0.0025 + 0.002 * (1 - v));
    g.gain.setTargetAtTime(a * 0.32, t + 0.004, 0.09 + 0.08 * (1 - reg)); // prompt sound
    g.gain.setTargetAtTime(0.00001, t + 0.18, T * 0.36); // aftersound
    g.connect(tone);
    const strings = n <= 8 ? 2 : 1;
    for (let s = 0; s < strings; s++) {
      const o = c.createOscillator();
      o.type = 'sine';
      o.frequency.value = fn * (strings === 2 ? (s ? 1.00042 : 0.99971) : 1);
      const sg = c.createGain(); sg.gain.value = strings === 2 ? 0.55 : 1;
      o.connect(sg); sg.connect(g);
      o.start(t); o.stop(stopAt);
    }
  }

  // felt hammer knock
  const nz = c.createBufferSource(); nz.buffer = noise(c);
  const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = Math.min(5000, f0 * 4); bp.Q.value = 0.9;
  const ng = c.createGain();
  ng.gain.setValueAtTime(0.0001, t);
  ng.gain.exponentialRampToValueAtTime(0.09 * v, t + 0.002);
  ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.045);
  nz.connect(bp); bp.connect(ng); ng.connect(tone);
  nz.start(t); nz.stop(t + 0.1);
  // soundboard thump
  const th = c.createOscillator(); th.type = 'sine'; th.frequency.setValueAtTime(110, t); th.frequency.exponentialRampToValueAtTime(60, t + 0.08);
  const tg = c.createGain(); tg.gain.setValueAtTime(0.0001, t); tg.gain.exponentialRampToValueAtTime(0.06 * v, t + 0.004); tg.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
  th.connect(tg); tg.connect(out); th.start(t); th.stop(t + 0.15);

  // tidy up the graph when the note has gone quiet
  setTimeout(() => { try { tone.disconnect(); out.disconnect(); pn && pn.disconnect(); } catch (e) {} }, (stopAt - c.currentTime + 0.3) * 1000);
}
