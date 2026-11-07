// ZIU AI — Vertical Glass Architecture renderer.
// A single full-screen fragment shader that ray-traces a front-facing wall of
// vertical glass panels: Fresnel reflections, refraction through real thickness,
// tinted absorption, polished edges, light frosting and water caustics.
// WebGL1, no dependencies.

const DEFAULT_MAXP = 9;

// The signature wall: vertical slabs at different depths, with a narrow
// corridor left open at x≈0 so the intro camera can travel between layers.
export const PANELS = [
  { x: -2.55, y: 0.10, z: 0.55, w: 0.26, h: 2.05, t: 0.050, frost: 0.9, red: 0.15 },
  { x: -1.95, y: -0.05, z: -0.15, w: 0.30, h: 2.45, t: 0.060, frost: 0.3, red: 0.0 },
  { x: -1.30, y: 0.15, z: 0.35, w: 0.28, h: 2.20, t: 0.055, frost: 0.6, red: 0.45 },
  { x: -0.70, y: 0.00, z: -0.45, w: 0.33, h: 2.60, t: 0.065, frost: 0.2, red: 0.0 },
  { x: -0.43, y: -0.10, z: 0.75, w: 0.29, h: 2.00, t: 0.050, frost: 1.0, red: 0.6 },
  { x: 0.42, y: 0.05, z: 0.10, w: 0.27, h: 2.35, t: 0.050, frost: 0.4, red: 0.2 },
  { x: 1.05, y: -0.08, z: -0.30, w: 0.31, h: 2.50, t: 0.060, frost: 0.15, red: 0.0 },
  { x: 1.65, y: 0.12, z: 0.45, w: 0.27, h: 2.15, t: 0.050, frost: 0.8, red: 0.5 },
  { x: 2.25, y: 0.00, z: -0.05, w: 0.30, h: 2.40, t: 0.060, frost: 0.3, red: 0.1 },
];


const VERT = `
attribute vec2 aPos;
void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const makeFrag = (MAXP) => `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec3 uRo;
uniform vec3 uTa;
uniform float uFocal;
uniform float uDoor;
uniform float uSoft;
uniform float uRed;
uniform float uCaus;
uniform float uExpo;
uniform float uHaze;
uniform float uLightY;
uniform int uCount;
uniform vec4 uP[${MAXP}];
uniform vec4 uS[${MAXP}];
uniform float uA[${MAXP}];
uniform float uSamples;
// Struck pane (hero piano): x = pane index, y = strength 0..1, z = height of the light ring
uniform vec3 uKey;

const float WALLZ = 4.6;
const vec3 RUBY = vec3(0.773, 0.176, 0.243);
const vec3 DEEP = vec3(0.561, 0.078, 0.137);
const vec3 SILVER = vec3(0.80, 0.82, 0.86);
const vec3 WHITE = vec3(1.0, 0.985, 0.97);

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

// Water caustics by iterated domain warping.
float caustic(vec2 p, float t){
  vec2 i = p;
  float c = 1.0;
  for (int n = 0; n < 4; n++){
    float tt = t * (1.0 - (3.5 / float(n + 1)));
    i = p + vec2(cos(tt - i.x) + sin(tt + i.y), sin(tt - i.y) + cos(tt + i.x));
    c += 1.0 / length(vec2(p.x / (sin(i.x + tt) / 0.005), p.y / (cos(i.y + tt) / 0.005)));
  }
  c /= 4.0;
  c = 1.17 - pow(c, 1.4);
  return min(pow(clamp(c, 0.0, 1.2), 8.0), 1.6);
}

// Light band travelling vertically along the panels.
float band(float y){ float d = (y - uLightY) / 1.1; return exp(-d * d); }

// Studio environment. reflEnv() is the cheap version used inside the trace
// loop (no caustics); studio() adds the caustic back wall and runs once.
vec3 reflEnv(vec3 ro, vec3 rd){
  vec3 col = vec3(0.010, 0.010, 0.012) * (0.6 + 0.4 * clamp(rd.y + 0.5, 0.0, 1.0));
  if (rd.z < -0.0005){
    float t = (-12.0 - ro.z) / rd.z;
    vec3 q = ro + rd * t;
    float s1 = smoothstep(0.66, 0.58, abs(q.x + 3.6));
    float s2 = smoothstep(0.36, 0.30, abs(q.x - 0.9));
    float s3 = smoothstep(0.52, 0.45, abs(q.x - 4.4));
    float vb = 0.2 + 1.8 * band(q.y * 0.7);
    float vert = smoothstep(6.0, 4.5, abs(q.y));
    col += (WHITE * s1 * 2.4 + RUBY * s2 * 1.1 * uRed + SILVER * s3 * 1.4) * vb * vert * uSoft * 1.1;
  } else {
    float t = (WALLZ - ro.z) / max(rd.z, 0.0005);
    vec3 q = ro + rd * t;
    col += SILVER * exp(-q.x * q.x * 3.0) * 0.6 * uDoor + DEEP * exp(-pow(abs(q.x) - 2.7, 2.0) * 0.45) * 0.3 * uRed;
  }
  col += SILVER * smoothstep(0.55, 1.0, rd.y) * 0.22 * uSoft;
  return col;
}

vec3 studio(vec3 ro, vec3 rd){
  if (rd.z <= 0.0005) return reflEnv(ro, rd);
  vec3 col = vec3(0.010, 0.010, 0.012) * (0.6 + 0.4 * clamp(rd.y + 0.5, 0.0, 1.0));
  float t = (WALLZ - ro.z) / rd.z;
  vec3 q = ro + rd * t;
  float door = exp(-q.x * q.x * 3.0) * (0.45 + 0.55 * exp(-q.y * q.y * 0.08));
  vec3 c = SILVER * door * 1.25 * uDoor;
  float side = exp(-pow(abs(q.x) - 2.7, 2.0) * 0.45);
  c += DEEP * side * 0.32 * uRed;
  float ca = caustic(q.xy * 0.85 + vec2(3.0, 7.0), uTime * 0.32);
  vec3 cc = mix(SILVER, RUBY, 0.65 * smoothstep(1.2, 2.8, abs(q.x)));
  c += cc * ca * uCaus * (0.12 + 0.9 * door + 0.35 * side) * 0.85;
  c *= 0.6 + 0.8 * band(q.y);
  c *= exp(-max(0.0, abs(q.y) - 3.2) * 0.7);
  col += c + SILVER * smoothstep(0.55, 1.0, rd.y) * 0.22 * uSoft;
  return col;
}

vec3 safeDir(vec3 d){ return d + vec3(1e-6) * (step(abs(d), vec3(1e-6))); }
vec2 rot(vec2 v, float a){ float s = sin(a), k = cos(a); return vec2(k * v.x - s * v.y, s * v.x + k * v.y); }

// Ray vs. a glass slab rotated by angle a around Z (a = 0 for the wall).
vec2 boxHit(vec3 ro, vec3 rd, vec3 c, vec3 h, float a, out vec3 nN, out vec3 nF){
  vec3 o = ro - c; o.xy = rot(o.xy, -a);
  vec3 d = rd; d.xy = rot(d.xy, -a); d = safeDir(d);
  vec3 m = 1.0 / d;
  vec3 n = m * o;
  vec3 k = abs(m) * h;
  vec3 t1 = -n - k;
  vec3 t2 = -n + k;
  float tN = max(max(t1.x, t1.y), t1.z);
  float tF = min(min(t2.x, t2.y), t2.z);
  nN = vec3(0.0); nF = vec3(0.0);
  if (tN > tF || tF < 0.0) return vec2(-1.0);
  nN = -sign(d) * step(t1.yzx, t1.xyz) * step(t1.zxy, t1.xyz);
  nF = sign(d) * step(t2.xyz, t2.yzx) * step(t2.xyz, t2.zxy);
  nN.xy = rot(nN.xy, a); nF.xy = rot(nF.xy, a);
  return vec2(tN, tF);
}

vec3 render(vec3 ro, vec3 rd){
  vec3 col = vec3(0.0);
  vec3 thr = vec3(1.0);
  vec3 cP = vec3(0.0);
  vec3 cThr = vec3(0.0);
  vec2 cOff = vec2(0.0);
  float cMix = 0.0;
  bool escaped = false;
  for (int b = 0; b < 4; b++){
    rd = safeDir(rd);
    float best = 1e9;
    vec3 bn = vec3(0.0);
    vec4 bp = vec4(0.0);
    vec4 bs = vec4(0.0);
    float ba = 0.0;
    bool hit = false;
    float bi = -1.0;
    for (int i = 0; i < ${MAXP}; i++){
      if (i >= uCount) break;
      vec3 nn, nf;
      vec2 t = boxHit(ro, rd, uP[i].xyz, uS[i].xyz, uA[i], nn, nf);
      if (t.x > 0.0005 && t.x < best){ best = t.x; bn = nn; bp = uP[i]; bs = uS[i]; ba = uA[i]; hit = true; bi = float(i); }
    }
    if (!hit){ escaped = true; break; }

    vec3 p = ro + rd * best;
    vec3 c = bp.xyz;
    vec3 h = bs.xyz;
    float face = abs(bn.z);
    vec2 fp = rot(p.xy - c.xy, -ba);

    // Distance to the nearest edge of this face (in the slab's own frame).
    vec2 d = h.xy - abs(fp);
    float ed = min(d.x, d.y);
    // Polished bevel: close to an edge the surface curves away, so edges pick
    // up real reflections like cut glass instead of a painted highlight.
    float bev = face * (1.0 - smoothstep(0.0, 0.024, ed));
    vec2 bdir = d.x < d.y ? vec2(sign(fp.x), 0.0) : vec2(0.0, sign(fp.y));
    bdir = rot(bdir, ba);
    // Very light frosting and a slow optical ripple: clear, not cloudy.
    vec2 g = vec2(noise(vec2(fp.x * 22.0, fp.y * 2.0)), noise(vec2(fp.x * 22.0 + 17.0, fp.y * 2.0 + 3.0))) - 0.5;
    float rip = sin(p.y * 2.6 + uTime * 0.55 + p.x * 1.7) * 0.0022;
    vec3 n = normalize(bn + face * vec3(g * bp.w * 0.018 + vec2(rip, rip * 0.6), 0.0) + vec3(bdir * bev * 1.1, 0.0));

    float cosi = clamp(dot(-rd, n), 0.0, 1.0);
    float F = 0.04 + 0.96 * pow(1.0 - cosi, 5.0);
    float edge = face * exp(-ed * 110.0) * 0.6 + (1.0 - face) * 0.75;

    vec3 rf = reflect(rd, n);
    col += thr * (F + edge * 0.32) * reflEnv(p, rf);
    col += thr * edge * (SILVER * 0.09 * uSoft + RUBY * 0.05 * uRed) * (0.3 + band(p.y));

    if (b == 0){ cP = p; cThr = thr * face; cOff = vec2(c.x * 3.0, c.z); cMix = bs.w; }
    // A struck pane rings with light: a soft inner glow and a bright band that
    // travels up the glass, both fading with the note.
    if (uKey.y > 0.001 && abs(bi - uKey.x) < 0.5){
      float ringL = exp(-pow((p.y - uKey.z) * 5.0, 2.0));
      col += thr * uKey.y * (RUBY * 0.11 + SILVER * 0.04 + vec3(1.0, 0.93, 0.94) * 0.46 * ringL) * (0.55 + 0.45 * face);
    }

    thr *= (1.0 - F) * (1.0 - edge * 0.28);

    // Refract through the slab, absorb by path length, refract out.
    vec3 ri = refract(rd, n, 1.0 / 1.5);
    vec3 nn2, nf2;
    vec3 pi = p + ri * 0.0004;
    vec2 te = boxHit(pi, safeDir(ri), c, h, ba, nn2, nf2);
    float len = max(te.y, 0.0);
    vec3 pe = pi + ri * len;
    vec3 tint = mix(vec3(0.56, 0.58, 0.61), vec3(0.62, 0.17, 0.21), bs.w);
    thr *= pow(tint, vec3(len * 6.0 + 0.55));
    vec3 ro2 = refract(ri, -nf2, 1.5);
    if (dot(ro2, ro2) < 0.001) ro2 = reflect(ri, -nf2);
    rd = normalize(ro2);
    ro = pe + rd * 0.0006;
    if (max(thr.x, max(thr.y, thr.z)) < 0.02) break;
  }
  if (escaped) col += thr * studio(ro, rd);
  // Water caustics projected onto the nearest glass surface.
  if (cThr.x > 0.0){
    float ca = caustic(cP.xy * 1.25 + vec2(cOff.x, 0.0), uTime * 0.28 + cOff.y);
    col += cThr * ca * uCaus * mix(SILVER, RUBY, cMix * 0.6) * 0.03;
  }
  return col;
}

vec3 aces(vec3 c){ return clamp((c * (2.51 * c + 0.03)) / (c * (2.43 * c + 0.59) + 0.14), 0.0, 1.0); }

void main(){
  vec3 fw = normalize(uTa - uRo);
  vec3 rt = normalize(cross(vec3(0.0, 1.0, 0.0), fw));
  vec3 up = cross(fw, rt);
  vec2 q = gl_FragCoord.xy / uRes;
  float streak = noise(vec2(q.x * 46.0, q.y * 1.5 + uTime * 0.25));
  vec3 haze = mix(vec3(0.035, 0.035, 0.04), vec3(0.10, 0.03, 0.045), q.y) * (0.7 + 0.6 * streak)
            + SILVER * 0.10 * exp(-pow((q.x - 0.5) * 3.2, 2.0));
  // Anti-aliasing: up to four rotated-grid samples per pixel, each tone-mapped
  // before averaging so bright glass edges stay clean.
  vec3 acc = vec3(0.0);
  for (int s = 0; s < 4; s++){
    if (float(s) >= uSamples) break;
    vec2 o = s == 0 ? vec2(0.125, 0.375) : s == 1 ? vec2(-0.375, 0.125) : s == 2 ? vec2(0.375, -0.125) : vec2(-0.125, -0.375);
    if (uSamples < 1.5) o = vec2(0.0);
    vec2 uv = (gl_FragCoord.xy + o - 0.5 * uRes) / uRes.y;
    vec3 c = render(uRo, normalize(fw * uFocal + uv.x * rt + uv.y * up)) * uExpo;
    acc += aces(mix(c, haze, uHaze));
  }
  vec3 col = acc / max(uSamples, 1.0);
  vec2 v = q - 0.5;
  col *= 1.0 - 0.9 * dot(v, v);
  gl_FragColor = vec4(pow(col, vec3(1.0 / 2.2)), 1.0);
}
`;

export class GlassWall {
  constructor(canvas, { maxp = DEFAULT_MAXP } = {}) {
    this.canvas = canvas;
    this.maxp = maxp;
    this.scale = 0.6;
    this.maxScale = 1;
    this.minScale = 0.35;
    this.frameTimes = [];
    this.lost = false;
  }

  // Resolves once the program is compiled and linked. Uses the parallel
  // compile extension where available so the main thread is not blocked.
  init() {
    const gl = this.canvas.getContext('webgl', {
      antialias: false, alpha: false, depth: false, stencil: false,
      powerPreference: 'high-performance', failIfMajorPerformanceCaveat: false,
    });
    if (!gl) return Promise.reject(new Error('WebGL unavailable'));
    this.gl = gl;
    this.canvas.addEventListener('webglcontextlost', (e) => {
      e.preventDefault();
      this.lost = true;
      this.onLost && this.onLost();
    });

    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const vs = sh(gl.VERTEX_SHADER, VERT);
    const fs = sh(gl.FRAGMENT_SHADER, makeFrag(this.maxp));
    const prog = gl.createProgram();
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    const par = gl.getExtension('KHR_parallel_shader_compile');

    return new Promise((resolve, reject) => {
      const check = () => {
        if (par && !gl.getProgramParameter(prog, par.COMPLETION_STATUS_KHR)) { setTimeout(check, 16); return; }
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
          const log = gl.getShaderInfoLog(fs) || gl.getProgramInfoLog(prog);
          reject(new Error('Glass shader failed: ' + log));
          return;
        }
        this._setup(prog);
        resolve();
      };
      check();
    });
  }

  _setup(prog) {
    const gl = this.gl;
    this.prog = prog;
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    this.u = {};
    ['uRes', 'uTime', 'uRo', 'uTa', 'uFocal', 'uDoor', 'uSoft', 'uRed', 'uCaus', 'uExpo', 'uHaze', 'uLightY', 'uCount', 'uP', 'uS', 'uA', 'uSamples', 'uKey']
      .forEach((n) => { this.u[n] = gl.getUniformLocation(prog, n); });
  }

  setPanels(panels) {
    const gl = this.gl;
    const max = this.maxp;
    const P = this._P || (this._P = new Float32Array(max * 4));
    const S = this._S || (this._S = new Float32Array(max * 4));
    const R = this._R || (this._R = new Float32Array(max));
    panels.slice(0, max).forEach((p, i) => {
      P[i * 4] = p.x; P[i * 4 + 1] = p.y; P[i * 4 + 2] = p.z; P[i * 4 + 3] = p.frost;
      S[i * 4] = p.w; S[i * 4 + 1] = p.h; S[i * 4 + 2] = p.t; S[i * 4 + 3] = p.red;
      R[i] = p.a || 0;
    });
    gl.uniform4fv(this.u.uP, P);
    gl.uniform4fv(this.u.uS, S);
    gl.uniform1fv(this.u.uA, R);
    gl.uniform1i(this.u.uCount, Math.min(panels.length, max));
  }

  // Fixed-size rendering for off-screen stills.
  setSize(W, H) {
    this.fixed = true;
    if (this.canvas.width !== W || this.canvas.height !== H) { this.canvas.width = W; this.canvas.height = H; } // same size: no reallocation
    this.gl.viewport(0, 0, W, H);
  }

  resize() {
    if (this.fixed) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;
    const s = this.scale * dpr;
    const W = Math.max(2, Math.round(w * s));
    const H = Math.max(2, Math.round(h * s));
    if (this.canvas.width !== W || this.canvas.height !== H) {
      this.canvas.width = W;
      this.canvas.height = H;
    }
    this.gl.viewport(0, 0, W, H);
  }

  // Adaptive resolution: keeps the wall smooth on ordinary hardware.
  track(dtMs) {
    this.frameTimes.push(dtMs);
    if (this.frameTimes.length < 24) return;
    const avg = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
    this.frameTimes.length = 0;
    const budget = this.budget || 17.5;
    if (avg > budget * 1.25 && this.scale > this.minScale) this.scale = Math.max(this.minScale, this.scale - 0.1);
    else if (avg < budget * 0.8 && this.scale < this.maxScale) this.scale = Math.min(this.maxScale, this.scale + 0.05);
  }

  draw(s) {
    if (this.lost) return;
    const gl = this.gl;
    const u = this.u;
    this.resize();
    gl.uniform2f(u.uRes, this.canvas.width, this.canvas.height);
    gl.uniform1f(u.uTime, s.time);
    gl.uniform3fv(u.uRo, s.ro);
    gl.uniform3fv(u.uTa, s.ta);
    gl.uniform1f(u.uFocal, s.focal);
    gl.uniform1f(u.uDoor, s.door);
    gl.uniform1f(u.uSoft, s.soft);
    gl.uniform1f(u.uRed, s.red);
    gl.uniform1f(u.uCaus, s.caus);
    gl.uniform1f(u.uExpo, s.expo);
    gl.uniform1f(u.uHaze, s.haze);
    gl.uniform1f(u.uLightY, s.lightY);
    gl.uniform1f(u.uSamples, s.samples || 1);
    if (u.uKey) { const k = s.key || [-1, 0, 0]; gl.uniform3f(u.uKey, k[0], k[1], k[2]); }
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
}
