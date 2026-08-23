# 04 — Folha de Decisão

Um item por achado. Marque a coluna de decisão e, quando quiser, anote o motivo — o que ficar como `alterar` vira a lista de edições nas specs.

**Como marcar:** substitua `·` por `X` na coluna escolhida.

| Coluna | Significado |
|---|---|
| **Manter** | A spec fica como está. A crítica foi registrada e recusada |
| **Alterar** | Aplicar a mecânica proposta nas specs |
| **Debater** | Precisa de conversa antes de decidir |

**Impacto:** estimativa de efeito sobre retenção · **Custo:** 🟢 dias · 🟡 semanas · 🔴 mês+

---

## Bloco 1 — Correções críticas do loop

Sem estas, nada mais importa: elas atingem o momento central do produto.

| ID | Achado | Recomendação | Impacto | Custo | Manter | Alterar | Debater |
|---|---|---|---|---|---|---|---|
| `B-01` | ✅ **APLICADO** — A meta diária era celebrada só na virada do dia | `M-02` incorporado à spec: `RN-04.10a`–`RN-04.10f`, `RN-03.12a`, `RN-02.14a` | Altíssimo | 🟢 | · | **X** | · |
| `B-02` | ✅ **APLICADO** — Virar página, grifar, anotar e consultar não devolvem nada | Aplicar `J-01` a `J-05`. O produto pede o gesto e não reforça o gesto → **na spec:** `RN-02.17a`–`RN-02.17f` | Alto | 🟢 | · | **X** | · |
| — | ⏳ **PARCIAL** — A tela de resumo de sessão é um relatório, não uma celebração | `J-06`/`J-07` são design visual, não regra de negócio. A spec já ancora a celebração ali (`RN-04.10b`, `03` §7); a coreografia entra na fase de UI | Alto | 🟡 | · | **X** | · |

---

## Bloco 2 — Regras que machucam o jogador

Pacote `M-08`. Todas baratas, todas removem dor sem adicionar mecânica.

| ID | Achado | Recomendação | Impacto | Custo | Manter | Alterar | Debater |
|---|---|---|---|---|---|---|---|
| `B-03` | ✅ **APLICADO** — Sessão fora da faixa de ritmo perde moeda **e** ofensiva (`RN-03.24`) | Perder moeda sim, ofensiva não. Antifraude protege economia, não hábito → **na spec:** `RN-03.24`, `RN-04.10` | Alto | 🟢 | · | **X** | · |
| `B-04` | ✅ **APLICADO** — Sessão de menos de 60 s é descartada (`RN-03.7`) | Contar para a meta e aparecer no histórico; seguir sem gerar moeda → **na spec:** `RN-03.7` | Alto | 🟢 | · | **X** | · |
| `B-05` | ✅ **APLICADO** — Ler sem grifar tem teto de 60 no score (`RN-03.21`) | Aplicar `M-09`: foco contínuo vale tanto quanto interação → **na spec:** `RN-03.17`, `RN-03.22` (estilos de leitura) | Alto | 🟢 | · | **X** | · |
| `B-06` | ✅ **APLICADO** — Alterar a meta custa 150 moedas (`RN-04.6`) | Trocar custo em moeda por atrito de tempo. Reduzir a meta sempre livre → **na spec:** `RN-04.5`, `RN-04.6`, `RN-04.6a` | Médio | 🟢 | · | **X** | · |
| `B-07` | 🗣️ **EM DEBATE** — Teto diário de moedas interrompe o melhor dia do jogador (`RN-07.8`) | Manter teto na moeda; trilha de `M-06` sem teto. **Spec inalterada** | Médio | 🟡 | · | · | **X** |
| `B-10` | 🗣️ **EM DEBATE** — Congelamento consumido sem o jogador decidir (`RN-04.17`) | Equipar explicitamente, ou janela de escolha no dia seguinte. **Spec inalterada** | Médio | 🟢 | · | · | **X** |
| `B-11` | ✅ **APLICADO** — Amostra e pílula não contam para a ofensiva (`RN-03.8`) | Amostra conta integral; pílula conta com teto diário → **na spec:** `RN-03.8`, `RN-05.12a` | Médio | 🟢 | · | **X** | · |

---

## Bloco 3 — Buracos estruturais de design

| ID | Achado | Recomendação | Impacto | Custo | Manter | Alterar | Debater |
|---|---|---|---|---|---|---|---|
| `B-12` | ✅ **APLICADO** — Onboarding entrega 5 passos de trabalho antes de qualquer prazer (`RN-01.5`) | Aplicar `M-07`: ler e vencer nos primeiros 60 s; configurar depois; baseline derivada das 3 primeiras sessões reais → **na spec:** `RN-01.5`–`RN-01.5c`, `RN-01.9` | Alto | 🟢 | · | **X** | · |
| `B-14` | ✅ **APLICADO** — Não existe outra pessoa dentro do produto | Aplicar `M-04`, começando por leitura em dupla (o mais barato e o mais eficaz) → **na spec:** `12-social-e-clubes.md` (módulo novo) | Alto | 🔴 | · | **X** | · |
| `B-08` | ⏳ **PENDENTE** — Voltar depois de sumir não é uma ação, é uma cor diferente (`RN-04.21`) | `M-05` (reconquista por esforço) foi marcado Alterar mas **ainda não aplicado** — depende de decidir se a ofensiva antiga volta pela metade ou por outro critério | Alto | 🟢 | · | **X** | · |
| — | ✅ **APLICADO** — Não existe horizonte semanal | `M-11` aplicado → **na spec:** `RN-04.35`–`RN-04.39` (desafio e fechamento semanais) | Médio | 🟡 | · | **X** | · |
| — | ✅ **APLICADO** — Nada para colecionar em um produto sobre livros | `M-03` aplicado → **na spec:** `RN-02.22a`–`RN-02.22f` (estante, citações, conjuntos) | Médio | 🟡 | · | **X** | · |
| `B-15` | ✅ **APLICADO** — Terminar um livro vale o mesmo que 10 capítulos | Cerimônia dedicada (`J-08`) + recompensa proporcional ao tamanho da obra → **na spec:** `RN-07.4a`, `RN-07.4b` | Médio | 🟢 | · | **X** | · |
| `B-16` | ✅ **APLICADO** — O escritor recebeu um espelho da leitura, não um jogo próprio | Marcos de manuscrito em `M-06` → **na spec:** `RN-09.12c`–`RN-09.12g` | Médio | 🟡 | · | **X** | · |
| `B-09` | 🗣️ **EM DEBATE** — O Ghost some justamente durante a corrida (`RN-06.16`) | Sua proposta do fantasminha na barra de progresso está registrada em `M-10`. **Spec inalterada** | Médio | 🟢 | · | · | **X** |
| `B-18` | ✅ **APLICADO** — O resumo de IA permite avançar sem ler — estratégia dominante paga (`RN-11.7`) | Resumo de capítulo só após lê-lo; "a história até aqui" segue livre. Ler resumo não avança posição → **na spec:** `RN-11.7`, `RN-11.7a`, `RN-11.7b` | Alto | 🟢 | · | **X** | · |

---

## Bloco 4 — Decisões de princípio

Estas não são correções. São escolhas sobre que produto o BookWorm quer ser, e só você pode fazê-las.

| ID | Questão | Recomendação | Impacto | Custo | Manter | Alterar | Debater |
|---|---|---|---|---|---|---|---|
| `D-01` | 🗣️ **EM DEBATE** — P2 removeu toda tensão do sistema | `M-01` (aposta voluntária) depende de como ficar a moeda. **Spec inalterada** | Alto | 🟡 | · | · | **X** |
| `D-02` | ✅ **APLICADO** — Transparência total mata a surpresa (`B-13`) | Economia segue 100% publicada; o aleatório vive só nas sementes → **na spec:** `RN-04.40`–`RN-04.45`. `RN-07.7` intacta | Médio | 🟡 | · | **X** | · |
| `D-03` | 🗣️ **EM DEBATE** — O feed é aquisição ou isca controlada? (`B-17`) | `B-11` já foi resolvido (pílula conta para a meta). Falta decidir `RN-05.24`/`RN-05.26`. **Essas duas seguem inalteradas** | Alto | 🟢 | · | · | **X** |
| `D-04` | ✅ **APLICADO** — Público-alvo indefinido entre quem já lê e quem parou de ler | Alvo declarado: **quem parou de ler** → **na spec:** novo princípio **P7** e `00-overview.md` §2.1. Blocos 1 a 3 passam a ser requisito | Altíssimo | — | · | **X** | · |
| `D-05` | ✅ **APLICADO** — Octalysis invocado mas com 2 dos 8 Core Drives em uso | Adotado como meta de design explícita → **na spec:** `00-overview.md` §2.2, com os drives 6 e 8 contidos por decisão consciente | Médio | — | · | **X** | · |

---

## Bloco 5 — O que recomendo **não** mexer

Registrado para que nenhuma alteração dos blocos acima derrube isto por engano.

| Item | Regra | Por quê |
|---|---|---|
| Ausência de leaderboard | `RN-06.8` | Ranking de leitura produz leitura performática. `M-04` entrega social sem violar |
| Leitor imersivo sem distração | `RN-02.13` | A fronteira que toda a juice respeita |
| Velocidade fora da fórmula de qualidade | `RN-03.20` | A melhor ideia da spec. `M-09` corrige a fórmula sem tocar neste princípio |
| Jardim que não morre | `RN-04.25` | Correto. O problema nunca foi a dormência, foi não haver o que fazer nela (`M-05`) |
| Nenhuma venda em momento de frustração | `RN-07.26`, `RN-10.19` | Inegociável. `M-01` e `M-05` foram desenhados para respeitar |
| Heat map que marca congelamentos | `RN-08.19` | Integridade rara. Não maquiar |
| Eixo duplo de ofensiva | `RN-04.12` | Separar leitura de escrita é acerto. Não fundir |
| Sem mensagem de falha no Ghost | `RN-06.19`, `RN-06.20` | O tom é o diferencial do produto |
| Economia publicada | `RN-07.7` | `D-02` mantém |

---

## Bloco 6 — Recusado na análise

Mecânicas conhecidas e eficazes que **não** recomendo, com o motivo. Listadas para que a decisão de não usá-las seja consciente, e não esquecimento.

| Mecânica | Por que não |
|---|---|
| Ligas e divisões (Duolingo) | Viola P1 e destrói P3 |
| Comprar de volta a ofensiva | Vende alívio de ansiedade criada pelo produto. `M-05` entrega o benefício sem o padrão escuro |
| Loot box paga | Aleatoriedade + dinheiro + menores de idade (`RN-01.4`) |
| Notificação de culpa | `RN-01.16`. Culpa desinstala |
| Meta que cresce sozinha | A régua é do usuário por decisão de produto (`RN-04.2`) |

---

## Resumo para decidir rápido

Se você só puder mexer em **cinco** coisas, na ordem:

1. ~~**`B-01`** — celebrar a meta no instante em que ela é batida.~~ ✅ **Já aplicado na spec.**
2. **`M-08`** — o pacote de seis correções baratas que param de machucar o jogador.
3. **`B-05` / `M-09`** — deixar de classificar leitura imersiva como rasa.
4. **`B-12` / `M-07`** — vitória antes de configuração no onboarding.
5. **`D-04`** — decidir de uma vez para quem o produto é. Essa resposta reordena todas as outras.
