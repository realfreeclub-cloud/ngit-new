
"use client";

import { useState, useEffect } from "react";
import { listTemplates, createTemplate, deleteTemplate, setDefaultTemplate } from "@/app/actions/certificateTemplate";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash, FileText, CheckCircle2, Award } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function TemplatesPage() {
    const [templates, setTemplates] = useState<any[]>([]);
    const [newTemplateName, setNewTemplateName] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        loadTemplates();
    }, []);

    const loadTemplates = async () => {
        const res = await listTemplates();
        if (res.success) setTemplates(res.templates);
    };

    const handleCreate = async () => {
        if (!newTemplateName) return;
        setIsCreating(true);
        const res = await createTemplate({ name: newTemplateName });
        setIsCreating(false);

        if (res.success) {
            toast.success("Template created");
            setNewTemplateName("");
            setIsDialogOpen(false);
            loadTemplates();
        } else {
            console.error(res.error);
            toast.error(res.error || "Failed to create template");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this template?")) return;
        const res = await deleteTemplate(id);
        if (res.success) {
            toast.success("Template deleted");
            loadTemplates();
        } else {
            toast.error("Failed to delete");
        }
    };

    const handleSetDefault = async (id: string) => {
        const res = await setDefaultTemplate(id);
        if (res.success) {
            toast.success("Default template updated");
            loadTemplates();
        } else {
            toast.error("Failed to set default");
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Certificate Templates</h1>
                    <p className="text-muted-foreground mt-1">Design and manage certificate layouts</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" /> Create Template
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>New Template</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <label className="text-sm font-medium">Template Name</label>
                            <Input
                                value={newTemplateName}
                                onChange={(e) => setNewTemplateName(e.target.value)}
                                placeholder="e.g. Standard Course Certificate"
                            />
                            <Button onClick={handleCreate} disabled={isCreating} className="w-full">
                                {isCreating ? "Creating..." : "Create Template"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template) => (
                    <Card key={template._id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-primary" />
                                    {template.name}
                                </div>
                                {template.isDefault && (
                                    <div className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full text-[10px] uppercase tracking-widest font-black border border-emerald-100 shadow-sm animate-in zoom-in-95 duration-500">
                                        <CheckCircle2 className="w-3 h-3" /> Default
                                    </div>
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 text-sm">
                                {template.backgroundImage ? (
                                    <img src={template.backgroundImage} className="w-full h-full object-cover rounded-lg opacity-50 grayscale" alt="preview" />
                                ) : (
                                    "No Preview"
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-4">
                                Elements: {template.elements?.length || 0}
                            </p>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-3 border-t pt-4">
                            <div className="flex justify-between w-full gap-2">
                                <Link href={`/admin/certificates/templates/${template._id}/edit`} className="flex-1">
                                    <Button variant="outline" size="sm" className="w-full h-10 rounded-xl font-bold border-2">
                                        <Edit className="w-4 h-4 mr-2" /> Design
                                    </Button>
                                </Link>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-10 w-10 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl"
                                    onClick={() => handleDelete(template._id)}
                                >
                                    <Trash className="w-4 h-4" />
                                </Button>
                            </div>
                            
                            {!template.isDefault && (
                                <Button 
                                    className="w-full h-10 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/10" 
                                    size="sm"
                                    onClick={() => handleSetDefault(template._id)}
                                >
                                    <Award className="w-4 h-4 mr-2" /> Set as Default Template
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
