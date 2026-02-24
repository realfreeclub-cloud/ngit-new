"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, FileDown, LogIn } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { getHeaderFooterData } from "@/app/actions/layoutContent";

type NavLink = {
    label: string;
    href: string;
};

interface HeaderData {
    navigation?: NavLink[];
    logoImage?: string;
    logoText?: string;
    ctaButton?: NavLink;
}

export default function PublicNavbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [headerData, setHeaderData] = useState<HeaderData | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);

        // Fetch header data client-side for now to keep interactivity simpler without full SSR refactor
        // Ideally this component should be server-side or receive props, but we'll fetch on mount.
        getHeaderFooterData().then(res => {
            if (res.success) setHeaderData(res.header);
        });

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks: NavLink[] = headerData?.navigation || [
        { label: "Home", href: "/" },
        { label: "About", href: "/#about" },
        { label: "Courses", href: "/courses" },
        { label: "Results", href: "/#results" },
        { label: "Gallery", href: "/gallery" },
        { label: "Faculty", href: "/faculty" },
        { label: "Contact", href: "/contact" },
    ];

    const cta = headerData?.ctaButton || { label: "Apply Now", href: "/register" };

    return (
        <nav className={cn(
            "sticky top-0 z-50 w-full transition-all duration-300",
            isScrolled
                ? "bg-white/95 backdrop-blur-md shadow-md py-3"
                : "bg-white py-5"
        )}>
            <div className="container-custom">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        {headerData?.logoImage ? (
                            <img src={headerData.logoImage} alt="Logo" className="h-14 w-auto object-contain" />
                        ) : (
                            <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center font-bold text-white text-2xl shadow-lg group-hover:scale-105 transition-transform duration-300">
                                N
                            </div>
                        )}
                        <div className="hidden sm:block">
                            <span className="text-2xl font-heading font-bold tracking-tight text-gray-900 block leading-none">{headerData?.logoText || "NGIT"}</span>
                            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">Institute of Technology</p>
                        </div>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center gap-1">
                        <div className="flex items-center gap-1">
                            {navLinks.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.href}
                                    className="px-2 xl:px-3 py-2 text-[13px] xl:text-sm whitespace-nowrap font-bold text-gray-700 hover:text-primary hover:bg-primary/5 rounded-lg transition-all relative group"
                                >
                                    {link.label}
                                    <span className="absolute bottom-1 left-3 right-3 h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                                </Link>
                            ))}
                        </div>

                        <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
                            <Link href="tel:+919876543210">
                                <Button variant="ghost" className="gap-2 text-gray-700 hover:text-primary hover:bg-primary/5 font-semibold">
                                    <Phone className="w-4 h-4" />
                                    <span className="hidden xl:inline">Call Now</span>
                                </Button>
                            </Link>
                            <Link href="/student/login">
                                <Button variant="outline" className="gap-2 border-primary text-primary hover:bg-primary hover:text-white font-bold px-5 py-2.5 transition-all duration-300">
                                    <LogIn className="w-4 h-4" />
                                    Student Portal
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle menu"
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="lg:hidden mt-4 pb-4 border-t pt-4 animate-slide-up">
                        <div className="flex flex-col space-y-3">
                            {navLinks.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.href}
                                    className="text-base font-medium py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="flex flex-col gap-3 pt-4 border-t">
                                <Link href="tel:+919876543210" onClick={() => setIsOpen(false)}>
                                    <Button variant="outline" className="w-full gap-2 justify-center">
                                        <Phone className="w-4 h-4" />
                                        Call Now
                                    </Button>
                                </Link>
                                <Link href="/student/login" onClick={() => setIsOpen(false)}>
                                    <Button variant="outline" className="w-full gap-2 justify-center border-primary text-primary hover:bg-primary hover:text-white font-bold transition-all duration-300">
                                        <LogIn className="w-4 h-4" />
                                        Student Portal Login
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
