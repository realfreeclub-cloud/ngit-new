"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, BookOpen, Keyboard, Clock, ChevronRight } from "lucide-react";
import { toast } from "sonner";

export default function AdminTypingDashboard() {
  const [passages, setPassages] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/typing/passages").then(res => res.json()),
      fetch("/api/admin/typing/exams").then(res => res.json())
    ]).then(([passagesData, examsData]) => {
      setPassages(passagesData);
      setExams(examsData);
      setLoading(false);
    });
  }, []);

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
        toast.success("Passage added!");
        window.location.reload();
      }
    } catch (error) {
      toast.error("Failed to add passage");
    }
  };

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Typing Exam Manager</h1>
        <p className="text-slate-500">Manage your passages and schedule typing exams.</p>
      </div>

      <Tabs defaultValue="exams" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mb-8">
          <TabsTrigger value="exams">Active Exams</TabsTrigger>
          <TabsTrigger value="passages">Passage Library</TabsTrigger>
        </TabsList>

        <TabsContent value="exams" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6 border-dashed flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 transition-colors h-full min-h-[200px]">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-full mb-4">
                <Plus className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-900">Schedule New Exam</h3>
              <p className="text-sm text-slate-500">Create a new government typing test</p>
            </Card>

            {exams.map((exam) => (
              <Card key={exam._id} className="p-6 flex flex-col h-full hover:shadow-lg transition-all">
                <div className="flex justify-between items-start mb-4">
                  <span className="px-2 py-1 bg-slate-100 rounded text-xs font-bold uppercase">{exam.category}</span>
                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${exam.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {exam.status}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{exam.title}</h3>
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                  <Clock className="w-4 h-4" />
                  {exam.duration} Minutes
                </div>
                <button className="mt-auto w-full py-2 bg-slate-900 text-white rounded-lg font-bold text-sm hover:bg-slate-800">
                  Manage Results
                </button>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="passages" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Passage Library ({passages.length})</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-8">
              <h3 className="text-lg font-bold mb-4">Add New Passage</h3>
              <form onSubmit={handleAddPassage} className="space-y-4">
                <input name="title" placeholder="Passage Title" className="w-full p-2 border rounded" required />
                <textarea name="content" placeholder="Content..." className="w-full p-2 border rounded h-40" required />
                <select name="difficulty" className="w-full p-2 border rounded">
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
                <select name="language" className="w-full p-2 border rounded">
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                </select>
                <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700">
                  Save Passage
                </button>
              </form>
            </Card>

            <div className="space-y-4">
              {passages.map((passage) => (
                <Card key={passage._id} className="p-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900">{passage.title}</h4>
                    <p className="text-xs text-slate-500 uppercase font-bold">{passage.language} • {passage.wordCount} Words</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300" />
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
