"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface Props {
  totalQuestions: number;
  currentQuestionIndex: number;
  onQuestionSelect: (index: number) => void;
  answers: Record<string, any>;
  flagged: number[];
  questions: any[];
}

export default function QuestionPalette({
  totalQuestions,
  currentQuestionIndex,
  onQuestionSelect,
  answers,
  questions
}: Props) {
  return (
    <div className="w-[300px] border-2 border-slate-400 bg-white flex flex-col h-full select-none">
      {/* Exam Finished Button */}
      <div className="p-3">
        <Button className="w-full h-12 rounded-xl bg-[#3B82F6] hover:bg-blue-600 text-white font-bold text-lg shadow-sm">
            Exam Finished
        </Button>
      </div>

      {/* Question Status Section */}
      <div className="border-y-2 border-slate-400">
        <div className="bg-slate-50 py-2 px-4 text-center font-bold text-sm border-b border-slate-300">
            Question Status
        </div>
        <div className="p-0 text-[13px] font-bold">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-2">
                <div className="flex items-center gap-3">
                    <span>Attempted</span>
                    <div className="w-4 h-4 rounded-full bg-emerald-600" />
                </div>
                <span className="w-12 text-right border-l border-slate-200 pl-2">
                    {Object.keys(answers).length}
                </span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-2">
                <div className="flex items-center gap-3">
                    <span>Not Attempted</span>
                    <div className="w-4 h-4 bg-rose-600 rounded-sm" />
                </div>
                <span className="w-12 text-right border-l border-slate-200 pl-2 text-rose-600">
                    {totalQuestions - Object.keys(answers).length}
                </span>
            </div>
            <div className="flex items-center justify-between px-4 py-2">
                <div className="flex items-center gap-3">
                    <span>Current</span>
                    <div className="w-4 h-4 bg-amber-400 rounded-sm" />
                </div>
                <span className="w-12 text-right border-l border-slate-200 pl-2">
                    {currentQuestionIndex + 1}
                </span>
            </div>
        </div>
      </div>

      {/* Choose Question Header */}
      <div className="bg-slate-50 py-2 px-4 text-center font-bold text-sm border-b border-slate-400">
          Choose Question
      </div>

      {/* Grid Palette */}
      <ScrollArea className="flex-1">
        <div className="grid grid-cols-8 gap-1 p-2">
          {Array.from({ length: totalQuestions }).map((_, idx) => {
            const qId = questions[idx]?._id;
            const isAnswered = !!answers[qId];
            const isActive = currentQuestionIndex === idx;

            return (
              <button
                key={idx}
                onClick={() => onQuestionSelect(idx)}
                className={cn(
                  "w-full aspect-square text-[11px] font-bold flex items-center justify-center border transition-all",
                  isActive
                    ? "bg-amber-400 text-slate-900 border-amber-500"
                    : isAnswered
                    ? "bg-emerald-600 text-white border-emerald-700 rounded-full"
                    : "bg-rose-600 text-white border-rose-700"
                )}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
