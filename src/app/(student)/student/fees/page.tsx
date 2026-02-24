"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CreditCard, CheckCircle2, Clock, IndianRupee, FileText } from "lucide-react";
import { getMyFees, initiatePayment, verifyPayment } from "@/app/actions/payment";
import { getStudentInvoices } from "@/app/actions/admin-invoice";
import Script from "next/script";

export default function StudentFeesPage() {
    const [data, setData] = useState<{ enrollments: any[], payments: any[], invoices: any[] }>({
        enrollments: [], payments: [], invoices: []
    });
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    const loadData = async () => {
        setLoading(true);
        try {
            const [feeRes, invRes] = await Promise.all([
                getMyFees(),
                getStudentInvoices()
            ]);

            if (feeRes.success) {
                setData(prev => ({ ...prev, enrollments: feeRes.enrollments || [], payments: feeRes.payments || [] }));
            } else {
                toast.error(feeRes.error || "Failed to load fee data");
            }

            if (invRes.success) {
                setData(prev => ({ ...prev, invoices: invRes.invoices || [] }));
            }
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handlePayClick = async (courseId: string, courseTitle: string) => {
        setProcessingId(courseId);
        try {
            // Initiate
            const res = await initiatePayment(courseId);
            if (!res.success) {
                toast.error(res.error || "Failed to initiate payment");
                setProcessingId(null);
                return;
            }

            const options = {
                key: res.key,
                amount: res.amount,
                currency: res.currency,
                name: "NGIT LMS",
                description: `Payment for ${res.courseTitle}`,
                order_id: res.orderId,
                prefill: {
                    name: res.userName,
                    email: res.userEmail,
                },
                theme: { color: "#0f172a" },
                handler: async function (response: any) {
                    const verifyRes = await verifyPayment(
                        response.razorpay_order_id,
                        response.razorpay_payment_id,
                        response.razorpay_signature
                    );

                    if (verifyRes.success) {
                        toast.success("Payment Successful!");
                        loadData();
                    } else {
                        toast.error(verifyRes.error || "Payment verification failed.");
                    }
                },
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.on("payment.failed", function (response: any) {
                toast.error(response.error.description || "Payment failed.");
                setProcessingId(null);
            });
            rzp.open();

        } catch (error) {
            toast.error("Failed to process payment.");
        }
        setProcessingId(null);
    };

    // Derived states
    const feeRecords: any[] = [];

    data.enrollments.forEach(en => {
        const amount = en.courseId?.price || 0;
        const coursePayments = data.payments.filter(p => p.courseId?._id === en.courseId?._id && p.status === "SUCCESS");
        const totalPaid = coursePayments.reduce((sum, p) => sum + p.amount, 0);
        const balance = amount - totalPaid;
        const isPaid = balance <= 0;

        feeRecords.push({
            courseId: en.courseId?._id,
            courseName: en.courseId?.title,
            coursePrice: amount,
            totalPaid: totalPaid,
            balance: balance,
            enrolledAt: en.enrolledAt,
            status: isPaid ? "PAID" : "PARTIAL"
        });
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Fees & Payments</h1>
                    <p className="text-muted-foreground mt-1">Manage your course fees and view transaction history.</p>
                </div>
            </div>

            <div className="bg-white border rounded-[2.5rem] overflow-hidden shadow-sm">
                <div className="p-8 border-b bg-slate-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                            <FileText className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Your Fee Records</h2>
                            <p className="text-xs text-slate-500 font-medium">Clear your dues to continue accessing premium content.</p>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-12 text-center text-slate-400 font-medium animate-pulse">
                            Loading your fee records...
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b">
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Course / Program</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Total Fee</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y text-slate-600 font-medium">
                                {feeRecords.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-8 py-8 text-center text-slate-400 italic">No courses found.</td>
                                    </tr>
                                )}
                                {feeRecords.map((record, i) => (
                                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-8 py-6">
                                            <p className="font-bold text-slate-900">{record.courseName}</p>
                                            <p className="text-[10px] text-slate-400 mt-1 uppercase">Enrolled: {new Date(record.enrolledAt).toLocaleDateString()}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="font-bold text-slate-900 border border-slate-200 bg-slate-50 inline-block px-3 py-1 rounded-lg">₹{record.coursePrice}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            {record.status === "PAID" ? (
                                                <div className="flex flex-col gap-1">
                                                    <span className="flex items-center justify-center gap-1.5 text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full w-32 uppercase">
                                                        <CheckCircle2 className="w-3.5 h-3.5" /> Fully Paid
                                                    </span>
                                                    <p className="text-[10px] font-bold text-slate-400">Bal: ₹0</p>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col gap-1">
                                                    <span className="flex items-center justify-center gap-1.5 text-[10px] font-black text-rose-600 bg-rose-50 px-3 py-1.5 rounded-full w-32 uppercase">
                                                        <Clock className="w-3.5 h-3.5" /> Pending
                                                    </span>
                                                    <p className="text-[10px] font-bold text-slate-400">Paid: ₹{record.totalPaid} / Bal: ₹{record.balance}</p>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            {record.status !== "PAID" && (
                                                <Button
                                                    size="sm"
                                                    className="bg-primary hover:bg-primary/90 text-white font-bold gap-2 text-xs rounded-xl h-10 px-4"
                                                    onClick={() => handlePayClick(record.courseId, record.courseName)}
                                                    disabled={processingId === record.courseId}
                                                >
                                                    {processingId === record.courseId ? (
                                                        <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                                                    ) : (
                                                        <CreditCard className="w-4 h-4" />
                                                    )}
                                                    Pay ₹{record.balance}
                                                </Button>
                                            )}
                                            {record.status === "PAID" && (
                                                <Button size="sm" variant="ghost" className="text-slate-400 font-bold gap-2 text-xs rounded-xl h-10 px-4">
                                                    <FileText className="w-4 h-4" /> View Receipt
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Custom Invoices View */}
            {data.invoices.length > 0 && (
                <div className="bg-white border rounded-[2.5rem] overflow-hidden shadow-sm mt-8">
                    <div className="p-8 border-b bg-slate-50/50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                                <FileText className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Structured Payment Plans</h2>
                                <p className="text-xs text-slate-500 font-medium">Custom invoices generated by your administration.</p>
                            </div>
                        </div>
                    </div>
                    <div className="overflow-x-auto p-8">
                        <div className="space-y-6">
                            {data.invoices.map((inv: any) => (
                                <div key={inv._id} className="border border-slate-200 rounded-2xl p-6 bg-slate-50/50 flex flex-col md:flex-row gap-6 justify-between">
                                    <div className="flex-1 space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-black text-lg text-slate-900">Invoice {inv.invoiceNumber}</h3>
                                                <p className="text-sm font-bold text-slate-500">{inv.courseId?.title}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="font-black text-2xl text-slate-900 leading-none">₹{inv.totalAmount}</span>
                                                <p className="text-xs font-bold text-slate-400 mt-1 uppercase">Bal: <span className="text-rose-500">₹{inv.balanceDue}</span></p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            {inv.installments.map((inst: any, idx: number) => (
                                                <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">{idx + 1}</div>
                                                        <div>
                                                            <p className="font-bold text-sm text-slate-800">₹{inst.amount}</p>
                                                            <p className="text-[10px] uppercase font-bold text-slate-400">Due: {new Date(inst.dueDate).toLocaleDateString()}</p>
                                                        </div>
                                                    </div>
                                                    {inst.status === "PAID" ? (
                                                        <span className="flex items-center gap-1 text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-1 flex-shrink-0 rounded-full border border-emerald-100">
                                                            <CheckCircle2 className="w-3 h-3" /> Paid
                                                        </span>
                                                    ) : (
                                                        <span className="text-[10px] font-black uppercase text-rose-500 bg-rose-50 px-2 py-1 rounded border border-rose-100 flex-shrink-0">
                                                            Pending Collect
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
