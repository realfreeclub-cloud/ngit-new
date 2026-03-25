import Link from "next/link";
import { getHeaderFooterData } from "@/app/actions/layoutContent";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Zap, ArrowUpRight } from "lucide-react";

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
        <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 pt-24">
            <div className="container px-6 mx-auto">
                <div className="grid md:grid-cols-2 lg:grid-cols-12 gap-16 mb-20">
                    {/* Brand Identity */}
                    <div className="lg:col-span-5 space-y-8">
                        <div className="flex items-center gap-4">
                            {footerData.logoImage ? (
                                <img src={footerData.logoImage} alt={footerData.logoText} className="h-10 w-auto brightness-0 invert" />
                            ) : (
                                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center font-black text-white text-2xl shadow-xl shadow-primary/20">
                                    N
                                </div>
                            )}
                            <div>
                                <h3 className="text-2xl font-black tracking-tighter text-white leading-none">
                                    {footerData.logoText || "NGIT"}
                                </h3>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mt-1">
                                    Advanced Institute
                                </p>
                            </div>
                        </div>

                        <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-sm">
                            {footerData.description || "Empowering the next generation of technology leaders with industry-aligned education since 2009."}
                        </p>

                        <div className="flex flex-wrap gap-4">
                            {footerData.social?.map((social, idx) => (
                                <Link
                                    key={idx}
                                    href={social.url}
                                    target="_blank"
                                    className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white hover:border-primary hover:-translate-y-1 transition-all duration-300"
                                >
                                    <span className="text-xs font-black uppercase tracking-tighter tracking-[0.2em]">{social.platform?.[0]}</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Clusters */}
                    <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-12">
                        {regularSections.map((section, idx) => (
                            <div key={idx} className="space-y-8">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">
                                    {section.title}
                                </h4>
                                <ul className="space-y-4">
                                    {section.links?.map((link, linkIdx) => (
                                        <li key={linkIdx}>
                                            <Link
                                                href={link.href}
                                                className="text-sm font-semibold hover:text-white transition-colors flex items-center gap-2 group"
                                            >
                                                {link.label}
                                                <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}

                        {/* Direct Contact Column */}
                        <div className="space-y-8">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">
                                {contactSection?.title || "Connect"}
                            </h4>
                            <div className="space-y-4">
                                {contactSection?.links?.map((link, idx) => {
                                    const isPhone = link.href.startsWith("tel:");
                                    const isMail = link.href.startsWith("mailto:");

                                    if (isPhone) {
                                        return (
                                            <a key={idx} href={link.href} className="flex items-center gap-3 text-sm font-semibold hover:text-white transition-colors group">
                                                <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                                                    <Phone className="w-4 h-4" />
                                                </div>
                                                {link.label.replace("Phone: ", "")}
                                            </a>
                                        );
                                    } else if (isMail) {
                                        return (
                                            <a key={idx} href={link.href} className="flex items-center gap-3 text-sm font-semibold hover:text-white transition-colors group">
                                                <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-all">
                                                    <Mail className="w-4 h-4" />
                                                </div>
                                                {link.label.replace("Email: ", "")}
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
                                        <a href="tel:+919876543210" className="flex items-center gap-3 text-sm font-semibold hover:text-white transition-colors group">
                                            <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                                                <Phone className="w-4 h-4" />
                                            </div>
                                            +91 98765 43210
                                        </a>
                                        <a href="mailto:info@ngit.edu" className="flex items-center gap-3 text-sm font-semibold hover:text-white transition-colors group">
                                            <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-all">
                                                <Mail className="w-4 h-4" />
                                            </div>
                                            info@ngit.edu
                                        </a>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="py-12 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-[11px] font-black uppercase tracking-widest text-slate-600">
                        {footerData.copyright || `© ${currentYear} NGIT TECHNOLOGY HUB. ARCHITECTED FOR EXCELLENCE.`}
                    </p>
                    <div className="flex items-center gap-8">
                        <Link href="/privacy" className="text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-white transition-colors">Privacy Paradigm</Link>
                        <Link href="/terms" className="text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-white transition-colors">Operational Terms</Link>
                    </div>
                </div>
            </div>
            
            {/* Dark background light effect */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent blur-sm" />
        </footer>
    );
}
