"use client";

import React, { useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { Navigation } from "@/components/shared/Navigation";
import { LandingPage } from "@/components/sections/LandingPage";
import { Dashboard } from "@/components/sections/Dashboard";
import { Dec2BinConverter } from "@/components/sections/Dec2BinConverter";
import { Bin2DecConverter } from "@/components/sections/Bin2DecConverter";
import { TrainingMode } from "@/components/sections/TrainingMode";
import { HistorySection } from "@/components/sections/HistorySection";
import { TheorySection } from "@/components/sections/TheorySection";
import { ProgressSection } from "@/components/sections/ProgressSection";
import { AIAssistant } from "@/components/shared/AIAssistant";

function SectionRenderer() {
  const { currentSection } = useAppStore();

  switch (currentSection) {
    case "landing":
      return <LandingPage />;
    case "dashboard":
      return <Dashboard />;
    case "dec2bin":
      return <Dec2BinConverter />;
    case "bin2dec":
      return <Bin2DecConverter />;
    case "training":
      return <TrainingMode />;
    case "history":
      return <HistorySection />;
    case "theory":
      return <TheorySection />;
    case "progress":
      return <ProgressSection />;
    default:
      return <LandingPage />;
  }
}

export default function HomePage() {
  const { currentSection, setProgress, setHistory } = useAppStore();

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [progressRes, historyRes] = await Promise.all([
          fetch("/api/progress"),
          fetch("/api/history"),
        ]);
        const progressData = await progressRes.json();
        const historyData = await historyRes.json();
        setProgress(progressData);
        setHistory(historyData);
      } catch {
        // Use default state
      }
    };
    loadData();
  }, [setProgress, setHistory]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      {/* Main content area - offset for mobile top bar and desktop sidebar */}
      <main className="flex-1 md:ml-64 pt-16 md:pt-0">
        <SectionRenderer />
      </main>
      <AIAssistant />
    </div>
  );
}
