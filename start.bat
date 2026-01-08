@echo off
echo Starting Diner Backend and Frontend...
echo.

REM Start Backend in new window
start "Backend Server" cmd /k "cd /d %~dp0diner-backend && npm run dev"

REM Wait 2 seconds
timeout /t 2 /nobreak > nul

REM Start Frontend in new window
start "Frontend Server" cmd /k "cd /d %~dp0diner-frontend && npm run dev"

echo.
echo Both servers are starting in separate windows!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
pause
