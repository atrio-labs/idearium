/* ================================================================
   materia-composicao.ts — paleta e composição da imagem de cada ideia
   ================================================================
   Puro, sem DOM e sem node:*. Usado em três lugares, com o mesmo
   resultado para a mesma entrada:
   - Materia.astro, no servidor: o fundo CSS de primeira pintura;
   - Materia.astro, no <script> do navegador: o shader WebGL e o
     fallback estático na CPU (renderizar);
   - og-imagem.ts: o PNG de compartilhamento (renderizar).

   Cada imagem escolhe UMA paleta de um conjunto curado (PALETAS), um
   modo e um caráter. A semente decide; o lab puxa a paleta para uma
   família de três, então ideias do mesmo lab se parecem sem ficarem
   todas iguais.
   - modo 'mesh': manchas radiais grandes, uma sobre a outra;
   - modo 'lava': manchas como blobs de lava lamp (metaballs), que se
     fundem quando se aproximam. Cerca de 1/3 das imagens, e sempre as
     da marca (lab 'idearium': o herói do átrio e o PNG padrão).
   - caráter do vidro: de nenhum ('mesh') a faixas marcadas ('faixas').
   ================================================================ */

export type Rgb = [number, number, number];

export interface Paleta {
  nome: string;
  /** cor de fundo, por baixo de todas as manchas */
  fundo: Rgb;
  /** cores das manchas, já harmônicas entre si */
  cores: Rgb[];
  /** tom escuro de profundidade */
  escuro: Rgb;
}

const hex = (h: string): Rgb => [
  parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16),
];
const paleta = (nome: string, fundo: string, cores: string[], escuro: string): Paleta => ({
  nome, fundo: hex(fundo), cores: cores.map(hex), escuro: hex(escuro),
});

export const PALETAS: readonly Paleta[] = [
  paleta('brasa',      '#F4DCC6', ['#FF5A1F', '#FF4F7B', '#FFB36B', '#E0785A'], '#6B1E1E'),
  paleta('oceano',     '#D9E8EC', ['#0F6E7A', '#2EC4D6', '#7CC9DA', '#3A7CA5'], '#0B2F3A'),
  paleta('floresta',   '#EFEBD6', ['#4F6B2A', '#A8D04A', '#7FA36B', '#C9D86E'], '#1F2E14'),
  paleta('crepusculo', '#F6D9C6', ['#5B3FA8', '#2E2F7F', '#FF9E7A', '#C46BAE'], '#1A1440'),
  paleta('citrico',    '#FFF2CC', ['#FFC81F', '#FF8A1F', '#3CC6B0', '#F2D43A'], '#1F5E55'),
  paleta('lavanda',    '#F5EEE8', ['#A88BE8', '#6FB3F0', '#D9A8EE', '#8571D6'], '#4B3F78'),
  paleta('terracota',  '#E9D3B8', ['#C2562E', '#D99A2B', '#7C8743', '#E58B5F'], '#3E2A1A'),
  paleta('aurora',     '#1B2340', ['#5FF0B4', '#8A4FE0', '#2F7BE0', '#3FD0C9'], '#0A0F22'),
  paleta('algodao',    '#FFF3E8', ['#FF9EC4', '#8EC4FF', '#FFC6A3', '#C1AEFF'], '#8A6A8F'),
  paleta('noite',      '#161C3D', ['#D6247A', '#FFB02E', '#3B4FB8', '#7A2E8F'], '#05081A'),
  paleta('argila',     '#E6DCD3', ['#C98F7A', '#D9A5A8', '#9C8B80', '#B5714F'], '#4A3A33'),
  paleta('gelo',       '#EBF1F7', ['#7FB2E5', '#AEB8C8', '#A99BE0', '#5C8FD0'], '#3D4A63'),
];

const indice = (nome: string) => PALETAS.findIndex((p) => p.nome === nome);

/* Famílias dos labs conhecidos (slugs do seed da API). Lab fora daqui
   cai numa família derivada do hash do slug. */
const FAMILIAS: Record<string, string[]> = {
  'educacao':       ['citrico', 'lavanda', 'algodao'],
  'cidades':        ['crepusculo', 'noite', 'argila'],
  'saude':          ['oceano', 'aurora', 'gelo'],
  'cultura':        ['brasa', 'algodao', 'crepusculo'],
  'tec-civica':     ['noite', 'lavanda', 'oceano'],
  'econ-solidaria': ['terracota', 'argila', 'floresta'],
  'idearium':       ['crepusculo', 'brasa', 'noite'],
};

/** O lab da marca (herói do átrio, PNG padrão): sempre na família e
 *  sempre em modo lava. */
const MARCA = 'idearium';

/** Chance de a imagem ficar na família do lab; o resto sorteia entre todas. */
const PESO_FAMILIA = 0.75;
/** Fração das imagens em modo lava. */
const PESO_LAVA = 1 / 3;

export function prng(seed: number) {
  let a = (seed * 2654435761) >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashTexto(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

export function familiaDoLab(lab: string): Paleta[] {
  const nomes = FAMILIAS[lab];
  if (nomes) return nomes.map((n) => PALETAS[indice(n)]);
  const h = hashTexto(lab);
  const n = PALETAS.length;
  return [h % n, (h + 3) % n, (h + 7) % n].map((i) => PALETAS[i]);
}

/** A paleta de uma imagem. Sem lab, só a semente decide. */
export function escolherPaleta(lab: string, semente: number): Paleta {
  const r = prng((semente * 7919 + 0x51ED) >>> 0);
  const sorteio = r(), qual = r();
  if (lab && (lab === MARCA || sorteio < PESO_FAMILIA)) {
    const familia = familiaDoLab(lab);
    return familia[Math.floor(qual * familia.length)];
  }
  return PALETAS[Math.floor(qual * PALETAS.length)];
}

export type Modo = 'mesh' | 'lava';
export type Carater = 'mesh' | 'suave' | 'canelado' | 'faixas';

export interface Mancha {
  /** centro, em fração da largura e da altura */
  x: number;
  y: number;
  /** raio, em fração do maior lado */
  r: number;
  /** alongamento vertical (1 = redonda; o horizontal é 1/s) */
  s: number;
  cor: Rgb;
  /** outra cor da mesma paleta, pra onde o matiz desliza na animação */
  cor2: Rgb;
  a: number;
}

export interface Composicao {
  paleta: string;
  modo: Modo;
  fundo: Rgb;
  escuro: Rgb;
  manchas: Mancha[];
  carater: Carater;
  /** largura de cada canelura, em CSS px */
  canelura: number;
  /** quanto a canelura entorta a imagem; 0 = sem vidro */
  forca: number;
  /** amplitude da ondulação das faixas, em larguras de canelura */
  onda: number;
  /** quantas ondas cabem ao longo das faixas */
  ondaFreq: number;
  fase: number;
  /** direção das caneluras, em radianos (0 = faixas verticais) */
  angulo: number;
  /** amplitude do grão, em níveis de 0..255 */
  grao: number;
}

export const MAX_MANCHAS = 8;

const entre = (r: () => number, a: number, b: number) => a + r() * (b - a);

/* Coordenadas normalizadas (0..1) e raio relativo ao maior lado: a
   mesma composição serve pra capa de 168px e pro destaque de 380px. */
export function compor(tipo: string, lab: string, semente: number): Composicao {
  const p = escolherPaleta(lab, semente);
  const r = prng((semente ^ hashTexto(lab) ^ hashTexto(tipo)) >>> 0);
  const modo: Modo = lab === MARCA || r() < PESO_LAVA ? 'lava' : 'mesh';
  const nc = p.cores.length;
  const giro = Math.floor(r() * nc);
  const cor = (i: number) => p.cores[(i + giro) % nc];
  const cor2 = (i: number) => p.cores[(i + giro + 1 + (i % 2)) % nc];
  const espelho = r() < 0.5;
  const mx = (x: number) => (espelho ? 1 - x : x);
  const manchas: Mancha[] = [];
  const add = (i: number, x: number, y: number, raio: number, a: number, s = 1) =>
    manchas.push({ x: mx(x), y, r: raio, s, cor: cor(i), cor2: cor2(i), a });

  if (modo === 'lava') {
    // blobs menores, em colunas soltas, alguns já esticados
    const n = 4 + Math.floor(r() * 3);
    for (let i = 0; i < n; i++) {
      add(i, (i + 0.2 + r() * 0.6) / n, entre(r, 0.15, 0.85), entre(r, 0.075, 0.14), 1, entre(r, 0.8, 1.35));
    }
  } else if (tipo === 'pontos') {
    // várias manchas médias espalhadas
    const n = 5 + Math.floor(r() * 3);
    for (let i = 0; i < n; i++) add(i, r(), r(), entre(r, 0.2, 0.36), 0.85);
  } else if (tipo === 'grafo') {
    // manchas numa diagonal
    const n = 3 + Math.floor(r() * 2);
    for (let i = 0; i < n; i++) {
      const t = (i + r() * 0.6) / n;
      add(i, t, 1 - t + (r() - 0.5) * 0.3, entre(r, 0.36, 0.58), 0.9);
    }
  } else if (tipo === 'serie') {
    // o peso fica embaixo, o topo respira no fundo
    const n = 4 + Math.floor(r() * 2);
    for (let i = 0; i < n; i++) add(i, (i + r()) / n, entre(r, 0.7, 1.05), entre(r, 0.28, 0.46), 0.9);
  } else {
    // mancha: poucas manchas enormes; o caso padrão
    const n = 3 + Math.floor(r() * 3);
    for (let i = 0; i < n; i++) add(i, r(), r(), entre(r, 0.32, 0.6), 0.95);
  }

  /* o toque escuro do mesh: pequeno, nunca no centro, pra a imagem ter
     profundidade e não só brilho. Na lava o escuro vai no fundo. */
  if (modo === 'mesh') {
    manchas.push({
      x: mx(r() < 0.5 ? r() * 0.25 : 0.75 + r() * 0.25), y: r(),
      r: entre(r, 0.16, 0.3), s: 1, cor: p.escuro, cor2: p.escuro, a: 0.6,
    });
  }

  /* caráter do vidro: nem toda imagem é canelada; na lava o vidro é
     no máximo suave, pra não picotar os blobs */
  const k = modo === 'lava' ? r() * 0.5 : r();
  let carater: Carater, canelura: number, forca: number, onda: number, ondaFreq: number;
  if (k < 0.25) {
    carater = 'mesh'; canelura = 40; forca = 0; onda = 0; ondaFreq = 1;
  } else if (k < 0.5) {
    carater = 'suave'; canelura = entre(r, 44, 80); forca = entre(r, 0.12, 0.22);
    onda = entre(r, 0.12, 0.3); ondaFreq = entre(r, 0.6, 1.1);
  } else if (k < 0.8) {
    carater = 'canelado'; canelura = entre(r, 18, 32); forca = entre(r, 0.3, 0.45);
    onda = entre(r, 0.2, 0.4); ondaFreq = entre(r, 0.8, 1.4);
  } else {
    carater = 'faixas'; canelura = entre(r, 10, 18); forca = entre(r, 0.5, 0.7);
    onda = entre(r, 0.3, 0.55); ondaFreq = entre(r, 1, 1.8);
  }
  if (modo === 'lava') forca *= 0.4;     // sem dobra: o vidro não corta a borda do blob
  const d = r();
  const angulo = d < 0.7 ? 0 : d < 0.85 ? (r() - 0.5) * 0.42 : Math.PI / 2;

  return {
    paleta: p.nome, modo, fundo: p.fundo, escuro: p.escuro, manchas, carater,
    canelura, forca, onda, ondaFreq, fase: r() * Math.PI * 2, angulo,
    grao: modo === 'lava' ? entre(r, 8, 16) : entre(r, 12, 28),
  };
}

/** Opacidade de uma mancha do mesh a uma distância d (em raios):
 *  paradas 0 → 1, 0.45 → 0.55, 1 → 0. Mesma curva do shader. */
export function opacidade(d: number) {
  return d < 0.45 ? 1 - (d / 0.45) * 0.45 : Math.max(0, 0.55 * (1 - (d - 0.45) / 0.55));
}

/* Núcleo do metaball (Wyvill): (1 - d²/4)², zero a partir de 2 raios.
   Cai rápido, então blobs longe ficam separados e só os próximos se
   fundem. Um blob sozinho cruza o limiar (≈0.56) em d = 1. */
const nucleo = (d2: number) => (d2 >= 4 ? 0 : (1 - d2 / 4) * (1 - d2 / 4));
const LAVA_BORDA = [0.4, 0.72];

const suave = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** Cor de um ponto (nx, ny em fração do lado; `aspecto` = W/H), sem
 *  vidro nem grão. É o mesmo cálculo do shader do Materia, em JS. */
export function corNoPonto(c: Composicao, nx: number, ny: number, aspecto: number): Rgb {
  // fração do maior lado, pra raio e distância valerem em qualquer formato
  const ex = aspecto >= 1 ? 1 : aspecto, ey = aspecto >= 1 ? 1 / aspecto : 1;
  if (c.modo === 'lava') {
    // fundo: a cor da paleta descendo pro escuro, como o líquido da lâmpada
    const fe = 0.22 * ny * ny;
    const fundo: Rgb = [0, 1, 2].map((k) => c.fundo[k] + (c.escuro[k] - c.fundo[k]) * fe) as Rgb;
    let campo = 0, wr = 0, wg = 0, wb = 0;
    for (const m of c.manchas) {
      const dx = ((nx - m.x) * ex) / (m.r / m.s);
      const dy = ((ny - m.y) * ey) / (m.r * m.s);
      const f = nucleo(dx * dx + dy * dy);
      campo += f; wr += f * m.cor[0]; wg += f * m.cor[1]; wb += f * m.cor[2];
    }
    const q = Math.max(campo, 1e-6);
    const blob: Rgb = [wr / q, wg / q, wb / q];
    // borda macia em torno do limiar (o raio de um blob sozinho)
    const a = suave(LAVA_BORDA[0], LAVA_BORDA[1], campo);
    const halo = 0.22 * suave(0.03, LAVA_BORDA[0], campo);
    const brilho = 1 + 0.08 * suave(0.8, 1.6, campo);
    return [0, 1, 2].map((k) => {
      const comHalo = fundo[k] + (blob[k] - fundo[k]) * halo;
      return comHalo + (blob[k] * brilho - comHalo) * a;
    }) as Rgb;
  }
  let r0 = c.fundo[0], g0 = c.fundo[1], b0 = c.fundo[2];
  for (const m of c.manchas) {
    const d = Math.hypot((nx - m.x) * ex, (ny - m.y) * ey) / m.r;
    if (d >= 1) continue;
    const a = opacidade(d) * m.a;
    r0 += (m.cor[0] - r0) * a; g0 += (m.cor[1] - g0) * a; b0 += (m.cor[2] - b0) * a;
  }
  return [r0, g0, b0];
}

/** Base borrada em baixa resolução, RGB em float (0..255). */
function base(c: Composicao, lw: number, lh: number) {
  const px = new Float32Array(lw * lh * 3);
  for (let y = 0; y < lh; y++) for (let x = 0; x < lw; x++) {
    px.set(corNoPonto(c, (x + 0.5) / lw, (y + 0.5) / lh, lw / lh), (y * lw + x) * 3);
  }
  return px;
}

/** Imagem estática (o quadro de t = 0) em RGBA de 8 bits, W x H px.
 *  `dpr` converte a largura da canelura de CSS px para px da imagem.
 *  É o fallback sem WebGL do Materia e o PNG de compartilhamento. */
export function renderizar(c: Composicao, W: number, H: number, dpr: number, semente: number) {
  const BASE = c.modo === 'lava' ? 160 : 96;   // a borda do blob pede um pouco mais
  const escala = BASE / Math.max(W, H);
  const lw = Math.max(4, Math.round(W * escala));
  const lh = Math.max(4, Math.round(H * escala));
  const b = base(c, lw, lh);
  const out = new Uint8ClampedArray(W * H * 4);
  const TAU = Math.PI * 2;
  const fw = c.canelura * dpr;
  const cos = Math.cos(c.angulo), sin = Math.sin(c.angulo);
  const cx = W / 2, cy = H / 2;
  const brilho = 0.07 * Math.min(1, c.forca / 0.3);
  let ruido = (semente * 747796405 + 2891336453) >>> 0 || 1;
  const lido = (ix: number, iy: number, k: number) => b[(iy * lw + ix) * 3 + k];

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      let sx = x, sy = y, luz = 1;
      if (c.forca > 0) {
        // coordenadas no eixo das caneluras (girado em torno do centro)
        const qx = cos * (x - cx) + sin * (y - cy) + cx;
        const qy = -sin * (x - cx) + cos * (y - cy) + cy;
        const ondula = c.onda * Math.sin((qy / H) * TAU * c.ondaFreq + c.fase + (qx / W) * 2.2);
        const t = qx / fw + ondula;
        const u = t - Math.floor(t);
        const dx = c.forca * fw * Math.sin(TAU * u);
        const dy = c.forca * fw * 0.25 * Math.cos(TAU * u);
        sx = x + cos * dx - sin * dy;
        sy = y + sin * dx + cos * dy;
        luz = 1 + brilho * Math.cos(TAU * u);
      }
      const bx = Math.min(lw - 1.001, Math.max(0, (Math.min(W - 1, Math.max(0, sx)) / W) * lw - 0.5));
      const by = Math.min(lh - 1.001, Math.max(0, (Math.min(H - 1, Math.max(0, sy)) / H) * lh - 0.5));
      const x0 = bx | 0, y0 = by | 0, fx = bx - x0, fy = by - y0;
      ruido ^= ruido << 13; ruido ^= ruido >>> 17; ruido ^= ruido << 5;
      const n = ((ruido >>> 0) / 4294967296 - 0.5) * c.grao;
      const o = (y * W + x) * 4;
      for (let k = 0; k < 3; k++) {
        const v = (lido(x0, y0, k) * (1 - fx) + lido(x0 + 1, y0, k) * fx) * (1 - fy) +
                  (lido(x0, y0 + 1, k) * (1 - fx) + lido(x0 + 1, y0 + 1, k) * fx) * fy;
        out[o + k] = v * luz + n;           // Uint8ClampedArray satura sozinho
      }
      out[o + 3] = 255;
    }
  }
  return out;
}

/** Fundo CSS de primeira pintura (e de quem está sem JS): o fundo da
 *  paleta e as três primeiras manchas em radial-gradient. */
export function fundoCss(c: Composicao) {
  const rgb = (k: Rgb, a = 1) => `rgba(${k[0]},${k[1]},${k[2]},${a})`;
  const camadas = c.manchas.slice(0, 3).map((m) => {
    const x = Math.round(m.x * 100), y = Math.round(m.y * 100), t = Math.round(m.r * 140);
    return `radial-gradient(${t}% ${t}% at ${x}% ${y}%, ${rgb(m.cor)} 0%, ${rgb(m.cor, 0)} 70%)`;
  });
  return [...camadas, rgb(c.fundo)].join(', ');
}
