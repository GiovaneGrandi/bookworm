# BookWorm — Direção Visual

> Documento **vinculante** de identidade visual. Vale para toda tela, todo mockup e todo componente do produto.
> **A camada operacional dele é [`design-system.md`](design-system.md)**: onde este arquivo decide *por quê*, aquele decide *como* — tokens nomeados, componentes, estados, acessibilidade, movimento, navegação e a tradução para React Native. Onde os dois divergirem, manda este.
> Ponto de entrada das specs: [`00-overview.md`](00-overview.md). Este arquivo é o par estético do que [`glossario.md`](glossario.md) é para o vocabulário: uma referência transversal, não uma spec de módulo.

---

## 1. A decisão

**A estética "Papel" é o pilar de design do BookWorm.**

Três direções foram prototipadas na tela de leitura e comparadas em [`../mockups/comparativo.html`](../mockups/comparativo.html): **Papel**, **Instrumento** e **Noturno**. Papel e Noturno avançaram para uma segunda rodada, aplicada a 7 telas do MVP cada. **Papel venceu.**

| Direção | Estado |
|---|---|
| **Papel** | **Escolhida.** Pilar de design do produto |
| Noturno | Descartada como direção. Quatro telas dela são **herdadas** por Papel — ver §6 |
| Instrumento | Descartada na primeira rodada |

### Por que Papel

A tese de Papel é *"o livro como objeto, não como aplicativo"*: o app é um conjunto de objetos de papelaria sobre uma mesa verde-escura — fichas de fichário, herbário, carimbos, etiquetas datilografadas, marginália a lápis.

Isso não é preferência de gosto; é o que casa com três princípios já vinculantes de [`00-overview.md`](00-overview.md) §2:

- **P3 — profundidade acima de velocidade.** Uma estética de papel e tipografia desacelera por construção. Ela não sabe parecer um painel de métricas em tempo real, e isso é uma vantagem.
- **P6 — estética é funcionalidade.** O objeto-livro é o que a persona valoriza (§2.3: "valoriza design, organização e a beleza do objeto-livro"). Papel é a tradução literal disso.
- **P7 — o alvo é quem parou de ler.** Papel não parece um app de produtividade. Para quem largou o livro por cansaço de tela, essa distância é o argumento.

### O custo assumido

O rodapé de [`../mockups/comparativo.html`](../mockups/comparativo.html) registra que **Papel exige produção visual real**, ao contrário de Instrumento, que era quase todo CSS. Isso é aceito conscientemente, e reforça `mvp.md` R-2: a arte e a camada de juice **são o produto, não o acabamento**.

---

## 2. A identidade é verde

**Decisão:** o verde é a cor de identidade do BookWorm. O oxblood (`#8e2f26`) usado nos mockups aprovados como acento — carimbos, botão primário, estado selecionado, marcador de "hoje" — **é substituído por verde**.

O motivo é de coerência semântica, não de estética isolada: a ofensiva é um **jardim**, a moeda são **Sementes**, a quebra de hábito é **dormência** e o acervo é um **herbário**. Toda a metáfora do produto é botânica. Um acento vermelho luta contra ela.

O `--mesa: #1e2320` — o pano verde-escuro que já era o fundo de tudo — deixa de ser um detalhe cenográfico e passa a ser **a base da identidade**.

### Substituição canônica

| Papel | De | Para | Nome |
|---|---|---|---|
| Acento primário | `--oxblood` `#8e2f26` | `--verde-tinta` **`#2f5d3a`** | verde-garrafa, tinta de carimbo |
| Todos os alfas do acento | `rgba(142,47,38,α)` | `rgba(47,93,58,α)` | mesmos α, troca mecânica |
| Carimbo, tom claro | `rgba(196,84,68,.72)` | `rgba(84,140,96,.72)` | |
| Carimbo, tom médio | `rgba(176,72,58,.55)` | `rgba(72,124,86,.55)` | |

`#2f5d3a` foi escolhido por **equivalência de peso óptico**, não por aparência isolada: sobre o papel `#f3ead9` ele rende contraste **6,4:1**, contra **6,8:1** do oxblood que substitui. Sobre papel, portanto, a troca não altera hierarquia, legibilidade nem acessibilidade de nenhuma tela existente.

### A exceção: o que toca a mesa

A troca é mecânica **enquanto o acento estiver sobre papel**. Não é, para o que fica sobre o `--mesa`.

Em luminância os dois acentos são equivalentes contra a mesa (oxblood 1,96:1, verde 2,09:1) — nenhum dos dois jamais serviu como texto ali. Mas o oxblood se separava do verde-escuro **por matiz**, e o verde não se separa. Elementos decorativos que apareciam contra a mesa por contraste de cor, e não de claro/escuro, somem na migração.

O caso concreto é a **fita de marcador** — hoje `linear-gradient(90deg, #6f231d, #9c352b 38%, #7d271f)`. Traduzida ao pé da letra para verde, ela se dissolve no pano da mesa.

Regra que decorre disso: **o verde-tinta vive sobre papel.** O que precisa se destacar contra a mesa usa `--ambar` (1,45:1 sobre papel, mas alto contra a mesa) ou um creme claro. A fita de marcador é o primeiro item a redesenhar, não a reconverter.

### O que NÃO vira verde

- **`--ambar` `#e6c15c`** permanece. Âmbar é o complementar do verde e lê como luz e mel; é o que impede a paleta de virar monocromática.
- **Os 4 pigmentos de grifo** — `--pig-ambar`, `--pig-oliva`, `--pig-tinta`, `--pig-carmim` — permanecem intactos, **inclusive o carmim rosado**. Eles não são cor de marca: são **ferramenta da leitora**, equivalentes a quatro marca-textos numa mesa. Reduzi-los à identidade da marca tiraria da pessoa a única escolha cromática que ela tem no produto.

Essa distinção é a regra: **verde é a marca; os pigmentos são da leitora.**

---

## 3. Tokens canônicos

Fonte: [`../mockups/leitor-papel.html`](../mockups/leitor-papel.html), com a substituição de §2 aplicada. Todo CSS escopado sob `.mk-papel`.

```css
/* tintas e papéis */
--tinta:        #241f19;
--tinta-70:     rgba(36,31,25,.72);
--tinta-50:     rgba(36,31,25,.52);
--tinta-32:     rgba(36,31,25,.34);
--tinta-16:     rgba(36,31,25,.16);
--papel:        #f3ead9;
--papel-fundo:  #efe3ce;
--grafite:      #6f6858;

/* acento — a identidade */
--verde-tinta:  #2f5d3a;     /* substitui --oxblood */
--ambar:        #e6c15c;
--mesa:         #1e2320;     /* pano da mesa: fundo de toda a página */

/* 4 pigmentos de grifo — ferramenta da leitora, não da marca */
--pig-ambar:  #e7c25e;
--pig-oliva:  #a8b07a;
--pig-tinta:  #93a9c0;
--pig-carmim: #d79aa2;

/* tipografia — as quatro vozes da marca (ver §3.1) */
--serif:    'Spectral', 'Iowan Old Style', 'Palatino Linotype', Palatino, Georgia, serif;
--garamond: 'EB Garamond', 'Spectral', Garamond, Georgia, serif;
--mono:     'Courier Prime', 'Courier New', Courier, monospace;
--lapis:    'Caveat', 'Segoe Script', 'Bradley Hand', cursive;

/* faces oferecidas à leitora no painel — NÃO são vozes da marca (ver §3.3) */
--leit-sans:     'Public Sans', 'Segoe UI', Arial, sans-serif;
--leit-acessivel:'Atkinson Hyperlegible', Arial, sans-serif;
```

---

### 3.1 Sistema tipográfico: **Quatro Vozes**

Escolhido em 22/08/2026, após comparação de três sistemas aplicados às mesmas oito situações e ao mesmo texto-espécime. Os descartados ficam como histórico: [`tipografia-duas-vozes.html`](../mockups/tipografia-duas-vozes.html) (superfamília com eixo óptico + sans com versalete real) e [`tipografia-uma-voz.html`](../mockups/tipografia-uma-voz.html) (uma única superfamília faz tudo). A referência viva do sistema adotado é [`tipografia-quatro-vozes.html`](../mockups/tipografia-quatro-vozes.html).

**Cada função tem sua própria face:**

| Voz | Face | Domínio |
|---|---|---|
| Conteúdo e display | **Spectral** | corpo de leitura, títulos, números de celebração, dado tabular, microcopy |
| Citação e peça editorial | **EB Garamond** | citação compartilhável, carta editorial |
| Chrome | **Courier Prime** | rótulos, kickers, carimbos, etiquetas datilografadas |
| Manuscrito | **Caveat** | marginália, etiqueta de herbário, número a lápis |

Antes desta decisão as quatro faces eram **herdadas, não escolhidas** — apareceram no primeiro mockup do leitor e subiram a documento vinculante junto com a direção Papel, sem nunca terem sido postas contra alternativas. Agora foram, e venceram.

### 3.2 A escala — vinculante

Nenhum valor abaixo é sugestão. Mockup novo herda esta tabela; onde ela e um mockup antigo divergirem, **manda a tabela**.

| Uso | Voz | Corpo | Peso | Entrelinha | Tracking | Recursos |
|---|---|---|---|---|---|---|
| Corpo de leitura | Spectral | 16px | 400 | 27px | 0 | hifenização, justificado |
| Corpo, extremo pequeno | Spectral | 12px | 400 | 20px | 0 | idem |
| Corpo, extremo grande | Spectral | 20px | 400 | 34px | 0 | idem |
| Capitular | Spectral | 64px | 500 | display | 0 | — |
| Versalete de abertura | Spectral | 16px | 400 | 27px | .055em | `font-variant: small-caps` |
| Título de capítulo | Spectral | 27px | 300 itálico | 32px | .01em | itálico real |
| Número de celebração | Spectral | 96px | 600 | display | 0 | `tabular-nums` |
| Dado tabular | Spectral | 22px | 600 | 27px | 0 | `tabular-nums`, célula de largura fixa |
| Verbete de dicionário | Spectral | 26px | 600 | 32px | .01em | — |
| Microcopy (frase única) | Spectral | 17px | 300 itálico | 24px | 0 | itálico real |
| Citação compartilhável | EB Garamond | 23px | 400 itálico | 36px | 0 | itálico real |
| Citação, variante curta | EB Garamond | 19px | 400 itálico | 30px | 0 | itálico real |
| Carta editorial | EB Garamond | 17px | 400 itálico | 27px | 0 | itálico real; pauta = passo 27px |
| Kicker micro | Courier Prime | 7,5px | 400 | 12px | .20em | uppercase |
| Kicker padrão | Courier Prime | 8,5px | 700 | 13px | .26em | uppercase |
| Kicker de abertura / carimbo | Courier Prime | 10,5px | 700 | 16px | .34em | uppercase |
| Marginália | Caveat | 16px | 400 | 18px | 0 | `rotate(-3.5°)` |
| Etiqueta manuscrita | Caveat | 22px | 600 | 24px | .01em | `rotate(-1.6°)` |
| Manuscrito de destaque | Caveat | 34px | 600 | 36px | .01em | — |

**Entrelinha sempre em pixel inteiro**, nunca em múltiplo fracionário — exigência da regra 11 (§4.1): pauta e `line-height` precisam ser o mesmo número inteiro.

**O que esta tabela corrigiu.** A escala nunca havia sido formalizada e os mockups divergiam entre si:

- **Entrelinha do corpo:** 1.5 / 1.6 / 1.68 conforme o arquivo → **27px** fixos (o inteiro mais próximo de 16 × 1.68).
- **Corpo em Spectral:** 14 / 15 / 17 / 17,5px conforme o arquivo → **16px** único; 12 e 20px existem só como extremos do controle de corpo.
- **Kickers:** doze combinações de corpo e tracking (5,4 a 12px, .04 a .30em) → **três**. O piso real é 7,5px: abaixo disso o traço de Courier Prime perde a máquina de escrever e vira ruído — os 6,2px vistos em mockup foram **descartados, não arredondados**.
- **Carta editorial:** pauta de fichário de passo 20px, alheia ao texto → passo **27px**, a mesma entrelinha do corpo.

A faixa antiga de kickers declarada aqui — "7,5–9,5px com tracking .18–.38em" — fica **revogada** pelos três valores da tabela.

### 3.3 As faces oferecidas à leitora

`RN-02.16d` torna a família de fonte um dos controles obrigatórios do painel de leitura, mas nenhuma regra dizia **quais** famílias. O catálogo passa a ser fixado em `RN-02.16g` ([`02-biblioteca-e-leitor.md`](02-biblioteca-e-leitor.md)).

Estas faces são **decisão da leitora sobre o próprio texto, não vozes da marca** — não se usa `--leit-sans` nem `--leit-acessivel` em nenhuma superfície de produto fora do corpo da obra.

| Face | Corpo | Entrelinha | Papel no catálogo |
|---|---|---|---|
| **Spectral** | 16px | 27px | padrão |
| **EB Garamond** | 17px | 27px | old-style alternativa |
| **Public Sans** | 15,5px | 26px | sans — obrigatória |
| **Atkinson Hyperlegible** | 17px | 28px | alta legibilidade — obrigatória |
| **Courier Prime** | 13,5px | 24px | monoespaço |

### 3.4 Limites conhecidos do sistema

Registrados porque foram medidos, não supostos:

- **O chrome é uma voz só.** A prancha de rótulos do sistema adotado é inteiramente Courier Prime: as outras três vozes não aparecem onde deveriam contrastar. "Quatro vozes" descreve alternância **entre telas**, não contraste dentro de uma. É uma tese mais modesta do que o nome sugere, e depende de as situações nunca colidirem na mesma superfície.
- **O versalete de Spectral é sintético.** `font-variant: small-caps` sem face de versalete verdadeira. Aceito; se algum dia ficar visível demais, a saída é Spectral SC, não trocar a voz.
- **A citação isolada funciona; dentro da prosa, não.** Ver `Q-DV.10`.

---

## 4. Assinatura mecânica — regras vinculantes

Estas não são sugestões de estilo. São o que faz uma tela nova pertencer ao mesmo produto.

1. **Quase nenhum `border-radius`.** Onde houver, é irregular: `border-radius: 4px 7px 5px 8px / 6px 4px 7px 5px`.
2. **Rotações de imperfeição** em quase tudo — rótulos `-0.7°`, fita crepe `-2.4°`, plaqueta `-0.5°`, carimbo `-9°`, marginália `-3.5°`. Alternar sinais para não virar padrão.
3. **Grão de papel 7×7px** em toda superfície de papel: `radial-gradient(rgba(96,74,46,.075) .5px, transparent .6px)` com `background-size: 7px 7px`.
4. **Bordas sempre `1px solid rgba(124,98,58,.28–.45)`** — tinta marrom translúcida. **Nunca cinza, nunca preto.**
5. **Sombras marrom-quentes**, `rgba(48,32,16,.22–.34)`. **Nunca preto neutro.**
6. **Grifos** com `mix-blend-mode: multiply` e `box-decoration-break: clone`.
7. **Estado selecionado universal:** borda `rgba(47,93,58,.7)` (verde-tinta) + fundo âmbar 16%.
8. **Botão de papel:** relevo sólido de 2px, sem gradiente.
9. **Métrica é tipografia, nunca gráfico de biblioteca de charts.** Sem donuts, sem barras genéricas, sem sparklines de pacote. Réguas desenhadas, tabelas compostas como índice de livro, números grandes em Spectral. Ver `Q-DV.1`.
10. **Dormência é bonita.** `mvp.md` §9: *"uma dormência feia pune; uma dormência linda convida"*. O estado de ausência recebe o mesmo investimento de arte que o estado ativo.
11. **Pauta obriga grade.** Papel pautado só existe se o conteúdo assentar na pauta. Ou tudo orna, ou a folha perde as linhas e fica só com a textura. Ver §4.1 — **é a regra hoje mais violada do repositório.**

### 4.1 A pauta e a grade de base

Linha de pauta não é textura: é **grade**. No momento em que uma folha ganha linhas, ela promete que o conteúdo se apoia nelas — e o olho cobra essa promessa mesmo quando a pessoa não sabe nomear o que está errado. Texto que flutua meio milímetro acima da pauta, e depois um pouco mais na linha seguinte, lê como impressão desalinhada. É o defeito que mais rápido faz um objeto de papel parecer falso.

**A aritmética é simples e não admite aproximação:**

- O **passo da pauta** e o **`line-height`** do texto que corre sobre ela precisam ser o mesmo número inteiro de pixels — ou múltiplos inteiros um do outro. Passo 26px com entrelinha 26.88px acumula quase um pixel de deriva por linha, e some da pauta em vinte linhas.
- As **linhas de base** precisam cair sobre as linhas da pauta, não entre elas. Na página impressa o texto **assenta sobre** o traço; o ajuste é de `background-position-y`, não de tentativa e erro no `padding`.
- **`padding-top` e margens** de quem corre sobre a pauta precisam ser múltiplos do passo, sob pena de jogar todo o bloco fora do registro.

**Três saídas, e só três.** Diante de um elemento que não assenta na pauta:

| Saída | Quando | Como |
|---|---|---|
| **Alinhar** | o conteúdo é texto corrido de uma entrelinha só | passo = entrelinha, linhas de base sobre os traços |
| **Interromper** | o elemento é um objeto pousado na folha — carimbo, plaqueta, ficha, botão | ele é **opaco** e esconde a pauta por baixo, como um objeto real sobre uma página real. A pauta não atravessa o objeto |
| **Remover** | o conteúdo é heterogêneo — números grandes, chips, linhas de tamanhos diferentes | a folha fica só com o grão de papel 7×7px. **Esta é a saída padrão em caso de dúvida** |

A saída **interromper** é a que mais serve à tese de Papel: numa página de verdade, o que você apoia sobre ela tapa as linhas. Um carimbo com pauta atravessando por cima denuncia que nada ali é físico.

**O princípio generaliza.** Qualquer fundo de ritmo regular — pauta, quadriculado, hachura — entra em conflito com texto que não compartilhe esse ritmo. O grão de 7×7px está fora disso: é textura fina o bastante para não criar expectativa de alinhamento.

**Onde a regra está violada hoje** — as duas únicas superfícies pautadas do repositório, ambas fora de registro:

| Onde | Problema |
|---|---|
| `.p-ficha` em [`../mockups/leitor-papel.html`](../mockups/leitor-papel.html) | passo de 26px sem relação com as entrelinhas do conteúdo; a pauta atravessa a cabeça da ficha e os controles |
| `.mw-ficha-w` em [`../mockups/widgets-story.html`](../mockups/widgets-story.html) | passo de 20px contra números em Spectral 19px e um carimbo circular de 40px que corta duas linhas |

Correção em **AJ-9**.

---

## 5. Estado da prototipagem

| Peça | Arquivo | Cobre |
|---|---|---|
| Leitor, 4 estados | [`../mockups/leitor-papel.html`](../mockups/leitor-papel.html) | leitura · controles revelados · painel de tipografia e luz (`RN-02.16d`) · seleção e dicionário |
| 7 telas do MVP | [`../mockups/telas-papel.html`](../mockups/telas-papel.html) | jardim (ativo e dormência) · resumo de sessão + Ghost Reader · biblioteca · onboarding 1 e 2 · caderno de destaques · meu desempenho · fechamento semanal |
| Widgets de story | [`../mockups/widgets-story.html`](../mockups/widgets-story.html) | 13 widgets compartilháveis em quatro famílias: adesivos sobre foto, cards cheios 9:16, o dado como forma, citação. Seis materiais de papel e tinta |
| Sistema tipográfico | [`../mockups/tipografia-quatro-vozes.html`](../mockups/tipografia-quatro-vozes.html) | as 8 situações tipográficas do produto · a escala de §3.2 · o painel de faces da leitora · prova de estresse a 12 e 20pt |
| Referência descartada | [`../mockups/telas-noturno.html`](../mockups/telas-noturno.html) | fonte das 4 telas a herdar — ver §6 |
| Referências descartadas | [`../mockups/tipografia-duas-vozes.html`](../mockups/tipografia-duas-vozes.html) · [`../mockups/tipografia-uma-voz.html`](../mockups/tipografia-uma-voz.html) | os dois sistemas tipográficos perdedores — ver §3.1 |

**A referência viva mudou.** Desde a criação de [`design-system.md`](design-system.md), quem manda é o catálogo [`../mockups/design-system.html`](../mockups/design-system.html). As peças abaixo passam a ser **evidência histórica**, em débito declarado — `RN-DS.19`.

Os widgets de story já nascem com `--verde-tinta`. As demais peças ainda usam o oxblood: a migração (§2, **AJ-1**) é o primeiro item do backlog.

O mockup do sistema tipográfico é a única peça que já nasce com a escala de §3.2 aplicada. **Todas as demais precedem a escala e divergem dela** — ver **AJ-11**.

---

## 6. Backlog de ajustes

Decidido, ainda não executado. Cada item é uma correção nomeada para a próxima rodada de mockups.

| # | Ajuste | Onde | Origem |
|---|---|---|---|
| **AJ-1** | **Migrar o acento de oxblood para `--verde-tinta`.** Troca mecânica de `#8e2f26` e de todos os `rgba(142,47,38,α)`, mais os dois tons de carimbo. **Exceção:** o que aparece sobre o `--mesa` — a fita de marcador à frente — precisa ser **redesenhada**, não reconvertida | `leitor-papel.html`, `telas-papel.html` | §2 |
| **AJ-2** | **Exibir as estatísticas da leitura já na tela de vitória do onboarding** (passo 2), em vez de só a celebração. O objetivo é ensinar o vocabulário de métrica — tempo ativo, páginas canônicas, Leitura Consciente — no momento em que a pessoa acabou de vivê-lo | Onboarding passo 2 | `RN-01.5b`, `RN-01.5c` |
| **AJ-3** | **Repensar a seleção de obra no caderno de destaques.** O filtro atual é um trilho de abas por obra: funciona com 4 livros, quebra com 40. Precisa de um padrão que escale — busca, agrupamento, ou entrada pela obra em vez de filtro sobre a lista | Caderno de destaques | Ver `Q-DV.2` |
| **AJ-4** | **Herdar 4 telas de Noturno para Papel:** mapa de constância · celebração de marco · meta diária · notificação na tela de bloqueio. Traduzir a solução, não copiar a forma — ver a nota abaixo | Novas telas | §6.1 |
| **AJ-5** | **Desenhar o feed e o menu de navegação global.** Nenhum dos dois existe em mockup, e a navegação global não está especificada em módulo nenhum. Ver `Q-DV.3` e a ressalva de escopo abaixo | Novas telas | Pedido direto |
| ~~**AJ-6**~~ | **Concluído.** Primeira rodada de widgets de story, prototipada em [`../mockups/widgets-story.html`](../mockups/widgets-story.html) e revisada. Catálogo aprovado em `RN-08.33`; vereditos de desenho em §6.4 | `mockups/widgets-story.html` | Pedido direto |
| **AJ-7** | **Segunda rodada de widgets.** Três frentes: **(a)** redesenhar o traço da sessão, em card cheio e adesivo (`Q-DV.7`); **(b)** recompor jornada da obra, fechamento semanal e marco de ofensiva sob `RN-08.35`, com o repertório de §6.4 (`Q-DV.9`); **(c)** desenhar o resumo de sessão nas duas formas e a interface de escolha de destaque (`RN-08.6a`). Peças aprovadas sem ressalva não voltam à prancha | Nova rodada | §6.4 |
| **AJ-8** | **Encontrar a representação do progresso da obra.** O dado segue compartilhável (`RN-08.36`); a espessura do corte foi reprovada e não há substituto | Novo widget | `Q-DV.8` |
| **AJ-9** | **Pôr as superfícies pautadas em registro.** As duas que existem estão fora: `.p-ficha` (passo 26px) e `.mw-ficha-w` (passo 20px). Para cada uma, escolher entre alinhar, interromper ou remover — §4.1. Vale também como varredura preventiva: nenhuma superfície nova ganha pauta sem grade | `leitor-papel.html`, `widgets-story.html` | §4.1 |
| **AJ-10** | **Separar Biblioteca e Estante na tela de biblioteca.** O mockup mostra obras concluídas junto das em leitura; `RN-02.6a` agora manda a concluída para a Estante e deixa a Biblioteca só com o backlog. Some a aba de concluídos; a Estante precisa de tela própria, que ainda não existe em mockup nenhum | `telas-papel.html` | `RN-02.6a` |
| **AJ-11** | **Aplicar a escala de §3.2 aos mockups existentes.** Todos precedem a escala e divergem dela: corpo em Spectral a 14 / 15 / 17 / 17,5px onde a escala fixa 16px, entrelinhas em múltiplo fracionário onde a regra 11 exige pixel inteiro, e doze combinações de kicker onde a escala admite três — inclusive valores abaixo do piso de 7,5px, que não se arredondam, se descartam. Passa a valer também como varredura preventiva: mockup novo herda a tabela, não o arquivo vizinho | `leitor-papel.html`, `telas-papel.html`, `widgets-story.html` | §3.2 |
| **AJ-13** | **Migrar as três peças para o catálogo:** tokens de superfície (`--sup-*`), prefixo único `bw-`, escala tônica de espaçamento e as seis rotações nomeadas. Absorve e amplia `AJ-11`, que tratava só da tipografia. O levantamento mediu o tamanho da dívida: 51 sombras distintas, 49 valores de espaçamento, 54 rotações | `leitor-papel.html`, `telas-papel.html`, `widgets-story.html` | `design-system.md` §12 |
| **AJ-14** | **Verificar o Anexo A num app RN Android mínimo** e produzir o PNG 7×7 tileável do grão. Seis das treze linhas da tradução são hipótese, e é a pergunta de maior consequência do design system: quanto da assinatura sobrevive no Android | Novo | `Q-DS.5` |
| **AJ-12** | **Trocar as faces do painel de leitura pelo catálogo de `RN-02.16g`.** O painel do mockup oferece Spectral, Garamond e monoespaço — duas old-style quase equivalentes e uma curiosidade, sem sans e sem face de alta legibilidade. Entram Public Sans e Atkinson Hyperlegible | `leitor-papel.html` | `RN-02.16g` |

### 6.1 Nota sobre AJ-4 — traduzir, não copiar

As quatro telas de Noturno resolvem problemas reais, mas resolvem-nos **com luz**, que é o material daquela direção. Papel não tem luz; tem tinta, carimbo e relevo. A herança é do *problema resolvido*, não da forma:

| Tela | O que Noturno resolveu | Como Papel precisa resolver |
|---|---|---|
| Mapa de constância | Intensidade como brilho, evitando o heat map verde-vermelho de engenharia | Densidade de tinta ou pressão de carimbo — quanto mais constante, mais saturada a marca no papel |
| Celebração de marco | Raios de luz, numeral tomando a tela | Selo em relevo, lacre, gravura — o vocabulário de diploma e ex-libris |
| Meta diária | Folha que declara "grátis, sempre" de saída | Mesma promessa, em ficha de fichário |
| Notificação | Convite, nunca aviso de perda | Idem — o teste aqui é de copy, e o resultado de Noturno é reaproveitável quase inteiro |

### 6.2 Ressalva de escopo sobre AJ-5

O **feed de pílulas literárias é Fase 2** em [`mvp.md`](mvp.md) §6, e depende de autores publicando (`Q-05.3` registra que sem eles ele nasce vazio). Desenhá-lo agora é exploração de identidade visual e **não altera o corte do MVP** — o feed continua fora da primeira versão. Registrado aqui para que o mockup não seja lido depois como promessa de escopo.

O **menu de navegação**, ao contrário, é MVP e é uma **lacuna real da especificação**: nenhum módulo define a estrutura de navegação global do app. Ver `Q-DV.3`.

---

### 6.3 O que os widgets de story trouxeram para `08`

**Revisado.** As três pendências levantadas na prototipagem foram decididas — as duas primeiras resolvidas, a terceira sem resposta possível. As regras vivem em [`08-social-sharing.md`](08-social-sharing.md) §5.7; aqui fica o que muda no **desenho**.

**1. O adesivo sobre foto não existe na especificação.** Varredura em todo `specs/`: nenhuma regra menciona fundo transparente, sticker, overlay sobre foto do usuário, ou qualquer formato que não seja um retângulo cheio. `RN-08.23` exporta PNG 1080×1920, e ali "PNG" é formato de arquivo, não canal alfa. O formato colide com três regras vigentes:

| Regra | Colisão |
|---|---|
| `RN-08.13` | a marca é não removível — num adesivo ela precisa sobreviver sobre qualquer fundo, sem a superfície de papel que hoje a sustenta |
| `RN-08.9` | "um tema define paleta, tipografia, tratamento da capa, **textura de fundo** e estilo dos numerais" — num adesivo a textura de fundo deixa de existir |
| `RN-08.22` | as proporções são fixas (9:16, 1:1, 4:5); o adesivo tem dimensão livre |

**Resolvido:** `RN-08.22a` estabelece o adesivo como formato de primeira classe, com PNG de canal alfa e dimensão livre, e trata as três colisões uma a uma. A razão registrada é de comportamento: o card cheio substitui a foto da pessoa, o adesivo a acompanha — e quem posta quer mostrar o próprio momento. `Q-08.5` (integração com APIs de rede social) segue aberta e é o que separaria um sticker nativo de uma imagem entregue à folha de compartilhamento.

**2. `blocos_visiveis` e `RN-03.22b` discordavam.** A entidade `PreferenciasCard` tinha cinco chaves e nenhuma para **estilo de leitura**, que `RN-03.22b` manda caber no card. **Resolvido:** o modelo ganhou a chave `estilo`, mais o campo `destaque`, que sustenta a métrica de manchete escolhível de `RN-08.6a`.

**3. `Q-08.6` não tem como ser respondida com o material do repositório.** Ela pergunta se o exemplo visual de widget do rascunho é direção estética a seguir. O exemplo é uma referência de imagem quebrada — `![][image1]` em [`../BookWorm.md`](../BookWorm.md) L41 — e a imagem não está versionada. Ou o arquivo original aparece, ou a questão deveria ser aposentada em vez de seguir aberta indefinidamente.

### 6.4 Vereditos de desenho dos widgets

O catálogo do produto é `RN-08.33`. Aqui fica **o que o desenho precisa fazer** com cada peça na próxima rodada.

| Peça | Veredito de desenho |
|---|---|
| **Carimbo de sessão** | Mantém como está. Serve de referência de acabamento para as demais |
| **Ficha de empréstimo** | Mantém |
| **Número a lápis** | Mantém |
| **Citação grifada** | **Mantém sem alteração.** É a peça mais bem resolvida do conjunto e passa a ser a régua de qualidade do catálogo |
| **Mapa de constância** | Mantém |
| **Resumo de sessão** | **Peça nova em duas formas** — card cheio e adesivo, mesmo dado. O card cheio herda o Ex-líbris, redesenhado sob `RN-08.35` |
| **Traço da sessão** | **Redesenhar do zero.** A ideia está firmada (`RN-08.34`); a linha contínua está vetada. Precisa também de versão adesivo. Ver `Q-DV.7` |
| **Jornada da obra** · **Fechamento semanal** · **Marco de ofensiva** | **Recompor sob `RN-08.35`** — os três têm grandes áreas vazias. Ver a nota abaixo |

**Retiradas:** etiqueta datilografada (não se sustenta como algo postável), corte do livro (representação de progresso reprovada), retomada (compartilhar quebra de ofensiva não se sustentou — mas `RN-08.28` continua vigente e dizendo o contrário; ver `Q-08.9`).

#### O vazio dos cards cheios é um problema da direção, não das peças

Três das quatro peças de card cheio receberam a mesma crítica: espaço sem nada. Isso não é coincidência de execução — é consequência direta de duas regras da assinatura mecânica de §4.

A regra 9 — *"métrica é tipografia, nunca gráfico de biblioteca de charts"* — remove do desenho os elementos que normalmente preenchem um card de compartilhamento: anéis de progresso, barras, gráficos. E a tese de Papel privilegia a página de livro, cuja virtude é justamente a margem generosa. Uma página de livro é bela **na mão, em repouso**; um card de Story disputa atenção num feed em rolagem. **A mesma margem que dá elegância à página lê como rascunho no feed.**

`RN-08.35` transforma isso em requisito. O desenho precisa de um repertório de preenchimento que não seja gráfico nem ruído:

- **Ornamento tipográfico** — fleurões, filetes duplos, cercaduras, capitulares, colofão. É o vocabulário histórico do objeto-livro para ocupar página com dignidade, e está inteiramente disponível dentro do pilar.
- **A obra como matéria visual** — capa, lombada, corte, o próprio texto compondo fundo.
- **Densidade tipográfica deliberada** — corpo maior, entrelinha menor, texto como textura, no espírito de uma folha de rosto ou de um cartaz tipográfico do século XIX.

Isto é uma **exceção declarada à leitura literal da regra 9**: no ativo compartilhado, ocupar a superfície é função, não decoração. A regra continua valendo contra gráficos de pacote; ela não pode ser lida como licença para deixar metade do card vazio.

---

## 7. Questões em aberto

Prefixo novo, `Q-DV`, conforme a convenção de IDs de [`00-overview.md`](00-overview.md) §7.

| ID | Questão |
|---|---|
| `Q-DV.1` | **Como Papel mostra tendência ao longo do tempo sem virar dashboard?** Tipografia comunica um número isolado muito bem e resiste a mostrar séries. A régua de tiques usada em "Meu desempenho" é um compromisso, não uma solução. Isto afeta o módulo `03` inteiro |
| `Q-DV.2` | **Qual o padrão de seleção de obra que escala?** Vale para o caderno de destaques, a biblioteca e a estante — os três hoje assumem um acervo pequeno |
| ~~`Q-DV.3`~~ | **Resolvida.** Quatro destinos — Jardim, Biblioteca, Caderno, Desempenho — em **abas de fichário** na borda inferior, opacas, interrompendo a mesa. O leitor é modo, não destino (`RN-DS.18`). Perfil e Configurações não são de primeiro nível. Decisão, alternativas descartadas e razão em [`design-system.md`](design-system.md) §10 |
| `Q-DV.4` | **A biblioteca escala sem arte de capa?** Noturno registrou o risco: composições tipográficas funcionam com 4 livros e viram papel de parede da marca com centenas. Papel resolveu tratando a capa como objeto físico, o que provavelmente escala melhor — mas não foi testado em volume |
| ~~`Q-DV.5`~~ | **Resolvida.** O adesivo sobre foto é formato de primeira classe — `RN-08.22a` |
| ~~`Q-DV.6`~~ | **Resolvida.** A manchete é **escolhida pelo usuário** — `RN-08.6a`. O lugar que estava vago não foi preenchido por decisão de design, e sim devolvido a quem posta |
| `Q-DV.7` | **Qual a forma do traço da sessão?** Representar a sessão como forma abstrata está firmado (`RN-08.34`); a linha contínua de mapa de rota está vetada, por importar vocabulário de esporte. É a peça de maior potencial do catálogo e a única sem solução visual. Espelha `Q-08.7` |
| `Q-DV.8` | **Como representar o progresso da obra?** A espessura do corte de páginas foi reprovada e o dado segue compartilhável (`RN-08.36`). Espelha `Q-08.8` |
| `Q-DV.9` | **Qual o repertório de preenchimento dos cards cheios?** §6.4 propõe ornamento tipográfico, a obra como matéria visual e densidade deliberada. Nenhum dos três foi testado — e é o que decide se Papel funciona num feed, não só na mão. A escala de §3.2 é a pré-condição do ornamento tipográfico, e agora existe |
| `Q-DV.10` | **Como a citação se distingue quando aparece dentro da prosa, e não isolada em card?** EB Garamond só ganha o lugar dela porque nunca disputa espaço com Spectral na mesma superfície. Onde as duas old-style precisam conviver de perto — uma citação em itálico dentro de um parágrafo que já é Garamond itálico, como na carta editorial — a diferença some, e o itálico deixa de sinalizar porque já marca fala e ênfase no corpo. É a peça mais frágil do sistema adotado (§3.4) e não tem solução visual proposta |

---

## 8. Convergência promovida a regra

Os dois protótipos, produzidos sem contato entre si, chegaram independentemente à mesma conclusão sobre o estado de dormência: **o número da ofensiva vira memória, não contador vivo.**

- Papel: *"a marca de 23 dias fica guardada aqui"*, sob o rótulo `GUARDADOS`, ao lado de `RECORDE 41`.
- Noturno: *"sua sequência chegou a 23 dias"*.

Nenhum dos dois exibiu "23 dias" como se a ofensiva ainda estivesse de pé — e nenhum dos dois o descartou.

Isso expõe uma lacuna real da spec. `RN-04.14` define **dois** números na tela: *"ofensiva atual e melhor marca, nesta ordem"*. `RN-04.25` cuida da estética da dormência e `RN-04.27` do acervo histórico. Mas na dormência a ofensiva atual é **zero** e o recorde é **41** — e a sequência de 23 dias que acabou de terminar não é nenhum dos dois. Os dois protótipos inventaram, independentemente, um **terceiro número** que a especificação não prevê.

**Incorporado.** A convergência virou `RN-04.14a` em [`04-streaks-e-jardim.md`](04-streaks-e-jardim.md) §5.2, com critério de aceitação sob `GAM-09`, campos `contagem_encerrada` e `encerrada_em` na entidade `Ofensiva`, e o estado de Dormência da tela do jardim atualizado. Entrou no corte do MVP ([`mvp.md`](mvp.md) §4.3).

Fica o registro do caminho, porque ele é o argumento a favor de prototipar antes de especificar: **a regra não veio de uma revisão da spec, veio de duas implementações independentes tropeçando no mesmo buraco.** Nenhum dos dois agentes tinha instrução sobre o assunto; os dois se recusaram a escrever um "23" solto numa tela de ofensiva quebrada, porque a tela mentiria.
