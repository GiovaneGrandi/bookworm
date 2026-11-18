# BookWorm

Plataforma gamificada de leitura e escrita — "fitness para a mente": métricas, metas, constância e conquistas compartilháveis, para leitores e para autores.

## Documentação

| Documento | O que é |
|---|---|
| [`BookWorm.md`](BookWorm.md) | Rascunho original do projeto (pitch). Documento-fonte histórico, mantido intocado. |
| [`specs/00-overview.md`](specs/00-overview.md) | **Ponto de entrada das especificações.** Visão, princípios, personas, mapa dos módulos e tabela de rastreabilidade rascunho → spec. |
| [`specs/mvp.md`](specs/mvp.md) | **Corte de escopo da primeira versão.** O que entra no MVP, o que espera e em que fase, com as adaptações declaradas. Ponto de partida para construir. |
| [`specs/stack.md`](specs/stack.md) | **Decisão de stack vinculante.** Cliente (Expo, Unistyles, Skia, `react-native-readium`), servidor (Fastify, Postgres, Fly.io), `packages/core` compartilhado, sincronização offline e o que foi recusado. |
| [`specs/telemetria-e-instrumentacao.md`](specs/telemetria-e-instrumentacao.md) | **Instrumentação vinculante.** A camada operacional de `03`: como cada métrica é medida na prática (máquina de estados da sessão, três relógios, taxonomia de pausa, catálogo de eventos, trilho de domínio × trilho de produto) e o veredito sobre cada métrica candidata — adotar, medir em silêncio ou recusar. |
| [`specs/stack-plano.md`](specs/stack-plano.md) | Plano que originou `specs/stack.md`: pesquisa feita e estrutura do documento a escrever. Histórico do processo, não vinculante. |
| [`specs/direcao-visual.md`](specs/direcao-visual.md) | **Identidade visual vinculante.** O pilar de design (estética "Papel"), tokens canônicos, assinatura mecânica, backlog de ajustes e questões em aberto. |
| [`specs/design-system.md`](specs/design-system.md) | **Design system vinculante.** Camada operacional da direção visual: três camadas de token, escala de espaçamento, doze primitivas da assinatura, inventário de componentes do MVP, contrato de estados, acessibilidade, movimento, navegação global e a tradução para React Native. |
| [`specs/`](specs/) | Especificações funcionais por módulo, mais modelo de dados e glossário. |
| [`mockups/`](mockups/) | Protótipos visuais estáticos. `design-system.html` é o catálogo e a referência normativa; `ideacao/direcao-b-escrivaninha.html` é a referência da direção de interface adotada; as demais peças são evidência histórica ou direções descartadas. |
| [`analise-game-design/00-diagnostico.md`](analise-game-design/00-diagnostico.md) | Análise crítica das specs sob a ótica de design de jogo: o que segura um usuário, onde a experiência quebra e o que propor. Termina em uma folha de decisão. |
| [`analise-monetizacao/00-diagnostico.md`](analise-monetizacao/00-diagnostico.md) | Análise crítica do modelo de receita, com unit economics: a moeda virtual, as oportunidades por lado, precificação e o que corrigir. Termina em uma folha de decisão. |

## Estado do projeto

Fase de especificação. Não há código ainda.

Um primeiro protótipo (Estágios 0–8 de [`planos/2026-08-23-primeiro-prototipo-mvp.md`](planos/2026-08-23-primeiro-prototipo-mvp.md)) chegou a ser construído e foi **descartado em 17/11/2026** para recomeçar a partir destas specs. O código dele fica só no histórico do git (último commit: `1b903e5`).

A **direção visual está decidida**: a estética "Papel" é o pilar de design do produto, com identidade em verde. Ver [`specs/direcao-visual.md`](specs/direcao-visual.md).

A **direção de interface está decidida**: *A Escrivaninha*. A tela inicial é a mesa vista de cima, e cada função é um objeto pousado nela (o livro aberto, o vaso do jardim, a gaveta, a pilha de lidos, a bandeja de entrada), sem barra de abas. Foi escolhida em 17/11/2026 entre três direções prototipadas em paralelo. Ver [`specs/direcao-visual.md`](specs/direcao-visual.md) §9 e [`mockups/ideacao/`](mockups/ideacao/).

O **design system está escrito** e traduz essa direção em tokens, componentes e estados que uma tela nova consome sem reabrir decisão. Ver [`specs/design-system.md`](specs/design-system.md) e o catálogo em [`mockups/design-system.html`](mockups/design-system.html).

As specs cobrem as 29 funcionalidades descritas no rascunho e as funcionalidades derivadas que elas pressupõem. Elas já incorporam as decisões tomadas nas revisões de game design e de monetização (folhas em [`analise-game-design/04-decisoes.md`](analise-game-design/04-decisoes.md) e [`analise-monetizacao/04-recomendacao.md`](analise-monetizacao/04-recomendacao.md)).

O escopo da primeira versão está decidido em [`specs/mvp.md`](specs/mvp.md): **o loop de hábito do lado leitor, isolado.** Um leitor de EPUB e PDF que transforma leitura em hábito medido — sem loja, sem moeda, sem feed, sem autores, sem IA.

### O que bloqueia o quê

O corte do MVP separa os bloqueios em dois grupos.

**Bloqueiam o MVP** — quatro, nenhuma regulatória ou financeira:

| ID | Questão |
|---|---|
| `Q-03.1` | A página canônica de 1.500 caracteres é aceitável? Toda métrica depende dela |
| `Q-01.1` | Jurisdição, LGPD/ECA e idade mínima |
| `Q-01.3` | Qual obra de domínio público abre o passo 1 do onboarding |
| `Q-02.4` | Qual dicionário embarcar |

Mais um item que é trabalho e não questão: **curar o acervo inicial de domínio público**.

**Bloqueiam o produto completo, não o MVP** — porque pertencem a camadas que a primeira versão não constrói: compliance da economia (`Q-07.1`), comissão das lojas (`Q-10.2`), responsabilidade fiscal do repasse (`Q-09.1`), consentimento de IA (`Q-11.1`), limites e preços de plano (`Q-10.1`, `Q-10.3`). O consolidado está em [`specs/00-overview.md`](specs/00-overview.md) §8; `Q-02.1` (catálogo) já foi resolvida pelo leitor aberto.

## Convenções

- Idioma: PT-BR.
- IDs de user story: `PREFIXO-NN` (`CON`, `LEI`, `SES`, `GAM`, `FEE`, `GHO`, `ECO`, `SOC`, `AUT`, `MON`, `IA`).
- IDs de regra de negócio: `RN-<módulo>.<n>`. IDs de questão em aberto: `Q-<módulo>.<n>`.
- Valores marcados `(a validar)` são propostas desta especificação, não do rascunho, e devem ser calibrados com dados.
