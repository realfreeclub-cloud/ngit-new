
"use client";

import { useState, useEffect } from "react";
import { listTemplates, createTemplate, deleteTemplate } from "@/app/actions/certificateTemplate";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Edit, Trash, FileText } from "lucide-react";
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
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="w-5 h-5 text-primary" />
                                {template.name}
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
                        <CardFooter className="flex justify-between border-t pt-4">
                            <Link href={`/admin/certificates/templates/${template._id}/edit`}>
                                <Button variant="outline" size="sm">
                                    <Edit className="w-4 h-4 mr-2" /> Edit Design
                                </Button>
                            </Link>
                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(template._id)}>
                                <Trash className="w-4 h-4" />
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
