import React from 'react';
import { useTypingStore } from '@/store/useTypingStore';
import { cn } from "@/lib/utils";

interface TypingLayoutProps {
  timerSlot: React.ReactNode;
  typingSlot: React.ReactNode;
  passageSlot: React.ReactNode;
  statsSlot: React.ReactNode;
  settingsSlot: React.ReactNode;
}

/**
 * TypingLayout Component
 * Implements a high-focus, 3-column architecture:
 * TOP: Timer & Meta
 * LEFT: Passage + Input (Main Focus)
 * RIGHT: Real-time Stats & Speedometer
 */
export const TypingLayout: React.FC<TypingLayoutProps> = ({
  timerSlot,
  typingSlot,
  passageSlot,
  statsSlot,
  settingsSlot
}) => {
  const { settings, isFullScreen } = useTypingStore();

  return (
    <div className={cn(
      "min-h-screen bg-[#f8fafc] flex flex-col font-sans text-slate-900 transition-all duration-500",
      isFullScreen ? "fixed inset-0 z-[9999] h-screen w-screen overflow-hidden bg-white" : "relative"
    )}>
      {/* PHASE 4: TOP - TIMER HEADER (Hidden in FullScreen) */}
      {!isFullScreen && (
        <header className="h-20 sticky top-0 z-40 w-full bg-white border-b border-slate-200 shadow-sm">
          <div className="max-w-[1600px] mx-auto h-full px-6 flex items-center justify-center">
            {timerSlot}
          </div>
        </header>
      )}

      {/* Floating Timer Slot if FullScreen */}
      {isFullScreen && timerSlot}

      <main className={cn(
        "flex-1 mx-auto w-full p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 overflow-hidden transition-all duration-700",
        isFullScreen ? "max-w-none h-screen p-10 pt-24 gap-10" : "max-w-[1600px]"
      )}>
        
        {/* LEFT / CENTER COLUMN - PASSAGE & INPUT */}
        <div className={cn(
          "lg:col-span-8 flex gap-6",
          settings.textPosition === 'side' ? 'flex-row' : 'flex-col',
          isFullScreen && "gap-10 h-full"
        )}>
          <div className={cn("flex-1 h-full min-h-0 flex flex-col gap-6", isFullScreen && "gap-10")}>
            <div className={cn("flex-1 min-h-0", !isFullScreen && "min-h-[350px]")}>
              {passageSlot}
            </div>
            <div className={cn("flex-1 min-h-0", !isFullScreen && "min-h-[300px]")}>
              {typingSlot}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - STATS & SETTINGS */}
        <aside className={cn(
          "lg:col-span-4",
          isFullScreen ? "h-full overflow-y-auto pr-4 scrollbar-hide" : "space-y-8"
        )}>
          <div className={cn(
            "space-y-8",
            !isFullScreen && "sticky top-28"
          )}>
            {statsSlot}
            {!isFullScreen && settingsSlot}
          </div>
        </aside>
      </main>

      {!isFullScreen && (
        <footer className="h-12 bg-slate-900 text-white flex items-center justify-center text-[10px] font-black uppercase tracking-[0.2em] opacity-80">
          Professional Typing Examination Environment v2.0
        </footer>
      )}
    </div>
  );
};
