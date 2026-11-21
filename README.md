# Gestion Académique — projet Capacitor (Android)

## Option A — Compiler sans Android Studio (GitHub Actions)

1. Créez un compte gratuit sur github.com, puis un nouveau dépôt (New repository).
2. Envoyez-y tout le contenu de ce dossier, y compris le dossier caché `.github`.
   Avec Git :
     git init
     git add .
     git commit -m "Premier envoi"
     git branch -M main
     git remote add origin https://github.com/VOTRE-NOM/VOTRE-DEPOT.git
     git push -u origin main
   Si vous utilisez l'envoi par glisser-déposer sur le site, vérifiez que
   `.github/workflows/build-apk.yml` est bien présent. Sinon, créez-le avec
   Add file → Create new file, en tapant ce chemin comme nom, puis collez son contenu.
3. Ouvrez l'onglet Actions du dépôt. Le workflow « Build APK Android » démarre seul
   (comptez 5 à 10 minutes). Vous pouvez aussi le lancer à la main avec Run workflow.
4. Quand il est vert, cliquez sur l'exécution, puis téléchargez « gestion-academique-apk »
   dans la section Artifacts. Dézippez : vous obtenez app-debug.apk.
5. Copiez l'APK sur le téléphone Android et ouvrez-le. Autorisez l'installation depuis
   une source inconnue si Android le demande.

## Option B — Compiler avec Android Studio

## Prérequis (sur votre ordinateur)
- Node.js 18 ou plus récent
- Android Studio (inclut le SDK Android et le JDK)

## Générer l'APK

1. Installer les dépendances :
   npm install

2. Construire le site et créer le projet Android (première fois seulement) :
   npm run build
   npx cap add android

3. Synchroniser puis ouvrir dans Android Studio :
   npm run android:sync
   npm run android:open

4. Dans Android Studio : menu Build → Build Bundle(s) / APK(s) → Build APK(s).
   L'APK se trouve dans android/app/build/outputs/apk/debug/app-debug.apk

   Pour installer directement sur un téléphone en mode développeur :
   cliquer sur Run (le triangle vert).

## Après chaque modification du code
   npm run android:sync

## Tester dans le navigateur
   npm run dev

## Notes
- Les polices (Fraunces, Inter, IBM Plex Mono) se chargent depuis Google Fonts.
  Sans connexion, l'app utilise des polices de secours. Pour un usage 100 % hors ligne,
  installez-les en local avec @fontsource.
- Les données sont en mémoire : elles sont réinitialisées à chaque ouverture de l'app.
  La prochaine étape logique est d'ajouter un stockage persistant (SQLite ou une API).
- Pour changer le nom ou l'identifiant de l'app : capacitor.config.json
- Pour une version à publier sur le Play Store : Build → Generate Signed Bundle / APK.
