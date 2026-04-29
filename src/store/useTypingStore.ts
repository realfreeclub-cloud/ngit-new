import { create } from 'zustand';

interface TypingSettings {
  language: string;
  duration: number; // minutes
  backspaceMode: 'full' | 'word' | 'disabled';
  highlightMode: 'word' | 'word_error' | 'letter' | 'none';
  autoScroll: boolean;
  wordLimit: number;
  textPosition: 'top' | 'side';
  fontSize: number;
  passageHeight: number;
  showScrollbar: boolean;
  layout: 'English' | 'Remington Gail' | 'Inscript' | 'Phonetic';
}

interface TypingState {
  // Core Metrics
  passage: string;
  typedText: string;
  timeLeft: number; // seconds
  isActive: boolean;
  isFinished: boolean;
  
  // Real-time Stats
  wpm: number;
  rawWpm: number;
  accuracy: number;
  errorCount: number;
  backspaceCount: number;
  currentWordIndex: number;
  isFullScreen: boolean;
  
  // Configuration
  settings: TypingSettings;

  // Actions
  setPassage: (passage: string) => void;
  setTypedText: (text: string) => void;
  updateMetrics: (wpm: number, rawWpm: number, accuracy: number, errors: number, backspaces: number) => void;
  tick: () => void;
  startTest: () => void;
  endTest: () => void;
  resetTest: () => void;
  updateSettings: (settings: Partial<TypingSettings>) => void;
  setCurrentWordIndex: (index: number) => void;
  toggleFullScreen: () => void;
}

const initialSettings: TypingSettings = {
  language: 'English',
  duration: 10,
  backspaceMode: 'full',
  highlightMode: 'word',
  autoScroll: true,
  wordLimit: 0,
  textPosition: 'top',
  fontSize: 100, // percentage
  passageHeight: 50, // percentage of total height
  showScrollbar: true,
  layout: 'English',
};

export const useTypingStore = create<TypingState>((set) => ({
  passage: '',
  typedText: '',
  timeLeft: 600,
  isActive: false,
  isFinished: false,
  wpm: 0,
  rawWpm: 0,
  accuracy: 100,
  errorCount: 0,
  backspaceCount: 0,
  currentWordIndex: 0,
  isFullScreen: false,
  settings: {
    ...initialSettings,
    showScrollbar: true,
  },
  setPassage: (passage) => set({ passage }),

  setTypedText: (typedText) => set({ typedText }),

  updateMetrics: (wpm, rawWpm, accuracy, errorCount, backspaceCount) => 
    set({ wpm, rawWpm, accuracy, errorCount, backspaceCount }),

  tick: () => set((state) => ({ 
    timeLeft: state.timeLeft > 0 ? state.timeLeft - 1 : 0 
  })),

  startTest: () => set({ isActive: true, isFinished: false }),

  endTest: () => set({ isActive: false, isFinished: true }),

  resetTest: () => set((state) => ({
    typedText: '',
    timeLeft: state.settings.duration * 60,
    isActive: false,
    isFinished: false,
    wpm: 0,
    rawWpm: 0,
    accuracy: 100,
    errorCount: 0,
    backspaceCount: 0,
    currentWordIndex: 0,
    isFullScreen: false,
  })),

  updateSettings: (newSettings) => set((state) => ({
    settings: { ...state.settings, ...newSettings },
    timeLeft: newSettings.duration ? newSettings.duration * 60 : state.timeLeft,
  })),

  setCurrentWordIndex: (currentWordIndex) => set({ currentWordIndex }),

  toggleFullScreen: () => set((state) => ({ isFullScreen: !state.isFullScreen })),
}));
