# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## O que é este projeto

BookWorm é uma plataforma gamificada de leitura e escrita ("fitness para a mente"). **Estado atual: fase de especificação — não há código de produto ainda.** O repositório contém specs funcionais, análises críticas e mockups estáticos em HTML.

- `BookWorm.md` — rascunho original (pitch). Documento-fonte histórico, **mantido intocado**.
- `README.md` — mapa da documentação e estado do projeto.
- `specs/00-overview.md` — ponto de entrada das specs: visão, princípios de produto, personas, mapa dos 14 módulos, tabela de rastreabilidade rascunho → spec.
- `specs/mvp.md` — corte de escopo da primeira versão a construir. Ler antes de qualquer implementação.
- `specs/01` a `13` — specs funcionais por módulo (contas, biblioteca/leitor, sessões/métricas, streaks/jardim, feed, Ghost Reader, economia, social sharing, autores, monetização, IA, social/clubes, moderação).
- `specs/modelo-de-dados.md` — entidades conceituais e relacionamentos (nível conceitual, não schema de banco).
- `specs/glossario.md` — vocabulário do domínio e constantes numéricas.
- `specs/direcao-visual.md` — **identidade visual vinculante.** Pilar de design, tokens canônicos, assinatura mecânica e backlog de ajustes dos mockups.
- `specs/design-system.md` — **design system vinculante.** Camada operacional da direção visual: tokens em três camadas, escala de espaçamento, doze primitivas da assinatura, inventário de componentes do MVP, contrato de estados, acessibilidade, movimento, navegação global e a tradução para React Native. IDs `RN-DS.n` e `Q-DS.n`.
- `specs/telemetria-e-instrumentacao.md` — **instrumentação vinculante.** Camada operacional de `03`: máquina de estados da sessão e sinais de SO, os três relógios, taxonomia de pausa e blocos de foco, volume por união de intervalos, catálogo de eventos, trilho de domínio × trilho de produto, e a folha de provocações com veredito por métrica (adotar / medir em silêncio / recusar). IDs `RN-TEL.n` e `Q-TEL.n`.
- `specs/stack.md` — **decisão de stack vinculante.** Cliente (Expo, Unistyles, Skia, `react-native-readium`), servidor (Fastify, Postgres, Fly.io), `packages/core` compartilhado, índice de caracteres, sincronização offline, qualidade/CI e o que foi recusado. IDs `RN-ST.n` e `Q-ST.n`. `specs/stack-plano.md` é o plano que a originou — histórico do processo, não vinculante.
- `analise-game-design/` e `analise-monetizacao/` — análises críticas das specs, cada uma terminando em uma folha de decisão (`04-decisoes.md` / `04-recomendacao.md`).
- `mockups/*.html` — protótipos visuais estáticos e autocontidos (sem build step). `design-system.html` é o **catálogo e a referência normativa** — é dele que uma peça nova herda. `leitor-papel.html`, `telas-papel.html` e `widgets-story.html` são evidência histórica, em débito declarado (`AJ-13`); `leitor-noturno.html`, `leitor-instrumento.html`, `telas-noturno.html` e `comparativo.html` são as direções descartadas.

Não há comandos de build/lint/test porque não há código-fonte de aplicação — apenas Markdown e HTML estático. Quando o código de produto começar (ver `specs/mvp.md` §3, ordem de dependência), este arquivo deve ser atualizado com os comandos reais.

## Convenções das specs

- Idioma: PT-BR, em toda a documentação e em qualquer copy/UI referenciada.
- IDs de user story: `PREFIXO-NN` estável por módulo (`CON`, `LEI`, `SES`, `GAM`, `FEE`, `GHO`, `ECO`, `SOC`, `AUT`, `MON`, `IA`, `MOD`). Nunca reciclar um ID; funcionalidade removida vira ID aposentado.
- IDs de regra de negócio: `RN-<módulo>.<n>` (ex.: `RN-04.7`).
- IDs de questão em aberto: `Q-<módulo>.<n>`.
- Marcação `(a validar)`: valor numérico proposto pela spec, ausente do rascunho original — precisa ser calibrado com dados antes do lançamento. Valores **sem** essa marca vieram do rascunho e não devem ser alterados sem decisão explícita.
- Critérios de aceitação sempre em formato `Dado / Quando / Então`, amarrados a um ID de story.
- `BookWorm.md` é fonte histórica e não deve ser editado para refletir decisões novas — as decisões vivem nas specs de módulo e nas análises.

## Princípios de produto vinculantes

Qualquer regra de negócio que contrarie estes princípios (`specs/00-overview.md` §2) é erro de especificação, não decisão de implementação:

- **Auto-competição, nunca competição tóxica** — sem leaderboard público.
- **Anti-frustração por design** — quebra de hábito nunca destrói progresso acumulado.
- **Profundidade acima de velocidade** — recompensa Leitura Consciente, não velocidade de leitura.
- **Todo dado exibido precisa ser confiável** — métricas que geram moeda passam por antifraude antes de creditar.
- **O sucesso da plataforma é atrelado ao sucesso do autor** — receita principal de serviços ao criador, não de aprisionar o leitor.

## Pilar de design vinculante

**A estética "Papel" é o pilar de design do BookWorm.** Decidida após duas rodadas de prototipagem comparativa; as direções "Instrumento" e "Noturno" foram descartadas. A referência completa — tokens, assinatura mecânica, backlog e questões em aberto — vive em `specs/direcao-visual.md`, e é ela que manda em qualquer conflito de estilo.

O essencial, para não precisar abrir o arquivo a cada tarefa:

- **Tese:** o livro como objeto, não como aplicativo. O app é papelaria sobre uma mesa verde-escura — fichas, herbário, carimbos, etiquetas datilografadas, marginália a lápis.
- **A identidade é verde.** `--verde-tinta: #2f5d3a` é o acento, e substitui o `--oxblood: #8e2f26` ainda presente nos mockups. A metáfora do produto é botânica de ponta a ponta (jardim, Sementes, dormência, herbário) e o acento acompanha. `--mesa: #1e2320` é a base.
- **Verde é a marca; os 4 pigmentos de grifo são da leitora.** `--pig-ambar`, `--pig-oliva`, `--pig-tinta` e `--pig-carmim` não mudam — inclusive o carmim rosado. São ferramenta de quem lê, não cor institucional.
- **Métrica é tipografia, nunca gráfico de biblioteca de charts.** Sem donuts, sem barras genéricas, sem sparklines de pacote.
- **O sistema tipográfico é o Quatro Vozes,** escolhido em comparação com outros dois. Cada função tem sua face: **Spectral** = conteúdo e display · **EB Garamond** = citação e peça editorial · **Courier Prime** = chrome, rótulos e kickers · **Caveat** = manuscrito. A escala é vinculante e vive em `specs/direcao-visual.md` §3.2 — mockup novo herda a tabela, não o arquivo vizinho, e onde os dois divergirem manda a tabela. Entrelinha sempre em pixel inteiro. As faces do painel de leitura (`RN-02.16g`) são decisão da leitora, não vozes da marca.
- **Pauta obriga grade.** Papel pautado só existe se o conteúdo assentar nas linhas: passo da pauta = entrelinha, em pixels inteiros, com as linhas de base sobre os traços. Objeto pousado na folha (carimbo, ficha, botão) é opaco e **interrompe** a pauta. Na dúvida, remover as linhas e ficar só com o grão 7×7px. Ver `specs/direcao-visual.md` §4.1.
- **Dormência é bonita.** O estado de ausência recebe o mesmo investimento de arte que o estado ativo.
- **Componente nunca lê pigmento direto.** Os tokens vivem em três camadas: pigmento → superfície → papel semântico. Um componente declara a superfície em que vive e lê só `--sup-*`, e é isso que faz "o verde vive sobre papel" virar mecânica em vez de disciplina. Ver `specs/design-system.md` §2.
- **Espaçamento só da escala tônica** (3·6·9·12·18·**27**·36·54·81), ancorada nos mesmos 27px da entrelinha e do passo da pauta.
- Mockup novo herda o catálogo `mockups/design-system.html`, **não** o arquivo vizinho; não se inventa paleta nem espaçamento.

## Regras de trabalho

**Validação de mudanças práticas.** Sempre que fizermos trabalho de mão na massa (código, scripts, configuração) e o usuário não indicar como validar o resultado, é responsabilidade de quem implementa revisar o que foi feito e decidir a melhor forma de garantir que está funcionando antes de reportar como concluído — não presumir que "rodou sem erro" é suficiente.

**TDD por padrão.** Quando o projeto passar a ter código de produto, o desenvolvimento segue TDD: escrever o teste que expressa o comportamento esperado antes da implementação, ver falhar, então implementar até passar. Isso vale como prática padrão deste repositório, não apenas quando pedido explicitamente.

**Sincronização com o Obsidian.** Este repositório é a fonte de verdade do código; o vault do Obsidian em `C:\Users\Giovane\Documents\BookWorm` é a cópia de leitura do usuário. Sempre que um arquivo `.md` deste projeto (spec, resumo, validação, análise etc.) for criado ou alterado, replicar o conteúdo atualizado para o arquivo correspondente no vault (mesma estrutura de pastas: `specs/`, `analise-game-design/`, `analise-monetizacao/`, raiz). Isso deve acontecer como parte da tarefa, não como passo adicional que precisa ser pedido de novo a cada vez.

## Retomada barata

Sessão longa termina em reset de contexto ou de tokens, e este repositório tem arquivos grandes: reler `mockups/comparativo.html` custa ~45.000 tokens, `widgets-story.html` ~28.000, uma spec típica ~7.000. Uma sonda que lê o arquivo num subprocesso e imprime só o veredito custa ~40–300 tokens **para qualquer tamanho de arquivo**. Toda a doutrina abaixo sai dessa razão: numa retomada o gasto quase inteiro é releitura, não raciocínio.

**1. Ordem de retomada.** Ler `.claude/retomada.md` → sondar os arquivos que ele citar → só então `Read` dirigido. Nunca começar relendo specs "para se situar": o que a spec diz é re-derivável por grep a qualquer momento, e é o gasto mais fácil de evitar.

**2. Sondar, nunca reler.** Para descobrir *estado* — o que existe, o que falta, se está íntegro — não usar `Read` no arquivo inteiro. Usar um subprocesso que lê e imprime o veredito:

- `wc -l -c arquivo` — existe, tem tamanho plausível?
- `grep -nE '<h2|SITUAÇÃO|RN-[0-9]' arquivo` — quais seções existem?
- `grep -o '<div' arquivo | wc -l; grep -o '</div>' arquivo | wc -l` — o HTML fechou? (`grep -c` conta *linhas*, não ocorrências, e daria falso equilíbrio numa linha que abre e fecha)
- `python - <<'PY' … print(veredito) PY` — diffs, extrações e comparações: o conteúdo entra no Python, **só a conclusão entra no contexto**.
- `sed -n '400,460p'`, ou `Read` com `offset`+`limit` — depois que a sonda apontou onde.

`Read` do arquivo inteiro é último recurso, e só para *editar* algo cujo entorno exato importa.

**3. `.claude/retomada.md` guarda o estado da operação em curso.** Escrito antes de qualquer etapa longa e atualizado a cada marco. Contém **exclusivamente o que não é re-derivável do repositório**: a próxima ação concreta, URLs de artefatos publicados, decisões tomadas na conversa que ainda não viraram spec, e quais verificações já passaram — para a sessão nova não repetir. Não contém nada que um grep encontre (estrutura de arquivo, tokens, IDs, o que a spec já diz). Passou de ~150 linhas, virou documentação e perdeu a função. Fechada a operação, a seção é apagada: o arquivo descreve o presente, não o histórico. É arquivo operacional, **não replicar no vault** — a regra de sincronização vale para spec, análise, resumo e validação.

**4. Publicar antes de parar, e anotar a URL no ato.** Republicar um artefato de uma sessão que não viu a versão viva é recusado, e a correção obriga a ler o fonte publicado inteiro — ~20.000 tokens por mockup deste repositório. Deixar a publicação para a sessão seguinte compra esse custo sem necessidade; redescobrir a URL depois custa `action: "list"` mais uma leitura.

**5. Plano não se sobrescreve.** Os planos ficam em `~/.claude/plans/` e o nome deriva da primeira mensagem da sessão — rodadas diferentes na mesma sessão colidem no mesmo arquivo. O plano é a peça de maior valor por token numa retomada; se uma rodada nova for reusar o nome, copiar o anterior para `.claude/planos/<data>-<assunto>.md` antes.

**6. Subagente escreve o arquivo inteiro cedo.** Já validado neste repositório: na rodada de tipografia o agente morreu por limite de sessão e mesmo assim entregou o arquivo completo, porque o prompt mandava produzir todas as situações ainda rústicas antes de refinar qualquer uma; na rodada de widgets, sem essa cláusula, o arquivo ficou pela metade e precisou ser terminado à mão. Todo prompt de subagente longo carrega essa cláusula e mais a de reportar em uma linha onde parou.
