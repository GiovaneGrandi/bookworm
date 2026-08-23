# 01 — Brechas: onde a experiência quebra

Cada brecha traz o momento exato em que ela acontece, o que o jogador sente, a regra responsável e a severidade. Ordenadas por impacto sobre retenção.

**Severidade:** 🔴 crítica (custa retenção agora) · 🟠 alta (frustra e acumula) · 🟡 média (limita o teto do produto) · ⚪ debate (decisão consciente, não erro)

| Severidade | Quantidade |
|---|---|
| 🔴 Crítica | 2 |
| 🟠 Alta | 8 |
| 🟡 Média | 7 |
| ⚪ Debate | 1 |

---

## ✅ B-01 — A vitória diária acontece enquanto o jogador dorme

> **RESOLVIDO NA SPEC.** As regras `RN-04.10a` a `RN-04.10f` foram adicionadas a [`../specs/04-streaks-e-jardim.md`](../specs/04-streaks-e-jardim.md): o cumprimento é detectado no instante em que acontece, a ofensiva avança na hora, e a celebração aparece na primeira fronteira natural — fim de capítulo ou encerramento da sessão — sempre com o usuário ainda no app. O job da virada do dia passou a cuidar só de congelamento, dormência e reconciliação. O diagnóstico abaixo fica como registro do problema original.

**Regra:** `RN-04.10`, `RN-04.11` e o job de virada de dia (`specs/04-streaks-e-jardim.md` §9)

**Momento:** são 20h47. O jogador termina a sessão e cumpriu a meta do dia. A tela de resumo mostra tempo e páginas.

**O que a spec faz:** nada, ali. A ofensiva e o jardim são atualizados pelo job que roda na virada do dia. O jogador vê o resultado no dia seguinte.

**O que ele sente:** nada. E "nada" é o pior retorno possível para o momento mais importante do jogo.

Bater a meta é o clímax do loop diário — é a única coisa que o produto pede que a pessoa faça. Duolingo faz a tela inteira explodir no instante em que a lição fecha a meta. Strava dá o *kudos* e o PR na hora. A spec do BookWorm agenda a comemoração para a meia-noite.

**Por que aconteceu:** a spec modelou a ofensiva como *derivada* dos agregados diários (`RN-04.11`), o que é tecnicamente correto — permite recompor dias com sessões offline atrasadas. Mas a decisão de arquitetura vazou para a experiência: o dado é recalculável **e** a celebração ficou presa no recálculo.

**Como resolver sem quebrar a arquitetura:** celebrar otimista no cliente, no instante em que a meta é atingida, e reconciliar depois. O número na tela pode ser provisório; a emoção não pode esperar 4 horas. → `M-02`

---

## 🔴 B-02 — As ações que o jogador mais repete não devolvem nada

**Regra:** ausência. `RN-02.13` (leitor imersivo) e todo o módulo `03` definem o que é *medido*, nunca o que é *devolvido*.

**Momento:** o jogador vira a página pela 60ª vez na sessão. Grifa um trecho que o emocionou. Consulta uma palavra.

**O que a spec faz:** registra tudo (`RN-02.21`). Devolve o grifo colorido e o verbete. Mais nada.

**O que ele sente:** que o app é um bloco de notas com cronômetro.

Este é o paradoxo central da Leitura Consciente: a spec **exige** interações qualitativas para o score subir (`RN-03.17`) mas não dá **nenhum retorno** no momento em que a interação acontece. Está pedindo um comportamento e não reforçando ele.

**Cuidado:** a solução não é encher o leitor de badges — `RN-02.13` está certo e deve ser defendido. É possível dar peso ao gesto sem quebrar o fluxo: som, háptico, micro-animação, acumulação silenciosa que só é revelada no fim. → [`02-juiciness.md`](02-juiciness.md) §2 e `M-06`

---

## 🟠 B-03 — O jogador é punido por um algoritmo que nunca lhe mostrou a régua

**Regra:** `RN-03.24` — sessão fora de 0,25× a 4× da baseline é marcada `suspeita`, não gera moeda e não conta para a ofensiva

**Momento:** o jogador passa rápido por um apêndice, relê um capítulo que já conhece, lê um livro muito mais fácil que o normal, ou folheia a lista de personagens no início do volume. Fica acima de 4× a baseline.

**O que ele sente:** leu, o app contou o tempo, e no fim a sessão "não valeu". A explicação é neutra (`RN-03.28`), mas neutra não é o mesmo que compreensível — ele não sabia que existia uma faixa, e agora descobriu porque foi punido por ela.

**O problema de design:** o antifraude está correto como defesa da economia e errado como experiência. Ele trata **falso positivo do usuário honesto** e **fraude real** com a mesma consequência visível. E a faixa é mais estreita do que parece: ler poesia devagar e um thriller rápido pode estourar 4× em um mesmo dia.

**Direção:** separar as duas consequências. Sessão fora da faixa pode não gerar moeda (defesa da economia) **e ainda assim contar para a ofensiva** (defesa do hábito). Perder a ofensiva por causa de heurística é desproporcional. → `M-08`

---

## 🟠 B-04 — O micro-hábito que o produto promete construir não conta

**Regra:** `RN-03.7` — sessão com menos de 60 s de tempo ativo é descartada

**Momento:** duas páginas na fila do mercado. Uma página antes de dormir, olhos fechando.

**O que ele sente:** que abrir o livro por pouco tempo é o mesmo que não abrir.

**O problema:** o produto inteiro se vende como construtor de hábito, e a primeira coisa que um hábito precisa é que a **menor versão possível dele conte**. É o princípio do "hábito atômico" — a versão de dois minutos é o que sustenta a corrente nos dias ruins. A spec descarta a versão de um minuto.

O limite existe por antifraude e por higiene de dados, o que é legítimo. Mas descartar ≠ invisibilizar: a sessão pode não gerar moeda e ainda assim aparecer no histórico e somar para a meta do dia. → `M-08`

---

## 🟠 B-05 — Ler ficção sem grifar é classificado como leitura inferior

**Regra:** `RN-03.21` — sessão sem interação qualitativa tem score máximo 60, e `RN-03.22` rotula 0–39 como "leitura corrida"

**Momento:** o jogador lê 40 minutos de um romance, absolutamente absorvido, sem parar uma vez para grifar. É a melhor sessão de leitura possível.

**O que a spec devolve:** no máximo 60 pontos, faixa "leitura atenta" — abaixo de quem parou quatro vezes para anotar.

**O problema:** a fórmula confunde **evidência de atenção** com **atenção**. Grifar é sinal de leitura ativa em não-ficção e em estudo; em ficção imersiva, parar para grifar frequentemente é sinal de **quebra** do fluxo, não de profundidade. O sistema está premiando a interrupção e chamando a imersão de rasa.

Há ironia: a mecânica criada para proteger a profundidade (P3) pune a forma mais profunda de ler.

**Direção:** o score precisa reconhecer o **bloco contínuo de foco** como evidência de profundidade equivalente à interação. Quem lê 40 minutos sem levantar os olhos merece a faixa mais alta. → `M-09`

---

## 🟠 B-06 — O jogador paga para corrigir o próprio erro

**Regra:** `RN-04.6` — alterar a meta base custa 150 moedas após os 7 primeiros dias

**Momento:** a pessoa definiu 15 páginas no onboarding sem fazer ideia do que isso significa. Duas semanas depois percebe que sua rotina comporta 8. Para ajustar, paga.

**O que ela sente:** punida por ter se conhecido melhor.

**O problema:** a regra veio do rascunho ("adicionando peso e compromisso à escolha", `BookWorm.md` L78) e a intenção é boa — meta que muda toda hora não é meta. Mas o instrumento está errado: **cobra-se pelo comportamento que se quer incentivar**, que é calibrar a régua até ela ser sustentável.

Pior: o incentivo real que a regra cria é o jogador **manter uma meta inadequada** — alta demais e frustrante, ou baixa demais e sem sentido — porque mudar dói. Uma meta errada mantida é o caminho mais curto para o abandono.

**Direção:** o custo não deveria ser em moeda, e sim em **tempo e atrito** — vigência a partir do dia seguinte (`RN-04.7`, que já existe e já resolve o abuso), mais um limite de alterações por período. Reduzir a meta em momento de dificuldade deveria ser explicitamente gratuito e acolhido. → `M-08`

---

## 🟠 B-08 — Voltar depois de sumir não é uma ação, é só uma cor diferente

**Regras:** `RN-04.25` (dormência), `RN-04.21` (sem recuperação de ofensiva), `RN-06.21` (Ghost silencioso no retorno)

**Momento:** o jogador perdeu a ofensiva de 40 dias e some por duas semanas. Um dia, reabre o app.

**O que a spec oferece:** um jardim em tons de outono, uma mensagem acolhedora, e a ofensiva zerada em 0. Ao ler um dia, o viço volta (`RN-04.26`).

**O que falta:** **algo para fazer.** A retomada é toda passiva — estética e mensagem. Não existe nenhuma ação que reconheça o esforço de voltar, nenhum objetivo curto de reentrada, nenhuma forma de honrar os 40 dias que existiram.

Duolingo tem a reparação de ofensiva e ela é, isoladamente, uma das mecânicas de retorno mais eficazes do gênero. A spec a proíbe (`RN-04.21`) — com razão parcial: vender de volta o que se perdeu, em cima da frustração, é padrão escuro. Mas existe um caminho intermediário que a spec nem considerou: **reconquistar**, em vez de comprar. Ler 3 dias seguidos restaura parte da ofensiva antiga. Não se vende alívio; entrega-se esforço. → `M-05`

**Nota adicional:** `RN-06.21` silencia o Ghost no retorno, o que é humano, mas soma-se ao vazio: no dia em que a pessoa mais precisa de um objetivo pequeno e claro, o sistema não oferece nenhum.

---

## 🟠 B-12 — O onboarding só entrega trabalho antes de entregar prazer

**Regra:** `RN-01.5` — cinco passos: interesses, intenção, meta, baseline de até 5 minutos, primeira obra

**Momento:** primeiros 8 minutos de vida do usuário no app.

**O que ele faz:** escolhe gêneros, declara intenção, configura uma meta que ainda não sabe calibrar, lê um trecho **sendo medido**, escolhe um livro.

**O que ele não faz:** ganhar nada. Sentir nada. Ver o jardim. Ver uma ofensiva em 1.

**O problema:** todo jogo bom entrega uma vitória antes de pedir configuração. A spec inverteu: pede cinco decisões de um usuário que ainda não tem contexto para nenhuma delas, e mede o desempenho dele antes de mostrar por que medir é bom.

Detalhe agravante: o passo da baseline (`RN-01.8`) diz explicitamente que **não** é teste de velocidade — o que é correto para não enviesar a medida, mas significa que o usuário passa 5 minutos fazendo algo cuja utilidade não lhe foi explicada.

**Direção:** primeira sessão real de leitura em menos de 60 segundos, com jardim plantado e ofensiva em 1 antes de qualquer configuração. Interesses e meta migram para depois da primeira vitória — quando ele já sabe o que uma meta significa. A baseline se coleta sozinha, na primeira leitura de verdade (a spec já suporta isso: `RN-06.2` deriva baseline de 3 sessões). → `M-07`

---

## 🟠 B-14 — Não existe outra pessoa dentro do produto

**Regras:** `RN-06.8` (proibição de leaderboard) e a ausência de qualquer mecânica social interna

**Momento:** o jogador terminou um livro que o marcou profundamente. Quer falar sobre ele.

**O que a spec oferece:** escrever uma resenha (`LEI-15`) e gerar um card para postar **fora** do app (`08`).

**O problema:** ler é uma das atividades sociais mais antigas que existem. Clubes de leitura, indicação entre amigos, discussão de capítulo — nada disso existe no produto. O único social especificado é centrífugo: exportar para o Instagram.

A remoção do leaderboard está certa (P1). O erro não é remover — é **não colocar nada no lugar**. O Core Drive 5 do Octalysis é "Influência Social **e Pertencimento**"; a spec implementou influência e ignorou pertencimento.

E há uma assimetria estranha: o produto tem autores publicando e leitores dando gorjeta — existe um relacionamento humano ali — mas o leitor não pode conversar com ninguém sobre o que leu, nem mesmo com o autor.

Mecânicas colaborativas (meta de grupo, leitura em dupla, clube com progresso coletivo) **não violam P1**, porque não classificam ninguém. → `M-04`

---

## 🟡 B-07 — O teto diário manda o jogador parar de jogar

**Regra:** `RN-07.8` — 150 moedas por dia por conta

**Momento:** domingo à tarde, o jogador está na melhor sessão do mês, três horas de leitura. Atinge o teto no meio.

**O que a spec faz:** informa que os ganhos voltam amanhã (`RN-07.8` exige transparência, o que é bom).

**O que ele sente:** que a partir dali seu esforço vale zero.

**O problema:** o teto é necessário como defesa antifraude, mas hoje ele atinge exatamente o comportamento que o produto mais quer — a maratona voluntária de fim de semana. Nenhum sistema deveria dizer "pare" ao seu melhor jogador no seu melhor dia.

**Direção:** manter o teto para moeda e criar uma moeda-sombra sem valor econômico (progresso de coleção, crescimento do jardim, XP de identidade) que **nunca** tem teto. O esforço extra sempre produz algo, mesmo que não produza moeda. → `M-03`, `M-06`

---

## 🟡 B-09 — Um ghost que não corre ao lado não é um ghost

**Regra:** `RN-06.16` — o Ghost Reader é completamente invisível durante a sessão

**Momento:** o jogador recebe "seu melhor foco foi 12 minutos, consegue 14?" na abertura. Lê. No fim, descobre que fez 9.

**O problema:** a mecânica do fantasma, em corrida, funciona porque ele **está ali, na pista, o tempo todo**. É a presença contínua que produz tensão. A spec importou a metáfora e removeu justamente a parte que a faz funcionar, deixando um desafio na abertura e um resultado no fim — ou seja, um placar, não um ghost.

A intenção é correta (proteger o fluxo, P3, `RN-02.15`), e encher a tela de leitura com um cronômetro competitivo seria pior do que a situação atual.

**Mas existe meio-termo que a spec não considerou:** o fim de capítulo já é um ponto natural de respiro, onde o leitor levanta os olhos. Mostrar o ghost **ali** não quebra fluxo nenhum — o fluxo já foi quebrado pelo próprio texto. → `M-10`

---

## 🟡 B-10 — O congelamento é gasto sem o jogador decidir

**Regra:** `RN-04.17` — consumo automático na virada do dia

**Momento:** o jogador está com 200 moedas guardadas para um item do jardim. Perde um dia. Acorda com 200 moedas a menos.

**O que ele sente:** roubado — mesmo tendo sido avisado.

**O problema:** o consumo automático protege a ofensiva e sequestra a decisão. Para muitos jogadores, **perder a ofensiva teria doído menos** do que perder a poupança sem escolher. O sistema decidiu por eles qual dos dois bens era mais valioso.

Duolingo acerta aqui por um motivo específico: o congelamento é **comprado e equipado antecipadamente**, o que faz o consumo parecer um escudo que o jogador colocou de propósito — a decisão já foi tomada, com consentimento, antes do evento.

**Direção:** equipar explicitamente ("proteger meus próximos dias"), ou oferecer uma janela curta de escolha na manhã seguinte. → `M-08`

---

## 🟡 B-11 — Ler dentro do app pode não contar como leitura

**Regra:** `RN-03.8` — sessões de tipo `amostra` e `pilula` não contam para ofensiva nem geram moeda

**Momento:** o jogador passa 20 minutos no feed lendo pílulas e uma amostra que o interessou. Perde a ofensiva do dia.

**O que ele sente:** que o app tem regras arbitrárias sobre o que é "ler de verdade".

**O problema:** a regra é coerente por dentro (evita farm de ofensiva em conteúdo curto) e incoerente por fora. O feed é a superfície de aquisição do produto (`05`), a que ele mais quer que a pessoa use — e é a única em que o esforço não conta.

Some-se `RN-05.24`, que empurra o jogador para fora do feed após 15 minutos, e o produto fica com uma superfície que ele promove, limita e desvaloriza ao mesmo tempo.

**Direção:** leitura de amostra é leitura — deveria contar integralmente. Pílula pode contar com peso reduzido ou até um teto diário, mas não zero. → `M-08`

---

## 🟡 B-13 — Transparência total elimina toda surpresa

**Regra:** `RN-07.7` — a tela de ganhos lista todos os gatilhos e valores de forma explícita e permanente

**O trade-off:** a regra compra confiança (o jogador nunca se sente manipulado) e vende curiosidade (CD7 fica em 1/10, ver [`00-diagnostico.md`](00-diagnostico.md) §3). Quando todo retorno é publicado em tabela, o sistema vira uma planilha com a qual se interage.

**O que não pode acontecer:** transformar a economia em caça-níquel, ou esconder a régua para manipular. A spec está certa em recusar isso.

**O que é possível:** manter **toda a economia de moeda** publicada e transparente, e colocar a imprevisibilidade **fora** da moeda — em coleção, em raridade cosmética, em achados. O jogador sempre sabe exatamente quantas moedas vai ganhar; ele não sabe qual semente vai brotar. Nada de valor econômico é aleatório, e ainda assim existe surpresa. → `M-03`

---

## 🟡 B-15 — Terminar um livro vale o mesmo que dez capítulos

**Regra:** tabela de gatilhos em `specs/07-economia-moedas.md` §5.2 — obra concluída: 50 moedas

**O problema:** concluir uma obra é o feito mais significativo que existe no produto. É o que o app inteiro existe para provocar. Ele rende 50 moedas, um card automático (`RN-08.27`) e a mudança de estado na biblioteca.

Comparado ao resto da tabela: dez capítulos rendem os mesmos 50. Cinco dias de meta cumprida rendem os mesmos 50. Terminar *Guerra e Paz* e terminar uma novela de 80 páginas rendem exatamente o mesmo.

**Direção:** a conclusão precisa ser o pico do produto — cerimônia dedicada, recompensa proporcional ao tamanho da obra, entrada em coleção permanente, e o único momento em que o app pode legitimamente fazer barulho. → `M-06` e [`02-juiciness.md`](02-juiciness.md) §4

---

## 🟡 B-16 — O escritor recebeu um espelho, não um jogo

**Regras:** `RN-09.9` (quest), `RN-09.10` (sprint), `RN-04.12` (ofensiva de escrita)

**O problema:** o eixo de escrita reusa a estrutura da leitura — mesma meta, mesmo jardim, mesmo freeze — com apenas duas mecânicas próprias: quest diária e sprint cronometrado com recorde de PPM.

Faltam as mecânicas naturais do ofício: enfrentar o bloqueio criativo (que o próprio rascunho declara como objetivo, `BookWorm.md` L110), o ritual de aquecimento, o prazer de ver o manuscrito engordar, marcos de obra (primeiro capítulo, metade, primeiro rascunho pronto), e o feedback do leitor chegando enquanto se escreve.

O autor é o lado que **paga** pela plataforma (`10`) e é o menos desenhado. → `M-06`

---

## 🟠 B-18 — O Premium Reader pode canibalizar o comportamento que o produto vende

**Regras:** `RN-11.7` (resumo de capítulo), `RN-11.16` (chat com o livro), `RN-11.24` (IA não conta como interação qualitativa)

**Momento:** o jogador tem um capítulo denso pela frente. Pede o resumo. Lê o resumo. Segue para o próximo capítulo.

**O problema:** o produto vende assinatura para uma ferramenta que permite **não ler** — e a spec só bloqueou a porta pequena. `RN-11.24` acerta ao impedir que usar IA infle a Leitura Consciente, e `RN-11.19` acerta ao recusar escrever redação pelo leitor. Mas nada impede o padrão mais óbvio e mais provável: substituir a leitura do capítulo pelo resumo dele, avançar a posição, e manter ofensiva, moedas e progresso intactos.

É a única mecânica do produto que está em conflito direto com a missão declarada. E é paga.

**Por que isso é um problema de game design, não só de produto:** o sistema recompensa o avanço de posição (`RN-02.9`) e o tempo em tela. Se o resumo produz o mesmo avanço com uma fração do esforço, ele é **estratégia dominante** — e jogadores encontram estratégias dominantes. Um sistema que oferece um atalho barato para a recompensa acaba ensinando o atalho.

**Direção:** o resumo deveria ser posicionado como ferramenta de **retomada e consolidação**, não de avanço. Concretamente: liberar o resumo de um capítulo apenas depois de ele ter sido lido, e manter "a história até aqui" (`RN-11.7`) livre — que é o caso de uso legítimo de quem voltou depois de um mês. Ler o resumo de um capítulo não lido não deveria avançar a posição de leitura.

**Nota:** isso não é hipótese distante. É o padrão de uso dominante de resumos de livro desde que eles existem.

---

## ⚪ B-17 — O produto estrangula o próprio motor de aquisição

**Regras:** `RN-05.24` (intersticial após 15 min de feed), `RN-05.26` (limite diário de feed), `RN-05.22` (feed não gera moeda)

**Não classifico como erro.** É uma decisão de valor deliberada e coerente com P3: o feed existe para levar à leitura longa, não para consumir a tarde da pessoa.

**Mas o custo precisa ser consciente:** o feed é a superfície de aquisição (`05` §10), a que compete com TikTok, e o produto voluntariamente reduz o tempo nela, não a recompensa e ainda tira dela a contagem de ofensiva (`B-11`). São quatro decisões que empurram na mesma direção, cada uma pequena, somando um estrangulamento.

**A pergunta para você:** o feed é aquisição (e então precisa de tempo e força para converter) ou é isca controlada (e então esse desenho está certo)? A resposta muda `05` inteiro. → decisão em [`04-decisoes.md`](04-decisoes.md)
