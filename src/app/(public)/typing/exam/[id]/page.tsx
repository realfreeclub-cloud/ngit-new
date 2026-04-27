"use client";

import React, { useState, useEffect } from "react";
import { TypingEngineModule } from "@/modules/typing/TypingEngineModule";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronDown, ArrowRight, Keyboard, FileText } from "lucide-react";
import { format } from "date-fns";
import { useSession } from "next-auth/react";

export default function TypingExamPage() {
  const params = useParams();
  const id = params?.id as string;
  const [exam, setExam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [isAgreed, setIsAgreed] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  const engineConfig = React.useMemo(() => ({
    title: exam?.title || "",
    duration: exam?.duration || 10,
    backspaceMode: exam?.backspaceMode || "full",
    highlightMode: exam?.highlightMode || "word",
    wordLimit: exam?.wordLimit || 0
  }), [exam]);

  useEffect(() => {
    if (!id) return;
    let isMounted = true;
    fetch(`/api/typing/exams`)
      .then(res => res.json())
      .then(data => {
        if (isMounted) {
          const found = data.find((e: any) => e._id === id);
          setExam(found);
          setLoading(false);
        }
      });
    return () => { isMounted = false; };
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
        router.push(`/typing/results/${data.resultId}`);
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
      const callbackUrl = encodeURIComponent(window.location.pathname);
      router.push(`/student/login?callbackUrl=${callbackUrl}`);
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
            
            <div className="flex-1 relative z-10">
              <span className="inline-block px-4 py-1.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-6">Exam Module Activated</span>
              <h2 className="text-5xl md:text-6xl font-black leading-none mb-6">Ready to <br/><span className="text-slate-500">Test Your Speed?</span></h2>
              <div className="flex items-center gap-6 mb-8">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-400 uppercase">Test Duration</span>
                  <span className="text-2xl font-black">{exam.duration} Minutes</span>
                </div>
                <div className="w-px h-10 bg-slate-200" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-400 uppercase">Language</span>
                  <span className="text-2xl font-black">{exam.language}</span>
                </div>
              </div>
              <button 
                onClick={handleNextStep}
                className="group flex items-center gap-4 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black hover:bg-black transition-all hover:gap-6 shadow-xl shadow-slate-900/20"
              >
                Continue to Instructions <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <div className="flex-1 hidden md:block">
              <div className="w-full aspect-square bg-white rounded-[3rem] shadow-2xl border border-slate-100 flex items-center justify-center relative rotate-3 group-hover:rotate-0 transition-transform duration-700">
                 <div className="text-center p-10">
                    <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                       <Keyboard className="w-10 h-10 text-indigo-600" />
                    </div>
                    <h4 className="text-2xl font-black mb-2">High Precision</h4>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Government Standard Engine</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="min-h-screen bg-[#f5f4ef] py-12 text-slate-900">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-white rounded-3xl shadow-lg flex items-center justify-center border border-slate-100">
               <FileText className="w-8 h-8 text-slate-900" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Official Examination</p>
              <h3 className="text-2xl font-black leading-none">
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
            <p>12. After typing given number of words in the master text passage the space bar will not allow further typing of additional words.</p>
          </div>

          {/* Confirmation */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="confirm" 
                checked={isAgreed}
                onChange={(e) => setIsAgreed(e.target.checked)}
                className="w-4 h-4 cursor-pointer"
              />
              <label htmlFor="confirm" className="text-sm font-bold cursor-pointer select-none">
                I have enabled {exam.language} Keyboard on my system. <Link href="#" className="text-blue-600 hover:underline">How to install?</Link>
              </label>
            </div>

            <button 
              id="start-typing-btn"
              disabled={!isAgreed}
              onClick={() => setStep(3)}
              className="bg-[#cfcfcf] text-white font-black py-4 px-12 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed enabled:bg-slate-900 enabled:hover:bg-black transition-all shadow-xl shadow-slate-900/10"
            >
              Start Official Exam
            </button>
          </div>
          
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {isSubmitting && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[100] flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
          <p className="font-black text-slate-700 text-lg uppercase tracking-widest">Recording Performance Metrics...</p>
        </div>
      )}

      <TypingEngineModule 
        passage={exam.passageId?.content || "Passage not linked properly from admin panel. Please assign a passage to this exam."} 
        config={engineConfig}
        onComplete={handleComplete}
      />
    </div>
  );
}
