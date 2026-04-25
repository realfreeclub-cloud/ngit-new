import React from 'react';
import { useTypingStore } from '@/store/useTypingStore';
import { cn } from '@/lib/utils';

/**
 * TypingInput Component
 * The main interactive zone for the typing exam.
 * Features: Backspace restriction, Keystroke logging, Responsive sizing.
 */
export const TypingInput: React.FC<{ onKeyStroke: () => void }> = ({ onKeyStroke }) => {
  const { 
    typedText, 
    setTypedText, 
    settings, 
    isActive, 
    isFinished,
    startTest 
  } = useTypingStore();

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isFinished) return;
    if (!isActive && e.target.value.length > 0) {
      startTest(); // Auto-start on first key
    }

    const val = e.target.value;
    const isDeletion = val.length < typedText.length;

    // 1. BACKSPACE RESTRICTION LOGIC
    if (isDeletion) {
      if (settings.backspaceMode === 'disabled') return;
      if (settings.backspaceMode === 'word') {
        // Prevent deleting the space that committed the previous word
        if (typedText.endsWith(' ') && !val.endsWith(' ')) return;
      }
    }

    // 2. WORD LIMIT LOGIC
    if (settings.wordLimit > 0 && !isDeletion) {
      const currentWordCount = val.trim().split(/\s+/).length;
      if (currentWordCount > settings.wordLimit) return;
    }

    setTypedText(val);
    onKeyStroke(); // Trigger timer reset / activity check
  };

  return (
    <div className="flex flex-col h-full bg-indigo-50/30 rounded-3xl border-2 border-indigo-100 overflow-hidden transition-all focus-within:border-indigo-400 focus-within:shadow-xl focus-within:shadow-indigo-500/10">
      <div className="px-6 py-4 border-b border-indigo-100 flex justify-between items-center bg-white/50">
        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Type the passage below</span>
        <div className="flex items-center gap-4">
          <div className="flex gap-1">
             <span className="text-[9px] font-bold text-slate-400">Layout: {settings.language}</span>
          </div>
        </div>
      </div>

      <textarea
        value={typedText}
        onChange={handleInputChange}
        disabled={isFinished}
        spellCheck={false}
        autoFocus
        placeholder="Start typing here to begin the clock..."
        className={cn(
          "flex-1 p-6 sm:p-8 bg-transparent outline-none resize-none font-medium leading-relaxed transition-all",
          isFinished ? "opacity-50" : "opacity-100"
        )}
        style={{ fontSize: 'clamp(1rem, 2vw, 1.5rem)' }} // Match passage scaling
      />

      <div className="px-6 py-3 bg-white/50 border-t border-indigo-50 flex justify-between items-center text-[9px] font-bold text-slate-400 uppercase tracking-widest">
        <span>Character Count: {typedText.length}</span>
        <span>Backspace: {settings.backspaceMode}</span>
      </div>
    </div>
  );
};
