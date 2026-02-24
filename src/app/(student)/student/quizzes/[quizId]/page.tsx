"use client";

import { useState, useEffect, use, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
    Clock,
    ChevronLeft,
    ChevronRight,
    Flag,
    AlertCircle,
    Maximize,
    Loader2
} from "lucide-react";
import { toast } from "sonner";
import { getQuiz, submitQuiz } from "@/app/actions/student/quizzes";
import { useRouter } from "next/navigation";

export default function StudentQuizLivePage({ params }: { params: Promise<{ quizId: string }> }) {
    const { quizId } = use(params);
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);

    const [quiz, setQuiz] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [markedForReview, setMarkedForReview] = useState<Record<number, boolean>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [language, setLanguage] = useState<"en" | "hi">("en");
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [warnings, setWarnings] = useState(0);

    useEffect(() => {
        const fetchQuiz = async () => {
            const res = await getQuiz(quizId);
            if (res.success) {
                setQuiz(res.quiz);
                setTimeLeft((res.quiz.settings?.timeLimit || 30) * 60);
            } else {
                toast.error(res.error || "Failed to load quiz");
            }
            setLoading(false);
        };
        fetchQuiz();
    }, [quizId]);

    // Anti-Cheat: Fullscreen & Tab Switch
    useEffect(() => {
        if (!quiz) return;

        const handleVisibilityChange = () => {
            if (document.hidden && !isSubmitting) {
                setWarnings(w => {
                    const next = w + 1;
                    if (quiz.security?.preventTabSwitch) {
                        if (next >= 3) {
                            toast.error("Max tab switches reached. Auto-submitting exam.");
                            handleSubmit();
                        } else {
                            toast.warning(`Warning ${next}/3: Do not switch tabs!`);
                        }
                    }
                    return next;
                });
            }
        };

        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        const handleContextMenu = (e: MouseEvent) => e.preventDefault();

        document.addEventListener("visibilitychange", handleVisibilityChange);
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        document.addEventListener("contextmenu", handleContextMenu);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
            document.removeEventListener("contextmenu", handleContextMenu);
        };
    }, [quiz, isSubmitting]);

    const requestFullscreen = async () => {
        try {
            await containerRef.current?.requestFullscreen();
        } catch (err) {
            toast.error("Fullscreen not supported or blocked");
        }
    };

    // Timer logic
    useEffect(() => {
        if (!quiz || timeLeft <= 0 || isSubmitting) return;
        const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft, isSubmitting, quiz]);

    // Auto-submit on timeout
    useEffect(() => {
        if (timeLeft === 0 && quiz && !isSubmitting) {
            handleSubmit();
        }
    }, [timeLeft, quiz, isSubmitting]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        const timeLimitSecs = (quiz?.settings?.timeLimit || 30) * 60;
        const timeTaken = timeLimitSecs - timeLeft;

        try {
            const res = await submitQuiz(quizId, answers, timeTaken);
            if (res.success) {
                toast.success("Test submitted successfully!");
                document.exitFullscreen?.().catch(() => { });
                router.push(`/student/results`); // Note: Assuming analysis redirects happen later or are independent
            } else {
                toast.error(res.error || "Failed to submit test");
                setIsSubmitting(false);
            }
        } catch (error) {
            toast.error("Something went wrong");
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
        );
    }

    if (!quiz) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
                <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                <h2 className="text-2xl font-bold text-slate-900">Quiz Not Found</h2>
                <Button onClick={() => router.back()} className="mt-4">Go Back</Button>
            </div>
        );
    }

    if (quiz.security?.requireFullscreen && !isFullscreen) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-8 text-center" ref={containerRef}>
                <Maximize className="w-20 h-20 text-primary mb-6 animate-pulse" />
                <h2 className="text-3xl font-black mb-4">Fullscreen Required</h2>
                <p className="text-slate-400 max-w-lg mx-auto font-medium mb-8">
                    This is a highly secured examination. You must be in full-screen mode to take this exam.
                    Exiting full-screen during the exam may lead to automatic submission.
                </p>
                <Button size="lg" className="h-14 px-10 text-lg font-black" onClick={requestFullscreen}>
                    Enter Fullscreen & Start Exam
                </Button>
            </div>
        );
    }

    const questions = quiz.questions || [];
    const currentQ = questions[currentQuestion];

    const toggleReviewMark = () => {
        setMarkedForReview(prev => ({ ...prev, [currentQuestion]: !prev[currentQuestion] }));
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col select-none" ref={containerRef}>
            {/* Minimalist Top Bar */}
            <header className="bg-slate-900 text-white px-6 h-16 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <h1 className="text-lg font-bold truncate max-w-sm">{quiz.title}</h1>
                    <div className="h-4 w-[1px] bg-slate-700" />
                    <select
                        className="bg-slate-800 text-white border-0 text-sm rounded outline-none px-2 py-1"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value as "en" | "hi")}
                    >
                        <option value="en">English</option>
                        {quiz.settings?.availableLanguages?.includes("hi") && <option value="hi">हिंदी (Hindi)</option>}
                    </select>
                </div>

                <div className="flex items-center gap-6">
                    <div className="px-4 py-1.5 rounded-md flex items-center gap-2 bg-slate-800 border border-slate-700">
                        <Clock className={`w-4 h-4 ${timeLeft < 300 ? 'text-red-400 animate-pulse' : 'text-slate-300'}`} />
                        <span className={`font-mono text-lg font-bold tracking-wider ${timeLeft < 300 ? 'text-red-400' : 'text-slate-100'}`}>
                            {formatTime(timeLeft)}
                        </span>
                    </div>
                    <Button
                        onClick={() => document.exitFullscreen?.().catch(() => { })}
                        variant="ghost"
                        size="sm"
                        className="text-slate-400 hover:text-white"
                    >
                        Exit Exam
                    </Button>
                </div>
            </header>

            <main className="flex-1 flex overflow-hidden">
                {/* Main Content Area */}
                <div className="flex-1 flex flex-col p-6 lg:p-10 overflow-y-auto">
                    {/* Header of Question */}
                    <div className="flex justify-between items-center mb-8 pb-4 border-b">
                        <div>
                            <p className="text-primary font-bold uppercase text-xs tracking-widest mb-1">
                                Question {currentQuestion + 1} of {questions.length}
                            </p>
                            <span className="text-[10px] font-black uppercase text-slate-400 border px-2 py-0.5 rounded mr-2">{currentQ?.type?.replace('_', ' ')}</span>
                            {currentQ?.marks && <span className="text-[10px] font-black uppercase text-green-600 bg-green-50 px-2 py-0.5 rounded">+{currentQ.marks} Marks</span>}
                        </div>
                        <Button variant="outline" size="sm" onClick={toggleReviewMark} className={markedForReview[currentQuestion] ? "bg-purple-50 border-purple-200 text-purple-700" : ""}>
                            <Flag className="w-4 h-4 mr-2" />
                            {markedForReview[currentQuestion] ? "Marked for Review" : "Mark for Review"}
                        </Button>
                    </div>

                    {/* Question Content */}
                    <div className="flex-1 max-w-4xl mx-auto w-full">
                        <div className="text-xl lg:text-2xl font-medium text-slate-800 leading-relaxed mb-10">
                            {currentQ?.content?.[language] || currentQ?.content?.en || "Question text unavailable."}
                        </div>

                        {/* Options */}
                        <div className="space-y-4">
                            {currentQ?.options?.map((option: any, idx: number) => {
                                const optText = option.text?.[language] || option.text?.en || option.text;
                                const isSelected = answers[currentQ._id] === option._id;

                                return (
                                    <button
                                        key={option._id}
                                        onClick={() => setAnswers({ ...answers, [currentQ._id]: option._id })}
                                        className={`w-full flex items-center gap-4 p-4 lg:p-6 rounded-xl border-2 text-left transition-all ${isSelected
                                                ? "border-primary bg-primary/5 shadow-sm"
                                                : "border-slate-200 bg-white hover:border-slate-300"
                                            }`}
                                    >
                                        <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${isSelected ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'}`}>
                                            {String.fromCharCode(65 + idx)}
                                        </div>
                                        <span className={`text-lg ${isSelected ? 'font-semibold text-primary' : 'text-slate-700'}`}>
                                            {optText}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Bottom Navigation */}
                    <div className="flex justify-between items-center mt-auto pt-8 max-w-4xl mx-auto w-full">
                        <div className="flex gap-4">
                            <Button
                                variant="outline"
                                disabled={currentQuestion === 0}
                                onClick={() => setCurrentQuestion(prev => prev - 1)}
                                className="h-12 px-6 font-bold"
                            >
                                <ChevronLeft className="mr-2 w-4 h-4" /> Previous
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    const newAnswers = { ...answers };
                                    delete newAnswers[currentQ._id];
                                    setAnswers(newAnswers);
                                }}
                                className="h-12 px-6 font-bold text-slate-500"
                            >
                                Clear Response
                            </Button>
                        </div>

                        <Button
                            onClick={() => {
                                if (currentQuestion < questions.length - 1) {
                                    setCurrentQuestion(prev => prev + 1);
                                } else {
                                    handleSubmit();
                                }
                            }}
                            className="h-12 px-8 font-bold bg-primary text-white shadow-lg shadow-primary/20"
                        >
                            {currentQuestion === questions.length - 1 ? "Submit Exam" : "Save & Next"}
                            {currentQuestion < questions.length - 1 && <ChevronRight className="ml-2 w-4 h-4" />}
                        </Button>
                    </div>
                </div>

                {/* Question Palette Sidebar */}
                <aside className="w-80 bg-white border-l flex flex-col shrink-0">
                    <div className="p-4 border-b bg-slate-50">
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4">Question Palette</h3>
                        <div className="grid grid-cols-5 gap-2">
                            {questions.map((q: any, idx: number) => {
                                const isAnswered = !!answers[q._id];
                                const isMarked = markedForReview[idx];
                                const isActive = currentQuestion === idx;

                                let stateClass = "bg-slate-100 text-slate-500 border-slate-200 hover:border-slate-300"; // Not visited
                                if (isActive) stateClass = "bg-primary text-white border-primary shadow-md shadow-primary/20";
                                else if (isMarked && isAnswered) stateClass = "bg-purple-600 text-white border-purple-600";
                                else if (isMarked) stateClass = "bg-purple-100 text-purple-700 border-purple-300";
                                else if (isAnswered) stateClass = "bg-emerald-500 text-white border-emerald-500";

                                return (
                                    <button
                                        key={q._id}
                                        onClick={() => setCurrentQuestion(idx)}
                                        className={`w-10 h-10 rounded font-bold text-xs flex items-center justify-center border transition-all ${stateClass}`}
                                    >
                                        {idx + 1}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="p-4 flex-1 space-y-3 bg-slate-50">
                        <LegendItem color="bg-primary border-primary" label="Current Question" />
                        <LegendItem color="bg-emerald-500 border-emerald-500" label="Answered" />
                        <LegendItem color="bg-slate-100 border-slate-200" label="Not Answered" />
                        <LegendItem color="bg-purple-100 border-purple-300" label="Marked for Review" />
                        <LegendItem color="bg-purple-600 border-purple-600" label="Answered & Marked" />
                    </div>

                    <div className="p-6 border-t bg-white">
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="w-full h-14 text-white font-black text-lg bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-500/20"
                        >
                            {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : "Final Submit"}
                        </Button>
                    </div>
                </aside>
            </main>
        </div>
    );
}

function LegendItem({ color, label }: { color: string, label: string }) {
    return (
        <div className="flex items-center gap-3 text-xs font-semibold text-slate-600">
            <div className={`w-4 h-4 rounded shadow-sm border ${color}`} />
            {label}
        </div>
    );
}
