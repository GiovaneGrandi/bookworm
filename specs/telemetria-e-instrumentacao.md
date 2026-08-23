# Telemetria e Instrumentação — como cada métrica é medida na prática

> **Documento transversal vinculante.** [`03-sessoes-e-metricas.md`](03-sessoes-e-metricas.md) define
> **o quê** se mede e por quê; este documento define **como se apura**. IDs `RN-TEL.n` (regra) e
> `Q-TEL.n` (questão em aberto). Horizonte: **lado leitor completo** — analytics de audiência
> continua inteiramente em [`09-autores-e-analytics.md`](09-autores-e-analytics.md).

## 1. Objetivo

`RN-03.10` diz que um intervalo é inativo depois de 90 segundos "sem avanço de posição nem qualquer
interação". A regra é clara no papel e ambígua no único ponto que decide o número: **qual sinal
prova que houve interação, e qual relógio conta esses 90 segundos quando o processo JavaScript está
suspenso pelo sistema operacional.** Duas implementações honestas da mesma frase produzem tempos
ativos diferentes — e `P4` (*todo dado exibido precisa ser confiável*) não sobrevive a isso.

Este documento fecha essa lacuna para todas as métricas do lado leitor: o que é observável, com que
sinal, com que relógio, com que margem de erro, e o que acontece quando o sinal falta. Ele também
decide, com veredito por métrica, **quais medidas o produto coleta** — incluindo as que nunca foram
consideradas e as que devem ser recusadas por escrito antes que alguém as implemente (§15).

## 2. O que este documento decide, e o que ele não decide

**Decide:**

- A máquina de estados da sessão e os sinais de sistema operacional que a movem (§4).
- Qual relógio mede o quê, e por que são três (§5).
- A taxonomia fechada de pausa e o que se registra de cada uma (§6).
- O inventário de sinais de interação, separando o confiável do dependente de plataforma (§7).
- Como locator vira caractere e caractere vira página canônica, incluindo salto e releitura (§8).
- A unidade canônica de ritmo e onde ela pode ou não aparecer (§9).
- O catálogo fechado de eventos e o formato de cada um (§10).
- A fronteira entre o trilho de domínio e o trilho de produto (§11).
- Batimento, recuperação de falha e sessão órfã (§12).
- Fuso, virada do dia, horário de verão e viagem (§13).
- Como se prova que a medição está correta (§14).
- Quais métricas existem, quais ficam silenciosas e quais são recusadas (§15).
- Como cada regra se realiza na stack já decidida (§16).

**Não decide:**

| Assunto | Onde vive |
|---|---|
| Fórmula da Leitura Consciente, pesos, estilos de leitura | `03` §5.5 |
| Regra de meta, ofensiva, congelamento e celebração | `04` |
| O que o autor enxerga, k-anonimato, mapa de evasão | `09` §5.3 |
| Escolha de biblioteca, schema de banco, formato de tabela | `stack.md` |
| Tom das mensagens e comparação pessoal | `06` |
| Quais telas exibem quais números | `03` §7, `08` |

## 3. Escopo e fronteiras

| Pergunta | Documento que responde |
|---|---|
| O que é uma sessão, quanto vale uma página, o que é tempo ativo | `03` |
| Como se detecta que a sessão começou, pausou ou morreu | **este** |
| Quais métricas o produto coleta, e quais recusa | **este** |
| Com que biblioteca, em que tabela, em que serviço | `stack.md` |
| Como o número vira tela | `03` §7, `design-system.md` |

**Precedência.** Em conflito de **regra de produto** — o que conta, o que vale, o que recompensa —
manda `03`. Em conflito de **forma de apurar** — qual sinal, qual relógio, qual arredondamento —
manda este documento. Se a forma de apurar tornar uma regra de `03` inexequível, o caminho é a
errata de §18, nunca a reinterpretação silenciosa.

---

## 4. Máquina de estados da sessão

**`RN-TEL.1`** — A sessão é uma **máquina de estados explícita e persistida**, nunca um cronômetro
acumulando em memória. Estados canônicos:

```
ociosa   ──(primeira evidência de leitura)──▶ ativa
ativa    ──(sinal de sistema)──▶ pausada_sistema ──(retorno)──▶ ativa
ativa    ──(idle)────────────▶ pausada_idle    ──(interação)──▶ ativa
qualquer ──(saída, troca de obra, virada do dia, timeout)──▶ encerrada
qualquer ──(morte do processo)──▶ orfa ──(servidor)──▶ encerrada
```

**`RN-TEL.2`** — **Toda transição é gravada em disco antes de ser considerada efetiva.** O processo
pode ser morto pelo sistema operacional a qualquer instante e sem aviso; o que não foi persistido
não aconteceu. É o que torna `RN-TEL.41` (sessão órfã) uma recuperação, e não uma perda.

**`RN-TEL.3`** — Tabela de sinais. "Pausa imediata" executa `RN-03.11`; "graça" significa que o
sinal só vira pausa se persistir por mais de `PAUSA_GRACA_SEGUNDOS`.

| Sinal | O que significa | Efeito | Observação de plataforma |
|---|---|---|---|
| Primeira evidência de leitura | Avanço de posição, ou 10 s de tela ativa com texto renderizado (`RN-03.5`) | `ociosa → ativa` | Contar os 10 s só com o app em primeiro plano e a obra já renderizada, nunca durante a abertura do arquivo |
| App para segundo plano | A pessoa saiu | Pausa imediata | O sinal mais confiável dos dois sistemas |
| Tela bloqueada / aparelho dorme | A pessoa parou | Pausa imediata | Android reporta como saída de primeiro plano; iOS reporta a transição de bloqueio. Ver `Q-TEL.14` quando o app mantém a tela acesa |
| Estado transitório (central de notificações, chamada entrando, alerta do sistema) | Interrupção de milissegundos ou de minutos — só o tempo dirá | Graça: vira pausa se persistir | No iOS esse estado aparece ao puxar a central de notificações; tratá-lo como pausa criaria centenas de pausas de 200 ms por sessão |
| Chamada atendida | A pessoa parou | Pausa imediata | Chega como transição normal de segundo plano |
| Tela dividida / multi-janela / PiP | O app está visível, mas pode não estar sendo lido | Graça; perdendo o foco além dela, pausa | O app permanece "visível": o discriminador é o **foco**, não a visibilidade |
| Doze / App Standby / modo de baixa energia | O sistema suspendeu o processo | Nada de novo: já está pausado por segundo plano | Nunca depender de timer para descobrir isso — `RN-TEL.9` |
| Troca de obra | Outra leitura começou | Encerra uma e abre outra (`RN-03.6`) | — |
| Saída explícita do leitor | Fim | Encerra | — |
| Virada do dia no fuso do usuário | Fronteira de calendário | Divide (`RN-03.6`, §13) | Executada no cliente e revalidada no servidor |
| Morte do processo | Não há sinal — é a ausência dele | `orfa`, fechada pelo servidor (`RN-TEL.41`) | Nenhum sistema garante aviso antes de matar o app |

**`RN-TEL.4`** — **Visibilidade não é leitura; foco é.** Em tela dividida, o tempo só corre enquanto
a janela do BookWorm tem foco. Um app visível ao lado de um vídeo em execução não está sendo lido, e
contar esse tempo contamina exatamente a métrica que `P4` promete confiável.

**`RN-TEL.5`** — Retorno de uma pausa dentro de `SESSAO_TIMEOUT_MINUTOS` **retoma a mesma sessão**;
acima disso, abre outra (`RN-03.6`). O retorno nunca devolve tempo: o intervalo pausado já foi
subtraído e não volta.

---

## 5. Relógio, e por que são três

É esta seção que decide se os números são reproduzíveis. **Um relógio só não resolve**, e usar o
errado produz erro que nenhum teste de unidade pega — ele aparece no aparelho de quem viajou, dormiu
com o app aberto ou corrigiu o horário do telefone.

**`RN-TEL.6`** — Três relógios, papéis fixos e não intercambiáveis:

| Relógio | Característica | Usado exclusivamente para |
|---|---|---|
| **Parede** (`Date.now`) | Ajustável pelo usuário, pelo NTP e pelo fuso; pode andar para trás | **Atribuição de calendário**: a que dia a sessão pertence, ordenação, exibição, validação de futuro no servidor (`RN-03.15`) |
| **Monotônico com suspensão** (classe `elapsedRealtime`) | Nunca anda para trás; **continua contando com o aparelho dormindo** | **Toda duração**: tempo bruto, tempo ativo, duração de pausa, bloco de foco |
| **Monotônico sem suspensão** (classe `uptimeMillis`) | Congela enquanto o aparelho dorme | A diferença contra o anterior é **quanto tempo o aparelho dormiu** — sinal de diagnóstico |

**`RN-TEL.7`** — **Duração jamais é medida com o relógio de parede.** Uma correção de horário no meio
da sessão produziria tempo ativo negativo ou inflado, e o usuário seria punido — ou premiado — por um
evento que não tem relação nenhuma com a leitura dele.

**`RN-TEL.8`** — **Data e hora de calendário jamais são derivadas do relógio monotônico.** Ele não
sabe que dia é hoje: a origem dele varia por aparelho e por reinicialização.

**`RN-TEL.9`** — **Tempo nunca é contado por tique de timer.** Em segundo plano o JavaScript não
executa: um contador que soma 1 s por segundo simplesmente para, e um contador que soma na retomada
mede exatamente o intervalo que `RN-03.11` manda subtrair. Toda duração é **diferença entre dois
carimbos**, apurada na transição de estado ou na retomada.

**`RN-TEL.10`** — Todo evento carrega **os dois carimbos**, parede e monotônico. A divergência entre o
intervalo de parede e o intervalo monotônico é gravada como `deriva_relogio_ms` e é **sinal, não
descarte**: é o que distingue relógio adiantado de manipulação deliberada, e é o insumo objetivo da
tolerância de 5 minutos de `RN-03.15`.

**`RN-TEL.11`** — Carimbos em **milissegundos**, agregados em **segundos inteiros**, com o
arredondamento aplicado **uma única vez**, na apuração final da sessão. Arredondar a cada intervalo
acumularia meio segundo de erro por pausa e faria a soma das partes divergir do todo — quebrando o
invariante de `RN-TEL.50`.

---

## 6. Taxonomia de pausa, e o tempo entre pausas

**`RN-TEL.12`** — A taxonomia de pausa é **fechada**. Toda interrupção do tempo ativo é exatamente um
destes tipos, e o tipo é gravado:

| Tipo | Gatilho | Subtrai a partir de | Registra intervalo | Encerra sessão |
|---|---|---|---|---|
| `sistema` | Segundo plano, tela bloqueada, perda de foco além da graça | **Do instante do sinal** (`RN-03.11`) | Sim | Não, se o retorno vier dentro de `SESSAO_TIMEOUT_MINUTOS` |
| `idle` | `IDLE_TIMEOUT_SEGUNDOS` sem nenhum sinal de interação | **Retroativamente, desde a última interação** (`RN-03.10`) | Sim | Não |
| `encerradora` | Qualquer pausa que ultrapasse `SESSAO_TIMEOUT_MINUTOS` | Idem ao tipo de origem | Sim, e fecha a sessão | Sim (`RN-03.6`) |
| `divisoria` | Virada do dia | Não subtrai — divide | Não | Sim, e abre a seguinte |

**`RN-TEL.13`** — A diferença entre `sistema` e `idle` **não é cosmética**. A pausa de sistema é
subtraída do instante do sinal; a de idle, retroativamente, desde a última interação. Implementar a
segunda como a primeira devolveria 90 segundos de tempo ativo por pausa — com dez pausas numa tarde,
quinze minutos de leitura que não existiram.

**`RN-TEL.14`** — Microinterrupção **menor que `PAUSA_GRACA_SEGUNDOS` não quebra o bloco de foco** e
não é registrada como pausa. Uma notificação que aparece e some não interrompe a leitura de ninguém,
e tratá-la como interrupção destruiria o `maior_bloco_continuo_s` de que `RN-03.17` depende.

### 6.1 O tempo entre pausas é um dado, não um subproduto

**`RN-TEL.15`** — O intervalo entre duas pausas é um **bloco de foco**. `RN-03.17b` já usa o maior
deles; a apuração passa a guardar a **distribuição completa** por sessão — quantidade de blocos,
mediana, maior — e a duração de cada pausa entre eles.

O custo é desprezível: os intervalos já são calculados para apurar tempo ativo, e o que se propõe é
não jogá-los fora. O retorno é grande.

- **Alimenta `RN-03.17` sem trocar a fórmula.** Uma sessão de 40 minutos em quatro blocos de 10 é
  outra coisa que uma de 40 minutos em um bloco só, e hoje as duas se distinguem apenas pelo máximo.
- **Calibra `IDLE_TIMEOUT_SEGUNDOS` com dado real** — é o caminho concreto para `Q-03.2` e `Q-03.4`.
  Se a mediana de bloco em poesia for de 4 minutos e em prosa de 18, o timeout único está errado, e a
  medição prova isso sem pedir opinião a ninguém.
- **Distingue interrupção de fim.** Uma pausa de 40 segundos e uma de 12 minutos têm hoje o mesmo
  efeito; só a segunda indica que a leitura de fato acabou.

**`RN-TEL.16`** — Pausa com retorno em menos de `RETOMADA_RAPIDA_SEGUNDOS` é classificada
`interrupcao`; acima disso, e ainda dentro de `SESSAO_TIMEOUT_MINUTOS`, `pausa_longa`. A distinção
não muda nenhum número exibido — muda o que se sabe sobre a vida real de quem lê, e é insumo do
lembrete de `04` e do tom do Ghost Reader (`06` §5.4).

---

## 7. Sinais de interação: o que é observável de verdade

**`RN-TEL.17`** — Inventário fechado dos sinais que **reiniciam o relógio de idle**, classificados
pela confiança que merecem:

| Sinal | Confiança | Por quê |
|---|---|---|
| Mudança de locator (virada de página, rolagem que muda a posição) | **Alta** | Emitido pelo leitor, atravessa a ponte por contrato |
| Seleção de texto | **Alta** | Precede destaque, nota e dicionário; já é evento do leitor |
| Criação ou edição de destaque e de nota, consulta ao dicionário | **Alta** | Já registrados com posição, carimbo e id de sessão (`RN-02.21`) |
| Abertura do painel de leitura e uso de qualquer controle dele | **Alta** | Instrumentação já exigida desde o dia 1 por `mvp.md` §12 |
| Revelação dos controles por toque na área central (`RN-02.13`) | **Média** | Depende de o gesto ser tratado pela camada do app e não absorvido pelo leitor |
| Toque e rolagem **dentro do texto**, sem mudança de posição | **Baixa — a verificar** | O leitor renderiza o conteúdo em componente nativo próprio; não há garantia de que o toque cru chegue à camada do app. Ver `Q-TEL.1` |

**`RN-TEL.18`** — **Se o toque cru não for observável, a regra continua válida e fica mais estrita**:
idle passa a significar, na prática, *"sem virar página e sem nenhuma interação de leitor"*. Isso não
invalida `RN-03.10` — invalida a **calibragem** de 90 segundos, porque quem lê devagar uma página
densa deixa de emitir sinal por bem mais que isso. `Q-TEL.1` é, por esse motivo, **bloqueante para a
calibragem**, e se mede no mesmo app de prova que `stack.md` já prevê (`Q-ST.1`) — mesmo aparelho,
mesma rodada.

**`RN-TEL.19`** — Sinal de interação **nunca carrega conteúdo**. O evento registra tipo, posição e
carimbo. O texto selecionado, o termo consultado e o corpo da anotação pertencem ao leitor (`02`) e à
privacidade dele; não são telemetria.

**`RN-TEL.20`** — `RN-03.13` na prática: o cálculo de idle **nunca** observa densidade de texto,
velocidade ou tamanho de página. Ilustração, epígrafe e folha de rosto não geram alerta nem
penalidade — a única pergunta que a apuração faz é se houve sinal, jamais se houve sinal suficiente.

---

## 8. Volume lido: do locator ao caractere, do caractere à página

A base já está decidida: o **índice de caracteres por obra**, montado uma única vez na importação e
persistido (`RN-ST.8`, `stack.md` §6), com `posição = offset[recurso] + progressão × tamanho[recurso]`
e o mesmo contrato para EPUB e PDF. O que falta — e não existe em nenhuma spec hoje — é o que fazer
com o que acontece entre duas posições.

**`RN-TEL.21`** — Volume é sempre apurado em **caracteres inteiros**. A página canônica de
`PAGINA_CANONICA_CARACTERES` (`RN-03.2`) é **unidade de apresentação**: a conversão acontece na
borda, na hora de exibir, nunca no meio do cálculo. Converter cedo introduz arredondamento em cada
etapa e faz o total divergir da soma das partes.

**`RN-TEL.22`** — **Salto não é leitura.** Ir ao sumário, usar a busca, tocar num link interno ou
pular para uma posição produz **descontinuidade**, e descontinuidade não gera volume. O critério é
objetivo: mudança de posição acompanhada de um evento de navegação explícita, ou delta de caracteres
maior do que o teto físico permitiria naquele intervalo (`RN-TEL.25`), é salto — não avanço.

**`RN-TEL.23`** — **O volume da sessão é a medida da união dos intervalos percorridos**, não a soma
dos deltas. Quem lê um parágrafo difícil, volta, relê e avança percorreu o trecho uma vez, e é uma
vez que se conta. Somar deltas transformaria releitura atenta — exatamente o comportamento que `P3`
existe para premiar — em inflação de páginas.

**`RN-TEL.24`** — **Progresso da obra e volume da sessão são grandezas diferentes**, e a confusão
entre as duas é a fonte de erro mais provável desta camada:

| Grandeza | Definição | Onde aparece |
|---|---|---|
| **Progresso da obra** | Marca d'água: a maior posição já atingida, monotônica, nunca decresce ao reler | Percentual da obra (`RN-02.10`), estante, previsão de conclusão |
| **Volume da sessão** | Medida da união dos intervalos percorridos nesta sessão | Meta diária (`04`), agregados (`RN-03.30`), Ghost Reader (`06`) |

Reler um capítulo inteiro gera volume de sessão e **não** move o progresso da obra. Pular ao último
capítulo move o progresso e **não** gera volume.

**`RN-TEL.25`** — O teto físico de `RN-03.26` (`RITMO_MAXIMO_FISICO`) é aplicado **por janela de
`JANELA_TETO_FISICO_SEGUNDOS`**, e não apenas sobre o total da sessão. Sem isso, 30 minutos de
leitura honesta diluem 90 segundos de rolagem e o teto nunca dispara — que é justamente o caso que
ele existe para pegar.

**`RN-TEL.26`** — O cliente apura o volume, e o servidor **reapura** a partir do mesmo índice e do
mesmo traço de locators. Divergência acima de uma tolerância mínima não é fraude por padrão: é
**canário de bug de índice** (`RN-TEL.52`). No MVP o índice é responsabilidade do cliente e sobe com
a sessão (`stack.md` §6); a reapuração completa depende do catálogo próprio, e é fase 1.

**`RN-TEL.27`** — Obra sem índice possível — PDF digitalizado sem camada de texto (`Q-02.5`) — **não
gera métrica de volume**. A leitura acontece, o tempo ativo é medido normalmente, e a interface diz
que a contagem de páginas não se aplica àquele arquivo. Inventar volume por página nativa quebraria
`RN-03.3` (régua global e imutável).

---

## 9. Ritmo, e a pergunta "palavras por minuto?"

**`RN-TEL.28`** — A unidade canônica interna de ritmo é **caracteres por minuto de tempo ativo**,
como já define `RN-06.1`. **Palavras por minuto não é uma segunda medição**: é uma apresentação
derivada, por divisão única e fixa por `CARACTERES_POR_PALAVRA`, coerente com a equivalência de
`RN-03.2` (1.500 caracteres ≈ 250 palavras). Nunca existem dois números para a mesma coisa.

**`RN-TEL.29`** — Onde o ritmo pode e não pode aparecer:

| Lugar | Pode | Regra |
|---|---|---|
| Ghost Reader, comparação do usuário com ele mesmo | **Sim** | `RN-06.1`, sempre privado |
| Estatística por obra ("ritmo médio") | **Sim** | `03` §7 |
| Dentro do leitor, em qualquer forma | **Não** | `RN-02.13b` proíbe qualquer exibição de velocidade no modo imersivo |
| Na fórmula de Leitura Consciente | **Não** | `RN-03.20`, com peso zero e sem sinal indireto |
| Comparado com outra pessoa, em qualquer agregado | **Não** | `RN-06.8`, `P1` |
| Card de compartilhamento (`08`) | **Ver `Q-TEL.5`** | O card é público por definição; ritmo público reabre a comparação pela porta dos fundos |

**`RN-TEL.30`** — Ritmo **não é calculado** sobre sessão `curta`, `suspeita`, `rejeitada`, `amostra`
ou `pilula` — mesma exclusão que `RN-06.4` já aplica à baseline. Uma sessão de 40 segundos produz um
ritmo aritmeticamente válido e humanamente sem sentido.

---

## 10. Catálogo de eventos

**`RN-TEL.31`** — O catálogo é **fechado**: evento novo exige entrada nesta tabela, com nome em
PT-BR, `snake_case`, no mesmo idioma de toda a documentação. Evento sem entrada não é emitido.

| Evento | Quando dispara | Carga | Trilho |
|---|---|---|---|
| `sessao_iniciada` | Primeira evidência de leitura (`RN-03.5`) | ulid, obra, tipo, locator, fuso, offset, carimbos | Domínio |
| `sessao_batimento` | Cadência de `BATIMENTO_INTERVALO_SEGUNDOS` ou troca de capítulo | ulid, estado acumulado (tempo ativo, volume, interações, blocos) | Domínio |
| `sessao_encerrada` | Qualquer gatilho de encerramento (`RN-03.6`) | ulid, motivo, estado final completo | Domínio |
| `posicao_alterada` | Mudança de locator | locator anterior, novo, se foi navegação explícita | Domínio |
| `pausa_iniciada` / `pausa_encerrada` | §6 | tipo, carimbos, locator | Domínio |
| `interacao_qualitativa` | Destaque, nota ou dicionário (`RN-03.18`) | subtipo, locator, carimbo — **nunca conteúdo** (`RN-TEL.19`) | Domínio |
| `obra_aberta` / `obra_concluida` | Abertura e conclusão | obra, origem da abertura | Domínio |
| `meta_cumprida` | Instante do cumprimento (`RN-03.12a`) | dia, meta vigente, valores no instante | Domínio |
| `painel_controle_usado` | Uso de qualquer controle do painel de leitura | controle, valor anterior e novo | Produto |
| `ancora_nivel_alterado` | Troca do nível da âncora de posição (`RN-02.13a`) | nível anterior, novo | Produto |
| `sessao_fantasma` | Leitor aberto e fechado sem evidência de leitura (`RN-TEL.56`) | obra, duração até a saída | Produto |
| `card_gerado` / `card_compartilhado` | `08` | tipo de card, destino | Produto |
| `sincronizacao_concluida` | Fim de um envio do outbox | itens, latência, falhas | Produto |

**`RN-TEL.32`** — Todo evento carrega, sem exceção: **ULID gerado no cliente no instante do fato**
(não no do envio, `RN-ST.9`), carimbo de parede, carimbo monotônico, id de sessão, versão do esquema
de evento e identificação do dispositivo.

**`RN-TEL.33`** — O **batimento transporta estado acumulado, não delta**. Um batimento perdido não
deixa buraco: o seguinte carrega o total. É o que torna o envio tolerante a perda, como `03` §9 já
promete, sem exigir confirmação por pacote.

**`RN-TEL.34`** — Esquema de evento é **versionado**, e todo consumidor tolera campo desconhecido.
Sessão de sete dias atrás (`RN-03.14`) pode chegar de uma versão anterior do app, e recusá-la
apagaria leitura real de quem ficou offline — o oposto de `P2`.

---

## 11. Dois trilhos, e a regra que os separa

**`RN-TEL.35`** — Existem **dois trilhos de dado, e eles nunca se cruzam**:

| | **Trilho de domínio** | **Trilho de produto** |
|---|---|---|
| Caminho | Banco local → outbox → API própria → banco do servidor | SDK de analytics de produto (`stack.md` §4) |
| Serve para | Métrica do usuário, meta, ofensiva, moeda, Ghost Reader | Funil, adoção de recurso, retenção, diagnóstico |
| Alimenta número exibido? | **Sim, exclusivamente ele** | **Nunca** |
| Sobrevive offline | Sim, `EVENTO_RETENCAO_LOCAL_DIAS` | Melhor esforço |
| Retenção | Sessão é permanente enquanto a conta existir (`modelo-de-dados.md` §5) | Ver `Q-TEL.11` |

**`RN-TEL.36`** — **Nenhum número exibido ao usuário pode vir do trilho de produto.** Ele perde
evento por bloqueio de rede, por opt-out e por amostragem — e um número que às vezes falta é
exatamente o que `P4` proíbe.

**`RN-TEL.37`** — O trilho de produto **nunca** transporta: texto lido, texto de destaque, corpo de
anotação, termo consultado no dicionário, título ou identificador de **obra importada pelo usuário**
(`RN-02.1d`), nem qualquer campo que permita reconstruir o que a pessoa leu.

**`RN-TEL.38`** — **Opt-out do trilho de produto não afeta o de domínio.** Quem recusa telemetria de
produto continua com histórico, ofensiva e Ghost Reader intactos — são os dados dele, não sobre ele.
A recusa é oferecida nas configurações de privacidade (`01`), separada da recusa de contribuir para
agregados de autor (`RN-09.22`).

---

## 12. Batimento, falha e sessão órfã

**`RN-TEL.39`** — Batimento a cada `BATIMENTO_INTERVALO_SEGUNDOS` de **tempo ativo** — não de tempo de
parede — ou a cada troca de capítulo, o que vier primeiro. Contar em tempo ativo evita bater o ponto
a noite inteira com o app aberto e a pessoa dormindo.

**`RN-TEL.40`** — O envio é **idempotente por ULID** (`RN-ST.9`): reenviar um batimento perdido
sobrescreve estado, nunca soma. O servidor guarda o último estado conhecido por sessão.

**`RN-TEL.41`** — **Sessão órfã.** Se o app morre, a sessão fica aberta no servidor. Passados
`SESSAO_ORFA_TIMEOUT_MINUTOS` sem batimento, o servidor a encerra com `encerrada_em` = carimbo do
**último batimento**, marca `origem: recuperada` e a torna elegível a tudo que uma sessão normal
gera. Encerrar no instante do reaping presentearia o usuário com o tempo em que o app já estava
morto; descartar a sessão apagaria leitura que aconteceu de verdade.

**`RN-TEL.42`** — Ao abrir, o cliente **procura sessão local aberta antes de criar outra**. Se
encontrar, e o intervalo desde o último sinal for menor que `SESSAO_TIMEOUT_MINUTOS`, retoma; caso
contrário, encerra localmente com o último carimbo conhecido e abre nova. O cliente e o servidor
chegam à mesma conclusão pelo mesmo critério, e o ULID garante que não virem duas sessões.

**`RN-TEL.43`** — Sessão recuperada é **auditável e visível** no detalhe da sessão, em linguagem
neutra ("o aplicativo foi encerrado durante esta leitura"). É a mesma exigência de transparência de
`SES-09`, aplicada a uma causa técnica em vez de a uma suspeita.

---

## 13. Fuso, virada do dia e viagem

**`RN-TEL.44`** — A sessão carrega o **fuso IANA** e o **offset UTC vigentes no início**. Guardar só o
offset perde a regra de horário de verão; guardar só o instante em UTC perde o dia civil do usuário,
que é a unidade da ofensiva (`RN-04.15`).

**`RN-TEL.45`** — A divisão da virada do dia (`RN-03.6`) é executada **no cliente**, para que a meta
seja avaliada ao vivo (`RN-03.12a`), e **revalidada no servidor** com os mesmos carimbos. Divergência
entre os dois é resolvida pelo servidor e registrada.

**`RN-TEL.46`** — O dia é o **dia civil local**, não um bloco de 24 horas. No horário de verão
existem dias de 23 e de 25 horas, e a meta vale igual nos dois: a fronteira é a meia-noite local, não
o relógio corrido.

**`RN-TEL.47`** — Em mudança de fuso no meio da sessão (viagem), **o dia é o do fuso vigente no
início**. É a regra que evita o único resultado inaceitável — perder a ofensiva por ter voado para
leste. Sessões seguintes já usam o novo fuso.

---

## 14. Como se prova que a medição está correta

**`RN-TEL.48`** — A apuração é **função pura sobre um traço de eventos**, em `packages/core`, sem
acesso a relógio, rede ou banco: `apurarTempoAtivo`, `apurarVolume`, `apurarBlocosDeFoco`,
`dividirNaViradaDoDia`, `calcularLeituraConsciente`. Relógio é parâmetro de entrada, nunca variável
global — é o que torna a medição testável e reproduzível anos depois, a partir do histórico bruto que
`RN-03.32` obriga a guardar.

**`RN-TEL.49`** — **Cada critério de aceitação de `03` §6 vira um arquivo de traço de eventos.** Os
cenários já estão escritos em `Dado / Quando / Então`; o que falta é o formato. Traço entra, número
sai, comparação com o esperado — e o TDD de `RN-ST.10` passa a ter alvo concreto no primeiro dia.

**`RN-TEL.50`** — Invariantes verificados por teste de propriedade, com traços gerados
aleatoriamente:

- `tempo_ativo ≤ tempo_bruto`, sempre;
- `tempo_ativo + soma(pausas) = tempo_bruto`, com tolerância zero após o arredondamento único de `RN-TEL.11`;
- `volume ≤ RITMO_MAXIMO_FISICO × tempo_ativo`, por janela e no total (`RN-TEL.25`);
- agregado recalculado do zero ≡ agregado incremental (`RN-03.32`);
- reprocessar o mesmo traço duas vezes dá o mesmo resultado;
- nenhuma sessão dividida na virada do dia perde ou ganha um segundo em relação à original.

**`RN-TEL.51`** — **Matriz de aparelho obrigatória antes do lançamento**, porque nada disso se prova
em emulador: bloqueio de tela, chamada recebida e atendida, notificação puxada e dispensada, tela
dividida, PiP, modo de baixa energia, Doze, aparelho dobrável mudando de tela, app morto pelo sistema
sob pressão de memória, e mudança manual do relógio durante a sessão. Cada linha da matriz tem um
resultado esperado escrito **antes** do teste.

**`RN-TEL.52`** — A **saúde da própria instrumentação é métrica de produto**, com alvo: taxa de
sessão recuperada, taxa de batimento perdido, latência mediana de sincronização, divergência
cliente × servidor no volume e frequência de `deriva_relogio_ms` fora da tolerância. Sem isso, `P4` é
promessa sem verificação — o sistema não teria como saber que parou de medir direito.

---

## 15. Provocações: o que medir, o que medir em silêncio, o que recusar

Esta seção existe porque a decisão mais cara de um sistema de métricas não é como medir — é **o que
se decide medir**, e essa decisão costuma ser tomada por omissão, no meio de uma sprint, por quem
tinha o dado à mão. Cada linha abaixo tem veredito. Métrica adotada vira regra numerada; métrica
disputada vira `Q-TEL`; métrica recusada fica escrita como recusa, no molde de `stack.md` §10 — para
que a próxima pessoa que tiver a ideia encontre a resposta antes de escrever o código.

**`RN-TEL.53`** — Existe a categoria **métrica silenciosa**: instrumentada, guardada, usada para
calibrar e diagnosticar, e **nunca exibida ao usuário**. A separação é deliberada — a maior parte do
valor analítico de um produto de hábito não precisa virar tela, e quase todo dano vem de virar.

### 15.1 Adotadas

| Métrica | O que responde | Custo | Risco `P1`–`P7` | Veredito |
|---|---|---|---|---|
| **Distribuição de blocos de foco** | Como a atenção se reparte dentro da sessão | Nenhum: o dado já é calculado e hoje é descartado | Nenhum — é o próprio `RN-03.17` | **Adotar** (`RN-TEL.15`) |
| **Tipo de pausa e taxa de retomada** | A pausa foi interrupção ou fim de leitura | Baixo | Nenhum | **Adotar** (`RN-TEL.12`, `RN-TEL.16`) |
| **Cronotipo — a que horas a pessoa lê** | Quando o hábito de fato acontece | Baixo: já há carimbo em toda sessão | Baixo, se descritivo e nunca prescritivo | **Adotar**, `RN-TEL.54` |
| **Atrito de retomada** — tempo entre abrir a obra e a primeira virada | Quanto custa voltar a um livro parado | Baixo | Nenhum: é métrica de produto, silenciosa | **Adotar silenciosa**, `RN-TEL.55` |
| **Sessão fantasma** — abriu e saiu sem evidência de leitura | Quantas tentativas de leitura morrem na largada | Baixo | Nenhum: não é sessão, não conta para nada | **Adotar silenciosa**, `RN-TEL.56` |
| **Dificuldade percebida do texto** — consultas ao dicionário por 1.000 caracteres | Se a obra é dura para esta pessoa | Baixo | Alto **se exibido como julgamento**; nulo como insumo privado | **Adotar silenciosa**, `RN-TEL.57` |
| **Taxa de releitura dentro da sessão** | Volta atrás por dificuldade ou por fruição | Baixo: já sai da união de intervalos (`RN-TEL.23`) | Nenhum | **Adotar silenciosa**, `RN-TEL.58` |
| **Intervalo entre sessões da mesma obra e obras simultâneas** | Obra parando de andar; leitura fragmentada entre livros | Baixo | Baixo — vira lembrete, e lembrete tem tom regido por `04` | **Adotar**, `RN-TEL.59` |
| **Saúde da instrumentação** | Se ainda estamos medindo direito | Médio | Nenhum | **Adotar** (`RN-TEL.52`) |
| **Concordância cliente × servidor no volume** | Bug de índice de caracteres | Médio | Nenhum — e sem ele um erro de índice vira "fraude" | **Adotar** (`RN-TEL.26`) |

**`RN-TEL.54`** — **Cronotipo de leitura.** Distribuição do tempo ativo por hora do dia e por dia da
semana, calculada sobre os agregados. Pode ser exibida ao usuário, sempre como descrição
("suas melhores leituras acontecem depois das 22h"), **nunca** como prescrição, cobrança ou meta de
horário. Não gera notificação sozinha: quem decide se, quando e como lembrar é `04`.

**`RN-TEL.55`** — **Atrito de retomada.** Intervalo entre `obra_aberta` e o primeiro
`posicao_alterada` da sessão. É diagnóstico de produto — mede o custo de voltar a um livro parado,
que é a fricção central de `P7` — e é **silenciosa**: exibi-la seria cronometrar a hesitação da
pessoa, exatamente o oposto do que o leitor imersivo promete.

**`RN-TEL.56`** — **Sessão fantasma.** Leitor aberto e fechado sem atingir a primeira evidência de
leitura (`RN-03.5`). Não é sessão, não entra em histórico, não conta para meta e não aparece para o
usuário. É evento de produto, e é o que revela abertura que falha por lentidão, arquivo corrompido ou
desorientação — coisas que a métrica de sessão, por definição, nunca enxerga.

**`RN-TEL.57`** — **Dificuldade percebida.** Consultas ao dicionário por 1.000 caracteres lidos, por
obra. Métrica **silenciosa e privada**, jamais exibida como avaliação de vocabulário nem comparada
entre pessoas. Serve para explicar ritmo baixo sem chamá-lo de ritmo baixo, e é insumo legítimo de
recomendação ("este é mais leve que o anterior").

**`RN-TEL.58`** — **Releitura.** Proporção do tempo da sessão gasto em trechos já percorridos nela.
Silenciosa. É o contraponto quantitativo de `RN-03.24`: assim como ler rápido é legítimo, ler duas
vezes é legítimo — e sem essa medida a releitura aparece nos dados apenas como ritmo baixo, que é uma
leitura errada do que aconteceu.

**`RN-TEL.59`** — **Intervalo entre sessões da mesma obra** e **número de obras em andamento**.
Alimenta a obra parada e o lembrete de `04`. A regra de tom é herdada inteira: nunca cobrar, nunca
sugerir que ler vários livros ao mesmo tempo é erro.

### 15.2 Em aberto — a decidir com dado, não com intuição

| Provocação | A favor | Contra | Encaminhamento |
|---|---|---|---|
| Exibir **palavras por minuto** ao usuário | É o número que todo leitor curioso quer ver, e o Ghost Reader já o calcula | `P3` inteiro; ver o próprio ritmo transforma leitura em corrida contra si mesmo, que é competição tóxica com outro nome | `Q-TEL.5` |
| **Tempo restante** do capítulo e da obra | Ajuda a decidir "leio mais um capítulo antes de dormir?" — utilidade real e cotidiana | Proibido no leitor por `RN-02.13b`; fora dele, é velocidade disfarçada de conveniência | `Q-TEL.6` |
| **Contador vitalício** de palavras ou páginas lidas | Combustível natural de `08` e de marco de longo prazo | Métrica de vaidade; premia volume, e volume é o que `P3` recusa premiar | `Q-TEL.7` |
| **Pausa manual** pelo leitor | Elimina ambiguidade: a pessoa declara que parou | Um controle a mais num painel que `Q-02.8` já acusa de cheio; e a medição automática existe justamente para ninguém operar cronômetro (`SES-01`) | `Q-TEL.8` |
| **Auto-relato de humor ou energia** ao fim da sessão | Dado que nenhum sensor obtém, e que casa com a tese de "fitness para a mente" | Atrito no momento mais delicado, que é o fim da leitura; e resposta forçada vira ruído | `Q-TEL.9` |
| **Preditor de abandono** pelo comportamento nos primeiros 10% | Permitiria agir antes de a pessoa sumir | É perfilamento; e agir sobre ele é intervir na leitura de alguém com base em estatística | `Q-TEL.10` |
| **Registro manual de livro físico** | Amplia muito o público de `P7` | Nenhuma regra deste documento consegue medir o que não passa pelo app; herda `Q-03.6` | `Q-TEL.13` |
| **Leitura em voz alta ou acompanhada** | Caso real, sobretudo com crianças | Sem sinal observável sem microfone, e microfone está recusado em §15.3; herda `Q-03.5` | Fora de escopo |

### 15.3 Recusadas, e por quê

Recusa escrita vale mais que ausência de menção: sem ela, a ideia volta a cada trimestre.

| Recusado | Motivo |
|---|---|
| **Rastreamento ocular, câmera, detecção de atenção facial** | Vigilância. Nenhum ganho de precisão justifica apontar a câmera para quem lê, e a permissão em si já muda a relação com o produto |
| **Microfone para detectar leitura em voz alta** | Idem; captação de áudio ambiente num app de leitura é desproporcional em qualquer cenário |
| **Sensor de movimento para inferir leitura em transporte** | Curiosidade cara: infere contexto físico sem melhorar nenhuma métrica que o produto exiba |
| **Localização** | Nada em `03`, `04`, `06` ou `08` depende de onde a pessoa está. Coletar "porque pode ser útil depois" é como se acumula passivo de privacidade |
| **Screenshot como sinal de engajamento** | Sinal fraco e invasivo; e transforma um gesto privado em telemetria |
| **Fingerprint comportamental de toque e rolagem para antifraude** | `RN-03.24` já decidiu que o antifraude atua sobre impossibilidade física, não sobre perfil de comportamento. Perfilar gesto para acusar usuário é o oposto disso |
| **Conteúdo de destaque e anotação privados no trilho de produto ou em IA sem consentimento** | `RN-TEL.19`, `RN-TEL.37`, `RN-02.1d` e o consentimento de `11`. É o dado mais íntimo que o produto guarda |
| **Qualquer métrica comparativa entre usuários exibida ao leitor** | `P1` e `RN-06.8`. Percentil, média da base e "você lê mais que X% das pessoas" são leaderboard com outro nome |
| **"Livros terminados" como métrica-mestre** | Premia abandonar obra longa e escolher livro curto — `P3` de cabeça para baixo. Continua existindo como marco de comemoração (`04`), nunca como régua de sucesso |
| **Amostragem do trilho de domínio** | Amostrar é aceitável em analytics de produto e inaceitável em dado que vira número exibido e recompensa (`P4`, `RN-TEL.36`) |

**`RN-TEL.60`** — As recusas acima são **vinculantes**. Reverter qualquer uma exige decisão explícita
registrada aqui, com o princípio que passou a permiti-la.

**`RN-TEL.61`** — **Nenhuma métrica nova é exibida ao usuário sem passar por três perguntas**, cuja
resposta fica escrita ao lado da regra que a cria: (1) ela compara a pessoa com outra pessoa? (2) ela
premia velocidade ou volume? (3) ela sobrevive a um dia ruim sem soar como cobrança? Um "sim" nas
duas primeiras, ou um "não" na terceira, e a métrica nasce silenciosa (`RN-TEL.53`).

---

## 16. Tradução para a stack do MVP

As regras acima são independentes de plataforma de propósito: elas sobrevivem a uma troca de stack.
Esta seção é a camada substituível — como cada uma se realiza na stack já decidida em
[`stack.md`](stack.md). Onde a stack não entrega o sinal, está dito.

| Regras | Como se realiza | Ponto de atenção |
|---|---|---|
| `RN-TEL.1`, `RN-TEL.2` | Máquina de estados em Zustand, transição persistida em `expo-sqlite` (WAL) antes de valer | Gravar na transição, não em intervalo periódico |
| `RN-TEL.3`, `RN-TEL.4` | `AppState` do React Native (`active` / `inactive` / `background`) | `inactive` é o estado transitório de `RN-TEL.3`; **foco em multi-janela do Android não é reportado por `AppState`** e exige sinal nativo próprio — `Q-TEL.14` |
| `RN-TEL.6`–`RN-TEL.11` | `Date.now` para parede | O relógio monotônico que conta suspensão **não é exposto pelo React Native**: exige um módulo nativo mínimo via Expo Modules. `performance.now` não serve — congela com o processo suspenso |
| `RN-TEL.17`–`RN-TEL.20` | Eventos de `react-native-readium`: mudança de locator, seleção, destaque; controles do painel na camada do app | O toque cru dentro do conteúdo é o risco de `Q-TEL.1`, medido no app de prova de `Q-ST.1` |
| `RN-TEL.21`–`RN-TEL.27` | Índice de caracteres como função pura em `packages/core` (`RN-ST.8`), montado na importação com `fflate` e `htmlparser2`; PDF pelo mesmo contrato (`Q-ST.8`) | É o **primeiro teste do projeto**, por decisão de `stack.md` §6 |
| `RN-TEL.31`–`RN-TEL.34`, `RN-TEL.39`–`RN-TEL.43` | Outbox próprio em SQLite com Drizzle, ULID de cliente (`RN-ST.9`), envio em lote pela API Fastify | O *reaping* de sessão órfã é job de servidor, e precisa ser idempotente como o job diário (`modelo-de-dados.md` §6) |
| `RN-TEL.35`–`RN-TEL.38` | Domínio: Fastify + Postgres. Produto: PostHog (`stack.md` §4) | Sentry não é nenhum dos dois trilhos: é erro e desempenho, nunca métrica de leitura |
| `RN-TEL.48`–`RN-TEL.52` | Vitest sobre `packages/core` com traços em arquivo; Maestro no E2E; matriz de aparelho em dev build EAS | `RN-ST.10` já exige teste antes do PR: os traços de `RN-TEL.49` são o material desse teste |

---

## 17. Constantes novas

Todas *(a validar)*, todas em configuração de servidor (`glossario.md` §2.2).

| Constante | Valor proposto | Para quê |
|---|---|---|
| `PAUSA_GRACA_SEGUNDOS` | 3 s | Sinal transitório que não vira pausa nem quebra bloco de foco (`RN-TEL.3`, `RN-TEL.14`) |
| `BATIMENTO_INTERVALO_SEGUNDOS` | 30 s de tempo ativo | Cadência do batimento (`RN-TEL.39`) |
| `SESSAO_ORFA_TIMEOUT_MINUTOS` | 35 min | Fechamento de sessão órfã pelo servidor; deliberadamente maior que `SESSAO_TIMEOUT_MINUTOS`, para nunca competir com o encerramento normal (`RN-TEL.41`) |
| `RETOMADA_RAPIDA_SEGUNDOS` | 300 s | Fronteira entre `interrupcao` e `pausa_longa` (`RN-TEL.16`) |
| `JANELA_TETO_FISICO_SEGUNDOS` | 60 s | Janela de aplicação do teto físico de `RN-03.26` (`RN-TEL.25`) |
| `EVENTO_RETENCAO_LOCAL_DIAS` | 7 dias | Retenção do traço bruto no dispositivo, alinhada à janela de `RN-03.14` |
| `CARACTERES_POR_PALAVRA` | 6 | Divisor único de caracteres para palavras (`RN-TEL.28`) |
| `IDLE_TIMEOUT_TEXTO_DENSO_SEGUNDOS` | 180 s | Timeout de idle para obra marcada como poesia ou texto denso — proposta de resposta a `Q-03.4`, condicionada a `Q-TEL.1` |

---

## 18. Errata proposta, índices e questões

### 18.1 Errata proposta a `03` e ao modelo de dados

Descobertas ao escrever a apuração. São **propostas**, não aplicadas: `03` é a fonte de verdade da
regra de produto e só muda por decisão explícita.

| Onde | Falta | Origem |
|---|---|---|
| `SessaoLeitura` | `client_ulid` — id estável gerado na criação, não no envio | `RN-TEL.32`, `RN-ST.9` |
| `SessaoLeitura` | `fuso` e `offset_utc` do início | `RN-TEL.44` |
| `SessaoLeitura` | `blocos_foco` (quantidade, mediana, maior) em vez de só `maior_bloco_continuo_s` | `RN-TEL.15` |
| `SessaoLeitura` | `deriva_relogio_ms` | `RN-TEL.10` |
| `SessaoLeitura.origem` | Valor `recuperada`, ao lado de `online` e `offline` | `RN-TEL.41` |
| `IntervaloInatividade` | `tipo` (`sistema`, `idle`, `encerradora`) e classificação (`interrupcao`, `pausa_longa`) | `RN-TEL.12`, `RN-TEL.16` |
| `03` §5.3 | Dizer explicitamente que a subtração de idle é retroativa desde a última interação | `RN-TEL.13` |
| `03` §5.7 | Agregado por hora do dia, para o cronotipo | `RN-TEL.54` |
| `glossario.md` §2.2 | As oito constantes de §16 | — |

### 18.2 Índice de regras

| ID | Assunto |
|---|---|
| `RN-TEL.1`–`RN-TEL.5` | Máquina de estados, persistência de transição, sinais de sistema, foco × visibilidade |
| `RN-TEL.6`–`RN-TEL.11` | Três relógios, duração monotônica, proibição de contar por tique, deriva, arredondamento único |
| `RN-TEL.12`–`RN-TEL.16` | Taxonomia de pausa, subtração retroativa, graça, blocos de foco, interrupção × pausa longa |
| `RN-TEL.17`–`RN-TEL.20` | Sinais de interação, plano B sem toque cru, ausência de conteúdo, idle cego a densidade |
| `RN-TEL.21`–`RN-TEL.27` | Caractere como unidade, salto, união de intervalos, marca d'água × volume, teto por janela, reapuração, obra sem índice |
| `RN-TEL.28`–`RN-TEL.30` | Ritmo canônico, onde pode aparecer, exclusões |
| `RN-TEL.31`–`RN-TEL.34` | Catálogo fechado, carga obrigatória, batimento cumulativo, versionamento |
| `RN-TEL.35`–`RN-TEL.38` | Dois trilhos, proibição de número vindo do trilho de produto, conteúdo proibido, opt-out |
| `RN-TEL.39`–`RN-TEL.43` | Batimento, idempotência, sessão órfã, retomada local, transparência |
| `RN-TEL.44`–`RN-TEL.47` | Fuso, divisão do dia, horário de verão, viagem |
| `RN-TEL.48`–`RN-TEL.52` | Função pura, traços de teste, invariantes, matriz de aparelho, saúde da instrumentação |
| `RN-TEL.53`–`RN-TEL.61` | Métrica silenciosa, cronotipo, atrito, fantasma, dificuldade, releitura, intervalo, recusas, teste dos princípios |

### 18.3 Questões em aberto

| ID | Questão |
|---|---|
| `Q-TEL.1` | **Bloqueante para a calibragem.** O toque e a rolagem dentro do texto renderizado pelo leitor chegam à camada do app? Se não chegarem, `IDLE_TIMEOUT_SEGUNDOS` precisa subir e `RN-TEL.18` passa a valer como redação efetiva de `RN-03.10`. Medir no app de prova de `Q-ST.1` |
| `Q-TEL.2` | O idle deve variar por tipo de obra (poesia, técnico, quadrinho)? `IDLE_TIMEOUT_TEXTO_DENSO_SEGUNDOS` é a proposta; depende de `Q-TEL.1` e responde `Q-03.4` |
| `Q-TEL.3` | `BATIMENTO_INTERVALO_SEGUNDOS` a 30 s custa quanto de bateria numa sessão de uma hora? Medir antes de fixar |
| `Q-TEL.4` | União de intervalos (`RN-TEL.23`) contra soma de deltas: confirmar com dado real que a diferença é relevante o bastante para justificar a complexidade |
| `Q-TEL.5` | Exibir palavras por minuto ao usuário, e em que superfícies? Ver §15.2 |
| `Q-TEL.6` | Tempo restante estimado fora do leitor (estante, detalhe da obra) é aceitável, dado `RN-02.13b`? |
| `Q-TEL.7` | Contador vitalício de palavras ou páginas entra em `08`, ou é vaidade a recusar? |
| `Q-TEL.8` | Pausa manual pelo leitor: resolve ambiguidade ou sobrecarrega o painel (`Q-02.8`)? |
| `Q-TEL.9` | Auto-relato de humor ou energia ao fim da sessão vale o atrito? |
| `Q-TEL.10` | Preditor de abandono nos primeiros 10%: útil ou perfilamento indevido? |
| `Q-TEL.11` | Retenção do traço bruto de eventos **no servidor** — `modelo-de-dados.md` §5 define a retenção da sessão, não a do traço que a produziu. Proposta a decidir: 90 dias, depois só o agregado |
| `Q-TEL.12` | Em viagem, o dia pertence ao fuso do início da sessão (`RN-TEL.47`). Confirmar contra o job diário por fuso de `04` §9, que precisa concordar |
| `Q-TEL.13` | Registro manual de livro físico (herda `Q-03.6`): sem instrumentação possível, entra como dado declarado e segregado, ou não entra? |
| `Q-TEL.14` | Se o app mantiver a tela acesa durante a leitura, o sinal "tela bloqueada" deixa de existir na prática. Isso muda a taxonomia de pausa e a calibragem do idle |
