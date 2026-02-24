"use client";

import { useState } from "react";
import { User, Lock, Bell, Moon, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { signOut } from "next-auth/react";

export default function StudentSettingsPage() {
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);

    const handleSave = () => {
        toast.success("Settings updated successfully!");
    };

    return (
        <div className="max-w-4xl space-y-8 animate-in fade-in duration-500 pb-20">
            <div>
                <h1 className="text-3xl font-black text-slate-900">Account Settings</h1>
                <p className="text-slate-500 mt-2">Manage your preferences and security</p>
            </div>

            <div className="space-y-6">
                {/* Profile Section */}
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                            <User className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Personal Information</h2>
                            <p className="text-sm text-slate-500">Update your public profile</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                            <input
                                type="text"
                                defaultValue="Student Name"
                                className="w-full h-12 px-4 rounded-xl bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white transition-all outline-none font-medium text-slate-900"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                            <input
                                type="email"
                                defaultValue="student@ngitPlugin.com"
                                disabled
                                className="w-full h-12 px-4 rounded-xl bg-slate-100 border-2 border-transparent text-slate-400 font-medium cursor-not-allowed"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Phone Number</label>
                            <input
                                type="tel"
                                placeholder="+91 98765 43210"
                                className="w-full h-12 px-4 rounded-xl bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white transition-all outline-none font-medium text-slate-900"
                            />
                        </div>
                    </div>
                </div>

                {/* Notifications & Preferences */}
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500">
                            <Bell className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Preferences</h2>
                            <p className="text-sm text-slate-500">Customize your experience</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors">
                            <div className="flex items-center gap-4">
                                <Bell className="w-5 h-5 text-slate-400" />
                                <div>
                                    <p className="font-bold text-slate-900">Email Notifications</p>
                                    <p className="text-xs text-slate-500 font-medium">Receive updates about your course progress</p>
                                </div>
                            </div>
                            <Switch checked={notifications} onCheckedChange={setNotifications} />
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors">
                            <div className="flex items-center gap-4">
                                <Moon className="w-5 h-5 text-slate-400" />
                                <div>
                                    <p className="font-bold text-slate-900">Dark Mode</p>
                                    <p className="text-xs text-slate-500 font-medium">Switch between light and dark themes</p>
                                </div>
                            </div>
                            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                        </div>
                    </div>
                </div>

                {/* Security */}
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500">
                            <Lock className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Security</h2>
                            <p className="text-sm text-slate-500">Protect your account</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Button variant="outline" className="w-full h-12 justify-start px-6 rounded-xl font-bold text-slate-600 border-2 hover:bg-slate-50 hover:text-slate-900">
                            Change Password
                        </Button>
                        <Button
                            variant="destructive"
                            className="w-full h-12 justify-start px-6 rounded-xl font-bold bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border-transparent"
                            onClick={() => signOut()}
                        >
                            <LogOut className="w-5 h-5 mr-3" />
                            Sign Out
                        </Button>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <Button onClick={handleSave} className="h-14 px-8 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform">
                        Save Changes
                    </Button>
                </div>
            </div>
        </div>
    );
}
