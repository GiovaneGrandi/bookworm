import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import * as core from '../src/index';

// RN-ST.7 — `packages/core` é TypeScript puro, sem I/O: nada de React, React Native, Expo,
// banco, rede ou sistema de arquivos. Quem faz I/O é o app; o núcleo só calcula.
const PROIBIDOS = [/^react/, /^expo/, /^@expo\//, /^drizzle/, /^node:/, /^fs$/, /^path$/];

function arquivosTs(dir: string): string[] {
  return readdirSync(dir).flatMap((nome) => {
    const caminho = join(dir, nome);
    if (statSync(caminho).isDirectory()) return arquivosTs(caminho);
    return caminho.endsWith('.ts') ? [caminho] : [];
  });
}

describe('RN-ST.7 · packages/core é puro', () => {
  const fontes = arquivosTs(join(import.meta.dirname, '..', 'src'));

  it('tem fonte para verificar', () => {
    expect(fontes.length).toBeGreaterThan(0);
  });

  it('nenhum arquivo de src importa módulo de I/O ou de UI', () => {
    const violacoes = fontes.flatMap((arquivo) => {
      const texto = readFileSync(arquivo, 'utf8');
      const importados = [...texto.matchAll(/from\s+['"]([^'"]+)['"]/g)].map((m) => m[1] ?? '');
      return importados
        .filter((mod) => PROIBIDOS.some((re) => re.test(mod)))
        .map((mod) => `${arquivo}: ${mod}`);
    });
    expect(violacoes).toEqual([]);
  });
});

describe('fumaça · o pacote carrega', () => {
  it('expõe o nome do núcleo', () => {
    expect(core.NUCLEO).toBe('@bookworm/core');
  });
});
