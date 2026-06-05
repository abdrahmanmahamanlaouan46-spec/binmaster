"use client";

import React from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import {
  Zap,
  ArrowRight,
  Binary,
  Target,
  BookOpen,
  Trophy,
  Sparkles,
  ChevronRight,
  Monitor,
  Cpu,
  Hash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } },
};

const features = [
  {
    icon: <Binary className="h-6 w-6" />,
    title: "Conversions Visuelles",
    description: "Chaque étape du calcul est affichée clairement avec des animations pédagogiques.",
  },
  {
    icon: <Target className="h-6 w-6" />,
    title: "Mode Entraînement",
    description: "Des exercices adaptatifs avec plusieurs niveaux de difficulté pour progresser.",
  },
  {
    icon: <BookOpen className="h-6 w-6" />,
    title: "Théorie Interactive",
    description: "Apprenez les fondements du système binaire avec des explications claires.",
  },
  {
    icon: <Trophy className="h-6 w-6" />,
    title: "Suivi de Progrès",
    description: "Badges, niveaux et statistiques pour rester motivé tout au long de l'apprentissage.",
  },
];

const testimonials = [
  {
    name: "Marie L.",
    role: "Étudiante en informatique",
    text: "Grâce à BinMaster, j'ai enfin compris comment fonctionne le binaire ! Les étapes visuelles changent tout.",
    avatar: "ML",
  },
  {
    name: "Thomas R.",
    role: "Lycéen passionné",
    text: "Le mode entraînement est addictif. Je ne pensais pas que learning le binaire pouvait être aussi fun !",
    avatar: "TR",
  },
  {
    name: "Sophie K.",
    role: "Professeure de maths",
    text: "J'utilise BinMaster en classe. Mes élèves adorent les visualisations et leur compréhension s'est nettement améliorée.",
    avatar: "SK",
  },
];

export function LandingPage() {
  const { setCurrentSection } = useAppStore();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-16">
          <motion.div
            className="text-center"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Sparkles className="h-4 w-4" />
                Nouvelle façon d'apprendre
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6"
            >
              Comprendre enfin le{" "}
              <span className="text-primary relative">
                système binaire
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3 text-primary/30"
                  viewBox="0 0 200 8"
                  fill="none"
                >
                  <path
                    d="M1 5.5C47 2 153 2 199 5.5"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <br />
              facilement
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
            >
              Visualisez chaque étape des conversions décimal ↔ binaire.
              Apprenez par la pratique avec des exercices interactifs et un suivi de progression intelligent.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="text-base px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                onClick={() => setCurrentSection("dec2bin")}
              >
                Commencer à apprendre
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-base px-8 py-6 rounded-xl"
                onClick={() => setCurrentSection("theory")}
              >
                <BookOpen className="mr-2 h-5 w-5" />
                Lire la théorie
              </Button>
            </motion.div>
          </motion.div>

          {/* Demo card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-16 max-w-3xl mx-auto"
          >
            <Card className="overflow-hidden shadow-2xl border-2 border-primary/10">
              <CardContent className="p-0">
                <div className="bg-muted/50 px-6 py-3 flex items-center gap-2 border-b">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <span className="text-xs text-muted-foreground ml-2 font-mono">BinMaster — Conversion</span>
                </div>
                <div className="p-6 sm:p-8 space-y-4">
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary font-mono font-bold text-2xl">
                      <Hash className="h-5 w-5" />
                      25
                    </div>
                    <ArrowRight className="h-6 w-6 text-muted-foreground hidden sm:block" />
                    <div className="text-muted-foreground text-sm sm:hidden">→</div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400 font-mono font-bold text-2xl">
                      <Monitor className="h-5 w-5" />
                      11001₂
                    </div>
                  </div>
                  <div className="space-y-2 text-sm font-mono">
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground w-6">1.</span>
                      <span>25 ÷ 2 = <strong>12</strong> reste <strong className="text-primary">1</strong></span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground w-6">2.</span>
                      <span>12 ÷ 2 = <strong>6</strong> reste <strong className="text-primary">0</strong></span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground w-6">3.</span>
                      <span>6 ÷ 2 = <strong>3</strong> reste <strong className="text-primary">0</strong></span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground w-6">4.</span>
                      <span>3 ÷ 2 = <strong>1</strong> reste <strong className="text-primary">1</strong></span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground w-6">5.</span>
                      <span>1 ÷ 2 = <strong>0</strong> reste <strong className="text-primary">1</strong></span>
                    </div>
                  </div>
                  <div className="pt-3 border-t">
                    <p className="text-sm text-muted-foreground">
                      Lecture de bas en haut : <strong className="text-primary">1 1 0 0 1</strong> → <strong className="text-green-600 dark:text-green-400">11001₂</strong>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold mb-4">
              Tout pour maîtriser le binaire
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Des outils pédagogiques conçus pour rendre l'apprentissage du système binaire intuitif et motivant.
            </motion.p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-border/50 group">
                  <CardContent className="p-6">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold mb-4">
              Comment ça marche ?
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-muted-foreground text-lg max-w-2xl mx-auto">
              En trois étapes simples, le binaire n'aura plus de secrets pour vous.
            </motion.p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                step: "01",
                icon: <Cpu className="h-8 w-8" />,
                title: "Entrez un nombre",
                desc: "Tapez un nombre décimal ou binaire dans le convertisseur.",
              },
              {
                step: "02",
                icon: <Sparkles className="h-8 w-8" />,
                title: "Visualisez les étapes",
                desc: "Chaque étape du calcul est affichée avec des animations claires.",
              },
              {
                step: "03",
                icon: <Trophy className="h-8 w-8" />,
                title: "Pratiquez et progressez",
                desc: "Entraînez-vous avec des exercices et suivez votre progression.",
              },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInUp} className="text-center">
                <div className="relative inline-block mb-6">
                  <div className="h-20 w-20 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                    {item.icon}
                  </div>
                  <span className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                    {item.step}
                  </span>
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold mb-4">
              Ce qu'en disent les étudiants
            </motion.h2>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {testimonials.map((t, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                        {t.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.role}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      &ldquo;{t.text}&rdquo;
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Prêt à maîtriser le binaire ?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
              Commencez dès maintenant et découvrez une nouvelle façon d'apprendre le système binaire.
            </p>
            <Button
              size="lg"
              className="text-base px-10 py-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              onClick={() => setCurrentSection("dec2bin")}
            >
              Démarrer maintenant
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
              <Zap className="h-3 w-3 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold">BinMaster</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © 2025 BinMaster — Application éducative de conversion binaire
          </p>
        </div>
      </footer>
    </div>
  );
}
