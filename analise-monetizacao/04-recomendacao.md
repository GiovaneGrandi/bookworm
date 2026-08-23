# 04 — Recomendação e Folha de Decisão

---

## 1. Livro in-app ou só leitor/publicador?

A pergunta que você fez, respondida primeiro porque ela determina todo o resto.

**Recomendação: nem um nem outro na forma pura. O BookWorm deve ser um leitor aberto com publicação, e o comércio de obras é camada secundária, roteada para a web.**

### Por que não o marketplace como motor

1. **A aritmética não fecha** ([`00-diagnostico.md`](00-diagnostico.md) §3): perde-se dinheiro em três dos quatro trilhos de pagamento, e o take rate de equilíbrio in-app é de 15% a 30% — não 5%.
2. **A guerra é impossível.** Competir com a Amazon em transação de e-book, tendo menos catálogo, menos preço e nenhum hábito instalado, não tem final feliz.
3. **Depende de um bloqueio não resolvido.** `Q-02.1` está aberta desde a primeira spec: sem catálogo, não há o que vender, e sem o que vender, não há leitor.
4. **Não é onde está o valor do produto.** O que o BookWorm faz de único é o sistema de hábito e o dado de comportamento. A loja é commodity.

### Por que não "só leitor/publicador" puro

Sem nenhum comércio, o autor não tem como ganhar dinheiro, e sem isso ele não tem motivo para trazer sua obra nem para pagar assinatura. O comércio precisa existir — só não pode ser o motor.

### O desenho recomendado

**Leitor aberto:** o usuário pode ler **EPUB próprio** e **obras em domínio público**, além do catálogo da plataforma.

Isto é o mais próximo de uma bala de prata que esta análise encontrou:

| Problema | Como o leitor aberto resolve |
|---|---|
| `Q-02.1` — sem catálogo, o app nasce vazio | Some. O app tem valor no dia 1 com a biblioteca que o usuário já tem |
| Aquisição de leitor | Dispara: qualquer pessoa com e-books pode usar hoje |
| Aquisição de autor | Autor vai onde estão os leitores. Leitor primeiro, autor depois |
| Custo de conteúdo | Zero |
| Dependência da Amazon | Nenhuma — o produto é a experiência, não o acervo |

O comércio entra como **camada**: obras de autores da plataforma, vendidas preferencialmente na web com Pix, com take rate de 25%.

> Isto resolve `Q-02.1`, aberta desde `specs/02-biblioteca-e-leitor.md`. É a decisão mais importante do documento.

---

## 2. Modelo recomendado, em uma página

| Camada | O quê | Quando |
|---|---|---|
| **Base gratuita** | Leitor aberto (EPUB próprio + domínio público + catálogo), hábito completo, ofensiva, jardim, cards, coleção. Nenhum recurso do núcleo atrás de paywall (`RN-10.2`) | Lançamento |
| **Motor de receita** | Assinatura de autor em três tiers (`O-01`), ancorada no analytics de audiência (`O-02`) | Lançamento |
| **Diferencial defensável** | IA de audiência para o autor (`O-03`), substituindo a IA de leitor | Ano 1 |
| **Receita de volume** | BookWorm Plus para leitor: estética, coleção, identidade (`O-09`) | Ano 1 |
| **Camada transacional** | Venda de obras a 25%, roteada para web com Pix. Gorjeta a 10% | Ano 1 |
| **Expansão** | ARC e beta readers (`O-05`), distribuição paga (`O-04`), institucional (`O-15`) | Ano 2 |
| **Decisão estratégica em aberto** | Obra seriada com capítulo pago (`O-13`) — pode ser maior que todo o resto e muda o posicionamento | A decidir |

### Moeda

**Só Semente no lançamento** — moeda ganha, não comprável, sem valor monetário, que compra apenas cosmético e boost. Sem IAP de moeda, sem ledger financeiro, sem compliance de loja, sem `Q-07.1`, `Q-07.2`, `Q-07.6` e `Q-07.7`.

Saldo (moeda comprada) entra **só se** o catálogo de cosméticos justificar, ou se `O-13` for adotado — micropagamento por capítulo é o único caso em que a moeda comprável se paga sozinha.

---

## 3. Folha de decisão

Marque a coluna. Substitua `·` por `X`.

### Bloco 1 — Correções obrigatórias (o modelo atual não funciona sem elas)

| ID | Achado | Recomendação | RN afetada | Manter | Alterar | Debater |
|---|---|---|---|---|---|---|
| `MO-01` | ✅ **APLICADO** — Moeda ganha vira dinheiro real para o autor — passivo sem lastro | **Inverter:** só moeda comprada gera saque → **na spec:** `RN-07.1c`, `RN-07.16` — moeda ganha nunca vira dinheiro | `RN-07.16` | · | **X** | · |
| `MO-02` | ✅ **APLICADO** — Take rate de 5% perde dinheiro em 3 dos 4 trilhos | 25% web / 30% in-app → **na spec:** `RN-10.6` — 25% web / 30% app, decidido nesta revisão | `RN-10.6` | · | **X** | · |
| `MO-03` | 🗣️ **EM DEBATE** — Cota de 200 mensagens de IA custa ~5× a assinatura | Cortar para ~20/mês, ou remover o chat → **na spec:** `RN-11.25` **inalterada**; `Q-11.3` reescrita com os números | `RN-11.25` | · | · | **X** |
| `MO-04` | ✅ **APLICADO** — `Q-07.1` está mal formulada (afirmei risco de remoção das lojas) | Reescrever de "é permitido?" para "a que custo?" → **na spec:** `Q-07.1` reformulada de "é permitido?" para "a que custo?" | `Q-07.1` | · | **X** | · |

### Bloco 2 — Estrutura do modelo

| ID | Achado | Recomendação | RN afetada | Manter | Alterar | Debater |
|---|---|---|---|---|---|---|
| `MO-05` | ✅ **APLICADO** — A moeda faz cinco trabalhos conflitantes | Duas moedas, ou só Semente no lançamento → **na spec:** `RN-07.1`–`RN-07.3` — só Semente no lançamento | `RN-07.1`–`RN-07.3`, `RN-07.12`, `RN-07.23` | · | **X** | · |
| `MO-06` | ✅ **APLICADO** — Catálogo fechado bloqueia o produto (`Q-02.1`) | **Leitor aberto:** EPUB próprio + domínio público → **na spec:** `RN-02.1`–`RN-02.1e` — leitor aberto; `Q-02.1` resolvida | `RN-02.1`, `Q-02.1` | · | **X** | · |
| `MO-07` | ✅ **APLICADO** — Marketplace tratado como pilar | Rebaixar a camada secundária, roteada para web → **na spec:** `RN-10.5a`, `RN-10.5b` — marketplace secundário | `10` §5.2 | · | **X** | · |
| `MO-08` | ✅ **APLICADO** — IA de leitor é genérica e sem margem | Mover a IA para o lado autor (`O-03`) → **na spec:** `RN-09.20a`–`RN-09.20f`, `RN-10.2b` — IA no lado autor | `11`, `RN-10` | · | **X** | · |
| `MO-09` | ✅ **APLICADO** — Assinatura de leitor sem motivo claro de existir | Trocar o eixo de IA para estética e identidade (`O-09`) → **na spec:** `RN-10.2a` — assinatura de leitor é estética | `RN-10` §5.1 | · | **X** | · |
| `MO-10` | ✅ **APLICADO** — O modelo não declara quem é o cliente pagante | Assumir o autor como motor; leitor como base → **na spec:** `10` §1 e P5 revisto — autor é o cliente pagante | `10` inteiro | · | **X** | · |

### Bloco 3 — Oportunidades novas

| ID | Oportunidade | Recomendação | Esforço | Manter | Alterar | Debater |
|---|---|---|---|---|---|---|
| `MO-11` | ✅ **APLICADO** — ARC e leitores beta (`O-05`) | Adotar no ano 2. Necessidade real, desatendida, e só nós temos o dado → **na spec:** `RN-09.30`–`RN-09.37` — ARC, com convite pelo feed | 🟡 | · | **X** | · |
| `MO-12` | 🗣️ **EM DEBATE** — Inteligência de mercado agregada (`O-14`) | Adotar como relatório público (marketing) antes de como produto → **na spec:** `RN-10.33` só registra a recusa de vender dado individual | 🟡 | · | · | **X** |
| `MO-13` | ✅ **APLICADO** — Licença institucional (`O-15`) | Avaliar no ano 2. Maior ticket possível → **na spec:** `RN-10.26`–`RN-10.30` — licença institucional | 🔴 | · | **X** | · |
| `MO-14` | ✅ **APLICADO** — Apoio recorrente ao autor (`O-11`) | Avaliar após gorjeta madura → **na spec:** `RN-09.41`–`RN-09.43` — marcado como fase 2 | 🔴 | · | **X** | · |
| `MO-15` | ✅ **APLICADO** — Checkout web com Pix como padrão | Adotar. **+41% de margem por assinatura** → **na spec:** `RN-10.7`–`RN-10.7c` — checkout web + Pix | 🟡 | · | **X** | · |
| `MO-16` | 🗣️ **EM DEBATE** — Programas de pequenas empresas das lojas | Cadastrar antes do lançamento. 15 pontos por uma inscrição → **na spec:** `RN-10.7c` recomenda o cadastro; decisão sua | 🟢 | · | · | **X** |

### Bloco 4 — Decisão estratégica

| ID | Questão | Recomendação | Manter | Alterar | Debater |
|---|---|---|---|---|---|
| `MO-17` | 🚫 **RECUSADO** — **Obra seriada com capítulo pago (`O-13`)?** Modelo dominante da ficção digital, encaixa com o feed, resolve catálogo, justifica a moeda comprável — e muda o posicionamento para ficção popular seriada, longe da estética "alta performance literária" do rascunho | Decisão sua. É a maior alavanca de receita identificada e o maior desvio de rota → **na spec:** `RN-10.31` — obra seriada registrada como recusada | **X** | · | · |
| `MO-18` | 🗣️ **EM DEBATE** — Preços da tabela de [`03-precificacao.md`](03-precificacao.md) §6 | Validar com Van Westendorp antes de fixar → **na spec:** Preços seguem a validar em `Q-10.3` | · | · | **X** |

### Bloco 5 — Manter como está

| Item | Regra | Por quê |
|---|---|---|
| Tiered limits por obras ativas | `RN-10.3` | Melhor decisão de monetização da spec |
| Núcleo de leitura gratuito | `RN-10.2` | É o que constrói a base que se monetiza |
| Downgrade nunca despublica | `RN-10.4` | Protege o leitor que comprou |
| Sem oferta em frustração | `RN-07.26`, `RN-10.19` | Ativo de marca. Inegociável |
| Transparência do repasse | `RN-10.11`, `RN-09.26` | Diferencial real contra plataformas opacas |
| Gorjeta como mecanismo | `RN-07.15` | Boa ideia; só o encanamento muda |
| k-anonimato no analytics | `RN-09.14` | Fronteira ética de `O-14` |

---

## 4. Sequenciamento

| Fase | Cobrar por | Meta |
|---|---|---|
| **Lançamento** | Assinatura de autor (`O-01` + `O-02`) | Leitor aberto e gratuito para crescer a base; autor paga desde o dia 1 |
| **Ano 1** | + BookWorm Plus (`O-09`), venda de obras a 25%, gorjeta a 10% | Diversificar sem depender do marketplace |
| **Ano 2** | + IA de audiência (`O-03`), ARC (`O-05`), distribuição (`O-04`) | Aprofundar o lado autor, que é onde a margem está |
| **Escala** | + institucional (`O-15`), inteligência de mercado (`O-14`) | Ticket alto, venda consultiva |

---

## 5. Se você só puder decidir cinco coisas

~~1. `MO-01` — inverter `RN-07.16`.~~ ✅ Aplicado: a moeda ganha não sai mais do sistema.
~~2. `MO-02` — take rate realista.~~ ✅ Aplicado: 25% web / 30% app.
~~3. `MO-06` — leitor aberto.~~ ✅ Aplicado: `Q-02.1` resolvida.
~~4. `MO-10` — declarar o autor como cliente pagante.~~ ✅ Aplicado.
~~5. `MO-17` — decidir sobre obra seriada.~~ 🚫 Recusada, e registrada como recusa deliberada em `RN-10.31`.

**O que restou em aberto:** `MO-03` (cota de IA), `MO-12` (inteligência de mercado), `MO-16` (programas das lojas) e `MO-18` (preços).

---

## 6. Correções a aplicar nas specs, se aprovado

| Spec | Regra | Mudança |
|---|---|---|
| `07-economia-moedas.md` | `RN-07.16` | Inverter a origem que gera saque |
| `07-economia-moedas.md` | `RN-07.1`–`RN-07.3`, `RN-07.12`, `RN-07.23` | Duas moedas, ou só Semente |
| `07-economia-moedas.md` | `Q-07.1`, `Q-07.2`, `Q-07.6`, `Q-07.7` | Reescrever ou remover |
| `10-monetizacao-planos.md` | `RN-10.6` | Take rate de 5% → 25%/30% |
| `10-monetizacao-planos.md` | §5.1, `Q-10.2`, `Q-10.3` | Novos planos, preços e a resposta sobre comissão das lojas |
| `11-ia-premium-reader.md` | `RN-11.25` | Cota viável; reposicionamento da IA |
| `02-biblioteca-e-leitor.md` | `RN-02.1`, `Q-02.1` | Leitor aberto |
| `09-autores-e-analytics.md` | — | Novos módulos: ARC (`O-05`), lançamento (`O-06`) |
