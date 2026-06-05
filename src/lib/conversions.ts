export interface Dec2BinStep {
  dividend: number;
  quotient: number;
  remainder: number;
  stepNumber: number;
}

export interface Bin2DecStep {
  bit: string;
  position: number;
  powerOf2: number;
  value: number;
  runningTotal: number;
}

export interface ConversionResult {
  input: string;
  output: string;
  steps: Dec2BinStep[] | Bin2DecStep[];
  explanation: string[];
}

export function decimalToBinary(decimal: number): ConversionResult {
  if (decimal < 0) {
    throw new Error("Les nombres négatifs ne sont pas supportés pour le moment.");
  }
  if (decimal === 0) {
    return {
      input: "0",
      output: "0",
      steps: [{ dividend: 0, quotient: 0, remainder: 0, stepNumber: 1 }],
      explanation: ["0 en décimal est simplement 0 en binaire."],
    };
  }

  const steps: Dec2BinStep[] = [];
  const explanations: string[] = [];
  let current = decimal;
  let stepNumber = 1;

  while (current > 0) {
    const quotient = Math.floor(current / 2);
    const remainder = current % 2;
    steps.push({
      dividend: current,
      quotient,
      remainder,
      stepNumber,
    });
    explanations.push(
      `${current} ÷ 2 = ${quotient} reste ${remainder}`
    );
    current = quotient;
    stepNumber++;
  }

  const binaryResult = steps.map((s) => s.remainder).reverse().join("");
  explanations.push(
    `On lit les restes de bas en haut : ${steps.map((s) => s.remainder).reverse().join("")}₂`
  );

  return {
    input: decimal.toString(),
    output: binaryResult,
    steps,
    explanation: explanations,
  };
}

export function binaryToDecimal(binary: string): ConversionResult {
  if (!/^[01]+$/.test(binary)) {
    throw new Error("Entrée invalide : veuillez entrer un nombre binaire (0 et 1 uniquement).");
  }

  const bits = binary.split("");
  const steps: Bin2DecStep[] = [];
  const explanations: string[] = [];
  let runningTotal = 0;

  bits.forEach((bit, index) => {
    const position = bits.length - 1 - index;
    const powerOf2 = Math.pow(2, position);
    const value = parseInt(bit) * powerOf2;
    runningTotal += value;
    steps.push({
      bit,
      position,
      powerOf2,
      value,
      runningTotal,
    });
    if (bit === "1") {
      explanations.push(
        `${bit} × 2${superscript(position)} = ${bit} × ${powerOf2} = ${value}`
      );
    } else {
      explanations.push(
        `${bit} × 2${superscript(position)} = ${bit} × ${powerOf2} = 0`
      );
    }
  });

  const nonZeroValues = steps.filter((s) => s.value > 0).map((s) => s.value);
  if (nonZeroValues.length > 0) {
    explanations.push(
      `Addition : ${nonZeroValues.join(" + ")} = ${runningTotal}₁₀`
    );
  } else {
    explanations.push("Tous les bits sont à 0, donc le résultat est 0.");
  }

  return {
    input: binary,
    output: runningTotal.toString(),
    steps,
    explanation: explanations,
  };
}

function superscript(n: number): string {
  const superscripts: Record<string, string> = {
    "0": "⁰",
    "1": "¹",
    "2": "²",
    "3": "³",
    "4": "⁴",
    "5": "⁵",
    "6": "⁶",
    "7": "⁷",
    "8": "⁸",
    "9": "⁹",
  };
  return n
    .toString()
    .split("")
    .map((d) => superscripts[d] || d)
    .join("");
}

export function generateExercise(
  type: "dec2bin" | "bin2dec",
  difficulty: "easy" | "medium" | "hard"
): { question: string; answer: string; hint: string } {
  let maxNum: number;
  switch (difficulty) {
    case "easy":
      maxNum = 15;
      break;
    case "medium":
      maxNum = 255;
      break;
    case "hard":
      maxNum = 1023;
      break;
  }

  const num = Math.floor(Math.random() * maxNum) + 1;

  if (type === "dec2bin") {
    const result = decimalToBinary(num);
    let hint: string;
    if (num <= 15) {
      hint = "Pensez aux puissances de 2 : 8, 4, 2, 1. Quelles sont nécessaires ?";
    } else if (num <= 255) {
      hint = "Divisez successivement par 2 et notez les restes.";
    } else {
      hint = "Utilisez la méthode des divisions successives. N'oubliez pas de lire les restes de bas en haut !";
    }
    return {
      question: num.toString(),
      answer: result.output,
      hint,
    };
  } else {
    const binary = num.toString(2);
    let hint: string;
    const bitCount = binary.length;
    if (bitCount <= 4) {
      hint = "Identifiez les positions où le bit est 1 et additionnez les puissances de 2 correspondantes.";
    } else if (bitCount <= 8) {
      hint = "Calculez chaque bit × 2^position, puis additionnez toutes les valeurs.";
    } else {
      hint = "Travaillez bit par bit, de gauche à droite. Chaque bit 1 contribue une puissance de 2.";
    }
    return {
      question: binary,
      answer: num.toString(),
      hint,
    };
  }
}

export function getBitVisualization(decimal: number): { powers: number[]; bits: number[]; values: number[]; total: number } {
  if (decimal === 0) {
    return { powers: [1], bits: [0], values: [0], total: 0 };
  }

  const binary = decimal.toString(2);
  const bits = binary.split("").map(Number);
  const powers: number[] = [];
  const values: number[] = [];

  bits.forEach((bit, index) => {
    const position = bits.length - 1 - index;
    const powerOf2 = Math.pow(2, position);
    powers.push(powerOf2);
    values.push(bit * powerOf2);
  });

  return { powers, bits, values, total: decimal };
}

export const BADGES = [
  { id: "first_convert", name: "Premier Pas", description: "Effectue ta première conversion", icon: "🎯", condition: (stats: { totalExercises: number }) => stats.totalExercises >= 1 },
  { id: "streak_3", name: "En Forme", description: "Obtiens 3 bonnes réponses d'affilée", icon: "🔥", condition: (stats: { bestStreak: number }) => stats.bestStreak >= 3 },
  { id: "streak_5", name: "Imparable", description: "Obtiens 5 bonnes réponses d'affilée", icon: "⚡", condition: (stats: { bestStreak: number }) => stats.bestStreak >= 5 },
  { id: "streak_10", name: "Machine", description: "Obtiens 10 bonnes réponses d'affilée", icon: "🤖", condition: (stats: { bestStreak: number }) => stats.bestStreak >= 10 },
  { id: "exercises_10", name: "Apprenti", description: "Complète 10 exercices", icon: "📚", condition: (stats: { totalExercises: number }) => stats.totalExercises >= 10 },
  { id: "exercises_25", name: "Étudiant", description: "Complète 25 exercices", icon: "🎓", condition: (stats: { totalExercises: number }) => stats.totalExercises >= 25 },
  { id: "exercises_50", name: "Maître", description: "Complète 50 exercices", icon: "👨‍🏫", condition: (stats: { totalExercises: number }) => stats.totalExercises >= 50 },
  { id: "level_5", name: "Expert", description: "Atteins le niveau 5", icon: "🌟", condition: (stats: { level: number }) => stats.level >= 5 },
  { id: "hard_win", name: "Coriace", description: "Réussis un exercice difficile", icon: "💪", condition: (stats: { hardCorrect: number }) => stats.hardCorrect >= 1 },
];

export function calculateLevel(xp: number): number {
  return Math.floor(xp / 100) + 1;
}

export function getXpForExercise(difficulty: "easy" | "medium" | "hard", isCorrect: boolean): number {
  if (!isCorrect) return 5; // XP for trying
  switch (difficulty) {
    case "easy": return 20;
    case "medium": return 40;
    case "hard": return 60;
  }
}
