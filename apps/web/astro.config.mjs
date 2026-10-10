// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import node from '@astrojs/node';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  /* ================================================================
     RENDERIZAÇÃO: TUDO SSR, COM CACHE HTTP NAS PÁGINAS PÚBLICAS
     ================================================================
     Nenhuma página é pré-renderizada. Antes, átrio, RFCs, labs e
     perfis saíam estáticos do build; deixaram de sair porque:

       - conteúdo novo (uma RFC, um perfil) aparece sem rebuild. No
         estático, a ideia publicada só existia no próximo deploy, e um
         perfil só ganhava página se a pessoa já fosse autora;
       - o runtime Node já era obrigatório pela sessão: as telas com
         login leem o cookie httpOnly no servidor (guardar o refresh
         token em localStorage jogaria fora a rotação e a revogação que
         a API implementa). O estático não poupava a infra de nada;
       - o idioma vem do prefixo /en, resolvido no middleware, e isso
         só funciona com requisição.

     O que o estático dava de graça — HTML pronto, barato, indexável —
     volta pelo cache HTTP: página pública sem sessão sai com
     `Cache-Control: public, s-maxage=60, stale-while-revalidate=600`
     (src/lib/cache.ts). Continua sendo HTML completo pro buscador.

     Consequência pro deploy: `npm run build:web` gera um servidor Node
     em dist/server/entry.mjs. Roda com `node dist/server/entry.mjs`.
     O build não chama mais a API.
     ================================================================ */
  output: 'server',
  adapter: node({ mode: 'standalone' }),

  integrations: [react()],

  vite: {
    plugins: [tailwindcss()]
  }
});
