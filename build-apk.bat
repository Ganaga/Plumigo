@echo off
echo.
echo ========================================
echo   Plumigo - Generation APK Android
echo ========================================
echo.

:: Verifier que Node.js est installe
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERREUR: Node.js n'est pas installe.
    echo Telecharge-le sur https://nodejs.org
    pause
    exit /b 1
)

:: Verifier que bubblewrap est installe
where bubblewrap >nul 2>nul
if %errorlevel% neq 0 (
    echo Bubblewrap n'est pas installe. Installation en cours...
    call npm install -g @bubblewrap/cli
    if %errorlevel% neq 0 (
        echo ERREUR: Impossible d'installer Bubblewrap.
        pause
        exit /b 1
    )
)

:: Verifier si le projet TWA est deja initialise
if not exist "app" (
    echo.
    echo Initialisation du projet TWA...
    echo (Suivre les instructions a l'ecran)
    echo.
    call bubblewrap init --manifest="https://ganaga.github.io/Plumigo/manifest.json"
    if %errorlevel% neq 0 (
        echo ERREUR: L'initialisation a echoue.
        pause
        exit /b 1
    )
)

:: Build APK
echo.
echo Construction de l'APK...
echo.
call bubblewrap build
if %errorlevel% neq 0 (
    echo ERREUR: Le build a echoue.
    pause
    exit /b 1
)

:: Renommer en plumigo.apk / plumigo.aab
if exist "plumigo.apk" del "plumigo.apk"
if exist "plumigo.aab" del "plumigo.aab"
if exist "app-release-signed.apk" copy /Y "app-release-signed.apk" "plumigo.apk" >nul
if exist "app-release-bundle.aab" copy /Y "app-release-bundle.aab" "plumigo.aab" >nul

echo.
echo ========================================
echo   APK genere avec succes !
echo ========================================
echo.
echo Fichiers generes :
if exist "plumigo.apk" echo   - plumigo.apk (pour tester / installer sur un appareil)
if exist "plumigo.aab" echo   - plumigo.aab (pour le Play Store)
echo.
echo Pour obtenir le fingerprint SHA256 :
echo   keytool -printcert -jarfile plumigo.apk
echo.
echo N'oublie pas de mettre a jour le fingerprint dans :
echo   public/.well-known/assetlinks.json
echo.
pause
