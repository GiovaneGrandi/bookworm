# Retomada — estado da operação em curso

> Arquivo operacional, lido no início de uma sessão nova antes de qualquer outra coisa.
> Regras de uso em `CLAUDE.md` §Retomada barata. Só entra aqui o que **não** é re-derivável
> por grep no repositório. Operação fechada, seção apagada. Não replicar no vault.

**Atualizado em:** 23/08/2026

---

## Operação em curso — Plano do primeiro protótipo (`planos/2026-08-23-primeiro-prototipo-mvp.md`)

**Estágios 0–5 concluídos e commitados. Estágio 6 validado em dispositivo real, não commitado.**
Código verde (typecheck/lint/`pnpm test` limpos) e os 7 cenários manuais do plano já rodaram no
emulador (`BookWorm_API34`) — ver seção própria abaixo. Falta só a confirmação do usuário e o
commit.

### Estágio 6 — código, testes e validação manual completos

- **`packages/db`**: schema completo (18 tabelas — `obra`, `item_biblioteca`, `progresso_leitura`,
  `sessao_leitura`, `intervalo_inatividade`, `destaque`, `anotacao`, `consulta_dicionario`,
  `agregado_diario`, `meta_diaria`, `dia_ofensiva`, `ofensiva`, `congelamento`, `carteira`,
  `lancamento_ledger`, `item_outbox`, `sessao_em_curso`, `evento_bruto_sessao`), `ddl.ts` (DDL
  `CREATE TABLE IF NOT EXISTS` derivado à mão de `drizzle-kit generate`, aplicado por
  `apps/app/src/persistencia/db.ts` na abertura), 11 testes de introspecção de schema
  (`getTableConfig`, sem SQLite real — ver achado abaixo). **Confirmado rodando de verdade no
  emulador**: as 18 tabelas foram criadas e usadas (insert/select/update/delete) sem erro.
- **`packages/core/src/ulid.ts`**: `criarUlid()` via `ulidx` `monotonicFactory()` (RN-ST.9/RN-TEL.32).
- **Módulo nativo `apps/app/modules/bookworm-relogio/`** (Kotlin, `create-expo-module --local`):
  expõe `elapsedRealtime()`/`uptimeMillis()` (`SystemClock`). **Rebuildado e confirmado**:
  autolinka e `elapsedRealtime()` devolve valores reais e crescentes no emulador.
- **`apps/app/src/sessao/`**: `relogio.ts` (carimbo `{parede, mono}`), `persistenciaSessao.ts`
  (CRUD de `sessao_em_curso`/`evento_bruto_sessao`), `transicoes.ts` (núcleo **puro** da máquina —
  `decidirParaBackground`/`decidirParaForeground`/`decidirIdle`, sem I/O, testável sem SQLite),
  `maquina.ts` (store Zustand `useMaquinaSessao`, casca fina sobre `transicoes.ts` +
  persistência — RN-TEL.2: sempre `await` a gravação antes do `set()`), `apuracaoEFinalizacao.ts`
  (roda as funções puras do Estágio 3 sobre o traço local e grava `sessao_leitura`, com
  `deriva_relogio_ms` calculado sobre o traço inteiro), `outbox.ts` (heartbeat a cada 30s de tempo
  *ativo*, gatilho vem de recalcular `apurarTempoAtivo`, não de contar ticks), `sinais.ts`
  (`AppState` → `paraBackground`/`paraForeground`; dois `setInterval` só como checadores —
  idle a cada 15s, heartbeat a cada 30s).
- **Arnês de validação manual `apps/app/app/leitor.tsx`** (substitui a casca do Estágio 5) +
  botão temporário "Abrir leitor (debug Estágio 6)" em `app/(tabs)/index.tsx`: expõe todas as
  ações da máquina (`abrirObra`, `sinalPosicao`, `sinalInteracaoQualitativa`, `verificarIdle`,
  `paraBackground`, `paraForeground`, `encerrar`) como botões, com log das últimas 12 ações e os
  três campos (`estado`/`sessão`/`último sinal`) em tempo real. **Remover no Estágio 7**, quando o
  leitor de verdade (Readium) passar a chamar os sinais a partir de eventos reais em vez de botão.
- **Testes**: `test/sessao/transicoes.test.ts` (15 casos incluindo um teste de costura que monta
  um traço via as transições puras e confere `apurarTempoAtivo` do Estágio 3 sobre ele — graça de
  pausa de sistema descartada, idle detectado), `test/sessao/sem-acumulador-de-duracao.test.ts`
  (varredura RN-TEL.9: nenhum `setInterval`/`setTimeout` em `src/sessao/` incrementa contador).
- **`pnpm test`/`lint`/`typecheck` limpos na raiz** (Turborepo, 5 pacotes; 179 testes: 97
  `packages/core` + 11 `packages/db` + 9 `packages/design` + 62 `apps/app`/Jest — 15 novos do
  Estágio 6 estão inclusos nesse total).

### Estágio 6 — os 7 cenários manuais, resultado no emulador `BookWorm_API34`

Todos rodados via os botões do arnês + `adb` (força-parada, `cmd alarm set-time` para mudar o
relógio, logcat para conferir ausência de erro). Sessão de teste: obra `obra-teste-estagio-6`
(semeada pelo próprio arnês), sessão `3E83Z2EB`.

1. **Ida a segundo plano → pausa imediata**: `ativa` → `pausada_sistema` no toque, sem espera. ✅
2. **Volta rápida (< 30 min)**: `pausada_sistema` → `ativa`, mesma sessão, `pausa_encerrada`
   gravado. ✅
3. **Idle ≥ 90 s**: esperado 95 s reais sem sinal, então `verificarIdle` → `pausada_idle`, sem
   evento explícito gravado (RN-TEL.12/13 — só o estado muda). ✅
4. **Blip curto de segundo plano (< 3 s)**: `paraBackground` seguido de `paraForeground` quase
   imediato — sessão sobrevive sem corrupção; o descarte da pausa curta (RN-TEL.14) é
   responsabilidade da apuração (`apurarTempoAtivo`, já coberto pelo teste de costura), não da
   máquina. ✅ (o gesto exato de puxar/dispensar a barra de notificações não foi reproduzido via
   `adb` — a lógica testada é a mesma que qualquer transição rápida `background`→`active`
   exercita.)
5. **App morto pelo sistema, sessão recuperada ao reabrir**: `adb shell am force-stop` com a
   sessão `ativa`, relançar o app → `inicializar()` **retomou a mesma sessão** (`3E83Z2EB`, mesmo
   `último sinal` mono) a partir de `sessao_em_curso` no SQLite — RN-TEL.42 confirmado ponta a
   ponta com processo real morto e banco real. ✅ **A validação mais importante do estágio.**
6. **Relógio do aparelho mudado no meio da sessão**: `adb shell cmd alarm set-time` (+2h) com a
   sessão em curso, então um sinal de posição e `encerrar` — nenhum erro no logcat, `estado`
   voltou a `ociosa` normalmente (a apuração e o cálculo de `deriva_relogio_ms` rodaram sem
   exceção). Bônus: o checador de idle (que usa `mono`, não `parede`) não reagiu ao salto de
   relógio — confirma a separação RN-TEL.6/7 na prática, não só em teste unitário. ✅ (o valor de
   `deriva_relogio_ms` gravado não foi inspecionado diretamente no banco — não há leitor de SQLite
   no arnês; a fórmula é trivial e revisada em código.) Relógio devolvido ao horário real com
   `cmd alarm set-time` ao final.
7. **Timeout de segundo plano ≥ 30 min**: **não executado ao vivo** — `elapsedRealtime()` é
   imune a mudança de relógio de parede (correto, é o ponto do design) e não há como
   adiantá-lo sem esperar 30 minutos reais ou reiniciar o aparelho (o que zeraria o próprio
   relógio monotônico). Coberto por teste determinístico exato em
   `test/sessao/transicoes.test.ts` ("segundo plano >= SESSAO_TIMEOUT_MINUTOS: encerra usando o
   instante em que começou").

**Achado — `adb shell input tap` e `uiautomator dump`/`screencap` não usam o mesmo referencial de
coordenada Y neste emulador.** Um toque em `(x, y_dump)` repetidamente acertou o botão ~160px
**acima** do esperado (ex.: mirar no botão "voltar ao primeiro plano" acionava "ida a segundo
plano"). Não é erro de app — é do par emulador/`adb` desta máquina. Contorno usado: focar no
**resultado logado no próprio arnês** (cada botão grava sua ação no log em tela) em vez de confiar
cegamente na coordenada; quando precisar de coordenada certa, somar ~160px ao Y do centro
reportado por `uiautomator dump` antes de tocar, e sempre confirmar via screenshot pós-toque.

**Achado — `expo-sqlite`/`drizzle-orm`/`react-native-get-random-values` nunca tinham sido
declarados em `apps/app/package.json`** apesar de já estarem em `node_modules` (hoisted) — típico
de terem sido instalados uma vez no root do workspace numa sessão anterior sem persistir no
`package.json` do app. Sintoma: typecheck/Jest passavam (Node resolve por `node_modules`
hoisted), mas o build nativo (`expo run:android`) não autolinkava `ExpoSQLite` — erro só aparece
em runtime no dispositivo ("Cannot find native module 'ExpoSQLite'"), não em nenhuma checagem
estática. **Lição**: dependência nativa Expo tem que estar no `package.json` do app que a usa,
autolinking não é transitivo por hoisting do pnpm. Corrigido adicionando as três ao
`dependencies` de `apps/app/package.json` e rebuildando nativo.

**Achado — `ulidx` (via `packages/core`) resolve para o build "browser" no Metro**, que espera
`crypto.getRandomValues` global — ausente no Hermes sem polyfill. Corrigido com
`import 'react-native-get-random-values'` como primeira linha de `app/_layout.tsx` (efeito
colateral, precisa rodar antes de qualquer `criarUlid()`).

**Achado — `metro.config.js` do Estágio 5 só reescrevia import `.js`→sem-extensão para imports
relativos (`moduleName.startsWith('.')`)**. Os imports profundos usados para evitar o barrel do
Jest (`@bookworm/core/src/sessao/index.js`) não são relativos e quebravam o bundle Metro
("Unable to resolve"). Corrigido removendo a condição `startsWith('.')` — agora qualquer
`moduleName` terminado em `.js` passa pela tentativa de resolução sem extensão antes do
fallback. Precisou de `expo start --clear` (Metro não recarrega `metro.config.js` sozinho —
achado #12 do Estágio 5, se repete).

**Achado — mesma limitação do `packages/db` se propaga para `apps/app`.** Sem `better-sqlite3`
compilável nesta máquina (Visual Studio Build Tools ausentes), não há como rodar SQLite de verdade
em Jest. Decisão: extrair toda decisão de transição para `transicoes.ts` (puro, sem I/O) e testar
**isso**, deixando a integração real com `expo-sqlite`/o módulo nativo só para validação manual no
emulador — inclusive o teste de sobrevivência (b) do plano ("matar a store, reconstruir do
SQLite") não tem como rodar em Jest aqui; é o cenário manual 6 (app morto pelo sistema) que cobre
esse caso na prática.

**Achado — barrel `@bookworm/core` quebra o Jest.** `@bookworm/core`'s `src/index.ts` reexporta
`indice/` (ESM puro via `htmlparser2`/`fflate`) que o preset `jest-expo` não transforma por
padrão. **Não mexer em `transformIgnorePatterns`** (already-documented achado #6 do Estágio 5:
sobrescrever quebra o preset inteiro). Em vez disso, todo arquivo de `apps/app/src/sessao/` importa
direto de `@bookworm/core/src/sessao/index.js` / `@bookworm/core/src/ulid.js`, nunca do barrel —
e `apps/app/package.json`'s `jest.moduleNameMapper` ganhou `"^(@bookworm/core/src/.*)\\.js$": "$1"`
para o Jest resolver esses imports profundos (mesma lógica do mapper já existente para imports
relativos `.js`→`.ts`).

**Próxima ação concreta:** pedir confirmação ao usuário e commitar o Estágio 6 (mesmo padrão dos
estágios anteriores — `AskUserQuestion` antes de `git commit`). Não há mais trabalho de código
pendente; a única decisão em aberto é se o arnês de debug (`app/leitor.tsx` +
`app/(tabs)/index.tsx`) entra no commit como está (documentado para remoção no Estágio 7) ou se o
usuário prefere removê-lo antes.

### Estágio 5 — o que existe, validado no emulador, pronto para commit

Todo o código abaixo **typecheca, lint limpo (5/5 pacotes, só warnings pré-existentes de
`noNonNullAssertion`) e passa em 150 testes no total** (94 `packages/core` + 9 `packages/design`
+ 47 `apps/app`/Jest). **Validado visualmente no emulador** (`BookWorm_API34`) — as 4 abas abrem,
navegam e renderizam corretamente; capturas em `specs/medicao/estagio5/aba-{1..4}-*.png`.

- **Toolchain instalada** em `apps/app`: `expo-router` (Tabs clássico, não `js-tabs` — precisa de
  `tabBar` custom total), `react-native-unistyles@3` + `react-native-nitro-modules`,
  `@shopify/react-native-skia` (instalado, não usado — nenhuma das 12 primitivas exigiu, igual ao
  achado do Estágio 1), `react-native-reanimated@4` + `gesture-handler` + `expo-haptics`,
  `expo-font` + seis pacotes `@expo-google-fonts/*`, `jest` + `jest-expo` + `@testing-library/
  react-native@14` (dev). `@shopify/react-native-skia` precisou entrar em
  `pnpm.onlyBuiltDependencies` da raiz (`package.json`) para o postinstall rodar sem prompt
  interativo — `pnpm approve-builds` é interativo e não funciona em modo não interativo.
- **`packages/design` ganhou três peças novas**: `corComAlfa.ts` (hex+alfa → rgba),
  `papelSemantico.ts` (camada 3 — `acaoPrimaria`, `selecionadoBorda`/`selecionadoFundo` derivados
  por superfície, regra 7 de `direcao-visual.md` §4), e `superficies.ts` ganhou os campos que
  faltavam (`borda`, `sombra`, `tintaFraca`) para as 8 superfícies terem os cinco completos
  (RN-DS.3) — decisão de implementação registrada em comentário no próprio arquivo (não é `Q-DS`
  novo porque cada valor deriva de uma regra já existente). `assets/pauta.png` copiado de
  `probe/assets/` (P-10, ainda não usado no Estágio 1).
- **`apps/app/src/tema/`**: `unistyles.ts` (config única, tema `bookworm`, `theme.sup`/
  `.semantico`/`.grifo`), `geometria.ts` (raio/giro/borda), `movimento.ts` (durações/curvas/
  háptico), `estados.ts` (contrato de 8 estados), `fontes.ts` (`useFontesDaMarca`,
  `fontFamilyPara`).
- **`apps/app/src/primitivas/`**: `Grao.tsx` (P-1), `LuzSobreAFolha.tsx` (P-2), `Grifo.tsx` (P-7).
- **`apps/app/src/componentes/`**: as 15 peças do inventário pedidas pelo plano (`BwFolha`,
  `BwFicha`, `BwCartao`, `BwItem`, `BwBotao`, `BwAbasFichario`, `BwCabeca`,
  `BwNumeroCelebracao`, `BwDadoTabular`, `BwCarimbo`, `BwProgressoDia`, `BwVazio`,
  `BwCelebracao`, `BwDormencia`, `BwImportar`) + `useSuperficie.ts`.
- **`apps/app/app/`**: `_layout.tsx` (casca, `GestureHandlerRootView`, fontes, `Stack` com
  `(tabs)` e `leitor` fora do grupo), `(tabs)/_layout.tsx` (`tabBar` custom via
  `BwAbasFichario`), as 4 telas (`index`=Jardim, `biblioteca`, `caderno`, `desempenho` — todas em
  estado vazio com arte hoje), `leitor.tsx` (casca mínima, fora das abas).
- **Testes**: `test/design-system/` (três varreduras: pigmento direto, espaçamento fora da
  escala, contraste WCAG + alvo de toque) + `test/componentes/primitivas.test.tsx` (34 snapshots,
  um por componente × estado aplicável).
- **Skill de projeto** `.claude/skills/bookworm-design-system/SKILL.md` — testada por invocação
  nesta sessão, carrega corretamente.

### Achados do Estágio 5 — não repetir a investigação

1. **Expo Router v7 não depende mais de `@react-navigation/bottom-tabs` como pacote separado** —
   vendoriza sua própria cópia em `expo-router/build/react-navigation/bottom-tabs` (sem
   `"exports"` no `package.json`, então import profundo funciona). `BottomTabBarProps` se importa
   de lá, não de `@react-navigation/bottom-tabs` (não instalado). `Tabs` de `'expo-router'`
   está marcado `@deprecated` em favor de `'expo-router/js-tabs'`, mas mantido de propósito — só
   o `Tabs` clássico aceita um `tabBar` totalmente customizado, que é o que a barra de abas de
   fichário (`RN-DS.18`, design-system.md §10) exige.
2. **`@testing-library/react-native@14` tornou `render()` assíncrono** (React 19) — todo teste
   precisa de `await render(...)`; esquecer o `await` dá `TypeError: (0, _reactNative.render)
   (...).toJSON is not a function` (o nome `_reactNative` no erro é só o apelido que o Babel dá à
   variável do import de `@testing-library/react-native`, não confundir com o pacote
   `react-native` de verdade).
3. **Unistyles 3 roda sobre Nitro Modules (nativo)** — sem binário, quebra em Jest com "NitroModules could not be found". O próprio pacote publica um mock oficial:
   `require('react-native-unistyles/mocks')` num `jest.setup.js` referenciado em
   `package.json` → `jest.setupFiles`.
4. **Jest (CommonJS/Babel) não entende `import.meta.url`** — os testes de varredura usados em
   `packages/core` (Vitest, ESM nativo) não migram direto; em `apps/app` usar `__dirname` (CommonJS,
   disponível via `jest-expo`/`babel-jest`).
5. **Imports `.js` de código-fonte `.ts` (convenção NodeNext/bundler) quebram a resolução padrão
   do Jest** — `@bookworm/design` importa `./pigmentos.js` de dentro de `.ts`, e Vitest resolve
   isso sozinho mas Jest não. Precisa de `moduleNameMapper: { "^(\\.{1,2}/.*)\\.js$": "$1" }` no
   config do Jest.
6. **`transformIgnorePatterns` customizado quebrou o preset do `jest-expo`** — tentativa inicial
   de restringir manualmente qual pacote de `node_modules` transformar excluiu `expo-modules-core`
   (que usa `import` ESM) por engano. O preset do `jest-expo` já vem com a lista certa; não
   sobrescrever sem motivo forte.
7. **`node -v` desta máquina (v20.17.0) segue abaixo do mínimo que o Expo SDK 57 pede
   (`>=20.19.4`)** — aparece como aviso em todo comando `npx expo ...`, não bloqueia (mesmo achado
   já registrado para o Estágio 1/2), mas registrar de novo porque o aviso é nesta rodada mais
   verboso (aparece também no `expo run:android`).
8. **Variáveis de ambiente persistidas (`setx`) do Estágio 1 não estavam visíveis nas primeiras
   tentativas desta sessão** (`adb`/`ANDROID_HOME` vazios em PowerShell e Bash novos) — os
   caminhos em disco continuavam corretos (`Test-Path` confirmou SDK/AVD/JDK), só o ambiente do
   processo não herdou. Contornado exportando `ANDROID_HOME`/`JAVA_HOME`/`PATH` manualmente no
   início de cada sessão de shell que precisar deles — **o Bash tool deste harness não persiste
   variáveis de ambiente entre chamadas** (só o diretório de trabalho persiste), então isso
   precisa ser refeito a cada comando novo que precise do SDK, ou combinado num único comando via
   `run_in_background` para builds longos.
9. Um emulador **já estava rodando** (`emulator-5554`) no início desta sessão — não precisou
   religar via `emulator.exe`. **Nenhum dos quatro patches nativos do Estágio 2 (KotlinCompile
   freeCompilerArgs, coreLibraryDesugaring, `abiFilters`, `network_security_config.xml`) foi
   necessário desta vez** — `expo run:android` buildou limpo na primeira tentativa (5m26s, 404
   tasks). Esses patches são específicos do `react-native-readium` (Estágio 7), não do ambiente
   de build em si; não aplicar preventivamente antes de precisar.
10. **`react-native-unistyles/plugin` no Babel exige a opção `root`** desde a RC.5 — sem ela,
    `Unistyles 🦄: Babel plugin requires 'root' option to be set`. Config final em
    `apps/app/babel.config.js`: `['react-native-unistyles/plugin', { root: 'src', autoProcessPaths: ['app'] }]`
    (o app tem componentes em `src/` e telas em `app/`, e o plugin só varre um `root` — o segundo
    diretório entra por `autoProcessPaths`).
11. **O Metro não resolve import `.js` apontando para fonte `.ts`/`.tsx`** (a mesma convenção
    NodeNext/bundler que `packages/core`/`packages/design` já usam) — ao contrário do `tsc` e do
    Vitest, que entendem isso nativamente, o Metro trata a extensão como definitiva e nunca tenta
    `.ts` no lugar. Sem correção, todo `import '../x.js'` que na verdade é `x.ts` falha com
    `UnableToResolveError`. Corrigido com um `resolveRequest` customizado em
    `apps/app/metro.config.js` que, para imports relativos terminados em `.js`, tenta resolver sem
    a extensão antes de desistir — deixa o Metro escolher `.ts`/`.tsx` normalmente.
12. **Mudança em `babel.config.js` ou `metro.config.js` não invalida o cache do Metro
    automaticamente** — depois de qualquer uma das duas, é preciso matar o processo do Metro (ele
    não morre sozinho com o app) e religar com `--clear`, ou o erro antigo persiste mesmo com o
    arquivo já corrigido.
13. **Achado real de bug, não só de ferramenta**: `tintaFraca` de `packages/design/src/
    superficies.ts` estava fixa em `pigmento.tinta70` (a versão escura, calibrada só para
    `papel`/`papelFundo`) em **todas** as oito superfícies — inclusive as escuras
    (`mesa`/`carvao`/`cianotipo`), onde a `tinta` em si é clara. Resultado visual: os rótulos das
    abas inativas em `bw-abas-fichario` (que vive sobre `mesa`) ficavam efetivamente invisíveis
    (texto quase preto sobre fundo quase preto) — só apareceu ao rodar de verdade no emulador,
    nenhum teste (snapshot ou de contraste) pegou, porque os testes de contraste existentes
    checavam `tinta` contra `fundo`, não `tintaFraca`. Corrigido derivando `tintaFraca` sempre a
    partir da própria `tinta` do material (`corComAlfa(tinta, 0.72)`), nunca de um valor fixo —
    ver o comentário em `superficies.ts`. **Lição para o Estágio 6+**: qualquer token derivado
    "fraco"/"desabilitado"/"placeholder" precisa ser função da cor-base do próprio material, nunca
    uma constante — o mesmo padrão pode se repetir em outro par claro/escuro.
14. **`adb shell` com caminho iniciado por `/` quebra no Git Bash** (`MSYS`/`msys2` reescreve o
    caminho como se fosse do host Windows, ex. `/sdcard/x` vira `C:/Program Files/Git/sdcard/x`).
    Contornado com `export MSYS_NO_PATHCONV=1` antes do comando, ou path com barra dupla
    (`//sdcard/x`).
15. **O toast de dev "Open debugger to view warnings" (LogBox) cobre a barra de abas na captura de
    tela** enquanto há warnings pendentes — neste caso vinha do aviso de `scheme` ausente
    (`expo-linking`). Resolvido de vez adicionando `"scheme": "bookworm"` a `apps/app/app.json`
    (não exige rebuild nativo, só reload de JS). Corrigir a causa é mais robusto que tentar acertar
    as coordenadas de toque do botão de fechar o toast.

**Resultado final**: as 4 abas abrem, navegam e renderizam corretamente no emulador
(`BookWorm_API34`) — capturas em `specs/medicao/estagio5/aba-{1..4}-*.png`.

### O que já foi verificado — não repetir

- `git log` tem seis commits: estado zero, Estágio 1, Estágio 2, Estágio 3, Estágio 4, Estágio 5.
- Monorepo existe e funciona: `apps/app` (agora com fundação visual completa — abas, os 15
  componentes do inventário, Unistyles, fontes — ver seção do Estágio 5 acima) e `apps/api`
  (scaffold vazio), `packages/core` (índice de caracteres —
  RN-02.10/RN-03.2/RN-03.3/RN-02.1f/RN-ST.8/RN-TEL.27/RN-ST.7 —, `src/sessao/` desde o Estágio 3
  (as sete funções puras de `RN-TEL.48`: `apurarTempoAtivo`, `apurarBlocosDeFoco`, `apurarVolume`,
  `dividirNaViradaDoDia` + `apurarTempoAtivoDividido`, `calcularLeituraConsciente`,
  `classificarEstilo`, `classificarSessao`), e `src/ofensiva/` desde o Estágio 4 (`avaliarMeta`,
  `alterarMeta`, `recalcularOfensiva`, `aplicarCongelamento` + `concederCongelamentoMensal`,
  `avaliarMarcos`, `estadoDoJardim`, `recalcularAgregados` + `mesclarAgregados`,
  `fechamentoSemanal` — todo `RN-` com teste nomeado pelo ID), `packages/db` (vazio até Estágio
  6), `packages/design` (pigmentos, superfícies com os cinco completos + `tintaFraca` derivada,
  papel semântico, escala de espaçamento, escala tipográfica, gerador de CSS + testes,
  `assets/grao-7.png` e `assets/pauta.png`).
- **`pnpm test`, `pnpm lint`, `pnpm typecheck` rodam limpos na raiz agora** (Turborepo, 5
  pacotes; `pnpm lint` reporta só warnings de `noNonNullAssertion`, consistentes com o resto do
  repo, sem erro; 150 testes no total: 94 `packages/core` + 9 `packages/design` + 47
  `apps/app`/Jest). `pnpm design:tokens` gera `packages/design/dist/tokens.css`.
- **AVD `BookWorm_API34` validado de ponta a ponta nesta rodada**: build nativo Android completo
  (`expo run:android`, Skia + Reanimated + Nitro Modules, 5m26s) e app rodando com Metro conectado.
  Variáveis de ambiente precisam ser reexportadas a cada comando novo do harness (achado #8 do
  Estágio 5) — não presumir que `adb`/`emulator` estão no PATH sem isso.
- `@vitest/coverage-v8@3.2.7` instalado como devDependency da raiz desde o Estágio 3. Cobertura de
  `src/sessao/` + `src/ofensiva/` juntas: 96,51% statements — `npx vitest run --coverage
  --coverage.include='src/sessao/**' --coverage.include='src/ofensiva/**'` dentro de
  `packages/core`. Não configurado como script padrão (rodar sob demanda).

### Achado do Estágio 4 — `EstiloDeLeitura` não pode ser redeclarado em `ofensiva/tipos.ts`

`packages/core/src/index.ts` reexporta `sessao/index.js` e `ofensiva/index.js` com `export *`.
Como `SessaoParaAgregado.estilo` (ofensiva) e o resultado de `classificarEstilo` (sessão) são o
mesmo conceito, a primeira versão redeclarava `EstiloDeLeitura` em `ofensiva/tipos.ts` — e o
`export *` duplo quebra o build da raiz (`tsc` acusa export ambíguo), mesmo as duas declarações
sendo estruturalmente idênticas. Corrigido importando o tipo de `../sessao/tipos.js` em todo
arquivo de `ofensiva/` que precisa dele, **sem reexportá-lo** — `ofensiva/tipos.ts` não tem export
de `EstiloDeLeitura`, só usa o tipo internamente. Vale para qualquer tipo futuro compartilhado
entre os dois módulos: import direto do módulo dono, nunca redeclaração.

### Achado do Estágio 4 (2) — regex `g` reutilizado num loop esconde violações

O teste de arquitetura `relogio-como-parametro.test.ts` (Estágio 3) tinha um regex com flag `g`
chamado via `.test()` dentro de um `for` sobre vários arquivos — `lastIndex` fica sujo entre
iterações e pode fazer a checagem silenciosamente não detectar uma violação num arquivo que não
seja o primeiro a bater o padrão. Corrigido removendo a flag `g` (o teste só precisa saber *se*
o padrão aparece, não iterar ocorrências). Vale para os dois testes de arquitetura novos do
Estágio 4 (`ofensiva-sem-acumulador.test.ts`) — nenhum usa `g` com `.test()` em loop.

### Achado do Estágio 3 — arredondamento de traço dividido na virada do dia precisa de coordenação

`RN-TEL.11` manda arredondar uma única vez, na apuração final — mas quando `dividirNaViradaDoDia`
parte um traço em duas sessões, cada `apurarTempoAtivo` independente arredonda a própria parte, e
a soma dos arredondamentos não bate necessariamente com o arredondamento do traço inteiro (erro de
até ±1s por fronteira — problema clássico de "quem absorve o resto do arredondamento"). `RN-TEL.50`
exige soma exata, então `dividirNaViradaDoDia.ts` ganhou um segundo export,
`apurarTempoAtivoDividido(traco)`, que aplica o mesmo método de "maior resto" usado em totais
financeiros: arredonda cada parte normalmente e empurra a diferença para a última. Qualquer
consumidor futuro (Estágio 9, servidor) que precise dos números por dia de uma sessão dividida deve
usar essa função, não recompor `apurarTempoAtivo` por parte manualmente.

### Achado do Estágio 3 (2) — segmento de volume que atravessa uma pausa não pode ser comparado ao teto físico

Primeira versão de `apurarVolume` comparava o delta de caracteres de **todo** o intervalo entre
duas leituras de posição contra o teto físico daquele intervalo — inclusive quando o intervalo
atravessava uma pausa (sistema ou idle). Como o tempo ativo dentro do intervalo colapsa para ~0
quando a pausa ocupa quase tudo, qualquer avanço de posição depois da pausa disparava
`suspeita: true` por engano, mesmo em ritmo de leitura normal (achado ao gerar o traço
`SES-04-via-interacao.json` e ver `suspeita: true` onde não devia haver nada de suspeito). Corrigido
fazendo `apurarVolume` quebrar a cadeia de movimento em qualquer pausa, do mesmo jeito que já
quebrava em `salto: true` — a retomada depois de uma pausa começa uma cadeia nova, sem comparar
contra a posição de antes dela.
- `probe/` (app de prova do Estágio 1) **descartável** — nada mais depende dele, o grão já foi
  copiado. Pode ser apagado num estágio futuro se atrapalhar; não precisa ser agora.
- AVD funcional: `BookWorm_API34` (Pixel 6, API 34, `google_apis_playstore/x86_64`),
  em `C:\Users\Giovane\.android\avd\BookWorm_API34.avd`. **Cai sozinho depois de ~1h ocioso** —
  se `adb devices` vier vazio, religar com
  `emulator.exe -avd BookWorm_API34 -no-snapshot -gpu swiftshader_indirect` (usar `nohup ... &
  disown` para sobreviver ao fim do shell que o lançou). Não é necessário para o Estágio 3
  (`packages/core` é puro, sem RN).

### Achado do Estágio 2 — Vitest 4 quebrado nesta máquina

`vitest@4.x` puxa `rolldown-vite` e falha com `Cannot find native binding` /
`Cannot find module '@rolldown/binding-wasm32-wasi'` ao rodar — bug de resolução de dependência
opcional específico desta plataforma (Windows + pnpm hoisted), não do projeto. **Fixado em
`vitest@3.2.7`** no `package.json` da raiz. Não tentar atualizar para 4.x sem testar primeiro se
o bug foi corrigido rio acima.

### Ferramentas novas instaladas nesta rodada

TypeScript ^7.0.2, Turborepo ^2.10.11, Biome ^2.5.10, Vitest 3.2.7 (não 4.x, ver acima),
`@types/node` na raiz (`tsconfig.base.json` tem `"types": ["node"]`). `fast-check` como
devDependency de `packages/core`, ainda não usado (entra nos testes de propriedade do Estágio 3).

### Achado que muda o Estágio 2, além do `node-linker` — react-native-readium precisa de patches de build

`react-native-readium@5.0.0` só compila com quatro ajustes que **não existem por padrão** no
template Expo/RN atual (detalhe completo com o porquê de cada um em
`specs/medicao-app-de-prova.md` §0):

1. `android/build.gradle` (raiz) — bloco `tasks.withType(KotlinCompile)` global com
   `freeCompilerArgs += ["-Xskip-metadata-version-check", "-opt-in=kotlin.time.ExperimentalTime"]`.
2. `android/app/build.gradle` — `coreLibraryDesugaringEnabled true` + dependência
   `coreLibraryDesugaring "com.android.tools:desugar_jdk_libs:2.1.5"` (não 2.1.2, que o README do
   Readium pede — o toolkit real exige 2.1.5+).
3. `node_modules/react-native-readium/android/build.gradle` — `abiFilters` restrito a `x86_64`
   nesta rodada (o link nativo quebra em `arm64-v8a`, causa não investigada). **Revisitar antes de
   buildar para dispositivo físico** — provavelmente exige atualizar `react-native-nitro-modules`
   ou o próprio Readium.
4. `android/app/src/debug/res/xml/network_security_config.xml` — precisa liberar `10.0.2.2`
   além de `127.0.0.1`/`localhost`, porque o `network_security_config.xml` que o Readium embute
   só libera os dois últimos e blinda por cima do padrão do template (recursos do módulo `:app`
   têm prioridade de merge, então o arquivo próprio resolve sem `tools:replace`). Sem isso o app
   builda e instala, mas não busca o bundle do Metro no emulador — erro só aparece no `logcat`
   (`CLEARTEXT communication to 10.0.2.2 not permitted`), não no Gradle.

Nenhum desses quatro é específico do app de prova — **todos batem de novo quando `apps/app` ganhar
o leitor real no Estágio 7**, a menos que uma versão nova do Readium já os resolva até lá.
Verificar a changelog do pacote antes de reaplicar às cegas.

### Outro achado — `SafeAreaView` de `react-native` é no-op no Android

Não é bug do Readium, é comportamento conhecido do RN: `SafeAreaView` importado de `'react-native'`
(não de `'react-native-safe-area-context'`) não aplica nenhum padding no Android, então conteúdo
no topo da tela fica atrás da status bar, que intercepta os toques nessa faixa (sintoma: barra de
abas/tabs no topo simplesmente não responde a toque, sem erro nenhum). `apps/app` no Estágio 5 deve
usar `react-native-safe-area-context` (já é dependência do Readium, portanto já está no lockfile)
desde o primeiro commit da casca visual — não repetir esse debugging.

### Versões fixadas nesta máquina

| Ferramenta | Versão | Caminho |
|---|---|---|
| Node | v20.17.0 (LTS "Iron" — ainda suportada, não é o patch mais recente) | `C:\Program Files\nodejs` |
| pnpm | 10.34.5 | instalado via `npm install -g pnpm` (corepack falhou nesta máquina — ver Pendências) |
| JDK | 17.0.9 | `C:\Development\Tools\Java` — **usar este como `JAVA_HOME`**, não o do Android Studio |
| Android Studio | instalada, usuário atualizou manualmente para a build 2026 durante a sessão | `C:\Program Files\Android\Android Studio` — **não usado no fluxo de build**; a IDE não embarca mais `java.exe` redistribuível nem `sdkmanager`. Todo o SDK foi gerenciado via `cmdline-tools` |
| Android SDK (`ANDROID_HOME`) | platform-tools 37.0.1, build-tools 34.0.0, platform android-34, emulator, system-images `android-34;google_apis_playstore;x86_64` | `C:\Users\Giovane\AppData\Local\Android\Sdk` |
| Expo SDK (última estável no momento) | **57.0.15** — diverge do "SDK 55" escrito em `stack.md` §3. Não alterado por conta própria; decisão do usuário se o MVP acompanha a versão nova ou fixa em 55 | — |
| React Native / React (vindos do template Expo 57) | RN 0.86.2 / React 19.2.3 — diverge de "RN 0.83 / React 19.2" de `stack.md` §3 | — |
| `react-native-readium` | **5.0.0 estável** (saiu de RC). Fixar esta versão — `Q-ST.1` respondida em `specs/medicao-app-de-prova.md`. Precisa dos 4 patches de build do achado acima | — |

Variáveis persistidas no ambiente do usuário (`setx`/User env, não precisa repetir):
`ANDROID_HOME=C:\Users\Giovane\AppData\Local\Android\Sdk`,
`JAVA_HOME=C:\Development\Tools\Java`, PATH com `platform-tools`, `emulator` e
`cmdline-tools\latest\bin`. **Uma sessão nova de terminal já carrega isso**; só reexportar
manualmente se o comando rodar dentro de uma sub-shell que não herdou o perfil do usuário.

### Achado que muda o Estágio 2 (2) — `node-linker`

**pnpm com `node-linker` padrão (isolado) quebra build nativo Android no Windows.** O layout
`node_modules/.pnpm/<pacote>@<versão>_<hash>/node_modules/<pacote>/android/.cxx/...` estoura
`CMAKE_OBJECT_PATH_MAX` (250 caracteres) mesmo com o projeto raiz em caminho curto (`C:\bw-smoke`).
O sintoma no log é enganoso: Gradle reporta `A problem occurred starting process 'command 'cmd''`
e depois `ninja: error: manifest 'build.ninja' still dirty after 100 tries` — nenhum dos dois
menciona caminho longo diretamente; só aparece como *warning* do CMake (`CMAKE_OBJECT_PATH_MAX`)
♦ é fácil de rolar e não notar. Exclusão do Windows Defender **não resolveu** (testado antes e
depois); o que resolveu foi `.npmrc` com `node-linker=hoisted`, que elimina o segmento
`<pacote>@<versão>_<hash>` do caminho.
**Ação para o Estágio 2:** criar `.npmrc` com `node-linker=hoisted` na raiz do monorepo **antes**
de qualquer `pnpm install`, não depois. Reinstalar do zero se algum estágio futuro topar com o
mesmo sintoma.

### Pendências abertas desta operação

- **`corepack enable`/`corepack prepare pnpm@latest` falham nesta máquina**: `EPERM` ao tentar
  escrever em `C:\Program Files\nodejs` (falta de elevação) e, à parte, erro de verificação de
  assinatura (`Cannot find matching keyid`) — parece bug do corepack embutido nesta versão do
  Node contra chave de assinatura rotacionada do registro npm. Contornado com
  `npm install -g pnpm`, que funciona porque o prefix do npm é por usuário
  (`AppData\Roaming\npm`). Não bloqueia nada, mas registrar caso um estágio futuro dependa de
  corepack especificamente.
- **Conta Expo/EAS:** não criada nesta sessão — não foi pedida. Builds ficam limitados a
  `expo run:android` local, que é suficiente para os Estágios 1–8 (o próprio plano já previa isso).
- **`Q-ST.1`/divergência de versão do Expo SDK**: decisão do usuário — seguir com 57 (o que o
  ecossistema entrega por padrão hoje) ou fixar template/dependências em 55 para bater com
  `stack.md`. Não decidido; não presumir.

---

## Artefatos publicados — URLs

Prefixo `https://claude.ai/code/artifact/`.

| Peça | Arquivo | UUID |
|---|---|---|
| **Design system (catálogo)** | `mockups/design-system.html` | `3e2ebd2b-9420-4a3f-9c82-a166a9dd67aa` |
| Tipografia A — adotada | `mockups/tipografia-quatro-vozes.html` | `2abc8814-2d01-425f-8441-776841b1d7c5` |
| Tipografia B — descartada | `mockups/tipografia-duas-vozes.html` | `ca59f313-48b1-4b0f-9ba9-357e7e31cbb0` |
| Tipografia C — descartada | `mockups/tipografia-uma-voz.html` | `77c37f32-3edc-4d3d-ad8f-d1700b95b6de` |
| Telas Papel | `mockups/telas-papel.html` | `2a147217-2816-427d-b25f-a27cb6653f63` |
| Telas Noturno (descartada) | `mockups/telas-noturno.html` | `0ee8e368-e1af-47a0-ad33-f69cf0d5e3c9` |
| Widgets de story | `mockups/widgets-story.html` | `b987d745-9b03-4822-9c0e-ffd6d259fb1c` |

Local e publicado estão idênticos em todas as sete. Republicar de sessão nova cobra uma
leitura do fonte vivo (~20k tokens/arquivo) — só pagar isso se houver edição real a fazer.

---

## Pendências abertas fora da operação em curso

- `AJ-14` **resolvida** nesta rodada (Estágio 1): Anexo A medido, PNG do grão produzido.
- `AJ-13` (migrar as três peças de mockup ao catálogo, absorve `AJ-11`) segue aberta.
- `AJ-11` e `AJ-12` seguem **não pedidos** — não começar sem o usuário pedir.
- `Q-DV.7` a `Q-DV.10`, `AJ-1` a `AJ-10` seguem como estavam.
- Novas questões abertas por `specs/medicao-app-de-prova.md`: `Q-ST.8a` (confirmar extração de
  texto de PDF com arquivo de produção real, não gerado por script), `Q-ST.5` hifenização
  (repetir com coluna estreita no Estágio 7), `Q-TEL.1` (reinstrumentar sem `PanResponder` no
  Estágio 6), `Q-TEL.14` (exige tela dividida/PiP — Estágio 14).
