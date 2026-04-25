import { useEffect } from 'react';
import { useTypingStore } from '@/store/useTypingStore';
import { calculateMetrics } from '../utils/calculations';

/**
 * useTypingEngine Hook
 * Orchestrates real-time calculations by bridging the store with the utility layer.
 */
export const useTypingEngine = () => {
  const { 
    typedText, 
    passage, 
    timeLeft, 
    settings, 
    isActive, 
    isFinished,
    updateMetrics 
  } = useTypingStore();

  useEffect(() => {
    if (isActive && !isFinished && typedText.length > 0) {
      const elapsedSeconds = (settings.duration * 60) - timeLeft;
      const elapsedMinutes = elapsedSeconds / 60;

      // Run core calculations
      const metrics = calculateMetrics(typedText, passage, elapsedMinutes);

      // Update the global store with live stats
      updateMetrics(
        metrics.wpm,
        metrics.rawWpm,
        metrics.accuracy,
        metrics.errorCount,
        0 // Backspace count tracking can be added here if needed
      );
    }
  }, [typedText, timeLeft, isActive, isFinished, passage, settings.duration, updateMetrics]);
};
