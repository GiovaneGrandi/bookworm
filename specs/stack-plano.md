# Plano — `specs/stack.md`: decisão de stack do MVP

> **Documento de plano, não de especificação.** Ele descreve a rodada que ainda vai
> produzir `specs/stack.md` — a decisão vinculante de stack. Enquanto `stack.md` não
> existir, nada aqui é regra: é o desenho da rodada, com a pesquisa já feita e as
> quatro escolhas de fundo já tomadas com o usuário (API própria em TypeScript,
> `react-native-readium`, React Native Skia, entregável só documental).
>
> Escrito em 22/08/2026. Ponto de entrada das specs: [`00-overview.md`](00-overview.md).

## Contexto

O repositório está em fase de especificação: 5.568 linhas de spec, zero linhas de código de produto. `mvp.md` §3 já fixa a **ordem de dependência** da construção (`02` → `03` → `04` → `01` → `06`+`08`) e §11 nomeia os riscos, mas **nenhum documento diz com o quê construir**. As únicas decisões técnicas registradas hoje estão espalhadas e são parciais:

- `00-overview.md:86-89` — React Native; backend "API própria", **REST vs. GraphQL deliberadamente não fixado**.
- `mvp.md:33` — Android primeiro, equipe **solo ou dupla**, receita zero.
- `mvp.md:319` (`R-1`) — o renderer EPUB "não deve ser escrito do zero"; cita Readium, `epub.js`, `foliate-js` sem escolher.
- `design-system.md` §11 (Anexo A) — 6 das 13 linhas da tradução CSS↔RN são **hipótese não verificada** (`Q-DS.5`), e `RN-DS.20` proíbe declará-las resolvidas sem medição em app real.

Sem essa decisão escrita, a primeira sessão de código vai improvisá-la — e as invariantes de `mvp.md` §7 ("violá-las depois custa migração") não sobrevivem a improviso. O resultado pretendido é um documento vinculante, no mesmo padrão das specs de módulo, que fixe a stack, amarre **cada escolha a um ID de regra existente**, e registre como questão em aberto tudo que não foi medido.

**Entregável:** `specs/stack.md` (novo) + réplica no vault + ponteiros. **Nenhum código nesta rodada.**

---

## Decisões a registrar no documento

Convenção de IDs, seguindo o precedente de `design-system.md`: regra **`RN-ST.n`**, questão **`Q-ST.n`**. Nunca recicladas.

### 1. Cliente

| Camada | Escolha | Amarração |
|---|---|---|
| Framework | **Expo SDK 55** (RN 0.83, React 19.2, New Architecture única) + **dev build** via EAS. Nunca Expo Go — Readium, Skia e SQLite são nativos | `mvp.md:33` (dupla não mantém Gradle/Xcode) |
| Navegação | **Expo Router v7**, file-based. As 4 abas em `(tabs)/`; **o leitor fora do grupo**, porque `RN-DS.18` diz que ele é modo, não destino | `design-system.md:441-443` |
| Estilo | **Unistyles 3** (core C++/JSI, troca de tema sem re-render) | `RN-DS.1`–`RN-DS.3` |
| Gráficos | **React Native Skia** | `mvp.md` §9, `RN-08.7`, Anexo A |
| Movimento | **Reanimated 4** + Gesture Handler + `expo-haptics` | `design-system.md:372-404`, `RN-02.17a` |
| Leitor | **`react-native-readium`** (MIT, wrapper do Readium Kotlin) | `R-1`, `RN-02.9`–`RN-02.12` |
| Persistência | **`expo-sqlite`** (WAL) + **Drizzle ORM** | `RN-02.27`, `RN-03.14` |
| Estado | **Zustand** (sessão em curso) + **TanStack Query** (servidor) + live queries do Drizzle | `RN-03.12a` |
| Fontes | `expo-font` + `@expo-google-fonts`: Spectral, EB Garamond, Courier Prime, Caveat (marca) · Public Sans, Atkinson Hyperlegible (painel de leitura) | `direcao-visual.md` §3.2, `RN-02.16g` |
| Notificações | `expo-notifications` + `expo-task-manager`, **agendadas localmente** no MVP; FCM só provisionado | `RN-01.15`–`RN-01.17`, `RN-04.30`–`RN-04.34`, `RN-02.14` |

**Dois argumentos que o documento precisa fazer por extenso, porque são o miolo da escolha:**

**Skia é o que salva o Anexo A.** Quatro das seis linhas `não verificadas` são limitações de *primitiva CSS em View nativa* — gradiente de canto (`P-2`), relevo `inset` (`P-3`), **sombra colorida, que `elevation` do Android não faz** (`P-4`) e `mix-blend-mode: multiply` do grifo (`P-7`). Todas as quatro são triviais em Skia (`Shader`, `InnerShadow`, `DropShadow` com cor, `BlendMode.Multiply`). Escolher Skia não é preferência estética: é o que impede a assinatura mecânica de degradar no Android, e é o mesmo renderer que produz o jardim (§9) e o card 9:16 via `makeImageSnapshotAsync` (`RN-08.7`, `RN-08.23`: 1080×1920 PNG) — inclusive o adesivo com alfa de `RN-08.22a`.

**Unistyles mapeia as três camadas de token literalmente.** Pigmento → constantes TS; superfície → *tema* Unistyles (rebindando os cinco: fundo, tinta, acento, borda, sombra, `RN-DS.3`); papel semântico → *variants* de componente. `RN-DS.2` ("todo componente declara a superfície em que vive") deixa de ser disciplina e vira erro de tipo: um componente recebe `superficie` e só enxerga `theme.sup.*`. NativeWind foi recusado por dois motivos — o benchmark citado o coloca em 197ms contra 66ms do Unistyles, e o modelo de classe utilitária torna o rebind simultâneo dos cinco tokens uma convenção, não uma garantia.

### 2. Servidor

| Camada | Escolha | Justificativa curta |
|---|---|---|
| Runtime/API | **Fastify + TypeScript**, **REST** com JSON Schema (TypeBox) → OpenAPI gerado | Fecha o "não fixado" de `00-overview.md:89`. GraphQL recusado: um cliente, uma dupla. NestJS recusado: peso de DI para dois devs — reavaliar se a equipe crescer |
| Banco | **Postgres gerenciado** + **Drizzle** (mesmo schema TS do cliente) | `RN-07.27`/`RN-07.31` pedem ledger append-only e idempotência por chave: transação ACID e `unique` são o mecanismo |
| Hospedagem | **Fly.io, região `gru` (São Paulo)** | É a única das três PaaS comparadas com região no Brasil. `RN-02.11` sincroniza **a cada troca de capítulo** — latência é sentida na leitura |
| Filas e cron | **pg-boss** (no próprio Postgres, sem Redis) | O job diário por fuso (24+ execuções) precisa ser idempotente: chave `(usuario, dia_local)` com `unique`, conforme `mvp.md:236` |
| Auth | **Better Auth** (e-mail/senha + Google) | Auth.js foi incorporado ao Better Auth e Lucia está deprecada. Apple fica para a fase 1 com o iOS (`Q-01.2` não bloqueia no Android) |
| Config | Constantes do `glossario.md` em **tabela de configuração**, com cache e versionamento | `mvp.md:242` — "vivem em configuração de servidor… requisito de arquitetura, não preferência" |
| Observação | Sentry (app + API) + `pino`; PostHog para as métricas de `mvp.md` §12 | §12 manda instrumentar **cada controle do painel** e a âncora desde o dia 1 |

### 3. `packages/core` — a decisão de maior consequência

Monorepo **pnpm workspaces + Turborepo**: `apps/app`, `apps/api`, `packages/core`, `packages/db`, `packages/design`.

`core` é TypeScript puro — **sem React Native, sem Postgres, sem I/O**. Mora nele: página canônica (`RN-03.2`, `RN-03.3`), tempo ativo e idle (`RN-03.9`–`RN-03.13`), Leitura Consciente (`RN-03.17`–`RN-03.22c`), teto físico (`RN-03.26`), sobreposição (`RN-03.15`), ofensiva derivada de `DiaOfensiva` (`RN-04.11`), baseline por mediana (`RN-06.1`–`RN-06.5`), agregados (`RN-03.30`–`RN-03.32`).

Isso resolve três exigências que, separadas, produziriam duas implementações divergentes:

1. `RN-03.12a` manda o **cliente** avaliar a meta continuamente; `03:113` manda o **servidor** ser a autoridade. Mesmo código nos dois lados = a celebração otimista (`RN-04.10a`–`f`) nunca é desmentida pela reconciliação.
2. `RN-03.32` exige agregado recalculável do bruto — a função de recálculo é uma só.
3. É onde o **TDD por padrão** do `CLAUDE.md` rende: funções puras, com a regra numerada como nome do teste. O documento fixa que **todo `RN-` do núcleo vira um caso de teste nomeado pelo ID**.

### 4. Índice de caracteres — a resposta a `Q-03.1` e o furo do Readium

Readium expõe `locations.progression`/`position`, **não offset em caracteres**. Mas `RN-02.10` e `RN-03.2` fazem *toda* a métrica depender de caracteres do conteúdo principal, excluindo capa, ficha, sumário e créditos.

Decisão a registrar: na importação, o app monta um **índice de caracteres** por obra — `fflate` descompacta, `htmlparser2` extrai o texto do spine, e o índice guarda o offset cumulativo por recurso. Posição em caracteres = `offset[href] + progression × len(href)`. Mora em `packages/core`, é função pura, e é o **primeiro teste a ser escrito no projeto**. `RN-03.23` (validação server-side contra o texto real) permanece suspenso pelo corte A-5, então o índice é do cliente no MVP e sobe junto com a sessão.

### 5. Sincronização

Sem PowerSync (serviço e custo a mais) e sem WatermelonDB (schema próprio, duplicando o Drizzle). **Outbox próprio**, que é o que a spec já descreve: IDs de cliente estáveis (ULID) porque `modelo-de-dados.md:206` exige que o reenvio não duplique; envio **em lote com resultado por sessão** (`03:275`); janela de 7 dias (`RN-03.14`); recomposição retroativa de ofensiva (`RN-03.16`). Conflito de progresso: **posição mais avançada vence, com aviso** (`RN-02.11`) — regra já escrita, não inventada aqui.

### 6. Qualidade

- **App:** `jest-expo` + React Native Testing Library. **API e `core`:** Vitest.
- **E2E:** Maestro (YAML, roda em dev build e em EAS Workflows). O fluxo `RN-01.5a` — abrir e ler em menos de 60s — é caso de teste E2E, não métrica de analytics apenas.
- **Integração:** banco efêmero por execução para o job diário e para o ledger da fase 1.
- Biome (lint+format em um binário) e GitHub Actions + EAS Workflows.

### 7. Skills e plugins a instalar

O usuário pediu explicitamente. Nenhuma instalação sem confirmação dele — o plano apresenta os comandos:

| O quê | Comando | Por quê |
|---|---|---|
| Skills oficiais Expo | `/plugin install expo@claude-plugins-official` | ~23 skills oficiais: `expo-router`, `expo-design-system`, `expo-animation`, `expo-project-structure`, `expo-dev-client`, `eas-*`. Fonte oficial |
| Expo MCP | conforme `docs.expo.dev/mcp` | Inspeciona o projeto, recomenda pacotes compatíveis com o SDK fixado, conversa com EAS |
| Postgres | `npx skills add supabase/agent-skills@supabase-postgres-best-practices` | 363,6K instalações. Conteúdo é Postgres (schema, índices, RLS) e serve mesmo sem Supabase — registrar a ressalva de que parte é específica do produto deles |

Não existe skill de peso relevante para Drizzle, Fastify, Skia, Readium ou Unistyles — o documento registra isso para não se procurar de novo. Em vez disso, propõe uma **skill de projeto** em `.claude/skills/bookworm-design-system/`, carregando tokens, as doze primitivas e as regras `RN-DS.*`, para que o design system entre em contexto por invocação e não por releitura de 531 linhas (doutrina de retomada barata do `CLAUDE.md`).

### 8. Questões em aberto a criar

Nenhuma pode ser declarada resolvida sem medição — `RN-DS.20` vale aqui também.

| ID | Pergunta |
|---|---|
| `Q-ST.1` | `react-native-readium` está em release candidate. Qual versão o projeto fixa, e qual é o plano se a evolução parar? (o fallback é WebView + `foliate-js`, com o custo de locator próprio) |
| `Q-ST.2` | Dos dez controles obrigatórios de `RN-02.16d`, quais o Readium entrega por preferência nativa e quais exigem CSS injetado ou overlay? A temperatura contínua 2.700–6.500K (`RN-02.16a`) é o caso mais duvidoso |
| `Q-ST.3` | O provedor de Postgres escolhido tem região no Brasil? Se não tiver, o app fica em `gru` e o banco fora — medir antes de fixar |
| `Q-ST.4` | Better Auth em Expo: o plugin mobile cobre e-mail/senha + Google com refresh em background? |
| `Q-ST.5` | Justificado e hifenização não atravessam para RN (Anexo A) — dentro do Readium, que roda WebView, atravessam? Reabre uma linha dada como perdida |
| `Q-ST.6` | O jardim em Skia é código, não arquivo de ilustrador. `R-2` diz que a arte **é** o produto: com uma dupla, isso se sustenta ou o projeto precisa de Rive e de um ilustrador? |
| `Q-ST.7` | `Q-02.4` sem resposta: o levantamento não achou dicionário PT-BR **de licença livre verificada** (Aurélio e Michaelis são proprietários). Candidatos a avaliar: Wikcionário PT (CC BY-SA), Dicionário Aberto |

---

## Estrutura do arquivo

`specs/stack.md`, em PT-BR, no padrão das specs (cabeçalho com escopo, ponteiro para `00-overview.md`, tabela de IDs no fim):

1. O que este documento decide, e o que ele não decide
2. Premissas herdadas (`mvp.md` §2, `00-overview.md` §5)
3. Cliente — tabela + os dois argumentos por extenso (Skia/Anexo A, Unistyles/três camadas)
4. Servidor
5. `packages/core` e a forma do monorepo
6. Leitor EPUB: o que o Readium entrega, o que falta, e o índice de caracteres
7. Sincronização e offline
8. Qualidade, TDD e CI
9. Skills, plugins e ferramentas de agente
10. O que foi recusado, e por quê (registro para não reabrir: GraphQL, NestJS, NativeWind, PowerSync, WatermelonDB, Lottie, `epub.js`, renderer próprio)
11. Riscos técnicos, cruzados com `R-1` a `R-5`
12. Questões em aberto (`Q-ST.1`–`Q-ST.7`)
13. Índice de regras (`RN-ST.n`)

**Ponteiros a atualizar** (uma linha cada, sem reescrever nada):
- `README.md` — mapa da documentação
- `specs/00-overview.md` — mapa dos módulos, e nota em §5 de que a stack passou a ter documento próprio
- `CLAUDE.md` — lista de arquivos do repositório
- `.claude/retomada.md` — fechar a seção do design system se ela estiver concluída e abrir a desta operação

**`BookWorm.md` não é tocado** (fonte histórica). `mvp.md` não é editado: a stack não altera corte de escopo.

**Réplica no vault** `C:\Users\Giovane\Documents\BookWorm\` — `specs/stack.md`, `specs/00-overview.md`, `README.md`. `.claude/retomada.md` **não** é replicado.

---

## Verificação

O entregável é documento, então "rodou sem erro" não existe. As checagens, todas por sonda em subprocesso:

1. **Nenhum ID inventado.** Extrair todo `RN-\d\d\.\w+`, `RN-DS\.\d+`, `Q-\d\d\.\d+` citado em `stack.md` e conferir contra os IDs realmente definidos em `specs/` — um script Python que imprime só a lista de órfãos.
2. **Nenhum ID novo colidindo.** `grep -c 'RN-ST\.\|Q-ST\.'` no repositório inteiro antes de escrever.
3. **Cobertura das decisões.** Cada linha das tabelas de §3 e §4 tem coluna de amarração preenchida. Uma decisão sem regra amarrada é preferência disfarçada de requisito, e sai.
4. **Anexo A permanece honesto.** `design-system.md` §11 **não é editado** nesta rodada: dizer "Skia resolve `P-2`, `P-3`, `P-4`, `P-7`" em `stack.md` é hipótese, e `RN-DS.20` exige captura de tela em Android real. `stack.md` registra a hipótese como tal e nomeia o app de medição como o próximo passo.
5. **Réplica no vault confere.** `diff` entre cada arquivo do repositório e o correspondente no vault, imprimindo só divergência.
6. **Consistência de constantes.** Nenhum valor numérico novo entra em `stack.md`: os de produto vêm de `glossario.md` e os de plataforma (SDK 55, RN 0.83, `compileSdk ≥ 31`, `minSdk`) são de ferramenta, e ficam numa tabela única e datada — não espalhados pelo texto.

---

## Próximo passo, depois deste documento

Não é escrever tela. É o **app mínimo de medição** que `design-system.md:471` já define: as doze primitivas lado a lado em Android real, mais um EPUB aberto pelo Readium para medir locator estável e o índice de caracteres. Ele fecha `Q-ST.1`, `Q-ST.2`, `Q-ST.5` e converte seis linhas do Anexo A de `não verificado` para medido — que é exatamente o que `mvp.md` §3 chama de raiz da ordem de dependência.
