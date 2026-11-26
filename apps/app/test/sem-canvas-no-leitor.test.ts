import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// Um <Canvas> da Skia é uma superfície GL. Por cima da WebView do Readium, montar e desmontar uma
// delas (a barra sai de cena quando o painel de leitura abre) derrubava o emulador inteiro
// (24/11/2026). No leitor e no que ele monta, desenho Skia só como imagem rasterizada na CPU.
const NO_LEITOR = [
  'app/leitor/[id].tsx',
  'src/componentes/BwBarraDeNavegacao.tsx',
  'src/componentes/BwPainelLeitura.tsx',
  'src/componentes/BwIconesDoLeitor.tsx',
  'src/componentes/iconeEmImagem.ts',
  'src/componentes/BwDeslizante.tsx',
  'src/componentes/BwEscolha.tsx',
  'src/componentes/BwAncora.tsx',
];

describe('Leitor · nenhuma superfície GL por cima da página', () => {
  it.each(NO_LEITOR)('%s não usa <Canvas>', (arquivo) => {
    const fonte = readFileSync(join(__dirname, '..', arquivo), 'utf-8');
    expect(fonte).not.toMatch(/<Canvas[\s>]/);
  });
});
