@echo off
setlocal
cd /d "%~dp0"
if not exist "node_modules\vinext\dist\cli.js" (
  echo Installing SwatchRoom dependencies. This may take several minutes.
  call npm install --include=dev --include=optional --no-audit --no-fund --cache .sites-runtime\npm-cache --prefer-offline
  if errorlevel 1 (
    echo Setup failed. Please keep this window open and share the final error.
    pause
    exit /b 1
  )
)
echo Starting the studio. Open the Local address printed below.
node scripts\run-framework.mjs dev
if errorlevel 1 echo The server did not start. Please share the error above.
pause
