
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Save, Lock, User, Bell } from "lucide-react";

export default function AdminSettingsPage() {
    const [loading, setLoading] = useState(false);

    const handleSave = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            toast.success("Settings saved successfully");
        }, 1000);
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto p-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                <p className="text-muted-foreground mt-1">Manage your account and application preferences</p>
            </div>

            <div className="space-y-6">
                {/* Profile Section */}
                <div className="bg-white border rounded-xl p-6 shadow-sm">
                    <h2 className="text-lg font-semibold mb-4">Profile Information</h2>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">First Name</label>
                                <Input defaultValue="Admin" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Last Name</label>
                                <Input defaultValue="User" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email Address</label>
                            <Input defaultValue="admin@ngit.com" disabled className="bg-slate-50" />
                        </div>
                        <div className="pt-4">
                            <Button onClick={handleSave} disabled={loading}>
                                {loading ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Change Password Section */}
                <div className="bg-white border rounded-xl p-6 shadow-sm">
                    <h2 className="text-lg font-semibold mb-4">Change Password</h2>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Current Password</label>
                            <Input type="password" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">New Password</label>
                            <Input type="password" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Confirm New Password</label>
                            <Input type="password" />
                        </div>
                        <div className="pt-4">
                            <Button variant="outline">Update Password</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
