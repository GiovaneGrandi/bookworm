// RN-TEL.9 — "nunca contar duração por tick de timer". `setInterval`/`setTimeout` continuam
// permitidos como *checadores* periódicos (ex.: chamar `verificarIdle`), mas nenhum deles pode
// incrementar um contador que vira duração — toda duração nasce de uma subtração entre dois
// carimbos (`relogio.ts`). Varredura textual: qualquer callback de `setInterval`/`setTimeout` que
// contenha `+=` ou `++` é suspeito o bastante para falhar o teste e pedir revisão manual.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const DIR_SESSAO = join(__dirname, '..', '..', 'src', 'sessao');

function arquivosTypeScript(dir: string): string[] {
  return readdirSync(dir)
    .filter((nome) => nome.endsWith('.ts') && !nome.endsWith('.test.ts'))
    .map((nome) => join(dir, nome));
}

describe('RN-TEL.9 — nenhum timer acumula duração', () => {
  const arquivos = arquivosTypeScript(DIR_SESSAO);

  it('encontrou arquivos para varrer (o teste não passa vazio por engano)', () => {
    expect(arquivos.length).toBeGreaterThan(0);
  });

  for (const caminho of arquivos) {
    it(`${caminho.split(/[\\/]/).pop()} não incrementa contador dentro de setInterval/setTimeout`, () => {
      const conteudo = readFileSync(caminho, 'utf-8');
      const chamadas = conteudo.match(/set(Interval|Timeout)\([\s\S]*?\)/g) ?? [];
      for (const chamada of chamadas) {
        expect(chamada).not.toMatch(/\+=|\+\+/);
      }
    });
  }
});
