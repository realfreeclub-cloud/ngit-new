"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Timer, Zap, Target, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface TypingEngineProps {
  passage: string;
  duration: number; // minutes
  onComplete: (results: any) => void;
}

const TypingEngine: React.FC<TypingEngineProps> = ({ passage, duration, onComplete }) => {
  const [userInput, setUserInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [metrics, setMetrics] = useState({
    wpm: 0,
    accuracy: 0,
    errors: 0,
    rawWpm: 0
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Prevention of cheating
  useEffect(() => {
    const handleCopyPaste = (e: ClipboardEvent) => {
      e.preventDefault();
      toast.error("Copy-paste is disabled for this exam.");
    };

    document.addEventListener("copy", handleCopyPaste);
    document.addEventListener("paste", handleCopyPaste);
    document.addEventListener("contextmenu", (e) => e.preventDefault());

    return () => {
      document.removeEventListener("copy", handleCopyPaste);
      document.removeEventListener("paste", handleCopyPaste);
    };
  }, []);

  const calculateMetrics = useCallback((input: string) => {
    const wordsTyped = input.trim().split(/\s+/).length;
    const originalWords = passage.trim().split(/\s+/);
    const typedWords = input.trim().split(/\s+/);

    let errors = 0;
    typedWords.forEach((word, index) => {
      if (word !== originalWords[index]) {
        errors++;
      }
    });

    const timePassed = (duration * 60 - timeLeft) / 60; // in minutes
    const grossWpm = Math.round((input.length / 5) / (timePassed || 0.01));
    const netWpm = Math.max(0, grossWpm - errors / (timePassed || 0.01));
    const accuracy = wordsTyped > 0 ? Math.round(((wordsTyped - errors) / wordsTyped) * 100) : 100;

    setMetrics({
      wpm: Math.round(netWpm),
      rawWpm: grossWpm,
      accuracy,
      errors
    });
  }, [passage, duration, timeLeft]);

  useEffect(() => {
    if (isStarted && timeLeft > 0 && !isFinished) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleFinish();
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isStarted, timeLeft, isFinished]);

  const handleStart = () => {
    setIsStarted(true);
    inputRef.current?.focus();
  };

  const handleFinish = () => {
    setIsFinished(true);
    if (timerRef.current) clearInterval(timerRef.current);
    onComplete({
      ...metrics,
      submittedText: userInput,
      timeTaken: duration * 60 - timeLeft
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isStarted) handleStart();
    const val = e.target.value;
    setUserInput(val);
    calculateMetrics(val);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="space-y-6">
      {/* Stats Header */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-blue-50 border-blue-100 flex items-center gap-3">
          <div className="p-2 bg-blue-500 rounded-lg text-white">
            <Timer className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-blue-600 font-medium uppercase">Time Left</p>
            <p className="text-xl font-bold text-blue-900 font-mono">{formatTime(timeLeft)}</p>
          </div>
        </Card>

        <Card className="p-4 bg-emerald-50 border-emerald-100 flex items-center gap-3">
          <div className="p-2 bg-emerald-500 rounded-lg text-white">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-emerald-600 font-medium uppercase">Net WPM</p>
            <p className="text-xl font-bold text-emerald-900 font-mono">{metrics.wpm}</p>
          </div>
        </Card>

        <Card className="p-4 bg-purple-50 border-purple-100 flex items-center gap-3">
          <div className="p-2 bg-purple-500 rounded-lg text-white">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-purple-600 font-medium uppercase">Accuracy</p>
            <p className="text-xl font-bold text-purple-900 font-mono">{metrics.accuracy}%</p>
          </div>
        </Card>

        <Card className="p-4 bg-red-50 border-red-100 flex items-center gap-3">
          <div className="p-2 bg-red-500 rounded-lg text-white">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-red-600 font-medium uppercase">Errors</p>
            <p className="text-xl font-bold text-red-900 font-mono">{metrics.errors}</p>
          </div>
        </Card>
      </div>

      <Progress value={(timeLeft / (duration * 60)) * 100} className="h-2" />

      {/* Passage Display */}
      <Card className="p-6 bg-slate-50 border-slate-200">
        <div className="prose prose-slate max-w-none">
          <p className="text-xl leading-relaxed font-serif text-slate-800 select-none">
            {passage.split("").map((char, index) => {
              let color = "text-slate-400";
              if (index < userInput.length) {
                color = userInput[index] === char ? "text-emerald-600 font-semibold" : "text-red-500 bg-red-50";
              }
              return (
                <span key={index} className={color}>
                  {char}
                </span>
              );
            })}
          </p>
        </div>
      </Card>

      {/* Input Area */}
      <div className="relative">
        <textarea
          ref={inputRef}
          value={userInput}
          onChange={handleInputChange}
          disabled={isFinished}
          placeholder={isStarted ? "Keep typing..." : "Click here to start typing..."}
          className="w-full h-48 p-6 text-xl font-mono border-2 border-slate-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all resize-none shadow-sm"
        />
        {!isStarted && !isFinished && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center rounded-2xl">
            <button
              onClick={handleStart}
              className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold shadow-lg hover:bg-blue-700 transition-all transform hover:scale-105"
            >
              Start Exam Now
            </button>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleFinish}
          disabled={!isStarted || isFinished}
          className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-xl hover:bg-slate-800 disabled:opacity-50 transition-all"
        >
          Submit Exam
        </button>
      </div>
    </div>
  );
};

export default TypingEngine;
