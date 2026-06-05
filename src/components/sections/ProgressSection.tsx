"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Zap,
  Flame,
  Target,
  TrendingUp,
  ArrowRightLeft,
  Binary,
  Dumbbell,
  Award,
  Star,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAppStore } from "@/lib/store";
import { BADGES } from "@/lib/conversions";

export function ProgressSection() {
  const { progress, setProgress } = useAppStore();

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await fetch("/api/progress");
        const data = await res.json();
        setProgress(data);
      } catch {
        // Use local state
      }
    };
    fetchProgress();
  }, [setProgress]);

  const accuracy = progress.totalExercises > 0
    ? Math.round((progress.correctAnswers / progress.totalExercises) * 100)
    : 0;
  const xpProgress = progress.xp % 100;
  const earnedBadges = BADGES.filter((b) => progress.badges.includes(b.id));
  const lockedBadges = BADGES.filter((b) => !progress.badges.includes(b.id));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold mb-1">Progrès</h1>
        <p className="text-muted-foreground">
          Suivez votre évolution et débloquez des badges.
        </p>
      </motion.div>

      {/* Level & XP */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="border-2 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-xl font-bold">Niveau {progress.level}</h2>
                  <span className="text-sm text-muted-foreground">{progress.xp} XP total</span>
                </div>
                <Progress value={xpProgress} className="h-3 mb-1" />
                <p className="text-xs text-muted-foreground">
                  {100 - xpProgress} XP avant le niveau {progress.level + 1}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats grid */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Exercices", value: progress.totalExercises, icon: <Dumbbell className="h-4 w-4" />, color: "text-purple-500" },
            { label: "Correct", value: progress.correctAnswers, icon: <Target className="h-4 w-4" />, color: "text-emerald-500" },
            { label: "Précision", value: `${accuracy}%`, icon: <TrendingUp className="h-4 w-4" />, color: "text-blue-500" },
            { label: "Meilleure série", value: progress.bestStreak, icon: <Flame className="h-4 w-4" />, color: "text-orange-500" },
          ].map((stat, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">{stat.label}</span>
                  <span className={stat.color}>{stat.icon}</span>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Conversion breakdown */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <ArrowRightLeft className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Déc → Bin</p>
                  <p className="text-xl font-bold">{progress.dec2binCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                  <Binary className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Bin → Déc</p>
                  <p className="text-xl font-bold">{progress.bin2decCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Badges */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Award className="h-4 w-4 text-yellow-500" />
              Badges ({earnedBadges.length}/{BADGES.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Earned badges */}
            {earnedBadges.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {earnedBadges.map((badge) => (
                  <div
                    key={badge.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/10"
                  >
                    <span className="text-2xl">{badge.icon}</span>
                    <div>
                      <p className="text-sm font-semibold">{badge.name}</p>
                      <p className="text-xs text-muted-foreground">{badge.description}</p>
                    </div>
                    <Star className="h-4 w-4 text-yellow-500 ml-auto shrink-0" />
                  </div>
                ))}
              </div>
            )}

            {/* Locked badges */}
            {lockedBadges.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-3">Badges à débloquer :</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {lockedBadges.map((badge) => (
                    <div
                      key={badge.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border opacity-60"
                    >
                      <span className="text-2xl grayscale">🔒</span>
                      <div>
                        <p className="text-sm font-semibold">{badge.name}</p>
                        <p className="text-xs text-muted-foreground">{badge.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Level progression */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Progression par niveau
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3, 5, 10].map((level) => {
                const xpNeeded = (level - 1) * 100;
                const isUnlocked = progress.level >= level;
                return (
                  <div key={level} className="flex items-center gap-3">
                    <div
                      className={`h-8 w-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                        isUnlocked
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {level}
                    </div>
                    <div className="flex-1">
                      <Progress
                        value={isUnlocked ? 100 : Math.max(0, Math.min(100, ((progress.xp - xpNeeded) / 100) * 100))}
                        className="h-2"
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-16 text-right">
                      {xpNeeded} XP
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
