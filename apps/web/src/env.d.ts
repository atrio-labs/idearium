/// <reference path="../.astro/types.d.ts" />

import type { UsuarioSessao } from './lib/sessao';
import type { Idioma } from './lib/i18n';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      /** origem pública do site (ex.: https://idearium.org), em execução; usada no redirect do OAuth atrás de proxy */
      SITE_URL?: string;
    }
  }

  namespace App {
    interface Locals {
      /** preenchido pelo middleware; null quando ninguém está logado */
      usuario: UsuarioSessao | null;
      /** idioma da interface, pelo prefixo do endereço (/en → 'en') */
      lang: Idioma;
      /** preferredLocale do perfil de quem está logado; null quando
       *  anônimo ou quando não foi preciso buscar (ver middleware.ts) */
      idiomaPreferido: Idioma | null;
    }
  }
}

interface ImportMetaEnv {
  /** URL base da API. Default http://localhost:3000 */
  readonly PUBLIC_API_URL?: string;
  /** '1' liga as notificações (F6). Desligada por padrão */
  readonly PUBLIC_NOTIFICACOES?: string;
  /** '1' liga a moderação (C2): reportar, /moderacao e /contestar. Desligada por padrão */
  readonly PUBLIC_MODERACAO?: string;
  /** '1' liga OAuth, recuperação de senha e verificação de email (Etapa 6) */
  readonly PUBLIC_OAUTH?: string;
  /** '1' liga o fechamento do ciclo da ideia: virou projeto, desarquivar, atualizações, nota de mudança */
  readonly PUBLIC_CICLO?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

export {};
