@echo off
setlocal EnableExtensions
title Cazador de Asteroides - detener
set "PROJ=%~dp0"
set "PID="
if exist "%PROJ%backend\server.pid" (
  set /p PID=<"%PROJ%backend\server.pid"
  del "%PROJ%backend\server.pid" >nul 2>&1
)
if defined PID (
  taskkill /F /PID %PID% >nul 2>&1
  if errorlevel 1 (
    echo El proceso ya no estaba activo.
  ) else (
    echo Servidor detenido correctamente.
  )
) else (
  echo No se encontro el archivo del proceso del servidor.
  echo Es posible que el servidor no estuviera iniciado con ComenzarPartida.cmd.
)
pause
