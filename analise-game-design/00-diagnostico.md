# 00 — Diagnóstico de Game Design

> Análise crítica das specs em [`../specs/`](../specs/) sob a ótica de design de jogo.
> Nenhuma spec foi alterada. Este documento diagnostica; [`03-mecanicas.md`](03-mecanicas.md) propõe; [`04-decisoes.md`](04-decisoes.md) é onde você decide.

---

## 1. Veredito

**A spec descreve um sistema de medição excelente e um jogo fraco.**

Ela é rigorosa, honesta, ética e completa. Não tem padrão escuro, não mente com números, não vende ansiedade. Como especificação de produto, é boa. Como desenho de jogo, tem um problema estrutural: **quase nada do que o jogador faz produz consequência, surpresa ou decisão.**

Um sistema de gamificação precisa de três coisas para segurar alguém: que as ações tenham peso (consequência), que o retorno não seja inteiramente previsível (surpresa), e que o jogador escolha algo (agência). A spec tem a primeira desligada por princípio, a segunda ausente por transparência, e a terceira nunca projetada.

O resultado é um produto que a pessoa **acha ótimo e esquece de abrir.**

### O sintoma mais grave, em uma linha

O momento mais importante do jogo inteiro — **bater a meta diária** — não tem celebração nenhuma no momento em que acontece. A ofensiva e o jardim só são atualizados pelo job que roda na virada do dia (`04` §9). O jogador cumpre a meta às 20h e a planta cresce às 00h, sozinha, enquanto ele dorme.

Nenhuma outra falha deste documento custa mais retenção do que essa.

> ✅ **Já corrigido na spec.** `RN-04.10a` a `RN-04.10f` estabelecem reconhecimento imediato e celebração na primeira fronteira natural, com o usuário ainda no app. Ver `B-01` em [`01-brechas.md`](01-brechas.md). O restante deste diagnóstico segue válido.

---

## 2. O loop atual, medido

Loop de hábito: **gatilho → ação → recompensa → investimento**. O que mata um loop não é a ausência de recompensa, é a **latência** entre a ação e ela. Abaixo, a latência real que a spec define hoje:

| Ação do jogador | Feedback definido na spec | Latência |
|---|---|---|
| Virar a página | Nenhum (a spec não define feedback de virada) | — |
| Criar um destaque | O grifo aparece. Mais nada | — |
| Fazer uma anotação | Nada além do texto salvo | — |
| Consultar o dicionário | O verbete. Nada de progressão | — |
| Concluir um capítulo | +5 moedas, mas só após encerrar a sessão e validar no servidor (`RN-03.23`) | Minutos — horas se offline |
| Encerrar a sessão | Tela de resumo com métricas (`03` §7) | Segundos, provisório se offline |
| **Bater a meta do dia** | ~~Ofensiva +1 e jardim regado no job da virada do dia~~ → **corrigido:** ofensiva na hora, celebração no fim do capítulo ou da sessão (`RN-04.10a`, `RN-04.10b`) | ~~Até 24 horas~~ → **minutos** |
| Atingir marco | Moedas, item, card | 7 a 365 dias |

Três elos vazam:

**Vazamento 1 — o micro está mudo.** Virar página, grifar, anotar e consultar o dicionário são as ações que o jogador realiza centenas de vezes por sessão. Nenhuma delas tem retorno projetado. A spec pede que o leitor grife (é metade da Leitura Consciente, `RN-03.17`) mas não dá nada em troca do gesto, no instante do gesto.

**Vazamento 2 — a vitória é assíncrona.** Ver o §1. Era o erro mais caro do documento e **já foi corrigido na spec** (`RN-04.10a`–`RN-04.10f`).

**Vazamento 3 — a validação atrasa a recompensa.** O antifraude (`RN-03.23`) é tecnicamente correto e experiencialmente hostil: a moeda só existe depois que o servidor aprovou a sessão. O jogador termina o capítulo e não ganha nada *ali*. Segurança e celebração precisam ser desacopladas — celebra-se na hora, reconcilia-se depois.

---

## 3. Auditoria Octalysis

O rascunho invoca o Octalysis (`BookWorm.md` L39), mas cita apenas o Core Drive 5 e implementa metade dele. Auditoria dos oito:

| # | Core Drive | Estado | Nota | Onde está (ou deveria estar) |
|---|---|---|---|---|
| 1 | **Significado Épico e Chamado** | Latente, não explorado | 2/10 | O produto tem matéria-prima rara: sustentar autores diretamente (`07` gorjetas), ler contra a queda global de leitura (`BookWorm.md` L11). Nada disso é dito ao jogador como causa. Ele acha que está usando um app de métricas |
| 2 | **Desenvolvimento e Realização** | Forte | 8/10 | Ofensivas, marcos, Ghost Reader, estágios do jardim, dashboards. É o produto inteiro |
| 3 | **Criatividade e Feedback** | Fraco | 3/10 | Customizar o jardim é escolher skin (`RN-04.28`), não criar. Destaques e anotações são a expressão criativa real do leitor e não alimentam progressão nenhuma |
| 4 | **Propriedade e Posse** | Médio | 5/10 | Jardim, carteira, biblioteca, cosméticos permanentes. Falta o principal: **não há nada para colecionar e completar** |
| 5 | **Influência Social e Pertencimento** | Metade | 3/10 | Só a metade externa (compartilhar card, `08`). Internamente: zero. Sem amigos, clubes, dupla, presente, comentário entre leitores |
| 6 | **Escassez e Impaciência** | Quase nulo | 2/10 | Só temas sazonais (`RN-08.11`). Parte disso é saudável e deliberado |
| 7 | **Imprevisibilidade e Curiosidade** | Nulo | 1/10 | Tudo é determinístico e a spec **exige** publicar a tabela inteira de recompensas (`RN-07.7`). Transparência total elimina surpresa. O feed é a única superfície imprevisível e é estrangulada de propósito (`RN-05.24`) |
| 8 | **Perda e Evitação** | Desligado por princípio | 2/10 | Ofensiva quebra, mas amortecida por dormência (`RN-04.25`), congelamento (`RN-04.16`) e ausência de recuperação (`RN-04.21`). Nada mais se perde nunca |

### O que esse perfil significa

**O produto é quase inteiramente white hat.** Os drives 1, 2 e 3 (topo do octógono) fazem a pessoa se sentir bem, poderosa, no controle. Os drives 6, 7 e 8 (base) criam urgência, obsessão e ação imediata.

Design só de white hat tem uma assinatura conhecida: **as pessoas gostam do produto e não sentem necessidade de abri-lo hoje.** É exatamente o risco do BookWorm. Não abrir o app nunca dói, nunca custa, nunca perde nada relevante. Um sistema assim é gentil e esquecível.

O oposto — só black hat — queima o usuário e é o que a spec corretamente recusa. **A pergunta desta análise não é "adicionar black hat?", é "quanta tensão o sistema precisa para importar, e de que forma ela pode ser voluntária em vez de imposta?"** Ver `M-01` em [`03-mecanicas.md`](03-mecanicas.md).

**Segundo eixo: o produto é left brain.** Drives 2, 4 e 6 (extrínsecos: conquista, posse, escassez) contra 3, 5 e 7 (intrínsecos: criatividade, social, curiosidade). BookWorm é pesado no extrínseco. Isso é frágil para um produto cuja promessa é hábito para a vida: quando as moedas param de impressionar, não sobra motivação intrínseca construída.

---

## 4. Horizontes de progressão

Um sistema de hábito precisa de algo acontecendo em cada escala de tempo. O que a spec entrega:

| Horizonte | O que acontece hoje | Estado |
|---|---|---|
| **Por gesto** (segundos) | Nada | ❌ Vazio |
| **Por sessão** (minutos) | Resumo de métricas, moedas de capítulo, card opcional | ⚠️ Existe, mas é relatório, não celebração |
| **Por dia** | Meta cumprida, ofensiva, jardim regado | ⚠️ Existe, mas com até 24h de latência |
| **Por semana** | **Nada** | ❌ Vazio |
| **Por mês** | Fechamento mensal com card (`RN-08.27`), evolução do Ghost (`RN-06.26`) | ✅ Ok |
| **Por marco** | 7, 30, 100, 365 dias | ⚠️ Buraco de 70 dias entre 30 e 100 |
| **Por obra** | Conclusão: +50 moedas, card | ⚠️ Subaproveitado — terminar um livro é o maior feito do produto e rende o mesmo que 10 capítulos |

**Dois buracos críticos:** o gesto e a semana.

A semana é o horizonte mais importante em apps de hábito e o único totalmente ausente. É onde cabem desafios, metas coletivas, resumos e a sensação de "esta semana eu fui bem" — sem a pressão diária e sem a distância do mês.

E terminar um livro deveria ser o momento mais alto do produto inteiro. Hoje ele vale 50 moedas e um card.

---

## 5. Quem o sistema segura, e quem ele perde

| Perfil | O sistema segura? | Por quê |
|---|---|---|
| **A leitora que já lê muito** — quer medir, organizar, exibir disciplina | **Sim** | Ela não precisa de motivação, precisa de instrumento. Métricas, heat map, Ghost Reader e cards atendem exatamente. É o público do StoryGraph |
| **O leitor que quer voltar a ler** — o alvo declarado do rascunho, aquele que está no vídeo vertical | **Não** | Ele precisa de retorno rápido, novidade e tensão. Encontra latência de 24h na vitória, recompensa fixa publicada em tabela e nenhuma consequência por sumir. Abandona entre o dia 3 e o dia 7 |
| **O escritor** | **Parcialmente** | Recebe quest (`RN-09.9`) e sprint (`RN-09.10`) e mais nada. O eixo de escrita é um espelho pálido do de leitura: mesmo jardim, mesmo freeze, nenhuma mecânica própria. É o perfil pior servido |
| **O leitor social** — quem lê em clube, recomenda, discute | **Não existe para o produto** | Não há nada colaborativo. O único social é postar card para fora do app |

O produto foi desenhado para o primeiro perfil, mas o rascunho promete o segundo (`BookWorm.md` L11–21: competir com streaming e vídeo vertical). **Esse é o descompasso central entre a ambição declarada e o sistema especificado.**

---

### Nota sobre cobertura

Dois módulos aparecem pouco nesta análise, por motivos diferentes.

**`10` (monetização)** tem baixa implicação de game design porque a spec já resolveu bem a parte que importaria: nenhum recurso do núcleo é bloqueado por plano (`RN-10.2`) e não há oferta em momento de frustração (`RN-10.19`). Sem paywall no meio do loop, não há o que criticar.

**`11` (IA)** parecia estar na mesma situação — e não está. Ver `B-18`: o Premium Reader é a única mecânica do produto que compete diretamente com o comportamento que ele vende, e é paga.

---

## 6. O que está certo e deve ser defendido

Esta seção não é cortesia. São decisões que atrapalhariam se fossem revertidas por engano ao aplicar as propostas dos outros documentos.

1. **O eixo duplo de ofensiva** (`RN-04.12`). Separar leitura de escrita é correto e raro. Nenhuma proposta deve fundi-los.
2. **A recusa do leaderboard** (`RN-06.8`). Certa. Ranking público de leitura produziria exatamente a leitura performática que o produto quer evitar. Manter.
3. **Leitura Consciente como antimétrica de velocidade** (`RN-03.20`). É a melhor ideia da spec inteira. Um app de leitura que recompensa páginas por minuto destrói a leitura. Manter o princípio — corrigir só a fórmula (`B-05`).
4. **A dormência do jardim** (`RN-04.25`). Não matar o jardim está certo. O problema não é a dormência, é não haver **nada a fazer** ao voltar (`B-08`).
5. **O heat map honesto** (`RN-08.19`), que marca os dias protegidos por congelamento em vez de fingir que foram cumpridos. Integridade rara.
6. **A economia publicada** (`RN-07.7`). Custa surpresa (CD7), mas compra confiança. Ver `B-13` para o meio-termo.
7. **Nenhuma venda em momento de frustração** (`RN-07.26`, `RN-10.19`). Manter, sem exceção. Toda proposta deste conjunto de documentos respeita isso.
8. **O leitor imersivo sem distração** (`RN-02.13`). Esta é a fronteira que [`02-juiciness.md`](02-juiciness.md) declara intocável: nenhuma juice entra no leitor durante o fluxo.
9. **O Ghost Reader como conceito** (`06`). A ideia é ótima. A execução é tímida (`B-09`).

---

## 7. Como ler os outros documentos

| Documento | Serve para |
|---|---|
| [`01-brechas.md`](01-brechas.md) | Os 13 pontos em que a experiência quebra, com severidade e a `RN` responsável |
| [`02-juiciness.md`](02-juiciness.md) | A camada de feedback que falta — micro, sessão, marco — e onde ela não deve entrar |
| [`03-mecanicas.md`](03-mecanicas.md) | 10 mecânicas propostas, cada uma amarrada ao problema que resolve e ao princípio que tensiona |
| [`04-decisoes.md`](04-decisoes.md) | A folha onde você marca manter / alterar / debater |

Benchmarks (Duolingo, Strava, Habitica, Finch, StoryGraph, Fable) aparecem dentro de cada achado, onde a comparação importa.
