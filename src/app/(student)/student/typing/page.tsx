"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { Keyboard, Zap, Target, AlertTriangle, ChevronDown } from "lucide-react";
import Link from "next/link";

export default function StudentTypingDashboard() {
  const { data: session } = useSession();
  const [results, setResults] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    if (session) {
      Promise.all([
        fetch("/api/typing/results").then(res => res.json()),
        fetch("/api/typing/exams").then(res => res.json())
      ]).then(([resultsData, examsData]) => {
        if (isMounted) {
          setResults(Array.isArray(resultsData) ? resultsData : []);
          setExams(Array.isArray(examsData) ? examsData : []);
          setLoading(false);
        }
      }).catch(() => {
        if (isMounted) setLoading(false);
      });
    }
    return () => { isMounted = false; };
  }, [session]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Typing <span className="text-primary">Mastery</span></h1>
          <p className="text-slate-500 font-bold mt-2 uppercase tracking-widest text-[10px]">Student Examination Portal</p>
        </div>
      </div>

      {/* 1. Available Exams Section */}
      <section className="space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Keyboard className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Available Typing Exams</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Newly assigned for you</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {exams.length > 0 ? exams.map((exam) => (
            <Card key={exam._id} className="p-8 rounded-[2.5rem] border-slate-100 shadow-sm hover:shadow-2xl hover:border-indigo-100 transition-all duration-500 group flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-indigo-500/10 transition-colors" />
              
              <div className="flex justify-between items-start mb-8 relative z-10">
                <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Keyboard className="w-7 h-7" />
                </div>
                <span className="px-4 py-1.5 bg-slate-950 text-white rounded-full text-[9px] font-black uppercase tracking-widest border border-slate-800">
                  {exam.language || 'English'}
                </span>
              </div>

              <h3 className="text-xl font-black text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors">{exam.title}</h3>
              
              <div className="flex items-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] mb-10">
                <span className="flex items-center gap-2"><Zap className="w-4 h-4 text-amber-500" /> {exam.duration} Minutes</span>
                <span className="w-1 h-1 rounded-full bg-slate-200" />
                <span className="flex items-center gap-2"><Target className="w-4 h-4 text-emerald-500" /> Ranked</span>
              </div>

              <Link href={`/typing/exam/${exam._id}`} className="mt-auto">
                <button className="w-full h-14 bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-slate-900/10 active:scale-95">
                  Launch Official Exam
                </button>
              </Link>
            </Card>
          )) : (
            <Card className="col-span-full p-16 rounded-[3rem] bg-slate-50 border-dashed border-2 border-slate-200 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center text-slate-200 mb-6">
                <Keyboard className="w-10 h-10" />
              </div>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No new exams assigned at this moment.</p>
            </Card>
          )}
        </div>
      </section>

      {/* 2. Results History Section */}
      <section className="space-y-8 pt-10 border-t border-slate-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Examination Results</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">History of your taken exams</p>
          </div>
        </div>

        {results.length === 0 ? (
          <Card className="p-16 rounded-[3rem] bg-slate-50 border-dashed border-2 border-slate-200 flex flex-col items-center justify-center text-center">
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs italic">You haven't completed any exams yet.</p>
          </Card>
        ) : (
          <div className="grid gap-6">
            {results.map((result) => (
              <Card key={result._id} className="p-2 rounded-[2.5rem] border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 group overflow-hidden">
                <div className="p-6 md:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-slate-900 flex flex-col items-center justify-center text-white shrink-0 group-hover:bg-primary transition-colors">
                      <p className="text-lg font-black leading-none">{result.wpm}</p>
                      <p className="text-[7px] font-black uppercase tracking-widest opacity-60 mt-1">WPM</p>
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900 group-hover:text-primary transition-colors">
                        {result.examId?.title || "Typing Practice"}
                      </h3>
                      <p className="text-xs font-bold text-slate-400 mt-2">
                        Attempted on {format(new Date(result.createdAt), "PPP")}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1 max-w-2xl">
                    {[
                      { l: 'Accuracy', v: `${result.accuracy}%`, c: 'text-emerald-600', bg: 'bg-emerald-50' },
                      { l: 'Errors', v: result.errorCount, c: 'text-rose-600', bg: 'bg-rose-50' },
                      { l: 'Net WPM', v: result.wpm, c: 'text-blue-600', bg: 'bg-blue-50' },
                      { l: 'Raw WPM', v: result.rawWpm, c: 'text-slate-600', bg: 'bg-slate-50' }
                    ].map((st, i) => (
                      <div key={i} className={`${st.bg} px-4 py-3 rounded-2xl`}>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">{st.l}</p>
                        <p className={`text-lg font-black ${st.c}`}>{st.v}</p>
                      </div>
                    ))}
                  </div>

                  <Link href={`/typing/results/${result._id}`}>
                    <button className="h-14 w-full lg:w-14 bg-slate-50 hover:bg-slate-900 hover:text-white rounded-2xl flex items-center justify-center transition-all group/btn border border-slate-100">
                      <ChevronDown className="w-6 h-6 -rotate-90 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
