# 03 — Sessões, Métricas e Leitura Consciente

## 1. Objetivo

Transformar o ato de ler em dado confiável. Este módulo define o que é uma sessão, como o tempo e o volume são medidos, como se calcula o indicador de **Leitura Consciente** (rascunho L98) e que garantias antifraude protegem métricas que geram moeda real (P4).

É a fonte única de verdade para números exibidos em qualquer lugar do produto: dashboards do leitor, cards de compartilhamento (`08`), ofensivas (`04`), Ghost Reader (`06`) e recompensas (`07`).

## 2. Escopo

**Dentro:** ciclo de vida da sessão, tempo ativo, página canônica, indicador de Leitura Consciente, antifraude, agregações e dashboards do leitor, telemetria.

**Fora:** interações que geram os eventos (destaque, anotação, dicionário) → [`02-biblioteca-e-leitor.md`](02-biblioteca-e-leitor.md). Regras de meta e ofensiva → [`04-streaks-e-jardim.md`](04-streaks-e-jardim.md). Comparação com o histórico → [`06-ghost-reader.md`](06-ghost-reader.md). Crédito de moedas → [`07-economia-moedas.md`](07-economia-moedas.md). Métricas na ótica do autor → [`09-autores-e-analytics.md`](09-autores-e-analytics.md). **Como cada uma destas métricas é apurada na prática** — sinais de sistema operacional, relógios, taxonomia de pausa, catálogo de eventos e quais métricas o produto coleta ou recusa → [`telemetria-e-instrumentacao.md`](telemetria-e-instrumentacao.md).

## 3. Personas

Leitor.

---

## 4. User stories

| ID | Story |
|---|---|
| `SES-01` | Como leitor, quero que o app registre minha leitura automaticamente para não precisar operar cronômetro. |
| `SES-02` | Como leitor, quero que pausas naturais (atender o telefone, dormir com o app aberto) não inflem meu tempo lido, para confiar nos meus números. |
| `SES-03` | Como leitor, quero ver ao fim da sessão quanto li, por quanto tempo e com que qualidade de atenção. |
| `SES-04` | Como leitor, quero um indicador que valorize leitura atenta e não velocidade, para não ser incentivado a correr pelo texto. |
| `SES-05` | Como leitor, quero ver meu histórico por dia, semana, mês e ano para acompanhar minha evolução. |
| `SES-06` | Como leitor, quero ver estatísticas por obra (tempo investido, ritmo, destaques) para entender minha relação com cada livro. |
| `SES-07` | Como leitor, quero que sessões feitas offline entrem corretamente no meu histórico ao reconectar. |
| `SES-08` | Como leitor, quero corrigir ou descartar uma sessão obviamente errada para meu histórico permanecer fiel. |
| `SES-09` | Como leitor, quero entender por que uma sessão não contou, quando isso acontecer. |

---

## 5. Regras de negócio

### 5.1 Página canônica

- `RN-03.1` EPUB é texto refluível: não existe "página" objetiva. PDF, mesmo em layout fixo, segue a mesma unidade por decisão de paridade (`RN-02.1f`) — a métrica ignora a paginação nativa do arquivo. Toda métrica de volume é calculada em **caracteres** e apresentada em **páginas canônicas**.
- `RN-03.2` 1 página canônica = `PAGINA_CANONICA_CARACTERES` = **1.500 caracteres com espaços** (≈250 palavras), valor *(a validar)* e configurável no servidor.
- `RN-03.3` A conversão é global e imutável entre obras: o usuário compara os próprios números ao longo do tempo, e uma constante variável por obra tornaria a comparação sem sentido.
- `RN-03.4` A interface sempre rotula a unidade como "páginas" sem prometer equivalência com edição impressa. A tela de ajuda explica a convenção, e a meta em páginas (`04`) usa exatamente esta unidade.

### 5.2 Ciclo de vida da sessão

- `RN-03.5` Uma **sessão** inicia quando o leitor é aberto com uma obra e há a primeira evidência de leitura (avanço de posição ou 10 s de tela ativa com o texto renderizado).
- `RN-03.6` A sessão encerra quando ocorrer o primeiro de: saída explícita do leitor; app em segundo plano por mais de `SESSAO_TIMEOUT_MINUTOS` (30 min, a validar); troca de obra (encerra uma e abre outra); ou virada do dia no fuso do usuário (encerra a sessão às 23:59:59 e abre nova, para que nenhuma sessão pertença a dois dias).
- `RN-03.7` Sessão com tempo ativo abaixo de `SESSAO_MINIMA_SEGUNDOS` (60 s, a validar) é registrada como `curta`. Ela **conta para o progresso da meta diária** e **aparece no histórico**, mas não gera recompensa em moedas. Duas páginas na fila do mercado são a menor versão do hábito que o produto existe para construir — invisibilizá-las contraria o próprio objetivo.
- `RN-03.8` Leitura de amostra gratuita (`RN-02.2`) e leitura de pílulas no feed (`05`) geram sessões de tipo próprio (`amostra`, `pilula`). Ambas contam para estatísticas e para a meta diária, com regras distintas:
  - **Amostra** conta **integralmente**. É leitura de livro, com texto medido em caracteres como qualquer obra, e nada a distingue exceto o leitor ainda não a possuir.
  - **Pílula** conta com **teto diário** de `PILULA_TETO_META` (5 minutos de tempo ativo por dia, a validar). O teto existe porque o formato é curto e o feed é rolagem contínua; sem ele, a ofensiva poderia ser cumprida sem leitura longa, que é o comportamento-alvo do produto.
  - Nenhuma das duas gera recompensa em moedas (`RN-07` §5.2).
- `RN-03.8a` O volume de uma pílula é medido como o de qualquer texto: caracteres efetivamente exibidos e tempo ativo sobre eles. O feed reporta tempo por pílula (`RN-05` `InteracaoPilula.duracao_ms`), e só o tempo em pílulas **abertas e roladas até o fim** é contabilizado — rolagem rápida sem leitura não gera tempo ativo, pela mesma regra de inatividade de `RN-03.10`.

### 5.3 Tempo ativo

- `RN-03.9` **Tempo bruto** é a diferença entre início e fim da sessão. **Tempo ativo** é o tempo bruto menos os intervalos de inatividade.
- `RN-03.10` Um intervalo é inativo quando, por mais de `IDLE_TIMEOUT_SEGUNDOS` (90 s, a validar), não houve avanço de posição nem qualquer interação (toque, rolagem, virada de página, destaque, anotação, dicionário). O intervalo inativo é subtraído por completo, contado a partir da última interação.
- `RN-03.11` App em segundo plano, tela bloqueada ou dispositivo em espera pausam o tempo ativo imediatamente, sem aguardar o timeout.
- `RN-03.12` Toda métrica exibida ao usuário e toda recompensa usam **tempo ativo**. Tempo bruto existe apenas como dado interno de diagnóstico.
- `RN-03.12a` O cliente avalia o progresso contra a meta diária **continuamente durante a sessão**, não apenas no encerramento, para que o cumprimento seja detectado no instante em que ocorre (`RN-04.10a`). A avaliação local usa o tempo ativo e o volume acumulados no dispositivo somados ao já sincronizado do dia.
- `RN-03.13` Uma exceção deliberada: páginas com muito pouco texto (ilustração, epígrafe, folha de rosto) não geram alerta de inatividade indevido — o cálculo de idle considera apenas ausência de interação, nunca "leu devagar demais" (P3).

### 5.4 Reconciliação offline

- `RN-03.14` Sessões offline são gravadas localmente com timestamps do dispositivo e enviadas na reconexão. O servidor aceita sessões com até 7 dias de atraso (a validar).
- `RN-03.15` O servidor rejeita sessões com timestamp futuro (além de 5 min de tolerância de relógio) e sessões sobrepostas no tempo dentro da mesma conta — duas sessões não podem ocupar o mesmo intervalo, ainda que em dispositivos diferentes. Em sobreposição, prevalece a de maior tempo ativo; a outra é marcada `rejeitada_sobreposicao`.
- `RN-03.16` Sessão offline que atribua cumprimento de meta a um dia passado **recompõe** a ofensiva retroativamente (ver `RN-04.11`), desde que chegue dentro da janela de 7 dias.

### 5.5 Indicador de Leitura Consciente

O rascunho pede o indicador (L98) sem definir fórmula. A definição abaixo é proposta e integralmente *(a validar)*.

- `RN-03.17` O score é calculado por sessão, na escala 0–100. Há **dois caminhos independentes** para a profundidade, e qualquer um deles sozinho leva ao topo:

```
componente_tempo      = MR_PESO_TEMPO * (tempo_ativo / tempo_bruto)

densidade_esperada    = tempo_ativo_minutos / MR_INTERACAO_ESPERADA
via_interacao         = min(1, interacoes_qualitativas / max(1, densidade_esperada))
via_foco              = min(1, maior_bloco_continuo_s / MR_FOCO_ESPERADO)

componente_profundidade = MR_PESO_PROFUNDIDADE * max(via_interacao, via_foco)

leitura_consciente    = round(componente_tempo + componente_profundidade)
```

com `MR_PESO_TEMPO = 60`, `MR_PESO_PROFUNDIDADE = 40`, `MR_INTERACAO_ESPERADA = 10 minutos` e `MR_FOCO_ESPERADO = 20 minutos de bloco contínuo` (todos a validar).

- `RN-03.17a` O uso de `max` entre os dois caminhos é deliberado: **ficção imersiva lida sem uma única interrupção é tão profunda quanto estudo anotado.** Grifar é evidência de leitura ativa em não-ficção; em ficção, parar para grifar com frequência é sinal de quebra de fluxo, não de profundidade. Quem faz os dois chega ao topo com folga, mas nenhum dos dois é obrigatório.
- `RN-03.17b` `maior_bloco_continuo_s` é o maior intervalo da sessão sem inatividade (`RN-03.10`) — o mesmo dado já usado na baseline (`RN-06.1`).

- `RN-03.18` Interações qualitativas contáveis: destaque criado, anotação criada, consulta ao dicionário. Cada uma conta uma vez; um destaque com nota conta como duas (uma de cada tipo), conforme `RN-02.18`.
- `RN-03.19` Interações são contadas com teto de **1 por minuto de tempo ativo** para evitar que rajadas artificiais inflem o score.
- `RN-03.20` A velocidade de leitura **não entra** na fórmula, em nenhum sinal e com nenhum peso (P3). Ela existe apenas no Ghost Reader, como comparação privada do usuário com ele mesmo.
- `RN-03.21` Sessão sem nenhuma interação qualitativa **não** tem teto de score: ela alcança o topo pela via do foco contínuo (`RN-03.17`). O convite a grifar existe como sugestão ocasional, nunca como condição para pontuar bem.
- `RN-03.22` **O score não é exibido como nota de qualidade.** Em vez de classificar a leitura em melhor ou pior, a interface descreve o **estilo** do leitor naquela sessão, derivado de qual via predominou:

| Estilo | Quando | Como é apresentado |
|---|---|---|
| **Leitor Focado** | `via_foco` predomina — blocos longos, poucas interrupções | "Sessão de imersão: 34 minutos sem levantar os olhos" |
| **Leitor Metódico** | `via_interacao` predomina — muitos destaques, notas, consultas | "Sessão de estudo: 7 trechos marcados" |
| **Leitor Equilibrado** | as duas vias próximas (diferença ≤ 20%, a validar) | "Imersão com anotação" |

- `RN-03.22a` **Nenhum estilo é superior a outro**, e a interface nunca os ordena, pontua comparativamente ou sugere que o usuário deveria migrar de um para outro. São duas formas legítimas de ler, e dar visibilidade às duas é o objetivo (P3).
- `RN-03.22b` O estilo é calculado por sessão e agregado por período. O perfil predominante do usuário ao longo do tempo é informação de identidade — cabe no perfil (`01`) e nos cards de compartilhamento (`08`) —, nunca uma classificação imposta.
- `RN-03.22c` O número 0–100 permanece disponível no detalhamento da sessão para quem quiser, e continua alimentando o Ghost Reader (`06`) e os agregados do autor (`09`).

### 5.6 Antifraude

Métricas geram moeda com valor real (`07`), então precisam de barreira. Todas as verificações rodam **no servidor**; o cliente é tratado como não confiável.

- `RN-03.23` Uma sessão é `valida` quando cumpre todas as condições: tempo ativo ≥ 60 s (ou é `curta`, conforme `RN-03.7`); sem sobreposição temporal (`RN-03.15`); e caracteres percorridos compatíveis com o conteúdo real do intervalo de locators declarado.
- `RN-03.24` **Ler rápido é legítimo e continua valendo.** Ritmo alto não torna uma sessão suspeita: releitura, texto fácil, apêndice, lista de personagens e leitura dinâmica são leitura de verdade. Nenhum usuário perde ofensiva, progresso ou histórico por velocidade.
  - O antifraude atua apenas sobre a **impossibilidade física** (`RN-03.26`): volume que o tempo ativo não comporta, com ou sem baseline.
  - Uma sessão só é marcada `suspeita` quando o volume declarado excede o teto físico de `RN-03.26`, quando há sobreposição temporal (`RN-03.15`), ou quando o intervalo de locators não corresponde ao conteúdo real da obra.
  - Sessão `suspeita` **não gera moedas**, porque a moeda tem valor econômico e precisa de defesa. Mas **conta para a meta e para a ofensiva**, porque o hábito não deve ser punido por heurística. Ver `RN-04.10f`.
- `RN-03.25` A baseline (`06`) deixa de ser instrumento de antifraude e passa a servir **apenas** para a comparação pessoal do Ghost Reader. Nenhuma decisão de validade, recompensa ou ofensiva depende dela.
- `RN-03.26` **Teto físico de volume.** Avanço de posição sem tempo ativo correspondente — folhear o livro até o fim — não gera páginas lidas. O volume creditado é limitado a `RITMO_MAXIMO_FISICO` (2.500 caracteres por minuto de tempo ativo, a validar), que corresponde ao limite superior de leitura dinâmica humana com alguma compreensão. Acima disso não é leitura rápida, é rolagem.
- `RN-03.27` Teto diário de moedas por conta: `TETO_MOEDAS_DIARIO` (150, a validar). Ver `RN-07.8`.
- `RN-03.28` Toda sessão marcada `suspeita` ou `rejeitada` é auditável e o usuário pode contestar pelo suporte. O app **nunca** acusa o usuário de fraude na interface; a mensagem é neutra e explica o critério objetivo que não foi atendido (`SES-09`).
- `RN-03.29` O usuário pode descartar manualmente uma sessão do próprio histórico (`SES-08`). O descarte reverte moedas creditadas por ela e recalcula a ofensiva do dia; a operação é registrada em auditoria e é irreversível.

### 5.7 Agregações

- `RN-03.30` Agregados mantidos por usuário: dia, semana ISO, mês, ano e total; por obra; e por autor lido (insumo do gatilho de diversidade em `RN-07.5`).
- `RN-03.31` Cada agregado guarda: tempo ativo, páginas canônicas, sessões válidas, sessões curtas, interações qualitativas, maior bloco de foco, média de Leitura Consciente, **distribuição de estilo de leitura** (`RN-03.22`) e obras concluídas.
- `RN-03.32` Agregados são recalculáveis a partir do histórico bruto de sessões. Nenhum número exibido pode existir apenas como contador incremental sem lastro — caso contrário, correções (`RN-03.29`) tornam-se impossíveis.

---

## 6. Critérios de aceitação

**`SES-02` — Inatividade não infla tempo**
```
Dado que estou lendo e deixo o app aberto sem interagir por 20 minutos
Quando a sessão é encerrada
Então o tempo ativo exclui todo o intervalo a partir dos 90 segundos sem interação
E o tempo bruto registrado internamente permanece maior que o tempo ativo
E a tela de resumo mostra apenas o tempo ativo
```

**`RN-03.11` — Segundo plano pausa imediatamente**
```
Dado que estou em uma sessão ativa
Quando o app vai para segundo plano
Então o tempo ativo é pausado no mesmo instante, sem aguardar os 90 segundos
E ao retornar em menos de 30 minutos a mesma sessão continua
E ao retornar depois de 30 minutos uma nova sessão é iniciada
```

**`RN-03.6` — Virada do dia**
```
Dado que começo a ler às 23:40 no meu fuso e sigo até 00:20
Quando a meia-noite passa
Então a sessão é dividida em duas: uma encerrada às 23:59:59 e outra iniciada às 00:00:00
E cada parte conta para a ofensiva do seu próprio dia
```

**`SES-04` — Leitura Consciente não premia velocidade**
```
Dado que leio 30 minutos de tempo ativo sem nenhuma interação qualitativa
E mantenho um bloco contínuo de foco de 25 minutos
Quando a sessão encerra
Então meu score atinge o topo pela via do foco
E sou descrito como Leitor Focado, sem qualquer sugestão de que eu deveria grifar
E se eu ler os mesmos 30 minutos com 7 destaques e 2 consultas ao dicionário
Então meu score também atinge o topo, pela via da interação
E sou descrito como Leitor Metódico
E em nenhum dos casos minha velocidade de leitura influencia o score
E em nenhum dos casos um estilo é apresentado como melhor que o outro
```

**`RN-03.24` — Ler rápido não é punido**
```
Dado que releio um capítulo que já conheço em um terço do meu ritmo habitual de tempo
Quando a sessão é processada no servidor
Então ela é marcada como válida
E conta integralmente para a minha meta e para a minha ofensiva
E gera as moedas correspondentes
```

**`RN-03.7` — Sessão curta conta para a meta**
```
Dado que leio duas páginas por 40 segundos antes de dormir
Quando encerro a sessão
Então ela aparece no meu histórico marcada como curta
E o volume lido conta para o progresso da meta do dia
E nenhuma moeda é creditada por ela
```

**`RN-03.8` — Amostra e pílula na meta**
```
Dado que leio 12 minutos de amostra de uma obra e 9 minutos de pílulas no feed
Quando o dia é avaliado contra minha meta de 20 minutos
Então os 12 minutos de amostra contam integralmente
E apenas 5 dos 9 minutos de pílula contam, pelo teto diário
E minha meta é considerada cumprida com 17 minutos
E nenhuma moeda é creditada por amostra ou pílula
```

**`RN-03.19` — Teto de interações**
```
Dado que crio 20 destaques em 2 minutos de tempo ativo
Quando o score é calculado
Então apenas 2 interações são contabilizadas
```

**`RN-03.26` — Folhear não gera páginas**
```
Dado que abro uma obra e avanço 200 páginas canônicas em 90 segundos
Quando a sessão é processada no servidor
Então o volume creditado é limitado ao teto físico compatível com o tempo ativo
E a sessão é marcada como suspeita
E não gera moedas
E o volume creditado ainda assim conta para a minha meta e ofensiva
```

**`SES-07` — Sessão offline retroativa**
```
Dado que li offline ontem e cumpri minha meta diária
Quando o app reconecta hoje
Então a sessão de ontem entra no histórico com a data correta
E a ofensiva é recomposta como se não tivesse sido quebrada
E as moedas do dia de ontem são creditadas respeitando o teto daquele dia
```

**`SES-09` — Transparência sobre sessão não contada**
```
Dado que uma sessão minha foi marcada como suspeita
Quando abro o detalhe dessa sessão
Então vejo, em linguagem neutra, o critério objetivo não atendido
E vejo a opção de contestar pelo suporte
E em nenhum momento sou acusado de fraude
```

---

## 7. Telas e estados

| Tela | Conteúdo | Estados |
|---|---|---|
| **Abertura de sessão** | Sobreposição breve no leitor com a provocação do Ghost Reader (`06`); dispensável e desativável | — |
| **Resumo de sessão** | Tempo ativo, páginas canônicas, faixa de Leitura Consciente, destaques criados, progresso da obra, ações (compartilhar → `08`, continuar lendo). **Quando a meta do dia foi cumprida nesta sessão e a conquista ainda está pendente, o resumo abre pela celebração** (`RN-04.10b`) antes de mostrar os números | Carregando (processamento no servidor), Offline (mostra números locais com aviso "sincroniza depois"; a celebração da meta acontece normalmente, ver `04` §7) |
| **Meu desempenho** | Seletor dia/semana/mês/ano, tempo ativo, páginas, sessões, média de Leitura Consciente, gráfico de evolução | Vazio (primeira semana: mostra o que será desbloqueado), Carregando, Erro |
| **Estatísticas por obra** | Tempo investido, sessões, ritmo médio, destaques, progresso, previsão de conclusão | Vazio |
| **Histórico de sessões** | Lista cronológica com marcação de válida, curta ou suspeita, estilo de leitura de cada sessão, ação de descartar | Vazio, Erro |
| **Detalhe da sessão** | Métricas completas, motivo de não contagem quando aplicável, contestação | — |

**Offline:** sessões são registradas e exibidas localmente com marcação "aguardando sincronização"; a validação de servidor (e portanto a recompensa) só ocorre após a sincronização, e isso é dito ao usuário.

---

## 8. Dados

| Entidade | Campos principais | Propósito |
|---|---|---|
| `SessaoLeitura` | id, usuario_id, obra_id, tipo (obra, amostra, pilula), iniciada_em, encerrada_em, tempo_bruto_s, tempo_ativo_s, maior_bloco_continuo_s, locator_inicio, locator_fim, caracteres_lidos, paginas_canonicas, interacoes_qualitativas, leitura_consciente, estilo_leitura (focado, metodico, equilibrado), status (valida, curta, suspeita, rejeitada_sobreposicao, descartada_pelo_usuario), motivo_status, conta_para_meta, dispositivo, origem (online, offline), sincronizada_em | Unidade central de medição. `conta_para_meta` é verdadeiro para `valida`, `curta` e `suspeita` (`RN-03.24`), falso apenas para sessões rejeitadas ou descartadas pelo usuário |
| `IntervaloInatividade` | sessao_id, inicio, fim | Auditoria do tempo ativo |
| `AgregadoDiario` | usuario_id, data, fuso, tempo_ativo_s, paginas_canonicas, sessoes_validas, interacoes, leitura_consciente_media, obras_concluidas, meta_cumprida | Base de ofensiva, heat map e dashboards |
| `AgregadoPorObra` | usuario_id, obra_id, tempo_ativo_s, sessoes, paginas_canonicas, ritmo_medio, destaques, iniciada_em, concluida_em | Estatística por livro |
| `AgregadoPorAutorLido` | usuario_id, autor_id, obras_lidas, primeira_leitura_em | Insumo do gatilho de diversidade (`07`) |

---

## 9. API (alto nível)

| Operação | Descrição |
|---|---|
| Abrir sessão | Registra início e devolve o contexto do Ghost Reader para a sobreposição de abertura |
| Enviar batimentos da sessão | Envio periódico de progresso e interações, tolerante a perda |
| Encerrar sessão | Fecha, valida no servidor e devolve resumo com status, score, recompensas geradas e se há celebração de meta pendente (`RN-04.10d`) |
| Enviar lote de sessões offline | Reconciliação em lote com resultado por sessão |
| Listar sessões | Histórico paginado com filtro por obra, período e status |
| Obter detalhe de sessão | Métricas completas e motivo de status |
| Descartar sessão | Descarte pelo usuário, com reversão de moedas e recálculo de ofensiva |
| Obter agregados | Dia, semana, mês, ano, total e por obra |

---

## 10. Métricas de sucesso

- Percentual de sessões classificadas `valida` (alvo ≥ 95%; muito abaixo indica regra calibrada errado, não usuários desonestos).
- Percentual de sessões `suspeita` (alvo < 2%).
- Média de Leitura Consciente da base e **distribuição de estilos de leitura** (`RN-03.22`) — um produto saudável mostra Focados e Metódicos em proporção relevante; a predominância esmagadora de um deles indica que a fórmula está enviesada.
- Percentual de sessões com ao menos uma interação qualitativa (métrica-chave de P3).
- Divergência entre tempo bruto e tempo ativo (valida a calibragem do idle).
- Volume de contestações de sessão por 1.000 sessões.

---

## 11. Questões em aberto

| ID | Questão |
|---|---|
| `Q-03.1` | 1.500 caracteres por página canônica é uma convenção defensável? Alternativa: derivar de palavras (250/página) ou permitir que o usuário escolha a régua. **Afeta todas as métricas.** |
| `Q-03.2` | Os pesos 60/40 e a expectativa de 1 interação a cada 10 min precisam de calibração com dados reais. Como será feita a calibração inicial — teste com usuários piloto? |
| `Q-03.3` | ✅ **Resolvida.** Os rótulos de qualidade foram substituídos pelos estilos Focado / Metódico / Equilibrado (`RN-03.22`), que descrevem em vez de julgar. Resta validar os nomes com usuários. |
| `Q-03.4` | O idle de 90 s é adequado para poesia e textos densos, em que parar longamente é leitura legítima? Considerar timeout maior para obras marcadas como poesia. |
| `Q-03.5` | Haverá detecção de leitura em voz alta ou leitura acompanhada (mais de uma pessoa)? Fora de escopo nesta versão. |
| `Q-03.6` | O usuário poderá registrar leitura de livro físico manualmente? Isso ampliaria muito o público-alvo, mas abre um vetor de fraude que nenhuma regra deste módulo consegue fechar. |
