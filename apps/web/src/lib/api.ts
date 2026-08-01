/* ================================================================
   api.ts — cliente da API, único ponto de contato com o backend
   ================================================================
   Os tipos abaixo foram escritos a partir das respostas REAIS da API
   rodando (não do schema Prisma nem de suposição). Se divergirem, a
   API é que está certa.

   Como as páginas públicas são pré-renderizadas, estas funções rodam
   em BUILD TIME, não no browser. Isso tem duas consequências:

     1. A API precisa estar no ar durante `npm run build:web`.
     2. Nenhuma chave ou token nunca chega ao cliente.

   Toda função devolve dado ou um fallback vazio — nunca lança. Um
   backend fora do ar deixa a página sem conteúdo e com aviso, não com
   build quebrado. É requisito de aceite da F1.1.
   ================================================================ */

const BASE = import.meta.env.PUBLIC_API_URL ?? 'http://localhost:3000';

/* ---------- tipos ---------- */

export type RfcStatus =
  | 'DRAFT' | 'IN_DISCUSSION' | 'IN_BUILDING' | 'PUBLISHED' | 'ARCHIVED';

export interface Autor {
  id: string;
  username: string;
  fullName: string | null;
  avatarUrl: string | null;
}

export interface LabResumo {
  id: string;
  slug: string;
  name: string;
  glyph: string;
}

export interface Lab extends LabResumo {
  description: string | null;
  order: number;
  rfcsCount: number;
  buildersCount: number;
}

export interface RfcResumo {
  id: string;
  number: number | null;
  slug: string;
  title: string;
  summary: string;
  locale: string;
  status: RfcStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  author: Autor;
  lab: LabResumo;
  _count: { versions: number };
}

export interface Rfc extends RfcResumo {
  body: string;
  visibility: string;
  archivedAt: string | null;
  translationOfId: string | null;
}

export interface Versao {
  id: string;
  version: number;
  body: string;
  createdAt: string;
}

export interface Inscricao {
  id: string;
  role: string;
  message: string | null;
  createdAt: string;
  leftAt: string | null;
  user: Autor;
}

export interface Comentario {
  id: string;
  body: string;
  isEdited: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  author: Autor;
}

export interface Tag {
  id: string;
  slug: string;
  name: string;
}

export interface Perfil {
  id: string;
  username: string;
  fullName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  preferredLocale: string;
  createdAt: string;
  builderProfile: {
    headline: string | null;
    topics: string[];
    isOpenToWork: boolean;
  } | null;
}

export interface Pagina<T> {
  data: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

/* ---------- transporte ---------- */

/** Fica `true` se qualquer chamada falhar; as páginas usam pra decidir
 *  entre "não há nada aqui" e "não consegui falar com o servidor". */
export let apiIndisponivel = false;

async function buscar<T>(caminho: string, aoFalhar: T): Promise<T> {
  try {
    const r = await fetch(BASE + caminho, { headers: { Accept: 'application/json' } });
    if (!r.ok) {
      // 404 é resposta legítima (RFC que não existe), não queda do backend
      if (r.status !== 404) apiIndisponivel = true;
      return aoFalhar;
    }
    return (await r.json()) as T;
  } catch {
    apiIndisponivel = true;
    return aoFalhar;
  }
}

const vazio = <T>(): Pagina<T> => ({
  data: [], meta: { page: 1, limit: 20, total: 0, totalPages: 0 },
});

/* ---------- leitura pública ---------- */

export const listarLabs = () => buscar<Lab[]>('/labs', []);

export const obterLab = (slug: string) =>
  buscar<Lab | null>(`/labs/${slug}`, null);

export function listarRfcs(q: {
  lab?: string; status?: RfcStatus; locale?: string;
  sort?: 'recent' | 'popular'; page?: number; limit?: number;
} = {}) {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(q)) if (v != null) p.set(k, String(v));
  const qs = p.toString();
  return buscar<Pagina<RfcResumo>>(`/rfcs${qs ? '?' + qs : ''}`, vazio<RfcResumo>());
}

export const listarDestaques = () => buscar<RfcResumo[]>('/rfcs/featured', []);

/** Teto de `limit` imposto pelo PaginationDto da API. Pedir mais que
 *  isso devolve 400, não uma lista maior. */
export const LIMITE_API = 100;

/** Percorre a paginação inteira. É o que `getStaticPaths` precisa: uma
 *  rota por RFC, sem depender de o catálogo caber numa página só. */
export async function listarTodasRfcs(q: { lab?: string } = {}) {
  const todas: RfcResumo[] = [];
  for (let page = 1; ; page++) {
    const r = await listarRfcs({ ...q, page, limit: LIMITE_API, sort: 'recent' });
    todas.push(...r.data);
    if (page >= r.meta.totalPages || r.data.length === 0) break;
    if (page > 50) break;             // trava contra paginação infinita
  }
  return todas;
}

/** Grita no log do build quando a listagem some por falha de rede.
 *  Sem isso, um backend fora do ar gera um site sem nenhuma página de
 *  RFC e o build termina "com sucesso". */
export function avisarSeVazio(o: { onde: string; qtd: number }) {
  if (o.qtd > 0) return;
  const motivo = apiIndisponivel
    ? 'a API não respondeu'
    : 'a API respondeu, mas não há nada publicado';
  console.warn(
    `\n[idearium] ${o.onde}: nenhuma rota gerada porque ${motivo}.` +
    `\n           Confira se a API está no ar em ${BASE} antes de publicar este build.\n`,
  );
}

export const obterRfc = (slug: string) =>
  buscar<Rfc | null>(`/rfcs/${slug}`, null);

export const listarVersoes = (id: string) =>
  buscar<Versao[]>(`/rfcs/${id}/versions`, []);

export const listarInscricoes = (id: string) =>
  buscar<Inscricao[]>(`/rfcs/${id}/enrollments`, []);

export const listarComentarios = (id: string) =>
  buscar<Pagina<Comentario>>(`/rfcs/${id}/comments`, vazio<Comentario>());

export const listarTagsDaRfc = (id: string) =>
  buscar<Tag[]>(`/rfcs/${id}/tags`, []);

export const obterPerfil = (username: string) =>
  buscar<Perfil | null>(`/users/${username}`, null);

export const listarRfcsDoUsuario = (username: string) =>
  buscar<Pagina<RfcResumo>>(`/users/${username}/rfcs`, vazio<RfcResumo>());

export const listarInscricoesDoUsuario = (username: string) =>
  buscar<Pagina<Inscricao & { rfc?: RfcResumo }>>(
    `/users/${username}/enrollments`, vazio<Inscricao & { rfc?: RfcResumo }>());

/* ---------- apresentação ---------- */

/** Vocabulário canônico do VISAO §14. Não inventar sinônimo na UI. */
export const statusLabel: Record<RfcStatus, string> = {
  DRAFT:         'rascunho',
  IN_DISCUSSION: 'em discussão',
  IN_BUILDING:   'em construção',
  PUBLISHED:     'publicada',
  ARCHIVED:      'arquivada',
};

/** A API devolve "Lab. Cidades"; dentro de um chip que já está sobre o
 *  pastel do lab, o prefixo é ruído. */
export const nomeCurtoDoLab = (nome: string) => nome.replace(/^Lab\.\s*/, '');

/** RFC sem número é rascunho — ainda não passou pela sequence. */
export const codigoRfc = (n: number | null) =>
  n == null ? 'rascunho' : `RFC-${String(n).padStart(4, '0')}`;

export function haQuantoTempo(iso: string | null): string {
  if (!iso) return '';
  const dias = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (dias <= 0) return 'hoje';
  if (dias === 1) return 'há 1 dia';
  if (dias < 30) return `há ${dias} dias`;
  const meses = Math.floor(dias / 30);
  return meses === 1 ? 'há 1 mês' : `há ${meses} meses`;
}

/** Qual campo de dithering representa esta RFC.
 *  Determinístico pelo id, então a mesma RFC tem sempre a mesma imagem.
 *  Quando a API expuser o campo de dado real, só esta função muda. */
const CAMPOS = ['mancha', 'pontos', 'grafo', 'serie'] as const;
export type CampoMateria = (typeof CAMPOS)[number];

export function materiaDaRfc(rfc: { id: string; number: number | null }) {
  let h = 0;
  for (const c of rfc.id) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return {
    tipo: CAMPOS[h % CAMPOS.length],
    semente: (rfc.number ?? 0) * 1000 + (h % 997),
  };
}
