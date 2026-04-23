"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  Target, 
  Timer, 
  AlertCircle, 
  Trophy, 
  ArrowLeft,
  CheckCircle2,
  XCircle
} from "lucide-react";
import Link from "next/link";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from "recharts";

export default function TypingResultDetails({ params }: { params: { id: string } }) {
  const [result, setResult] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/typing/results/details/${params.id}`);
        const data = await res.json();
        setResult(data);

        if (data.examId?._id) {
          const lbRes = await fetch(`/api/typing/exams/leaderboard/${data.examId._id}`);
          const lbData = await lbRes.json();
          setLeaderboard(lbData);
        }
      } catch (error) {
        console.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params.id]);

  if (loading) return <div className="p-20 text-center animate-pulse font-bold">Generating your report...</div>;
  if (!result) return <div className="p-20 text-center">Result not found.</div>;

  const originalWords = result.examId.passageId.content.trim().split(/\s+/);
  const submittedWords = result.submittedText.trim().split(/\s+/);

  // Mock data for the performance chart (normally you'd track this per second during the test)
  const chartData = [
    { time: "0:00", wpm: 0 },
    { time: "1:00", wpm: Math.round(result.wpm * 0.7) },
    { time: "2:00", wpm: Math.round(result.wpm * 0.9) },
    { time: "3:00", wpm: result.wpm },
    { time: "4:00", wpm: Math.round(result.wpm * 1.1) },
    { time: "Final", wpm: result.wpm },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/typing" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-bold">
            <ArrowLeft className="w-5 h-5" /> Back to Exams
          </Link>
          <div className="text-right">
            <h1 className="text-3xl font-black text-slate-900">{result.examId.title}</h1>
            <p className="text-slate-500 font-medium">Completed on {new Date(result.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Stats Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Primary Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-6 bg-primary text-white border-none shadow-xl shadow-primary/20">
                <Zap className="w-6 h-6 mb-4 opacity-80" />
                <p className="text-sm font-bold uppercase tracking-wider opacity-80">Net WPM</p>
                <h2 className="text-4xl font-black">{result.wpm}</h2>
              </Card>

              <Card className="p-6 bg-white border-slate-100 shadow-lg">
                <Target className="w-6 h-6 mb-4 text-emerald-500" />
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Accuracy</p>
                <h2 className="text-4xl font-black text-slate-900">{result.accuracy}%</h2>
              </Card>

              <Card className="p-6 bg-white border-slate-100 shadow-lg">
                <AlertCircle className="w-6 h-6 mb-4 text-red-500" />
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Errors</p>
                <h2 className="text-4xl font-black text-slate-900">{result.errors}</h2>
              </Card>

              <Card className="p-6 bg-white border-slate-100 shadow-lg">
                <Timer className="w-6 h-6 mb-4 text-blue-500" />
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Time</p>
                <h2 className="text-4xl font-black text-slate-900">{Math.floor(result.timeTaken / 60)}m {result.timeTaken % 60}s</h2>
              </Card>
            </div>

            {/* Performance Chart */}
            <Card className="p-8 shadow-lg border-slate-100 bg-white">
              <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                Speed Analytics <Badge variant="secondary">Live Tracker</Badge>
              </h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorWpm" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <Tooltip 
                      contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="wpm" 
                      stroke="#2563eb" 
                      strokeWidth={4}
                      fillOpacity={1} 
                      fill="url(#colorWpm)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Word Breakdown */}
            <Card className="p-8 shadow-lg border-slate-100 bg-white">
              <h3 className="text-xl font-black text-slate-900 mb-6">Mistake Analysis</h3>
              <div className="flex flex-wrap gap-x-2 gap-y-3 font-mono text-lg leading-relaxed">
                {originalWords.map((word, idx) => {
                  const submittedWord = submittedWords[idx];
                  const isCorrect = submittedWord === word;
                  const isTyped = idx < submittedWords.length;

                  if (!isTyped) return <span key={idx} className="text-slate-300">{word}</span>;

                  return (
                    <div key={idx} className="group relative">
                      <span className={`${isCorrect ? 'text-emerald-600' : 'text-red-500 bg-red-50 rounded px-1 decoration-wavy underline font-bold'}`}>
                        {submittedWord}
                      </span>
                      {!isCorrect && (
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          Should be: {word}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Sidebar / Leaderboard */}
          <div className="space-y-8">
            <Card className="p-8 border-none bg-slate-900 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-bl-full -z-0" />
              <div className="relative z-10">
                <div className="bg-primary w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary/50">
                  <Trophy className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black mb-2">Hall of Fame</h3>
                <p className="text-slate-400 text-sm mb-8">Top performers for this exam</p>

                <div className="space-y-4">
                  {leaderboard.map((entry, idx) => (
                    <div key={entry._id} className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-black ${idx === 0 ? 'bg-yellow-500 text-yellow-950' : 'bg-slate-700 text-slate-300'}`}>
                          {idx + 1}
                        </span>
                        <div>
                          <p className="text-sm font-bold truncate max-w-[120px]">{entry.userId?.name || "Candidate"}</p>
                          <p className="text-[10px] text-slate-500 uppercase font-black">{entry.accuracy}% Accuracy</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-primary">{entry.wpm}</p>
                        <p className="text-[10px] text-slate-500 uppercase font-black">WPM</p>
                      </div>
                    </div>
                  ))}

                  {leaderboard.length === 0 && (
                    <p className="text-center py-10 text-slate-500 font-bold italic">No rankings yet.</p>
                  )}
                </div>
              </div>
            </Card>

            <Card className="p-8 bg-white border-slate-100 shadow-lg text-center">
              <h4 className="font-bold text-slate-900 mb-4">Improve your score?</h4>
              <button 
                onClick={() => window.location.reload()} 
                className="w-full py-3 bg-slate-100 text-slate-900 rounded-xl font-bold hover:bg-slate-200 transition-all"
              >
                Retake Practice
              </button>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
