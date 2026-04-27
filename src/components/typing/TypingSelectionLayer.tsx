"use client";

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Keyboard, 
  BookOpen, 
  Newspaper, 
  ChevronRight, 
  ArrowLeft,
  Search,
  Timer,
  Award
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

type Module = 'WORD' | 'ESSAY' | 'CURRENT' | 'OFFICIAL';

export default function TypingSelectionLayer() {
  const [step, setStep] = useState(1);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const router = useRouter();

  const modules = [
    {
      id: 'WORD' as Module,
      title: 'Word Practice',
      description: 'Build muscle memory with A-Z and length-based drills.',
      icon: Keyboard,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50'
    },
    {
      id: 'ESSAY' as Module,
      title: 'Essay Practice',
      description: 'Typed long-form passages on historical and social topics.',
      icon: BookOpen,
      color: 'bg-emerald-500',
      lightColor: 'bg-emerald-50'
    },
    {
      id: 'CURRENT' as Module,
      title: 'Current Affairs',
      description: 'Stay updated with daily news and current event passages.',
      icon: Newspaper,
      color: 'bg-amber-500',
      lightColor: 'bg-amber-50'
    },
    {
        id: 'OFFICIAL' as Module,
        title: 'Official Exams',
        description: 'Take standard SSC, Railway, and State Police exams.',
        icon: Award,
        color: 'bg-slate-900',
        lightColor: 'bg-slate-100'
      }
  ];

  const wordCategories = [
    { id: 'A-Z', title: 'A to Z Words', description: 'Practice words starting with specific letters.' },
    { id: 'LENGTH', title: 'Word Length', description: 'Practice words of specific character counts (5,6,7,10).' }
  ];

  const essayCategories = [
    { id: 'GANDHI', title: 'Mahatma Gandhi', topic: 'Gandhi' },
    { id: 'NEHRU', title: 'Jawaharlal Nehru', topic: 'Nehru' },
    { id: 'AUG15', title: 'Independence Day', topic: '15 Aug' },
    { id: 'JAN26', title: 'Republic Day', topic: '26 Jan' },
    { id: 'WOMEN', title: 'Women Empowerment', topic: 'Women Empowerment' }
  ];

  const handleModuleSelect = (moduleId: Module) => {
    if (moduleId === 'OFFICIAL') {
        // Redirect to a page that specifically shows official exams if needed, 
        // or we can handle it here. For now let's just use the existing logic.
        router.push('/typing/official'); 
        return;
    }
    setSelectedModule(moduleId);
    setStep(2);
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    // For Word Practice, we might need a 3rd step (selecting letter or length)
    // For Essay, we might fetch and show available essays for that topic.
    if (selectedModule === 'CURRENT') {
        router.push(`/typing/exam?type=current`);
    } else {
        setStep(3);
    }
  };

  const renderStep1 = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {modules.map((m) => (
        <Card 
          key={m.id}
          onClick={() => handleModuleSelect(m.id)}
          className="group cursor-pointer p-8 rounded-[2.5rem] border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col relative overflow-hidden"
        >
          <div className={cn("w-16 h-16 rounded-3xl flex items-center justify-center text-white mb-8 shadow-lg", m.color)}>
            <m.icon className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-primary transition-colors">{m.title}</h3>
          <p className="text-sm font-bold text-slate-400 leading-relaxed mb-8">{m.description}</p>
          <div className="mt-auto flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary">
            Get Started <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Card>
      ))}
    </div>
  );

  const renderStep2 = () => {
    const categories = selectedModule === 'WORD' ? wordCategories : essayCategories;
    
    return (
      <div className="space-y-8">
        <button 
          onClick={() => setStep(1)}
          className="flex items-center gap-2 text-sm font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Modules
        </button>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((c: any) => (
            <Card 
              key={c.id}
              onClick={() => handleCategorySelect(c.id)}
              className="p-6 rounded-3xl border-slate-100 shadow-sm hover:shadow-xl cursor-pointer hover:border-primary/20 transition-all flex items-center justify-between group"
            >
              <div>
                <h4 className="font-black text-slate-900 text-lg">{c.title}</h4>
                {c.description && <p className="text-xs font-bold text-slate-400 mt-1">{c.description}</p>}
              </div>
              <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all">
                <ChevronRight className="w-5 h-5" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderStep3 = () => {
      let options: { id: string, title: string }[] = [];
      
      if (selectedModule === 'WORD') {
          if (selectedCategory === 'A-Z') {
              options = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(l => ({ id: l, title: l }));
          } else {
              options = ['5', '6', '7', '10'].map(l => ({ id: l, title: `${l} Letters` }));
          }
      } else if (selectedModule === 'ESSAY') {
          // In a real app, you'd fetch essays for this topic here.
          options = [
              { id: 'Basic', title: 'Level 1: Basic' },
              { id: 'Intermediate', title: 'Level 2: Intermediate' },
              { id: 'Advanced', title: 'Level 3: Advanced' }
          ];
      }

      return (
        <div className="space-y-8">
          <button 
            onClick={() => setStep(2)}
            className="flex items-center gap-2 text-sm font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Categories
          </button>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
             {options.map((opt) => (
                 <button
                    key={opt.id}
                    onClick={() => {
                        const modulePath = selectedModule?.toLowerCase();
                        const catParam = selectedModule === 'ESSAY' 
                            ? essayCategories.find(e => e.id === selectedCategory)?.topic 
                            : selectedCategory;
                        router.push(`/typing/exam?type=${modulePath}&cat=${catParam}&val=${opt.id}`);
                    }}
                    className="h-20 px-4 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center font-black text-center text-sm hover:bg-primary hover:text-white hover:shadow-xl transition-all active:scale-95"
                 >
                    {opt.title}
                 </button>
             ))}
          </div>
        </div>
      )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-16">
        <h2 className="text-5xl font-black text-slate-900 tracking-tight leading-none mb-4">
            Selection <span className="text-primary">Center</span>
        </h2>
        <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs">
            Choose your practice module to begin training
        </p>
      </div>

      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
    </div>
  );
}
