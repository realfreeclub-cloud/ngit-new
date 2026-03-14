import { getDynamicPageData } from "@/app/actions/cms";
import DynamicRenderer from "@/components/public/DynamicRenderer";
import { motion } from "framer-motion";
import { Trophy, CheckCircle, Navigation, Award, Users } from "lucide-react";
import Image from "next/image";

const staticFallbackContent = (
    <div className="min-h-screen bg-slate-50 pt-32 pb-24">
        <div className="container mx-auto px-4 lg:px-10">
            <div className="text-center max-w-4xl mx-auto mb-20 space-y-6">
                <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-blue-100 text-blue-700 font-bold uppercase tracking-widest text-sm shadow-sm">
                    <Trophy className="w-5 h-5 text-blue-600" /> Success Stories
                </div>
                <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-tight">
                    Celebrating the Success of Our Students
                </h1>
                <p className="text-xl md:text-2xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
                    NGIT has produced many successful students who have cleared government exams and gained strong computer skills through training programs.
                </p>
            </div>
            
            <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-2xl border border-slate-100 flex flex-col md:flex-row items-center gap-12">
                <div className="relative w-full md:w-1/2 aspect-square max-w-md">
                    <div className="absolute inset-0 bg-blue-100 rounded-[3rem] transform -rotate-3 scale-105" />
                    <div className="relative w-full h-full rounded-[3rem] overflow-hidden shadow-xl">
                        <Image 
                            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070" 
                            alt="Successful student"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
                <div className="w-full md:w-1/2 space-y-8">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <Users className="w-8 h-8 text-blue-600" />
                            <h3 className="text-3xl font-bold text-slate-900">Proven Results</h3>
                        </div>
                        <p className="text-xl text-slate-600 leading-relaxed font-medium">
                            Each year, our students break records and set new milestones. With focused training formats available in both English and Hindi, no student is left behind. We provide the mentorship you need to reach your career goals.
                        </p>
                    </div>
                    <div className="pt-6 border-t border-slate-100 flex gap-6">
                        <div>
                            <h4 className="text-5xl font-black text-blue-600 mb-2">5k+</h4>
                            <p className="text-slate-500 font-bold uppercase tracking-wider text-sm">Govt Placements</p>
                        </div>
                        <div className="w-px bg-slate-200" />
                        <div>
                            <h4 className="text-5xl font-black text-purple-600 mb-2">10k+</h4>
                            <p className="text-slate-500 font-bold uppercase tracking-wider text-sm">Certified Grads</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default async function PublicResultsPage() {
    const dynamicData = await getDynamicPageData("results");
    const cmsSections = dynamicData.success && dynamicData.sections ? dynamicData.sections : [];

    return (
        <div className="min-h-screen">
            <DynamicRenderer sections={cmsSections} staticFallback={staticFallbackContent} />
        </div>
    );
}
