/* Páginas institucionais (sobre, governança, conduta, transparência).
   Uma pasta por idioma, um arquivo por página. O id da entrada é o
   caminho sem extensão ("pt-BR/sobre"): o slug padrão do glob loader
   passa tudo para minúsculas e quebraria "pt-BR". */
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const institucional = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/institucional',
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
  schema: z.object({
    titulo: z.string(),
    descricao: z.string(),
    rascunho: z.boolean().default(false),
    atualizado: z.coerce.date(),
  }),
});

export const collections = { institucional };
