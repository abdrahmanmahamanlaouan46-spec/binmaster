"use client";

import React from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import {
  ArrowRightLeft,
  Binary,
  Dumbbell,
  BookOpen,
  Trophy,
  History,
  Zap,
  TrendingUp,
  Target,
  Flame,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BADGES } from "@/lib/conversions";

const quickActions = [
  { id: "dec2bin" as const, label: "Décimal → Binaire", icon: <ArrowRightLeft className="h-5 w-5" />, color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  { id: "bin2dec" as const, label: "Binaire → Décimal", icon: <Binary className="h-5 w-5" />, color: "bg-orange-500/10 text-orange-600 dark:text-orange-400" },
  { id: "training" as const, label: "Mode Entraînement", icon: <Dumbbell className="h-5 w-5" />, color: "bg-purple-500/10 text-purple-600 dark:text-purple-400" },
  { id: "theory" as const, label: "Apprendre la théorie", icon: <BookOpen className="h-5 w-5" />, color: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400" },
];

export function Dashboard() {
  const { progress, setCurrentSection } = useAppStore();
  const accuracy = progress.totalExercises > 0
    ? Math.round((progress.correctAnswers / progress.totalExercises) * 100)
    : 0;
  const xpProgress = progress.xp % 100;
  const earnedBadges = BADGES.filter((b) => progress.badges.includes(b.id));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold mb-1">Tableau de bord</h1>
        <p className="text-muted-foreground">Bienvenue sur BinMaster ! Continuez votre apprentissage du binaire.</p>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Niveau", value: progress.level, icon: <Zap className="h-4 w-4" />, color: "text-yellow-500" },
          { label: "XP", value: progress.xp, icon: <TrendingUp className="h-4 w-4" />, color: "text-emerald-500" },
          { label: "Série", value: progress.streak, icon: <Flame className="h-4 w-4" />, color: "text-orange-500" },
          { label: "Précision", value: `${accuracy}%`, icon: <Target className="h-4 w-4" />, color: "text-purple-500" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground font-medium">{stat.label}</span>
                  <span className={stat.color}>{stat.icon}</span>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* XP Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Niveau {progress.level}</span>
              <span className="text-sm text-muted-foreground">{xpProgress}/100 XP</span>
            </div>
            <Progress value={xpProgress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {100 - xpProgress} XP restants pour le niveau {progress.level + 1}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-lg font-semibold mb-3">Actions rapides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quickActions.map((action, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentSection(action.id)}
              className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:bg-accent transition-colors text-left"
            >
              <div className={`h-12 w-12 rounded-xl ${action.color} flex items-center justify-center`}>
                {action.icon}
              </div>
              <div>
                <p className="font-semibold text-sm">{action.label}</p>
                <p className="text-xs text-muted-foreground">Commencer</p>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-500" />
              Badges obtenus ({earnedBadges.length}/{BADGES.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {earnedBadges.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {earnedBadges.map((badge) => (
                  <div
                    key={badge.id}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/5 border border-primary/10"
                  >
                    <span className="text-lg">{badge.icon}</span>
                    <div>
                      <p className="text-xs font-semibold">{badge.name}</p>
                      <p className="text-[10px] text-muted-foreground">{badge.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Complétez des exercices pour gagner vos premiers badges !
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <History className="h-4 w-4" />
              Statistiques détaillées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">Exercices total</p>
                <p className="text-xl font-bold">{progress.totalExercises}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">Bonnes réponses</p>
                <p className="text-xl font-bold">{progress.correctAnswers}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">Conversions Déc→Bin</p>
                <p className="text-xl font-bold">{progress.dec2binCount}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">Conversions Bin→Déc</p>
                <p className="text-xl font-bold">{progress.bin2decCount}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">Meilleure série</p>
                <p className="text-xl font-bold">{progress.bestStreak} 🔥</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">Exercices hard réussis</p>
                <p className="text-xl font-bold">{progress.hardCorrect} 💪</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
