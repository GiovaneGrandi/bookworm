# 01 — A economia de moedas: a ideia é boa?

**Resposta curta:** a moeda como *recompensa de progressão* é boa. A moeda como *meio de pagamento* é ruim. A spec fundiu as duas e criou os problemas de [`00-diagnostico.md`](00-diagnostico.md) §4.

---

## 1. O diagnóstico: cinco trabalhos numa moeda só

A BookCoin especificada em [`../specs/07-economia-moedas.md`](../specs/07-economia-moedas.md) acumula cinco funções:

| # | Função | Regra |
|---|---|---|
| 1 | Recompensar comportamento (ler, concluir, resenhar) | `RN-07` §5.2 |
| 2 | Comprar cosmético e boost | `RN-07` §5.4 |
| 3 | **Comprar livros** | `RN-02.5`, `RN-07.12` |
| 4 | **Enviar gorjeta ao autor** | `RN-07.15` |
| 5 | **Ser vendida por dinheiro real** | `RN-07.23` |

As funções 1 e 2 formam uma economia de jogo saudável e fechada. As funções 3, 4 e 5 abrem essa economia para o mundo real — e é aí que tudo quebra.

---

## 2. Os três problemas de abrir a moeda

### 2.1 Arbitragem: ganhar moeda vira ganhar livro

Se ler rende moeda (`RN-07` §5.2) e moeda compra livro (`RN-02.5`), então **ler rende livros de graça**. Só existem dois desfechos, e os dois são ruins:

- **Ganho generoso:** o leitor engajado nunca paga por livro nenhum. A plataforma destruiu a própria receita de marketplace e ainda deve o repasse ao autor (`RN-07.12` garante que o autor recebe igual). Cada livro "comprado" com moeda ganha é uma saída de caixa sem entrada.
- **Ganho restritivo:** juntar moeda para um livro leva meses, a moeda parece inútil, e a recompensa perde poder motivacional.

Não há calibragem que resolva. O problema é estrutural: **uma moeda que é distribuída de graça não pode comprar um bem que custa dinheiro real.**

### 2.2 Ancoragem: o câmbio destrói o valor percebido do cosmético

No instante em que a moeda compra livro, o jogador consegue calcular o câmbio. Se um livro de R$ 20 custa 2.000 moedas, então um tema de card de 800 moedas "custa R$ 8".

E aí ele não compara o tema com outros temas — compara com **quase meio livro**. Todo item cosmético passa a ser julgado contra conteúdo real, e perde. A precificação de cosmético só funciona quando a moeda **não tem câmbio conhecido** com nada externo.

### 2.3 Passivo sem lastro (`RN-07.16`)

Detalhado em [`00-diagnostico.md`](00-diagnostico.md) §4. Moeda ganha convertida em Crédito Sacável faz a plataforma pagar dinheiro real por moeda que ela imprimiu de graça. É o mais grave dos três, porque **piora conforme o produto dá certo**.

---

## 3. A proposta: duas moedas com fronteiras claras

O padrão consagrado de moeda mole / moeda dura, aplicado ao caso:

| | 🌱 **Semente** (moeda mole) | 💳 **Saldo** (moeda dura) |
|---|---|---|
| Como se obtém | **Só ganhando.** Ler, concluir, manter ofensiva, resenhar | **Só comprando** com dinheiro real |
| Pode ser comprada? | **Nunca** | Sim, é o produto de IAP |
| Compra cosmético e boost | ✅ | ✅ |
| Compra livro | ❌ | ✅ |
| Vira gorjeta ao autor | ❌ | ✅ |
| Vira dinheiro para o autor | ❌ | ✅ |
| Expira | Nunca (`RN-07.25`) | Nunca |

### O que isso resolve de uma vez

| Problema | Como some |
|---|---|
| Arbitragem (§2.1) | Semente não compra livro. O câmbio deixa de existir |
| Ancoragem (§2.2) | Sem câmbio, o cosmético é julgado pelo desejo, não pela conversão |
| Passivo sem lastro (§2.3) | Só Saldo — que é lastreado por uma venda — vira dinheiro |
| `Q-07.2` (a confusão entre Crédito Sacável e Promocional) | **Deixa de existir.** Não há mais duas origens dentro da mesma moeda: a origem *é* a moeda |
| `RN-07.2` e `RN-07.3` (rastrear origem de cada moeda no ledger) | **Some.** Duas carteiras separadas substituem o rastreamento de origem, que era a parte mais complexa do módulo `07` |

Essa última linha merece destaque: a proposta **simplifica** a spec. O rastreamento de origem por lançamento no ledger, os dois saldos visíveis, a regra de consumir primeiro a moeda ganha (`RN-07.3`) e os dois créditos do autor (`RN-07.16`) — tudo isso era encanamento para contornar um problema que não precisa existir.

### O que fica pior

Honestidade obriga: separar em duas moedas **reduz a receita de IAP**. Hoje, moeda comprada também compra cosmético, e o jogador impaciente pode comprar o item que não quis esperar para ganhar. Na proposta, cosmético é comprável com as duas — mantive isso de propósito, justamente para preservar esse caminho de conversão. É a única ponte entre as moedas, e ela vai só numa direção (dinheiro → cosmético, nunca cosmético → dinheiro).

---

## 4. A pergunta mais dura: precisa mesmo existir moeda comprável?

Antes de construir loja de pacotes, validação de recibo, conciliação com duas lojas de aplicativo e um ledger append-only (`RN-07.27` a `RN-07.31`), vale perguntar o que isso paga.

### Quando a moeda comprável se justifica

Só quando existe **catálogo de gastos volumoso e continuamente alimentado**. Em jogos que vivem disso, cosméticos novos entram toda semana. A spec prevê hoje: congelamento, alteração de meta, itens de jardim e temas de card (`RN-07` §5.4).

`Q-04.5` já pergunta quantos itens seriam necessários no lançamento para a customização parecer real. A resposta honesta, para uma economia de moeda comprável se sustentar, é: **dezenas no lançamento e um fluxo contínuo depois** — o que significa um custo permanente de produção de arte que precisa entrar no orçamento antes de a decisão ser tomada.

### A alternativa mais simples

**Só Semente. Nenhuma moeda comprável.**

- A moeda vira puro sistema de progressão, sem valor monetário, sem IAP, sem ledger financeiro, sem compliance de loja.
- Cosméticos são desbloqueados **jogando** ou incluídos na assinatura de leitor.
- Livros e gorjetas são pagos com **dinheiro, direto**, sem moeda no meio — o que é mais transparente para o leitor e melhor para o autor, porque elimina uma camada de conversão que sempre come valor.
- Elimina inteiramente `Q-07.1`, `Q-07.2`, `Q-07.6` e `Q-07.7`.

**Custo dessa alternativa:** perde-se a receita de venda de pacotes de moeda e o efeito de impulso do IAP. Em troca, o modelo fica dramaticamente mais simples e a assinatura de leitor ganha um motivo claro de existir (desbloquear a estética), que hoje ela não tem, porque a IA não se paga (`00` §5).

### Recomendação

**Semente sozinha no lançamento; Saldo depois, se e quando o catálogo de cosméticos justificar.**

O caminho inverso — lançar com moeda comprável e depois removê-la — é impossível sem quebrar a confiança de quem comprou. Começar simples preserva a opção; começar complexo a destrói.

---

## 5. O que fazer com a gorjeta

A gorjeta é a melhor ideia de monetização do rascunho e a que está pior implementada.

**Por que é boa:** apoio direto a criador tem tração comprovada, o momento de impacto emocional durante a leitura é um gatilho de conversão genuíno, e ela alinha o produto com o autor sem intermediação.

**O que muda na proposta:**

- Gorjeta é paga **em dinheiro** (ou em Saldo, que é dinheiro pré-pago), nunca em Semente. Isso resolve `RN-07.16` e o passivo sem lastro.
- O leitor vê exatamente quanto chega ao autor antes de confirmar — `RN-07.18` já exige isso e deve ser mantido.
- A comissão sobre gorjeta precisa ser **menor** que o take rate de venda. Gorjeta é dinheiro que não existiria sem o gesto; taxar pesado mata o comportamento. Sugestão: 10% (a validar), contra os 20–30% recomendados para venda em [`03-precificacao.md`](03-precificacao.md).
- **Roteamento importa mais aqui do que em qualquer outro lugar:** gorjeta via web com Pix (`P4`) entrega ao autor ~89% do valor; via IAP a 30% (`P2`), ~63%. A diferença é o que separa uma gorjeta que vale a pena de uma que constrange.

---

## 6. Resumo das mudanças propostas ao módulo `07`

| Regra atual | Proposta |
|---|---|
| `RN-07.1` — uma moeda | Duas: Semente (ganha) e Saldo (comprado) |
| `RN-07.2`, `RN-07.3` — origem rastreada por lançamento | Removidas. A separação de carteira substitui |
| `RN-07.12` — moeda compra livro com repasse ao autor | Só Saldo compra livro. Semente nunca |
| `RN-07.15`, `RN-07.16` — gorjeta em moeda, com dois créditos | Gorjeta em dinheiro ou Saldo. Um crédito só, sempre sacável |
| `RN-07.23` — pacotes de moeda via IAP | Adiado. Só quando o catálogo de cosméticos justificar |
| `RN-07.8` — teto diário de 150 moedas | Mantido para Semente. Sem os problemas de arbitragem, pode ser mais generoso |
| `Q-07.1`, `Q-07.2`, `Q-07.6`, `Q-07.7` | Resolvidas ou eliminadas |

Decisão em [`04-recomendacao.md`](04-recomendacao.md).
