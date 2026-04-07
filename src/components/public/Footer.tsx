import Link from "next/link";
import { getHeaderFooterData } from "@/app/actions/layoutContent";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Zap, ArrowUpRight, ShieldCheck, Globe } from "lucide-react";

interface FooterLink {
    label: string;
    href: string;
}

interface FooterSection {
    title: string;
    links: FooterLink[];
}

interface SocialLink {
    platform: string;
    url: string;
}

interface FooterData {
    logoImage?: string;
    logoText?: string;
    description?: string;
    copyright?: string;
    sections?: FooterSection[];
    social?: SocialLink[];
}

export default async function Footer() {
    const result = await getHeaderFooterData();
    const footerData: FooterData | null = result.success ? result.footer : null;

    if (!footerData) return null;

    const currentYear = new Date().getFullYear();
    const contactSection = footerData.sections?.find(s => s.title.toLowerCase().includes('contact'));
    const regularSections = footerData.sections?.filter(s => !s.title.toLowerCase().includes('contact')) || [];

    const getIcon = (platform: string) => {
        const p = platform.toLowerCase();
        if (p.includes('facebook')) return <Facebook className="w-5 h-5" />;
        if (p.includes('twitter')) return <Twitter className="w-5 h-5" />;
        if (p.includes('instagram')) return <Instagram className="w-5 h-5" />;
        if (p.includes('youtube')) return <Youtube className="w-5 h-5" />;
        return <Globe className="w-5 h-5" />;
    };

    return (
        <footer className="relative bg-[#020617] text-slate-400 border-t border-white/5 pt-24 lg:pt-32 pb-12 overflow-hidden">
            {/* Background Architecture */}
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[140px] mix-blend-screen pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[700px] h-[700px] bg-primary/5 rounded-full blur-[160px] mix-blend-screen pointer-events-none" />
            
            <div className="container relative z-10 px-6 mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 lg:gap-20 mb-24">
                    {/* Brand Cluster */}
                    <div className="lg:col-span-5 space-y-10">
                        <div className="space-y-6">
                            {footerData.logoImage ? (
                                <img 
                                    src={footerData.logoImage} 
                                    alt="NGIT Logo" 
                                    className="h-20 w-auto object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:scale-105 transition-transform duration-500" 
                                />
                            ) : (
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 bg-gradient-to-br from-primary to-blue-600 rounded-3xl flex items-center justify-center font-black text-white text-4xl shadow-[0_20px_40px_-10px_rgba(59,130,246,0.5)] transition-transform hover:rotate-3">
                                        N
                                    </div>
                                    <h3 className="text-3xl font-black tracking-tighter text-white">
                                        {footerData.logoText || "NGIT"}
                                    </h3>
                                </div>
                            )}
                            
                            <p className="text-lg lg:text-xl text-slate-400/80 font-medium leading-relaxed max-w-md">
                                {footerData.description || "Architecting the future of technical education with precision, innovation, and industry-first success strategies."}
                            </p>
                        </div>

                        {/* Professional Social Grid */}
                        <div className="flex flex-wrap gap-4">
                            {footerData.social?.map((social, idx) => (
                                <Link
                                    key={idx}
                                    href={social.url}
                                    target="_blank"
                                    className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-primary hover:text-white hover:border-primary hover:-translate-y-2 hover:shadow-[0_15px_30px_-5px_rgba(59,130,246,0.5)] transition-all duration-500 group"
                                >
                                    {getIcon(social.platform)}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Ecosystem */}
                    <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
                        {regularSections.map((section, idx) => (
                            <div key={idx} className="space-y-8">
                                <h4 className="text-[12px] font-black uppercase tracking-[0.4em] text-white tracking-widest relative">
                                    {section.title}
                                    <span className="block w-8 h-1 bg-primary mt-3 rounded-full opacity-50" />
                                </h4>
                                <ul className="space-y-4">
                                    {section.links?.map((link, linkIdx) => (
                                        <li key={linkIdx}>
                                            <Link
                                                href={link.href}
                                                className="group flex items-center gap-3 text-[15px] font-semibold text-slate-400 hover:text-white transition-all"
                                            >
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary group-hover:scale-125 transition-all" />
                                                <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}

                        {/* Instant Communication */}
                        <div className="md:col-span-1 space-y-8">
                            <h4 className="text-[12px] font-black uppercase tracking-[0.4em] text-white tracking-widest relative">
                                {contactSection?.title || "CONNECT"}
                                <span className="block w-8 h-1 bg-emerald-500 mt-3 rounded-full opacity-50" />
                            </h4>
                            <div className="space-y-6">
                                {contactSection?.links?.map((link, idx) => {
                                    const isPhone = link.href.startsWith("tel:");
                                    const isMail = link.href.startsWith("mailto:");

                                    return (
                                        <a 
                                            key={idx} 
                                            href={link.href} 
                                            className="group flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all duration-300"
                                        >
                                            <div className={cn(
                                                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors shadow-lg",
                                                isPhone ? "bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white" : 
                                                isMail ? "bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white" : 
                                                "bg-slate-500/10 text-slate-400 group-hover:bg-slate-500 group-hover:text-white"
                                            )}>
                                                {isPhone ? <Phone className="w-4 h-4" /> : isMail ? <Mail className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 opacity-60">
                                                    {isPhone ? "Official Line" : isMail ? "Support Desk" : "Location"}
                                                </p>
                                                <p className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors truncate max-w-[140px]">
                                                    {link.label.split(":")[1]?.trim() || link.label}
                                                </p>
                                            </div>
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Baseline */}
                <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="space-y-2 text-center md:text-left">
                        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
                            {footerData.copyright || `© ${currentYear} NGIT TECHNOLOGY ECOSYSTEM. ALL RIGHTS SECURED.`}
                        </p>
                        <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">
                            ISO 9001:2015 CERTIFIED INSTITUTION · SINCE 2009
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-6">
                        <Link href="/verify" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all shadow-xl shadow-emerald-500/10">
                            <ShieldCheck className="w-4 h-4" />
                            Verify Credentials
                        </Link>
                        <div className="flex items-center gap-6">
                            <Link href="/privacy" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Privacy</Link>
                            <Link href="/terms" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Terms</Link>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Architectural Accent */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        </footer>
    );
}
