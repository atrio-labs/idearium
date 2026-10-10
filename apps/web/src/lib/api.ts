/* ================================================================
   api.ts — cliente da API, único ponto de contato com o backend
   ================================================================
   Os tipos abaixo foram escritos a partir das respostas REAIS da API
   rodando (não do schema Prisma nem de suposição). Se divergirem, a
   API é que está certa.

   Todas as páginas são SSR, então estas funções rodam no servidor a
   cada requisição, nunca no browser: nenhuma chave ou token chega ao
   cliente, e o build não depende da API estar no ar.

   Toda função devolve dado ou um fallback vazio — nunca lança. Um
   backend fora do ar deixa a página sem conteúdo e com aviso, não
   quebrada. É requisito de aceite da F1.1.

   O idioma da página vai pra API no header x-lang, lido do contexto da
   requisição (requisicao.ts). Hoje a API só usa isso nas mensagens de
   erro; o conteúdo das RFCs tem `locale` próprio.
   ================================================================ */
import {
  apiFalhouNestaRequisicao, idiomaDaRequisicao, marcarFalhaDaApi,
} from './requisicao';
import { t, temChave, type Idioma } from './i18n';

const BASE = import.meta.env.PUBLIC_API_URL ?? 'http://localhost:3000';

/* ---------- tipos ---------- */

export type RfcStatus =
  | 'DRAFT' | 'IN_DISCUSSION' | 'IN_BUILDING' | 'PUBLISHED' | 'ARCHIVED';

export interface Autor {
  id: string;
  username: string;
  fullName: string | null;
  avatarUrl: string | null;
  /** PROPOSTA (docs/contratos/moderacao.md): conta suspensa, anonimizada pela API */
  suspended?: boolean;
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
  /** PROPOSTA (docs/contratos/moderacao.md): quando a moderação ocultou a ideia */
  hiddenAt?: string | null;
  translationOfId: string | null;
}

export interface Versao {
  id: string;
  version: number;
  body: string;
  authorId: string;
  createdAt: string;
  /** PROPOSTA (docs/contratos/ciclo.md): o que mudou e por quê */
  changeNote?: string | null;
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

/** `true` se alguma chamada desta requisição falhou; as páginas usam
 *  pra decidir entre "não há nada aqui" e "não consegui falar com o
 *  servidor". É função, e não variável de módulo, porque vale só pra
 *  requisição atual (ver requisicao.ts). Chame depois das buscas. */
export const apiIndisponivel = () => apiFalhouNestaRequisicao();

async function buscar<T>(caminho: string, aoFalhar: T): Promise<T> {
  try {
    const r = await fetch(BASE + caminho, {
      headers: { Accept: 'application/json', 'x-lang': idiomaDaRequisicao() },
    });
    if (!r.ok) {
      // 404 é resposta legítima (RFC que não existe), não queda do backend
      if (r.status !== 404) marcarFalhaDaApi();
      return aoFalhar;
    }
    return (await r.json()) as T;
  } catch {
    marcarFalhaDaApi();
    return aoFalhar;
  }
}

/** Chamada de baixo nível pra quem precisa do status (a busca separa
 *  400 de queda, a tag separa 404 de queda). Manda o x-lang da
 *  requisição, como `buscar`, e nunca lança: `status` 0 é rede fora.
 *  Não marca a falha da requisição; quem chama decide o que é queda. */
export async function chamarApi<T>(
  caminho: string,
): Promise<{ status: number; dado: T | null }> {
  try {
    const r = await fetch(BASE + caminho, {
      headers: { Accept: 'application/json', 'x-lang': idiomaDaRequisicao() },
    });
    return { status: r.status, dado: r.ok ? ((await r.json()) as T) : null };
  } catch {
    return { status: 0, dado: null };
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

/** Teto de `limit` imposto pelo PaginationDto da API. Pedir mais que
 *  isso devolve 400, não uma lista maior. */
export const LIMITE_API = 100;

/** Percorre a paginação inteira, pra listagem que mostra o catálogo
 *  todo sem depender de ele caber numa página só. */
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

/** Vocabulário canônico do VISAO §14. Não inventar sinônimo na UI.
 *  O texto mora no dicionário `comum`; `statusLabel` é o atalho em
 *  pt-BR pras páginas que ainda não passam o idioma. */
export const rotuloDoStatus = (s: RfcStatus, lang: Idioma = 'pt-BR') =>
  t(lang, `comum.status.${s}`);

export const statusLabel: Record<RfcStatus, string> = {
  DRAFT:         rotuloDoStatus('DRAFT'),
  IN_DISCUSSION: rotuloDoStatus('IN_DISCUSSION'),
  IN_BUILDING:   rotuloDoStatus('IN_BUILDING'),
  PUBLISHED:     rotuloDoStatus('PUBLISHED'),
  ARCHIVED:      rotuloDoStatus('ARCHIVED'),
};

/** A API devolve "Lab. Cidades"; dentro de um chip que já está sobre o
 *  pastel do lab, o prefixo é ruído. */
export const nomeCurtoDoLab = (nome: string) => nome.replace(/^Lab\.\s*/, '');

/** Nome curto do lab no idioma. Em pt-BR quem manda é a API; em inglês
 *  o nome vem do dicionário `labs` pelo slug, porque a API não guarda
 *  tradução. Sem chave, cai no nome da API em vez de quebrar. */
export function nomeDoLab(lab: { slug: string; name: string }, lang: Idioma = 'pt-BR') {
  const chave = `labs.nome.${lab.slug}`;
  if (lang === 'pt-BR' || !temChave(chave)) return nomeCurtoDoLab(lab.name);
  return t(lang, chave);
}

/** RFC sem número é rascunho — ainda não passou pela sequence. */
export const codigoRfc = (n: number | null, lang: Idioma = 'pt-BR') =>
  n == null ? rotuloDoStatus('DRAFT', lang) : `RFC-${String(n).padStart(4, '0')}`;

export function haQuantoTempo(iso: string | null, lang: Idioma = 'pt-BR'): string {
  if (!iso) return '';
  const dias = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (dias <= 0) return t(lang, 'comum.tempo.hoje');
  if (dias === 1) return t(lang, 'comum.tempo.dia');
  if (dias < 30) return t(lang, 'comum.tempo.dias', { n: dias });
  const meses = Math.floor(dias / 30);
  return meses === 1 ? t(lang, 'comum.tempo.mes') : t(lang, 'comum.tempo.meses', { n: meses });
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

/** A imagem de um laboratório: mesma ideia de materiaDaRfc, derivada
 *  do slug. O lab ganha sempre a mesma imagem, no átrio, em /labs e na
 *  página dele, sem guardar nada. */
export function materiaDoLab(slug: string) {
  let h = 0;
  for (const c of slug) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return { tipo: CAMPOS[h % CAMPOS.length], semente: h % 100_000 };
}
