# Primeiras telas no emulador — mesa, bandeja, gaveta e leitor

> Plano aprovado em 17/11/2026, a executar por um agente. Status: **não iniciado**.

## Para o agente que executar
1. Ler `CLAUDE.md` (regras de trabalho, TDD, sincronização com o vault, retomada barata) e `.claude/retomada.md`.
2. Referências vinculantes, por sonda e não por leitura inteira: `specs/stack.md` (§3, §5, §6, §8, §12), `specs/direcao-visual.md` §9 (a Escrivaninha), `specs/design-system.md` §2 (tokens em 3 camadas) e a skill `bookworm-design-system`. A referência visual é `mockups/ideacao/direcao-b-escrivaninha.html`, **não** o catálogo, para mesa e navegação (`AJ-15`).
3. As decisões abaixo já foram tomadas com o usuário. Não reabri-las sem perguntar.
4. Parar ao fim de **cada** etapa para o usuário testar no emulador.

## Contexto
O código foi descartado em 17/11/2026, e a direção de interface adotada é **A Escrivaninha**
(`specs/direcao-visual.md` §9, `RN-DV.1`–`10`). O usuário quer as primeiras telas rodando no
emulador Android do PC: **a mesa** (tela inicial), **a bandeja** (importar arquivo), **a gaveta**
(escolher livro) e **o leitor com o painel de leitura**. O resto fica para depois. Stack vinculante:
`specs/stack.md` (Expo SDK 55, Expo Router, Unistyles 3, Skia, Reanimated 4, `react-native-readium`,
expo-sqlite + Drizzle, `packages/core` puro, TDD com Vitest).

Ambiente verificado: Node 20.17, pnpm 10.34, Java 17, Android SDK (API 34–36, NDK, cmake) e o AVD
**`BookWorm_API34`** já criado.

## Decisões fechadas (grilling, 17/11)
- **Q1** A mesa mostra só o que funciona (livro aberto, gaveta, bandeja) e a luminária. A composição já reserva o lugar de vaso, caderninho e pilha.
- **Q2** "Escolher livros" = **gaveta** (lendo / em pausa / quero ler). A Estante fica para depois.
- **Q3** Painel com os **10 controles** de `RN-02.16d` em três instrumentos: Luz (temperatura, brilho, tema), Letra (5 faces `RN-02.16g`, corpo, entrelinha) e Página (margens, alinhamento, âncora, retorno sensorial). O que o Readium não entregar vira overlay ou CSS injetado, e o resultado responde `Q-ST.2`.
- **Q4** Grifo, anotação e dicionário ficam para depois.
- **Q5** Importar e ler **EPUB e PDF**. O índice de caracteres é só para EPUB, e o PDF entra como "fotocópia", sem índice. O PDF será definido com calma depois.
- **Q6** O índice de caracteres entra **já agora**, em TDD, em `packages/core`, gerado na importação (`RN-ST.8`).
- **Q7** Acervo embutido com **3 EPUBs de domínio público em PT-BR** (Gutenberg), como segunda origem na bandeja.
- **Q8** Sem login. Tudo local em SQLite.
- **Q9** O monorepo começa só com `apps/app` e `packages/core` (sem `apps/api`).
- **Q10** **Build local** com `expo run:android` (é dev build, nunca Expo Go). O EAS fica para quando for distribuir.
- **Q11** Pode consultar o histórico do git (`1b903e5`) **só para configuração e armadilhas de build**, sem reaproveitar código de tela ou de lógica.
- **Q12** **Fidelidade alta** ao mockup B (`mockups/ideacao/direcao-b-escrivaninha.html`).
- **Q13** Primeira abertura: a bandeja em destaque com "Ponha um livro na mesa", a gaveta "vazia", a luminária acesa e o lugar do livro livre, sem placeholder.
- **Q14** Depois de importar: **"Abrir agora"** (vai ao leitor, o livro fica `lendo` e pousa na mesa) como principal, e **"Guardar em Quero ler"** como secundária.
- **Q15** Na gaveta, segurando o dedo no livro: **"pôr em pausa"** e **"tirar da gaveta"**. A mesa mostra no máximo os 2 `lendo` mais recentes (`RN-DV.4`).
- **Q16** A luminária é tingida pela temperatura do painel (`RN-DV.6`).
- **Q17** **4 etapas**, com verificação no emulador e parada para o usuário testar em cada uma.
- **Q18** Commit da remoção do código antigo (mais specs e mockups da ideação) em `master`, depois o branch `recomeco/primeiras-telas`, com um commit por etapa.
- **Q19** Só celular, em retrato.

## Estrutura
```
package.json · pnpm-workspace.yaml · turbo.json · tsconfig.base.json · biome.json
packages/core/            TS puro, sem I/O (RN-ST.7), Vitest
  src/indice/             montarIndiceEpub, posicaoEmCaracteres  (RN-02.10, RN-03.2, RN-ST.8)
  src/biblioteca/         transições de estado (RN-02.6, RN-02.6a), objetosNaMesa (RN-DV.4)
  src/leitura/            preferências: faixas, padrões por face (RN-02.16g), K→cor do overlay (RN-02.16a)
apps/app/                 Expo SDK 55, Expo Router
  app/_layout.tsx         fontes, Unistyles, migrações Drizzle; Stack sem abas (RN-DV.2)
  app/index.tsx           a mesa
  app/bandeja.tsx         importar
  app/gaveta.tsx          biblioteca
  app/leitor/[id].tsx     leitor (modo, não destino: RN-DS.18, RN-DV.9)
  src/tema/               tokens em 3 camadas: pigmento → superfície → papel (design-system.md §2, RN-ST.3)
  src/componentes/        BwMesa, BwObjetoMesa, BwFeltroRetorno, BwFolha, BwEtiqueta, BwPainelLeitura…
  src/dados/              schema Drizzle: obra, indice_caracteres, preferencias_leitura
  assets/acervo/          3 EPUBs PT-BR
```
Dados: `obra` (ULID, título, autor, formato epub|pdf, origem importada|dominio_publico, caminho,
tamanho, estado quero_ler|lendo|em_pausa, aberto_em, locator, progresso), o índice por recurso do
spine e `preferencias_leitura` (os 10 controles, um registro só).

## Execução por etapa

**E0 · Arrumação.** Commit em `master` da remoção do código antigo, das specs da Escrivaninha e de `mockups/ideacao/`. Criar o branch `recomeco/primeiras-telas`. Abrir no `.claude/retomada.md` a seção da operação.

**E1 · A casca roda.** Montar o monorepo, criar o app Expo SDK 55 (versões fixadas, com pelo menos 2 semanas de publicação) e consultar `git show 1b903e5:<arquivo>` para `app.json`, `metro.config.js`, `babel.config.js` e `plugins/withReadiumAndroidBuildFixes.js`, só pela configuração. Tokens Unistyles nas 3 camadas e as 6 fontes. As quatro rotas navegam a partir de uma mesa provisória, a faixa de feltro e o voltar do Android devolvem à mesa. Teste: Vitest de fumaça no core, e `expo run:android` no `BookWorm_API34` com screenshot por `adb exec-out screencap`.

**E2 · Bandeja e gaveta.** TDD primeiro em `packages/core`: `montarIndiceEpub` (testes nomeados por RN, `RN-ST.6`, com EPUBs-fixture pequenos), transições de estado e `objetosNaMesa`. Depois o app: `expo-document-picker`, cópia do arquivo para o diretório do app, metadados do OPF, índice persistido, PDF como "fotocópia" com o envelope honesto do mockup B, e o acervo de 3 EPUBs PT-BR baixados do Gutenberg e conferidos contra `montarIndiceEpub`. Atualizar `specs/acervo-inicial.md` e copiar para o vault. Gaveta com os três grupos, segurar o dedo para pausar ou remover, e a mesa vazia (Q13). Teste: Vitest verde; no emulador, `adb push` de um EPUB e um PDF de teste para `Download`, importar os dois, importar do acervo, fechar e reabrir o app e conferir que a gaveta persiste.

**E3 · O leitor.** `react-native-readium` (fixar versão, `Q-ST.1`), abrir EPUB e PDF, paginar, salvar o locator a cada mudança e retomar na posição ao reabrir. O painel em meia tela, com Luz, Letra e Página, os 10 controles, "↺ esta aba" e "↺ tudo ao padrão", e pré-visualização ao vivo (`RN-02.16e`). Temperatura como overlay contínuo de 2.700 a 6.500 K (padrão 4.200), retorno sensorial com `expo-haptics` e âncora em três níveis (nada / só o fio / fio e página). Teste: Vitest das preferências; no emulador, matar o app e reabrir na mesma página, e um screenshot por controle. Registrar em `specs/stack.md` a tabela nativo × overlay × CSS como resposta a `Q-ST.2`, copiando para o vault.

**E4 · Arte da mesa.** Skia em fidelidade alta ao mockup B: feltro com grão, os objetos (o livro aberto com a página corrente, a gaveta com as contagens, a bandeja), a sombra com fonte (`RN-DV.7`), a luminária com a poça de luz tingida pela temperatura (`RN-DV.6`) e a transição objeto → folha (Reanimated), respeitando a preferência de movimento reduzido. Teste: screenshots do emulador lado a lado com o mockup B, e o leitor de tela (TalkBack) percorrendo a mesa em ordem com as etiquetas (`RN-DV.10`).

Em toda etapa: verificar, fazer o commit, atualizar o `retomada.md` e **parar para o usuário testar**.

## Riscos a vigiar
- A compatibilidade do `react-native-readium` com RN 0.83 / New Architecture (`Q-ST.1`). Se quebrar no build, parar e trazer as opções ao usuário antes de trocar de leitor.
- As fontes do painel dentro do Readium (WebView) podem exigir injeção de `@font-face`, o que entra em `Q-ST.2`.
- O Gradle no Windows: caminhos longos e a primeira compilação lenta. Rodar o build em segundo plano.

## Verificação ponta a ponta (fim da E4)
Abrir o app do zero no emulador → mesa vazia → bandeja → importar EPUB → "Abrir agora" → ler, mexer nos 10 controles → pousar na mesa (o livro aparece aberto, com a página corrente, e a luminária na nova temperatura) → gaveta → abrir um livro do acervo → pausar outro → matar o app e reabrir (tudo persiste, o leitor retoma a posição). Vitest de `packages/core` verde.
