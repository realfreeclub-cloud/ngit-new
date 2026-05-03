import React from "react";
import connectDB from "@/lib/db";
import GovExam from "@/models/GovExam";
import TypingExam from "@/models/TypingExam";
import Link from "next/link";
import { ChevronRight, Award } from "lucide-react";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function TypingExamsPage({ searchParams: searchParamsPromise }: { searchParams: Promise<{ lang?: string }> }) {
  const searchParams = await searchParamsPromise;
  await connectDB();
  const exams = await GovExam.find({ active: true }).sort({ title: 1 });

  // Get test counts per exam, filtered by language if requested
  const matchStage: any = { status: "Active" };
  if (searchParams.lang) {
    matchStage.language = searchParams.lang;
  }

  const examCounts = await TypingExam.aggregate([
    { $match: matchStage },
    { $group: { _id: "$govExamId", count: { $sum: 1 } } }
  ]);
  const countMap = Object.fromEntries(examCounts.map((e: any) => [e._id?.toString(), e.count]));

  const currentLang = searchParams.lang || "All";

  const activeExams = exams.filter(exam => (countMap[exam._id.toString()] || 0) > 0);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        
        <div className="text-center space-y-4">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-widest mb-2">
            Official Pattern Tests
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">
            Government <span className="text-indigo-600">Typing Exams</span>
          </h1>
          <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">
            Select your target government exam to practice with official patterns, exact difficulty levels, and realistic interfaces.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeExams.map((exam) => (
            <Link key={exam._id.toString()} href={`/typing/official/${exam.slug}${searchParams.lang ? `?lang=${searchParams.lang}` : ''}`}>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-xl hover:border-indigo-200 hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -mr-8 -mt-8 z-0 transition-transform group-hover:scale-110"></div>
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center p-2 shrink-0">
                      {exam.logo ? (
                        <Image src={exam.logo} alt={exam.title} width={40} height={40} className="object-contain" />
                      ) : (
                        <Award className="w-8 h-8 text-indigo-500" />
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                       <div className="bg-indigo-50 text-indigo-700 text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
                         {countMap[exam._id.toString()] || 0} Tests
                       </div>
                       <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-50 border border-emerald-100">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                          <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Active</span>
                       </div>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-2">
                    {exam.title}
                  </h3>
                  <p className="text-sm text-slate-500 font-medium mb-6 flex-grow">
                    {exam.description || `Practice officially patterned typing tests designed specifically for ${exam.title}.`}
                  </p>
                  
                  <button className="w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest group-hover:bg-indigo-600 transition-all shadow-xl group-hover:shadow-indigo-500/20 flex items-center justify-center gap-2">
                    Start Practice <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </Link>
          ))}
          {exams.length === 0 && (
            <div className="col-span-full py-16 text-center text-slate-400 font-medium">
              No active government exams found.
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
