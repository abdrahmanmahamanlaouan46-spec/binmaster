"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Monitor,
  Hash,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";
import { Bin2DecStep, getBitVisualization } from "@/lib/conversions";

export function Bin2DecConverter() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<{
    input: string;
    output: string;
    steps: Bin2DecStep[];
    explanation: string[];
  } | null>(null);
  const [error, setError] = useState("");
  const [showSteps, setShowSteps] = useState(true);
  const [animatedStep, setAnimatedStep] = useState(-1);
  const [isConverting, setIsConverting] = useState(false);
  const { addToHistory } = useAppStore();

  const handleConvert = async () => {
    setError("");
    setResult(null);
    setAnimatedStep(-1);

    const binary = input.trim();
    if (!/^[01]+$/.test(binary) || binary.length > 20) {
      setError("Veuillez entrer un nombre binaire valide (0 et 1 uniquement, max 20 bits)");
      return;
    }

    setIsConverting(true);

    try {
      const res = await fetch("/api/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "bin2dec", input: binary }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      setResult(data);

      // Animate steps
      for (let i = 0; i < data.steps.length; i++) {
        await new Promise((r) => setTimeout(r, 300));
        setAnimatedStep(i);
      }

      // Save to history
      try {
        await fetch("/api/history", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "bin2dec",
            input: data.input,
            output: data.output,
            steps: data.steps,
          }),
        });
        addToHistory({
          id: Date.now().toString(),
          type: "bin2dec",
          input: data.input,
          output: data.output,
          steps: JSON.stringify(data.steps),
          createdAt: new Date().toISOString(),
        });
      } catch {
        // Silent fail
      }
    } catch {
      setError("Erreur de connexion au serveur");
    } finally {
      setIsConverting(false);
    }
  };

  const handleReset = () => {
    setInput("");
    setResult(null);
    setError("");
    setAnimatedStep(-1);
  };

  const bitVis = result ? getBitVisualization(parseInt(result.output, 10)) : null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold mb-1">Binaire → Décimal</h1>
        <p className="text-muted-foreground">
          Entrez un nombre binaire et visualisez chaque étape de la conversion en décimal.
        </p>
      </motion.div>

      {/* Input Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <div className="relative">
                  <Monitor className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Entrez un nombre binaire (ex: 11001)"
                    value={input}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^01]/g, "");
                      setInput(val);
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleConvert()}
                    className="pl-10 text-lg h-12 font-mono"
                    maxLength={20}
                  />
                </div>
              </div>
              <Button
                onClick={handleConvert}
                disabled={isConverting || !input}
                className="h-12 px-6"
                size="lg"
              >
                {isConverting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <RotateCcw className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <>
                    Convertir
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
              {result && (
                <Button variant="outline" onClick={handleReset} className="h-12">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              )}
            </div>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-destructive text-sm mt-2"
              >
                {error}
              </motion.p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Result Card */}
            <Card className="border-2 border-orange-500/20 bg-orange-500/5">
              <CardContent className="p-6">
                <div className="flex items-center justify-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2 px-5 py-3 rounded-xl bg-background shadow-sm">
                    <Monitor className="h-5 w-5 text-muted-foreground" />
                    <span className="font-mono font-bold text-3xl">{result.input}</span>
                    <sub className="text-xs text-muted-foreground">2</sub>
                  </div>
                  <ArrowRight className="h-6 w-6 text-orange-500" />
                  <div className="flex items-center gap-2 px-5 py-3 rounded-xl bg-orange-500/10 shadow-sm">
                    <Hash className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    <span className="font-mono font-bold text-3xl text-orange-600 dark:text-orange-400">
                      {result.output}
                    </span>
                    <sub className="text-xs text-orange-600 dark:text-orange-400">10</sub>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Steps */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-yellow-500" />
                    Étapes de la conversion
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSteps(!showSteps)}
                  >
                    {showSteps ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </div>
              </CardHeader>
              {showSteps && (
                <CardContent className="space-y-3">
                  {/* Position table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-3 text-muted-foreground font-medium">Bit</th>
                          <th className="text-center py-2 px-3 text-muted-foreground font-medium">Position</th>
                          <th className="text-center py-2 px-3 text-muted-foreground font-medium">Puissance de 2</th>
                          <th className="text-center py-2 px-3 text-muted-foreground font-medium">Valeur</th>
                          <th className="text-center py-2 px-3 text-muted-foreground font-medium">Total cumulé</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.steps.map((step: Bin2DecStep, i: number) => (
                          <motion.tr
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={i <= animatedStep ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className={`border-b last:border-0 ${i <= animatedStep ? "" : "invisible"}`}
                          >
                            <td className="py-2 px-3">
                              <Badge variant={step.bit === "1" ? "default" : "secondary"} className="font-mono">
                                {step.bit}
                              </Badge>
                            </td>
                            <td className="py-2 px-3 text-center font-mono">{step.position}</td>
                            <td className="py-2 px-3 text-center font-mono">
                              2{superscriptDisplay(step.position)} = {step.powerOf2}
                            </td>
                            <td className="py-2 px-3 text-center font-mono font-semibold">
                              {step.bit} × {step.powerOf2} = <span className={step.value > 0 ? "text-primary" : "text-muted-foreground"}>{step.value}</span>
                            </td>
                            <td className="py-2 px-3 text-center font-mono">{step.runningTotal}</td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Explanation */}
                  <div className="pt-4 border-t space-y-2">
                    <p className="text-sm font-medium text-muted-foreground mb-2">💡 Explication :</p>
                    {result.explanation.map((line: string, i: number) => (
                      <motion.p
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 + i * 0.15 }}
                        className="text-sm font-mono"
                      >
                        {line}
                      </motion.p>
                    ))}
                  </div>

                  {/* Tip */}
                  <div className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <p className="text-sm text-blue-700 dark:text-blue-400">
                      💡 <strong>Astuce :</strong> Seuls les bits à 1 contribuent à la somme. Les bits à 0 peuvent être ignorés dans le calcul !
                    </p>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Bit Visualization */}
            {bitVis && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Monitor className="h-4 w-4" />
                    Visualisation des bits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr>
                            {bitVis.powers.map((power, i) => (
                              <th key={i} className="text-center py-2 px-2 text-xs font-medium text-muted-foreground">
                                {power}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            {bitVis.bits.map((bit, i) => (
                              <td key={i} className="text-center py-2 px-2">
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ delay: 0.5 + i * 0.1, type: "spring" }}
                                  className={`inline-flex h-12 w-12 items-center justify-center rounded-lg font-mono font-bold text-xl ${
                                    bit === 1
                                      ? "bg-orange-500 text-white shadow-md"
                                      : "bg-muted text-muted-foreground"
                                  }`}
                                >
                                  {bit}
                                </motion.div>
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="pt-3 border-t">
                      <p className="text-sm text-muted-foreground">
                        {bitVis.values
                          .filter((v) => v > 0)
                          .map((v, i, arr) => (
                            <span key={i}>
                              <span className="font-mono font-semibold text-foreground">{v}</span>
                              {i < arr.filter((v) => v > 0).length - 1 && " + "}
                            </span>
                          ))}
                        {" = "}
                        <span className="font-mono font-bold text-orange-600 dark:text-orange-400">{bitVis.total}</span>
                        <sub className="text-xs text-muted-foreground">10</sub>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info card when no result */}
      {!result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-muted/30">
            <CardContent className="p-6 text-center">
              <div className="h-16 w-16 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center mx-auto mb-4">
                <BinaryIcon className="h-8 w-8" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Comment ça fonctionne ?</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Entrez un nombre binaire (composé de 0 et 1) et cliquez sur Convertir. Vous verrez
                comment chaque bit contribue au résultat final avec les puissances de 2.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

function BinaryIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="18" rx="2" />
      <text x="7" y="16" fontSize="10" fill="currentColor" stroke="none">01</text>
      <text x="13" y="16" fontSize="10" fill="currentColor" stroke="none">10</text>
    </svg>
  );
}

function superscriptDisplay(n: number): string {
  const superscripts: Record<string, string> = {
    "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴",
    "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹",
  };
  return n.toString().split("").map((d) => superscripts[d] || d).join("");
}
