import { create } from "zustand";

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

  // Progress
  progress: ProgressData;
  setProgress: (progress: ProgressData) => void;

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

export const useAppStore = create<AppState>((set) => ({
  currentSection: "landing",
  setCurrentSection: (section) => set({ currentSection: section }),

  history: [],
  setHistory: (history) => set({ history }),
  addToHistory: (item) =>
    set((state) => ({ history: [item, ...state.history].slice(0, 100) })),

  progress: defaultProgress,
  setProgress: (progress) => set({ progress }),

  currentExercise: null,
  setCurrentExercise: (exercise) => set({ currentExercise: exercise }),
  exerciseAnswer: "",
  setExerciseAnswer: (answer) => set({ exerciseAnswer: answer }),
  showHint: false,
  setShowHint: (show) => set({ showHint: show }),
  exerciseFeedback: null,
  setExerciseFeedback: (feedback) => set({ exerciseFeedback: feedback }),

  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));
