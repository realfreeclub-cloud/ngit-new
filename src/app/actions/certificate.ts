
"use server";

import connectDB from "@/lib/db";
import Certificate, { CertificateStatus } from "@/models/Certificate";
import CertificateTemplate from "@/models/CertificateTemplate";
import { generateCertificateNumber } from "@/lib/certificate";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { renderToStream } from "@react-pdf/renderer";
import { CertificateTemplate as StaticTemplate } from "@/components/certificates/CertificateTemplate";
import { DynamicCertificateTemplate } from "@/components/certificates/DynamicCertificateTemplate";
import QRCode from "qrcode";
import React from "react";
import User, { UserRole } from "@/models/User";
import Course from "@/models/Course";
import Enrollment from "@/models/Enrollment";
import { revalidatePath } from "next/cache";

// --- ADMIN: GENERATE CERTIFICATE ---
export async function generateCertificate(data: {
    studentId: string;
    courseId: string;
    grade: string;
    percentage: number;
    duration: string;
    templateId?: string; // Optional: specify template
    wpm?: number;
    remarks?: string;
}) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);

        // Check if certificate already exists
        const existing = await Certificate.findOne({
            studentId: data.studentId,
            courseId: data.courseId,
            status: CertificateStatus.ISSUED,
        });

        if (existing) {
            // return { success: false, error: "Certificate already issued for this course." }; 
            // For testing, user might want to re-issue or override. Let's strict for now.
        }

        // Generate Certificate Number
        const certNumber = await generateCertificateNumber(data.courseId);

        // Create Metadata in DB
        const newCert = await Certificate.create({
            studentId: data.studentId,
            courseId: data.courseId,
            certificateNumber: certNumber,
            grade: data.grade,
            percentage: data.percentage,
            wpm: data.wpm,
            courseDuration: data.duration,
            issuedDate: new Date(),
            status: CertificateStatus.ISSUED,
            metadata: {
                adminId: session?.user?.id,
                remarks: data.remarks,
                templateId: data.templateId // Store which template was used
            }
        });

        revalidatePath("/admin/certificates");
        return { success: true, certificateId: newCert._id.toString() };

    } catch (error: any) {
        console.error("Generate Certificate Error:", error);
        return { success: false, error: error.message };
    }
}

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
            .populate("courseId", "title description");

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
            .populate("studentId", "name")
            .populate("courseId", "title");

        if (!cert) throw new Error("Certificate not found");

        // Generate QR Code Data URL
        const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/verify/${cert.certificateNumber}`;
        const qrCodeDataUrl = await QRCode.toDataURL(verifyUrl);

        // Prepare Date string
        const dateStr = new Date(cert.issuedDate).toLocaleDateString("en-GB", {
            day: 'numeric', month: 'long', year: 'numeric'
        });

        let pdfStream;

        // Check if dynamic template is associated
        if (cert.metadata && cert.metadata.templateId) {
            const template = await CertificateTemplate.findById(cert.metadata.templateId);

            if (template) {
                // Render Dynamic PDF
                pdfStream = await renderToStream(
                    React.createElement(DynamicCertificateTemplate, {
                        elements: template.elements,
                        backgroundImage: template.backgroundImage,
                        config: template.config, // Pass config for page size/orientation
                        placeholders: {
                            student_name: (cert.studentId as any).name,
                            course_name: (cert.courseId as any).title,
                            grade: cert.grade,
                            percentage: cert.percentage.toString(),
                            enrollment_number: (cert.studentId as any).email, // fallback
                            certificate_number: cert.certificateNumber,
                            issue_date: dateStr,
                            qr_code: qrCodeDataUrl, // will key match 'qr_code' logic in template
                            institute_name: "NGIT Institute"
                        }
                    }) as any
                );
            }
        }

        // Default Fallback
        if (!pdfStream) {
            pdfStream = await renderToStream(
                React.createElement(StaticTemplate, {
                    studentName: (cert.studentId as any).name,
                    courseName: (cert.courseId as any).title,
                    certificateId: cert.certificateNumber,
                    issueDate: dateStr,
                    grade: cert.grade,
                    percentage: cert.percentage.toString(),
                    qrCodeUrl: qrCodeDataUrl,
                    duration: cert.courseDuration,
                    wpm: cert.wpm?.toString()
                }) as any
            );
        }

        // Convert stream to buffer to base64
        const chunks: Buffer[] = [];
        for await (const chunk of pdfStream) {
            chunks.push(Buffer.from(chunk));
        }
        const pdfBuffer = Buffer.concat(chunks);
        const base64 = pdfBuffer.toString('base64');

        return { success: true, pdfBase64: base64, filename: `Certificate-${cert.certificateNumber}.pdf` };

    } catch (error: any) {
        console.error("PDF Gen Error:", error);
        return { success: false, error: "Failed to generate PDF" };
    }
}

// --- ADMIN: LIST ALL CERTIFICATES ---
export async function getAllCertificates() {
    try {
        await connectDB();
        const certs = await Certificate.find()
            .populate("studentId", "name email")
            .populate("courseId", "title")
            .sort({ createdAt: -1 });
        return { success: true, certificates: JSON.parse(JSON.stringify(certs)) };
    } catch (error) {
        return { success: false, error: "Failed to fetch certificates" };
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
