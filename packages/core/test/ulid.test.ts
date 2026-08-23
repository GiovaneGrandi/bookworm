// RN-ST.9 — ULID gerado no cliente no instante do fato.
import { describe, expect, it } from 'vitest';
import { criarUlid } from '../src/ulid.js';

describe('RN-ST.9', () => {
  it('gera um ULID válido: 26 caracteres, Crockford base32', () => {
    const id = criarUlid();
    expect(id).toMatch(/^[0-9A-HJKMNP-TV-Z]{26}$/);
  });

  it('dois ULIDs gerados em sequência nunca colidem', () => {
    const ids = new Set(Array.from({ length: 1000 }, () => criarUlid()));
    expect(ids.size).toBe(1000);
  });

  it('ULIDs gerados em sequência ordenam cronologicamente (prefixo de tempo crescente)', () => {
    const a = criarUlid();
    const b = criarUlid();
    expect(a <= b).toBe(true);
  });
});
