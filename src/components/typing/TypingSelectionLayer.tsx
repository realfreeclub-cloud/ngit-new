"use client";

import React, { useState, useEffect } from 'react';
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

type Module = 'WORD' | 'SPECIAL' | 'OFFICIAL';

export default function TypingSelectionLayer() {
  const [step, setStep] = useState(1);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<'English' | 'Hindi'>('English');
  const [selectedLayout, setSelectedLayout] = useState<'English' | 'Remington Gail' | 'Inscript' | 'Phonetic'>('English');
  const [taxonomy, setTaxonomy] = useState<{words: any[], essays: any[]}>({ words: [], essays: [] });
  const [loadingTaxonomy, setLoadingTaxonomy] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/typing/practice?type=TAXONOMY')
      .then(res => res.json())
      .then(data => {
         setTaxonomy({ words: data.words || [], essays: data.essays || [] });
         setLoadingTaxonomy(false);
      })
      .catch(err => {
         console.error(err);
         setLoadingTaxonomy(false);
      });
  }, []);

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
      id: 'SPECIAL' as Module,
      title: 'Special Topic / Current',
      description: 'Typed long-form passages on historical and social topics, plus daily news.',
      icon: BookOpen,
      color: 'bg-emerald-500',
      lightColor: 'bg-emerald-50'
    },
    {
      id: 'BOOK' as any,
      title: 'Book Practice',
      description: 'Master specialized typing books chapter by chapter.',
      icon: BookOpen,
      color: 'bg-amber-500',
      lightColor: 'bg-amber-50'
    },
    {
        id: 'OFFICIAL' as Module,
        title: 'All exams',
        description: 'Take standard SSC, Railway, and State Police exams.',
        icon: Award,
        color: 'bg-slate-900',
        lightColor: 'bg-slate-100'
      }
  ];

  // Compute dynamic categories
  const dynamicWordCategories = Array.from(new Set(taxonomy.words.filter(w => w.language === selectedLanguage).map(w => w.category))).map(cat => ({
    id: cat,
    title: cat === 'A-Z' ? 'A to Z Words' : cat === 'Length' ? 'Word Length' : String(cat),
    description: `Practice ${cat} word sets in ${selectedLanguage}.`
  }));

  const dynamicSpecialCategories = [
    { id: 'CURRENT', title: 'Current Affairs', topic: 'Current Affairs', description: `Stay updated with daily ${selectedLanguage} news passages.` },
    ...Array.from(new Set(taxonomy.essays.filter(e => e.language === selectedLanguage).map(e => e.topic))).map(topic => ({
      id: topic as string,
      title: topic as string,
      topic: topic as string,
      description: `Practice ${selectedLanguage} essays on ${topic}.`
    }))
  ];

  const handleModuleSelect = (moduleId: Module) => {
    if (moduleId === 'OFFICIAL') {
        router.push(`/typing/official?lang=${selectedLanguage}`); 
        return;
    }
    if ((moduleId as string) === 'BOOK') {
        router.push(`/typing/books?lang=${selectedLanguage}`); 
        return;
    }
    setSelectedModule(moduleId);
    setStep(2);
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    if (categoryId === 'CURRENT') {
        router.push(`/typing/exam?type=current&lang=${selectedLanguage}&layout=${selectedLayout}`);
    } else {
        setStep(3);
    }
  };

  const renderStep0 = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      <Card 
        onClick={() => {
            setSelectedLanguage('English');
            setSelectedLayout('English');
            setStep(1);
        }}
        className="p-10 rounded-[2.5rem] cursor-pointer hover:shadow-2xl transition-all text-center border-slate-100 group"
      >
        <div className="w-20 h-20 bg-blue-500 rounded-3xl flex items-center justify-center text-white mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
           <span className="text-3xl font-black">EN</span>
        </div>
        <h3 className="text-3xl font-black text-slate-900 mb-2">English</h3>
        <p className="text-slate-400 font-bold">Standard English Typing</p>
      </Card>
      <Card 
        onClick={() => {
            setSelectedLanguage('Hindi');
            setStep(0.5);
        }}
        className="p-10 rounded-[2.5rem] cursor-pointer hover:shadow-2xl transition-all text-center border-slate-100 group"
      >
        <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center text-white mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
           <span className="text-3xl font-black">HI</span>
        </div>
        <h3 className="text-3xl font-black text-slate-900 mb-2">Hindi</h3>
        <p className="text-slate-400 font-bold">Unicode & Remington Support</p>
      </Card>
    </div>
  );

  const renderStep05 = () => (
    <div className="space-y-8">
        <button 
          onClick={() => setStep(0)}
          className="flex items-center gap-2 text-sm font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Language
        </button>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['Remington Gail', 'Inscript', 'Phonetic'].map((layout) => (
            <Card 
              key={layout}
              onClick={() => {
                  setSelectedLayout(layout as any);
                  setStep(1);
              }}
              className="p-8 rounded-[2rem] cursor-pointer hover:shadow-xl transition-all text-center border-slate-100 group hover:border-primary/50"
            >
              <h4 className="text-xl font-black text-slate-900 mb-2">{layout}</h4>
              <p className="text-xs font-bold text-slate-400">
                {layout === 'Remington Gail' ? 'Professional Standard' : 
                 layout === 'Inscript' ? 'Government Standard' : 'Transliteration'}
              </p>
            </Card>
          ))}
        </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-8">
      <button 
          onClick={() => setStep(selectedLanguage === 'Hindi' ? 0.5 : 0)}
          className="flex items-center gap-2 text-sm font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" /> Change Language/Layout
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
    </div>
  );

  const renderStep2 = () => {
    if (loadingTaxonomy) {
      return <div className="text-center py-20 text-slate-400 font-bold animate-pulse">Loading Library...</div>;
    }

    const categories = selectedModule === 'WORD' ? dynamicWordCategories : dynamicSpecialCategories;
    
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
          options = taxonomy.words
            .filter(w => w.category === selectedCategory && w.language === selectedLanguage)
            .map(w => ({ id: w.value, title: w.name || w.value }));
      } else if (selectedModule === 'SPECIAL') {
          options = taxonomy.essays
            .filter(e => e.topic === selectedCategory && e.language === selectedLanguage)
            .map(e => ({ id: e.title, title: e.title }));
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
                        const modulePath = selectedModule === 'SPECIAL' ? 'essay' : selectedModule?.toLowerCase();
                        const catParam = selectedModule === 'SPECIAL' 
                            ? dynamicSpecialCategories.find(e => e.id === selectedCategory)?.topic 
                            : selectedCategory;
                        router.push(`/typing/exam?type=${modulePath}&cat=${catParam}&val=${opt.id}&lang=${selectedLanguage}&layout=${selectedLayout}`);
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
            {step < 1 ? 'Choose Language & Layout' : 'Choose your practice module to begin training'}
        </p>
      </div>

      {step === 0 && renderStep0()}
      {step === 0.5 && renderStep05()}
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
    </div>
  );
}
