# Retomada — estado da operação em curso

> Arquivo operacional, lido no início de uma sessão nova antes de qualquer outra coisa.
> Regras de uso em `CLAUDE.md` §Retomada barata. Só entra aqui o que **não** é re-derivável
> por grep no repositório. Operação fechada, seção apagada. Não replicar no vault.

**Atualizado em:** 22/08/2026

---

## Medições já feitas — não repetir (custam ~230KB de releitura)

Do levantamento do design system, sobre as três peças de mockup:

| Achado | Número |
|---|---|
| Classes nas 3 ilhas, reuso zero entre si | `tp-` 133 · `p-` 140 · `mw-` 128 |
| `box-shadow` distintos / usos | 51 / 60 |
| Valores de espaçamento distintos | 49 (todo inteiro de 1 a 20 em uso) |
| `rotate` distintos / usos | 54 / 86 |
| Tinta fraca usada como cor de texto | 60 usos |

**Contrastes WCAG medidos** (calculados, não estimados): papel 13,68 tinta / 6,40 acento ·
sépia 9,16 / 5,30 · **kraft 7,08 / 2,66 ← único acento que reprova (`Q-DS.1`)** · vegetal
12,92 / 6,04 · carvão 12,08 / 9,49 · cianótipo 9,41 / 9,41 · mesa 11,75 / 9,23.
Alfas sobre papel: `tinta-70` 5,89 (AA corpo) · `tinta-50` 3,27 (só texto grande) ·
`tinta-32` 2,04 e `tinta-16` 1,36 (decorativo apenas). Os 4 pigmentos de grifo passam AA
(5,71 a 8,19:1). Os oito `--sup-tinta-fraca` do catálogo passam AA (4,55 a 7,53:1);
aba inativa 4,99:1.

---

## Artefatos publicados — URLs

Prefixo `https://claude.ai/code/artifact/`.

| Peça | Arquivo | UUID |
|---|---|---|
| **Design system (catálogo)** | `mockups/design-system.html` | `3e2ebd2b-9420-4a3f-9c82-a166a9dd67aa` |
| Tipografia A — adotada | `mockups/tipografia-quatro-vozes.html` | `2abc8814-2d01-425f-8441-776841b1d7c5` |
| Tipografia B — descartada | `mockups/tipografia-duas-vozes.html` | `ca59f313-48b1-4b0f-9ba9-357e7e31cbb0` |
| Tipografia C — descartada | `mockups/tipografia-uma-voz.html` | `77c37f32-3edc-4d3d-ad8f-d1700b95b6de` |
| Telas Papel | `mockups/telas-papel.html` | `2a147217-2816-427d-b25f-a27cb6653f63` |
| Telas Noturno (descartada) | `mockups/telas-noturno.html` | `0ee8e368-e1af-47a0-ad33-f69cf0d5e3c9` |
| Widgets de story | `mockups/widgets-story.html` | `b987d745-9b03-4822-9c0e-ffd6d259fb1c` |

Local e publicado estão idênticos em todas as sete. Republicar de sessão nova cobra uma
leitura do fonte vivo (~20k tokens/arquivo) — só pagar isso se houver edição real a fazer.

---

## Pendências abertas fora da operação em curso

- `AJ-13` (migrar as três peças ao catálogo, absorve `AJ-11`) e `AJ-14` (verificar o Anexo A em
  app RN e produzir o PNG do grão) — **`AJ-14` é o mesmo app de prova que fecha `Q-ST.1`,
  `Q-ST.2` e `Q-ST.5`.** As duas rodadas se pagam juntas.
- `AJ-11` e `AJ-12` seguem **não pedidos** — não começar sem o usuário pedir.
- `Q-DV.7` a `Q-DV.10`, `AJ-1` a `AJ-10` seguem como estavam.
