import { getFacultyById } from "@/app/actions/faculty";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { GraduationCap, Mail, Phone, Calendar, ArrowLeft, ShieldCheck, Zap, User } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function FacultyDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    
    // Check if it's a default faculty (numerical ID from my mock)
    // In a real app, we'd only fetch from DB, but for the demo/fallback:
    const res = (id.length > 5) ? await getFacultyById(id) : { success: false, faculty: undefined };

    if (!res.success || !res.faculty) {
        // Fallback or 404
        return (
            <div className="min-h-screen pt-40 pb-20 px-6 flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
                <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 mb-8 border border-slate-200">
                    <User className="w-12 h-12" />
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-slate-950 tracking-tighter mb-6 leading-none">Profile Not Synchronized</h1>
                <p className="text-xl text-slate-500 font-medium leading-relaxed mb-10">We couldn't retrieve the requested professional profile. It may have been relocated or is currently undergoing administrative updates.</p>
                <Link href="/faculty">
                    <Button className="h-20 px-12 rounded-[2rem] bg-slate-950 text-white hover:bg-slate-800 text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all">
                        Return to Faculty HUB
                    </Button>
                </Link>
            </div>
        );
    }

    const { faculty } = res;

    return (
        <main className="min-h-screen bg-white">
            {/* Ambient Heritage Header */}
            <div className="h-[40vh] md:h-[50vh] bg-slate-900 relative overflow-hidden flex items-end">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/60 to-slate-900" />
                <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-primary/5 rounded-full blur-[200px] -mr-1/2 -mt-1/2" />
                
                <div className="container px-6 mx-auto relative z-10 pb-16">
                    <Link href="/faculty" className="inline-flex items-center gap-2 text-white/40 hover:text-white font-black uppercase tracking-[0.2em] text-[10px] mb-8 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Faculty Directory
                    </Link>
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary">
                            <ShieldCheck className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Institutional Credential verified</span>
                        </div>
                        <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-none italic">
                            {faculty.name}
                        </h1>
                    </div>
                </div>
            </div>

            {/* Content Architecture */}
            <div className="container px-6 mx-auto">
                <div className="grid lg:grid-cols-12 gap-16 -mt-24 pb-24 h-full">
                    {/* Visual & Contact Column */}
                    <div className="lg:col-span-4 space-y-8 relative z-20 h-full">
                        <div className="bg-white p-2 rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden group">
                            <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden bg-slate-50 border-8 border-slate-50">
                                {faculty.image ? (
                                    <Image 
                                        src={faculty.image} 
                                        alt={faculty.name} 
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-1000"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-200">
                                        <User className="w-32 h-32" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Direct Communication Channels */}
                        <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-200/50 space-y-10">
                            <h3 className="text-lg font-black text-slate-950 tracking-tight flex items-center gap-2">
                                <Zap className="w-5 h-5 text-primary" /> Routing Details
                            </h3>
                            
                            <div className="space-y-8">
                                <div className="flex items-start gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-slate-400 shadow-sm shrink-0">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Official Protocol</p>
                                        <a href={`mailto:${faculty.email}`} className="text-slate-900 font-bold hover:text-primary transition-colors truncate block">{faculty.email}</a>
                                    </div>
                                </div>

                                {faculty.phone && (
                                    <div className="flex items-start gap-5">
                                        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-slate-400 shadow-sm shrink-0">
                                            <Phone className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Tele-Command</p>
                                            <a href={`tel:${faculty.phone}`} className="text-slate-900 font-bold hover:text-primary transition-colors underline decoration-primary/30 decoration-2 underline-offset-4">{faculty.phone}</a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Narrative & Authority Column */}
                    <div className="lg:col-span-8 flex flex-col justify-between h-full lg:pt-32">
                        <div className="space-y-16">
                            {/* Role Identification */}
                            <div className="space-y-6">
                                <p className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight max-w-2xl">
                                    {faculty.position} <span className="text-slate-300 mx-2">/</span> <span className="text-primary italic font-serif opacity-80">{faculty.qualification}</span>
                                </p>
                                <div className="h-1.5 w-24 bg-primary rounded-full" />
                            </div>

                            {/* Biography Synthesis */}
                            <div className="space-y-8">
                                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-3">
                                    Professional Narrative
                                </h3>
                                <div className="bg-slate-50/50 p-10 md:p-14 rounded-[3.5rem] border border-slate-100/50 relative">
                                    <div className="absolute top-0 left-10 w-px h-20 bg-gradient-to-b from-primary to-transparent" />
                                    <p className="text-xl text-slate-700 font-medium leading-[1.8] italic font-serif">
                                        {faculty.bio || "Dedicated academic leader specializing in technological advancement and student mentorship within the NGIT ecosystem."}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Footer Branding */}
                        <div className="mt-20 pt-10 border-t border-slate-50 flex items-center justify-between opacity-40">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">NGIT Professional Registry · Ref #F_{id.substring(0,6)}</p>
                            <div className="flex gap-2">
                                <div className="w-2 h-2 rounded-full bg-slate-300" />
                                <div className="w-2 h-2 rounded-full bg-slate-300" />
                                <div className="w-2 h-2 rounded-full bg-slate-300" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
