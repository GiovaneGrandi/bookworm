// Comparação automatizada (não visual) contra os valores literais de
// specs/design-system.md §2.1 — Definição de pronto do Estágio 2 do plano do primeiro protótipo.
// Se este teste falhar, ou o token TypeScript divergiu da spec, ou a spec mudou e o token
// TypeScript precisa acompanhar — nunca o contrário sem decisão explícita.
import { describe, expect, it } from 'vitest';
import { pigmento } from '../src/pigmentos.js';

describe('pigmentos batem com design-system.md §2.1', () => {
  it('tintas e papéis', () => {
    expect(pigmento.tinta).toBe('#241f19');
    expect(pigmento.tinta70).toBe('rgba(36,31,25,.72)');
    expect(pigmento.tinta50).toBe('rgba(36,31,25,.52)');
    expect(pigmento.tinta32).toBe('rgba(36,31,25,.34)');
    expect(pigmento.tinta16).toBe('rgba(36,31,25,.16)');
    expect(pigmento.papel).toBe('#f3ead9');
    expect(pigmento.papelFundo).toBe('#efe3ce');
    expect(pigmento.grafite).toBe('#6f6858');
  });

  it('acento — a identidade', () => {
    expect(pigmento.verdeTinta).toBe('#2f5d3a');
    expect(pigmento.ambar).toBe('#e6c15c');
    expect(pigmento.mesa).toBe('#1e2320');
  });

  it('4 pigmentos de grifo', () => {
    expect(pigmento.pigAmbar).toBe('#e7c25e');
    expect(pigmento.pigOliva).toBe('#a8b07a');
    expect(pigmento.pigTinta).toBe('#93a9c0');
    expect(pigmento.pigCarmim).toBe('#d79aa2');
  });
});
