// Definição de pronto do Estágio 2: "o gerador de CSS roda e produz um :root que bate com os
// pigmentos de design-system.md §2.1 — comparação automatizada, não visual". Este teste monta o
// mesmo :root que o script gera (mesmas funções) e compara linha a linha com o texto literal da
// spec, sem depender de rodar o script e ler um arquivo do disco.
import { describe, expect, it } from 'vitest';
import { chaveParaVarCss } from '../src/chaveParaVarCss.js';
import { pigmento } from '../src/pigmentos.js';

describe('gerador de CSS — :root bate com design-system.md §2.1', () => {
  it('cada variável CSS gerada é exatamente a que a spec nomeia', () => {
    const linhas = Object.entries(pigmento).map(
      ([chave, valor]) => `${chaveParaVarCss(chave)}: ${valor};`
    );

    expect(linhas).toEqual([
      '--tinta: #241f19;',
      '--tinta-70: rgba(36,31,25,.72);',
      '--tinta-50: rgba(36,31,25,.52);',
      '--tinta-32: rgba(36,31,25,.34);',
      '--tinta-16: rgba(36,31,25,.16);',
      '--papel: #f3ead9;',
      '--papel-fundo: #efe3ce;',
      '--grafite: #6f6858;',
      '--verde-tinta: #2f5d3a;',
      '--ambar: #e6c15c;',
      '--mesa: #1e2320;',
      '--pig-ambar: #e7c25e;',
      '--pig-oliva: #a8b07a;',
      '--pig-tinta: #93a9c0;',
      '--pig-carmim: #d79aa2;',
    ]);
  });
});
