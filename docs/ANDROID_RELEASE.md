# Nanhaa Android release

## Architecture decision
The web build (`vite build`) produces `dist/client` (assets only, **no index.html**) plus `dist/server` (SSR + server functions). Pages and checkout need the server, so a fully bundled offline app is not possible.

| Option | Pros | Cons |
|---|---|---|
| Bundled web app | Works offline | Impossible here: no static index.html, server functions need the server |
| Trusted Web Activity | Google's recommended wrapper for websites, Chrome engine | Needs `/.well-known/assetlinks.json` with the Play signing SHA-256 (only known after Play App Signing) and a live domain |
| **Capacitor + server.url (chosen)** | Reproducible project in repo, SSR and server functions keep working, local offline page | WebView wrapper; app is only as good as the website (Play "minimum functionality" review risk is low because the store is fully functional) |

`capacitor.config.json`: appId `store.nanhaa.app`, `webDir: android-shell` (offline fallback page), `server.url: https://nanhaa.store`, HTTPS only, navigation limited to nanhaa.store, WebView debugging off.

## Generated settings (verified in repo)
- `android/app/build.gradle`: applicationId `store.nanhaa.app`, versionCode 1
- `android/variables.gradle`: compileSdk 36, targetSdk 36, minSdk 24
- Manifest permissions: `INTERNET` only
- Release signing reads `android/keystore.properties` (gitignored); template `android/keystore.properties.example`

## Build on Windows (PowerShell)
```powershell
git pull
npm install
npx cap sync android
npx cap open android
```
Create an upload key once (keep it outside the repo):
```powershell
keytool -genkeypair -v -keystore C:\keys\nanhaa-upload.jks -alias nanhaa -keyalg RSA -keysize 2048 -validity 10000
Copy-Item android\keystore.properties.example android\keystore.properties
```
Edit `android\keystore.properties` with real passwords, then:
```powershell
cd android
.\gradlew.bat bundleRelease
```
Output: `android\app\build\outputs\bundle\release\app-release.aab`. Enrol in Play App Signing.

Status: **no AAB has been built in this workspace** (no Android SDK/JDK). The app only works once https://nanhaa.store is published and live.
