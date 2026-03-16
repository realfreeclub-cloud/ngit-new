"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    FileText,
    Shapes,
    Library,
    Users,
    CreditCard,
    Settings,
    Image as ImageIcon,
    Calendar,
    GraduationCap,
    ClipboardList,
    Layout,
    ChevronDown,
    BrainCircuit
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Content Mgmt", href: "/admin/content", icon: FileText },
    {
        label: "Mock Test Manager",
        href: "/admin/mock-tests",
        icon: BrainCircuit,
        subItems: [
            { label: "Dashboard", href: "/admin/mock-tests" },
            { label: "Question Bank", href: "/admin/questions" },
            { label: "Paper Sets", href: "/admin/mock-tests/papers" },
            { label: "Mock Tests", href: "/admin/mock-tests/list" },
            { label: "Paid Test Requests", href: "/admin/mock-tests/requests" },
            { label: "Mock Test Results", href: "/admin/results" },
            { label: "Analytics", href: "/admin/mock-tests/analytics" }
        ]
    },
    { label: "Header & Footer", href: "/admin/layout", icon: Layout },
    { label: "LMS - Courses", href: "/admin/courses", icon: Shapes },
    { label: "Study Materials", href: "/admin/materials", icon: Library },
    { label: "Gallery", href: "/admin/gallery", icon: ImageIcon },
    { label: "Events", href: "/admin/events", icon: Calendar },
    { label: "Faculty", href: "/admin/faculty", icon: GraduationCap },
    {
        label: "Students",
        href: "/admin/students",
        icon: Users,
        subItems: [
            { label: "Registrations", href: "/admin/students" },
            { label: "Fee Management", href: "/admin/students/fees" },
            { label: "Enrollments", href: "/admin/students/enrollments" }
        ]
    },
    { label: "Attendance", href: "/admin/attendance", icon: ClipboardList },
    { label: "Payments", href: "/admin/payments", icon: CreditCard },
    { label: "Certificates", href: "/admin/certificates", icon: GraduationCap },
    { label: "Settings", href: "/admin/settings", icon: Settings },
];

interface SidebarProps {
    className?: string;
    onClose?: () => void;
}

export default function Sidebar({ className, onClose }: SidebarProps) {
    const pathname = usePathname();

    return (
        <aside className={cn("w-64 bg-white border-r flex flex-col h-full", className)} style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="p-6 border-b flex justify-between items-center bg-slate-900 text-white">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-bold text-white">N</div>
                    <h1 className="text-xl font-bold">NGIT Admin</h1>
                </Link>
                {onClose && (
                    <button onClick={onClose} aria-label="Close sidebar" className="md:hidden p-2 text-white/70 hover:text-white rounded-lg transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                )}
            </div>
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {menuItems.map((item) => (
                    <div key={item.label}>
                        {item.subItems ? (
                            <details className="group" open={pathname.startsWith(item.href)}>
                                <summary className={cn(
                                    "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer list-none",
                                    (pathname.startsWith(item.href) && pathname !== "/admin")
                                        ? "bg-primary/10 text-primary"
                                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                )}>
                                    <item.icon className={cn("w-5 h-5", (pathname.startsWith(item.href) && pathname !== "/admin") ? "text-primary" : "text-slate-400")} />
                                    <span className="flex-1">{item.label}</span>
                                    <ChevronDown className="w-4 h-4 opacity-50 group-open:rotate-180 transition-transform" />
                                </summary>
                                <div className="ml-8 mt-1 space-y-1">
                                    {item.subItems.map((subItem) => (
                                        <Link
                                            key={subItem.href}
                                            href={subItem.href}
                                            onClick={onClose}
                                            className={cn(
                                                "block px-3 py-2 rounded-lg text-xs font-bold transition-all",
                                                pathname === subItem.href
                                                    ? "bg-primary text-white shadow-md shadow-primary/20"
                                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                            )}
                                        >
                                            {subItem.label}
                                        </Link>
                                    ))}
                                </div>
                            </details>
                        ) : (
                            <Link
                                href={item.href}
                                onClick={onClose}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold transition-all",
                                    pathname === item.href
                                        ? "bg-primary text-white shadow-lg shadow-primary/30"
                                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                )}
                            >
                                <item.icon className={cn("w-5 h-5", pathname === item.href ? "text-white" : "text-slate-400")} />
                                {item.label}
                            </Link>
                        )}
                    </div>
                ))}
            </nav>

            <div className="p-4 border-t bg-slate-50/50">
                <div className="bg-white border rounded-xl p-4 shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-2">Storage Used</p>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-[75%]"></div>
                    </div>
                    <p className="text-xs font-bold text-slate-600 mt-2">7.5 GB / 10 GB</p>
                </div>
            </div>
        </aside>
    );
}
