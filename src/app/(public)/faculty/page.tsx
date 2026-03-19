import { getDynamicPageData } from "@/app/actions/cms";
import { getFaculty } from "@/app/actions/faculty";
import DynamicRenderer from "@/components/public/DynamicRenderer";
import FacultySection from "@/components/public/FacultySection";
import { Quote } from "lucide-react";
import Image from "next/image";

export default async function PublicFacultyPage() {
    const [dynamicData, facultyRes] = await Promise.all([
        getDynamicPageData("faculty"),
        getFaculty()
    ]);

    const facultyMembers = facultyRes.success ? facultyRes.faculty : [];
    
    // Find Director/MD for top section
    const director = facultyMembers.find((f: any) => 
        f.position?.toLowerCase().includes("director") || 
        f.position?.toLowerCase().includes("md") ||
        f.name?.toLowerCase().includes("javed")
    ) || facultyMembers[0];

    const staticFallbackContent = facultyMembers.length > 0 ? (
        <div className="min-h-screen bg-white pt-32 pb-24">
            <div className="container mx-auto px-4 lg:px-10">
                <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-20 text-center tracking-tighter">
                    Leadership & <span className="text-primary italic font-serif">Faculty</span>
                </h1>

                {/* Director's Message - Now Dynamic */}
                {director && (
                    <div className="bg-slate-900 rounded-[4rem] p-8 md:p-16 shadow-2xl mb-32 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -z-0 opacity-50" />
                        <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
                            <div className="flex justify-center">
                                <div className="relative w-72 h-72 md:w-[450px] md:h-[450px]">
                                    <div className="absolute inset-0 bg-primary/30 rounded-[3rem] rotate-6 scale-105 blur-2xl group-hover:rotate-12 transition-transform duration-700" />
                                    {director.image ? (
                                        <Image
                                            src={director.image} 
                                            alt={director.name}
                                            fill
                                            className="object-cover rounded-[3.5rem] shadow-2xl z-10 border-8 border-white/5"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-slate-800 rounded-[3.5rem] flex items-center justify-center text-white z-10">
                                            No Image
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-10">
                                <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-primary-light font-black text-xs uppercase tracking-[0.3em]">
                                    Message from Director
                                </div>
                                <div>
                                    <h2 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">
                                        {director.name}
                                    </h2>
                                    <h3 className="text-xl text-primary font-bold uppercase tracking-widest leading-none">
                                        {director.position}
                                    </h3 >
                                </div>
                                <div className="relative mt-12 bg-white/5 p-10 rounded-3xl border border-white/10 backdrop-blur-md">
                                    <Quote className="w-24 h-24 text-primary opacity-20 absolute -top-12 -left-8 -z-10" />
                                    <blockquote className="text-xl md:text-2xl text-slate-200 font-medium leading-relaxed italic z-10 relative">
                                        {director.bio || "Success starts with a single step. At NGIT, we don't just teach computers; we give our students the confidence and direction they need to succeed."}
                                    </blockquote>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Rest of Faculty List */}
                <FacultySection members={facultyMembers} />
            </div>
        </div>
    ) : (
        <div className="min-h-screen flex items-center justify-center text-slate-400 font-medium italic">
            No faculty members listed yet...
        </div>
    );

    const cmsSections = dynamicData.success && dynamicData.sections ? dynamicData.sections : [];

    return (
        <div className="min-h-screen">
            <DynamicRenderer 
                sections={cmsSections} 
                extraData={{ faculty: facultyMembers }}
                staticFallback={staticFallbackContent} 
            />
        </div>
    );
}
