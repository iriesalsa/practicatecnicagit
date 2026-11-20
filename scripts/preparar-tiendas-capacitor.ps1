# ==============================================================================
# PREPARACIÓN CAPACITOR PARA GOOGLE PLAY STORE Y APPLE APP STORE (GASTO MÍNIMO)
# - Google Play Console: cuenta única de desarrollador (~$25 USD una sola vez)
# - Apple Developer Program: ~$99 USD/año (requiere Mac con Xcode para firmar/subir .ipa)
# ==============================================================================
param(
    [switch]$BundleWebOnly
)
$ErrorActionPreference = "Continue"
Set-Location "C:\pt26xd011409"

if ($BundleWebOnly) {
    $cfg = Get-Content "capacitor.config.json" -Raw | ConvertFrom-Json
    if ($cfg.server) { $cfg.PSObject.Properties.Remove("server") }
    ($cfg | ConvertTo-Json -Depth 10) | Set-Content "capacitor.config.json" -Encoding UTF8
    Write-Host "[Modo Bundle Local] server.url removido: la app empaquetará dist/ dentro del binario." -ForegroundColor Cyan
}

npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios @capacitor/camera @capacitor/haptics @capacitor/share @capacitor/status-bar --no-audit --no-fund
npm run build

if (-not (Test-Path "android")) { npx cap add android }
npx cap sync android

if (-not (Test-Path "ios")) {
    npx cap add ios
}
try { npx cap sync ios } catch { Write-Host "[Nota iOS] En Windows se crea la carpeta ios/; para compilar y subir a App Store ábrela en Mac con Xcode." -ForegroundColor Yellow }

Write-Host "[Listo] Android (AAB/APK en Android Studio: Build -> Generate Signed Bundle / APK) e iOS (abrir ios/App en Mac Xcode) preparados." -ForegroundColor Green