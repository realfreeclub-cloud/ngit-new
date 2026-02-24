"use client";


import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { uploadImageAction, getGalleryImages, deleteImageAction } from "@/app/actions/upload";
import {
    Plus,
    Trash2,
    Image as ImageIcon,
    Upload,
    RefreshCcw,
    X,
    Copy
} from "lucide-react";

export default function AdminGalleryPage() {
    const [loading, setLoading] = useState(false);
    const [showUpload, setShowUpload] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("Campus");
    const [images, setImages] = useState<any[]>([]);

    useEffect(() => {
        getGalleryImages().then(res => {
            if (res.success && res.images) {
                setImages(res.images.map((img: any) => ({
                    id: img._id,
                    title: img.title || "Untitled",
                    category: img.category || "Others",
                    url: img.url
                })));
            }
        });
    }, []);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDelete = async (id: string) => {
        if (!confirm("Remove this image?")) return;
        const res = await deleteImageAction(id);
        if (res.success) {
            setImages(images.filter(img => img.id !== id));
            toast.success("Image removed from gallery");
        } else {
            toast.error("Failed to delete image.");
        }
    };

    const handleCopyUrl = (url: string) => {
        const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;
        navigator.clipboard.writeText(fullUrl);
        toast.success("Image URL copied to clipboard");
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            toast.error("Please select an image first");
            return;
        }
        if (!title) {
            toast.error("Please enter a title");
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("title", title);
        formData.append("category", category);

        const res = await uploadImageAction(formData);

        if (res.success && res.url) {
            setImages([{
                id: res.media._id,
                title: title,
                category: category,
                url: res.url
            }, ...images]);

            toast.success("Photo uploaded successfully!");
            setShowUpload(false);
            setSelectedFile(null);
            setPreviewUrl(null);
            setTitle("");
        } else {
            toast.error(res.error || "Upload failed");
        }

        setLoading(false);
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Gallery Management</h1>
                    <p className="text-muted-foreground mt-1">Manage the institute's visual identity and memory gallery.</p>
                </div>
                <Button onClick={() => setShowUpload(!showUpload)} className="gap-2 h-12 rounded-xl px-6">
                    <Upload className="w-5 h-5" />
                    {showUpload ? "Cancel Upload" : "Upload New Photo"}
                </Button>
            </div>

            {showUpload && (
                <div className="bg-white border rounded-[2rem] p-8 shadow-sm animate-in slide-in-from-top duration-300">
                    <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <Plus className="w-5 h-5 text-primary" /> Add New Memory
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Image Title</label>
                            <Input
                                placeholder="e.g. Science Lab 2025"
                                className="h-12"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Category</label>
                            <select
                                className="flex h-12 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus:ring-2 focus:ring-primary outline-none"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option>Campus</option>
                                <option>Events</option>
                                <option>Students</option>
                                <option>Faculty</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileSelect}
                            />

                            {previewUrl ? (
                                <div className="w-full h-64 rounded-2xl border-2 border-slate-200 relative overflow-hidden group">
                                    <img src={previewUrl} alt="Preview" className="w-full h-full object-contain bg-slate-50" />
                                    <button
                                        onClick={() => { setSelectedFile(null); setPreviewUrl(null); }}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full h-48 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors cursor-pointer hover:border-primary/50 hover:text-primary"
                                >
                                    <ImageIcon className="w-10 h-10 mb-2 opacity-50" />
                                    <p className="font-bold text-xs uppercase tracking-widest">Drop Image Here or Click to Browse</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="mt-8 flex gap-3">
                        <Button
                            onClick={handleUpload}
                            disabled={loading || !selectedFile}
                            className="px-10 h-12 rounded-xl"
                        >
                            {loading ? <RefreshCcw className="w-4 h-4 animate-spin mr-2" /> : null}
                            Start Upload
                        </Button>
                        <Button variant="ghost" onClick={() => setShowUpload(false)} className="h-12 rounded-xl">Discard</Button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {images.map((img) => (
                    <div key={img.id} className="bg-white border rounded-2xl overflow-hidden group shadow-sm">
                        <div className="aspect-square relative overflow-hidden">
                            <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <Button variant="secondary" size="icon" className="rounded-full h-12 w-12" onClick={() => handleCopyUrl(img.url)}>
                                    <Copy className="w-5 h-5" />
                                </Button>
                                <Button variant="destructive" size="icon" className="rounded-full h-12 w-12" onClick={() => handleDelete(img.id)}>
                                    <Trash2 className="w-5 h-5" />
                                </Button>
                            </div>
                            <div className="absolute top-3 left-3">
                                <span className="bg-white/90 backdrop-blur-sm text-[10px] font-black px-3 py-1 rounded-full uppercase text-slate-900 border border-white">
                                    {img.category}
                                </span>
                            </div>
                        </div>
                        <div className="p-4">
                            <h3 className="font-bold text-sm truncate">{img.title}</h3>
                        </div>
                    </div>
                ))}

                {images.length === 0 && !showUpload && (
                    <div className="col-span-full py-20 text-center border-2 border-dashed rounded-[2rem] text-slate-400 font-medium">
                        Your gallery is empty. Let's add some memories!
                    </div>
                )}
            </div>
        </div>
    );
}
