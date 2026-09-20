@echo off
setlocal EnableExtensions
title Cazador de Asteroides - iniciar
set "PROJ=%~dp0"
cd /d "%PROJ%backend"

REM ===== 1. Localizar Node.js (primera opcion que exista) =====
set "NODE="

set "NODE=%LOCALAPPDATA%\Temp\node-run\node.exe"
if not exist "%NODE%" set "NODE="

if not defined NODE (
  where node >nul 2>&1
  if not errorlevel 1 set "NODE=node"
)

if not defined NODE (
  if exist "%PROJ%tools\node\node.exe" set "NODE=%PROJ%tools\node\node.exe"
)

if not defined NODE (
  echo No se encontro Node.js.
  echo.
  echo Opciones:
  echo   1. Instalar Node 22.13 o superior desde https://nodejs.org
  echo   2. Copiar un node.exe en la carpeta tools\node del proyecto
  pause
  exit /b 1
)

REM ===== 2. Si el servidor ya esta activo, solo abrir =====
"%NODE%" -e "fetch('http://localhost:3000/api/scores').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))" >nul 2>&1
if not errorlevel 1 goto abrir

REM ===== 3. Arrancar el servidor en segundo plano =====
echo Levantando el servidor del juego...
"%NODE%" -e "const{spawn}=require('node:child_process');const fs=require('node:fs');const c=spawn(process.execPath,['server.js'],{cwd:process.argv[1],detached:true,stdio:'ignore'});fs.writeFileSync(process.argv[2],String(c.pid));c.unref();" "%PROJ%backend" "%PROJ%backend\server.pid"
if errorlevel 1 (
  echo No se pudo lanzar el servidor.
  pause
  exit /b 1
)

REM ===== 4. Esperar a que el servidor responda (max 30 seg) =====
for /l %%i in (1,1,30) do (
  "%NODE%" -e "fetch('http://localhost:3000/api/scores').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))" >nul 2>&1
  if not errorlevel 1 goto abrir
  timeout /t 1 /nobreak >nul
)

echo El servidor no respondio en 30 segundos.
echo Comprueba que ninguna aplicacion use el puerto 3000 y vuelve a intentarlo.
pause
exit /b 1

:abrir
if defined NO_BROWSER (
  echo Servidor listo en http://localhost:3000
  exit /b 0
)
start "" "http://localhost:3000"
echo.
echo Juego abierto en tu navegador.
echo Para detener el servidor usa DetenerPartida.cmd
exit /b 0
