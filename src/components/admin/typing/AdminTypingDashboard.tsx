"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, BookOpen, Keyboard, Clock, ChevronRight, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function AdminTypingDashboard() {
  const [passages, setPassages] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showExamForm, setShowExamForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [selectedExam, setSelectedExam] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    Promise.all([
      fetch("/api/admin/typing/passages").then(res => res.json()),
      fetch("/api/admin/typing/exams").then(res => res.json()),
      fetch("/api/admin/typing/categories").then(res => res.json())
    ]).then(([passagesData, examsData, categoriesData]) => {
      setPassages(passagesData);
      setExams(examsData);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      setLoading(false);
    });
  };

  const handleAddPassage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/admin/typing/passages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        toast.success("Passage added successfully!");
        e.currentTarget.reset();
        fetchData();
      } else {
        toast.error("Failed to add passage");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleAddExam = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/admin/typing/exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        toast.success("Exam scheduled successfully!");
        setShowExamForm(false);
        fetchData();
      } else {
        toast.error("Failed to schedule exam");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleAddCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/admin/typing/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        toast.success("Category created successfully!");
        setShowCategoryForm(false);
        fetchData();
      } else {
        toast.error("Failed to create category");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure? This will not delete exams in this category but will remove the category listing.")) return;
    try {
      const res = await fetch(`/api/admin/typing/categories/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Category deleted");
        fetchData();
      }
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  const fetchResults = async (examId: string) => {
    try {
      const res = await fetch(`/api/admin/typing/results?examId=${examId}`);
      const data = await res.json();
      setResults(data);
    } catch (error) {
      toast.error("Failed to fetch results");
    }
  };

  const handleManageResults = (exam: any) => {
    setSelectedExam(exam);
    fetchResults(exam._id);
  };

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-7xl mx-auto pb-20 p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-none">
            Typing <span className="text-gradient">Manager</span>
          </h1>
          <p className="text-slate-500 font-bold mt-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Manage passages and schedule government-standard exams.
          </p>
        </div>
      </div>

      <Tabs defaultValue="exams" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-xl mb-8 h-14 bg-slate-100 rounded-2xl p-1.5">
          <TabsTrigger value="exams" className="rounded-xl font-bold text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">Active Exams</TabsTrigger>
          <TabsTrigger value="categories" className="rounded-xl font-bold text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">Exam Categories</TabsTrigger>
          <TabsTrigger value="passages" className="rounded-xl font-bold text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">Passage Library</TabsTrigger>
        </TabsList>

        <TabsContent value="exams" className="space-y-8">
          {showExamForm ? (
            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl max-w-3xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black text-slate-900">Schedule New Exam</h3>
                <Button variant="ghost" onClick={() => setShowExamForm(false)}>Cancel</Button>
              </div>
              <form onSubmit={handleAddExam} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Exam Title</label>
                  <input name="title" placeholder="e.g. SSC CHSL Tier II Typing Test" className="w-full p-4 bg-slate-50 border-transparent rounded-2xl focus:border-indigo-500 focus:ring-indigo-500 transition-all font-medium" required />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Category</label>
                    <select name="category" className="w-full p-4 bg-slate-50 border-transparent rounded-2xl font-medium" required>
                      <option value="">-- Select Category --</option>
                      {categories.map(cat => (
                        <option key={cat._id} value={cat.name}>{cat.name}</option>
                      ))}
                      {categories.length === 0 && (
                        <>
                          <option value="SSC">SSC</option>
                          <option value="UP Police">UP Police</option>
                          <option value="KVS">KVS</option>
                        </>
                      )}
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Duration (Minutes)</label>
                    <input type="number" name="duration" defaultValue={10} min={1} className="w-full p-4 bg-slate-50 border-transparent rounded-2xl font-medium" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Select Passage</label>
                  <select name="passageId" className="w-full p-4 bg-slate-50 border-transparent rounded-2xl font-medium" required>
                    <option value="">-- Choose a passage --</option>
                    {passages.map(p => (
                      <option key={p._id} value={p._id}>{p.title} ({p.language} - {p.wordCount} words)</option>
                    ))}
                  </select>
                </div>
                <div className="pt-4">
                  <Button type="submit" className="w-full h-14 rounded-xl text-lg font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-200">
                    Publish Exam
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div 
                onClick={() => setShowExamForm(true)}
                className="p-8 rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-all min-h-[250px] group"
              >
                <div className="p-4 bg-white shadow-sm text-slate-400 group-hover:text-indigo-600 rounded-2xl mb-5 transition-all group-hover:scale-110">
                  <Plus className="w-8 h-8" />
                </div>
                <h3 className="font-black tracking-tight text-xl mb-1">Schedule New</h3>
                <p className="text-sm font-medium opacity-80">Launch a new typing test</p>
              </div>

              {exams.map((exam) => (
                <div key={exam._id} className="p-8 rounded-[2.5rem] border bg-white relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200/50 group flex flex-col min-h-[250px]">
                  <div className="flex justify-between items-start mb-6 relative z-10">
                    <span className="px-3 py-1.5 bg-slate-100 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-600">{exam.category}</span>
                    <span className={cn(
                      "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5",
                      exam.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    )}>
                      {exam.status === 'Active' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                      {exam.status}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 leading-tight mb-3 relative z-10">{exam.title}</h3>
                  <div className="flex items-center gap-3 text-sm font-bold text-slate-500 mb-6 relative z-10">
                    <div className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {exam.duration} Min</div>
                    <div className="w-1 h-1 rounded-full bg-slate-300" />
                    <div className="flex items-center gap-1.5"><Keyboard className="w-4 h-4" /> {exam.language}</div>
                  </div>
                  <Button 
                    onClick={() => handleManageResults(exam)}
                    variant="outline" 
                    className="mt-auto w-full h-12 rounded-xl font-bold border-2 hover:bg-slate-900 hover:text-white transition-colors relative z-10"
                  >
                    Manage Results
                  </Button>
                </div>
              ))}
            </div>
          )}

          {selectedExam && (
            <div className="fixed inset-0 bg-white z-[60] overflow-y-auto p-8 animate-in slide-in-from-right duration-300">
              <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-3xl font-black text-slate-900">{selectedExam.title}</h2>
                    <p className="text-slate-500 font-bold">Exam Results & Student Performance</p>
                  </div>
                  <Button variant="outline" onClick={() => setSelectedExam(null)} className="rounded-xl border-2 font-bold h-12 px-8">Close Results</Button>
                </div>

                <div className="bg-white border rounded-[2.5rem] overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b">
                        <th className="p-6 font-black text-slate-900 text-sm">STUDENT</th>
                        <th className="p-6 font-black text-slate-900 text-sm">WPM</th>
                        <th className="p-6 font-black text-slate-900 text-sm">ACCURACY</th>
                        <th className="p-6 font-black text-slate-900 text-sm">ERRORS</th>
                        <th className="p-6 font-black text-slate-900 text-sm">DATE</th>
                        <th className="p-6 font-black text-slate-900 text-sm">ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((res) => (
                        <tr key={res._id} className="border-b last:border-0 hover:bg-slate-50/50 transition-colors">
                          <td className="p-6">
                            <div className="font-bold text-slate-900">{res.userId?.name || "Deleted User"}</div>
                            <div className="text-xs text-slate-400 font-medium">{res.userId?.email}</div>
                          </td>
                          <td className="p-6 font-black text-indigo-600">{res.wpm}</td>
                          <td className="p-6 font-black text-emerald-600">{res.accuracy}%</td>
                          <td className="p-6 font-black text-rose-600">{res.errors}</td>
                          <td className="p-6 text-sm font-medium text-slate-500">
                            {new Date(res.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-6">
                            <Link href={`/typing/results/${res._id}`} target="_blank">
                              <Button variant="ghost" size="sm" className="font-bold text-xs">View Full</Button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                      {results.length === 0 && (
                        <tr>
                          <td colSpan={6} className="p-20 text-center">
                            <div className="text-slate-300 font-bold text-xl mb-2">No attempts yet</div>
                            <p className="text-slate-400 text-sm font-medium">Students haven't submitted this test yet.</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="categories" className="space-y-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-indigo-600 rounded-[2.5rem] p-8 shadow-2xl text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-[80px]" />
                <h3 className="text-2xl font-black tracking-tight mb-2 relative z-10">Add Category</h3>
                <p className="text-indigo-100 font-medium text-sm mb-8 relative z-10">Create new exam groupings.</p>
                
                <form onSubmit={handleAddCategory} className="space-y-5 relative z-10">
                  <input name="name" placeholder="Category Name (e.g. SSC CGL)" className="w-full p-4 bg-white/10 border-transparent rounded-2xl text-white placeholder:text-indigo-200 focus:bg-white/20 transition-colors font-medium" required />
                  <textarea name="description" placeholder="Short description..." className="w-full p-4 bg-white/10 border-transparent rounded-2xl h-32 text-white placeholder:text-indigo-200 focus:bg-white/20 transition-colors font-medium resize-none" />
                  
                  <Button type="submit" className="w-full h-14 rounded-xl text-lg font-bold bg-white text-indigo-600 hover:bg-slate-100">
                    Create Category
                  </Button>
                </form>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-2xl font-black tracking-tight text-slate-900">Existing Categories</h2>
                <span className="px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-black">{categories.length} Total</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categories.map((cat) => (
                  <div key={cat._id} className="p-6 rounded-3xl border bg-white hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all group flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xs uppercase">
                        {cat.name.substring(0, 2)}
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900">{cat.name}</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{cat.slug}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDeleteCategory(cat._id)}
                      className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                    >
                      <Plus className="w-5 h-5 rotate-45" />
                    </button>
                  </div>
                ))}
                
                {categories.length === 0 && (
                  <div className="col-span-full p-12 border-2 border-dashed rounded-3xl text-center">
                    <h3 className="text-xl font-black text-slate-900 mb-2">No categories defined</h3>
                    <p className="text-slate-500 font-medium">Create your first category using the form.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="passages" className="space-y-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full -mr-32 -mt-32 blur-[80px]" />
                <h3 className="text-2xl font-black tracking-tight mb-2 relative z-10">Add Passage</h3>
                <p className="text-slate-400 font-medium text-sm mb-8 relative z-10">Input text for future typing exams.</p>
                
                <form onSubmit={handleAddPassage} className="space-y-5 relative z-10">
                  <input name="title" placeholder="Passage Title" className="w-full p-4 bg-white/10 border-transparent rounded-2xl text-white placeholder:text-slate-400 focus:bg-white/20 transition-colors font-medium" required />
                  <div className="grid grid-cols-2 gap-4">
                    <select name="difficulty" className="w-full p-4 bg-white/10 border-transparent rounded-2xl text-white [&>option]:text-slate-900 font-medium appearance-none" required>
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                    <select name="language" className="w-full p-4 bg-white/10 border-transparent rounded-2xl text-white [&>option]:text-slate-900 font-medium appearance-none" required>
                      <option value="English">English</option>
                      <option value="Hindi">Hindi</option>
                    </select>
                  </div>
                  <textarea name="content" placeholder="Paste the exact text here..." className="w-full p-4 bg-white/10 border-transparent rounded-2xl h-48 text-white placeholder:text-slate-400 focus:bg-white/20 transition-colors font-medium resize-none" required />
                  
                  <Button type="submit" className="w-full h-14 rounded-xl text-lg font-bold bg-white text-slate-900 hover:bg-slate-100">
                    Save to Library
                  </Button>
                </form>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-2xl font-black tracking-tight text-slate-900">Passage Library</h2>
                <span className="px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-black">{passages.length} Total</span>
              </div>
              
              <div className="space-y-4">
                {passages.map((passage) => (
                  <div key={passage._id} className="p-6 rounded-3xl border bg-white hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all group flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-black text-lg text-slate-900">{passage.title}</h4>
                        <div className="flex items-center gap-3 mt-1 text-[11px] font-black uppercase tracking-widest text-slate-400">
                          <span className={cn(
                            passage.difficulty === 'Easy' ? 'text-emerald-500' :
                            passage.difficulty === 'Medium' ? 'text-amber-500' : 'text-rose-500'
                          )}>{passage.difficulty}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-300" />
                          <span>{passage.language}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-300" />
                          <span>{passage.wordCount} Words</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                  </div>
                ))}
                
                {passages.length === 0 && (
                  <div className="p-12 border-2 border-dashed rounded-3xl text-center">
                    <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <AlertCircle className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">No passages found</h3>
                    <p className="text-slate-500 font-medium">Add your first typing passage using the form.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
