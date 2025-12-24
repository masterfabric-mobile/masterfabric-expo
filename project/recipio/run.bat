@echo off
REM Recipio Test Script (Windows)
REM Simple script to test Recipio app

echo.
echo 🚀 Recipio Test Script
echo.

REM Navigate to script directory
cd /d "%~dp0"

echo 📁 Directory: %CD%
echo.

REM Check Node.js
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js not found! Please install Node.js.
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js: %NODE_VERSION%

REM Check npm
where npm >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm not found! Please install npm.
    exit /b 1
)

for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo ✅ npm: %NPM_VERSION%

REM Check npx
where npx >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npx not found! It should be installed with npm.
    exit /b 1
)

echo ✅ Expo CLI available
echo.

REM Check node_modules
if not exist "node_modules" (
    echo 📦 node_modules not found, installing dependencies...
    call npm install
    echo.
) else (
    echo ✅ node_modules exists
    echo.
)

REM Check package.json
if not exist "package.json" (
    echo ❌ package.json not found!
    exit /b 1
)

REM Check App.tsx
if not exist "App.tsx" (
    echo ❌ App.tsx not found!
    exit /b 1
)

echo ✅ All files exist
echo.

REM Clean cache
echo 🧹 Cleaning cache...
if exist .expo (
    echo   - Removing .expo folder...
    rmdir /s /q .expo
)
if exist node_modules\.cache (
    echo   - Removing node_modules\.cache folder...
    rmdir /s /q node_modules\.cache
)
echo ✅ Cache cleaned!
echo.

echo 🎯 Starting Expo...
echo    Press 'i' for iOS
echo    Press 'a' for Android
echo    Press 'w' for Web
echo    Scan QR code with Expo Go app
echo.

REM Start Expo (with cache clear)
call npx expo start --clear
