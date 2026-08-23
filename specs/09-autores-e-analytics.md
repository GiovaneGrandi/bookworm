# 09 — Autores: Publicação, Ferramentas de Escrita e Analytics

## 1. Objetivo

Atender o segundo lado do produto. O autor precisa de três coisas: publicar e distribuir sua obra, manter o hábito de escrever (quests e sprints, rascunho L108–113) e entender sua audiência com profundidade que nenhuma editora tradicional entrega (mapa de evasão, engajamento e gorjetas, L126–133).

## 2. Escopo

**Dentro:** publicação e gestão de obras, ferramentas gamificadas de escrita (quests e sprints Pomodoro), dashboard de analytics, recebimento e saque, compra de destaque de vitrine.

**Fora:** ativação do papel de autor → [`01-contas-e-onboarding.md`](01-contas-e-onboarding.md). Publicação de pílulas → [`05-feed-pilulas.md`](05-feed-pilulas.md). Ofensiva de escrita e jardim → [`04-streaks-e-jardim.md`](04-streaks-e-jardim.md). Moedas, gorjetas e a separação de créditos → [`07-economia-moedas.md`](07-economia-moedas.md). Planos, limites e take rate → [`10-monetizacao-planos.md`](10-monetizacao-planos.md).

## 3. Personas

Autor (primária), Administração (moderação e pagamentos).

---

## 4. User stories

| ID | Story |
|---|---|
| `AUT-01` | Como autor, quero publicar minha obra com metadados, capa e conteúdo para que leitores a encontrem. |
| `AUT-02` | Como autor, quero definir preço e faixa de amostra gratuita para equilibrar alcance e receita. |
| `AUT-03` | Como autor, quero editar e despublicar minha obra mantendo o acesso de quem já a adquiriu. |
| `AUT-04` | Como autor, quero definir metas diárias de escrita para manter meu ritmo de produção. |
| `AUT-05` | Como autor, quero um cronômetro de sprint de foco para escrever sem interrupção. |
| `AUT-06` | Como autor, quero ver meu histórico de sprints e meus recordes de PPM para competir comigo mesmo. |
| `AUT-07` | Como autor, quero saber onde os leitores abandonam minha obra para melhorar meu texto. |
| `AUT-08` | Como autor, quero saber quais frases são mais grifadas para entender o que ressoa. |
| `AUT-09` | Como autor, quero saber quais trechos geraram gorjetas para conhecer meus momentos de maior impacto. |
| `AUT-10` | Como autor, quero acompanhar vendas, leitores e receita em um painel. |
| `AUT-11` | Como autor, quero sacar minha receita em dinheiro. |
| `AUT-12` | Como autor, quero comprar destaque nas vitrines para ampliar meu alcance. |
| `AUT-13` | Como autor, quero escrever dentro da plataforma, ou importar o que escrevi fora, sem retrabalho. |
| `AUT-14` | Como autor, quero marcos da minha obra, e não só do meu dia, para acompanhar o que realmente persigo. |
| `AUT-15` | Como autor, quero saber quando alguém termina minha obra, porque é a prova de que ela funcionou. |
| `AUT-16` | Como autor travado, quero um empurrão leve para voltar a escrever, sem ser cobrado. |
| `AUT-17` | Como autor, quero que a IA me diga o que os dados dos meus leitores significam, não só me mostre gráficos. |
| `AUT-18` | Como autor, quero distribuir cópias antecipadas para leitores certos antes de publicar. |
| `AUT-19` | Como autor, quero ferramentas de pré-venda e lista de espera para o meu lançamento. |
| `AUT-20` | Como leitor, quero receber convites de leitura antecipada de obras do meu gosto, e poder recusar sem consequência. |

---

## 5. Regras de negócio

### 5.1 Publicação

- `RN-09.1` A publicação exige: título, sinopse, ao menos um gênero, idioma, capa, conteúdo em EPUB 3 e declaração de titularidade dos direitos.
- `RN-09.2` Toda obra submetida passa por revisão antes de entrar no catálogo: verificação automática (formato válido, conteúdo mínimo, detecção de duplicidade contra o catálogo existente) e revisão humana. **O caminho da obra depende do nível de confiança do autor** — autor novo é revisado por pessoa antes de publicar; autor estabelecido publica direto e entra em amostragem. Processo, política e critérios em [`13-moderacao-e-curadoria.md`](13-moderacao-e-curadoria.md) (`RN-13.11`, `RN-13.12`).
- `RN-09.3` Na publicação, o autor define: preço (ou obra gratuita), faixa de amostra gratuita (`RN-02.2`), permissão de citação em cards (`RN-08.15`), consentimento de uso por recursos de IA (`RN-11.3`) e a **classificação de conteúdo obrigatória** de `RN-13.7` — faixa etária, marcadores, obra derivada e declaração de uso de IA na criação.
- `RN-09.4` Obras ativas contam contra o limite do plano (`RN-10.3`). Obra em rascunho ou despublicada não conta.
- `RN-09.5` Edição de obra já publicada gera nova versão. Leitores recebem a atualização e mantêm sua posição de leitura por locator; quando a edição invalida locators (reestruturação de capítulos), o leitor é levado ao início do capítulo em que estava, com aviso.
- `RN-09.6` Despublicar remove a obra do catálogo mas preserva o acesso de quem já a adquiriu (`RN-02.4`). O autor é informado dessa consequência antes de confirmar.
- `RN-09.7` Alteração de preço vale apenas para novas aquisições e não gera cobrança nem reembolso retroativo.
- `RN-09.8` Plágio ou violação de direitos comprovada leva a despublicação, retenção do saldo relativo à obra e revisão da conta.

### 5.2 Ferramentas gamificadas de escrita

- `RN-09.9` **Quest de escrita** (rascunho L112): meta diária parametrizada pelo autor, em palavras ou minutos (`RN-04.3`). Cumprir a quest alimenta a ofensiva de escrita (`RN-04.12`) e gera moedas (`07`).
- `RN-09.10` **Sprint de foco** (rascunho L113): sessão cronometrada de escrita ininterrupta, com duração escolhida pelo autor (padrão 15 min). Durante o sprint, o editor entra em modo imersivo e as notificações são suprimidas, como no leitor (`RN-02.14`).
- `RN-09.11` O sprint registra: duração, palavras produzidas, PPM, interrupções e obra associada. O histórico e o **recorde pessoal de PPM** ficam disponíveis ao autor.
- `RN-09.12` A competição do sprint é exclusivamente consigo mesmo (P1). Não há ranking de PPM entre autores, e as mensagens seguem o mesmo tom e as mesmas proibições de vocabulário do Ghost Reader (`RN-06.18` a `RN-06.21`).
- `RN-09.12b` O rascunho pede superação de PPM "mantendo a qualidade" (L113). A plataforma não avalia qualidade literária: o produto se limita a exibir o PPM ao lado do volume revisado depois (palavras que sobreviveram à revisão em 7 dias), deixando o julgamento com o autor. Ver `Q-09.5`.
- `RN-09.13` O texto do sprint é gravado continuamente e nunca é perdido por queda do app, interrupção do cronômetro ou perda de conexão.

### 5.2b Marcos de manuscrito

Quest diária (`RN-09.9`) e sprint (`RN-09.10`) medem o **dia** do escritor. Faltava o que ele de fato persegue: o **progresso da obra**. Sem isso, o eixo de escrita era um espelho pálido do de leitura.

- `RN-09.12c` Toda obra em produção tem marcos próprios, comemorados quando alcançados: **primeiras 1.000 palavras**, **primeiro capítulo fechado**, **metade do rascunho** (contra a meta de extensão que o autor declarou), **rascunho concluído**, **obra publicada**.
- `RN-09.12d` Depois da publicação, os marcos passam a ser de audiência: **primeiro leitor**, **primeira resenha**, **primeira gorjeta**, **décimo leitor**, **centésimo leitor**, **primeira obra concluída por um leitor**. Este último é o mais significativo de todos e merece a maior cerimônia — é a prova de que alguém atravessou a obra inteira.
- `RN-09.12e` O autor declara, no cadastro da obra, uma **meta de extensão** (palavras) que serve de régua para os marcos de rascunho. Ela é editável a qualquer momento, sem custo e sem atrito: obra muda de tamanho enquanto é escrita, e o sistema não pode punir isso.
- `RN-09.12f` Marcos de manuscrito concedem moedas e semente (`RN-04.40`), na mesma lógica dos marcos de leitura (`RN-04.13`).
- `RN-09.12g` **Combate ao bloqueio criativo** (rascunho L110): quando o autor passa `DIAS_SEM_ESCREVER` (5 dias, a validar) sem produzir, o app oferece — uma única vez, sem insistir — um **sprint de aquecimento** de 5 minutos com meta reduzida e o texto de partida do último trecho escrito. O tom segue as proibições de `RN-06.19` e `RN-06.20`: nada de cobrança, nada de menção ao que ele deixou de fazer.

### 5.3 Analytics de audiência

O rascunho posiciona o analytics avançado como recurso de plano Premium do autor (L130). O gating está em `10`; as regras de dados estão aqui.

- `RN-09.14` **Privacidade dos leitores é inegociável.** Nenhuma métrica exibida ao autor identifica um leitor individual. Todo agregado exige mínimo de `K_ANONIMATO` = 5 leitores distintos (a validar) para ser exibido; abaixo disso, o painel mostra "dados insuficientes", nunca um número parcial.
- `RN-09.15` **Mapa de Evasão** (L131): percentual de leitores que iniciaram a obra e pararam de avançar, por capítulo e por posição dentro do capítulo. Um leitor conta como evadido quando não avança por 30 dias (a validar) e não marcou a obra como concluída.
- `RN-09.16` O mapa de evasão distingue **abandono** (sem avanço por 30 dias) de **pausa** (leitor com sessões recentes em outras obras) e de **conclusão**. Tratar tudo como abandono produziria diagnóstico falso.
- `RN-09.17` **Frases mais grifadas** (L132): agregado de destaques por trecho, considerando somente destaques que o leitor tornou públicos (`RN-02.22`) e respeitando o k-anonimato.
- `RN-09.18` **Páginas mais curtidas**: agregado de reações positivas por trecho, quando a funcionalidade de reagir a trechos existir (ver `Q-09.4`).
- `RN-09.19` **Momentos que geraram gorjetas** (L132): agregado das gorjetas por capítulo e posição, usando o contexto registrado em `RN-07.15`. Valores individuais e identidade dos doadores não são exibidos; o autor vê o trecho, a quantidade de gorjetas e o total recebido naquele ponto.
- `RN-09.20` Métricas adicionais do painel: leitores únicos, sessões, tempo total lido, ritmo médio de conclusão, taxa de conclusão, distribuição de Leitura Consciente na obra, origem do leitor (feed, catálogo, busca, destaque de vitrine, link externo).
- `RN-09.21` Todo dado do painel é atualizado ao menos uma vez por dia. Números em tempo real não são prometidos.
- `RN-09.22` O leitor pode desativar, nas configurações de privacidade, a contribuição dos seus dados para os agregados de autor, exceto os que são intrínsecos à transação (a compra em si e o fato da gorjeta).

### 5.3b IA de audiência — o "editor de audiência"

A IA do produto tem dois lados, e é do lado do autor que ela vale dinheiro. Enquanto resumir capítulo para o leitor é commodity que qualquer assistente faz com um arquivo anexado, ler o **comportamento real de leitura** é algo que só o BookWorm consegue: nem a Amazon entrega isso ao autor.

- `RN-09.20a` A **IA de audiência** analisa os agregados de `RN-09.15` a `RN-09.20` e devolve diagnóstico em linguagem natural. Exemplos do que ela responde:
  - *"A evasão no capítulo 7 concentra-se nas primeiras 400 palavras. Nos seus outros capítulos, a cena de ação começa antes."*
  - *"Os trechos mais grifados da sua obra são diálogos. Sua sinopse vende descrição."*
  - *"Leitores que passam do capítulo 3 terminam em 89% dos casos. Seu problema de retenção está inteiro nos três primeiros capítulos."*
- `RN-09.20b` A IA opera **exclusivamente sobre estatística agregada**, nunca sobre o texto integral da obra nem sobre dado de leitor individual. São centenas de tokens por análise, não centenas de milhares — o que torna o custo irrisório e a margem viável, ao contrário da IA de leitor (`11`).
- `RN-09.20c` O k-anonimato de `RN-09.14` vale integralmente: se o agregado não pode ser exibido, ele também não é enviado ao modelo.
- `RN-09.20d` Toda resposta é identificada como gerada por IA, indica sobre quais dados se baseia e pode ser reportada como incorreta (mesmas garantias de `RN-11.20` a `RN-11.22`).
- `RN-09.20e` A IA de audiência **não reescreve a obra do autor** nem sugere texto pronto. Ela diagnostica comportamento de leitura; a decisão criativa é do autor. Essa fronteira é deliberada: um produto que escreve pelo autor deixa de ser plataforma de escritores.
- `RN-09.20f` Recurso do plano Autor Pro (`RN-10` §5.1).

### 5.3c ARC e leitores beta

A maior necessidade não atendida do mercado autopublicado. O autor precisa de leitores antes de publicar e de resenhas no dia do lançamento; hoje isso é feito com planilhas e grupos de rede social. O BookWorm tem o que falta aos serviços existentes: uma base de leitores com **histórico de leitura verificado**.

- `RN-09.30` O autor cria uma **campanha de ARC** (cópia antecipada) definindo: obra, número de vagas, prazo de leitura e critérios de perfil — gênero habitual, taxa de conclusão, histórico de resenhas.
- `RN-09.31` A plataforma seleciona candidatos por **afinidade real de leitura**, usando os agregados de `03`, e não por declaração do usuário. É esse dado que nenhum serviço externo consegue replicar.
- `RN-09.32` **As propostas de ARC chegam ao leitor pelo feed** (`05`), no mesmo formato das pílulas, com o convite explícito e o prazo. É a superfície onde o leitor já está e onde a decisão de ler é tomada — e faz o feed servir ao autor sem virar anúncio.
- `RN-09.33` A proposta é sempre **opcional e recusável sem consequência**. Recusar não afeta ofensiva, recomendações futuras nem elegibilidade para outras campanhas.
- `RN-09.34` O leitor que aceita recebe a obra gratuitamente por prazo determinado e vê claramente o que se espera dele. **Resenha nunca é obrigatória e nunca é condicionada a ser positiva** — exigir avaliação favorável em troca de cópia gratuita é manipulação de prova social, e está vedado.
- `RN-09.35` O autor acompanha a campanha com os mesmos instrumentos de `03` e `RN-09.15`: quantos começaram, onde pararam, quantos concluíram. É feedback pré-lançamento que hoje não existe para autor independente.
- `RN-09.36` Resenha originada de ARC é **rotulada como tal** na página da obra. Transparência com o leitor final é inegociável.
- `RN-09.37` Recurso do plano Autor Pro (`RN-10` §5.1).

### 5.3d Ferramentas de lançamento

- `RN-09.38` O lançamento concentra o esforço e o gasto do autor. A plataforma oferece: **pré-venda** com data de liberação, **lista de espera** para seguidores, contagem regressiva na página da obra e notificação aos seguidores no dia (respeitando o teto de `RN-01.17`).
- `RN-09.39` Obra em pré-venda exibe a amostra normalmente (`RN-02.2`) e o leitor que reserva recebe a obra automaticamente na liberação.
- `RN-09.40` Recurso do plano Autor Plus (`RN-10` §5.1).

### 5.3e Apoio recorrente ao autor — fase futura

- `RN-09.41` **Marcado como fase 2, após a gorjeta amadurecer.** A evolução natural da gorjeta é a assinatura de um autor específico: valor mensal em troca de recompensas definidas por ele (capítulos antecipados, bastidores, acesso a comunidade).
- `RN-09.42` A precondição para avaliar é ter dado de gorjeta suficiente: se poucos leitores dão gorjeta pontual, ninguém assinará um autor recorrentemente. A decisão deve ser tomada com números, não com hipótese.
- `RN-09.43` Quando entrar, segue as mesmas regras de gorjeta: pagamento em dinheiro, comissão da plataforma menor que a de venda, roteamento preferencial web + Pix, e o autor sempre sabendo quanto recebe.

### 5.4 Receita, saque e destaque

- `RN-09.23` A receita do autor vem de: venda de obras (menos o take rate de 25% na web ou 30% no app, `RN-10.6`) e gorjetas em dinheiro (menos 10%, `RN-10.8`). Apoio recorrente entra na fase 2 (`RN-09.41`).
- `RN-09.24` O autor tem **um único saldo**: Crédito de Autor, sempre sacável (`RN-07.16`). O extrato discrimina a origem de cada entrada — venda ou gorjeta — e, no caso da gorjeta, mostra a mensagem que o leitor escreveu (`RN-07.15a`).
- `RN-09.25` O saque exige cadastro completo: identificação fiscal, dados bancários e verificação de identidade (KYC). Esses dados são pedidos apenas no primeiro saque, nunca na ativação do papel de autor (`RN-01.2`).
- `RN-09.26` Valor mínimo de saque (a validar) e prazo de processamento declarados antes da solicitação. O extrato do autor mostra bruto, comissão, impostos retidos quando aplicável e líquido.
- `RN-09.27` Há período de retenção antes de o valor de uma venda ficar disponível para saque (a validar), cobrindo janela de contestação e estorno de pagamento.
- `RN-09.28` O **destaque de vitrine** é pago com Crédito de Autor ou dinheiro. Sementes não compram destaque — elas são do leitor, não do autor (`RN-07.1a`). Tabela de preços e posições em `10`. Todo destaque é rotulado como patrocinado onde aparece (`RN-05.13`).
- `RN-09.29` A plataforma não garante resultado de vendas por destaque de vitrine, e a comunicação de venda do produto não pode sugerir garantia.

---

## 6. Critérios de aceitação

**`AUT-01` + `RN-09.2` — Publicação com revisão**
```
Dado que submeto uma obra completa com todos os campos obrigatórios
Quando concluo o envio
Então a obra entra em estado "em revisão" e não aparece no catálogo
E sou notificado quando a revisão termina
E se for reprovada recebo o motivo objetivo e a possibilidade de corrigir e reenviar
```

**`AUT-03` + `RN-09.6` — Despublicação preserva leitores**
```
Dado que minha obra foi adquirida por 200 leitores
Quando a despublico
Então a página pública deixa de existir para novos leitores
E os 200 leitores mantêm acesso integral à obra na biblioteca
E vejo esse aviso antes de confirmar a despublicação
```

**`RN-09.5` — Edição preserva posição**
```
Dado que publiquei uma nova versão da obra sem reestruturar capítulos
Quando um leitor que estava em 40% abre a obra
Então ele retoma exatamente na mesma posição
E quando a edição reestrutura capítulos
Então ele é levado ao início do capítulo em que estava, com aviso da atualização
```

**`AUT-05` + `RN-09.13` — Sprint não perde texto**
```
Dado que estou em um sprint de 15 minutos e o app é encerrado abruptamente
Quando reabro o editor
Então todo o texto produzido até o encerramento está preservado
E o sprint aparece no histórico com a duração efetivamente cumprida
```

**`AUT-06` + `RN-09.12` — Recorde pessoal, sem ranking**
```
Dado que concluí um sprint com PPM acima do meu recorde anterior
Quando o sprint encerra
Então vejo meu novo recorde pessoal destacado
E em nenhuma tela existe comparação do meu PPM com o de outros autores
```

**`AUT-07` + `RN-09.14` — K-anonimato no mapa de evasão**
```
Dado que minha obra tem 3 leitores no total
Quando abro o mapa de evasão
Então vejo "dados insuficientes" em vez de percentuais
E ao atingir 5 leitores distintos os agregados passam a ser exibidos
```

**`RN-09.16` — Abandono distinto de pausa**
```
Dado que um leitor parou na página 80 há 45 dias e não leu mais nada no app
E outro parou na página 80 há 45 dias mas segue lendo outras obras
Quando abro o mapa de evasão
Então o primeiro é classificado como pausa geral e o segundo como abandono da obra
E as duas categorias são exibidas separadamente
```

**`AUT-09` + `RN-09.19` — Gorjetas sem identificar doador**
```
Dado que recebi 12 gorjetas no capítulo 7
Quando abro o mapa de engajamento
Então vejo o trecho, a quantidade de gorjetas e o total recebido naquele ponto
E não vejo o nome nem o valor individual de nenhum doador
```

**`AUT-11` + `RN-09.25` — KYC apenas no saque**
```
Dado que ativei o papel de autor e publiquei uma obra sem informar dados bancários
Quando solicito meu primeiro saque
Então o app pede identificação fiscal, dados bancários e verificação de identidade
E até a conclusão dessa verificação o saldo permanece disponível, apenas não sacável
```

**`RN-09.24` — Saldo único e origem visível**
```
Dado que recebi R$ 300 em vendas e R$ 150 em gorjetas
Quando abro minha carteira de autor
Então vejo um único saldo de Crédito de Autor de R$ 450
E o extrato discrimina cada entrada por origem
E as entradas de gorjeta mostram a mensagem que o leitor escreveu
E todo o saldo é elegível para saque, respeitado o período de retenção
```

---

## 7. Telas e estados

| Tela | Conteúdo | Estados |
|---|---|---|
| **Painel do autor** | Resumo de leitores, vendas, receita, ofensiva de escrita, obras e atalhos | Vazio (sem obra publicada: guia de primeira publicação), Carregando, Erro |
| **Minhas obras** | Lista por status (rascunho, em revisão, publicada, despublicada), limite do plano visível | Vazio, Bloqueado por plano (limite atingido) |
| **Editor de obra (metadados)** | Título, sinopse, gêneros, capa, preço, faixa de amostra, permissões de citação e IA | Erro de validação, Carregando (upload de EPUB) |
| **Editor de texto / Sprint** | Área de escrita imersiva, cronômetro, contador de palavras, PPM ao final | Sprint em andamento, Sprint concluído, Recuperação de rascunho após queda |
| **Quests de escrita** | Meta diária, progresso, ofensiva de escrita, histórico | Vazio |
| **Histórico de sprints** | Lista com duração, palavras, PPM, recorde destacado | Vazio (explica como fazer o primeiro) |
| **Marcos da obra** | Linha do tempo do manuscrito: rascunho, publicação e audiência, com o que já veio e o que vem | Vazio (obra recém-criada) |
| **Analytics — visão geral** | Leitores, sessões, tempo lido, conclusão, origem do leitor | Bloqueado por plano, Vazio (dados insuficientes), Carregando |
| **Analytics — mapa de evasão** | Curva de retenção por capítulo e posição, com marcação de abandono e pausa | Vazio (k-anonimato não atingido) |
| **Analytics — engajamento** | Frases mais grifadas, trechos com gorjetas, reações | Vazio (k-anonimato não atingido) |
| **Carteira do autor** | Crédito de Autor, extrato por origem com as mensagens das gorjetas, saque, destaque | Bloqueado (sem KYC para saque), Erro |
| **IA de audiência** | Diagnóstico em linguagem natural sobre evasão, engajamento e retenção, com os dados de origem | Bloqueado por plano, Vazio (k-anonimato não atingido), Gerando |
| **Campanhas de ARC** | Criar campanha, vagas, prazo, critérios de perfil, acompanhamento de quem leu e onde parou | Vazio, Bloqueado por plano |
| **Lançamento** | Pré-venda, lista de espera, contagem regressiva, notificação aos seguidores | Bloqueado por plano |
| **Solicitar saque** | Valor, dados bancários, bruto/comissão/impostos/líquido, prazo | Bloqueado (abaixo do mínimo, dentro do período de retenção) |
| **Comprar destaque de vitrine** | Posições disponíveis, período, preço, forma de pagamento | Bloqueado por saldo, Vazio (sem inventário disponível) |

**Offline:** escrever e rodar sprints funciona integralmente offline, com sincronização posterior — é o caso de uso mais provável de um autor em trânsito. Publicar, ver analytics e sacar exigem conexão.

---

## 8. Dados

| Entidade | Campos principais | Propósito |
|---|---|---|
| `PerfilAutor` | usuario_id, nome_publico, bio_estendida, links, plano, obras_ativas, criado_em | Identidade pública do criador |
| `DadosFiscaisAutor` | autor_id, documento, tipo_pessoa, endereco, dados_bancarios, kyc_status, verificado_em | Exigido apenas no primeiro saque |
| `VersaoObra` | id, obra_id, versao, arquivo_url, notas_versao, publicada_em, invalida_locators | Histórico e atualização de leitores |
| `SprintEscrita` | id, autor_id, obra_id, duracao_planejada_s, duracao_real_s, palavras_produzidas, ppm, interrupcoes, iniciado_em, concluido_em | Gamificação da escrita e recordes |
| `QuestEscrita` | id, autor_id, unidade, valor, data, realizado, cumprida | Meta diária; alimenta a ofensiva de escrita |
| `RecordeEscrita` | autor_id, tipo (ppm, palavras_sessao, maior_sprint), valor, alcancado_em | Auto-competição |
| `MarcoManuscrito` | id, autor_id, obra_id, tipo (mil_palavras, primeiro_capitulo, metade, rascunho_concluido, publicada, primeiro_leitor, primeira_resenha, primeira_gorjeta, decimo_leitor, centesimo_leitor, primeira_conclusao), alcancado_em, recompensa_moedas, semente_id | Progressão da obra (`RN-09.12c`) |
| `AgregadoObraDia` | obra_id, data, leitores_unicos, sessoes, tempo_ativo_s, paginas_lidas, aquisicoes, gorjetas_valor, conclusoes | Base do painel |
| `EvasaoObra` | obra_id, capitulo_id, faixa_posicao, leitores_alcancaram, leitores_pararam, classificacao (abandono, pausa, conclusao), atualizado_em | Mapa de evasão |
| `EngajamentoTrecho` | obra_id, locator_inicio, locator_fim, destaques_publicos, reacoes, gorjetas_qtd, gorjetas_valor | Frases grifadas e momentos de impacto |
| `SolicitacaoSaque` | id, autor_id, valor_bruto, comissao, impostos, valor_liquido, status, solicitado_em, processado_em | Fluxo financeiro |
| `DestaqueVitrine` | id, autor_id, obra_id, posicao, periodo_inicio, periodo_fim, valor_pago, forma_pagamento, impressoes, conversoes | Publicidade interna |
| `CampanhaARC` | id, autor_id, obra_id, vagas, prazo_dias, criterios_perfil, status, criada_em | Distribuição antecipada (`RN-09.30`) |
| `ParticipacaoARC` | campanha_id, leitor_id, convidado_em, aceito_em, recusado_em, progresso, concluiu, resenhou | Acompanhamento da campanha |
| `Lancamento` | obra_id, pre_venda_inicio, liberacao_em, lista_espera_qtd, notificado_em | Ferramentas de lançamento (`RN-09.38`) |
| `AnaliseIAAudiencia` | id, autor_id, obra_id, pergunta, resposta, dados_origem[], gerada_em, avaliacao | IA de audiência (`RN-09.20a`) |

---

## 9. API (alto nível)

| Operação | Descrição |
|---|---|
| Criar / editar obra | Metadados, capa, preço, amostra, permissões |
| Enviar conteúdo | Upload de EPUB com validação de formato |
| Submeter para revisão | Envia à fila de moderação |
| Publicar / despublicar | Respeita limite do plano e preserva leitores existentes |
| Listar minhas obras | Com status, limite do plano e alertas |
| Iniciar / encerrar sprint | Cronômetro, contagem de palavras e PPM |
| Salvar rascunho | Gravação contínua e tolerante a falha |
| Definir quest de escrita | Meta diária do eixo de escrita |
| Obter histórico e recordes | Sprints, quests e recordes pessoais |
| Listar marcos de manuscrito | Alcançados e próximos, por obra |
| Definir meta de extensão da obra | Régua dos marcos de rascunho (`RN-09.12e`) |
| Obter analytics da obra | Visão geral, evasão e engajamento, com k-anonimato aplicado |
| Obter carteira do autor | Créditos, extrato e elegibilidade de saque |
| Enviar dados fiscais / KYC | Necessário no primeiro saque |
| Solicitar saque | Cria solicitação e devolve prazo |
| Listar inventário de destaque | Posições e períodos disponíveis |
| Comprar destaque | Débito na forma de pagamento escolhida |
| Gerar análise de audiência | Diagnóstico por IA sobre os agregados da obra, com k-anonimato aplicado |
| Criar / gerenciar campanha de ARC | Vagas, prazo, critérios e acompanhamento |
| Convidar leitores para ARC | Seleção por afinidade real; convites entregues no feed (`RN-09.32`) |
| Aceitar / recusar convite de ARC | Ação do leitor, sem consequência em caso de recusa |
| Configurar lançamento | Pré-venda, lista de espera e notificação |

---

## 10. Métricas de sucesso

- Percentual de autores que publicam ao menos uma obra após ativar o papel.
- Percentual de autores com ofensiva de escrita ativa (mede se as ferramentas de criação funcionam).
- Percentual de rascunhos iniciados que chegam a *rascunho concluído* — o funil real do escritor.
- Aceitação do sprint de aquecimento após 5 dias parado (`RN-09.12g`).
- Autores com receita positiva no mês e receita mediana por autor ativo.
- Uso do analytics: percentual de autores pagantes que abrem o painel semanalmente.
- Percentual de análises de IA de audiência avaliadas como úteis pelo autor — é a métrica que valida o produto de maior margem.
- Taxa de aceite de convites de ARC no feed e percentual de participantes que concluem a obra.
- Conversão do plano gratuito para o pago motivada pelo limite de obras (`RN-10.3`).
- Tempo entre submissão e conclusão da revisão (alvo ≤ 48h).
- Taxa de reprovação por plágio ou duplicidade.

---

## 11. Questões em aberto

| ID | Questão |
|---|---|
| `Q-09.1` | **Bloqueante.** Quem é o responsável fiscal pelo repasse: a plataforma como intermediadora de pagamento, ou o autor como vendedor? Define arquitetura de pagamentos, obrigações acessórias e emissão de notas. |
| `Q-09.2` | Haverá editor de texto completo dentro da plataforma, ou apenas importação de EPUB/DOCX? Um editor próprio é um produto inteiro por si só; a importação limita a experiência de sprint. |
| `Q-09.3` | ✅ **Resolvida** por [`13-moderacao-e-curadoria.md`](13-moderacao-e-curadoria.md): confiança progressiva (`RN-13.12`) com filtro automático antes de toda fila humana (`RN-13.11`). Resta o critério objetivo de subida de nível, agora em `Q-13.7`. |
| `Q-09.4` | Existirá reação a trechos ("curtir uma página", citado em L132)? A métrica é pedida no rascunho, mas a funcionalidade correspondente do lado do leitor nunca foi descrita. **Sem ela, `RN-09.18` não tem insumo.** |
| `Q-09.5` | "Superar o PPM mantendo a qualidade" (L113) exige uma noção de qualidade que a plataforma não deveria arbitrar. A proposta de `RN-09.12b` (volume revisado em 7 dias) é aceitável? |
| `Q-09.6` | Quais os valores de mínimo de saque, período de retenção e prazo de processamento? Dependem do provedor de pagamentos escolhido. |
| `Q-09.9` | Quantas vagas de ARC por campanha e quantas campanhas simultâneas por autor? Sem limite, o feed vira mural de pedidos de resenha. |
| `Q-09.10` | `RN-09.1` exige EPUB 3 para publicação no catálogo, enquanto `RN-02.1a` passou a aceitar EPUB e PDF na importação pessoal (`02`). O catálogo do autor deve aceitar PDF também, ou o EPUB 3 permanece exclusivo para manter metadado e reflow controlados na obra vendida? |
| `Q-09.10` | O leitor de ARC recebe alguma contrapartida além da cópia gratuita (Sementes, selo de colaborador)? Recompensar pode enviesar a resenha; não recompensar pode reduzir a adesão. |
| `Q-09.7` | Autores poderão publicar obras seriadas (capítulo a capítulo)? Muda evasão, ofensiva de escrita e expectativa do leitor. Ligado a `Q-02.3`. |
| `Q-09.8` | O k-anonimato de 5 é suficiente para proteger leitores em obras de nicho com pouquíssimos leitores? Considerar limite maior. |
