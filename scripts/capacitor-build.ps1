# ==============================================================================
# COMPILADOR NATIVO CAPACITOR (ANDROID APK/AAB + iOS XCODE) — pracTICAtecnica
# Ejecutar cuando desee empaquetar las apps nativas desde C:\pt26xd011409
# ==============================================================================
Set-Location C:\pt26xd011409
Write-Host "[1/4] Instalando Capacitor Core, CLI y plugins nativos..." -ForegroundColor Cyan
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios @capacitor/push-notifications @capacitor/local-notifications @capacitor/camera @capacitor/haptics @capacitor/share @capacitor/status-bar
Write-Host "[2/4] Compilando frontend web dist/..." -ForegroundColor Cyan
npm run build
if (-not (Test-Path "android")) { npx cap add android }
if (-not (Test-Path "ios")) { npx cap add ios }
Write-Host "[3/4] Sincronizando dist/ con Android e iOS..." -ForegroundColor Cyan
npx cap sync
Write-Host "[4/4] Listo. Ejecute 'npx cap open android' (Android Studio) o 'npx cap open ios' (macOS Xcode)." -ForegroundColor Green