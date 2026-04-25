import React, { useMemo } from 'react';
import { useTypingStore } from '@/store/useTypingStore';
import { cn } from "@/lib/utils";
import { Target, Zap, AlertCircle, BarChart3, Clock, Maximize, Minimize } from 'lucide-react';

/**
 * LiveDashboard Component
 * Displays real-time metrics during the typing test.
 * Metrics: WPM, Accuracy, Errors, and DPH (Depressions Per Hour)
 */
export const LiveDashboard: React.FC = () => {
  const { wpm, accuracy, errorCount, typedText, timeLeft, settings, isActive } = useTypingStore();

  // Calculate DPH (Depressions Per Hour)
  // Formula: (Total Characters / Elapsed Time in Seconds) * 3600
  const dph = useMemo(() => {
    const elapsedSeconds = (settings.duration * 60) - timeLeft;
    if (elapsedSeconds <= 0 || !isActive) return 0;
    return Math.round((typedText.length / elapsedSeconds) * 3600);
  }, [typedText.length, timeLeft, settings.duration, isActive]);

  const StatCard = ({ icon: Icon, label, value, hexColor, unit }: any) => (
    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-3">
        <div 
          className="p-2 rounded-lg" 
          style={{ backgroundColor: `${hexColor}15` }} // 15 is ~10% opacity in hex
        >
          <Icon className="w-4 h-4" style={{ color: hexColor }} />
        </div>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-black text-slate-900">{value}</span>
        {unit && <span className="text-[10px] font-bold text-slate-400">{unit}</span>}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Net Speed */}
      <StatCard 
        icon={Zap} 
        label="Net Speed" 
        value={wpm} 
        unit="WPM" 
        hexColor="#4f46e5" // Indigo 600
      />
      
      {/* Accuracy */}
      <StatCard 
        icon={Target} 
        label="Accuracy" 
        value={accuracy} 
        unit="%" 
        hexColor="#059669" // Emerald 600
      />
      
      {/* Errors */}
      <StatCard 
        icon={AlertCircle} 
        label="Total Errors" 
        value={errorCount} 
        hexColor="#e11d48" // Rose 600
      />
      
      {/* Depressions Per Hour (DPH) */}
      <StatCard 
        icon={BarChart3} 
        label="DPH Rate" 
        value={dph} 
        hexColor="#d97706" // Amber 600
      />
    </div>
  );
};

/**
 * TimerDisplay Component
 */
export const TimerDisplay: React.FC = () => {
  const { timeLeft, toggleFullScreen, isFullScreen } = useTypingStore();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isLowTime = timeLeft < 60;

  return (
    <div className={cn(
      "flex items-center gap-6 w-full px-4 transition-all duration-500",
      isFullScreen ? "fixed top-4 left-0 right-0 z-[100] justify-center pointer-events-none" : "justify-between"
    )}>
      {!isFullScreen && <div className="flex-1" />}
      
      <div className={cn(
        "flex flex-col items-center",
        isFullScreen ? "bg-white/90 backdrop-blur-md px-10 py-3 rounded-full shadow-2xl border border-white/50 pointer-events-auto" : "flex-1"
      )}>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Time Remaining</span>
        <div className={`flex items-center gap-3 px-8 py-2 rounded-2xl border-2 transition-colors ${isLowTime ? 'bg-rose-50 border-rose-200 text-rose-600 animate-pulse' : 'bg-slate-50 border-slate-100 text-slate-900'}`}>
          <Clock className="w-5 h-5 opacity-50" />
          <span className="text-3xl font-black tabular-nums font-mono tracking-tight">
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      <div className={cn(
        "flex justify-end",
        isFullScreen ? "fixed bottom-8 right-8 pointer-events-auto" : "flex-1"
      )}>
        <button 
          onClick={toggleFullScreen}
          className={cn(
            "flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl",
            isFullScreen 
              ? "bg-rose-600 text-white hover:bg-rose-700 hover:scale-110" 
              : "bg-slate-900 text-white hover:bg-black"
          )}
        >
          {isFullScreen ? (
            <>
              <Minimize className="w-4 h-4" />
              Exit Exam FullScreen
            </>
          ) : (
            <>
              <Maximize className="w-4 h-4" />
              FullScreen Mode
            </>
          )}
        </button>
      </div>
    </div>
  );
};
