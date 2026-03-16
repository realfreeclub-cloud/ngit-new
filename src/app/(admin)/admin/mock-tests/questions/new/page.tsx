"use client";

import { useEffect, useState } from "react";
import { 
    ChevronLeft, 
    Save, 
    Plus, 
    Trash2, 
    BrainCircuit,
    LayoutGrid,
    Type,
    CheckCircle2,
    Info,
    Layout,
    ListChecks,
    Puzzle,
    Scale
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createQuestion } from "@/app/actions/questions";
import { getAllCourses } from "@/app/actions/courses";

const QUESTION_TYPES = [
    { value: "MCQ_SINGLE", label: "Single Correct", icon: CheckCircle2, desc: "Standard multiple choice with one correct answer." },
    { value: "MCQ_MULTIPLE", label: "Multiple Correct", icon: ListChecks, desc: "Multiple choice where one or more answers can be correct." },
    { value: "TRUE_FALSE", label: "True / False", icon: Scale, desc: "Simple binary choice question." },
    { value: "NUMERIC", label: "Numeric Answer", icon: Type, desc: "Students must enter a numeric value." },
    { value: "MATCH_THE_FOLLOWING", label: "Match Matrix", icon: Puzzle, desc: "Match items from Column A to Column B." },
    { value: "ASSERTION_REASON", label: "Assertion-Reason", icon: Info, desc: "Evaluate the relationship between two statements." },
    { value: "DESCRIPTIVE", label: "Descriptive", icon: Layout, desc: "Open-ended essay or long answer question." },
];

export default function NewQuestionPage() {
    const router = useRouter();
    const [courses, setCourses] = useState<any[]>([]);
    const [submitting, setSubmitting] = useState(false);
    
    // Form State
    const [formData, setFormData] = useState<any>({
        courseId: "",
        subject: "",
        topic: "",
        type: "MCQ_SINGLE",
        difficulty: "MEDIUM",
        content: { en: "", hi: "" },
        marks: 4,
        negativeMarks: 1,
        explanation: { en: "", hi: "" },
        options: [
            { text: { en: "" }, isCorrect: false },
            { text: { en: "" }, isCorrect: false },
            { text: { en: "" }, isCorrect: false },
            { text: { en: "" }, isCorrect: false },
        ],
        numericAnswer: "",
        assertion: { en: "" },
        reason: { en: "" },
    });

    useEffect(() => {
        loadCourses();
    }, []);

    const loadCourses = async () => {
        const res = await getAllCourses();
        if (res.success) setCourses(res.courses);
    };

    const handleOptionChange = (index: number, field: string, value: any) => {
        const newOptions = [...formData.options];
        if (field === "text") {
            newOptions[index].text.en = value;
        } else if (field === "isCorrect") {
            // If MCQ_SINGLE, uncheck others
            if (formData.type === "MCQ_SINGLE") {
                newOptions.forEach((opt, i) => opt.isCorrect = i === index);
            } else {
                newOptions[index].isCorrect = value;
            }
        } else if (field === "pair") {
            if (!newOptions[index].pair) newOptions[index].pair = { en: "" };
            newOptions[index].pair.en = value;
        }
        setFormData({ ...formData, options: newOptions });
    };

    const addOption = () => {
        setFormData({
            ...formData,
            options: [...formData.options, { text: { en: "" }, isCorrect: false }]
        });
    };

    const removeOption = (index: number) => {
        const newOptions = formData.options.filter((_: any, i: number) => i !== index);
        setFormData({ ...formData, options: newOptions });
    };

    const handleSubmit = async () => {
        if (!formData.courseId || !formData.subject || !formData.content.en) {
            toast.error("Please fill all required fields");
            return;
        }

        setSubmitting(true);
        const res = await createQuestion(formData);
        if (res.success) {
            toast.success("Question created successfully");
            router.push("/admin/mock-tests/questions");
        } else {
            toast.error(res.error);
        }
        setSubmitting(false);
    };

    return (
        <div className="max-w-5xl mx-auto py-12 px-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Nav */}
            <div className="flex items-center justify-between mb-10">
                <Link href="/admin/mock-tests/questions">
                    <Button variant="ghost" className="rounded-xl gap-2 hover:bg-slate-100">
                        <ChevronLeft className="w-5 h-5" /> Back to Bank
                    </Button>
                </Link>
                <div className="flex gap-3">
                    <Button 
                        className="rounded-xl h-12 px-8 font-black gap-2 shadow-xl shadow-primary/20"
                        onClick={handleSubmit}
                        disabled={submitting}
                    >
                        <Save className="w-5 h-5" />
                        {submitting ? "Saving..." : "Save Question"}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left: Settings */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm space-y-6">
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <LayoutGrid className="w-4 h-4" /> Context & Level
                        </h3>
                        
                        <div className="space-y-2">
                            <Label className="font-bold text-slate-700">Course</Label>
                            <select 
                                className="w-full h-12 rounded-xl bg-slate-50 border-none px-4 font-bold"
                                value={formData.courseId}
                                onChange={(e) => setFormData({...formData, courseId: e.target.value})}
                            >
                                <option value="">Select Course</option>
                                {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="font-bold text-slate-700">Subject</Label>
                                <Input 
                                    className="h-12 rounded-xl bg-slate-50 border-none px-4 font-bold" 
                                    placeholder="e.g. Physics"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold text-slate-700">Topic</Label>
                                <Input 
                                    className="h-12 rounded-xl bg-slate-50 border-none px-4 font-bold"
                                    placeholder="e.g. Optics"
                                    value={formData.topic}
                                    onChange={(e) => setFormData({...formData, topic: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-slate-50">
                            <Label className="font-bold text-slate-700">Difficulty Profile</Label>
                            <div className="flex p-1 bg-slate-100 rounded-xl">
                                {["EASY", "MEDIUM", "HARD"].map((level) => (
                                    <button
                                        key={level}
                                        onClick={() => setFormData({...formData, difficulty: level})}
                                        className={`flex-1 h-10 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                                            formData.difficulty === level ? "bg-white text-slate-900 shadow-sm" : "text-slate-400"
                                        }`}
                                    >
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                            <div className="space-y-2">
                                <Label className="font-bold text-slate-700">Marks</Label>
                                <Input 
                                    type="number"
                                    className="h-12 rounded-xl bg-slate-50 border-none px-4 font-bold"
                                    value={formData.marks}
                                    onChange={(e) => setFormData({...formData, marks: parseInt(e.target.value)})}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold text-slate-700">Negative</Label>
                                <Input 
                                    type="number"
                                    className="h-12 rounded-xl bg-slate-50 border-none px-4 font-bold text-rose-500"
                                    value={formData.negativeMarks}
                                    onChange={(e) => setFormData({...formData, negativeMarks: parseInt(e.target.value)})}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-[2rem] p-8 text-white space-y-6 shadow-xl">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Question Type</h3>
                        <div className="grid grid-cols-1 gap-3">
                            {QUESTION_TYPES.map((type) => (
                                <button
                                    key={type.value}
                                    onClick={() => setFormData({...formData, type: type.value})}
                                    className={`flex items-start gap-4 p-4 rounded-2xl border transition-all text-left group ${
                                        formData.type === type.value 
                                        ? "bg-primary border-primary" 
                                        : "bg-white/5 border-white/10 hover:border-white/20"
                                    }`}
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                        formData.type === type.value ? "bg-white/20" : "bg-white/10"
                                    }`}>
                                        <type.icon className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-black text-sm">{type.label}</p>
                                        <p className="text-[10px] font-bold text-white/50 mt-0.5 line-clamp-1 group-hover:line-clamp-none transition-all">{type.desc}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Content & Answers */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Question Content */}
                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Plus className="w-4 h-4" /> Question content
                        </h3>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center mb-1">
                                    <Label className="font-bold text-slate-700">Main Content (English)</Label>
                                    <Badge variant="outline" className="text-[9px] font-black uppercase">Required</Badge>
                                </div>
                                <Textarea 
                                    className="min-h-[200px] rounded-3xl bg-slate-50 border-none p-6 font-medium text-lg focus-visible:ring-primary/20"
                                    placeholder="Enter the question detail here... Support HTML, equations!"
                                    value={formData.content.en}
                                    onChange={(e) => setFormData({...formData, content: { ...formData.content, en: e.target.value }})}
                                    id="question-editor"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Answer Configuration - Dynamic based on Type */}
                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-8">
                        <div className="flex justify-between items-center">
                            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4" /> Answer Configuration
                            </h3>
                            {["MCQ_SINGLE", "MCQ_MULTIPLE", "MATCH_THE_FOLLOWING"].includes(formData.type) && (
                                <Button variant="ghost" className="h-8 rounded-lg gap-2 font-black text-[10px] uppercase text-primary hover:bg-primary/5" onClick={addOption}>
                                    <Plus className="w-3 h-3" /> Add Choice
                                </Button>
                            )}
                        </div>

                        {/* MCQ Rendering */}
                        {["MCQ_SINGLE", "MCQ_MULTIPLE"].includes(formData.type) && (
                            <div className="space-y-4">
                                {formData.options.map((opt: any, i: number) => (
                                    <div key={i} className={`flex items-start gap-4 p-4 rounded-3xl border transition-all ${opt.isCorrect ? "bg-emerald-50 border-emerald-100" : "bg-slate-50 border-slate-50"}`}>
                                        <div className="pt-2">
                                            <Switch 
                                                checked={opt.isCorrect} 
                                                onCheckedChange={(val) => handleOptionChange(i, "isCorrect", val)}
                                                className="data-[state=checked]:bg-emerald-500"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <Input 
                                                className="bg-transparent border-none text-slate-900 font-bold p-0 h-auto focus-visible:ring-0 placeholder:text-slate-400" 
                                                placeholder={`Option ${String.fromCharCode(65 + i)}`}
                                                value={opt.text.en}
                                                onChange={(e) => handleOptionChange(i, "text", e.target.value)}
                                            />
                                        </div>
                                        {formData.options.length > 2 && (
                                            <Button variant="ghost" className="h-8 w-8 p-0 rounded-lg hover:bg-rose-100 hover:text-rose-600 self-center" onClick={() => removeOption(i)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Numeric Rendering */}
                        {formData.type === "NUMERIC" && (
                            <div className="bg-slate-50 p-10 rounded-[2rem] flex flex-col items-center text-center space-y-4 border-2 border-dashed border-slate-200">
                                <Label className="text-xl font-black text-slate-900">Exact Numeric Value</Label>
                                <Input 
                                    className="max-w-[200px] h-20 rounded-3xl bg-white border-2 border-slate-200 text-center text-4xl font-black focus-visible:ring-primary/20"
                                    type="number"
                                    step="0.01"
                                    value={formData.numericAnswer}
                                    onChange={(e) => setFormData({...formData, numericAnswer: e.target.value})}
                                />
                                <p className="text-sm font-bold text-slate-400">System will match this value for auto-grading.</p>
                            </div>
                        )}

                        {/* Assertion Reason Rendering */}
                        {formData.type === "ASSERTION_REASON" && (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="font-bold text-indigo-500 uppercase text-[10px] tracking-widest">Statement 1: Assertion</Label>
                                    <Textarea 
                                        className="rounded-2xl bg-slate-50 border-none font-bold p-6" 
                                        placeholder="Enter the assertion statement..."
                                        value={formData.assertion.en}
                                        onChange={(e) => setFormData({...formData, assertion: {en: e.target.value}})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold text-purple-500 uppercase text-[10px] tracking-widest">Statement 2: Reason</Label>
                                    <Textarea 
                                        className="rounded-2xl bg-slate-50 border-none font-bold p-6" 
                                        placeholder="Enter the reason statement..."
                                        value={formData.reason.en}
                                        onChange={(e) => setFormData({...formData, reason: {en: e.target.value}})}
                                    />
                                </div>
                                <div className="space-y-4 pt-4 border-t">
                                    <Label className="font-bold text-slate-700">Correct Outcome Selection</Label>
                                    <div className="grid grid-cols-1 gap-2">
                                        {[
                                            "A: Both are true, R is correct explanation",
                                            "B: Both are true, R is NOT correct explanation",
                                            "C: A is true, but R is false",
                                            "D: A is false, but R is true"
                                        ].map((opt, i) => (
                                            <button 
                                                key={i}
                                                className={`p-4 rounded-2xl text-left font-bold text-sm transition-all border ${formData.numericAnswer === i ? "bg-slate-900 text-white border-slate-900" : "bg-white border-slate-100 hover:bg-slate-50"}`}
                                                onClick={() => setFormData({...formData, numericAnswer: i})}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Match Matrix Rendering */}
                        {formData.type === "MATCH_THE_FOLLOWING" && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-8 mb-4">
                                    <Label className="text-center font-black text-[10px] uppercase text-slate-400 tracking-widest">Column A (Item)</Label>
                                    <Label className="text-center font-black text-[10px] uppercase text-slate-400 tracking-widest">Column B (Match)</Label>
                                </div>
                                {formData.options.map((opt: any, i: number) => (
                                    <div key={i} className="flex gap-4 items-center">
                                        <div className="flex-none w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-black text-xs">{i+1}</div>
                                        <Input 
                                            className="flex-1 h-12 rounded-xl bg-slate-50 border-none font-bold px-4" 
                                            placeholder={`Item ${i+1}`}
                                            value={opt.text.en}
                                            onChange={(e) => handleOptionChange(i, "text", e.target.value)}
                                        />
                                        <ArrowRight className="w-5 h-5 text-slate-300" />
                                        <Input 
                                            className="flex-1 h-12 rounded-xl bg-slate-50 border-none font-bold px-4" 
                                            placeholder={`Match ${i+1}`}
                                            value={opt.pair?.en}
                                            onChange={(e) => handleOptionChange(i, "pair", e.target.value)}
                                        />
                                        <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-rose-50 hover:text-rose-600" onClick={() => removeOption(i)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Explanation */}
                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-4">
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Info className="w-4 h-4" /> Concept Explanation
                        </h3>
                        <Textarea 
                            className="min-h-[150px] rounded-3xl bg-slate-50 border-none p-6 font-medium focus-visible:ring-primary/20"
                            placeholder="Explain the solution steps and the core concept..."
                            value={formData.explanation.en}
                            onChange={(e) => setFormData({...formData, explanation: {en: e.target.value}})}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function ArrowRight({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
        </svg>
    )
}
