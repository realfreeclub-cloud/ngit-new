"use client";

import React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { QuestionRendererProps } from "./types";
import { Button } from "@/components/ui/button";

interface Props extends QuestionRendererProps {
  onSave: () => void;
  onReset: () => void;
}

export default function QuestionRenderer({
  question,
  value,
  onChange,
  onSave,
  onReset
}: Props) {
  

  return (
    <div className="relative h-full flex flex-col">
      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none z-0">
          <div className="relative w-[500px] h-[500px]">
              <Image 
                src="/watermark.png" 
                alt="Watermark" 
                fill 
                className="object-contain grayscale"
              />
          </div>
      </div>

      {/* Question Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar relative z-10 p-6">
        {(!question.content.hi || question.content.hi === question.content.en) ? (
            /* Single Column Layout (English/Standard) */
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">
                    <div dangerouslySetInnerHTML={{ __html: question.content.en }} />
                </div>
                <div className="space-y-4">
                    {question.options?.map((opt: any, i: number) => (
                        <div key={i} className="text-lg md:text-xl font-bold text-slate-700 flex gap-4 bg-slate-50/50 p-5 rounded-2xl border border-slate-100/50">
                            <span className="text-primary">({String.fromCharCode(65 + i)})</span>
                            <div dangerouslySetInnerHTML={{ __html: opt.text.en || opt.text.hi || "" }} />
                        </div>
                    ))}
                </div>
            </div>
        ) : (
            /* Dual Column Layout (Side-by-Side) */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Hindi Side */}
                <div className="space-y-6">
                    <div className="text-xl md:text-2xl font-black text-slate-900 leading-tight bg-slate-50 p-5 rounded-3xl border border-slate-100">
                        <div dangerouslySetInnerHTML={{ __html: question.content.hi }} />
                    </div>
                    <div className="space-y-3">
                        {question.options?.map((opt: any, i: number) => (
                            <div key={i} className="text-base md:text-lg font-bold text-slate-700 flex gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                                <span className="text-primary/40">({String.fromCharCode(65 + i)})</span>
                                <div dangerouslySetInnerHTML={{ __html: opt.text.hi || "" }} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* English Side */}
                <div className="space-y-6 border-l border-slate-100 md:pl-10">
                    <div className="text-xl md:text-2xl font-black text-slate-900 leading-tight bg-slate-50 p-5 rounded-3xl border border-slate-100">
                        <div dangerouslySetInnerHTML={{ __html: question.content.en }} />
                    </div>
                    <div className="space-y-3">
                        {question.options?.map((opt: any, i: number) => (
                            <div key={i} className="text-base md:text-lg font-bold text-slate-700 flex gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                                <span className="text-primary/40">({String.fromCharCode(65 + i)})</span>
                                <div dangerouslySetInnerHTML={{ __html: opt.text.en || "" }} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}
      </div>

      {/* Answer Selection (At the bottom) */}
      <div className="mt-auto border-t border-slate-100 bg-white/80 backdrop-blur-sm pt-6 pb-6 flex flex-col items-center gap-6 relative z-10 shrink-0">
        <div className="flex items-center gap-8 md:gap-12">
          {["A", "B", "C", "D"].map((choice) => (
            <label key={choice} className="flex items-center gap-2 md:gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input
                  type="radio"
                  name="answer"
                  className="peer hidden"
                  checked={value === choice}
                  onChange={() => onChange(choice)}
                />
                <div className="w-5 h-5 md:w-6 md:h-6 rounded-full border-2 border-slate-300 peer-checked:border-emerald-500 peer-checked:bg-emerald-500 transition-all flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white opacity-0 peer-checked:opacity-100" />
                </div>
              </div>
              <span className="text-base md:text-lg font-black text-slate-700 group-hover:text-slate-900">({choice})</span>
            </label>
          ))}
        </div>

        <div className="flex items-center gap-4 md:gap-6">
            <Button 
                onClick={onSave}
                className="h-12 md:h-14 px-8 md:px-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base md:text-lg shadow-lg shadow-emerald-200"
            >
                Submit Answer
            </Button>
            <Button 
                variant="destructive"
                onClick={onReset}
                className="h-12 md:h-14 px-8 md:px-12 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-base md:text-lg shadow-lg shadow-rose-200"
            >
                Reset Answer
            </Button>
        </div>
      </div>
    </div>
  );
}
