# Modelo de Dados Conceitual

Consolidação das entidades declaradas nos módulos. Nível **conceitual**: nomes, relacionamentos e propósito. Não é schema de banco — não há tipos de coluna, índices, chaves estrangeiras nem decisão de tecnologia de persistência. Essas escolhas pertencem à fase de implementação.

A spec de cada módulo é a fonte de verdade sobre os campos; este documento existe para mostrar como as peças se encaixam.

---

## 1. Mapa de domínios

```
IDENTIDADE            CONTEÚDO              LEITURA
Usuario               Obra                  SessaoLeitura
Perfil                Capitulo              ProgressoLeitura
PreferenciasPrivac.   VersaoObra            Destaque
PreferenciasNotif.    Pilula                Anotacao
PreferenciasLeitura   RestricaoCitacao      ConsultaDicionario
PerfilAutor           ConsentimentoIAObra   Marcador
DadosFiscaisAutor                           Resenha
                                            ItemBiblioteca

COLEÇÃO               GAMIFICAÇÃO           ECONOMIA
ItemEstante           MetaDiaria            Carteira
CitacaoColecao        Ofensiva              LancamentoLedger
Conjunto              DiaOfensiva           Gorjeta
ProgressoConjunto     Congelamento          CarteiraAutor
                      MarcoConquistado      CatalogoGatilho
SOCIAL                DesafioSemanal        CatalogoItem
Dupla                 CatalogoDesafio
PreferenciaDupla      Semente               MONETIZAÇÃO
Clube                 ItemJardim            Plano
MembroClube           JardimUsuario         Assinatura
ProgressoClube        Baseline              EventoAssinatura
MensagemDiscussao     DesafioGhost          Compra
Presente                                    RepasseAutor
                      AGREGADOS             SolicitacaoSaque
COMPARTILHAMENTO      AgregadoDiario        InventarioDestaque
TemaCard              AgregadoPorObra       DestaqueVitrine
TemaDesbloqueado      AgregadoPorAutorLido  LicencaInstitucional
PreferenciasCard      AgregadoObraDia
CardGerado            EvasaoObra            CRIAÇÃO E AUTOR
                      EngajamentoTrecho     SprintEscrita
FEED                                        QuestEscrita
InteracaoPilula       IA                    RecordeEscrita
ComentarioPilula      ResumoCapitulo        MarcoManuscrito
Seguidor              FichaPersonagem       CampanhaARC
SessaoFeed            ExplicacaoContextual  ParticipacaoARC
SupressaoFeed         ConversaObra          Lancamento
                      MensagemConversa      AnaliseIAAudiencia
                      ConsumoIA
                      AvaliacaoResposta

MODERAÇÃO E CURADORIA
PoliticaConteudo          Denuncia
ClassificacaoObra         Apelacao
NivelConfiancaAutor       SancaoAutor
SubmissaoRevisao          PreferenciaConteudoLeitor
DecisaoModeracao          BloqueioAutor
```

---

## 2. Relacionamentos centrais

```
Usuario 1──1 Perfil
Usuario 1──1 Carteira ──* LancamentoLedger
Usuario 1──0..1 PerfilAutor ──* Obra
Usuario 1──* ItemBiblioteca *──1 Obra
Usuario 1──* SessaoLeitura *──1 Obra
Usuario 1──2 Ofensiva (eixo leitura, eixo escrita)
Usuario 1──1 JardimUsuario ──* ItemJardim

Obra 1──* Capitulo
Obra 1──* VersaoObra
Obra 1──* Pilula
Obra 1──1 RestricaoCitacao
Obra 1──1 ConsentimentoIAObra

SessaoLeitura 1──* Destaque
SessaoLeitura 1──* Anotacao
SessaoLeitura 1──* ConsultaDicionario
SessaoLeitura *──1 AgregadoDiario (por usuário e data)

AgregadoDiario 1──1 DiaOfensiva (por eixo)
DiaOfensiva 0..1──1 Congelamento

Gorjeta *──1 Usuario (leitor)  |  *──1 PerfilAutor  |  *──1 Obra  |  *──0..1 Capitulo
Compra *──1 Usuario  |  *──1 Obra  ──1 RepasseAutor

Usuario 1──* ItemEstante *──1 Obra          (só obras concluídas)
Usuario 1──* ProgressoConjunto *──1 Conjunto
Usuario 1──* Semente ──0..1 ItemJardim      (revelado ao brotar)
Usuario 1──* MembroClube *──1 Clube ──1 Obra
Dupla ──2 Usuario ──1 Obra
CampanhaARC 1──* ParticipacaoARC *──1 Usuario
```

---

## 3. Cadeias de dependência que importam

Três cadeias sustentam o produto inteiro. Quebrar qualquer elo invalida tudo o que vem depois.

**Cadeia da métrica** — de onde vem todo número exibido:

```
Destaque/Anotacao/ConsultaDicionario
        ↓
   SessaoLeitura (tempo ativo, volume, Leitura Consciente, status)
        ↓
   AgregadoDiario ──→ DiaOfensiva ──→ Ofensiva ──→ JardimUsuario
        ↓                   ↓
   Baseline           MarcoConquistado
        ↓                   ↓
   DesafioGhost       LancamentoLedger (recompensa)
```

Regra decorrente (`RN-03.32`): agregados são **recalculáveis** a partir de `SessaoLeitura`. Nenhum contador incremental sem lastro, porque descarte de sessão (`RN-03.29`) e sincronização offline retroativa (`RN-03.16`) exigem recomputar o passado.

**Cadeia financeira** — de onde vem cada centavo. Note que ela é **inteiramente em dinheiro**: a Semente não participa dela em nenhum ponto.

```
Compra (dinheiro) ──→ RepasseAutor ──┐
                                     ├──→ CarteiraAutor(credito_autor) ──→ SolicitacaoSaque
Gorjeta (dinheiro) ──────────────────┘                  ↓
                                              DestaqueVitrine / Assinatura

Semente (ganha) ──→ cosmético e boost          [circuito fechado, nunca cruza para o dinheiro]
```

Regras decorrentes:
- `RN-07.1c` — moeda ganha **nunca** sai do sistema. Convertê-la em dinheiro criaria passivo sem lastro, que cresceria conforme o produto engajasse.
- `RN-07.16` — o autor tem um único saldo, sempre sacável, porque toda entrada é lastreada por um pagamento real.
- `RN-07.28` — `LancamentoLedger` é append-only e é a única verdade sobre o saldo de Sementes. `Carteira` e `CarteiraAutor` são projeções materializadas e sempre perdem para o ledger em caso de divergência.

**Cadeia do autor** — do texto ao insight:

```
Obra ──→ Capitulo ──→ (leitura de muitos usuários)
                            ↓
        AgregadoObraDia | EvasaoObra | EngajamentoTrecho
                            ↓
                    Painel de analytics (k-anonimato ≥ 5)
```

Regra decorrente (`RN-09.14`): nenhum agregado exibido pode ser derivável até um leitor individual.

---

## 4. Chaves conceituais e invariantes

| Invariante | Onde é definido |
|---|---|
| Uma posição de leitura é sempre um **locator** (EPUB ou PDF), nunca uma página de tela | `RN-02.9` |
| Página canônica é unidade de exibição derivada de caracteres, global e imutável | `RN-03.2`, `RN-03.3` |
| Duas sessões do mesmo usuário nunca ocupam o mesmo intervalo de tempo | `RN-03.15` |
| Toda sessão pertence a exatamente um dia no fuso do usuário | `RN-03.6` |
| Ofensiva é derivada de `DiaOfensiva`, nunca um contador incrementado | `RN-04.11` |
| Toda obra publicada tem classificação de conteúdo; sem ela não existe publicação | `RN-13.7` |
| O filtro de conteúdo do leitor nunca alcança a busca explícita nem a biblioteca dele | `RN-13.24` |
| Denúncia é sinal, nunca veredito: nenhuma despublicação decorre só do volume | `RN-13.30`, `RN-13.31` |
| Toda decisão contra o autor é apelável uma vez, por revisor distinto | `RN-13.32` |
| Obra derivada nunca tem preço nem gera Crédito de Autor | `RN-13.18` |
| Existe uma única moeda, sempre ganha, que nunca vira dinheiro | `RN-07.1`, `RN-07.1c` |
| Todo movimento de moeda é idempotente por chave | `RN-07.31` |
| Recompensa em moeda exige sessão `valida`; meta e ofensiva aceitam também `curta` e `suspeita` | `RN-03.23`, `RN-04.10` |
| Conquista já celebrada nunca é revertida por invalidação posterior | `RN-04.10f` |
| Obra importada pelo usuário é privada e não alimenta analytics de ninguém | `RN-02.1d` |
| Semente nunca é comprável com dinheiro | `RN-04.42`, `RN-07.1` |
| Nenhum agregado de clube ou dupla ordena membros por desempenho | `RN-12.1` |
| Nenhuma entidade permite ordenar usuários por desempenho | `RN-06.8` |
| Contexto enviado à IA é truncado no locator corrente | `RN-11.1` |
| Licença de leitura sobrevive à despublicação da obra | `RN-02.4` |
| `LancamentoLedger` e registros fiscais sobrevivem à exclusão da conta, sem dados pessoais | `RN-01.18`, `RN-07.30` |

---

## 5. Retenção e ciclo de vida

| Categoria | Política | Origem |
|---|---|---|
| Ledger e registros fiscais | Permanente; sobrevive à exclusão de conta com dados pessoais desvinculados | `RN-07.30`, `RN-01.18` |
| Sessões de leitura | Permanente enquanto a conta existir — são a base de todo agregado recalculável | `RN-03.32` |
| Destaques, anotações, resenhas | Enquanto a conta existir; resenhas são anonimizadas na exclusão | `RN-01.18` |
| Conteúdo de obras adquiridas | Enquanto a conta existir, mesmo após despublicação | `RN-02.4` |
| Respostas de IA armazenadas | Enquanto a obra e a conta existirem; resumos compartilháveis dependem de `Q-11.2` | `RN-11.9`, `RN-11.33` |
| Dados de conta em exclusão | Carência de 30 dias, depois apagados | `RN-01.18` |
| Agregados de autor | Permanente, sempre sob k-anonimato | `RN-09.14` |
| Obras importadas pelo usuário | Enquanto a conta existir; apagadas na exclusão, nunca redistribuídas | `RN-02.1d` |
| Estante e coleção | Permanentes; só crescem | `RN-02.22a` |
| Dados de aluno sob licença institucional | Acesso da instituição cessa com o fim do vínculo; a conta pessoal permanece | `RN-10.30` |

---

## 6. Notas de implementação

Registradas porque decorrem das regras, não porque a arquitetura já esteja decidida:

- **Ledger append-only** com projeção de saldo é requisito, não preferência (`RN-07.28`).
- **Agregados recalculáveis** implicam guardar as sessões brutas indefinidamente e ter um processo de recomputação por usuário e período.
- **Job diário por fuso horário** avalia cumprimento de meta, consome congelamentos e atualiza ofensivas (`04` §9). Precisa ser idempotente: rodar duas vezes no mesmo dia não pode consumir dois congelamentos.
- **Reconciliação offline** exige que o cliente guarde sessões, destaques e anotações localmente com identificadores próprios estáveis, para que o reenvio não duplique registros (`RN-03.14`, `RN-07.31`).
- **k-anonimato** precisa ser aplicado na consulta de analytics, não apenas na exibição — caso contrário vaza pela API.
- **Truncamento por locator** para a IA deve ocorrer no servidor, na montagem da requisição. Nunca confiar no cliente para declarar até onde o leitor leu (`RN-11.2`).
