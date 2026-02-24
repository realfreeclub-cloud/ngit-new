"use client";

import { useState } from "react";
import { createCourse } from "@/services/CourseService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";
import Link from "next/link";

export default function NewCoursePage() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: 0,
        category: "Academic",
        type: "ONLINE" as "ONLINE" | "OFFLINE",
        thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80",
    });
    const [categories, setCategories] = useState(["Academic", "Competitive Exams", "Skill Development", "Management"]);
    const [newCategory, setNewCategory] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const res = await createCourse(formData);

        if (res.success && res.course?._id) {
            toast.success("Course created! Now add some lessons.");
            // Go straight to content manager to start adding lessons
            router.push(`/admin/courses/${res.course._id}`);
        } else {
            toast.error(res.error || "Failed to create course");
            setLoading(false);
        }
    };


    return (
        <div className="max-w-4xl space-y-8 pb-20">
            <div className="flex items-center gap-4">
                <Link href="/admin/courses">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Create New Course</h1>
                    <p className="text-muted-foreground mt-1">Fill in the details to launch a new academic program.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white border rounded-[2.5rem] p-10 shadow-sm space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Basic Info */}
                    <div className="space-y-6 md:col-span-2 border-b pb-8">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <div className="w-1.5 h-6 bg-primary rounded-full" />
                            Basic Information
                        </h2>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Course Title</label>
                                <Input
                                    placeholder="e.g. Advanced Physics for JEE"
                                    className="h-14 rounded-2xl px-6 bg-slate-50/50"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Detailed Description</label>
                                <Textarea
                                    placeholder="Tell students what they will learn..."
                                    className="min-h-[150px] rounded-2xl px-6 py-4 bg-slate-50/50"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Pricing & Category */}
                    <div className="space-y-6">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
                            Pricing & Metadata
                        </h2>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Price (₹)</label>
                                    <Input
                                        type="number"
                                        placeholder="0 for free"
                                        className="h-14 rounded-2xl px-6 bg-slate-50/50"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Course Type</label>
                                    <select
                                        className="flex h-14 w-full rounded-2xl border border-input bg-slate-50/50 px-6 py-2 text-sm shadow-sm focus:ring-2 focus:ring-primary outline-none"
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value as "ONLINE" | "OFFLINE" })}
                                    >
                                        <option value="ONLINE">Online (Digital LMS)</option>
                                        <option value="OFFLINE">Offline (Classroom)</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Course Category</label>
                                <div className="flex flex-col xl:flex-row gap-4">
                                    <select
                                        className="flex h-14 flex-1 rounded-2xl border border-input bg-slate-50/50 px-6 py-2 text-sm shadow-sm focus:ring-2 focus:ring-primary outline-none min-w-0"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                    <div className="flex gap-2 flex-1 min-w-0">
                                        <Input
                                            placeholder="New Category"
                                            className="h-14 flex-1 min-w-0 rounded-2xl px-4 bg-slate-50/50"
                                            value={newCategory}
                                            onChange={(e) => setNewCategory(e.target.value)}
                                        />
                                        <Button
                                            type="button"
                                            className="h-14 rounded-2xl px-6 shrink-0"
                                            onClick={() => {
                                                if (newCategory && !categories.includes(newCategory)) {
                                                    setCategories([...categories, newCategory]);
                                                    setFormData({ ...formData, category: newCategory });
                                                    setNewCategory("");
                                                }
                                            }}
                                        >
                                            Add
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Media */}
                    <div className="space-y-6">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                            Course Media
                        </h2>
                        <div className="space-y-4">
                            <div className="w-full aspect-video rounded-3xl bg-slate-100 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 text-slate-400">
                                <Upload className="w-8 h-8 mb-2" />
                                <p className="text-xs font-bold uppercase tracking-widest">Upload Thumbnail</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Thumbnail URL (Temporary)</label>
                                <Input
                                    placeholder="https://..."
                                    className="h-12 rounded-xl px-4 bg-slate-50/50"
                                    value={formData.thumbnail}
                                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-10 flex gap-4">
                    <Button
                        type="submit"
                        disabled={loading}
                        className="h-16 rounded-[2rem] px-12 text-lg font-bold shadow-xl shadow-primary/20"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Creating Program...
                            </>
                        ) : "Create Course & Continue"}
                    </Button>
                    <Link href="/admin/courses">
                        <Button variant="ghost" className="h-16 rounded-[2rem] px-8 text-lg font-medium">Cancel</Button>
                    </Link>
                </div>
            </form>
        </div>
    );
}
