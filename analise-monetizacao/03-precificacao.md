# 03 — Métodos de Precificação e Unit Economics

Premissas `P1` a `P7` em [`00-diagnostico.md`](00-diagnostico.md) §2. Todo número aqui é reproduzível a partir delas.

---

## 1. A métrica de cobrança importa mais que o preço

Antes de escolher *quanto*, escolha *por o quê*. A métrica de cobrança define se o preço escala com o valor entregue — errar aqui não se corrige com desconto.

| Métrica | Bom quando | Risco |
|---|---|---|
| **Por obra ativa** (o que a spec já usa, `RN-10.3`) | Escala com o sucesso do autor, é óbvia, não cobra de quem começa | Autor com uma obra de sucesso paga pouco |
| Por leitor alcançado | Escala com valor real entregue | Pune o sucesso e é imprevisível para o autor — evitar |
| Por receita do autor (% ) | Alinhamento perfeito | Já é o take rate; cobrar duas vezes gera revolta |
| Por recurso (feature gating) | Simples de comunicar | Não escala: quem fatura R$ 100 mil paga igual a quem fatura R$ 100 |
| Por uso (créditos de IA) | Casa custo variável com receita | Atrito cognitivo; usuário odeia medir |

**Recomendação:** manter **obra ativa** como métrica principal (a spec acertou), com recursos como diferenciador secundário de tier, e **créditos** apenas onde houver custo variável real — ou seja, só na IA.

---

## 2. Métodos, e quando usar cada um

**Por valor percebido** — preço ancorado no que o cliente economiza ou ganha. É o método certo para o lado autor: se o analytics evita que ele queime R$ 300 em anúncio para um livro que perde leitor no capítulo 7, R$ 89,90/mês é barato. **Use este para `O-02`, `O-03`, `O-05`.**

**Por custo** — piso, nunca teto. Serve só para dizer o que é impossível: se a IA custa R$ 96/assinante (§5), R$ 19,90 está fora de questão. **Use como filtro de sanidade, não para definir preço.**

**Por concorrência** — ancoragem no que o comprador já paga. Referências brasileiras relevantes: Spotify R$ 21,90; Kindle Unlimited ~R$ 19,90; Netflix R$ 20–60. Referências do autor: ProWritingAid ~US$ 30/mês; Publisher Rocket US$ 97 uma vez; campanha BookBub, centenas de dólares. **Use para leitor, onde a comparação mental é inevitável.**

**Van Westendorp** — a forma barata de descobrir a faixa antes de lançar. Quatro perguntas a ~100 usuários do perfil:

1. Por qual preço isso seria **caro demais** para você considerar?
2. Por qual preço seria **caro, mas ainda valeria a pena**?
3. Por qual preço seria uma **boa compra**?
4. Por qual preço seria **barato a ponto de você duvidar da qualidade**?

O cruzamento das curvas dá a faixa aceitável e o ponto ótimo. Vale rodar separado para autor e leitor — são mercados diferentes.

**Good-better-best com decoy** — três tiers, em que o do meio é o alvo. O tier alto existe em boa parte para fazer o do meio parecer razoável. Com dois tiers, o cliente escolhe o barato; com três, ele escolhe o do meio.

**Anual com dois meses grátis** — convenção de mercado (`anual = 10 × mensal`). Melhora caixa e reduz churn de forma imediata. Deve existir desde o dia 1.

**Preço regional (PPP)** — irrelevante agora (só Brasil), mas a estrutura de preço precisa nascer preparada, ou a expansão exige refazer tudo.

**Freemium** — conversão típica de 2% a 5% da base ativa. Todo modelo desta análise deve ser dimensionado com **3%** e testado com 1% no pior caso.

---

## 3. Onde colocar o paywall

- **Depois do momento de valor, nunca antes.** O leitor só entende o que o tema de card vale depois de ter um card para mostrar; o autor só entende o analytics depois de ter leitores. Paywall antes disso vira ruído.
- **Mostrar, não esconder** (`RN-10.17`). `RN-08.12` já faz isso certo: pré-visualizar o tema bloqueado com o conteúdo real do próprio usuário. Replicar o padrão em todo bloqueio.
- **Nunca em momento de frustração** (`RN-07.26`, `RN-10.19`). Inegociável.
- **Avisar o limite antes de esbarrar nele** (`RN-10.20`): "2 de 3 obras ativas" no painel, não uma surpresa ao tentar publicar a quarta.
- **Teste gratuito:** 7 dias para o leitor (`RN-10.13`). Para o autor, **14 dias**, porque o valor do analytics só aparece com dados acumulados — 7 dias não bastam para provar nada.

---

## 4. Roteamento de pagamento: a maior alavanca de margem no Brasil

Assinatura de leitor a R$ 14,90:

| Trilho | Retido | **Plataforma recebe** | vs. IAP a 30% |
|---|---|---|---|
| IAP, lojas a 30% (`P2`) | R$ 4,47 | R$ 10,43 | — |
| IAP, lojas a 15% (`P1`) | R$ 2,24 | R$ 12,66 | +21% |
| Web + cartão (`P3`) | R$ 0,98 | R$ 13,92 | +33% |
| **Web + Pix (`P4`)** | R$ 0,15 | **R$ 14,75** | **+41%** |

**Uma assinatura vendida por Pix na web vale 41% mais que a mesma assinatura vendida in-app.** Nenhuma otimização de preço, funil ou retenção entrega 41% de margem tão barato.

O mesmo vale, com efeito ainda maior, para venda de obra (`00` §3) e gorjeta (`01-moedas.md` §5).

### Como capturar isso na prática

1. **Checkout web como caminho principal** de assinatura e compra, com Pix em destaque.
2. **Manter IAP disponível** — conveniência converte, e brigar com ela custa conversão. A questão é qual é o padrão.
3. **Precificar diferente por trilho**, se e quando permitido: repassar parte da economia do Pix ao usuário é legítimo e aumenta a adesão ao trilho barato.
4. **Cadastrar-se nos programas de pequenas empresas** das duas lojas antes do lançamento. É a diferença entre `P1` e `P2` — 15 pontos percentuais por uma inscrição.

> ⚠️ **Item de verificação, não afirmação.** As regras de *anti-steering* (poder ou não avisar o usuário sobre pagamento fora do app) mudaram nos últimos anos e há disputa regulatória específica no Brasil. **Verificar o estado atual das políticas de Apple e Google e das decisões regulatórias brasileiras antes de desenhar o funil.** Não tenho como confirmar o estado vigente e não vou afirmar o que não sei.

---

## 5. Unit economics da IA

Premissas `P6` e `P7`. Um turno de chat sobre um livro já lido, com ~150k tokens de contexto em cache:

```
Opus 5:    150.000 × US$0,50/1M  +  500 × US$25/1M  =  US$ 0,088  →  R$ 0,48
Haiku 4.5: 150.000 × US$0,10/1M  +  500 × US$5/1M   =  US$ 0,018  →  R$ 0,10
```

Custo mensal por assinante, contra uma assinatura de R$ 19,90:

| Cota de chat | Modelo | Custo/mês | % da receita | Viável? |
|---|---|---|---|---|
| **200 msg** (`RN-11.25`) | Opus 5 | **R$ 96,25** | **484%** | ❌ |
| 200 msg | Haiku 4.5 | R$ 19,25 | 97% | ❌ |
| 50 msg | Opus 5 | R$ 24,06 | 121% | ❌ |
| 50 msg | Haiku 4.5 | R$ 4,81 | 24% | ⚠️ |
| 20 msg | Opus 5 | R$ 9,63 | 48% | ⚠️ |
| 20 msg | Haiku 4.5 | R$ 1,93 | 10% | ✅ |

**Resumo pré-computado e compartilhado** (`RN-11.33`), obra de 20 capítulos:

```
20 capítulos × (15k entrada + 800 saída) ≈ US$ 1,90 uma vez por obra
Servido a 1.000 leitores → US$ 0,0019 por leitor  →  R$ 0,01
```

### O que isso decide

1. **A cota de `RN-11.25` é impossível** em qualquer combinação de modelo e preço razoável.
2. **O chat é o problema inteiro.** É o único recurso com custo alto e não compartilhável.
3. **Resumo e ficha de personagem são praticamente gratuitos** quando pré-computados por capítulo e compartilhados. É a única parte da IA de leitor que se paga.
4. Se a IA de leitor for mantida: chat com cota pequena (~20/mês), modelo econômico para tarefa simples, e créditos avulsos para quem quiser mais.
5. **A IA de autor** (`O-03`) opera sobre agregados de centenas de tokens: custo de centavos por análise, contra um tier de R$ 89,90. É onde a margem existe.

> Isto responde `Q-11.3` e `Q-11.4`, que ficaram em aberto nas specs.

---

## 6. Tabela de preços proposta

Todos **(a validar)** com Van Westendorp antes do lançamento.

### Autor — o motor

| Plano | Mensal | Anual | Inclui |
|---|---|---|---|
| **Autor** | R$ 0 | — | Até 3 obras ativas, pílulas, quests e sprints, analytics básico (leitores, vendas, receita) |
| **Autor Plus** | **R$ 39,90** | R$ 399 | Até 15 obras, analytics completo (evasão, engajamento, gorjetas), prioridade na revisão, ferramentas de lançamento |
| **Autor Pro** | **R$ 89,90** | R$ 899 | Obras ilimitadas, IA de audiência (`O-03`), campanhas de ARC (`O-05`), crédito mensal de destaque |

Ancoragem: um autor que paga US$ 30/mês em ferramenta de escrita e centenas em anúncio não pisca diante de R$ 39,90 se o analytics mostrar uma coisa que ele não sabia.

### Leitor — a base

| Plano | Mensal | Anual | Inclui |
|---|---|---|---|
| **Leitor** | R$ 0 | — | Todo o núcleo: ler, medir, ofensiva, jardim, cards com temas gratuitos, coleção |
| **BookWorm Plus** | **R$ 14,90** | R$ 149 | Todos os temas, itens exclusivos de jardim, estatísticas históricas estendidas, sincronização avançada, IA com cota reduzida |

Ancoragem: abaixo do Spotify (R$ 21,90) e do Kindle Unlimited (~R$ 19,90). É produto de volume, não de margem por unidade.

### Take rate

| Transação | Proposto | Hoje na spec |
|---|---|---|
| Venda de obra | **25%** (web) / **30%** (in-app) | 5% (`RN-10.6`) |
| Gorjeta | **10%** | não definido |

25% ainda deixa o autor com 75% — muito acima dos 10–15% de royalty de uma editora tradicional, e comparável à Amazon com muito mais dado e ferramenta em troca. **A comunicação disso importa tanto quanto o número:** o autor precisa ver o que compra com os 25%.

---

## 7. LTV, CAC e ponto de equilíbrio

Premissas adicionais, todas **(a validar)**:

| Premissa | Valor |
|---|---|
| Churn mensal — autor pagante | 5% (vida média 20 meses) |
| Churn mensal — leitor pagante | 8% (vida média 12,5 meses) |
| Margem bruta — autor | 80% |
| Margem bruta — leitor | 90% |
| Custo fixo mensal (equipe enxuta + infra) | R$ 60.000 |

```
LTV autor  = 39,90 × 20 × 0,80  =  R$ 638
LTV leitor = 14,90 × 12,5 × 0,90 =  R$ 168

CAC máximo saudável (LTV/CAC = 3):
  autor  →  R$ 213
  leitor →  R$  56
```

**O CAC de autor de R$ 213 é a descoberta prática mais útil desta análise:** com esse teto, é viável comprar autor com anúncio pago, patrocinar comunidade de escrita, ir a evento literário e fazer venda ativa. Com R$ 56 por leitor, sobra pouco além de orgânico e indicação.

### Ponto de equilíbrio

| Cenário | Pagantes necessários |
|---|---|
| Só autores (R$ 31,92 de contribuição) | **1.880 autores** |
| Só leitores (R$ 13,41 de contribuição) | **4.475 leitores** |
| Misto: 1.000 autores + 3.000 leitores | R$ 72.150 — **cobre com folga** |

**2,4 leitores pagantes equivalem a 1 autor pagante.** É a razão aritmética de a estratégia ser liderada pelo autor.

Com conversão de 3% (§2), 1.000 autores pagantes exigem ~33.000 autores ativos. Esse é o número que a estratégia de aquisição precisa perseguir — e ele é bem menor que o de leitores equivalente.

---

## 8. O que testar antes de fixar preço

| # | Teste | Responde |
|---|---|---|
| 1 | Van Westendorp com 100 autores autopublicados brasileiros | A faixa real do lado que paga |
| 2 | Entrevista de valor: *"quanto vale saber onde seu leitor desiste?"* | Se `O-02` é âncora de verdade ou hipótese minha |
| 3 | Teste A/B de checkout web+Pix vs. IAP | Quanto da economia de 41% é capturável sem perder conversão |
| 4 | Teste de cota de IA com uso real | Se 20 mensagens/mês frustram ou bastam |
| 5 | Sensibilidade ao take rate: 25% assusta autor? | Se a comunicação do valor sustenta o número |
