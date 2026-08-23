# Acervo inicial de domínio público

> Estágio 7 do plano (`planos/2026-08-23-primeiro-prototipo-mvp.md`), passo 2. Cinco obras
> embarcadas no app (`apps/app/assets/acervo/`), todas de domínio público nos EUA e no Brasil
> (autores falecidos há mais de 70 anos), baixadas do Project Gutenberg no formato
> `epub3.images` (`https://www.gutenberg.org/ebooks/<id>.epub3.images`). Todas verificadas
> contra `montarIndiceEpub` (`packages/core`, Estágio 2) antes de entrar no repositório —
> nenhuma quebra o parser.

| Arquivo | Obra | Autor | Gutenberg # | Caracteres (índice) |
|---|---|---|---|---|
| `alice.epub` | Alice's Adventures in Wonderland | Lewis Carroll | 11 | 165.483 |
| `christmas-carol.epub` | A Christmas Carol | Charles Dickens | 46 | 206.537 |
| `jekyll-hyde.epub` | The Strange Case of Dr Jekyll and Mr Hyde | Robert Louis Stevenson | 43 | 159.867 |
| `yellow-wallpaper.epub` | The Yellow Wallpaper | Charlotte Perkins Gilman | 1952 | 51.262 |
| `flatland.epub` | Flatland: A Romance of Many Dimensions | Edwin A. Abbott | 201 | 214.950 |

Todas em inglês — o acervo em português fica para uma rodada futura (depende de curadoria de
obras de domínio público em PT-BR, um trabalho de sourcing separado deste estágio).

## Candidatas ao passo 1 do onboarding (`Q-01.3`, `RN-01.5b`) — proposta, não decisão

`RN-01.5b` pede uma obra "leve, curta, abertura envolvente, neutra em gênero" para o primeiro
livro que a pessoa lê no onboarding, e a spec manda testar candidatas com usuários antes de
decidir. Três propostas, a partir do acervo acima:

1. **The Yellow Wallpaper** — a mais curta (51 mil caracteres, ~15-20 min de leitura), conto
   único sem divisão de capítulos. Abertura em primeira pessoa, imediatamente envolvente.
   Ressalva: tema é intenso (saúde mental) — pode não ler como "leve" dependendo de como o termo
   for interpretado no teste.
2. **Alice's Adventures in Wonderland** — clássico universalmente reconhecível, abertura
   whimsical e de baixo risco emocional, mas é o mais longo do grupo curto (165 mil caracteres).
3. **Flatland** — abertura curiosa (um narrador bidimensional explicando seu mundo), neutra em
   gênero por natureza (não é ficção de personagens), tom leve/satírico nos capítulos iniciais.

Nenhuma foi escolhida — a decisão fica para o teste com usuários que `RN-01.5b` pede, quando o
Estágio 1 (Contas/Onboarding) do plano do produto for construído.

## O que falta

- Acervo em português — não coberto nesta rodada.
- Metadados de capa/sinopse: hoje o título vem só do nome do arquivo (mesma limitação da
  importação de usuário, `apps/app/src/importacao/importarObra.ts`); a leitura de metadados reais
  do OPF (título, autor, capa) do EPUB é trabalho pendente que beneficia importação e acervo
  igualmente.
- Fluxo de "adicionar à biblioteca em um toque" (`RN-02.3`) para estas obras — depende de UI de
  Catálogo ainda não construída nesta rodada de Estágio 7 (fundação).
