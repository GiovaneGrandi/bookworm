// RN-DS.1, RN-ST.3 — "nenhum componente de React Native lê um pigmento diretamente; todo
// componente declara sua superfície via prop e o Unistyles resolve o tema." Varredura estática:
// falha se qualquer arquivo de `src/` (fora de `tema/unistyles.ts`, o único ponto autorizado a
// ler `pigmento`) importar `pigmento` de `@bookworm/design`, ou repetir o **valor literal** de um
// pigmento nomeado. Não bane hex/rgba em geral — um efeito de luz (P-2) ou o relevo de um botão
// (P-9) não são pigmento de marca, só primitiva visual sem token dedicado ainda.

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { pigmento } from '@bookworm/design';

// Jest transforma para CommonJS (jest-expo/babel-jest) — `__dirname` está disponível, ao
// contrário de `import.meta.url` (Vitest, usado em packages/core, roda ESM nativo).
const raizSrc = join(__dirname, '..', '..', 'src');

// Único arquivo autorizado a importar `pigmento` — é ele que monta `theme.sup`/`theme.grifo`
// (RN-DS.1: "só uma superfície pode lê-lo").
const ARQUIVO_AUTORIZADO = join(raizSrc, 'tema', 'unistyles.ts');

// `design-system.md` §6.5: "a cena do jardim não é componente" — é arte ilustrada 2D com paleta
// própria (`mvp.md` §9), não uma peça que declara superfície. A coincidência de valor com um
// pigmento nomeado (a folhagem viva deriva de `--verde-tinta` de propósito, RN-04.23) não é o
// sintoma que RN-DS.1 persegue.
const ARQUIVOS_ISENTOS_DE_PIGMENTO_LITERAL = [join(raizSrc, 'jardim', 'paletaPlanta.ts')];

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

const PADRAO_IMPORT_PIGMENTO =
  /import\s*\{[^}]*\bpigmento\b[^}]*\}\s*from\s*['"]@bookworm\/design['"]/;

// Valores literais dos pigmentos nomeados (hex `#2f5d3a` e rgba `rgba(36,31,25,.72)`) — repetir
// qualquer um deles num componente é o sintoma exato que RN-DS.1 proíbe, ainda que sem `import`.
const VALORES_DE_PIGMENTO = Object.values(pigmento);

describe('RN-DS.1, RN-ST.3', () => {
  const arquivos = listarArquivos(raizSrc).filter((a) => a !== ARQUIVO_AUTORIZADO);
  const conteudoPorArquivo = arquivos.map((a) => ({
    arquivo: a,
    conteudo: readFileSync(a, 'utf-8'),
  }));

  it('nenhum componente importa `pigmento` de @bookworm/design diretamente', () => {
    const violacoes = conteudoPorArquivo
      .filter(({ conteudo }) => PADRAO_IMPORT_PIGMENTO.test(conteudo))
      .map(({ arquivo }) => arquivo);
    expect(violacoes).toEqual([]);
  });

  it('nenhum componente repete o valor literal de um pigmento nomeado — só via theme.sup/theme.semantico/theme.grifo', () => {
    const violacoes = conteudoPorArquivo
      .filter(({ arquivo }) => !ARQUIVOS_ISENTOS_DE_PIGMENTO_LITERAL.includes(arquivo))
      .filter(({ conteudo }) => VALORES_DE_PIGMENTO.some((valor) => conteudo.includes(valor)))
      .map(({ arquivo }) => arquivo);
    expect(violacoes).toEqual([]);
  });
});
