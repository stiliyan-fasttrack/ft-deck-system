#!/usr/bin/env node
// build_deck.js — deck.json → .pptx in the Fast Track visual system (black canvas, Plaak numerals, yellow accent).
// Usage: node build_deck.js deck.json [out.pptx]
// Every slide is native PowerPoint (text boxes, shapes, charts) so colleagues can edit it afterwards.
'use strict';
const fs = require('fs'), path = require('path');
const pptxgen = require('pptxgenjs');
const JSZip = require('jszip');
let sharp = null; try { sharp = require('sharp'); } catch (e) { /* optional: pictogram walls + gradients */ }

const SKILL = path.resolve(__dirname, '..');
const C = { BG: '000000', W: 'FFFFFF', Y: 'FEF37F', G1: 'B2B2B2', G2: '7F7F7F', G3: '262626', G4: '3F3F3F', GRID: 'E7E6E6', K: '000000' };
const GREYS = ['D9D9D9', 'A6A6A6', '7F7F7F', '595959', '3F3F3F', '262626'];
// family names exactly as macOS/PowerPoint register them (system_profiler SPFontsDataType → Family), NOT the OTF nameID 1
const F = { d: 'Plaak 3 Pradel', t: 'Riforma LL', m: 'ABC Monument Grotesk Mono' };
const W = 13.333, H = 7.5, RULE_Y = 0.75, RULE_X = 12.59, CONTENT_W = 12.33;
const HAIR = { color: C.W, width: 0.5 };

const deckFile = process.argv[2];
if (!deckFile) { console.error('usage: build_deck.js deck.json [out.pptx]'); process.exit(1); }
const deck = JSON.parse(fs.readFileSync(deckFile, 'utf8'));
const BASE = path.dirname(path.resolve(deckFile));
const OUT = path.resolve(BASE, process.argv[3] || (deck.meta && deck.meta.out) || 'out/deck.pptx');
const CACHE = path.join(BASE, '.cache'); fs.mkdirSync(CACHE, { recursive: true });
const warn = [];
let animGroup = 0, animOn = true, morphOn = false, morphCounter = 0; // click groups → <p:timing>; morph keys (!!mN) → PowerPoint Morph matches the same shape on the start-state slide and the final slide
const animName = (base) => `${morphOn ? `!!m${++morphCounter}.` : ''}${animOn && animGroup ? `anim:${animGroup}:` : ''}${base}`;
const reveal = (g, fn) => { const prev = animGroup; animGroup = g; try { fn(); } finally { animGroup = prev; } };
const asset = (p) => (p ? (path.isAbsolute(p) ? p : fs.existsSync(path.resolve(BASE, p)) ? path.resolve(BASE, p) : path.resolve(SKILL, 'assets', p)) : null);

// ---------- text helpers ----------
// inline markup: *yellow text*  |  newline = \n
function runs(str, base) {
  if (Array.isArray(str)) return str.flatMap((line, i) => runs(line, base).map((r, j, arr) => (j === arr.length - 1 && i < str.length - 1 ? { ...r, options: { ...r.options, breakLine: true } } : r)));
  const out = []; const parts = String(str).split(/(\*[^*]+\*)/);
  for (const p of parts) {
    if (!p) continue;
    if (p.startsWith('*') && p.endsWith('*')) out.push({ text: p.slice(1, -1), options: { ...base, color: C.Y } });
    else out.push({ text: p, options: { ...base } });
  }
  return out.length ? out : [{ text: '', options: { ...base } }];
}
function txt(slide, str, o) {
  if ((o.fontFace || F.t) === F.d && /[~≈→]/.test(Array.isArray(str) ? str.join(' ') : String(str))) warn.push(`display text contains ~ ≈ → (no glyph in Plaak): ${String(Array.isArray(str) ? str.join(' ') : str).slice(0, 40)}`);
  const base = { fontFace: o.fontFace || F.t, fontSize: o.fontSize || 24, color: o.color || C.W, bold: !!o.bold, charSpacing: o.charSpacing };
  const opts = { x: o.x, y: o.y, w: o.w, h: o.h, margin: 0, isTextBox: true, align: o.align || 'left', valign: o.valign || 'top', fit: 'none', wrap: o.wrap !== false, lineSpacingMultiple: o.lineSpacingMultiple || (o.fontFace === F.d || base.fontFace === F.d ? 0.82 : 1.0), paraSpaceAfter: o.paraSpaceAfter, bullet: o.bullet, inset: 0 };
  if (o.rotate) opts.rotate = o.rotate;
  opts.objectName = animName('text');
  slide.addText(runs(str, base), opts);
}
const words = (s) => (Array.isArray(s) ? s.join(' ') : String(s || '')).replace(/\*/g, '').split(/\s+/).filter(Boolean).length;
function title(slide, t) { if (!t) return; const L = (Array.isArray(t) ? t.join(' ') : String(t)).replace(/\*/g, '').length; txt(slide, t, { x: 0.07, y: 0.14, w: 11.99, h: 0.6, fontFace: F.d, fontSize: L > 66 ? 30 : L > 58 ? 34 : L > 50 ? 38 : 42, valign: 'middle', wrap: false }); } // long claims shrink instead of wrapping into the content
function unit(slide, u) { if (u) txt(slide, u, { x: 0.07, y: 6.95, w: 6, h: 0.4, fontFace: F.t, fontSize: 18, valign: 'bottom' }); }
function line(slide, x1, y1, x2, y2, o = {}) {
  slide.addShape(pres.ShapeType.line, { x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1), h: Math.abs(y2 - y1), flipV: (y2 < y1) !== (x2 < x1), line: { color: o.color || C.W, width: o.width || 0.5, dashType: o.dash || 'solid', endArrowType: o.arrow ? 'triangle' : undefined }, objectName: animName('line') });
}
function circle(slide, cx, cy, d, o = {}) {
  slide.addShape(pres.ShapeType.ellipse, { x: cx - d / 2, y: cy - d / 2, w: d, h: d, fill: o.fill ? { color: o.fill } : { type: 'none' }, line: o.line ? { color: o.line, width: o.lineW || 0.75 } : { type: 'none' }, objectName: animName('circle') });
}
function rect(slide, x, y, w, h, o = {}) {
  slide.addShape(pres.ShapeType.rect, { x, y, w, h, fill: o.fill ? { color: o.fill, transparency: o.alpha } : { type: 'none' }, line: o.line ? { color: o.line, width: o.lineW || 1, dashType: o.dash || 'solid' } : { type: 'none' }, objectName: animName('rect') });
}
function image(slide, p, o) { const f = asset(p); if (!f || !fs.existsSync(f)) { warn.push(`missing image ${p}`); return; } slide.addImage({ path: f, x: o.x, y: o.y, w: o.w, h: o.h, sizing: o.sizing ? { type: o.sizing, w: o.w, h: o.h } : undefined, transparency: o.alpha, objectName: animName('image') }); }
// full-bleed photo, darkened, optional horizontal black→transparent fade (side: 'left' = fade on the photo's left edge)
async function photo(slide, p, o = {}) {
  if (!p) return;
  const f = asset(p); if (!f) return;
  const x = o.x ?? 0, y = o.y ?? 0, w = o.w ?? W, h = o.h ?? H;
  slide.addImage({ path: f, x, y, w, h, sizing: { type: 'cover', w, h } });
  if (o.dim !== 0) rect(slide, x, y, w, h, { fill: C.K, alpha: 100 - (o.dim ?? 45) });
  if (o.fade && sharp) { const g = await gradientPNG(o.fade); slide.addImage({ path: g, x: o.fade === 'left' ? x - 0.01 : x + w * 0.4, y, w: w * 0.6, h }); }
}
async function gradientPNG(dir) {
  const f = path.join(CACHE, `grad-${dir}.png`); if (fs.existsSync(f)) return f;
  const w = 1200, h = 8; const buf = Buffer.alloc(w * h * 4);
  for (let x = 0; x < w; x++) { const t = x / (w - 1); const u = dir === 'left' ? t : 1 - t; // u: 0 = opaque black, 1 = clear
    const a = u < 0.42 ? 1 : u < 0.71 ? 1 - ((u - 0.42) / 0.29) * 0.68 : u < 0.82 ? 0.32 - ((u - 0.71) / 0.11) * 0.25 : u < 0.95 ? 0.07 - ((u - 0.82) / 0.13) * 0.06 : 0;
    for (let y = 0; y < h; y++) { const i = (y * w + x) * 4; buf[i] = 0; buf[i + 1] = 0; buf[i + 2] = 0; buf[i + 3] = Math.round(a * 255); } }
  await sharp(buf, { raw: { width: w, height: h, channels: 4 } }).png().toFile(f); return f;
}
async function pictogramWall(cols, rows, color) {
  const f = path.join(CACHE, `wall-${cols}x${rows}-${color}.png`); if (fs.existsSync(f) || !sharp) return f;
  const svg = fs.readFileSync(path.join(SKILL, 'assets', 'man.svg'), 'utf8').replace(/#7F7F7F/g, '#' + color);
  const cw = 2560 / cols, ch = 1440 / rows; const size = Math.round(Math.min(ch * 0.8, cw * 2.1)); // the figure is ~46% of its square tile
  const tile = await sharp(Buffer.from(svg)).resize(size, size).png().toBuffer();
  const comp = []; for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) comp.push({ input: tile, left: Math.round(c * cw + (cw - size) / 2), top: Math.round(r * ch + (ch - size) / 2) });
  await sharp({ create: { width: 2560, height: 1440, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } }).composite(comp).png().toFile(f); return f;
}
// badge: small hairline circle with year (mono) + value (display); used top-left on chart slides
function badge(slide, b, cx = 1.0, cy = 1.78, d = 1.65) {
  if (!b) return; circle(slide, cx, cy, d, { line: C.W, lineW: 0.75 });
  txt(slide, b.year, { x: cx - d / 2, y: cy - d * 0.42, w: d, h: d * 0.3, fontFace: F.m, fontSize: 16 * (d / 1.65), align: 'center', valign: 'middle' });
  txt(slide, b.value, { x: cx - d / 2 - 0.3, y: cy - d * 0.17, w: d + 0.6, h: d * 0.55, fontFace: F.d, fontSize: 44 * (d / 1.65), align: 'center', valign: 'middle' });
}
// ---------- charts ----------
const chartLog = []; // creation order → chartN.xml; used for the explosion post-process
function pieColors(n, highlight) {
  const hl = new Set(Array.isArray(highlight) ? highlight : typeof highlight === 'number' ? Array.from({ length: highlight }, (_, i) => i) : []);
  let g = 0; return Array.from({ length: n }, (_, i) => (hl.has(i) ? C.Y : GREYS[g++ % GREYS.length]));
}
function pie(slide, o) {
  const n = o.values.length; const colors = o.colors || pieColors(n, o.highlight ?? 0);
  const d = Math.min(o.w, o.h); const x = o.x + (o.w - d) / 2, y = o.y + (o.h - d) / 2;
  if (o.ring) circle(slide, x + d / 2, y + d / 2, d * (o.ring === true ? 1.12 : o.ring), { line: C.W, lineW: 0.5 });
  slide.addChart(pres.ChartType.pie, [{ name: o.name || 'Series', labels: o.labels.map(String), values: o.values }], {
    x, y, w: d, h: d, layout: { x: 0, y: 0, w: 1, h: 1 }, chartColors: colors, dataBorder: { pt: o.border ?? 2, color: C.K },
    objectName: animName(`pie${n}`), showLegend: false, showTitle: false, showValue: false, showLabel: false, showPercent: false, firstSliceAngle: o.startAngle ?? 0, chartArea: { fill: { color: C.BG, transparency: 100 }, roundedCorners: false }, plotArea: { fill: { color: C.BG, transparency: 100 } },
  });
  chartLog.push({ explode: o.explode || 0, n });
  // labels placed by angle (clockwise from 12 o'clock), like the original deck's hand-placed boxes
  const total = o.values.reduce((a, b) => a + b, 0); let acc = 0, tinyK = 0; const r = d / 2, cx = x + r, cy = y + r;
  const fmt = o.format || '{v}'; const f = (v) => fmt.replace('{v}', typeof v === 'number' ? (Number.isInteger(v) ? v : v.toFixed(o.decimals ?? 0)) : v).replace('{p}', Math.round((v / total) * 100));
  o.values.forEach((v, i) => {
    const a = ((acc + v / 2) / total) * 2 * Math.PI - Math.PI / 2; acc += v; const share = v / total;
    if (o.valueLabels !== false && share >= (o.minShare ?? 0.04)) {
      const ri = r * (o.explode ? 0.62 : 0.58); const fs = share > 0.15 ? (o.valueSize || 36) : Math.max(16, (o.valueSize || 36) * 0.6);
      txt(slide, f(v), { x: cx + ri * Math.cos(a) - 1.0, y: cy + ri * Math.sin(a) - 0.35, w: 2.0, h: 0.7, fontFace: F.d, fontSize: fs, color: colors[i] === C.Y || colors[i] === GREYS[0] ? C.K : C.W, align: 'center', valign: 'middle' });
    }
    if (o.catLabels !== false) {
      const tiny = share < 0.05; tinyK = tiny ? tinyK + 1 : 0; const ro = r * (o.labelRadius || 1.14) + 0.1 + (tiny ? 0.28 * (tinyK % 3) : 0); const lx = cx + ro * Math.cos(a), ly = cy + ro * Math.sin(a);
      const right = Math.cos(a) > 0.15, left = Math.cos(a) < -0.15; const bw = 2.6;
      const bx = Math.max(0.05, Math.min(RULE_X - 0.1 - bw, right ? lx : left ? lx - bw : lx - bw / 2)), by = Math.max(0.8, Math.min(7.4 - 0.6, ly - 0.3)); // clamp inside the frame
      txt(slide, o.labels[i], { x: bx, y: by, w: bw, h: 0.6, fontFace: F.t, fontSize: share > 0.15 ? (o.labelSize || 28) : Math.max(16, (o.labelSize || 28) * 0.72), align: right ? 'left' : left ? 'right' : 'center', valign: 'middle' });
    }
  });
}
function fmtFromCode(code) { if (!code || code === 'General') return (v) => String(v);
  const lits = [...code.matchAll(/"([^"]*)"/g)].map((m) => m[1]); const body = code.replace(/"[^"]*"/g, '|'); const numPat = code.replace(/"[^"]*"/g, '');
  const dec = (numPat.split('.')[1] || '').replace(/[^0#]/g, '').length; const thousands = numPat.includes(','); const prefix = body.startsWith('|') ? lits[0] : ''; const suffix = body.endsWith('|') && lits.length ? lits[lits.length - 1] : '';
  return (v) => { let t = dec ? Number(v).toFixed(dec) : String(Math.round(Number(v))); if (numPat.includes('#') && dec) t = t.replace(/\.?0+$/, ''); if (thousands) t = t.replace(/\B(?=(\d{3})+(?!\d))/g, ','); return prefix + t + suffix; }; }
function shapeBars(slide, o) { // bars as rectangles: Morph grows them from the start-state slide; numbers stay editable text
  const n = o.values.length, hl = new Set(o.highlight || [n - 1]), P = !!o._pre, f = fmtFromCode(o.formatCode); const max = o.max || Math.max(...o.values) * 1.12;
  if (o.dir === 'bar') { const labW = o.labW || Math.min(4.4, o.w * 0.36), x0 = o.x + labW, plotW = o.w - labW - 1.4, rowH = o.h / n, bh = Math.min(rowH * 0.62, 0.9);
    line(slide, x0, o.y, x0, o.y + o.h, { color: C.G2, width: 0.75 });
    o.values.forEach((v, i) => { const y = o.y + i * rowH + (rowH - bh) / 2, w = P ? 0.03 : Math.max(0.03, (plotW * v) / max);
      txt(slide, o.categories[i], { x: o.x, y: y - 0.15, w: labW - 0.15, h: bh + 0.3, fontFace: F.m, fontSize: o.catSize || 14, align: 'right', valign: 'middle' });
      rect(slide, x0, y, w, bh, { fill: hl.has(i) ? C.Y : C.G1 });
      txt(slide, f(v), { x: x0 + w + 0.1, y: y - 0.15, w: 2.4, h: bh + 0.3, fontFace: F.d, fontSize: P ? 8 : (o.valueSize || 26), valign: 'middle' }); });
  } else { const bottom = o.y + o.h - 0.6, colW = o.w / n, bw = colW * 0.6, plotH = o.h - 1.5;
    line(slide, o.x, bottom, o.x + o.w, bottom, { color: C.G2, width: 0.75 });
    o.values.forEach((v, i) => { const x = o.x + i * colW + (colW - bw) / 2, h = P ? 0.03 : Math.max(0.03, (plotH * v) / max);
      rect(slide, x, bottom - h, bw, h, { fill: hl.has(i) ? C.Y : C.G1 });
      txt(slide, f(v), { x: x - 0.5, y: bottom - h - 1.0, w: bw + 1.0, h: 0.95, fontFace: F.d, fontSize: P ? 8 : (o.valueSize || 44), align: 'center', valign: 'bottom' });
      txt(slide, o.categories[i], { x: o.x + i * colW, y: bottom + 0.08, w: colW, h: 0.5, fontFace: F.m, fontSize: o.catSize || 14, align: 'center', valign: 'top' }); }); }
}
function bar(slide, o) {
  if (morphOn && o.shapes !== false) return shapeBars(slide, o);
  const n = o.values.length; const hl = new Set(o.highlight || [n - 1]);
  const colors = Array.from({ length: n }, (_, i) => (hl.has(i) ? C.Y : C.G1));
  slide.addChart(pres.ChartType.bar, [{ name: o.name || 'Series', labels: o.categories.map(String), values: o.values }], {
    x: o.x, y: o.y, w: o.w, h: o.h, objectName: animName(`${o.dir === 'bar' ? 'hbar' : 'bar'}${n}`), barDir: o.dir === 'bar' ? 'bar' : 'col', chartColors: colors, barGapWidthPct: o.gap ?? 45,
    showLegend: false, showTitle: false, showValue: true, dataLabelPosition: 'outEnd', dataLabelFontFace: F.d, dataLabelFontSize: o.valueSize || 66, dataLabelColor: C.W, dataLabelFormatCode: o.formatCode || 'General',
    catAxisLabelFontFace: F.m, catAxisLabelFontSize: o.catSize || 24, catAxisLabelColor: C.W, catAxisLineShow: true, catAxisLineColor: C.G2, catGridLine: { style: 'none' },
    valAxisHidden: true, valGridLine: { style: 'none' }, valAxisMaxVal: o.max, valAxisMinVal: 0, catAxisOrientation: o.dir === 'bar' ? 'maxMin' : 'minMax', plotArea: { fill: { color: C.BG, transparency: 100 } }, chartArea: { fill: { color: C.BG, transparency: 100 }, roundedCorners: false },
  });
  chartLog.push({ explode: 0, n });
}
// ---------- the archetypes ----------
const A = {};
A.cover = async (s, o) => { // date tag + 2-line title, optional photo top-right with fade
  if (o.image) await photo(s, o.image, { x: 4.36, y: 1.06, w: 7.82, h: 5.39, dim: o.dim ?? 55, fade: 'left' });
  txt(s, `[${o.date}]`, { x: 0.07, y: 3.6, w: 6, h: 0.58, fontFace: F.m, fontSize: 28, valign: 'bottom' });
  txt(s, o.title, { x: 0.07, y: 4.3, w: 11.5, h: 3.05, fontFace: F.d, fontSize: o.size || 115, valign: 'top' });
};
A.chapter = async (s, o) => { // full-bleed photo/video + 166pt title bottom-left
  if (o.video) { const v = asset(o.video), pp = o.poster ? asset(o.poster) : null; const cover = pp && fs.existsSync(pp) ? 'data:image/png;base64,' + fs.readFileSync(pp).toString('base64') : undefined; if (v) s.addMedia({ type: 'video', path: v, x: 0, y: 0, w: W, h: H, cover }); }
  else if (o.image) await photo(s, o.image, { dim: o.dim ?? 40, fade: 'right' });
  const subLen = o.sub ? String(o.sub).length : 0, subH = subLen > 58 ? 0.95 : subLen ? 0.5 : 0; // a 2-line sub needs its own band; the title stops above it
  const bottom = 7.3 - subH;
  if (o.title) txt(s, o.title, { x: 0.07, y: o.y ?? 2.9, w: o.w ?? 9, h: (o.y != null ? bottom - o.y : bottom - 2.9), fontFace: F.d, fontSize: o.size || 166, valign: o.y != null ? 'top' : 'bottom' });
  if (o.sub) txt(s, o.sub, { x: 0.07, y: 7.3 - subH, w: 11.5, h: subH, fontFace: F.m, fontSize: subLen > 58 ? 16 : 20, valign: 'bottom' });
};
A.statement = A.chapter; // same frame without media: section titles like "Target segment economics 2030"
A['stat-bubble'] = async (s, o) => { // one big circle with year + value over a map/photo
  if (o.image) await photo(s, o.image, { dim: o.dim ?? 55 });
  const P = !!o._pre, cx = o.cx ?? 5.8, cy = o.cy ?? 4.04, D = o.d ?? 5.36, d = P ? 0.9 : D;
  circle(s, cx, cy, d, { fill: o.variant === 'dark' ? C.BG : C.G1, line: o.variant === 'dark' ? C.W : undefined, lineW: 0.75 });
  txt(s, o.year, { x: cx - 1.5, y: cy - D * 0.42, w: 3, h: 0.7, fontFace: F.m, fontSize: P ? 8 : 40, align: 'center', valign: 'middle' });
  txt(s, o.value, { x: cx - D * 0.6, y: cy - D * 0.22, w: D * 1.2, h: D * 0.5, fontFace: F.d, fontSize: P ? 24 : (o.size || 138), color: o.variant === 'dark' ? C.Y : C.W, align: 'center', valign: 'middle' });
  if (o.side) txt(s, o.side, { x: cx + d / 2 + 0.4, y: cy - 1.4, w: 5.2, h: 2.8, fontFace: F.d, fontSize: 88, valign: 'middle' });
};
A['before-after'] = async (s, o) => { // grey circle → arrows → black ringed circle with the yellow target
  const a = o.from, b = o.to, P = !!o._pre; reveal(1, () => { circle(s, 2.09, 4.49, 3.64, { fill: C.G1 });
  txt(s, a.year, { x: 0.57, y: 3.11, w: 3.04, h: 0.8, fontFace: F.m, fontSize: 32, align: 'center', valign: 'middle' });
  txt(s, a.value, { x: 0.1, y: 3.6, w: 4.0, h: 1.8, fontFace: F.d, fontSize: 96, align: 'center', valign: 'middle' }); });
  reveal(2, () => { for (let i = 0; i < 5; i++) line(s, 4.01, 3.56 + i * 0.45, P ? 4.08 : 6.96, 3.56 + i * 0.45, { width: 3, arrow: true }); });
  animGroup = 3; circle(s, 9.71, 4.17, P ? 0.8 : 5.16, { fill: C.BG, line: C.W, lineW: 0.75 });
  const zx = 2.09 + 1.82 * 0.55; line(s, zx, 4.49 - 1.82 * 0.84, P ? zx + 0.05 : 9.71 - 2.58 * 0.35, P ? 4.49 - 1.82 * 0.84 : 4.17 - 2.58 * 0.94, { width: 0.5 });
  line(s, zx, 4.49 + 1.82 * 0.84, P ? zx + 0.05 : 9.71 - 2.58 * 0.35, P ? 4.49 + 1.82 * 0.84 : 4.17 + 2.58 * 0.94, { width: 0.5 });
  txt(s, b.year, { x: 8.19, y: 1.69, w: 3.04, h: 1.0, fontFace: F.m, fontSize: P ? 10 : 48, align: 'center', valign: 'middle' });
  txt(s, b.value, { x: 7.0, y: 2.9, w: 5.4, h: 2.6, fontFace: F.d, fontSize: P ? 24 : 166, color: C.Y, align: 'center', valign: 'middle' }); animGroup = 0;
  unit(s, o.unit);
};
function statCards(s, o) { // 2–4 cards across: number on top, label under, grey sub; one card per click
  title(s, o.title); const rows = o.rows.slice(0, 4), n = rows.length, gap = 0.35, cw = (12.0 - gap * (n - 1)) / n;
  rows.forEach((r, i) => reveal(i + 1, () => { const x = 0.3 + i * (cw + gap);
    txt(s, r.value, { x, y: 1.3, w: cw, h: 1.7, fontFace: F.d, fontSize: n <= 3 ? 110 : 84, color: C.Y, valign: 'bottom' });
    txt(s, r.label, { x, y: 3.15, w: cw - 0.2, h: 1.7, fontFace: F.t, fontSize: (r.label || '').length > 55 ? 20 : n <= 3 ? 26 : 22, valign: 'top' });
    if (r.sub) txt(s, r.sub, { x, y: 4.9, w: cw - 0.2, h: 2.2, fontFace: F.t, fontSize: 16, color: C.G1, valign: 'top' });
    if (i < n - 1) line(s, x + cw + gap / 2, 1.3, x + cw + gap / 2, 7.1, { width: 0.5 }); }));
}
A['stat-list'] = async (s, o) => { // layouts: rows (default) | photo (rows + photo on the right third) | bigrows | cards
  if (o.layout === 'cards') return statCards(s, o);
  const withPhoto = o.layout === 'photo' && o.image; if (withPhoto) await photo(s, o.image, { x: 7.9, y: 0, w: 5.43, h: H, dim: o.dim ?? 45, fade: 'left' });
  const RE = withPhoto ? 8.1 : RULE_X; const big = o.layout === 'bigrows';
  if (o.badge) { circle(s, 1.8, 2.59, 2.99, { fill: C.BG, line: C.W, lineW: 0.75 }); txt(s, o.badge.year, { x: 0.74, y: 1.25, w: 2.15, h: 0.95, fontFace: F.m, fontSize: 32, align: 'center', valign: 'middle' }); txt(s, o.badge.value, { x: 0.13, y: 2.01, w: 3.35, h: 1.57, fontFace: F.d, fontSize: 88, align: 'center', valign: 'middle' }); }
  const rows = o.rows.slice(0, 6); const top = 1.0, bottom = o.sowhat ? 6.6 : 7.2, rh = (bottom - top) / rows.length; const x0 = o.badge ? 4.09 : 0.4, vw = withPhoto ? Math.min(o.valueW || 2.0, 2.2) : (o.valueW || (rows.length > 3 ? 2.4 : 3.0));
  const hasSub = rows.some((r) => r.sub); const vs = o.size || (withPhoto ? (rows.length > 3 ? 48 : 60) : big ? 100 : rows.length > 4 ? 60 : rows.length > 3 ? 72 : 100), ls = o.labelSize || (withPhoto ? (hasSub ? 20 : 24) : big ? 30 : hasSub ? (rows.length > 3 ? 22 : 30) : rows.length > 4 ? 24 : rows.length > 3 ? 28 : 44);
  rows.forEach((r, i) => reveal(i + 1, () => { const y = top + i * rh;
    txt(s, r.value, { x: x0, y, w: vw, h: rh, fontFace: F.d, fontSize: vs, color: C.Y, valign: 'middle' });
    const lab = runs(r.label, { fontFace: F.t, fontSize: ls, color: C.W }); // label + grey sub flow in ONE box so a wrapped label never overlaps the sub
    if (r.sub) { lab[lab.length - 1].options.breakLine = true; lab.push(...runs(r.sub, { fontFace: F.t, fontSize: Math.max(14, ls * 0.62), color: C.G1 })); }
    s.addText(lab, { x: x0 + vw + 0.2, y, w: RE - (x0 + vw + 0.2) - 0.2, h: rh, margin: 0, isTextBox: true, valign: 'middle', paraSpaceAfter: 0, objectName: animName('text') });
    if (i < rows.length - 1) line(s, o.badge ? 3.73 : 0.3, y + rh, RE, y + rh, { width: 0.5 }); }));
  if (o.title) title(s, o.title);
};
A.bar = async (s, o) => { // title + native column/bar chart with the highlighted bar in yellow, optional icon row
  if (o.image) await photo(s, o.image, { dim: o.dim ?? 70 });
  title(s, o.title); const icons = o.icons && o.icons.length ? 1.0 : 0;
  reveal(1, () => bar(s, { ...o, x: 0.41, y: 0.94, w: 11.3, h: 6.2 - icons - (o.sowhat ? 0.6 : 0) }));
  if (icons) { const n = o.icons.length, pw = 11.3 / n; o.icons.forEach((ic, i) => image(s, ic, { x: 0.41 + pw * i + pw / 2 - 0.45, y: 6.2, w: 0.9, h: 0.9, sizing: 'contain' })); }
  if (o.frame != null) { const n = o.values.length, pw = 11.3 / n; rect(s, 0.41 + pw * o.frame + 0.15, 1.2, pw - 0.3, 6.0, { line: 'C00000', lineW: 1.5, dash: 'dash' }); }
};
A['hero-number'] = async (s, o) => { // one giant number over a pictogram wall (or photo)
  if (o.image) await photo(s, o.image, { dim: o.dim ?? 55 });
  if (o.pictograms !== false && sharp) { const f = await pictogramWall(o.cols || 20, o.rows || 4, o.pictoColor || C.G4); s.addImage({ path: f, x: 0.3, y: 0.9, w: 12.1, h: 6.3 }); }
  txt(s, o.value, { x: o.x ?? 0.27, y: o.y ?? 2.6, w: 11.5, h: 4.6, fontFace: F.d, fontSize: o._pre ? 60 : (o.size || 287), color: o.color || C.Y, valign: 'middle' }); // morph scales the number up
  if (o.label) txt(s, o.label, { x: 0.3, y: 6.5, w: 11, h: 0.7, fontFace: F.t, fontSize: 28 });
};
A['pie-hero'] = async (s, o) => { // 2-slice pie (grey + yellow sliver) with the value inside, statement text right
  if (o.image) await photo(s, o.image, { x: 5.28, y: 0, w: 8.05, h: H, dim: o.dim ?? 40, fade: 'left' });
  const share = o.share; pie(s, { x: 0.9, y: 1.1, w: 5.4, h: 5.4, values: [1 - share, share], labels: ['', ''], colors: [C.G1, C.Y], explode: o.explode ?? 2, border: 0, catLabels: false, valueLabels: false });
  txt(s, o.value, { x: 0.9, y: 2.7, w: 5.4, h: 2.4, fontFace: F.d, fontSize: 150, color: C.K, align: 'center', valign: 'middle' });
  txt(s, `${Math.round(share * 100)}%`, { x: 3.6, y: 1.75, w: 2.4, h: 0.8, fontFace: F.d, fontSize: 44, color: C.W, align: 'center', valign: 'middle' });
  if (o.label) txt(s, o.label, { x: 7.17, y: 1.79, w: 5.3, h: 2.9, fontFace: F.d, fontSize: 88, valign: 'top' });
};
A.pie = async (s, o) => { // title + badge + labelled pie (highlight = first N slices yellow), optional image right
  title(s, o.title); badge(s, o.badge);
  if (o.image) image(s, o.image, { x: 8.75, y: 1.5, w: 3.6, h: 2.2, sizing: 'contain' });
  (o.icons || []).forEach((ic) => image(s, ic.src, { x: ic.x, y: ic.y, w: ic.w || 1.2, h: ic.h || 1.2, sizing: 'contain' }));
  reveal(1, () => pie(s, { x: o.x ?? 2.9, y: o.y ?? 1.25, w: o.w ?? 5.6, h: o.h ?? 5.6, labels: o.labels, values: o.values, highlight: o.highlight ?? 1, explode: o.explode ?? 0, format: o.format, labelSize: o.labelSize, valueSize: o.valueSize, ring: o.ring, labelRadius: o.labelRadius }));
  unit(s, o.unit);
};
A['pie-callout'] = async (s, o) => { // 2-slice pie with the highlighted slice exploded + yellow callout ellipse (heading + lines)
  if (o.image) await photo(s, o.image, { x: 7.31, y: 0, w: 6.03, h: H, dim: o.dim ?? 45, fade: 'left' });
  title(s, o.title);
  const big = o.callout && o.callout.length; const px = big ? 0.5 : 2.43, pd = big ? 4.0 : 5.4, py = big ? 1.0 : 1.0;
  pie(s, { x: px, y: py, w: pd, h: pd, labels: o.labels, values: o.values, highlight: o.highlight ?? 1, explode: o.explode ?? 8, format: o.format || '{v}', labelSize: big ? 18 : 28, valueSize: big ? 24 : 40, catLabels: o.catLabels !== false });
  if (big) { const P = !!o._pre, ex = 5.6, ey = 2.3, ew = 6.6, eh = 2.7; s.addShape(pres.ShapeType.ellipse, P ? { x: ex + ew / 2 - 0.2, y: ey + eh / 2 - 0.2, w: 0.4, h: 0.4, fill: { color: C.Y }, line: { type: 'none' }, objectName: animName('callout') } : { x: ex, y: ey, w: ew, h: eh, fill: { color: C.Y }, line: { type: 'none' }, objectName: animName('callout') });
    line(s, px + pd * 0.93, py + pd * 0.3, ex + 0.35, ey + eh * 0.32, { width: 0.5 }); line(s, px + pd * 0.93, py + pd * 0.7, ex + 0.35, ey + eh * 0.68, { width: 0.5 });
    txt(s, o.callout[0], { x: ex + 0.5, y: ey + 0.35, w: ew - 1, h: 0.85, fontFace: F.d, fontSize: P ? 6 : 48, color: C.K, align: 'center', valign: 'middle' });
    txt(s, o.callout.slice(1), { x: ex + 0.5, y: ey + 1.2, w: ew - 1, h: eh - 1.4, fontFace: F.t, fontSize: P ? 5 : 24, color: C.K, align: 'center', valign: 'top' }); }
  unit(s, o.unit);
};
A['segment-divider'] = async (s, o) => { // photo right, 96pt title left with yellow lines, small grey stat bubble
  if (o.image) await photo(s, o.image, { x: 7.31, y: 0, w: 6.03, h: H, dim: o.dim ?? 40, fade: 'left' });
  txt(s, o.title, { x: 0.07, y: 1.0, w: 6.3, h: 6.2, fontFace: F.d, fontSize: o.size || 96, valign: 'top' });
  if (o.stats) { const cx = 7.98, cy = 4.15, d = 2.6; circle(s, cx, cy, d, { fill: C.G2 }); txt(s, o.stats[0], { x: cx - d / 2, y: cy - 1.0, w: d, h: 0.6, fontFace: F.d, fontSize: 28, color: C.Y, align: 'center', valign: 'middle' }); txt(s, o.stats.slice(1), { x: cx - d / 2 + 0.2, y: cy - 0.35, w: d - 0.4, h: 1.3, fontFace: F.t, fontSize: 15, color: C.W, align: 'center', valign: 'top' }); }
};
A.quote = async (s, o) => { // one brand, one quote: chip + big Plaak quote + proof + who it speaks to; optional photo right
  if (o.image) await photo(s, o.image, { x: 7.9, y: 0, w: 5.43, h: H, dim: o.dim ?? 45, fade: 'left' });
  title(s, o.title); const W2 = o.image ? 7.4 : RULE_X - 0.6; const q = String(o.quote || ''); const qs = o.size || (q.length > 130 ? 36 : q.length > 90 ? 44 : 56);
  rect(s, 0.3, 1.05, Math.min(5, 0.35 + String(o.brand || '').length * 0.17), 0.55, { fill: o.highlight ? C.Y : C.G3 }); txt(s, o.brand, { x: 0.45, y: 1.05, w: 4.8, h: 0.55, fontFace: F.d, fontSize: 22, color: o.highlight ? C.K : C.W, valign: 'middle' });
  reveal(1, () => txt(s, `“${q}”`, { x: 0.3, y: 1.85, w: W2, h: 3.3, fontFace: F.d, fontSize: qs, valign: 'top' }));
  if (o.proof) reveal(2, () => { txt(s, 'PROOF OFFERED', { x: 0.3, y: 5.3, w: 3, h: 0.35, fontFace: F.m, fontSize: 12, color: C.G1 }); txt(s, o.proof, { x: 0.3, y: 5.62, w: W2, h: 0.75, fontFace: F.t, fontSize: 22, valign: 'top' }); });
  if (o.speaks) reveal(3, () => { txt(s, 'SPEAKS TO', { x: 0.3, y: 6.45, w: 3, h: 0.35, fontFace: F.m, fontSize: 12, color: C.G1 }); txt(s, o.speaks, { x: 0.3, y: 6.77, w: W2, h: 0.5, fontFace: F.t, fontSize: 22, valign: 'top' }); });
};
A.versus = async (s, o) => { // two circles side by side: left = the comparison (grey), right = the subject (ringed, yellow value); optional sub text
  title(s, o.title); const P = !!o._pre, D = o.d || 4.3, cy = 4.15;
  const ratio = o.areaTrue && o.left.n && o.right.n ? Math.sqrt(o.right.n / o.left.n) : 1; // area-true: the subject's circle area is proportional to its number
  const draw = (c, cx, subject) => { const Dc = subject ? Math.max(0.3, D * ratio) : D; const d = P ? Math.min(0.9, Dc) : Dc; const dot = subject && Dc < 1.6;
    circle(s, cx, cy, d, subject ? { fill: dot ? C.Y : C.BG, line: C.W, lineW: 0.75 } : { fill: C.G1 });
    if (dot) { txt(s, c.value, { x: cx + Dc / 2 + 0.25, y: cy - 0.9, w: 3.2, h: 1.8, fontFace: F.d, fontSize: P ? 20 : (c.size || 110), color: C.Y, valign: 'middle' }); txt(s, c.label, { x: cx - D / 2 - 0.2, y: cy - D * 0.46, w: D + 0.4, h: 0.9, fontFace: F.m, fontSize: P ? 6 : 18, align: 'center', valign: 'middle' }); if (c.sub) txt(s, c.sub, { x: cx - D / 2 - 0.3, y: cy + D * 0.2, w: D + 0.6, h: 0.7, fontFace: F.t, fontSize: P ? 6 : 16, align: 'center', valign: 'middle' }); return; }
    txt(s, c.label, { x: cx - D / 2 - 0.2, y: cy - D * 0.46, w: D + 0.4, h: 0.9, fontFace: F.m, fontSize: P ? 6 : c.label.length > 14 ? 18 : 24, align: 'center', valign: 'middle', color: subject ? C.W : C.K });
    txt(s, c.value, { x: cx - D * 0.6, y: cy - D * 0.25, w: D * 1.2, h: D * 0.5, fontFace: F.d, fontSize: P ? 20 : (c.size || 110), color: subject ? C.Y : C.W, align: 'center', valign: 'middle' });
    if (c.sub) txt(s, c.sub, { x: cx - D / 2 - 0.3, y: cy + D * 0.2, w: D + 0.6, h: 0.7, fontFace: F.t, fontSize: P ? 6 : 16, align: 'center', valign: 'middle', color: subject ? C.W : C.K }); };
  draw(o.left, 3.3, false); draw(o.right, 9.3, true); // morph grows both circles; no click groups on morph slides
  txt(s, o.vs || 'vs', { x: 5.7, y: cy - 0.5, w: 1.2, h: 1.0, fontFace: F.m, fontSize: 28, align: 'center', valign: 'middle', color: C.G2 });
  if (o.note && !P) txt(s, o.note, { x: 0.4, y: 6.6, w: RULE_X - 0.8, h: 0.7, fontFace: F.t, fontSize: 22, valign: 'middle' });
};
A['segment-strip'] = async (s, o) => { // N portrait panels side by side + labels under them
  const n = o.panels.length, gap = 0.08, pw = (12.45 - gap * (n - 1)) / n;
  o.panels.forEach((p, i) => { const x = 0.03 + i * (pw + gap); if (p.image) { const f = asset(p.image); if (f) s.addImage({ path: f, x, y: 0.83, w: pw, h: 5.5, sizing: { type: 'cover', w: pw, h: 5.5 } }); }
    txt(s, p.label, { x: x + 0.08, y: 6.38, w: pw - 0.16, h: 0.95, fontFace: F.d, fontSize: 24, valign: 'top' }); });
};
A['score-grid'] = async (s, o) => { // attractiveness index: photo thumbs, criteria columns, score cells, highlighted rows
  const cols = o.columns, nc = cols.length, x0 = 1.75, cw = 1.36, rows = o.rows, rh = 0.94, y0 = 2.1;
  cols.forEach((c, i) => txt(s, c, { x: x0 + i * cw - 0.2, y: 1.2, w: cw + 0.1, h: 0.7, fontFace: F.d, fontSize: 28, align: 'center', valign: 'bottom' }));
  txt(s, o.scoreLabel || 'score', { x: x0 + nc * cw - 0.1, y: 1.2, w: 1.5, h: 0.7, fontFace: F.d, fontSize: 40, color: C.Y, align: 'center', valign: 'bottom' });
  if (o.weights) { txt(s, 'WEIGHT', { x: 0.2, y: 1.95, w: 1.4, h: 0.3, fontFace: F.m, fontSize: 14, color: C.G1, valign: 'middle' }); o.weights.forEach((w, i) => txt(s, String(w), { x: x0 + i * cw, y: 1.95, w: cw - 0.46, h: 0.3, fontFace: F.m, fontSize: 14, color: C.G1, align: 'center', valign: 'middle' })); }
  const gy = o.weights ? y0 + 0.2 : y0;
  rows.forEach((r, ri) => reveal(ri + 1, () => { const y = gy + ri * rh;
    if (r.image) { const f = asset(r.image); if (f) s.addImage({ path: f, x: 0.3, y: y + 0.05, w: 1.3, h: rh - 0.12, sizing: { type: 'cover', w: 1.3, h: rh - 0.12 } }); }
    cols.forEach((c, ci) => { const v = r.scores && r.scores[ci]; const cx = x0 + ci * cw;
      if (v == null) rect(s, cx, y + 0.08, 0.9, 0.78, { line: C.GRID, lineW: 2.5 });
      else txt(s, String(v), { x: cx, y: y + 0.08, w: 0.9, h: 0.78, fontFace: F.d, fontSize: 36, align: 'center', valign: 'middle' }); });
    if (r.score != null) txt(s, String(r.score), { x: x0 + nc * cw - 0.1, y: y + 0.08, w: 1.5, h: 0.78, fontFace: F.d, fontSize: 40, color: C.Y, align: 'center', valign: 'middle' });
    if (r.highlight) rect(s, x0 - 0.12, y + 0.02, nc * cw + 1.45, rh - 0.04, { line: C.Y, lineW: 1.25, dash: 'dash' }); }));
  if (o.lines !== false) { line(s, x0 - 0.04, gy - 0.1, x0 - 0.04, gy + rows.length * rh, { width: 0.5 }); line(s, x0 + nc * cw - 0.15, gy - 0.1, x0 + nc * cw - 0.15, gy + rows.length * rh, { width: 0.5 }); line(s, x0 - 0.04, gy - 0.1, x0 + nc * cw + 1.4, gy - 0.1, { width: 0.5 }); }
};
A.table = async (s, o) => { // label chips + value columns (Riforma for $, Plaak yellow for %), photo right with fade
  if (o.image) await photo(s, o.image, { x: 7.31, y: 0, w: 6.03, h: H, dim: o.dim ?? 45, fade: 'left' });
  title(s, o.title);
  const rows = o.rows, nr = rows.length, y0 = 1.35, bottom = o.footer ? 6.1 : o.sowhat ? 6.6 : 7.3, rh = (bottom - y0) / nr, chipW = o.chipW || 5.2; const RIGHT = o.right || (o.image ? 7.7 : RULE_X);
  const nv = rows[0].length - 1; const step = (RIGHT - chipW - 1.0) / nv; const colX = o.colX || Array.from({ length: nv }, (_, i) => chipW + 0.8 + i * step); const cw = o.colW || Math.max(1.2, step - 0.15); const cws = o.colWs || []; const cwAt = (i) => cws[i] || cw;
  (o.columns || []).forEach((c, i) => txt(s, c, { x: colX[i], y: 0.85, w: cwAt(i), h: 0.5, fontFace: F.d, fontSize: 22, align: 'left', valign: 'bottom' }));
  rows.forEach((r, ri) => reveal(ri + 1, () => { const y = y0 + ri * rh; const chip = o.chip || 'dark';
    const hl = o.highlightRows && o.highlightRows.includes(ri); rect(s, 0.19, y + 0.04, chipW, rh - 0.1, { fill: hl ? C.Y : chip === 'white' ? C.W : C.G3 });
    txt(s, r[0], { x: 0.32, y: y + 0.04, w: chipW - 0.2, h: rh - 0.1, fontFace: chip === 'white' ? F.t : F.d, fontSize: o.chipSize || (chip === 'white' ? 20 : 24), color: hl || chip === 'white' ? C.K : C.W, valign: 'middle' });
    r.slice(1).forEach((v, vi) => { const str = String(v); const pct = /%/.test(str) && str.length <= 16; const last = o.totalColumn && vi === nv - 1; // short % values → Plaak yellow; sentences stay Riforma
      txt(s, str, { x: colX[vi], y: y + 0.04, w: cwAt(vi), h: rh - 0.1, fontFace: pct || (o.displayCols || []).includes(vi) ? F.d : F.t, fontSize: o.valueSize || 32, color: pct || last ? C.Y : C.W, valign: 'middle' }); }); }));
  if (o.footer) { const y = bottom + 0.15; rect(s, 0.19, y, chipW, 0.68, { fill: C.W }); txt(s, o.footer[0], { x: 0.32, y, w: chipW - 0.2, h: 0.68, fontFace: F.t, fontSize: 20, color: C.K, valign: 'middle' });
    rect(s, colX[0] - 0.2, y, RULE_X - colX[0] - 0.3, 0.68, { fill: C.Y }); o.footer.slice(1).forEach((v, vi) => txt(s, String(v), { x: colX[vi], y, w: vi === nv - 1 ? RULE_X - 0.55 - colX[vi] : 2.2, h: 0.68, fontFace: F.d, fontSize: 32, color: C.K, valign: 'middle', align: vi === nv - 1 ? 'right' : 'left' })); }
};
A['list-3'] = async (s, o) => { // photo left + up to 3 headed bullet sections separated by hairlines (pains / needs / gains)
  title(s, o.title); if (o.image) { const f = asset(o.image); if (f) s.addImage({ path: f, x: 0.28, y: 0.89, w: 3.71, h: 6.36, sizing: { type: 'cover', w: 3.71, h: 6.36 } }); }
  const secs = o.sections, top = 0.81, bottom = o.sowhat ? 6.65 : 7.35, sh = (bottom - top) / secs.length, x = o.image ? 4.24 : 0.3, w = RULE_X - x - 0.2;
  secs.forEach((sec, i) => reveal(i + 1, () => { const y = top + i * sh;
    txt(s, sec.head, { x, y, w: 4, h: 0.75, fontFace: F.d, fontSize: 40, color: C.Y, valign: 'middle' });
    s.addText(sec.items.map((it, j) => ({ text: it, options: { bullet: true, breakLine: j < sec.items.length - 1, fontFace: F.t, fontSize: o.itemSize || 22, color: C.W, paraSpaceAfter: 4 } })), { x, y: y + 0.78, w, h: sh - 0.9, margin: 0, isTextBox: true, valign: 'top', objectName: animName('text') });
    if (i < secs.length - 1) line(s, x, y + sh - 0.06, RULE_X, y + sh - 0.06, { width: 0.5 }); }));
};
A['claim-bars'] = async (s, o) => { // "how many competitors claim": solid grey = claimed %, dashed yellow = the white space
  title(s, o.title); const P = !!o._pre, rows = o.rows, n = rows.length, top = 0.95, rh = n >= 3 ? 2.15 : 2.4, x0 = 0.39, bw = RULE_X - 0.9;
  rows.forEach((r, i) => { const y = top + i * rh; const c = P ? 0.004 : Math.max(0.02, Math.min(0.98, r.claimed / 100)); const cw2 = P ? 0.004 : 1 - c;
    txt(s, r.label, { x: x0 - 0.1, y, w: 1.9, h: 0.77, fontFace: F.d, fontSize: 40, color: C.Y, valign: 'middle' });
    txt(s, r.text, { x: x0 + 1.2, y: y + 0.18, w: bw - 1.2, h: 0.5, fontFace: F.t, fontSize: 24, valign: 'middle' });
    rect(s, x0, y + 0.85, bw * c, 0.97, { fill: C.G3 }); rect(s, x0 + bw * c, y + 0.85, bw * cw2, 0.97, { fill: C.G3, line: C.Y, lineW: 2, dash: 'dash' });
    txt(s, `${r.claimed}%`, { x: x0 + bw * c - 1.6, y: y + 0.85, w: 1.45, h: 0.97, fontFace: F.d, fontSize: P ? 8 : 40, align: 'right', valign: 'middle' });
    txt(s, `${100 - r.claimed}%`, { x: x0 + bw * (P ? 0.008 : 1) - 1.6, y: y + 0.85, w: 1.45, h: 0.97, fontFace: F.d, fontSize: P ? 8 : 40, color: C.Y, align: 'right', valign: 'middle' }); });
  if (o.note && !P) (txt(s, o.note, { x: 0.39, y: top + n * rh + 0.1, w: RULE_X - 0.8, h: 7.3 - (top + n * rh + 0.1), fontFace: F.t, fontSize: 24, valign: 'top', paraSpaceAfter: 10 }));
};
A.custom = async (s, o) => { // escape hatch: raw element list for anything the archetypes do not cover
  for (const e of o.elements || []) { if (e.text != null && e.font === 'display' && (e.y ?? 9) < 0.5) title(s, e.text); else if (e.text != null) txt(s, e.text, { ...e, fontFace: e.font === 'display' ? F.d : e.font === 'mono' ? F.m : F.t }); /* a display line in the title band gets the title treatment */ else if (e.circle) circle(s, e.cx, e.cy, e.d, e); else if (e.line) line(s, e.x1, e.y1, e.x2, e.y2, e); else if (e.rect) rect(s, e.x, e.y, e.w, e.h, e); else if (e.image) image(s, e.image, e); else if (e.pie) reveal(e.click || 1, () => pie(s, e)); else if (e.bar) reveal(e.click || 1, () => bar(s, { ...e, _pre: o._pre })); }
};
A.svg = async (s, o) => { // an infographic authored as SVG (HyperFrames snapshot, hand-written SVG): rasterised at 3x and placed
  title(s, o.title); const f = asset(o.src); if (!f) { warn.push('svg missing ' + o.src); return; }
  const png = path.join(CACHE, path.basename(f, '.svg') + '.png'); if (sharp && (!fs.existsSync(png) || fs.statSync(f).mtimeMs > fs.statSync(png).mtimeMs)) await sharp(f, { density: 288 }).png().toFile(png);
  s.addImage({ path: fs.existsSync(png) ? png : f, x: o.x ?? 0.3, y: o.y ?? 0.95, w: o.w ?? 12.0, h: o.h ?? 6.3, sizing: { type: 'contain', w: o.w ?? 12.0, h: o.h ?? 6.3 } });
};

// ---------- build ----------
const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE'; pres.title = (deck.meta && deck.meta.title) || 'Deck'; pres.author = (deck.meta && deck.meta.author) || 'Fast Track';
pres.theme = { headFontFace: F.d, bodyFontFace: F.t };
const logo = fs.existsSync(path.join(SKILL, 'assets', 'logo-f.png')) ? path.join(SKILL, 'assets', 'logo-f.png') : null;
pres.defineSlideMaster({ title: 'FT', background: { color: C.BG }, objects: [
  { line: { x: 0, y: RULE_Y, w: RULE_X, h: 0, line: HAIR } }, { line: { x: RULE_X, y: 0, w: 0, h: H, line: HAIR } },
  ...(logo ? [{ image: { x: 12.79, y: 0.17, w: 0.37, h: 0.42, path: logo } }] : []),
  ...(deck.meta && deck.meta.tag ? [{ text: { text: deck.meta.tag, options: { x: 11.36, y: 4.75, w: 3.2, h: 0.3, rotate: 270, fontFace: F.m, fontSize: 6, color: C.G2, align: 'center', valign: 'middle', margin: 0, wrap: false, charSpacing: 2 } } } /* wide+short box rotated 270°: wrapping happens before rotation */] : []),
] });
pres.defineSlideMaster({ title: 'FT_BARE', background: { color: C.BG }, objects: [ ...(logo ? [{ image: { x: 12.79, y: 0.17, w: 0.37, h: 0.42, path: logo } }] : []) ] });

const MORPH = new Set(['before-after', 'versus', 'stat-bubble', 'hero-number', 'claim-bars', 'pie-callout']);
const POOL = (deck.meta && deck.meta.photoPool) || []; let poolIdx = 0, prevType = '', streak = 0; const nextPhoto = () => (POOL.length ? POOL[poolIdx++ % POOL.length] : null);
function autoVary(sl) { // the reference deck never shows the same frame three times running; alternate layouts and bring a photo in
  if (deck.meta && deck.meta.autoVary === false) return;
  streak = sl.type === prevType ? streak + 1 : 0; prevType = sl.type; if (streak === 0) return;
  if (sl.type === 'stat-list' && !sl.layout) {
    const okCards = sl.rows.length <= 4 && !sl.badge && sl.rows.every((r) => (r.label || '').length < 90 && (!r.sub || r.sub.length < 170));
    const okBig = sl.rows.length <= 3 && sl.rows.every((r) => !r.sub || r.sub.length < 120);
    const pick = streak % 3 === 1 ? (okCards ? 'cards' : 'photo') : streak % 3 === 2 ? 'photo' : okBig ? 'bigrows' : 'rows';
    if (pick === 'photo') { const ph = sl.image || nextPhoto(); if (ph) { sl.image = ph; sl.layout = 'photo'; } else sl.layout = okCards ? 'cards' : 'rows'; } else sl.layout = pick; }
  if (sl.type === 'table' && !sl.image && streak % 2 === 1 && sl.rows[0].length - 1 <= 2) { const ph = nextPhoto(); if (ph) { sl.image = ph; sl.chipW = Math.min(sl.chipW || 3.0, 2.4); delete sl.colX; delete sl.colWs; sl.right = 7.7; if (sl.rows[0].length - 1 === 2) { sl.colWs = [3.3, 1.0]; sl.colX = [sl.chipW + 0.5, 7.0]; } } }
  if (sl.type === 'list-3' && !sl.image && streak >= 1) { const ph = nextPhoto(); if (ph) sl.image = ph; }
}
const morphFinal = new Set(), noTiming = new Set(); let slideNo = 0;
(async () => {
  let n = 0;
  for (const sl of deck.slides) {
    n++; const fn = A[sl.type]; if (!fn) { warn.push(`slide ${n}: unknown type ${sl.type}`); continue; }
    autoVary(sl); animOn = !(deck.meta && deck.meta.animate === false) && sl.animate !== false; animGroup = 0;
    const morphable = MORPH.has(sl.type) || ((sl.type === 'bar' || sl.type === 'custom') && sl.shapes !== false && (sl.type === 'bar' || (sl.elements || []).some((e) => e.bar)));
    const useMorph = !process.env.FT_NO_MORPH && animOn && morphable && !(deck.meta && deck.meta.morph === false) && sl.morph !== false;
    if (sl.section) pres.addSection({ title: sl.section });
    if (useMorph) { // start-state slide: same shapes, small/empty; PowerPoint Morph animates them into the final slide
      slideNo++; const pre = pres.addSlide({ masterName: sl.bare ? 'FT_BARE' : 'FT' }); morphOn = true; morphCounter = 0; await fn(pre, { ...sl, _pre: true }); noTiming.add(slideNo); }
    slideNo++; const s = pres.addSlide({ masterName: sl.bare ? 'FT_BARE' : 'FT' }); morphOn = useMorph; morphCounter = 0;
    await fn(s, sl); if (useMorph) { morphFinal.add(slideNo); noTiming.add(slideNo); }
    if (sl.source) txt(s, `SOURCE: ${sl.source}`, { x: 0.3, y: 7.17, w: 9.5, h: 0.25, fontFace: F.m, fontSize: 9, color: C.G2, valign: 'middle' });
    if (sl.sowhat) reveal(99, () => txt(s, sl.sowhat, { x: 0.3, y: 6.72, w: RULE_X - 0.6, h: 0.58, fontFace: F.t, fontSize: 22, valign: 'middle' }));
    morphOn = false;
    if (sl.notes) s.addNotes(sl.notes);
    if (sl.audio) { const a = asset(sl.audio); if (a) s.addMedia({ type: 'audio', path: a, x: 12.72, y: 6.95, w: 0.4, h: 0.4 }); else warn.push(`slide ${n}: audio missing ${sl.audio}`); }
    const wc = ['table', 'score-grid', 'list-3', 'custom'].includes(sl.type) ? 999 : 60; const rowsTxt = Array.isArray(sl.rows) ? sl.rows.map((r) => (Array.isArray(r) ? '' : (r && (r.text || r.label)) || '')) : []; const w = words([sl.title, sl.label, sl.sub, sl.note, sl.value, sl.callout, ...rowsTxt].filter(Boolean).map((v) => (Array.isArray(v) ? v.join(' ') : String(v))));
    if (w > wc) warn.push(`slide ${n} (${sl.type}): ${w} words — the system is built on < 20 words per slide; split it`);
  }
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  await pres.writeFile({ fileName: OUT });
  // post-process: pie explosion (pptxgenjs has no option for it) — chart files are numbered in creation order
  const zip = await JSZip.loadAsync(fs.readFileSync(OUT)); let touched = 0;
  for (let i = 0; i < chartLog.length; i++) { const c = chartLog[i]; if (!c.explode) continue; const name = `ppt/charts/chart${i + 1}.xml`; const f = zip.file(name); if (!f) { warn.push('chart file not found ' + name); continue; }
    let xml = await f.async('string'); xml = xml.replace(/<c:dPt>([\s\S]*?)<c:spPr>/g, (m, pre) => (pre.includes('<c:explosion') ? m : `<c:dPt>${pre}<c:explosion val="${c.explode}"/><c:spPr>`)); zip.file(name, xml); touched++; }
  // click-reveal animations: one click per anim group (fade-in 400 ms), shapes in the same group appear together
  let animated = 0; let tid = 1; const nid = () => ++tid;
  for (const name of Object.keys(zip.files)) {
    if (!/^ppt\/slides\/slide\d+\.xml$/.test(name)) continue;
    let xml = await zip.file(name).async('string'); const sn = +name.match(/slide(\d+)\.xml/)[1];
    if (morphFinal.has(sn)) { // Morph transition INTO this slide from its start-state twin (fallback: fade for old PowerPoint)
      const tr = '<mc:AlternateContent xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"><mc:Choice xmlns:p159="http://schemas.microsoft.com/office/powerpoint/2015/09/main" Requires="p159"><p:transition spd="slow" p14:dur="1200" xmlns:p14="http://schemas.microsoft.com/office/powerpoint/2010/main"><p159:morph option="byObject"/></p:transition></mc:Choice><mc:Fallback><p:transition spd="slow"><p:fade/></p:transition></mc:Fallback></mc:AlternateContent>';
      xml = xml.replace('</p:clrMapOvr>', '</p:clrMapOvr>' + tr); zip.file(name, xml); touched++; }
    if (noTiming.has(sn)) continue;
    const groups = new Map(); const isSp = new Set(); const chartOf = new Map();
    for (const m of xml.matchAll(/<p:(sp|pic|graphicFrame|cxnSp)>\s*<p:nv\w+Pr>\s*<p:cNvPr id="(\d+)" name="[^"]*?anim:(\d+):([a-z]+?)(\d*)"/g)) { const g = +m[3]; if (!groups.has(g)) groups.set(g, []); groups.get(g).push(m[2]); if (m[1] === 'sp') isSp.add(m[2]); if (!process.env.FT_NO_CHARTBUILD && m[1] === 'graphicFrame' && /^(bar|hbar|pie)$/.test(m[4]) && m[5]) chartOf.set(m[2], { kind: m[4], n: +m[5] }); }
    if (!groups.size) continue;
    tid = 2; const clicks = [...groups.keys()].sort((a, b) => a - b).map((g) => {
      const fx = (spid, k, tgt, extra) => `<p:par><p:cTn id="${nid()}" presetID="${extra ? extra.preset : 10}" presetClass="entr" presetSubtype="${extra ? extra.sub : 0}" fill="hold" grpId="0" nodeType="${extra && extra.after ? 'afterEffect' : k ? 'withEffect' : 'clickEffect'}"><p:stCondLst><p:cond delay="0"/></p:stCondLst><p:childTnLst><p:set><p:cBhvr><p:cTn id="${nid()}" dur="1" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst></p:cTn><p:tgtEl>${tgt}</p:tgtEl><p:attrNameLst><p:attrName>style.visibility</p:attrName></p:attrNameLst></p:cBhvr><p:to><p:strVal val="visible"/></p:to></p:set><p:animEffect transition="in" filter="${extra ? extra.filter : 'fade'}"><p:cBhvr><p:cTn id="${nid()}" dur="${extra ? 350 : 400}"/><p:tgtEl>${tgt}</p:tgtEl></p:cBhvr></p:animEffect></p:childTnLst></p:cTn></p:par>`;
      const CB = process.env.FT_CB || 'whole'; const chartTgt = (spid, c) => (CB === 'whole' ? `<p:spTgt spid="${spid}"/>` : `<p:spTgt spid="${spid}"><p:graphicEl><p:chart seriesIdx="-1" categoryIdx="${c}" type="category"/></p:graphicEl></p:spTgt>`);
      const kindFx = (kind) => (kind === 'pie' ? { preset: 21, sub: 1, filter: 'wheel(1)' } : kind === 'hbar' ? { preset: 22, sub: 8, filter: 'wipe(left)' } : { preset: 22, sub: 4, filter: 'wipe(up)' });
      // the click group: plain shapes fade together; a chart contributes its FIRST category here, the rest follow as after-previous sibling groups
      const ids = groups.get(g); const firstGroup = ids.map((spid, k) => { const ch = chartOf.get(spid); return ch ? fx(spid, k, chartTgt(spid, 0), { ...kindFx(ch.kind), after: false }) : fx(spid, k, `<p:spTgt spid="${spid}"/>`); }).join('');
      let afterGroups = ''; let delay = 0;
      for (const spid of ids) { const ch = chartOf.get(spid); if (!ch || CB === 'whole') continue; for (let c = 1; c < ch.n; c++) { delay += 350; afterGroups += `<p:par><p:cTn id="${nid()}" fill="hold"><p:stCondLst><p:cond delay="${delay}"/></p:stCondLst><p:childTnLst>${fx(spid, 1, chartTgt(spid, c), { ...kindFx(ch.kind), after: true })}</p:childTnLst></p:cTn></p:par>`; } }
      const effects = firstGroup;
      return `<p:par><p:cTn id="${nid()}" fill="hold"><p:stCondLst><p:cond delay="indefinite"/></p:stCondLst><p:childTnLst><p:par><p:cTn id="${nid()}" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst><p:childTnLst>${effects}</p:childTnLst></p:cTn></p:par>${afterGroups}</p:childTnLst></p:cTn></p:par>`; }).join('');
    const bld = [...groups.values()].flat().map((id) => (isSp.has(id) ? `<p:bldP spid="${id}" grpId="0"/>` : chartOf.has(id) ? ((process.env.FT_CB || 'whole') === 'nobld' ? '' : `<p:bldGraphic spid="${id}" grpId="0"><p:bldSub><a:bldChart bld="${(process.env.FT_CB || 'whole') === 'whole' ? 'allAtOnce' : 'category'}" animBg="0"/></p:bldSub></p:bldGraphic>`) : '')).join('');
    const timing = `<p:timing><p:tnLst><p:par><p:cTn id="1" dur="indefinite" restart="never" nodeType="tmRoot"><p:childTnLst><p:seq concurrent="1" nextAc="seek"><p:cTn id="2" dur="indefinite" nodeType="mainSeq"><p:childTnLst>${clicks}</p:childTnLst></p:cTn><p:prevCondLst><p:cond evt="onPrev" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:prevCondLst><p:nextCondLst><p:cond evt="onNext" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:nextCondLst></p:seq></p:childTnLst></p:cTn></p:par></p:tnLst>${bld ? `<p:bldLst>${bld}</p:bldLst>` : ''}</p:timing>`;
    xml = xml.replace(/<p:timing>[\s\S]*?<\/p:timing>/, '').replace('</p:sld>', timing + '</p:sld>'); zip.file(name, xml); animated++; touched++;
  }
  // embed the brand fonts (EOT in ppt/fonts/*.fntdata, as PowerPoint itself does) so colleagues without them still see the deck right
  let embedded = 0;
  if (!(deck.meta && deck.meta.embedFonts === false)) {
    let ttf2eot = null; try { ttf2eot = require('ttf2eot'); } catch (e) { warn.push('ttf2eot not installed: fonts not embedded (cd scripts && npm i ttf2eot)'); }
    const FONT_FILES = { [F.d]: '205TF-Plaak-33-Pradel-Regular.otf', [F.t]: 'RiformaLL-Regular.otf', [F.m]: 'ABCMonumentGroteskMono-Regular.otf' };
    const alias = (deck.meta && deck.meta.fontAlias) || {}; // test hook: { "Plaak 3 Pradel": "ZZPlaak" } renames the typeface everywhere
    if (ttf2eot) {
      let rels = await zip.file('ppt/_rels/presentation.xml.rels').async('string'); let pres = await zip.file('ppt/presentation.xml').async('string'); let ct = await zip.file('[Content_Types].xml').async('string');
      const lst = [];
      Object.entries(FONT_FILES).forEach(([face, file], i) => {
        const src = [path.join(require('os').homedir(), 'Library/Fonts', file), path.join(SKILL, 'assets', 'fonts', file), path.join(process.env.LOCALAPPDATA || '', 'Microsoft/Windows/Fonts', file), path.join('C:/Windows/Fonts', file)].find((f) => fs.existsSync(f)); // mac user fonts → bundled copy → Windows user/system fonts
        if (!src) { warn.push(`font file not found for ${face}: ${file}`); return; }
        const n = i + 1; zip.file(`ppt/fonts/font${n}.fntdata`, Buffer.from(ttf2eot(fs.readFileSync(src)).buffer));
        rels = rels.replace('</Relationships>', `<Relationship Id="rIdFont${n}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/font" Target="fonts/font${n}.fntdata"/></Relationships>`);
        lst.push(`<p:embeddedFont><p:font typeface="${alias[face] || face}" charset="0"/><p:regular r:id="rIdFont${n}"/></p:embeddedFont>`); embedded++;
      });
      if (lst.length) {
        if (!/Extension="fntdata"/.test(ct)) ct = ct.replace(/(<Types[^>]*>)/, '$1<Default Extension="fntdata" ContentType="application/x-fontdata"/>');
        pres = pres.replace(/<p:presentation(?![^>]*embedTrueTypeFonts)/, '<p:presentation embedTrueTypeFonts="1"');
        pres = pres.replace(/(<p:notesSz[^>]*\/>|<p:notesSz[^>]*>[\s\S]*?<\/p:notesSz>)/, `$1<p:embeddedFontLst>${lst.join('')}</p:embeddedFontLst>`);
        zip.file('ppt/_rels/presentation.xml.rels', rels); zip.file('ppt/presentation.xml', pres); zip.file('[Content_Types].xml', ct);
        if (Object.keys(alias).length) for (const name of Object.keys(zip.files)) if (/^ppt\/(slides|slideLayouts|slideMasters|charts|theme)\/.*\.xml$/.test(name)) { let x = await zip.file(name).async('string'); for (const [a, b] of Object.entries(alias)) x = x.split(`typeface="${a}"`).join(`typeface="${b}"`); zip.file(name, x); }
        touched++;
      }
    }
  }
  if (touched) fs.writeFileSync(OUT, await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' }));
  console.log(`wrote ${OUT} (${slideNo} slides incl. ${morphFinal.size} morph start-states, ${chartLog.length} charts, ${embedded} fonts embedded, ${animated} slides with click reveals)`);
  for (const w of warn) console.log('WARN ' + w);
})().catch((e) => { console.error(e); process.exit(1); });
