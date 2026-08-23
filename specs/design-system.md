# BookWorm — Design System

> Documento **vinculante**. É a camada operacional de [`direcao-visual.md`](direcao-visual.md):
> onde aquele documento decide **por quê**, este decide **como**, em tokens, componentes e estados
> que uma tela nova consegue consumir sem reabrir nenhuma decisão.
> Ponto de entrada das specs: [`00-overview.md`](00-overview.md).

---

## 1. O que este documento é

`direcao-visual.md` estabeleceu o pilar Papel, a identidade verde, o sistema tipográfico Quatro Vozes e onze regras de assinatura mecânica. O que faltava era **sistema**: um conjunto nomeado de peças que uma tela nova herda em vez de recriar.

A falta foi medida, não suposta. As três peças de referência do repositório — [`leitor-papel.html`](../mockups/leitor-papel.html), [`telas-papel.html`](../mockups/telas-papel.html) e [`widgets-story.html`](../mockups/widgets-story.html) — somam **401 classes com reuso zero entre si**, cada uma sob seu próprio prefixo (`p-`, `tp-`, `mw-`) e com seu próprio conjunto de tokens redeclarado. O levantamento completo está em §12.

### Autoridade

| Documento | Manda em |
|---|---|
| [`direcao-visual.md`](direcao-visual.md) | A tese, a identidade, a escala tipográfica de §3.2, as 11 regras de assinatura |
| **Este documento** | Tokens nomeados, componentes, estados, plataforma, acessibilidade, movimento, navegação |

Onde os dois divergirem, **manda `direcao-visual.md`**. Este documento **referencia** a escala tipográfica e nunca a repete — repetir é o mecanismo exato que produziu a divergência que §12 mede.

- `RN-DS.19` — **Tela ou mockup novo herda este catálogo, não o arquivo vizinho.** É a generalização de `AJ-11`, que estabeleceu a mesma regra para a tipografia.

### Relação com os mockups

Até aqui, `leitor-papel.html` e `telas-papel.html` eram "a referência viva". **Deixam de ser.** O catálogo [`design-system.html`](../mockups/design-system.html) passa a ser a referência; as três peças viram **evidência histórica**, em débito declarado por `AJ-1`, `AJ-9`, `AJ-11` e `AJ-12`, mais os achados de §12.

### Convenções

IDs de regra: **`RN-DS.n`**. IDs de questão: **`Q-DS.n`**. Nunca reciclados. Nomenclatura em **PT-BR**: os nomes *são* o design — `carimbo`, `ficha`, `fita`, `marginália` carregam a tese de Papel, e traduzi-los para `stamp` ou `card` a perderia. Prefixo de classe único **`bw-`**, substituindo `tp-`, `p-` e `mw-`.

---

## 2. Arquitetura de tokens — três camadas

### O problema que ela resolve

A regra de `direcao-visual.md` §2 — **"o verde-tinta vive sobre papel"** — é hoje algo que a pessoa precisa lembrar. Sobre `--mesa`, sobre o cianótipo `#1d3a56` ou sobre o carvão `#221f1b`, o acento verde rende **2,09:1** e desaparece. Nada no CSS impede escrevê-lo ali.

[`widgets-story.html`](../mockups/widgets-story.html) **já havia resolvido isso sozinho**, sem instrução: seis materiais rebindam `--papel-loc` e `--acento-loc` localmente, e o acento muda com a superfície — kraft vira marrom, carvão vira âmbar, cianótipo vira azul-claro. Este documento **promove essa invenção** em vez de criar outra.

### As camadas

| # | Camada | Contém | Regra de acesso |
|---|---|---|---|
| 1 | **Pigmento** | Valores crus da paleta | **Nunca lido por um componente.** Só uma superfície pode lê-lo |
| 2 | **Superfície** | Um material rebinda os cinco `--sup-*` | Todo componente vive dentro de uma superfície e lê só `--sup-*` |
| 3 | **Papel semântico** | Função no produto (`--acao-primaria`, `--selecionado-*`) | Resolve para camada 2, nunca para camada 1 |

- `RN-DS.1` — **Componente nunca lê pigmento direto.** `color: var(--verde-tinta)` num componente é erro de sistema; o correto é `var(--sup-acento)`.
- `RN-DS.2` — **Todo componente declara a superfície em que vive.** Não há componente "solto".
- `RN-DS.3` — **Uma superfície rebinda os cinco: fundo, tinta, acento, borda, sombra.** Sempre os cinco, nunca um subconjunto — rebindar só o fundo é o que produz acento invisível.

**A consequência que justifica o desenho:** um componente colocado numa superfície escura recebe o acento correto **por construção**. A regra deixa de ser disciplina e vira mecânica.

### 2.1 Camada 1 — Pigmentos

Herdados de `direcao-visual.md` §3, sem alteração de valor.

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
--verde-tinta:  #2f5d3a;
--ambar:        #e6c15c;
--mesa:         #1e2320;

/* 4 pigmentos de grifo — ferramenta da leitora, não da marca */
--pig-ambar:  #e7c25e;
--pig-oliva:  #a8b07a;
--pig-tinta:  #93a9c0;
--pig-carmim: #d79aa2;
```

As quatro vozes (`--serif`, `--garamond`, `--mono`, `--lapis`) e as faces da leitora (`--leit-sans`, `--leit-acessivel`) são as de `direcao-visual.md` §3, sem alteração. A escala vive em §3.2 daquele documento e **não é repetida aqui**.

### 2.2 Camada 2 — Superfícies

Um material declara `--sup-fundo`, `--sup-tinta`, `--sup-tinta-fraca`, `--sup-acento`, `--sup-borda`, `--sup-sombra`, `--sup-grao`.

Contrastes **calculados, não estimados** (WCAG 2.1, tinta e acento contra o próprio fundo):

| Material | Fundo | Tinta | Acento | Tinta | Acento | Uso |
|---|---|---|---|---|---|---|
| `mesa` | `#1e2320` | creme | `--ambar` | 11,75 | 9,23 | Pano de fundo de toda a página. Não recebe texto de leitura |
| `papel` | `#f3ead9` | `--tinta` | `--verde-tinta` | 13,68 | **6,40** | Superfície padrão do produto |
| `papel-fundo` | `#efe3ce` | `--tinta` | `--verde-tinta` | 12,88 | 6,02 | Folha ao fundo, segundo plano |
| `sepia` | `#e7d5b4` | `#3a2e20` | `--verde-tinta` | 9,16 | 5,30 | Peça envelhecida, card |
| `kraft` | `#c8a97e` | `#2b2117` | `#8a5a12` | 7,08 | **2,66 ✗** | Card. Ver `Q-DS.1` |
| `vegetal` | translúcido | `--tinta` | `--verde-tinta` | 12,92 | 6,04 | Papel vegetal sobreposto |
| `carvao` | `#221f1b` | `#e8dcc4` | `--ambar` | 12,08 | 9,49 | Card escuro |
| `cianotipo` | `#1d3a56` | `#dce8f2` | `#dce8f2` | 9,41 | 9,41 | Card, cianotipia |

**Kraft é o único material cujo acento reprova** — 2,66:1, abaixo do piso de 3:1 para elemento não textual portador de significado. Registrado em `Q-DS.1`.

**Tintas fracas sobre papel**, medidas depois de compostas:

| Token | Cor efetiva | Contraste | Veredito |
|---|---|---|---|
| `--tinta-70` | `#5e584f` | 5,89:1 | **Texto de qualquer corpo** |
| `--tinta-50` | `#878075` | 3,27:1 | Só texto grande (≥ 22px) |
| `--tinta-32` | `#ada598` | 2,04:1 | **Nunca texto.** Borda e filete |
| `--tinta-16` | `#d2caba` | 1,36:1 | **Nunca texto.** Grão, fundo, filete |

- `RN-DS.11` — **Texto nunca em tinta abaixo de 4,5:1.** Kicker, por ser o menor tipo do sistema (7,5–10,5px), usa `--tinta-70` ou mais forte, **sempre**. Isto corrige 60 usos existentes — ver §12.

### 2.3 Camada 3 — Papéis semânticos

| Token | Resolve para |
|---|---|
| `--acao-primaria` | `var(--sup-acento)` |
| `--acao-primaria-tinta` | `var(--sup-fundo)` |
| `--selecionado-borda` | acento da superfície a 70% |
| `--selecionado-fundo` | âmbar a 16% |
| `--dormencia-tinta` | `var(--sup-tinta-fraca)` |
| `--foco-anel` | `var(--sup-acento)` |

O estado selecionado universal é a regra 7 de `direcao-visual.md` §4: borda de acento a 70% + fundo âmbar 16%. Ele agora resolve por superfície, então funciona igual sobre carvão e sobre papel.

---

## 3. Escala de espaçamento e grade

Não existia. O levantamento encontrou **49 valores distintos** em `padding`, `margin` e `gap`, com **todo inteiro de 1 a 20 em uso** — ou seja, nenhuma escala.

A regra 11 de `direcao-visual.md` (**"pauta obriga grade"**) exige que passo de pauta e entrelinha sejam o mesmo número inteiro. A escala de espaçamento é ancorada no mesmo número, para que exista **um sistema numérico só**:

| Token | Valor | Uso típico |
|---|---|---|
| `--esp-0` | 0 | — |
| `--esp-1` | 3px | Filete, folga de carimbo |
| `--esp-2` | 6px | Interno de chip, gap de ícone e rótulo |
| `--esp-3` | 9px | Interno de botão (vertical) |
| `--esp-4` | 12px | Gap entre controles irmãos |
| `--esp-5` | 18px | Interno de ficha e cartão |
| **`--esp-6`** | **27px** | **Entre blocos. = entrelinha do corpo = passo da pauta** |
| `--esp-7` | 36px | Margem de folha |
| `--esp-8` | 54px | Respiro de abertura de tela |
| `--esp-9` | 81px | Cerimônia, celebração |

- `RN-DS.4` — **Espaçamento só desta escala.** Valor fora dela é erro, não ajuste fino.
- `RN-DS.5` — **`--esp-6` é o ancoradouro.** Padding vertical e margem de qualquer bloco que corra sobre pauta é múltiplo de 27px (§4.1 de `direcao-visual.md`).

Isto obriga migração dos mockups existentes: 4, 8, 14, 16 e 26px, hoje os valores mais usados, mapeiam para 3, 9, 12, 18 e 27. O precedente é `AJ-11` — divergência com mockup antigo **resolve-se a favor da tabela, sempre**.

---

## 4. Geometria

### 4.1 Raio

Regra 1: quase nenhum; irregular onde houver.

| Token | Valor | Uso |
|---|---|---|
| `--raio-nenhum` | 0 | **Padrão.** Folha, ficha, botão, campo |
| `--raio-minimo` | 2px | Chip, plaqueta |
| `--raio-irregular-p` | `3px 6px 4px 7px / 5px 3px 6px 4px` | Cartão pequeno, adesivo |
| `--raio-irregular-m` | `4px 7px 5px 8px / 6px 4px 7px 5px` | Cartão, etiqueta |
| `--raio-circulo` | 50% | **Só carimbo e selo** |

- `RN-DS.8` — Raio zero é o padrão. Círculo é exclusivo de carimbo e selo; um botão redondo não pertence a este produto.

### 4.2 Borda

- `RN-DS.7` — **Borda nunca cinza, nunca preta.** Sempre tinta marrom translúcida (regra 4). O levantamento encontrou **zero violações** desta regra nas três peças: ela é a única da assinatura que se sustentou sozinha, e a razão é que já estava escrita como valor concreto e não como princípio.

| Token | Valor |
|---|---|
| `--borda-fina` | `1px solid var(--sup-borda)` |
| `--borda-marcada` | `2px solid var(--sup-acento)` |
| `--borda-provisoria` | `1.5px dashed var(--sup-acento)` |

### 4.3 Sombra — e a exceção que a regra 5 precisava

Regra 5 manda sombra marrom-quente e **proíbe preto neutro**. O levantamento encontrou **10 violações** nas três peças. Elas não são desleixo: quase todas são objetos pousados sobre o `--mesa`, onde `rgba(48,32,16,α)` fica a poucos passos do próprio fundo e a sombra some.

É a mesma forma de problema que "verde vive sobre papel" — **uma regra escrita para papel, aplicada onde não há papel.** A arquitetura de §2 resolve por construção:

- `RN-DS.6` — **`--sup-sombra` é rebindado pela superfície.** Sobre papel, marrom-quente. Sobre superfície escura (mesa, carvão, cianótipo), neutra profunda. A proibição de preto neutro passa a valer **sobre papel**, que é onde ela sempre fez sentido.

| Token | Sobre papel | Sobre superfície escura |
|---|---|---|
| `--sombra-pousado` | `0 2px 5px rgba(48,32,16,.22)` | `0 2px 6px rgba(0,0,0,.38)` |
| `--sombra-erguido` | `0 8px 16px rgba(48,32,16,.28)` | `0 10px 22px rgba(0,0,0,.45)` |
| `--sombra-flutuante` | `0 18px 34px rgba(48,32,16,.34)` | `0 34px 60px rgba(0,0,0,.62)` |
| `--relevo` | `inset 0 1px 0 rgba(255,255,255,.28)` | idem |

### 4.4 Rotação

Regra 2: rotações de imperfeição, sinais alternados. O levantamento encontrou **54 valores distintos em 86 usos** — aleatoriedade, não sistema.

| Token | Valor | Objeto |
|---|---|---|
| `--gir-plaqueta` | `-0.5deg` | Plaqueta, cartão |
| `--gir-rotulo` | `-0.7deg` | Rótulo datilografado |
| `--gir-etiqueta` | `-1.6deg` | Etiqueta manuscrita |
| `--gir-fita` | `-2.4deg` | Fita crepe |
| `--gir-marginalia` | `-3.5deg` | Marginália |
| `--gir-carimbo` | `-9deg` | Carimbo |

- `RN-DS.9` — **Só rotações do conjunto nomeado, com sinais alternados** entre elementos vizinhos. Dois objetos adjacentes com a mesma rotação viram padrão, e padrão é o oposto de imperfeição.

---

## 5. Primitivas da assinatura

As 11 regras de `direcao-visual.md` §4 viram primitivas nomeadas. Cada uma carrega intenção neutra de plataforma; as receitas por plataforma estão no Anexo A (§11).

| ID | Primitiva | Intenção |
|---|---|---|
| `P-1` | **Grão de papel** | Toda superfície de papel tem textura fina de 7×7px, abaixo do limiar de expectativa de alinhamento |
| `P-2` | **Luz sobre a folha** | Clareamento radial no canto superior esquerdo: a folha é iluminada por uma fonte fora da tela |
| `P-3` | **Relevo de papel** | Borda superior clara de 1px: o objeto tem espessura |
| `P-4` | **Sombra de objeto pousado** | Três alturas (§4.3), rebindadas por superfície |
| `P-5` | **Rotação de imperfeição** | Nada é perfeitamente ortogonal; nada repete o mesmo desvio |
| `P-6` | **Raio irregular** | Onde houver canto arredondado, os quatro diferem |
| `P-7` | **Grifo multiplicado** | Pigmento escurece o que está sob ele, como marca-texto real |
| `P-8` | **Carimbo** | Tinta seca, irregular, rotacionada, opaca — interrompe o que está por baixo |
| `P-9` | **Botão de papel** | Relevo sólido de 2px, sem gradiente; afunda ao toque |
| `P-10` | **Interrupção da pauta** | Objeto pousado sobre folha pautada é opaco e esconde as linhas |
| `P-11` | **Métrica como tipografia** | Número, régua desenhada e tabela-índice. Nunca gráfico de biblioteca |
| `P-12` | **Dormência com arte** | O estado de ausência recebe o mesmo investimento do estado ativo |

---

## 6. Inventário de componentes

Derivado das telas dos módulos do corte do MVP ([`mvp.md`](mvp.md) §4.1–4.6). Cada componente declara: superfície, tokens que consome, estados aplicáveis, e o que anuncia ao leitor de tela.

### 6.1 Superfícies e recipientes

| Componente | Uso | Estados | Anúncio |
|---|---|---|---|
| `bw-folha` | Superfície de conteúdo | repouso, carregando, vazio, offline | região |
| `bw-ficha` | Ficha de fichário. **Pautada — obriga grade** (§4.1 de `direcao-visual.md`) | repouso, selecionado | grupo |
| `bw-cartao` | Cartão solto sobre a mesa | repouso, pressionado | conforme conteúdo |
| `bw-plaqueta` | Rótulo pousado com dado curto | repouso | o dado |
| `bw-etiqueta` | Etiqueta datilografada | repouso | o texto |
| `bw-lamina` | Lâmina de herbário (acervo, marco) | repouso, vazio | o item |
| `bw-item` | **Linha tocável de lista**: obra, sessão, marco, destaque | repouso, pressionado, selecionado, vazio | o conteúdo da linha + "botão" |

### 6.2 Chrome e navegação

| Componente | Uso | Estados | Anúncio |
|---|---|---|---|
| `bw-shell` | Casca do app: mesa + destinos | — | — |
| `bw-abas-fichario` | Navegação de primeiro nível (§10) | repouso, ativo, pressionado | destino + "selecionado" |
| `bw-cabeca` | Cabeçalho de tela: título + retorno + ação | repouso | cabeçalho |
| `bw-gaveta` | Painel que entra pela borda | fechado, abrindo, aberto | diálogo |

### 6.3 Controles

| Componente | Uso | Estados | Anúncio |
|---|---|---|---|
| `bw-botao` | Ação. Variantes: primário, secundário, texto (`P-9`) | repouso, pressionado, desabilitado, carregando | rótulo + papel |
| `bw-chip` | Filtro, aba secundária | repouso, selecionado, desabilitado | rótulo + estado |
| `bw-segmentado` | Escolha exclusiva curta (período, estágio) | repouso, selecionado | grupo + selecionado |
| `bw-campo` | Entrada de texto | repouso, foco, erro, desabilitado | rótulo + erro |
| `bw-deslizante` | Corpo, luz, temperatura (`RN-02.16d`) | repouso, arrastando, desabilitado | rótulo + valor **falado** |
| `bw-alternador` | Liga/desliga | ligado, desligado, desabilitado | rótulo + estado |
| `bw-pigmentos` | Escolha entre os 4 pigmentos de grifo | repouso, selecionado | nome do pigmento |
| `bw-importar` | **Área de importação de EPUB/PDF** (`RN-02.1d`) | repouso, arrastando, carregando, erro | rótulo + formato aceito |

### 6.4 Dado — sempre tipografia (`P-11`)

| Componente | Uso | Estados | Anúncio |
|---|---|---|---|
| `bw-numero-celebracao` | Spectral 96px, `tabular-nums` | repouso, entrando | **o número e o que ele mede** |
| `bw-dado-tabular` | Spectral 22px, célula de largura fixa | repouso, carregando, vazio | rótulo + valor |
| `bw-regua` | Régua de tiques para série temporal | repouso, vazio | resumo textual da série |
| `bw-tabela-indice` | Tabela composta como índice de livro | repouso, vazio, carregando | tabela com cabeçalhos |
| `bw-carimbo` | Marca de sessão, meta, marco (`P-8`) | repouso, batendo | **o dado, nunca "imagem"** |
| `bw-mapa-constancia` | Densidade de tinta por dia (`RN-08.17`–`RN-08.22`) | repouso, vazio | resumo + dia a dia sob demanda |
| `bw-progresso-dia` | Progresso da meta diária | vazio, parcial, cumprido | percentual + estado |

### 6.5 Leitura

| Componente | Uso | Estados | Anúncio |
|---|---|---|---|
| `bw-pagina` | Corpo da obra. Faces de `RN-02.16g` | repouso, carregando | o texto |
| `bw-grifo` | Marca em 1 dos 4 pigmentos (`P-7`) | repouso, selecionado | texto + "destacado" |
| `bw-marginalia` | Anotação a lápis | repouso, editando | texto da nota |
| `bw-painel-leitura` | Os 10 controles de `RN-02.16d` | fechado, aberto | diálogo |
| `bw-painel-dicionario` | Verbete (`RN-02.20`) | carregando, verbete, não encontrado, offline | verbete |
| `bw-ancora-posicao` | Única exceção ao imersivo (`RN-02.13a`) | visível, oculta | posição |
| `bw-sumario` | Navegação interna da obra | repouso, vazio | lista |

### 6.6 Feedback e cerimônia

| Componente | Uso | Estados | Anúncio |
|---|---|---|---|
| `bw-vazio` | Estado sem conteúdo — **com arte** (`P-12`) | — | explicação + saída |
| `bw-dormencia` | Ofensiva quebrada (`RN-04.25`, `RN-04.14a`) | — | **três números: zero corrente, marca encerrada, recorde** |
| `bw-celebracao` | Meta, marco, obra concluída | pendente, exibida | a conquista |
| `bw-ghost` | Comparação com a própria baseline (`06`) | repouso, oculto | comparação, **nunca ranking** |
| `bw-aviso-offline` | Estado local com aviso (`RN-02.27`) | — | aviso |
| `bw-notificacao` | Convite, nunca aviso de perda | — | o convite |

### 6.7 Compartilhamento

| Componente | Uso | Estados | Anúncio |
|---|---|---|---|
| `bw-card-cheio` | 9:16, borda a borda (`RN-08.22`) | compondo, pronto | pré-visualização |
| `bw-adesivo` | Fundo transparente, dimensão livre (`RN-08.22a`) | compondo, pronto | pré-visualização |
| `bw-marca` | Marca da plataforma, **não removível** (`RN-08.13`) | — | marca |

### 6.8 O que está prototipado, e o que ainda não

O catálogo renderiza **28 dos 42** componentes. Os demais estão especificados aqui e ainda não têm prova visual — a mesma distinção que o Anexo A faz entre receita verificada e hipótese, e pelo mesmo motivo: um design system que não separa o que provou do que afirmou não serve de contrato.

| Situação | Componentes |
|---|---|
| **Prototipados** | As superfícies e recipientes, todos os controles, o carimbo, a régua, o mapa de constância, o grifo, a marginália, os oito estados, as abas de fichário, o card cheio, o adesivo, a marca, a lâmina, o vazio e a celebração |
| **Especificados, sem render** | `bw-shell`, `bw-cabeca`, `bw-gaveta`, `bw-pagina`, `bw-painel-leitura`, `bw-painel-dicionario`, `bw-sumario`, `bw-ancora-posicao`, `bw-progresso-dia`, `bw-tabela-indice`, `bw-dormencia`, `bw-ghost`, `bw-aviso-offline`, `bw-notificacao` |

Os quatro do leitor (`bw-pagina`, `bw-painel-leitura`, `bw-painel-dicionario`, `bw-sumario`) existem em [`leitor-papel.html`](../mockups/leitor-papel.html), mas **sob a escala antiga e o acento antigo** — por isso não contam como prova. `AJ-13` é o que os traz para cá.

**`bw-item` e `bw-importar` foram achados pela verificação de cobertura**, não pelo levantamento: ao montar as telas do MVP só com o inventário, "Histórico de sessões" e "Importar EPUB" não fechavam. A linha tocável de lista é o componente mais usado de qualquer app e havia passado despercebido justamente por isso.

**A cena do jardim não é componente.** Ela é arte ilustrada 2D (`Q-04.4`, `Q-04.5`, inventário fechado dimensionado antes de começar). O design system governa o que a cerca — números, carimbo, progresso, congelamentos — e não a cena.

**Fora do inventário:** o que o backlog mandou redesenhar (`AJ-7` traço da sessão, `AJ-8` progresso da obra), as peças retiradas em §6.4 de `direcao-visual.md`, e tudo de Fase 2+ sem mockup (feed, clubes, autores, moderação).

---

## 7. Contrato de estados

As specs listam estados tela a tela, caso a caso. Aqui viram contrato único.

| Estado | Obrigação |
|---|---|
| **repouso** | O padrão |
| **pressionado** | Resposta em ≤ `--mov-instantaneo`. Botão de papel afunda o relevo (`P-9`) |
| **selecionado** | Regra 7: borda de acento 70% + fundo âmbar 16%, resolvidos por superfície |
| **desabilitado** | Tinta fraca **e** ausência de sombra. Nunca só opacidade — opacidade sozinha derruba contraste sem sinalizar |
| **carregando** | Nunca giro genérico. A superfície permanece e o dado chega |
| **vazio** | **Recebe arte** (`P-12`), explica a ausência e oferece a saída |
| **erro** | Diz o que falhou e o que fazer. Sem cor de erro nova: tinta forte + `--borda-marcada` |
| **offline** | Renderiza o estado local com aviso de sincronização (`RN-02.27`, `RN-02.28`) |

- `RN-DS.16` — **Os oito estados são contrato.** Um componente do inventário declara quais se aplicam e nenhum deles fica sem desenho. **Vazio e dormência recebem arte** — regra 10: *"uma dormência feia pune; uma dormência linda convida"*.

---

## 8. Acessibilidade

Até `RN-02.16g`, o produto tinha **zero** requisitos de acessibilidade em todo o `specs/`. Este é o piso.

- `RN-DS.10` — **Alvo de toque mínimo de 48×48dp**, mesmo quando o desenho visível é menor. O carimbo de 40px tem área de toque de 48.
- `RN-DS.11` — Texto nunca abaixo de 4,5:1 (§2.2). Kicker sempre `--tinta-70` ou mais forte.
- `RN-DS.12` — **Componente-metáfora anuncia o dado, não a forma.** Um carimbo que anuncia "imagem" é defeito. A coluna "Anúncio" de §6 é vinculante.
- `RN-DS.13` — **Acessibilidade nunca é modo à parte.** Herdado da postura de `RN-02.16g`: a face de alta legibilidade é opção dentro de um controle normal, sem rótulo que a marque como especial. Não existe "tema acessível" neste produto.
- `RN-DS.14` — **Reduzir movimento não pula a cerimônia.** Com a preferência ativa, durações vão a zero e a celebração vira **estado composto estático** — a pessoa vê a conquista desenhada, não uma tela que passou.
- `RN-DS.17` — Nenhum destino de primeiro nível ordena usuários por desempenho (herdado de `RN-06.8` e `RN-01.13`).

**Validado empiricamente nesta rodada:** os quatro pigmentos de grifo rendem 5,71 a 8,19:1 com tinta por cima. A ferramenta da leitora é segura em todos os quatro — inclusive o carmim rosado, que `direcao-visual.md` §2 protegeu por argumento de produto e agora tem número.

---

## 9. Movimento e háptico

`J-14` a `J-17` existiam em [`../analise-game-design/02-juiciness.md`](../analise-game-design/02-juiciness.md) como análise; `04-decisoes.md` os classificou como *"design visual, não regra de negócio… entra na fase de UI"*. **Esta é a fase de UI.**

### Durações

| Token | Valor | Uso |
|---|---|---|
| `--mov-instantaneo` | 90ms | Resposta ao toque |
| `--mov-curto` | 160ms | Chip, aba, alternador |
| `--mov-medio` | 260ms | Painel entra, ficha vira |
| `--mov-longo` | 420ms | Transição de tela |
| `--mov-cerimonia` | 900ms | Carimbo, celebração, marco |

### Curvas

| Token | Valor | Leitura física |
|---|---|---|
| `--curva-assentar` | `cubic-bezier(.2,.7,.3,1)` | O objeto pousa e para |
| `--curva-carimbo` | `cubic-bezier(.3,1.6,.5,1)` | Impacto seco com micro-recuo |
| `--curva-sair` | `cubic-bezier(.5,0,.85,.3)` | Sai sem despedida |

- `RN-DS.15` — **Papel não quica.** `--curva-carimbo` é a única com overshoot no sistema, e ela existe porque um carimbo real recua ao bater. Qualquer outro elemento com elasticidade importa vocabulário de outro material.

### Háptico

| Token | Gesto |
|---|---|
| `hap-leve` | Confirmação discreta: destaque criado, nota salva |
| `hap-seco` | Carimbo, meta cumprida |
| `hap-duplo` | Marco, obra concluída |

Fronteira herdada de §9 de `02-juiciness.md`: **nada de háptico em rolagem, em virada de página comum, nem em estado ocioso.** Háptico contínuo deixa de significar.

---

## 10. Navegação global — resolve `Q-DV.3`

`Q-DV.3` registrava que **nenhum módulo especifica a navegação do app**. Fica decidida aqui.

### Restrições duras

- **O leitor é imersivo e não tem chrome** (`RN-02.13`). Ele é **modo que se entra e se sai**, não destino. A única exceção permitida é a âncora de posição (`RN-02.13a`).
- **Nenhuma superfície ordena usuários por desempenho** (`RN-06.8`, `RN-01.13`).
- Sem feed (Fase 2), sem perfil público, sem autor — `mvp.md` §4.5.

### Destinos de primeiro nível — quatro

| Destino | Contém |
|---|---|
| **Jardim** | Casa do hábito: ofensiva, meta do dia, canteiro, congelamentos. Tela de entrada |
| **Biblioteca** | Backlog em leitura **e** Estante de concluídas como duas divisórias internas (`RN-02.6a`, `AJ-10`) |
| **Caderno** | Destaques e anotações de todas as obras |
| **Desempenho** | Sessões, métricas, Ghost Reader, fechamento semanal |

**Perfil e Configurações não são destinos de primeiro nível** — são acesso no cabeçalho do Jardim. Num MVP sem perfil público, promovê-los a par de Biblioteca mentiria sobre a importância deles.

### A forma: abas de fichário

Três formas foram consideradas no vocabulário de Papel:

| Forma | Veredito |
|---|---|
| **A — Abas de fichário**, barra inferior | **Escolhida** |
| **B — Lombadas na base** | Descartada. Lombada significa *obra*; usá-la para "Desempenho" mente sobre o que o objeto é |
| **C — A mesa como navegação**, sem barra | Registrada como direção de longo prazo. É a mais fiel à tese e a mais cara; obriga voltar a um destino-raiz a cada troca, o que atrita com um app de hábito diário que precisa de reentrada barata |

**Por que A.** A aba de divisória de fichário é o único objeto de papelaria que existe **para separar seções** — metáfora e função coincidem, que é exatamente o teste que §6.1 de `direcao-visual.md` impôs à herança de telas: *traduzir, não copiar*. Some a isso o alcance de polegar e a convenção de Android, que `mvp.md` §2 fixa como primeira superfície.

Desenho: quatro abas na borda inferior, opacas — **interrompem a mesa** (`P-10`), não flutuam sobre ela. Rotação mínima alternada (`RN-DS.9`). A ativa avança para a frente e recebe carimbo; as inativas ficam recuadas em `--tinta-70`, nunca abaixo do piso de contraste.

- `RN-DS.18` — **O leitor é modo, não destino.** Entrar no leitor esconde as abas; sair as devolve. Nenhum destino de primeiro nível abre dentro do leitor.

---

## 11. Anexo A — tradução CSS ↔ React Native

`mvp.md` §2 fixa **React Native, Android primeiro**. A assinatura mecânica foi desenhada em CSS e nem tudo atravessa.

**Status de cada linha é vinculante.** `não verificado` significa que a receita RN é hipótese até haver medição em app real na versão fixada. Um design system que afirma o que não mediu é pior que um ausente.

| Primitiva | CSS | React Native | Degradação | Status |
|---|---|---|---|---|
| `P-1` Grão | `radial-gradient` + `background-size: 7px 7px` | **Asset compartilhado**: PNG 7×7 tileável via `ImageBackground` (`resizeMode: repeat`) | Nenhuma — a mesma arte serve as duas plataformas | **a produzir** |
| `P-2` Luz na folha | `radial-gradient` de canto | Gradiente nativo depende de versão/arquitetura | Fallback: cor sólida ligeiramente mais clara | não verificado |
| `P-3` Relevo | `box-shadow: inset` | `boxShadow` depende de versão | Fallback: `View` de 1px sobreposta | não verificado |
| `P-4` Sombra | `box-shadow` colorido | `elevation` do Android **não colore sombra**; `boxShadow` depende de versão | Fallback: relevo sólido + borda inferior — que já é `P-9` | não verificado |
| `P-5` Rotação | `transform: rotate()` | `transform: [{rotate}]` | Nenhuma | **atravessa** |
| `P-6` Raio irregular | `4px 7px 5px 8px / 6px 4px 7px 5px` | **Eixo duplo não existe em RN** | Raio por canto, só o primeiro eixo. A imperfeição migra para `P-5` e para a borda | **confirmada** |
| `P-7` Grifo | `mix-blend-mode: multiply` + `box-decoration-break: clone` | `mixBlendMode` depende de versão; `clone` **não tem equivalente** | Cor pré-multiplicada (valores já calculados em §8) + destaque por linha | não verificado |
| `P-8` Carimbo | Rotação + opacidade + `border-radius: 50%` | Atravessa | Nenhuma | **atravessa** |
| `P-9` Botão de papel | `box-shadow` sólido 2px | `boxShadow` ou `View` aninhada | Nenhuma prevista | não verificado |
| `P-10` Interromper pauta | Fundo opaco sobre `background-image` | Atravessa | Nenhuma | **atravessa** |
| `P-11` Métrica tipográfica | `font-variant-numeric: tabular-nums` | `fontVariant: ['tabular-nums']` | Nenhuma | **atravessa** |
| — Versalete | `font-variant: small-caps` (sintético) | `fontVariant: small-caps` **não confiável no Android** | Face Spectral SC real, ou o versalete sai da escala | não verificado |
| — Corpo justificado | `text-align: justify; hyphens: auto` | Justify limitado por API; **hifenização não exposta** | Sem hifenização, justificado abre rios: provável alinhamento à esquerda no Android | **a medir** |

### Como verificar

Um app RN Android mínimo que renderize as doze primitivas lado a lado, na versão que o projeto fixar. Cada linha só sai de `não verificado` com captura de tela. Enquanto isso não existir, **as linhas ficam como estão** e nenhum mockup promete o que elas descrevem.

- `RN-DS.20` — **Nada no Anexo A é declarado verificado sem medição em app real.**

---

## 12. Achados desta rodada

Medidos por sonda sobre as três peças, não estimados.

| Achado | Número | Encaminhamento |
|---|---|---|
| Classes com reuso zero entre as três peças | `p-` 140 · `tp-` 133 · `mw-` 128 | Prefixo único `bw-` (`RN-DS.19`) |
| `box-shadow` distintos para 60 usos | **51** | Três alturas (§4.3) |
| Valores de espaçamento distintos | **49** — todo inteiro de 1 a 20 em uso | Escala tônica (§3) |
| `rotate` distintos para 86 usos | **54** | Seis rotações nomeadas (§4.4) |
| **Violações da regra 5** (sombra preta neutra) | **10**, nas três peças | Não são desleixo: são objetos sobre a mesa. Vira exceção declarada — `RN-DS.6` |
| Violações da regra 4 (borda cinza/preta) | **0** | A única regra da assinatura que se sustentou sozinha, por estar escrita como valor concreto |
| **Tinta fraca usada como cor de texto** | **60 usos** (`tinta-32` a 2,04:1 · `tinta-50` a 3,27:1) | `RN-DS.11`. Inclui kickers, que são o menor tipo do sistema |
| Acento que reprova em contraste | **1** — kraft, 2,66:1 | `Q-DS.1` |

Os quatro primeiros são consequência de não haver sistema. Os três últimos são defeitos que só apareceram porque alguém mediu.

---

## 13. Questões em aberto

| ID | Questão |
|---|---|
| `Q-DS.1` | **O acento do kraft reprova em contraste** — `#8a5a12` sobre `#c8a97e` rende 2,66:1, abaixo do piso de 3:1. Ou o kraft escurece o acento, ou o material fica restrito a peças onde o acento não porta significado. Não se resolve com o material como está |
| `Q-DS.2` | **Os temas de card contradizem o pilar.** `RN-08.10` fixa os dois temas gratuitos como "Minimalista e Dark" e [`mvp.md`](mvp.md) §4.6 empurra "Papel Antigo" para a Fase 1. Lido ao pé da letra, **o MVP entrega zero cards na identidade visual do próprio produto** — e o card é, por `P6`, a única alavanca de crescimento. `RN-08.10` é anterior à decisão de Papel e provavelmente é errata, mas corrigi-la é decisão de produto, não de design system |
| `Q-DS.3` | **`RN-08.9` define tema como "identidade completa: paleta, tipografia, tratamento da capa, textura de fundo e estilo dos numerais"** — que é exatamente a definição da camada de Superfície de §2. Ou os seis materiais **são** os temas, ou o produto mantém dois sistemas paralelos de aparência com nomes diferentes |
| `Q-DS.4` | **A escala de espaçamento nunca foi testada em tela cheia.** Ela é derivada da aritmética da pauta (27px), não da composição. O salto de `--esp-5` (18px) para `--esp-6` (27px) pode ser largo demais para densidade de lista |
| `Q-DS.5` | **O anexo de tradução RN é hipótese em 6 das 13 linhas.** Sem um app de prova, o produto não sabe quanto da assinatura sobrevive no Android — e é a pergunta de maior consequência do documento |

---

## 14. Índice de regras

| ID | Regra |
|---|---|
| `RN-DS.1` | Componente nunca lê pigmento direto |
| `RN-DS.2` | Todo componente declara a superfície em que vive |
| `RN-DS.3` | Superfície rebinda os cinco: fundo, tinta, acento, borda, sombra |
| `RN-DS.4` | Espaçamento só da escala tônica |
| `RN-DS.5` | `--esp-6` = 27px é o ancoradouro: entrelinha, pauta e ritmo são o mesmo número |
| `RN-DS.6` | `--sup-sombra` rebindado por superfície; preto neutro proibido **sobre papel** |
| `RN-DS.7` | Borda nunca cinza, nunca preta |
| `RN-DS.8` | Raio zero por padrão; círculo só para carimbo e selo |
| `RN-DS.9` | Só rotações do conjunto nomeado, sinais alternados |
| `RN-DS.10` | Alvo de toque mínimo de 48×48dp |
| `RN-DS.11` | Texto nunca abaixo de 4,5:1; kicker sempre `--tinta-70`+ |
| `RN-DS.12` | Componente-metáfora anuncia o dado, não a forma |
| `RN-DS.13` | Acessibilidade nunca é modo à parte |
| `RN-DS.14` | Reduzir movimento não pula a cerimônia — ela vira estado composto |
| `RN-DS.15` | Papel não quica; só o carimbo tem overshoot |
| `RN-DS.16` | Os oito estados são contrato; vazio e dormência recebem arte |
| `RN-DS.17` | Nenhum destino de primeiro nível ordena usuários |
| `RN-DS.18` | O leitor é modo, não destino |
| `RN-DS.19` | Tela nova herda este catálogo, não o arquivo vizinho |
| `RN-DS.20` | Nada no Anexo A é declarado verificado sem medição em app real |
