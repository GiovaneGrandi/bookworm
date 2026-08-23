# 07 — Economia Interna, Moedas e Gorjetas

## 1. Objetivo

Operar a economia interna: o leitor ganha **Sementes** por comportamentos valiosos e as gasta em vantagens e estética, e apoia autores diretamente por meio de **gorjetas em dinheiro** (rascunho L100–106).

Este era o módulo de maior risco do produto. A separação entre uma moeda **só ganha** (Semente, sem valor monetário) e o **dinheiro real** (compras e gorjetas) elimina o risco estrutural: nada que a plataforma distribui de graça pode sair do sistema como dinheiro.

## 2. Escopo

**Dentro:** carteira e ledger, gatilhos de ganho, catálogo de gastos, tetos e antiabuso, gorjetas em dinheiro, e a fronteira entre a moeda ganha e o dinheiro real.

**Fora:** validação das sessões que geram recompensa → [`03-sessoes-e-metricas.md`](03-sessoes-e-metricas.md). Itens comprados (congelamento, jardim) → [`04-streaks-e-jardim.md`](04-streaks-e-jardim.md). Cobrança, planos, take rate e saque → [`10-monetizacao-planos.md`](10-monetizacao-planos.md) e [`09-autores-e-analytics.md`](09-autores-e-analytics.md).

## 3. Personas

Leitor, Autor, Administração.

---

## 4. User stories

| ID | Story |
|---|---|
| `ECO-01` | Como leitor, quero ganhar moedas por ler e me manter constante para sentir que meu esforço rende. |
| `ECO-02` | Como leitor, quero entender exatamente como ganho moedas para não me sentir manipulado. |
| `ECO-03` | Como leitor, quero um extrato completo do que ganhei e gastei. |
| `ECO-04` | Como leitor, quero gastar Sementes em congelamentos, itens de jardim e temas. |
| `ECO-05` | Como leitor, quero apoiar um autor com dinheiro no momento em que um trecho me impacta. |
| `ECO-06` | Como leitor, quero escrever junto da gorjeta o motivo dela, para o autor saber o que me tocou. |
| `ECO-07` | Como autor, quero receber gorjetas e entender de onde elas vieram. |
| `ECO-08` | Como autor, quero sacar meu ganho em dinheiro ou investi-lo em destaque na plataforma. |
| `ECO-09` | Como leitor, quero ganhar moedas por escrever resenhas que ajudem outras pessoas. |
| `ECO-10` | Como leitor, quero ser recompensado por descobrir autores novos. |
| `ECO-11` | Como usuário, quero que meu saldo esteja seguro e reconciliado, sem sumiços inexplicáveis. |

---

## 5. Regras de negócio

### 5.1 Estrutura da carteira

**No lançamento existe uma única moeda: a Semente.** Ela é ganha, nunca comprada, e não tem valor monetário. Essa decisão elimina de uma vez os três problemas que a moeda aberta criava — arbitragem, ancoragem e passivo sem lastro — e simplifica drasticamente o módulo.

- `RN-07.1` A moeda do produto chama-se **Semente** 🌱. É **exclusivamente ganha por comportamento** na plataforma. Não é comprável com dinheiro, não é transferível entre usuários, não tem cotação, não rende e **nunca sai do sistema**.
- `RN-07.1a` A Semente compra apenas **itens cosméticos e boosts**: congelamento de ofensiva (`RN-04.16`), itens de jardim (`RN-04.28`) e temas de card (`RN-08.10`). Ela **não compra obras** e **não vira gorjeta**.
- `RN-07.1b` **Por que a moeda não compra livros.** Se ler rende moeda e moeda compra livro, então ler rende livros de graça — e só há dois desfechos, ambos ruins: com ganho generoso, o leitor engajado nunca paga e a plataforma ainda deve o repasse ao autor; com ganho restritivo, a moeda parece inútil. Não existe calibragem que resolva, porque o problema é estrutural: **uma moeda distribuída de graça não pode comprar um bem que custa dinheiro real.**
- `RN-07.1c` **Por que a moeda não vira gorjeta.** Moeda ganha não tem receita por trás. Convertê-la em dinheiro para o autor faria a plataforma pagar valor real por moeda que ela mesma imprimiu — um passivo que **cresce conforme o produto engaja**. Gorjeta é sempre em dinheiro (§5.5).
- `RN-07.1d` Como a Semente não tem câmbio conhecido com nenhum bem externo, o preço de um item cosmético é julgado pelo desejo que ele desperta, e não comparado a "meio livro". É essa ausência de câmbio que faz a economia cosmética funcionar.
- `RN-07.2` **Moeda comprável (Saldo) é fase futura, não escopo de lançamento.** Ela só passa a fazer sentido quando houver catálogo de cosméticos volumoso e continuamente alimentado (`Q-04.5`). Enquanto isso não existir, uma moeda paga é complexidade de ledger, validação de recibo, conciliação com duas lojas e compliance — sem contrapartida.
- `RN-07.2a` Se e quando o Saldo entrar, ele será **carteira separada**, comprada com dinheiro, e as fronteiras já ficam definidas aqui: Saldo compra obra e cosmético; Semente compra apenas cosmético. Nenhum caminho converte Semente em Saldo, em dinheiro ou em crédito de autor — em nenhuma direção, em nenhuma circunstância.
- `RN-07.2b` A ordem importa: começar simples preserva a opção de adicionar o Saldo depois. Lançar com moeda paga e depois removê-la é impossível sem quebrar a confiança de quem comprou.
- `RN-07.3` A carteira tem um único saldo visível. Não há rastreamento de origem por lançamento, porque não há duas origens — a origem é a própria moeda.

### 5.2 Gatilhos de ganho

Valores propostos, todos *(a validar)* e configuráveis no servidor. Todo crédito exige sessão `valida` (`RN-03.23`) — sessões `curta` e `suspeita` contam para o hábito, mas não para a economia (`RN-04.10`).

| Gatilho | Origem no rascunho | Valor | Regra |
|---|---|---|---|
| Cumprir a meta diária de leitura | L104 ("manter o jardim ativo") | 10 | Uma vez por dia por eixo |
| Cumprir a meta diária de escrita | L104 | 10 | Uma vez por dia por eixo |
| Concluir um capítulo | L104 ("concluir capítulos") | 5 | Uma vez por capítulo por obra, por conta |
| Concluir uma obra | L104 ("concluir livros") | **proporcional ao tamanho** | Uma vez por obra, exige ≥ 90% de progresso. Ver `RN-07.4a` |
| Marco de ofensiva 7 / 30 / 100 / 365 | L104 | 25 / 100 / 300 / 1000 | Uma vez por marco por eixo |
| Resenha qualificada | L104 | 30 | Conforme `RN-02.25`, uma por obra |
| Ler autor estreante | L104 ("diversificar o consumo") | 15 | Primeira sessão válida em obra de autor que o usuário nunca leu e que atende ao critério de estreante (`Q-05.4`) |
| Anotações consistentes | L104 | 5 | Concedido por dia em que a sessão atingir Leitura Consciente ≥ 70, no máximo uma vez por dia |

- `RN-07.4` Marcos e conclusões são idempotentes: um capítulo relido, uma obra reiniciada ou um marco reconquistado após quebra **não** geram novo crédito. O ledger é a fonte de verdade dessa unicidade.
- `RN-07.4a` **A recompensa por concluir uma obra é proporcional ao seu tamanho**, calculada sobre as páginas canônicas (`RN-03.2`): `RECOMPENSA_CONCLUSAO_BASE` (25 moedas) + 0,15 moeda por página canônica, com teto de 400 moedas (todos a validar). Terminar uma novela de 80 páginas e terminar um romance de 900 não podem valer o mesmo — a conclusão é o feito mais significativo do produto e precisa refletir o esforço real.
- `RN-07.4b` Concluir uma obra concede também uma **semente** (`RN-04.40`) e a entrada permanente na Estante (`RN-02.22a`). A cerimônia de conclusão é o único momento em que o aplicativo pode legitimamente fazer barulho.
- `RN-07.5` O gatilho de autor estreante existe para sustentar a cota de descoberta do feed (`RN-05.14`). É creditado uma vez por autor, para sempre.
- `RN-07.6` Nenhum gatilho recompensa velocidade, volume bruto sem qualidade, ou interação social no feed (`RN-05.22`, P3).
- `RN-07.7` A tela de ganhos lista todos os gatilhos e seus valores de forma explícita e permanente (`ECO-02`). A economia não é caixa-preta: opacidade em economia de recompensa gera desconfiança e a percepção de manipulação.

### 5.3 Tetos e antiabuso

- `RN-07.8` Teto de `TETO_MOEDAS_DIARIO` (150, a validar) moedas ganhas por dia por conta, somando todos os gatilhos. Ao atingir o teto, o app informa e explica que os ganhos voltam na virada do dia — sem esconder o que foi bloqueado.
- `RN-07.9` Verificações antiabuso, todas no servidor: recompensa de conclusão exige histórico de sessões coerente com o tamanho da obra; resenha qualificada passa por detecção de texto duplicado, texto gerado em massa e volume anômalo por conta; o gatilho de autor estreante é bloqueado quando obras diferentes do mesmo autor tentam creditá-lo repetidamente.
- `RN-07.10` Crédito derivado de sessão posteriormente descartada ou invalidada (`RN-03.29`) é **estornado**. O estorno pode deixar o saldo negativo; nesse caso, o saldo é travado em zero e a dívida é quitada com ganhos futuros. Compras já realizadas nunca são revertidas.
- `RN-07.11` Contas com padrão consistente de fraude entram em revisão manual, com ganhos suspensos e saldo congelado. O usuário é notificado, com direito a contestação. Nenhuma suspensão é automática e definitiva.

### 5.4 Gastos

| Item | Custo proposto | Módulo |
|---|---|---|
| Congelamento de ofensiva | 200 | `04` |
| ~~Alterar meta base~~ | — | Deixou de custar moedas (`RN-04.5`): o atrito passou a ser de tempo |
| Item cosmético de jardim | 100 a 1.000 conforme raridade | `04` |
| Tema visual de card de compartilhamento | 300 a 800 | `08` |
| ~~Compra de obra~~ | — | Obra é paga em **dinheiro** (`RN-07.12`) |
| ~~Gorjeta ao autor~~ | — | Gorjeta é em **dinheiro** (§5.5) |
| Destaque de vitrine (somente autor) | conforme tabela de `10` | `10` |

- `RN-07.12` **Obras são pagas exclusivamente em dinheiro** (`RN-10.6`). Semente não compra obra (`RN-07.1a`). Isso protege a receita do autor e é mais transparente para o leitor, que vê o preço real sem uma camada de conversão no meio.
- `RN-07.13` Todo gasto tem confirmação explícita com o saldo resultante visível. Nenhuma compra em um toque, nenhuma compra por gesto acidental.
- `RN-07.14` Não há reembolso de moedas gastas em itens cosméticos e boosts, e isso é dito antes da confirmação. Erros evidentes de sistema são corrigidos pelo suporte por lançamento manual no ledger.

### 5.5 Gorjetas

A gorjeta é a melhor ideia de monetização do rascunho (L106) e agora tem o encanamento correto: **ela é sempre em dinheiro real, nunca em Semente**.

- `RN-07.15` O leitor envia uma gorjeta em **dinheiro**, a partir do leitor (`LEI-17`), escolhendo entre valores sugeridos ou um valor livre. A gorjeta registra o contexto — obra, capítulo e locator — que alimenta o analytics do autor (`RN-09.19`).
- `RN-07.15a` **Comentário junto da gorjeta.** O leitor pode escrever uma mensagem explicando o motivo, e é incentivado a isso: o texto é o que dá sentido ao gesto para os dois lados. Para o autor, saber *por que* aquele capítulo mereceu apoio vale mais que o valor recebido. Limite de 500 caracteres (a validar); a mensagem é privada entre leitor e autor, salvo se o autor pedir permissão para citá-la publicamente.
- `RN-07.15b` O autor pode responder a uma gorjeta com um agradecimento. A conversa se encerra aí — gorjeta não abre canal de mensagens permanente, para não criar obrigação de resposta nem expectativa de relacionamento contínuo.
- `RN-07.16` A gorjeta gera um **único tipo de crédito para o autor: Crédito de Autor, sempre sacável**, porque é lastreado por um pagamento real. Não existem mais dois créditos (sacável e promocional) — essa complexidade só existia para contornar a moeda ganha, que não participa mais.
- `RN-07.17` A comissão da plataforma sobre gorjeta é `TAKE_RATE_GORJETA` (10%, a validar), **menor que a de venda** (`RN-10.6`). Gorjeta é dinheiro que não existiria sem o gesto; taxá-la pesado mata o comportamento.
- `RN-07.18` O leitor **sempre vê quanto chega ao autor** antes de confirmar, com as deduções discriminadas. O roteamento importa mais aqui do que em qualquer outro lugar do produto: via web com Pix o autor recebe cerca de 89% do valor; via compra in-app, bem menos (`RN-10.7`).
- `RN-07.19` Gorjeta é irreversível após a confirmação, exceto em caso de fraude comprovada, e isso é dito no momento da confirmação.
- `RN-07.20` O autor não pode enviar gorjeta para si mesmo, nem de contas secundárias comprovadamente ligadas a ele (`RN-02.26`). Detecção de circularidade suspende o crédito e aciona revisão.
- `RN-07.21` Menores de 18 anos não enviam gorjetas (`RN-01.4`).
- `RN-07.22` A gorjeta nunca é sugerida em momento de frustração nem imediatamente após uma cobrança. O gatilho legítimo é o impacto emocional durante a leitura — o momento que o rascunho descreve.

### 5.6 Pacotes de moedas — fora do escopo de lançamento

- `RN-07.23` **Não há venda de pacotes de moeda no lançamento** (`RN-07.2`). O rascunho previa essa receita (L124); ela fica adiada até existir catálogo cosmético que a justifique.
- `RN-07.24` Quando entrar, os pacotes serão vendidos pelos mecanismos de compra in-app das lojas em iOS e Android, e por pagamento próprio na web.
- `RN-07.25` Semente **não expira**, em nenhuma hipótese. Não há perda de saldo por inatividade — isso contrariaria o princípio de acolher a retomada (P2).
- `RN-07.26` A loja nunca é exibida em resposta à quebra de ofensiva ou a qualquer momento de frustração. Vender alívio para ansiedade que o próprio produto criou é padrão escuro e está vedado (`RN-04.21`, `RN-10.19`).

### 5.7 Ledger e integridade

- `RN-07.27` Todo movimento de moeda é um lançamento **append-only** no ledger, com: usuário, tipo, valor, origem (ganha/comprada), saldo resultante, referência de contexto (sessão, obra, capítulo, item, gorjeta), horário e idempotency key.
- `RN-07.28` O saldo é **derivado** do ledger e reconciliado periodicamente. Divergência entre saldo materializado e soma do ledger é incidente de severidade alta: o ledger sempre vence.
- `RN-07.29` Correções nunca apagam lançamentos; geram lançamentos compensatórios com motivo e responsável registrados.
- `RN-07.30` O ledger é retido permanentemente (`RETENCAO_LEDGER`), inclusive após exclusão de conta, com os dados pessoais desvinculados e preservação do registro financeiro pelo prazo legal (`RN-01.18`).
- `RN-07.31` Toda operação de crédito e débito é idempotente por chave, para que retentativas de rede não dupliquem ganhos nem cobrem duas vezes.

---

## 6. Critérios de aceitação

**`RN-07.4a` — Conclusão proporcional ao tamanho**
```
Dado que concluí uma novela de 80 páginas canônicas e um romance de 900
Quando as recompensas são creditadas
Então a novela rende 37 moedas e o romance rende 160
E cada obra concede também uma semente e uma entrada permanente na Estante
```

**`RN-07.1a` + `RN-07.1b` — Semente não compra obra**
```
Dado que tenho 5.000 Sementes acumuladas
Quando abro a página de uma obra paga
Então a Semente não aparece como forma de pagamento
E o único caminho de compra é em dinheiro
E a loja de itens deixa claro o que a Semente compra: cosmético e boost
```

**`ECO-06` + `RN-07.15a` — Gorjeta com motivo**
```
Dado que um capítulo me emocionou e decido enviar uma gorjeta
Quando abro a tela de gorjeta
Então posso escrever uma mensagem explicando o motivo
E vejo, antes de confirmar, exatamente quanto chega ao autor
E sou avisado de que a operação é irreversível
```

**`RN-07.16` — Um único crédito, sempre sacável**
```
Dado que sou autor e recebo gorjetas e vendas
Quando abro minha carteira
Então vejo um único saldo de Crédito de Autor
E todo ele é elegível para saque, respeitado o período de retenção
E não existe nenhum saldo promocional ou de uso restrito
```

**`ECO-01` + `RN-07.4` — Crédito idempotente**
```
Dado que já concluí o capítulo 3 e recebi 5 moedas por ele
Quando releio o mesmo capítulo até o fim
Então nenhuma moeda adicional é creditada
E o extrato mostra apenas o crédito original
```

**`RN-07.8` — Teto diário transparente**
```
Dado que já ganhei 150 moedas hoje
Quando concluo mais um capítulo em sessão válida
Então nenhuma moeda é creditada
E o app informa que atingi o teto diário e quando ele reinicia
E o gatilho não é apagado do meu histórico do dia
```

**`RN-07.10` — Estorno de sessão invalidada**
```
Dado que ganhei 50 moedas ao concluir uma obra
Quando descarto manualmente as sessões que sustentavam essa conclusão
Então as 50 moedas são estornadas por lançamento compensatório
E se meu saldo ficar negativo ele é travado em zero
E meus ganhos futuros quitam a diferença antes de aumentar o saldo
```

**`RN-07.26` — Sem venda em momento de frustração**
```
Dado que acabei de quebrar minha ofensiva de 30 dias
Quando abro o app
Então nenhuma oferta de compra de moedas ou de congelamento é exibida
E a mensagem exibida é de acolhimento e retomada
```

**`ECO-11` + `RN-07.28` — Reconciliação**
```
Dado que ocorreu uma falha parcial durante um crédito
Quando a reconciliação periódica roda
Então o saldo é recalculado a partir do ledger
E qualquer divergência gera incidente e lançamento compensatório rastreável
E o usuário nunca fica com saldo menor do que o ledger comprova
```

---

## 7. Telas e estados

| Tela | Conteúdo | Estados |
|---|---|---|
| **Carteira** | Saldo de Sementes, atalhos para ganhar e gastar | Vazio (saldo zero, com "como ganhar"), Carregando, Erro |
| **Como ganhar moedas** | Lista completa de gatilhos e valores, teto diário, progresso do dia | — |
| **Extrato** | Lançamentos cronológicos com contexto, filtro por tipo e período | Vazio, Carregando (paginado) |
| **Loja de itens** | Congelamentos, cosméticos de jardim, temas de card, com custo e saldo | Bloqueado por saldo (mostra quanto falta e como ganhar) |
| **Enviar gorjeta** | Valores sugeridos, **campo de mensagem em destaque** (`RN-07.15a`), quanto chega ao autor, aviso de irreversibilidade | Bloqueado (menor de idade, autoria própria), Erro de pagamento, Offline (exige conexão) |
| **Carteira do autor** | Crédito de Autor, origem de cada entrada (venda ou gorjeta) com a mensagem do leitor, ações de saque e destaque | Vazio, Bloqueado (sem dados fiscais para saque — ver `09`) |
| **Teto atingido** | Aviso do teto diário com horário de reinício | — |

**Offline:** a carteira mostra o último saldo conhecido, marcado como provisório. Nenhum ganho é confirmado e nenhum gasto é permitido sem conexão — o ledger é sempre do servidor.

---

## 8. Dados

| Entidade | Campos principais | Propósito |
|---|---|---|
| `Carteira` | usuario_id, saldo_sementes, bloqueada, atualizada_em | Estado materializado, derivado do ledger |
| `LancamentoLedger` | id, usuario_id, tipo (credito, debito, estorno, compensacao), gatilho ou item, valor, saldo_apos, contexto{sessao_id, obra_id, capitulo_id, item_id}, idempotency_key, criado_em, autor_operacao | Verdade da economia de Sementes, append-only |
| `Gorjeta` | id, leitor_id, autor_id, obra_id, capitulo_id, locator, valor_dinheiro, moeda_fiat, mensagem, resposta_autor, comissao, valor_liquido_autor, trilho (web_pix, web_cartao, iap), criado_em | Apoio direto em dinheiro e insumo de analytics |
| `CarteiraAutor` | autor_id, credito_autor, atualizada_em | Saldo único e sempre sacável (`RN-07.16`) |
| `CatalogoGatilho` | chave, descricao, valor, teto_periodo, ativo | Configuração server-side da economia |
| `CatalogoItem` | chave, tipo, nome, custo_moedas, modulo, ativo | Configuração de gastos |

---

## 9. API (alto nível)

| Operação | Descrição |
|---|---|
| Obter carteira | Saldos e estado |
| Obter extrato | Lançamentos paginados com filtros |
| Listar gatilhos | Catálogo de ganhos e progresso do dia contra o teto |
| Creditar recompensa | Interno, idempotente, disparado pelos eventos de `03`, `04`, `02` |
| Listar itens | Catálogo de gastos com custos vigentes |
| Comprar item | Débito com confirmação, idempotente |
| Enviar gorjeta | Cobra o leitor em dinheiro, credita o autor descontada a comissão, registra a mensagem |
| Responder gorjeta | Agradecimento do autor ao leitor (`RN-07.15b`) |
| Listar gorjetas recebidas | Com contexto de obra, capítulo e locator |
| Obter carteira do autor | Crédito de Autor e extrato por origem |
| Lançamento administrativo | Correção manual com motivo e responsável |

---

## 10. Métricas de sucesso

- Moedas ganhas por usuário ativo por semana e sua distribuição (detecta economia inflacionária ou avara).
- Razão entre moedas ganhas e moedas gastas na base (acúmulo sem gasto significa catálogo de itens pobre demais).
- Percentual de usuários que atingem o teto diário (se for alto, o teto está apertado; se for zero, é inútil).
- Percentual de leitores que enviam ao menos uma gorjeta e valor mediano.
- Percentual de gorjetas acompanhadas de mensagem (`RN-07.15a`) — mede se o gesto é sobre o texto ou só sobre o dinheiro.
- Taxa de estorno por invalidação de sessão (indicador de saúde do antifraude).
- Divergências de reconciliação por milhão de lançamentos (alvo: zero).

---

## 11. Questões em aberto

| ID | Questão |
|---|---|
| `Q-07.1` | **Reformulada.** A pergunta original ("converter moeda de IAP em saque é permitido?") estava mal posta: é prática estabelecida e aceita — Twitch Bits, TikTok e YouTube Super Chat fazem exatamente isso, e as lojas permitem porque cobram a comissão delas na entrada. A pergunta correta é **a que custo**: quanto sobra para o autor depois da comissão da loja em cada trilho. Ver `RN-10.7`. Com a gorjeta agora em dinheiro e a moeda paga fora do escopo (`RN-07.2`), o risco estrutural desapareceu. |
| `Q-07.2` | ✅ **Resolvida.** A separação entre Crédito Sacável e Promocional deixou de existir: há um único Crédito de Autor, sempre sacável (`RN-07.16`). |
| `Q-07.3` | Toda a tabela de valores (ganhos e custos) é proposta. É necessária uma modelagem econômica: quantos dias de uso típico para comprar um congelamento? A resposta define se a moeda tem valor percebido. |
| `Q-07.4` | ✅ **Resolvida.** A moeda chama-se **Semente**, o que a conecta ao jardim (`04`) e evita a associação com criptomoeda. Falta validar o nome com usuários. |
| `Q-07.5` | A assinatura de leitor concede Sementes mensais, ou apenas os cosméticos diretamente (`RN-10` §5.1)? Conceder moeda dilui o valor do que é ganho jogando. |
| `Q-07.6` | ✅ **Resolvida.** A gorjeta é sempre em dinheiro (`RN-07.15`), com roteamento preferencial para web + Pix (`RN-10.7`). Resta confirmar as regras de anti-steering das lojas (`Q-10.9`). |
| `Q-07.7` | Qual o tratamento fiscal da gorjeta no Brasil — doação, remuneração por conteúdo ou intermediação de pagamento? Interage com `Q-09.1`. |
