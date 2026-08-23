// RN-DS.4 — espaçamento só da escala tônica (3·6·9·12·18·27·36·54·81). Varredura estática: falha
// em qualquer `padding*`/`margin*`/`gap` de `StyleSheet.create` fora da escala. O levantamento de
// design-system.md §12 achou 49 valores distintos nos mockups por não haver rede nenhuma —
// esta é essa rede, aplicada desde a primeira linha de `apps/app`.

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { espacamento } from '@bookworm/design';

// Jest transforma para CommonJS — `__dirname` está disponível, ao contrário de
// `import.meta.url` (Vitest, usado em packages/core, roda ESM nativo).
const raizSrc = join(__dirname, '..', '..', 'src');
const raizApp = join(__dirname, '..', '..', 'app');

function listarArquivos(dir: string): string[] {
  const arquivos: string[] = [];
  for (const entrada of readdirSync(dir)) {
    const caminho = join(dir, entrada);
    if (statSync(caminho).isDirectory()) arquivos.push(...listarArquivos(caminho));
    else if (
      /\.(ts|tsx)$/.test(caminho) &&
      !caminho.endsWith('.test.ts') &&
      !caminho.endsWith('.test.tsx')
    ) {
      arquivos.push(caminho);
    }
  }
  return arquivos;
}

// Chaves de espaçamento que aceitam um número puro em `StyleSheet.create` — deliberadamente não
// inclui `borderWidth`/`borderRadius`/`fontSize`/`lineHeight`/`width`/`height`, que têm escalas
// próprias (design-system.md §4) e não fazem parte da escala tônica de §3.
const PROPRIEDADES_DE_ESPACAMENTO = [
  'padding',
  'paddingTop',
  'paddingBottom',
  'paddingLeft',
  'paddingRight',
  'paddingHorizontal',
  'paddingVertical',
  'margin',
  'marginTop',
  'marginBottom',
  'marginLeft',
  'marginRight',
  'marginHorizontal',
  'marginVertical',
  'gap',
  'rowGap',
  'columnGap',
];

const ESCALA = new Set<number>([0, ...(espacamento as readonly number[])]);

const PADRAO = new RegExp(
  `\\b(${PROPRIEDADES_DE_ESPACAMENTO.join('|')})\\s*:\\s*(-?\\d+(?:\\.\\d+)?)`,
  'g'
);

describe('RN-DS.4', () => {
  const arquivos = [...listarArquivos(raizSrc), ...listarArquivos(raizApp)];

  it('todo padding/margin/gap está na escala tônica (design-system.md §3)', () => {
    const violacoes: string[] = [];

    for (const arquivo of arquivos) {
      const conteudo = readFileSync(arquivo, 'utf-8');
      for (const match of conteudo.matchAll(PADRAO)) {
        const [, propriedade, valorTexto] = match;
        const valor = Number(valorTexto);
        if (!ESCALA.has(Math.abs(valor))) {
          violacoes.push(`${arquivo}: ${propriedade}: ${valor}`);
        }
      }
    }

    expect(violacoes).toEqual([]);
  });
});
