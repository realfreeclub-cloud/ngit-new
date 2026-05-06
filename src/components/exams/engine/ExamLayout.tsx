"use client";

import React from "react";
import ExamHeader from "./ExamHeader";
import QuestionPalette from "./QuestionPalette";
import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
  exam: any;
  user: any;
  currentQuestionIndex: number;
  totalQuestions: number;
  timeLeft: number;
  language: string;
  onLanguageChange: (lang: any) => void;
  onQuestionSelect: (index: number) => void;
  answers: Record<string, any>;
  flagged: number[];
}

export default function ExamLayout({
  children,
  exam,
  user,
  currentQuestionIndex,
  totalQuestions,
  timeLeft,
  language,
  onQuestionSelect,
  answers,
  flagged
}: Props) {
  return (
    <div className="h-screen bg-white flex flex-col font-sans select-none overflow-hidden">
      <ExamHeader
        examName={exam?.title || "Mock Test"}
        userName={user?.name || "Anonymous"}
        loginId={user?.loginId || "A13DE8BF"}
        timeLeft={timeLeft}
        language="HINDI/ENGLISH"
        currentQuestionNumber={currentQuestionIndex + 1}
        totalMarks={exam?.settings?.totalMarks || 100}
        totalTime={exam?.settings?.timeLimit || 90}
        currentMark={exam?.questions?.[currentQuestionIndex]?.marks || 1}
        logo={exam?.logo}
      />

      <main className="flex-1 flex w-full border-x-2 border-b-2 border-slate-400 mx-auto max-w-[1400px]">
        {/* Left Panel: Question Area */}
        <div className="flex-1 relative overflow-y-auto no-scrollbar bg-white">
            {children}
        </div>

        {/* Right Panel: Palette */}
        <aside className="w-[300px] shrink-0 border-l-2 border-slate-400 h-full">
          <QuestionPalette
            totalQuestions={totalQuestions}
            currentQuestionIndex={currentQuestionIndex}
            onQuestionSelect={onQuestionSelect}
            answers={answers}
            flagged={flagged}
            questions={exam?.questions || []}
          />
        </aside>
      </main>
    </div>
  );
}
