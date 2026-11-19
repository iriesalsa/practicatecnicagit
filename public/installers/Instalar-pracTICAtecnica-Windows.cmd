@echo off
title Instalador pracTICAtecnica.com (El Buhito)
set "URL=https://practicatecnica.com"
set "SHORTCUT=%USERPROFILE%\Desktop\pracTICAtecnica.lnk"
set "BROWSER="
if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" set "BROWSER=%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"
if "%BROWSER%"=="" if exist "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" set "BROWSER=%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"
if "%BROWSER%"=="" if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" set "BROWSER=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
if "%BROWSER%"=="" ( start "" "%URL%" & exit /b 0 )
powershell -NoProfile -ExecutionPolicy Bypass -Command "$ws=New-Object -ComObject WScript.Shell;$s=$ws.CreateShortcut('%SHORTCUT%');$s.TargetPath='%BROWSER%';$s.Arguments='--app=%URL%';$s.Save()"
start "" "%BROWSER%" --app=%URL%
exit /b 0