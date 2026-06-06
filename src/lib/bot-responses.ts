// Pre-built intelligent responses for when AI API is unavailable
// BinBot can still help students with common binary questions!

interface BotResponse {
  keywords: string[];
  response: string;
}

const RESPONSES: BotResponse[] = [
  {
    keywords: ["pourquoi", "ordinateur", "binaire", "utilise"],
    response: `Les ordinateurs utilisent le binaire car ils fonctionnent avec des **circuits électriques** qui n'ont que 2 états :

- ⚡ **Allumé** = 1
- ⬛ **Éteint** = 0

C'est le système le plus simple et le plus fiable pour représenter l'information ! 💡

Toute donnée (texte, image, vidéo) est finalement traduite en suites de 0 et 1 en mémoire.`,
  },
  {
    keywords: ["puissance", "2", "mémoriser", "retenir"],
    response: `Voici les **puissances de 2** à connaître par cœur ! 🧠

| Rang | Puissance | Valeur |
|------|-----------|--------|
| 0    | 2⁰       | **1**  |
| 1    | 2¹       | **2**  |
| 2    | 2²       | **4**  |
| 3    | 2³       | **8**  |
| 4    | 2⁴       | **16** |
| 5    | 2⁵       | **32** |
| 6    | 2⁶       | **64** |
| 7    | 2⁷       | **128**|
| 8    | 2⁸       | **256**|

💡 **Astuce** : chaque valeur est le double de la précédente ! Et 256 = le nombre de valeurs d'un octet (8 bits).`,
  },
  {
    keywords: ["octet", "byte", "bit", "différence"],
    response: `**Bit vs Octet** — voici la différence ! 💻

- **Bit** = un seul chiffre (0 ou 1) — c'est la plus petite unité
- **Octet** (byte) = **8 bits** regroupés

Exemple : \`11010110\` = 1 octet = 8 bits

Un octet peut représenter **256 valeurs différentes** (de 0 à 255 en décimal).

💡 **À retenir** :
- 1 octet = 8 bits
- 1 Ko (kilooctet) = 1024 octets
- 1 Mo = 1024 Ko
- 1 Go = 1024 Mo`,
  },
  {
    keywords: ["addition", "binaire", "calcul", "additionner"],
    response: `L'addition binaire fonctionne comme l'addition décimale, avec des retenues ! ➕

**Les règles :**
- \`0 + 0 = 0\`
- \`0 + 1 = 1\`
- \`1 + 1 = 10\` (0 et on retient 1)
- \`1 + 1 + 1 = 11\` (1 et on retient 1)

**Exemple :** 1011 + 110 = ?

\`\`\`
  1011
+ 0110
------
 10001
\`\`\`

Vérification : 11 + 6 = **17** ✅ et 10001₂ = 17₁₀ 💡`,
  },
  {
    keywords: ["convertir", "décimal", "binaire", "comment"],
    response: `Pour convertir du **décimal au binaire**, on utilise la méthode des **divisions successives par 2** ! 🔢

**Exemple avec 25 :**

| Division | Quotient | Reste |
|----------|----------|-------|
| 25 ÷ 2   | 12       | **1** |
| 12 ÷ 2   | 6        | **0** |
| 6 ÷ 2    | 3        | **0** |
| 3 ÷ 2    | 1        | **1** |
| 1 ÷ 2    | 0        | **1** |

On lit les restes de **bas en haut** : **11001₂** ✅

💡 Vérification : 16 + 8 + 0 + 0 + 1 = **25** ✓`,
  },
  {
    keywords: ["binaire", "décimal", "lire", "comprendre", "convertir"],
    response: `Pour convertir du **binaire au décimal**, on utilise les **puissances de 2** ! 💻

**Exemple avec 11001 :**

Chaque bit a une position (de droite à gauche, en partant de 0) :

| Bit | Position | Puissance | Valeur |
|-----|----------|-----------|--------|
| 1   | 4        | 2⁴ = 16   | **16** |
| 1   | 3        | 2³ = 8    | **8**  |
| 0   | 2        | 2² = 4    | **0**  |
| 0   | 1        | 2¹ = 2    | **0**  |
| 1   | 0        | 2⁰ = 1    | **1**  |

Addition : 16 + 8 + 0 + 0 + 1 = **25₁₀** ✅

💡 **Astuce** : seuls les bits à 1 comptent !`,
  },
  {
    keywords: ["exercice", "facile", "pratiquer", "entraîner"],
    response: `Voici un petit exercice pour toi ! 📝

**Convertis 42 en binaire** — Utilise la méthode des divisions par 2 !

<details>
<summary>👁️ Clique pour voir la solution</summary>

| Division | Quotient | Reste |
|----------|----------|-------|
| 42 ÷ 2   | 21       | **0** |
| 21 ÷ 2   | 10       | **1** |
| 10 ÷ 2   | 5        | **0** |
| 5 ÷ 2    | 2        | **1** |
| 2 ÷ 2    | 1        | **0** |
| 1 ÷ 2    | 0        | **1** |

**42₁₀ = 101010₂** ✅

Vérification : 32 + 0 + 8 + 0 + 2 + 0 = 42 ✓
</details>

Essaie d'abord sans regarder ! 💪`,
  },
  {
    keywords: ["pair", "impair", "astuce", "truc"],
    response: `Voici des **astuces** pour le binaire ! ⚡

🔢 **Nombres pairs** → le dernier bit est toujours **0**
🔢 **Nombres impairs** → le dernier bit est toujours **1**

Exemples :
- 6 = **110** → pair → finit par 0 ✅
- 7 = **111** → impair → finit par 1 ✅

💡 **Autres astuces :**
- Multiplier par 2 = ajouter un 0 à droite (comme ×10 en décimal !)
- \`1010\` (10) × 2 = \`10100\` (20)
- Un nombre avec que des 1 = une puissance de 2 moins 1
  - \`111\` = 7 = 8-1, \`1111\` = 15 = 16-1`,
  },
];

const DEFAULT_RESPONSE = `Bonne question ! 🤔

Je suis BinBot, ton assistant binaire. Voici ce que je peux t'expliquer :

- 🔄 **Comment convertir** un nombre décimal en binaire (et inversement)
- 💡 **Pourquoi** les ordinateurs utilisent le binaire
- 🧠 **Les puissances de 2** à connaître
- ➕ **L'addition binaire**
- 📝 **Des exercices** pour t'entraîner
- ⚡ **Des astuces** pour aller plus vite

Pose-moi une de ces questions et je t'aiderai avec plaisir ! 😊`;

export function getFallbackResponse(userMessage: string): string {
  const lowerMsg = userMessage.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/['']/g, "'");

  // Find best matching response
  let bestMatch: BotResponse | null = null;
  let bestScore = 0;

  for (const resp of RESPONSES) {
    const score = resp.keywords.filter(kw => lowerMsg.includes(kw)).length;
    if (score > bestScore) {
      bestScore = score;
      bestMatch = resp;
    }
  }

  if (bestMatch && bestScore >= 1) {
    return bestMatch.response;
  }

  // Check for specific number conversion questions
  const decToBinMatch = lowerMsg.match(/convertir?\s+(\d+)\s+(en\s+)?binaire/);
  if (decToBinMatch) {
    const num = parseInt(decToBinMatch[1]);
    if (!isNaN(num) && num >= 0 && num <= 1048575) {
      const binary = num.toString(2);
      return `Voici la conversion ! 🔢\n\n**${num}₁₀ = ${binary}₂** ✅\n\nUtilise le convertisseur Dec→Bin dans l'onglet "Convertir" pour voir les étapes détaillées ! 💡`;
    }
  }

  const binToDecMatch = lowerMsg.match(/(?:c'est quoi|combien|convertir?)\s+([01]{2,})\s+(en\s+)?d[eé]cimal/);
  if (binToDecMatch) {
    const binary = binToDecMatch[1];
    const decimal = parseInt(binary, 2);
    return `Voici la conversion ! 💻\n\n**${binary}₂ = ${decimal}₁₀** ✅\n\nUtilise le convertisseur Bin→Dec dans l'onglet "Convertir" pour voir les étapes détaillées ! 💡`;
  }

  return DEFAULT_RESPONSE;
}
