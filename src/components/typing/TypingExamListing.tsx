"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Search, ChevronDown, User } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function TypingExamListing() {
  const [exams, setExams] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExams();
    fetch("/api/typing/categories")
      .then(res => res.json())
      .then(data => setCategories(Array.isArray(data) ? data : []));
  }, []);

  const fetchExams = (category = "All") => {
    setLoading(true);
    const url = category !== "All" ? `/api/typing/exams?category=${encodeURIComponent(category)}` : "/api/typing/exams";
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setExams(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setExams([]);
        setLoading(false);
      });
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    fetchExams(category);
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f5f4ef]">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="mb-6 sm:mb-10">
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 mb-4 sm:mb-6">Select Exams for Typing</h1>
          <hr className="border-t border-slate-900 mb-8" />
          
          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded bg-[#f1f1f1] text-sm outline-none focus:border-slate-500"
                />
              </div>
              <button className="flex items-center justify-between px-4 py-2 bg-black text-white text-sm font-bold rounded min-w-[120px]">
                Exam Type <ChevronDown className="w-4 h-4 ml-2" />
              </button>
            </div>

            <button className="flex items-center justify-between px-4 py-2 bg-black text-white text-sm font-bold rounded min-w-[180px]">
              Order by: Relevance <ChevronDown className="w-4 h-4 ml-2" />
            </button>
          </div>

          {/* Popular Search Keywords */}
          <div className="mb-12">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
              <Search className="w-4 h-4 text-blue-600" /> Filter by Category
            </h3>
            <div className="flex flex-wrap gap-2">
              <span 
                onClick={() => handleCategoryClick("All")}
                className={cn(
                  "px-3 py-1 border border-blue-600 text-xs font-bold rounded cursor-pointer transition-all",
                  selectedCategory === "All" ? "bg-blue-600 text-white" : "text-blue-600 hover:bg-blue-50"
                )}
              >
                All Exams
              </span>
              {categories.map(cat => (
                <span 
                  key={cat._id} 
                  onClick={() => handleCategoryClick(cat.name)}
                  className={cn(
                    "px-3 py-1 border border-blue-600 text-xs font-bold rounded cursor-pointer transition-all",
                    selectedCategory === cat.name ? "bg-blue-600 text-white" : "text-blue-600 hover:bg-blue-50"
                  )}
                >
                  {cat.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Exams Grid with Dotted Background Pattern */}
        <div className="relative">
          {/* Subtle dotted background pattern */}
          <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: "radial-gradient(#000 1px, transparent 1px)", backgroundSize: "10px 10px" }}></div>
          
          <div className="relative z-10 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {exams.length === 0 ? (
              <div className="col-span-full py-10 text-center text-slate-500">No exams available at the moment.</div>
            ) : (
              exams.map((exam) => (
                <Link href={`/typing/exam/${exam._id}`} key={exam._id}>
                  <Card className="bg-white border border-slate-300 rounded-xl p-5 hover:shadow-lg transition-all cursor-pointer h-full flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          CREATED {format(new Date(exam.createdAt || Date.now()), "MMM dd, yyyy")}
                        </span>
                        <span className="bg-[#12b886] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                          New
                        </span>
                      </div>
                      <h2 className="text-lg font-bold text-slate-900 leading-tight mb-6 line-clamp-2">
                        {exam.title}
                      </h2>
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-xs font-medium text-slate-700 mb-4">
                        <span>{exam.passageId?.wordCount || 0} words</span>
                        <span>{exam.duration}:00 min.</span>
                      </div>
                      <div className="bg-black text-white text-xs font-bold inline-flex items-center gap-1.5 px-3 py-1.5 rounded">
                        <User className="w-3 h-3" />
                        <span>{exam.participantCount || 0}</span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
