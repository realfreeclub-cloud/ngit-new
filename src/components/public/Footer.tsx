import Link from "next/link";
import { getHeaderFooterData } from "@/app/actions/layoutContent";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Zap, ArrowUpRight, ShieldCheck } from "lucide-react";

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

    return (
        <footer className="relative bg-[#020617] text-slate-400 border-t border-white/5 pt-20 lg:pt-28 pb-10 overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[150px] mix-blend-screen pointer-events-none" />
            
            {/* Top Light Effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent blur-[1px]" />

            <div className="container relative z-10 px-6 mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16 mb-20">
                    {/* Brand Identity */}
                    <div className="lg:col-span-4 xl:col-span-5 space-y-8">
                        <div className="flex items-center gap-4">
                            {footerData.logoImage ? (
                                <img src={footerData.logoImage} alt={footerData.logoText || "Logo"} className="h-20 w-auto object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]" />
                            ) : (
                                <>
                                    <div className="w-20 h-20 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center font-black text-white text-4xl shadow-[0_0_20px_rgba(59,130,246,0.4)]">
                                        N
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black tracking-tighter text-white leading-none">
                                            {footerData.logoText || "NGIT"}
                                        </h3>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mt-1">
                                            Advanced Institute
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>

                        <p className="text-base lg:text-lg text-slate-400/90 font-medium leading-relaxed max-w-sm">
                            {footerData.description || "Empowering the next generation of technology leaders with industry-aligned education since 2009."}
                        </p>

                        <div className="flex flex-wrap gap-3">
                            {footerData.social?.map((social, idx) => (
                                <Link
                                    key={idx}
                                    href={social.url}
                                    target="_blank"
                                    className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-primary hover:text-white hover:border-primary hover:-translate-y-1.5 hover:shadow-[0_10px_20px_-10px_rgba(59,130,246,0.6)] transition-all duration-300"
                                >
                                    <span className="text-xs font-black uppercase tracking-[0.2em]">{social.platform?.[0]}</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Clusters */}
                    <div className="lg:col-span-8 xl:col-span-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 lg:gap-12">
                        {regularSections.map((section, idx) => (
                            <div key={idx} className="space-y-6 lg:space-y-8">
                                <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/90 relative inline-block">
                                    {section.title}
                                    <span className="absolute -bottom-2 left-0 w-4 h-0.5 bg-primary/50" />
                                </h4>
                                <ul className="space-y-3">
                                    {section.links?.map((link, linkIdx) => (
                                        <li key={linkIdx}>
                                            <Link
                                                href={link.href}
                                                className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors group"
                                            >
                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500/0 group-hover:bg-blue-500 transition-colors" />
                                                <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
                                                <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-blue-400" />
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}

                        {/* Direct Contact Column */}
                        <div className="space-y-6 lg:space-y-8 sm:col-span-2 md:col-span-1 pt-6 sm:pt-0 border-t border-white/5 sm:border-t-0">
                            <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/90 relative inline-block">
                                {contactSection?.title || "Connect"}
                                <span className="absolute -bottom-2 left-0 w-4 h-0.5 bg-blue-500/50" />
                            </h4>
                            <div className="space-y-5">
                                {contactSection?.links?.map((link, idx) => {
                                    const isPhone = link.href.startsWith("tel:");
                                    const isMail = link.href.startsWith("mailto:");

                                    if (isPhone) {
                                        return (
                                            <a key={idx} href={link.href} className="flex items-start gap-4 text-sm font-medium hover:text-white transition-colors group">
                                                <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-500 group-hover:text-white group-hover:shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)] transition-all shrink-0">
                                                    <Phone className="w-4 h-4" />
                                                </div>
                                                <div className="flex flex-col pt-1">
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-0.5">Phone Line</span>
                                                    <span className="text-[15px] text-slate-300 group-hover:text-white transition-colors font-semibold tracking-wide">
                                                        {link.label.replace("Phone: ", "")}
                                                    </span>
                                                </div>
                                            </a>
                                        );
                                    } else if (isMail) {
                                        return (
                                            <a key={idx} href={link.href} className="flex items-start gap-4 text-sm font-medium hover:text-white transition-colors group">
                                                <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-emerald-600 group-hover:border-emerald-500 group-hover:text-white group-hover:shadow-[0_0_20px_-5px_rgba(16,185,129,0.5)] transition-all shrink-0">
                                                    <Mail className="w-4 h-4" />
                                                </div>
                                                <div className="flex flex-col pt-1">
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-0.5">Email Desk</span>
                                                    <span className="text-[15px] text-slate-300 group-hover:text-white transition-colors font-semibold tracking-wide">
                                                        {link.label.replace("Email: ", "")}
                                                    </span>
                                                </div>
                                            </a>
                                        );
                                    }

                                    return (
                                        <a key={idx} href={link.href} className="flex items-center gap-3 text-sm font-semibold hover:text-white transition-colors group">
                                            {link.label}
                                        </a>
                                    );
                                }) || (
                                    <>
                                        <a href="tel:+919876543210" className="flex items-start gap-4 text-sm font-medium hover:text-white transition-colors group">
                                            <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-500 group-hover:text-white group-hover:shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)] transition-all shrink-0">
                                                <Phone className="w-4 h-4" />
                                            </div>
                                            <div className="flex flex-col pt-1">
                                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-0.5">Phone Line</span>
                                                <span className="text-[15px] text-slate-300 group-hover:text-white transition-colors font-semibold tracking-wide">+91 98765 43210</span>
                                            </div>
                                        </a>
                                        <a href="mailto:info@ngit.edu" className="flex items-start gap-4 text-sm font-medium hover:text-white transition-colors group">
                                            <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-emerald-600 group-hover:border-emerald-500 group-hover:text-white group-hover:shadow-[0_0_20px_-5px_rgba(16,185,129,0.5)] transition-all shrink-0">
                                                <Mail className="w-4 h-4" />
                                            </div>
                                            <div className="flex flex-col pt-1">
                                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-0.5">Email Desk</span>
                                                <span className="text-[15px] text-slate-300 group-hover:text-white transition-colors font-semibold tracking-wide">info@ngit.edu</span>
                                            </div>
                                        </a>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col-reverse md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 text-center md:text-left">
                        {footerData.copyright || `© ${currentYear} NGIT TECHNOLOGY HUB. ARCHITECTED FOR EXCELLENCE.`}
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6">
                        <Link href="/verify" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-black uppercase tracking-widest text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/40 hover:text-emerald-300 transition-all duration-300 shadow-[0_0_15px_-5px_theme('colors.emerald.500/50')]">
                            <ShieldCheck className="w-3 h-3" />
                            Verify Credential
                        </Link>
                        <span className="w-1 h-1 rounded-full bg-white/20 hidden sm:block" />
                        <Link href="/privacy" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Privacy Paradigm</Link>
                        <span className="w-1 h-1 rounded-full bg-white/20" />
                        <Link href="/terms" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Operational Terms</Link>
                    </div>
                </div>
            </div>
            
            {/* Bottom Glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent blur-sm" />
        </footer>
    );
}
