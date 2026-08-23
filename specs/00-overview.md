# BookWorm — Visão Geral das Especificações

> Documento-fonte: [`../BookWorm.md`](../BookWorm.md) (rascunho original, mantido intocado).
> Este arquivo é o ponto de entrada das specs e o índice de rastreabilidade.

---

## 1. Visão

BookWorm é uma plataforma gamificada de leitura e escrita que trata o desenvolvimento intelectual do mesmo modo que aplicativos de fitness tratam o condicionamento físico: com métricas, metas, constância e conquistas compartilháveis.

O produto não tenta competir com streaming, vídeo vertical e redes sociais negando as mecânicas dessas mídias — ele as absorve (feed vertical, ofensivas, recompensas, cards de conquista) e as coloca a serviço de um comportamento de alto valor: ler com profundidade e escrever com regularidade.

A plataforma atende **dois lados**: leitores, que ganham ferramentas de hábito e desempenho; e autores, que ganham distribuição, dados de audiência e monetização direta.

---

## 2. Princípios de produto

Estes princípios são vinculantes. Qualquer regra de negócio nas specs de módulo que os contrarie deve ser tratada como erro de especificação.

| # | Princípio | Consequência prática |
|---|---|---|
| P1 | **Auto-competição, nunca competição tóxica** | Não existe leaderboard público de leitura. Toda comparação é do usuário contra o próprio histórico. Ver [`06-ghost-reader.md`](06-ghost-reader.md). |
| P2 | **Anti-frustração por design** | A quebra de um hábito nunca destrói progresso acumulado. O jardim entra em dormência, não morre. Nenhuma tela usa linguagem punitiva. |
| P3 | **Profundidade acima de velocidade** | O sistema não recompensa "páginas por minuto". Recompensa leitura ativa, medida pelo indicador de Leitura Consciente. Ver [`03-sessoes-e-metricas.md`](03-sessoes-e-metricas.md). |
| P4 | **Todo dado exibido precisa ser confiável** | Métricas que geram moeda passam por validação antifraude antes de creditar recompensa. |
| P5 | **O sucesso da plataforma é atrelado ao sucesso do autor** | A receita principal vem de **serviços ao criador** — assinatura, analytics, distribuição —, e não de aprisionar o leitor nem de espremer a venda de obra. O autor é o cliente pagante prioritário (`10` §1). |
| P6 | **Estética é funcionalidade** | Os ativos de compartilhamento e o jardim são produto, não enfeite: são o motor de aquisição orgânica. |
| P7 | **O alvo é quem parou de ler** | O produto é desenhado para reconquistar quem trocou o livro pelo vídeo vertical, não apenas para instrumentar quem já lê. Ver §2.1. |

### 2.1 O público-alvo é uma decisão, não uma consequência

O rascunho promete competir com streaming, jogos e vídeo vertical (`BookWorm.md` L11–21). Isso define o alvo: **o leitor que parou de ler**, não o leitor que já lê muito.

A distinção tem consequência direta de engenharia. Quem já lê precisa de instrumento — métricas, heat map, organização — e tolera atrito. Quem parou de ler precisa de retorno rápido, novidade e uma primeira vitória imediata, e abandona o produto entre o terceiro e o sétimo dia se não os encontrar.

Por isso, as seguintes decisões deixam de ser melhorias e passam a ser **requisitos**: reconhecimento imediato da conquista (`RN-04.10a`), resposta ao gesto no leitor (`RN-02.17a`), vitória antes de configuração no onboarding (`RN-01.5`), horizonte semanal (`RN-04.35`), coleção (`RN-02.22a`) e a âncora de posição no leitor (`RN-02.13a`) — quem parou de ler precisa saber onde está sem ter de procurar.

O leitor que já lê continua atendido — ele ganha tudo isso também, e o instrumento que já existia.

### 2.2 Octalysis como meta de design

O rascunho invoca o framework Octalysis (`BookWorm.md` L39) mas cita apenas o Core Drive 5. A especificação adota os oito como **meta de design explícita**, e não como consequência acidental das outras decisões:

| Core Drive | Onde vive |
|---|---|
| 1 — Significado épico | Apoio direto ao autor (`07`), ler contra a queda global de leitura |
| 2 — Desenvolvimento e realização | Ofensivas, marcos, Ghost Reader, jardim (`04`, `06`) |
| 3 — Criatividade e feedback | Customização do jardim, destaques e citações da coleção (`02`, `04`) |
| 4 — Propriedade e posse | Estante, coleção, conjuntos, jardim (`02`, `04`) |
| 5 — Influência social e pertencimento | Compartilhamento (`08`) **e** duplas e clubes (`12`) |
| 6 — Escassez e impaciência | Deliberadamente contido: apenas temas sazonais (`RN-08.11`) |
| 7 — Imprevisibilidade e curiosidade | Sementes e raridade cosmética (`RN-04.40`), **sempre fora da economia de moeda** |
| 8 — Perda e evitação | Deliberadamente contido: só a ofensiva, amortecida por dormência e congelamento |

Os drives 6 e 8 permanecem contidos por decisão de produto (P2). Essa contenção é escolha consciente, não esquecimento — e o custo dela é assumido: o produto troca urgência por permanência.

### 2.3 Tom de voz (Brand Persona)

A comunicação do produto — microcopy, notificações, mensagens do Ghost Reader, estados vazios — segue a persona definida no rascunho: uma jovem leitora de alta performance, intelectual, de estética *cult*.

- **Curadoria e entusiasmo:** apaixonada e acessível, nunca professoral.
- **Disciplina empática:** celebra constância; acolhe e convida à retomada após ausência. Nunca cobra, nunca culpa.
- **Estética apurada:** valoriza design, organização e a beleza do objeto-livro.

Cada spec de módulo que define copy deve apresentar exemplos concretos alinhados a essa persona.

---

## 3. Personas

| Persona | Descrição | Objetivo primário |
|---|---|---|
| **Leitor** | Usuário que consome obras na plataforma. Pode ser gratuito ou assinante *Premium Reader*. | Transformar leitura em hábito mensurável e sustentável. |
| **Autor** | Usuário que publica obras e pílulas literárias. Pode ser gratuito ou assinante de um plano de criador. | Ser lido, entender sua audiência e monetizar sua obra. |
| **Leitor-autor** | Mesma conta acumulando os dois papéis (caso esperado, não excepcional). | Alternar entre consumo e produção sem trocar de conta. |
| **Administração** | Equipe da plataforma. | Moderar conteúdo, operar a economia, atender suporte financeiro. |

Papéis são **aditivos e não exclusivos**: toda conta nasce Leitor e pode ativar o papel Autor. Ver [`01-contas-e-onboarding.md`](01-contas-e-onboarding.md).

---

## 4. Plataforma e premissas técnicas

- **Superfície principal:** aplicativo mobile (iOS e Android), React Native. Toda spec de tela descreve navegação mobile.
- **Superfície secundária:** web responsivo, com paridade de leitura e dashboards, sem paridade obrigatória de gamificação social.
- **Offline:** a leitura funciona offline; sessões são registradas localmente e sincronizadas ao reconectar. Cada módulo declara seu comportamento offline na seção *Telas e estados*.
- **Backend:** compartilhado entre superfícies, API própria. As specs descrevem operações em alto nível, sem fixar REST vs. GraphQL — a decisão de stack (REST, Fastify, Postgres) vive em [`stack.md`](stack.md), documento próprio.
- **Fuso horário:** todo cálculo de "dia" para fins de ofensiva usa o fuso local do usuário, congelado no momento do cadastro e alterável nas configurações. Ver `RN-04.1`.

---

## 5. Mapa de módulos

| Arquivo | Cobre |
|---|---|
| [`01-contas-e-onboarding.md`](01-contas-e-onboarding.md) | Cadastro, autenticação, papéis, perfil e onboarding que começa lendo |
| [`02-biblioteca-e-leitor.md`](02-biblioteca-e-leitor.md) | Catálogo, aquisição, biblioteca, leitor imersivo, destaques, anotações, dicionário |
| [`03-sessoes-e-metricas.md`](03-sessoes-e-metricas.md) | Sessão de leitura, tracking, Leitura Consciente, antifraude, dashboards do leitor |
| [`04-streaks-e-jardim.md`](04-streaks-e-jardim.md) | Ofensivas de leitura e escrita, meta customizável, jardim de progresso, streak freeze |
| [`05-feed-pilulas.md`](05-feed-pilulas.md) | Feed vertical, pílulas literárias, ranqueamento, transição para o leitor |
| [`06-ghost-reader.md`](06-ghost-reader.md) | Baseline de desempenho, comparação sutil, mensagens, ausência de leaderboard |
| [`07-economia-moedas.md`](07-economia-moedas.md) | Carteira, ledger, gatilhos de ganho, catálogo de gastos, gorjetas |
| [`08-social-sharing.md`](08-social-sharing.md) | Reading Wrap-Up, temas visuais, heat map de constância, exportação |
| [`09-autores-e-analytics.md`](09-autores-e-analytics.md) | Publicação, quests de escrita, sprints Pomodoro, analytics de audiência, saque |
| [`10-monetizacao-planos.md`](10-monetizacao-planos.md) | Planos, tiered limits, marketplace, take rate, gating de recursos |
| [`11-ia-premium-reader.md`](11-ia-premium-reader.md) | Recursos de IA no leitor, contexto, limites de uso, privacidade e direitos |
| [`12-social-e-clubes.md`](12-social-e-clubes.md) | Leitura em dupla, clubes com meta coletiva, discussão com trava de spoiler, presentear |
| [`13-moderacao-e-curadoria.md`](13-moderacao-e-curadoria.md) | Política de conteúdo, classificação da obra, entrada por confiança progressiva, obra derivada, controle do leitor sobre o feed, denúncia e apelação |
| [`modelo-de-dados.md`](modelo-de-dados.md) | Entidades conceituais consolidadas e relacionamentos |
| [`glossario.md`](glossario.md) | Vocabulário do domínio e constantes numéricas |
| [`direcao-visual.md`](direcao-visual.md) | **Identidade visual vinculante.** O pilar de design (estética "Papel"), tokens canônicos, assinatura mecânica e sistema tipográfico |
| [`design-system.md`](design-system.md) | **Design system vinculante.** Camada operacional da direção visual: tokens em três camadas, componentes, estados, acessibilidade, movimento, navegação global e tradução para React Native |
| [`stack.md`](stack.md) | **Decisão de stack vinculante.** Cliente, servidor, `packages/core` compartilhado, sincronização offline, qualidade/CI e o que foi recusado |
| [`telemetria-e-instrumentacao.md`](telemetria-e-instrumentacao.md) | **Instrumentação vinculante.** Como cada métrica de `03` é apurada na prática: máquina de estados da sessão, relógios, taxonomia de pausa, catálogo de eventos, trilhos de dado e o veredito sobre cada métrica candidata |

---

## 6. Rastreabilidade — rascunho → spec

Índice de cobertura permanente. Cada funcionalidade descrita em `BookWorm.md` e onde ela está especificada.

| # | Funcionalidade | Origem | Spec |
|---|---|---|---|
| 1 | Cards dinâmicos de sessão (*Reading Wrap-Up*) com temas Dark / Minimalista / Cyberpunk / Papel Antigo | L47–52 | `08` |
| 2 | Métricas do card: tempo, páginas, citação em destaque, ofensiva, % de conclusão | L49–52 | `03`, `08` |
| 3 | Heat map de constância estilo *commit grid*, otimizado para Stories | L53–54 | `08` |
| 4 | Ofensiva de Leitura e Ofensiva de Escrita como eixos independentes | L74–76 | `04` |
| 5 | Meta base customizável (páginas ou minutos); alterá-la custa moedas | L78 | `04`, `07` |
| 6 | Jardim de progresso: crescimento, customização, estética de outono | L79–81 | `04` |
| 7 | *Streak Freeze* comprável com moedas | L82 | `04`, `07` |
| 8 | Feed vertical de Pílulas Literárias (1–3 parágrafos ou poema curto) | L84–88 | `05` |
| 9 | Botão "Continuar Lendo" → leitor sem distrações | L89 | `05`, `02` |
| 10 | Ausência deliberada de leaderboard público | L91–93 | `06` |
| 11 | Ghost Reader: baseline no onboarding + comparação sutil por sessão | L95–97 | `06`, `01` |
| 12 | Indicador de Leitura Consciente (tempo + destaques, anotações, dicionário) | L98 | `03`, `06` |
| 13 | Ganho de moedas: marcos, autor estreante, resenhas, anotações, jardim ativo | L104 | `07` |
| 14 | Gasto de moedas: *boosts* e cosméticos (compra de livros foi revista, `RN-07.1b`) | L105 | `07` |
| 15 | Gorjetas para autores; conversão em dinheiro ou em destaque nas vitrines | L106 | `07`, `09` |
| 16 | Missões de escrita (*quests*) parametrizadas pelo autor | L112 | `09` |
| 17 | Sprints de foco (Pomodoro) com histórico e recorde de PPM | L113 | `09` |
| 18 | Marketplace com *take rate* (5% revisto para 25%/30%, `RN-10.6a`) | L123 | `10` |
| 19 | Venda de pacotes de moedas (adiada, `RN-07.23`) | L124 | `07`, `10` |
| 20 | Analytics do autor: Mapa de Evasão (*drop-off rate*) | L130–131 | `09` |
| 21 | Analytics: frases mais grifadas, páginas mais curtidas, momentos que geraram gorjetas | L132 | `09` |
| 22 | *Tiered limits*: limite de obras ativas no plano gratuito | L133 | `10`, `09` |
| 23 | IA: resumos automáticos de capítulos | L140 | `11` |
| 24 | IA: explicação contextual de termos e contexto histórico | L141 | `11` |
| 25 | IA: mapeamento de personagens | L142 | `11` |
| 26 | IA: "bate-papo com o livro" | L143 | `11` |
| 27 | Brand persona e tom de voz | L62–68 | `00` (§2) |
| 28 | Anti-frustração e recusa de competição tóxica como princípios | L72, L81 | `00` (§2), `04`, `06` |
| 29 | Ambientes de troca entre leitores e estímulo à comunidade | L27 | `12` |

### Funcionalidades derivadas

O rascunho pressupõe estas capacidades sem descrevê-las. Elas foram especificadas porque nada acima funciona sem elas:

| Funcionalidade derivada | Spec | Por que é necessária |
|---|---|---|
| Contas, autenticação e papéis | `01` | Tudo depende de identidade e de distinguir leitor de autor |
| Catálogo e aquisição de obras | `02`, `10` | O rascunho cita "loja integrada" e "adquirir novos livros" |
| Leitor de EPUB e PDF, destaques, anotações, dicionário | `02` | São os insumos do indicador de Leitura Consciente (L98) |
| Publicação de obras pelo autor | `09` | Sem ela não há catálogo, drop-off nem take rate |
| Resenhas | `02` | Citadas em L104 apenas como gatilho de moeda, nunca definidas |
| Notificações | `04`, `06` | Ofensiva e retomada de hábito dependem de lembrete |
| Social interno: duplas e clubes | `12` | O rascunho promete "ambientes de troca entre leitores" (L27) e nunca os descreve |
| Coleção e estante | `02` | Um produto sobre livros sem acervo colecionável desperdiça seu objeto central |
| Horizonte semanal | `04` | O rascunho tem metas diárias e marcos longos, e nada entre os dois |
| Leitor aberto (EPUB/PDF próprio, domínio público) | `02` | Sem ele o app nasce vazio e depende de um catálogo que ainda não existe |
| ARC e ferramentas de lançamento | `09` | Necessidade central do autor autopublicado, ausente do rascunho |
| Licença institucional | `10` | Maior ticket possível do produto, com valor educacional direto |
| Moderação, classificação e controle de conteúdo | `13` | O rascunho pressupõe um catálogo aberto a qualquer autor (L123, L133) e nunca diz o que impede obra ofensiva ou feita de sacanagem de entrar, nem como o leitor filtra o que recebe |

---

## 7. Convenções das specs

- **IDs de user story:** `PREFIXO-NN` estável por módulo (`CON`, `LEI`, `SES`, `GAM`, `FEE`, `GHO`, `ECO`, `SOC`, `AUT`, `MON`, `IA`, `MOD`). O prefixo `SOC` é compartilhado entre `08` (compartilhamento externo) e `12` (social interno), em faixas numéricas distintas. Um ID nunca é reciclado; funcionalidade removida vira ID aposentado.
- **IDs de regra de negócio:** `RN-<módulo>.<n>` — ex.: `RN-04.7` é a sétima regra de `04-streaks-e-jardim.md`.
- **IDs de questão em aberto:** `Q-<módulo>.<n>`.
- **Documentos transversais** usam prefixo próprio no lugar do número de módulo: `Q-DV` para [`direcao-visual.md`](direcao-visual.md); `RN-DS` e `Q-DS` para [`design-system.md`](design-system.md); `RN-ST` e `Q-ST` para [`stack.md`](stack.md).
- **Marcação `(a validar)`:** valor numérico proposto por esta especificação, não presente no rascunho. Deve ser confirmado ou calibrado com dados antes do lançamento. Valores **sem** essa marca vieram do rascunho e não devem ser alterados sem decisão explícita.
- **Critérios de aceitação:** `Dado / Quando / Então`, em PT-BR, sempre amarrados a um ID de story.

---

## 8. Questões em aberto (consolidado)

As questões de cada módulo estão listadas no próprio arquivo. Estas são as que bloqueiam decisões estruturais e deveriam ser respondidas antes de qualquer implementação:

| ID | Questão | Impacto |
|---|---|---|
| `Q-11.3` | Qual o dimensionamento viável da cota de IA para o leitor? | A cota atual custa cerca de 5× a assinatura; decisão pendente |
| `Q-03.1` | A convenção de página canônica (1.500 caracteres) é aceitável para exibir "páginas lidas"? | Toda métrica, ofensiva e comparação depende dela |
| `Q-10.9` | Qual o estado vigente das regras de anti-steering das lojas e da disputa regulatória brasileira sobre pagamento externo? | Define o funil de `RN-10.7a`, que é a maior alavanca de margem do modelo |
| `Q-09.1` | Quem responde pela obrigação fiscal do repasse ao autor (a plataforma como intermediadora, ou o autor)? | Define arquitetura de pagamentos e cadastro (KYC) |
| `Q-11.1` | O autor precisa consentir individualmente com o uso de sua obra pelos recursos de IA? | Define contrato de publicação e disponibilidade do Premium Reader |
| `Q-10.1` | Qual o limite exato de obras ativas no plano gratuito de autor (o rascunho dá a faixa 1 a 3)? | Define a régua de conversão do plano de criador |
| `Q-10.3` | Quais os preços dos cinco planos? | A validar com Van Westendorp antes de fixar |
| `Q-DS.5` | Quanto da assinatura mecânica de Papel sobrevive no React Native/Android? | Seis das treze linhas da tradução são hipótese. O pilar de design é vinculante e a superfície é Android primeiro: se a assinatura não atravessar, é a direção que precisa saber disso antes de mais mockups |
| `Q-TEL.1` | Toque e rolagem dentro do texto renderizado pelo leitor chegam à camada do app? | Se não chegarem, o idle de 90 s de `RN-03.10` significa outra coisa na prática, e toda métrica de tempo precisa ser recalibrada |
| `Q-DS.2` | Os temas de card (`RN-08.10`: "Minimalista e Dark") contradizem o pilar Papel — lido ao pé da letra, o MVP entrega zero cards na identidade do próprio produto | O card é, por `P6`, a única alavanca de crescimento orgânico do MVP |
