# 🧮 BinMaster — Comprendre le Binaire Facilement

BinMaster est une application éducative interactive pour apprendre le système binaire. Conçue pour les étudiants, elle offre une approche ludique et progressive pour maîtriser les conversions décimal ↔ binaire.

## ✨ Fonctionnalités

- **🏠 Tableau de bord** — Suivi de progression avec XP, niveaux et séries
- **🔄 Convertisseurs** — Décimal → Binaire et Binaire → Décimal avec explications étape par étape
- **💪 Entraînement** — Exercices adaptatifs avec 3 niveaux de difficulté
- **📖 Théorie** — 6 leçons structurées sur le système binaire
- **📊 Progrès** — Badges, statistiques et historique des conversions
- **🤖 BinBot** — Assistant IA intégré pour poser des questions sur le binaire
- **🌙 Mode sombre** — Interface adaptée jour/nuit
- **📱 PWA** — Installable sur mobile comme une application native

## 🛠️ Stack Technique

- **Framework** : Next.js 16 (App Router)
- **Langage** : TypeScript
- **Styling** : Tailwind CSS + shadcn/ui
- **State** : Zustand
- **Base de données** : Prisma + SQLite
- **IA** : z-ai-web-dev-sdk (LLM)
- **Animations** : Framer Motion

## 🚀 Installation

```bash
# Cloner le repo
git clone https://github.com/VOTRE_USERNAME/binmaster.git
cd binmaster

# Installer les dépendances
bun install

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos clés API

# Initialiser la base de données
bun run db:push

# Lancer le serveur de développement
bun run dev
```

## 📦 Déploiement

### Vercel (recommandé)

1. Connectez votre repo GitHub à [Vercel](https://vercel.com)
2. Ajoutez les variables d'environnement dans les paramètres Vercel
3. Déployez automatiquement

### Google Play Store (via Capacitor)

1. Déployez d'abord sur Vercel
2. Configurez `capacitor.config.ts` avec votre URL Vercel
3. Build Android : `npx cap add android && npx cap sync android`
4. Ouvrez Android Studio et publiez

## 📄 Licence

MIT
