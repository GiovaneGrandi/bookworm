# 08 — Compartilhamento Social: Wrap-Up e Mapa de Constância

## 1. Objetivo

Produzir os ativos visuais que o usuário quer exibir: o **Reading Wrap-Up** ao fim de cada sessão e o **Mapa de Constância** no estilo *commit grid*. São, ao mesmo tempo, recompensa simbólica (Core Drive 5 do Octalysis — influência social e pertencimento) e o principal canal de aquisição orgânica da plataforma (rascunho L37–54).

A régua de qualidade aqui é alta por decisão de produto: o card precisa ser bonito o bastante para que alguém queira postá-lo sem que o app peça (P6).

## 2. Escopo

**Dentro:** geração do card de sessão, temas visuais, seleção de citação em destaque, mapa de calor de constância, card de jardim, formatos de exportação, controles de privacidade e atribuição.

**Fora:** métricas exibidas nos cards → [`03-sessoes-e-metricas.md`](03-sessoes-e-metricas.md). Ofensiva e jardim → [`04-streaks-e-jardim.md`](04-streaks-e-jardim.md). Compra de temas com moedas → [`07-economia-moedas.md`](07-economia-moedas.md).

## 3. Personas

Leitor (primária), Autor (compartilha marcos de escrita e de audiência).

---

## 4. User stories

| ID | Story |
|---|---|
| `SOC-01` | Como leitor, quero receber um card bonito ao fim da sessão para compartilhar minha leitura. |
| `SOC-02` | Como leitor, quero escolher o tema visual do card para combinar com minha estética. |
| `SOC-03` | Como leitor, quero destacar uma citação da sessão no card para compartilhar o que me marcou. |
| `SOC-04` | Como leitor, quero escolher quais métricas aparecem no card para controlar o que exponho. |
| `SOC-05` | Como leitor, quero compartilhar meu mapa de constância como troféu de disciplina. |
| `SOC-06` | Como leitor, quero que o formato seja adequado a Stories para postar sem recortar. |
| `SOC-07` | Como leitor, quero salvar a imagem na galeria além de compartilhar direto. |
| `SOC-08` | Como leitor, quero compartilhar marcos (ofensiva de 30 dias, obra concluída) quando eles acontecem. |
| `SOC-09` | Como autor, quero que meu nome e minha obra apareçam quando um leitor compartilha um trecho meu. |
| `SOC-10` | Como leitor, quero compartilhar meu jardim para mostrar o que construí. |

---

## 5. Regras de negócio

### 5.1 Card de sessão (Reading Wrap-Up)

- `RN-08.1` O card é oferecido ao fim de toda sessão `valida` (`RN-03.23`), como ação secundária no resumo. Nunca é imposto, nunca abre sozinho a folha de compartilhamento do sistema.
- `RN-08.2` Conteúdo do card, conforme o rascunho (L49–52):
  - **Métricas de esforço:** tempo ativo e páginas canônicas da sessão;
  - **Destaque literário:** a citação de maior relevância da sessão;
  - **Métrica de constância:** ofensiva atual (ex.: "Ofensiva de 14 dias contínuos");
  - **Status de conclusão:** progresso percentual da obra;
  - Capa e título da obra, e nome do autor (`RN-08.14`).
- `RN-08.3` Todo bloco é individualmente ocultável pelo usuário (`SOC-04`), e a escolha é lembrada como padrão para os próximos cards. Só o crédito da obra e do autor não é removível (`RN-08.14`).
- `RN-08.4` **Seleção da citação.** Prioridade: (1) destaque criado durante a sessão — o mais recente, se houver mais de um; (2) destaque escolhido manualmente entre os da sessão; (3) primeira frase do trecho lido, com no máximo 240 caracteres; (4) nenhuma citação, e o card usa layout alternativo sem bloco de texto. Em nenhum caso a citação é escolhida por algoritmo de "frase impactante" — a curadoria é do leitor.
- `RN-08.5` O trecho citado é limitado a 400 caracteres (a validar), por respeito a direito autoral e por legibilidade em tela pequena.
- `RN-08.6` O card nunca exibe **comparação com outros usuários, percentil, média de leitores ou qualquer ranking** (`RN-06.8`, `RN-06.9`). Esta parte da regra é inegociável e não admite exceção por escolha do usuário.
  - *Redação anterior proibia também velocidade e ritmo. Revista — ver `RN-08.6a` e a nota de decisão em §5.1.1.*
- `RN-08.6a` **Destaque escolhível.** O usuário escolhe qual métrica lidera o ativo compartilhado. O catálogo de destaques disponíveis é: **tempo ativo · páginas canônicas · maior bloco contínuo de foco · destaques criados · ofensiva atual · progresso da obra · ritmo de leitura**. Três guardas:
  - **Ritmo nunca é o padrão.** O destaque inicial é tempo ativo; ritmo só aparece se a pessoa o escolher deliberadamente.
  - **Nenhum destaque vem acompanhado de comparação externa.** Um número exibido é sempre só o número da própria pessoa (`RN-08.6`).
  - **O estilo de leitura permanece descritivo** e nunca é apresentado como nota (`RN-03.22`, `RN-03.22a`).
- `RN-08.7` O card é gerado **no cliente**, para funcionar offline e responder instantaneamente. A renderização no servidor existe apenas como caminho alternativo para a web e para pré-visualizações em links.

#### 5.1.1 Nota de decisão — por que o ritmo passou a ser exibível

A redação anterior de `RN-08.6` proibia velocidade de leitura no card, invocando **P3 — profundidade acima de velocidade**. A proibição foi revista por decisão de produto, e a justificativa precisa ficar registrada para que não seja lida depois como erosão do princípio.

**A distinção que sustenta a mudança: P3 diz que o sistema não *recompensa* velocidade — não diz que a pessoa não pode *mostrar* a dela.** A Leitura Consciente continua cega a ritmo (`RN-03.20`: "não entra na fórmula, em nenhum sinal e com nenhum peso"); a meta, a ofensiva e a economia continuam sem qualquer componente de velocidade. O que muda é apenas o que a pessoa pode **exibir** sobre si mesma, por escolha própria, num ativo que ela decide postar.

Dois argumentos de produto sustentam a decisão:

- **A métrica já existe para ela dentro do app.** Se o leitor acompanha o próprio ritmo nas telas privadas, proibir que ele o compartilhe é uma restrição sem beneficiário.
- **Ela atende o leitor veterano.** Quem já lê muito quer instrumento; quem está retomando a leitura tende a escolher outra métrica — e a escolha é justamente o mecanismo que separa os dois públicos sem impor nada a nenhum deles. É `P7` sendo respeitado nos dois sentidos.

**Risco assumido, a monitorar.** Tornar o ritmo socialmente visível cria um gradiente de recompensa que o sistema não concede: ninguém ganha nada por ler rápido, mas exibir velocidade pode passar a parecer desejável por si só. É o único vetor pelo qual P3 pode ser corroído sem que nenhuma regra seja violada. Métrica-canário proposta: **a distribuição de escolha de destaque**. Se o ritmo se tornar o destaque majoritário, o produto está comunicando algo que não pretendia — e a revisão volta à mesa.

`RN-08.6` permanece intocada na parte que importa: **comparação com outras pessoas segue proibida em qualquer superfície, sem exceção.** A escolha do usuário pode alterar o que ele mostra de si; nunca pode introduzir outra pessoa no quadro.

### 5.2 Temas visuais

- `RN-08.8` Temas iniciais, definidos no rascunho (L48): **Dark Mode**, **Minimalista**, **Cyberpunk** e **Papel Antigo**.
- `RN-08.9` Cada tema define paleta, tipografia, tratamento da capa, textura de fundo e estilo dos numerais. Um tema é uma identidade completa, não uma troca de cor de fundo.
- `RN-08.10` Dois temas são gratuitos desde o início (Minimalista e Dark, a validar). Os demais são adquiridos com moedas (`07`) ou desbloqueados por marcos de ofensiva (`RN-04.13`).
- `RN-08.11` Temas sazonais e comemorativos podem ser lançados por tempo limitado; uma vez desbloqueados, permanecem para sempre na conta (`RN-04.28`).
- `RN-08.12` O usuário pré-visualiza qualquer tema, inclusive os bloqueados, com o próprio conteúdo — o bloqueio incide sobre exportar e compartilhar, não sobre ver. Mostrar o valor é mais eficaz do que esconder o produto (`00` §3, estado *Bloqueado por plano*).

### 5.3 Atribuição e direitos

- `RN-08.13` Todo card carrega, de forma discreta e não removível, a marca da plataforma. É o mecanismo de aquisição orgânica do produto.
- `RN-08.14` Card que contenha citação exibe obrigatoriamente título da obra e nome do autor (`SOC-09`). Nenhum ajuste do usuário pode remover a atribuição de autoria.
- `RN-08.15` Obra com restrição de citação declarada pelo autor no cadastro (`09`) permite compartilhamento de métricas, mas não do texto. O card assume o layout sem citação, e o motivo é informado ao leitor.
- `RN-08.16` A imagem de capa usada no card respeita os direitos cedidos pelo autor na publicação.

### 5.4 Mapa de Constância (heat map)

- `RN-08.17` Grade de dias no estilo *commit grid* do GitHub (rascunho L53–54), com intensidade de cor proporcional ao volume lido no dia, em 5 níveis (a validar): sem leitura, abaixo da meta, meta cumprida, 1,5× a meta, 2× ou mais.
- `RN-08.18` Períodos disponíveis: mês corrente, últimos 3 meses, ano corrente e últimos 365 dias.
- `RN-08.19` Dias protegidos por congelamento (`RN-04.19`) recebem marcação visual própria, distinta de dia cumprido e de dia vazio — o mapa é um registro honesto.
- `RN-08.20` A grade tem duas variantes de eixo: leitura e escrita, e uma variante combinada para quem mantém os dois hábitos.
- `RN-08.21` O mapa é exportado prioritariamente em formato vertical 9:16, otimizado para Stories (rascunho L54).

### 5.5 Formatos e exportação

- `RN-08.22` Formatos de saída **de card cheio**: **9:16** (Stories e Reels, padrão), **1:1** (post de feed) e **4:5** (post vertical de feed). O card é composto de forma responsiva; não há corte de conteúdo entre formatos.
- `RN-08.22a` **O adesivo é formato de primeira classe**, ao lado do card cheio. Adesivo é uma peça de **fundo transparente e dimensão livre**, feita para ser sobreposta a uma foto que o próprio usuário tirou — não uma imagem de borda a borda. Exportado em **PNG com canal alfa**.
  - A razão é de comportamento, não de estética: quem posta quer mostrar **o próprio momento**, não a interface de um app. O card cheio substitui a foto da pessoa; o adesivo a acompanha. Isso torna o adesivo, e não o card, a peça de maior circulação esperada.
  - Três regras vigentes precisam ser lidas de outro modo no adesivo:
    - **`RN-08.13` (marca não removível)** continua valendo integralmente, mas a marca não pode depender da superfície de papel que a sustenta no card cheio: ela precisa permanecer legível sobre **qualquer** fundo, por contraste próprio.
    - **`RN-08.9` (o tema define a textura de fundo)** não se aplica: no adesivo não existe fundo. O tema define material, tinta e tipografia; a textura fica onde houver suporte.
    - **`RN-08.22`** não se aplica: adesivo não tem proporção fixa.
- `RN-08.22b` **Toda peça que faça sentido nas duas formas existe nas duas**: card cheio e adesivo, com o mesmo dado e recortes diferentes. A pessoa escolhe se quer substituir a foto ou acompanhá-la.
- `RN-08.23` Resolução de exportação: 1080×1920 para 9:16 e equivalentes nos demais, em PNG (a validar).
- `RN-08.24` Ações disponíveis: compartilhar pela folha nativa do sistema, salvar na galeria e copiar imagem.
- `RN-08.25` O compartilhamento pode incluir um link para a obra na plataforma, com atribuição de origem para medir a aquisição gerada. O link é opcional e visível ao usuário antes do envio.
- `RN-08.26` A geração do card não bloqueia a interface: o resumo de sessão continua utilizável enquanto a imagem é composta.

### 5.6 Cards de marco e de jardim

- `RN-08.27` Cards de marco são gerados automaticamente em: marco de ofensiva alcançado, obra concluída, melhor semana pessoal, e fechamento mensal e anual. Ficam disponíveis em uma galeria de conquistas, sem notificação insistente — no máximo uma notificação por marco (`RN-01.17`).
- `RN-08.28` O card de jardim (`SOC-10`) renderiza a cena atual do jardim com a ofensiva e o acervo de dias cumpridos. Jardim em dormência é compartilhável e mantém a estética de outono, sem qualquer linguagem de fracasso (P2) — a retomada também é uma história que vale contar.
- `RN-08.29` O compartilhamento nunca é condição para receber recompensa. Não há moeda por compartilhar (`RN-05.22`): pagar por exposição transformaria o card em anúncio e destruiria sua credibilidade.

### 5.7 Catálogo de widgets

Resultado da prototipagem em [`../mockups/widgets-story.html`](../mockups/widgets-story.html), com as decisões tomadas na revisão. O desenho de cada peça vive em [`direcao-visual.md`](direcao-visual.md); aqui fica **o que existe e o que cada peça mostra**.

- `RN-08.33` O catálogo aprovado é o seguinte. Nenhuma peça fora desta lista entra em produção sem decisão explícita.

| Peça | Forma | Mostra | Estado |
|---|---|---|---|
| **Carimbo de sessão** | adesivo | destaque escolhido + 2 números de apoio | **Aprovada** |
| **Ficha de empréstimo** | adesivo | sessão, obra e data | **Aprovada** |
| **Número a lápis** | adesivo | 1 número + rótulo, sem suporte | **Aprovada** |
| **Resumo de sessão** | card cheio **e** adesivo | as principais estatísticas da sessão | **Aprovada** — `RN-08.22b` |
| **Citação grifada** | card cheio translúcido | o trecho, obra e autor (`RN-08.14`) | **Aprovada sem ressalva** |
| **Mapa de constância** | card cheio | a grade do período (`RN-08.17`–`RN-08.21`) | **Aprovada** |
| **Traço da sessão** | card cheio **e** adesivo | a forma da sessão no tempo | **Aprovada na ideia, reprovada na execução** — ver `RN-08.34` |
| **Jornada da obra** | card cheio | obra concluída: período, sessões, tempo, destaques | **Aprovada com ressalva de composição** — ver `RN-08.35` |
| **Fechamento semanal** | card cheio | `RN-04.39` | **Aprovada com ressalva de composição** — ver `RN-08.35` |
| **Marco de ofensiva** | card cheio | `RN-04.13` | **Aprovada com ressalva de composição** — ver `RN-08.35` |

- `RN-08.34` **O traço da sessão** — representar a sessão como forma abstrata, única, legível a três metros — é decisão firmada. **A execução em linha contínua, no vocabulário de mapa de rota de aplicativo de corrida, foi reprovada** e não deve ser retomada: ela importa a leitura de "percurso percorrido", que é de esporte, e não de leitura. A forma correta ainda não foi encontrada; ver `Q-08.7`.
- `RN-08.35` **Densidade de composição.** Peças de card cheio não podem ter grandes áreas vazias. O ativo compartilhado disputa atenção num feed, e espaço ocioso lê como rascunho, não como respiro. Isto é requisito de eficácia, não preferência estética: `P6` trata o ativo como motor de aquisição, e um card mal composto não circula.
- `RN-08.36` **Progresso da obra continua sendo dado compartilhável** (`RN-08.2`), mas **não tem peça definida**. A representação por espessura do corte de páginas foi reprovada. Ver `Q-08.8`.

**Retiradas do catálogo nesta revisão:**

| Peça | Motivo |
|---|---|
| **Etiqueta datilografada** | Não se sustenta como algo que alguém postaria. A métrica que ela carregava — maior bloco contínuo de foco — permanece no catálogo de destaques de `RN-08.6a` |
| **Corte do livro** | Representação de progresso reprovada. A necessidade permanece: ver `RN-08.36` |
| **Retomada** (jardim em dormência) | Ver a tensão declarada abaixo |

**Tensão declarada — a retomada.** A peça foi retirada porque compartilhar uma quebra de ofensiva não se sustentou como comportamento plausível. Mas `RN-08.28` continua vigente e diz o oposto: *"jardim em dormência é compartilhável (…) — a retomada também é uma história que vale contar"*. As duas coisas não podem valer ao mesmo tempo. Ou `RN-08.28` é revista, ou o jardim dormente permanece compartilhável pelo card de jardim genérico, sem peça dedicada. **Esta segunda leitura é a vigente até decisão em contrário**: nada foi removido do produto, apenas não se investe em uma peça específica para esse momento.

### 5.8 Privacidade

- `RN-08.30` Nada é compartilhado sem ação explícita do usuário. Não existe postagem automática nem integração que publique em nome dele.
- `RN-08.31` O card não expõe dados que o usuário mantém privados no perfil (`RN-01.12`), a menos que ele os inclua deliberadamente naquele card — a escolha é por card, não uma mudança de configuração de privacidade.
- `RN-08.32` Anotações pessoais nunca entram no card. Somente destaques podem virar citação, porque são recorte do texto do autor, não pensamento privado do leitor.

---

## 6. Critérios de aceitação

**`SOC-01` + `RN-08.1` — Oferta sem imposição**
```
Dado que encerro uma sessão válida
Quando o resumo é exibido
Então há uma ação de compartilhar disponível
E nenhuma folha de compartilhamento abre automaticamente
E posso sair do resumo sem interagir com ela
```

**`SOC-03` + `RN-08.4` — Citação escolhida pelo leitor**
```
Dado que criei 3 destaques durante a sessão
Quando abro o card
Então o destaque mais recente aparece como citação
E posso trocar por qualquer outro destaque da mesma sessão
E se eu não tiver criado nenhum destaque
Então o card usa a primeira frase do trecho lido, limitada a 240 caracteres
```

**`SOC-04` + `RN-08.3` — Blocos ocultáveis com memória**
```
Dado que oculto o bloco de tempo no card
Quando gero o card da próxima sessão
Então o bloco de tempo continua oculto por padrão
E o crédito da obra e do autor permanece visível e não removível
```

**`SOC-02` + `RN-08.12` — Pré-visualizar tema bloqueado**
```
Dado que o tema Cyberpunk não está desbloqueado
Quando o seleciono na galeria de temas
Então vejo meu card real renderizado nesse tema
E as ações de exportar e compartilhar ficam indisponíveis
E vejo o custo em moedas e como desbloqueá-lo
```

**`RN-08.15` — Obra com citação restrita**
```
Dado que leio uma obra cujo autor restringiu a citação de trechos
Quando gero o card da sessão
Então o card usa o layout sem bloco de citação
E as métricas de esforço e constância continuam presentes
E o app explica por que a citação não está disponível
```

**`SOC-05` + `RN-08.19` — Mapa honesto**
```
Dado que tive 3 dias protegidos por congelamento no mês
Quando gero o mapa de constância
Então esses dias aparecem com marcação distinta de dia cumprido
E a legenda explica cada nível de intensidade
```

**`SOC-06` + `RN-08.22` — Formato sem corte**
```
Dado que gero um card em 9:16 e alterno para 1:1
Quando comparo os dois
Então nenhum conteúdo é cortado ou sobreposto
E o layout se recompõe para o novo formato
```

**`RN-08.7` — Geração offline**
```
Dado que estou sem conexão e encerro uma sessão
Quando gero o card
Então a imagem é composta localmente e pode ser salva na galeria
E o compartilhamento com link fica indisponível até haver conexão
```

**`RN-08.29` — Sem recompensa por compartilhar**
```
Dado que compartilhei 10 cards em um dia
Quando consulto meu extrato de moedas
Então nenhum crédito foi gerado pelos compartilhamentos
```

---

## 7. Telas e estados

| Tela | Conteúdo | Estados |
|---|---|---|
| **Card de sessão (editor)** | Pré-visualização em tempo real, seletor de tema, alternância de formato, blocos ocultáveis, troca de citação, ações de exportar | Carregando (composição), Erro (falha de renderização → tema padrão), Offline (sem link, com salvar habilitado), Bloqueado (tema não desbloqueado) |
| **Galeria de temas** | Grade de temas com pré-visualização real, custo, origem do desbloqueio | Bloqueado por saldo |
| **Mapa de constância** | Grade por período, legenda, seletor de eixo, ações de exportar | Vazio (menos de 7 dias de histórico: mostra a grade em construção), Carregando |
| **Card de jardim** | Cena do jardim, ofensiva, acervo, tema | Dormência (paleta de outono) |
| **Galeria de conquistas** | Cards de marco gerados, ordenados por data, com ação de recompartilhar | Vazio (explica quais marcos geram cards) |

---

## 8. Dados

| Entidade | Campos principais | Propósito |
|---|---|---|
| `TemaCard` | chave, nome, gratuito, custo_moedas, desbloqueio (compra, marco, sazonal), paleta, tipografia, ativo, disponivel_ate | Catálogo de temas |
| `TemaDesbloqueado` | usuario_id, tema_chave, desbloqueado_em, origem | Posse permanente |
| `PreferenciasCard` | usuario_id, tema_padrao, formato_padrao, forma_padrao (card, adesivo), **destaque** (tempo_ativo, paginas, maior_bloco, destaques, ofensiva, progresso, ritmo), blocos_visiveis{tempo, paginas, citacao, ofensiva, progresso, **estilo**}, incluir_link | Memória das escolhas. `destaque` sustenta `RN-08.6a` e nasce em `tempo_ativo`; a chave `estilo` corrige a lacuna em que `RN-03.22b` mandava o estilo de leitura caber no card sem que o modelo tivesse onde guardá-lo |
| `CardGerado` | id, usuario_id, tipo (sessao, marco, jardim, mapa), referencia_id, tema, formato, citacao_destaque_id, gerado_em, compartilhado_em, destino | Galeria e métricas de compartilhamento |
| `RestricaoCitacao` | obra_id, permite_citacao, limite_caracteres | Direitos declarados pelo autor |

---

## 9. API (alto nível)

| Operação | Descrição |
|---|---|
| Obter dados do card de sessão | Métricas, citação candidata, ofensiva, progresso e restrições da obra |
| Listar temas | Catálogo com estado de desbloqueio do usuário |
| Desbloquear tema | Débito de moedas via `07` |
| Salvar preferências de card | Tema, formato e blocos visíveis |
| Registrar geração e compartilhamento | Telemetria de aquisição orgânica |
| Obter série do mapa de constância | Dias por período, com nível e marcação de congelamento |
| Listar cards de marco | Galeria de conquistas |
| Renderizar card no servidor | Caminho alternativo para web e pré-visualização de link |

---

## 10. Métricas de sucesso

- Percentual de sessões que geram card e percentual de cards efetivamente compartilhados.
- Instalações atribuídas a links de card compartilhado (a métrica que justifica o investimento em qualidade visual).
- Distribuição de uso por tema e taxa de conversão de tema pago.
- Taxa de compartilhamento do mapa de constância por usuário com ofensiva ≥ 7 dias.
- Percentual de cards com citação (indicador indireto de que os leitores estão grifando — P3).
- Tempo de geração do card no dispositivo (alvo < 500 ms).
- **Proporção adesivo / card cheio** entre as peças efetivamente compartilhadas. É o teste da aposta de `RN-08.22a`: se o adesivo não superar o card cheio em circulação, a premissa que motivou o formato estava errada.
- **Distribuição de escolha de destaque** (`RN-08.6a`), por métrica. É a **métrica-canário de §5.1.1**: ritmo majoritário significa que a exibição de velocidade passou a comunicar o que P3 recusa, e a decisão volta à mesa (`Q-08.10`).

---

## 11. Questões em aberto

| ID | Questão |
|---|---|
| `Q-08.1` | Quanto de citação é aceitável exibir sem infringir direito autoral? O limite de 400 caracteres é conservador, mas precisa de validação jurídica e de cláusula no contrato de publicação. |
| `Q-08.2` | Os temas serão produzidos por design interno ou haverá curadoria de artistas convidados? Interfere no custo e no ritmo de lançamento de temas sazonais. |
| `Q-08.3` | Haverá card animado (vídeo curto ou GIF)? Aumenta muito o desempenho em Stories, mas exige pipeline de renderização mais complexo. |
| `Q-08.4` | O link compartilhado leva à obra, ao perfil do leitor ou a uma página do card? Cada destino serve a um objetivo de aquisição diferente. |
| `Q-08.5` | Haverá integração direta com APIs de redes sociais, ou apenas a folha de compartilhamento nativa? A folha nativa é mais simples e mais respeitosa com a privacidade. |
| `Q-08.6` | O rascunho traz um exemplo visual de widget (L41–43). Esse exemplo é direção estética a seguir, ou apenas ilustração descartável? **Não respondível com o material versionado:** a referência de imagem em [`../BookWorm.md`](../BookWorm.md) L41 está quebrada (`![][image1]`) e o arquivo não está no repositório. Ou o original aparece, ou a questão deve ser aposentada. |
| `Q-08.7` | **Qual a forma do traço da sessão?** `RN-08.34` firma a ideia — a sessão como forma abstrata, única, legível a três metros — e descarta a execução em linha contínua estilo mapa de rota. O que representar a sessão sem importar vocabulário de esporte segue em aberto. É a peça de maior potencial do catálogo e a única sem solução visual. |
| `Q-08.8` | **Como representar o progresso da obra?** `RN-08.36` mantém o dado como compartilhável e descarta a espessura do corte de páginas. Falta uma forma. |
| `Q-08.9` | **`RN-08.28` sobrevive?** A regra diz que o jardim em dormência é compartilhável porque "a retomada também é uma história que vale contar"; a revisão do catálogo concluiu que ninguém posta uma quebra de ofensiva. Ver a tensão declarada em §5.7. |
| `Q-08.10` | **A distribuição de escolha de destaque (`RN-08.6a`) se mantém saudável?** É a métrica-canário de §5.1.1: se o ritmo virar o destaque majoritário, a exibição de velocidade estará corroendo P3 por via social, sem violar regra nenhuma. Só medível depois da primeira coorte. |
