"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  ChevronRight,
  Lightbulb,
  Zap,
  Binary,
  ArrowRight,
  Hash,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";

const sections = [
  {
    title: "Qu'est-ce que le système binaire ?",
    content: `Le système binaire est un système de numération en base 2. Contrairement au système décimal (base 10) que nous utilisons au quotidien avec les chiffres 0 à 9, le binaire n'utilise que deux chiffres : 0 et 1.

C'est le langage fondamental des ordinateurs. Chaque 0 ou 1 est appelé un "bit" (contraction de binary digit). Les ordinateurs utilisent le binaire car ils fonctionnent avec des signaux électriques qui ne peuvent être que dans deux états : allumé (1) ou éteint (0).`,
    example: null,
  },
  {
    title: "Comprendre les puissances de 2",
    content: `Les puissances de 2 sont la clé du système binaire. Chaque position dans un nombre binaire représente une puissance de 2, en partant de la droite :`,
    example: {
      headers: ["Position", "Puissance", "Valeur"],
      rows: [
        ["0", "2⁰", "1"],
        ["1", "2¹", "2"],
        ["2", "2²", "4"],
        ["3", "2³", "8"],
        ["4", "2⁴", "16"],
        ["5", "2⁵", "32"],
        ["6", "2⁶", "64"],
        ["7", "2⁷", "128"],
        ["8", "2⁸", "256"],
      ],
    },
  },
  {
    title: "Conversion Décimal → Binaire (Méthode des divisions)",
    content: `Pour convertir un nombre décimal en binaire, on divise successivement par 2 et on note les restes. Le résultat se lit de bas en haut.

Cette méthode est simple et systématique :
1. Diviser le nombre par 2
2. Noter le reste (0 ou 1)
3. Prendre le quotient comme nouveau nombre
4. Répéter jusqu'à obtenir un quotient de 0
5. Lire les restes de bas en haut`,
    example: {
      title: "Exemple : Convertir 13 en binaire",
      headers: ["Division", "Quotient", "Reste"],
      rows: [
        ["13 ÷ 2", "6", "1"],
        ["6 ÷ 2", "3", "0"],
        ["3 ÷ 2", "1", "1"],
        ["1 ÷ 2", "0", "1"],
      ],
      result: "Lecture de bas en haut : 1101₂",
    },
  },
  {
    title: "Conversion Binaire → Décimal (Méthode des puissances)",
    content: `Pour convertir un nombre binaire en décimal, on multiplie chaque bit par la puissance de 2 correspondant à sa position, puis on additionne tous les résultats.

Les positions se comptent de droite à gauche, en commençant par 0. Le bit le plus à droite est en position 0, le suivant en position 1, etc.`,
    example: {
      title: "Exemple : Convertir 1101 en décimal",
      headers: ["Bit", "Position", "Puissance", "Calcul", "Valeur"],
      rows: [
        ["1", "3", "2³", "1 × 8", "8"],
        ["1", "2", "2²", "1 × 4", "4"],
        ["0", "1", "2¹", "0 × 2", "0"],
        ["1", "0", "2⁰", "1 × 1", "1"],
      ],
      result: "8 + 4 + 0 + 1 = 13₁₀",
    },
  },
  {
    title: "Astuces et raccourcis",
    content: `Voici quelques astuces pour aller plus vite :

• Les nombres impairs se terminent toujours par 1 en binaire
• Les nombres pairs se terminent toujours par 0 en binaire
• Multiplier par 2 en binaire = ajouter un 0 à droite (comme ×10 en décimal)
• 2ⁿ en binaire = 1 suivi de n zéros (ex: 2³ = 1000₂)
• 2ⁿ - 1 en binaire = n fois le chiffre 1 (ex: 2⁴ - 1 = 15 = 1111₂)
• Pour vérifier : recalculez dans l'autre sens !`,
    example: null,
  },
  {
    title: "Le tableau de conversion rapide",
    content: `Ce tableau montre les 16 premiers nombres en décimal et leur équivalent binaire :`,
    example: {
      headers: ["Décimal", "Binaire"],
      rows: Array.from({ length: 16 }, (_, i) => [
        i.toString(),
        i.toString(2).padStart(4, "0"),
      ]),
    },
  },
];

export function TheorySection() {
  const { setCurrentSection } = useAppStore();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold mb-1">Théorie</h1>
        <p className="text-muted-foreground">
          Tout ce que vous devez savoir sur le système binaire.
        </p>
      </motion.div>

      {sections.map((section, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                {section.content}
              </div>

              {section.example && (
                <div className="mt-4">
                  {section.example.title && (
                    <p className="text-sm font-semibold mb-2">{section.example.title}</p>
                  )}
                  <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-muted/50">
                          {section.example.headers.map((h, i) => (
                            <th key={i} className="py-2 px-3 text-left font-medium text-muted-foreground">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {section.example.rows.map((row, i) => (
                          <tr key={i} className="border-t">
                            {row.map((cell, j) => (
                              <td key={j} className="py-2 px-3 font-mono text-sm">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {section.example.result && (
                    <div className="mt-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
                      <p className="text-sm font-mono font-semibold">{section.example.result}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}

      {/* CTA to practice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6 text-center">
            <Lightbulb className="h-10 w-10 text-yellow-500 mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-2">Prêt à pratiquer ?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              La meilleure façon d'apprendre est de pratiquer. Essayez nos exercices interactifs !
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => setCurrentSection("dec2bin")}>
                Déc → Bin
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={() => setCurrentSection("bin2dec")}>
                Bin → Déc
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={() => setCurrentSection("training")}>
                Entraînement
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
