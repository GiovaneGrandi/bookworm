// Gera o bloco :root de packages/design/dist/tokens.css a partir dos tokens TypeScript —
// RN-DS.19: mockup novo herda o catálogo, e este script é o que torna isso mecânico.
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chaveParaVarCss } from '../src/chaveParaVarCss.js';
import { pigmento } from '../src/pigmentos.js';

const linhas = Object.entries(pigmento).map(
  ([chave, valor]) => `  ${chaveParaVarCss(chave)}: ${valor};`
);

const css = `:root {\n${linhas.join('\n')}\n}\n`;

const aqui = dirname(fileURLToPath(import.meta.url));
const outDir = join(aqui, '..', 'dist');
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'tokens.css'), css, 'utf-8');
console.log('gerado:', join(outDir, 'tokens.css'));
