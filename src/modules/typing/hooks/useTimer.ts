import { useEffect, useRef, useState } from 'react';
import { useTypingStore } from '@/store/useTypingStore';

/**
 * Custom hook to manage the Typing Exam Timer
 * Features: Countdown, Auto-stop, and 5-second Idle Pause
 */
export const useTimer = (continuous: boolean = false) => {
  const { 
    isActive, 
    timeLeft, 
    tick, 
    endTest, 
    isFinished 
  } = useTypingStore();
  
  const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isIdle, setIsIdle] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    // Start the countdown interval if test is active
    // In continuous mode, we ignore the isIdle state
    const shouldTick = isActive && !isFinished && (continuous ? true : !isIdle);

    if (shouldTick) {
      interval = setInterval(() => {
        if (timeLeft <= 1) {
          endTest();
          if (interval) clearInterval(interval);
        } else {
          tick();
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isFinished, isIdle, timeLeft, tick, endTest, continuous]);

  /**
   * Resets the idle timer. 
   * Should be called on every keystroke in the TypingBox.
   */
  const resetIdleTimer = () => {
    if (continuous) return; // No idle tracking in continuous mode

    setIsIdle(false);
    
    if (idleTimeoutRef.current) {
      clearTimeout(idleTimeoutRef.current);
    }

    // Set idle to true if no activity for 5 seconds
    idleTimeoutRef.current = setTimeout(() => {
      if (isActive && !isFinished) {
        setIsIdle(true);
      }
    }, 5000);
  };

  return {
    isIdle,
    resetIdleTimer
  };
};
