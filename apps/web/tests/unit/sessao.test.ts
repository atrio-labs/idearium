import { describe, expect, it } from 'vitest';
import { destinoSeguro } from '../../src/lib/sessao';

const ORIGEM = 'http://localhost:4321';

describe('destinoSeguro', () => {
  it.each([
    ['/rfcs/x', '/rfcs/x'],
    ['/en/perfil', '/en/perfil'],
    ['/buscar?q=agua', '/buscar?q=agua'],
    ['/', '/'],
  ])('aceita caminho interno %s', (bruto, esperado) => {
    expect(destinoSeguro(bruto, ORIGEM)).toBe(esperado);
  });

  it.each([
    null,
    '',
    '//evil.com',
    '//evil.com/x',
    'http://evil.com',
    'https://evil.com/x',
    '/\\evil.com',
    '/\\/evil.com',
    '/\t/evil.com',
    'javascript:alert(1)',
    'JAVASCRIPT:alert(1)',
    'rfcs/x',
  ])('recusa %j', (bruto) => {
    expect(destinoSeguro(bruto, ORIGEM)).toBe('/');
  });

  it('descarta o fragmento e mantém a busca', () => {
    expect(destinoSeguro('/rfcs/x?a=1#c', ORIGEM)).toBe('/rfcs/x?a=1');
  });
});
