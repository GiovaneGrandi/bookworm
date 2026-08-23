# 03 — Mecânicas propostas

Cada proposta traz: o problema que resolve, o que o jogador faz, o que ele sente, as regras que seriam afetadas, o princípio que ela tensiona e o custo estimado.

**Nenhuma spec foi alterada.** As referências a `RN-xx.y` indicam onde a mudança incidiria se você aprovar em [`04-decisoes.md`](04-decisoes.md).

**Custo:** 🟢 baixo (dias) · 🟡 médio (semanas) · 🔴 alto (mês ou mais, exige arte ou backend novo)

---

## M-01 — Aposta voluntária: tensão sem punição

**Resolve:** ausência total de stakes ([`00-diagnostico.md`](00-diagnostico.md) §1 e §3, CD8 em 2/10)
**Tensiona:** P2 (anti-frustração) — deliberadamente
**Custo:** 🟡

### O problema
Nada que o jogador faz tem consequência. Não abrir o app nunca dói. Um sistema sem risco é um sistema sem peso.

Mas a solução óbvia — punir quem falha — é exatamente o que P2 recusa, e com razão: punição imposta produz culpa, e culpa produz desinstalação.

### A saída: o jogador escolhe o próprio risco
O que P2 proíbe é a **punição imposta**. Não proíbe o **risco assumido**. Essa distinção é a chave, e a spec nunca a explorou.

**O que o jogador faz:** no início da semana, opcionalmente, ele compromete moedas com uma meta que ele mesmo define ("vou ler 5 dos próximos 7 dias"). Cumprindo, recebe de volta com bônus. Falhando, perde o que apostou.

**O que ele sente:** tensão real durante a semana — mas tensão que **ele escolheu ter**, o que é a diferença entre um desafio e um castigo. E a vitória vale porque podia não acontecer.

### Por que isso não viola o espírito de P2
- É 100% opcional e nunca sugerido em momento de fragilidade (respeita `RN-07.26`).
- O que se arrisca é moeda ganha no jogo, nunca dinheiro, nunca a ofensiva, nunca o jardim.
- Falhar não gera mensagem negativa — a moeda simplesmente não volta, sem cerimônia (mantém `RN-06.19`, `RN-06.20`).
- Quem nunca apostar joga o jogo inteiro sem perceber que a mecânica existe.

**Regras afetadas:** nova mecânica em `04`; novo sink em `07` §5.4; `RN-07.26` precisa de exceção explícita definindo que a oferta de aposta só aparece em início de semana com ofensiva ativa, nunca após uma quebra.

**Benchmark:** é o modelo dos apps de compromisso (Beeminder, StickK) — a única família que resolveu stakes sem crueldade. Habitica pune por padrão e perde usuários por isso; a versão voluntária é o meio-termo.

---

## M-02 — Celebração otimista: a vitória acontece no instante ✅ **APLICADO**

**Resolve:** `B-01` (a brecha mais cara do diagnóstico)
**Tensiona:** nada — é correção de arquitetura de experiência
**Custo:** 🟢

> **Incorporado à spec** como `RN-04.10a`–`RN-04.10f` em [`../specs/04-streaks-e-jardim.md`](../specs/04-streaks-e-jardim.md), com `RN-03.12a` (avaliação contínua da meta) e `RN-02.14a` (a fronteira do leitor imersivo). A proposta abaixo foi seguida integralmente, com um refinamento: a celebração ocorre no **fim de capítulo** quando este vier antes do fim da sessão, reduzindo ainda mais a latência sem quebrar o fluxo.

### O problema
Bater a meta do dia é o clímax do loop e é processado pelo job da virada do dia (`RN-04.11`, `04` §9). O jogador cumpre às 20h e a planta cresce à meia-noite, sozinha.

### A proposta
O cliente detecta o cumprimento da meta **no momento em que ele acontece** e celebra imediatamente (`J-06`, `J-07`). O servidor reconcilia depois, como já faz.

**Regras de convivência com o antifraude** — o ponto delicado, porque celebrar e desfazer é pior que não celebrar (`02-juiciness.md` §9):

1. Celebra-se o **cumprimento da meta** (dado local, verificável no dispositivo), não o **crédito de moedas** (dado do servidor). A ofensiva sobe na hora; a moeda entra quando validar.
2. Se a sessão for depois invalidada (`RN-03.24`), a ofensiva **não é retirada** do dia já celebrado. O custo de manter um dia indevido é irrisório perto do custo de tirar do jogador uma conquista que ele já viu na tela.
3. O antifraude continua protegendo a economia, que é onde há valor real em jogo. Ele deixa de proteger a ofensiva, que é onde há valor emocional. → conecta com `M-08`, item 1.

**Regras afetadas:** `RN-04.11` (a ofensiva continua derivada, mas ganha projeção otimista no cliente), `RN-03.24`, `04` §9.

---

## M-03 — Coleção: o Core Drive mais barato e o mais ausente

**Resolve:** CD4 em 5/10 e CD7 em 1/10 ([`00-diagnostico.md`](00-diagnostico.md) §3); `B-13` (surpresa sem quebrar transparência); `B-07` (esforço extra sempre produz algo)
**Tensiona:** nada
**Custo:** 🟡

### O problema
Não há **nada para colecionar** em um produto sobre livros — que é, historicamente, o objeto de coleção por excelência. A biblioteca é uma lista funcional (`RN-02.5`), não um acervo.

### As três camadas

**1. A estante.** Cada obra concluída vira um objeto físico em uma estante visual, permanente, que só cresce. Lombadas com cores por gênero. Uma estante cheia é a prova de identidade mais forte que este produto pode oferecer — mais que qualquer número.

**2. Citações colecionáveis.** Os destaques que o jogador já cria (`RN-02.18`) viram um acervo navegável e bonito, com os melhores promovidos a "citações da coleção". Transforma uma funcionalidade de anotação em um objeto de posse.

**3. Conjuntos.** Coleções com critério: gêneros, décadas, "5 autores estreantes" (que já é gatilho de moeda, `RN-07.5`), "um livro de cada continente". Cada conjunto completo dá recompensa e um selo permanente.

### Onde entra a imprevisibilidade sem virar caça-níquel
`B-13` mostra o dilema: `RN-07.7` exige publicar toda a economia, o que mata a surpresa. A saída é colocar o aleatório **fora do valor econômico**:

- Toda moeda continua publicada, previsível e auditável. Nada muda em `07`.
- O aleatório fica nos **cosméticos e na coleção**: a semente que você planta não revela qual planta será até brotar; sessões longas ocasionalmente rendem uma variante rara de item de jardim.
- O jogador nunca é surpreendido em algo que tenha valor econômico. É surpreendido em algo que tenha valor afetivo.

**Regras afetadas:** nova seção em `04` (itens com raridade), extensão de `02` (biblioteca → estante), `RN-07.7` permanece intacta.

**Benchmark:** é o que o StoryGraph e o Fable não fazem — ambos tratam o acervo como dado, não como posse. É espaço livre no nicho.

---

## M-04 — Social colaborativo: pertencimento sem classificação

**Resolve:** `B-14`, CD5 em 3/10
**Tensiona:** P1 — mas **não** o viola
**Custo:** 🔴

### O problema
O produto removeu o leaderboard (certo) e não colocou nada no lugar (erro). Ler é social; o app é solitário.

### As mecânicas, em ordem de custo

**1. Leitura em dupla** (🟡). Duas pessoas, o mesmo livro, progresso visível uma para a outra, destaques compartilhados aparecendo na margem. É a mecânica mais poderosa e a mais barata do trio: não precisa de moderação, não precisa de escala, e a retenção de dupla é sempre superior à individual.

**2. Clube de leitura** (🔴). Grupo, obra comum, meta **coletiva** ("juntos, 40 capítulos este mês"), discussão por capítulo com trava de spoiler baseada na posição de cada membro — a spec já tem toda a infraestrutura para isso em `RN-11.1`.

**3. Presentear** (🟡). Dar um livro ou moedas para outro leitor. Reciprocidade é o vínculo social mais forte e é trivialmente implementável sobre o ledger de `07`.

### Por que não viola P1
`RN-06.8` proíbe **ordenar usuários por desempenho**. Meta coletiva não ordena ninguém: o grupo sobe junto ou não sobe. Nenhuma tela mostra quem leu mais dentro do clube — e essa restrição precisa ser explícita no desenho, porque é a tentação óbvia.

**Regras afetadas:** módulo novo; `RN-06.11` (que já antecipa isso e exige mecânica colaborativa) passaria de restrição a especificação.

**Benchmark:** é o núcleo do Fable e a razão pela qual clubes de leitura existem há 300 anos. Duolingo resolveu com ligas (competitivo, proibido aqui); Strava com clubes e kudos (colaborativo, é o modelo a seguir).

---

## M-05 — Reconquista: voltar é uma ação, não uma cor

**Resolve:** `B-08`
**Tensiona:** `RN-04.21` (proibição de restaurar ofensiva)
**Custo:** 🟢

### O problema
`RN-04.21` proíbe recuperar ofensiva perdida. A regra existe para impedir a venda de alívio em cima da frustração — e essa proteção está certa e deve continuar.

Mas a regra jogou fora, junto, o gancho de retorno mais eficaz do gênero. Hoje quem volta encontra um jardim bonito e nada para fazer.

### A distinção que a spec não fez

| | Comprar de volta | Reconquistar |
|---|---|---|
| Como | Pagar moedas depois de perder | Ler 3 dias seguidos após o retorno |
| O que vende | Alívio de frustração | Nada — pede esforço |
| Padrão escuro | Sim | Não |

**O que o jogador faz:** ao voltar depois de uma quebra, recebe um objetivo curto e explícito — "leia 3 dias seguidos e recupere metade da sua ofensiva de 40 dias". Cumprindo, a ofensiva volta a 20, não a 3.

**O que ele sente:** que os 40 dias não foram apagados, e que existe um caminho concreto de volta. É o oposto de recomeçar do zero, que é a sensação que mais afasta quem quebrou uma corrente longa.

**Regras afetadas:** `RN-04.21` precisa distinguir compra (proibida) de reconquista (permitida); `RN-04.11` já suporta recomposição de ofensiva.

---

## M-06 — Trilha paralela: progressão sem teto e marcos de obra

**Resolve:** `B-02` (micro sem retorno), `B-07` (teto que manda parar), `B-15` (conclusão subvalorizada), `B-16` (escritor mal servido)
**Tensiona:** nada
**Custo:** 🟡

### O problema
A moeda é a única forma de progresso, e ela tem teto diário (`RN-07.8`), gatilhos discretos e validação assíncrona. Consequência: em vários momentos, o esforço do jogador não produz absolutamente nada.

### A proposta: uma segunda trilha, sem valor econômico
Uma progressão paralela que **nunca tem teto**, porque não tem valor de troca — não compra nada, não vira dinheiro, não interessa a fraudador.

**Como ela cresce:** com tudo. Páginas lidas, destaques, anotações, capítulos, obras, dias cumpridos. Cada micro-ação empurra a barra um pouco, o que resolve `B-02` sem precisar dar moeda por gesto.

**O que ela dá:** identidade. Níveis de leitor com nome, títulos, molduras de perfil, desbloqueio de itens de jardim e temas de card. Nada funcional, tudo expressivo.

**Por que resolve `B-07`:** ao atingir o teto de moedas, o jogador continua progredindo na trilha. A maratona de domingo nunca é em vão.

### Marcos de obra
A mesma trilha cria marcos **dentro** de cada livro, resolvendo `B-15`: primeiro capítulo, 25%, metade, reta final, conclusão. A conclusão é o maior marco do sistema, com recompensa proporcional ao tamanho da obra — terminar um livro de 900 páginas não pode valer o mesmo que um de 80 (`RN-07` §5.2 hoje dá 50 moedas fixas).

### A versão do escritor
A mesma estrutura aplicada ao manuscrito (`B-16`): primeiras 1.000 palavras, primeiro capítulo fechado, metade do rascunho, rascunho concluído, obra publicada, primeiro leitor, primeira gorjeta, décimo leitor. Hoje o autor só tem quest diária e sprint (`RN-09.9`, `RN-09.10`) — nenhum marco de **obra**, que é o que um escritor de fato persegue.

**Regras afetadas:** nova trilha em `04`; `RN-07.8` ganha a contrapartida sem teto; tabela de `07` §5.2 passa a escalar a conclusão por tamanho; `09` ganha marcos de manuscrito.

---

## M-07 — Onboarding: vitória antes de configuração

**Resolve:** `B-12`
**Tensiona:** `RN-01.5`, `RN-01.7`
**Custo:** 🟢

### A inversão
| Hoje (`RN-01.5`) | Proposto |
|---|---|
| 1. Interesses | 1. **Ler.** Um trecho ótimo, escolhido pela curadoria, direto no leitor imersivo |
| 2. Intenção | 2. **Vencer.** Terminou o trecho: jardim plantado, ofensiva em 1, primeira moeda, coreografia de `J-06` |
| 3. Meta (obrigatória) | 3. Interesses — agora com contexto |
| 4. Baseline medida (5 min) | 4. Meta — agora ele sabe o que "20 minutos" significa, porque acabou de ler |
| 5. Primeira obra | 5. Primeira obra |

**Baseline:** deixa de ser um passo. `RN-06.2` já prevê derivar a baseline das 3 primeiras sessões reais — é mais preciso (mede leitura de verdade, não leitura de teste) e devolve 5 minutos ao usuário.

**O que ele sente:** que o app é sobre ler, não sobre configurar. E sai do onboarding com uma ofensiva ativa — que é o objeto que o produto quer proteger.

**Regras afetadas:** `RN-01.5` reordenado, `RN-01.7` (meta obrigatória migra para depois da primeira sessão), `RN-01.8` a `RN-01.11` (baseline do onboarding deixa de existir), `RN-06.2` vira o caminho único.

---

## M-08 — Pacote de correções pontuais

**Resolve:** `B-03`, `B-04`, `B-06`, `B-10`, `B-11`
**Custo:** 🟢 (todas)

Ajustes de regra que não exigem mecânica nova. São as mudanças de melhor retorno sobre esforço do documento inteiro.

| # | Regra | Hoje | Proposta |
|---|---|---|---|
| 1 | `RN-03.24` | Sessão `suspeita` não conta para ofensiva **nem** gera moeda | Não gera moeda (protege a economia) **mas conta para a ofensiva** (protege o hábito). Perder a corrente por heurística é desproporcional |
| 2 | `RN-03.7` | Sessão < 60 s é descartada | Conta para a meta do dia e aparece no histórico; continua sem gerar moeda. O micro-hábito precisa existir |
| 3 | `RN-04.6` | Alterar meta custa 150 moedas | Gratuito, com atrito de tempo: vale a partir do dia seguinte (`RN-04.7`, que já existe) e limite de 1 alteração por semana. **Reduzir** a meta é sempre livre e acolhido |
| 4 | `RN-04.17` | Congelamento consumido automaticamente | Equipado explicitamente pelo jogador ("proteger meus próximos dias"), ou janela de escolha na manhã seguinte |
| 5 | `RN-03.8` | Amostra e pílula não contam para ofensiva | Amostra conta integralmente (é leitura de livro). Pílula conta com teto diário — 5 min/dia, por exemplo |
| 6 | `RN-07.8` | Teto de moedas para o progresso | Teto mantém-se só para moeda; trilha de `M-06` nunca tem teto |

---

## M-09 — Leitura Consciente v2: foco também é profundidade

**Resolve:** `B-05`
**Tensiona:** nada — corrige a fórmula preservando o princípio
**Custo:** 🟢

### O problema
`RN-03.17` mede profundidade por **tempo ativo + interações**. Sessão sem interação tem teto de 60 (`RN-03.21`). Resultado: 40 minutos de imersão total em um romance pontuam menos que uma leitura picotada com quatro destaques.

### A correção
Reconhecer o **bloco contínuo de foco** como evidência de profundidade equivalente à interação — a spec já mede esse dado, ele está na baseline (`RN-06.1`, `foco_continuo_s`) e simplesmente não é usado no score.

Os 40 pontos hoje exclusivos das interações passariam a ser alcançáveis por **qualquer um** dos dois caminhos: interações qualitativas **ou** blocos longos de foco ininterrupto. Quem faz os dois chega ao topo com folga.

**Efeito:** ficção imersiva e estudo anotado passam a ser duas formas legítimas de ler profundamente — que é o que P3 sempre quis dizer.

**Regras afetadas:** `RN-03.17`, `RN-03.21`; `RN-03.20` (velocidade fora da fórmula) permanece intocada.

---

## M-10 — Ghost em ponto de respiro

**Resolve:** `B-09`
**Tensiona:** `RN-06.16`, sem violar P3
**Custo:** 🟢

**O que muda:** o Ghost passa a aparecer no **fim de capítulo** — fronteira natural em que o leitor já levantou os olhos por conta do texto, não por conta do app.

Uma linha, dispensável, na micro-cerimônia de `J-05`: *"seu melhor bloco de foco foi 12 min — você está em 14."*

**Por que não quebra o fluxo:** o fluxo já foi interrompido pelo fim do capítulo. A spec proíbe interromper o fluxo (correto), não proíbe usar as pausas que o próprio livro cria.

**Opcional e desligável** junto com todo o Ghost (`RN-06.23`).

**Regras afetadas:** `RN-06.16` ganha a exceção de fronteira de capítulo; `RN-06.12` (um único desafio por sessão) precisa ser reconciliado com a aparição por capítulo.

---

## M-11 — O horizonte semanal

**Resolve:** o buraco de progressão ([`00-diagnostico.md`](00-diagnostico.md) §4) e o vazio entre os marcos de 30 e 100 dias
**Tensiona:** nada
**Custo:** 🟡

A semana é o horizonte mais importante em apps de hábito e o único totalmente ausente da spec.

**O que entra nele:**
- **Fechamento semanal:** uma cena curta no domingo com o que aconteceu, comparado à semana anterior (comparação consigo mesmo, respeitando P1).
- **Desafio da semana:** um objetivo com sabor — "leia em 3 dias diferentes", "termine um capítulo em uma única sessão", "conheça um autor novo". Rotativo, curto, opcional.
- **É o lugar natural da aposta de `M-01` e da meta coletiva de `M-04`.**

**Regras afetadas:** nova seção em `04`; `RN-08.27` (cards de marco) ganharia o card semanal.

---

## Mecânicas eficazes que estou recusando

Fazem parte da análise: são conhecidas, funcionam, e não devem entrar.

| Mecânica | Por que funciona | Por que recuso |
|---|---|---|
| **Ligas e divisões** (Duolingo) | Motor de retenção brutalmente eficaz | Viola P1 frontalmente. Em leitura, produziria leitura performática — rolar página para pontuar. Destruiria P3 junto |
| **Comprar de volta a ofensiva** | Converte muito bem | Vende alívio de ansiedade criada pelo próprio produto. `RN-07.26` proíbe e está certo. `M-05` entrega o benefício sem o padrão escuro |
| **Loot box paga** | Receita alta, engajamento alto | Aleatoriedade + dinheiro = jogo de azar, com público que inclui menores (`RN-01.4`). `M-03` mantém a surpresa fora do valor econômico |
| **Notificação de culpa** ("seu jardim sente sua falta") | Recupera usuários no curto prazo | `RN-01.16` proíbe. Culpa gera desinstalação, não retorno |
| **Ofensiva que exige leitura todo dia sem exceção** | Máxima pressão | Incompatível com leitores reais. O congelamento existe justamente por isso |
| **Meta sugerida crescente automática** | Aumenta uso | Sequestra a régua do usuário, que é dele por decisão de produto (`RN-04.2`). Sugerir sim, mover sozinho não |

---

## Sequência recomendada

| Ordem | O quê | Por quê |
|---|---|---|
| 1 | `M-02` + `J-06` | A vitória diária precisa existir antes de qualquer coisa nova ser construída em cima |
| 2 | `M-08` | Cinco correções baratas que param de machucar o jogador |
| 3 | `M-09` | Corrige a métrica que sustenta o princípio central do produto |
| 4 | `M-07` | Sem onboarding bom, nada acima é visto |
| 5 | `M-03` + `M-06` | Dão profundidade de progressão e resolvem quatro brechas de uma vez |
| 6 | `M-11` + `M-05` | Fecham os buracos de horizonte e de retorno |
| 7 | `M-01` | Tensão só depois que o resto estiver gostoso — apostar em um jogo morno não interessa a ninguém |
| 8 | `M-04` | Maior custo, maior teto. É o que transforma o produto em plataforma |
| — | `M-10` | Barato, encaixa em qualquer momento junto de `J-05` |
