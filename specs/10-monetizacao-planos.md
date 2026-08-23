# 10 — Monetização: Planos, Marketplace e Gating

## 1. Objetivo

Operar o modelo de receita. O rascunho propôs quatro pilares (L115–143): marketplace, moeda virtual, assinatura de autor e assinatura de leitor. Depois da modelagem de unit economics, três deles foram reformulados e a hierarquia entre eles ficou explícita.

**O cliente pagante prioritário é o autor.** O leitor sustenta a base — gratuito, com assinatura opcional de estética. O autor autopublicado é comprador de negócio: já gasta com revisão, capa, ferramentas e anúncios, e mede retorno. É dele que vem a receita que financia o crescimento do lado leitor.

O princípio que organiza tudo continua sendo: cada lado precisa enxergar valor claro no que paga (P5).

## 2. Escopo

**Dentro:** catálogo de planos e seus limites, gating de recursos, marketplace e take rate, fluxo de pagamento e assinatura, destaque de vitrine, políticas de reembolso e inadimplência.

**Fora:** moeda virtual e ledger → [`07-economia-moedas.md`](07-economia-moedas.md). Saque e KYC do autor → [`09-autores-e-analytics.md`](09-autores-e-analytics.md). Funcionalidades de IA que o plano de leitor desbloqueia → [`11-ia-premium-reader.md`](11-ia-premium-reader.md).

## 3. Personas

Leitor, Autor, Administração.

---

## 4. User stories

| ID | Story |
|---|---|
| `MON-01` | Como leitor, quero comprar uma obra de forma simples e segura. |
| `MON-02` | Como leitor, quero assinar para desbloquear temas, itens de jardim e a identidade visual do meu perfil. |
| `MON-03` | Como leitor, quero entender exatamente o que meu plano inclui antes de assinar. |
| `MON-04` | Como leitor, quero cancelar minha assinatura sem atrito. |
| `MON-05` | Como autor, quero começar de graça e pagar só quando meu catálogo crescer. |
| `MON-06` | Como autor, quero assinar um plano que me dê analytics avançado da minha audiência. |
| `MON-07` | Como autor, quero saber exatamente quanto recebo por cada venda. |
| `MON-08` | Como autor, quero comprar destaque de vitrine para ampliar meu alcance. |
| `MON-09` | Como usuário, quero saber o que acontece com o que eu já tinha se meu plano cair para o gratuito. |
| `MON-10` | Como autor, quero entender o que recebo em troca da comissão que a plataforma retém. |
| `MON-11` | Como escola, quero licenciar o produto para minhas turmas e acompanhar a leitura dos alunos. |

---

## 5. Regras de negócio

### 5.1 Planos

Cinco planos. Nomes e preços *(a validar)*; a estrutura vem do rascunho.

| Plano | Público | Inclui |
|---|---|---|
| **Leitor** (gratuito) | Leitor | Leitor aberto (EPUB/PDF próprio, domínio público, catálogo), sessões e métricas, ofensivas e jardim, estante e coleção, cards com temas gratuitos, Sementes, duplas e clubes, gorjetas |
| **BookWorm Plus** | Leitor | Tudo do gratuito + todos os temas de card, itens exclusivos de jardim, estatísticas históricas estendidas, sincronização avançada |
| **Autor** (gratuito) | Autor | Publicação até o limite de obras ativas, pílulas, quests e sprints, marcos de manuscrito, analytics básico (leitores, vendas, receita) |
| **Autor Plus** | Autor | Obras ativas ampliadas, analytics avançado (evasão, engajamento, gorjetas), ferramentas de lançamento, prioridade na fila de revisão |
| **Autor Pro** | Autor | Obras ilimitadas, IA de audiência (`RN-09.20a`), campanhas de ARC (`RN-09.30`), crédito mensal de destaque |

- `RN-10.1` Os planos de leitor e de autor são independentes e podem coexistir na mesma conta. Um leitor-autor pode assinar ambos, nenhum ou apenas um.
- `RN-10.2` Nenhum recurso do núcleo — ler, medir sessões, manter ofensiva, ganhar Sementes, colecionar, participar de duplas e clubes, compartilhar cards — é bloqueado por plano. O produto não vende o hábito; ele vende **estética** ao leitor e **ferramentas profissionais** ao autor.
- `RN-10.2a` **A assinatura de leitor é de estética e identidade, não de IA.** O eixo é cosmético: temas, itens de jardim, molduras, estatísticas estendidas. A razão é econômica e decisiva — cosmético tem **custo marginal zero** (produzido uma vez, servido a milhões), enquanto a IA tem custo por uso. Numa assinatura de preço fixo, essa diferença separa margem de 95% de margem negativa.
- `RN-10.2b` Recursos de IA para o leitor (`11`) permanecem no produto, mas deixam de ser o argumento de venda da assinatura. O posicionamento da IA como produto de receita fica no **lado autor** (`RN-09.20a`), onde ela opera sobre dado proprietário e agregado, com custo de centavos e sem concorrente capaz de replicá-la.
- `RN-10.3` **Tiered limits** (rascunho L133): o Autor Gratuito tem limite de obras **ativas** (`LIMITE_OBRAS_PLANO_FREE`, faixa de 1 a 3; valor exato em `Q-10.1`). Para publicar além do limite, é preciso fazer upgrade ou despublicar uma obra.
- `RN-10.4` **Downgrade nunca destrói o que já existe.** Ao cair para o plano gratuito com mais obras publicadas do que o limite, todas continuam publicadas e vendendo; apenas **novas** publicações ficam bloqueadas até o número voltar ao limite. Despublicar obra de um autor por falta de pagamento prejudicaria leitores que já compraram e a receita do próprio autor.
- `RN-10.5` Downgrade do BookWorm Plus: temas e itens liberados **pela assinatura** ficam indisponíveis ao fim do período pago; os comprados com Sementes ou desbloqueados por marco permanecem para sempre (`RN-04.28`, `RN-08.11`). Estatísticas históricas voltam ao período gratuito, sem apagar dado nenhum (`RN-10.18`). Recursos de IA cessam, e o histórico gerado por eles permanece acessível em modo leitura.

### 5.2 Marketplace — camada secundária

- `RN-10.5a` **O marketplace não é o motor de receita.** Ele existe para que o autor ganhe dinheiro e tenha motivo para trazer sua obra, mas a receita da plataforma vem principalmente das assinaturas de autor. Três razões: a comissão das lojas corrói a margem (`RN-10.7`), competir com a Amazon em transação de e-book é inviável, e o valor único do BookWorm está no sistema de hábito e no dado de comportamento, não na loja.
- `RN-10.5b` Vendem-se apenas obras de autores da plataforma (`RN-02.1c`). Não há revenda de catálogo de terceiros.

**Take rate e roteamento**

- `RN-10.6` A plataforma retém sobre cada venda direta de obra: **`TAKE_RATE_WEB` = 25%** em vendas na web e **`TAKE_RATE_APP` = 30%** em vendas dentro do aplicativo. A diferença cobre a comissão da loja (`RN-10.7`), que só incide no trilho in-app.
- `RN-10.6a` **Por que os 5% do rascunho não sobreviveram.** Numa obra de R$ 20 com repasse de 95%, a plataforma **perde dinheiro** em três dos quatro trilhos de pagamento: R$ 2,00 de prejuízo no app com lojas a 15%, R$ 5,00 a 30%, R$ 0,19 na web com cartão. Só sobrava lucro no web com Pix — R$ 0,80, antes de infraestrutura, suporte e moderação. Era um modelo que punia o próprio sucesso: quanto mais vendesse, mais perderia.
- `RN-10.6b` Aos 25%, o autor fica com **75%** — bem acima dos 10% a 15% de royalty de uma editora tradicional, comparável à Amazon KDP e ao Apple Books (que retêm 30%), e com muito mais dado e ferramenta em troca. **A comunicação disso importa tanto quanto o número:** o painel do autor mostra explicitamente o que ele recebe em troca da comissão.
- `RN-10.7` **O roteamento de pagamento é a maior alavanca de margem do modelo brasileiro.** Uma assinatura de R$ 14,90 rende à plataforma R$ 10,43 via compra in-app com loja a 30%, e R$ 14,75 via web com Pix — **41% a mais**. Nenhuma otimização de preço, funil ou retenção entrega tanto tão barato.
- `RN-10.7a` **O checkout web com Pix é o caminho principal** de assinatura, compra de obra e gorjeta. A compra in-app permanece disponível, porque conveniência converte e brigar com ela custa conversão — a decisão é sobre qual é o padrão, não sobre eliminar o outro.
- `RN-10.7b` Preços podem diferir por trilho quando as regras permitirem: repassar parte da economia do Pix ao usuário é legítimo e aumenta a adesão ao trilho barato.
- `RN-10.7c` A plataforma deve inscrever-se nos **programas de pequenas empresas** das duas lojas antes do lançamento — a diferença entre 15% e 30% de comissão é obtida com um cadastro.
- `RN-10.7d` ⚠️ As regras de *anti-steering* (poder ou não informar o usuário sobre pagamento fora do app) mudaram nos últimos anos e há disputa regulatória específica no Brasil. **Verificar o estado vigente das políticas de Apple e Google e das decisões regulatórias brasileiras antes de construir o funil.** Ver `Q-10.9`.
- `RN-10.8` Gorjetas: a plataforma retém `TAKE_RATE_GORJETA` = **10%** (a validar), deliberadamente menor que a comissão de venda. Gorjeta é dinheiro que não existiria sem o gesto do leitor; taxá-la pesado mata o comportamento. O leitor sempre vê quanto chega ao autor antes de confirmar (`RN-07.18`).
- `RN-10.9` Preços de obra são definidos pelo autor dentro de uma faixa permitida pela plataforma, com piso e teto (a validar), e são exibidos ao leitor em moeda local com impostos incluídos quando exigido por lei.
- `RN-10.10` A compra de obra é definitiva. Reembolso ocorre apenas nos casos previstos pelas lojas de aplicativos e pela legislação de consumo aplicável (no Brasil, o direito de arrependimento em 7 dias para compras a distância). Reembolso concedido estorna o repasse ao autor.
- `RN-10.11` Toda venda gera registro fiscal e extrato para o autor com bruto, comissão da plataforma, comissão de loja quando aplicável, impostos e líquido (`RN-09.26`).

### 5.3 Assinaturas

- `RN-10.12` Assinaturas são mensais e anuais, cobradas pelos mecanismos de assinatura das lojas em mobile e por pagamento próprio na web, quando houver.
- `RN-10.13` Período de teste gratuito para o Premium Reader (7 dias, a validar), uma vez por conta, com aviso claro antes da primeira cobrança.
- `RN-10.14` O cancelamento é sempre acessível a partir do app, em no máximo dois toques a partir das configurações, com link direto para o gerenciamento da loja quando a assinatura for gerida por ela. Nenhum fluxo de retenção com atrito artificial, nenhuma oferta que exija recusa repetida (`MON-04`).
- `RN-10.15` Falha de pagamento entra em período de carência (a validar) com aviso, mantendo o acesso. Após a carência, o plano cai para o gratuito conforme `RN-10.4` e `RN-10.5`.
- `RN-10.16` Mudança de plano dentro do mesmo ciclo respeita as regras de proporcionalidade da loja de aplicativos correspondente.

### 5.3b Licença institucional

Escolas, universidades e bibliotecas são o comprador de maior ticket do produto, com orçamento anual e ciclo de compra estabelecido. O valor educacional é direto: o professor hoje pergunta na sala quem leu e acredita na resposta.

- `RN-10.26` A **licença institucional** é vendida por instituição, com preço por aluno ativo ao ano (a validar), contrato anual e faturamento fora das lojas de aplicativos.
- `RN-10.27` A instituição ganha: turmas, obras atribuídas, acompanhamento **agregado** de leitura da turma e relatórios de progresso.
- `RN-10.28` **Vigilância de aluno é linha vermelha.** O painel do professor mostra o agregado da turma e o progresso individual **apenas** na obra atribuída pela instituição. Nunca expõe: leitura pessoal fora das obras atribuídas, tempo de uso do app, destaques privados, anotações ou qualquer métrica de desempenho comparativo entre alunos (P1, `RN-06.8`).
- `RN-10.29` O aluno é informado, de forma clara e no primeiro acesso, de exatamente o que a instituição vê e do que ela não vê. Sua conta pessoal e sua leitura própria permanecem privadas mesmo sob licença institucional.
- `RN-10.30` Encerrado o vínculo com a instituição, o aluno mantém a conta, a biblioteca própria, a estante e todo o histórico pessoal. A instituição perde o acesso ao acompanhamento no mesmo instante.

### 5.3c Modelos deliberadamente recusados

Registrados para que a decisão de não adotá-los seja consciente, e não esquecimento ou redescoberta futura.

- `RN-10.31` **Obra seriada com capítulo pago** (modelo Webnovel, Wattpad, Kindle Vella) está **recusada**. É o modelo dominante da ficção digital no mundo e provavelmente a maior alavanca de receita disponível — e ainda assim não entra: o micropagamento por capítulo, com o cliffhanger como gatilho de compra, é percebido pelo leitor como ganancioso, e cobra exatamente no momento de maior vulnerabilidade emocional dele. Isso contraria `RN-07.26` e `RN-10.19`, e corroeria a confiança que o produto passa o resto do tempo construindo.
- `RN-10.32` **Anúncios no feed** estão recusados: destruiriam a confiança no feed, que é o ativo de aquisição. O destaque de vitrine (§5.5) monetiza o mesmo espaço sem envenená-lo, e é sempre rotulado.
- `RN-10.33` **Venda de dado individual** está recusada, em qualquer forma. Agregados de mercado sob k-anonimato (`RN-09.14`) são o limite, e mesmo eles valem mais como peça de imprensa do que como produto vendido.
- `RN-10.34` **Leitura ilimitada por assinatura** (modelo Kindle Unlimited) está recusada nesta fase: exige catálogo que não existe e o repasse por página lida é o mecanismo que mais revolta autores no mercado atual.
- `RN-10.35` **Publicação paga (selo de vaidade)** está recusada: cobrar do autor iniciante para publicar é predatório e contraria P5, que atrela o sucesso da plataforma ao sucesso do autor.

### 5.4 Gating de recursos

- `RN-10.17` Recurso bloqueado por plano é sempre **visível e explicado**, nunca escondido (estado *Bloqueado por plano*, `glossario.md` §3). O usuário vê o que ganharia, com exemplo do próprio contexto sempre que possível — como na pré-visualização de temas (`RN-08.12`).
- `RN-10.18` Nenhum bloqueio pode causar perda de dado já produzido pelo usuário. Bloqueio limita a criação de conteúdo novo e o acesso a recursos, jamais apaga histórico.
- `RN-10.19` A oferta de upgrade nunca aparece em momento de frustração (quebra de ofensiva, sessão inválida, falha de pagamento). Vale a mesma proibição de padrão escuro de `RN-07.26`.
- `RN-10.20` Todo limite de plano é exibido antes de o usuário esbarrar nele: o autor vê "2 de 3 obras ativas" no painel, e não descobre o limite ao tentar publicar a quarta.

### 5.5 Destaque de vitrine

- `RN-10.21` Inventário de posições promovidas: topo do catálogo por gênero, prateleira "em destaque" da home e slots patrocinados no feed (`RN-05.13`, cota de 15%).
- `RN-10.22` Preço por posição e período, com inventário limitado por dia. Vendido por reserva, não por leilão nesta versão (a validar).
- `RN-10.23` Todo destaque é rotulado como patrocinado onde aparece, sem exceção e sem eufemismo.
- `RN-10.24` O destaque de vitrine não altera o ranqueamento orgânico do feed nem do catálogo — ele ocupa apenas o inventário reservado. Conteúdo patrocinado não pode consumir a cota de descoberta (`RN-05.14`).
- `RN-10.25` O autor vê impressões e conversões do destaque contratado. A plataforma não garante resultado (`RN-09.29`).

---

## 6. Critérios de aceitação

**`MON-05` + `RN-10.3` — Limite de obras**
```
Dado que sou Autor Gratuito com o limite de obras ativas atingido
Quando tento publicar mais uma obra
Então a publicação é bloqueada
E vejo as duas saídas: despublicar uma obra ou fazer upgrade
E meu painel já mostrava o consumo do limite antes desta tentativa
```

**`MON-09` + `RN-10.4` — Downgrade não despublica**
```
Dado que sou Autor Premium com 8 obras publicadas
Quando meu plano cai para o gratuito por falta de pagamento
Então as 8 obras continuam publicadas e disponíveis para compra
E continuo recebendo receita normalmente por elas
E fico impedido apenas de publicar novas obras até voltar ao limite
```

**`RN-10.5` — Downgrade do Premium Reader**
```
Dado que assino o Premium Reader e gerei 20 resumos de capítulo
Quando minha assinatura termina
Então não consigo gerar novos resumos
E os 20 resumos existentes continuam acessíveis para leitura
E os temas de card que comprei com moedas continuam disponíveis
```

**`MON-07` + `RN-10.6` + `MON-10` — Transparência do repasse**
```
Dado que sou autor e vendi uma obra
Quando abro o extrato dessa venda
Então vejo valor bruto, comissão da plataforma conforme o trilho (25% web, 30% app), impostos e valor líquido
E a soma das deduções corresponde exatamente à diferença entre bruto e líquido
```

**`MON-04` + `RN-10.14` — Cancelamento sem atrito**
```
Dado que tenho assinatura ativa
Quando acesso configurações
Então alcanço o cancelamento em no máximo dois toques
E nenhuma oferta de retenção exige mais de uma recusa
E vejo até que data meu acesso permanece ativo
```

**`RN-10.17` — Bloqueio explicado**
```
Dado que sou Leitor Gratuito e toco em "resumir capítulo"
Quando o recurso é bloqueado
Então vejo o que o recurso faz, com exemplo referente ao capítulo que estou lendo
E vejo o preço e o teste gratuito
E consigo fechar e continuar lendo sem qualquer obstrução
```

**`RN-10.19` — Sem oferta em momento ruim**
```
Dado que acabei de quebrar minha ofensiva
Quando abro o app
Então nenhuma oferta de upgrade ou de compra é exibida nesta sessão
```

**`RN-10.24` — Patrocinado não invade a descoberta**
```
Dado que rolo o feed com destaques patrocinados ativos
Quando analiso a composição
Então os patrocinados ocupam no máximo a cota de 15%
E a cota de 20% de descoberta permanece com autores orgânicos que eu nunca li
E todo item patrocinado está rotulado como tal
```

---

## 7. Telas e estados

| Tela | Conteúdo | Estados |
|---|---|---|
| **Planos (leitor)** | Comparativo gratuito × Premium Reader, preço mensal e anual, teste gratuito | Carregando (preços da loja), Erro, Assinante (mostra estado atual e renovação) |
| **Planos (autor)** | Comparativo gratuito × Premium, limite de obras, analytics incluído | Bloqueado (papel de autor inativo) |
| **Checkout de obra** | Preço, forma de pagamento, saldo de moedas como alternativa | Erro de pagamento, Offline (bloqueia com explicação) |
| **Assinatura ativa** | Plano, valor, próxima cobrança, cancelar, trocar de plano | Carência (falha de pagamento com aviso e prazo) |
| **Consumo do plano (autor)** | Obras ativas × limite, recursos incluídos | Bloqueado por plano |
| **Extrato de vendas (autor)** | Vendas com bruto, deduções e líquido, filtros por período e obra | Vazio, Carregando |
| **Comprar destaque de vitrine** | Posições, períodos, preços, inventário disponível, forma de pagamento | Vazio (sem inventário), Bloqueado por saldo |
| **Paywall contextual** | O que o recurso faz, exemplo no contexto atual, preço, teste, fechar | — |

**Offline:** compra, assinatura e checkout exigem conexão. O estado do plano é mantido em cache e respeitado offline, com validação na reconexão.

---

## 8. Dados

| Entidade | Campos principais | Propósito |
|---|---|---|
| `Plano` | chave, publico (leitor, autor), nome, preco_mensal, preco_anual, recursos[], limite_obras_ativas, ativo | Catálogo de planos |
| `Assinatura` | id, usuario_id, plano_chave, status (ativa, teste, carencia, cancelada, expirada), origem (ios, android, web), inicio, fim_periodo, renovacao_automatica, id_externo_loja | Estado de assinatura |
| `EventoAssinatura` | id, assinatura_id, tipo (criacao, renovacao, falha, cancelamento, reembolso, upgrade, downgrade), payload_loja, criado_em | Conciliação com as lojas |
| `Compra` | id, usuario_id, obra_id, valor, moeda_fiat, forma (dinheiro, moedas), take_rate_aplicado, comissao_loja, valor_repasse_autor, status, recibo_externo, criado_em | Transação de marketplace |
| `RepasseAutor` | id, autor_id, compra_id ou gorjeta_id, valor_bruto, deducoes{plataforma, loja, impostos}, valor_liquido, disponivel_em, status | Base do saque de `09` |
| `InventarioDestaque` | posicao, data, slots_totais, slots_vendidos, preco | Vitrine promovida |

---

## 9. API (alto nível)

| Operação | Descrição |
|---|---|
| Listar planos | Catálogo com preços localizados e recursos |
| Obter assinatura do usuário | Estado, período e origem |
| Iniciar assinatura | Cria intenção e devolve o produto da loja correspondente |
| Validar recibo de assinatura | Confirma com a loja e ativa o plano |
| Cancelar assinatura | Encerra a renovação automática ou direciona ao gerenciamento da loja |
| Comprar obra | Cobrança em dinheiro ou débito em moedas, com cálculo de repasse |
| Obter direitos do usuário | Recursos liberados pelo plano vigente (fonte única do gating) |
| Obter consumo do plano | Obras ativas × limite e demais contadores |
| Listar extrato de vendas | Vendas e repasses do autor |
| Listar inventário de destaque | Posições e disponibilidade |
| Comprar destaque | Reserva e cobrança |
| Webhook de loja | Recebe renovação, falha, reembolso e cancelamento |

---

## 10. Métricas de sucesso

- Conversão para Premium Reader e para Autor Premium; churn mensal de cada um.
- Receita por fonte: assinatura de autor (esperado o maior bloco), assinatura de leitor, marketplace, destaque de vitrine, licença institucional.
- **Percentual das transações que passam pelo trilho web + Pix** — mede a captura da margem de `RN-10.7`.
- Percentual da receita do autor efetivamente repassado (transparência do modelo).
- Percentual de autores gratuitos que esbarram no limite de obras (mede se o limite está bem calibrado).
- Conversão do teste gratuito em assinatura paga.
- Taxa de recuperação de pagamento durante a carência.
- Percentual de reembolsos sobre vendas.

---

## 11. Questões em aberto

| ID | Questão |
|---|---|
| `Q-10.1` | Qual o limite exato de obras ativas no plano gratuito de autor? O rascunho dá a faixa de 1 a 3 (L133). |
| `Q-10.2` | ✅ **Resolvida.** Take rate de 25% na web e 30% no app (`RN-10.6`), com roteamento preferencial para web + Pix (`RN-10.7`). A promessa de 95% ao autor foi substituída por 75%, que fecha a conta e ainda é superior ao mercado. |
| `Q-10.3` | Quais os preços dos cinco planos? A proposta em `analise-monetizacao/03-precificacao.md` §6 (Autor Plus R$ 39,90, Autor Pro R$ 89,90, BookWorm Plus R$ 14,90) precisa ser validada com Van Westendorp antes de ser fixada aqui. |
| `Q-10.4` | Qual a faixa de preço permitida para uma obra (piso e teto)? |
| `Q-10.5` | ✅ **Resolvida** por `RN-10.34`: leitura ilimitada está recusada nesta fase. |
| `Q-10.6` | Qual mercado e moeda no lançamento? Define impostos, meios de pagamento e obrigações de saque. |
| `Q-10.7` | O destaque de vitrine será vendido por reserva ou por leilão? Leilão maximiza receita, mas favorece autores estabelecidos e tensiona P5. |
| `Q-10.8` | Haverá programa de afiliados ou indicação (leitor traz leitor)? Interage com a economia de `07`. |
| `Q-10.9` | **Verificar antes de construir o funil:** qual o estado vigente das regras de anti-steering de Apple e Google, e das decisões regulatórias brasileiras sobre pagamento externo? `RN-10.7a` depende disso. |
| `Q-10.10` | Qual o preço por aluno/ano da licença institucional, e a venda é direta ou por distribuidor de tecnologia educacional? |
