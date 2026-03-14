"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Send, Clock, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PublicContactPage() {
    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-24">
            <div className="container mx-auto px-4 lg:px-10">
                {/* Header Section */}
                <div className="text-center max-w-4xl mx-auto mb-16 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-blue-100 text-blue-700 font-bold uppercase tracking-widest text-sm shadow-sm"
                    >
                        <Globe className="w-5 h-5" /> Get in touch
                    </motion.div>
                    
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-6xl font-black text-slate-900 leading-tight"
                    >
                        Contact Admissions
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl md:text-2xl text-slate-600 leading-relaxed max-w-3xl mx-auto"
                    >
                        Have a question about our courses? Want to enroll? Feel free to reach out to us and our support team will get back to you immediately.
                    </motion.p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
                    {/* Contact Information Cards */}
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4 }}
                            className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 flex items-start gap-6 hover:shadow-xl transition-shadow"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                                <MapPin className="w-8 h-8 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">Visit Campus</h3>
                                <p className="text-slate-600 text-lg leading-relaxed">
                                    First Floor, Sainik Market<br />
                                    Rasulabad Ghat Road<br />
                                    Near Mahila Polytechnic<br />
                                    Teliarganj, Prayagraj<br />
                                    Uttar Pradesh – 211004
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                            className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 flex items-start gap-6 hover:shadow-xl transition-shadow"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0">
                                <Phone className="w-8 h-8 text-emerald-600" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">Call Us</h3>
                                <p className="text-slate-600 text-lg leading-relaxed mb-1">Support & Admissions:</p>
                                <a href="tel:+918840341525" className="text-xl font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
                                    +91 8840341525
                                </a>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                            className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 flex items-start gap-6 hover:shadow-xl transition-shadow"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center shrink-0">
                                <Mail className="w-8 h-8 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">Email Us</h3>
                                <p className="text-slate-600 text-lg leading-relaxed mb-1">General Inquiries:</p>
                                <a href="mailto:contact@ngit.org.in" className="text-xl font-bold text-purple-600 hover:text-purple-700 transition-colors">
                                    contact@ngit.org.in
                                </a>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.3 }}
                            className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 flex items-start gap-6 hover:shadow-xl transition-shadow"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center shrink-0">
                                <Clock className="w-8 h-8 text-orange-600" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">Office Hours</h3>
                                <p className="text-slate-600 text-lg leading-relaxed">
                                    Monday - Saturday<br />
                                    08:00 AM - 08:00 PM<br />
                                    (Closed on Sundays & Public Holidays)
                                </p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white p-10 lg:p-12 rounded-[3.5rem] shadow-2xl border border-slate-100 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-bl-full pointer-events-none -z-10" />
                        
                        <h2 className="text-3xl font-extrabold text-slate-900 mb-8 border-b border-slate-100 pb-4">
                            Send us a Message
                        </h2>

                        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                            <div>
                                <label className="block text-slate-700 font-bold mb-2">Full Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter your name"
                                    className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl px-6 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-700 font-bold mb-2">Email Address</label>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl px-6 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-700 font-bold mb-2">Phone Number</label>
                                <input
                                    type="tel"
                                    placeholder="Enter your mobile number"
                                    className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl px-6 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-700 font-bold mb-2">Your Message</label>
                                <textarea
                                    placeholder="How can we help you?"
                                    rows={5}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none resize-none"
                                ></textarea>
                            </div>
                            <Button className="w-full h-16 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-xl shadow-blue-500/20 hover:scale-[1.02] transition-transform">
                                Send Message <Send className="w-5 h-5 ml-2" />
                            </Button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
