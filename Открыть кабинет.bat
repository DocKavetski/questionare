@echo off
cd /d "%~dp0"
if not exist node_modules (
  echo Installing...
  call npm install
)
echo Opening http://localhost:5173/questionare/
start "" cmd /c "npm run dev"
timeout /t 2 >nul
start "" "http://localhost:5173/questionare/"
