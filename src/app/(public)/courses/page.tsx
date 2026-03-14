import { getDynamicPageData } from "@/app/actions/cms";
import DynamicRenderer from "@/components/public/DynamicRenderer";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Monitor, GraduationCap, Keyboard, Ribbon, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const staticFallbackContent = (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
        <section className="relative overflow-hidden mb-16 px-4">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-slate-900 to-purple-900 rounded-3xl mx-4 lg:mx-10" />
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070')] bg-cover opacity-10 mix-blend-overlay rounded-3xl mx-4 lg:mx-10" />
            <div className="relative z-10 container mx-auto px-4 py-24 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-blue-200 font-semibold text-sm uppercase tracking-wider mb-6 backdrop-blur-md">
                    Our Programs
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight max-w-4xl mx-auto">
                    Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">50+ Courses</span> in Hindi & English
                </h1>
                <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                    Whether you are looking for computer training, university degrees, or government exam preparation, NGIT has a course designed for your success.
                </p>
            </div>
        </section>

        {/* CMS Sections Will Inject Here if active */}
    </div>
);

export default async function PublicCoursesPage() {
    const dynamicData = await getDynamicPageData("courses");
    const cmsSections = dynamicData.success && dynamicData.sections ? dynamicData.sections : [];

    return (
        <div className="min-h-screen">
            <DynamicRenderer sections={cmsSections} staticFallback={staticFallbackContent} />
        </div>
    );
}
