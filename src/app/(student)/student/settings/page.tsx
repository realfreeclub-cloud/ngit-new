"use client";

import { useEffect, useState } from "react";
import { User, Lock, Bell, Moon, LogOut, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { signOut, useSession } from "next-auth/react";
import { updateUserDetails } from "@/app/actions/user";

export default function StudentSettingsPage() {
    const { data: session, update } = useSession();
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState(session?.user?.name || "");
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        if (session?.user?.name) setName(session.user.name);
    }, [session]);

    const handleSave = async () => {
        if (!name) return toast.error("Name cannot be empty");
        setLoading(true);
        const res = await updateUserDetails({ name });
        if (res.success) {
            await update({ name });
            toast.success("Settings updated successfully!");
        } else {
            toast.error(res.error || "Failed to update settings");
        }
        setLoading(false);
    };

    return (
        <div className="max-w-4xl space-y-8 animate-in fade-in duration-500 pb-20">
            <div>
                <h1 className="text-3xl font-black text-slate-900">Account Settings</h1>
                <p className="text-slate-500 mt-2 font-medium">Manage your preferences and security</p>
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
                            <p className="text-sm text-slate-500 font-medium">Update your public profile details</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full h-12 px-4 rounded-xl bg-slate-50 border-2 border-transparent focus:border-primary/20 focus:bg-white transition-all outline-none font-bold text-slate-900"
                                placeholder="Enter your name"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                            <input
                                type="email"
                                defaultValue={session?.user?.email || ""}
                                disabled
                                className="w-full h-12 px-4 rounded-xl bg-slate-100 border-2 border-transparent text-slate-400 font-medium cursor-not-allowed"
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
                            <p className="text-sm text-slate-500 font-medium">Customize your learning experience</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                    <Bell className="w-5 h-5 text-slate-400" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">Email Notifications</p>
                                    <p className="text-xs text-slate-500 font-bold">Receive updates about your course progress</p>
                                </div>
                            </div>
                            <Switch checked={notifications} onCheckedChange={setNotifications} />
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                    <Moon className="w-5 h-5 text-slate-400" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">Dark Mode</p>
                                    <p className="text-xs text-slate-500 font-bold">Switch between light and dark themes</p>
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
                            <p className="text-sm text-slate-500 font-medium">Protect your account access</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Button variant="outline" className="w-full h-14 justify-start px-6 rounded-2xl font-bold text-slate-600 border-2 border-slate-100 hover:bg-slate-50 hover:text-slate-900 transition-all">
                            <Lock className="w-5 h-5 mr-3 opacity-50" />
                            Change Security Password
                        </Button>
                        <Button
                            variant="destructive"
                            className="w-full h-14 justify-start px-6 rounded-2xl font-bold bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 border-transparent transition-all"
                            onClick={() => signOut({ callbackUrl: '/login' })}
                        >
                            <LogOut className="w-5 h-5 mr-3" />
                            Sign Out of Account
                        </Button>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <Button 
                        onClick={handleSave} 
                        disabled={loading}
                        className="h-16 px-10 rounded-2xl font-black text-lg shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-all bg-primary hover:bg-primary/95"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
                        Save Account Changes
                    </Button>
                </div>
            </div>
        </div>
    );
}
