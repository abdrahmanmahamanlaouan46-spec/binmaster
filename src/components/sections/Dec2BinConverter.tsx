"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Save,
  Lightbulb,
  Hash,
  Monitor,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";
import { Dec2BinStep, getBitVisualization } from "@/lib/conversions";
import { toast } from "sonner";

export function Dec2BinConverter() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<{
    input: string;
    output: string;
    steps: Dec2BinStep[];
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

    const decimal = parseInt(input, 10);
    if (isNaN(decimal) || decimal < 0 || decimal > 1048575) {
      setError("Veuillez entrer un nombre décimal valide (0 - 1 048 575)");
      return;
    }

    setIsConverting(true);

    try {
      const res = await fetch("/api/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "dec2bin", input: decimal }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      setResult(data);

      // Animate steps one by one
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
            type: "dec2bin",
            input: data.input,
            output: data.output,
            steps: data.steps,
          }),
        });
        addToHistory({
          id: Date.now().toString(),
          type: "dec2bin",
          input: data.input,
          output: data.output,
          steps: JSON.stringify(data.steps),
          createdAt: new Date().toISOString(),
        });
      } catch {
        // Silent fail for history
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

  const bitVis = result ? getBitVisualization(parseInt(result.input, 10)) : null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl sm:text-3xl font-bold mb-1">Décimal → Binaire</h1>
        <p className="text-muted-foreground">
          Entrez un nombre décimal et visualisez chaque étape de la conversion.
        </p>
      </motion.div>

      {/* Input Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="number"
                    placeholder="Entrez un nombre décimal (ex: 25)"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleConvert()}
                    className="pl-10 text-lg h-12"
                    min={0}
                    max={1048575}
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
            <Card className="border-2 border-emerald-500/20 bg-emerald-500/5">
              <CardContent className="p-6">
                <div className="flex items-center justify-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2 px-5 py-3 rounded-xl bg-background shadow-sm">
                    <Hash className="h-5 w-5 text-muted-foreground" />
                    <span className="font-mono font-bold text-3xl">{result.input}</span>
                    <sub className="text-xs text-muted-foreground">10</sub>
                  </div>
                  <ArrowRight className="h-6 w-6 text-emerald-500" />
                  <div className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500/10 shadow-sm">
                    <Monitor className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    <span className="font-mono font-bold text-3xl text-emerald-600 dark:text-emerald-400">
                      {result.output}
                    </span>
                    <sub className="text-xs text-emerald-600 dark:text-emerald-400">2</sub>
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
                  {/* Division table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-3 text-muted-foreground font-medium">Étape</th>
                          <th className="text-center py-2 px-3 text-muted-foreground font-medium">Dividende</th>
                          <th className="text-center py-2 px-3 text-muted-foreground font-medium">÷ 2</th>
                          <th className="text-center py-2 px-3 text-muted-foreground font-medium">Quotient</th>
                          <th className="text-center py-2 px-3 text-muted-foreground font-medium">Reste</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.steps.map((step: Dec2BinStep, i: number) => (
                          <motion.tr
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={i <= animatedStep ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className={`border-b last:border-0 ${i <= animatedStep ? "" : "invisible"}`}
                          >
                            <td className="py-2 px-3 text-muted-foreground">{step.stepNumber}</td>
                            <td className="py-2 px-3 text-center font-mono font-semibold">{step.dividend}</td>
                            <td className="py-2 px-3 text-center text-muted-foreground">÷ 2</td>
                            <td className="py-2 px-3 text-center font-mono">{step.quotient}</td>
                            <td className="py-2 px-3 text-center">
                              <Badge
                                variant={step.remainder === 1 ? "default" : "secondary"}
                                className="font-mono"
                              >
                                {step.remainder}
                              </Badge>
                            </td>
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

                  {/* Reading direction note */}
                  <div className="mt-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                    <p className="text-sm text-yellow-700 dark:text-yellow-400">
                      ⬆️ <strong>Important :</strong> On lit les restes de bas en haut pour obtenir le résultat binaire !
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
                    {/* Bit table */}
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
                                      ? "bg-primary text-primary-foreground shadow-md"
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

                    {/* Sum breakdown */}
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
                        <span className="font-mono font-bold text-primary">{bitVis.total}</span>
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
              <div className="h-16 w-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <ArrowRight className="h-8 w-8" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Comment ça fonctionne ?</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Entrez un nombre décimal et cliquez sur Convertir. Vous verrez chaque étape de la
                division par 2, les quotients, les restes, et comment lire le résultat binaire de bas en haut.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
