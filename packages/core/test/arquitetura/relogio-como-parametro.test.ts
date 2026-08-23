// RN-TEL.48 — relógio é parâmetro de entrada, nunca variável global. Nenhuma função de
// `sessao/` ou `ofensiva/` pode ler `Date.now`, `new Date()` sem argumento, `performance.now` ou
// qualquer outra fonte de tempo real: os carimbos e datas vêm sempre de fora (traço, `hoje`,
// `mesReferencia`). `dividirNaViradaDoDia` e `alterarMeta` usam `new Date(valor)` só para
// manipular um carimbo ou dia já recebido — isso é permitido; a regra proíbe *ler* o relógio, não
// operar sobre um valor que já veio de fora. O mesmo princípio de `04-streaks-e-jardim.md`
// (ofensiva derivada, RN-04.11) depende disso: sem relógio real dentro da função, recalcular duas
// vezes com o mesmo `hoje` dá sempre o mesmo resultado.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const raizSrc = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'src');
const modulos = ['sessao', 'ofensiva'].map((m) => join(raizSrc, m));

function listarArquivosTs(dir: string): string[] {
  const arquivos: string[] = [];
  for (const entrada of readdirSync(dir)) {
    const caminho = join(dir, entrada);
    if (statSync(caminho).isDirectory()) arquivos.push(...listarArquivosTs(caminho));
    else if (caminho.endsWith('.ts')) arquivos.push(caminho);
  }
  return arquivos;
}

// `new Date(` seguido de algo diferente de vazio é manipulação de um valor recebido, não leitura
// do relógio — só `Date.now(` e `new Date()` (sem argumento) leem o relógio real. Sem a flag `g`
// de propósito: `.test()` num regex global mantém `lastIndex` entre chamadas, e reusar a mesma
// instância num loop sobre vários arquivos esconderia violações nos arquivos seguintes.
const PADRAO_LEITURA_DE_RELOGIO = /Date\.now\s*\(|new\s+Date\s*\(\s*\)|performance\.now\s*\(/;

describe('RN-TEL.48', () => {
  it('nenhuma função de packages/core/src/{sessao,ofensiva} lê o relógio do sistema', () => {
    const arquivos = modulos.flatMap(listarArquivosTs);
    const violacoes: string[] = [];

    for (const arquivo of arquivos) {
      const conteudo = readFileSync(arquivo, 'utf-8');
      if (PADRAO_LEITURA_DE_RELOGIO.test(conteudo)) violacoes.push(arquivo);
    }

    expect(violacoes).toEqual([]);
  });
});
