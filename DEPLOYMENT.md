# 📱 BinMaster — Guide de Déploiement Mobile

## 🚀 Étape 1 : PWA (Progressive Web App) — DÉJÀ FAIT ✅

L'app est déjà une PWA ! Les étudiants peuvent l'installer directement depuis le navigateur :

### Android (Chrome)
1. Ouvrir BinMaster dans Chrome
2. Menu ⋮ → "Installer l'application" ou la bannière apparaît automatiquement
3. L'app apparaît sur l'écran d'accueil comme une vraie app

### iPhone (Safari)
1. Ouvrir BinMaster dans Safari
2. Bouton Partage ↗️ → "Sur l'écran d'accueil"
3. L'app apparaît sur l'écran d'accueil

### Avantages PWA
- ✅ Pas besoin de Play Store / App Store
- ✅ Mise à jour automatique
- ✅ Fonctionne hors ligne (service worker)
- ✅ Une seule codebase
- ✅ Déploiement instantané

---

## 🏪 Étape 2 : Play Store (Android) avec Capacitor

### Prérequis
- Un compte Google Play Developer ($25 une fois)
- Android Studio installé
- Java JDK 17+

### Étapes

```bash
# 1. Builder le site Next.js en statique
npm run build

# 2. Ajouter la plateforme Android
npx cap add android

# 3. Copier les fichiers web dans le projet Android
npx cap copy android

# 4. Synchroniser les plugins
npx cap sync android

# 5. Ouvrir dans Android Studio
npx cap open android
```

### Dans Android Studio
1. **Build → Generate Signed Bundle / APK**
2. Choisir **Android App Bundle** (pour Play Store)
3. Créer un keystore (garder le fichier safe !)
4. Remplir les infos de l'app
5. Build en mode **release**

### Sur le Google Play Console
1. Créer une app sur https://play.google.com/console
2. Remplir la fiche store :
   - Nom : **BinMaster**
   - Description courte : *Apprends le binaire facilement*
   - Description : *Application éducative pour maîtriser les conversions décimal ↔ binaire*
   - Catégorie : **Éducation**
   - Icônes : utiliser `/public/icons/icon-512.png`
3. Uploader l'AAB généré
4. Remplir les classifications de contenu
5. **Soumettre pour review** (1-3 jours)

---

## 🍎 Étape 3 : App Store (iOS) avec Capacitor

### Prérequis
- Un compte Apple Developer ($99/an)
- Un Mac avec Xcode installé
- CocoaPods installé (`sudo gem install cocoapods`)

### Étapes

```bash
# 1. Builder le site Next.js en statique
npm run build

# 2. Ajouter la plateforme iOS
npx cap add ios

# 3. Copier les fichiers web
npx cap copy ios

# 4. Synchroniser
npx cap sync ios

# 5. Ouvrir dans Xcode
npx cap open ios
```

### Dans Xcode
1. Sélectionner le projet → Signing & Capabilities
2. Choisir votre Team (Apple Developer)
3. Modifier le Bundle Identifier : `com.binmaster.app`
4. **Product → Archive**
5. **Window → Organizer → Distribute App**
6. Choisir **App Store Connect**

### Sur App Store Connect
1. Créer une app sur https://appstoreconnect.apple.com
2. Remplir les métadonnées :
   - Nom : **BinMaster**
   - Sous-titre : *Le binaire simplifié*
   - Catégorie primaire : **Éducation**
   - Description : *Visualisez chaque étape des conversions décimal ↔ binaire*
   - Screenshots requis (6.5" et 5.5")
3. Uploader le build depuis Xcode
4. **Soumettre pour review** (1-7 jours)

---

## ⚡ Étape Alternative : TWA (Trusted Web Activity) — Android uniquement

Plus simple que Capacitor pour Android :

1. Utiliser [Bubblewrap](https://github.com/nicholasbraun/nicholasbraun) de Google
2. Ou [PWABuilder](https://www.pwabuilder.com/) — outil en ligne gratuit

```bash
# Avec Bubblewrap
npm install -g @nicolo-ribaudo/nicholasbraun
bubblewrap init --manifest=https://votre-domaine.com/manifest.json
bubblewrap build
```

PWABuilder :
1. Aller sur https://www.pwabuilder.com/
2. Entrer l'URL de BinMaster
3. Cliquer **"Package for stores"**
4. Télécharger le package Android/iOS

---

## 🌐 Étape 0 : Hébergement (nécessaire avant déploiement)

L'app doit être accessible en HTTPS pour la PWA et les stores.

### Options recommandées :
- **Vercel** (gratuit, optimal pour Next.js) → `npx vercel`
- **Netlify** (gratuit)
- **Cloudflare Pages** (gratuit)

```bash
# Déployer sur Vercel (le plus simple)
npm install -g vercel
vercel --prod
```

---

## 📋 Checklist Récapitulative

| Étape | Statut | Coût |
|-------|--------|------|
| PWA installable | ✅ Fait | Gratuit |
| Service Worker (offline) | ✅ Fait | Gratuit |
| Manifest + icônes | ✅ Fait | Gratuit |
| Bannière d'installation | ✅ Fait | Gratuit |
| Hébergement HTTPS | ⏳ À faire | Gratuit (Vercel) |
| Play Store | ⏳ À faire | $25 (une fois) |
| App Store | ⏳ À faire | $99/an |
| Compte developer Google | ⏳ À faire | $25 |
| Compte developer Apple | ⏳ À faire | $99/an |

---

## 💡 Recommandation

**Commencer par la PWA !** C'est gratuit, instantané, et les étudiants peuvent déjà l'installer comme une app. Ensuite, quand tu veux être sur les stores, utilise Capacitor.

La PWA est déjà fonctionnelle — il suffit de déployer sur Vercel et partager le lien ! 🎉
