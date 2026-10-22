@echo off
setlocal
cd /d "%~dp0"
echo Checking TypeScript...
node node_modules\typescript\bin\tsc --noEmit
if errorlevel 1 goto failed
echo Running mocked API checks. No live units used.
node scripts\test-api.mjs
if errorlevel 1 goto failed
node scripts\test-budget.mjs
if errorlevel 1 goto failed
echo Building the production application...
call npm run build
if errorlevel 1 goto failed
node scripts\check-release-output.mjs
if errorlevel 1 goto failed
echo Release checks passed. Keep this window open and tell Codex.
pause
exit /b 0
:failed
echo A release check failed. Keep this window open and share the final error.
pause
exit /b 1
