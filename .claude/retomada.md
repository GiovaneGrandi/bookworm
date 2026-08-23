# Retomada — estado da operação em curso

> Arquivo operacional, lido no início de uma sessão nova antes de qualquer outra coisa.
> Regras de uso em `CLAUDE.md` §Retomada barata. Só entra aqui o que **não** é re-derivável
> por grep no repositório. Operação fechada, seção apagada. Não replicar no vault.

**Atualizado em:** 23/08/2026

---

## Operação em curso — Plano do primeiro protótipo (`planos/2026-08-23-primeiro-prototipo-mvp.md`)

**Estágios 0–6 concluídos e commitados.** Próxima ação: abrir sessão nova e executar o
**Estágio 7** (`apps/app`: biblioteca, importação e o leitor — pré-requisito Estágio 6, cumprido).

O arnês de validação manual do Estágio 6 (`app/leitor.tsx` + botão em `app/(tabs)/index.tsx`)
entrou no commit e deve ser **removido** quando o Estágio 7 ligar o leitor real (Readium) à
máquina de estados — os comentários nos dois arquivos já marcam isso.

### O que já foi verificado — não repetir

- `git log` tem sete commits: estado zero, Estágio 1 a 6. `packages/db` deixou de estar vazio no
  Estágio 6 (schema completo, 18 tabelas — detalhe re-derivável de `packages/db/src/schema/`).
- **`pnpm test`, `pnpm lint`, `pnpm typecheck` rodam limpos na raiz** (Turborepo, 5 pacotes;
  `pnpm lint` reporta só warnings de `noNonNullAssertion`, sem erro; 179 testes no total ao fim
  do Estágio 6). `pnpm design:tokens` gera `packages/design/dist/tokens.css`.
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
