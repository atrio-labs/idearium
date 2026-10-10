/* Bloqueador de acentos: palavra pt-BR comum escrita sem acento no
   texto da interface (src/i18n/*.ts, valores pt-BR) ou nas páginas
   institucionais (src/content/institucional/pt-BR/*.md).

   Só entra palavra que, sem acento, não existe em português (ou quase
   nunca aparece): "esta" e "e" ficam de fora porque são palavras
   válidas. Endereço, caminho, slug, código entre crases e comentário
   HTML são ignorados. A falha lista arquivo:chave:palavra. */
import { describe, expect, it } from 'vitest';

const SEM_ACENTO = [
  'nao', 'voce', 'voces', 'sessao', 'sessoes', 'versao', 'versoes', 'acao', 'acoes',
  'informacao', 'informacoes', 'publicacao', 'inscricao', 'inscricoes', 'discussao',
  'ate', 'tambem', 'ja', 'so', 'pagina', 'paginas', 'codigo', 'conteudo', 'numero',
  'historico', 'governanca', 'transparencia', 'entao', 'sao', 'alem', 'atraves',
  'possivel', 'disponivel', 'unico', 'unica', 'proximo', 'proxima',
  'notificacao', 'notificacoes', 'laboratorio', 'laboratorios', 'usuario', 'usuarios',
  'saude', 'educacao', 'participacao', 'colaboracao', 'construcao', 'solucao', 'solucoes',
];

/* Chaves cujo valor é um @username de exemplo: nome de usuário não
   aceita acento, então "voce" ali está certo. */
const CHAVES_IGNORADAS = new Set(['conta.criar.username.exemplo', 'conta.pseudonimo.exemplo']);

const PADRAO =new RegExp(`(?<![\\p{L}\\p{N}_/-])(${SEM_ACENTO.join('|')})(?![\\p{L}\\p{N}_/-])`, 'giu');

/** Tira o que não é texto corrido: código, comentário, endereço, caminho, {variável}. */
function textoCorrido(s: string): string {
  return s
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/\]\([^)]*\)/g, '] ')
    .replace(/\b(?:https?|mailto):[^\s)>"']+/gi, ' ')
    .replace(/(?:^|\s)\/[\w\-/.?=&#]+/g, ' ')
    .replace(/\{\w+\}/g, ' ');
}

const achar = (s: string) => [...textoCorrido(s).matchAll(PADRAO)].map((m) => m[1]);

const dicionarios = import.meta.glob<{ default: { 'pt-BR': Record<string, string> } }>(
  '../../src/i18n/*.ts',
  { eager: true },
);

const institucional = import.meta.glob<string>('../../src/content/institucional/pt-BR/**/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
});

const curto = (caminho: string) => caminho.replace(/^(\.\.\/)+/, '');

describe('acentuação pt-BR', () => {
  it('a lista de varredura acha o que deve achar', () => {
    expect(achar('Não, voce nao sabe; ja era.')).toEqual(['voce', 'nao', 'ja']);
    expect(achar('veja /rfcs/nao-existe e `nao` e https://x.org/sessao')).toEqual([]);
    expect(achar('Esta é a página. Até já.')).toEqual([]);
  });

  it('dicionários pt-BR (src/i18n/*.ts)', () => {
    const achados: string[] = [];
    for (const [arquivo, mod] of Object.entries(dicionarios)) {
      for (const [chave, valor] of Object.entries(mod.default['pt-BR'])) {
        if (CHAVES_IGNORADAS.has(chave)) continue;
        for (const palavra of achar(valor)) achados.push(`${curto(arquivo)}:${chave}:${palavra}`);
      }
    }
    expect(achados).toEqual([]);
  });

  it('institucional pt-BR (src/content/institucional/pt-BR)', () => {
    expect(Object.keys(institucional).length).toBeGreaterThan(0);
    const achados: string[] = [];
    for (const [arquivo, conteudo] of Object.entries(institucional)) {
      conteudo.split('\n').forEach((linha, i) => {
        for (const palavra of achar(linha)) achados.push(`${curto(arquivo)}:${i + 1}:${palavra}`);
      });
    }
    expect(achados).toEqual([]);
  });
});
