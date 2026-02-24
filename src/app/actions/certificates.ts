"use server";

import connectDB from "@/lib/db";
import Certificate, { CertificateStatus } from "@/models/Certificate";
import User from "@/models/User";
import Course from "@/models/Course";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Unique ID Generator
const generateCertNumber = () => {
    return `NGIT-CERT-${Math.random().toString(36).substr(2, 6).toUpperCase()}-${new Date().getFullYear()}`;
};

export async function getAdminCertificates() {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (session?.user?.role !== "ADMIN") return { success: false, error: "Unauthorized" };

        const certs = await Certificate.find()
            .populate("studentId", "name email")
            .populate("courseId", "title thumbnail")
            .sort({ createdAt: -1 })
            .lean();

        return { success: true, certificates: JSON.parse(JSON.stringify(certs)) };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function issueCertificate(data: {
    studentId: string;
    courseId: string;
    grade: string;
    percentage: number;
    courseDuration: string;
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

        const cert = await Certificate.create({
            ...data,
            certificateNumber: generateCertNumber(),
            issuedDate: new Date(),
            status: CertificateStatus.ISSUED,
            metadata: {
                adminId: session.user.id,
                remarks: data.remarks
            }
        });

        return { success: true, certificate: JSON.parse(JSON.stringify(cert)) };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function revokeCertificate(certId: string) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (session?.user?.role !== "ADMIN") return { success: false, error: "Unauthorized" };

        const cert = await Certificate.findById(certId);
        if (!cert) return { success: false, error: "Not found" };

        cert.status = CertificateStatus.REVOKED;
        await cert.save();

        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function verifyCertificate(certNumber: string) {
    try {
        await connectDB();
        const cert = await Certificate.findOne({ certificateNumber: certNumber })
            .populate("studentId", "name")
            .populate("courseId", "title thumbnail")
            .lean();

        if (!cert) return { success: false, error: "Certificate not found or invalid." };

        return {
            success: true,
            certificate: JSON.parse(JSON.stringify(cert))
        };
    } catch (error: any) {
        return { success: false, error: "Verification Failed" };
    }
}

export async function getStudentCertificates() {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (!session?.user) return { success: false, error: "Unauthorized" };

        const certs = await Certificate.find({ studentId: session.user.id, status: CertificateStatus.ISSUED })
            .populate("courseId", "title thumbnail")
            .sort({ createdAt: -1 })
            .lean();

        return { success: true, certificates: JSON.parse(JSON.stringify(certs)) };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getStudentList() {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        if (session?.user?.role !== "ADMIN") return { success: false, error: "Unauthorized" };

        const students = await User.find({ role: "STUDENT" }).select("name email").sort({ name: 1 }).lean();
        return { success: true, students: JSON.parse(JSON.stringify(students)) };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
