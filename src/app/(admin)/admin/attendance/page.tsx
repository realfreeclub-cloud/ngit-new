"use client";

import { useEffect, useState, useRef } from "react";
import {
    Calendar as CalendarIcon,
    Search,
    CheckCircle2,
    XCircle,
    Clock,
    Save,
    QrCode,
    Play,
    StopCircle,
    MapPin,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    getStudentsForAttendance,
    getEnrolledStudentsForBatch,
    markAttendance,
    getAttendanceByDate,
    generateQRSession,
    getActiveSession,
    stopSession
} from "@/app/actions/attendance";
import { getAllCourses } from "@/app/actions/courses";
import { AttendanceStatus } from "@/types/attendance";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { QRCodeSVG } from "qrcode.react";

export default function AttendancePage() {
    // --- Manual Registry State ---
    const [students, setStudents] = useState<any[]>([]);
    const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({});
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // --- Live Session State ---
    const [courses, setCourses] = useState<any[]>([]);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [activeCode, setActiveCode] = useState<string | null>(null);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [expiresAt, setExpiresAt] = useState<Date | null>(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [generating, setGenerating] = useState(false);
    const [useLocation, setUseLocation] = useState(true);
    const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);
    const [locLoading, setLocLoading] = useState(false);

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Initial Load
    useEffect(() => {
        loadCourses();
        fetchData();
    }, []);

    // Date or Course Change triggers fetch
    useEffect(() => {
        fetchData();
    }, [date, selectedCourse]);

    // Timer Logic
    useEffect(() => {
        if (activeCode && expiresAt) {
            timerRef.current = setInterval(() => {
                const now = new Date().getTime();
                const exp = new Date(expiresAt).getTime();
                const diff = Math.max(0, Math.floor((exp - now) / 1000));

                setTimeLeft(diff);

                if (diff <= 0) {
                    resetSession();
                }
            }, 1000);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [activeCode, expiresAt]);

    // Check active session when course selected
    useEffect(() => {
        if (selectedCourse) {
            checkActiveSession(selectedCourse);
        } else {
            resetSession();
        }
    }, [selectedCourse]);

    const resetSession = () => {
        setActiveCode(null);
        setSessionId(null);
        setExpiresAt(null);
        if (timerRef.current) clearInterval(timerRef.current);
    };

    const loadCourses = async () => {
        const res = await getAllCourses();
        if (res.success) {
            setCourses(res.courses || []);
        }
    };

    const checkActiveSession = async (batchId: string) => {
        try {
            const res = await getActiveSession(batchId);
            if (res.success && res.session) {
                const session = res.session;
                if (new Date(session.expiresAt) > new Date()) {
                    setActiveCode(session.code);
                    setSessionId(session._id);
                    setExpiresAt(session.expiresAt);
                } else {
                    resetSession();
                }
            } else {
                resetSession();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const getCurrentLocation = () => {
        setLocLoading(true);
        if (!navigator.geolocation) {
            toast.error("Geolocation not supported");
            setLocLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setLocation({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude
                });
                toast.success("Location captured!");
                setLocLoading(false);
            },
            () => {
                toast.error("Unable to get location");
                setLocLoading(false);
            }
        );
    };

    const handleGenerateQR = async () => {
        if (!selectedCourse) {
            toast.error("Select a batch first");
            return;
        }
        if (useLocation && !location) {
            toast.error("Capture location first or disable geofencing");
            return;
        }

        setGenerating(true);
        try {
            const res = await generateQRSession(
                selectedCourse,
                useLocation ? location?.lat : undefined,
                useLocation ? location?.lng : undefined
            );

            if (res.success && res.code && res.sessionId && res.expiresAt) {
                setActiveCode(res.code);
                setSessionId(res.sessionId);
                setExpiresAt(res.expiresAt);
                setTimeLeft(300);
                toast.success("QR Session Active!");
            } else {
                toast.error(res.error || "Failed");
            }
        } catch (err) {
            toast.error("Failed to generate");
        } finally {
            setGenerating(false);
        }
    };

    const handleStopSession = async () => {
        if (!sessionId) return;
        const res = await stopSession(sessionId);
        if (res.success) {
            resetSession();
            toast.success("Session Stopped");
        } else {
            toast.error("Failed to stop session");
        }
    };

    const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
        setAttendance(prev => ({ ...prev, [studentId]: status }));
    };

    const handleSave = async () => {
        setSaving(true);
        if (!selectedCourse) {
            toast.error("Please select a batch for manual registry");
            setSaving(false);
            return;
        }
        const records = Object.entries(attendance).map(([studentId, status]) => ({
            studentId,
            status
        }));
        const res = await markAttendance(records, date, selectedCourse);
        if (res.success) toast.success("Saved");
        else toast.error("Failed");
        setSaving(false);
    };

    const fetchData = async () => {
        setLoading(true);
        const [studentRes, attendanceRes] = await Promise.all([
            selectedCourse ? getEnrolledStudentsForBatch(selectedCourse) : getStudentsForAttendance(),
            getAttendanceByDate(date, selectedCourse)
        ]);
        if (studentRes.success) {
            setStudents(studentRes.students || []);
            const map: Record<string, AttendanceStatus> = {};
            (studentRes.students || []).forEach((s: any) => map[s._id] = AttendanceStatus.PRESENT);
            if (attendanceRes.success) {
                (attendanceRes.records || []).forEach((a: any) => map[a.studentId] = a.status);
            }
            setAttendance(map);
        }
        setLoading(false);
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const qrUrl = activeCode && typeof window !== 'undefined'
        ? `${window.location.origin}/student/attendance/verify?code=${activeCode}`
        : "";

    return (
        <div className="space-y-8 pb-20 max-w-7xl mx-auto">
            {/* LIVE QR SECTION */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden p-8 md:p-10 relative">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-indigo-600" />
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-1">
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                            <span className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                                <QrCode className="w-5 h-5" />
                            </span>
                            Smart QR Attendance
                        </h2>
                        <p className="text-slate-500 font-medium mt-2 max-w-md text-sm">
                            Generate location-secured QR code. 100m radius validation.
                        </p>

                        <div className="mt-8 space-y-6 max-w-lg">
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">1. Select Batch</label>
                                <select
                                    className="h-12 w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 font-bold outline-none focus:border-primary"
                                    value={selectedCourse}
                                    onChange={(e) => setSelectedCourse(e.target.value)}
                                    disabled={!!activeCode}
                                >
                                    <option value="">Select Batch</option>
                                    {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                                </select>
                            </div>

                            {!activeCode && (
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">2. Location Settings</label>
                                    <div className="flex items-center gap-3 mb-3">
                                        <input
                                            type="checkbox"
                                            id="useLoc"
                                            checked={useLocation}
                                            onChange={(e) => setUseLocation(e.target.checked)}
                                            className="w-5 h-5 accent-primary"
                                        />
                                        <label htmlFor="useLoc" className="font-bold text-slate-700 text-sm">Enforce Geofencing (100m)</label>
                                    </div>
                                    {useLocation && (
                                        <Button
                                            onClick={getCurrentLocation}
                                            variant="outline"
                                            className={cn("w-full h-12 rounded-xl font-bold border-2", location ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "")}
                                        >
                                            {locLoading ? <Loader2 className="animate-spin mr-2" /> : <MapPin className="mr-2 w-4 h-4" />}
                                            {location ? "Location Captured" : "Capture My Location"}
                                        </Button>
                                    )}
                                </div>
                            )}

                            {!activeCode ? (
                                <Button
                                    onClick={handleGenerateQR}
                                    disabled={generating || !selectedCourse || (useLocation && !location)}
                                    className="h-14 w-full rounded-xl font-bold shadow-lg shadow-primary/20 text-lg"
                                >
                                    {generating ? <Loader2 className="animate-spin mr-2" /> : <Play className="mr-2" />} Generate Session QR
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleStopSession}
                                    variant="destructive"
                                    className="h-14 w-full rounded-xl font-bold"
                                >
                                    <StopCircle className="mr-2" /> Stop Session
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 p-8 rounded-[2rem] border-2 border-dashed border-slate-200 min-h-[400px]">
                        {activeCode && qrUrl ? (
                            <div className="text-center animate-in zoom-in">
                                <div className="bg-white p-4 rounded-xl shadow-lg inline-block mb-6">
                                    <QRCodeSVG value={qrUrl} size={256} />
                                </div>
                                <div className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-2 rounded-full shadow-xl">
                                    <Clock className="w-4 h-4 text-emerald-400 animate-pulse" />
                                    <span className="font-mono font-bold text-xl">{formatTime(timeLeft)}</span>
                                </div>
                                <p className="text-slate-400 text-xs font-bold mt-4 uppercase tracking-widest">Scan to Mark Attendance</p>
                            </div>
                        ) : (
                            <div className="text-center text-slate-400 opacity-50">
                                <QrCode className="w-16 h-16 mx-auto mb-4" />
                                <p className="font-bold">QR Code will appear here</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* MANUAL REGISTRY TABLE */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900">Manual Registry</h2>
                        <p className="text-sm text-slate-500 font-medium">Select a batch above to load eligible students.</p>
                    </div>
                    <Button disabled={saving || !selectedCourse} onClick={handleSave} className="rounded-xl font-bold">
                        {saving ? <Loader2 className="animate-spin" /> : <Save className="mr-2 w-4 h-4" />} Save
                    </Button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b bg-slate-50/30">
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Student</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 text-center uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredStudents.map((s) => (
                                <tr key={s._id} className="hover:bg-slate-50/50">
                                    <td className="px-6 py-4 font-bold text-slate-700">{s.name}</td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center gap-2">
                                            {[AttendanceStatus.PRESENT, AttendanceStatus.ABSENT, AttendanceStatus.LATE].map(st => (
                                                <button
                                                    key={st}
                                                    onClick={() => handleStatusChange(s._id, st)}
                                                    className={cn(
                                                        "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs transition-all",
                                                        attendance[s._id] === st ? "bg-slate-900 text-white shadow-lg scale-110" : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                                                    )}
                                                >
                                                    {st[0]}
                                                </button>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
