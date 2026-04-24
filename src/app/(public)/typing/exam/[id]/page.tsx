"use client";

import React, { useState, useEffect } from "react";
import TypingEngine from "@/components/typing/TypingEngine";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronDown, ArrowRight } from "lucide-react";
import { format } from "date-fns";

export default function TypingExamPage({ params }: { params: { id: string } }) {
  const [exam, setExam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/typing/exams`)
      .then(res => res.json())
      .then(data => {
        const found = data.find((e: any) => e._id === params.id);
        setExam(found);
        setLoading(false);
      });
  }, [params.id]);

  const handleComplete = async (results: any) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/typing/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examId: params.id,
          ...results
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Exam submitted successfully!");
        router.push(`/typing/results/${data._id}`);
      } else {
        toast.error(data.error || "Submission failed");
      }
    } catch (error) {
      toast.error("An error occurred during submission");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center py-20 min-h-screen bg-[#f5f4ef] items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
    </div>
  );

  if (!exam) return (
    <div className="min-h-screen bg-[#f5f4ef] flex items-center justify-center">
      <p className="text-xl font-bold">Exam not found or not active.</p>
    </div>
  );

  if (step === 1) {
    return (
      <div className="min-h-screen bg-[#f5f4ef] py-12 text-slate-900">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-4">
            <div>
              <p className="text-sm font-bold text-slate-800 mb-2">Select passage for the typing exam</p>
              <h1 className="text-4xl md:text-5xl font-black">{exam.title}</h1>
            </div>
            <Link href="/typing" className="text-sm font-bold mt-4 md:mt-0 flex items-center gap-2 hover:underline">
              Choose any other exam <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <hr className="border-t border-slate-900 mb-10" />

          <div className="bg-[#fcf5ec] rounded-lg p-8 md:p-16 relative overflow-hidden flex flex-col md:flex-row items-center gap-10">
            {/* Decorative Elements */}
            <div className="absolute top-10 right-10 w-24 h-24 bg-[#ffcc00] rounded-full opacity-80" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#6a26ff] rounded-full opacity-90" />
            
            {/* Left Side */}
            <div className="flex-1 relative z-10 pl-4 md:pl-10">
              <h2 className="text-7xl font-serif font-bold leading-tight tracking-tight mb-8">
                Start <br /> 
                <span className="relative">
                  Typing
                  <span className="absolute bottom-1 left-0 w-full h-2 bg-[#6a26ff] z-[-1]"></span>
                </span>
              </h2>
              
              <p className="text-lg text-slate-700 max-w-md mb-6 leading-relaxed">
                Please choose between Special Passages (legal matter, previous exams etc.) or selecting a date for daily passages, then proceed.
              </p>
              
              <div className="text-xs font-bold space-x-3 text-slate-800">
                <span><span className="text-blue-600">B</span> - Basic,</span>
                <span><span className="text-green-600">E</span> - Easy,</span>
                <span><span className="text-[#ff9900]">M</span> - Moderate,</span>
                <span><span className="text-red-600">H</span> - Hard</span>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex-1 w-full relative z-10 max-w-md bg-white/40 p-8 rounded-2xl backdrop-blur-sm border border-white/50">
              <button className="w-full bg-[#2a9d8f] text-white font-bold py-3 px-4 rounded mb-6 text-sm">
                Click for Special Passages
              </button>
              
              <div className="text-center text-xs font-bold text-slate-500 mb-6 uppercase">OR</div>
              
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <label className="text-sm font-bold w-32">Select Language:</label>
                  <div className="flex-1 flex items-center justify-between bg-white border border-slate-300 rounded px-3 py-2 text-sm font-medium">
                    {exam.language} <ChevronDown className="w-4 h-4 text-slate-400" />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <label className="text-sm font-bold w-32">Select Date:</label>
                  <div className="flex-1 bg-white border border-slate-300 rounded px-3 py-2 text-sm font-medium text-slate-600">
                    {format(new Date(), "dd/MM/yyyy")}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <label className="text-sm font-bold w-32">Select Passage:</label>
                  <div className="flex-1 flex items-center justify-between bg-black text-white rounded px-3 py-2 text-sm font-bold cursor-pointer border border-black shadow-lg">
                    <span className="truncate">{exam.passageId?.title || "Exam Passage"}</span>
                    <span className="ml-2 px-1.5 py-0.5 bg-white text-black text-[10px] rounded-sm">
                      {exam.passageId?.difficulty?.charAt(0) || "M"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <label className="text-sm font-bold w-32">Input Limit:</label>
                  <div className="flex-1 flex items-center gap-2">
                    <input type="text" readOnly value={exam.passageId?.wordCount || 500} className="w-20 bg-white border border-slate-300 rounded px-3 py-2 text-sm font-medium" />
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Input Type: Words</span>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <button 
                  onClick={() => setStep(2)}
                  className="w-24 bg-[#cfcfcf] hover:bg-slate-300 text-slate-700 font-bold py-2 rounded transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-5xl mx-auto px-4">
        {isSubmitting && (
          <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="font-bold text-slate-700 text-lg">Calculating results and saving...</p>
          </div>
        )}

        <div className="mb-10 text-center">
          <h1 className="text-4xl font-black text-slate-900 mb-4">{exam.title}</h1>
          <div className="flex items-center justify-center gap-6">
            <span className="px-4 py-1 bg-white border border-slate-200 rounded-full text-sm font-bold text-slate-600 shadow-sm">
              Category: {exam.category}
            </span>
            <span className="px-4 py-1 bg-white border border-slate-200 rounded-full text-sm font-bold text-slate-600 shadow-sm">
              Language: {exam.language}
            </span>
          </div>
        </div>

        <TypingEngine 
          passage={exam.passageId?.content || ""} 
          duration={exam.duration} 
          onComplete={handleComplete}
        />
      </div>
    </div>
  );
}
