@echo off
setlocal enabledelayedexpansion
echo.
echo ========================================
echo   Plumigo - Generation assetlinks.json
echo ========================================
echo.

:: Utiliser le JDK installe par Bubblewrap
set "KEYTOOL=%USERPROFILE%\.bubblewrap\jdk\jdk-17.0.11+9\bin\keytool.exe"
if not exist "!KEYTOOL!" (
    set "KEYTOOL=%USERPROFILE%\.bubblewrap\jdk\jdk17u-jdk-17.0.11-9\bin\keytool.exe"
)
if not exist "!KEYTOOL!" (
    echo ERREUR: keytool introuvable dans le JDK Bubblewrap.
    echo Cherche dans : %USERPROFILE%\.bubblewrap\jdk\
    dir "%USERPROFILE%\.bubblewrap\jdk\" 2>nul
    pause
    exit /b 1
)
echo Keytool trouve : !KEYTOOL!
echo.

:: Verifier que le keystore existe
if not exist "android.keystore" (
    echo ERREUR: android.keystore introuvable.
    echo Lance d'abord build-apk.bat pour generer le keystore.
    pause
    exit /b 1
)

:: Lire le package_name depuis twa-manifest.json
for /f "tokens=2 delims=:," %%a in ('findstr /C:"\"packageId\"" twa-manifest.json') do (
    set "PACKAGE=%%a"
)
:: Nettoyer les guillemets et espaces
set "PACKAGE=!PACKAGE: =!"
set "PACKAGE=!PACKAGE:"=!"
echo Package detecte : !PACKAGE!
echo.

:: Demander le mot de passe
echo Entre le mot de passe de ton keystore :
set /p KSPASS="Mot de passe : "
echo.

:: Extraire le SHA256
echo Extraction du SHA256...
set "SHA256="
for /f "tokens=*" %%a in ('"!KEYTOOL!" -list -v -keystore android.keystore -alias android -storepass !KSPASS! 2^>nul ^| findstr /C:"SHA256:"') do (
    set "LINE=%%a"
    for /f "tokens=2" %%b in ("!LINE!") do set "SHA256=%%b"
)

if "!SHA256!"=="" (
    echo ERREUR: Impossible d'extraire le SHA256. Mot de passe incorrect ?
    pause
    exit /b 1
)

echo SHA256 trouve : !SHA256!
echo.

:: Generer le contenu assetlinks.json
set "ASSETLINKS_CONTENT=[{\"relation\": [\"delegate_permission/common.handle_all_urls\"],\"target\": {\"namespace\": \"android_app\",\"package_name\": \"!PACKAGE!\",\"sha256_cert_fingerprints\": [\"!SHA256!\"]}}]"

:: Mettre a jour public/.well-known/assetlinks.json (pour reference dans ce repo)
(
echo [{
echo   "relation": ["delegate_permission/common.handle_all_urls"],
echo   "target": {
echo     "namespace": "android_app",
echo     "package_name": "!PACKAGE!",
echo     "sha256_cert_fingerprints": ["!SHA256!"]
echo   }
echo }]
) > "public\.well-known\assetlinks.json"
echo Fichier mis a jour : public\.well-known\assetlinks.json

:: Cloner / mettre a jour le repo ganaga.github.io et y pousser le fichier
set "USERPAGE_DIR=%TEMP%\ganaga.github.io"
if exist "!USERPAGE_DIR!" (
    echo.
    echo Mise a jour du repo ganaga.github.io...
    cd /d "!USERPAGE_DIR!"
    git pull -q
) else (
    echo.
    echo Clone du repo ganaga.github.io...
    cd /d "%TEMP%"
    git clone -q https://github.com/Ganaga/ganaga.github.io.git
    cd /d "!USERPAGE_DIR!"
)

if not exist ".well-known" mkdir ".well-known"
(
echo [{
echo   "relation": ["delegate_permission/common.handle_all_urls"],
echo   "target": {
echo     "namespace": "android_app",
echo     "package_name": "!PACKAGE!",
echo     "sha256_cert_fingerprints": ["!SHA256!"]
echo   }
echo }]
) > ".well-known\assetlinks.json"

git add .well-known/assetlinks.json
git commit -m "Update assetlinks.json with SHA256 fingerprint" 2>nul
git push -q

cd /d "C:\dev\git\KidWriter"

echo.
echo ========================================
echo   Termine !
echo ========================================
echo.
echo Le fichier a ete pousse a :
echo   https://ganaga.github.io/.well-known/assetlinks.json
echo.
echo Verifie qu'il est accessible (peut prendre 1-2 minutes) :
echo   https://ganaga.github.io/.well-known/assetlinks.json
echo.
echo Puis re-installe l'APK : la barre d'URL devrait disparaitre.
echo.
pause
