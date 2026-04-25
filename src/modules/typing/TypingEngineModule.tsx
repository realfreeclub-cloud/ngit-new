import React, { useEffect } from 'react';
import { useTypingStore } from '@/store/useTypingStore';
import { useTimer } from './hooks/useTimer';
import { useTypingEngine } from './hooks/useTypingEngine';

// Components
import { TypingLayout } from './components/TypingLayout';
import { PassageArea } from './components/PassageArea';
import { TypingInput } from './components/TypingInput';
import { LiveDashboard, TimerDisplay } from './components/LiveDashboard';
import { Speedometer } from './components/Speedometer';
import { SettingsManager } from './components/SettingsManager';
import { toast } from 'sonner';

interface TypingEngineModuleProps {
  passage: string;
  config: {
    title: string;
    duration: number;
    backspaceMode?: 'full' | 'word' | 'disabled';
    highlightMode?: 'word' | 'word_error' | 'letter' | 'none';
    wordLimit?: number;
  };
  onComplete: (results: any) => void;
}

/**
 * TypingEngineModule
 * THE MASTER COMPONENT
 * Integrates all phases into a single production-ready typing exam module.
 */
export const TypingEngineModule: React.FC<TypingEngineModuleProps> = ({ 
  passage, 
  config,
  onComplete 
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { 
    setPassage, 
    updateSettings, 
    isFinished, 
    wpm, 
    accuracy, 
    errorCount, 
    typedText,
    settings,
    resetTest,
    isFullScreen
  } = useTypingStore();

  // Initialize Hooks
  const { resetIdleTimer, isIdle } = useTimer();
  useTypingEngine();

  // Handle Native Fullscreen API on the container itself
  useEffect(() => {
    if (!containerRef.current) return;

    if (isFullScreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen().catch(() => {});
      }
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    }
  }, [isFullScreen]);

  // Sync state if user exits fullscreen via ESC key
  useEffect(() => {
    const handleFsChange = () => {
      const isCurrentlyFs = !!document.fullscreenElement;
      if (!isCurrentlyFs && isFullScreen) {
        useTypingStore.setState({ isFullScreen: false });
      }
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, [isFullScreen]);

  // 1. Initial Setup
  useEffect(() => {
    resetTest();
    setPassage(passage);
    updateSettings({
      duration: config.duration,
      backspaceMode: config.backspaceMode || 'full',
      highlightMode: config.highlightMode || 'word',
      wordLimit: config.wordLimit || 0,
    });
  }, [passage, config]);

  // 2. Handle Completion
  useEffect(() => {
    if (isFinished) {
      toast.success("Examination Completed!");
      onComplete({
        wpm,
        accuracy,
        errorCount,
        submittedText: typedText,
        timeTaken: settings.duration * 60,
      });
    }
  }, [isFinished]);

  return (
    <div ref={containerRef} className="w-full h-full bg-white">
      <TypingLayout
        timerSlot={<TimerDisplay />}
        passageSlot={<PassageArea />}
        typingSlot={<TypingInput onKeyStroke={resetIdleTimer} />}
        statsSlot={
          <div className="space-y-6">
            <Speedometer />
            <LiveDashboard />
            {isIdle && (
              <div className="bg-amber-100 border border-amber-200 p-4 rounded-2xl animate-bounce">
                <p className="text-amber-800 text-xs font-black text-center uppercase tracking-widest">
                  Timer Paused (Idle Detection)
                </p>
              </div>
            )}
          </div>
        }
        settingsSlot={<SettingsManager />}
      />
    </div>
  );
};
