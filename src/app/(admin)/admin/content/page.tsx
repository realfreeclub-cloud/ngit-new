"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Save, RefreshCcw, LayoutTemplate, Share2, Phone, Plus, Trash2, ChevronDown, ChevronUp, User, Info, Trophy, BarChart, Bell } from "lucide-react";
import { updateCMSContent, getCMSContent } from "@/services/CMSService";

export default function AdminContentPage() {
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("HERO");

    // --- State Management ---
    const [heroSlides, setHeroSlides] = useState<any[]>([]);
    const [notifications, setNotifications] = useState<any[]>([]);

    const [aboutData, setAboutData] = useState({
        title: "Building Future Leaders Since 2009",
        subtitle: "About NGIT",
        description: "National Genius Institute of Technology (NGIT) has been at the forefront of competitive exam preparation...",
        highlights: [
            "Established in 2009 with a vision for excellence",
            "Expert faculty from IITs and premier institutions",
            "Proven track record of top ranks every year"
        ]
    });

    const [statsData, setStatsData] = useState([
        { label: "Years of Excellence", value: "15+" },
        { label: "Students Trained", value: "5000+" },
        { label: "Success Rate", value: "98%" },
        { label: "Top 100 Ranks", value: "45" }
    ]);

    const [socialData, setSocialData] = useState({
        facebook: "", instagram: "", youtube: "", linkedin: ""
    });

    const [contactData, setContactData] = useState({
        email: "", phone: "", address: ""
    });

    // --- Fetch Data ---
    useEffect(() => {
        async function load() {
            try {
                const [slider, about, stats, social, contact, notify] = await Promise.all([
                    getCMSContent("HOME_SLIDER"),
                    getCMSContent("HOME_ABOUT"),
                    getCMSContent("HOME_STATS"),
                    getCMSContent("SOCIAL_LINKS"),
                    getCMSContent("CONTACT_INFO"),
                    getCMSContent("HOME_NOTIFICATIONS")
                ]);

                if (slider && Array.isArray(slider)) setHeroSlides(slider);
                if (notify && Array.isArray(notify)) setNotifications(notify);
                if (about) setAboutData(prev => ({ ...prev, ...about }));
                if (stats && Array.isArray(stats)) setStatsData(stats);
                if (social) setSocialData(prev => ({ ...prev, ...social }));
                if (contact) setContactData(prev => ({ ...prev, ...contact }));
            } catch (err) {
                console.error(err);
                toast.error("Failed to load content");
            } finally {
                setInitialLoading(false);
            }
        }
        load();
    }, []);

    // --- Save Data ---
    const handleSave = async () => {
        setLoading(true);
        try {
            const results = await Promise.all([
                updateCMSContent("HOME_SLIDER", heroSlides),
                updateCMSContent("HOME_ABOUT", aboutData),
                updateCMSContent("HOME_STATS", statsData),
                updateCMSContent("SOCIAL_LINKS", socialData),
                updateCMSContent("CONTACT_INFO", contactData),
                updateCMSContent("HOME_NOTIFICATIONS", notifications)
            ]);

            if (results.every(r => r.success)) {
                toast.success("All content updated successfully!");
            } else {
                toast.error("Some sections failed to save.");
            }
        } catch (error) {
            toast.error("Error saving content.");
        } finally {
            setLoading(false);
        }
    };

    // --- Helpers ---
    const addSlide = () => {
        setHeroSlides([...heroSlides, {
            id: Date.now(), title: "New Slide", subtitle: "", description: "", image: "",
            cta1Text: "Learn More", cta1Link: "#", cta2Text: "Contact", cta2Link: "#"
        }]);
    };

    const updateSlide = (index: number, field: string, value: string) => {
        const newSlides = [...heroSlides];
        newSlides[index] = { ...newSlides[index], [field]: value };
        setHeroSlides(newSlides);
    };

    const removeSlide = (index: number) => {
        if (heroSlides.length <= 1) return toast.error("Keep at least one slide");
        const newSlides = [...heroSlides];
        newSlides.splice(index, 1);
        setHeroSlides(newSlides);
    };

    const addNotification = () => {
        setNotifications([...notifications, { id: Date.now(), text: "New Notification", link: "" }]);
    };

    const updateNotification = (index: number, field: string, value: string) => {
        const newNotifs = [...notifications];
        newNotifs[index] = { ...newNotifs[index], [field]: value };
        setNotifications(newNotifs);
    };

    const removeNotification = (index: number) => {
        const newNotifs = [...notifications];
        newNotifs.splice(index, 1);
        setNotifications(newNotifs);
    };

    const updateAboutHighlight = (index: number, value: string) => {
        const newHighlights = [...aboutData.highlights];
        newHighlights[index] = value;
        setAboutData({ ...aboutData, highlights: newHighlights });
    };

    const addHighlight = () => {
        setAboutData({ ...aboutData, highlights: [...aboutData.highlights, "New Highlight"] });
    };

    const removeHighlight = (index: number) => {
        const newHighlights = [...aboutData.highlights];
        newHighlights.splice(index, 1);
        setAboutData({ ...aboutData, highlights: newHighlights });
    };

    const updateStat = (index: number, field: string, value: string) => {
        const newStats = [...statsData];
        newStats[index] = { ...newStats[index], [field]: value };
        setStatsData(newStats);
    };

    if (initialLoading) return <div className="p-20 text-center"><RefreshCcw className="w-8 h-8 animate-spin mx-auto text-slate-400" /></div>;

    const tabs = [
        { id: "HERO", label: "Hero Slider", icon: LayoutTemplate },
        { id: "NOTIFICATIONS", label: "Notifications", icon: Bell },
        { id: "STATS", label: "Trust Stats", icon: BarChart },
        { id: "ABOUT", label: "About Section", icon: Info },
        { id: "SOCIAL", label: "Social", icon: Share2 },
        { id: "CONTACT", label: "Contact", icon: Phone },
    ];

    return (
        <div className="space-y-8 max-w-6xl mx-auto pb-20">
            {/* Header */}
            <div className="flex items-center justify-between sticky top-0 bg-slate-50/95 backdrop-blur z-20 py-4 border-b border-white/50">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900">CMS & Page Editor</h1>
                    <p className="text-slate-500 font-medium text-sm">Manage website content in real-time.</p>
                </div>
                <Button onClick={handleSave} disabled={loading} size="lg" className="rounded-xl shadow-lg shadow-primary/20 gap-2 font-bold">
                    {loading ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {loading ? "Saving..." : "Publish All Changes"}
                </Button>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === tab.id
                            ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                            : "bg-white text-slate-500 hover:bg-slate-100"
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-4 md:p-8 shadow-sm min-h-[500px]">

                {/* HERO TAB */}
                {activeTab === "HERO" && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Hero Slider Configuration</h2>
                            <Button onClick={addSlide} size="sm" variant="secondary" className="gap-2 font-bold rounded-lg">
                                <Plus className="w-4 h-4" /> Add Slide
                            </Button>
                        </div>
                        <div className="space-y-8">
                            {heroSlides.map((slide, index) => (
                                <div key={slide.id || index} className="relative bg-slate-50 rounded-2xl p-6 border border-slate-200">
                                    <div className="absolute top-4 right-4"><Button variant="destructive" size="icon" onClick={() => removeSlide(index)} className="h-8 w-8 rounded-full"><Trash2 className="w-4 h-4" /></Button></div>
                                    <span className="bg-slate-200 text-[10px] font-bold px-2 py-1 rounded uppercase mb-4 inline-block">Slide {index + 1}</span>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="col-span-2 md:col-span-1"><label className="text-xs font-bold text-slate-400">Title</label><Input value={slide.title} onChange={e => updateSlide(index, 'title', e.target.value)} className="font-bold bg-white" /></div>
                                        <div className="col-span-2 md:col-span-1"><label className="text-xs font-bold text-slate-400">Subtitle</label><Input value={slide.subtitle} onChange={e => updateSlide(index, 'subtitle', e.target.value)} className="bg-white" /></div>
                                        <div className="col-span-2"><label className="text-xs font-bold text-slate-400">Description</label><Textarea value={slide.description} onChange={e => updateSlide(index, 'description', e.target.value)} className="bg-white h-20" /></div>
                                        <div className="col-span-2"><label className="text-xs font-bold text-slate-400">Image URL</label><Input value={slide.image} onChange={e => updateSlide(index, 'image', e.target.value)} className="bg-white font-mono text-xs" /></div>
                                        <div className="col-span-1"><label className="text-xs font-bold text-slate-400">Btn 1 Text</label><Input value={slide.cta1Text} onChange={e => updateSlide(index, 'cta1Text', e.target.value)} className="bg-white" /></div>
                                        <div className="col-span-1"><label className="text-xs font-bold text-slate-400">Btn 1 Link</label><Input value={slide.cta1Link} onChange={e => updateSlide(index, 'cta1Link', e.target.value)} className="bg-white font-mono text-xs" /></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* NOTIFICATIONS TAB */}
                {activeTab === "NOTIFICATIONS" && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Homepage Notifications Scroller</h2>
                            <Button onClick={addNotification} size="sm" variant="secondary" className="gap-2 font-bold rounded-lg">
                                <Plus className="w-4 h-4" /> Add Notification
                            </Button>
                        </div>
                        <div className="space-y-4">
                            {notifications.length === 0 && (
                                <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                                    <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                    <p className="text-slate-500 font-medium">No notifications added yet. Click 'Add Notification' to start.</p>
                                </div>
                            )}
                            {notifications.map((notif, index) => (
                                <div key={notif.id || index} className="flex gap-4 items-end bg-slate-50 p-6 rounded-2xl border border-slate-200 relative group">
                                    <div className="flex-1 space-y-4">
                                        <div className="grid md:grid-cols-3 gap-4">
                                            <div className="md:col-span-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Notification Text</label>
                                                <Input
                                                    value={notif.text}
                                                    onChange={e => updateNotification(index, 'text', e.target.value)}
                                                    className="bg-white font-medium"
                                                    placeholder="Enter notification text..."
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Link (Optional)</label>
                                                <Input
                                                    value={notif.link}
                                                    onChange={e => updateNotification(index, 'link', e.target.value)}
                                                    className="bg-white font-mono text-xs"
                                                    placeholder="/courses or https://..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => removeNotification(index)}
                                        className="mb-0.5 rounded-xl opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* STATS TAB */}
                {activeTab === "STATS" && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold mb-6">Trust Indicators (Homepage Stats)</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {statsData.map((stat, index) => (
                                <div key={index} className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                                    <h3 className="text-sm font-bold text-slate-400 uppercase mb-4">Stat Block {index + 1}</h3>
                                    <div className="space-y-4">
                                        <div><label className="text-xs font-bold text-slate-400">Value (e.g. 500+)</label><Input value={stat.value} onChange={e => updateStat(index, 'value', e.target.value)} className="font-black text-xl bg-white" /></div>
                                        <div><label className="text-xs font-bold text-slate-400">Label (e.g. Students)</label><Input value={stat.label} onChange={e => updateStat(index, 'label', e.target.value)} className="bg-white" /></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ABOUT TAB */}
                {activeTab === "ABOUT" && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold mb-6">About Section Content</h2>
                        <div className="space-y-4 max-w-2xl">
                            <div><label className="text-xs font-bold text-slate-400">Section Title</label><Input value={aboutData.title} onChange={e => setAboutData({ ...aboutData, title: e.target.value })} className="font-bold text-lg" /></div>
                            <div><label className="text-xs font-bold text-slate-400">Small Tagline</label><Input value={aboutData.subtitle} onChange={e => setAboutData({ ...aboutData, subtitle: e.target.value })} /></div>
                            <div><label className="text-xs font-bold text-slate-400">Main Description</label><Textarea value={aboutData.description} onChange={e => setAboutData({ ...aboutData, description: e.target.value })} className="h-32" /></div>

                            <div className="pt-4">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase">Highlights Points</label>
                                    <Button size="sm" variant="ghost" onClick={addHighlight}><Plus className="w-4 h-4" /></Button>
                                </div>
                                {aboutData.highlights.map((h, i) => (
                                    <div key={i} className="flex gap-2 mb-2">
                                        <Input value={h} onChange={e => updateAboutHighlight(i, e.target.value)} />
                                        <Button variant="ghost" size="icon" onClick={() => removeHighlight(i)}><Trash2 className="w-4 h-4 text-red-400" /></Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* SOCIAL TAB */}
                {activeTab === "SOCIAL" && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold mb-6">Social Media Links</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div><label className="text-xs font-bold text-slate-400">Facebook</label><Input value={socialData.facebook} onChange={e => setSocialData({ ...socialData, facebook: e.target.value })} placeholder="https://" /></div>
                            <div><label className="text-xs font-bold text-slate-400">Instagram</label><Input value={socialData.instagram} onChange={e => setSocialData({ ...socialData, instagram: e.target.value })} placeholder="https://" /></div>
                            <div><label className="text-xs font-bold text-slate-400">YouTube</label><Input value={socialData.youtube} onChange={e => setSocialData({ ...socialData, youtube: e.target.value })} placeholder="https://" /></div>
                            <div><label className="text-xs font-bold text-slate-400">LinkedIn</label><Input value={socialData.linkedin} onChange={e => setSocialData({ ...socialData, linkedin: e.target.value })} placeholder="https://" /></div>
                        </div>
                    </div>
                )}

                {/* CONTACT TAB */}
                {activeTab === "CONTACT" && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold mb-6">Contact Information</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div><label className="text-xs font-bold text-slate-400">Email Address</label><Input value={contactData.email} onChange={e => setContactData({ ...contactData, email: e.target.value })} /></div>
                            <div><label className="text-xs font-bold text-slate-400">Phone</label><Input value={contactData.phone} onChange={e => setContactData({ ...contactData, phone: e.target.value })} /></div>
                            <div className="col-span-2"><label className="text-xs font-bold text-slate-400">Address</label><Textarea value={contactData.address} onChange={e => setContactData({ ...contactData, address: e.target.value })} /></div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
