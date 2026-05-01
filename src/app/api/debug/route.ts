
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
    const cwd = process.cwd();
    const uploadDir = path.join(cwd, "public/uploads/gallery");
    
    let dirExists = false;
    let files: string[] = [];
    let permissions = "";

    try {
        dirExists = fs.existsSync(uploadDir);
        if (dirExists) {
            files = fs.readdirSync(uploadDir);
            const stats = fs.statSync(uploadDir);
            permissions = stats.mode.toString(8);
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message, cwd, uploadDir });
    }

    return NextResponse.json({
        cwd,
        uploadDir,
        dirExists,
        files,
        permissions,
        env: process.env.NODE_ENV
    });
}
