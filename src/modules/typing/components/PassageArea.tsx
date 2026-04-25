import React, { useEffect, useRef } from 'react';
import { useTypingStore } from '@/store/useTypingStore';
import { cn } from '@/lib/utils';

/**
 * PassageArea Component
 * Displays the master text for the typing exam.
 * Features: High-visibility highlighting, Responsive scaling, Auto-scroll.
 */
export const PassageArea: React.FC = () => {
  const { passage, typedText, settings } = useTypingStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  const typedWords = typedText.split(/\s+/);
  const words = passage.split(/\s+/);
  const currentWordIdx = typedWords.length - 1;

  // Auto-scroll logic: Keeps the current word centered
  useEffect(() => {
    if (settings.autoScroll && scrollRef.current) {
      const activeElement = scrollRef.current.querySelector('.active-word');
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [typedText, settings.autoScroll]);

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Passage Header */}
      <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Master Text Passage</span>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-indigo-500" />
          <div className="w-2 h-2 rounded-full bg-indigo-300" />
          <div className="w-2 h-2 rounded-full bg-indigo-100" />
        </div>
      </div>

      {/* Scrollable Passage Content */}
      <div 
        ref={scrollRef}
        className={cn(
          "flex-1 p-6 sm:p-8 overflow-y-auto leading-relaxed select-none",
          !settings.autoScroll && "scrollbar-thin scrollbar-thumb-slate-200"
        )}
        style={{ fontSize: 'clamp(1rem, 2vw, 1.5rem)' }} // Responsive font scaling
      >
        <div className="flex flex-wrap gap-x-2 gap-y-3">
          {words.map((word, i) => {
            let statusClass = "text-slate-400 ";
            
            if (settings.highlightMode === 'word') {
              if (i === currentWordIdx) statusClass = "text-indigo-600 bg-indigo-50 px-1 rounded ring-1 ring-indigo-200 active-word font-bold";
              else if (i < currentWordIdx) statusClass = "text-slate-900 opacity-40";
            } 
            else if (settings.highlightMode === 'word_error') {
              if (i < currentWordIdx) {
                statusClass = typedWords[i] === word ? "text-emerald-600" : "text-rose-600 bg-rose-50 px-1 rounded underline decoration-rose-300";
              } else if (i === currentWordIdx) {
                statusClass = "bg-blue-50 text-blue-700 px-1 rounded border-b-2 border-blue-400 active-word font-bold";
              }
            }

            return (
              <span key={i} className={cn("transition-all duration-200", statusClass)}>
                {word}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};
