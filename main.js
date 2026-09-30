// Background "3D orbits": built from plain divs, animated with CSS only.
// Every value below can be overridden with a data-* attribute on .bg,
// e.g. <div class="bg" data-orbits="5" data-tilt="70">.

const ORBITS = {
  accent: '#c8ff3d',   // colour of part of the objects and the core (read from --accent)
  secondary: '#3d6bff',
  orbits: 4,           // 1–6 — number of orbits
  objects: 3,          // 1–6 — objects per orbit
  tilt: 60,            // 0–85° — base tilt of the planes
  spread: 1,           // 0.5–1.6 — radius multiplier
  objectSize: 1,       // 0.5–2.5 — sphere size multiplier
  ringOpacity: 0.14,   // 0–0.5 — orbit line visibility (0 = spheres only)
  centerX: 66,         // % of width — system centre (behind the phones)
  centerY: 46,         // % of height
  speed: 1,            // 0.25–3 — speed multiplier
  intensity: 1,        // 0–1 — opacity of the whole layer
};

const MOBILE = { orbits: 3, spread: 0.6, centerX: 50, centerY: 35, intensity: 0.8 };

const LIMITS = {
  orbits: [1, 6], objects: [1, 6], tilt: [0, 85], spread: [0.5, 1.6],
  objectSize: [0.5, 2.5], ringOpacity: [0, 0.5], centerX: [-50, 150],
  centerY: [-50, 150], speed: [0.25, 3], intensity: [0, 1],
};

const TILT_K = [1, 0.85, 1.15, 0.7, 1.05, 0.9];
const ROT_Y = [0, 18, -14, 26, -22, 10];
const ROT_Z = [0, 38, -32, 64, -58, 22];
const DURATION = [60, 90, 120, 150, 180, 210];
const COLORS = ['var(--o-accent)', 'var(--o-secondary)', '#f2f3f5', 'var(--o-secondary)', 'var(--o-accent)', '#8b8f99'];

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

function el(cls, parent, style) {
  const node = document.createElement('div');
  node.className = cls;
  if (style) node.style.cssText = style;
  parent.appendChild(node);
  return node;
}

function readConfig(bg, mobile) {
  const root = getComputedStyle(document.documentElement);
  const cfg = {
    ...ORBITS,
    accent: root.getPropertyValue('--accent').trim() || ORBITS.accent,
    secondary: root.getPropertyValue('--secondary').trim() || ORBITS.secondary,
    ...(mobile ? MOBILE : {}),
  };
  for (const key of Object.keys(ORBITS)) {
    const raw = bg.dataset[key];
    if (raw === undefined || raw === '') continue;
    if (key === 'accent' || key === 'secondary') { cfg[key] = raw; continue; }
    const num = parseFloat(raw);
    if (Number.isFinite(num)) cfg[key] = num;
  }
  for (const [key, [lo, hi]] of Object.entries(LIMITS)) cfg[key] = clamp(cfg[key], lo, hi);
  cfg.orbits = Math.round(cfg.orbits);
  cfg.objects = Math.round(cfg.objects);
  return cfg;
}

function build(bg, cfg) {
  bg.textContent = '';
  bg.style.opacity = cfg.intensity;
  // Colours stay bound to the CSS variables unless explicitly overridden,
  // so editing --accent in DevTools recolours the layer live.
  bg.style.setProperty('--o-accent', bg.dataset.accent || 'var(--accent)');
  bg.style.setProperty('--o-secondary', bg.dataset.secondary || 'var(--secondary)');

  const scene = el('scene', bg, `transform: translate(${cfg.centerX - 50}%, ${cfg.centerY - 50}%)`);
  el('core', scene, `--d: ${22 * cfg.objectSize}px`);

  for (let i = 0; i < cfg.orbits; i++) {
    const r = (200 + i * 150) * cfg.spread;
    const tx = clamp(cfg.tilt * TILT_K[i], 0, 89);
    const ry = ROT_Y[i];
    const rz = ROT_Z[i];
    const dir = i % 2 === 0 ? 'normal' : 'reverse';
    const back = i % 2 === 0 ? 'reverse' : 'normal';
    const dur = DURATION[i] / cfg.speed;

    const orbit = el('orbit', scene,
      `width: ${2 * r}px; height: ${2 * r}px; margin: ${-r}px 0 0 ${-r}px;` +
      `transform: rotateX(${tx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`);

    const ring = cfg.ringOpacity > 0
      ? `border: 1px ${i % 2 === 0 ? 'dashed' : 'solid'} rgba(255, 255, 255, ${cfg.ringOpacity});`
      : '';
    const spin = el('spin', orbit, `${ring} animation: rot ${dur}s linear infinite ${dir}`);

    for (let j = 0; j < cfg.objects; j++) {
      const a = (360 / cfg.objects) * j + i * 23;
      const d = (10 + ((i * 7 + j * 5) % 3) * 5) * cfg.objectSize;
      const obj = el('obj', spin, `transform: rotate(${a}deg) translate(${r}px)`);
      const unangle = el('unangle', obj, `transform: rotate(${-a}deg)`);
      const unspin = el('unspin', unangle, `animation: rot ${dur}s linear infinite ${back}`);
      el('sphere', unspin,
        `--d: ${d}px; --c: ${COLORS[(i + j) % 6]};` +
        `transform: rotateZ(${-rz}deg) rotateY(${-ry}deg) rotateX(${-tx}deg)`);
    }
  }
}

(function init() {
  const bg = document.querySelector('.bg');
  if (!bg) return;
  const mq = window.matchMedia('(max-width: 767px)');
  const render = () => build(bg, readConfig(bg, mq.matches));
  render();
  mq.addEventListener('change', render);
})();
