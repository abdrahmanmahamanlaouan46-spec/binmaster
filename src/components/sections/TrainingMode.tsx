"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dumbbell,
  RefreshCw,
  Lightbulb,
  Check,
  X,
  ArrowRight,
  Trophy,
  Flame,
  Zap,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAppStore, ExerciseData } from "@/lib/store";
import { generateExercise, BADGES } from "@/lib/conversions";
import { toast } from "sonner";

const difficulties = [
  { id: "easy" as const, label: "Facile", desc: "0-15", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" },
  { id: "medium" as const, label: "Moyen", desc: "0-255", color: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20" },
  { id: "hard" as const, label: "Difficile", desc: "0-1023", color: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20" },
];

const types = [
  { id: "dec2bin" as const, label: "Décimal → Binaire", icon: "🔢" },
  { id: "bin2dec" as const, label: "Binaire → Décimal", icon: "💻" },
];

const encouragements = [
  "Excellent ! 🎉",
  "Parfait ! 💪",
  "Bravo ! 🌟",
  "Trop fort ! 🔥",
  "Génial ! ⚡",
  "Super ! 🎯",
  "Incroyable ! 🚀",
];

const errorMessages = [
  "Pas loin ! Réessaie, tu vas y arriver. 💪",
  "Courage, l'erreur fait partie de l'apprentissage ! 📚",
  "Presque ! Vérifie ton calcul. 🤔",
  "Continue, tu progresses ! 🌱",
];

const specificErrors: Record<string, string> = {
  "wrong_direction": "⚠️ Attention ! N'oublie pas de lire les restes de bas en haut pour Déc→Bin.",
  "bit_position": "⚠️ Vérifie bien les positions des bits. Le bit le plus à gauche a la plus grande puissance de 2.",
  "power_of_2": "⚠️ Vérifie tes puissances de 2 : 2⁰=1, 2¹=2, 2²=4, 2³=8, 2⁴=16, 2⁵=32, 2⁶=64, 2⁷=128, 2⁸=256, 2⁹=512, 2¹⁰=1024",
};

export function TrainingMode() {
  const {
    progress,
    updateProgress,
    currentExercise,
    setCurrentExercise,
    exerciseAnswer,
    setExerciseAnswer,
    showHint,
    setShowHint,
    exerciseFeedback,
    setExerciseFeedback,
  } = useAppStore();

  const [selectedDifficulty, setSelectedDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [selectedType, setSelectedType] = useState<"dec2bin" | "bin2dec">("dec2bin");
  const [isGenerating, setIsGenerating] = useState(false);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionTotal, setSessionTotal] = useState(0);

  const generateNewExercise = useCallback(async () => {
    setIsGenerating(true);
    setExerciseFeedback(null);
    setExerciseAnswer("");
    setShowHint(false);

    try {
      const data = generateExercise(selectedType, selectedDifficulty);
      const exercise: ExerciseData = {
        type: selectedType,
        difficulty: selectedDifficulty,
        question: data.question,
        answer: data.answer,
        hint: data.hint,
      };
      setCurrentExercise(exercise);
    } catch {
      toast.error("Erreur lors de la génération de l'exercice");
    } finally {
      setIsGenerating(false);
    }
  }, [selectedType, selectedDifficulty, setCurrentExercise, setExerciseAnswer, setExerciseFeedback, setShowHint]);

  const checkAnswer = async () => {
    if (!currentExercise || !exerciseAnswer.trim()) return;

    const isCorrect = exerciseAnswer.trim() === currentExercise.answer;
    setSessionTotal((p) => p + 1);

    let message: string;
    if (isCorrect) {
      setSessionCorrect((p) => p + 1);
      message = encouragements[Math.floor(Math.random() * encouragements.length)];
    } else {
      message = errorMessages[Math.floor(Math.random() * errorMessages.length)];
      // Add specific error hint
      if (selectedType === "dec2bin") {
        message += " " + specificErrors["wrong_direction"];
      } else {
        message += " " + specificErrors["power_of_2"];
      }
    }

    setExerciseFeedback({
      isCorrect,
      message,
    });

    // Update progress via store
    const previousBadges = progress.badges;
    updateProgress(isCorrect, selectedDifficulty, selectedType);

    // Check for newly earned badges
    const { progress: updatedProgress } = useAppStore.getState();
    const newBadges = updatedProgress.badges.filter((id: string) => !previousBadges.includes(id));
    if (newBadges.length > 0) {
      newBadges.forEach((badgeId: string) => {
        const badge = BADGES.find((b) => b.id === badgeId);
        toast.success(`🏅 Nouveau badge débloqué !`, {
          description: badge ? badge.name : "Félicitations !",
        });
      });
    }
  };

  const handleNextExercise = () => {
    generateNewExercise();
  };

  const accuracy = sessionTotal > 0 ? Math.round((sessionCorrect / sessionTotal) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold mb-1">Mode Entraînement</h1>
        <p className="text-muted-foreground">
          Pratiquez avec des exercices générés automatiquement et progressez à votre rythme.
        </p>
      </motion.div>

      {/* Session stats */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-xs text-muted-foreground">Série actuelle</p>
              <p className="text-2xl font-bold flex items-center justify-center gap-1">
                {progress.streak} <Flame className="h-4 w-4 text-orange-500" />
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-xs text-muted-foreground">Session</p>
              <p className="text-2xl font-bold">{sessionCorrect}/{sessionTotal}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <p className="text-xs text-muted-foreground">Précision</p>
              <p className="text-2xl font-bold">{accuracy}%</p>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Configuration */}
      {!currentExercise && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Configurez votre exercice</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Type selection */}
              <div>
                <p className="text-sm font-medium mb-3">Type de conversion</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {types.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                        selectedType === type.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/30"
                      }`}
                    >
                      <span className="text-2xl">{type.icon}</span>
                      <span className="font-medium text-sm">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty selection */}
              <div>
                <p className="text-sm font-medium mb-3">Niveau de difficulté</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {difficulties.map((diff) => (
                    <button
                      key={diff.id}
                      onClick={() => setSelectedDifficulty(diff.id)}
                      className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                        selectedDifficulty === diff.id
                          ? `border-primary bg-primary/5`
                          : "border-border hover:border-primary/30"
                      }`}
                    >
                      <span className={`text-sm font-bold px-2 py-0.5 rounded ${diff.color}`}>{diff.label}</span>
                      <span className="text-xs text-muted-foreground mt-1">Nombres : {diff.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={generateNewExercise}
                className="w-full h-12 text-base"
                size="lg"
              >
                <Dumbbell className="mr-2 h-5 w-5" />
                Générer un exercice
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Exercise */}
      <AnimatePresence mode="wait">
        {currentExercise && (
          <motion.div
            key={currentExercise.question}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    {selectedType === "dec2bin" ? "Décimal → Binaire" : "Binaire → Décimal"}
                  </CardTitle>
                  <Badge variant="outline" className="text-xs">
                    {difficulties.find((d) => d.id === selectedDifficulty)?.label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Question */}
                <div className="text-center py-6">
                  <p className="text-sm text-muted-foreground mb-2">
                    {selectedType === "dec2bin"
                      ? "Convertissez ce nombre décimal en binaire :"
                      : "Convertissez ce nombre binaire en décimal :"}
                  </p>
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-primary/10"
                  >
                    <span className="font-mono font-bold text-4xl text-primary">
                      {currentExercise.question}
                    </span>
                    <sub className="text-sm text-muted-foreground">
                      {selectedType === "dec2bin" ? "10" : "2"}
                    </sub>
                  </motion.div>
                </div>

                {/* Answer input */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <Input
                      type="text"
                      placeholder={
                        selectedType === "dec2bin"
                          ? "Entrez la réponse en binaire..."
                          : "Entrez la réponse en décimal..."
                      }
                      value={exerciseAnswer}
                      onChange={(e) => {
                        if (selectedType === "dec2bin") {
                          setExerciseAnswer(e.target.value.replace(/[^01]/g, ""));
                        } else {
                          setExerciseAnswer(e.target.value.replace(/[^0-9]/g, ""));
                        }
                      }}
                      onKeyDown={(e) => e.key === "Enter" && !exerciseFeedback && checkAnswer()}
                      className="text-lg h-12 font-mono text-center"
                      disabled={!!exerciseFeedback}
                    />
                  </div>
                  {!exerciseFeedback ? (
                    <Button onClick={checkAnswer} disabled={!exerciseAnswer.trim()} className="h-12 px-8">
                      <Check className="mr-2 h-5 w-5" />
                      Vérifier
                    </Button>
                  ) : (
                    <Button onClick={handleNextExercise} className="h-12 px-8">
                      <RefreshCw className="mr-2 h-5 w-5" />
                      Suivant
                    </Button>
                  )}
                </div>

                {/* Hint */}
                {!exerciseFeedback && (
                  <div className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowHint(true)}
                      className="text-muted-foreground"
                    >
                      <Lightbulb className="mr-1 h-4 w-4" />
                      {showHint ? "Indice :" : "Voir l'indice"}
                    </Button>
                    {showHint && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-yellow-600 dark:text-yellow-400 mt-2 p-3 bg-yellow-500/10 rounded-lg"
                      >
                        💡 {currentExercise.hint}
                      </motion.p>
                    )}
                  </div>
                )}

                {/* Feedback */}
                <AnimatePresence>
                  {exerciseFeedback && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      <div
                        className={`p-4 rounded-xl border-2 ${
                          exerciseFeedback.isCorrect
                            ? "bg-emerald-500/10 border-emerald-500/30"
                            : "bg-red-500/10 border-red-500/30"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {exerciseFeedback.isCorrect ? (
                            <Check className="h-6 w-6 text-emerald-500 mt-0.5 shrink-0" />
                          ) : (
                            <X className="h-6 w-6 text-red-500 mt-0.5 shrink-0" />
                          )}
                          <div>
                            <p className={`font-semibold ${exerciseFeedback.isCorrect ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
                              {exerciseFeedback.isCorrect ? "Correct !" : "Incorrect"}
                            </p>
                            <p className="text-sm mt-1">{exerciseFeedback.message}</p>
                            {!exerciseFeedback.isCorrect && (
                              <p className="text-sm mt-2 font-mono">
                                La bonne réponse était : <strong className="text-primary">{currentExercise.answer}</strong>
                                <sub className="text-xs text-muted-foreground ml-1">
                                  {selectedType === "dec2bin" ? "2" : "10"}
                                </sub>
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* XP info */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <Card className="bg-muted/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-4 justify-center flex-wrap">
              <div className="flex items-center gap-2 text-sm">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span>Facile : +20 XP</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Zap className="h-4 w-4 text-orange-500" />
                <span>Moyen : +40 XP</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Zap className="h-4 w-4 text-red-500" />
                <span>Difficile : +60 XP</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Zap className="h-4 w-4 text-muted-foreground" />
                <span>Erreur : +5 XP</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
