"use client";

import { use } from "react";
import { Button } from "@/components/ui/button";
import {
    CheckCircle2,
    PlayCircle,
    FileText,
    Download,
    ShieldCheck,
    Star,
    ChevronRight,
    Trophy
} from "lucide-react";
import { useState } from "react";
import { initiatePayment, verifyPayment } from "@/app/actions/payment";
import Script from "next/script";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("Syllabus");
    const [isProcessing, setIsProcessing] = useState(false);

    const handleEnroll = async () => {
        setIsProcessing(true);
        const res = await initiatePayment(id); // Use the ID from params

        if (!res.success) {
            toast.error(res.error || "Failed to initiate payment");
            setIsProcessing(false);
            return;
        }

        const options = {
            key: res.key,
            amount: res.amount,
            currency: res.currency,
            name: "NGIT Institute",
            description: `Enrolling in ${res.courseTitle}`,
            order_id: res.orderId,
            handler: async (response: any) => {
                const verifyRes = await verifyPayment(
                    response.razorpay_order_id,
                    response.razorpay_payment_id,
                    response.razorpay_signature
                );

                if (verifyRes.success) {
                    toast.success("Enrollment successful!");
                    router.push(`/student/courses/${id}`);
                } else {
                    toast.error("Payment verification failed");
                }
            },
            prefill: {
                name: res.userName,
                email: res.userEmail,
            },
            theme: {
                color: "#2563eb", // Primary color
            },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
        setIsProcessing(false);
    };

    const syllabus = [
        { title: "Introduction to Advanced Calculus", lessons: ["Overview of Functions", "Limits & Continuity", "Derivatives Foundation"] },
        { title: "Integral Calculus Masterclass", lessons: ["Indefinite Integrals", "Definite Integrals", "Applications of Integration"] },
        { title: "Vector & 3D Geometry", lessons: ["Vector Algebra", "Lines in 3D Space", "Planes & Surfaces"] },
    ];

    return (
        <div className="pb-32 bg-white">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />
            {/* Hero Section */}
            <section className="bg-slate-50 pt-32 pb-20 border-b relative">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-16 items-start">
                        <div className="flex-[1.5] space-y-8">
                            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full font-bold text-xs">
                                <ShieldCheck className="w-4 h-4" /> Goverment Registered & Affiliated
                            </div>
                            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-[1.1]">IIT-JEE Phase 1: <span className="text-primary">Mathematics Foundation</span></h1>
                            <p className="text-xl text-slate-600 leading-relaxed max-w-2xl">
                                Master the core foundations of engineering mathematics with our deep-dive modules tailored for the 2026 JEE Advanced examination.
                            </p>

                            <div className="flex items-center gap-8 py-4 border-y border-slate-200">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden">
                                        <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974" alt="Instructor" className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Instructor</p>
                                        <p className="font-bold text-slate-900">Dr. Rahul Sharma</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />)}
                                    </div>
                                    <p className="font-black text-slate-900">4.9/5</p>
                                    <p className="text-xs text-slate-400 font-medium">(2.4k reviews)</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 w-full lg:sticky lg:top-32">
                            <div className="bg-white rounded-[3rem] border-8 border-slate-50 shadow-2xl p-8 space-y-8 overflow-hidden relative">
                                <div className="aspect-video rounded-2xl bg-slate-900 flex items-center justify-center group cursor-pointer relative">
                                    <PlayCircle className="w-20 h-20 text-white/40 group-hover:text-white group-hover:scale-110 transition-all z-10" />
                                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 font-bold text-xs tracking-widest uppercase">Watch Course Preview</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-baseline gap-2">
                                        <p className="text-5xl font-black text-slate-900 tracking-tighter">₹19,999</p>
                                        <p className="text-slate-400 line-through font-bold">₹24,999</p>
                                        <span className="bg-primary/10 text-primary text-[10px] font-black px-3 py-1 rounded-full uppercase ml-2 tracking-widest">20% OFF</span>
                                    </div>

                                    <div className="space-y-3">
                                        <Button
                                            onClick={handleEnroll}
                                            disabled={isProcessing}
                                            className="w-full h-16 rounded-[1.5rem] text-xl font-black shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-transform"
                                        >
                                            {isProcessing ? "Processing..." : "Enroll in Program"}
                                        </Button>
                                        <Button variant="outline" className="w-full h-16 rounded-[1.5rem] text-lg font-bold border-2 border-slate-100 flex gap-2">
                                            <Download className="w-5 h-5" /> Download Full Syllabus
                                        </Button>
                                    </div>

                                    <p className="text-center text-slate-400 text-xs font-medium">10-Day Money-Back Guarantee • Lifetime Access</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 mt-20">
                <div className="flex flex-col lg:flex-row gap-20">
                    <div className="flex-[1.5] space-y-16">
                        {/* Tabs */}
                        <div className="flex gap-12 border-b border-slate-100 sticky top-20 bg-white z-10 pt-4">
                            {["Syllabus", "Outcomes", "Requirements", "Faculty"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`pb-6 text-sm font-black uppercase tracking-widest transition-all relative ${activeTab === tab ? "text-primary" : "text-slate-400 hover:text-slate-600"
                                        }`}
                                >
                                    {tab}
                                    {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-1.5 bg-primary rounded-full" />}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content: Syllabus */}
                        {activeTab === "Syllabus" && (
                            <div className="space-y-8 animate-in fade-in duration-500">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-3xl font-black text-slate-900">Curriculum Overview</h2>
                                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">12 Sections • 145 Lectures</p>
                                </div>

                                <div className="space-y-6">
                                    {syllabus.map((section, idx) => (
                                        <div key={idx} className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 hover:border-primary/20 transition-all cursor-pointer">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-xl font-bold flex items-center gap-4">
                                                    <span className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-primary font-black text-sm">{idx + 1}</span>
                                                    {section.title}
                                                </h3>
                                                <ChevronRight className="w-6 h-6 text-slate-300" />
                                            </div>
                                            <div className="space-y-3 pl-14">
                                                {section.lessons.map((lesson, lidx) => (
                                                    <div key={lidx} className="flex items-center justify-between text-sm text-slate-500 font-medium py-1 border-b border-white hover:text-slate-900 transition-colors">
                                                        <div className="flex items-center gap-3">
                                                            <PlayCircle className="w-4 h-4 text-primary opacity-50" /> {lesson}
                                                        </div>
                                                        <span className="text-[10px] text-slate-300 uppercase tracking-widest">Locked</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === "Outcomes" && (
                            <div className="space-y-8 animate-in slide-in-from-left-4 duration-500">
                                <h2 className="text-3xl font-black text-slate-900">What you'll master</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {[
                                        "Master 50+ Calculus theorems for JEE Advanced",
                                        "Solve complex 3D Geometry problems in seconds",
                                        "Analyze real-world engineering data using statistics",
                                        "Perform expert-level matrix manipulations",
                                        "Build the logical thinking required for IITs",
                                        "Access exclusive tips from high-ranking alumni"
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-start gap-4">
                                            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0 mt-1">
                                                <CheckCircle2 className="w-4 h-4" />
                                            </div>
                                            <p className="text-slate-600 font-medium leading-relaxed">{item}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 space-y-12">
                        <div className="bg-slate-900 rounded-[3rem] p-10 text-white space-y-6">
                            <h3 className="text-2xl font-black">Limited Time Offer</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                                        <FileText className="w-6 h-6 text-primary" />
                                    </div>
                                    <p className="font-bold text-sm">Free Study Kit worth ₹2,000</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                                        <Trophy className="w-6 h-6 text-amber-500" />
                                    </div>
                                    <p className="font-bold text-sm">Free Mock Test Series access</p>
                                </div>
                            </div>
                            <Button className="w-full h-14 rounded-2xl bg-white text-slate-900 font-black hover:bg-slate-100 shadow-xl shadow-white/5">Apply for Discount</Button>
                        </div>

                        <div className="space-y-6 px-4">
                            <h3 className="text-xl font-black text-slate-900">More by NGIT</h3>
                            <div className="space-y-4">
                                <div className="flex gap-4 group cursor-pointer">
                                    <div className="w-20 h-20 rounded-2xl bg-slate-100 flex-shrink-0 overflow-hidden">
                                        <img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070" alt="More" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-black text-primary uppercase">Program</p>
                                        <h4 className="font-bold text-slate-900 text-sm group-hover:text-primary transition-colors">Advanced Coding & DSA</h4>
                                        <p className="text-xs text-slate-400 font-bold">₹9,999</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

