"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { VolumeX, Maximize, Settings, X, User } from "lucide-react";
import { toast } from "sonner";

interface TypingEngineProps {
  passage: string;
  duration: number; // minutes
  examTitle?: string;
  passageId?: string;
  language?: string;
  onComplete: (results: any) => void;
}

export default function TypingEngine({ 
  passage = "Sample passage text for typing practice...", 
  duration = 10, 
  examTitle = "Typing Test", 
  passageId = "00000",
  language = "English",
  onComplete 
}: TypingEngineProps) {
  const [userInput, setUserInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [isFinished, setIsFinished] = useState(false);
  
  // Settings State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState({
    backspace: true,
    limitedBackspace: false,
    wordHighlight: true,
    currentWordHighlight: true,
    fontSize: 16
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Start timer immediately on mount for this government interface style
    inputRef.current?.focus();
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleFinish = () => {
    setIsFinished(true);
    if (timerRef.current) clearInterval(timerRef.current);
    
    // Calculate simple metrics for submission
    const wordsTyped = userInput.trim().split(/\s+/).length;
    onComplete({
      submittedText: userInput,
      timeTaken: duration * 60 - timeLeft,
      wpm: Math.round((userInput.length / 5) / (duration)), // simplified
      accuracy: 100, // simplified for now
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isFinished) return;
    
    const val = e.target.value;
    
    // Handle backspace setting
    if (!settings.backspace && val.length < userInput.length) {
      return; // prevent deletion
    }
    
    setUserInput(val);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const getFontFamily = () => {
    const lang = language?.toLowerCase() || "";
    if (lang.includes("kruti") || lang.includes("kurti")) return "'Kruti Dev 010', Arial, sans-serif";
    if (lang.includes("mangal") || lang.includes("hindi")) return "Mangal, Arial, sans-serif";
    return "Inter, Arial, sans-serif";
  };

  const renderMasterText = () => {
    const words = passage.split(" ");
    const typedWords = userInput.split(" ");
    
    return (
      <div 
        className="w-full h-48 overflow-y-auto p-4 border border-slate-400 bg-white"
        style={{ fontSize: `${settings.fontSize}px`, fontFamily: getFontFamily() }}
      >
        {words.map((word, i) => {
          let className = "";
          if (settings.wordHighlight) {
            if (i < typedWords.length - 1) {
              className = typedWords[i] === word ? "text-green-700" : "text-red-600 bg-red-100";
            } else if (i === typedWords.length - 1 && settings.currentWordHighlight) {
              className = "bg-blue-100";
            }
          }
          return <span key={i} className={className}>{word} </span>;
        })}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-[#e0e0e0] z-50 flex flex-col font-sans">
      {/* Top Blue Bar */}
      <div className="bg-[#007bff] text-white text-center py-1.5 font-bold text-sm">
        Typing Test Id {passageId.substring(0, 5)} - {examTitle}
      </div>
      
      {/* Black Sub Bar */}
      <div className="bg-black text-white px-4 py-1 text-xs font-bold">
        {examTitle}
      </div>
      
      {/* Tools & Timer Header */}
      <div className="bg-white flex justify-between items-center px-6 py-2 border-b border-slate-200">
        <div className="flex items-center gap-2 border border-slate-300 rounded-full px-4 py-1.5">
          <button className="text-slate-600 hover:text-black"><VolumeX className="w-4 h-4" /></button>
          <div className="w-px h-4 bg-slate-300 mx-1"></div>
          <button className="text-slate-600 hover:text-black"><Maximize className="w-4 h-4" /></button>
          <div className="w-px h-4 bg-slate-300 mx-1"></div>
          <button onClick={() => setSettings(s => ({...s, fontSize: Math.max(12, s.fontSize - 2)}))} className="text-slate-600 font-bold text-sm">A-</button>
          <button onClick={() => setSettings(s => ({...s, fontSize: 16}))} className="text-slate-600 font-bold text-sm px-2">A</button>
          <button onClick={() => setSettings(s => ({...s, fontSize: Math.min(24, s.fontSize + 2)}))} className="text-slate-600 font-bold text-sm">A+</button>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="font-bold text-slate-800 text-lg">
            Time left:- {formatTime(timeLeft)}
          </div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-slate-300 flex items-center justify-center text-slate-500 overflow-hidden">
              <User className="w-8 h-8 mt-2" />
            </div>
            <span className="text-[10px] font-bold text-slate-700 mt-1 uppercase">STUDENT</span>
          </div>
        </div>
      </div>
      
      {/* Keyboard Layout Bar */}
      <div className="bg-[#007bff] text-white px-4 py-1 text-xs flex gap-6">
        <span>Keyboard Layout: Inscript</span>
        <span>Language: {language} - Mangal Font</span>
      </div>
      
      {/* Main Typing Area */}
      <div className="flex-1 p-4 flex flex-col gap-4 max-w-7xl mx-auto w-full">
        {renderMasterText()}
        
        <textarea
          ref={inputRef}
          value={userInput}
          onChange={handleInputChange}
          disabled={isFinished}
          spellCheck={false}
          className="w-full h-48 p-4 border border-slate-400 bg-[#c8e667] focus:outline-none focus:border-blue-500 resize-none"
          style={{ fontSize: `${settings.fontSize}px`, fontFamily: getFontFamily() }}
        />
        
        <div className="flex justify-center gap-4 mt-4">
          <button 
            className="px-8 py-2 bg-[#dc3545] text-white font-bold rounded shadow hover:bg-red-700 transition-colors"
            onClick={() => window.location.href = '/typing'}
          >
            Cancel
          </button>
          <button 
            className="px-8 py-2 bg-[#0d6efd] text-white font-bold rounded shadow hover:bg-blue-700 transition-colors"
            onClick={handleFinish}
          >
            Submit
          </button>
        </div>
      </div>
      
      {/* Floating Settings Button */}
      <button 
        onClick={() => setIsSettingsOpen(true)}
        className="fixed bottom-6 right-6 w-12 h-12 bg-[#8b5cf6] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-purple-600 transition-colors z-50"
      >
        <Settings className="w-6 h-6" />
      </button>

      {/* Settings Drawer Overlay */}
      {isSettingsOpen && (
        <>
          <div className="fixed inset-0 bg-black/20 z-50" onClick={() => setIsSettingsOpen(false)} />
          <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-bold text-lg">Typing Settings</h3>
              <button onClick={() => setIsSettingsOpen(false)} className="text-slate-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 space-y-4 flex-1 overflow-y-auto bg-slate-50">
              
              <div className="border bg-white rounded">
                <div className="p-3 font-bold text-sm border-b flex justify-between">
                  Appearance & Layout <span>▼</span>
                </div>
              </div>
              
              <div className="border bg-white rounded">
                <div className="p-3 font-bold text-sm border-b flex justify-between bg-slate-50">
                  Typing Behavior <span>▲</span>
                </div>
                <div className="p-4 grid grid-cols-2 gap-y-6 gap-x-4 text-xs font-bold">
                  <div className="flex justify-between items-center">
                    <span>BackSpace On</span>
                    <input 
                      type="checkbox" 
                      checked={settings.backspace} 
                      onChange={(e) => setSettings({...settings, backspace: e.target.checked})}
                      className="toggle toggle-primary toggle-sm" 
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Limited Backspace Off</span>
                    <input 
                      type="checkbox" 
                      checked={settings.limitedBackspace} 
                      onChange={(e) => setSettings({...settings, limitedBackspace: e.target.checked})}
                      className="toggle toggle-sm" 
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Word Highlight On</span>
                    <input 
                      type="checkbox" 
                      checked={settings.wordHighlight} 
                      onChange={(e) => setSettings({...settings, wordHighlight: e.target.checked})}
                      className="toggle toggle-primary toggle-sm" 
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Current Word Highlight</span>
                    <input 
                      type="checkbox" 
                      checked={settings.currentWordHighlight} 
                      onChange={(e) => setSettings({...settings, currentWordHighlight: e.target.checked})}
                      className="toggle toggle-primary toggle-sm" 
                    />
                  </div>
                </div>
              </div>

              <div className="border bg-white rounded">
                <div className="p-3 font-bold text-sm border-b flex justify-between">
                  Sound & View <span>▼</span>
                </div>
              </div>
              
            </div>
            
            <div className="p-4 border-t flex justify-end">
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="px-6 py-2 bg-[#007bff] text-white font-bold rounded text-sm hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
