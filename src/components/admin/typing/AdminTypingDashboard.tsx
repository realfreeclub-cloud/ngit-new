"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, BookOpen, Keyboard, Clock, ChevronRight, CheckCircle2, AlertCircle, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function AdminTypingDashboard() {
  const [passages, setPassages] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [wordSets, setWordSets] = useState<any[]>([]);
  const [essays, setEssays] = useState<any[]>([]);
  const [currentPassages, setCurrentPassages] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showExamForm, setShowExamForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [selectedExam, setSelectedExam] = useState<any>(null);
  const [editingPassage, setEditingPassage] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [passagesData, examsData, categoriesData, wordsData, essaysData, currentData] = await Promise.all([
        fetch("/api/admin/typing/passages").then(res => res.json()),
        fetch("/api/admin/typing/exams").then(res => res.json()),
        fetch("/api/admin/typing/categories").then(res => res.json()),
        fetch("/api/admin/typing/words").then(res => res.json()),
        fetch("/api/admin/typing/essays").then(res => res.json()),
        fetch("/api/admin/typing/current").then(res => res.json())
      ]);

      setPassages(Array.isArray(passagesData) ? passagesData : []);
      setExams(Array.isArray(examsData) ? examsData : []);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      setWordSets(Array.isArray(wordsData) ? wordsData : []);
      setEssays(Array.isArray(essaysData) ? essaysData : []);
      setCurrentPassages(Array.isArray(currentData) ? currentData : []);
      setLoading(false);
    } catch (error) {
      console.error("Fetch Data Error:", error);
      toast.error("Failed to refresh dashboard data");
      setLoading(false);
    }
  };

  const handleDeletePassage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this passage?")) return;
    try {
      const res = await fetch(`/api/admin/typing/passages/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Passage deleted");
        await fetchData();
      }
    } catch (error) {
      toast.error("Failed to delete passage");
    }
  };

  const handleUpdatePassage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingPassage) return;
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch(`/api/admin/typing/passages/${editingPassage._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        toast.success("Passage updated!");
        setEditingPassage(null);
        await fetchData();
      } else {
        toast.error("Update failed");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleAddPassage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/typing/passages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        toast.success("Passage added successfully!");
        form.reset();
        await fetchData();
      } else {
        toast.error("Failed to add passage");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddExam = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data: any = Object.fromEntries(formData.entries());
    data.autoScroll = (form.elements.namedItem('autoScroll') as HTMLInputElement)?.checked;
    data.showScrollbar = (form.elements.namedItem('showScrollbar') as HTMLInputElement)?.checked;

    try {
      const res = await fetch("/api/admin/typing/exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        toast.success("Exam scheduled successfully!");
        setShowExamForm(false);
        await fetchData();
      } else {
        toast.error("Failed to schedule exam");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleAddCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
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
        await fetchData();
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
        await fetchData();
      }
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  const handleAddWordSet = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const words = (formData.get('words') as string).split(',').map(w => w.trim()).filter(w => w.length > 0);
    const data = {
        name: formData.get('name'),
        category: formData.get('category'),
        value: formData.get('value'),
        words,
        language: formData.get('language')
    };

    try {
      const res = await fetch("/api/admin/typing/words", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        toast.success("Word set created!");
        form.reset();
        await fetchData();
      }
    } catch (error) {
      toast.error("Error creating word set");
    }
  };

  const handleDeleteWordSet = async (id: string) => {
    await fetch(`/api/admin/typing/words/${id}`, { method: "DELETE" });
    await fetchData();
  };

  const handleAddEssay = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const content = formData.get('content') as string;
    const data = {
        topic: formData.get('topic'),
        title: formData.get('title'),
        content,
        wordCount: content.split(/\s+/).length,
        language: formData.get('language')
    };

    try {
      const res = await fetch("/api/admin/typing/essays", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        toast.success("Essay added!");
        form.reset();
        await fetchData();
      }
    } catch (error) {
      toast.error("Error adding essay");
    }
  };

  const handleDeleteEssay = async (id: string) => {
    if (!confirm("Delete this essay?")) return;
    await fetch(`/api/admin/typing/essays/${id}`, { method: "DELETE" });
    await fetchData();
  };

  const handleAddCurrent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = {
        title: formData.get('title'),
        content: formData.get('content'),
        language: formData.get('language')
    };

    try {
      const res = await fetch("/api/admin/typing/current", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        toast.success("Current passage added!");
        form.reset();
        await fetchData();
      }
    } catch (error) {
      toast.error("Error adding passage");
    }
  };

  const handleDeleteCurrent = async (id: string) => {
    if (!confirm("Delete this passage?")) return;
    await fetch(`/api/admin/typing/current/${id}`, { method: "DELETE" });
    await fetchData();
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
    <div className="space-y-6 sm:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-7xl mx-auto pb-20 p-4 sm:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-4 sm:mb-8">
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
        <div className="overflow-x-auto pb-2 scrollbar-hide">
          <TabsList className="flex w-max mb-4 sm:mb-8 h-12 sm:h-14 bg-slate-100 rounded-xl sm:rounded-2xl p-1 sm:p-1.5 overflow-x-auto scrollbar-hide">
            <TabsTrigger value="exams" className="rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm px-6">Official Exams</TabsTrigger>
            <TabsTrigger value="categories" className="rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm px-6">Categories</TabsTrigger>
            <TabsTrigger value="passages" className="rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm px-6">Library</TabsTrigger>
            <TabsTrigger value="words" className="rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm px-6">Word Practice</TabsTrigger>
            <TabsTrigger value="essays" className="rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm px-6">Essay Practice</TabsTrigger>
            <TabsTrigger value="current" className="rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm px-6">Current Affairs</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="exams" className="space-y-8">
          {showExamForm ? (
            <div className="bg-white rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-10 border border-slate-100 shadow-xl max-w-3xl mx-auto">
              <div className="flex justify-between items-center mb-6 sm:mb-8">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">Configure Typing Exam</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowExamForm(false)}>Cancel</Button>
              </div>
              <form onSubmit={handleAddExam} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Exam Mode (Preset)</label>
                    <select 
                      name="examMode" 
                      className="w-full p-4 bg-slate-50 border-transparent rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      onChange={(e) => {
                        const mode = e.target.value;
                        const form = e.currentTarget.form;
                        if (!form) return;
                        if (mode === "SSC") {
                          form.backspaceMode.value = "full";
                          form.highlightMode.value = "word";
                          form.duration.value = "10";
                        } else if (mode === "CPCT") {
                          form.backspaceMode.value = "word";
                          form.highlightMode.value = "none";
                          form.duration.value = "15";
                        } else if (mode === "Court") {
                          form.backspaceMode.value = "disabled";
                          form.highlightMode.value = "none";
                          form.duration.value = "10";
                        }
                      }}
                    >
                      <option value="General">General Practice</option>
                      <option value="SSC">SSC (Full Backspace, Word Highlighting)</option>
                      <option value="CPCT">CPCT (Word Backspace, No Highlighting)</option>
                      <option value="Court">Court (No Backspace, No Highlighting)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Exam Title</label>
                    <input name="title" placeholder="e.g. SSC CHSL Typing Test" className="w-full p-4 bg-slate-50 border-transparent rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-slate-900 outline-none" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Category</label>
                    <select name="category" className="w-full p-4 bg-slate-50 border-transparent rounded-2xl font-bold text-slate-900 outline-none" required>
                      <option value="">-- Select --</option>
                      {categories.map(cat => (
                        <option key={cat._id} value={cat.name}>{cat.name}</option>
                      ))}
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Duration (Min)</label>
                    <input type="number" name="duration" defaultValue={10} min={1} className="w-full p-4 bg-slate-50 border-transparent rounded-2xl font-bold text-slate-900 outline-none" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Word Limit (0=None)</label>
                    <input type="number" name="wordLimit" defaultValue={0} min={0} className="w-full p-4 bg-slate-50 border-transparent rounded-2xl font-bold text-slate-900 outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Backspace Mode</label>
                    <select name="backspaceMode" className="w-full p-4 bg-slate-50 border-transparent rounded-2xl font-bold text-slate-900 outline-none">
                      <option value="full">Full Access (Anywhere)</option>
                      <option value="word">Word Only (Current Word Only)</option>
                      <option value="disabled">Disabled (No Edits)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Highlight Mode</label>
                    <select name="highlightMode" className="w-full p-4 bg-slate-50 border-transparent rounded-2xl font-bold text-slate-900 outline-none">
                      <option value="word">Active Word Highlight</option>
                      <option value="word_error">Color Green/Red (Live)</option>
                      <option value="letter">Letter-by-Letter</option>
                      <option value="none">No Highlighting (Blind)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-[2rem]">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-sm font-black text-slate-900">Auto Scroll</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Follow cursor automatically</p>
                    </div>
                    <input type="checkbox" name="autoScroll" defaultChecked className="w-5 h-5 rounded-lg border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-sm font-black text-slate-900">Scrollbar</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Show vertical scrollbar</p>
                    </div>
                    <input type="checkbox" name="showScrollbar" defaultChecked className="w-5 h-5 rounded-lg border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Select Passage</label>
                  <select name="passageId" className="w-full p-4 bg-slate-50 border-transparent rounded-2xl font-bold text-slate-900 outline-none" required>
                    <option value="">-- Choose a passage from Library --</option>
                    {passages.map(p => (
                      <option key={p._id} value={p._id}>{p.title} ({p.language} - {p.wordCount} words)</option>
                    ))}
                  </select>
                </div>
                
                <div className="pt-4">
                  <Button type="submit" className="w-full h-16 rounded-[1.5rem] text-lg font-black bg-slate-900 hover:bg-black text-white shadow-2xl shadow-slate-200">
                    Launch Official Exam
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
                  <div className="flex items-center gap-3 text-sm font-bold text-slate-500 mb-2 relative z-10">
                    <div className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {exam.duration} Min</div>
                    <div className="w-1 h-1 rounded-full bg-slate-300" />
                    <div className="flex items-center gap-1.5"><Keyboard className="w-4 h-4" /> {exam.language}</div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-6 relative z-10">
                    <Badge variant="secondary" className="bg-slate-50 text-[9px] px-2 py-0 font-bold border-slate-200">Mode: {exam.examMode || 'Gen'}</Badge>
                    <Badge variant="secondary" className="bg-slate-50 text-[9px] px-2 py-0 font-bold border-slate-200">BS: {exam.backspaceMode || 'Full'}</Badge>
                    <Badge variant="secondary" className="bg-slate-50 text-[9px] px-2 py-0 font-bold border-slate-200">Word Limit: {exam.wordLimit || '∞'}</Badge>
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
            <div className="fixed inset-0 bg-white z-[100] overflow-y-auto p-4 sm:p-8 animate-in slide-in-from-right duration-300">
              <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900">{selectedExam.title}</h2>
                    <div className="flex flex-wrap items-center gap-2 mt-2 font-bold text-xs uppercase tracking-wider text-slate-400">
                      <span>{selectedExam.examMode} MODE</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <span>BS: {selectedExam.backspaceMode}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <span>HIGHLIGHT: {selectedExam.highlightMode}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <span>LIMIT: {selectedExam.wordLimit || 'NONE'}</span>
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => setSelectedExam(null)} className="w-full sm:w-auto rounded-xl border-2 font-bold h-12 px-8">Close Results</Button>
                </div>

                <div className="bg-white border rounded-2xl sm:rounded-[2.5rem] overflow-hidden shadow-sm overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[600px]">
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
                          <td className="p-6 font-black text-rose-600">{res.errorCount || 0}</td>
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-indigo-600 rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-8 shadow-2xl text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-[80px]" />
                <h3 className="text-xl sm:text-2xl font-black tracking-tight mb-2 relative z-10">Add Category</h3>
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className={cn(
                "rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-8 shadow-2xl text-white relative overflow-hidden transition-colors duration-500",
                editingPassage ? "bg-indigo-900" : "bg-slate-900"
              )}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full -mr-32 -mt-32 blur-[80px]" />
                <div className="flex justify-between items-center mb-2 relative z-10">
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight">{editingPassage ? "Edit Passage" : "Add Passage"}</h3>
                  {editingPassage && (
                    <button onClick={() => setEditingPassage(null)} className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full font-bold">Cancel</button>
                  )}
                </div>
                <p className="text-slate-400 font-medium text-sm mb-8 relative z-10">
                  {editingPassage ? `Updating "${editingPassage.title}"` : "Input text for future typing exams."}
                </p>
                
                <form onSubmit={editingPassage ? handleUpdatePassage : handleAddPassage} className="space-y-5 relative z-10">
                  <input 
                    name="title" 
                    defaultValue={editingPassage?.title || ""} 
                    placeholder="Passage Title" 
                    className="w-full p-4 bg-white/10 border-transparent rounded-2xl text-white placeholder:text-slate-400 focus:bg-white/20 transition-colors font-medium outline-none" 
                    required 
                    key={editingPassage?._id + "-title"}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <select 
                      name="difficulty" 
                      defaultValue={editingPassage?.difficulty || "Medium"} 
                      className="w-full p-4 bg-white/10 border-transparent rounded-2xl text-white [&>option]:text-slate-900 font-medium appearance-none outline-none" 
                      required
                      key={editingPassage?._id + "-diff"}
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                    <select 
                      name="language" 
                      defaultValue={editingPassage?.language || "English"} 
                      className="w-full p-4 bg-white/10 border-transparent rounded-2xl text-white [&>option]:text-slate-900 font-medium appearance-none outline-none" 
                      required
                      key={editingPassage?._id + "-lang"}
                    >
                      <option value="English">English</option>
                      <option value="Hindi">Hindi</option>
                    </select>
                  </div>
                  <textarea 
                    name="content" 
                    defaultValue={editingPassage?.content || ""} 
                    placeholder="Paste the exact text here..." 
                    className="w-full p-4 bg-white/10 border-transparent rounded-2xl h-48 text-white placeholder:text-slate-400 focus:bg-white/20 transition-colors font-medium resize-none outline-none" 
                    required 
                    key={editingPassage?._id + "-content"}
                  />
                  
                  <Button type="submit" disabled={submitting} className="w-full h-14 rounded-xl text-lg font-bold bg-white text-slate-900 hover:bg-slate-100 disabled:opacity-50">
                    {submitting ? "Saving..." : (editingPassage ? "Update Library" : "Save to Library")}
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
                  <div key={passage._id} className="p-6 rounded-3xl border bg-white hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all group flex items-center justify-between">
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
                    
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setEditingPassage(passage)}
                        className="w-10 h-10 rounded-xl hover:bg-indigo-50 hover:text-indigo-600"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDeletePassage(passage._id)}
                        className="w-10 h-10 rounded-xl hover:bg-rose-50 hover:text-rose-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <ChevronRight className="w-5 h-5 text-slate-300 ml-2" />
                    </div>
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
        <TabsContent value="words" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <Card className="p-8 rounded-[2rem] bg-blue-600 text-white border-none shadow-2xl">
                        <h3 className="text-2xl font-black mb-4">Add Word Set</h3>
                        <form onSubmit={handleAddWordSet} className="space-y-4">
                            <input name="name" placeholder="Set Name (e.g. Set A)" className="w-full p-4 bg-white/10 rounded-xl outline-none placeholder:text-blue-200" required />
                            <select name="category" className="w-full p-4 bg-white/10 rounded-xl outline-none [&>option]:text-slate-900" required>
                                <option value="A-Z">A to Z</option>
                                <option value="Length">Word Length</option>
                            </select>
                            <input name="value" placeholder="Value (e.g. A or 5)" className="w-full p-4 bg-white/10 rounded-xl outline-none placeholder:text-blue-200" required />
                            <select name="language" className="w-full p-4 bg-white/10 rounded-xl outline-none [&>option]:text-slate-900">
                                <option value="English">English</option>
                                <option value="Hindi">Hindi</option>
                            </select>
                            <textarea name="words" placeholder="Words (comma separated)" className="w-full p-4 bg-white/10 rounded-xl outline-none h-32 placeholder:text-blue-200" required />
                            <Button type="submit" className="w-full h-14 bg-white text-blue-600 hover:bg-blue-50 font-black">Save Word Set</Button>
                        </form>
                    </Card>
                </div>
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {wordSets.map(set => (
                        <Card key={set._id} className="p-6 rounded-[1.5rem] flex items-center justify-between group">
                            <div>
                                <h4 className="font-black text-slate-900">{set.name}</h4>
                                <p className="text-[10px] font-black uppercase text-slate-400">{set.category} • {set.language}</p>
                                <p className="text-xs text-slate-500 mt-2 line-clamp-1">{set.words.length} Words</p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteWordSet(set._id)} className="text-slate-300 hover:text-rose-600">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </Card>
                    ))}
                </div>
            </div>
        </TabsContent>

        <TabsContent value="essays" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <Card className="p-8 rounded-[2rem] bg-emerald-600 text-white border-none shadow-2xl">
                        <h3 className="text-2xl font-black mb-4">Add Essay</h3>
                        <form onSubmit={handleAddEssay} className="space-y-4">
                            <select name="topic" className="w-full p-4 bg-white/10 rounded-xl outline-none [&>option]:text-slate-900" required>
                                <option value="Gandhi">Mahatma Gandhi</option>
                                <option value="Nehru">Jawaharlal Nehru</option>
                                <option value="15 Aug">Independence Day</option>
                                <option value="26 Jan">Republic Day</option>
                                <option value="Women Empowerment">Women Empowerment</option>
                            </select>
                            <div className="grid grid-cols-2 gap-4">
                                <input name="title" placeholder="Essay Title" className="w-full p-4 bg-white/10 rounded-xl outline-none placeholder:text-emerald-200" required />
                                <select name="difficulty" className="w-full p-4 bg-white/10 rounded-xl outline-none [&>option]:text-slate-900" required>
                                    <option value="Easy">Easy</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Hard">Hard</option>
                                </select>
                            </div>
                            <select name="language" className="w-full p-4 bg-white/10 rounded-xl outline-none [&>option]:text-slate-900">
                                <option value="English">English</option>
                                <option value="Hindi">Hindi</option>
                            </select>
                            <textarea name="content" placeholder="Full Content..." className="w-full p-4 bg-white/10 rounded-xl outline-none h-48 placeholder:text-emerald-200" required />
                            <Button type="submit" className="w-full h-14 bg-white text-emerald-600 hover:bg-emerald-50 font-black">Save Essay</Button>
                        </form>
                    </Card>
                </div>
                <div className="lg:col-span-2 space-y-4">
                    {essays.map(essay => (
                        <Card key={essay._id} className="p-6 rounded-[1.5rem] flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 flex items-center justify-center rounded-xl">
                                    <BookOpen className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-900">{essay.title}</h4>
                                    <p className="text-[10px] font-black uppercase text-slate-400">{essay.topic} • {essay.difficulty} • {essay.language}</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteEssay(essay._id)} className="text-slate-300 hover:text-rose-600">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </Card>
                    ))}
                </div>
            </div>
        </TabsContent>

        <TabsContent value="current" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <Card className="p-8 rounded-[2rem] bg-amber-600 text-white border-none shadow-2xl">
                        <h3 className="text-2xl font-black mb-4">Post Daily News</h3>
                        <form onSubmit={handleAddCurrent} className="space-y-4">
                            <input name="title" placeholder="News Headline" className="w-full p-4 bg-white/10 rounded-xl outline-none placeholder:text-amber-200" required />
                            <select name="language" className="w-full p-4 bg-white/10 rounded-xl outline-none [&>option]:text-slate-900">
                                <option value="English">English</option>
                                <option value="Hindi">Hindi</option>
                            </select>
                            <textarea name="content" placeholder="Content..." className="w-full p-4 bg-white/10 rounded-xl outline-none h-48 placeholder:text-amber-200" required />
                            <Button type="submit" className="w-full h-14 bg-white text-amber-600 hover:bg-amber-50 font-black">Publish News</Button>
                        </form>
                    </Card>
                </div>
                <div className="lg:col-span-2 space-y-4">
                    {currentPassages.map(cp => (
                        <Card key={cp._id} className="p-6 rounded-[1.5rem] flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-amber-50 text-amber-600 flex items-center justify-center rounded-xl">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-900">{cp.title}</h4>
                                    <p className="text-[10px] font-black uppercase text-slate-400">{new Date(cp.date).toLocaleDateString()} • {cp.language}</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteCurrent(cp._id)} className="text-slate-300 hover:text-rose-600">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </Card>
                    ))}
                </div>
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
