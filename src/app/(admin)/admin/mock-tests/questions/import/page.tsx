"use client";

import { useState } from "react";
import { 
    ChevronLeft, 
    FileUp, 
    Download, 
    AlertCircle, 
    CheckCircle2, 
    Database,
    Table as TableIcon,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ExcelJS from "exceljs";
import { bulkInsertQuestions } from "@/app/actions/questions";
import { getAllCourses } from "@/app/actions/courses";
import { useEffect } from "react";

export default function ImportQuestionsPage() {
    const router = useRouter();
    const [courses, setCourses] = useState<any[]>([]);
    const [file, setFile] = useState<File | null>(null);
    const [previewData, setPreviewData] = useState<any[]>([]);
    const [importing, setImporting] = useState(false);
    const [selectedCourseId, setSelectedCourseId] = useState("");

    useEffect(() => {
        loadCourses();
    }, []);

    const loadCourses = async () => {
        const res = await getAllCourses(); // Fixed from getCourses to getAllCourses based on recent audit
        if (res.success) setCourses(res.courses);
    };

    const excelToJson = async (file: File) => {
        const workbook = new ExcelJS.Workbook();
        const buffer = await file.arrayBuffer();
        await workbook.xlsx.load(buffer);
        const worksheet = workbook.getWorksheet(1);
        if (!worksheet) return [];

        const data: any[] = [];
        const headers: string[] = [];
        
        // Get headers from first row
        const headerRow = worksheet.getRow(1);
        headerRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
            const val = cell.value;
            // Handle rich text or objects
            let headerValue = "";
            if (val && typeof val === 'object' && 'richText' in val) {
                headerValue = (val as any).richText.map((rt: any) => rt.text).join("");
            } else {
                headerValue = val ? val.toString().trim() : "";
            }
            headers[colNumber] = headerValue || `Column${colNumber}`;
        });

        // Get data rows
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return;
            const rowData: any = {};
            let hasData = false;
            row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                const header = headers[colNumber];
                if (header) {
                    let value = cell.value;
                    // Handle cases where value might be an object
                    if (value && typeof value === 'object') {
                        if ('result' in value) value = (value as any).result;
                        else if ('richText' in value) value = (value as any).richText.map((rt: any) => rt.text).join("");
                        else if ('text' in value) value = (value as any).text;
                    }
                    rowData[header] = value;
                    if (value !== null && value !== undefined && value !== '') hasData = true;
                }
            });
            if (hasData) data.push(rowData);
        });
        return data;
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;
        setFile(selectedFile);

        try {
            const data = await excelToJson(selectedFile);
            setPreviewData(data.slice(0, 5)); // Show first 5 for preview
        } catch (err: any) {
            toast.error("Failed to read file: " + err.message);
        }
    };

    const handleImport = async () => {
        if (!selectedCourseId) {
            toast.error("Please select a target course for these questions.");
            return;
        }
        if (!file) {
            toast.error("Please upload an Excel file.");
            return;
        }

        setImporting(true);
        try {
            const data = await excelToJson(file);

            // Map Excel columns to Question model
            const formattedQuestions = data.map(row => {
                // Basic validation & mapping
                const type = mapType(row.Type || row["Question Type"]);
                const examCode = row.ExamCode || row["Exam Code"];
                
                if (!examCode) {
                    throw new Error(`Row missing Exam Code. Problematic row Question: ${row.Question?.substring(0, 20)}...`);
                }

                return {
                    courseId: selectedCourseId,
                    examCode: examCode,
                    subject: row.Subject || "General",
                    topic: row.Topic || "Uncategorized",
                    type: type,
                    difficulty: (row.Difficulty || "MEDIUM").toUpperCase(),
                    content: { en: row.Question || row.Content },
                    marks: row.Marks || 4,
                    negativeMarks: row.NegativeMarks || 1,
                    explanation: { en: row.Explanation || "" },
                    options: [
                        { text: { en: row.OptionA || row["Option A"] }, isCorrect: checkCorrect(row, "A") },
                        { text: { en: row.OptionB || row["Option B"] }, isCorrect: checkCorrect(row, "B") },
                        { text: { en: row.OptionC || row["Option C"] }, isCorrect: checkCorrect(row, "C") },
                        { text: { en: row.OptionD || row["Option D"] }, isCorrect: checkCorrect(row, "D") },
                    ].filter(o => o.text.en),
                    numericAnswer: row.NumericAnswer || row.Answer,
                };
            });

            const res = await bulkInsertQuestions(formattedQuestions);
            if (res.success) {
                toast.success(`${res.count} questions imported successfully!`);
                router.push("/admin/mock-tests/questions");
            } else {
                toast.error(res.error);
            }
        } catch (err: any) {
            toast.error("Failed to parse Excel file: " + err.message);
        } finally {
            setImporting(false);
        }
    };

    const mapType = (typeStr: string) => {
        if (!typeStr) return "MCQ_SINGLE";
        const t = typeStr.toUpperCase().replace(/\s+/g, "_");
        if (t.includes("SINGLE")) return "MCQ_SINGLE";
        if (t.includes("MULTIPLE")) return "MCQ_MULTIPLE";
        if (t.includes("TRUE")) return "TRUE_FALSE";
        if (t.includes("NUMERIC")) return "NUMERIC";
        if (t.includes("MATCH")) return "MATCH_THE_FOLLOWING";
        if (t.includes("ASSERTION")) return "ASSERTION_REASON";
        return "MCQ_SINGLE";
    };

    const checkCorrect = (row: any, label: string) => {
        const correct = String(row.CorrectAnswer || row["Correct Answer"]).toUpperCase();
        return correct.includes(label);
    };

    const downloadSample = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Sample");

        worksheet.columns = [
            { header: "Question", key: "Question", width: 40 },
            { header: "Type", key: "Type", width: 15 },
            { header: "Option A", key: "OptionA", width: 20 },
            { header: "Option B", key: "OptionB", width: 20 },
            { header: "Option C", key: "OptionC", width: 20 },
            { header: "Option D", key: "OptionD", width: 20 },
            { header: "Correct Answer", key: "CorrectAnswer", width: 15 },
            { header: "Explanation", key: "Explanation", width: 40 },
            { header: "Marks", key: "Marks", width: 10 },
            { header: "Negative Marks", key: "NegativeMarks", width: 15 },
            { header: "Course", key: "Course", width: 15 },
            { header: "Exam Code", key: "ExamCode", width: 15 },
            { header: "Subject", key: "Subject", width: 15 },
            { header: "Topic", key: "Topic", width: 15 },
            { header: "Difficulty", key: "Difficulty", width: 12 },
        ];

        worksheet.addRow({
            Question: "What is the unit of Force?",
            Type: "MCQ_SINGLE",
            OptionA: "Newton",
            OptionB: "Joule",
            OptionC: "Watt",
            OptionD: "Pascal",
            CorrectAnswer: "A",
            Explanation: "Newton (N) is the SI unit of force.",
            Marks: 4,
            NegativeMarks: 1,
            Subject: "Physics",
            Topic: "Mechanics",
            Difficulty: "EASY"
        });

        // Style the header
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE0E0E0' }
        };

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const saveAs = (await import("file-saver")).default;
        saveAs(blob, "question_import_sample.xlsx");
    };

    return (
        <div className="max-w-4xl mx-auto py-16 px-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-12">
                <Link href="/admin/mock-tests/questions">
                    <Button variant="ghost" className="rounded-xl gap-2">
                        <ChevronLeft className="w-5 h-5" /> Back to Bank
                    </Button>
                </Link>
                <Button variant="outline" className="rounded-xl gap-2 font-bold" onClick={downloadSample}>
                    <Download className="w-5 h-5" /> Download Sample File
                </Button>
            </div>

            <div className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-xl space-y-10">
                <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                        <FileUp className="w-10 h-10 text-primary" />
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Bulk Import Questions</h1>
                    <p className="text-slate-500 font-medium max-w-sm mx-auto">
                        Upload your question bank via Excel to save hours of manual entry. Support for all MCQ types.
                    </p>
                </div>

                <div className="space-y-6 max-w-md mx-auto">
                    <div className="space-y-2">
                        <label className="text-sm font-black text-slate-400 uppercase tracking-widest pl-2">1. Target Course</label>
                        <select 
                            className="w-full h-14 rounded-2xl bg-slate-50 border-none px-6 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
                            value={selectedCourseId}
                            onChange={(e) => setSelectedCourseId(e.target.value)}
                        >
                            <option value="">Choose a Course</option>
                            {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-black text-slate-400 uppercase tracking-widest pl-2">2. Select File</label>
                        <div className="relative h-40 group cursor-pointer">
                            <input 
                                type="file" 
                                accept=".xlsx, .xls"
                                className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                                onChange={handleFileChange}
                            />
                            <div className={`w-full h-full border-4 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center transition-all ${
                                file ? "bg-emerald-50 border-emerald-200" : "bg-slate-50 border-slate-100 group-hover:border-primary/20 group-hover:bg-primary/5"
                            }`}>
                                {file ? (
                                    <>
                                        <CheckCircle2 className="w-10 h-10 text-emerald-500 mb-2" />
                                        <p className="font-bold text-emerald-700">{file.name}</p>
                                        <p className="text-[10px] uppercase font-black text-emerald-400 mt-1">Ready to import</p>
                                    </>
                                ) : (
                                    <>
                                        <TableIcon className="w-10 h-10 text-slate-300 mb-2 group-hover:text-primary/40 transition-colors" />
                                        <p className="font-bold text-slate-400 group-hover:text-primary transition-colors">Click or drag Excel here</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <Button 
                        className="w-full h-16 rounded-[1.5rem] font-black text-lg gap-3 mt-4 shadow-2xl shadow-primary/20"
                        disabled={!file || !selectedCourseId || importing}
                        onClick={handleImport}
                    >
                        {importing ? (
                            <>
                                <Loader2 className="w-6 h-6 animate-spin" /> Processsing Data...
                            </>
                        ) : (
                            <>
                                <Database className="w-6 h-6" /> Start Bulk Import
                            </>
                        )}
                    </Button>
                </div>

                {previewData.length > 0 && (
                    <div className="pt-10 border-t border-slate-50">
                        <p className="text-center text-[10px] font-black text-slate-300 uppercase tracking-widest mb-6 italic flex items-center justify-center gap-2">
                            <AlertCircle className="w-3 h-3" /> Previewing first few records
                        </p>
                        <div className="overflow-hidden rounded-2xl border border-slate-100">
                            <table className="w-full text-xs">
                                <thead className="bg-slate-50 text-slate-400 font-black uppercase">
                                    <tr>
                                        <th className="px-4 py-3 text-left">Type</th>
                                        <th className="px-4 py-3 text-left">Question Snippet</th>
                                        <th className="px-4 py-3 text-center">Correct</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {previewData.map((row, i) => (
                                        <tr key={i} className="border-t border-slate-50">
                                            <td className="px-4 py-3 font-bold text-primary">{row.Type || "MCQ"}</td>
                                            <td className="px-4 py-3 text-slate-600 font-medium truncate max-w-xs">{row.Question || row.Content}</td>
                                            <td className="px-4 py-3 text-center font-black text-emerald-500">{row.CorrectAnswer || "A"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
