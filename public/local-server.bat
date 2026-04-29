@echo off
cd /d "%~dp0"
echo Starting HTTP server from: %CD%
echo Server will be available at: http://localhost:8000
echo Opening browser in 3 seconds...
echo.
start "Python HTTP Server" cmd /k "python -m http.server 8000"
timeout /t 3 /nobreak >nul
start http://localhost:8000
echo Browser opened. Server is running in separate window.
timeout /t 1 /nobreak >nul