"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
    createCmsContentBlock, 
    updateCmsContentBlock, deleteCmsContentBlock 
} from "@/app/actions/cms";
import { 
    Plus, LayoutTemplate, Eye, List, Sparkles, UserPlus, Download
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableBlockItem } from "./SortableBlockItem";

interface HeroBlockEditorProps {
    sectionId: string;
    sectionType: string;
    initialBlocks: any[];
}

export function HeroBlockEditor({ sectionId, sectionType, initialBlocks }: HeroBlockEditorProps) {
    const [blocks, setBlocks] = useState(initialBlocks);

    const handleCreateBlock = async () => {
        let title = "New Interaction Block";
        let subtitle = "";
        let description = "";

        if (sectionType === "TrustIndicators") {
            const nextIdx = blocks.length % 4;
            const defaults = [
                { title: "Years of Mastery", subtitle: "15+" },
                { title: "Students Architected", subtitle: "5000+" },
                { title: "Success Deployment", subtitle: "98%" },
                { title: "Elite Milestones", subtitle: "45+" }
            ];
            title = defaults[nextIdx].title;
            subtitle = defaults[nextIdx].subtitle;
        } else if (sectionType === "WhyChooseSection") {
            title = "Expert Mentorship";
            description = "Instructional excellence from certified industry veterans.";
        }

        const res = await createCmsContentBlock({
            section_id: sectionId,
            title,
            subtitle,
            description,
            sort_order: blocks.length,
            is_active: true
        });
        if (res.success) {
            toast.success("Block initialized");
            setBlocks([...blocks, res.block]);
        }
    };

    const handleUpdateBlockFields = (id: string, field: string, value: any) => {
        setBlocks(blocks.map(b => b._id === id ? { ...b, [field]: value } : b));
    };

    const handleSaveBlock = async (id: string, blockData: any) => {
        const res = await updateCmsContentBlock(id, blockData);
        if (res.success) toast.success("Configuration preserved");
        else toast.error("Sync failed");
    };

    const handleDeleteBlock = async (id: string) => {
        if (!confirm("Discard this block?")) return;
        const res = await deleteCmsContentBlock(id);
        if (res.success) {
            toast.success("Block discarded");
            setBlocks(blocks.filter(b => b._id !== id));
        }
    };

    // Reorder DnD logic
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = async (event: any) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = blocks.findIndex((b) => b._id === active.id);
            const newIndex = blocks.findIndex((b) => b._id === over.id);
            const newArray = arrayMove(blocks, oldIndex, newIndex);
            
            // Optimistic update
            setBlocks(newArray);

            // Persist to DB
            for (let i = 0; i < newArray.length; i++) {
                await updateCmsContentBlock(newArray[i]._id, { sort_order: i });
            }
            toast.success("Visual sequence updated");
        }
    };

    return (
        <div className="grid xl:grid-cols-12 gap-12">
            <div className="xl:col-span-8 space-y-8">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Content Architecture</h3>
                    <Button onClick={handleCreateBlock} className="bg-blue-600 hover:bg-blue-700 h-10 px-6 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20">
                        <Plus className="w-4 h-4 mr-2" /> Inject Block
                    </Button>
                </div>

                <DndContext 
                    sensors={sensors} 
                    collisionDetection={closestCenter} 
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext items={blocks.map(b => b._id)} strategy={verticalListSortingStrategy}>
                        <div className="pb-32">
                            {blocks.map((block, index) => (
                                <SortableBlockItem 
                                    key={block._id}
                                    block={block}
                                    index={index}
                                    sectionType={sectionType}
                                    onUpdate={handleUpdateBlockFields}
                                    onSave={handleSaveBlock}
                                    onDelete={handleDeleteBlock}
                                />
                            ))}
                            {blocks.length === 0 && (
                                <div className="py-24 text-center bg-white border-4 border-dashed border-slate-100 rounded-[3rem]">
                                    <LayoutTemplate className="w-16 h-16 text-slate-100 mx-auto mb-6" />
                                    <p className="text-slate-300 font-black uppercase tracking-widest text-sm">Void Matrix: Add Data to Begin</p>
                                </div>
                            )}
                        </div>
                    </SortableContext>
                </DndContext>
            </div>

            {/* Real-time Visual Integrity Monitor (Live Preview) */}
            <div className="xl:col-span-4 sticky top-10 space-y-8 hidden lg:block">
                <div className="bg-slate-900 rounded-[3rem] p-8 text-white shadow-2xl border border-slate-800">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Integrity Monitor / Live Preview</span>
                    </div>
                    
                    <div className="space-y-10">
                        <div className="relative aspect-video rounded-[2rem] overflow-hidden bg-slate-800 shadow-inner group p-4 border border-white/5">
                            {blocks.length > 0 ? (
                                <div className="relative w-full h-full">
                                    <Image src={blocks[0].image || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070"} alt="Preview" fill className="object-cover opacity-60 rounded-2xl" />
                                    <div className="absolute inset-0 flex flex-col justify-center p-6 space-y-3 pointer-events-none">
                                        {blocks[0].subtitle && (
                                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/5 w-fit">
                                                <Sparkles className="w-3 h-3 text-amber-400" />
                                                <span className="text-white font-black uppercase tracking-[0.2em] text-[7px]">
                                                    {blocks[0].subtitle}
                                                </span>
                                            </div>
                                        )}
                                        <h4 className="text-lg font-black tracking-tighter leading-none line-clamp-2">{blocks[0].title || "Preview Pending"}</h4>
                                        <p className="text-[10px] text-slate-400 font-medium line-clamp-2">{blocks[0].description}</p>
                                        
                                        <div className="flex gap-2 pt-2">
                                            {blocks[0].button_text && <div className="h-6 px-3 bg-white rounded-lg flex items-center justify-center text-[7px] font-black text-slate-900 uppercase tracking-widest">Primary</div>}
                                            {blocks[0].secondary_button_text && <div className="h-6 px-3 bg-white/10 border border-white/10 rounded-lg flex items-center justify-center text-[7px] font-black text-white uppercase tracking-widest">Secondary</div>}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Eye className="w-12 h-12 text-slate-700 animate-pulse" />
                                </div>
                            )}
                        </div>

                        <div className="space-y-6">
                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Configuration Synthesis</h4>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Active Blocks</p>
                                    <p className="text-2xl font-black">{blocks.filter(b => b.is_active !== false).length}</p>
                                </div>
                                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Scheduled Items</p>
                                    <p className="text-2xl font-black">{blocks.filter(b => b.start_date || b.end_date).length}</p>
                                </div>
                            </div>
                            <p className="text-[9px] text-slate-500 font-medium italic px-2">Changes are reflected instantly in this preview box. Changes persist to live layout on 'Sync/Save' command.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
