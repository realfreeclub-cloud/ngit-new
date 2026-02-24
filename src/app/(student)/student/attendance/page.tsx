"use client";

import { QrCode } from "lucide-react";

export default function StudentAttendancePage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50 text-center">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-xl max-w-md w-full">
                <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                    <QrCode className="w-12 h-12 text-indigo-600" />
                </div>
                <h1 className="text-3xl font-black text-slate-900 mb-4">Scan to Mark</h1>
                <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                    Please use your phone camera to scan the QR code displayed by your instructor. It will automatically verify your location and mark your attendance.
                </p>

                <div className="bg-slate-50 p-6 rounded-2xl text-left">
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-2">Instructions</h3>
                    <ul className="text-sm text-slate-500 space-y-2 list-disc list-inside">
                        <li>Ensure location services are enabled.</li>
                        <li>You must be within 100m of the classroom.</li>
                        <li>QR codes expire after 5 minutes.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
