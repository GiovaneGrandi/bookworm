# 13 — Moderação, Classificação e Curadoria

## 1. Objetivo

Impedir que a plataforma vire terra de ninguém sem que ela vire juiz de gosto literário.

São dois problemas opostos, e a spec até aqui não resolvia nenhum. `RN-09.2` dizia apenas "revisão humana por amostragem (a validar)": não havia política de conteúdo, não havia classificação de obra, não havia processo de denúncia nem apelação, e o leitor não tinha como declarar o que não quer receber — só podia dispensar pílula por pílula (`FEE-07`).

Este módulo é a espinha de confiança do produto e sustenta uma tensão que nunca desaparece: **moderar de menos mata a marca; moderar demais mata a oferta**. P5 diz que o sucesso da plataforma é atrelado ao sucesso do autor — um filtro arbitrário é, por definição, uma violação de P5.

Consolida três questões que estavam abertas em arquivos diferentes e sem dono: `Q-09.3` (escala da revisão), `Q-05.5` (moderação de comentários) e `Q-02.6` (moderação de resenhas).

## 2. Escopo

**Dentro:** política de conteúdo, classificação obrigatória da obra, entrada no catálogo por nível de confiança, obra derivada, controle declarado do leitor sobre feed e recomendações, denúncia, apuração, apelação, sanção, e o custo operacional de tudo isso.

**Fora:** requisitos técnicos de publicação → [`09-autores-e-analytics.md`](09-autores-e-analytics.md) §5.1. Ranqueamento do feed → [`05-feed-pilulas.md`](05-feed-pilulas.md). Antifraude de métricas e de economia → [`03-sessoes-e-metricas.md`](03-sessoes-e-metricas.md), [`07-economia-moedas.md`](07-economia-moedas.md). Idade mínima e ciclo de vida da conta → [`01-contas-e-onboarding.md`](01-contas-e-onboarding.md).

## 3. Personas

Leitor (primária, no controle do que vê), Autor (primária, submetido ao processo), Administração (opera a moderação).

---

## 4. User stories

| ID | Story |
|---|---|
| `MOD-01` | Como leitor, quero não encontrar na plataforma obras de ódio ou feitas de sacanagem, para confiar no que está no catálogo. |
| `MOD-02` | Como leitor, quero dizer uma única vez que não quero certo tipo de obra, em vez de dispensar item por item. |
| `MOD-03` | Como leitor, quero saber que uma obra trata de um tema difícil antes de começar, sem que isso me entregue a trama. |
| `MOD-04` | Como leitor, quero denunciar uma obra, resenha ou comentário e saber que alguém olhou. |
| `MOD-05` | Como leitor adulto, quero poder optar por ver conteúdo adulto, e que ele não apareça enquanto eu não pedir. |
| `MOD-06` | Como responsável, quero que a conta de um adolescente não tenha acesso a conteúdo adulto, e que ele não possa destravar sozinho. |
| `MOD-07` | Como autor, quero saber exatamente o que posso publicar antes de escrever, não depois de ser recusado. |
| `MOD-08` | Como autor, quero que uma recusa venha com o motivo e o caminho de correção, não com uma frase genérica. |
| `MOD-09` | Como autor, quero recorrer de uma decisão e ter outra pessoa olhando. |
| `MOD-10` | Como autor, quero publicar fanfic sem fingir que é obra original e sem medo de ser punido por isso. |
| `MOD-11` | Como autor estabelecido, quero publicar sem esperar fila toda vez. |
| `MOD-12` | Como administração, quero que o custo de moderação cresça mais devagar que o catálogo. |

---

## 5. Regras de negócio

### 5.1 Política de conteúdo: três faixas

A distinção entre o que sai, o que entra com condição e o que entra livre é a espinha do módulo. Sem ela, toda decisão vira caso a caso — e caso a caso não escala nem se defende.

- `RN-13.1` **Faixa proibida** — não entra, e mérito literário não é atenuante: conteúdo sexual envolvendo menores, incitação a violência ou a ódio contra grupo protegido, conteúdo que viole a lei aplicável, plágio ou violação de direitos (`RN-09.8`), e exposição de dados pessoais de terceiros.
- `RN-13.2` **A obra é julgada pela função, não pela palavra.** Machado usa termos que hoje ofendem; *Lolita* narra um crime pela voz do criminoso; boa parte da literatura existe para encarar o que é difícil. O critério é se a obra **promove** o que a faixa proibida veda — não se ela **contém** o assunto. Representar não é endossar. Sem esta regra, o filtro devora exatamente a literatura que o produto existe para distribuir.
- `RN-13.3` **Faixa restrita** — entra, com classificação obrigatória e visibilidade condicionada ao que o leitor pediu: sexo explícito, violência gráfica e os marcadores sensíveis de `RN-13.6`.
- `RN-13.4` **Faixa livre** — todo o resto. É o caso padrão, e a política é escrita de modo que ele continue sendo a maioria esmagadora do catálogo.
- `RN-13.5` A política é **publicada na íntegra, em linguagem direta, e versionada**. Mudança de política não é retroativa: obra já publicada só é reavaliada por processo novo, com aviso ao autor.

### 5.2 Classificação da obra

- `RN-13.6` **Lista fechada e curta** de marcadores de conteúdo *(a validar)*: sexo explícito, violência gráfica, suicídio e automutilação, abuso, uso de substâncias, transtorno alimentar, linguagem forte, conteúdo perturbador. A lista é fechada por decisão de produto — lista aberta vira tag social, cresce sem controle e para de filtrar.
- `RN-13.7` A classificação é obrigatória na publicação e compõe `RN-09.3`: faixa etária, marcadores aplicáveis, indicação de obra derivada (`RN-13.17`) e declaração de uso de IA (`RN-13.13`).
- `RN-13.8` A classificação é **declarada pelo autor e verificável pela plataforma**. Subdeclarar é infração; superdeclarar nunca é. Na dúvida, o autor marca a mais — e o sistema é desenhado para que marcar a mais não custe alcance de forma desproporcional.
- `RN-13.9` **Marcador não é spoiler.** Ele qualifica a obra inteira e nunca aponta capítulo, trecho ou posição. Um marcador posicionado destruiria pela porta dos fundos a barreira que `RN-11.1` protege pela frente.
- `RN-13.10` A classificação é visível na página da obra (`02` §7) antes de qualquer aquisição ou início de leitura.

### 5.3 Entrada no catálogo: confiança progressiva

Responde `Q-09.3`. É o único modelo que escala sem equipe grande e sem virar terra de ninguém.

- `RN-13.11` Todo envio passa pelo **filtro automático antes de qualquer fila humana**: formato válido, extensão mínima, duplicidade contra o catálogo (`RN-09.2`), texto sem sentido ou gerado em massa, e similaridade suspeita com obra existente.
- `RN-13.12` **Três níveis de confiança do autor**, e o nível define o caminho da obra:

  | Nível | Como a obra entra |
  |---|---|
  | `novo` | Primeira obra revisada por pessoa **antes** de publicar |
  | `estabelecido` | Publica direto; entra no conjunto de amostragem |
  | `sob_observacao` | Volta à revisão integral, por prazo determinado |

  A subida de `novo` para `estabelecido` é automática após histórico limpo (critério em `Q-13.7`). A descida para `sob_observacao` é sempre consequência de decisão registrada (`RN-13.33`).
- `RN-13.13` Obra predominantemente gerada por IA precisa ser **declarada** como tal. Não é motivo de recusa — é informação de classificação, e o leitor decide o que fazer com ela.
- `RN-13.14` **A barra de qualidade é objetiva, nunca de mérito literário**: extensão mínima, não é duplicata, não é texto sem sentido, metadados completos, classificação preenchida. A plataforma **não julga se o livro é bom** — coerente com `RN-09.12b` e com P5. Quem julga é o leitor, com resenha (`RN-02.24`) e com a própria escolha.
- `RN-13.15` Recusa sempre traz **o motivo, a regra violada e o caminho de correção**, no tom da persona (`00` §2.3). "Não atende às nossas diretrizes" é resposta proibida.
- `RN-13.16` Prazo alvo `PRAZO_REVISAO_PUBLICACAO` (48 h, a validar). Estouro de fila **não** libera publicação automática de autor `novo` — segurança vence velocidade —, mas o autor é informado do novo prazo, e fila estourada é incidente operacional, não normalidade.

### 5.4 Obra derivada

Fanfic e obra derivada são um volume enorme de escrita, uma das comunidades mais ativas que existem, e um problema de titularidade que `RN-09.1` não resolvia.

- `RN-13.17` **Permitida**, marcada como derivada, com indicação obrigatória da obra-fonte.
- `RN-13.18` **Gratuita e não vendável**: sem preço, sem gorjeta, fora do take rate (`RN-10.6`) e sem gerar Crédito de Autor. É assim que a permissão convive com `RN-09.1` — a plataforma distribui, não comercializa obra derivada sem licença.
- `RN-13.19` Conta integralmente para hábito, meta, ofensiva, estante e coleção — mesmo tratamento que `RN-02.1e` dá à obra (EPUB ou PDF) importada. Ler é ler.
- `RN-13.20` **Conta contra o limite de obras ativas do plano** (`RN-10.3`), justamente por ser gratuita. Sem esse limite, obra derivada vira vetor de inundação do catálogo.
- `RN-13.21` Sujeita a remoção mediante notificação do detentor de direitos. A remoção por essa via, isoladamente, **não** rebaixa o nível de confiança do autor (`RN-13.12`) — ele seguiu a regra que a plataforma deu a ele.

### 5.5 Controle do leitor

O caso concreto: quem não quer fanfic no feed precisa poder dizer isso **uma vez**, e não pílula por pílula.

- `RN-13.22` Existem **dois mecanismos distintos**, e a spec não os confunde:

  | Mecanismo | O que é | Duração |
  |---|---|---|
  | **Preferência declarada** | "Nunca me mostre isto" — por gênero, marcador ou obra derivada | Permanente, até o leitor mudar |
  | **Dispensa pontual** | `FEE-07` — um item específico que não interessou | 90 dias (`RN-05.17`) |

- `RN-13.23` Padrão de fábrica: **opt-out** por gênero e por obra derivada — aparece até o leitor excluir; **opt-in** para os marcadores sensíveis de `RN-13.6` e para conteúdo adulto — só aparece se o leitor ligar.
- `RN-13.24` O filtro incide sobre **feed, recomendações e vitrines**. Nunca sobre busca explícita, nunca sobre a biblioteca do próprio leitor. **Se ele procurou, ele acha** — filtro é curadoria, não censura.
- `RN-13.25` O filtro opera **por conteúdo declarado, nunca por identidade do autor**. Bloquear um autor específico existe, é mecanismo separado, é decisão do leitor e não alimenta nenhum agregado exibido ao autor.
- `RN-13.26` A cota de descoberta (`RN-05.14`) opera **dentro** do filtro do leitor e nunca o contorna. Ela é blindada contra otimização de engajamento, não contra a vontade da pessoa.
- `RN-13.27` Conta de menor de idade (`RN-01.4`): conteúdo adulto e marcadores sensíveis são bloqueados e **não destraváveis pelo próprio menor**.
- `RN-13.28` Quando o filtro fica estreito a ponto de esvaziar o feed, o app **diz isso e mostra o que está sendo escondido**, com o caminho para afrouxar. Feed vazio sem explicação é falha de produto, não consequência aceitável.

### 5.6 Denúncia, apuração e apelação

Responde `Q-05.5` e `Q-02.6`, estendendo `RN-05.20` a todas as superfícies.

- `RN-13.29` Qualquer leitor denuncia obra, pílula, resenha ou comentário, por motivo de **lista fechada**. **Classificação incorreta é categoria própria de denúncia** — é o vetor mais provável de abuso e precisa de caminho próprio.
- `RN-13.30` Denúncia **não despublica automaticamente**. Única exceção: indício forte de faixa proibida (`RN-13.1`) gera suspensão cautelar até a apuração, com aviso imediato ao autor.
- `RN-13.31` **Antibrigading**: volume de denúncias não é sinal de veracidade. O peso considera o histórico do denunciante, e denúncia coordenada é ela própria infração, apurada como tal.
- `RN-13.32` Toda decisão contra o autor é **apelável uma vez**, com revisão por pessoa diferente da que decidiu. O prazo de resposta é declarado ao autor no momento da decisão.
- `RN-13.33` **Sanção proporcional e em escala**: aviso → reclassificação forçada → despublicação → suspensão de conta. Não se pulam degraus, salvo faixa proibida. Despublicação preserva o acesso de quem já adquiriu (`RN-02.4`, `RN-09.6`).
- `RN-13.34` **Transparência**: o autor vê o histórico completo das decisões sobre ele, com motivo e data. A plataforma publica relatório agregado periódico — volume de denúncias, decisões, apelações e taxa de reversão.
- `RN-13.35` `RN-07.26` e `RN-10.19` continuam valendo sem exceção: **nada é oferecido nem vendido ao autor no momento de uma sanção**. Não se monetiza frustração que a própria plataforma criou.

### 5.7 Escala e custo

- `RN-13.36` O custo de moderação é métrica **de produto**, não de infraestrutura — mesmo tratamento que `RN-11.35` dá ao custo de IA. Ele entra na conta de unidade econômica do plano de autor.
- `RN-13.37` A automação faz **triagem**: prioriza, agrupa e sugere. A **decisão final** sobre faixa proibida ou sobre sanção de conta é sempre humana.
- `RN-13.38` **Saúde de quem modera**: rodízio obrigatório, limite de exposição a conteúdo pesado, apoio disponível, e nunca uma pessoa sozinha decidindo casos da faixa proibida. Moderação é trabalho com custo humano real, e ignorar isso produz decisão ruim além de dano evitável.

---

## 6. Critérios de aceitação

**`MOD-02` — Preferência declarada**
- Dado que sou leitor e excluí "obra derivada" nas preferências, quando abro o feed, então nenhuma pílula de obra derivada aparece, e a exclusão persiste entre sessões e dispositivos.
- Dado que excluí um gênero, quando busco explicitamente por esse gênero, então os resultados aparecem normalmente, porque `RN-13.24` restringe o filtro ao feed e às recomendações.

**`MOD-03` — Marcador sem spoiler**
- Dado que uma obra tem o marcador "abuso", quando abro a página da obra, então vejo o marcador aplicado à obra inteira e nenhuma indicação de em que capítulo ou trecho o tema aparece.

**`MOD-05` / `MOD-06` — Conteúdo adulto**
- Dado que sou leitor adulto e nunca liguei conteúdo adulto, quando uso feed, recomendações e vitrines, então nenhuma obra classificada como adulta aparece.
- Dado que minha conta tem 15 anos (`RN-01.4`), quando abro as preferências de conteúdo, então a chave de conteúdo adulto aparece bloqueada e não é destravável por mim.

**`MOD-07` / `MOD-08` — Publicação e recusa**
- Dado que sou autor `novo`, quando submeto minha primeira obra, então ela entra em fila de revisão humana antes de publicar, com prazo informado.
- Dado que minha obra foi recusada, quando abro a decisão, então vejo o motivo, a regra violada e o que fazer para corrigir — nunca uma mensagem genérica.

**`MOD-09` — Apelação**
- Dado que recebi uma decisão contrária, quando recorro, então a revisão é feita por pessoa diferente da que decidiu, e o prazo de resposta me foi informado no momento da decisão.

**`MOD-10` — Obra derivada**
- Dado que publico uma obra derivada, quando defino os metadados, então o campo de preço está indisponível e a indicação da obra-fonte é obrigatória.
- Dado que um leitor lê minha obra derivada, quando a sessão encerra, então ela conta para a meta e para a ofensiva dele como qualquer outra leitura.

**`MOD-11` — Confiança progressiva**
- Dado que sou autor `estabelecido`, quando publico uma obra, então ela entra no catálogo sem fila humana e passa a ser elegível à amostragem.

---

## 7. Telas e estados

| Tela | Conteúdo | Estados |
|---|---|---|
| **Política de conteúdo** | Texto integral, versionado, com data de vigência | — |
| **Classificação da obra** (autor) | Faixa etária, marcadores, obra derivada e fonte, declaração de IA | Erro (classificação ausente), Aviso (marcador sugerido pela triagem) |
| **Fila de revisão** (autor) | Posição, prazo estimado, status | Em análise, Aprovada, Recusada, Em apelação |
| **Decisão** (autor) | Motivo, regra violada, caminho de correção, ação de apelar | Apelável, Apelação em curso, Decisão final |
| **Preferências de conteúdo** (leitor) | Gêneros excluídos, marcadores, obra derivada, conteúdo adulto, autores bloqueados | Bloqueado por idade (`RN-13.27`), Filtro estreito demais (`RN-13.28`) |
| **Denunciar** | Motivo de lista fechada, campo livre opcional | Enviada, Em apuração, Concluída |
| **Painel de moderação** (administração) | Fila priorizada, histórico do autor, histórico do denunciante, ação | Vazio, Fila estourada (incidente, `RN-13.16`) |
| **Relatório de transparência** | Agregados públicos de denúncias, decisões e reversões | — |

---

## 8. Dados

| Entidade | Campos principais | Propósito |
|---|---|---|
| `PoliticaConteudo` | versao, texto, vigencia_inicio, vigencia_fim | Política versionada (`RN-13.5`) |
| `ClassificacaoObra` | obra_id, faixa_etaria, marcadores[], derivada, obra_fonte, gerada_por_ia, declarada_por, verificada_em | Classificação declarada e verificável (`RN-13.7`, `RN-13.8`) |
| `NivelConfiancaAutor` | autor_id, nivel (novo, estabelecido, sob_observacao), desde, motivo | Caminho da obra no catálogo (`RN-13.12`) |
| `SubmissaoRevisao` | id, obra_id, versao_id, origem (automatica, amostragem, denuncia), status, prazo_alvo, revisor_id, concluida_em | Fila de entrada (`RN-13.11`, `RN-13.16`) |
| `DecisaoModeracao` | id, alvo_tipo, alvo_id, regra_violada, resultado, motivo, revisor_id, criada_em | Decisão auditável (`RN-13.15`, `RN-13.34`) |
| `Denuncia` | id, denunciante_id, alvo_tipo, alvo_id, motivo, texto, peso, status, criada_em | Sinal, nunca veredito (`RN-13.29`, `RN-13.31`) |
| `Apelacao` | id, decisao_id, autor_id, texto, revisor_id, resultado, prazo, concluida_em | Devido processo (`RN-13.32`) |
| `SancaoAutor` | id, autor_id, decisao_id, degrau, inicio, fim | Escala proporcional (`RN-13.33`) |
| `PreferenciaConteudoLeitor` | usuario_id, generos_excluidos[], marcadores_liberados[], derivada_visivel, adulto_liberado, atualizada_em | Controle declarado (`RN-13.22`, `RN-13.23`) |
| `BloqueioAutor` | leitor_id, autor_id, criado_em | Bloqueio individual, separado do filtro de conteúdo (`RN-13.25`) |

---

## 9. API (alto nível)

| Operação | Descrição |
|---|---|
| Classificar obra | Grava `ClassificacaoObra` na submissão; obrigatória para publicar |
| Submeter à revisão | Roda o filtro automático e roteia por `NivelConfiancaAutor` |
| Consultar fila | Posição e prazo, para o autor |
| Decidir | Registra `DecisaoModeracao` e dispara notificação com motivo |
| Apelar | Abre `Apelacao` e atribui revisor distinto |
| Denunciar | Cria `Denuncia` com peso calculado |
| Ler preferências de conteúdo | Devolve o filtro vigente, aplicado por feed e recomendações |
| Atualizar preferências de conteúdo | Respeita o bloqueio por idade de `RN-13.27` |
| Bloquear autor | Cria `BloqueioAutor`, invisível ao autor |

---

## 10. Métricas de sucesso

| Métrica | Alvo |
|---|---|
| Tempo mediano na fila de revisão | ≤ `PRAZO_REVISAO_PUBLICACAO` (48 h, a validar) |
| Taxa de recusa de autor `novo` | a definir — **alta demais sinaliza sobre-moderação** (modo de falha 2) |
| Taxa de reversão em apelação | a definir — **alta demais sinaliza critério mal escrito**, não apelação generosa |
| Obras da faixa proibida que chegaram a ficar públicas | zero |
| Denúncias de classificação incorreta por mil obras | a definir — mede a subdeclaração (modo de falha 5) |
| Proporção de leitores com filtro ativo | a definir — instrumentar desde o dia 1 |
| Custo de moderação por obra publicada | vigiado como métrica de produto (`RN-13.36`) |

---

## 11. Questões em aberto

| ID | Questão |
|---|---|
| `Q-13.1` | Quem faz a revisão humana no lançamento: equipe própria, terceirizado ou curadoria da comunidade? Comunidade é barata e cria conflito de interesse. |
| `Q-13.2` | Verificação de idade para conteúdo adulto: autodeclaração ou documento? Documento protege mais e custa privacidade, dinheiro e conversão. Interage com `Q-01.1`. |
| `Q-13.3` | A lista de marcadores de `RN-13.6` precisa ser validada com leitores reais — os oito propostos cobrem o que as pessoas de fato querem evitar? |
| `Q-13.4` | Obra derivada poderá ser vendável quando houver licença explícita do detentor de direitos? Abriria um caminho legítimo hoje fechado por `RN-13.18`. |
| `Q-13.5` | Conteúdo adulto e jurisdição: o que é permitido no mercado de lançamento vale nos seguintes? Interage com `Q-01.1` e com as regras de loja de `Q-10.9`. |
| `Q-13.6` | A partir de quando o relatório de transparência de `RN-13.34` é público, e com que periodicidade? |
| `Q-13.7` | Qual o critério objetivo de subida de `novo` para `estabelecido` (`RN-13.12`): número de obras, tempo decorrido, ausência de denúncia procedente, ou combinação? |

---

## 12. Modos de falha conhecidos

Seção fora da estrutura padrão dos módulos, incluída porque estes modos são previsíveis, caros, e cada um tem uma regra desenhada contra ele. Registrá-los é o que impede que a mitigação seja removida por engano numa revisão futura.

| # | Modo de falha | Por que acontece | Mitigação |
|---|---|---|---|
| 1 | **Falso positivo em obra literária** | O filtro automático não distingue representar de promover. Machado, *Lolita* e literatura LGBTQ+ são os alvos clássicos | `RN-13.2`; decisão humana obrigatória na faixa proibida (`RN-13.37`); apelação (`RN-13.32`) |
| 2 | **Sobre-moderação mata a oferta** | Recusa demais, fila longa, critério opaco. O autor vai para outra plataforma — e P5 diz que o sucesso da plataforma é atrelado ao dele | Taxa de recusa e tempo de fila como métricas de alarme (§10); `RN-13.14` proíbe barra de mérito |
| 3 | **Sub-moderação mata a marca** | Publicação instantânea sem revisão. Uma obra ofensiva viralizada custa mais que cem recusas justas | `RN-13.12`, confiança progressiva |
| 4 | **Denúncia coordenada derruba autor legítimo** | Grupo organizado usa o volume como arma | `RN-13.31`; denúncia coordenada é ela própria infração |
| 5 | **Subdeclaração de classificação** | É o incentivo perverso central: marcar "livre" escapa do filtro do leitor e ganha alcance | `RN-13.8`; denúncia de classificação como categoria própria (`RN-13.29`); sanção maior que a do conteúdo em si |
| 6 | **O filtro do leitor vira bolha e o feed morre** | Exclusões acumuladas esvaziam o inventário e sufocam a cota de descoberta | `RN-13.26` mantém a descoberta dentro do filtro; `RN-13.28` avisa quando ficou estreito |
| 7 | **Inundação por obra gerada em massa** | O custo marginal de gerar texto tende a zero | `RN-13.11`, `RN-13.13`, `RN-13.20`. É corrida armamentista, e está declarada como tal — nenhuma dessas regras resolve o problema em definitivo |
| 8 | **Custo de moderação cresce mais rápido que a receita** | Revisão humana escala linear; catálogo escala melhor que isso | `RN-13.12` é a mitigação estrutural; `RN-13.36` a torna visível antes de virar crise |
| 9 | **Loja de aplicativos muda a régua sobre conteúdo adulto** | Política de terceiro, fora do controle da plataforma | A classificação de `RN-13.7` já permite esconder por trilho de distribuição. Vizinha de `Q-10.9` |
| 10 | **Jurisdição** | O que é legal no mercado de lançamento não é em outro | `Q-13.5`, `Q-01.1` |
| 11 | **Exposição de quem modera** | Alguém lê o pior conteúdo da plataforma, todo dia, por trabalho | `RN-13.38` — rodízio, limite de exposição e decisão nunca solitária |
