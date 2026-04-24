"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { Keyboard, Zap, Target, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function StudentTypingDashboard() {
  const { data: session } = useSession();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetch("/api/typing/results")
        .then(res => res.json())
        .then(data => {
          setResults(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [session]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Typing Exams</h1>
          <p className="text-muted-foreground">View your typing test results and history.</p>
        </div>
        <Link 
          href="/typing" 
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium text-sm hover:bg-primary/90"
        >
          Take New Test
        </Link>
      </div>

      {results.length === 0 ? (
        <Card className="p-12 text-center flex flex-col items-center">
          <Keyboard className="w-16 h-16 text-slate-200 mb-4" />
          <h3 className="text-xl font-bold mb-2">No Typing Tests Taken</h3>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">
            You haven't completed any typing exams yet. Start practicing to see your progress here!
          </p>
          <Link 
            href="/typing" 
            className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium"
          >
            Start Typing Now
          </Link>
        </Card>
      ) : (
        <div className="grid gap-6">
          {results.map((result) => (
            <Card key={result._id} className="p-6">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b pb-4 mb-4">
                <div>
                  <h3 className="text-lg font-bold">
                    {result.examId?.title || "Unknown Exam"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Taken on {format(new Date(result.createdAt), "PPP 'at' p")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold uppercase">
                    {result.examId?.language || "Language"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg flex items-center gap-3">
                  <div className="p-2 bg-blue-500 text-white rounded-md">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-blue-600 font-bold uppercase">Net WPM</p>
                    <p className="text-2xl font-black text-blue-900">{result.wpm}</p>
                  </div>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg flex items-center gap-3">
                  <div className="p-2 bg-purple-500 text-white rounded-md">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-purple-600 font-bold uppercase">Accuracy</p>
                    <p className="text-2xl font-black text-purple-900">{result.accuracy}%</p>
                  </div>
                </div>

                <div className="bg-red-50 p-4 rounded-lg flex items-center gap-3">
                  <div className="p-2 bg-red-500 text-white rounded-md">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-red-600 font-bold uppercase">Errors</p>
                    <p className="text-2xl font-black text-red-900">{result.errors}</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg flex items-center gap-3">
                  <div className="p-2 bg-slate-500 text-white rounded-md">
                    <Keyboard className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 font-bold uppercase">Raw WPM</p>
                    <p className="text-2xl font-black text-slate-900">{result.rawWpm}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
