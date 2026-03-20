
"use server";

import connectDB from "@/lib/db";
import Certificate, { CertificateStatus } from "@/models/Certificate";
import CertificateTemplate from "@/models/CertificateTemplate";
import { generateCertificateNumber } from "@/lib/certificate";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DynamicCertificateTemplate } from "@/components/certificates/DynamicCertificateTemplate";
import QRCode from "qrcode";
import React from "react";
import User, { UserRole } from "@/models/User";
import Course from "@/models/Course";
import { revalidatePath } from "next/cache";


// --- STUDENT: GET MY CERTIFICATES ---
export async function getStudentCertificates() {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (!session?.user) return { success: false, error: "Unauthorized" };

        const certs = await Certificate.find({ studentId: session.user.id })
            .populate("courseId", "title")
            .sort({ issuedDate: -1 });

        return { success: true, certificates: JSON.parse(JSON.stringify(certs)) };
    } catch (error) {
        return { success: false, error: "Failed to fetch certificates" };
    }
}

// --- PUBLIC: VERIFY CERTIFICATE ---
export async function verifyCertificate(certId: string) {
    try {
        await connectDB();

        let query = {};
        if (certId.match(/^[0-9a-fA-F]{24}$/)) {
            query = { _id: certId };
        } else {
            query = { certificateNumber: certId };
        }

        const cert = await Certificate.findOne(query)
            .populate("studentId", "name email image")
            .populate("courseId", "title description thumbnail");

        if (!cert) return { success: false, error: "Certificate not found" };

        return { success: true, certificate: JSON.parse(JSON.stringify(cert)) };
    } catch (error) {
        return { success: false, error: "Verification failed" };
    }
}

// --- DOWNLOAD PDF ---
export async function getCertificatePDF(certId: string) {
    try {
        await connectDB();
        const cert = await Certificate.findById(certId)
            .populate("studentId", "name email")
            .populate("courseId", "title");

        if (!cert) return { success: false, error: "Certificate record not found" };
        if (!cert.studentId) return { success: false, error: "Student for this certificate no longer exists" };
        if (!cert.courseId) return { success: false, error: "Course for this certificate no longer exists" };

        const student = cert.studentId as any;
        const course = cert.courseId as any;

        // Generate QR Code Data URL
        const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://ngit-new.vercel.app"}/verify/${cert.certificateNumber}`;
        const qrCodeDataUrl = await QRCode.toDataURL(verifyUrl);

        // Prepare Date string
        const dateStr = new Date(cert.issuedDate).toLocaleDateString("en-GB", {
            day: 'numeric', month: 'long', year: 'numeric'
        });

        const { renderToBuffer } = await import("@react-pdf/renderer");
        let pdfBuffer: Buffer | null = null;

        // 1. Determine which template to use
        let templateIdToUse = cert.metadata?.templateId;
        
        // If not specific to cert, look for default
        if (!templateIdToUse) {
            const defaultTemplate = await CertificateTemplate.findOne({ isDefault: true }).select("_id");
            if (defaultTemplate) {
                templateIdToUse = defaultTemplate._id.toString();
            } else {
                // If NO default template is set, but templates EXIST, use the latest one
                // This prevents falling back to static design when the user has designed something
                const anyTemplate = await CertificateTemplate.findOne().sort({ updatedAt: -1 }).select("_id");
                if (anyTemplate) {
                    templateIdToUse = anyTemplate._id.toString();
                }
            }
        }

        if (templateIdToUse) {
            try {
                const template = await CertificateTemplate.findById(templateIdToUse);
                if (template) {
                    pdfBuffer = await renderToBuffer(
                        React.createElement(DynamicCertificateTemplate as any, {
                            elements: template.elements as any,
                            backgroundImage: template.backgroundImage,
                            config: template.config as any,
                            placeholders: {
                                student_name: student.name || "Student Name",
                                course_name: course.title || "Course Name",
                                grade: cert.grade || "N/A",
                                percentage: (cert.percentage || 0).toString(),
                                enrollment_number: student.email || student._id.toString(),
                                certificate_number: cert.certificateNumber,
                                issue_date: dateStr,
                                qr_code: qrCodeDataUrl,
                                institute_name: "NGIT Institute"
                            }
                        }) as any
                    );
                }
            } catch (err) {
                console.error("Dynamic Template Render Error:", err);
            }
        }

        // NO Default Fallback anymore. If it fails, it fails gracefully or warns.
        if (!pdfBuffer) {
            return { 
                success: false, 
                error: "No certificate design template found. Please create and mark a template as 'Default' in the Admin Panel." 
            };
        }

        const base64 = pdfBuffer.toString('base64');
        return { 
            success: true, 
            pdfBase64: base64, 
            filename: `Certificate-${cert.certificateNumber.replace(/\//g, '-')}.pdf` 
        };

    } catch (error: any) {
        console.error("PDF Gen Error:", error);
        return { success: false, error: "Failed to generate PDF. Please try again later." };
    }
}

// --- ADMIN: LIST ALL CERTIFICATES ---
export async function getAdminCertificates() {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (session?.user?.role !== "ADMIN") return { success: false, error: "Unauthorized" };

        const certs = await Certificate.find()
            .populate("studentId", "name email")
            .populate("courseId", "title thumbnail")
            .sort({ createdAt: -1 });

        return { success: true, certificates: JSON.parse(JSON.stringify(certs)) };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// ALIAS for backward compatibility
export const getAllCertificates = getAdminCertificates;

// --- ADMIN: ISSUE CERTIFICATE ---
export async function issueCertificate(data: {
    studentId: string;
    courseId: string;
    grade: string;
    percentage: number;
    courseDuration: string;
    templateId?: string;
    remarks?: string;
}) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (session?.user?.role !== "ADMIN") return { success: false, error: "Unauthorized" };

        // Duplicate Check
        const existing = await Certificate.findOne({
            studentId: data.studentId,
            courseId: data.courseId,
            status: CertificateStatus.ISSUED
        });

        if (existing) {
            return { success: false, error: "This student already has an active certificate for this course." };
        }

        // Generate Certificate Number
        const certNumber = await generateCertificateNumber(data.courseId);

        const cert = await Certificate.create({
            ...data,
            certificateNumber: certNumber,
            issuedDate: new Date(),
            status: CertificateStatus.ISSUED,
            metadata: {
                adminId: session.user.id,
                remarks: data.remarks,
                templateId: data.templateId
            }
        });

        revalidatePath("/admin/certificates");
        return { success: true, certificate: JSON.parse(JSON.stringify(cert)) };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// ALIAS
export const generateCertificate = issueCertificate;

// --- ADMIN: REVOKE CERTIFICATE ---
export async function revokeCertificate(certId: string) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (session?.user?.role !== "ADMIN") return { success: false, error: "Unauthorized" };

        const cert = await Certificate.findById(certId);
        if (!cert) return { success: false, error: "Not found" };

        cert.status = CertificateStatus.REVOKED;
        await cert.save();

        revalidatePath("/admin/certificates");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// --- ADMIN: GET STUDENT LIST ---
export async function getStudentList() {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (session?.user?.role !== "ADMIN") return { success: false, error: "Unauthorized" };

        const students = await User.find({ role: UserRole.STUDENT }).select("name email").sort({ name: 1 }).lean();
        return { success: true, students: JSON.parse(JSON.stringify(students)) };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

// --- ADMIN: GET FORM DATA ---
export async function getFormData() {
    try {
        await connectDB();
        const students = await User.find({ role: UserRole.STUDENT }).select("name email");
        const courses = await Course.find({ isPublished: true }).select("title");
        const templates = await CertificateTemplate.find().select("name");

        return {
            success: true,
            students: JSON.parse(JSON.stringify(students)),
            courses: JSON.parse(JSON.stringify(courses)),
            templates: JSON.parse(JSON.stringify(templates))
        };
    } catch (error) {
        return { success: false, error: "Failed to load form data" };
    }
}
