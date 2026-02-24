import { verifyCertificate } from "@/app/actions/certificates";
import CertificateRender from "@/components/shared/CertificateRender";
import { format } from "date-fns";
import { ShieldCheck, Download, Printer } from "lucide-react";
import Link from "next/link";

export default async function VerifyCertificatePage({ params }: { params: Promise<{ certNumber: string }> }) {
    const { certNumber } = await params;
    const res = await verifyCertificate(certNumber);

    if (!res.success) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6 text-center">
                <ShieldCheck className="w-24 h-24 text-red-500 mb-6 opacity-80" />
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Invalid Certificate</h1>
                <p className="text-slate-500 max-w-md mt-4 font-medium mb-8">
                    The certificate number <span className="text-red-600 font-bold font-mono bg-red-50 px-2 py-1 rounded mx-1">{certNumber}</span> could not be verified in our blockchain registry. It may have been revoked or forged.
                </p>
                <Link href="/" className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-transform">
                    Return Home
                </Link>
            </div>
        );
    }

    const { certificate } = res;
    const dateIssued = format(new Date(certificate.issuedDate), "MMMM do, yyyy");

    return (
        <div className="min-h-screen bg-slate-900 print:bg-white text-white print:text-black">
            {/* Minimal Header (Hidden on Print) */}
            <div className="h-16 border-b border-white/10 px-8 flex items-center justify-between print:hidden">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <span className="font-bold tracking-widest uppercase text-xs">Official Verification Registry</span>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        className="px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl font-bold text-xs flex items-center gap-2 transition-colors hover:bg-emerald-500 hover:text-white"
                        // Since this is a server component, we inline a script for the print trigger
                        style={{ cursor: 'pointer' }}
                    >
                        <Printer className="w-4 h-4" /> Print / Save PDF
                    </button>
                    <Link href="/">
                        <button className="text-sm font-medium text-slate-400 hover:text-white">Close</button>
                    </Link>
                </div>
            </div>

            {/* Print trigger using an inline client component pattern for UX */}
            <div className="print:hidden p-8 flex flex-col items-center">
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-6 py-4 rounded-2xl flex items-center gap-4 max-w-2xl w-full mx-auto mb-10 shadow-2xl">
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center shrink-0">
                        <CheckCircleIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="font-black text-lg">Certificate Verified Successfully</h2>
                        <p className="text-sm opacity-80">This document has been authenticated against our tamper-proof secure registry. Details match ID: {certificate.certificateNumber}</p>
                    </div>
                </div>

                <div className="w-full max-w-6xl shadow-[0_0_100px_rgba(0,0,0,0.5)]">
                    <CertificateRender
                        studentName={certificate.studentId.name}
                        courseName={certificate.courseId.title}
                        issuedDate={dateIssued}
                        certificateNumber={certificate.certificateNumber}
                        grade={certificate.grade}
                        duration={certificate.courseDuration}
                        percentage={certificate.percentage}
                    />
                </div>

                {/* Print Hint */}
                <p className="mt-8 text-slate-500 text-xs font-mono uppercase tracking-widest pb-20">
                    Press <span className="text-white">CTRL+P</span> (Windows) or <span className="text-white">CMD+P</span> (Mac) to export as PDF. Adjust margins to 'None'.
                </p>
            </div>

            {/* The actual certificate rendered perfectly raw for the Print view. Rest of UI is hidden using tailwind "print:hidden" */}
            <div className="hidden print:block w-[11in] h-[8.5in] m-0 p-0 overflow-hidden box-border page-landscape">
                <CertificateRender
                    studentName={certificate.studentId.name}
                    courseName={certificate.courseId.title}
                    issuedDate={dateIssued}
                    certificateNumber={certificate.certificateNumber}
                    grade={certificate.grade}
                    duration={certificate.courseDuration}
                    percentage={certificate.percentage}
                />
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    @page { size: landscape; margin: 0; }
                    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: white !important;}
                }
            `}} />
        </div>
    );
}

function CheckCircleIcon(props: any) {
    return (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    )
}
