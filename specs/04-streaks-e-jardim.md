# 04 — Ofensivas, Meta Diária e Jardim de Progresso

## 1. Objetivo

Sustentar o hábito diário através de duas ofensivas independentes — leitura e escrita — governadas por uma meta que o próprio usuário define. O progresso é representado por um **jardim** que cresce com a constância e entra em dormência, nunca morre, quando o hábito se interrompe (P2).

Cobre as funcionalidades 4, 5, 6, 7 e 28 da tabela de rastreabilidade (rascunho L74–82).

## 2. Escopo

**Dentro:** definição e alteração da meta base, cálculo das ofensivas de leitura e escrita, marcos, congelamento de ofensiva, jardim e sua customização, dormência e retomada, notificações de ofensiva.

**Fora:** medição das sessões que alimentam a meta → [`03-sessoes-e-metricas.md`](03-sessoes-e-metricas.md). Sprints e quests que alimentam a ofensiva de escrita → [`09-autores-e-analytics.md`](09-autores-e-analytics.md). Custo, saldo e compra de itens → [`07-economia-moedas.md`](07-economia-moedas.md). Compartilhamento do jardim e do heat map → [`08-social-sharing.md`](08-social-sharing.md).

## 3. Personas

Leitor (ofensiva de leitura), Autor (ofensiva de escrita), Leitor-autor (ambas).

---

## 4. User stories

| ID | Story |
|---|---|
| `GAM-01` | Como usuário, quero definir minha própria meta diária para que o sucesso seja medido pela minha régua. |
| `GAM-02` | Como usuário, quero escolher entre meta por páginas ou por minutos para adequar ao meu jeito de ler. |
| `GAM-03` | Como usuário, quero ver quanto falta para bater a meta de hoje sem que isso me persiga durante a leitura. |
| `GAM-04` | Como usuário, quero manter uma ofensiva de dias consecutivos para sustentar meu compromisso. |
| `GAM-05` | Como autor, quero uma ofensiva de escrita independente da de leitura para não misturar os dois hábitos. |
| `GAM-06` | Como usuário, quero ver meu jardim crescer conforme mantenho a constância para ter uma recompensa visual do meu esforço. |
| `GAM-07` | Como usuário, quero customizar meu jardim com itens para que ele seja meu. |
| `GAM-08` | Como usuário, quero comprar congelamentos de ofensiva para proteger meu progresso em dias impossíveis. |
| `GAM-09` | Como usuário, quero que perder a ofensiva não apague tudo o que construí, para não desistir de vez. |
| `GAM-10` | Como usuário, quero ser lembrado quando minha ofensiva estiver em risco, sem ser importunado. |
| `GAM-11` | Como usuário, quero alterar minha meta quando minha rotina mudar, sem ser cobrado por isso. |
| `GAM-12` | Como usuário, quero ver marcos de constância (7, 30, 100, 365 dias) para ter horizontes intermediários. |
| `GAM-13` | Como usuário, quero um desafio semanal curto para ter um objetivo entre o dia e o mês. |
| `GAM-14` | Como usuário, quero ver a semana que passou resumida para perceber meu ritmo. |
| `GAM-15` | Como usuário, quero plantar sementes e descobrir o que nasce delas, para ter surpresa sem depender de sorte no que tem valor. |

---

## 5. Regras de negócio

### 5.1 Meta base

- `RN-04.1` A meta é diária e avaliada no **fuso horário da conta** (`RN-01.14`). O dia vai de 00:00:00 a 23:59:59 local.
- `RN-04.2` A meta de **leitura** é expressa em uma de duas unidades, escolhida pelo usuário: páginas canônicas por dia (padrão sugerido: 15) ou minutos de tempo ativo por dia (padrão sugerido: 20). Os dois valores exemplares vêm do rascunho (L78).
- `RN-04.3` A meta de **escrita** é expressa em palavras por dia (padrão sugerido: 300, rascunho L112) ou minutos de sprint por dia (padrão sugerido: 15, rascunho L113).
- `RN-04.4` Faixas permitidas *(a validar)*: leitura de 5 a 200 páginas ou de 5 a 480 minutos; escrita de 50 a 5.000 palavras ou de 5 a 480 minutos.
- `RN-04.5` **Alterar a meta é sempre gratuito.** O rascunho pedia que a mudança tivesse "peso e compromisso" (L78), e isso continua valendo — mas o instrumento passa a ser **atrito de tempo**, não custo em moedas. Cobrar do usuário para corrigir a própria régua pune o autoconhecimento e incentiva o pior desfecho possível: manter uma meta inadequada porque mudá-la dói.
- `RN-04.6` O atrito de tempo tem duas partes:
  - **Vigência no dia seguinte** (`RN-04.7`), que já impede o abuso de rebaixar a meta para salvar o dia corrente;
  - **Intervalo mínimo** de `INTERVALO_ALTERACAO_META` (7 dias, a validar) entre duas alterações do mesmo eixo. Uma meta que muda toda hora não é meta.
- `RN-04.6a` **Reduzir a meta é exceção e é sempre livre**, sem intervalo mínimo e sem qualquer atrito. Uma pessoa que baixa a régua está tentando manter o hábito numa fase difícil da vida — é o comportamento que o produto mais quer preservar (P2). A interface acolhe a redução sem cerimônia, sem confirmação dramática e sem mencionar o que ela "perdeu".
- `RN-04.7` A alteração vale a partir do **dia seguinte**. Isso impede o padrão de rebaixar a meta ao fim do dia para salvar a ofensiva, que esvaziaria a mecânica.
- `RN-04.8` Trocar de unidade (páginas ↔ minutos) é uma alteração de meta e segue as mesmas regras de atrito e vigência.
- `RN-04.9` As metas de leitura e de escrita têm ciclos de alteração independentes.

### 5.2 Cumprimento e cálculo da ofensiva

- `RN-04.10` O dia é **cumprido** quando a soma das sessões com `conta_para_meta` do dia atinge a meta. Isso inclui sessões `valida`, `curta` (`RN-03.7`) e `suspeita` (`RN-03.24`), além de `amostra` integralmente e `pilula` até o teto diário (`RN-03.8`). Só ficam de fora as sessões `rejeitada_sobreposicao` e as descartadas pelo próprio usuário (`RN-03.29`).
  - O princípio: **o antifraude defende a economia, não o hábito.** Moeda exige validação; ofensiva não. Um leitor jamais perde a corrente por heurística de ritmo.

**Reconhecimento da conquista.** Bater a meta diária é o evento mais importante do produto. Ele é reconhecido **enquanto o usuário ainda está no aplicativo**, nunca no processamento noturno.

- `RN-04.10a` O cumprimento da meta é detectado **no instante em que acontece**, durante a sessão, pelo próprio cliente. A ofensiva avança imediatamente. Em nenhuma hipótese o usuário descobre que cumpriu a meta apenas no dia seguinte.
- `RN-04.10b` A **celebração** não interrompe a leitura. Ela é exibida na primeira **fronteira natural** após o cumprimento — o que ocorrer primeiro entre: chegar ao `fim_locator` do capítulo corrente (entidade `Capitulo`, `02` §8) ou o encerramento da sessão (`RN-03.6`). Até lá, o modo imersivo (`RN-02.13`) permanece intacto.
- `RN-04.10c` Durante a leitura, nada é exibido: sem contador, sem badge, sem sobreposição, sem som. A conquista fica **pendente de exibição**, silenciosa, até a fronteira natural.
- `RN-04.10d` A conquista pendente **nunca é perdida**. Se o app for encerrado abruptamente antes da exibição, ela é apresentada na próxima abertura. É consumida uma única vez, por eixo e por dia.
- `RN-04.10e` A celebração é **única por dia e por eixo**. Sessões seguintes no mesmo dia não repetem a comemoração; elas mostram apenas o progresso acumulado além da meta.
- `RN-04.10f` O reconhecimento é **otimista**: a ofensiva avança com base na avaliação local e é reconciliada com o servidor depois. Se uma sessão que sustentava o dia for invalidada posteriormente (`RN-03.24`) ou descartada pelo usuário (`RN-03.29`), **o dia já celebrado não é revertido**. Retirar do usuário uma conquista que ele já viu na tela custa mais do que manter um dia indevido. As moedas, por terem valor econômico, seguem a regra oposta e só são creditadas após a validação do servidor (`RN-07.10`).
- `RN-04.11` A ofensiva é o número de dias consecutivos cumpridos. Ela é **recalculada**, não incrementada: sessões offline que chegam atrasadas (`RN-03.16`) podem recompor dias passados, e descartes de sessão (`RN-03.29`) podem desfazê-los. O valor exibido sempre deriva dos `AgregadoDiario`, com a ressalva de `RN-04.10f` para dias já celebrados.
- `RN-04.12` As duas ofensivas são totalmente independentes: contagens separadas, metas separadas, congelamentos separados. Cumprir a de escrita não sustenta a de leitura, e vice-versa.
- `RN-04.13` Marcos de ofensiva: `MARCOS_OFENSIVA` = 7, 30, 100 e 365 dias (a validar), cada um com recompensa em moedas (`RN-07.4`), item de jardim exclusivo e card comemorativo (`08`).
- `RN-04.14` O **recorde histórico** de cada ofensiva é preservado para sempre, mesmo após quebras. A tela exibe ofensiva atual e melhor marca, nesta ordem.
- `RN-04.14a` **A ofensiva encerrada não é apagada.** Ao quebrar, a contagem que terminou é preservada e apresentada **no passado**, ao lado da contagem corrente (zero) e do recorde: na dormência a tela mostra **três** números, não dois. Nenhuma superfície exibe a contagem encerrada como se ainda estivesse correndo, e nenhuma a omite. Uma ofensiva de 23 dias interrompida vira "sua sequência chegou a 23 dias" — nunca um "23" solto, que mentiria, nem o silêncio, que apagaria o esforço.
  - É o correlato de `RN-04.21` no lado da exibição: se a reversão não se compra, o que foi construído ao menos não desaparece da tela. A dormência do jardim (`RN-04.25`) e essa preservação numérica são a mesma decisão de P2 em duas linguagens — uma visual, outra numérica.
  - Como toda contagem, é **derivada** de `DiaOfensiva` e não um contador guardado (`RN-04.11`). Se uma sessão atrasada recompuser o dia que faltava, a ofensiva volta a correr e deixa de haver contagem encerrada a exibir.
- `RN-04.15` Ofensiva não é zerada retroativamente por mudança de fuso horário (`RN-01.14`).

### 5.3 Congelamento de ofensiva

- `RN-04.16` O congelamento (*Streak Freeze*) é um item comprável com moedas (`CUSTO_STREAK_FREEZE`, 200, a validar) que preserva a ofensiva em um dia não cumprido.
- `RN-04.17` O consumo é **automático** na virada do dia, quando a meta não foi atingida e há congelamento em estoque. O usuário é informado por notificação e no app: "usamos um congelamento para proteger seus 23 dias".
- `RN-04.18` Estoque máximo: `FREEZE_MAX_ESTOQUE` (3, a validar). Máximo de dias consecutivos protegidos: `FREEZE_MAX_CONSECUTIVOS` (2, a validar) — passado esse limite, a ofensiva quebra mesmo com estoque, porque o produto existe para gerar hábito, não para vender imunidade indefinida.
- `RN-04.19` Um dia protegido por congelamento **mantém** a ofensiva mas não conta como dia cumprido para marcos: ele preserva a contagem, não a incrementa.
- `RN-04.20` Congelamentos de leitura e de escrita são estoques separados e não intercambiáveis.
- `RN-04.21` O congelamento não pode ser comprado retroativamente após a virada do dia. O que o usuário perdeu, perdeu — vender a reversão transformaria a mecânica em cobrança por ansiedade.

### 5.4 Jardim de progresso

- `RN-04.22` O jardim é a representação visual única do estado de ambas as ofensivas: um mesmo espaço com **dois canteiros**, leitura e escrita, cada um refletindo sua própria ofensiva. Usuários sem papel de autor veem apenas o canteiro de leitura.
- `RN-04.23` O jardim evolui por **estágios** determinados pela ofensiva atual (a validar): broto (1–6 dias), muda (7–29), planta florida (30–99), árvore (100–364), bosque (365+). Cada estágio muda densidade, cor e quantidade de elementos.
- `RN-04.24` Dias cumpridos "regam" o jardim: cada dia adiciona um elemento visual permanente ao canteiro correspondente (rascunho L80).
- `RN-04.25` **Dormência (outono).** Ao quebrar a ofensiva, o jardim assume paleta de outono e reduz o movimento da cena. Nenhum elemento é removido, apagado ou murcha visualmente até desaparecer (P2, rascunho L81). O jardim nunca morre.
- `RN-04.26` A saída da dormência é imediata: o primeiro dia cumprido após a quebra restaura a paleta viva, mesmo com a ofensiva em 1. A recuperação visual é desproporcionalmente generosa de propósito, para recompensar a retomada.
- `RN-04.27` Um **acervo do jardim** registra o total histórico de dias cumpridos e nunca decresce. É esse acervo, e não a ofensiva atual, que determina o tamanho permanente do jardim; a ofensiva determina apenas o estado (vivo ou dormente) e o estágio do canteiro ativo.
- `RN-04.28` Itens cosméticos (vasos, luminárias, animais, estações, paletas) são adquiridos com moedas (`07`) ou desbloqueados por marcos. Itens comprados são permanentes e nunca perdidos por quebra de ofensiva.
- `RN-04.29` O jardim é privado por padrão e pode ser tornado público no perfil (`RN-01.12`) ou compartilhado como imagem (`08`).

### 5.5 Horizonte semanal

A progressão tinha um buraco: algo acontecia por sessão, por dia e por mês, mas nada por semana — e a semana é o horizonte mais natural de um hábito.

- `RN-04.35` Toda semana ISO tem um **Desafio da Semana**: um objetivo curto, rotativo e **opcional**, sorteado de um catálogo. Exemplos: ler em 3 dias diferentes, terminar um capítulo em uma única sessão, ler um autor que você nunca leu, manter um bloco de foco de 25 minutos.
- `RN-04.36` O desafio é sorteado no início da semana entre os elegíveis ao perfil do usuário. Nunca é sorteado um desafio incompatível com a meta vigente (ex.: bloco de 25 min para quem tem meta de 10 min).
- `RN-04.37` **Recompensa do desafio semanal:** uma **semente** (`RN-04.40`), mais um bônus fixo em moedas de `RECOMPENSA_DESAFIO_SEMANAL` (40 moedas, a validar). A semente é a recompensa principal; a moeda é o complemento.
- `RN-04.38` Falhar no desafio **não tem consequência alguma**: nada é perdido, nenhuma mensagem é enviada, e a semana seguinte traz outro. É oportunidade, não obrigação (P2).
- `RN-04.39` **Fechamento semanal:** no primeiro acesso após a virada da semana, uma cena curta resume os sete dias — dias cumpridos, tempo total, estilo de leitura predominante (`RN-03.22`), e a comparação com a semana anterior do próprio usuário (nunca com outros, P1). É compartilhável (`08`).

### 5.6 Sementes: recompensa com surpresa, sem aleatoriedade econômica

Resolve a ausência de imprevisibilidade sem transformar a economia em caça-níquel. Toda a economia de moedas permanece publicada e determinística (`RN-07.7`); o aleatório vive **fora** dela.

- `RN-04.40` A **semente** é um item obtido por conquista — marcos de ofensiva (`RN-04.13`), desafio semanal (`RN-04.37`), conclusão de obra (`RN-07` §5.2) e marcos de coleção (`02`). Ela é plantada no jardim e **leva alguns dias para brotar**, revelando só então qual planta ou item decorativo trouxe.
- `RN-04.41` A raridade da semente é conhecida no momento em que ela é obtida (comum, rara, lendária); **o que é desconhecido é qual item daquela faixa vai brotar**. O usuário nunca é surpreendido sobre o *valor* do que ganhou, apenas sobre a *forma*.
- `RN-04.42` **Nenhuma semente é comprável com dinheiro real**, em nenhuma circunstância. Semente é sempre conquistada. Isso mantém a mecânica fora da definição de caixa de recompensa paga e preserva `RN-01.4` (contas de menores).
- `RN-04.43` O tempo de brotamento (`SEMENTE_DIAS_BROTAR`, 3 dias, a validar) só avança em **dias cumpridos**. É a mecânica que dá ao jardim um motivo de visita que não depende de recompensa nova: existe algo crescendo lá.
- `RN-04.44` Sementes plantadas continuam crescendo durante a dormência (`RN-04.25`), mas não avançam enquanto a ofensiva estiver quebrada. Ao retomar, voltam a crescer de onde pararam — nada é perdido.
- `RN-04.45` Item repetido é convertido automaticamente em moedas, num valor publicado por raridade. O usuário nunca fica com um item duplicado inútil.

### 5.7 Notificações

- `RN-04.30` Lembrete diário no horário escolhido pelo usuário, apenas se a meta do dia ainda não foi cumprida.
- `RN-04.31` Alerta de ofensiva em risco: uma única notificação, disparada 2 horas antes da virada do dia (a validar), somente para quem tem ofensiva ativa de 3 dias ou mais e ainda não cumpriu a meta.
- `RN-04.32` Após quebra, um convite de retomada no dia seguinte, no tom da persona: acolhedor, sem culpa, sem contagem do que se perdeu (`RN-01.16`).
- `RN-04.33` Ausência prolongada (7, 14 e 30 dias sem sessão) gera no máximo três convites, espaçados; depois disso, silêncio. O produto não persegue quem saiu.
- `RN-04.34` Todas as notificações deste módulo respeitam o teto global de `RN-01.17` (2 por dia).

---

## 6. Critérios de aceitação

**`GAM-01` + `RN-04.7` — Alteração de meta vale a partir de amanhã**
```
Dado que minha meta é 20 minutos e já li 5 minutos hoje
Quando altero a meta para 30 minutos
Então nenhuma moeda é cobrada
E a meta de hoje continua sendo 20 minutos
E a meta de 30 minutos passa a valer a partir de amanhã
```

**`RN-04.6` — Atrito de tempo, não de moeda**
```
Dado que aumentei minha meta ontem
Quando tento aumentá-la de novo hoje
Então a alteração é bloqueada até completar o intervalo mínimo
E o app informa a data em que poderei alterar novamente
```

**`RN-04.6a` — Reduzir é sempre livre**
```
Dado que alterei minha meta há 2 dias e minha rotina apertou
Quando reduzo a meta de 30 para 10 minutos
Então a redução é aceita imediatamente, sem intervalo mínimo
E nenhuma moeda é cobrada
E nenhuma mensagem sugere desistência, recuo ou perda
```

**`GAM-04` + `RN-04.10` — Sessão suspeita cumpre meta, mas não paga**
```
Dado que minha meta é 15 páginas
E hoje registrei 20 páginas em uma sessão marcada como suspeita
Quando a meta é atingida
Então o dia é considerado cumprido e minha ofensiva avança
E nenhuma moeda é creditada por aquela sessão
E o detalhe do dia explica de forma neutra por que não houve recompensa
```

**`RN-04.10a` + `RN-04.10b` — Conquista reconhecida com o usuário ainda no app**
```
Dado que minha meta é 20 minutos e estou lendo há 19
Quando completo o vigésimo minuto de tempo ativo
Então a ofensiva avança imediatamente no meu perfil
E nada é exibido enquanto eu continuo lendo
E ao terminar o capítulo, ou ao encerrar a sessão, o que vier primeiro
Então vejo a celebração da meta cumprida, ainda dentro do app
E em nenhum momento preciso esperar a virada do dia para saber que cumpri
```

**`RN-04.10c` — A leitura não é interrompida**
```
Dado que bato a meta no meio de um capítulo
Quando sigo lendo por mais 30 minutos
Então nenhum contador, badge, som ou sobreposição aparece durante a leitura
E o modo imersivo permanece intacto
```

**`RN-04.10d` — A conquista pendente não se perde**
```
Dado que bati a meta e encerrei o app abruptamente antes de ver a celebração
Quando abro o app novamente
Então a celebração é exibida
E ela não volta a aparecer em nenhuma abertura seguinte
```

**`RN-04.10e` — Celebração única por dia**
```
Dado que já celebrei a meta de leitura de hoje
Quando faço uma segunda sessão no mesmo dia
Então o resumo mostra apenas o progresso acumulado além da meta
E a comemoração não se repete
```

**`RN-04.10f` — Conquista celebrada não é revertida**
```
Dado que bati a meta, vi a celebração e minha ofensiva foi a 24
Quando o servidor invalida depois a sessão que sustentava o dia
Então minha ofensiva permanece em 24
E as moedas daquela sessão não são creditadas, por dependerem de validação
```

**`GAM-05` — Independência das ofensivas**
```
Dado que sou leitor-autor com ofensiva de leitura em 12 dias e de escrita em 4 dias
Quando cumpro apenas a meta de leitura hoje
Então a ofensiva de leitura vai a 13
E a ofensiva de escrita quebra ou consome um congelamento de escrita
E o canteiro de leitura permanece vivo enquanto o de escrita entra em dormência
```

**`GAM-08` + `RN-04.17` — Congelamento automático**
```
Dado que tenho ofensiva de 23 dias e 2 congelamentos em estoque
Quando o dia vira sem que eu tenha cumprido a meta
Então um congelamento é consumido automaticamente
E minha ofensiva permanece em 23
E recebo aviso claro de que um congelamento foi usado e quantos restam
```

**`RN-04.18` — Limite de proteção consecutiva**
```
Dado que tenho 3 congelamentos e não leio há 2 dias, ambos protegidos
Quando o terceiro dia vira sem cumprimento
Então a ofensiva quebra apesar do estoque disponível
E nenhum congelamento adicional é consumido
```

**`GAM-09` + `RN-04.25` — Dormência preserva o jardim**
```
Dado que tenho jardim construído por 60 dias cumpridos e quebro a ofensiva
Quando abro a tela do jardim
Então todos os elementos continuam presentes
E a cena está em paleta de outono
E a mensagem convida à retomada sem mencionar perda
```

**`GAM-09` + `RN-04.14a` — A ofensiva encerrada continua na tela, no passado**
```
Dado que minha ofensiva chegou a 23 dias, meu recorde é 41 e a ofensiva quebrou
Quando abro a tela do jardim em dormência
Então vejo os 23 dias apresentados como sequência encerrada
E vejo a contagem corrente em zero
E vejo o recorde de 41 preservado
E em nenhum lugar os 23 dias aparecem como contagem em andamento
```

**`RN-04.26` — Retomada restaura o viço**
```
Dado que meu jardim está em dormência
Quando cumpro a meta de um único dia
Então a paleta viva é restaurada imediatamente
E a ofensiva reinicia em 1
E o acervo histórico de dias cumpridos permanece intacto
```

**`RN-04.21` — Sem compra retroativa**
```
Dado que perdi minha ofensiva ontem
Quando abro a loja
Então não existe opção de restaurar a ofensiva perdida
E os congelamentos disponíveis valem apenas para dias futuros
```

---

## 7. Telas e estados

| Tela | Conteúdo | Estados |
|---|---|---|
| **Jardim (tela principal da ofensiva)** | Cena do jardim com canteiros de leitura e escrita, ofensiva atual, melhor marca, progresso do dia, estoque de congelamentos, acesso à customização e ao compartilhamento | Vazio (dia 0: jardim de terra preparada, com convite), **Dormência** (paleta de outono; a contagem encerrada aparece no passado, ao lado do zero corrente e do recorde — `RN-04.14a`), Carregando, Offline (renderiza estado local com aviso de sincronização) |
| **Progresso do dia** | Anel ou barra com quanto falta para a meta, em páginas ou minutos | — |
| **Definir / alterar meta** | Unidade, valor, aviso de vigência a partir de amanhã, data da próxima alteração possível. Reduzir a meta é sempre oferecido sem atrito (`RN-04.6a`) | Bloqueado por intervalo mínimo (só para aumento), Erro (valor fora da faixa) |
| **Customização do jardim** | Catálogo de itens (comprados, desbloqueados, bloqueados), pré-visualização na cena, aplicar | Vazio (sem itens), Bloqueado por saldo |
| **Marcos** | Linha do tempo de 7, 30, 100, 365 dias, conquistados e futuros, recompensas de cada um | — |
| **Desafio da Semana** | Objetivo da semana, progresso, recompensa (semente + moedas), dias restantes | Vazio (semana sem desafio elegível), Concluído |
| **Fechamento semanal** | Dias cumpridos, tempo total, estilo predominante, comparação com a própria semana anterior, ação de compartilhar | Vazio (primeira semana) |
| **Sementes** | Sementes em estoque, plantadas e brotando com dias restantes, histórico do que já nasceu | Vazio (nenhuma semente ainda, com explicação de como obter) |
| **Congelamentos** | Estoque, custo, regras de uso e limite consecutivo explicados antes da compra | Bloqueado por saldo, Bloqueado por estoque cheio |
| **Detalhe do dia** | Sessões do dia, se a meta foi cumprida, se houve congelamento, motivo quando não contou | — |
| **Celebração da meta** | Momento em que a meta do dia é comemorada: novo número da ofensiva, o canteiro correspondente crescendo, e a ação de compartilhar (`08`). Exibida na fronteira natural (`RN-04.10b`), sobreposta ao fim de capítulo ou integrada ao resumo de sessão (`03` §7) | Pendente (conquista aguardando a fronteira), Exibida (consumida, não reaparece), Dispensável a qualquer momento com um toque |

**Offline:** o jardim e a ofensiva são calculáveis localmente com os dados em cache e exibidos com marcação de provisórios; o estado definitivo vem do servidor após a sincronização, porque só ele valida as sessões. **A celebração da meta é exceção deliberada:** ela ocorre offline, na hora, com base na avaliação local (`RN-04.10a`, `RN-04.10f`) — esperar conexão para comemorar reintroduziria a latência que a regra existe para eliminar.

---

## 8. Dados

| Entidade | Campos principais | Propósito |
|---|---|---|
| `MetaDiaria` | id, usuario_id, eixo (leitura, escrita), unidade (paginas, minutos, palavras), valor, vigente_desde, direcao_alteracao (aumento, reducao, inicial), proxima_alteracao_em, criada_em | Régua de sucesso, com histórico completo de alterações |
| `Ofensiva` | usuario_id, eixo, contagem_atual, melhor_marca, contagem_encerrada, encerrada_em, ultimo_dia_cumprido, estado (ativa, dormente), acervo_dias_cumpridos, atualizada_em | Estado derivado dos agregados diários. `contagem_encerrada` e `encerrada_em` sustentam `RN-04.14a` e só têm valor no estado `dormente`; como o restante, são derivados de `DiaOfensiva`, nunca escritos incrementalmente |
| `DiaOfensiva` | usuario_id, eixo, data, meta_valor, meta_unidade, realizado, cumprido, cumprido_em, protegido_por_congelamento, celebracao_estado (nao_aplicavel, pendente, exibida), celebrada_em | Registro auditável dia a dia; base do heat map (`08`). `cumprido_em` guarda o instante exato da conquista (`RN-04.10a`) e `celebracao_estado` garante exibição única e não perdida (`RN-04.10d`, `RN-04.10e`) |
| `Congelamento` | id, usuario_id, eixo, adquirido_em, consumido_em, dia_protegido, origem (compra, marco, cortesia) | Estoque e rastreio de uso |
| `MarcoConquistado` | usuario_id, eixo, marco_dias, conquistado_em, recompensa_moedas, item_desbloqueado | Histórico de conquistas |
| `DesafioSemanal` | id, usuario_id, semana_iso, chave_desafio, parametros, progresso, concluido, recompensa_entregue | Horizonte semanal (`RN-04.35`) |
| `CatalogoDesafio` | chave, descricao, criterio, elegibilidade, ativo | Configuração server-side dos desafios |
| `Semente` | id, usuario_id, raridade (comum, rara, lendaria), origem (marco, desafio, obra, colecao), obtida_em, plantada_em, dias_restantes, item_revelado_id, brotada_em | Surpresa fora da economia (`RN-04.40`) |
| `ItemJardim` | id, chave, nome, tipo (planta, decoracao, paleta, animal, estacao), custo_moedas, desbloqueio (compra, marco), obra_de_arte_url | Catálogo cosmético |
| `JardimUsuario` | usuario_id, itens_possuidos[], layout, paleta_ativa, estagio_leitura, estagio_escrita, publico | Estado visual do jardim |

---

## 9. API (alto nível)

| Operação | Descrição |
|---|---|
| Obter meta vigente | Metas atuais dos dois eixos e próximas vigências agendadas |
| Definir / alterar meta | Valida faixa e intervalo mínimo (dispensado em redução, `RN-04.6a`), agenda vigência para o dia seguinte |
| Obter estado da ofensiva | Contagem, melhor marca, estado, acervo e progresso do dia por eixo |
| Obter dias da ofensiva | Série diária por período (alimenta heat map e detalhe do dia) |
| Registrar cumprimento de meta | Recebe a conquista detectada pelo cliente (`RN-04.10a`), avança a ofensiva e devolve o que celebrar. Idempotente por eixo e data |
| Marcar celebração como exibida | Consome a conquista pendente (`RN-04.10d`, `RN-04.10e`), garantindo exibição única |
| Comprar congelamento | Debita moedas e credita estoque |
| Listar congelamentos | Estoque e histórico de consumo |
| Obter jardim | Estado visual, itens possuídos e estágios |
| Aplicar layout do jardim | Persiste posicionamento e paleta |
| Comprar item de jardim | Debita moedas e concede o item |
| Listar marcos | Conquistados e próximos |
| Obter desafio da semana | Objetivo vigente, progresso e recompensa |
| Obter fechamento semanal | Resumo dos sete dias com comparação à semana anterior do próprio usuário |
| Listar sementes | Estoque, plantadas e histórico |
| Plantar semente | Inicia o brotamento, que avança apenas em dias cumpridos (`RN-04.43`) |

**Processo assíncrono diário:** na virada do dia de cada fuso, um job trata **apenas o que não pôde ser resolvido durante o uso**: consome congelamentos nos dias não cumpridos (`RN-04.17`), aplica dormência a quem quebrou a ofensiva (`RN-04.25`), reconcilia dias com sessões offline atrasadas (`RN-03.16`) e dispara as notificações de `RN-04.32`.

O job **não é** o momento em que o cumprimento da meta é descoberto ou celebrado — isso já aconteceu dentro do app, no instante da conquista (`RN-04.10a`, `RN-04.10b`). Ele deve ser idempotente: rodar duas vezes no mesmo dia não pode consumir dois congelamentos nem recelebrar um dia já exibido.

---

## 10. Métricas de sucesso

- Percentual de usuários ativos com ofensiva de leitura ≥ 7 dias.
- Distribuição do tamanho das ofensivas e curva de sobrevivência por dia.
- Taxa de retomada após quebra em 7 dias (métrica direta de P2 — é o número que valida a dormência).
- Percentual de usuários que alteram a meta e direção da alteração (aumentos indicam régua bem calibrada; quedas em massa indicam meta inicial excessiva). Com a alteração gratuita, espera-se **mais** alterações e **menos** abandono — se as duas subirem juntas, a meta inicial está mal sugerida.
- Uso de congelamento por usuário ativo e sua correlação com retenção.
- Taxa de desativação das notificações de ofensiva (indicador de cadência abusiva).
- Percentual de usuários que concluem o desafio da semana (alvo 40–60%: acima disso é fácil demais, abaixo é frustrante).
- Visitas ao jardim com semente brotando vs. sem — mede se a mecânica cria motivo de retorno (`RN-04.43`).

---

## 11. Questões em aberto

| ID | Questão |
|---|---|
| `Q-04.1` | Parcialmente resolvida: alterar a meta deixou de ter custo em moedas (`RN-04.5`). Falta calibrar o custo do congelamento (200) contra a taxa de ganho, sob risco de a economia ficar inflacionária ou punitiva. |
| `Q-04.2` | Existe "meta de descanso" (ex.: escolher 1 ou 2 dias da semana sem meta, sem quebrar a ofensiva)? Reduziria a pressão e talvez a necessidade de congelamentos, mas enfraquece a ideia de constância diária. |
| `Q-04.3` | Marcos acima de 365 dias: o que acontece com quem passa de um ano? Precisa haver horizonte contínuo para não gerar vazio pós-conquista. |
| `Q-04.4` | O jardim é 2D ilustrado ou 3D/isométrico? Decisão de custo de produção de arte com impacto direto em `08` (compartilhamento). |
| `Q-04.5` | Quantos itens cosméticos são necessários no lançamento para a customização parecer real e não simbólica? |
| `Q-04.6` | A ofensiva de escrita depende do papel de autor ativo, ou qualquer usuário pode escrever (diário, anotações) e manter esse eixo? |
