// RN-TEL.48 — relógio é parâmetro de entrada, nunca variável global. Nenhuma função de
// `sessao/` pode ler `Date.now`, `new Date()` sem argumento, `performance.now` ou qualquer outra
// fonte de tempo real: os carimbos vêm sempre do traço. `dividirNaViradaDoDia` usa `new Date(ms)`
// só para formatar um carimbo já recebido — isso é permitido; a regra proíbe *ler* o relógio, não
// manipular um valor que já veio de fora.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const raizSessao = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'src', 'sessao');

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
// do relógio — só `Date.now(` e `new Date()` (sem argumento) leem o relógio real.
const PADRAO_LEITURA_DE_RELOGIO = /Date\.now\s*\(|new\s+Date\s*\(\s*\)|performance\.now\s*\(/g;

describe('RN-TEL.48', () => {
  it('nenhuma função de packages/core/src/sessao lê o relógio do sistema', () => {
    const arquivos = listarArquivosTs(raizSessao);
    const violacoes: string[] = [];

    for (const arquivo of arquivos) {
      const conteudo = readFileSync(arquivo, 'utf-8');
      if (PADRAO_LEITURA_DE_RELOGIO.test(conteudo)) violacoes.push(arquivo);
    }

    expect(violacoes).toEqual([]);
  });
});
