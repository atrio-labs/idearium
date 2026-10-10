/* GET /robots.txt — aponta o sitemap e fecha as telas de sessão e escrita */
import type { APIRoute } from 'astro';
import { origemPublica } from '../lib/site';

/* Cada caminho vale também sob /en (o prefixo do inglês). */
const BLOQUEADOS = [
  '/entrar', '/perfil', '/rfcs/nova', '/rfcs/*/editar', '/notificacoes',
  '/moderacao', '/reportar', '/excluir-conta',
];

export const GET: APIRoute = ({ url }) => {
  const regras = [
    ...BLOQUEADOS.flatMap((c) => [`Disallow: ${c}`, `Disallow: /en${c}`]),
    'Disallow: /api/',
    'Disallow: /en/api/',
  ];
  const corpo = ['User-agent: *', ...regras, '', `Sitemap: ${origemPublica(url)}/sitemap.xml`, ''].join('\n');
  return new Response(corpo, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  });
};
