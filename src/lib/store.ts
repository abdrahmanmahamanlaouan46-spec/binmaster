import { create } from "zustand";
import { calculateLevel, BADGES, getXpForExercise } from "@/lib/conversions";

export type AppSection =
  | "landing"
  | "dashboard"
  | "dec2bin"
  | "bin2dec"
  | "training"
  | "history"
  | "theory"
  | "progress";

export interface HistoryItem {
  id: string;
  type: "dec2bin" | "bin2dec";
  input: string;
  output: string;
  steps: string;
  createdAt: string;
}

export interface ProgressData {
  totalExercises: number;
  correctAnswers: number;
  streak: number;
  bestStreak: number;
  level: number;
  xp: number;
  badges: string[];
  dec2binCount: number;
  bin2decCount: number;
  hardCorrect: number;
}

export interface ExerciseData {
  type: "dec2bin" | "bin2dec";
  difficulty: "easy" | "medium" | "hard";
  question: string;
  answer: string;
  hint: string;
}

interface AppState {
  currentSection: AppSection;
  setCurrentSection: (section: AppSection) => void;

  // History
  history: HistoryItem[];
  setHistory: (history: HistoryItem[]) => void;
  addToHistory: (item: HistoryItem) => void;
  clearHistory: () => void;

  // Progress
  progress: ProgressData;
  setProgress: (progress: ProgressData) => void;
  updateProgress: (isCorrect: boolean, difficulty: string, type: string) => void;

  // Training
  currentExercise: ExerciseData | null;
  setCurrentExercise: (exercise: ExerciseData | null) => void;
  exerciseAnswer: string;
  setExerciseAnswer: (answer: string) => void;
  showHint: boolean;
  setShowHint: (show: boolean) => void;
  exerciseFeedback: { isCorrect: boolean; message: string } | null;
  setExerciseFeedback: (feedback: { isCorrect: boolean; message: string } | null) => void;

  // Sidebar
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const defaultProgress: ProgressData = {
  totalExercises: 0,
  correctAnswers: 0,
  streak: 0,
  bestStreak: 0,
  level: 1,
  xp: 0,
  badges: [],
  dec2binCount: 0,
  bin2decCount: 0,
  hardCorrect: 0,
};

// localStorage helpers
const STORAGE_KEYS = {
  HISTORY: "binmaster-history",
  PROGRESS: "binmaster-progress",
};

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return fallback;
    return JSON.parse(stored) as T;
  } catch {
    return fallback;
  }
}

function saveToStorage(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable
  }
}

// Lazy initialization — only reads localStorage on first use (client-side)
let _historyLoaded = false;
let _progressLoaded = false;

function getStoredHistory(): HistoryItem[] {
  if (_historyLoaded) return [];
  _historyLoaded = true;
  return loadFromStorage<HistoryItem[]>(STORAGE_KEYS.HISTORY, []);
}

function getStoredProgress(): ProgressData {
  if (_progressLoaded) return defaultProgress;
  _progressLoaded = true;
  return loadFromStorage<ProgressData>(STORAGE_KEYS.PROGRESS, defaultProgress);
}

export const useAppStore = create<AppState>((set, get) => ({
  currentSection: "landing",
  setCurrentSection: (section) => set({ currentSection: section }),

  // History — lazy-loaded from localStorage
  history: getStoredHistory(),
  setHistory: (history) => {
    set({ history });
    saveToStorage(STORAGE_KEYS.HISTORY, history);
  },
  addToHistory: (item) => {
    const newHistory = [item, ...get().history].slice(0, 100);
    set({ history: newHistory });
    saveToStorage(STORAGE_KEYS.HISTORY, newHistory);
  },
  clearHistory: () => {
    set({ history: [] });
    saveToStorage(STORAGE_KEYS.HISTORY, []);
  },

  // Progress — lazy-loaded from localStorage
  progress: getStoredProgress(),
  setProgress: (progress) => {
    set({ progress });
    saveToStorage(STORAGE_KEYS.PROGRESS, progress);
  },
  updateProgress: (isCorrect, difficulty, type) => {
    const { progress } = get();

    const xpGained = getXpForExercise(
      (difficulty as "easy" | "medium" | "hard") || "easy",
      isCorrect
    );
    const newXp = progress.xp + xpGained;
    const newLevel = calculateLevel(newXp);
    const newTotal = progress.totalExercises + 1;
    const newCorrect = progress.correctAnswers + (isCorrect ? 1 : 0);
    const newStreak = isCorrect ? progress.streak + 1 : 0;
    const newBestStreak = Math.max(progress.bestStreak, newStreak);
    const newDec2Bin = progress.dec2binCount + (type === "dec2bin" ? 1 : 0);
    const newBin2Dec = progress.bin2decCount + (type === "bin2dec" ? 1 : 0);
    const newHardCorrect =
      progress.hardCorrect + (isCorrect && difficulty === "hard" ? 1 : 0);

    const stats = {
      totalExercises: newTotal,
      correctAnswers: newCorrect,
      bestStreak: newBestStreak,
      level: newLevel,
      hardCorrect: newHardCorrect,
    };

    const newBadges = BADGES.filter(
      (badge) => !progress.badges.includes(badge.id) && badge.condition(stats)
    ).map((b) => b.id);

    const allBadges = [...progress.badges, ...newBadges];
    const updated: ProgressData = {
      totalExercises: newTotal,
      correctAnswers: newCorrect,
      streak: newStreak,
      bestStreak: newBestStreak,
      level: newLevel,
      xp: newXp,
      badges: allBadges,
      dec2binCount: newDec2Bin,
      bin2decCount: newBin2Dec,
      hardCorrect: newHardCorrect,
    };

    set({ progress: updated });
    saveToStorage(STORAGE_KEYS.PROGRESS, updated);
  },

  // Training
  currentExercise: null,
  setCurrentExercise: (exercise) => set({ currentExercise: exercise }),
  exerciseAnswer: "",
  setExerciseAnswer: (answer) => set({ exerciseAnswer: answer }),
  showHint: false,
  setShowHint: (show) => set({ showHint: show }),
  exerciseFeedback: null,
  setExerciseFeedback: (feedback) => set({ exerciseFeedback: feedback }),

  // Sidebar
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));
