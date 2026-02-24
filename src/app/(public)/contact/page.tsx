import { getCMSContent } from "@/services/CMSService";
import { Mail, Phone, MapPin, Send, Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default async function ContactPage() {
    const contactInfo = await getCMSContent("CONTACT_INFO") || {
        email: "contact@ngit.edu",
        phone: "+91 98765 43210",
        address: "Neil Gogte Institute of Technology, Kachavanisingaram, Hyderabad"
    };

    const socialLinks = await getCMSContent("SOCIAL_LINKS") || {
        facebook: "#",
        instagram: "#",
        youtube: "#",
        linkedin: "#"
    };

    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            {/* Header */}
            <div className="bg-slate-900 text-white py-20 px-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -mr-20 -mt-20" />
                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <h1 className="text-5xl font-black tracking-tight mb-4">Get in Touch</h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                        Have questions about admissions, campus life, or collaborations? reach out to our team.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contact Form */}
                    <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-slate-200">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Send us a Message</h2>
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Your Name</label>
                                    <Input placeholder="John Doe" className="h-12 border-slate-200 focus:border-primary font-medium" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Email Address</label>
                                    <Input placeholder="john@example.com" className="h-12 border-slate-200 focus:border-primary font-medium" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Subject</label>
                                <Input placeholder="Admissions Inquiry" className="h-12 border-slate-200 focus:border-primary font-medium" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Message</label>
                                <Textarea
                                    placeholder="How can we help you today?"
                                    className="min-h-[150px] resize-none border-slate-200 focus:border-primary text-base"
                                />
                            </div>

                            <Button size="lg" className="w-full md:w-auto px-10 rounded-xl font-bold gap-2 shadow-lg shadow-primary/20">
                                Send Message <Send className="w-4 h-4" />
                            </Button>
                        </form>
                    </div>

                    {/* Contact Details Sidebar */}
                    <div className="space-y-8">
                        {/* Info Card */}
                        <div className="bg-slate-900 text-white rounded-[2.5rem] p-10 relative overflow-hidden">
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -ml-10 -mb-10" />

                            <div className="space-y-8 relative z-10">
                                <div>
                                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                        <Mail className="w-5 h-5 text-primary" /> Email Us
                                    </h3>
                                    <p className="text-slate-300 font-medium">{contactInfo.email}</p>
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                        <Phone className="w-5 h-5 text-primary" /> Call Us
                                    </h3>
                                    <p className="text-slate-300 font-medium">{contactInfo.phone}</p>
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                        <MapPin className="w-5 h-5 text-primary" /> Visit Campus
                                    </h3>
                                    <p className="text-slate-300 font-medium leading-relaxed">
                                        {contactInfo.address}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-12 pt-8 border-t border-white/10">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Connect With Us</h4>
                                <div className="flex gap-4">
                                    {socialLinks.facebook && (
                                        <a href={socialLinks.facebook} target="_blank" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all text-slate-300">
                                            <Facebook className="w-5 h-5" />
                                        </a>
                                    )}
                                    {socialLinks.instagram && (
                                        <a href={socialLinks.instagram} target="_blank" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all text-slate-300">
                                            <Instagram className="w-5 h-5" />
                                        </a>
                                    )}
                                    {socialLinks.youtube && (
                                        <a href={socialLinks.youtube} target="_blank" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all text-slate-300">
                                            <Youtube className="w-5 h-5" />
                                        </a>
                                    )}
                                    {socialLinks.linkedin && (
                                        <a href={socialLinks.linkedin} target="_blank" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all text-slate-300">
                                            <Linkedin className="w-5 h-5" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Map or External Link */}
                        <div className="bg-primary/5 rounded-[2.5rem] p-8 border border-primary/10">
                            <h3 className="font-bold text-slate-900 mb-2">Need Directions?</h3>
                            <p className="text-sm text-slate-500 mb-6">Find us on Google Maps for the easiest route to our campus.</p>
                            <Button variant="outline" className="w-full rounded-xl font-bold bg-white hover:bg-slate-50">
                                Open Google Maps
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
