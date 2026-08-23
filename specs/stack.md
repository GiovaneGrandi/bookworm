# Stack — decisão técnica do MVP

> Documento vinculante, no mesmo padrão das specs de módulo. Fixa a stack com que o MVP
> (`mvp.md`) é construído, amarra cada escolha a um ID de regra existente e registra como
> questão em aberto tudo que não foi medido. Produto de [`stack-plano.md`](stack-plano.md) —
> aquele documento descreve a pesquisa e o processo; este é o resultado.
>
> Escrito em 22/08/2026. Ponto de entrada das specs: [`00-overview.md`](00-overview.md).

## 1. O que este documento decide, e o que ele não decide

Decide: com que framework, linguagem, banco, hospedagem e ferramentas o MVP é construído, e
por quê cada escolha serve uma regra já escrita nas specs funcionais ou no design system.

Não decide: escopo (isso é `mvp.md`), identidade visual (isso é `direcao-visual.md` e
`design-system.md`), nem nada sobre as fases além do MVP — a stack de fase 1 (iOS, economia,
IA) é revisão futura, não extrapolação daqui.

Convenção de IDs, seguindo o precedente de `design-system.md`: regra **`RN-ST.n`**, questão
**`Q-ST.n`**. Documento transversal — prefixo próprio, sem número de módulo, como `RN-DS`/`Q-DS`.
Nunca reciclados.

---

## 2. Premissas herdadas

De [`mvp.md`](mvp.md) §2 e [`00-overview.md`](00-overview.md) §4 — esta seção não decide nada
nova, só fixa o que já estava decidido em outro lugar e que toda escolha abaixo respeita:

| Premissa | Fonte |
|---|---|
| Equipe solo ou dupla | `mvp.md:32` |
| React Native, **Android primeiro**; iOS na fase 1, web na fase 3 | `mvp.md:33`, `00-overview.md:86` |
| Nenhuma operação contínua no MVP: sem moderação, sem curadoria diária, sem suporte financeiro | `mvp.md:34` |
| Receita zero no MVP | `mvp.md:35` |
| Backend compartilhado entre superfícies, API própria; REST vs. GraphQL não fixado até aqui | `00-overview.md:89` |
| Leitura funciona offline; sessões registradas localmente e sincronizadas ao reconectar | `00-overview.md:88` |
| O renderer EPUB e PDF não deve ser escrito do zero (`R-1`) | `mvp.md:319` |
| `RN-DS.20` — nada do Anexo A de tradução CSS↔RN é declarado verificado sem medição em app real | `design-system.md:473` |

**`RN-ST.1`** — Nenhuma escolha desta stack contradiz `mvp.md` §2: equipe pequena, Android
primeiro, zero operação contínua. Uma peça que exige equipe maior, plataforma adicional ou
manutenção contínua para funcionar está fora da stack do MVP por definição, não por preferência.

---

## 3. Cliente

| Camada | Escolha | Amarração |
|---|---|---|
| Framework | **Expo SDK 55** (RN 0.83, React 19.2, New Architecture única) + **dev build** via EAS. Nunca Expo Go — Readium, Skia e SQLite são nativos | `mvp.md:33` |
| Navegação | **Expo Router v7**, file-based. As 4 abas em `(tabs)/`; **o leitor fora do grupo**, porque o leitor é modo, não destino | `RN-DS.18` |
| Estilo | **Unistyles 3** (core C++/JSI, troca de tema sem re-render) | `RN-DS.1`, `RN-DS.2`, `RN-DS.3` |
| Gráficos | **React Native Skia** | `mvp.md` §9, `RN-08.7` |
| Movimento | **Reanimated 4** + Gesture Handler + `expo-haptics` | `design-system.md:372-404`, `RN-02.17a` |
| Leitor | **`react-native-readium`** (MIT, wrapper do Readium Kotlin), EPUB e PDF | `R-1`, `RN-02.9`–`RN-02.12`, `RN-02.1a`, `RN-02.1f` |
| Extração de texto de PDF | **`pdfjs-dist`**, condicionado a `Q-ST.8` — só entra se o Readium RN não expuser texto de página nativamente | §6, `RN-02.1f` |
| Persistência | **`expo-sqlite`** (WAL) + **Drizzle ORM** | `RN-02.27`, `RN-03.14` |
| Estado | **Zustand** (sessão em curso) + **TanStack Query** (servidor) + live queries do Drizzle | `RN-03.12a` |
| Fontes | `expo-font` + `@expo-google-fonts`: Spectral, EB Garamond, Courier Prime, Caveat (marca) · Public Sans, Atkinson Hyperlegible (painel de leitura) | `direcao-visual.md` §3.2, `RN-02.16g` |
| Notificações | `expo-notifications` + `expo-task-manager`, **agendadas localmente** no MVP; FCM só provisionado | `RN-01.15`–`RN-01.17`, `RN-04.30`–`RN-04.34`, `RN-02.14` |

**`RN-ST.2`** — O cliente do MVP é sempre um dev build via EAS, nunca Expo Go. Readium, Skia e
SQLite exigem módulos nativos que o Expo Go não carrega; construir contra Expo Go produziria um
app que quebra no primeiro `expo run:android`.

### Skia é o que salva o Anexo A

`design-system.md` §11 lista seis linhas do Anexo A como `não verificado`, e quatro delas são
limitações de *primitiva CSS em `View` nativa*, não de conceito: gradiente de canto (`P-2`),
relevo `inset` (`P-3`), sombra colorida — que `elevation` do Android não faz (`P-4`) — e
`mix-blend-mode: multiply` do grifo (`P-7`). As quatro são triviais em Skia (`Shader` para o
gradiente, `InnerShadow` para o relevo, `DropShadow` com cor para a sombra, `BlendMode.Multiply`
para o grifo). Escolher Skia não é preferência estética: é o que impede a assinatura mecânica de
degradar no Android, e é o mesmo renderer que produz o jardim (`mvp.md` §9) e o card 9:16 via
`makeImageSnapshotAsync` (`RN-08.7`, `RN-08.23`: 1080×1920 PNG, incluindo o adesivo com alfa de
`RN-08.22a`).

Isso não resolve `Q-DS.5` — continua sendo hipótese até medição em Android real (§6 abaixo e
`RN-DS.20`). O que muda é que a hipótese passa a ter um caminho de implementação concreto, em
vez de ficar em aberto sem proposta.

### Unistyles mapeia as três camadas de token literalmente

Pigmento → constantes TypeScript; superfície → *tema* Unistyles (rebindando os cinco: fundo,
tinta, acento, borda, sombra — `RN-DS.3`); papel semântico → *variant* de componente. `RN-DS.2`
("todo componente declara a superfície em que vive") deixa de ser disciplina de code review e
vira erro de tipo: um componente recebe uma prop `superficie` e só enxerga `theme.sup.*`, nunca
um pigmento bruto.

NativeWind foi recusado por dois motivos: o benchmark citado no plano coloca o Unistyles em
66ms contra 197ms do NativeWind numa troca de tema, e o modelo de classe utilitária torna o
rebind simultâneo dos cinco tokens de superfície uma convenção — algo que um desenvolvedor pode
esquecer de fazer — em vez de uma garantia estrutural.

**`RN-ST.3`** — Nenhum componente de React Native lê um pigmento (`--pig-*`) diretamente; todo
componente declara sua superfície via prop e o Unistyles resolve o tema. Tradução direta de
`RN-DS.1`/`RN-DS.2` para o mecanismo concreto do cliente.

---

## 4. Servidor

| Camada | Escolha | Justificativa curta |
|---|---|---|
| Runtime/API | **Fastify + TypeScript**, **REST** com JSON Schema (TypeBox) → OpenAPI gerado | Fecha o "não fixado" de `00-overview.md:89`. GraphQL recusado: um cliente, uma dupla. NestJS recusado: peso de DI para dois devs — reavaliar se a equipe crescer |
| Banco | **Postgres gerenciado** + **Drizzle** (mesmo schema TS do cliente) | Ledger append-only e idempotência por chave exigem transação ACID e `unique` como mecanismo |
| Hospedagem | **Fly.io, região `gru` (São Paulo)** | Única das três PaaS comparadas com região no Brasil. `RN-02.11` sincroniza a cada troca de capítulo — latência é sentida na leitura |
| Filas e cron | **pg-boss** (no próprio Postgres, sem Redis) | O job diário por fuso (24+ execuções) precisa ser idempotente: chave `(usuario, dia_local)` com `unique`, conforme `mvp.md:236` |
| Auth | **Better Auth** (e-mail/senha + Google) | Auth.js foi incorporado ao Better Auth e Lucia está deprecada. Apple fica para a fase 1 com o iOS (`Q-01.2` não bloqueia no Android) |
| Config | Constantes do `glossario.md` em **tabela de configuração**, com cache e versionamento | `mvp.md:242` — vivem em configuração de servidor por serem requisito de arquitetura, não preferência |
| Observação | Sentry (app + API) + `pino`; PostHog para as métricas de `mvp.md` §12 | §12 manda instrumentar cada controle do painel e a âncora de posição desde o dia 1 |

**`RN-ST.4`** — A API é REST, não GraphQL, enquanto a equipe for solo ou dupla (`mvp.md:32`).
Reabrir esta decisão exige que a premissa de equipe em `mvp.md` §2 mude primeiro.

**`RN-ST.5`** — Todo ganho ou perda que afete o ledger financeiro (mesmo vazio no MVP, ver §7)
é uma transação Postgres com idempotência por chave única, nunca um `UPDATE` incremental.
Amarração direta: as `Previstas mas vazias` de `mvp.md` §7 (`Carteira`, `LancamentoLedger`)
precisam nascer com esse mecanismo para não exigir migração na fase 1.

---

## 5. `packages/core` e a forma do monorepo

Monorepo **pnpm workspaces + Turborepo**: `apps/app`, `apps/api`, `packages/core`,
`packages/db`, `packages/design`.

`packages/core` é TypeScript puro — **sem React Native, sem Postgres, sem I/O**. Mora nele: a
página canônica (`RN-03.2`, `RN-03.3`), tempo ativo e idle (`RN-03.9`–`RN-03.13`), Leitura
Consciente (`RN-03.17`–`RN-03.22c`), o teto físico de ritmo (`RN-03.26`), a checagem de
sobreposição de sessão (`RN-03.15`), a ofensiva derivada de `DiaOfensiva` (`RN-04.11`), a
baseline por mediana (`RN-06.1`–`RN-06.5`) e os agregados recalculáveis
(`RN-03.30`–`RN-03.32`).

Isso resolve três exigências que, implementadas separadamente em cliente e servidor,
produziriam duas lógicas divergentes:

1. `RN-03.12a` manda o **cliente** avaliar a meta continuamente; a spec de sessões manda o
   **servidor** ser a autoridade final. Rodar o mesmo código nos dois lados é o que garante que
   a celebração otimista (`RN-04.10a`–`f`) nunca seja desmentida pela reconciliação — a
   correção de `R-3` depende disso.
2. `RN-03.32` exige agregado recalculável a partir da sessão bruta — a função de recálculo
   precisa ser uma só, chamada dos dois lados, não duas implementações que podem divergir.
3. É onde o **TDD por padrão** do `CLAUDE.md` rende: funções puras, sem mock de rede nem de
   banco.

**`RN-ST.6`** — Todo `RN-` que vive em `packages/core` tem um teste nomeado pelo próprio ID
(ex.: o teste de `RN-03.15` chama-se `RN-03.15`, não uma descrição livre). É a tradução
concreta do "TDD por padrão" do `CLAUDE.md` para este repositório: a regra numerada é o nome
do caso de teste, não uma referência em comentário.

**`RN-ST.7`** — Nenhuma lógica de `packages/core` importa de `apps/app` ou `apps/api`. A
dependência é sempre unidirecional (apps → core), porque o núcleo puro é o que garante que
cliente e servidor concordam sem duplicar código.

---

## 6. Leitor EPUB e PDF: o que o Readium entrega, o que falta, e o índice de caracteres

`react-native-readium` (MIT, wrapper do Readium Kotlin) é a base — decisão já tomada com o
usuário e registrada em `stack-plano.md`, aqui fixada. Ele resolve `R-1`: locators estáveis,
paginação, seleção de texto e busca não precisam ser escritos do zero.

O que falta: Readium expõe `locations.progression`/`position`, **não offset em caracteres**.
Mas `RN-02.10` e `RN-03.2` fazem *toda* a métrica depender de caracteres do conteúdo principal,
excluindo capa, ficha, sumário e créditos — e é a resposta prática que este documento propõe
para `Q-03.1`.

**Decisão: índice de caracteres por obra, montado na importação.** `fflate` descompacta o
EPUB, `htmlparser2` extrai o texto de cada recurso do spine, e o índice guarda o offset
cumulativo por recurso. Posição em caracteres = `offset[href] + progression × len(href)`. Mora
em `packages/core`, é função pura, e é **o primeiro teste a ser escrito no projeto**.

**PDF entra pelo mesmo pipeline de índice, com um extrator diferente na entrada.** O Readium
Kotlin trata PDF como um segundo tipo de publicação (via PDFium), o que resolve renderização e
navegação por página — mas a página nativa do PDF não é a unidade de métrica (`RN-03.1`), e
`RN-02.1f` exige a mesma paridade de progresso por caractere que o EPUB tem. A decisão é extrair
o texto de cada página com o mesmo extrator do lado nativo do Readium (ou, se a integração RN
não expuser esse texto, com `pdfjs-dist` rodando no índice de importação) e montar o índice
cumulativo por página em vez de por recurso do spine — mesma função pura em `packages/core`,
mesmo contrato de saída (`offset` acumulado), a única variação é a fonte do texto bruto.
**PDF digitalizado por imagem, sem camada de texto, não gera índice** — a importação recusa o
arquivo ou avisa que a paridade de métrica não se aplica (`Q-02.5`, ainda sem resposta; decisão
de produto, não de stack).

`RN-03.23` (validação server-side contra o texto real) permanece suspensa pelo corte de
antifraude do MVP (`mvp.md` §4.2, "Sai"), então o índice de caracteres é responsabilidade do
cliente no MVP, e sobe ao servidor junto com o payload da sessão.

**`RN-ST.8`** — O índice de caracteres é gerado uma vez, na importação da obra, e persistido —
nunca recalculado a cada leitura de posição. Recalcular a cada sessão reabriria o custo que a
importação única evita. Vale igualmente para EPUB e PDF.

---

## 7. Sincronização e offline

Sem PowerSync (serviço e custo a mais para uma equipe que não opera nada continuamente,
`mvp.md:34`) e sem WatermelonDB (schema próprio, duplicando o Drizzle que já serve cliente e
servidor). **Outbox próprio**, que é o que a spec de sessões já descreve:

- IDs de cliente estáveis (ULID), porque `modelo-de-dados.md:206` exige que o reenvio não
  duplique.
- Envio em lote com resultado por sessão (`03-sessoes-e-metricas.md:275`).
- Janela de 7 dias de retenção offline (`RN-03.14`).
- Recomposição retroativa de ofensiva quando uma sessão atrasada chega (`RN-03.16`).
- Conflito de progresso de leitura: **a posição mais avançada vence, com aviso ao usuário**
  (`RN-02.11`) — regra já escrita na spec de leitor, não inventada aqui.

**`RN-ST.9`** — Toda sessão enviada pelo outbox carrega um ULID gerado no cliente no momento
da criação da sessão, não no momento do envio. É o que torna o reenvio depois de uma falha de
rede idempotente no servidor.

---

## 8. Qualidade, TDD e CI

- **App:** `jest-expo` + React Native Testing Library.
- **API e `packages/core`:** Vitest.
- **E2E:** Maestro (YAML, roda em dev build e em EAS Workflows). O fluxo de onboarding
  `RN-01.5a` — abrir e ler em menos de 60s — é caso de teste E2E, não só métrica de analytics.
- **Integração:** banco efêmero por execução, usado para testar o job diário idempotente
  (`mvp.md:236`) e, na fase 1, o ledger.
- **Lint/format:** Biome, um binário só.
- **CI:** GitHub Actions + EAS Workflows.

**`RN-ST.10`** — Todo `RN-` de `packages/core` tem cobertura Vitest antes de qualquer PR que o
implemente ser aberto — consequência direta de `RN-ST.6` e do TDD por padrão do `CLAUDE.md`:
teste primeiro, ver falhar, então implementar.

---

## 9. Skills, plugins e ferramentas de agente

Comandos apresentados para confirmação do usuário — **nenhuma instalação sem ele aprovar**.

| O quê | Comando | Por quê |
|---|---|---|
| Skills oficiais Expo | `/plugin install expo@claude-plugins-official` | ~23 skills oficiais: `expo-router`, `expo-design-system`, `expo-animation`, `expo-project-structure`, `expo-dev-client`, `eas-*`. Fonte oficial |
| Expo MCP | conforme `docs.expo.dev/mcp` | Inspeciona o projeto, recomenda pacotes compatíveis com o SDK fixado, conversa com EAS |
| Postgres | `npx skills add supabase/agent-skills@supabase-postgres-best-practices` | 363,6K instalações. Conteúdo é Postgres (schema, índices, RLS) e serve mesmo sem Supabase — ressalva: parte do conteúdo é específica do produto deles |

Não existe skill de peso relevante para Drizzle, Fastify, Skia, Readium ou Unistyles — este
documento registra isso para não se procurar de novo. Em vez disso, propõe-se uma **skill de
projeto** em `.claude/skills/bookworm-design-system/`, carregando os tokens, as doze primitivas
e as regras `RN-DS.*`, para que o design system entre em contexto por invocação e não por
releitura das 531 linhas de `design-system.md` — doutrina de retomada barata do `CLAUDE.md`.

---

## 10. O que foi recusado, e por quê

Registro para não reabrir a discussão sem motivo novo:

| Recusado | Em favor de | Por quê |
|---|---|---|
| GraphQL | REST + JSON Schema | Um cliente, uma dupla — a flexibilidade de GraphQL não paga o custo de resolver e manter um schema federado a mais |
| NestJS | Fastify puro | Peso de injeção de dependência não se justifica para dois desenvolvedores; reavaliar se a equipe crescer |
| NativeWind | Unistyles 3 | Benchmark citado no plano: 197ms contra 66ms numa troca de tema; classe utilitária não garante o rebind simultâneo dos cinco tokens de superfície que `RN-DS.3` exige |
| PowerSync | Outbox próprio | Serviço e custo a mais; `mvp.md:34` fixa zero operação contínua no MVP |
| WatermelonDB | `expo-sqlite` + Drizzle | Schema próprio duplicaria o Drizzle que já serve cliente e servidor |
| Lottie/skottie | React Native Skia | Skia já é o substrato do jardim e do card; um segundo motor de animação não se justifica |
| `epub.js`, `foliate-js` (via WebView) | `react-native-readium` | Ambos exigem locator próprio; Readium entrega locator estável nativamente (`R-1`) |
| Renderer EPUB/PDF próprio | Base existente (Readium) | `R-1`: meses de trabalho que uma dupla não tem para gastar em paginação e busca de texto |

---

## 11. Riscos técnicos, cruzados com `mvp.md` §11

| Risco de `mvp.md` | Como esta stack responde | O que continua em aberto |
|---|---|---|
| `R-1` — renderer EPUB e PDF não deve ser escrito do zero | `react-native-readium` resolve locator, paginação e busca em EPUB; PDF via PDFium embutido, com índice de caracteres por extração de texto (§6) | `Q-ST.1` — RC, sem versão estável fixada ainda; `Q-ST.8` — extração de texto de PDF dentro do Readium RN não verificada |
| `R-2` — arte do jardim e juice são o produto | Skia como substrato único do jardim e do card | `Q-ST.6` — se a dupla sustenta produção de arte em código Skia, ou precisa de Rive/ilustrador |
| `R-3` — três regras de celebração otimista precisam andar juntas | `packages/core` compartilhado entre cliente e servidor garante que `RN-03.12a`, `RN-02.14a` e `RN-04.10a`–`f` rodem do mesmo código | Nenhum — a arquitetura é a resposta completa |
| `R-4` — `RN-06.8` é restrição de arquitetura | Nenhuma tabela do modelo de dados mínimo ordena por desempenho; API não expõe endpoint de ranking | Vigilância contínua em code review, não uma peça de stack |
| `R-5` — modelagem precisa antecipar a fase 1 | Postgres + Drizzle já modela `Carteira`/`LancamentoLedger` vazios e a segunda `Ofensiva`, sem exigir migração de schema depois | Nenhum |

---

## 12. Questões em aberto

Nenhuma pode ser declarada resolvida sem medição — `RN-DS.20` vale aqui também.

| ID | Pergunta |
|---|---|
| `Q-ST.1` | `react-native-readium` está em release candidate. Qual versão o projeto fixa, e qual é o plano se a evolução parar? O fallback é WebView + `foliate-js`, com o custo de locator próprio |
| `Q-ST.2` | Dos dez controles obrigatórios de `RN-02.16d`, quais o Readium entrega por preferência nativa e quais exigem CSS injetado ou overlay? A temperatura contínua 2.700–6.500K (`RN-02.16a`) é o caso mais duvidoso |
| `Q-ST.3` | O provedor de Postgres escolhido tem região no Brasil? Se não tiver, o app fica em `gru` e o banco fora — medir antes de fixar |
| `Q-ST.4` | Better Auth em Expo: o plugin mobile cobre e-mail/senha + Google com refresh em background? |
| `Q-ST.5` | Justificado e hifenização não atravessam para RN puro (Anexo A). Dentro do Readium, que roda WebView, atravessam? Reabre uma linha dada como perdida em `design-system.md` |
| `Q-ST.6` | O jardim em Skia é código, não arquivo de ilustrador. `R-2` diz que a arte **é** o produto: com uma dupla, isso se sustenta ou o projeto precisa de Rive e de um ilustrador? |
| `Q-ST.7` | `Q-02.4` segue sem resposta: o levantamento não achou dicionário PT-BR de licença livre verificada (Aurélio e Michaelis são proprietários). Candidatos a avaliar: Wikcionário PT (CC BY-SA), Dicionário Aberto |
| `Q-ST.8` | `react-native-readium` expõe texto extraído de página PDF diretamente, ou a extração precisa rodar fora do Readium (`pdfjs-dist` sobre o arquivo bruto, no momento da importação)? Não medido — decide se o índice de caracteres de PDF é uma variação pequena do pipeline de EPUB ou um segundo pipeline inteiro |

---

## 13. Índice de regras

| ID | Regra |
|---|---|
| `RN-ST.1` | Nenhuma escolha desta stack contradiz `mvp.md` §2: equipe pequena, Android primeiro, zero operação contínua |
| `RN-ST.2` | O cliente do MVP é sempre um dev build via EAS, nunca Expo Go |
| `RN-ST.3` | Nenhum componente lê um pigmento diretamente; toda superfície é declarada via prop e resolvida pelo Unistyles |
| `RN-ST.4` | A API é REST, não GraphQL, enquanto a equipe for solo ou dupla |
| `RN-ST.5` | Todo ganho ou perda que afete o ledger é transação Postgres com idempotência por chave única |
| `RN-ST.6` | Todo `RN-` que vive em `packages/core` tem um teste nomeado pelo próprio ID |
| `RN-ST.7` | `packages/core` nunca importa de `apps/app` ou `apps/api` |
| `RN-ST.8` | O índice de caracteres é gerado uma vez, na importação, e persistido — nunca recalculado a cada leitura |
| `RN-ST.9` | Toda sessão do outbox carrega um ULID gerado no momento da criação, não do envio |
| `RN-ST.10` | Todo `RN-` de `packages/core` tem cobertura Vitest antes do PR que o implementa ser aberto |

---

## Próximo passo

Não é escrever tela. É o **app mínimo de medição** que `design-system.md:471` já define: as
doze primitivas lado a lado em Android real, mais um EPUB e um PDF abertos pelo Readium para
medir locator estável e o índice de caracteres nos dois formatos. Ele fecha `Q-ST.1`, `Q-ST.2`,
`Q-ST.5` e `Q-ST.8`, e converte seis linhas do Anexo A de `não verificado` para medido — que é
exatamente o que `mvp.md` §3 chama de raiz da ordem de dependência.
