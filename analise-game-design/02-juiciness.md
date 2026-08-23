# 02 — Juiciness: a camada de feedback que falta

## 1. O que é juice, operacionalmente

Juice é **retorno desproporcional ao input**. O jogador faz um gesto pequeno e o sistema responde com mais informação sensorial do que o gesto tecnicamente exige. Não é enfeite: é o que faz uma ação *parecer* que aconteceu.

A spec do BookWorm define exaustivamente o que o sistema **mede** e quase nada do que ele **devolve** (`B-02`). Este documento preenche essa lacuna.

Três regras que valem para tudo aqui:

1. **Juice não substitui mecânica.** Uma animação bonita não conserta uma recompensa que chega 24h atrasada (`B-01`). Juice amplifica o que já funciona.
2. **Juice precisa ser proporcional à raridade.** Se terminar um capítulo e terminar um livro fazem o mesmo barulho, os dois viram ruído. A escala de intensidade é o que dá significado.
3. **A ausência de juice também comunica.** Um app silencioso diz "nada de importante aconteceu aqui".

---

## 2. A fronteira intocável

**Nada neste documento entra no leitor durante o fluxo de leitura.** `RN-02.13` (modo imersivo, sem barra, sem contador, sem badge) está certo e é a coisa mais valiosa da spec inteira. Nenhuma proposta abaixo o viola.

A regra que separa o que pode do que não pode:

> Juice é permitida no gesto **que o próprio jogador iniciou** e nas **fronteiras naturais** do texto (fim de capítulo, fim de sessão). É proibida como interrupção não solicitada no meio da leitura.

Um som ao grifar é resposta a uma ação dele. Um pop-up de "você está indo bem!" no meio da página é invasão. A diferença é quem iniciou.

---

## 3. Micro — por gesto (a camada mais barata e a mais ausente)

Resolve `B-02`. Custo de produção baixo, impacto alto, porque essas ações acontecem centenas de vezes por sessão.

### `J-01` — Virada de página
O gesto mais repetido do produto. Hoje: indefinido.

- Animação de virada com peso físico — curva de desaceleração, não linear. A página tem massa.
- Háptico leve no assentamento, não no toque.
- Silêncio por padrão. Som de papel é encantador na primeira hora e insuportável na terceira — deve existir e vir **desligado**, ativável nas preferências de leitura (`RN-02.16`).

### `J-02` — Criação de destaque
O gesto que o produto mais quer incentivar (`RN-03.17`) e que hoje devolve apenas a cor.

- A cor não aparece pronta: ela **preenche** o trecho da esquerda para a direita, em ~180 ms, como tinta absorvendo no papel.
- Háptico médio no fim do preenchimento — é a confirmação de que algo foi guardado.
- Contador silencioso: nada aparece na tela. O destaque é acumulado e **revelado depois**, no resumo de sessão (`J-06`). Isso preserva o fluxo e cria expectativa.

### `J-03` — Anotação salva
- A nota "dobra" e se guarda na margem com uma micro-animação de 200 ms.
- Marcador discreto e permanente na margem: o jogador vê que aquele trecho tem história dele.

### `J-04` — Consulta ao dicionário
- O painel sobe de baixo com *spring*, não com *fade*. Movimento tem personalidade; opacidade não tem.
- Ao fechar, a palavra consultada fica com um sublinhado tênue e permanente no texto — vestígio da própria curiosidade. Um registro visível de que aquela página foi trabalhada.

### `J-05` — Fim de capítulo
A primeira fronteira natural onde a juice pode aparecer sem quebrar nada.

- Micro-cerimônia de 2 a 3 segundos, dispensável com um toque: o número do capítulo concluído, as moedas creditadas voando para o canto, e a barra da obra avançando visivelmente.
- É aqui que o Ghost pode aparecer sem violar o fluxo (`M-10`, `B-09`).

---

## 4. Meso — a sessão como cena de fim de fase

Hoje a tela de resumo (`specs/03-sessoes-e-metricas.md` §7) é um **relatório**: tempo ativo, páginas, faixa de Leitura Consciente, destaques, progresso. Todos os dados certos, apresentados como planilha.

Essa tela deveria ser o momento mais bem produzido do aplicativo. É o único lugar em que o jogador, tendo acabado de fazer a coisa difícil, está disponível para receber recompensa.

### `J-06` — Coreografia proposta do resumo de sessão

Sequência de ~6 segundos, integralmente pulável com um toque:

| Tempo | O que acontece |
|---|---|
| 0,0 s | O texto do livro desfoca e recua. Transição de estado: você saiu do livro |
| 0,3 s | **Tempo ativo** conta de 0 até o valor final, com desaceleração. Números que contam parecem conquistados; números que aparecem prontos parecem informados |
| 1,0 s | **Páginas** contam em seguida, sobrepondo levemente a anterior |
| 1,6 s | **Destaques acumulados na sessão aparecem em sequência** — os trechos que ele grifou, um por vez, rápido. É a revelação prometida em `J-02`, e é o único momento do app em que ele revê as próprias palavras escolhidas |
| 2,8 s | **Moedas** voam da tela para o ícone da carteira, com háptico por grupo. Nunca uma moeda por vez: agrupadas |
| 3,4 s | **A planta cresce na frente dele.** Não "seu jardim foi atualizado" — a muda literalmente ganha altura, em tempo real, na tela. É a recompensa visual central do produto e hoje ela acontece invisível, à meia-noite (`B-01`) |
| 4,2 s | **Se a meta foi batida:** a chama/selo da ofensiva acende com o novo número, háptico forte, e um único momento de silêncio antes do som. Pausa antes do clímax vale mais que volume |
| 5,0 s | Ações: continuar lendo · compartilhar card · fechar |

**Nota crítica:** o passo de 3,4 s e o de 4,2 s dependem de `M-02` (celebração otimista no cliente). Sem resolver `B-01`, esta coreografia não tem o que celebrar no momento certo.

### `J-07` — Escala de intensidade
A mesma tela precisa de três volumes distintos, ou tudo vira ruído:

| Situação | Intensidade |
|---|---|
| Sessão comum, meta ainda não batida | Discreta: números contam, planta não muda de estágio |
| Sessão que **bate a meta do dia** | Alta: sequência completa, chama, háptico forte |
| Sessão que **conclui capítulo ou obra** | Máxima: ver `J-08` |

---

## 5. Macro — os momentos raros

### `J-08` — Conclusão de obra
Resolve `B-15`. É o pico do produto e hoje é um card automático.

- Tela dedicada, não um resumo com badge a mais. A capa em destaque, o tempo total investido, o número de sessões, quando começou e quando terminou, os destaques favoritos daquele livro.
- **O livro entra fisicamente na estante** — animação de deslocamento para a coleção (`M-03`). Ele *possui* algo agora.
- É o único momento em que o app pode fazer barulho de verdade: som completo, háptico longo, tela cheia.
- Fecho emocional: uma frase da própria obra, escolhida entre os destaques do jogador, com o dado do tempo que ele passou naquele mundo.

### `J-09` — Marco de ofensiva
7, 30, 100, 365 dias (`RN-04.13`). A intensidade precisa **escalar** com o marco: o de 7 dias é uma comemoração contida; o de 365 pode ocupar a tela inteira por 10 segundos e ninguém vai reclamar.

Regra: se o marco de 365 dias tiver a mesma animação do de 7, o de 365 vai decepcionar.

### `J-10` — Mudança de estágio do jardim
Broto → muda → planta florida → árvore → bosque (`RN-04.23`). Cinco transições em toda a vida do jogador. São raras o bastante para merecer cena própria — a cena deve acontecer no resumo de sessão, com a câmera se afastando para revelar o jardim inteiro no novo estágio.

---

## 6. O jardim como personagem, não como gráfico

O jardim é a maior oportunidade de juice do produto e a spec o trata como visualização de estado (`RN-04.22` a `RN-04.28`).

### `J-11` — Vida ambiente
Um jardim que só muda quando o jogador cumpre meta é um gráfico de barras com folhas. Ele precisa estar **vivo entre as visitas**:

- Movimento constante e sutil: vento nas folhas, luz mudando com a hora real do dia, chuva ocasional, um pássaro que pousa e sai.
- Ao abrir a tela em horários diferentes, a cena está diferente. Isso cria motivo para visitar sem que haja recompensa envolvida — o tipo mais barato e mais saudável de retorno.
- Comparação: Finch constrói toda a sua retenção sobre isso. O bicho está fazendo algo quando você abre. Não é recompensa, é presença.

### `J-12` — Interatividade sem propósito
Poder tocar nas plantas e elas reagirem. Poder mover um item. Um gato que aparece se você tocar três vezes no mesmo lugar. Nada disso dá moeda, XP ou progresso — e é justamente por isso que funciona: é o único espaço do produto que não está medindo o jogador.

### `J-13` — A dormência precisa ser bonita, não apagada
`RN-04.25` acerta ao não matar o jardim. Mas "paleta de outono e menos movimento" pode facilmente virar "tela cinza e triste", o que produz o efeito oposto ao pretendido.

O outono deve ser **deslumbrante** — dourado, folhas caindo, luz baixa e quente. O jogador precisa querer voltar àquela tela, não evitá-la. Se a dormência for feia, ela pune; se for linda, ela convida.

---

## 7. Camada transversal

### `J-14` — Identidade sonora
Uma paleta curta e coerente: confirmação, conquista pequena, conquista grande, moeda, erro. Cinco sons, um instrumento, uma assinatura reconhecível. Um app cujo som de conquista é identificável fora do app tem uma vantagem de marca real.

Tudo desligável, e **silencioso por padrão durante a leitura**.

### `J-15` — Háptico como linguagem
No mobile, o háptico é o canal mais subutilizado e o único que funciona com o som desligado — que é como a maioria lê. Vocabulário proposto: toque leve para confirmação, duplo para conquista pequena, longo crescente para marco. Consistente em todo o produto.

### `J-16` — Números que se comportam
Todo número exibido no produto (moedas, dias, páginas, minutos) deve **contar** ao aparecer e **pulsar** ao mudar. Tipografia de numerais tabulares para não tremer durante a contagem. É um detalhe de 20 linhas de código que muda a percepção de qualidade da tela inteira.

### `J-17` — Movimento com personalidade
Nenhuma animação linear. Curvas com *overshoot* leve em conquistas, desaceleração em informação. Elementos que entram na tela vindos de onde faz sentido — a moeda vem do texto e vai para a carteira, não aparece do nada no centro.

---

## 8. O que o app faz quando o jogador não fez nada

Categoria inteiramente ausente da spec e decisiva para retenção.

### `J-18` — A tela de abertura sabe que horas são
Abrir o app às 7h e às 23h deveria produzir telas diferentes — luz, saudação, sugestão. Um produto que reage ao contexto parece atento.

### `J-19` — O estado de "quase"
Faltando pouco para a meta, o jardim mostra a planta **prestes** a crescer, com a diferença exata em páginas ou minutos. O incompleto visível é mais motivador que o número: uma barra a 90% pede para ser fechada de um jeito que "faltam 3 páginas" não pede.

### `J-20` — Voltar depois de sumir
Resolve parte de `B-08`. A cena de retorno é a mais importante do produto e hoje é uma mensagem de texto. Deveria ser uma **cena**: o jardim dourado de outono, a luz voltando devagar conforme a tela carrega, e uma única ação clara e pequena — "leia 5 páginas hoje" — em vez de acolhimento genérico.

---

## 9. Onde **não** colocar juice

Lista de proibições, tão importante quanto as propostas:

| Nunca | Por quê |
|---|---|
| Qualquer elemento animado no leitor durante a leitura | `RN-02.13`, P3. É a fronteira |
| Celebrar quantidade de páginas por minuto | `RN-03.20`. Premiar velocidade destrói a leitura |
| Animação de conquista que **não pode** ser pulada | Na décima vez, é sequestro de atenção |
| Som ou háptico em momento de perda | Quebra de ofensiva não faz barulho. Nunca |
| Contagem regressiva de ofensiva em risco na tela inicial | Vende ansiedade — `RN-07.26` |
| Confete em cima de dado ruim ("você leu menos que semana passada!") | `RN-06.19` proíbe, e com razão |
| Juice que aparece antes da validação de servidor e depois é retirada | Celebrar e desfazer é pior que não celebrar. Ver `M-02` para o tratamento correto do otimismo |

---

## 10. Se for para fazer só três coisas

Ordem de retorno sobre esforço:

1. **`J-06` — a coreografia do resumo de sessão.** Uma tela, altíssimo impacto, resolve o vazio do momento mais importante do loop (junto de `M-02`).
2. **`J-02` + `J-16` — o destaque que preenche e os números que contam.** Duas semanas de trabalho, sensação de qualidade em todo o produto.
3. **`J-11` — o jardim vivo.** É o que faz alguém abrir o app sem ter sido chamado.
