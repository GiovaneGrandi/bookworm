# 06 — Ghost Reader e Auto-Competição

## 1. Objetivo

Dar ao usuário um adversário legítimo: ele mesmo, ontem. O Ghost Reader mantém um perfil do desempenho histórico do próprio usuário e o apresenta, de forma sutil e no momento certo, como referência de superação — substituindo por completo o leaderboard público (rascunho L91–97).

É também o módulo que guarda a promessa mais delicada do produto: comparar sem gerar ansiedade.

## 2. Escopo

**Dentro:** cálculo e manutenção da baseline, seleção da comparação relevante por sessão, formato e tom das mensagens, exibição na abertura e no encerramento, controles do usuário, proibição de leaderboard.

**Fora:** onboarding e primeiras sessões → [`01-contas-e-onboarding.md`](01-contas-e-onboarding.md). Cálculo de tempo ativo, volume e Leitura Consciente → [`03-sessoes-e-metricas.md`](03-sessoes-e-metricas.md). Ofensivas → [`04-streaks-e-jardim.md`](04-streaks-e-jardim.md).

## 3. Personas

Leitor. (O equivalente para escrita — recordes de PPM em sprints — vive em [`09-autores-e-analytics.md`](09-autores-e-analytics.md) e segue os mesmos princípios de tom deste módulo.)

---

## 4. User stories

| ID | Story |
|---|---|
| `GHO-01` | Como leitor, quero saber como estou indo em relação a mim mesmo para ter um alvo concreto de superação. |
| `GHO-02` | Como leitor, quero que essa comparação apareça de forma discreta e no momento certo, sem me tirar do foco. |
| `GHO-03` | Como leitor, quero ser desafiado por algo alcançável, não por um recorde impossível. |
| `GHO-04` | Como leitor, quero que meus dias ruins não sejam usados contra mim. |
| `GHO-05` | Como leitor, quero ver minha evolução ao longo dos meses para perceber que estou melhorando. |
| `GHO-06` | Como leitor, quero desligar as comparações se elas me fizerem mal. |
| `GHO-07` | Como leitor, quero que ninguém possa me classificar publicamente por desempenho. |
| `GHO-08` | Como leitor novo, quero não ser comparado antes de o app me conhecer o suficiente. |

---

## 5. Regras de negócio

### 5.1 A baseline

- `RN-06.1` A baseline é o perfil de desempenho vigente do usuário e contém quatro medidas: **ritmo** (caracteres por minuto de tempo ativo), **foco contínuo** (maior bloco sem inatividade, em segundos), **volume típico por sessão** (páginas canônicas) e **Leitura Consciente média**.
- `RN-06.2` Origem da baseline, em ordem de precedência:
  1. Histórico próprio, quando houver ao menos 3 sessões válidas — média móvel das últimas `BASELINE_JANELA_RECALCULO` (20, a validar) sessões válidas;
  2. Ausente — conta *não calibrada*, com o Ghost Reader silencioso (`RN-01.11`). Não há mais medida de onboarding: a baseline nasce sempre de leitura real (`RN-01.9`).
- `RN-06.3` A baseline usa **mediana**, não média aritmética, em ritmo e volume. Uma sessão atípica (uma tarde inteira de leitura, ou 2 minutos no ônibus) não deve deslocar a régua do usuário.
- `RN-06.4` Sessões `curta`, `suspeita`, `rejeitada` e de tipo `amostra`/`pilula` são excluídas do cálculo da baseline. Elas contam para o hábito (`RN-04.10`), mas não servem como régua de desempenho.
- `RN-06.5` A baseline é recalculada ao fim de cada sessão válida e versionada: o histórico de baselines é preservado para alimentar a visão de evolução (`GHO-05`).
- `RN-06.6` A baseline é segmentada por **gênero literário da obra** quando houver ao menos 5 sessões válidas naquele gênero (a validar). Comparar o ritmo em poesia com o ritmo em thriller produziria uma comparação injusta e desmotivadora.
- `RN-06.7` A baseline serve **exclusivamente** à comparação pessoal deste módulo. Ela deixou de ser insumo do antifraude (`RN-03.25`): nenhuma decisão de validade, recompensa ou ofensiva depende dela. Ler mais rápido que o próprio histórico é evolução, não suspeita.

### 5.2 Proibição de comparação social

- `RN-06.8` Não existe, em nenhuma superfície do produto, ranking, classificação, percentil ou qualquer exibição que ordene usuários por desempenho de leitura ou escrita (P1, rascunho L91–93). Isso vale para perfil, busca, feed, cards de compartilhamento e comunicações por e-mail e push.
- `RN-06.9` Comparações com "a média dos leitores" ou com qualquer coorte também são proibidas. A referência é sempre o próprio histórico do usuário.
- `RN-06.10` Agregados anônimos podem existir internamente (produto e analytics do autor, ver `RN-09.14`), mas nunca são exibidos ao leitor como termo de comparação pessoal.
- `RN-06.11` Qualquer funcionalidade social futura — clubes de leitura, desafios entre amigos — deve ser especificada com comparação **colaborativa** (meta comum do grupo), nunca competitiva individual. Esta regra é uma restrição de arquitetura de produto, não uma preferência estética.

### 5.3 A comparação por sessão

- `RN-06.12` Na abertura da sessão, o Ghost Reader apresenta **um único desafio**, escolhido entre as quatro medidas da baseline. Nunca mais de um, nunca um painel de estatísticas — isso desmontaria o estado de foco que o leitor acabou de buscar.
- `RN-06.13` A escolha da medida segue esta prioridade:
  1. A medida em que o usuário esteve mais próximo de superar a própria marca nas últimas 3 sessões (proximidade gera engajamento);
  2. Foco contínuo, quando a Leitura Consciente vem caindo (recolocar profundidade no centro);
  3. Volume, quando a ofensiva do dia ainda não foi cumprida;
  4. Ritmo — **último recurso**, e nunca em duas sessões seguidas, para não transformar velocidade no eixo do produto (P3, `RN-03.20`).
- `RN-06.14` O desafio é sempre calibrado como **alcançável**: a meta proposta fica entre 100% e 115% da baseline (a validar). O Ghost Reader nunca propõe superar o recorde histórico absoluto, exceto quando o usuário está a menos de 5% dele.
- `RN-06.15` A sobreposição de abertura desaparece automaticamente após 4 segundos (a validar) ou ao primeiro toque, e nunca exige interação.
- `RN-06.16` Durante a sessão, o Ghost Reader é **completamente invisível**: sem cronômetro, sem barra de progresso contra o fantasma, sem alerta de "você está mais lento" (`RN-02.15`). A comparação é retomada apenas no resumo de encerramento.
- `RN-06.17` No resumo (`03` §7), o resultado é apresentado em uma linha, com o desafio proposto ao lado do realizado.

### 5.4 Tom das mensagens

- `RN-06.18` Toda mensagem do Ghost Reader segue a persona de **disciplina empática** (`00` §2). A estrutura canônica é: fato do próprio usuário + convite em pergunta.
  - Exemplo do rascunho (L97): *"Na semana passada, você manteve o foco por 12 minutos contínuos. Consegue bater 14 hoje?"*
- `RN-06.19` Quando o desafio **não** é superado, a mensagem reconhece o que foi feito e não menciona o déficit. Nunca há mensagem de falha.
  - Permitido: *"18 minutos de foco hoje. Seu jardim agradece."*
  - Proibido: *"Você ficou 4 minutos abaixo do seu ritmo."*
- `RN-06.20` Vocabulário proibido em todo o módulo: *falhou, perdeu, abaixo, pior, regrediu, atrasado, ranking, posição, média dos usuários*.
- `RN-06.21` Após uma ausência de 7 dias ou mais, o Ghost Reader não compara nada na primeira sessão de retorno. Ele apenas acolhe o retorno. Comparar quem está voltando com quem estava no auge é a forma mais rápida de perdê-lo de novo (P2).
- `RN-06.22` Em obra de gênero novo para o usuário e sem baseline segmentada (`RN-06.6`), a abertura não traz desafio — traz apenas a informação de que é uma primeira leitura naquele gênero.

### 5.5 Controle do usuário

- `RN-06.23` O Ghost Reader é ativo por padrão e desligável por completo nas configurações (`GHO-06`), com uma frase que legitima a escolha, sem tentar dissuadir.
- `RN-06.24` Com o Ghost Reader desligado, as métricas continuam sendo coletadas (elas alimentam ofensiva, moedas e dashboards); apenas as mensagens comparativas somem.
- `RN-06.25` O usuário pode zerar a baseline e recomeçar a calibração — útil após pausas longas, mudança de fase de vida ou de tipo de leitura.
- `RN-06.26` A visão de evolução (`GHO-05`) mostra a série histórica das quatro medidas por mês, com tendência. É a única superfície do módulo em que o usuário vê números comparativos por iniciativa própria — e por isso pode ser mais densa.

---

## 6. Critérios de aceitação

**`GHO-08` + `RN-06.2` — Silêncio antes da calibração**
```
Dado que sou usuário novo com baseline não calibrada e 2 sessões válidas
Quando abro uma obra para ler
Então nenhuma comparação é exibida
E ao concluir minha terceira sessão válida
Então a baseline passa a ser derivada do meu histórico
E as comparações começam a aparecer na sessão seguinte
```

**`GHO-02` + `RN-06.12` — Um único desafio, discreto**
```
Dado que tenho baseline calibrada
Quando abro uma obra para ler
Então vejo uma sobreposição com exatamente uma frase de desafio
E ela desaparece sozinha em 4 segundos sem exigir toque
E durante toda a leitura nenhum elemento do Ghost Reader é exibido
```

**`GHO-03` + `RN-06.14` — Desafio alcançável**
```
Dado que meu foco contínuo mediano é 12 minutos e meu recorde é 40 minutos
Quando o Ghost Reader propõe um desafio de foco
Então o alvo proposto está entre 12 e 14 minutos
E o recorde de 40 minutos não é usado como alvo
```

**`RN-06.13` — Ritmo é último recurso**
```
Dado que na sessão anterior o desafio foi de ritmo
Quando abro uma nova sessão
Então o desafio proposto é de foco, volume ou consciência
E nunca de ritmo em duas sessões consecutivas
```

**`GHO-04` + `RN-06.19` — Nenhuma mensagem de falha**
```
Dado que o desafio era 14 minutos de foco e mantive 9
Quando a sessão encerra
Então o resumo reconhece os 9 minutos realizados
E não menciona diferença, déficit, queda ou falha
E o desafio não superado não gera notificação alguma
```

**`RN-06.21` — Retorno após ausência**
```
Dado que estou há 10 dias sem ler
Quando abro uma obra
Então a abertura traz apenas uma mensagem de acolhimento
E nenhum desafio comparativo é apresentado nesta sessão
```

**`GHO-07` + `RN-06.8` — Ausência de ranking**
```
Dado que navego por perfis, feed, busca e comunicações do produto
Quando procuro qualquer classificação de usuários por desempenho
Então nenhuma superfície oferece ordenação, posição, percentil ou média comparativa
```

**`GHO-06` — Desligar comparações**
```
Dado que desligo o Ghost Reader nas configurações
Quando leio uma sessão inteira
Então nenhuma mensagem comparativa aparece na abertura nem no resumo
E minhas métricas continuam sendo registradas normalmente
E minha ofensiva e minhas moedas seguem funcionando
```

---

## 7. Telas e estados

| Tela | Conteúdo | Estados |
|---|---|---|
| **Sobreposição de abertura** | Uma frase de desafio, dispensável, autodesaparecível em 4 s | Silenciosa (não calibrada, gênero novo, retorno após ausência, Ghost desligado) |
| **Linha do Ghost no resumo de sessão** | Desafio proposto × realizado, em uma linha, sem julgamento | Ausente quando não houve desafio |
| **Minha evolução** | Série mensal de ritmo, foco, volume e Leitura Consciente, com tendência e destaque para melhor mês | Vazio (menos de 30 dias de histórico: explica o que será desbloqueado), Carregando |
| **Configurações do Ghost Reader** | Liga/desliga, zerar baseline, explicação de como a comparação funciona | — |

**Offline:** o desafio de abertura é calculado com a baseline em cache; o resultado no resumo é local e provisório até a validação da sessão pelo servidor.

---

## 8. Dados

| Entidade | Campos principais | Propósito |
|---|---|---|
| `Baseline` | usuario_id, versao, origem (historico), genero (opcional), ritmo_cpm, foco_continuo_s, volume_paginas, leitura_consciente, sessoes_consideradas, calculada_em, status | Régua pessoal vigente e versionada |
| `DesafioGhost` | id, usuario_id, sessao_id, medida (ritmo, foco, volume, consciencia), alvo, realizado, superado, exibido_em, silenciado_por (opcional) | Registro do que foi proposto e do resultado |
| `PreferenciaGhost` | usuario_id, ativo, ultima_medida_usada, zerada_em | Controle do usuário e rotação de medidas |
| `EvolucaoMensal` | usuario_id, ano_mes, ritmo_cpm, foco_continuo_s, volume_paginas, leitura_consciente, sessoes | Série histórica de `GHO-05` |

---

## 9. API (alto nível)

| Operação | Descrição |
|---|---|
| Obter desafio de abertura | Devolve a medida escolhida, o alvo e a frase — ou silêncio, com o motivo |
| Registrar resultado do desafio | Vinculado ao encerramento da sessão |
| Obter baseline | Baseline vigente, geral e por gênero |
| Zerar baseline | Reinicia a calibração |
| Alternar Ghost Reader | Liga ou desliga as mensagens comparativas |
| Obter evolução | Série mensal das quatro medidas |

---

## 10. Métricas de sucesso

- Percentual de sessões com desafio superado (alvo entre 40% e 60% — muito acima indica desafio fácil demais; muito abaixo, calibração punitiva).
- Taxa de desativação do Ghost Reader (alvo < 5%; é o termômetro direto de que o tom saiu do lugar).
- Evolução mediana de foco contínuo da base ao longo de 90 dias (a promessa central do módulo).
- Retenção comparada entre usuários com e sem Ghost Reader ativo.
- Percentual de aberturas silenciosas e distribuição dos motivos.
- Distribuição das medidas escolhidas — ritmo deve ser a menos frequente.

---

## 11. Questões em aberto

| ID | Questão |
|---|---|
| `Q-06.1` | "Ghost reader" é o nome interno vindo do rascunho. Qual será o nome exibido ao usuário? O termo *fantasma* pode soar frio para a persona da marca. |
| `Q-06.2` | A faixa de desafio 100%–115% precisa de calibração empírica: pouco desafio entedia, muito frustra. Testar variações desde o piloto. |
| `Q-06.3` | Segmentar baseline por gênero exige classificar obras com confiabilidade. O gênero virá do autor no cadastro da obra, de curadoria ou de classificação automática? |
| `Q-06.4` | Haverá desafios semanais, além dos por sessão (ex.: "sua melhor semana foram 5 dias")? Aumenta o horizonte, mas amplia a superfície de comparação. |
| `Q-06.5` | O rascunho menciona clubes e comunidade (L27). Quando isso for especificado, como sustentar `RN-06.11` — metas coletivas sem ranking interno? |
| `Q-06.6` | Zerar a baseline é reversível? Um usuário pode zerar por impulso e se arrepender ao perder a série histórica. |
