"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Send, Zap, Clock, Globe } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function ContactSection() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        toast.success("Message sent successfully! We'll get back to you soon.");
        setFormData({ name: "", email: "", phone: "", message: "" });
        setIsSubmitting(false);
    };

    return (
        <section id="contact" className="py-24 bg-slate-50 relative overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -ml-1/3 -mt-1/3" />
            
            <div className="container px-6 mx-auto relative z-10">
                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-200 text-slate-600 font-black uppercase tracking-[0.2em] text-[10px] border border-slate-300">
                        Connect
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none">
                        Initiate Dialogue
                    </h2>
                    <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto">
                        Whether you're curious about curriculum architecture or operational protocols, our experts are ready to assist.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-16 items-start">
                    {/* Contact Intelligence Column */}
                    <div className="space-y-8">
                        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                            
                            <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">Access Points</h3>
                            
                            <div className="space-y-10">
                                <div className="flex items-start gap-6 group/item">
                                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover/item:bg-primary group-hover/item:text-white transition-all duration-300 shrink-0">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tele-Navigation</p>
                                        <a href="tel:+919876543210" className="text-lg font-black text-slate-900 hover:text-primary transition-colors">+91 98765 43210</a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-6 group/item">
                                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover/item:bg-secondary group-hover/item:text-white transition-all duration-300 shrink-0">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Digital Logistics</p>
                                        <a href="mailto:info@ngit.edu" className="text-lg font-black text-slate-900 hover:text-secondary transition-colors">info@ngit.edu</a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-6 group/item">
                                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover/item:bg-emerald-500 group-hover/item:text-white transition-all duration-300 shrink-0">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Spatial Identity</p>
                                        <p className="text-lg font-black text-slate-900 leading-tight">123, Tech Corridor, Delhi</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Operational Status */}
                        <div className="bg-slate-950 p-10 rounded-[3rem] text-white relative overflow-hidden group">
                            <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl -mb-20 -mr-20" />
                            <div className="flex items-center gap-3 mb-8">
                                <Clock className="w-6 h-6 text-primary" />
                                <h3 className="text-xl font-black tracking-tight uppercase">Operational Grid</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-3 border-b border-white/5">
                                    <span className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500">Cycle A</span>
                                    <span className="font-bold">Mon - Fri • 09:00 - 18:00</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-white/5">
                                    <span className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500">Cycle B</span>
                                    <span className="font-bold">Sat • 09:00 - 16:00</span>
                                </div>
                                <div className="flex justify-between items-center py-3">
                                    <span className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500">Downtime</span>
                                    <span className="font-bold text-slate-600">Sunday • Systems Offline</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Transmission Form Column */}
                    <div className="bg-white p-10 md:p-14 rounded-[4rem] border border-slate-100 shadow-2xl relative">
                        <div className="absolute -top-6 -right-6 w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl border-8 border-slate-50">
                            <Zap className="w-8 h-8 text-primary animate-pulse" />
                        </div>
                        
                        <h3 className="text-3xl font-black text-slate-900 mb-10 tracking-tighter italic">Broadcasting System</h3>
                        
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4">Identifier</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full h-16 px-8 rounded-3xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 text-slate-900 font-bold transition-all placeholder:text-slate-300"
                                        placeholder="Full Name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4">Protocol (Email)</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full h-16 px-8 rounded-3xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 text-slate-900 font-bold transition-all placeholder:text-slate-300"
                                        placeholder="address@domain.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-4">Payload (Message)</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={4}
                                    className="w-full p-8 rounded-[2.5rem] bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 text-slate-900 font-bold transition-all placeholder:text-slate-300 resize-none"
                                    placeholder="Synthesize your message..."
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full h-20 rounded-[2.5rem] bg-slate-950 text-white hover:bg-slate-800 text-sm font-black uppercase tracking-[0.3em] shadow-2xl transition-all hover:scale-[1.02] active:scale-95 group"
                            >
                                {isSubmitting ? (
                                    "Synchronizing..."
                                ) : (
                                    <span className="flex items-center gap-3">
                                        Execute Transmission
                                        <Send className="w-5 h-5 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
                                    </span>
                                )}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
