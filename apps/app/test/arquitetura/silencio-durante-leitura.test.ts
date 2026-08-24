// RN-02.13b/RN-04.10c — "ao cumprir, nada aparece": sem contador, sem badge, sem sobreposição,
// sem som, durante a leitura. `apps/app/app/leitor.tsx` monta `react-native-readium` (WebView
// nativa) e chama `expo-sqlite` de verdade — renderizá-la sob Jest não é viável neste projeto
// (nenhum dos dois é mockado, ver `jest.setup.js`). A varredura estática, no espírito de
// `packages/core/test/arquitetura/*`, é o contra-teste possível: falha se a tela de leitura importar
// qualquer componente de celebração/contador/badge, ou chamar `avaliarEAtualizarHoje` fora dos
// pontos de encerramento de sessão (onde ela já roda hoje, RN-03.6).
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const CAMINHO_LEITOR = join(__dirname, '..', '..', 'app', 'leitor.tsx');
const conteudoDoLeitor = readFileSync(CAMINHO_LEITOR, 'utf-8');

const COMPONENTES_DE_CELEBRACAO = [
  'BwCelebracao',
  'BwNumeroCelebracao',
  'BwDadoTabular',
  'BwCarimbo',
];

describe('RN-02.13b/RN-04.10c — silêncio durante a leitura', () => {
  it('a tela de leitura não importa nenhum componente de celebração/contador/badge', () => {
    const importados = COMPONENTES_DE_CELEBRACAO.filter((nome) => conteudoDoLeitor.includes(nome));
    expect(importados).toEqual([]);
  });

  it('avaliarEAtualizarHoje só é chamada nos dois pontos de encerramento de sessão', () => {
    const ocorrencias = conteudoDoLeitor.split('avaliarEAtualizarHoje(').length - 1;
    // Import + rede de segurança do unmount (RN-03.6) + `aoFecharComResumo` — nunca durante o
    // ciclo de leitura em si (`aoMudarLocalizacao`, sinais de sessão etc.).
    expect(ocorrencias).toBe(2);
  });
});
