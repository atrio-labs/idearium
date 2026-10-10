/* Unitários das funções puras de src/lib. Não carrega o astro.config:
   os módulos testados não dependem de astro:* e o import.meta.env que
   usam já vem do Vite. Os e2e ficam em tests/e2e (Playwright). */
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/unit/**/*.test.ts'],
    environment: 'node',
  },
});
