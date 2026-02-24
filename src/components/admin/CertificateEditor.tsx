
"use client";

import React, { useState, useEffect } from "react";
import { getTemplate, updateTemplate } from "@/app/actions/certificateTemplate";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import dynamic from "next/dynamic";
import { useEditorState } from "./certificate-editor/useEditorState";
import EditorToolbar from "./certificate-editor/EditorToolbar";
import EditorSidebar from "./certificate-editor/EditorSidebar";
const EditorCanvas = dynamic(() => import("./certificate-editor/EditorCanvas"), { ssr: false });
import PropertiesPanel from "./certificate-editor/PropertiesPanel";

export default function CertificateEditor({ templateId }: { templateId: string }) {
    const [isLoading, setIsLoading] = useState(true);
    const [initialData, setInitialData] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [templateName, setTemplateName] = useState("");

    const editor = useEditorState(initialData || { name: "", elements: [] });

    // Re-initialize hook when data loads
    // Note: This pattern is slightly tricky with hooks. 
    // Ideally useEditorState should handle null initial data or we delay rendering.

    useEffect(() => {
        const load = async () => {
            const res = await getTemplate(templateId);
            if (res.success) {
                setInitialData(res.template);
                setTemplateName(res.template.name);

                // Manually set state because hook initialized with empty
                editor.setElements(res.template.elements || []);
                editor.setPageConfig({
                    format: res.template.config?.format || 'A4',
                    orientation: res.template.config?.orientation || 'landscape',
                    dpi: res.template.config?.dpi || 72,
                    width: res.template.width || 842,
                    height: res.template.height || 595
                });
                editor.setBackgroundImage(res.template.backgroundImage || "");
            } else {
                toast.error("Failed to load template");
            }
            setIsLoading(false);
        };
        load();
    }, [templateId]); // Empty mapping to avoid loop, strictly load once.

    const handleSave = async () => {
        setIsSaving(true);
        const res = await updateTemplate(templateId, {
            name: templateName,
            elements: editor.elements,
            backgroundImage: editor.backgroundImage,
            width: editor.pageConfig.width,
            height: editor.pageConfig.height,
            config: {
                format: editor.pageConfig.format,
                orientation: editor.pageConfig.orientation,
                dpi: editor.pageConfig.dpi,
                printMargin: 0
            }
        });

        setIsSaving(false);
        if (res.success) toast.success("Template saved!");
        else toast.error("Save failed");
    };

    if (isLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin mr-2" /> Loading Editor...</div>;

    const selectedElement = editor.elements.find(el => editor.selectedIds.includes(el.id)) || null;

    return (
        <div className="flex flex-col h-screen bg-slate-100 overflow-hidden">
            <EditorToolbar
                zoom={editor.zoom} setZoom={editor.setZoom}
                showGrid={editor.showGrid} setShowGrid={editor.setShowGrid}
                showRulers={editor.showRulers} setShowRulers={editor.setShowRulers}
                showMargins={editor.showMargins} setShowMargins={editor.setShowMargins}
                history={editor.history}
                onSave={handleSave}
                isSaving={isSaving}
                pageConfig={editor.pageConfig}
            />

            <div className="flex flex-1 overflow-hidden">
                <EditorSidebar
                    elements={editor.elements}
                    onAddElement={editor.addElement}
                    onSelect={(id) => editor.setSelectedIds([id])}
                    selectedIds={editor.selectedIds}
                    onUpdatePage={editor.updatePageConfig}
                    pageConfig={editor.pageConfig}
                    onMoveLayer={editor.moveLayer}
                    onDelete={editor.deleteSelected}
                    onUpdateElement={editor.updateElement}
                />

                <EditorCanvas
                    elements={editor.elements}
                    pageConfig={editor.pageConfig}
                    zoom={editor.zoom}
                    selectedIds={editor.selectedIds}
                    onSelect={(id, multi) => editor.setSelectedIds(multi ? [...editor.selectedIds, id] : (id ? [id] : []))}
                    onUpdate={editor.updateElement}
                    onCommit={editor.commitChange}
                    backgroundImage={editor.backgroundImage}
                    showGrid={editor.showGrid}
                    showMargins={editor.showMargins}
                />

                <PropertiesPanel
                    element={selectedElement}
                    onUpdate={editor.updateElement}
                    deleteElement={editor.deleteSelected}
                    backgroundImage={editor.backgroundImage}
                    setBackgroundImage={editor.setBackgroundImage}
                />
            </div>
        </div>
    );
}
