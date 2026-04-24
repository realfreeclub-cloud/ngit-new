"use client";

import React, { useState, useEffect } from "react";
import TypingEngine from "@/components/typing/TypingEngine";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronDown, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { useSession } from "next-auth/react";

export default function TypingExamPage() {
  const params = useParams();
  const id = params?.id as string;
  const [exam, setExam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (!id) return;
    fetch(`/api/typing/exams`)
      .then(res => res.json())
      .then(data => {
        const found = data.find((e: any) => e._id === id);
        setExam(found);
        setLoading(false);
      });
  }, [id]);

  const handleComplete = async (results: any) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/typing/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examId: id,
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

  if (loading || status === "loading") return (
    <div className="flex justify-center py-20 min-h-screen bg-[#f5f4ef] items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
    </div>
  );

  if (!exam) return (
    <div className="min-h-screen bg-[#f5f4ef] flex items-center justify-center">
      <p className="text-xl font-bold">Exam not found or not active.</p>
    </div>
  );

  const handleNextStep = () => {
    if (!session) {
      toast.error("Please login to start the typing exam");
      router.push("/login");
      return;
    }
    setStep(2);
  };

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
                  onClick={handleNextStep}
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

  if (step === 2) {
    return (
      <div className="min-h-screen bg-[#f5f4ef] py-10 text-slate-900">
        <div className="max-w-6xl mx-auto px-4">
          
          {/* Top Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-[#f5f4ef] border border-slate-900 p-6 rounded-md shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
              <p className="text-xs text-slate-500 mb-1">Personal Information</p>
              <h3 className="text-xl font-bold text-slate-900">{session?.user?.name || "Student"}</h3>
            </div>
            <div className="bg-[#f5f4ef] border border-slate-900 p-6 rounded-md shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
              <p className="text-xs text-slate-500 mb-1">Exam Description</p>
              <h3 className="text-xl font-bold text-slate-900">{exam.title}</h3>
            </div>
            <div className="bg-[#f5f4ef] border border-slate-900 p-6 rounded-md shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
              <p className="text-xs text-slate-500 mb-1">Passage Detail</p>
              <h3 className="text-xl font-bold text-slate-900">
                Id- {exam.passageId?._id?.substring(0, 5)} - {exam.passageId?.title || "Exam Passage"}
              </h3>
            </div>
          </div>

          <h2 className="text-4xl font-black mb-6">Instructions:</h2>
          <hr className="border-t border-slate-900 mb-8" />

          {/* Instructions Box */}
          <div className="bg-white p-8 md:p-12 border border-slate-200 mb-10 text-sm font-medium text-slate-800 leading-relaxed space-y-5">
            <p>1. The candidates will be provided with the master text passage of about <span className="font-bold">{exam.passageId?.wordCount || 500} words</span> in <span className="font-bold">{exam.language}</span>.</p>
            <p>2. The typing can be of either word based typing or key strokes based typing.</p>
            <p>3. For example, 35 w.p.m. is about 10500 key depressions per hour and 30 w.p.m. corresponds to about 9000 key depression per hour.</p>
            <p>4. Time duration of <span className="font-bold">{exam.language}</span> typing test is <span className="font-bold">{(exam.duration || 10).toString().padStart(2, '0')}:00 minute</span>.</p>
            <p>5. The countdown timer in the top right corner of screen will display the remaining time available for you to complete the examination. When the timer reaches zero, the examination will end by itself with typed passage, you are not required to end or submit your test.</p>
            <p>6. <span className="font-bold">Candidates are not required to repeat the passage</span>, if he/she has completed the passage once and has time in his/her disposal, however they are allowed to revise and correct their mistakes and inaccuracies, if any, during the prescribed time</p>
            <p>7. After every Punctuation mark, only One space is to be inserted, e.g. after comma, full stop, mark of interrogation etc. However, candidates are advised to follow the Question paper scrupulously in this regard.</p>
            <p>8. The combination of alphanumeric keys followed by one space is termed as one "Word".</p>
            <p>9. Once you have completed typing of the given passage and you do not find any errors or mistakes in it, you may submit it by pressing the submit button. After submission no editing or change in the typed passage is possible.</p>
            <p>10. If your computer is locked/switched off or for any type of technical help, please inform a nearby invigilator immediately.</p>
            <p>11. In any case of auto restart of the computer, you will be again provided with the full time to type the given passage.</p>
            <p>12. After typing given number of words in the master text passage the space bar will not allow further typing of additional words. For example, if there are 500 words in the master text passage, candidates can type only 500 words and after that space bar will not allow the candidates to type any additional word, however, keyboard will allow the candidate to continue typing without using the space bar.</p>
          </div>

          {/* Keyboard Selection */}
          <div className="space-y-4 mb-8">
            <p className="text-sm font-medium">Select <span className="font-bold">{exam.language}</span> Keyboard Input Method:</p>
            
            <div className="flex items-start gap-2">
              <input type="radio" name="keyboard" id="kb-builtin" className="mt-1" defaultChecked />
              <label htmlFor="kb-builtin" className="text-sm">
                <span className="font-bold">Use Built-in Keyboard Engine</span> — <span className="text-emerald-600">✓ No external software required.</span> Works directly in the browser. Recommended for mobile & tablet. <span className="text-slate-400">(Beta — if you notice any incorrect character, message us & switch to External Keyboard)</span>
              </label>
            </div>
            
            <div className="flex items-start gap-2">
              <input type="radio" name="keyboard" id="kb-external" className="mt-1" />
              <label htmlFor="kb-external" className="text-sm">
                <span className="font-bold">Use External InScript Keyboard</span> — Enable InScript layout via Windows Language Settings or third-party software.
              </label>
            </div>
          </div>

          {/* Confirmation */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="confirm" 
                className="w-4 h-4 cursor-pointer"
                onChange={(e) => {
                  const btn = document.getElementById('start-typing-btn') as HTMLButtonElement;
                  if (btn) btn.disabled = !e.target.checked;
                }}
              />
              <label htmlFor="confirm" className="text-sm font-bold cursor-pointer select-none">
                I have enabled {exam.language} Keyboard on my system. <Link href="#" className="text-blue-600 hover:underline">How to install?</Link>
              </label>
            </div>

            <button 
              id="start-typing-btn"
              disabled
              onClick={() => setStep(3)}
              className="bg-[#cfcfcf] text-white font-bold py-3 px-8 rounded disabled:opacity-50 disabled:cursor-not-allowed enabled:bg-[#2a9d8f] enabled:hover:bg-[#21867a] transition-colors"
            >
              Start Typing
            </button>
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

        <TypingEngine 
          passage={exam.passageId?.content || ""} 
          duration={exam.duration} 
          examTitle={exam.title}
          passageId={exam.passageId?._id || "31415"}
          language={exam.language}
          onComplete={handleComplete}
        />
      </div>
    </div>
  );
}
