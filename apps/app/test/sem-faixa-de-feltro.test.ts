import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// Desde a barra de navegação (RN-DV.11), voltar à mesa é o item "Mesa" da barra ou o voltar do
// sistema. A faixa de feltro "pousar na mesa" no alto das telas saiu em 25/11/2026.
function fontes(dir: string): string[] {
  return readdirSync(dir).flatMap((nome) => {
    const caminho = join(dir, nome);
    if (statSync(caminho).isDirectory()) return fontes(caminho);
    return /\.tsx?$/.test(nome) ? [caminho] : [];
  });
}

const raiz = join(__dirname, '..');
const TODAS = [...fontes(join(raiz, 'app')), ...fontes(join(raiz, 'src'))];

describe('Telas · sem a faixa de feltro no alto', () => {
  it.each(TODAS.map((f) => [f.slice(raiz.length + 1), f]))('%s não usa a faixa', (_, f) => {
    const fonte = readFileSync(f, 'utf-8');
    expect(fonte).not.toMatch(/BwFeltroRetorno|pousar na mesa/);
  });
});
