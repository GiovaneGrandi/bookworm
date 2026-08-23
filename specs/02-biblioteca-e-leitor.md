# 02 — Catálogo, Biblioteca e Leitor Imersivo

## 1. Objetivo

Entregar o núcleo funcional do produto: encontrar uma obra, colocá-la na biblioteca e lê-la em uma interface sem distrações que suporte destaque, anotação e dicionário. Este módulo produz os insumos de todo o resto — sem posição de leitura confiável e sem interações qualitativas, não existem métricas (`03`), ofensiva (`04`), Ghost Reader (`06`) nem analytics de autor (`09`).

Módulo majoritariamente derivado. O rascunho o pressupõe em L89 ("interface de leitura sem distrações"), L98 (destaques, anotações, dicionário) e L105 ("adquirir novos livros na loja integrada").

## 2. Escopo

**Dentro:** catálogo e busca, aquisição de obra (gratuita, paga, gorjeta opcional), biblioteca pessoal, leitor imersivo, navegação e progresso, destaques, anotações, dicionário interno, resenhas, download offline.

**Fora:** medição de tempo, cálculo de métricas e antifraude → [`03-sessoes-e-metricas.md`](03-sessoes-e-metricas.md). Recursos de IA dentro do leitor → [`11-ia-premium-reader.md`](11-ia-premium-reader.md). Pagamento, take rate e planos → [`10-monetizacao-planos.md`](10-monetizacao-planos.md). Publicação e ingestão de obras pelo autor → [`09-autores-e-analytics.md`](09-autores-e-analytics.md).

## 3. Personas

Leitor (primária), Autor (como origem do conteúdo).

---

## 4. User stories

| ID | Story |
|---|---|
| `LEI-01` | Como leitor, quero buscar obras por título, autor e gênero para encontrar o que quero ler. |
| `LEI-21` | Como leitor, quero importar os EPUBs e PDFs que já tenho para usar o app desde o primeiro dia. |
| `LEI-22` | Como leitor, quero acesso a obras em domínio público sem pagar nada. |
| `LEI-02` | Como leitor, quero ver a página de uma obra com sinopse, amostra e avaliações para decidir antes de adquirir. |
| `LEI-03` | Como leitor, quero ler uma amostra gratuita antes de comprar para reduzir o risco da decisão. |
| `LEI-04` | Como leitor, quero adquirir uma obra e vê-la imediatamente na minha biblioteca. |
| `LEI-05` | Como leitor, quero organizar minha biblioteca por estado (lendo, quero ler, concluído, abandonado) para me situar. |
| `LEI-06` | Como leitor, quero abrir uma obra e retomar exatamente de onde parei, em qualquer dispositivo. |
| `LEI-07` | Como leitor, quero uma interface de leitura sem distrações para entrar em foco profundo. |
| `LEI-08` | Como leitor, quero ajustar tipografia, tamanho, espaçamento, margens e tema para ler confortavelmente. |
| `LEI-23` | Como leitor, quero ajustar a temperatura da luz da tela para ler à noite sem que o branco frio me acorde. |
| `LEI-24` | Como leitor, quero saber onde estou na obra sem precisar tocar na tela — e quero poder desligar isso se atrapalhar. |
| `LEI-09` | Como leitor, quero destacar trechos com cores para marcar o que me tocou. |
| `LEI-10` | Como leitor, quero escrever anotações de margem vinculadas a um trecho para registrar meu pensamento. |
| `LEI-11` | Como leitor, quero consultar o significado de uma palavra sem sair da página para não quebrar o fluxo. |
| `LEI-12` | Como leitor, quero baixar a obra para ler offline. |
| `LEI-13` | Como leitor, quero navegar por sumário, busca no texto e marcadores para me mover dentro da obra. |
| `LEI-14` | Como leitor, quero rever todos os meus destaques e anotações de uma obra em um só lugar. |
| `LEI-15` | Como leitor, quero escrever uma resenha ao concluir uma obra para registrar minha opinião e ajudar outros leitores. |
| `LEI-16` | Como leitor, quero marcar uma obra como abandonada sem penalidade para ser honesto com meu histórico. |
| `LEI-17` | Como leitor, quero enviar uma gorjeta ao autor a partir do leitor, no momento em que um trecho me impacta. |
| `LEI-18` | Como leitor, quero ver minha estante crescer a cada livro terminado, para ter prova visível do que já li. |
| `LEI-19` | Como leitor, quero colecionar as citações que me marcaram em um acervo bonito e pesquisável. |
| `LEI-20` | Como leitor, quero completar conjuntos de leitura para ter objetivos de longo prazo além da ofensiva. |

---

## 5. Regras de negócio

**Catálogo e aquisição**

- `RN-02.1` **O BookWorm é um leitor aberto.** O usuário lê três origens de conteúdo, todas no mesmo leitor e com as mesmas métricas, ofensiva e coleção:
  1. **EPUB ou PDF próprio** — arquivos que o usuário já possui, importados do dispositivo ou da nuvem;
  2. **Domínio público** — acervo curado e gratuito, embarcado ou baixável;
  3. **Catálogo da plataforma** — obras publicadas por autores do BookWorm (`09`).
- `RN-02.1a` Formatos de conteúdo aceitos: **EPUB 3 e PDF**, em todas as origens, com o mesmo tratamento de métricas, ofensiva e coleção (`RN-02.1f`).
- `RN-02.1b` Essa decisão resolve o problema de arranque que travava o produto: o app tem valor no primeiro dia, sem catálogo próprio e sem custo de conteúdo, porque o leitor traz a biblioteca que já tem. Leitores atraem autores; o inverso não acontece.
- `RN-02.1c` **A plataforma não vende obras de terceiros.** O comércio existe apenas para obras de autores do próprio BookWorm (`RN-02.3`). Competir com a Amazon revendendo catálogo alheio é uma guerra sem final feliz, e não é onde está o valor do produto.
- `RN-02.1d` Obra importada pelo usuário é **privada**: não entra no catálogo, não é redistribuída, não é compartilhada com outros usuários e não alimenta o analytics de nenhum autor (`09`). A plataforma armazena apenas o necessário para leitura e sincronização daquele usuário.
- `RN-02.1e` Obra importada não gera recompensa em moedas por conclusão (`RN-07.4a`), porque não há como verificar tamanho, autoria e originalidade. Ela conta integralmente para meta, ofensiva, estante e coleção — o hábito é do leitor, independentemente da procedência do arquivo.
- `RN-02.1f` **PDF tem paridade com EPUB**: mesma posição sincronizada, mesmo progresso percentual (`RN-02.10`), mesma contagem para meta, ofensiva, estante e Leitura Consciente (`03`). O leitor não expõe ao usuário qual dos dois formatos abriu — a experiência é única. A diferença fica só na origem técnica do índice de caracteres que sustenta essa paridade (`Q-02.6`, e `stack.md` §6).
- `RN-02.2` Toda obra publicada expõe uma amostra gratuita correspondente a até 10% do conteúdo (a validar), definida pelo autor por intervalo de capítulos.
- `RN-02.3` Obras podem ser **gratuitas** ou **pagas**. Obra gratuita entra na biblioteca em um toque; obra paga exige compra (ver `10`). Não há aluguel nem devolução parcial nesta versão.
- `RN-02.4` A aquisição concede licença de leitura pessoal e não transferível, válida enquanto a conta existir, inclusive se o autor despublicar a obra depois. Despublicação remove a obra do catálogo, **nunca** das bibliotecas de quem já a adquiriu.
- `RN-02.5` **Obras são pagas exclusivamente em dinheiro.** A Semente não compra obra (`RN-07.1a`, `RN-07.1b`). O rascunho previa compra com moeda (L105); a regra foi revista porque uma moeda distribuída de graça não pode comprar um bem que custa dinheiro real.

**Biblioteca**

- `RN-02.6` Estados possíveis de uma obra na biblioteca: `quero_ler`, `lendo`, `concluido`, `abandonado`, `em_pausa`. A transição para `lendo` é automática na primeira sessão; as demais são manuais, exceto `concluido`, que é sugerido ao atingir 100% de progresso e confirmado pelo usuário.
- `RN-02.6a` **Biblioteca e Estante são superfícies distintas, e uma obra concluída sai da primeira.** A Biblioteca mostra **o que ainda vai ser lido**: `lendo`, `quero_ler` e `em_pausa`. A Estante (`RN-02.22a`) mostra **o que já foi lido**: `concluido`. Nenhuma obra aparece nas duas ao mesmo tempo.
  - A razão é de propósito, não de organização: uma lista de pendências e um acervo de conquistas respondem a perguntas opostas — *"o que eu leio agora?"* contra *"quem eu sou como leitor?"* (`RN-02.22b`). Misturadas, a biblioteca cresce para sempre e deixa de servir à primeira pergunta, e a conclusão de uma obra deixa de ter consequência visível.
  - **`concluido` permanece um estado válido de `ItemBiblioteca`.** O que muda é a superfície que o exibe, não o modelo de dados.
  - **Obra `abandonado` fica na Biblioteca, alcançável apenas por filtro explícito, nunca na visão padrão** *(a validar)*. Não é acervo, porque não foi lida (`RN-02.22f`); não é backlog, porque não será. A visão padrão a omite para que a Biblioteca nunca se torne uma lista do que a pessoa não deu conta (P2, `RN-02.7`). Em nenhum lugar essas obras são contadas ou totalizadas.
- `RN-02.6b` **Reler devolve a obra à Biblioteca sem tirá-la da Estante.** Iniciar uma nova sessão em obra `concluido` a traz de volta ao estado `lendo` e à Biblioteca; a entrada na Estante é permanente e não é afetada (`RN-02.22a`: "a estante só cresce; nada sai dela"). Uma obra pode, portanto, estar simultaneamente na Estante — como leitura concluída — e na Biblioteca — como leitura em curso. **Esta é a única sobreposição admitida**, e ela não é ambiguidade: são dois fatos verdadeiros ao mesmo tempo.
- `RN-02.7` Abandonar uma obra não gera perda de moedas, não quebra ofensiva e não produz nenhuma mensagem negativa (P2).
- `RN-02.8` A biblioteca comporta múltiplas obras em estado `lendo` simultaneamente. Existe o conceito de **obra ativa** (a última lida), usada como destino padrão do botão de leitura rápida na home.

**Posição e progresso**

- `RN-02.9` A posição de leitura é um **locator estável** (referência a documento + offset dentro dele), independente de tipografia, tamanho de fonte e dispositivo — em EPUB, nativo do formato; em PDF, derivado do índice de caracteres extraído do conteúdo (`Q-02.6`). Nenhuma métrica pode depender de "página da tela".
- `RN-02.10` O progresso percentual da obra é calculado sobre o total de caracteres do conteúdo principal, excluindo capa, ficha catalográfica, sumário e páginas de crédito.
- `RN-02.11` A posição é sincronizada ao servidor no fim de cada sessão e a cada troca de capítulo. Em conflito entre dispositivos, vence a **posição mais avançada** e o app informa o leitor, oferecendo voltar à posição local.
- `RN-02.12` A "página canônica" existe apenas para exibição e para o cálculo de metas: 1 página = `PAGINA_CANONICA_CARACTERES` (1.500 caracteres, a validar). Definição em `03`.

**Leitor imersivo**

- `RN-02.13` O leitor abre em modo imersivo: sem barra de navegação, sem badges, sem notificações in-app. Um toque na área central revela os controles; nova ausência de interação por 3 segundos os oculta. A **única exceção** permitida é a âncora de posição de `RN-02.13a` — todo o resto continua proibido por `RN-02.13b`.
- `RN-02.13a` **Âncora de posição permanente.** O leitor exibe, de forma contínua e discreta, onde a pessoa está na obra. É configurável em três níveis nas preferências de leitura (`RN-02.16`):

  | Nível | O que fica visível |
  |---|---|
  | `nenhuma` | Imersivo puro. Nada além do texto — o comportamento original desta regra |
  | `posicao` | Marca contínua de posição, **sem dígito algum** (fio, filete, corte de página ou equivalente) |
  | `posicao_numero` | A marca de posição mais a página canônica corrente e o capítulo |

  O padrão é `ANCORA_POSICAO_PADRAO` (`posicao_numero`, a validar). A âncora ocupa no máximo uma faixa marginal da tela, nunca sobrepõe o texto e nunca é a peça de maior peso visual da página.
- `RN-02.13b` A exceção de `RN-02.13a` é **fechada**. Continuam proibidos no modo imersivo, em qualquer nível: barra de navegação, badge, notificação in-app, contador de destaques (`RN-02.17c`), ofensiva, moeda, meta diária, comemoração (`RN-02.14a`), tempo de sessão, tempo restante estimado e qualquer forma de velocidade (`RN-02.15`). A âncora responde **onde estou na obra** e nada mais.
- `RN-02.13c` Procedência: a redação anterior desta regra proibia contadores sem exceção. Três explorações de design independentes, sem contato entre si, propuseram cada uma a mesma correção — uma âncora permanente de posição — com formas diferentes (fólio impresso, trilho com ticks, fio sem número). Os três níveis de `RN-02.13a` são a generalização dessas três respostas. O argumento comum: sem nenhuma âncora, o leitor **sai do livro** para descobrir onde está, o que quebra mais a imersão do que a marca que a regra evitava.
- `RN-02.14` Notificações de engajamento da própria plataforma são suprimidas durante uma sessão ativa (P3) e reagendadas para depois do encerramento.
- `RN-02.14a` A mesma supressão vale para conquistas obtidas durante a leitura, incluindo o cumprimento da meta diária: elas são registradas na hora, ficam pendentes em silêncio e só aparecem na fronteira natural seguinte — fim de capítulo ou encerramento da sessão (`RN-04.10b`, `RN-04.10c`). **O fim de capítulo é a única pausa em que o leitor pode receber uma comemoração**, porque a interrupção do fluxo já foi feita pelo próprio texto, não pelo app.
- `RN-02.15` Nenhum elemento do leitor exibe velocidade de leitura em tempo real. A comparação com o histórico aparece apenas na abertura e no encerramento da sessão, no formato definido em `06`.
- `RN-02.16` Preferências de tipografia (fonte, corpo, entrelinha, margem, alinhamento, tema) são por conta e sincronizadas, não por obra.
- `RN-02.17` O leitor oferece os temas de fundo claro, sépia, escuro e preto puro (OLED). Estes são temas de leitura, distintos dos temas cosméticos de card de compartilhamento (`08`).

**Iluminação e conforto de leitura**

O conforto visual é decisão de design declarada na superfície do leitor, não opção escondida num submenu. Estas regras tornam normativo o inventário de controles que o painel precisa oferecer.

- `RN-02.16a` **Temperatura de luz é um eixo próprio**, contínuo e independente do tema (`RN-02.17`): qualquer temperatura pode ser combinada com qualquer um dos quatro temas. Faixa `TEMPERATURA_LUZ_MIN` a `TEMPERATURA_LUZ_MAX` (2.700 K a 6.500 K, a validar), padrão `TEMPERATURA_LUZ_PADRAO` (a validar). O controle é exibido no painel com peso visual proporcional à sua importância — não é um item de lista entre outros.
- `RN-02.16b` **Brilho in-app**, independente do brilho do sistema, para permitir escurecer abaixo do mínimo do aparelho sem sair do app. Nunca aumenta o brilho acima do que o sistema permite.
- `RN-02.16c` **Ajuste automático por hora local** *(a validar)*: a temperatura pode acompanhar o horário do dia, esfriando de manhã e esquentando à noite. É **opt-in**, nunca padrão, e sempre sobreponível manualmente na sessão corrente.
- `RN-02.16d` **Inventário mínimo do painel.** O painel de leitura oferece, no mínimo: família de fonte, corpo, entrelinha, margens, alinhamento, tema (`RN-02.17`), temperatura de luz (`RN-02.16a`), brilho (`RN-02.16b`), nível da âncora de posição (`RN-02.13a`) e a chave única de retorno sensorial (`RN-02.17f`). Nenhum destes é recurso de plano pago (`RN-10.2`).
- `RN-02.16e` **Pré-visualização ao vivo.** Todo ajuste do painel se aplica imediatamente ao texto real da obra, na posição corrente — nunca a um texto de amostra e nunca exigindo confirmar para ver o efeito. Nenhum ajuste reinicia a leitura, altera a posição (`RN-02.9`) ou encerra a sessão (`RN-03.6`).
- `RN-02.16f` **Reversibilidade.** Toda preferência de leitura tem restauração ao padrão, individual e em bloco. Nenhuma preferência é destrutiva e nenhuma exige explicação para ser desfeita.
- `RN-02.16g` **Catálogo de faces do painel.** A família de fonte exigida por `RN-02.16d` oferece **cinco** faces, e o catálogo tem composição obrigatória: pelo menos uma serifada, **uma sans** e **uma face de alta legibilidade**. Duas faces só contam como opções distintas se a diferença for perceptível em corpo de leitura — duas old-style equivalentes ocupam uma vaga, não duas.

  | Face | Corpo | Entrelinha | Papel |
  |---|---|---|---|
  | **Spectral** | 16px | 27px | padrão |
  | **EB Garamond** | 17px | 27px | old-style alternativa |
  | **Public Sans** | 15,5px | 26px | sans — obrigatória |
  | **Atkinson Hyperlegible** | 17px | 28px | alta legibilidade — obrigatória |
  | **Courier Prime** | 13,5px | 24px | monoespaço |

  A face de alta legibilidade **não é um tema, um modo nem um recurso de acessibilidade à parte**: é uma opção do mesmo controle, sem rótulo que a marque como especial, e obedece a `RN-02.16e` como qualquer outra. Escolher corpo grande não a ativa, e ativá-la não muda corpo, entrelinha nem tema — os eixos permanecem independentes. Nenhuma face é recurso de plano pago (`RN-10.2`).

  Os corpos da tabela são o **valor inicial de cada face**, não um travamento: o controle de corpo (`RN-02.16d`) segue livre em toda a faixa a partir dali. Cada face tem seu próprio valor inicial porque a altura-x difere entre elas — 16px de Spectral e 15,5px de Public Sans ocupam a mesma mancha aparente.

**Resposta ao gesto**

O produto pede que o leitor grife, anote e consulte (`RN-03.17`), mas nada disso devolvia qualquer resposta no instante do gesto. Estas regras corrigem isso **sem** violar o modo imersivo: só respondem a ações que o próprio leitor iniciou.

- `RN-02.17a` **Toda ação do leitor tem resposta imediata e proporcional.** Virar página, criar destaque, salvar anotação e consultar o dicionário produzem retorno tátil e visual no mesmo instante. A regra que separa o permitido do proibido é a autoria do gesto: responder ao que o leitor fez é confirmação; aparecer sem ter sido chamado é interrupção (`RN-02.13`).
- `RN-02.17b` **Virada de página** tem peso físico: curva de desaceleração, nunca linear. Som de papel existe, é **desligado por padrão** e vive nas preferências de leitura (`RN-02.16`) — encantador na primeira hora, insuportável na terceira.
- `RN-02.17c` **Destaque** não aparece pronto: a cor preenche o trecho progressivamente, como tinta absorvendo no papel, com retorno tátil ao final. Nenhum contador é exibido — os destaques da sessão são acumulados em silêncio e revelados no resumo (`03` §7).
- `RN-02.17d` **Consulta ao dicionário** deixa um vestígio permanente e discreto no texto: a palavra consultada mantém um sublinhado tênue. É o registro visível de que aquela página foi trabalhada.
- `RN-02.17e` **Intensidade progressiva na sessão** *(a validar)*: a resposta da virada de página pode ganhar intensidade conforme a sessão avança sem interrupção, comunicando embalo ao leitor sem exibir número, texto ou cronômetro. A escalada é **sutil e assintótica** — nunca chega a distrair — e é desligável junto com o som (`RN-02.16`). Se o teste com usuários indicar que isso rouba atenção do texto, a regra cai: em conflito, o modo imersivo (`RN-02.13`) sempre vence.
- `RN-02.17f` Todo retorno sensorial deste bloco é **desativável** em uma única chave nas preferências de leitura, para quem lê em silêncio absoluto ou tem sensibilidade a movimento.

**Interações qualitativas**

- `RN-02.18` Destaque: seleção de texto com escolha entre 4 cores (a validar), com nota opcional acoplada. Um destaque com nota conta como **um** destaque e **uma** anotação para fins de métrica.
- `RN-02.19` Anotação de margem: texto livre de até 2.000 caracteres (a validar), vinculado a uma posição ou a um destaque.
- `RN-02.20` Dicionário interno: consulta offline por dicionário embarcado, com queda para consulta online quando o verbete não existir localmente. A consulta nunca navega para fora do leitor — abre em painel sobreposto.
- `RN-02.21` Destaques, anotações e consultas ao dicionário são registrados com posição, timestamp e id de sessão, porque alimentam a Leitura Consciente (`03`) e o analytics do autor (`09`).
- `RN-02.22` Destaques e anotações são **privados por padrão**. O leitor pode tornar um destaque público individualmente; destaques públicos alimentam o agregado "frases mais grifadas" visto pelo autor. O agregado exibido ao autor é sempre anônimo e sujeito a k-anonimato (ver `RN-09.14`).

**Estante e coleção**

O produto é sobre livros — historicamente o objeto de coleção por excelência — e a biblioteca era apenas uma lista funcional. A coleção é o eixo de posse e identidade do leitor, e deve ser presença constante, não uma tela escondida.

- `RN-02.22a` Toda obra concluída entra permanentemente na **Estante**: representação visual do acervo, com lombadas diferenciadas por gênero, ordenáveis por data de conclusão, autor, gênero ou cor. A estante só cresce; nada sai dela.
- `RN-02.22b` A estante é a **prova de identidade** do leitor e tem lugar de destaque no perfil (`01`) e na home, ao lado do jardim. Números medem esforço; a estante mostra quem a pessoa é.
- `RN-02.22c` **Citações colecionáveis:** os destaques (`RN-02.18`) formam um acervo navegável e pesquisável. O leitor pode promover destaques a *citações da coleção*, que ganham apresentação diferenciada e entram na rotação dos cards de compartilhamento (`08`).
- `RN-02.22d` **Conjuntos:** coleções com critério declarado — por gênero, por década, "5 autores estreantes" (que já é gatilho de moeda, `RN-07.5`), "um livro de cada continente". Cada conjunto exibe o progresso e concede, ao ser completado, um selo permanente e uma semente (`RN-04.40`).
- `RN-02.22e` Conjuntos nunca expiram e nunca são exclusivos por tempo. A coleção é um projeto de anos, não uma corrida — pressionar o leitor a completar conjuntos criaria a leitura performática que P3 recusa.
- `RN-02.22f` Obra abandonada (`RN-02.7`) não entra na estante e **não** aparece como lacuna, falha ou espaço vazio. A estante mostra o que foi lido, nunca o que não foi.

**Resenhas**

- `RN-02.23` Resenha exige progresso de leitura ≥ `RESENHA_PROGRESSO_MINIMO` (90%, a validar) na obra, para reduzir resenha performática e ataque coordenado.
- `RN-02.24` Uma resenha contém nota de 1 a 5 e texto livre. É pública por padrão e editável pelo autor da resenha por tempo indeterminado; edições preservam histórico interno.
- `RN-02.25` Resenha **qualificada**, para efeito de recompensa em moedas, é a que tem no mínimo `RESENHA_MINIMA_CARACTERES` (400, a validar), atende `RN-02.23` e passa na verificação antiabuso de `RN-07.9`. O critério é explicado ao usuário antes de escrever, nunca depois.
- `RN-02.26` O autor da obra não pode resenhar a própria obra nem receber gorjeta de si mesmo.

**Offline**

- `RN-02.27` Obra adquirida pode ser baixada integralmente. Toda leitura, destaque, anotação e sessão funcionam offline e entram em fila de sincronização.
- `RN-02.28` Eventos gerados offline carregam o timestamp local do dispositivo e são reconciliados na sincronização segundo `RN-03.14` (janela de tolerância e antifraude).

---

## 6. Critérios de aceitação

**`LEI-03` — Amostra**
```
Dado que estou na página de uma obra paga
Quando escolho "ler amostra"
Então o leitor abre no início da amostra definida pelo autor
E ao chegar ao fim da amostra vejo um convite de compra sem sair do clima de leitura
E minha leitura da amostra não conta para ofensiva nem gera moedas
```

**`LEI-06` — Retomada entre dispositivos**
```
Dado que li até 42% da obra no celular e sincronizei
Quando abro a mesma obra na web
Então sou levado exatamente à mesma posição
E se a posição local for anterior à do servidor
Então o app aplica a posição mais avançada e me oferece voltar à anterior
```

**`LEI-07` — Modo imersivo**
```
Dado que abro uma obra para leitura
Quando a tela é exibida
Então não há barra de navegação, contador de tempo, badge ou notificação visível
E ao tocar no centro da tela os controles aparecem
E após 3 segundos sem interação os controles desaparecem
```

**`LEI-09` + `LEI-10` — Destaque com nota**
```
Dado que estou lendo com o app offline
Quando seleciono um trecho, escolho uma cor e escrevo uma nota
Então o destaque e a nota ficam disponíveis imediatamente
E ambos são registrados com posição, horário e id da sessão corrente
E são sincronizados assim que houver conexão
```

**`LEI-11` — Dicionário sem quebra de fluxo**
```
Dado que estou lendo offline e toco duas vezes em uma palavra
Quando o verbete existe no dicionário embarcado
Então a definição abre em painel sobreposto sobre o texto
E ao fechar o painel permaneço exatamente na mesma posição
E quando o verbete não existe localmente e há conexão
Então o app busca online sem sair do leitor
```

**`LEI-15` — Resenha qualificada**
```
Dado que concluí 95% de uma obra
Quando escrevo uma resenha com 500 caracteres e publico
Então a resenha aparece na página da obra
E recebo a recompensa em moedas de resenha qualificada
E se eu escrever menos de 400 caracteres
Então a resenha é publicada normalmente mas sem recompensa, com o critério explicado antes do envio
```

**`LEI-16` — Abandono sem punição**
```
Dado que marco uma obra como abandonada
Quando a ação é concluída
Então não perco moedas nem ofensiva
E nenhuma mensagem sugere fracasso
E a obra permanece acessível na biblioteca para retomada futura
```

**`RN-02.4` — Despublicação preserva a licença**
```
Dado que adquiri uma obra e o autor a despublica depois
Quando abro minha biblioteca
Então a obra continua disponível para leitura e download
E a página pública da obra deixa de ser acessível para novos leitores
```

---

## 7. Telas e estados

| Tela | Conteúdo | Estados |
|---|---|---|
| **Catálogo / Busca** | Busca, filtros por gênero, prateleiras curadas, destaques de vitrine | Vazio (sem resultado, com sugestões), Carregando (skeleton), Erro, Offline (mostra só a biblioteca local) |
| **Página da obra** | Capa, sinopse, autor, preço, avaliação média, resenhas, ações (adquirir, amostra, quero ler) | Carregando, Erro, Bloqueado (obra despublicada) |
| **Biblioteca** | **Só o que ainda vai ser lido** (`RN-02.6a`): abas de `lendo`, `quero_ler` e `em_pausa`, ordenação, indicador de progresso, badge de baixado, origem da obra (importada, domínio público, catálogo). **Não há aba de concluídos** — obra concluída vive na Estante. Obras abandonadas só por filtro explícito | Vazio (convite duplo: importar meus livros ou explorar o catálogo), Offline (apenas obras baixadas, com aviso) |
| **Importar EPUB/PDF** | Seleção de arquivo do dispositivo ou nuvem, validação de formato, extração de metadados e capa | Erro (arquivo inválido ou com DRM de terceiros, explicado com clareza), Carregando |
| **Acervo de domínio público** | Curadoria por gênero e época, tudo gratuito | Vazio, Carregando |
| **Leitor** | Texto paginado, âncora de posição (`RN-02.13a`), controles ocultáveis, seleção de texto | Carregando (abertura da obra), Erro (arquivo corrompido → reparar download), Offline (integral) |
| **Painel de leitura** | Fonte (cinco faces, `RN-02.16g`), corpo, entrelinha, margens, alinhamento, tema, temperatura de luz, brilho, nível da âncora, chave de retorno sensorial (`RN-02.16d`) | Pré-visualização ao vivo sobre o texto real (`RN-02.16e`) |
| **Painel de dicionário** | Verbete, classe gramatical, acepções, ação de salvar como anotação | Vazio (verbete inexistente), Carregando, Offline (apenas dicionário embarcado) |
| **Sumário / Navegação** | Capítulos, busca no texto, marcadores, destaques | Vazio |
| **Meus destaques e anotações** | Lista por obra, filtro por cor, busca, exportação | Vazio (explica como criar o primeiro) |
| **Estante** | **O acervo completo do que já foi lido** — é aqui, e só aqui, que uma obra concluída aparece (`RN-02.6a`). Lombadas por gênero, ordenação, acesso à obra e às citações dela. Obra em releitura permanece na Estante enquanto também volta à Biblioteca (`RN-02.6b`) | Vazio (estante vazia com convite, nunca com lacunas ou espaços marcados como falta) |
| **Citações da coleção** | Acervo de destaques promovidos, busca, compartilhar (`08`) | Vazio |
| **Conjuntos** | Conjuntos disponíveis, progresso de cada um, selos conquistados, recompensa | Vazio |
| **Escrever resenha** | Nota, texto, contador com o critério de qualificação visível | Erro (progresso insuficiente, com explicação) |
| **Gorjeta ao autor** | Valor em moedas, mensagem opcional, saldo atual | Bloqueado por saldo, Erro |

**Comportamento offline (resumo):** ler, destacar, anotar, consultar dicionário embarcado e registrar sessões funcionam integralmente. Adquirir obra, resenhar publicamente, enviar gorjeta e usar IA exigem conexão.

---

## 8. Dados

| Entidade | Campos principais | Propósito |
|---|---|---|
| `Obra` | id, autor_id, origem (catalogo, dominio_publico, importada), proprietario_id (só para importada), titulo, subtitulo, sinopse, capa_url, generos[], idioma, total_caracteres, total_capitulos, preco, gratuita, status (rascunho, publicada, despublicada, privada), amostra_intervalo, publicada_em | Unidade de catálogo |
| `Capitulo` | id, obra_id, ordem, titulo, inicio_locator, fim_locator, total_caracteres | Marco de recompensa e granularidade de analytics |
| `ItemBiblioteca` | id, usuario_id, obra_id, estado, adquirida_em, origem (compra, gratuita, cortesia), baixada, ultima_abertura | Posse e organização |
| `ProgressoLeitura` | usuario_id, obra_id, locator_atual, percentual, capitulo_atual, paginas_canonicas_lidas, atualizado_em, dispositivo | Retomada e progresso |
| `Destaque` | id, usuario_id, obra_id, locator_inicio, locator_fim, texto, cor, publico, sessao_id, criado_em | Interação qualitativa e insumo de analytics |
| `Anotacao` | id, usuario_id, obra_id, destaque_id (opcional), locator, texto, sessao_id, criado_em | Interação qualitativa |
| `ConsultaDicionario` | id, usuario_id, obra_id, palavra, locator, sessao_id, origem (local, online), criado_em | Interação qualitativa |
| `Resenha` | id, usuario_id, obra_id, nota, texto, qualificada, publica, criado_em, editado_em | Prova social e gatilho de moeda |
| `Marcador` | id, usuario_id, obra_id, locator, rotulo, criado_em | Navegação |
| `ItemEstante` | usuario_id, obra_id, concluida_em, ordem_estante, cor_lombada | Acervo permanente (`RN-02.22a`) |
| `CitacaoColecao` | id, usuario_id, destaque_id, promovida_em | Destaque promovido a citação (`RN-02.22c`) |
| `Conjunto` | chave, nome, criterio, obras_necessarias, selo, recompensa_semente | Catálogo de conjuntos (`RN-02.22d`) |
| `ProgressoConjunto` | usuario_id, conjunto_chave, obras_atendidas[], completo_em | Progresso do leitor |
| `PreferenciasLeitura` | usuario_id, fonte, corpo, entrelinha, margem, alinhamento, tema | Conforto de leitura |

---

## 9. API (alto nível)

| Operação | Descrição |
|---|---|
| Importar EPUB/PDF | Valida formato, extrai metadados e cria obra privada do usuário (`RN-02.1d`) |
| Listar domínio público | Acervo curado e gratuito |
| Buscar catálogo | Busca textual e filtros; retorna obras publicadas |
| Obter obra | Metadados, capítulos, preço, avaliação agregada |
| Obter amostra | Conteúdo do intervalo de amostra |
| Adquirir obra | Cria item de biblioteca; delega cobrança a `10` |
| Listar biblioteca | Itens do usuário com estado e progresso |
| Atualizar estado do item | Transição entre `quero_ler`, `lendo`, `concluido`, `abandonado`, `em_pausa` |
| Obter conteúdo da obra | Entrega o arquivo (EPUB ou PDF) para leitura ou download, com verificação de licença |
| Sincronizar progresso | Envia locator e recebe o vencedor da reconciliação |
| Criar / editar / remover destaque | Inclui alternância de visibilidade pública |
| Criar / editar / remover anotação | Texto vinculado a locator ou destaque |
| Registrar consulta de dicionário | Evento de interação qualitativa |
| Consultar verbete | Fallback online do dicionário |
| Listar destaques e anotações | Por obra ou consolidado, com exportação |
| Obter estante | Acervo de obras concluídas com ordenação |
| Promover destaque a citação | Move um destaque para as citações da coleção |
| Listar conjuntos | Catálogo com progresso do usuário e selos conquistados |
| Criar / editar resenha | Valida progresso mínimo e retorna se qualificou para recompensa |
| Enviar gorjeta | Delega à economia (`07`) com contexto de obra e locator |

---

## 10. Métricas de sucesso

- Tempo entre abrir o app e estar lendo (alvo: < 10 segundos para a obra ativa).
- Percentual de sessões com ao menos uma interação qualitativa (indicador direto de P3).
- Taxa de conversão amostra → aquisição.
- Percentual de novos usuários que importam ao menos um EPUB ou PDF na primeira semana — mede se o leitor aberto está cumprindo o papel de resolver o arranque.
- Percentual de obras iniciadas que chegam a 90% de progresso.
- Visitas à estante por usuário ativo e correlação com retenção — mede se a coleção virou objeto de identidade ou ficou decorativa.
- Percentual de leitores com ao menos um conjunto em progresso.
- Taxa de erro de abertura de obra, por formato (alvo próximo de zero — é falha de núcleo).
- Divergência de sincronização de posição entre dispositivos (alvo: < 0,1% das sessões).

---

## 11. Questões em aberto

| ID | Questão |
|---|---|
| `Q-02.1` | ✅ **Resolvida.** O app é um **leitor aberto** (`RN-02.1`): EPUB ou PDF próprio + domínio público + catálogo de autores da plataforma. Não há revenda de catálogo de terceiros (`RN-02.1c`). Resta curar o acervo inicial de domínio público. |
| `Q-02.2` | Haverá DRM nas obras pagas? DRM protege o autor mas complica leitura offline, sincronização e portabilidade. |
| `Q-02.3` | Suporte a audiolivro e a obras seriadas (publicação capítulo a capítulo)? Obra seriada muda a modelagem de progresso, de ofensiva e de analytics. |
| `Q-02.4` | Qual dicionário será embarcado (licença, idiomas suportados)? Afeta tamanho do app e custo. |
| `Q-02.5` | **PDF, na prática, é um EPUB "achatado" (sem estrutura de spine)?** A paridade de `RN-02.1f` exige extrair texto de PDF para montar o mesmo índice de caracteres que o EPUB tem via `spine` (`stack.md` §6). PDF digitalizado por imagem (sem camada de texto) não tem como gerar esse índice — a spec precisa decidir se recusa o arquivo na importação ou se degrada para progresso por número de página, quebrando a paridade prometida. |
| `Q-02.6` | Destaques públicos: haverá superfície social para o leitor descobrir os destaques de outros leitores, ou eles servem apenas ao agregado do autor? |
| `Q-02.6` | ✅ **Resolvida** por [`13-moderacao-e-curadoria.md`](13-moderacao-e-curadoria.md): resenha é alvo denunciável como qualquer outra superfície (`RN-13.29`), com triagem automática e decisão humana nos casos graves (`RN-13.37`). |
| `Q-02.7` | O leitor comprará em moedas com paridade fixa em relação ao preço em dinheiro, ou o autor define preço separado em moedas? Interage com `Q-07.1`. |
| `Q-02.8` | **Sobrecarga de controles.** `RN-02.16d` torna obrigatórios dez controles no painel de leitura, e `RN-02.13a` acrescenta um nível de configuração que o leitor precisa entender. O painel corre risco real de virar um cockpit para um público que, por `P7`, é justamente quem tem menos paciência com configuração. A validar em teste de usabilidade: quantos desses controles são de fato usados, quais podem viver numa segunda camada ("mais opções") e se algum deve ser inferido em vez de perguntado. **Nenhum controle sai de `RN-02.16d` antes dessa medição** — a decisão precisa de dado, não de intuição. |
