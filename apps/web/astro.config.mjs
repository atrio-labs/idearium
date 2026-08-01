// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import node from '@astrojs/node';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  /* ================================================================
     RENDERIZAÇÃO HÍBRIDA
     ================================================================
     `output: 'server'` liga o SSR, e cada página pública declara
     `export const prerender = true` pra voltar a ser estática.

     Por que híbrido e não estático puro: as telas com sessão precisam
     ler o cookie httpOnly no servidor. Guardar o refresh token em
     localStorage jogaria fora a rotação e a revogação que a API
     implementa, num app que renderiza texto escrito por usuários.

     Por que híbrido e não SSR puro: átrio, RFCs, labs e perfis são
     bem comum público e precisam indexar em buscador; saem como HTML
     pronto, sem custo de runtime.

     Consequência pro deploy: `npm run build:web` passa a gerar um
     servidor Node em dist/server/entry.mjs, não só arquivos soltos.
     Roda com `node dist/server/entry.mjs`.
     ================================================================ */
  output: 'server',
  adapter: node({ mode: 'standalone' }),

  integrations: [react()],

  vite: {
    plugins: [tailwindcss()]
  }
});
