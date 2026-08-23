// RN-ST.7 — Nenhuma lógica de packages/core importa de apps/app ou apps/api. Teste de
// arquitetura, não de code review: varre todo import/require de packages/core/src e falha se
// algum caminho apontar para apps/*.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const raizSrc = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'src');

function listarArquivosTs(dir: string): string[] {
  const arquivos: string[] = [];
  for (const entrada of readdirSync(dir)) {
    const caminho = join(dir, entrada);
    if (statSync(caminho).isDirectory()) arquivos.push(...listarArquivosTs(caminho));
    else if (caminho.endsWith('.ts')) arquivos.push(caminho);
  }
  return arquivos;
}

// Só examina declarações de import/require de verdade — um comentário que mencione "apps/app"
// (para explicar uma decisão, por exemplo) não é uma violação.
const PADRAO_IMPORT_OU_REQUIRE = /(?:import[^;]*?from\s+|require\()\s*['"]([^'"]+)['"]/g;

describe('RN-ST.7', () => {
  it('nenhum arquivo de packages/core/src importa de apps/*', () => {
    const arquivos = listarArquivosTs(raizSrc);
    const violacoes: string[] = [];

    for (const arquivo of arquivos) {
      const conteudo = readFileSync(arquivo, 'utf-8');
      for (const match of conteudo.matchAll(PADRAO_IMPORT_OU_REQUIRE)) {
        const caminho = match[1];
        if (caminho && /(^|\/)apps\/(app|api)(\/|$)/.test(caminho)) {
          violacoes.push(`${arquivo} → "${caminho}"`);
        }
      }
    }

    expect(violacoes).toEqual([]);
  });
});
