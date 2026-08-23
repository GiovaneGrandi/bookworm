# 00 — Diagnóstico do Modelo de Receita

> Análise crítica de [`../specs/10-monetizacao-planos.md`](../specs/10-monetizacao-planos.md) e [`../specs/07-economia-moedas.md`](../specs/07-economia-moedas.md).
> Nenhuma spec foi alterada. Mercado de referência: **Brasil, em R$**.

---

## 1. Veredito

**A estrutura do modelo está certa e a aritmética não fecha.**

O rascunho acertou ao propor receita híbrida — marketplace, moeda, assinatura de leitor e assinatura de autor. Diversificar é correto num produto de dois lados. Mas nenhum dos quatro pilares foi testado com números, e três deles **perdem dinheiro** do jeito que estão especificados:

| Pilar | Estado |
|---|---|
| Marketplace com take rate de 5% | ❌ Perde dinheiro em toda venda in-app. Ver §3 |
| Moeda virtual conversível em saque | ❌ Passivo sem lastro. Ver §4 |
| Assinatura de IA para leitor | ❌ Custo variável ~5× a receita na cota especificada. Ver §5 |
| Assinatura de autor (tiers + analytics) | ✅ É o único pilar sólido — e está tratado como secundário |

E há uma pergunta que a spec nunca fez em lugar nenhum: **quem é o cliente pagante?** Sem resposta, o modelo tenta cobrar um pouco de todo mundo e não constrói nada de ninguém.

---

## 2. Premissas usadas em todo o documento

Todo número desta análise vem daqui. Troque a premissa e a conta muda — é para isso que ela está exposta.

| # | Premissa | Valor | Observação |
|---|---|---|---|
| `P1` | Comissão da App Store / Play Store, programa de pequenas empresas | **15%** | Vale até ~US$ 1M/ano de receita. É a faixa realista para o BookWorm nos primeiros anos |
| `P2` | Comissão das lojas fora do programa | **30%** | O que acontece se der certo. Toda conta é feita nos dois cenários |
| `P3` | Gateway de cartão no Brasil | **~3,99% + R$ 0,39** | Faixa típica de adquirente para pequeno volume. A validar com proposta comercial |
| `P4` | Pix via PSP | **~0,99%** | Alguns PSPs cobram valor fixo baixo. **É a maior alavanca de margem do modelo brasileiro** |
| `P5` | Preço médio de uma obra | **R$ 20,00** | Faixa comum de e-book nacional independente |
| `P6` | Câmbio | **US$ 1 = R$ 5,50** | Para custos de infraestrutura e IA |
| `P7` | Custo de IA — modelo de referência | US$ 5 / 1M tokens de entrada, US$ 25 / 1M de saída; leitura de cache ~10% da entrada | Claude Opus 5. Ver `03-precificacao.md` §5 |

Todas marcadas **(a validar)**. Nenhuma foi confirmada com fornecedor.

---

## 3. O take rate de 5% não fecha em lugar nenhum

`RN-10.6` promete ao autor **95% da venda**. Aplicado a uma obra de R$ 20 (`P5`):

| Trilho de pagamento | Loja retém | Gateway retém | Plataforma recebe | Paga ao autor | **Resultado** |
|---|---|---|---|---|---|
| App, lojas a 15% (`P1`) | R$ 3,00 | — | R$ 17,00 | R$ 19,00 | **− R$ 2,00** |
| App, lojas a 30% (`P2`) | R$ 6,00 | — | R$ 14,00 | R$ 19,00 | **− R$ 5,00** |
| Web + cartão (`P3`) | — | R$ 1,19 | R$ 18,81 | R$ 19,00 | **− R$ 0,19** |
| Web + Pix (`P4`) | — | R$ 0,20 | R$ 19,80 | R$ 19,00 | **+ R$ 0,80** |

**A plataforma perde dinheiro em três dos quatro trilhos.** No único que sobra algo, sobram 80 centavos — antes de qualquer custo de infraestrutura, suporte, moderação (`RN-09.2` exige revisão humana por amostragem) e fraude.

E note o que isso significa na prática: **quanto mais o marketplace vender no app, maior o prejuízo.** É um modelo que pune o próprio sucesso.

### Take rate mínimo só para não perder dinheiro

| Trilho | Take rate de equilíbrio |
|---|---|
| App, lojas a 15% | **≥ 15%** |
| App, lojas a 30% | **≥ 30%** |
| Web + cartão | ≥ 6% |
| Web + Pix | ≥ 1% |

Para *lucrar*, e não apenas empatar, some a margem desejada.

### Onde os 5% se situam no mercado

| Plataforma | Fica com |
|---|---|
| Amazon KDP (faixa padrão) | 30% |
| Apple Books, Kobo, Google Play Livros | 30% |
| Gumroad | ~10% |
| Substack | 10% |
| Patreon | 8–12% |
| **BookWorm, como especificado** | **5%** |

Os 5% não são generosidade competitiva. São um número que só existe porque ninguém fez a conta. E o efeito colateral é perverso: um take rate baixo demais **impede** a plataforma de investir em aquisição de leitores — que é exatamente o que o autor mais quer dela.

> Isto resolve e reescreve `Q-10.2`, que eu havia deixado em aberto como "quem absorve a comissão das lojas". A resposta é: **ninguém consegue absorver a 5%.**

---

## 4. A moeda virtual: um passivo sem lastro (correção de erro meu)

`RN-07.16`, que eu escrevi, estabelece:

| Origem da moeda gasta pelo leitor | Vira, para o autor |
|---|---|
| **Ganha** (de graça, por ler) | **Crédito Sacável** — dinheiro real |
| **Comprada** (com dinheiro, via IAP) | Crédito Promocional — só uso interno |

**Está invertido.**

Moeda ganha não tem receita por trás — a plataforma a distribui de graça, até 150 por dia por conta (`RN-07.8`). Torná-la conversível em dinheiro significa que a plataforma **paga dinheiro real por moeda que ela mesma imprimiu**. Quanto mais o produto engaja, mais ele perde: o engajamento vira despesa.

Moeda comprada é o inverso — ela **é** lastreada, porque alguém pagou por ela. É exatamente essa que pode virar saque.

**A regra correta é a inversa da que está na spec:**

| Origem | Deve virar |
|---|---|
| Comprada com dinheiro | Crédito sacável (há receita por trás) |
| Ganha por comportamento | Nunca sai do sistema |

Detalhamento e a proposta de duas moedas em [`01-moedas.md`](01-moedas.md).

### E sobre o risco de compliance que levantei em `Q-07.1`

Escrevi na spec que converter moeda de IAP em pagamento a terceiros arriscaria remoção das lojas. **Revisando, exagerei.** É prática estabelecida e aceita: Twitch Bits, presentes do TikTok e YouTube Super Chat fazem exatamente isso. As lojas permitem justamente porque cobram a comissão delas na compra da moeda.

O problema nunca foi permissão — é **quanto sobra depois**. `Q-07.1` deveria ser reescrita de *"é permitido?"* para *"a que custo?"*, e a resposta está na tabela do §3: a loja leva 15% a 30% na entrada, antes de qualquer repasse.

Registro a correção porque a spec carrega minha avaliação anterior, e ela precisa ser ajustada.

---

## 5. A assinatura de IA para leitor não fecha por dois motivos independentes

### 5.1 É genérica

Resumir capítulo (`RN-11.7`), explicar termo (`RN-11.10`), mapear personagem (`RN-11.13`) e conversar com o livro (`RN-11.16`) são commodities. Qualquer assistente de IA faz o mesmo com um arquivo anexado, muitas vezes de graça. Não há dado proprietário, não há moat, não há efeito de rede — e o concorrente é um app que o usuário já tem instalado.

Some-se `B-18` da análise de game design: o recurso **compete com o comportamento que o produto vende**. É a única funcionalidade paga do BookWorm que permite não ler.

### 5.2 A cota especificada custa mais que a assinatura

`RN-11.25` promete 200 mensagens de chat por mês. Com `P6` e `P7`:

```
Turno de chat com ~150k tokens de contexto em cache:
  leitura de cache   150.000 × US$ 0,50/1M  = US$ 0,075
  saída ~500 tokens      500 × US$ 25/1M    = US$ 0,013
  custo por turno                            ≈ US$ 0,088  ≈ R$ 0,48

200 turnos/mês  →  R$ 96,00 de custo por assinante
```

Contra uma assinatura hipotética de R$ 19,90, o custo é **quase 5× a receita**. Mesmo trocando por um modelo bem mais barato, a conta continua no vermelho ou no zero a zero.

O único recurso com economia sadia é o resumo pré-computado e compartilhado entre leitores (`RN-11.33`): gerado uma vez por capítulo, servido a todos, custo marginal próximo de zero. **É a exceção, não a regra.**

> Isto responde `Q-11.3`, que eu havia deixado em aberto: o custo não sustenta assinatura de leitor com essa cota.

### 5.3 Onde a IA vale dinheiro de verdade

Do lado do **autor**, sobre dados que só o BookWorm tem: mapa de evasão (`RN-09.15`), trechos que geraram gorjeta (`RN-09.19`), frases mais grifadas (`RN-09.17`).

*"Seus leitores abandonam no capítulo 7. Nos três livros do seu gênero com melhor retenção, o capítulo equivalente faz X."*

Isso a Amazon não entrega, o ChatGPT não consegue fazer sem os dados, e o autor autopublicado **já paga** por informação com muito menos valor. E o custo de IA é irrisório, porque opera sobre estatística agregada, não sobre o texto inteiro do livro.

**Recomendação: mover a IA do lado leitor para o lado autor.** Desenvolvimento em [`02-oportunidades.md`](02-oportunidades.md) §2.

---

## 6. A pergunta que a spec nunca fez: quem paga?

O modelo atual cobra um pouco de todo mundo — comissão do autor, moeda do leitor, assinatura dos dois — e não constrói proposta forte para ninguém.

O que o mercado mostra:

| Comprador | Disposição a pagar | Evidência |
|---|---|---|
| **Leitor**, por funcionalidade | Baixa | Goodreads é gratuito há 15 anos; StoryGraph Plus é fatia pequena da base. Leitor paga por **conteúdo**, não por recurso |
| **Leitor**, por estética e identidade | Média | Cosmético converte bem em produtos de hábito, e tem custo marginal zero — ao contrário da IA |
| **Autor autopublicado** | **Alta** | Já gasta com revisão, capa, ferramentas de escrita e anúncios. É comprador de negócio, com ROI mensurável |
| **Instituição** (escola, universidade) | Alta | Orçamento anual, ciclo de compra estabelecido |

O rascunho tem essa intuição na seção B2Creator e a trata como um dos quatro pilares. **Deveria ser o motor.** Isso conversa diretamente com a decisão já tomada de receita cedo do lado autor e leitor gratuito.

---

## 7. O que o modelo atual acerta

Simetria obrigatória — estes pontos não devem ser derrubados por engano ao aplicar as recomendações.

1. **A estrutura híbrida.** Diversificar receita num produto de dois lados é correto. O erro está nos números, não no desenho.
2. **Tiered limits por obras ativas** (`RN-10.3`). Métrica de cobrança excelente: escala com o sucesso do autor, é fácil de entender e não pune quem está começando.
3. **Downgrade que nunca despublica** (`RN-10.4`). Proteger o leitor que já comprou é correto e raro.
4. **Nenhum recurso do núcleo atrás de paywall** (`RN-10.2`). O hábito é gratuito. Certo — é o que constrói a base que se monetiza depois.
5. **Sem oferta em momento de frustração** (`RN-07.26`, `RN-10.19`). É ativo de marca num mercado saturado de padrão escuro. Inegociável.
6. **Transparência total do repasse** (`RN-10.11`, `RN-09.26`). O autor vê bruto, deduções e líquido. É diferencial competitivo real contra plataformas opacas.
7. **A gorjeta como mecanismo.** A intuição de apoio direto está certa; só o encanamento (`RN-07.16`) está invertido.

---

## 8. Índice da análise

| Documento | Responde |
|---|---|
| [`01-moedas.md`](01-moedas.md) | *A ideia de moedas é boa?* |
| [`02-oportunidades.md`](02-oportunidades.md) | *Quais oportunidades temos?* e *a assinatura de IA é genérica?* |
| [`03-precificacao.md`](03-precificacao.md) | *Que métodos de precificação adotar?* |
| [`04-recomendacao.md`](04-recomendacao.md) | *Livro in-app ou só leitor/publicador?* + modelo recomendado + folha de decisão |
