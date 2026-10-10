import { describe, expect, it } from 'vitest';
import { cachePublico } from '../../src/lib/cache';
import { dentroDaRequisicao, marcarFalhaDaApi } from '../../src/lib/requisicao';

const PUBLICO = 'public, s-maxage=60, stale-while-revalidate=600';
const PRIVADO = 'private, no-store';

/* Astro falso: só o que cachePublico lê e escreve. */
function astroFalso(opcoes: { metodo?: string; cookie?: string; usuario?: App.Locals['usuario'] } = {}) {
  const headers = new Headers();
  if (opcoes.cookie) headers.set('cookie', opcoes.cookie);
  return {
    request: new Request('http://localhost:4321/', { method: opcoes.metodo ?? 'GET', headers }),
    locals: { usuario: opcoes.usuario ?? null, lang: 'pt-BR', idiomaPreferido: null } as App.Locals,
    response: { headers: new Headers() },
  };
}

const cacheDe = (a: ReturnType<typeof astroFalso>) => a.response.headers.get('Cache-Control');

describe('cachePublico', () => {
  it('GET anônimo sem cookie é público', () => {
    const a = astroFalso();
    cachePublico(a, false);
    expect(cacheDe(a)).toBe(PUBLICO);
  });

  it('cookie que não é de sessão continua público', () => {
    const a = astroFalso({ cookie: 'idioma_sugestao=1; outro=x' });
    cachePublico(a, false);
    expect(cacheDe(a)).toBe(PUBLICO);
  });

  it.each(['id_acesso=abc', 'id_renova=abc', 'x=1; id_acesso=abc', 'x=1;id_renova=abc'])(
    'cookie de sessão (%s) é privado',
    (cookie) => {
      const a = astroFalso({ cookie });
      cachePublico(a, false);
      expect(cacheDe(a)).toBe(PRIVADO);
    },
  );

  it('cookie com nome parecido não conta como sessão', () => {
    const a = astroFalso({ cookie: 'xid_acesso=abc' });
    cachePublico(a, false);
    expect(cacheDe(a)).toBe(PUBLICO);
  });

  it('usuário em locals é privado mesmo sem cookie', () => {
    const a = astroFalso({ usuario: { id: '1', username: 'u', email: 'u@x', role: 'USER' } });
    cachePublico(a, false);
    expect(cacheDe(a)).toBe(PRIVADO);
  });

  it('POST é privado', () => {
    const a = astroFalso({ metodo: 'POST' });
    cachePublico(a, false);
    expect(cacheDe(a)).toBe(PRIVADO);
  });

  it('falha informada pela página é privada', () => {
    const a = astroFalso();
    cachePublico(a, true);
    expect(cacheDe(a)).toBe(PRIVADO);
  });

  it('sem argumento, usa a falha da API registrada na requisição', () => {
    const ok = astroFalso();
    dentroDaRequisicao('pt-BR', () => cachePublico(ok));
    expect(cacheDe(ok)).toBe(PUBLICO);

    const caiu = astroFalso();
    dentroDaRequisicao('pt-BR', () => {
      marcarFalhaDaApi();
      cachePublico(caiu);
    });
    expect(cacheDe(caiu)).toBe(PRIVADO);
  });
});
