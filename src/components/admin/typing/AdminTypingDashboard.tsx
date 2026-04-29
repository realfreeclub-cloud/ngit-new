"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, BookOpen, Keyboard, Clock, ChevronRight, CheckCircle2, AlertCircle, Pencil, Trash2, FileText, Newspaper } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { mapKeyToHindi } from "@/modules/typing/utils/hindiMapping";

export default function AdminTypingDashboard() {
  const [passages, setPassages] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [wordSets, setWordSets] = useState<any[]>([]);
  const [essays, setEssays] = useState<any[]>([]);
  const [currentPassages, setCurrentPassages] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showExamForm, setShowExamForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showBookForm, setShowBookForm] = useState(false);
  const [selectedExam, setSelectedExam] = useState<any>(null);
  const [editingPassage, setEditingPassage] = useState<any>(null);
  
  useEffect(() => {
    if (editingPassage) {
      setAdminLanguage(editingPassage.language || "English");
    } else {
      setAdminLanguage("English");
      setAdminLayout("Inscript");
    }
  }, [editingPassage]);
  const [submitting, setSubmitting] = useState(false);
  const [adminLanguage, setAdminLanguage] = useState("English");
  const [adminLayout, setAdminLayout] = useState("Inscript");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/typing/dashboard");
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Fetch failed");

      setPassages(data.passages || []);
      setExams(data.exams || []);
      setCategories(data.categories || []);
      setWordSets(data.wordSets || []);
      setEssays(data.essays || []);
      setCurrentPassages(data.current || []);
      setResults(data.results || []);
      setBooks(data.books || []);
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

    setSubmitting(true);
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
        const err = await res.json();
        toast.error(err.error || "Failed to schedule exam");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteExam = async (id: string) => {
    if (!confirm("Are you sure? This will remove all associated results.")) return;
    
    // Optimistic UI update
    const previousExams = [...exams];
    setExams(exams.filter(e => e._id !== id));

    try {
      const res = await fetch(`/api/admin/typing/exams/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Exam deleted");
        // No need to fetch all data again, we already updated locally
      } else {
        setExams(previousExams); // Rollback
        const err = await res.json();
        toast.error(err.error || "Delete failed");
      }
    } catch (error) {
      setExams(previousExams); // Rollback
      toast.error("An error occurred");
    }
  };

  const handleAddBook = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/typing/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        toast.success("Book added successfully!");
        form.reset();
        setShowBookForm(false);
        await fetchData();
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to add book");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBook = async (id: string) => {
    if (!confirm("Are you sure? All exams linked to this book will lose their book association.")) return;
    try {
      const res = await fetch(`/api/admin/typing/books/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Book deleted");
        await fetchData();
      }
    } catch (error) {
      toast.error("Failed to delete book");
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
    
    toast.promise(async () => {
      const res = await fetch(`/api/admin/typing/categories/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete");
      await fetchData();
      return "Category deleted";
    }, {
      loading: "Deleting category...",
      success: (msg) => msg,
      error: (err) => err.message
    });
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
            <TabsTrigger value="books" className="rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm px-6">Books</TabsTrigger>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <select 
                    name="passageId" 
                    className="w-full p-4 bg-slate-50 border-transparent rounded-2xl font-bold text-slate-900 outline-none" 
                    required
                    onChange={(e) => {
                        const pid = e.target.value;
                        const passage = passages.find(p => p._id === pid);
                        if (passage && e.currentTarget.form) {
                            const langSelect = e.currentTarget.form.elements.namedItem('language') as HTMLSelectElement;
                            if (langSelect) langSelect.value = passage.language;
                        }
                    }}
                  >
                    <option value="">-- Choose a passage from Library --</option>
                    {passages.map(p => (
                      <option key={p._id} value={p._id}>{p.title} ({p.language} - {p.wordCount} words)</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Exam Language</label>
                  <select name="language" className="w-full p-4 bg-slate-50 border-transparent rounded-2xl font-bold text-slate-900 outline-none">
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                  </select>
                </div>
                
                <div className="pt-4">
                  <Button type="submit" disabled={submitting} className="w-full h-16 rounded-[1.5rem] text-lg font-black bg-slate-900 hover:bg-black text-white shadow-2xl shadow-slate-200">
                    {submitting ? 'Launching...' : 'Launch Official Exam'}
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
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteExam(exam._id);
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 leading-tight mb-3 relative z-10">{exam.title}</h3>
                  
                  <div className="flex items-center gap-3 text-sm font-bold text-slate-500 mb-2 relative z-10">
                    <div className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {exam.duration} Min</div>
                    <div className="w-1 h-1 rounded-full bg-slate-300" />
                    <div className="flex items-center gap-1.5"><Keyboard className="w-4 h-4" /> {exam.language}</div>
                    <div className="w-1 h-1 rounded-full bg-slate-300" />
                    <div className="flex items-center gap-1.5 truncate max-w-[150px]"><FileText className="w-4 h-4" /> {exam.passageId?.title || 'No Passage'}</div>
                  </div>

                  {exam.bookId && (
                    <div className="flex items-center gap-1.5 mb-4 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full w-max relative z-10">
                      <BookOpen className="w-3.5 h-3.5" />
                      {exam.bookId.name}
                    </div>
                  )}

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
                      title="Delete Category"
                    >
                      <Trash2 className="w-5 h-5" />
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

        <TabsContent value="books" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Create Book Form */}
            <div className="lg:col-span-1">
              <div className="bg-amber-600 rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-8 shadow-2xl text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-[80px]" />
                <h3 className="text-xl sm:text-2xl font-black tracking-tight mb-2 relative z-10">Create Book</h3>
                <p className="text-amber-100 font-medium text-sm mb-8 relative z-10">
                  Books group passages as chapters for structured student practice.
                </p>
                <form onSubmit={handleAddBook} className="space-y-4 relative z-10">
                  <input name="name" placeholder="Book Title (e.g. Speed Master Vol.1)" className="w-full p-4 bg-white/10 border-transparent rounded-2xl text-white placeholder:text-amber-200 focus:bg-white/20 transition-colors font-medium outline-none" required />
                  <textarea name="description" placeholder="Short description (optional)..." className="w-full p-4 bg-white/10 border-transparent rounded-2xl h-24 text-white placeholder:text-amber-200 focus:bg-white/20 transition-colors font-medium resize-none outline-none" />
                  <Button type="submit" disabled={submitting} className="w-full h-14 rounded-xl text-lg font-bold bg-white text-amber-700 hover:bg-amber-50 disabled:opacity-50">
                    {submitting ? "Creating..." : "Create Book"}
                  </Button>
                </form>
              </div>

              {/* Assign Passage to Book */}
              {books.length > 0 && (
                <div className="mt-6 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                  <h4 className="font-black text-slate-900 mb-4">Assign Chapter to Book</h4>
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.currentTarget;
                    const fd = new FormData(form);
                    const passageId = fd.get("passageId") as string;
                    const bookId = fd.get("targetBookId") as string;
                    const duration = Number(fd.get("chapterDuration")) || 10;
                    if (!passageId || !bookId) return;
                    setSubmitting(true);
                    try {
                      const res = await fetch(`/api/admin/typing/passages/${passageId}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ bookId, duration })
                      });
                      if (res.ok) {
                        toast.success("Chapter assigned to book!");
                        form.reset();
                        await fetchData();
                      } else {
                        toast.error("Failed to assign chapter");
                      }
                    } finally {
                      setSubmitting(false);
                    }
                  }} className="space-y-3">
                    <select name="targetBookId" className="w-full p-3 bg-slate-50 rounded-xl font-bold text-slate-900 outline-none border border-slate-200" required>
                      <option value="">-- Select Book --</option>
                      {books.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                    </select>
                    <select name="passageId" className="w-full p-3 bg-slate-50 rounded-xl font-bold text-slate-900 outline-none border border-slate-200" required>
                      <option value="">-- Select Passage to Add --</option>
                      {passages.map(p => (
                        <option key={p._id} value={p._id}>
                          {p.title} ({p.language}, {p.wordCount}w){p.bookId ? " ✓" : ""}
                        </option>
                      ))}
                    </select>
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 block">Chapter Duration (Minutes)</label>
                      <input
                        type="number"
                        name="chapterDuration"
                        defaultValue={10}
                        min={1}
                        max={60}
                        className="w-full p-3 bg-slate-50 rounded-xl font-bold text-slate-900 outline-none border border-slate-200"
                      />
                    </div>
                    <Button type="submit" disabled={submitting} className="w-full h-11 rounded-xl font-black bg-slate-900 text-white hover:bg-black">
                      Assign as Chapter
                    </Button>
                  </form>
                </div>
              )}
            </div>

            {/* Right: Books with chapters */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-2xl font-black tracking-tight text-slate-900">Book Library</h2>
                <span className="px-4 py-1.5 bg-amber-50 text-amber-700 rounded-full text-sm font-black">{books.length} Books</span>
              </div>

              {books.length === 0 ? (
                <div className="p-16 border-2 border-dashed rounded-3xl text-center">
                  <BookOpen className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                  <h3 className="text-xl font-black text-slate-900 mb-2">No books yet</h3>
                  <p className="text-slate-500 font-medium">Create your first typing book using the form on the left.</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {books.map((book) => {
                    const bookChapters = passages.filter(p => p.bookId && p.bookId.toString() === book._id.toString());
                    return (
                      <div key={book._id} className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                        {/* Book Header */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-50 bg-gradient-to-r from-amber-50 to-white">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-amber-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-amber-200">
                              <BookOpen className="w-6 h-6" />
                            </div>
                            <div>
                              <h4 className="font-black text-slate-900 text-lg">{book.name}</h4>
                              <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">
                                {bookChapters.length} Chapter{bookChapters.length !== 1 ? "s" : ""}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteBook(book._id)}
                            className="text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* Chapters */}
                        {bookChapters.length === 0 ? (
                          <div className="p-6 text-center text-sm text-slate-400 font-medium">
                            No chapters assigned yet. Use the form to add passages as chapters.
                          </div>
                        ) : (
                          <div className="divide-y divide-slate-50">
                            {bookChapters.map((chapter, idx) => (
                              <div key={chapter._id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50/50 group">
                                <div className="flex items-center gap-4">
                                  <span className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 font-black text-xs flex items-center justify-center">
                                    {String(idx + 1).padStart(2, "0")}
                                  </span>
                                  <div>
                                    <p className="font-bold text-slate-900 text-sm">{chapter.title}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                      {chapter.language} · {chapter.wordCount} words · {chapter.difficulty} · <span className="text-amber-600">{chapter.duration || 10} min</span>
                                    </p>
                                  </div>
                                </div>
                                <button
                                  onClick={async () => {
                                    if (!confirm(`Remove "${chapter.title}" from this book?`)) return;
                                    await fetch(`/api/admin/typing/passages/${chapter._id}`, {
                                      method: "PATCH",
                                      headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify({ bookId: null })
                                    });
                                    toast.success("Chapter removed from book");
                                    await fetchData();
                                  }}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-slate-300 hover:text-rose-500"
                                  title="Remove from book"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
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
                      value={adminLanguage}
                      onChange={(e) => setAdminLanguage(e.target.value)}
                      className="w-full p-4 bg-white/10 border-transparent rounded-2xl text-white [&>option]:text-slate-900 font-medium appearance-none outline-none" 
                      required
                    >
                      <option value="English">English</option>
                      <option value="Hindi">Hindi</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {adminLanguage === "Hindi" && (
                      <select 
                        name="layout"
                        value={adminLayout}
                        onChange={(e) => setAdminLayout(e.target.value)}
                        className="w-full p-4 bg-white/10 border-transparent rounded-2xl text-white [&>option]:text-slate-900 font-medium appearance-none outline-none"
                      >
                        <option value="Inscript">Mangal Inscript</option>
                        <option value="Remington Gail">Remington Gail</option>
                      </select>
                    )}
                  </div>
                  <textarea 
                    name="content" 
                    defaultValue={editingPassage?.content || ""} 
                    placeholder="Paste the exact text here..." 
                    className="w-full p-4 bg-white/10 border-transparent rounded-2xl h-48 text-white placeholder:text-slate-400 focus:bg-white/20 transition-colors font-medium resize-none outline-none" 
                    required 
                    key={editingPassage?._id + "-content"}
                    onChange={(e) => {
                      if (adminLanguage === "Hindi") {
                        const val = e.target.value;
                        const lastChar = val.slice(-1);
                        if (/[\x00-\x7F]/.test(lastChar) && lastChar !== ' ' && lastChar !== '\n' && lastChar !== '') {
                          const mapped = mapKeyToHindi(lastChar, adminLayout);
                          if (mapped !== lastChar) {
                            e.target.value = val.slice(0, -1) + mapped;
                          }
                        }
                      }
                    }}
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
                    <Card className="p-8 rounded-[2.5rem] bg-indigo-600 text-white border-none shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                        <h3 className="text-2xl font-black mb-2 relative z-10">Add Word Set</h3>
                        <p className="text-indigo-100 font-medium text-sm mb-6 relative z-10">Drills for letters/lengths.</p>
                        <form onSubmit={handleAddWordSet} className="space-y-4 relative z-10">
                            <input name="name" placeholder="Set Name (e.g. Set A)" className="w-full p-4 bg-white/10 rounded-2xl outline-none placeholder:text-indigo-200 focus:bg-white/20 transition-all" required />
                            <select name="category" className="w-full p-4 bg-white/10 rounded-2xl outline-none [&>option]:text-slate-900 font-medium" required>
                                <option value="A-Z">A to Z</option>
                                <option value="Length">Word Length</option>
                            </select>
                            <input name="value" placeholder="Value (e.g. A or 5)" className="w-full p-4 bg-white/10 rounded-2xl outline-none placeholder:text-indigo-200 focus:bg-white/20 transition-all" required />
                            <select name="language" className="w-full p-4 bg-white/10 rounded-2xl outline-none [&>option]:text-slate-900 font-medium">
                                <option value="English">English</option>
                                <option value="Hindi">Hindi</option>
                            </select>
                            <textarea name="words" placeholder="Words (comma separated)" className="w-full p-4 bg-white/10 rounded-2xl outline-none h-32 placeholder:text-indigo-200 focus:bg-white/20 transition-all resize-none" required />
                            <Button type="submit" className="w-full h-14 bg-white text-indigo-600 hover:bg-indigo-50 font-black rounded-xl">Save Word Set</Button>
                        </form>
                    </Card>
                </div>
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-black text-slate-900">Active Drills</h2>
                        <Badge className="bg-indigo-50 text-indigo-700">{wordSets.length} Sets</Badge>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {wordSets.map(set => (
                            <Card key={set._id} className="p-6 rounded-[2rem] flex flex-col justify-between group hover:shadow-xl transition-all border-slate-100">
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center font-black text-xs uppercase text-slate-400">
                                            {set.value}
                                        </div>
                                        <div className="flex gap-2">
                                            <Badge variant="outline" className="text-[9px] uppercase tracking-widest">{set.language}</Badge>
                                            <Button variant="ghost" size="icon" onClick={() => handleDeleteWordSet(set._id)} className="w-8 h-8 text-slate-300 hover:text-rose-600 transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <h4 className="font-black text-slate-900 text-lg mb-1">{set.name}</h4>
                                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{set.category} Drills</p>
                                </div>
                                <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-400">{set.words?.length || 0} Words</span>
                                    <div className="flex -space-x-2">
                                        {[1,2,3].map(i => <div key={i} className="w-5 h-5 rounded-full border-2 border-white bg-slate-100" />)}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </TabsContent>

        <TabsContent value="essays" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <Card className="p-8 rounded-[2.5rem] bg-emerald-600 text-white border-none shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                        <h3 className="text-2xl font-black mb-2 relative z-10">Add Essay</h3>
                        <p className="text-emerald-100 font-medium text-sm mb-6 relative z-10">Long-form practice.</p>
                        <form onSubmit={handleAddEssay} className="space-y-4 relative z-10">
                            <input name="topic" placeholder="Topic (e.g. History)" className="w-full p-4 bg-white/10 rounded-2xl outline-none placeholder:text-emerald-200 focus:bg-white/20 transition-all" required />
                            <div className="grid grid-cols-2 gap-4">
                                <input name="title" placeholder="Essay Title" className="w-full p-4 bg-white/10 rounded-2xl outline-none placeholder:text-emerald-200 focus:bg-white/20 transition-all" required />
                                <select name="difficulty" className="w-full p-4 bg-white/10 rounded-2xl outline-none [&>option]:text-slate-900 font-medium" required>
                                    <option value="Easy">Easy</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Hard">Hard</option>
                                </select>
                            </div>
                            <select name="language" className="w-full p-4 bg-white/10 rounded-2xl outline-none [&>option]:text-slate-900 font-medium">
                                <option value="English">English</option>
                                <option value="Hindi">Hindi</option>
                            </select>
                            <textarea name="content" placeholder="Full Content..." className="w-full p-4 bg-white/10 rounded-2xl outline-none h-48 placeholder:text-emerald-200 focus:bg-white/20 transition-all resize-none" required />
                            <Button type="submit" className="w-full h-14 bg-white text-emerald-600 hover:bg-emerald-50 font-black rounded-xl">Save Essay</Button>
                        </form>
                    </Card>
                </div>
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-black text-slate-900">Essay Library</h2>
                        <Badge className="bg-emerald-50 text-emerald-700">{essays.length} Essays</Badge>
                    </div>
                    <div className="space-y-4">
                        {essays.map(essay => (
                            <Card key={essay._id} className="p-6 rounded-[2rem] flex items-center justify-between group hover:shadow-xl transition-all border-slate-100">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 bg-emerald-50 text-emerald-600 flex items-center justify-center rounded-[1.2rem]">
                                        <BookOpen className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-xl text-slate-900 leading-tight">{essay.title}</h4>
                                        <div className="flex items-center gap-3 mt-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                            <span className="text-emerald-500">{essay.topic}</span>
                                            <span className="w-1 h-1 rounded-full bg-slate-200" />
                                            <span>{essay.difficulty}</span>
                                            <span className="w-1 h-1 rounded-full bg-slate-200" />
                                            <span>{essay.language}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right hidden sm:block">
                                        <div className="text-xs font-black text-slate-900">{essay.wordCount || 0}</div>
                                        <div className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Words</div>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => handleDeleteEssay(essay._id)} className="w-10 h-10 rounded-xl text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-all">
                                        <Trash2 className="w-5 h-5" />
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </TabsContent>

        <TabsContent value="current" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <Card className="p-8 rounded-[2.5rem] bg-amber-600 text-white border-none shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                        <h3 className="text-2xl font-black mb-2 relative z-10">Post Daily News</h3>
                        <p className="text-amber-100 font-medium text-sm mb-6 relative z-10">Fresh daily content.</p>
                        <form onSubmit={handleAddCurrent} className="space-y-4 relative z-10">
                            <input name="title" placeholder="News Headline" className="w-full p-4 bg-white/10 rounded-2xl outline-none placeholder:text-amber-200 focus:bg-white/20 transition-all" required />
                            <select name="language" className="w-full p-4 bg-white/10 rounded-2xl outline-none [&>option]:text-slate-900 font-medium">
                                <option value="English">English</option>
                                <option value="Hindi">Hindi</option>
                            </select>
                            <textarea name="content" placeholder="Paste news passage..." className="w-full p-4 bg-white/10 rounded-2xl outline-none h-48 placeholder:text-amber-200 focus:bg-white/20 transition-all resize-none" required />
                            <Button type="submit" className="w-full h-14 bg-white text-amber-600 hover:bg-amber-50 font-black rounded-xl">Publish News</Button>
                        </form>
                    </Card>
                </div>
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Recent Archives</h2>
                    <div className="space-y-4">
                        {currentPassages.map(cp => (
                            <Card key={cp._id} className="p-8 rounded-[2.5rem] border-slate-100 hover:shadow-xl transition-all group">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 bg-amber-50 text-amber-600 flex items-center justify-center rounded-[1.2rem]">
                                            <Newspaper className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-xl text-slate-900 leading-tight">{cp.title}</h4>
                                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-1">
                                                {new Date(cp.date || cp.createdAt).toLocaleDateString()} • {cp.language}
                                            </p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => handleDeleteCurrent(cp._id)} className="w-10 h-10 rounded-xl text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-all">
                                        <Trash2 className="w-5 h-5" />
                                    </Button>
                                </div>
                                <p className="text-slate-500 text-sm font-medium line-clamp-3 leading-relaxed mb-6">
                                    {cp.content}
                                </p>
                                <div className="flex items-center gap-3">
                                    <Badge className="bg-slate-900 text-white font-black px-4 py-1.5 rounded-full text-[9px] uppercase tracking-wider">{cp.language}</Badge>
                                    <Badge variant="secondary" className="bg-slate-50 text-slate-400 font-bold px-4 py-1.5 rounded-full text-[9px] uppercase tracking-wider">
                                        {cp.content.split(/\s+/).length} Words
                                    </Badge>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
