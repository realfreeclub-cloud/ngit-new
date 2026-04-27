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
    <div className="flex flex-col h-full bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
      {/* Passage Header */}
      <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Official Exam Text Passage</span>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <div className="w-2 h-2 rounded-full bg-emerald-700" />
          <div className="w-2 h-2 rounded-full bg-emerald-900" />
        </div>
      </div>

      {/* Scrollable Passage Content */}
      <div 
        ref={scrollRef}
        className={cn(
          "flex-1 p-6 sm:p-10 overflow-y-auto leading-relaxed select-none text-slate-200",
          !settings.autoScroll && "scrollbar-thin scrollbar-thumb-slate-800"
        )}
        style={{ 
          fontSize: `calc(${settings.fontSize / 100} * clamp(1.1rem, 2.2vw, 1.6rem))`, 
          fontWeight: 600 
        }} 
      >
        <div className="flex flex-wrap gap-x-3 gap-y-4">
          {words.map((word, i) => {
            let statusClass = "text-slate-500 ";
            
            if (settings.highlightMode === 'word') {
              if (i === currentWordIdx) statusClass = "text-white bg-indigo-600 px-2 py-0.5 rounded shadow-lg shadow-indigo-500/20 active-word ring-2 ring-indigo-400 font-bold scale-110";
              else if (i < currentWordIdx) statusClass = "text-slate-200 opacity-30";
            } 
            else if (settings.highlightMode === 'word_error') {
              if (i < currentWordIdx) {
                statusClass = typedWords[i] === word ? "text-emerald-400" : "text-rose-400 bg-rose-950/30 px-1 rounded underline decoration-rose-500";
              } else if (i === currentWordIdx) {
                statusClass = "bg-white/10 text-white px-2 py-0.5 rounded border-b-2 border-white/50 active-word font-bold scale-110";
              }
            }
            else if (settings.highlightMode === 'letter') {
              if (i < currentWordIdx) {
                statusClass = typedWords[i] === word ? "text-emerald-400 opacity-40" : "text-rose-400 opacity-40";
              } else if (i === currentWordIdx) {
                const currentTypedWord = typedWords[i] || "";
                return (
                  <span key={i} className="active-word flex gap-[1px]">
                    {word.split('').map((char, charIdx) => {
                      let charClass = "text-slate-200";
                      if (charIdx < currentTypedWord.length) {
                        charClass = char === currentTypedWord[charIdx] ? "text-emerald-400" : "text-rose-400 bg-rose-950/50 rounded-[2px]";
                      } else if (charIdx === currentTypedWord.length) {
                        charClass = "text-white bg-indigo-600 px-[2px] rounded-[2px] ring-1 ring-indigo-400 animate-pulse";
                      }
                      return <span key={charIdx} className={charClass}>{char}</span>;
                    })}
                  </span>
                );
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
