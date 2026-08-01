/// <reference path="../.astro/types.d.ts" />

import type { UsuarioSessao } from './lib/sessao';

declare global {
  namespace App {
    interface Locals {
      /** preenchido pelo middleware; null quando ninguém está logado */
      usuario: UsuarioSessao | null;
    }
  }
}

interface ImportMetaEnv {
  /** URL base da API. Default http://localhost:3000 */
  readonly PUBLIC_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

export {};
