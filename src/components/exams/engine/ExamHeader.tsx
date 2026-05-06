"use client";

import React from "react";
import Image from "next/image";
import { User } from "lucide-react";

interface Props {
  examName: string;
  userName: string;
  loginId: string;
  timeLeft: number;
  language: string;
  currentQuestionNumber: number;
  totalMarks: number;
  totalTime: number;
  currentMark: number;
  logo?: string;
}

export default function ExamHeader({
  examName,
  userName,
  loginId,
  timeLeft,
  language,
  currentQuestionNumber,
  totalMarks,
  totalTime,
  currentMark,
  logo
}: Props) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full border-b-2 border-slate-400 bg-white select-none">
      {/* Top Header */}
      <div className="flex h-24 border-b border-slate-300 overflow-hidden">
        {/* Logo Section */}
        <div className="w-44 border-r border-slate-300 flex items-center justify-center p-3 shrink-0">
            <div className="relative w-full h-full">
                <Image 
                    src={logo || "/logo.png"} 
                    alt="Logo" 
                    fill 
                    className="object-contain"
                />
            </div>
        </div>

        {/* Center Info Section */}
        <div className="flex-1 grid grid-cols-2 gap-x-12 px-12 py-5 font-sans uppercase overflow-hidden">
            <div className="flex items-baseline gap-4">
                <span className="text-[13px] font-bold text-slate-900 w-28 shrink-0">Exam Name:</span>
                <span className="text-[13px] font-bold text-slate-700 truncate">{examName}</span>
            </div>
            <div className="flex items-baseline gap-4">
                <span className="text-[13px] font-bold text-slate-900 w-28 shrink-0">Login ID:</span>
                <span className="text-[13px] font-bold text-slate-700 truncate">{loginId}</span>
            </div>
            <div className="flex items-baseline gap-4">
                <span className="text-[13px] font-bold text-slate-900 w-28 shrink-0">Name:</span>
                <span className="text-[13px] font-bold text-slate-700 truncate">{userName}</span>
            </div>
            <div className="flex items-baseline gap-4">
                <span className="text-[13px] font-bold text-slate-900 w-28 shrink-0">Language:</span>
                <span className="text-[13px] font-bold text-slate-700 truncate">{language}</span>
            </div>
        </div>

        {/* Profile Avatar Section */}
        <div className="w-36 flex items-center justify-center border-l border-slate-300 shrink-0">
            <div className="w-20 h-20 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center overflow-hidden">
                <User className="w-14 h-14 text-slate-300" />
            </div>
        </div>
      </div>

      {/* Info Bar */}
      <div className="flex h-12 border-b border-slate-300 font-sans text-[13px] font-bold uppercase tracking-tight">
        <div className="flex-[0.5] border-r border-slate-300 flex items-center justify-center bg-slate-50/30">
            QN.{currentQuestionNumber}
        </div>
        <div className="flex-1 border-r border-slate-300 flex items-center justify-center">
            Total Marks:<span className="text-emerald-600 ml-1.5">{totalMarks}</span>
        </div>
        <div className="flex-1 border-r border-slate-300 flex items-center justify-center">
            Total Time:<span className="text-emerald-600 ml-1.5">{totalTime} Minutes</span>
        </div>
        <div className="flex-1 border-r border-slate-300 flex items-center justify-center">
            Remaining Time:<span className="text-rose-600 ml-1.5 font-black">{formatTime(timeLeft)}</span>
        </div>
        <div className="w-36 flex items-center justify-center bg-slate-50/30 shrink-0">
            Mark:{currentMark}
        </div>
      </div>
    </div>
  );
}
