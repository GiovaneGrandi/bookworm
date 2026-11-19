#!/usr/bin/env bash
# Abre o BookWorm no emulador: liga o AVD, espera o Android, sobe o Metro e abre o app.
# Uso:  ./testar-no-emulador.sh          abre o app já instalado
#       ./testar-no-emulador.sh build    recompila e reinstala (depois de mudar código nativo,
#                                        um plugin, o app.json ou um patch)
# É o par do testar-no-emulador.bat, para macOS (e Linux).
set -euo pipefail

RAIZ="$(cd "$(dirname "$0")" && pwd)"
AVD="BookWorm_API34"
PACOTE="com.bookworm.app"
export ANDROID_HOME="${ANDROID_HOME:-$HOME/Library/Android/sdk}"
export PATH="$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$PATH"

command -v adb >/dev/null || { echo "[x] adb não encontrado em $ANDROID_HOME."; exit 1; }

# 1. Emulador. -no-snapshot: boot a frio, e o que for instalado ou gravado fica.
if [ "$(adb get-state 2>/dev/null || true)" = "device" ]; then
  echo "[1/4] Emulador já ligado."
else
  echo "[1/4] Ligando o emulador $AVD..."
  nohup emulator -avd "$AVD" -no-boot-anim -no-snapshot >/dev/null 2>&1 &
fi
adb wait-for-device

echo "[2/4] Esperando o Android terminar de iniciar..."
until [ "$(adb shell getprop sys.boot_completed 2>/dev/null | tr -d '\r')" = "1" ]; do sleep 2; done
adb reverse tcp:8081 tcp:8081 >/dev/null

cd "$RAIZ/apps/app"

# 3. Recompilar, se pedido ou se o app ainda não estiver instalado.
if [ "${1:-}" = "build" ] || ! adb shell pm list packages "$PACOTE" | grep -q "$PACOTE"; then
  echo "[3/4] Compilando e instalando o app. A primeira vez leva alguns minutos..."
  # expo run:android compila, instala, sobe o Metro neste terminal e abre o app.
  exec npx expo run:android
fi

# 4. Abre o app assim que o Metro responder; o Metro fica neste terminal (r recarrega).
(
  until curl -s http://localhost:8081/status 2>/dev/null | grep -q "packager-status:running"; do
    sleep 2
  done
  echo "[4/4] Abrindo o BookWorm..."
  adb shell am force-stop "$PACOTE"
  adb shell am start -n "$PACOTE/.MainActivity" >/dev/null
) &

if curl -s http://localhost:8081/status 2>/dev/null | grep -q "packager-status:running"; then
  echo "[3/4] Metro já está rodando."
  wait
else
  echo "[3/4] Subindo o Metro. Tecle r aqui para recarregar o app; Ctrl+C desliga."
  exec npx expo start --port 8081
fi
