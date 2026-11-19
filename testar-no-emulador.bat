@echo off
rem Abre o BookWorm no emulador: liga o AVD, espera o Android, sobe o Metro e abre o app.
rem Uso:  testar-no-emulador.bat           abre o app já instalado
rem       testar-no-emulador.bat build     recompila e reinstala (depois de mudar código nativo,
rem                                        um plugin, o app.json ou um patch)
chcp 65001 >nul
setlocal EnableDelayedExpansion

set "RAIZ=%~dp0"
set "AVD=BookWorm_API34"
set "PACOTE=com.bookworm.app"
if not defined ANDROID_HOME set "ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk"
set "PATH=%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\emulator;%PATH%"

where adb >nul 2>&1 || (echo [x] adb não encontrado em %ANDROID_HOME%. & goto :falhou)

rem 1. Emulador
adb get-state >nul 2>&1
if errorlevel 1 (
  echo [1/4] Ligando o emulador %AVD%...
  start "Emulador BookWorm" /min emulator -avd %AVD% -no-boot-anim -no-snapshot
) else (
  echo [1/4] Emulador já ligado.
)
adb wait-for-device

echo [2/4] Esperando o Android terminar de iniciar...
:esperar_boot
set "BOOT="
for /f "delims=" %%b in ('adb shell getprop sys.boot_completed 2^>nul') do set "BOOT=%%b"
if not "!BOOT!"=="1" (
  timeout /t 2 /nobreak >nul
  goto :esperar_boot
)
adb reverse tcp:8081 tcp:8081 >nul

rem 3. Recompilar, se pedido ou se o app ainda não estiver instalado
set "INSTALADO="
for /f "delims=" %%p in ('adb shell pm list packages %PACOTE% 2^>nul') do set "INSTALADO=1"
if /i "%~1"=="build" set "INSTALADO="
if not defined INSTALADO (
  echo [3/4] Compilando e instalando o app. A primeira vez leva alguns minutos...
  cd /d "%RAIZ%apps\app"
  rem expo run:android compila, instala, sobe o Metro nesta janela e abre o app.
  call npx expo run:android
  goto :fim
)

rem 3. Metro, numa janela própria (se já não estiver rodando)
netstat -ano | findstr /r /c:":8081 .*LISTENING" >nul
if errorlevel 1 (
  echo [3/4] Subindo o Metro numa janela separada...
  start "Metro BookWorm" /d "%RAIZ%apps\app" cmd /k npx expo start --port 8081
) else (
  echo [3/4] Metro já está rodando.
)

:esperar_metro
curl -s http://localhost:8081/status 2>nul | findstr /c:"packager-status:running" >nul
if errorlevel 1 (
  timeout /t 2 /nobreak >nul
  goto :esperar_metro
)

rem 4. App
echo [4/4] Abrindo o BookWorm...
adb shell am force-stop %PACOTE%
adb shell am start -n %PACOTE%/.MainActivity >nul
echo.
echo Pronto. O app carrega o código pelo Metro: na janela "Metro BookWorm", tecle r para
echo recarregar depois de mudar o código. Fechar aquela janela desliga o Metro.
goto :fim

:falhou
echo.
pause
exit /b 1

:fim
endlocal
timeout /t 5 >nul
