"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  History,
  Trash2,
  ArrowRightLeft,
  Binary,
  Clock,
  Hash,
  Monitor,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppStore, HistoryItem } from "@/lib/store";
import { toast } from "sonner";

export function HistorySection() {
  const { history, clearHistory } = useAppStore();

  const handleClearHistory = () => {
    clearHistory();
    toast.success("Historique effacé");
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">Historique</h1>
          <p className="text-muted-foreground">
            Toutes vos conversions précédentes.
          </p>
        </div>
        {history.length > 0 && (
          <Button variant="outline" size="sm" onClick={handleClearHistory} className="text-destructive">
            <Trash2 className="h-4 w-4 mr-1" />
            Effacer
          </Button>
        )}
      </motion.div>

      {history.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-muted/30">
            <CardContent className="p-8 text-center">
              <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Aucun historique</h3>
              <p className="text-sm text-muted-foreground">
                Effectuez des conversions pour les voir apparaître ici.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto pr-1">
          {history.map((item: HistoryItem, i: number) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div
                        className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${
                          item.type === "dec2bin"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "bg-orange-500/10 text-orange-600 dark:text-orange-400"
                        }`}
                      >
                        {item.type === "dec2bin" ? (
                          <ArrowRightLeft className="h-5 w-5" />
                        ) : (
                          <Binary className="h-5 w-5" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono font-semibold text-sm flex items-center gap-1">
                            {item.type === "dec2bin" ? (
                              <><Hash className="h-3 w-3" />{item.input}<sub className="text-[10px] text-muted-foreground">10</sub></>
                            ) : (
                              <><Monitor className="h-3 w-3" />{item.input}<sub className="text-[10px] text-muted-foreground">2</sub></>
                            )}
                          </span>
                          <span className="text-muted-foreground">→</span>
                          <span className="font-mono font-semibold text-sm flex items-center gap-1">
                            {item.type === "dec2bin" ? (
                              <><Monitor className="h-3 w-3" />{item.output}<sub className="text-[10px] text-muted-foreground">2</sub></>
                            ) : (
                              <><Hash className="h-3 w-3" />{item.output}<sub className="text-[10px] text-muted-foreground">10</sub></>
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                            {item.type === "dec2bin" ? "Déc → Bin" : "Bin → Déc"}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(item.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
