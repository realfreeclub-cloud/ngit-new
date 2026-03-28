"use client";

import { Layout, FileText, Info, Settings, ArrowRight, MousePointer2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const cmsModules = [
    {
        title: "Landing Page (Home)",
        description: "Manage the hero banner, sections, and blocks for your main institute homepage.",
        href: "/admin/content/pages?page=home",
        icon: Layout,
        color: "bg-blue-500",
        stats: "Home Layout"
    },
    {
        title: "About Us Page",
        description: "Structured management for mission, vision, stats, and institute history.",
        href: "/admin/content/about",
        icon: Info,
        color: "bg-purple-500",
        stats: "Page Section"
    },
    {
        title: "General Content Pages",
        description: "Create and manage custom pages like Privacy Policy, Terms, or custom services.",
        href: "/admin/content/pages",
        icon: FileText,
        color: "bg-emerald-500",
        stats: "Dynamic slugs"
    },
    {
        title: "Blog & Newsletter",
        description: "Publish articles, news updates, and educational resources for your students.",
        href: "/admin/blogs",
        icon: FileText,
        color: "bg-orange-500",
        stats: "Pub. Articles"
    },
    {
        title: "Video Testimonials",
        description: "Manage student feedback and video reviews shown on the landing page.",
        href: "/admin/feedback",
        icon: MousePointer2,
        color: "bg-rose-500",
        stats: "Social Proof"
    },
    {
        title: "Navigation & Footer",
        description: "Manage your main menu links, footer description, and social media connectivity.",
        href: "/admin/layout",
        icon: Settings,
        color: "bg-slate-700",
        stats: "Site-wide"
    }
];

export default function ContentManagementDashboard() {
    return (
        <div className="p-8 max-w-6xl mx-auto pb-20">
            <div className="mb-10">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Content Management</h1>
                <p className="text-slate-500 font-bold mt-2 uppercase tracking-widest text-xs">Page Section & Site-wide CMS</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {cmsModules.map((module) => (
                    <Link 
                        key={module.title} 
                        href={module.href}
                        className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-primary/10 transition-all relative overflow-hidden flex flex-col"
                    >
                        <div className={`absolute top-0 right-0 w-32 h-32 ${module.color} opacity-5 rounded-bl-[5rem] -z-10 group-hover:scale-110 transition-transform`} />
                        
                        <div className="flex items-center justify-between mb-6">
                            <div className={`w-14 h-14 ${module.color} rounded-2xl flex items-center justify-center text-white shadow-lg shadow-inner`}>
                                <module.icon className="w-7 h-7" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-3 py-1 rounded-full border">
                                {module.stats}
                            </span>
                        </div>

                        <div className="space-y-3 mb-8 flex-1">
                            <h2 className="text-2xl font-black text-slate-900 group-hover:text-primary transition-colors">{module.title}</h2>
                            <p className="text-slate-500 font-medium leading-relaxed">
                                {module.description}
                            </p>
                        </div>

                        <div className="flex items-center gap-2 text-primary font-black text-sm group-hover:gap-4 transition-all uppercase tracking-wider">
                            Manage Content
                            <ArrowRight className="w-5 h-5" />
                        </div>
                    </Link>
                ))}
            </div>

            <div className="mt-12 bg-slate-900 rounded-[3rem] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-600/10 mix-blend-overlay" />
                <div className="relative z-10 space-y-2 text-center md:text-left">
                    <h3 className="text-2xl font-black">Need a new custom page?</h3>
                    <p className="text-slate-400 font-medium">Head over to the 'General Content Pages' section to create a new slug.</p>
                </div>
                <Link href="/admin/content/pages" className="relative z-10 group">
                    <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 rounded-2xl h-14 px-8 font-black text-lg gap-3">
                         <MousePointer2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                         Start Crafting
                    </Button>
                </Link>
            </div>
        </div>
    );
}
