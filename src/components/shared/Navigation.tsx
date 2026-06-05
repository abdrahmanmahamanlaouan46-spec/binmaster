"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Sparkles,
  Zap,
  MoreHorizontal,
  X,
  ChevronRight,
  GraduationCap,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// Navigation items grouped by category
const mainNavItems: { id: AppSection; label: string; icon: React.ReactNode; description: string }[] = [
  { id: "landing", label: "Accueil", icon: <Home className="h-5 w-5" />, description: "Page d'accueil" },
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" />, description: "Vue d'ensemble" },
  { id: "dec2bin", label: "Déc → Bin", icon: <ArrowRightLeft className="h-5 w-5" />, description: "Conversion décimal vers binaire" },
  { id: "bin2dec", label: "Bin → Déc", icon: <Binary className="h-5 w-5" />, description: "Conversion binaire vers décimal" },
];

const learnNavItems: { id: AppSection; label: string; icon: React.ReactNode; description: string }[] = [
  { id: "training", label: "Entraînement", icon: <Dumbbell className="h-5 w-5" />, description: "Exercices pratiques" },
  { id: "theory", label: "Théorie", icon: <BookOpen className="h-5 w-5" />, description: "Cours et explications" },
];

const statsNavItems: { id: AppSection; label: string; icon: React.ReactNode; description: string }[] = [
  { id: "history", label: "Historique", icon: <History className="h-5 w-5" />, description: "Conversions passées" },
  { id: "progress", label: "Progrès", icon: <Trophy className="h-5 w-5" />, description: "Badges et statistiques" },
];

// Mobile bottom tab items (5 max)
const mobileTabItems: { id: AppSection; label: string; icon: React.ReactNode }[] = [
  { id: "landing", label: "Accueil", icon: <Home className="h-5 w-5" /> },
  { id: "dec2bin", label: "Convertir", icon: <ArrowRightLeft className="h-5 w-5" /> },
  { id: "training", label: "S'entraîner", icon: <Dumbbell className="h-5 w-5" /> },
  { id: "theory", label: "Théorie", icon: <BookOpen className="h-5 w-5" /> },
  { id: "progress", label: "Progrès", icon: <BarChart3 className="h-5 w-5" /> },
];

// Map for quick lookup - maps mobile tab IDs to highlight the right tab
function getActiveTabId(section: AppSection): AppSection {
  // If user is on bin2dec, highlight the "Convertir" tab (dec2bin)
  if (section === "bin2dec") return "dec2bin";
  // If user is on dashboard or history, highlight "Accueil" or "Progrès"
  if (section === "dashboard") return "landing";
  if (section === "history") return "progress";
  return section;
}

export function Navigation() {
  const { currentSection, setCurrentSection, sidebarOpen, setSidebarOpen } = useAppStore();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const activeTab = getActiveTabId(currentSection);

  const navigateTo = (section: AppSection) => {
    setCurrentSection(section);
    setSidebarOpen(false);
    setMoreMenuOpen(false);
  };

  return (
    <>
      {/* ============================================ */}
      {/* MOBILE: Top bar (logo + actions)             */}
      {/* ============================================ */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-b border-border/50">
        <div className="px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-sm">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <span className="font-bold text-base leading-tight block">BinMaster</span>
              <span className="text-[10px] text-muted-foreground leading-tight">Le binaire simplifié</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-lg"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            )}
            {/* More menu - opens sheet with all features */}
            <Sheet open={moreMenuOpen} onOpenChange={setMoreMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] p-0">
                <SheetHeader className="p-4 pb-2 border-b">
                  <SheetTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    Toutes les fonctionnalités
                  </SheetTitle>
                </SheetHeader>
                <div className="p-3 space-y-4 overflow-y-auto">
                  {/* Main features */}
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground px-3 mb-2">
                      Principal
                    </p>
                    <div className="space-y-0.5">
                      {mainNavItems.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => navigateTo(item.id)}
                          className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                            currentSection === item.id
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "hover:bg-accent"
                          }`}
                        >
                          <span className={currentSection === item.id ? "text-primary-foreground" : "text-primary"}>
                            {item.icon}
                          </span>
                          <div className="text-left">
                            <p className="font-semibold text-sm">{item.label}</p>
                            <p className={`text-[11px] ${currentSection === item.id ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                              {item.description}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Learning */}
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground px-3 mb-2">
                      Apprentissage
                    </p>
                    <div className="space-y-0.5">
                      {learnNavItems.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => navigateTo(item.id)}
                          className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                            currentSection === item.id
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "hover:bg-accent"
                          }`}
                        >
                          <span className={currentSection === item.id ? "text-primary-foreground" : "text-primary"}>
                            {item.icon}
                          </span>
                          <div className="text-left">
                            <p className="font-semibold text-sm">{item.label}</p>
                            <p className={`text-[11px] ${currentSection === item.id ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                              {item.description}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground px-3 mb-2">
                      Statistiques
                    </p>
                    <div className="space-y-0.5">
                      {statsNavItems.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => navigateTo(item.id)}
                          className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                            currentSection === item.id
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "hover:bg-accent"
                          }`}
                        >
                          <span className={currentSection === item.id ? "text-primary-foreground" : "text-primary"}>
                            {item.icon}
                          </span>
                          <div className="text-left">
                            <p className="font-semibold text-sm">{item.label}</p>
                            <p className={`text-[11px] ${currentSection === item.id ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                              {item.description}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* AI Assistant hint */}
                  <div className="mx-1 px-3 py-3 rounded-xl bg-primary/5 border border-primary/15">
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <span className="text-xs font-bold">BinBot IA</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Assistant IA disponible via le bouton violet en bas à droite de l&apos;écran 💬
                    </p>
                  </div>

                  {/* Theme toggle in menu */}
                  {mounted && (
                    <div className="px-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start gap-2 rounded-xl"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                      >
                        {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                        {theme === "dark" ? "Mode clair" : "Mode sombre"}
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* MOBILE: Bottom Tab Bar (always visible)      */}
      {/* ============================================ */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border/50 safe-area-bottom">
        <div className="flex items-center justify-around px-1 py-1">
          {mobileTabItems.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => navigateTo(tab.id)}
                className="flex flex-col items-center justify-center py-1.5 px-2 min-w-[56px] relative transition-all duration-200"
              >
                <motion.div
                  className="relative"
                  whileTap={{ scale: 0.9 }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="mobileTabIndicator"
                      className="absolute -inset-2 rounded-xl bg-primary/10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  <span className={`relative z-10 transition-colors duration-200 ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}>
                    {tab.icon}
                  </span>
                </motion.div>
                <span className={`text-[10px] mt-0.5 font-semibold transition-colors duration-200 ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}>
                  {tab.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="mobileTabDot"
                    className="h-1 w-1 rounded-full bg-primary mt-0.5"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ============================================ */}
      {/* DESKTOP: Improved Sidebar                    */}
      {/* ============================================ */}
      <aside className="hidden md:flex fixed top-0 left-0 z-40 h-full w-64 bg-card border-r border-border flex-col">
        {/* Logo */}
        <div className="p-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-md">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">BinMaster</h1>
              <p className="text-[11px] text-muted-foreground">Le binaire simplifié</p>
            </div>
          </div>
        </div>

        {/* Nav items with groups */}
        <nav className="flex-1 p-3 space-y-4 overflow-y-auto">
          {/* Main section */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground px-3 mb-1.5">
              Principal
            </p>
            <div className="space-y-0.5">
              {mainNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigateTo(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    currentSection === item.id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-foreground/70 hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <span className={`transition-colors ${currentSection === item.id ? "text-primary-foreground" : "text-primary group-hover:text-primary"}`}>
                    {item.icon}
                  </span>
                  <div className="text-left flex-1 min-w-0">
                    <p className="font-semibold text-sm leading-tight">{item.label}</p>
                  </div>
                  {currentSection !== item.id && (
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Learning section */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground px-3 mb-1.5">
              Apprentissage
            </p>
            <div className="space-y-0.5">
              {learnNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigateTo(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    currentSection === item.id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-foreground/70 hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <span className={`transition-colors ${currentSection === item.id ? "text-primary-foreground" : "text-primary group-hover:text-primary"}`}>
                    {item.icon}
                  </span>
                  <div className="text-left flex-1 min-w-0">
                    <p className="font-semibold text-sm leading-tight">{item.label}</p>
                  </div>
                  {currentSection !== item.id && (
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Stats section */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground px-3 mb-1.5">
              Statistiques
            </p>
            <div className="space-y-0.5">
              {statsNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigateTo(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    currentSection === item.id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-foreground/70 hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <span className={`transition-colors ${currentSection === item.id ? "text-primary-foreground" : "text-primary group-hover:text-primary"}`}>
                    {item.icon}
                  </span>
                  <div className="text-left flex-1 min-w-0">
                    <p className="font-semibold text-sm leading-tight">{item.label}</p>
                  </div>
                  {currentSection !== item.id && (
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* AI Assistant card */}
          <div className="px-1 pt-2">
            <div className="px-3 py-3 rounded-xl bg-gradient-to-br from-primary/8 to-primary/3 border border-primary/15">
              <div className="flex items-center gap-2 mb-1.5">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-xs font-bold">BinBot IA</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Clique sur le bouton violet 💬 en bas à droite pour poser tes questions !
              </p>
            </div>
          </div>
        </nav>

        {/* Theme toggle */}
        <div className="p-4 border-t border-border">
          {mounted && (
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2 rounded-xl"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {theme === "dark" ? "Mode clair" : "Mode sombre"}
            </Button>
          )}
        </div>
      </aside>
    </>
  );
}
