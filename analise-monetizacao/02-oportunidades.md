# 02 — Mapa de Oportunidades

Cada oportunidade traz: o que é, quem paga, faixa de preço proposta, esforço e — o mais importante — **por que é ou não defensável**. Preço é defensável quando o comprador não consegue a mesma coisa mais barato em outro lugar.

**Esforço:** 🟢 baixo · 🟡 médio · 🔴 alto
**Defensabilidade:** ⭐⭐⭐ único no mercado · ⭐⭐ difícil de copiar · ⭐ commodity

---

## 1. Lado autor — o motor de receita

O autor autopublicado já é comprador de negócio: gasta com revisão, capa, ferramentas de escrita e anúncios, e mede retorno. É o único ator deste produto com orçamento e ROI declarado.

### `O-01` — Assinatura de autor por obras ativas ⭐⭐

Já está na spec (`RN-10.3`) e é a melhor decisão de monetização que ela tomou.

**Por que a métrica é boa:** o limite de obras ativas escala com o sucesso do autor, é trivial de entender, e não cobra de quem está começando. Quem tem uma obra é hobbista; quem tem oito é profissional e tem receita.

**Preço proposto:** R$ 0 (até 3 obras) · R$ 39,90/mês (até 15) · R$ 89,90/mês (ilimitado + analytics avançado). Ver [`03-precificacao.md`](03-precificacao.md) §6.

**Esforço:** 🟢 já especificado.

---

### `O-02` — Analytics de audiência: o produto âncora ⭐⭐⭐

Mapa de evasão (`RN-09.15`), frases mais grifadas (`RN-09.17`), trechos que geraram gorjeta (`RN-09.19`), taxa de conclusão, origem do leitor.

**Por que é defensável — e este é o ponto central de toda a análise:** a Amazon tem esse dado e **não entrega ao autor**. O KDP mostra vendas e páginas lidas do Kindle Unlimited, nada sobre *onde* o leitor parou ou o que o marcou. Um autor autopublicado hoje não tem como saber por que sua obra não engata.

*"73% dos seus leitores param no capítulo 7"* é a informação mais valiosa que já foi oferecida a um escritor independente, e ela não existe em nenhum produto do mercado.

**Quem paga:** autor sério. **Quanto:** é o que justifica o tier de R$ 89,90.

**Cuidado obrigatório:** k-anonimato de 5 (`RN-09.14`) é o piso ético e precisa valer na consulta, não só na exibição.

**Esforço:** 🟡 já especificado, exige pipeline de agregação.

---

### `O-03` — IA sobre dados proprietários: o "editor de audiência" ⭐⭐⭐

**A reposição da IA que hoje está no lugar errado** ([`00-diagnostico.md`](00-diagnostico.md) §5).

Em vez de resumir capítulo para o leitor (commodity, margem negativa), a IA lê os **dados de comportamento** e devolve diagnóstico ao autor:

- *"A evasão no capítulo 7 concentra-se nas primeiras 400 palavras. Nos seus outros capítulos, a cena de ação começa antes."*
- *"Os trechos mais grifados da sua obra são diálogos. Sua sinopse vende descrição."*
- *"Leitores que passam do capítulo 3 terminam em 89% dos casos. Seu problema de retenção está inteiro nos três primeiros capítulos."*

**Por que a economia funciona ao contrário da IA de leitor:** opera sobre estatística agregada, não sobre o texto integral do livro. São centenas de tokens, não centenas de milhares. Custo por análise na casa de centavos, contra os R$ 96/mês por assinante calculados em `00` §5.2.

**Por que é defensável:** ninguém mais tem o dado. O ChatGPT não consegue fazer isso sem ele.

**Esforço:** 🟡 depende de `O-02` existir primeiro.

---

### `O-04` — Distribuição paga ⭐⭐

Destaque de vitrine (`RN-10.21`), slots patrocinados no feed, posição em prateleira por gênero.

**Por que funciona:** é o mesmo orçamento que o autor já gasta com anúncios na Amazon e no BookBub, gasto num lugar onde o público **já está lendo**. A conversão tende a ser melhor que a de anúncio genérico, e o autor consegue medir.

**Restrição que precisa sobreviver:** `RN-10.24` — patrocinado não pode consumir a cota de descoberta orgânica (`RN-05.14`). No dia em que consumir, o feed perde a confiança do leitor e o inventário inteiro desvaloriza.

**Preço:** por CPM ou por período de slot. Reserva, não leilão, no início (`Q-10.7`) — leilão favorece quem já está estabelecido e contraria o princípio de dar palco a estreantes.

**Esforço:** 🟡 já parcialmente especificado.

---

### `O-05` — ARC e leitores beta ⭐⭐⭐

**A maior oportunidade não atendida do mercado autopublicado, e não está em nenhum lugar da spec.**

Todo autor independente precisa de leitores beta antes de publicar e de resenhas no dia do lançamento. Hoje isso é feito com planilhas, grupos de Facebook e serviços caros e desorganizados (BookSirens, Booksprout, StoryOrigin).

O BookWorm tem exatamente o que falta a esses serviços: uma base de leitores **com histórico de leitura verificado**. Ele sabe quem lê aquele gênero, quem termina o que começa, quem escreve resenhas longas.

**O produto:** o autor distribui cópias antecipadas para leitores selecionados por afinidade real de leitura, com prazo e acompanhamento de quem está lendo — usando a infraestrutura de sessões e evasão que já existe (`03`, `09`).

**Quem paga:** o autor, por campanha ou dentro do tier alto. **Por que é defensável:** o dado de comportamento de leitura não é replicável por um serviço externo.

**Esforço:** 🟡 módulo novo, mas reusa quase tudo.

---

### `O-06` — Ferramentas de lançamento ⭐⭐

Pré-venda, lista de espera, contagem regressiva, notificação para seguidores no dia, campanha de primeira semana.

**Por que importa:** o lançamento é o momento em que o autor mais gasta e mais precisa de ajuda. Concentra disposição a pagar.

**Esforço:** 🟡

---

### `O-07` — Relação direta com o leitor ⭐⭐

Autores desesperam por **possuir a própria audiência** — é a razão de existir do Substack. Dar ao autor uma lista de seguidores, comunicação direta, e a possibilidade de assinatura recorrente do próprio autor (`O-11`) é um argumento forte de plataforma.

**Tensão a resolver:** quanto mais o autor possui a audiência, mais fácil fica para ele sair da plataforma. Substack aceita esse trade-off e ganha por isso. Vale explicitar a decisão.

**Esforço:** 🟡

---

### `O-08` — Marketplace de serviços de produção ⭐

Indicação de capista, revisor e diagramador, com comissão sobre a contratação.

**Por que é fraco:** margem de indicação, curadoria cara, e concorrência direta com o Fiverr e o Reedsy, que já dominam. Baixa prioridade.

**Esforço:** 🔴 (exige curadoria humana contínua)

---

## 2. Lado leitor

### `O-09` — Assinatura de estética e identidade ⭐⭐

Todos os temas de card (`08`), itens de jardim exclusivos, molduras, estatísticas históricas estendidas, coleção ampliada.

**Por que é melhor que a assinatura de IA:** **custo marginal zero.** Um tema custa uma vez para produzir e é servido a milhões sem custo adicional. A IA custa a cada uso. Numa assinatura de preço fixo, a diferença entre custo marginal zero e custo marginal alto é a diferença entre margem de 95% e margem negativa.

E converte melhor do que parece: em produtos de hábito, quem mantém uma ofensiva longa desenvolve vínculo identitário com a representação visual dela. O jardim é exatamente esse objeto.

**Preço:** R$ 12,90–19,90/mês. Barato de propósito — é volume, não margem por unidade.

**Esforço:** 🟡 depende de produção contínua de arte, que é o custo real (`Q-04.5`).

---

### `O-10` — Leitor completo ⭐

Sincronização multi-dispositivo, exportação de destaques, estatísticas avançadas, backup.

**Por que é fraco isoladamente:** são recursos que o leitor considera básicos, não premium. Cobrar por sincronização gera ressentimento.

**Melhor uso:** compor o pacote de `O-09`, nunca ser vendido sozinho.

---

### `O-11` — Apoio recorrente ao autor ⭐⭐

A evolução natural da gorjeta: assinar um autor específico, com recompensas (capítulos antecipados, bastidores, comunidade).

**Por que é forte:** é o modelo Patreon, com a diferença de acontecer onde a leitura já está. Receita recorrente para o autor, comissão para a plataforma, e vínculo que segura os dois na plataforma.

**Esforço:** 🔴 exige pagamento recorrente, gestão de recompensa, e resolve-se melhor depois de `O-07`.

---

## 3. Marketplace

### `O-12` — Venda avulsa de obras ⭐

**O pilar mais fraco**, pelas razões de `00` §3: take rate destruído pela comissão das lojas, e concorrência frontal com a Amazon numa transação em que ela tem catálogo, preço e hábito.

**Quando faz sentido:** como camada secundária, roteada para web com Pix, com take rate realista de 20–30%. Nunca como motor.

---

### `O-13` — Obra seriada com capítulo pago ⭐⭐⭐

**A oportunidade que a spec mencionou de passagem (`Q-02.3`) e nunca explorou — e que pode ser maior que todo o resto.**

É o modelo dominante da ficção digital no mundo: Webnovel, Wattpad, Radish, Kindle Vella. O leitor consome capítulo a capítulo; os primeiros são gratuitos; a partir de certo ponto, cada capítulo custa uma pequena quantia. Fideliza por cliffhanger e monetiza por micropagamento.

**Por que encaixa perfeitamente neste produto específico:**

| O que o BookWorm já tem | Como serve ao modelo seriado |
|---|---|
| Feed vertical de pílulas (`05`) | É literalmente a vitrine de capítulo seriado |
| "Continuar Lendo" (`RN-05.9`) | O funil de conversão de capítulo |
| Ofensiva diária (`04`) | Casa com publicação diária/semanal do autor |
| Mapa de evasão (`RN-09.15`) | Diz ao autor onde o leitor desiste — vital em série |
| Moeda comprada (Saldo, `01-moedas.md`) | **É exatamente o instrumento certo:** micropagamento por capítulo é o único caso em que a moeda comprável se justifica sozinha |

**E resolve o problema de catálogo (`Q-02.1`):** obra seriada é escrita *na* plataforma. Não precisa de acervo prévio, não precisa de editora, não compete com a Amazon — que não tem esse formato.

**Por que é defensável:** é o único caminho em que o BookWorm seria o lugar onde o conteúdo **nasce**, e não mais um lugar onde ele é revendido.

**Risco:** é uma mudança de posicionamento. Puxa o produto para ficção popular seriada e para longe da estética "alta performance literária" do rascunho. **É a maior decisão estratégica desta análise.**

**Esforço:** 🔴

---

## 4. Dados e institucional

### `O-14` — Inteligência de mercado agregada ⭐⭐⭐

O BookWorm gera um dado que **não existe publicamente**: comportamento real de leitura. Onde as pessoas abandonam, o que grifam, quanto tempo levam, que gêneros retêm melhor.

Editoras, agentes literários e scouts pagam por pesquisa de mercado hoje — e o que compram é infinitamente pior do que isso.

**A fronteira ética, que não é negociável:**

| Permitido | Proibido |
|---|---|
| Agregado com k-anonimato (`RN-09.14`) | Qualquer dado individual |
| Tendência de gênero, retenção média por formato | Perfil de leitor identificável |
| Relatório de mercado publicado | Venda de base ou acesso a leitor |
| Opt-out do leitor respeitado (`RN-09.22`) | Uso sem consentimento |

**Nota estratégica:** um relatório público anual de comportamento de leitura no Brasil seria peça de imprensa e aquisição orgânica de altíssimo valor — provavelmente vale mais como marketing do que como produto vendido.

**Esforço:** 🟡 · **Risco de reputação:** alto se feito mal. É a ideia mais lucrativa e a mais fácil de errar.

---

### `O-15` — Licença institucional ⭐⭐

Escolas, universidades e bibliotecas. Mesmo produto, comprador com orçamento anual e ciclo de compra estabelecido.

**Por que encaixa:** o professor precisa exatamente do que o produto já mede — quem leu, quanto, com que profundidade. Hoje ele pergunta na sala e acredita na resposta.

**Cuidado:** exige painel de turma, e vigilância de aluno é um problema ético real. Precisa ser agregado e consentido, e o produto não deveria virar ferramenta de controle.

**Preço:** por aluno/ano ou licença de escola. É o maior ticket possível do produto.

**Esforço:** 🔴 · exige venda consultiva, contrato e suporte.

---

## 5. Ideias que recuso

Registradas para que a decisão de não usá-las seja consciente.

| Ideia | Por que funcionaria | Por que recuso |
|---|---|---|
| **Anúncios no feed** | Receita imediata, inventário pronto | Destrói a experiência de leitura e a confiança do feed, que é o ativo de aquisição. `O-04` monetiza o mesmo espaço sem envenená-lo |
| **Venda de dado individual** | Compradores existem | Trai o leitor e viola `RN-09.14`. `O-14` captura o valor legítimo |
| **Leitura ilimitada estilo Kindle Unlimited** | Modelo consagrado | Exige catálogo que não existe (`Q-02.1`) e o repasse por página lida é o mecanismo que mais revolta autores hoje. Prematuro |
| **Publicação paga (selo de vaidade)** | Autores pagam para publicar | Vaidade paga é predatória com o autor iniciante. Contraria P5 das specs, que atrela o sucesso da plataforma ao do autor |
| **Cobrar por recurso do núcleo de leitura** | Conversão fácil | `RN-10.2` proíbe e está certo. O hábito é a base que se monetiza depois |
| **Loot box paga** | Receita alta | Já recusada na análise de game design. Aleatoriedade + dinheiro + menores (`RN-01.4`) |

---

## 6. Onde apostar

Ordenado por retorno sobre esforço, considerando a decisão de receita cedo do lado autor:

| Ordem | Oportunidade | Por quê |
|---|---|---|
| 1 | `O-02` Analytics de audiência | O produto âncora. É o que ninguém mais tem |
| 2 | `O-01` Tiers por obras ativas | Já especificado, métrica certa, só precisa de preço |
| 3 | `O-03` IA para o autor | Realoca a IA para onde ela tem margem e moat |
| 4 | `O-09` Assinatura de estética | Margem alta, custo marginal zero, sustenta a base gratuita |
| 5 | `O-05` ARC e beta readers | Necessidade real e desatendida, e só o BookWorm tem o dado |
| 6 | `O-04` Distribuição paga | Orçamento que já existe, gasto onde o leitor está |
| — | `O-13` Obra seriada | **Fora da ordem porque não é incremento, é decisão de posicionamento.** Se for adotado, reordena tudo |
