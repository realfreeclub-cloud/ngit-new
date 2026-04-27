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
    <div className="flex flex-col h-full bg-[#d9ff66] rounded-3xl border-2 border-black/10 overflow-hidden transition-all focus-within:border-black/30 focus-within:shadow-2xl shadow-lg">
      <div className="px-6 py-4 border-b border-black/5 flex justify-between items-center bg-black/5">
        <span className="text-[10px] font-black text-black/60 uppercase tracking-widest">Type the passage below</span>
        <div className="flex items-center gap-4">
          <div className="flex gap-1">
             <span className="text-[9px] font-black text-black/40">Layout: {settings.language}</span>
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
          "flex-1 p-6 sm:p-10 bg-transparent outline-none resize-none font-bold leading-relaxed transition-all text-black placeholder:text-black/20",
          isFinished ? "opacity-50" : "opacity-100"
        )}
        style={{ fontSize: `calc(${settings.fontSize / 100} * clamp(1.2rem, 2.5vw, 1.8rem))` }} 
      />

      <div className="px-6 py-3 bg-black/5 border-t border-black/5 flex justify-between items-center text-[9px] font-black text-black/60 uppercase tracking-widest">
        <span>Character Count: {typedText.length}</span>
        <span>Backspace Mode: {settings.backspaceMode}</span>
      </div>
    </div>
  );
};
