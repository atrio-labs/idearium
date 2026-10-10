/* ================================================================
   og-imagem.ts — a imagem de compartilhamento (PNG 1200x630)
   ================================================================
   Só servidor. Pinta o mesmo gradiente quente do Materia.astro (paleta
   única, composição por semente/lab/tipo, vidro canelado e grão) e
   codifica o PNG com node:zlib. Zero dependência: satori + resvg-js
   trariam binário nativo (musl no alpine) e fonte TTF, que a Inter
   self-hosted (woff2) não é. Por isso a imagem NÃO leva texto; número
   e título vão no og:title e no og:description da página.

   A composição é uma cópia do `compor` de Materia.astro (que roda no
   navegador e não exporta nada). Se uma mudar, a outra acompanha.
   ================================================================ */
import { deflateSync } from 'node:zlib';

type Rgb = [number, number, number];
const LARANJA: Rgb = [255, 90, 31];
const ROSA: Rgb = [255, 79, 163];
const AZUL: Rgb = [91, 143, 214];
const AREIA: Rgb = [217, 195, 165];
const OLIVA: Rgb = [78, 82, 44];
const QUENTES: Rgb[] = [LARANJA, ROSA, AZUL, LARANJA, AREIA];

interface Mancha { x: number; y: number; r: number; cor: Rgb; a: number }

function prng(seed: number) {
  let a = (seed * 2654435761) >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashTexto(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

function compor(tipo: string, lab: string, semente: number) {
  const r = prng(semente ^ hashTexto(lab));
  const giro = hashTexto(lab) % QUENTES.length;
  const cor = (i: number) => QUENTES[(i + giro) % QUENTES.length];
  const espelho = hashTexto(lab) & 1;
  const mx = (x: number) => (espelho ? 1 - x : x);
  const manchas: Mancha[] = [];
  let canelura = 24, forca = 0.35, onda = 0.3, ondaFreq = 1.1;

  if (tipo === 'pontos') {
    for (let i = 0; i < 6; i++) manchas.push({ x: mx(r()), y: r(), r: 0.22 + r() * 0.18, cor: cor(i), a: 0.85 });
    canelura = 18; forca = 0.22; onda = 0.2; ondaFreq = 1.4;
  } else if (tipo === 'grafo') {
    for (let i = 0; i < 4; i++) {
      const t = (i + r() * 0.6) / 4;
      manchas.push({ x: mx(t), y: 1 - t + (r() - 0.5) * 0.3, r: 0.38 + r() * 0.2, cor: cor(i), a: 0.9 });
    }
    canelura = 34; forca = 0.5; onda = 0.4; ondaFreq = 0.8;
  } else if (tipo === 'serie') {
    for (let i = 0; i < 5; i++) manchas.push({ x: mx((i + r()) / 5), y: 0.75 + r() * 0.35, r: 0.3 + r() * 0.15, cor: cor(i), a: 0.9 });
    canelura = 14; forca = 0.45; onda = 0.25; ondaFreq = 1.2;
  } else {
    for (let i = 0; i < 4; i++) manchas.push({ x: mx(r()), y: r(), r: 0.34 + r() * 0.24, cor: cor(i), a: 0.95 });
  }
  manchas.push({ x: mx(r() < 0.5 ? r() * 0.25 : 0.75 + r() * 0.25), y: r(), r: 0.18 + r() * 0.12, cor: OLIVA, a: 0.55 });
  return { manchas, canelura, forca, onda, ondaFreq, fase: r() * Math.PI * 2 };
}

/** Base borrada em baixa resolução: gradientes radiais sobre a areia
 *  (mesmo resultado do canvas do Materia, sem canvas). */
function base(manchas: Mancha[], lw: number, lh: number) {
  const px = new Float32Array(lw * lh * 3);
  const maior = Math.max(lw, lh);
  for (let y = 0; y < lh; y++) for (let x = 0; x < lw; x++) {
    let c: Rgb = [...AREIA];
    for (const m of manchas) {
      const d = Math.hypot(x - m.x * lw, y - m.y * lh) / (m.r * maior);
      if (d >= 1) continue;
      // paradas do gradiente do Materia: 0 → a, 0.45 → 0.55a, 1 → 0
      const a = m.a * (d < 0.45 ? 1 - (d / 0.45) * 0.45 : 0.55 * (1 - (d - 0.45) / 0.55));
      c = [c[0] + (m.cor[0] - c[0]) * a, c[1] + (m.cor[1] - c[1]) * a, c[2] + (m.cor[2] - c[2]) * a];
    }
    px.set(c, (y * lw + x) * 3);
  }
  return px;
}

const CRC = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(b: Buffer) {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < b.length; i++) c = CRC[(c ^ b[i]) & 255] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}

function bloco(tipo: string, dados: Buffer) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(dados.length);
  const corpo = Buffer.concat([Buffer.from(tipo, 'ascii'), dados]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(corpo));
  return Buffer.concat([len, corpo, crc]);
}

/** PNG RGB de 8 bits, sem filtro por linha. */
export function codificarPng(rgb: Uint8Array, w: number, h: number) {
  const passo = w * 3 + 1;
  const linhas = Buffer.alloc(passo * h);
  for (let y = 0; y < h; y++) {
    linhas[y * passo] = 0;
    Buffer.from(rgb.buffer, rgb.byteOffset + y * w * 3, w * 3).copy(linhas, y * passo + 1);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]),
    bloco('IHDR', ihdr),
    bloco('IDAT', deflateSync(linhas, { level: 6 })),
    bloco('IEND', Buffer.alloc(0)),
  ]);
}

export const OG_LARGURA = 1200;
export const OG_ALTURA = 630;

/** Mesmos parâmetros do <Materia>: tipo, lab (slug) e semente. */
export function imagemOg(tipo: string, lab: string, semente: number) {
  const W = OG_LARGURA, H = OG_ALTURA;
  const c = compor(tipo, lab, semente);
  const lw = 96, lh = Math.round((96 * H) / W);
  const b = base(c.manchas, lw, lh);
  const out = new Uint8Array(W * H * 3);
  const TAU = Math.PI * 2;
  const fw = c.canelura * 2;            // como num dpr 2
  let ruido = (semente * 747796405 + 2891336453) >>> 0 || 1;
  const lido = (ix: number, iy: number, k: number) => b[(iy * lw + ix) * 3 + k];

  for (let y = 0; y < H; y++) {
    const ny = y / H;
    for (let x = 0; x < W; x++) {
      const ondula = c.onda * Math.sin(ny * TAU * c.ondaFreq + c.fase + (x / W) * 2.2);
      const t = x / fw + ondula;
      const u = t - Math.floor(t);
      const sx = Math.min(W - 1, Math.max(0, x + c.forca * fw * Math.sin(TAU * u)));
      const sy = y + c.forca * fw * 0.25 * Math.cos(TAU * u);
      const bx = Math.min(lw - 1.001, Math.max(0, (sx / W) * lw - 0.5));
      const by = Math.min(lh - 1.001, Math.max(0, (sy / H) * lh - 0.5));
      const x0 = bx | 0, y0 = by | 0, fx = bx - x0, fy = by - y0;
      const luz = 1 + 0.07 * Math.cos(TAU * u);
      ruido ^= ruido << 13; ruido ^= ruido >>> 17; ruido ^= ruido << 5;
      const n = ((ruido >>> 0) / 4294967296 - 0.5) * 22;
      const o = (y * W + x) * 3;
      for (let k = 0; k < 3; k++) {
        const v = (lido(x0, y0, k) * (1 - fx) + lido(x0 + 1, y0, k) * fx) * (1 - fy) +
                  (lido(x0, y0 + 1, k) * (1 - fx) + lido(x0 + 1, y0 + 1, k) * fx) * fy;
        out[o + k] = Math.max(0, Math.min(255, v * luz + n));
      }
    }
  }
  return codificarPng(out, W, H);
}
