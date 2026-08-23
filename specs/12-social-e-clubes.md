# 12 — Social: Leitura em Dupla e Clubes

## 1. Objetivo

Colocar outra pessoa dentro do produto. A plataforma recusa o leaderboard (P1, `RN-06.8`) e, até aqui, não havia colocado nada no lugar: o único social era centrífugo — exportar um card para fora do app (`08`).

Ler é uma das atividades sociais mais antigas que existem. Este módulo traz o **pertencimento** — a metade do Core Drive 5 do Octalysis que o produto ainda não implementava — por meio de mecânicas **colaborativas**, jamais competitivas.

Módulo derivado da análise de game design (`B-14`, `M-04`).

## 2. Escopo

**Dentro:** leitura em dupla, clubes de leitura com meta coletiva, discussão por capítulo com trava de spoiler, presentear, e as regras que impedem qualquer classificação entre pessoas.

**Fora:** compartilhamento externo de cards → [`08-social-sharing.md`](08-social-sharing.md). Feed e comentários em pílulas → [`05-feed-pilulas.md`](05-feed-pilulas.md). Seguir autores → [`05`](05-feed-pilulas.md). Gorjeta e economia → [`07-economia-moedas.md`](07-economia-moedas.md).

## 3. Personas

Leitor (primária), Leitor-autor.

---

## 4. User stories

| ID | Story |
|---|---|
| `SOC-11` | Como leitor, quero ler o mesmo livro junto de um amigo para termos assunto e companhia. |
| `SOC-12` | Como leitor em dupla, quero ver os destaques do outro no texto, discretamente, para descobrir o que tocou a outra pessoa. |
| `SOC-13` | Como leitor, quero participar de um clube com uma meta que alcançamos juntos, sem competir com ninguém. |
| `SOC-14` | Como membro de clube, quero discutir capítulo a capítulo sem risco de spoiler de quem está mais adiante. |
| `SOC-15` | Como membro de clube, quero conversar com o grupo enquanto lemos. |
| `SOC-16` | Como leitor, quero presentear alguém com um livro ou moedas. |
| `SOC-17` | Como leitor, quero sair de uma dupla ou clube sem constrangimento nem penalidade. |

---

## 5. Regras de negócio

### 5.1 Princípio que governa o módulo

- `RN-12.1` **Nenhuma superfície deste módulo ordena, classifica, pontua comparativamente ou destaca membros por desempenho** (P1, `RN-06.8`). Não existe "quem leu mais" dentro de uma dupla ou clube, nem barra comparativa, nem selo de membro mais ativo. A tentação é óbvia e a resposta é não.
- `RN-12.2` O progresso coletivo é sempre exibido como **soma do grupo**, nunca como contribuição individual ranqueada. Um clube sobe junto ou não sobe.
- `RN-12.3` Toda participação é **opcional e reversível**. Sair de uma dupla ou clube nunca gera perda de ofensiva, moeda, coleção ou histórico, e nunca é comunicado ao grupo com linguagem de abandono (P2).

### 5.2 Leitura em dupla

A mecânica mais barata e a de maior efeito sobre retenção: a dupla é o menor grupo possível, não precisa de moderação e não depende de escala para funcionar.

- `RN-12.4` Uma **dupla** é formada por convite direto entre dois leitores, sobre **uma obra específica** que ambos possuem (ou que é gratuita/aberta).
- `RN-12.5` Cada um vê o progresso do outro na obra, em percentual e capítulo. O progresso é informativo, nunca comparativo: a interface não diz quem está à frente, não usa linguagem de corrida e não celebra ultrapassagem.
- `RN-12.6` **Destaques do parceiro no texto.** Os trechos que a outra pessoa grifou aparecem no texto de forma **esmaecida e discreta** — um detalhe percebido de relance, jamais uma marcação que compita com a leitura. Tocá-los revela quem grifou e a nota, se houver e se ela for compartilhada.
- `RN-12.7` A visibilidade dos destaques do parceiro é **limitada pela posição de quem lê**: nada é exibido além do ponto em que o próprio leitor está. Mesma barreira arquitetural de `RN-11.1` — o que não é enviado não pode vazar.
- `RN-12.8` Cada leitor escolhe se compartilha destaques com o parceiro, e pode marcar um destaque como privado individualmente. Anotações pessoais **nunca** são compartilhadas por padrão (`RN-08.32`).
- `RN-12.9` A dupla tem um espaço de conversa próprio, atrelado à obra, com as mesmas travas de spoiler de `RN-12.14`.
- `RN-12.10` A dupla não altera meta, ofensiva nem recompensa de nenhum dos dois. É companhia, não mecânica de progressão.

### 5.3 Clubes de leitura

- `RN-12.11` Um **clube** é um grupo de leitores com uma obra em comum e uma **meta coletiva** por período — por exemplo, "juntos, 40 capítulos este mês". A meta é do grupo; a contribuição individual não é exibida de forma ranqueada (`RN-12.2`).
- `RN-12.12` Clubes podem ser públicos (qualquer um entra) ou por convite. Todo clube tem um responsável, que define obra, meta e ritmo, e pode moderar (`RN-12.17`).
- `RN-12.13` Tamanho máximo de `CLUBE_MAX_MEMBROS` (50, a validar), para a discussão permanecer legível e a moderação, viável.
- `RN-12.14` **Discussão com trava de spoiler.** A conversa é organizada **por capítulo**, e cada membro só enxerga as discussões dos capítulos que já leu. A trava usa a posição de leitura (`RN-02.9`) e é aplicada no servidor, nunca só na interface.
- `RN-12.15` Ao avançar, o membro desbloqueia as discussões anteriores acumuladas — a conversa espera por ele. Isso resolve o problema real dos clubes: quem está atrasado hoje é excluído da conversa ou tem o livro estragado.
- `RN-12.16` Cumprir a meta coletiva concede a cada membro participante uma semente (`RN-04.40`) e um selo de clube. Não há recompensa proporcional à contribuição individual — isso reintroduziria competição por vias indiretas.
- `RN-12.17` Moderação: o responsável pode ocultar mensagens e remover membros; denúncias vão para a moderação da plataforma. Toda regra de conduta é a mesma de `RN-05.20`.
- `RN-12.18` Clube não altera meta diária nem ofensiva individual (`RN-12.10`).

### 5.4 Presentear

- `RN-12.19` Um leitor pode presentear outro com uma obra ou com moedas, com mensagem opcional.
- `RN-12.20` O presente é sempre **doação**, nunca troca ou dívida: não existe cobrança, retribuição sugerida nem contador de quem deu mais.
- `RN-12.21` Presente em moedas segue as regras de origem da economia (`07`) e nunca converte moeda ganha em valor sacável.
- `RN-12.22` Presentear uma obra é uma compra normal, com repasse ao autor idêntico ao de uma venda comum (`RN-10.6`).

---

## 6. Critérios de aceitação

**`SOC-12` + `RN-12.6` — Destaque do parceiro é detalhe, não interrupção**
```
Dado que estou em dupla e meu parceiro grifou um trecho da página atual
Quando leio essa página
Então o trecho aparece com marcação esmaecida e discreta
E ela não compete visualmente com o texto nem com meus próprios destaques
E ao tocá-la vejo quem grifou
```

**`RN-12.7` — Sem spoiler pela dupla**
```
Dado que estou no capítulo 4 e meu parceiro está no capítulo 12
Quando leio minha obra
Então nenhum destaque dele posterior à minha posição é exibido
E o servidor não envia esses destaques ao meu dispositivo
```

**`SOC-14` + `RN-12.14` — Trava de spoiler no clube**
```
Dado que sou membro de um clube e li até o capítulo 3
Quando abro a discussão do clube
Então vejo apenas as conversas dos capítulos 1 a 3
E as discussões dos capítulos seguintes não são exibidas nem carregadas
E ao terminar o capítulo 4 a discussão dele é desbloqueada com o histórico acumulado
```

**`RN-12.1` — Nenhuma classificação entre pessoas**
```
Dado que sou membro de um clube com 30 pessoas
Quando navego por todas as telas do clube
Então não encontro ranking, posição, percentual comparativo nem selo de membro mais ativo
E o progresso é sempre exibido como total do grupo
```

**`SOC-17` + `RN-12.3` — Sair sem custo**
```
Dado que participo de um clube e decido sair
Quando confirmo a saída
Então não perco ofensiva, moedas, coleção nem histórico de leitura
E o grupo não recebe mensagem que me atribua abandono
```

**`RN-12.16` — Recompensa coletiva, nunca proporcional**
```
Dado que meu clube cumpriu a meta coletiva do mês
E eu contribuí menos que a média do grupo
Quando a recompensa é distribuída
Então recebo a mesma semente e o mesmo selo que todos os outros membros
```

---

## 7. Telas e estados

| Tela | Conteúdo | Estados |
|---|---|---|
| **Minhas duplas** | Duplas ativas, obra, progresso dos dois, atalho para a conversa | Vazio (convite a formar a primeira), Carregando |
| **Convidar para dupla** | Busca de leitor, escolha da obra, mensagem | Erro (obra não possuída pelo convidado), Pendente |
| **Leitor em dupla** | O leitor imersivo normal, com destaques do parceiro esmaecidos (`RN-12.6`) | Igual ao leitor comum; a camada da dupla é desativável a qualquer momento |
| **Conversa da dupla** | Mensagens atreladas à obra, com trava de spoiler | Vazio, Offline (fila de envio) |
| **Descobrir clubes** | Clubes públicos por gênero e obra, com vagas e ritmo | Vazio, Carregando |
| **Clube** | Obra, meta coletiva e progresso do grupo, membros (sem ordenação), discussão por capítulo | Vazio (clube recém-criado), Meta cumprida |
| **Discussão por capítulo** | Conversa do capítulo, bloqueada além da posição do leitor | Bloqueado (capítulo não lido, com explicação), Vazio |
| **Presentear** | Escolha de obra ou valor em moedas, destinatário, mensagem | Bloqueado por saldo, Erro |

**Offline:** progresso da dupla e discussões já carregadas ficam legíveis; envio de mensagem e formação de dupla ou clube exigem conexão.

---

## 8. Dados

| Entidade | Campos principais | Propósito |
|---|---|---|
| `Dupla` | id, obra_id, leitor_a_id, leitor_b_id, status (convidada, ativa, encerrada), criada_em | Leitura acompanhada |
| `PreferenciaDupla` | dupla_id, usuario_id, compartilha_destaques, camada_visivel | Controle individual de exposição |
| `Clube` | id, nome, obra_id, responsavel_id, visibilidade (publico, convite), meta_tipo, meta_valor, periodo_inicio, periodo_fim, max_membros | Grupo com meta coletiva |
| `MembroClube` | clube_id, usuario_id, entrou_em, saiu_em, papel (membro, responsavel) | Participação |
| `ProgressoClube` | clube_id, periodo, realizado_total, meta_valor, cumprida_em | Sempre agregado, nunca individual (`RN-12.2`) |
| `MensagemDiscussao` | id, escopo (dupla, clube), escopo_id, capitulo_id, usuario_id, texto, status, criada_em | Conversa com trava de spoiler |
| `Presente` | id, remetente_id, destinatario_id, tipo (obra, moedas), referencia, mensagem, criado_em | Reciprocidade |

---

## 9. API (alto nível)

| Operação | Descrição |
|---|---|
| Convidar / aceitar / encerrar dupla | Ciclo de vida da dupla |
| Obter camada da dupla | Destaques do parceiro **truncados na posição do leitor** (`RN-12.7`) |
| Alternar compartilhamento de destaques | Controle individual |
| Criar / listar / entrar / sair de clube | Ciclo de vida do clube |
| Obter progresso do clube | Sempre agregado do grupo |
| Listar discussão por capítulo | Só capítulos já lidos pelo solicitante; a trava é do servidor |
| Publicar mensagem | Em dupla ou clube, atrelada a capítulo |
| Moderar mensagem / membro | Ações do responsável e denúncia |
| Presentear | Obra ou moedas, com repasse ao autor quando for obra |

---

## 10. Métricas de sucesso

- Retenção de leitores em dupla vs. leitores solitários — a hipótese central do módulo.
- Percentual de obras concluídas quando lidas em dupla vs. sozinho.
- Clubes que cumprem a meta coletiva.
- Mensagens por membro ativo e percentual de discussões desbloqueadas por avanço (`RN-12.15`).
- Taxa de denúncia e de moderação por 1.000 mensagens.
- **Ausência de qualquer pedido de ranking na pesquisa com usuários** — se muitos pedirem, é sinal de que a decisão P1 precisa ser reexaminada explicitamente, não contornada.

---

## 11. Questões em aberto

| ID | Questão |
|---|---|
| `Q-12.1` | A conversa é chat em tempo real ou mural assíncrono por capítulo? O mural é mais barato, mais fácil de moderar e combina melhor com leitura; o chat cria vínculo mais forte e expectativa de resposta imediata. Recomendação: **mural assíncrono no início**, chat só na dupla. |
| `Q-12.2` | Como duas pessoas viram amigas na plataforma? É preciso um grafo social (seguir, amizade, contatos) que hoje só existe para autores (`RN-05` `Seguidor`). |
| `Q-12.3` | Clube exige que todos possuam a obra? Se a obra for paga, o clube vira barreira de entrada — e também oportunidade de venda casada. |
| `Q-12.4` | Moderação de clubes públicos escala? Pode ser necessário limitar clubes públicos no lançamento e permitir apenas os por convite. |
| `Q-12.5` | A leitura em dupla deveria permitir ritmo combinado (metas conjuntas por capítulo)? Aumenta o vínculo, mas viola `RN-12.10` ao misturar social com progressão. |
