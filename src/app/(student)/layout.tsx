import { ReactNode } from "react";
import StudentSidebar from "@/components/student/StudentSidebar";
import StudentNavbar from "@/components/student/StudentNavbar";

export default function StudentLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex h-screen bg-white">
            <StudentSidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
                <StudentNavbar />
                <main className="flex-1 overflow-y-auto p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
