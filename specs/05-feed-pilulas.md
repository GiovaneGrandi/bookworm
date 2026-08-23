# 05 — Feed Vertical e Pílulas Literárias

## 1. Objetivo

Criar a superfície de descoberta que compete diretamente com redes sociais pelo mesmo momento de atenção — rolagem vertical, consumo rápido, retorno frequente — e usá-la como **funil psicológico**: capturar o usuário com curiosidade de curta duração e redirecioná-lo para o estado de foco imersivo através do botão "Continuar Lendo" (rascunho L84–89).

O feed é a principal ferramenta de aquisição de leitura do produto e a principal vitrine orgânica do autor.

## 2. Escopo

**Dentro:** feed vertical, formato e publicação da pílula literária, ranqueamento e curadoria, interações sociais leves (curtir, salvar, seguir, comentar), transição para o leitor, controle de sessão de feed.

**Fora:** leitor imersivo e aquisição da obra → [`02-biblioteca-e-leitor.md`](02-biblioteca-e-leitor.md). Analytics de conversão para o autor → [`09-autores-e-analytics.md`](09-autores-e-analytics.md). Compra de destaque de vitrine → [`10-monetizacao-planos.md`](10-monetizacao-planos.md).

## 3. Personas

Leitor (consumo), Autor (publicação).

---

## 4. User stories

| ID | Story |
|---|---|
| `FEE-01` | Como leitor, quero rolar um feed de trechos curtos para descobrir obras sem esforço de decisão. |
| `FEE-02` | Como leitor, quero que um trecho que me prendeu leve direto à leitura da obra completa. |
| `FEE-03` | Como leitor, quero salvar uma pílula para voltar a ela depois. |
| `FEE-04` | Como leitor, quero curtir uma pílula para sinalizar interesse e melhorar minhas recomendações. |
| `FEE-05` | Como leitor, quero seguir autores para ver mais do que eles publicam. |
| `FEE-06` | Como leitor, quero um feed que reflita meus interesses e não me mostre sempre os mesmos autores. |
| `FEE-07` | Como leitor, quero poder dizer "não me mostre isso" para calibrar o que recebo. |
| `FEE-08` | Como autor, quero publicar micro-trechos das minhas obras para conquistar leitores. |
| `FEE-09` | Como autor, quero vincular a pílula ao ponto exato da obra para que o leitor continue de onde parou o trecho. |
| `FEE-10` | Como autor, quero ver como cada pílula converteu em leitura para saber o que funciona. |
| `FEE-11` | Como leitor, quero comentar uma pílula para participar da conversa em torno do texto. |
| `FEE-12` | Como leitor, quero saber quanto tempo passei no feed para não trocar um vício por outro. |

---

## 5. Regras de negócio

### 5.1 Formato da pílula

- `RN-05.1` A pílula é composta por: trecho textual, obra de origem, autor, locator de continuação e, opcionalmente, uma imagem de fundo ou paleta temática.
- `RN-05.2` Extensão: de **1 a 3 parágrafos** (rascunho L88) ou um poema curto, com teto rígido de 1.200 caracteres (a validar). O limite é do formato, não sugestão.
- `RN-05.3` Toda pílula é obrigatoriamente extraída de uma obra publicada pelo próprio autor na plataforma. Não há pílula sem obra de destino — o feed existe para levar à leitura longa, e conteúdo avulso o transformaria em rede social genérica.
- `RN-05.4` Uma pílula extraída de uma obra **paga** deve pertencer à faixa da amostra gratuita (`RN-02.2`) ou a um trecho que o autor libere explicitamente como público.
- `RN-05.5` O autor define o **locator de continuação**: o ponto da obra onde a leitura começa ao tocar "Continuar Lendo". O padrão é o início do trecho da pílula.
- `RN-05.6` A pílula é imutável após a publicação, exceto por correção tipográfica. Alterar o texto invalidaria as métricas já coletadas.
- `RN-05.7` Limite de publicação: 3 pílulas por dia por autor (a validar), para preservar a qualidade média do feed.

### 5.2 O funil: da curiosidade ao foco

- `RN-05.8` Toda pílula exibe uma ação primária **"Continuar Lendo"**, visualmente dominante sobre as ações sociais.
- `RN-05.9` "Continuar Lendo" abre o leitor imersivo (`RN-02.13`) diretamente no locator de continuação, sem telas intermediárias, quando o leitor já possui a obra ou quando o trecho pertence à amostra gratuita.
- `RN-05.10` Quando a obra é paga e o leitor não a possui, "Continuar Lendo" abre a **amostra** no leitor imersivo. A oferta de compra aparece apenas ao fim da amostra (`LEI-03`), nunca interrompendo o momento de engajamento.
- `RN-05.11` Ao entrar no leitor pelo feed, o app suprime todas as affordances de retorno rápido ao feed por 60 segundos (a validar): não há badge, contador nem atalho visível. A transição é o produto (rascunho L89).
- `RN-05.12` A leitura iniciada pelo feed é uma sessão comum (`03`) e conta integralmente para meta e ofensiva a partir do momento em que o leitor imersivo é aberto.
- `RN-05.12a` **O tempo lendo pílulas também conta para a meta diária**, até o teto de `PILULA_TETO_META` (5 min/dia, a validar), conforme `RN-03.8`. Ler dentro do app é ler: era incoerente promover o feed como superfície de aquisição, limitar o tempo nele e ainda desvalorizar o que se lê ali.
- `RN-05.12b` A medição no feed usa o mesmo instrumento do leitor: caracteres exibidos e tempo ativo sobre eles (`RN-03.8a`). Só conta a pílula **aberta e rolada até o fim**; rolagem rápida não gera tempo ativo, pela regra de inatividade de `RN-03.10`. O teto diário existe justamente porque essa medição é menos precisa que a do leitor — ele limita o dano de qualquer imprecisão a 5 minutos por dia.

### 5.3 Ranqueamento e curadoria

- `RN-05.13` O feed é composto por quatro fontes, com proporções-alvo *(a validar)*:
  - 40% recomendação por afinidade (interesses declarados, gêneros lidos, curtidas, autores seguidos);
  - 25% autores seguidos;
  - 20% descoberta deliberada — autores que o usuário nunca leu, priorizando autores estreantes;
  - 15% curadoria editorial e destaques de vitrine comprados (`10`), sempre rotulados como patrocinados.
- `RN-05.14` A fatia de descoberta é regra de produto, não de otimização: o modelo de recomendação não pode consumi-la, mesmo que a métrica de engajamento melhore. É ela que sustenta a promessa de diversidade e o gatilho de moeda por ler autor estreante (`RN-07.5`).
- `RN-05.15` Sinais de ranqueamento, em ordem de peso proposta: conversão em leitura (toque em "Continuar Lendo" seguido de sessão válida) > tempo de permanência na pílula > salvamento > curtida > comentário. Conversão em leitura pesa mais que qualquer sinal social, para o feed otimizar o comportamento certo (P3).
- `RN-05.16` Nenhuma pílula do mesmo autor aparece duas vezes na mesma sessão de feed, e no máximo 3 pílulas do mesmo autor aparecem por dia.
- `RN-05.17` A pílula já convertida em leitura pelo usuário não reaparece; a que ele dispensou explicitamente (`FEE-07`) fica suprimida por 90 dias.
- `RN-05.18` O feed é acessível sem conta (`CON-02`), em modo somente leitura, com ranqueamento genérico por curadoria e popularidade.

### 5.4 Interações sociais

- `RN-05.19` Interações disponíveis: curtir, salvar, comentar, compartilhar externamente e seguir o autor.
- `RN-05.20` Comentários são moderáveis pelo autor da pílula, que pode ocultar comentários na própria publicação e bloquear usuários. Denúncias vão para a moderação da plataforma, pelo processo de [`13-moderacao-e-curadoria.md`](13-moderacao-e-curadoria.md) §5.6 (`RN-13.29`–`RN-13.33`).
- `RN-05.21` Curtidas e salvamentos são privados: a contagem agregada é visível, a lista de quem curtiu não.
- `RN-05.22` Nenhuma interação do feed gera moedas, e ler pílulas também não (`RN-03.8`). O feed contribui para o **hábito** (meta e ofensiva), nunca para a **economia** — pagar por engajamento no feed criaria exatamente o comportamento que o produto quer evitar (P3).

### 5.5 Consumo saudável

- `RN-05.23` O app registra o tempo de sessão no feed separadamente do tempo de leitura, e nunca os soma em nenhuma métrica exibida.
- `RN-05.24` Após `FEED_LIMITE_SUGESTAO` (15 minutos contínuos de feed, a validar), aparece um cartão intersticial convidando à leitura da obra ativa ou de uma pílula salva. O cartão é dispensável, aparece no máximo uma vez a cada 30 minutos e nunca bloqueia a rolagem.
- `RN-05.25` A tela "Meu desempenho" (`03`) mostra o tempo de feed com honestidade, ao lado do tempo de leitura. O produto não esconde o próprio custo de atenção.
- `RN-05.26` O usuário pode definir um limite diário de feed nas configurações; ao atingi-lo, o app sugere o leitor em vez de mais pílulas — sem travar o acesso.

---

## 6. Critérios de aceitação

**`FEE-02` + `RN-05.9` — Continuação direta para quem tem a obra**
```
Dado que possuo a obra de origem de uma pílula
Quando toco em "Continuar Lendo"
Então o leitor imersivo abre no locator de continuação definido pelo autor
E nenhuma tela intermediária de catálogo ou compra é exibida
E uma sessão de leitura é iniciada
```

**`RN-05.10` — Continuação para obra paga não possuída**
```
Dado que não possuo a obra paga de origem de uma pílula
Quando toco em "Continuar Lendo"
Então a amostra gratuita abre no leitor imersivo
E a oferta de compra aparece somente ao fim da amostra
```

**`RN-05.11` — Proteção do estado de foco**
```
Dado que entrei no leitor a partir do feed
Quando estou lendo há menos de 60 segundos
Então não há badge, contador nem atalho visível de retorno ao feed
E o gesto de voltar do sistema continua funcionando normalmente
```

**`RN-05.2` — Limite de formato**
```
Dado que sou autor compondo uma pílula
Quando o texto ultrapassa 3 parágrafos ou 1.200 caracteres
Então a publicação é bloqueada
E o editor mostra o limite e o excedente antes do envio
```

**`RN-05.4` — Pílula só de trecho liberado**
```
Dado que sou autor de uma obra paga
Quando seleciono um trecho fora da faixa de amostra e não o marco como público
Então a criação da pílula é bloqueada com a explicação do motivo
```

**`RN-05.14` — Cota de descoberta preservada**
```
Dado que rolo 100 pílulas em uma sessão de feed
Quando analiso a composição exibida
Então aproximadamente 20 pílulas são de autores que eu nunca li
E essa proporção se mantém independentemente do meu histórico de engajamento
```

**`FEE-07` — Dispensar conteúdo**
```
Dado que dispenso uma pílula com "não me mostre isso"
Quando continuo navegando
Então aquela pílula não reaparece nos próximos 90 dias
E o app me pergunta uma única vez se quero calibrar o motivo (autor, gênero, tema)
```

**`FEE-12` + `RN-05.24` — Convite à leitura profunda**
```
Dado que estou há 15 minutos contínuos no feed
Quando rolo para a próxima pílula
Então vejo um cartão convidando a retomar minha obra ativa
E posso dispensá-lo com um gesto
E ele não reaparece antes de 30 minutos
```

**`RN-05.22` + `RN-05.12a` — Feed conta para o hábito, não para a economia**
```
Dado que li pílulas por 12 minutos e curti, salvei e comentei várias
Quando consulto meu extrato de moedas
Então nenhuma moeda foi creditada
E ao consultar o progresso da minha meta do dia
Então 5 minutos foram somados, pelo teto diário de pílula
```

---

## 7. Telas e estados

| Tela | Conteúdo | Estados |
|---|---|---|
| **Feed** | Pílulas em rolagem vertical, uma por vez em tela cheia; ação primária "Continuar Lendo"; ações sociais laterais; rótulo de patrocinado quando aplicável | Vazio (sem conteúdo: mostra curadoria editorial), Carregando (pré-carrega as próximas 3), Erro (retentativa sem perder posição), Offline (exibe as pílulas em cache e avisa) |
| **Pílula (detalhe)** | Trecho completo, capa e sinopse da obra, autor, comentários | Carregando, Erro |
| **Comentários** | Lista, campo de escrita, denúncia, moderação do autor | Vazio (convite a comentar primeiro), Erro |
| **Salvos** | Pílulas salvas, agrupadas por obra | Vazio |
| **Perfil do autor (a partir do feed)** | Bio, obras, pílulas, seguir | Vazio |
| **Compositor de pílula (autor)** | Seleção de trecho na obra, pré-visualização no formato do feed, escolha do locator de continuação, contador de limite | Erro (limite excedido, trecho não liberado), Bloqueado (cota diária atingida) |
| **Cartão intersticial de foco** | Convite a retomar a obra ativa ou uma pílula salva | — |

**Offline:** o feed serve as pílulas em cache e permite salvar (fila de sincronização). Curtir, comentar e seguir exigem conexão. "Continuar Lendo" funciona offline se a obra estiver baixada.

---

## 8. Dados

| Entidade | Campos principais | Propósito |
|---|---|---|
| `Pilula` | id, autor_id, obra_id, texto, tipo (trecho, poema), locator_inicio, locator_continuacao, imagem_fundo_url, paleta, status (publicada, oculta, removida), publicada_em | Unidade do feed |
| `InteracaoPilula` | id, usuario_id, pilula_id, tipo (visualizacao, curtida, salvamento, dispensa, compartilhamento, conversao), duracao_ms, criado_em | Sinais de ranqueamento e analytics do autor |
| `ComentarioPilula` | id, pilula_id, usuario_id, texto, status (ativo, oculto, removido), criado_em | Conversa em torno do texto |
| `Seguidor` | seguidor_id, autor_id, criado_em | Composição do feed |
| `SessaoFeed` | id, usuario_id, iniciada_em, encerrada_em, duracao_s, pilulas_vistas, conversoes | Consumo saudável e honestidade métrica |
| `SupressaoFeed` | usuario_id, alvo_tipo (pilula, autor, genero), alvo_id, expira_em | Efeito do "não me mostre isso" |

---

## 9. API (alto nível)

| Operação | Descrição |
|---|---|
| Obter feed | Página de pílulas ranqueadas, com cota de descoberta e rótulo de patrocínio |
| Registrar interação | Visualização, curtida, salvamento, dispensa, conversão |
| Obter pílula | Detalhe com obra, autor e contexto |
| Continuar lendo | Resolve posse e devolve o destino: leitor da obra ou amostra |
| Criar pílula | Valida limites de formato, faixa liberada e cota diária |
| Listar pílulas do autor | Gestão e métricas por pílula |
| Ocultar / remover pílula | Gestão do autor |
| Comentar / listar / denunciar comentário | Conversa e moderação |
| Seguir / deixar de seguir autor | Ajuste da composição do feed |
| Obter salvos | Lista de pílulas salvas |
| Registrar sessão de feed | Tempo de feed, separado do tempo de leitura |

---

## 10. Métricas de sucesso

- **Taxa de conversão feed → leitura:** pílulas que resultaram em sessão válida de ao menos 60 s. É a métrica-mãe do módulo.
- Tempo médio de leitura gerado por conversão (mede se o funil entrega foco, não só clique).
- Percentual de sessões de feed que terminam em leitura.
- Razão tempo de leitura / tempo de feed na base (deve subir ao longo do tempo; queda significa que o feed virou fim em si).
- Cobertura de autores: percentual de autores publicantes que recebem ao menos N impressões por semana.
- Taxa de aquisição de obra originada em pílula.

---

## 11. Questões em aberto

| ID | Questão |
|---|---|
| `Q-05.1` | Haverá pílulas em formato de áudio ou vídeo (autor lendo o próprio trecho)? Aumenta muito o apelo competitivo com redes sociais, mas amplia custo de moderação e produção. |
| `Q-05.2` | O leitor comum poderá publicar pílulas (citações de obras que leu, com crédito), ou o feed é exclusivo de autores? Isso muda o volume de conteúdo e o modelo de direitos. |
| `Q-05.3` | Como um feed nasce com massa crítica? Sem catálogo inicial de autores, o feed fica vazio — depende de `Q-02.1`. |
| `Q-05.4` | Qual o critério de "autor estreante" para a cota de descoberta e para o gatilho de moeda (`RN-07.5`): número de leitores, tempo de plataforma ou obras publicadas? |
| `Q-05.5` | ✅ **Resolvida** por [`13-moderacao-e-curadoria.md`](13-moderacao-e-curadoria.md): moderação do autor na própria pílula (`RN-05.20`) mais denúncia com apuração e apelação (`RN-13.29`–`RN-13.32`). Triagem automática prioriza; decisão de faixa proibida é humana (`RN-13.37`). |
| `Q-05.6` | O limite de 15 minutos de feed antes do intersticial é uma decisão de produto forte (contraria a métrica de engajamento). Confirmar que é aceitável abrir mão desse tempo. |
