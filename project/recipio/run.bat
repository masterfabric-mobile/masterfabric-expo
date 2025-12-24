@echo off
REM Recipio Test Script (Windows)
REM Bu script Recipio uygulamasını test etmek için kullanılır

echo.
echo 🚀 Recipio Test Script
echo.

REM Script'in bulunduğu dizine git
cd /d "%~dp0"

echo 📁 Dizin: %CD%
echo.

REM Node.js kontrolü
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js bulunamadı! Lütfen Node.js yükleyin.
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js: %NODE_VERSION%

REM npm kontrolü
where npm >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm bulunamadı! Lütfen npm yükleyin.
    exit /b 1
)

for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo ✅ npm: %NPM_VERSION%

REM npx kontrolü
where npx >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npx bulunamadı! Lütfen npm ile birlikte yüklenmiş olmalı.
    exit /b 1
)

echo ✅ Expo CLI mevcut
echo.

REM node_modules kontrolü
if not exist "node_modules" (
    echo 📦 node_modules bulunamadı, bağımlılıklar yükleniyor...
    call npm install
    echo.
) else (
    echo ✅ node_modules mevcut
    echo.
)

REM package.json kontrolü
if not exist "package.json" (
    echo ❌ package.json bulunamadı!
    exit /b 1
)

REM App.tsx kontrolü
if not exist "App.tsx" (
    echo ❌ App.tsx bulunamadı!
    exit /b 1
)

echo ✅ Tüm dosyalar mevcut
echo.

REM Cache temizle
echo 🧹 Cache temizleniyor...
if exist .expo (
    echo   - .expo klasörü siliniyor...
    rmdir /s /q .expo
)
if exist node_modules\.cache (
    echo   - node_modules\.cache klasörü siliniyor...
    rmdir /s /q node_modules\.cache
)
echo ✅ Cache temizlendi!
echo.

echo 🎯 Expo başlatılıyor...
echo    iOS için: 'i' tuşuna basın
echo    Android için: 'a' tuşuna basın
echo    Web için: 'w' tuşuna basın
echo    QR kod ile: Expo Go uygulaması ile tarayın
echo.

REM Expo'yu başlat (cache temizleyerek)
call npx expo start --clear

