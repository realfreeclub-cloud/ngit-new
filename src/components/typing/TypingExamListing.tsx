"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Keyboard, Timer, Languages, ArrowRight, Search, Filter } from "lucide-react";

export default function TypingExamListing() {
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/typing/exams")
      .then(res => res.json())
      .then(data => {
        setExams(data);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2">Typing Examinations</h1>
          <p className="text-slate-500 font-medium">Practice and excel in government-standard typing tests.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search exams..." 
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          <button className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
            <Filter className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </div>

      {exams.length === 0 ? (
        <Card className="p-20 text-center border-dashed bg-slate-50">
          <div className="bg-white p-4 rounded-2xl inline-block shadow-sm mb-4">
            <Keyboard className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No Active Exams</h3>
          <p className="text-slate-500">Check back later for scheduled examinations.</p>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {exams.map((exam) => (
            <Card key={exam._id} className="group p-6 hover:shadow-2xl transition-all duration-300 border-slate-100 relative overflow-hidden flex flex-col h-full">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[100px] -z-10 group-hover:scale-125 transition-transform duration-500" />
              
              <div className="flex items-center justify-between mb-4">
                <Badge variant="secondary" className="bg-primary/10 text-primary font-bold">
                  {exam.category}
                </Badge>
                <div className="flex items-center gap-1 text-slate-400">
                  <Languages className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase">{exam.language}</span>
                </div>
              </div>

              <h2 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-primary transition-colors">
                {exam.title}
              </h2>

              <div className="space-y-3 mb-8 flex-grow">
                <div className="flex items-center gap-3 text-slate-600">
                  <Timer className="w-5 h-5 text-slate-400" />
                  <span className="font-medium">{exam.duration} Minutes Duration</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <Keyboard className="w-5 h-5 text-slate-400" />
                  <span className="font-medium">{exam.passageId?.wordCount || 0} Total Words</span>
                </div>
              </div>

              <Link 
                href={`/typing/exam/${exam._id}`}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-primary transition-all group-hover:shadow-lg"
              >
                Start Test <ArrowRight className="w-5 h-5" />
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
