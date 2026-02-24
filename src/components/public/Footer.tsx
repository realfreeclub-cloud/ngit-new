
import Link from "next/link";
import { getHeaderFooterData } from "@/app/actions/layoutContent";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";

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

    if (!footerData) return null; // Or skeleton

    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-gray-300">
            {/* Main Footer */}
            <div className="container-custom py-16">
                <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12">
                    {/* Brand Column */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-3 mb-6">
                            {footerData.logoImage ? (
                                <img src={footerData.logoImage} alt={footerData.logoText} className="h-12 w-auto object-contain" />
                            ) : (
                                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center font-bold text-white text-2xl shadow-md">
                                    N
                                </div>
                            )}
                            <div>
                                <span className="text-2xl font-heading font-bold tracking-tight text-white">{footerData.logoText || "NGIT"}</span>
                                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Institute of Technology</p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-400 mb-6 leading-relaxed max-w-sm">
                            {footerData.description || "Building future leaders since 2009."}
                        </p>

                        {/* Contact Info (Hardcoded mostly for now as schema is limited, but can be expanded) */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm">
                                <Phone className="w-4 h-4 text-primary" />
                                <a href="tel:+919876543210" className="hover:text-white transition-colors">
                                    +91 98765 43210
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Dynamic Sections */}
                    {footerData.sections?.map((section, idx) => (
                        <div key={idx}>
                            <h3 className="text-white font-heading font-semibold mb-6">{section.title}</h3>
                            <ul className="space-y-3">
                                {section.links?.map((link, linkIdx) => (
                                    <li key={linkIdx}>
                                        <Link
                                            href={link.href}
                                            className="text-sm hover:text-white hover:translate-x-1 inline-block transition-all"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Social Links */}
                <div className="mt-12 pt-8 border-t border-gray-800">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex gap-4">
                            {footerData.social?.map((social, idx) => (
                                <a
                                    key={idx}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center transition-all hover:text-primary hover:bg-gray-700"
                                >
                                    {/* Naive icon mapping or generic fallback */}
                                    <span className="text-xs font-bold">{social.platform?.[0]}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800">
                <div className="container-custom py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
                        <p>{footerData.copyright || `© ${currentYear} NGIT. All Rights Reserved.`}</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
