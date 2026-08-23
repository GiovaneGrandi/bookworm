// RN-TEL.6–RN-TEL.9 — os três relógios, papéis fixos. `Date.now` só para parede (calendário,
// nunca duração); `relogioMonotonicoComSuspensao` (módulo nativo `bookworm-relogio`) para toda
// duração — é o único que continua contando com o aparelho dormindo.
import { relogioMonotonicoComSuspensao } from '../../modules/bookworm-relogio/index.js';

export type Carimbo = { parede: number; mono: number };

export function carimboAgora(): Carimbo {
  return { parede: Date.now(), mono: relogioMonotonicoComSuspensao() };
}
