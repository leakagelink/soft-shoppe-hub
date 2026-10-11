# Nanhaa Android release (Capacitor, PowerShell)

Approach: Capacitor shell loading the live HTTPS site https://nanhaa.store (the app is server-rendered, so it cannot be bundled offline). Config: `capacitor.config.json` (appId `store.nanhaa.app`).

```powershell
npm install
npm install @capacitor/core@^8 @capacitor/cli@^8 @capacitor/android@^8
npm run build
npx cap add android
npx cap sync android
npx cap open android
```

After `cap add android`, verify in `android/variables.gradle`: `compileSdkVersion = 36`, `targetSdkVersion = 36` (Capacitor 8 default). Set `versionCode`/`versionName` in `android/app/build.gradle`.

Permissions: keep only `android.permission.INTERNET` in `AndroidManifest.xml`. Do not add location, camera, contacts or storage.

Signing: Android Studio → Build → Generate Signed App Bundle → .aab. Store the keystore and passwords outside the repo (`*.jks`, `*.keystore`, `android/keystore.properties` are gitignored). Enrol in Play App Signing.

Status: NOT built or verified in this workspace (no Android SDK). No AAB has been produced.
