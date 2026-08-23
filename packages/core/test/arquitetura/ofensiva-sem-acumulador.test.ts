// RN-04.11 — a ofensiva é derivada, nunca incrementada. `mvp.md` §7 pede isso "verificável por
// leitura do diff"; este teste torna a leitura automática: nenhum arquivo de `src/ofensiva`
// incrementa um campo de estado com `++`/`--`/`+=`/`-=` fora de um `reduce`/laço de agregação
// local. A distinção real não é sintática (todo `reduce` também soma), é semântica — então em vez
// de banir o operador, o teste varre por um padrão mais específico e realista de bug: escrita
// direta tipo `objeto.campo++` ou `objeto.campo += 1` num campo de contagem (`contagem`,
// `estoque`, `acervo`), que é a forma como um contador incremental persistido vazaria para este
// pacote puro.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const raizOfensiva = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'src', 'ofensiva');

function listarArquivosTs(dir: string): string[] {
  const arquivos: string[] = [];
  for (const entrada of readdirSync(dir)) {
    const caminho = join(dir, entrada);
    if (statSync(caminho).isDirectory()) arquivos.push(...listarArquivosTs(caminho));
    else if (caminho.endsWith('.ts') && !caminho.endsWith('.test.ts')) arquivos.push(caminho);
  }
  return arquivos;
}

// `objeto.campo++`, `objeto.campo--`, `objeto.campo += x` ou `objeto.campo -= x` num campo cujo
// nome sugere contagem persistida — variável local (`atual++`, `acervo += 1` dentro de um laço de
// derivação) não bate no padrão porque não tem o prefixo `objeto.`.
const PADRAO_ACUMULADOR_PERSISTIDO =
  /\b\w+\.(contagem\w*|estoque\w*|acervo\w*|melhorMarca)\s*(\+\+|--|\+=|-=)/;

describe('RN-04.11, mvp.md §7', () => {
  it('nenhuma função de packages/core/src/ofensiva escreve incrementalmente num campo de estado', () => {
    const arquivos = listarArquivosTs(raizOfensiva);
    const violacoes: string[] = [];

    for (const arquivo of arquivos) {
      const conteudo = readFileSync(arquivo, 'utf-8');
      if (PADRAO_ACUMULADOR_PERSISTIDO.test(conteudo)) violacoes.push(arquivo);
    }

    expect(violacoes).toEqual([]);
  });
});
