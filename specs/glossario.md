# Glossário e Constantes

Vocabulário canônico do domínio. Todo módulo usa estes termos com este significado; quando uma spec precisar de um termo novo, ele entra aqui.

---

## 1. Termos de domínio

| Termo (PT-BR) | Equivalente técnico / inglês | Definição |
|---|---|---|
| **Obra** | *Work* / *Book* | Unidade publicável de um autor. Contém metadados, capítulos e um arquivo de conteúdo. |
| **Capítulo** | *Chapter* | Subdivisão navegável de uma obra. Unidade de marco de recompensa e de analytics. |
| **Posição** | *Locator* | Ponteiro canônico e estável para um ponto do texto de uma obra. Base de todo progresso. |
| **Página canônica** | *Canonical page* | Unidade de exibição derivada de posições, definida por convenção de caracteres. Não corresponde a página física. |
| **Sessão de leitura** | *Reading session* | Intervalo contínuo de leitura de uma obra, do início até o encerramento explícito ou por inatividade. |
| **Tempo ativo** | *Active time* | Parcela da sessão em que houve evidência de leitura (app em primeiro plano, sem inatividade prolongada). |
| **Leitura Consciente** | *Mindful Reading score* | Indicador 0–100 que combina tempo ativo com profundidade, alcançável por interações qualitativas **ou** por blocos longos de foco. |
| **Interação qualitativa** | *Qualitative interaction* | Destaque, anotação de margem ou consulta ao dicionário interno feitos durante a sessão. |
| **Ofensiva** | *Streak* | Contagem de dias consecutivos em que a meta diária foi cumprida. Existe em dois eixos independentes: leitura e escrita. |
| **Meta base** | *Daily goal* | Régua diária definida pelo usuário (em páginas ou minutos, para leitura; em palavras ou minutos, para escrita). |
| **Jardim** | *Garden* | Representação visual do estado da ofensiva. Cresce com constância, entra em dormência (outono) quando a ofensiva quebra. |
| **Dormência** | *Dormancy* | Estado estético de outono do jardim após quebra de ofensiva. Nunca é morte: o progresso acumulado é preservado. |
| **Congelamento de Ofensiva** | *Streak Freeze* | Item comprável que preserva a ofensiva em um dia sem cumprimento de meta. |
| **Ghost Reader** | *Ghost Reader* | Perfil de desempenho histórico do próprio usuário, usado como referência de comparação sutil durante a sessão. |
| **Baseline** | *Baseline* | Perfil de ritmo e foco do usuário, derivado das suas primeiras sessões reais. Serve só ao Ghost Reader. |
| **Pílula Literária** | *Snackable story* | Micro-trecho de 1 a 3 parágrafos, ou poema curto, publicado por um autor no feed vertical. |
| **Feed** | *Discovery feed* | Superfície vertical de rolagem infinita onde as pílulas são consumidas. |
| **Wrap-Up** | *Reading Wrap-Up card* | Cartão visual gerado ao fim de uma sessão, formatado para compartilhamento em redes sociais. |
| **Mapa de Constância** | *Heat map* | Grade de dias de leitura no estilo *commit grid* do GitHub. |
| **Semente** (moeda) | *Soft currency* | Moeda do produto. **Só ganha, nunca comprada.** Compra apenas cosmético e boost; não compra obra e não vira gorjeta (`RN-07.1`). Não confundir com a **semente do jardim** (item que brota). |
| **Carteira** | *Wallet* | Saldo de moedas de um usuário, com histórico completo em ledger. |
| **Ledger** | *Ledger* | Registro imutável e append-only de toda movimentação de moeda. |
| **Gorjeta** | *Tip* | Apoio voluntário **em dinheiro** de um leitor a um autor, com mensagem opcional explicando o motivo (`RN-07.15`). |
| **Crédito de Autor** | *Author credit* | Saldo único do autor em moeda real, originado de vendas e gorjetas. Sempre sacável (`RN-07.16`). |
| **Take Rate** | *Take rate* | Comissão retida pela plataforma: 25% na web, 30% no app, 10% sobre gorjeta (`RN-10.6`, `RN-10.8`). |
| **Leitor aberto** | *Open reader* | Decisão de o app ler EPUB ou PDF do próprio usuário e domínio público, além do catálogo (`RN-02.1`). |
| **ARC** | *Advance Reader Copy* | Cópia antecipada distribuída a leitores selecionados antes do lançamento (`RN-09.30`). |
| **IA de audiência** | *Audience AI* | Diagnóstico por IA sobre o comportamento agregado dos leitores de uma obra (`RN-09.20a`). |
| **Trilho de pagamento** | *Payment rail* | Caminho pelo qual o dinheiro entra: web + Pix, web + cartão, ou compra in-app. Determina quanto sobra (`RN-10.7`). |
| **Destaque de Vitrine** | *Showcase placement* | Posição promovida no catálogo ou no feed, adquirível pelo autor. |
| **Quest de Escrita** | *Writing quest* | Meta de produção definida pelo próprio autor (ex.: 300 palavras no dia). |
| **Sprint de Foco** | *Focus sprint* | Bloco cronometrado de escrita ininterrupta (técnica Pomodoro), com registro de PPM. |
| **PPM** | *WPM* | Palavras por minuto produzidas em um sprint de escrita. |
| **Mapa de Evasão** | *Drop-off map* | Visualização de onde os leitores abandonam uma obra. |
| **Premium Reader** | *Premium Reader* | Assinatura de leitor que desbloqueia os recursos assistivos de IA. |
| **Destaque (grifo)** | *Highlight* | Trecho marcado pelo leitor dentro do leitor imersivo. |
| **Biblioteca** | *Library* | Superfície do que **ainda vai ser lido**: obras em leitura, em pausa e na fila. Obra concluída sai dela e passa à Estante (`RN-02.6a`). |
| **Estante** | *Shelf* | Acervo visual permanente das obras **concluídas** — a única superfície onde elas aparecem. Só cresce; nada sai dela, nem em releitura (`RN-02.6b`). |
| **Conjunto** | *Collection set* | Coleção com critério declarado (gênero, década, autores estreantes) que concede selo ao ser completada. |
| **Semente** | *Seed* | Item conquistado que é plantado no jardim e revela, depois de alguns dias cumpridos, qual planta trouxe. Nunca comprável com dinheiro. |
| **Desafio da Semana** | *Weekly challenge* | Objetivo curto, rotativo e opcional, sorteado a cada semana. |
| **Estilo de leitura** | *Reading style* | Descrição de como a pessoa leu naquela sessão — Focado, Metódico ou Equilibrado. Nunca uma nota de qualidade. |
| **Dupla** | *Reading pair* | Dois leitores acompanhando a mesma obra, com destaques visíveis entre si. |
| **Clube** | *Book club* | Grupo com obra comum e meta coletiva, com discussão travada por posição de leitura. |
| **Anotação** | *Annotation / margin note* | Nota de texto do leitor vinculada a uma posição ou a um destaque. |

> Cuidado com a colisão: **Destaque (grifo)** é ação do leitor no texto; **Destaque de Vitrine** é posição promocional comprada pelo autor. As specs sempre usam o termo completo quando houver ambiguidade.

---

## 2. Constantes numéricas

### 2.1 Vindas do rascunho — não alterar sem decisão explícita

| Constante | Valor | Origem |
|---|---|---|
| ~~`TAKE_RATE`~~ | ~~5% sobre venda direta~~ — **revisto**: dava prejuízo em 3 dos 4 trilhos. Ver `TAKE_RATE_WEB` e `TAKE_RATE_APP` em §2.2 | L123 |
| `META_EXEMPLO_PAGINAS` | 15 páginas/dia | L78 |
| `META_EXEMPLO_MINUTOS` | 20 minutos/dia | L78 |
| `PILULA_PARAGRAFOS` | 1 a 3 parágrafos | L88 |
| `QUEST_EXEMPLO_PALAVRAS` | 300 palavras/dia | L112 |
| `SPRINT_EXEMPLO_MINUTOS` | 15 minutos | L113 |
| `LIMITE_OBRAS_PLANO_FREE` | 1 a 3 obras ativas (faixa; valor exato em `Q-10.1`) | L133 |

### 2.2 Propostas por esta especificação — *(a validar)*

| Constante | Valor proposto | Definida em |
|---|---|---|
| `PAGINA_CANONICA_CARACTERES` | 1.500 caracteres com espaços (≈250 palavras) | `03` |
| `IDLE_TIMEOUT_SEGUNDOS` | 90 s sem interação e sem avanço de posição pausam o tempo ativo | `03` |
| `SESSAO_TIMEOUT_MINUTOS` | 30 min de pausa encerram a sessão automaticamente | `03` |
| `SESSAO_MINIMA_SEGUNDOS` | 60 s: abaixo disso a sessão é `curta` — conta para a meta, não gera moeda | `03` |
| `RITMO_MAXIMO_FISICO` | 2.500 caracteres por minuto de tempo ativo (teto físico, não comparação com baseline) | `03` |
| `PILULA_TETO_META` | 5 min/dia de pílula contam para a meta | `03`, `05` |
| `TETO_MOEDAS_DIARIO` | 150 moedas/dia por conta | `07` |
| `MR_PESO_TEMPO` | 60 pontos do score de Leitura Consciente | `03` |
| `MR_PESO_PROFUNDIDADE` | 40 pontos, alcançáveis por interação **ou** por foco contínuo | `03` |
| `MR_INTERACAO_ESPERADA` | 1 interação qualitativa a cada 10 min de tempo ativo | `03` |
| `MR_FOCO_ESPERADO` | 20 min de bloco contínuo para saturar a via do foco | `03` |
| `CUSTO_STREAK_FREEZE` | 200 moedas | `07` |
| `INTERVALO_ALTERACAO_META` | 7 dias entre aumentos de meta; redução é sempre livre | `04` |
| `FREEZE_MAX_ESTOQUE` | 3 congelamentos simultâneos em estoque | `04` |
| `FREEZE_MAX_CONSECUTIVOS` | 2 dias consecutivos protegidos | `04` |
| `MARCOS_OFENSIVA` | 7, 30, 100, 365 dias | `04` |
| `RESENHA_MINIMA_CARACTERES` | 400 caracteres | `02`, `07` |
| `RESENHA_PROGRESSO_MINIMO` | 90% da obra concluída | `02`, `07` |
| `PRAZO_REVISAO_PUBLICACAO` | 48 h entre submissão e decisão | `09`, `13` |
| `MARCADORES_CONTEUDO` | Lista fechada de 8: sexo explícito, violência gráfica, suicídio e automutilação, abuso, uso de substâncias, transtorno alimentar, linguagem forte, conteúdo perturbador | `13` |
| `IDADE_CONTEUDO_ADULTO` | 18 anos para liberar conteúdo adulto | `01`, `13` |
| `TEMPERATURA_LUZ_MIN` | 2.700 K (âmbar quente) | `02` |
| `TEMPERATURA_LUZ_MAX` | 6.500 K (branco frio) | `02` |
| `TEMPERATURA_LUZ_PADRAO` | 4.200 K (neutro) | `02` |
| `ANCORA_POSICAO_PADRAO` | `posicao_numero` — posição, página canônica e capítulo | `02` |
| `BASELINE_JANELA_RECALCULO` | Mediana das últimas 20 sessões válidas; mínimo de 3 para calibrar | `01`, `06` |
| `RETENCAO_LEDGER` | Permanente (append-only, sem expurgo) | `07` |
| `RECOMPENSA_CONCLUSAO_BASE` | 25 moedas + 0,15/página canônica, teto 400 | `07` |
| `TAKE_RATE_WEB` | 25% sobre venda de obra na web | `10` |
| `TAKE_RATE_APP` | 30% sobre venda de obra dentro do app | `10` |
| `TAKE_RATE_GORJETA` | 10% sobre gorjeta | `07`, `10` |
| `RECOMPENSA_DESAFIO_SEMANAL` | 40 moedas + 1 semente | `04` |
| `SEMENTE_DIAS_BROTAR` | 3 dias cumpridos para brotar | `04` |
| `CLUBE_MAX_MEMBROS` | 50 membros por clube | `12` |
| `FEED_LIMITE_SUGESTAO` | 15 min contínuos de feed antes do cartão de foco | `05` |
| `K_ANONIMATO` | 5 leitores distintos para exibir qualquer agregado ao autor | `09` |
| `DIAS_SEM_ESCREVER` | 5 dias para oferecer o sprint de aquecimento | `09` |
| `PAUSA_GRACA_SEGUNDOS` | 3 s: sinal transitório abaixo disso não vira pausa nem quebra bloco de foco | `telemetria` |
| `BATIMENTO_INTERVALO_SEGUNDOS` | 30 s de tempo ativo entre batimentos de sessão | `telemetria` |
| `SESSAO_ORFA_TIMEOUT_MINUTOS` | 35 min sem batimento: o servidor encerra a sessão no último batimento conhecido | `telemetria` |
| `RETOMADA_RAPIDA_SEGUNDOS` | 300 s: fronteira entre interrupção e pausa longa | `telemetria` |
| `JANELA_TETO_FISICO_SEGUNDOS` | 60 s: janela de aplicação do teto físico de ritmo | `telemetria` |
| `EVENTO_RETENCAO_LOCAL_DIAS` | 7 dias de traço bruto de eventos no dispositivo | `telemetria` |
| `CARACTERES_POR_PALAVRA` | 6: divisor único para converter caracteres em palavras | `telemetria` |
| `IDLE_TIMEOUT_TEXTO_DENSO_SEGUNDOS` | 180 s de idle para obra marcada como poesia ou texto denso | `telemetria` |

Toda constante `(a validar)` deve viver em configuração de servidor, não hardcoded no cliente — a calibração acontecerá com dados reais de uso.

---

## 3. Estados canônicos de tela

Vocabulário fixo usado na seção *Telas e estados* de cada módulo:

| Estado | Significado |
|---|---|
| **Vazio** | Sem dados ainda (primeiro uso). Sempre com convite à ação, nunca só "nada aqui". |
| **Carregando** | Aguardando dados. Usar *skeleton*, não *spinner* de tela cheia, em listas e dashboards. |
| **Erro** | Falha recuperável. Sempre com ação de retentativa e mensagem no tom da persona. |
| **Offline** | Sem conectividade. Declara explicitamente o que ainda funciona e o que sincroniza depois. |
| **Bloqueado por plano** | Recurso existe mas exige plano superior. Mostra o valor do recurso, nunca só a trava. |
