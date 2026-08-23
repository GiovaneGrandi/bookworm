package expo.modules.bookwormrelogio

import android.os.SystemClock
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

// RN-TEL.6, telemetria-e-instrumentacao.md §16 — o relógio monotônico com suspensão
// (`elapsedRealtime`) não é exposto pelo React Native, e `performance.now` congela com o
// processo suspenso. Este módulo devolve os dois relógios nativos que a apuração de sessão
// precisa: `elapsedRealtime` (continua contando com o aparelho dormindo — toda duração usa este)
// e `uptimeMillis` (congela durante o sono — a diferença entre os dois é quanto tempo o aparelho
// dormiu, sinal de diagnóstico). Funções síncronas: nenhuma das duas faz I/O, só lê um contador
// do kernel — uma Promise aqui só adicionaria latência sem necessidade.
class BookwormRelogioModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("BookwormRelogio")

    Function("elapsedRealtime") {
      SystemClock.elapsedRealtime().toDouble()
    }

    Function("uptimeMillis") {
      SystemClock.uptimeMillis().toDouble()
    }
  }
}
