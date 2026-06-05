"use client";

import React from "react";
import { motion } from "framer-motion";
import { useAppStore, AppSection } from "@/lib/store";
import {
  Home,
  LayoutDashboard,
  ArrowRightLeft,
  Binary,
  Dumbbell,
  History,
  BookOpen,
  Trophy,
  Sun,
  Moon,
  Menu,
  X,
  Zap,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

const navItems: { id: AppSection; label: string; icon: React.ReactNode }[] = [
  { id: "landing", label: "Accueil", icon: <Home className="h-4 w-4" /> },
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
  { id: "dec2bin", label: "Déc → Bin", icon: <ArrowRightLeft className="h-4 w-4" /> },
  { id: "bin2dec", label: "Bin → Déc", icon: <Binary className="h-4 w-4" /> },
  { id: "training", label: "Entraînement", icon: <Dumbbell className="h-4 w-4" /> },
  { id: "history", label: "Historique", icon: <History className="h-4 w-4" /> },
  { id: "theory", label: "Théorie", icon: <BookOpen className="h-4 w-4" /> },
  { id: "progress", label: "Progrès", icon: <Trophy className="h-4 w-4" /> },
];

export function Navigation() {
  const { currentSection, setCurrentSection, sidebarOpen, setSidebarOpen } = useAppStore();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Zap className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg">BinMaster</span>
        </div>
        <div className="flex items-center gap-2">
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        className={`fixed top-0 left-0 z-40 h-full w-64 bg-card border-r border-border flex flex-col transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">BinMaster</h1>
              <p className="text-xs text-muted-foreground">Le binaire simplifié</p>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentSection(item.id);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                currentSection === item.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}

          {/* AI Assistant hint */}
          <div className="mt-4 px-3 py-3 rounded-lg bg-primary/5 border border-primary/10">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold">BinBot IA</span>
            </div>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Assistant intelligent disponible en bas à droite →
            </p>
          </div>
        </nav>

        {/* Theme toggle */}
        <div className="p-4 border-t border-border">
          {mounted && (
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {theme === "dark" ? "Mode clair" : "Mode sombre"}
            </Button>
          )}
        </div>
      </motion.aside>
    </>
  );
}
