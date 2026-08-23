# 11 — Premium Reader: Leitura Assistida por IA

## 1. Objetivo

Entregar os quatro recursos assistivos previstos no rascunho (L139–143): resumo de capítulo, explicação contextual, mapeamento de personagens e "bate-papo com o livro". O princípio que governa o módulo: a IA **serve à leitura**, ela não substitui a leitura nem interrompe o estado de foco.

> **Mudança de posicionamento.** Estes recursos deixaram de ser o argumento de venda da assinatura de leitor (`RN-10.2a`). São commodity — qualquer assistente faz o mesmo com um arquivo anexado — e têm custo por uso, o que é péssima combinação com preço fixo. A IA como **produto de receita** vive no lado autor (`RN-09.20a`), onde opera sobre dado proprietário que ninguém mais tem. Aqui ela permanece como conveniência do leitor, e o dimensionamento de cota (`RN-11.25`) segue em aberto.

## 2. Escopo

**Dentro:** os quatro recursos, gatilhos e superfícies de acesso no leitor, contexto enviado ao modelo, tratamento de spoiler, limites de uso, custo, privacidade e direitos do autor.

**Fora:** cobrança e gating da assinatura → [`10-monetizacao-planos.md`](10-monetizacao-planos.md). Leitor e suas interações → [`02-biblioteca-e-leitor.md`](02-biblioteca-e-leitor.md). Consentimento do autor no cadastro da obra → [`09-autores-e-analytics.md`](09-autores-e-analytics.md).

## 3. Personas

Leitor assinante (primária), Autor (titular dos direitos sobre a obra).

---

## 4. User stories

| ID | Story |
|---|---|
| `IA-01` | Como leitor, quero um resumo do capítulo que acabei de ler para consolidar o que entendi. |
| `IA-02` | Como leitor retomando um livro parado, quero relembrar o que aconteceu até aqui sem reler. |
| `IA-03` | Como leitor, quero entender um termo, uma referência ou um contexto histórico sem sair da página. |
| `IA-04` | Como leitor, quero lembrar quem é um personagem que reaparece depois de muitas páginas. |
| `IA-05` | Como leitor, quero perguntar sobre a trama e tirar dúvidas em tempo real. |
| `IA-06` | Como leitor, quero garantia de que a IA não vai me entregar spoiler do que ainda não li. |
| `IA-07` | Como leitor, quero saber quando a resposta pode estar errada, para não confiar cegamente. |
| `IA-08` | Como autor, quero decidir se minha obra pode ser usada pelos recursos de IA. |
| `IA-09` | Como leitor, quero salvar um resumo ou uma explicação útil junto com minhas anotações. |

---

## 5. Regras de negócio

### 5.1 Princípio da barreira de spoiler

Esta é a regra mais importante do módulo. Uma única falha aqui arruína a experiência de leitura de forma irreversível.

- `RN-11.1` **Nenhum recurso de IA pode revelar conteúdo além da posição de leitura atual do usuário.** O contexto entregue ao modelo é sempre truncado no locator corrente (`RN-02.9`); o conteúdo posterior nunca é enviado, em nenhum recurso, em nenhuma circunstância.
- `RN-11.2` Confiar apenas na instrução ao modelo ("não dê spoiler") é insuficiente. A barreira é **arquitetural**: o que não é enviado não pode vazar. Instruções de prompt são camada secundária, nunca a principal.
- `RN-11.2b` Quando a pergunta do leitor só puder ser respondida com conteúdo além da posição atual, a resposta é uma recusa explícita e amigável ("isso ainda não aconteceu no ponto em que você está"), nunca uma resposta evasiva que insinue o desfecho.

### 5.2 Direitos e consentimento

- `RN-11.3` O uso de uma obra pelos recursos de IA depende do consentimento do autor, declarado no cadastro da obra (`RN-09.3`). O padrão para obras novas é **desativado**, com opt-in explícito — decisão conservadora, sujeita à revisão de `Q-11.1`.
- `RN-11.4` Obra sem consentimento mantém todos os recursos de IA indisponíveis, e o leitor assinante vê o motivo com clareza: é decisão do autor, não falha do produto.
- `RN-11.5` O conteúdo das obras **não é usado para treinar modelos**, nem pela plataforma nem pelo provedor de modelo. Essa garantia é contratual com o provedor e declarada ao autor no contrato de publicação.
- `RN-11.6` Conteúdo protegido enviado ao provedor tem retenção mínima e não é usado para nenhuma finalidade além de responder àquela requisição.

### 5.3 Recursos

**Resumo de capítulo (`IA-01`, `IA-02`)**

- `RN-11.7` **O resumo é sempre recapitulação, nunca adiantamento.** Ele cobre apenas o que já foi lido, até a posição atual, e não entrega nada das páginas seguintes. Duas formas:
  - **Resumo de capítulo:** disponível **somente após o capítulo ter sido lido**. Um capítulo ainda não lido não pode ser resumido.
  - **"A história até aqui":** acumulado até a posição corrente, disponível a qualquer momento. É o caso de uso legítimo de quem voltou depois de semanas.
- `RN-11.7a` **Ler um resumo não avança a posição de leitura** nem gera progresso, meta, ofensiva ou moeda. O resumo consolida o que foi lido; ele não substitui a leitura.
- `RN-11.7b` Essas duas regras existem porque, sem elas, o resumo seria **estratégia dominante**: resumir o capítulo em vez de lê-lo seria mais rápido e renderia o mesmo progresso. Um sistema que oferece atalho barato para a recompensa acaba ensinando o atalho — e este é o único recurso pago do produto que competiria com o comportamento que ele vende.
- `RN-11.8` O resumo é oferecido no resumo de sessão e no sumário — **nunca** aparece automaticamente dentro do leitor durante a leitura (`RN-02.13`).
- `RN-11.9` Resumos gerados são armazenados e reutilizáveis: o mesmo capítulo, na mesma posição, não é reprocessado. Isso reduz custo e dá resposta instantânea.

**Explicação contextual (`IA-03`)**

- `RN-11.10` Acionada pela seleção de texto, ao lado das ações de destaque e dicionário (`RN-02.20`). Explica termos, referências históricas, expressões e alusões, considerando o contexto do trecho.
- `RN-11.11` A distinção com o dicionário é clara na interface: dicionário dá o verbete (offline, gratuito); explicação contextual dá o sentido naquele trecho (online, Premium).
- `RN-11.12` A resposta abre em painel sobreposto, e o leitor volta à posição exata ao fechar. O fluxo de leitura não é quebrado.

**Mapeamento de personagens (`IA-04`)**

- `RN-11.13` Mantém uma ficha por personagem com: nome, papel na história, relações e última aparição — tudo limitado ao que já foi lido (`RN-11.1`).
- `RN-11.14` Acessível de duas formas: pela seleção do nome no texto ("quem é?") e por um painel com todos os personagens já apresentados.
- `RN-11.15` As fichas são construídas incrementalmente conforme a leitura avança, por capítulo, e ficam em cache — não são reconstruídas do zero a cada consulta.

**Bate-papo com o livro (`IA-05`)**

- `RN-11.16` Conversa em linguagem natural sobre a obra, limitada ao conteúdo já lido. A conversa é persistida por obra e retomável.
- `RN-11.17` O chat é acessível a partir do leitor, mas abre como superfície separada — nunca sobreposto ao texto durante a leitura.
- `RN-11.18` O chat **não** responde perguntas fora do escopo da obra. Perguntas genéricas são recusadas com redirecionamento cordial. O produto é leitura assistida, não um assistente de uso geral.
- `RN-11.19` O chat não escreve resenha, redação ou trabalho escolar sobre a obra em nome do leitor. Recusa direta e cordial.

### 5.4 Transparência e limites

- `RN-11.20` Toda resposta de IA é visualmente identificada como gerada por IA, com aviso permanente e discreto de que pode conter imprecisões (`IA-07`).
- `RN-11.21` Sempre que possível, a resposta indica o capítulo ou trecho em que se baseia, permitindo verificação pelo leitor.
- `RN-11.22` Toda resposta pode ser reportada como incorreta pelo leitor, alimentando a avaliação de qualidade do módulo.
- `RN-11.23` Resumos e explicações podem ser salvos como anotação vinculada à posição (`IA-09`), marcados como originados de IA para não se confundirem com o pensamento do próprio leitor.
- `RN-11.24` Uso da IA **não** conta como interação qualitativa no cálculo de Leitura Consciente (`RN-03.18`). Pedir um resumo não é o mesmo que grifar um trecho — recompensar isso enfraqueceria P3.

### 5.5 Cotas e desempenho

- `RN-11.25` Cota mensal por assinante *(a validar)*: 100 resumos, 300 explicações contextuais, consulta ilimitada às fichas em cache e 200 mensagens de chat. As cotas existem para conter abuso e custo, não para racionar uso normal — devem ser generosas o bastante para que o assinante típico nunca as veja.
- `RN-11.26` O consumo da cota é visível nas configurações a qualquer momento, e o aviso de proximidade aparece a 80% (a validar).
- `RN-11.27` Toda operação de IA é assíncrona com estado visível: solicitada, gerando, pronta. Nenhuma requisição bloqueia a interface, e a leitura continua durante o processamento.
- `RN-11.28` Falha do provedor degrada com elegância: a mensagem é neutra, o recurso oferece retentativa e nada é debitado da cota.
- `RN-11.29` Recursos de IA exigem conexão. O leitor offline vê o recurso indisponível com explicação, e resumos já gerados continuam legíveis offline (`RN-11.9`).

### 5.6 Premissas técnicas

Estas premissas orientam custo e arquitetura. Não fixam fornecedor, mas registram o que a especificação assume.

- `RN-11.30` **Modelo de referência:** Claude Opus 5 (`claude-opus-5`), com janela de contexto de 1M tokens — suficiente para manter o texto já lido de praticamente qualquer obra no contexto sem recuperação por trechos. Isso simplifica muito a barreira de spoiler: o corte é uma fatia do texto, não um índice a ser filtrado.
- `RN-11.31` **Cache de prompt** é obrigatório na arquitetura. O texto já lido da obra é um prefixo estável e longo, reutilizado a cada consulta do mesmo leitor na mesma obra — é o caso ideal de cache, com impacto direto no custo por assinante. O prefixo deve ser montado com a parte estável primeiro (texto da obra) e a parte volátil por último (pergunta do usuário).
- `RN-11.32` O crescimento do prefixo deve ser feito em blocos (por capítulo), não a cada página virada: reescrever o prefixo a cada avanço de posição invalidaria o cache continuamente.
- `RN-11.33` Resumos e fichas de personagem são **pré-computáveis por capítulo** e compartilháveis entre leitores da mesma obra na mesma posição, desde que não contenham nada do estado individual do leitor. Isso muda a ordem de grandeza do custo: o resumo do capítulo 3 é gerado uma vez, não uma vez por assinante. Processamento em lote é o caminho natural para essa pré-computação.
- `RN-11.34` O chat, por depender da pergunta individual, não é compartilhável e é o recurso de maior custo marginal — por isso tem a cota mais restritiva.
- `RN-11.35` O custo de IA por assinante ativo deve ser monitorado como métrica de produto, não apenas de infraestrutura: é ele que determina a viabilidade do preço da assinatura (`Q-11.3`).

---

## 6. Critérios de aceitação

**`IA-06` + `RN-11.1` — Barreira de spoiler é arquitetural**
```
Dado que estou no capítulo 5 de uma obra de 20 capítulos
Quando uso qualquer recurso de IA
Então o conteúdo enviado ao modelo termina exatamente na minha posição atual
E nenhum texto dos capítulos 6 a 20 é incluído na requisição
```

**`RN-11.2b` — Recusa explícita em vez de resposta evasiva**
```
Dado que estou no capítulo 5 e pergunto ao chat "quem é o assassino?"
Quando a resposta é gerada
Então recebo uma recusa clara de que isso ainda não foi revelado no meu ponto de leitura
E a resposta não insinua, sugere nem restringe o conjunto de suspeitos
```

**`IA-04` + `RN-11.13` — Ficha limitada ao já lido**
```
Dado que um personagem foi apresentado no capítulo 2 e reaparece no capítulo 9
Quando seleciono o nome dele e peço "quem é?"
Então vejo papel, relações e última aparição com base nos capítulos 1 a 9
E nada do que ele faz nos capítulos seguintes é mencionado
```

**`IA-08` + `RN-11.4` — Obra sem consentimento**
```
Dado que leio uma obra cujo autor não autorizou o uso por IA
Quando abro o menu de recursos assistivos
Então os recursos aparecem indisponíveis
E vejo que a decisão é do autor da obra
E minha assinatura não é apresentada como o motivo do bloqueio
```

**`RN-11.7` + `RN-11.7a` — Resumo é recapitulação, não atalho**
```
Dado que estou no início do capítulo 8, que ainda não li
Quando abro os recursos assistivos
Então o resumo do capítulo 8 não está disponível
E o resumo dos capítulos 1 a 7 está disponível
E ao ler "a história até aqui" minha posição de leitura permanece no início do capítulo 8
E nenhum progresso, meta, ofensiva ou moeda é gerado por ter lido o resumo
```

**`RN-11.8` — IA não invade o leitor**
```
Dado que estou lendo com o Premium Reader ativo
Quando termino um capítulo e continuo lendo
Então nenhum resumo é exibido automaticamente
E o resumo fica disponível no resumo de sessão e no sumário, sob ação minha
```

**`RN-11.24` — IA não infla Leitura Consciente**
```
Dado que gerei 5 resumos e 10 explicações durante uma sessão
Quando o score de Leitura Consciente é calculado
Então nenhuma dessas ações é contabilizada como interação qualitativa
```

**`RN-11.9` — Reuso de resumo**
```
Dado que já gerei o resumo do capítulo 4
Quando solicito o mesmo resumo novamente na mesma posição
Então a resposta é instantânea a partir do armazenamento
E nenhuma unidade de cota é debitada
```

**`RN-11.28` — Falha não cobra cota**
```
Dado que o provedor de modelo está indisponível
Quando solicito um resumo
Então vejo uma mensagem neutra com opção de tentar de novo
E nenhuma unidade da minha cota é consumida
E a leitura continua normalmente
```

**`RN-11.20` — Transparência**
```
Dado que recebo qualquer resposta de IA
Quando a leio
Então ela está identificada como gerada por IA
E há aviso discreto de possibilidade de imprecisão
E há ação de reportar resposta incorreta
```

---

## 7. Telas e estados

| Tela | Conteúdo | Estados |
|---|---|---|
| **Menu de recursos assistivos** | Resumo, explicação, personagens, chat, com consumo de cota | Bloqueado por plano (`10`), Bloqueado por consentimento do autor, Offline |
| **Resumo de capítulo** | Texto do resumo, capítulo de referência, salvar como anotação, reportar | Gerando, Pronto, Erro (com retentativa), Cache (instantâneo) |
| **A história até aqui** | Resumo acumulado até a posição atual | Gerando, Pronto, Erro |
| **Explicação contextual** | Painel sobreposto com a explicação do trecho selecionado | Gerando, Pronto, Erro, Offline (oferece o dicionário como alternativa) |
| **Painel de personagens** | Lista dos personagens já apresentados, com ficha ao tocar | Vazio (nenhum personagem identificado ainda), Carregando |
| **Chat com o livro** | Conversa persistida, campo de pergunta, aviso de escopo limitado ao já lido | Vazio (sugestões de pergunta), Gerando, Erro, Cota esgotada |
| **Consumo de IA (configurações)** | Cotas do mês, consumo por recurso, data de renovação | — |

**Offline:** todos os recursos ficam indisponíveis, com uma exceção deliberada — resumos e fichas já gerados permanecem legíveis, porque estão armazenados localmente.

---

## 8. Dados

| Entidade | Campos principais | Propósito |
|---|---|---|
| `ResumoCapitulo` | id, obra_id, capitulo_id, locator_limite, tipo (capitulo, acumulado), texto, compartilhavel, gerado_em, versao_modelo | Resumo reutilizável e pré-computável |
| `FichaPersonagem` | id, obra_id, personagem_nome, ate_capitulo, papel, relacoes[], ultima_aparicao_locator, gerada_em | Mapeamento incremental |
| `ExplicacaoContextual` | id, usuario_id, obra_id, locator, trecho, texto, gerada_em | Histórico e possibilidade de salvar |
| `ConversaObra` | id, usuario_id, obra_id, criada_em, ultima_mensagem_em | Chat persistido por obra |
| `MensagemConversa` | id, conversa_id, papel (usuario, assistente), texto, locator_limite, recusada, motivo_recusa, criada_em | Turnos do chat com o limite aplicado |
| `ConsumoIA` | usuario_id, ano_mes, resumos, explicacoes, mensagens_chat, atualizado_em | Cotas |
| `AvaliacaoResposta` | id, usuario_id, referencia_tipo, referencia_id, avaliacao, comentario, criada_em | Qualidade e correção |
| `ConsentimentoIAObra` | obra_id, autorizado, autorizado_em, autorizado_por | Direito do autor (`09`) |

---

## 9. API (alto nível)

| Operação | Descrição |
|---|---|
| Obter disponibilidade de IA | Verifica plano, consentimento da obra e cota restante |
| Gerar resumo de capítulo | Reusa o armazenado quando existir; senão gera com o corte no locator |
| Gerar "a história até aqui" | Resumo acumulado até a posição atual |
| Explicar trecho | Explicação contextual do texto selecionado |
| Obter fichas de personagens | Lista ou ficha individual, limitadas ao já lido |
| Enviar mensagem no chat | Turno de conversa com corte no locator |
| Obter conversa | Histórico persistido por obra |
| Salvar resposta como anotação | Cria anotação marcada como originada de IA (`02`) |
| Avaliar resposta | Reporta imprecisão |
| Obter consumo de cota | Consumo do mês por recurso |

---

## 10. Métricas de sucesso

- Percentual de assinantes que usam ao menos um recurso por semana.
- Distribuição de uso entre os quatro recursos (revela qual justifica a assinatura).
- Taxa de resposta reportada como incorreta (alvo < 2%).
- **Incidentes de spoiler reportados (alvo: zero — é a métrica crítica do módulo).**
- Custo de IA por assinante ativo e taxa de acerto do cache de prompt.
- Percentual de resumos servidos do armazenamento em vez de gerados.
- Retenção de assinantes Premium Reader comparada à de leitores gratuitos equivalentes.

---

## 11. Questões em aberto

| ID | Questão |
|---|---|
| `Q-11.1` | **Bloqueante.** O consentimento do autor será por obra (opt-in, como propõe `RN-11.3`), cláusula geral do contrato de publicação, ou opt-out? Opt-in protege o autor mas pode deixar o Premium Reader sem catálogo suficiente para justificar a assinatura. |
| `Q-11.2` | Resumos pré-computados podem ser compartilhados entre leitores (`RN-11.33`)? Isso reduz drasticamente o custo, mas transforma o resumo em um derivado da obra distribuído pela plataforma — questão jurídica, não técnica. |
| `Q-11.3` | **Em debate.** A modelagem indica que a cota de `RN-11.25` custa cerca de 5× o preço de uma assinatura de R$ 19,90 — o chat é responsável por quase todo esse custo, enquanto resumos pré-computados e compartilhados (`RN-11.33`) custam centavos. As opções são cortar a cota de chat, removê-lo, ou vender crédito avulso. **Decisão pendente; a spec segue inalterada até lá.** |
| `Q-11.4` | As cotas propostas são adequadas? Precisam ser validadas contra o uso real de um assinante intenso. |
| `Q-11.5` | Haverá recursos de IA para o autor (revisão, sugestão de sinopse, análise de ritmo)? O rascunho não menciona, mas é extensão natural do plano de criador. |
| `Q-11.6` | Como tratar obras em idiomas diferentes do idioma do leitor — tradução assistida entra no escopo? |
| `Q-11.7` | Qual o SLA aceitável de latência para o chat? Acima de alguns segundos, a experiência deixa de parecer conversa. |
