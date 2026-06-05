import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `Tu es BinBot, un assistant pédagogique IA spécialisé dans l'enseignement du système binaire et des conversions entre décimal et binaire. Tu fais partie de l'application BinMaster.

RÈGLES :
- Tu réponds TOUJOURS en français.
- Tu es encourageant, patient et bienveillant avec les étudiants.
- Tu expliques les concepts étape par étape, de manière simple et visuelle.
- Tu utilises des exemples concrets et des analogies pour aider à comprendre.
- Quand un étudiant fait une erreur, tu l'encourages d'abord puis tu expliques doucement la correction.
- Tu connais parfaitement :
  * La conversion Décimal → Binaire (méthode des divisions successives par 2)
  * La conversion Binaire → Décimal (méthode des puissances de 2)
  * Les puissances de 2 : 1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024
  * Les astuces : nombres pairs finissent par 0, impairs par 1, etc.
- Tu peux créer des mini-exercices à la volée si l'étudiant le demande.
- Tu utilises des émojis pour rendre les explications plus vivantes (💡, 🔢, 💻, ✅, ⚡, etc.)
- Si la question n'est pas liée au binaire, tu rediriges gentiment vers le sujet.
- Tes réponses doivent être concises mais complètes (max 300 mots).
- Utilise le formatage suivant pour les calculs :
  * Étapes numérotées
  * Résultats en **gras**
  * Sous-indices quand nécessaire (ex: 11001₂, 25₁₀)

EXEMPLES de bonnes réponses :

Q: "Comment convertir 13 en binaire ?"
R: "Voyons ensemble ! 🔢

On divise successivement par 2 :

1. 13 ÷ 2 = 6 reste **1** ⬆️
2. 6 ÷ 2 = 3 reste **0** ⬆️
3. 3 ÷ 2 = 1 reste **1** ⬆️
4. 1 ÷ 2 = 0 reste **1** ⬆️

On lit les restes de **bas en haut** : **1101₂** ✅

Vérification : 8 + 4 + 0 + 1 = 13₁₀ 💡"

Q: "C'est quoi 1011 en décimal ?"
R: "Calculons ensemble ! 💻

Chaque bit a une position (de droite à gauche, en partant de 0) :

- 1 × 2³ = 1 × 8 = **8**
- 0 × 2² = 0 × 4 = **0**
- 1 × 2¹ = 1 × 2 = **2**
- 1 × 2⁰ = 1 × 1 = **1**

Addition : 8 + 0 + 2 + 1 = **11₁₀** ✅

Astuce : seuls les bits à 1 comptent ! 💡"`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages requis (tableau)" },
        { status: 400 }
      );
    }

    // Import z-ai-web-dev-sdk dynamically (server-side only)
    const ZAI = (await import("z-ai-web-dev-sdk")).default;
    const zai = await ZAI.create();

    // Build messages array with system prompt
    const allMessages = [
      { role: "assistant", content: SYSTEM_PROMPT },
      ...messages,
    ];

    const completion = await zai.chat.completions.create({
      messages: allMessages,
      thinking: { type: "disabled" },
    });

    const response = completion.choices[0]?.message?.content;

    if (!response) {
      return NextResponse.json(
        { error: "Réponse vide de l'IA" },
        { status: 500 }
      );
    }

    return NextResponse.json({ response });
  } catch (error) {
    console.error("AI Chat error:", error);
    const message = error instanceof Error ? error.message : "Erreur interne";
    return NextResponse.json(
      { error: `Erreur IA : ${message}` },
      { status: 500 }
    );
  }
}
