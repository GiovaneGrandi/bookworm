import { describe, expect, it } from 'vitest';
import {
  deveAgendarLembreteDiario,
  deveAgendarOfensivaEmRisco,
} from '../../src/notificacoes/decidirNotificacoesDoDia.js';

describe('RN-04.30 — lembrete diário só enquanto a meta não foi cumprida', () => {
  it('agenda quando a meta do dia ainda não foi cumprida', () => {
    expect(deveAgendarLembreteDiario(false)).toBe(true);
  });

  it('não agenda quando a meta já foi cumprida hoje', () => {
    expect(deveAgendarLembreteDiario(true)).toBe(false);
  });
});

describe('RN-04.31 — ofensiva em risco só para quem tem algo em jogo', () => {
  it('agenda com ofensiva ativa de 3 dias e meta não cumprida', () => {
    expect(deveAgendarOfensivaEmRisco(false, 3)).toBe(true);
  });

  it('agenda com ofensiva bem além do mínimo', () => {
    expect(deveAgendarOfensivaEmRisco(false, 100)).toBe(true);
  });

  it('não agenda com ofensiva de 1 ou 2 dias — RN-01.16, não é cobrança para quem começou agora', () => {
    expect(deveAgendarOfensivaEmRisco(false, 1)).toBe(false);
    expect(deveAgendarOfensivaEmRisco(false, 2)).toBe(false);
  });

  it('não agenda com ofensiva zerada (dormente)', () => {
    expect(deveAgendarOfensivaEmRisco(false, 0)).toBe(false);
  });

  it('não agenda se a meta do dia já foi cumprida, mesmo com ofensiva alta', () => {
    expect(deveAgendarOfensivaEmRisco(true, 50)).toBe(false);
  });
});
