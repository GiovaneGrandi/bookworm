// RN-DS.10 (alvo de toque ≥ 48×48dp) e RN-DS.11 (texto nunca abaixo de 4,5:1) — assertivas
// automatizadas sobre os tokens de `@bookworm/design`. Contraste recalculado aqui pela fórmula
// WCAG 2.1 padrão (não há cálculo em cache no `.claude/retomada.md` desta rodada) contra os
// mesmos oito materiais que `design-system.md` §2.2 já reporta calculados — se este teste e a
// tabela da spec divergirem, um dos dois está errado.

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { superficie } from '@bookworm/design';

function luminanciaRelativa(hex: string): number {
  const limpo = hex.replace('#', '');
  const canal = (i: number) => {
    const c = Number.parseInt(limpo.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * canal(0) + 0.7152 * canal(2) + 0.0722 * canal(4);
}

function contraste(hexA: string, hexB: string): number {
  const la = luminanciaRelativa(hexA);
  const lb = luminanciaRelativa(hexB);
  const [maior, menor] = la >= lb ? [la, lb] : [lb, la];
  return (maior + 0.05) / (menor + 0.05);
}

describe('RN-DS.11 — texto nunca abaixo de 4,5:1', () => {
  it.each(Object.entries(superficie))('tinta contra fundo em `%s` ≥ 4,5:1', (_nome, sup) => {
    // `vegetal` é translúcido na spec (fundo: 'transparent') — sem par de cor sólida para medir,
    // fora do escopo deste teste (§2.2 também não lista um número para ela).
    if (sup.fundo === 'transparent') return;
    expect(contraste(sup.tinta, sup.fundo)).toBeGreaterThanOrEqual(4.5);
  });
});

describe('RN-DS.10 — alvo de toque mínimo 48×48dp', () => {
  // Jest transforma para CommonJS — `__dirname` está disponível, ao contrário de
  // `import.meta.url` (Vitest, usado em packages/core, roda ESM nativo).
  const raizSrc = join(__dirname, '..', '..', 'src');

  function listarArquivos(dir: string): string[] {
    const arquivos: string[] = [];
    for (const entrada of readdirSync(dir)) {
      const caminho = join(dir, entrada);
      if (statSync(caminho).isDirectory()) arquivos.push(...listarArquivos(caminho));
      else if (caminho.endsWith('.tsx')) arquivos.push(caminho);
    }
    return arquivos;
  }

  it('todo componente com `Pressable` declara altura ≥ 48dp (minHeight/minWidth ≥ 48 ou hitSlop)', () => {
    const arquivos = listarArquivos(raizSrc);
    const semAlvoDeToque: string[] = [];

    for (const arquivo of arquivos) {
      const conteudo = readFileSync(arquivo, 'utf-8');
      if (!conteudo.includes('<Pressable')) continue;

      const alturaOuLarguraSuficiente = [
        ...conteudo.matchAll(/min(?:Height|Width):\s*(\d+(?:\.\d+)?)/g),
      ].some(([, valor]) => Number(valor) >= 48);
      const declaraAlvoDeToque = alturaOuLarguraSuficiente || /hitSlop/.test(conteudo);
      if (!declaraAlvoDeToque) semAlvoDeToque.push(arquivo);
    }

    expect(semAlvoDeToque).toEqual([]);
  });
});
