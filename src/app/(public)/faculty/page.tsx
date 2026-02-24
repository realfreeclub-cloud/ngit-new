import { Button } from "@/components/ui/button";
import {
    Linkedin,
    Mail,
    GraduationCap,
    ExternalLink,
    Search,
    UserCircle2
} from "lucide-react";
import { getFaculty } from "@/app/actions/faculty";

export default async function FacultyPage() {
    const res = await getFaculty();
    const faculty = res.success ? res.faculty : [];

    if (faculty.length === 0) {
        return (
            <div className="pb-32">
                <section className="bg-slate-50 py-24 mb-20 border-b">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                            <div className="max-w-2xl space-y-4 text-center lg:text-left">
                                <h1 className="text-5xl font-black text-slate-900 leading-tight">Meet Our <span className="text-primary">Exceptional</span> Faculty</h1>
                                <p className="text-slate-600 text-lg leading-relaxed">
                                    Learn from the best minds in the industry. Our faculty consists of IITians, researchers, and professional experts dedicated to your growth.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
                <div className="container mx-auto px-4 text-center mt-20">
                    <div className="p-16 border-2 border-dashed border-slate-200 rounded-[3rem] text-slate-400">
                        <UserCircle2 className="w-16 h-16 mx-auto mb-6 text-slate-300" />
                        <h2 className="text-2xl font-bold text-slate-600 mb-2">No profiles available</h2>
                        <p>Faculty profiles are currently being updated.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="pb-32">
            {/* Header */}
            <section className="bg-slate-50 py-24 mb-20 border-b">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                        <div className="max-w-2xl space-y-4 text-center lg:text-left">
                            <h1 className="text-5xl font-black text-slate-900 leading-tight">Meet Our <span className="text-primary">Exceptional</span> Faculty</h1>
                            <p className="text-slate-600 text-lg leading-relaxed">
                                Learn from the best minds in the industry. Our faculty consists of IITians, researchers, and professional experts dedicated to your growth.
                            </p>
                        </div>
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                placeholder="Search faculty by name or subject..."
                                className="w-full h-16 rounded-full border-2 border-slate-200 bg-white pl-16 pr-8 font-medium focus:border-primary outline-none transition-all shadow-sm"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {faculty.map((member: any) => (
                        <div key={member._id} className="group bg-white rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all p-8 flex flex-col items-center text-center">
                            <div className="w-48 h-48 rounded-[2.5rem] overflow-hidden mb-8 ring-8 ring-slate-50 group-hover:ring-primary/10 transition-all flex items-center justify-center bg-slate-100">
                                {member.image ? (
                                    <img src={member.image} alt={member.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                ) : (
                                    <UserCircle2 className="w-20 h-20 text-slate-300" />
                                )}
                            </div>

                            <div className="space-y-4 flex-1">
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900">{member.name}</h3>
                                    <p className="text-primary font-bold text-sm uppercase tracking-widest mt-1">{member.position}</p>
                                </div>

                                {member.bio && (
                                    <p className="text-slate-500 text-sm leading-relaxed px-4">
                                        {member.bio}
                                    </p>
                                )}

                                <div className="pt-4 border-t border-slate-50 space-y-3">
                                    {member.qualification && (
                                        <div className="flex items-center justify-center gap-2 text-slate-700 font-bold text-xs uppercase italic tracking-tighter">
                                            <GraduationCap className="w-4 h-4 text-primary" /> {member.qualification}
                                        </div>
                                    )}
                                    <div className="flex items-center justify-center gap-4 pt-2">
                                        {member.email && (
                                            <Button variant="ghost" size="icon" className="rounded-full text-slate-400 hover:text-primary" asChild>
                                                <a href={`mailto:${member.email}`}>
                                                    <Mail className="w-5 h-5" />
                                                </a>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-24 text-center">
                    <div className="bg-primary/5 p-12 rounded-[3.5rem] border border-primary/10 max-w-4xl mx-auto space-y-6">
                        <h2 className="text-3xl font-black text-slate-900">Want to join our elite faculty?</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto font-medium">
                            We are always looking for passionate educators who want to shape the genius minds of tomorrow. Send us your resume and we will get back to you.
                        </p>
                        <Button className="h-14 px-12 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20">Apply as Faculty</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
