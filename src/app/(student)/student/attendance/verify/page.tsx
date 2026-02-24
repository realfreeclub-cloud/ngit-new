"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { submitAttendance } from "@/app/actions/attendance";
import { toast } from "sonner";
import { Loader2, CheckCircle, XCircle, MapPin } from "lucide-react";

function VerifyAttendanceContent() {
    const searchParams = useSearchParams();
    const code = searchParams.get("code");

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "locating" | "submitting" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");
    const [result, setResult] = useState<{ batchId?: string, distance?: number }>({});

    useEffect(() => {
        if (!code) {
            setStatus("error");
            setErrorMsg("Invalid Link: No Code Provided");
        }
    }, [code]);

    const handleVerify = () => {
        if (!code) return;

        setStatus("locating");
        if (!navigator.geolocation) {
            setStatus("error");
            setErrorMsg("Geolocation is not supported by your browser");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude, accuracy } = position.coords;
                setStatus("submitting");

                try {
                    const res = await submitAttendance(code, latitude, longitude, accuracy);
                    if (res.success) {
                        setStatus("success");
                        setResult({ batchId: res.batchId, distance: res.distance });
                        toast.success("Attendance Marked!");
                    } else {
                        setStatus("error");
                        setErrorMsg(res.error || "Failed to mark attendance");
                        toast.error(res.error);
                    }
                } catch (err) {
                    setStatus("error");
                    setErrorMsg("Server Error");
                }
            },
            (err) => {
                console.error(err);
                setStatus("error");
                let msg = "Unable to retrieve location.";
                if (err.code === 1) msg = "Location permission denied.";
                if (err.code === 2) msg = "Location unavailable.";
                if (err.code === 3) msg = "Location request timed out.";
                setErrorMsg(msg);
                toast.error(msg);
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    if (status === "success") {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50">
                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl text-center max-w-md w-full animate-in zoom-in duration-300">
                    <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-12 h-12 text-emerald-600" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 mb-2">Success!</h1>
                    <p className="text-slate-500 font-medium mb-6">
                        Your attendance has been recorded.
                    </p>
                    <div className="bg-slate-50 rounded-xl p-4 mb-8 text-sm">
                        <div className="flex justify-between mb-2">
                            <span className="font-bold text-slate-400">Status</span>
                            <span className="font-bold text-emerald-600">Present</span>
                        </div>
                        {result.distance !== undefined && (
                            <div className="flex justify-between">
                                <span className="font-bold text-slate-400">Distance</span>
                                <span className="font-bold text-slate-700">{result.distance}m from center</span>
                            </div>
                        )}
                    </div>
                    <Button onClick={() => window.location.href = "/student"} className="w-full h-12 rounded-xl font-bold">
                        Go to Dashboard
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl text-center max-w-md w-full">
                <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
                    <MapPin className="w-10 h-10 text-indigo-600" />
                </div>

                <h1 className="text-2xl font-black text-slate-900 mb-2">Verify Location</h1>
                <p className="text-slate-500 text-sm mb-8">
                    We need to verify you are in the class to mark your attendance.
                </p>

                {status === "error" && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex items-center gap-3 text-left">
                        <XCircle className="w-5 h-5 shrink-0" />
                        <span className="text-sm font-bold">{errorMsg}</span>
                    </div>
                )}

                <Button
                    onClick={handleVerify}
                    disabled={status === "locating" || status === "submitting"}
                    className="w-full h-14 text-lg font-bold rounded-xl shadow-lg shadow-indigo-500/20"
                >
                    {status === "idle" || status === "error" ? (
                        <>Verify & Mark Attendance</>
                    ) : (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                            {status === "locating" ? "Locating..." : "Verifying..."}
                        </>
                    )}
                </Button>

                <p className="text-xs text-slate-400 font-bold mt-6 text-center">
                    Please allow location access when prompted.
                </p>
            </div>
        </div>
    );
}

export default function VerifyAttendancePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50">
                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl text-center max-w-md w-full">
                    <Loader2 className="w-12 h-12 animate-spin mx-auto text-indigo-600" />
                    <p className="text-slate-500 font-medium mt-4">Loading...</p>
                </div>
            </div>
        }>
            <VerifyAttendanceContent />
        </Suspense>
    );
}
