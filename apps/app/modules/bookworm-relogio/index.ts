// Módulo nativo mínimo (RN-TEL.6, telemetria-e-instrumentacao.md §16) — os dois relógios
// monotônicos que o React Native não expõe. Ver `android/src/main/.../BookwormRelogioModule.kt`
// para o porquê de cada um.
import BookwormRelogio from './src/BookwormRelogioModule.js';

export function relogioMonotonicoComSuspensao(): number {
  return BookwormRelogio.elapsedRealtime();
}

export function relogioMonotonicoSemSuspensao(): number {
  return BookwormRelogio.uptimeMillis();
}
