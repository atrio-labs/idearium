/* ================================================================
   oauth.ts — flag e estado anti-CSRF do login por GitHub/Google
   ================================================================
   Só servidor. Tudo aqui vale só com PUBLIC_OAUTH=1 (Etapa 6 do
   backend, ainda não implementada). Contrato proposto em
   ROADMAP_FRONTEND.md, "Contratos propostos ao backend".

   O `state` nasce aqui, vai pra API e volta no callback. O que fecha o
   ciclo é o cookie httpOnly: sem ele, um callback montado por terceiro
   (com o `code` dele) logaria a vítima na conta do atacante.
   ================================================================ */
import { randomBytes, timingSafeEqual } from 'node:crypto';
import type { AstroCookies } from 'astro';
import type { Idioma } from './i18n';

export const OAUTH_ATIVO = import.meta.env.PUBLIC_OAUTH === '1';

/* origemPublica mora em site.ts (o sitemap, o canonical e o RSS também
   precisam dela); reexportada aqui pra quem já importava daqui. */
export { origemPublica } from './site';

export const PROVEDORES = ['github', 'google'] as const;
export type Provedor = (typeof PROVEDORES)[number];
export const ehProvedor = (v: unknown): v is Provedor =>
  PROVEDORES.includes(v as Provedor);

export const NOME_DO_PROVEDOR: Record<Provedor, string> = {
  github: 'GitHub',
  google: 'Google',
};

const COOKIE = 'id_oauth';
const VIDA = 10 * 60;

export interface EstadoOAuth {
  state: string;
  provedor: Provedor;
  /** entrar = login; vincular = ligar a uma conta já logada */
  modo: 'entrar' | 'vincular';
  /** destino pós-sucesso, sem prefixo de idioma, já passado por destinoSeguro */
  voltar: string;
  lang: Idioma;
}

/** Grava o cookie e devolve o state que vai pra API. */
export function abrirEstado(
  cookies: AstroCookies,
  dados: Omit<EstadoOAuth, 'state'>,
): string {
  const state = randomBytes(24).toString('base64url');
  const valor: EstadoOAuth = { ...dados, state };
  cookies.set(COOKIE, JSON.stringify(valor), {
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'lax',          // o callback chega por navegação de topo vinda da API
    path: '/',
    maxAge: VIDA,
  });
  return state;
}

/** Lê e consome o cookie (uso único, mesmo quando a conferência falha). */
export function consumirEstado(cookies: AstroCookies): EstadoOAuth | null {
  const bruto = cookies.get(COOKIE)?.value;
  cookies.delete(COOKIE, { path: '/' });
  if (!bruto) return null;
  try {
    const e = JSON.parse(bruto) as EstadoOAuth;
    if (typeof e.state !== 'string' || !ehProvedor(e.provedor)) return null;
    return e;
  } catch {
    return null;
  }
}

export function estadoConfere(esperado: string, recebido: string | null): boolean {
  if (!recebido) return false;
  const a = Buffer.from(esperado);
  const b = Buffer.from(recebido);
  return a.length === b.length && timingSafeEqual(a, b);
}
