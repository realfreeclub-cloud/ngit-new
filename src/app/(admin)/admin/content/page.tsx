"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { getCmsPages, createCmsPage, deleteCmsPage, getCmsSections, createCmsSection, updateCmsSection, deleteCmsSection, getCmsContentBlocks, createCmsContentBlock, updateCmsContentBlock, deleteCmsContentBlock } from "@/app/actions/cms";
import { ArrowUp, ArrowDown, ExternalLink, Plus, Trash2, Save, Menu, ChevronRight, LayoutTemplate, List } from "lucide-react";
import Link from "next/link";

export default function AdvancedCmsPage() {
    const [pages, setPages] = useState<any[]>([]);
    const [activePageId, setActivePageId] = useState<string | null>(null);
    const [sections, setSections] = useState<any[]>([]);
    const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
    const [blocks, setBlocks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const sectionTypes = ["HeroSection", "CourseGrid", "FacultyGrid", "GalleryGrid", "TestimonialSlider", "CTASection", "AboutSection", "WhyChooseSection", "ContactSection", "AchievementsSection", "CoursesSection", "FacultySection", "EventsSection", "InfrastructureSection", "PublicResultsGrid", "NotificationScroller", "TrustIndicators"];

    const DATA_DRIVEN_SECTIONS: Record<string, { label: string, link: string }> = {
        "CoursesSection": { label: "Courses", link: "/admin/courses" },
        "CourseGrid": { label: "Courses", link: "/admin/courses" },
        "FacultySection": { label: "Faculty", link: "/admin/faculty" },
        "FacultyGrid": { label: "Faculty", link: "/admin/faculty" },
        "EventsSection": { label: "Events", link: "/admin/events" },
        "PublicResultsGrid": { label: "Exam Results", link: "/admin/quizzes" }
    };

    const HIDDEN_PAGES = ["courses", "faculty"];
    const visiblePages = pages.filter(p => !HIDDEN_PAGES.includes(p.page_name));

    useEffect(() => {
        loadPages();
    }, []);

    const loadPages = async () => {
        setLoading(true);
        const res = await getCmsPages();
        if (res.success && res.pages.length > 0) {
            setPages(res.pages);
            const initialVisible = res.pages.filter((p: any) => !HIDDEN_PAGES.includes(p.page_name));
            if (initialVisible.length > 0) {
                setActivePageId(initialVisible[0]._id);
                loadSections(initialVisible[0]._id);
            }
        } else {
            // Seed default pages if none exist
            const defaults = ["home", "about", "courses", "faculty", "gallery", "results", "contact"];
            for (let p of defaults) {
                await createCmsPage({ page_name: p, title: p.charAt(0).toUpperCase() + p.slice(1) });
            }
            const res2 = await getCmsPages();
            if (res2.success && res2.pages.length > 0) {
                setPages(res2.pages);
                const secondVisible = res2.pages.filter((p: any) => !HIDDEN_PAGES.includes(p.page_name));
                if (secondVisible.length > 0) {
                    setActivePageId(secondVisible[0]._id);
                    loadSections(secondVisible[0]._id);
                }
            }
        }
        setLoading(false);
    };

    const loadSections = async (pageId: string) => {
        setLoading(true);
        const res = await getCmsSections(pageId);
        if (res.success) {
            setSections(res.sections);
            if (res.sections.length > 0) {
                setActiveSectionId(res.sections[0]._id);
                loadBlocks(res.sections[0]._id);
            } else {
                setBlocks([]);
                setActiveSectionId(null);
            }
        }
        setLoading(false);
    };

    const loadBlocks = async (sectionId: string) => {
        setLoading(true);
        const res = await getCmsContentBlocks(sectionId);
        if (res.success) {
            setBlocks(res.blocks);
        }
        setLoading(false);
    };

    const handleCreateSection = async () => {
        if (!activePageId) return toast.error("Select a page first");
        const name = prompt("Enter section name (e.g., Hero Header):");
        if (!name) return;
        
        const typeStr = sectionTypes.join(", ");
        const type = prompt(`Enter section type (${typeStr}):`, "HeroSection");
        if (!type || !sectionTypes.includes(type)) return toast.error("Invalid section type");

        const res = await createCmsSection({
            page_id: activePageId,
            section_name: name,
            section_type: type,
            sort_order: sections.length,
            is_active: true
        });

        if (res.success) {
            toast.success("Section created");
            loadSections(activePageId);
        }
    };

    const handleUpdateSection = async (id: string, updates: any) => {
        const res = await updateCmsSection(id, updates);
        if (res.success) {
            toast.success("Section updated");
            setSections(sections.map(s => s._id === id ? res.section : s));
        }
    };

    const handleDeleteSection = async (id: string) => {
        if (!confirm("Are you sure? This will delete all blocks inside.")) return;
        const res = await deleteCmsSection(id);
        if (res.success) {
            toast.success("Section removed");
            loadSections(activePageId!);
        }
    };

    const handleCreatePage = async () => {
        const name = prompt("Enter page name/slug (e.g., services):");
        if (!name) return;
        const title = prompt("Enter page display title:", name.charAt(0).toUpperCase() + name.slice(1));
        if (!title) return;

        const res = await createCmsPage({ page_name: name.toLowerCase(), title });
        if (res.success) {
            toast.success("Page created");
            const resPages = await getCmsPages();
            if (resPages.success) setPages(resPages.pages);
        }
    };

    const handleDeletePage = async (id: string) => {
        if (!confirm("Are you sure? This will delete the entire page and all its content!")) return;
        const res = await deleteCmsPage(id);
        if (res.success) {
            toast.success("Page deleted");
            loadPages();
        }
    };

    const handleMoveSection = async (id: string, direction: "up" | "down") => {
        const index = sections.findIndex(s => s._id === id);
        if (direction === "up" && index === 0) return;
        if (direction === "down" && index === sections.length - 1) return;

        const newIndex = direction === "up" ? index - 1 : index + 1;
        const currentSection = sections[index];
        const swapSection = sections[newIndex];

        await updateCmsSection(currentSection._id, { sort_order: swapSection.sort_order });
        await updateCmsSection(swapSection._id, { sort_order: currentSection.sort_order });
        
        loadSections(activePageId!);
    };

    const handleCreateBlock = async () => {
        if (!activeSectionId) return toast.error("Select a section first");
        const res = await createCmsContentBlock({
            section_id: activeSectionId,
            title: "New Block",
            sort_order: blocks.length
        });
        if (res.success) {
            toast.success("Block created");
            loadBlocks(activeSectionId);
        }
    };

    const handleUpdateBlockFields = (id: string, field: string, value: string) => {
        setBlocks(blocks.map(b => b._id === id ? { ...b, [field]: value } : b));
    };

    const handleSaveBlock = async (id: string, blockData: any) => {
        const res = await updateCmsContentBlock(id, blockData);
        if (res.success) {
            toast.success("Block saved");
        } else {
            toast.error("Error saving block");
        }
    };

    const handleDeleteBlock = async (id: string) => {
        if (!confirm("Remove this block?")) return;
        const res = await deleteCmsContentBlock(id);
        if (res.success) {
            toast.success("Block removed");
            loadBlocks(activeSectionId!);
        }
    };

    const handleMoveBlock = async (id: string, direction: "up" | "down") => {
        const index = blocks.findIndex(b => b._id === id);
        if (direction === "up" && index === 0) return;
        if (direction === "down" && index === blocks.length - 1) return;

        const newIndex = direction === "up" ? index - 1 : index + 1;
        const current = blocks[index];
        const swap = blocks[newIndex];

        await updateCmsContentBlock(current._id, { sort_order: swap.sort_order });
        await updateCmsContentBlock(swap._id, { sort_order: current.sort_order });
        
        loadBlocks(activeSectionId!);
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-20">
            <div className="flex items-center justify-between sticky top-0 bg-slate-50/95 backdrop-blur z-20 py-4 border-b border-white/50">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900">Dynamic CMS Builder</h1>
                    <p className="text-slate-500 font-medium text-sm">Design pages. Add sections. Insert content dynamically.</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-4 gap-8 items-start">
                
                {/* Sidebar Navigation */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between mb-4 px-2">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Pages</h3>
                            <Button size="icon" variant="ghost" onClick={handleCreatePage} className="h-8 w-8 hover:bg-blue-50"><Plus className="w-4 h-4 text-blue-600" /></Button>
                        </div>
                        <div className="space-y-1">
                            {visiblePages.map(page => (
                                <div key={page._id} className="group relative">
                                    <button 
                                        onClick={() => {
                                            setActivePageId(page._id);
                                            loadSections(page._id);
                                        }}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activePageId === page._id ? "bg-slate-900 text-white shadow-lg" : "text-slate-600 hover:bg-slate-50"}`}
                                    >
                                        <Menu className="w-4 h-4 opacity-40" />
                                        <span className="capitalize flex-1 text-left">{page.page_name}</span>
                                        {activePageId === page._id && <ChevronRight className="w-4 h-4 text-blue-400" />}
                                    </button>
                                    {activePageId === page._id && !["home", "about", "contact"].includes(page.page_name) && (
                                        <button onClick={() => handleDeletePage(page._id)} className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-opacity">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between mb-4 px-2">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Sections</h3>
                            <Button size="icon" variant="ghost" onClick={handleCreateSection} className="h-8 w-8 hover:bg-blue-50"><Plus className="w-4 h-4 text-blue-600" /></Button>
                        </div>
                        <div className="space-y-3">
                            {sections.map((section, idx) => (
                                <div key={section._id} className="flex flex-col group/item">
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => {
                                                setActiveSectionId(section._id);
                                                loadBlocks(section._id);
                                            }}
                                            className={`flex-1 flex items-center justify-between px-4 py-3 rounded-2xl text-sm transition-all border ${activeSectionId === section._id ? "border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-500/20" : "border-slate-100 hover:border-slate-300"}`}
                                        >
                                            <div className="flex flex-col text-left">
                                                <span className="font-bold text-slate-900">{section.section_name}</span>
                                                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono">{section.section_type}</span>
                                            </div>
                                            {!section.is_active && <span className="text-[10px] bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded font-bold">HIDDEN</span>}
                                        </button>
                                        <div className="flex flex-col opacity-0 group-hover/item:opacity-100 transition-opacity">
                                            <button disabled={idx === 0} onClick={() => handleMoveSection(section._id, "up")} className="p-1 hover:text-blue-600 disabled:opacity-30"><ArrowUp className="w-3 h-3" /></button>
                                            <button disabled={idx === sections.length - 1} onClick={() => handleMoveSection(section._id, "down")} className="p-1 hover:text-blue-600 disabled:opacity-30"><ArrowDown className="w-3 h-3" /></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {sections.length === 0 && (
                                <div className="text-center py-8 border-2 border-dashed border-slate-100 rounded-2xl">
                                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">No Sections yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Content Area Editor */}
                <div className="lg:col-span-3 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden min-h-[600px] flex flex-col">
                    {activeSectionId && sections.find(s => s._id === activeSectionId) ? (
                        <>
                            <div className="bg-slate-900 text-white p-6 md:p-8 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-10">
                                <div>
                                    <span className="bg-blue-600 font-bold uppercase tracking-wider text-[10px] px-3 py-1 rounded-full mb-3 inline-block">Editing Section</span>
                                    <h2 className="text-2xl font-black">{sections.find(s => s._id === activeSectionId)?.section_name}</h2>
                                    <p className="text-sm font-medium text-slate-400 font-mono mt-1">Component: {sections.find(s => s._id === activeSectionId)?.section_type}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Button variant="secondary" onClick={() => handleUpdateSection(activeSectionId, { is_active: !sections.find(s => s._id === activeSectionId)?.is_active })}>
                                        {sections.find(s => s._id === activeSectionId)?.is_active ? "Disable" : "Enable"}
                                    </Button>
                                    <Button variant="destructive" onClick={() => handleDeleteSection(activeSectionId)}>
                                        <Trash2 className="w-4 h-4 mr-2" /> Delete Section
                                    </Button>
                                </div>
                            </div>

                            <div className="p-6 md:p-8 flex-1 bg-slate-50/50">
                                {DATA_DRIVEN_SECTIONS[sections.find(s => s._id === activeSectionId)?.section_type] ? (
                                    <div className="max-w-md mx-auto py-20 text-center space-y-6">
                                        <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                                            <ExternalLink className="w-10 h-10" />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-2xl font-black text-slate-900">Managed Automatically</h3>
                                            <p className="text-slate-500 font-medium">
                                                The content for this {DATA_DRIVEN_SECTIONS[sections.find(s => s._id === activeSectionId)?.section_type].label} section is pulled directly from your main database records.
                                            </p>
                                        </div>
                                        <Link href={DATA_DRIVEN_SECTIONS[sections.find(s => s._id === activeSectionId)?.section_type].link}>
                                            <Button className="w-full h-14 rounded-2xl font-black text-lg shadow-xl shadow-blue-500/20 bg-blue-600 hover:bg-blue-700 mt-4 group">
                                                Manage {DATA_DRIVEN_SECTIONS[sections.find(s => s._id === activeSectionId)?.section_type].label}
                                                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                        </Link>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex items-center justify-between mb-8">
                                            <h3 className="text-xl font-bold text-slate-900">Content Blocks</h3>
                                            <Button onClick={handleCreateBlock} className="font-bold shadow-lg shadow-blue-500/20 bg-blue-600 hover:bg-blue-700">
                                                <Plus className="w-4 h-4 mr-2" /> Add Content Block
                                            </Button>
                                        </div>

                                        <div className="space-y-6">
                                            {blocks.length === 0 && (
                                                <div className="text-center py-20 bg-white border border-dashed border-slate-300 rounded-3xl">
                                                    <List className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                                    <p className="text-slate-500 font-medium text-lg">Empty Section.</p>
                                                    <p className="text-slate-400">Add a content block to populate this component with data.</p>
                                                </div>
                                            )}

                                            {blocks.map((block, index) => (
                                                <div key={block._id} className="bg-white border text-sm border-slate-200 rounded-3xl p-6 relative group hover:shadow-lg transition-all">
                                                    <div className="absolute -top-3 -left-3 w-8 h-8 bg-slate-900 text-white flex items-center justify-center font-bold font-mono text-xs rounded-full shadow-lg border-4 border-white">
                                                        {index + 1}
                                                    </div>
                                                    <div className="absolute top-4 right-4 flex gap-2">
                                                        <div className="flex flex-col gap-1 mr-2 bg-slate-100 rounded-lg p-1">
                                                            <button disabled={index === 0} onClick={() => handleMoveBlock(block._id, "up")} className="p-1 hover:text-blue-600 disabled:opacity-20"><ArrowUp className="w-3.5 h-3.5" /></button>
                                                            <button disabled={index === blocks.length - 1} onClick={() => handleMoveBlock(block._id, "down")} className="p-1 hover:text-blue-600 disabled:opacity-20"><ArrowDown className="w-3.5 h-3.5" /></button>
                                                        </div>
                                                        <Button size="icon" variant="outline" className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200" onClick={() => handleSaveBlock(block._id, block)}>
                                                            <Save className="w-4 h-4" />
                                                        </Button>
                                                        <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => handleDeleteBlock(block._id)}>
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                    <div className="grid md:grid-cols-2 gap-5 mt-4">
                                                        <div>
                                                            <label className="text-xs font-bold text-slate-500 uppercase">Title / Name</label>
                                                            <Input className="mt-1 bg-slate-50" value={block.title || ""} onChange={(e) => handleUpdateBlockFields(block._id, "title", e.target.value)} />
                                                        </div>
                                                        <div>
                                                            <label className="text-xs font-bold text-slate-500 uppercase">Subtitle / Category</label>
                                                            <Input className="mt-1 bg-slate-50" value={block.subtitle || ""} onChange={(e) => handleUpdateBlockFields(block._id, "subtitle", e.target.value)} />
                                                        </div>
                                                        <div className="md:col-span-2">
                                                            <label className="text-xs font-bold text-slate-500 uppercase">Description / Details</label>
                                                            <Textarea className="mt-1 bg-slate-50 h-24" value={block.description || ""} onChange={(e) => handleUpdateBlockFields(block._id, "description", e.target.value)} />
                                                        </div>
                                                        <div>
                                                            <label className="text-xs font-bold text-slate-500 uppercase">Image/Media URL</label>
                                                            <Input className="mt-1 bg-slate-50 font-mono text-xs" value={block.image || ""} onChange={(e) => handleUpdateBlockFields(block._id, "image", e.target.value)} />
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <div>
                                                                <label className="text-xs font-bold text-slate-500 uppercase">Button Text</label>
                                                                <Input className="mt-1 bg-slate-50" value={block.button_text || ""} onChange={(e) => handleUpdateBlockFields(block._id, "button_text", e.target.value)} />
                                                            </div>
                                                            <div>
                                                                <label className="text-xs font-bold text-slate-500 uppercase">Button Link</label>
                                                                <Input className="mt-1 bg-slate-50 font-mono text-xs" value={block.button_link || ""} onChange={(e) => handleUpdateBlockFields(block._id, "button_link", e.target.value)} />
                                                            </div>
                                                        </div>
                                                        <div className="md:col-span-2">
                                                            <label className="text-xs font-bold text-slate-500 uppercase">Extra Details (JSON)</label>
                                                            <Input className="mt-1 bg-slate-50 font-mono text-xs" placeholder='e.g., {"color": "bg-blue-500", "icon": "GraduationCap"}' value={typeof block.extra_data === 'object' ? JSON.stringify(block.extra_data) : block.extra_data || ""} onChange={(e) => handleUpdateBlockFields(block._id, "extra_data", e.target.value)} onBlur={(e) => {
                                                                try {
                                                                    if (e.target.value) JSON.parse(e.target.value);
                                                                } catch (err) {
                                                                    toast.error("Invalid JSON format in extra details");
                                                                }
                                                            }} />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center p-12 text-center text-slate-400 max-w-sm mx-auto">
                            <div>
                                <LayoutTemplate className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                <h3 className="text-xl font-bold mb-2 text-slate-600">No Section Selected</h3>
                                <p>Select a section from the left sidebar or create a new one to manage its content blocks here.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
