#!/bin/bash
# =============================================
# 🚀 BinMaster — Déploiement sur Vercel
# =============================================
# 
# PRÉREQUIS :
#   1. Avoir un compte Vercel (gratuit) → https://vercel.com/signup
#   2. Avoir installé le CLI → npm install -g vercel
#
# COMMANDES À EXÉCUTER :
#   chmod +x deploy.sh
#   ./deploy.sh
#

set -e

echo "🚀 Déploiement de BinMaster sur Vercel..."
echo ""

# Étape 1 : Login Vercel
echo "📱 Étape 1/4 : Connexion à Vercel"
echo "   → Une page va s'ouvrir dans ton navigateur"
echo "   → Connecte-toi ou crée un compte"
vercel login

# Étape 2 : Déployer (preview)
echo ""
echo "🏗️ Étape 2/4 : Build et déploiement preview"
vercel --yes

# Étape 3 : Déployer en production
echo ""
echo "🌟 Étape 3/4 : Déploiement en production"
vercel --prod --yes

echo ""
echo "✅ Étape 4/4 : C'est fait ! 🎉"
echo ""
echo "🔗 Ton app est en ligne ! Vercel t'a donné un URL comme :"
echo "   https://binmaster-xxxx.vercel.app"
echo ""
echo "📲 Pour installer sur téléphone :"
echo "   Android : Ouvre le lien dans Chrome → Menu → Installer"
echo "   iPhone  : Ouvre le lien dans Safari → Partager → Sur l'écran d'accueil"
echo ""
echo "🏪 Pour le Play Store, suis le guide dans DEPLOYMENT.md"
