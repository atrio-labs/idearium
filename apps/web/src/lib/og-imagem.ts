/* ================================================================
   og-imagem.ts — a imagem de compartilhamento (PNG 1200x630)
   ================================================================
   Só servidor. Pinta a mesma imagem estática do Materia.astro (paleta
   e composição por semente/lab/tipo, vidro e grão, de
   materia-composicao.ts) e codifica o PNG com node:zlib. Zero
   dependência: satori + resvg-js trariam binário nativo (musl no
   alpine) e fonte TTF, que a Inter self-hosted (woff2) não é. Por isso
   a imagem NÃO leva texto; número e título vão no og:title e no
   og:description da página.
   ================================================================ */
import { deflateSync } from 'node:zlib';
import { compor, renderizar } from './materia-composicao';

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
  // dpr 2: as caneluras ficam com a largura que teriam numa tela retina
  const rgba = renderizar(compor(tipo, lab, semente), W, H, 2, semente);
  const rgb = new Uint8Array(W * H * 3);
  for (let i = 0, j = 0; i < rgba.length; i += 4, j += 3) {
    rgb[j] = rgba[i]; rgb[j + 1] = rgba[i + 1]; rgb[j + 2] = rgba[i + 2];
  }
  return codificarPng(rgb, W, H);
}
