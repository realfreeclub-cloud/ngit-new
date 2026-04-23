"use client";

import React, { useState, useEffect } from "react";
import TypingEngine from "@/components/typing/TypingEngine";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function TypingExamPage({ params }: { params: { id: string } }) {
  const [exam, setExam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    <div className="flex justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  if (!exam) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-xl font-bold">Exam not found or not active.</p>
    </div>
  );

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
