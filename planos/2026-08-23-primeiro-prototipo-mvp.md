# Plano — Primeiro protótipo do MVP do BookWorm

## Contexto

O repositório está em fase de especificação: 22 specs, duas análises críticas, onze mockups, e
**zero linhas de código de produto**. As decisões que travavam a construção já foram tomadas e
estão escritas: o corte de escopo (`specs/mvp.md`), a stack vinculante (`specs/stack.md`), o
design system operacional (`specs/design-system.md`) e a instrumentação (`specs/telemetria-e-instrumentacao.md`).

O que falta é a passagem para código. Este plano é essa passagem, e ele existe com uma restrição
declarada pelo usuário: **será executado por um agente Sonnet 5 Medium, um estágio por sessão**,
com reset de contexto entre estágios. Cada estágio precisa portanto ser autossuficiente, começar
sabendo exatamente o que ler, e terminar deixando por escrito onde parou.

**Alvo desta rodada:** a **fatia vertical** do loop de hábito, rodando em Android, sem conta e sem
servidor — importar um EPUB, ler, a sessão ser medida corretamente, a meta ser cumprida, a
celebração acontecer na fronteira natural, a ofensiva avançar e o jardim crescer. É exatamente a
ordem de dependência de `mvp.md` §3 (`02 → 03 → 04`), parando antes de `01`, `06` e `08`.

**Decisões tomadas nesta rodada de planejamento** (registradas para não serem relitigadas):

| # | Decisão |
|---|---|
| D-1 | Escopo da rodada: fatia vertical local-only. Estágios 0–8 detalhados; 9–14 esboçados |
| D-2 | O app de prova de `stack.md` §Próximo passo é obrigatório e vem antes de qualquer tela de produto |
| D-3 | Ambiente não existe ainda — o Estágio 0 é preparação de máquina, não código |
| D-4 | Servidor entra tarde. SQLite local é a única verdade até o Estágio 9 |
| D-5 | Identificadores de domínio em PT-BR, seguindo a nomenclatura já usada pelas specs (`apurarTempoAtivo`, `SessaoLeitura`, `DiaOfensiva`) |

---

## Regras de execução — valem para todos os estágios

O agente executor deve ler esta seção no início de cada sessão.

1. **Um estágio por sessão. Não começar o seguinte.** Ao terminar, atualizar `.claude/retomada.md`
   e parar. Se o contexto acabar no meio, o estágio é retomado do que estiver escrito lá.
2. **Ler só o que o estágio manda ler.** Cada estágio tem uma seção *Leitura obrigatória* com
   arquivo e faixa de linhas. Não reler specs "para se situar" — `CLAUDE.md` §Retomada barata.
   Para descobrir estado (o que existe, se está íntegro), **sondar** com `wc`, `grep`, `ls` ou um
   script Python que imprime só o veredito, nunca `Read` do arquivo inteiro.
3. **TDD é obrigatório, não opcional** (`CLAUDE.md` §Regras de trabalho, `RN-ST.10`). Escrever o
   teste, ver falhar, implementar até passar. Em `packages/core`, **o nome do caso de teste é o ID
   da regra** (`RN-ST.6`): `it('RN-03.15', ...)`, não `it('rejeita sessões sobrepostas', ...)`.
   A descrição em prosa vai no `describe` ao redor.
4. **Nunca declarar pronto o que não foi executado.** "Compilou" não é validação. Cada estágio tem
   uma *Definição de pronto* com verificações concretas; todas precisam ter rodado e passado.
   Se uma falhou, reportar a falha com a saída real, não contornar.
5. **Idioma:** PT-BR em documentação, copy, nomes de teste e identificadores de domínio. Termos de
   infraestrutura sem tradução consagrada (`outbox`, `locator`, `heartbeat`) ficam como estão.
6. **Sincronização com o Obsidian:** todo `.md` de spec/análise/relatório criado ou alterado é
   replicado para `C:\Users\Giovane\Documents\BookWorm`, mesma estrutura de pastas. **Exceção:
   `.claude/retomada.md` nunca é replicado** — é arquivo operacional.
7. **Escrever o arquivo inteiro cedo** (`CLAUDE.md` §Retomada barata, item 6). Em estágio longo,
   produzir todas as peças ainda rústicas antes de refinar qualquer uma. Ao ficar sem contexto,
   reportar em uma linha exatamente onde parou.
8. **Divergência entre mockup antigo e tabela vinculante resolve-se a favor da tabela, sempre**
   (`RN-DS.19`, precedente `AJ-11`).
9. **Não inventar valor numérico.** Toda constante vem de `specs/glossario.md` §2 ou de
   `specs/telemetria-e-instrumentacao.md` §17. Constante ausente é `Q-` a registrar, não um número
   a escolher.

### Formato de fechamento de estágio

Ao final, o agente reescreve a seção de operação em curso de `.claude/retomada.md` com **apenas o
não re-derivável**: estágio concluído, próxima ação concreta, verificações que já passaram (para
a sessão nova não repetir), decisões tomadas na conversa que ainda não viraram spec, e versões
exatas fixadas. Máximo ~150 linhas no arquivo todo; passou disso, virou documentação e perdeu a
função.

---

## Estágio 0 — Ambiente de desenvolvimento

**Pré-requisito:** nenhum. É o primeiro.
**Objetivo:** sair da sessão com um app Expo vazio abrindo em Android, e com o repositório sob
controle de versão.

### Leitura obrigatória
- `specs/stack.md` §3 (linhas 47–99) e §8 (linhas 217–231).

### Passos

1. **Verificar o que já existe** antes de instalar nada. Sondar, não presumir:
   `node -v`, `pnpm -v`, `java -version`, `adb version`, `git --version`.
   Reportar ao usuário o que falta **antes** de instalar — instalação de SDK é ação com
   consequência na máquina dele.
2. **Git.** O repositório não está sob versionamento (`git rev-parse` falha hoje). Rodar
   `git init`, criar `.gitignore` (node_modules, `.expo`, `android/`, `ios/`, `dist`, `.env*,`
   `*.keystore`, `.turbo`) e fazer o commit inicial de tudo que já existe — as specs e os mockups
   são o estado zero e precisam estar rastreados antes de qualquer código entrar.
3. **Node LTS + pnpm** (via corepack, `corepack enable`).
4. **JDK 17** e **Android SDK** (Android Studio ou command-line tools), com a variável
   `ANDROID_HOME` configurada e um AVD criado — API 34+, com Play Store, porque `react-native-readium`
   e Skia precisam de arquitetura real (`RN-ST.2`: dev build, nunca Expo Go).
5. **Conta Expo/EAS** — o usuário precisa criar e autenticar (`eas login`). Se não quiser criar
   agora, registrar em `.claude/retomada.md` que o build fica limitado a `expo run:android` local,
   e seguir: local basta para os Estágios 1–8.
6. **App descartável de fumaça:** `pnpm create expo-app@latest` num diretório temporário do
   scratchpad, `npx expo run:android`, confirmar que abre no emulador. **Esse app é descartado** —
   ele existe só para provar que a cadeia Gradle→emulador funciona. O projeto de verdade nasce no
   Estágio 2.
7. **Fixar as versões descobertas.** `stack.md` §3 nomeia "Expo SDK 55 / RN 0.83 / React 19.2".
   Verificar qual é o SDK estável no momento da execução (`npx expo-doctor`, `pnpm view expo
   versions`) e **registrar o número real em `.claude/retomada.md`**. Se divergir do escrito na
   spec, não alterar `stack.md` por conta própria — anotar a divergência para decisão do usuário.

### Definição de pronto
- [ ] `git log` mostra o commit inicial com as specs e mockups rastreados.
- [ ] `node -v`, `pnpm -v`, `java -version`, `adb devices` respondem, com as saídas coladas no relatório.
- [ ] O app de fumaça abriu no emulador — **captura de tela como prova**, salva no scratchpad.
- [ ] `.claude/retomada.md` registra: versão de SDK fixada, estado da conta EAS, caminho do AVD.

---

## Estágio 1 — App de prova: as 12 primitivas e o Readium

**Pré-requisito:** Estágio 0.
**Objetivo:** fechar com medição, não com hipótese, as perguntas que decidem se a stack escolhida
sustenta o produto — **antes** de existir código de produto sobre ela.

Este estágio não produz produto. Ele existe porque `RN-DS.20` e `stack.md` §Próximo passo o
exigem, e porque seis linhas do Anexo A do design system estão hoje como `não verificado`. Ele
fecha `Q-ST.1`, `Q-ST.2`, `Q-ST.5`, `Q-ST.8`, `Q-DS.5`, `AJ-14` e dá o primeiro dado sobre
`Q-TEL.1` e `Q-TEL.14`.

### Leitura obrigatória
- `specs/design-system.md` §5 (linhas 217–235, as 12 primitivas) e §11 (linhas 447–473, Anexo A).
- `specs/stack.md` §6 (linhas 159–195) e §12 (linhas 281–295).
- `specs/direcao-visual.md` §3.2 — a tabela tipográfica (grep `### 3.2` e ler a tabela; não ler o arquivo inteiro).

### Entregáveis
- `probe/` — app Expo isolado, **fora do monorepo**, descartável depois. Não vira `apps/app`.
- `specs/medicao-app-de-prova.md` — o relatório, em formato de spec, com veredito por linha.
- Capturas de tela em `specs/medicao/` (ou anexadas ao relatório).
- Anexo A de `specs/design-system.md` atualizado: cada linha sai de `não verificado` para
  `atravessa`, `degrada` ou `não atravessa`, **com a captura citada**.

### Passos

1. **Tela A — as 12 primitivas lado a lado.** Uma rota que renderiza `P-1` a `P-12` em cartões
   rotulados, cada um com o ID e a receita RN tentada. Implementar cada uma **primeiro em `View`
   nativa**, e só onde falhar, em Skia — porque o que o Anexo A precisa saber é onde a `View`
   nativa não chega, não se o Skia resolve (ele resolve; `stack.md` §3 já argumenta isso).
   Ordem de ataque, das mais duvidosas para as menos: `P-2` (gradiente de canto), `P-3` (relevo
   inset), `P-4` (sombra colorida), `P-7` (grifo multiplicado), `P-9` (botão de papel), versalete,
   justificado com hifenização. As quatro dadas como `atravessa` (`P-5`, `P-8`, `P-10`, `P-11`)
   ainda assim renderizam — confirmação custa nada e a spec fala em "medição", não em confiança.
2. **`P-1` — produzir o PNG do grão** 7×7px tileável (`AJ-14`), aplicado via `ImageBackground`
   com `resizeMode: 'repeat'`. Guardar o asset em `probe/assets/grao-7.png` e, ao fim do estágio,
   copiá-lo para `packages/design/assets/` quando o monorepo existir (Estágio 2).
3. **Tela B — Readium.** Instalar `react-native-readium` na versão RC mais recente, **anotar a
   versão exata** (`Q-ST.1`). Embarcar um EPUB e um PDF de domínio público no bundle. Medir:
   - locator estável ao trocar corpo de fonte e ao girar a tela (`RN-02.9`);
   - quais dos dez controles de `RN-02.16d` o Readium oferece por preferência nativa e quais
     exigem CSS injetado ou overlay (`Q-ST.2`) — a temperatura contínua 2.700–6.500 K é o caso
     mais duvidoso;
   - se justificado e hifenização atravessam **dentro** do WebView do Readium (`Q-ST.5`) — a spec
     dá isso como perdido em RN puro e suspeita que se recupere aqui;
   - se o Readium expõe o **texto extraído de página de PDF** (`Q-ST.8`). Esta é a mais cara: se
     não expuser, o índice de caracteres de PDF vira um segundo pipeline com `pdfjs-dist` na
     importação, e isso muda o Estágio 2;
   - se o **toque cru dentro do conteúdo** é observável pela camada RN (`Q-TEL.1`) — é o sinal de
     que `RN-TEL.17`/`RN-TEL.18` dependem; se não for, `RN-TEL.18` já dá o plano B por escrito.
4. **Tela C — sinais de sistema.** Um painel que loga `AppState` e carimbos, para descobrir na
   prática o que `RN-TEL.3` prevê: se o foco em multi-janela do Android é reportado (`Q-TEL.14`) e
   se `expo-keep-awake` altera o sinal de tela bloqueada. Registrar também que o relógio monotônico
   com suspensão (`elapsedRealtime`) **não é exposto pelo RN** e exige módulo nativo — o Estágio 6
   vai construí-lo, e este estágio mede quanto ele é mesmo necessário comparando `Date.now` e
   `performance.now` num ciclo de suspensão do emulador.
5. **Escrever o relatório inteiro cedo, ainda rústico**, com uma linha por pergunta e o veredito
   `pendente`, e só então preencher medição a medição. Se o contexto acabar, o relatório existe.

### Definição de pronto
- [ ] Captura de tela das 12 primitivas em Android, e uma linha de veredito por primitiva.
- [ ] EPUB **e** PDF abertos no Readium, com locator provado estável em duas configurações tipográficas.
- [ ] `Q-ST.1`, `Q-ST.2`, `Q-ST.5`, `Q-ST.8` com resposta escrita — ou, se alguma não puder ser
      medida, com o **motivo** escrito e um plano B nomeado. Pergunta sem resposta não vira silêncio.
- [ ] Anexo A de `specs/design-system.md` sem nenhuma linha em `não verificado`, ou com as
      remanescentes justificadas.
- [ ] `specs/medicao-app-de-prova.md` criado **e replicado no vault**.
- [ ] `.claude/retomada.md` registra a versão exata do `react-native-readium` fixada.

### Bifurcação a reportar ao usuário
Se o Readium RC se mostrar inviável (locator instável, build quebrado, PDF sem texto e sem
caminho), **parar e reportar** — `Q-ST.1` já nomeia o fallback (WebView + `foliate-js`, com o
custo de locator próprio), mas trocar a fundação é decisão do usuário, não do executor.

---

## Estágio 2 — Monorepo e o índice de caracteres

**Pré-requisito:** Estágio 1 (o veredito de `Q-ST.8` decide o pipeline de PDF).
**Objetivo:** o esqueleto do repositório e **o primeiro teste do projeto**, que `stack.md` §6 já
nomeia: o índice de caracteres.

### Leitura obrigatória
- `specs/stack.md` §5 (linhas 124–157) e §6 (linhas 159–195).
- `specs/telemetria-e-instrumentacao.md` §8 (grep `## 8. Volume lido`, ler até §9) — `RN-TEL.21` a `RN-TEL.27`.
- `specs/medicao-app-de-prova.md` (do Estágio 1), seção de `Q-ST.8`.

### Estrutura a criar

```
apps/app/          Expo — vazio nesta etapa, só o scaffold
apps/api/          Fastify — vazio nesta etapa, só o scaffold
packages/core/     TypeScript puro. Sem RN, sem Postgres, sem I/O (RN-ST.7)
packages/db/       Schema Drizzle — vazio nesta etapa
packages/design/   Tokens, fonte única de verdade do design system
```

pnpm workspaces + Turborepo + Biome + Vitest. Um `tsconfig` base com `strict: true` e
`noUncheckedIndexedAccess`.

**Regra de dependência mecânica, não de code review:** configurar a checagem que impede
`packages/core` de importar de `apps/*` (`RN-ST.7`) — via `eslint-plugin-boundaries` ou, mais
barato, um teste de arquitetura em Vitest que varre os imports. Preferir o teste: é uma
ferramenta a menos.

### `packages/design` — por que ele existe agora
Os tokens das três camadas (`design-system.md` §2) nascem aqui como **TypeScript**, e um script
gera a partir deles o bloco de `:root` em CSS para os mockups. Isso torna `RN-DS.19` ("tela nova
herda o catálogo") mecânico em vez de disciplinar, e é o que impede o app e os mockups de
divergirem como as três ilhas de mockup já divergiram entre si (133 + 140 + 128 classes, reuso zero).
Nesta etapa: só os pigmentos, as superfícies, a escala tônica de espaçamento e a escala
tipográfica. Os componentes vêm no Estágio 5.

### O índice de caracteres — TDD, nesta ordem

Assinatura pura, em `packages/core/src/indice/`:

```ts
type RecursoIndexado = { href: string; offset: number; comprimento: number };
type IndiceDeCaracteres = { recursos: RecursoIndexado[]; total: number };

montarIndiceEpub(arquivo: Uint8Array): IndiceDeCaracteres
montarIndicePdf(paginas: TextoDePagina[]): IndiceDeCaracteres
posicaoEmCaracteres(indice, href, progression): number
```

`fflate` descompacta, `htmlparser2` extrai o texto de cada recurso do spine. PDF entra pelo
**mesmo contrato de saída**, variando só a fonte do texto bruto (`stack.md` §6) — se o Estágio 1
respondeu que o Readium não expõe o texto, a entrada vem de `pdfjs-dist` na importação.

Testes obrigatórios, nomeados pelo ID:
- `RN-02.10` — o total exclui capa, ficha catalográfica, sumário e páginas de crédito.
- `RN-03.2` / `RN-03.3` — 1.500 caracteres = 1 página canônica; a conversão é global e idêntica
  entre duas obras diferentes.
- `RN-02.1f` — EPUB e PDF produzem a mesma forma de índice e o mesmo cálculo de progresso.
- `RN-ST.8` — o índice é gerado uma vez e serializável; um segundo cálculo sobre o mesmo arquivo
  dá resultado idêntico.
- `RN-TEL.27` — PDF sem camada de texto **não gera índice**: a função devolve recusa explícita,
  nunca um índice vazio silencioso (`Q-02.5` segue aberta como decisão de produto; o núcleo só
  precisa recusar de forma inequívoca).

**Fixtures:** dois EPUBs e um PDF de domínio público, pequenos, versionados em
`packages/core/test/fixtures/`. Um deles com sumário e página de créditos, para que
`RN-02.10` tenha o que excluir. Anotar a procedência de cada um no README do diretório.

### Definição de pronto
- [ ] `pnpm test` verde na raiz, com os testes de `packages/core` nomeados por ID de regra.
- [ ] `pnpm lint` e `pnpm typecheck` limpos.
- [ ] O teste de arquitetura de `RN-ST.7` existe e falha se alguém importar `apps/*` do core.
- [ ] O gerador de CSS de `packages/design` roda e produz um `:root` que bate com os pigmentos de
      `design-system.md` §2.1 — comparação automatizada, não visual.
- [ ] `CLAUDE.md` atualizado com os comandos reais de build/lint/test, como o próprio arquivo pede
      ("quando o código de produto começar, este arquivo deve ser atualizado"). **Replicar no vault.**

---

## Estágio 3 — `packages/core`: a apuração da sessão

**Pré-requisito:** Estágio 2.
**Objetivo:** as funções puras que transformam um traço de eventos em números — a peça de que
todo o resto do produto depende, e a única que dá para provar correta sem aparelho.

### Leitura obrigatória
- `specs/03-sessoes-e-metricas.md` §5.2 a §5.5 (linhas 46–110) e §6 inteira (linhas 134–237).
- `specs/telemetria-e-instrumentacao.md` §4 a §6 (linhas 67–191), §10 (linhas 299–331) e §14 (linhas 407–439).

### O formato do traço — decidir e fixar aqui

`RN-TEL.49` manda cada critério de aceitação de `03` §6 virar um **arquivo de traço de eventos**,
e diz textualmente que "o que falta é o formato". Este estágio o define. Proposta a implementar:

```jsonc
// packages/core/test/tracos/RN-03.6-virada-do-dia.json
{
  "descricao": "Começo a ler às 23:40 e sigo até 00:20",
  "fuso": "America/Sao_Paulo",
  "eventos": [
    { "tipo": "sessao_iniciada", "parede": 1755..., "mono": 0, "locator": {...} },
    { "tipo": "posicao_alterada", "parede": ..., "mono": 120000, "caracteres": 1500 },
    { "tipo": "pausa_iniciada", "parede": ..., "mono": ..., "pausa": "sistema" }
  ],
  "esperado": { "sessoes": 2, "tempoAtivoS": [1140, 1200], "diaDe": ["2026-08-23", "2026-08-24"] }
}
```

Um único *runner* em Vitest varre o diretório, roda a apuração e compara com `esperado`. Traço
novo = arquivo novo, sem código novo. É o que torna barato transformar em teste cada linha da
matriz de aparelho do Estágio 8 e cada bug de campo depois.

### Funções a implementar (`RN-TEL.48`)

Todas puras, **relógio como parâmetro de entrada, nunca variável global**:

| Função | Regras que ela executa |
|---|---|
| `apurarTempoAtivo(traco)` | `RN-03.9`–`RN-03.11`, `RN-TEL.12`, `RN-TEL.13` (idle subtrai **retroativamente**, sistema subtrai **do instante do sinal** — a distinção que devolve 90s por pausa se implementada errado), `RN-TEL.14` (graça) |
| `apurarBlocosDeFoco(traco)` | `RN-TEL.15`, `RN-TEL.16`, `RN-03.17b` — devolve a distribuição completa, não só o maior |
| `apurarVolume(traco, indice)` | `RN-TEL.21`–`RN-TEL.25`: caracteres inteiros, **união de intervalos** (não soma), salto não é leitura, teto físico por janela de 60s |
| `dividirNaViradaDoDia(traco, fuso)` | `RN-03.6`, `RN-TEL.44`–`RN-TEL.47`: dia civil local, horário de verão, viagem |
| `calcularLeituraConsciente(sessao)` | `RN-03.17`–`RN-03.21`, com o `max` entre as duas vias |
| `classificarEstilo(sessao)` | `RN-03.22`: Focado / Metódico / Equilibrado — **descrição, nunca nota** |
| `classificarSessao(sessao)` | `RN-03.7` (curta), `RN-03.26` (teto físico → suspeita), `RN-03.15` (sobreposição) |

**Arredondamento uma vez só, na apuração final** (`RN-TEL.11`) — arredondar por intervalo quebra
o invariante de `RN-TEL.50`.

### Testes

**Traços** (um arquivo por critério de aceitação de `03` §6): `SES-02`, `RN-03.11`, `RN-03.6`,
`SES-04`, `RN-03.24`, `RN-03.7`, `RN-03.19`, `RN-03.26`, `SES-07`, `SES-09`.
Os de `RN-03.8` (amostra e pílula) **saem do MVP** — a função pode aceitar o tipo, mas não há
traço a escrever.

**Propriedade** (`RN-TEL.50`, com traços gerados aleatoriamente — usar `fast-check`):
- `tempo_ativo ≤ tempo_bruto`, sempre;
- `tempo_ativo + soma(pausas) = tempo_bruto`, tolerância **zero** após o arredondamento único;
- `volume ≤ RITMO_MAXIMO_FISICO × tempo_ativo`, por janela e no total;
- reprocessar o mesmo traço duas vezes dá o mesmo resultado;
- sessão dividida na virada do dia não perde nem ganha um segundo em relação à original.

### Constantes
`packages/core/src/constantes.ts` com os valores de `glossario.md` §2.2 e
`telemetria` §17 — **tipados e injetáveis**, nunca lidos de um singleton. `mvp.md` §8 exige que
vivam em configuração de servidor; enquanto não há servidor, o default fica no core e a assinatura
já aceita override, para que o Estágio 9 não precise refatorar nada.

### Definição de pronto
- [ ] Todo traço de `03` §6 aplicável ao MVP existe como arquivo e passa.
- [ ] Os cinco invariantes de propriedade passam com ≥ 1.000 execuções cada.
- [ ] `RN-TEL.13` tem teste próprio provando a diferença entre subtração de `idle` e de `sistema`.
- [ ] Nenhuma função lê `Date.now` internamente — verificável por grep, e o grep vira teste.
- [ ] Cobertura de `packages/core` reportada; toda regra `RN-03.*` do escopo com pelo menos um caso.

---

## Estágio 4 — `packages/core`: meta, ofensiva, agregados e jardim

**Pré-requisito:** Estágio 3.
**Objetivo:** fechar o núcleo puro. Depois deste estágio, `packages/core` sabe responder tudo que
o produto exibe — só falta ter de onde vir o dado.

### Leitura obrigatória
- `specs/04-streaks-e-jardim.md` §5.1 a §5.5 (grep `^### 5\.` e ler as seções de meta, cumprimento,
  ofensiva, congelamento e jardim; linhas ~45–115).
- `specs/03-sessoes-e-metricas.md` §5.7 (linhas 126–131).
- `specs/mvp.md` §5 (adaptações A-1, A-2, A-3) e §7 (invariantes).

### Funções

| Função | Regras |
|---|---|
| `avaliarMeta(agregadoDoDia, meta)` | `RN-04.1`, `RN-04.2`, `RN-04.10`: soma de sessões com `conta_para_meta`, incluindo `curta` e `suspeita` |
| `alterarMeta(metaAtual, nova, hoje)` | `RN-04.4` (faixas), `RN-04.5` (sempre gratuito), `RN-04.6` (atrito de tempo), `RN-04.7` (vale do dia seguinte), `RN-04.8` |
| `recalcularOfensiva(diasOfensiva)` | `RN-04.11` — **derivada, nunca incrementada**. Invariante de `mvp.md` §7 |
| `aplicarCongelamento(dias, estoque)` | `RN-04.17`–`RN-04.19`, com A-1: concessão automática de 1/mês, estoque máx. 2. **Idempotente** — rodar duas vezes não consome dois |
| `avaliarMarcos(ofensiva)` | `RN-04.13` (7/30/100/365), `RN-04.14` (recorde), `RN-04.14a` (ofensiva encerrada preservada) |
| `estadoDoJardim(ofensiva, acervo)` | `RN-04.23` (5 estágios), `RN-04.25` (dormência), `RN-04.26` (saída imediata), `RN-04.27` (acervo só cresce) |
| `recalcularAgregados(sessoes)` | `RN-03.30`–`RN-03.32` |
| `fechamentoSemanal(agregados)` | `RN-04.39` |

### Testes — os invariantes que custam migração se violados

De `mvp.md` §7, cada um vira caso nomeado:
- `RN-04.11` — ofensiva derivada: alimentar `DiaOfensiva` fora de ordem e provar que o resultado
  independe da ordem de chegada.
- `RN-03.16` — sessão offline atrasada **recompõe** a ofensiva retroativamente.
- `RN-04.10f` — dia já celebrado **não é revertido** quando a sessão que o sustentava é invalidada
  ou descartada. É o caso mais fácil de implementar errado, porque contradiz o recálculo de `RN-04.11`.
- `RN-03.32` — agregado recalculado do zero ≡ agregado incremental (propriedade).
- `RN-04.19` — dia protegido por congelamento **mantém** a ofensiva mas **não conta** para marco.
- `RN-04.14a` — na dormência a apuração devolve **três** números: corrente (zero), encerrada, recorde.
- Idempotência do job diário (`mvp.md` §7, nota final): a função de virada roda duas vezes com o
  mesmo `(usuario, dia_local)` e não consome dois congelamentos nem recelebra o dia.
- **Dois eixos modelados, um exposto** (`RN-04.12`, `R-5`): a assinatura aceita eixo `leitura` |
  `escrita`; o teste prova que o eixo de escrita existe no tipo e devolve vazio no MVP.

### Definição de pronto
- [ ] Todos os invariantes de `mvp.md` §7 têm teste nomeado pelo ID e passando.
- [ ] `pnpm test` verde; cobertura de `packages/core` reportada no relatório de fechamento.
- [ ] Nenhuma função de ofensiva tem `++` ou acumulador persistido — verificável por leitura do diff.

---

## Estágio 5 — `apps/app`: fundação visual e navegação

**Pré-requisito:** Estágio 1 (Anexo A medido) e Estágio 2 (monorepo).
**Objetivo:** a casca do app com o design system funcionando como mecânica, não como disciplina.
Ainda sem leitor e sem dado real.

### Leitura obrigatória
- `specs/design-system.md` §2 (linhas 37–130), §3 (linhas 133–156), §4 (linhas 159–216),
  §7 (linhas 338–356), §8 (linhas 357–371), §9 (linhas 372–407) e §10 (linhas 408–444).
- `specs/medicao-app-de-prova.md` — as receitas que o Estágio 1 provou.
- `specs/direcao-visual.md` §3.2 (tabela tipográfica) e §4.1 (pauta obriga grade).

### Passos

1. **Expo Router v7, file-based.** Quatro abas em `(tabs)/`: **Jardim** (entrada), **Biblioteca**,
   **Caderno**, **Desempenho**. **O leitor fica fora do grupo de abas** (`RN-DS.18`: o leitor é
   modo, não destino). Perfil e Configurações **não são destinos de primeiro nível** — vivem no
   cabeçalho do Jardim.
2. **Unistyles 3 com as três camadas literais** (`stack.md` §3):
   pigmento → constantes TS de `packages/design`; superfície → **tema** Unistyles rebindando os
   cinco (`RN-DS.3`); papel semântico → **variant** de componente.
   `RN-ST.3`/`RN-DS.2` viram **erro de tipo**: o componente recebe uma prop `superficie` e só
   enxerga `theme.sup.*`. Escrever o tipo de forma que ler um pigmento direto não compile.
3. **As 12 primitivas viram componentes**, migrando as receitas medidas no Estágio 1. Skia onde a
   `View` nativa não chegou.
4. **O inventário de componentes** (`design-system.md` §6), começando pelos que os Estágios 6–8
   consomem: `bw-folha`, `bw-ficha`, `bw-cartao`, `bw-item`, `bw-botao`, `bw-abas-fichario`,
   `bw-cabeca`, `bw-numero-celebracao`, `bw-dado-tabular`, `bw-carimbo`, `bw-progresso-dia`,
   `bw-vazio`, `bw-celebracao`, `bw-dormencia`, `bw-importar`. Os demais entram quando a tela que
   os usa chegar — não construir inventário completo à frente da demanda.
5. **Contrato de estados** (`design-system.md` §7): os oito estados como tipo compartilhado.
   `RN-DS.16` — **vazio e dormência recebem arte**, não texto cinza. `P-12`: o estado de ausência
   recebe o mesmo investimento do estado ativo.
6. **Fontes** via `expo-font` + `@expo-google-fonts`: Spectral, EB Garamond, Courier Prime, Caveat
   (marca) e Public Sans, Atkinson Hyperlegible (painel da leitora). Entrelinha em **pixel inteiro**.
7. **Movimento e háptico** (`design-system.md` §9) com Reanimated 4 + `expo-haptics`. `RN-DS.15`:
   papel não quica; só o carimbo tem overshoot. `RN-DS.14`: reduzir movimento **não pula a
   cerimônia** — ela vira estado composto.
8. **Skill de projeto** `.claude/skills/bookworm-design-system/SKILL.md` (`stack.md` §9), carregando
   tokens, as 12 primitivas e as `RN-DS.*` — para que os estágios seguintes invoquem a skill em vez
   de reler as 531 linhas de `design-system.md`. Isto **paga por si já no Estágio 6**.

### Testes
- **Snapshot dos componentes** com `jest-expo` + React Native Testing Library — cada componente em
  cada estado do contrato.
- **Teste de token:** varredura que falha se qualquer arquivo de `apps/app` referenciar um pigmento
  (`--pig-*`, `verdeTinta`, hex literal) fora de `packages/design` (`RN-DS.1`, `RN-ST.3`).
- **Teste de espaçamento:** varredura que falha em valor de `padding`/`margin`/`gap` fora da escala
  tônica 3·6·9·12·18·27·36·54·81 (`RN-DS.4`). O levantamento achou 49 valores distintos nos
  mockups; esta é a rede que impede a repetição.
- **Alvo de toque ≥ 48×48dp** (`RN-DS.10`) e **contraste ≥ 4,5:1** (`RN-DS.11`): assertivas
  automatizadas sobre os tokens, aproveitando os contrastes **já calculados** em
  `.claude/retomada.md` — não recalcular.

### Definição de pronto
- [ ] App abre no emulador com as 4 abas navegáveis, cada uma em estado vazio **com arte**.
- [ ] Captura de tela das 4 abas.
- [ ] Os três testes de varredura (pigmento, espaçamento, toque) existem e passam.
- [ ] A skill de projeto existe e foi testada por invocação.

---

## Estágio 6 — `apps/app`: persistência e a máquina de estados da sessão

**Pré-requisito:** Estágios 3, 4, 5.
**Objetivo:** o app passa a **medir**. É o estágio mais técnico e o de maior risco de erro
silencioso — erro de relógio não aparece em teste de unidade, aparece no aparelho de quem viajou
ou dormiu com o app aberto.

### Leitura obrigatória
- `specs/telemetria-e-instrumentacao.md` §4 (linhas 67–108), §5 (linhas 111–146), §10 (linhas
  299–331), §12 (linhas 361–386) e §16 (linhas 538–554).
- `specs/stack.md` §7 (linhas 197–215).

### Passos

1. **`expo-sqlite` (WAL) + Drizzle**, com o schema em `packages/db` — o mesmo que servirá ao
   Postgres depois (`stack.md` §4). Entidades desta etapa: `Obra`, `ItemBiblioteca`,
   `ProgressoLeitura`, `SessaoLeitura`, `IntervaloInatividade`, `AgregadoDiario`, `MetaDiaria`,
   `DiaOfensiva`, `Ofensiva`, `Congelamento`, `Destaque`, `Anotacao`, `ConsultaDicionario`.
   **Modelar já** `Carteira` e `LancamentoLedger` vazios e a **segunda `Ofensiva`** do eixo escrita
   (`mvp.md` §7, `R-5`) — nascem sem movimento para que a fase 1 não exija migração.
2. **Módulo nativo do relógio monotônico.** `RN-TEL.6` exige um relógio que continua contando com
   o aparelho dormindo (`elapsedRealtime`), e `telemetria` §16 diz explicitamente que **o RN não o
   expõe** e que `performance.now` não serve — congela com o processo suspenso. Construir um módulo
   Expo mínimo (Kotlin) que devolve `SystemClock.elapsedRealtime()` e `SystemClock.uptimeMillis()`.
   É pouca linha de código e é a fundação de toda duração do produto.
3. **Máquina de estados em Zustand**, os cinco estados de `RN-TEL.1`:
   `ociosa → ativa → pausada_sistema | pausada_idle → encerrada | orfa`.
   **`RN-TEL.2` é a regra que não pode ser negociada: toda transição é gravada em disco antes de
   ser considerada efetiva.** O processo pode morrer sem aviso; o que não foi persistido não
   aconteceu.
4. **Sinais** (`RN-TEL.3`): `AppState` do RN para primeiro/segundo plano, `inactive` como estado
   transitório sujeito à graça de 3s, e o sinal de foco em multi-janela conforme o Estágio 1
   descobriu (`Q-TEL.14`). **`RN-TEL.4`: visibilidade não é leitura; foco é.**
5. **`RN-TEL.9` — tempo nunca é contado por tique de timer.** Toda duração é diferença entre dois
   carimbos, apurada na transição ou na retomada. Um `setInterval` que soma 1s por segundo está
   errado por construção e **não deve existir no código**.
6. **Catálogo de eventos fechado** (`RN-TEL.31`), com ULID gerado **no instante do fato**
   (`RN-ST.9`, `RN-TEL.32`), os dois carimbos e `deriva_relogio_ms` (`RN-TEL.10`).
7. **Outbox local** em SQLite (`stack.md` §7) — a fila existe, os itens se acumulam, **nada é
   enviado ainda** (não há servidor até o Estágio 9). Batimento a cada 30s **de tempo ativo**
   (`RN-TEL.39`), transportando **estado acumulado, não delta** (`RN-TEL.33`).
8. **Retomada local** (`RN-TEL.42`): ao abrir, procurar sessão local aberta antes de criar outra.

### Testes
- Os traços do Estágio 3 continuam sendo a fonte de verdade: a camada de app **emite eventos**, e a
  apuração continua sendo a função pura. Um teste de integração alimenta a máquina de estados com
  uma sequência de sinais e compara o traço emitido com o traço esperado — **o mesmo formato de
  arquivo do Estágio 3**.
- Teste de que a transição foi persistida antes de valer (`RN-TEL.2`): matar o store e reconstruir
  do SQLite, provando que o estado sobreviveu.
- Grep-teste: nenhum `setInterval`/`setTimeout` acumulando duração (`RN-TEL.9`).

### Validação manual obrigatória — em emulador
Não é opcional e não substitui a matriz de aparelho do Estágio 8, que exige aparelho físico:
| Cenário | Esperado |
|---|---|
| App para segundo plano | Pausa **imediata**, sem esperar os 90s (`RN-03.11`) |
| Retorno em < 30 min | **Mesma** sessão continua; o tempo pausado **não volta** (`RN-TEL.5`) |
| Retorno em > 30 min | Sessão nova |
| 90s sem interação | Pausa `idle`, subtraída **desde a última interação** (`RN-TEL.13`) |
| Notificação puxada e dispensada em < 3s | **Não** vira pausa e **não** quebra o bloco de foco (`RN-TEL.14`) |
| App morto pelo sistema | Ao reabrir, a sessão é recuperada do disco, não perdida (`RN-TEL.2`, `RN-TEL.42`) |
| Relógio do aparelho alterado durante a sessão | Duração **não muda**; `deriva_relogio_ms` registra (`RN-TEL.7`, `RN-TEL.10`) |

### Definição de pronto
- [ ] Os sete cenários acima executados no emulador, cada um com resultado escrito **antes** do teste.
- [ ] O módulo nativo do relógio compila e devolve valores que continuam avançando após suspensão.
- [ ] Teste de sobrevivência de estado a morte de processo, passando.
- [ ] Nenhum acúmulo de duração por timer no código.

---

## Estágio 7 — `apps/app`: biblioteca, importação e o leitor

**Pré-requisito:** Estágio 6.
**Objetivo:** o leitor real, ligado à máquina de estados. É a raiz da ordem de dependência de
`mvp.md` §3 e o item mais caro do MVP (`R-1`).

### Leitura obrigatória
- `specs/02-biblioteca-e-leitor.md` §5.1–5.2 (linhas ~55–90), §5.4–5.6 (linhas ~90–150) e §6.
- `specs/medicao-app-de-prova.md` — o que o Readium entrega e o que exige overlay (`Q-ST.2`).
- Invocar a skill `bookworm-design-system` em vez de reler o design system.

### Passos

1. **Importação** (`bw-importar`): `expo-document-picker` para EPUB e PDF, montagem do índice de
   caracteres pelo core (`RN-ST.8`: **uma vez, na importação, e persistido**), extração de
   metadados, cópia para armazenamento do app. Recusa explícita e legível para PDF sem camada de
   texto (`RN-TEL.27`, `Q-02.5`).
2. **Acervo de domínio público embarcado** — a adaptação A-4 de `mvp.md` §5 e o passo 5 do
   onboarding dependem dele. Nesta rodada: **3 a 5 obras**, com procedência e licença registradas
   em `specs/acervo-inicial.md`. A escolha da obra do passo 1 do onboarding (`Q-01.3`, `RN-01.5b`:
   leve, curta, abertura envolvente, neutra em gênero) fica **proposta, não decidida** — a spec
   sugere testar três candidatas com usuários.
3. **Biblioteca e Estante como duas divisórias da mesma aba** (`RN-02.6a`, `RN-02.6b`): Biblioteca
   mostra `lendo`/`quero_ler`/`em_pausa`; Estante mostra `concluido`, só cresce, e reler devolve à
   Biblioteca **sem** tirar da Estante. Obra abandonada **não aparece como lacuna** (`RN-02.22f`).
4. **Leitor imersivo** (`RN-02.13`): sem chrome, toque central revela controles, 3s de ausência os
   oculta. **`RN-02.13b` é uma proibição fechada** — nada de badge, ofensiva, meta, contador de
   destaques, tempo de sessão ou velocidade. A **única** exceção é a âncora de posição
   (`RN-02.13a`), configurável em três níveis, padrão `posicao_numero`.
5. **Painel de leitura — os dez controles de `RN-02.16d`**, todos, nenhum atrás de plano.
   `RN-02.16e`: pré-visualização ao vivo sobre o texto real, na posição corrente; nenhum ajuste
   reinicia a leitura ou encerra a sessão. `RN-02.16f`: restauração ao padrão, individual e em
   bloco. `RN-02.16g`: cinco faces, com pelo menos uma serifada, uma sans e **uma de alta
   legibilidade** — é o primeiro requisito de acessibilidade tipográfica do produto e não sai.
   **Instrumentar o uso de cada controle individualmente desde o dia 1** (`mvp.md` §12,
   evento `painel_controle_usado`, trilho de **produto**): é o que responde `Q-02.8`.
6. **Destaques, anotações, dicionário** (`RN-02.18`–`RN-02.21`): 4 pigmentos, nota acoplada,
   dicionário em painel sobreposto que **nunca navega para fora do leitor**. Cada um emite
   `interacao_qualitativa` — **nunca com o conteúdo** (`RN-TEL.19`).
7. **Resposta ao gesto** (`RN-02.17a`–`RN-02.17d`, `RN-02.17f`): virada com desaceleração não
   linear, grifo que preenche progressivamente como tinta absorvendo, vestígio permanente da
   palavra consultada. Tudo desativável em **uma única chave**. `R-2` avisa: isto **é** o produto,
   não é acabamento, e é o que uma equipe pequena tende a deixar por último e entregar mal.
8. **Sincronização de posição** (`RN-02.11`) fica local nesta etapa; a regra de conflito ("a
   posição mais avançada vence, com aviso") entra no Estágio 9.

### Testes
- Unidade/integração: mapeamento locator ↔ caractere ↔ página canônica em EPUB **e** PDF (`RN-02.1f`).
- `RN-02.9`: locator estável ao trocar corpo de fonte e ao girar — automatizável parcialmente,
  completado por verificação manual.
- `RN-02.6a`/`RN-02.6b`: obra concluída sai da Biblioteca; releitura a devolve **sem** tirá-la da Estante.
- Snapshot dos componentes de leitura em cada estado.

### Definição de pronto
- [ ] Importar um EPUB **do sistema de arquivos do emulador**, abrir, ler, fechar — e a sessão
      aparece no banco local com tempo ativo e volume plausíveis.
- [ ] O mesmo com um PDF (`RN-02.1f`), e a recusa correta de um PDF sem camada de texto.
- [ ] Os dez controles do painel funcionam com pré-visualização ao vivo, sem reiniciar a leitura.
- [ ] Nada proibido por `RN-02.13b` aparece na tela do leitor — verificação manual, item a item,
      com a lista da regra na mão.
- [ ] Captura de tela do leitor nos quatro temas.

---

## Estágio 8 — O loop de hábito: celebração, ofensiva e jardim

**Pré-requisito:** Estágio 7.
**Objetivo:** fechar a fatia vertical. Ao fim deste estágio o protótipo **existe como produto**.

### Leitura obrigatória
- `specs/04-streaks-e-jardim.md` §5.2 (cumprimento e celebração) e §5.4 (jardim).
- `specs/mvp.md` §9 (o jardim) e §11 (`R-2`, `R-3`).
- `analise-game-design/02-juiciness.md` — `J-06` (coreografia do resumo) e `J-11` (vida ambiente).
- `specs/03-sessoes-e-metricas.md` §7 (telas e estados).

### `R-3` — as três regras que andam juntas ou nenhuma funciona

`mvp.md` §11 é explícito: **implementar as três na mesma etapa.** Qualquer uma sozinha quebra o
comportamento, e é a correção do achado mais caro do diagnóstico de game design — a meta batida às
20h que só era celebrada à meia-noite.

1. **`RN-03.12a`** — o cliente avalia a meta **continuamente durante a sessão**, usando tempo ativo
   e volume acumulados no dispositivo somados ao já sincronizado do dia.
2. **`RN-02.14a` + `RN-04.10c`** — ao cumprir, **nada aparece**: sem contador, sem badge, sem
   sobreposição, sem som. A conquista fica **pendente em silêncio**.
3. **`RN-04.10b`** — a celebração acontece na **primeira fronteira natural**: fim do capítulo
   corrente (`fim_locator`) ou encerramento da sessão, o que vier primeiro.
   **`RN-04.10d`**: a pendência **nunca é perdida** — se o app morrer antes de exibir, ela aparece
   na próxima abertura, e é consumida **uma única vez por dia e por eixo** (`RN-04.10e`).
   **`RN-04.10f`**: o reconhecimento é **otimista** e um dia já celebrado **nunca é revertido**.

### Demais peças

4. **Resumo de sessão** (`03` §7): quando a meta foi cumprida nesta sessão e a conquista está
   pendente, **o resumo abre pela celebração**, antes dos números. Offline, mostra os números
   locais com aviso — e a celebração acontece normalmente.
5. **Jardim** — a tela de entrada. `mvp.md` §9 já fechou o inventário e é ele que manda:
   5 estágios de canteiro (broto/muda/planta florida/árvore/bosque), **1 paleta de dormência
   aplicada por filtro sobre os mesmos assets**, conjunto pequeno e reutilizável de elementos
   diários posicionados proceduralmente, 4 cosméticos (um por marco), e vida ambiente (vento, luz
   acompanhando a hora real). 2D ilustrado, **não 3D** (`Q-04.4` respondida).
   Renderizado em Skia — o mesmo substrato que produzirá o card no Estágio 11.
   **Duas exigências que não são detalhe de arte:** a dormência precisa ser **deslumbrante, não
   apagada** — uma dormência feia pune, uma dormência linda convida (`P-12`, `RN-DS.16`); e a vida
   ambiente é o que faz alguém abrir o app sem ter sido chamado, e sai barato porque é animação
   sobre assets que já existem.
6. **`bw-dormencia` mostra três números** (`RN-04.14a`): corrente (zero), a ofensiva encerrada
   apresentada **no passado**, e o recorde. Nenhuma superfície omite a encerrada nem a exibe como
   se ainda corresse.
7. **Meta:** tela de definição e alteração, com o atrito de tempo de `RN-04.6` e a vigência do dia
   seguinte de `RN-04.7`. **Alterar é sempre gratuito** (`RN-04.5`).
8. **Notificações locais** (`expo-notifications`, agendadas localmente — sem FCM no MVP):
   lembrete diário (padrão 20h) e ofensiva em risco. **`RN-01.16`: convite, nunca cobrança.**
   Copy proibido: culpa, contagem regressiva ameaçadora, comparação com outros. Máximo 2/dia
   (`RN-01.17`). **Suprimidas durante sessão ativa** e reagendadas para depois (`RN-02.14`).
9. **Congelamento** com a adaptação A-1: concedido automaticamente, 1/mês, estoque máximo 2.
   Consumo automático na virada do dia, com aviso ("usamos um congelamento para proteger seus 23
   dias") — nunca cobrança.

### Testes
- E2E **Maestro** do fluxo inteiro: abrir → importar → ler até bater a meta → **verificar que nada
  apareceu durante a leitura** → chegar ao fim do capítulo → celebração → jardim cresceu.
- Teste de `RN-04.10d`: matar o app com conquista pendente e provar que ela aparece na reabertura.
- Teste de `RN-04.10e`: segunda sessão no mesmo dia **não** repete a celebração.
- Teste de `RN-04.10f`: descartar a sessão que sustentava o dia e provar que o dia celebrado **não**
  é revertido, embora a ofensiva seja recalculada.
- Contra-teste de `RN-02.13b`/`RN-04.10c`: durante a leitura com meta cumprida, varrer a árvore de
  componentes do leitor e falhar se qualquer elemento de celebração, contador ou badge estiver montado.

### Definição de pronto
- [ ] Percurso completo executado no emulador, gravado ou capturado passo a passo.
- [ ] O E2E Maestro passa.
- [ ] O contra-teste de silêncio durante a leitura passa.
- [ ] Jardim renderiza os 5 estágios e a dormência — captura de cada um.
- [ ] `.claude/retomada.md` fechado com o estado da fatia vertical e a lista do que ficou fora.

---

## Estágios 9–14 — esboçados, a detalhar quando o Estágio 8 fechar

Não detalhados agora de propósito: o que o Estágio 1 medir e o que a fatia vertical revelar muda o
conteúdo deles. A **ordem** é a de `mvp.md` §3 e não deve ser alterada sem motivo.

| # | Estágio | Conteúdo | Regras-âncora |
|---|---|---|---|
| **9** | Servidor e sincronização | Fastify + TypeBox → OpenAPI, Postgres + Drizzle (mesmo schema), Fly.io `gru`, pg-boss, **job diário por fuso idempotente**, outbox passa a enviar, reconciliação offline, conflito de posição | `RN-ST.4`, `RN-ST.5`, `RN-ST.9`, `RN-03.14`–`RN-03.16`, `RN-02.11`, `RN-TEL.41` |
| **10** | Contas e onboarding | Better Auth (e-mail/senha + Google), **o onboarding É o leitor** — ler em < 60s, cadastro adiável até o fim do passo 2, fuso capturado do dispositivo | `RN-01.5`–`RN-01.5c`, `RN-01.14`, `CON-01`, `CON-03`–`CON-05` |
| **11** | Ghost Reader | Baseline por **mediana** das 3 primeiras sessões reais, um único desafio na abertura, invisível durante a sessão, uma linha no resumo. Custo é de **redação**, não de engenharia | `RN-06.1`–`RN-06.5`, `RN-06.12`–`RN-06.18`, `RN-06.23`–`RN-06.25` |
| **12** | Card e mapa de constância | Skia `makeImageSnapshotAsync` 1080×1920, 2 temas, só 9:16, marca não removível, mapa de constância só eixo leitura. **Decidir antes de começar** se o adesivo (`RN-08.22a`) entra — `mvp.md` §4.6 o deixou explicitamente não alocado | `RN-08.1`–`RN-08.7`, `RN-08.13`, `RN-08.17`–`RN-08.22`, `RN-08.28` |
| **13** | LGPD e privacidade | Exportação em JSON legível por máquina, exclusão com carência de 30 dias, opt-out do trilho de produto **sem afetar o de domínio** | `RN-01.18`, `RN-01.20`, `RN-TEL.38` |
| **14** | Matriz de aparelho e lançamento | `RN-TEL.51` em **aparelho físico**: bloqueio de tela, chamada atendida, notificação, tela dividida, PiP, baixa energia, Doze, dobrável, app morto sob pressão de memória, relógio alterado. Cada linha com resultado esperado escrito **antes**. Sentry, PostHog, saúde da instrumentação | `RN-TEL.51`, `RN-TEL.52`, `mvp.md` §12 |

**Nota sobre o Estágio 14:** ele não pode rodar em emulador. Se não houver aparelho Android físico
até lá, o estágio fica pendente e isso deve ser dito — `RN-TEL.51` é explícito ("nada disso se
prova em emulador"), e declará-lo cumprido sem aparelho seria exatamente o que `RN-DS.20` proíbe.

---

## Questões que seguem abertas, e o que o plano faz com elas

Nenhuma bloqueia o início. Registradas para que o executor não pare nelas nem as decida sozinho.

| ID | Estado |
|---|---|
| `Q-03.1` — página canônica de 1.500 caracteres | **O único bloqueio estrutural do MVP** (`mvp.md` §10). O plano constrói com 1.500 e o mantém **configurável e injetado**, nunca hardcoded — se o valor mudar, muda em um lugar |
| `Q-01.1` — jurisdição, LGPD/ECA, idade mínima | Não bloqueia até o Estágio 13. `CARENCIA_EXCLUSAO_CONTA` = 30 dias, *(a validar)* |
| `Q-01.3` — obra do passo 1 do onboarding | Estágio 7 propõe candidatas; a decisão é do usuário, com teste de conclusão |
| `Q-02.4` / `Q-ST.7` — dicionário PT-BR de licença livre | Não bloqueia: `RN-03.21` garante que a Leitura Consciente chega ao topo pela via do foco sem dicionário nenhum. Candidatos: Wikcionário PT (CC BY-SA), Dicionário Aberto |
| `Q-02.5` — PDF digitalizado sem camada de texto | Decisão de produto, não de stack. O núcleo **recusa de forma inequívoca** (`RN-TEL.27`); qual mensagem o usuário vê é decisão do Estágio 7 |
| `Q-02.8` — o painel de dez controles é um cockpit? | Não se corta controle antes de medir. A instrumentação individual entra no Estágio 7 e é o que responde |
| `Q-DS.1` — acento do kraft reprova (2,66:1) | Só afeta card, Estágio 12. Não usar kraft como superfície de acento até resolver |
| `Q-ST.6` — jardim em Skia se sustenta com uma dupla? | O Estágio 8 é a resposta empírica. Se não se sustentar, `mvp.md` §9 já dimensionou o inventário fechado — a alternativa é ilustrador + Rive, e é decisão do usuário |

---

## Verificação de ponta a ponta

O critério final desta rodada não é "os testes passam". É o percurso abaixo, executado num Android
por uma pessoa, do zero:

1. Instalar o dev build. Abrir o app.
2. Importar um EPUB do sistema de arquivos. A obra aparece na Biblioteca.
3. Abrir e ler. **Durante a leitura, nada de badge, contador, ofensiva ou celebração aparece** —
   só a âncora de posição.
4. Bater a meta do dia no meio de um capítulo. **Nada acontece na tela.**
5. Chegar ao fim do capítulo. **A celebração aparece aqui**, uma vez.
6. Fechar a sessão. O resumo mostra tempo ativo, páginas canônicas, estilo de leitura e destaques.
7. Voltar ao Jardim: ofensiva em 1, canteiro com um elemento novo.
8. Repetir no dia seguinte (ou avançar o relógio do emulador): ofensiva em 2, jardim mais denso.
9. Pular um dia: dormência **bonita**, com **três** números — zero corrente, contagem encerrada, recorde.
10. Ler de novo: paleta viva restaurada **imediatamente**, com ofensiva em 1 (`RN-04.26`).

Cada passo tem regra numerada por trás. Um passo que falhar não é polimento pendente: é regra
vinculante não cumprida, e o estágio correspondente não está pronto.

### Comandos de verificação por camada

```bash
pnpm lint && pnpm typecheck        # Biome + tsc, raiz do monorepo
pnpm test                          # Vitest (core, db) + jest-expo (app)
pnpm test --coverage --filter core # cobertura das RN- de packages/core (RN-ST.10)
pnpm maestro test .maestro/        # E2E do fluxo de hábito (Estágio 8+)
npx expo run:android               # dev build no emulador (RN-ST.2 — nunca Expo Go)
```
