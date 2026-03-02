"use client";

import { useState } from "react";
import { User, Shield, Bell, Key, Image as ImageIcon, Camera, Trash2, CheckCircle2, Briefcase, Award } from "lucide-react";
import ClickSpark from "@/components/reactbits/ClickSpark";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("profile");

    const tabs = [
        { id: "profile", label: "Profile", icon: User },
        { id: "roles", label: "Roles & Permissions", icon: Briefcase },
        { id: "appearance", label: "Appearance", icon: ImageIcon },
        { id: "notifications", label: "Notifications", icon: Bell },
        { id: "security", label: "Security", icon: Key },
    ];

    return (
        <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 w-full max-w-6xl mx-auto">

            {/* Left Sidebar (Sticky Menu) */}
            <div className="w-full lg:w-72 shrink-0 space-y-6">
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm sticky top-24">
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2">
                        <Shield className="h-5 w-5 text-indigo-500" />
                        Settings
                    </h2>

                    <div className="space-y-1">
                        {tabs.map(tab => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full py-2.5 px-3 rounded-xl text-sm font-semibold transition-all text-left flex items-center gap-3 ${activeTab === tab.id
                                        ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white"
                                        : "bg-transparent text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-300"
                                        }`}
                                >
                                    <Icon className={`h-4 w-4 ${activeTab === tab.id ? "text-indigo-600 dark:text-indigo-400" : "opacity-70"}`} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Main Content Pane */}
            <div className="flex-1 space-y-6">
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm relative overflow-hidden h-full flex flex-col">
                    {/* Decorative Blob */}
                    <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 dark:bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />

                    <div className="relative z-10 flex-1">

                        {/* PROFILE SETTINGS */}
                        {activeTab === "profile" && (
                            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div>
                                    <h1 className="text-3xl font-black text-zinc-900 dark:text-white mb-2">Public Profile</h1>
                                    <p className="text-zinc-500 dark:text-zinc-400 font-medium">This information will be displayed on the leaderboards.</p>
                                </div>

                                {/* Avatar Upload */}
                                <div className="flex items-center gap-6 pb-8 border-b border-zinc-200 dark:border-zinc-800/60">
                                    <div className="relative group">
                                        <div className="w-24 h-24 rounded-full bg-indigo-100 dark:bg-indigo-500/20 border-4 border-white dark:border-zinc-900 shadow-md flex items-center justify-center overflow-hidden">
                                            <User className="h-10 w-10 text-indigo-500 dark:text-indigo-400" />
                                        </div>
                                        <button className="absolute bottom-0 right-0 p-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full shadow-lg hover:scale-105 transition-transform">
                                            <Camera className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex gap-3">
                                            <button className="px-4 py-2 text-sm font-bold bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors">
                                                Change Avatar
                                            </button>
                                            <button className="px-4 py-2 text-sm font-bold text-red-600 bg-red-50 dark:bg-red-900/10 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2">
                                                <Trash2 className="h-4 w-4" /> Remove
                                            </button>
                                        </div>
                                        <p className="text-xs text-zinc-500 font-medium">JPG, GIF or PNG. 1MB max.</p>
                                    </div>
                                </div>

                                {/* Forms */}
                                <div className="space-y-6 max-w-2xl">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">First Name</label>
                                            <input type="text" defaultValue="Aman" className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all font-medium" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Last Name</label>
                                            <input type="text" defaultValue="Kumar" className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all font-medium" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Email Address</label>
                                        <input type="email" defaultValue="aman.kumar@example.com" disabled className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900/50 text-zinc-500 dark:text-zinc-400 cursor-not-allowed font-medium" />
                                        <p className="text-xs text-zinc-500">Email addresses cannot be changed once verified.</p>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Username</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <span className="text-zinc-400 font-bold">@</span>
                                            </div>
                                            <input type="text" defaultValue="aman_bca" className="w-full pl-9 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all font-medium" />
                                        </div>
                                        <p className="text-xs text-zinc-500">This is your unique identifier in the PU Digital Library community.</p>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Degree & Course</label>
                                        <select className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all font-medium appearance-none">
                                            <option>Bachelors of Computer Applications (BCA)</option>
                                            <option>Bachelors of Science in IT (B.Sc IT)</option>
                                            <option>Bachelors of Business Admin (BBA)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ROLES & PERMISSIONS */}
                        {activeTab === "roles" && (
                            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div>
                                    <h1 className="text-3xl font-black text-zinc-900 dark:text-white mb-2">Roles & Permissions</h1>
                                    <p className="text-zinc-500 dark:text-zinc-400 font-medium max-w-2xl">Apply for specialized roles within the PU Digital Library community to help maintain quality and curate content.</p>
                                </div>

                                <div className="space-y-6 max-w-3xl">
                                    {/* Content Reviewer Role */}
                                    <div className="relative group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm hover:border-indigo-500/30 dark:hover:border-indigo-500/30 transition-all duration-300">
                                        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
                                            <div className="flex items-start gap-5">
                                                <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 shrink-0">
                                                    <Award className="h-8 w-8" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Content Reviewer</h3>
                                                        <span className="px-2.5 py-1 text-xs font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-lg">Not Applied</span>
                                                    </div>
                                                    <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-md">
                                                        Reviewers are responsible for verifying newly uploaded PYQs for accuracy, readability, and correct categorization before they go public.
                                                    </p>
                                                </div>
                                            </div>

                                            <ClickSpark className="shrink-0 w-full sm:w-auto">
                                                <button className="w-full sm:w-auto px-6 py-3 font-bold text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all shadow-md shadow-indigo-600/20 active:scale-95">
                                                    Apply Now
                                                </button>
                                            </ClickSpark>
                                        </div>
                                    </div>

                                    {/* Community Moderator Role */}
                                    <div className="relative group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm hover:border-emerald-500/30 dark:hover:border-emerald-500/30 transition-all duration-300">
                                        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
                                            <div className="flex items-start gap-5">
                                                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 shrink-0">
                                                    <Shield className="h-8 w-8" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Community Moderator</h3>
                                                        <span className="px-2.5 py-1 text-xs font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-lg border border-amber-200 dark:border-amber-900/50">Under Review</span>
                                                    </div>
                                                    <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-md">
                                                        Moderators help manage community discussions, resolve disputes, and ensure the Notice Board and comments follow university guidelines.
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="shrink-0 w-full sm:w-auto">
                                                <button disabled className="w-full sm:w-auto px-6 py-3 font-bold text-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 rounded-xl transition-all cursor-not-allowed border border-zinc-200 dark:border-zinc-700">
                                                    Application Pending
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* APPEARANCE SETTINGS */}
                        {activeTab === "appearance" && (
                            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div>
                                    <h1 className="text-3xl font-black text-zinc-900 dark:text-white mb-2">Appearance</h1>
                                    <p className="text-zinc-500 dark:text-zinc-400 font-medium">Customize how the PU library looks on your device.</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Theme Preference</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl">
                                            {/* Light Mode Mock */}
                                            <div className="border-2 border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 bg-zinc-50 cursor-pointer hover:border-indigo-500 transition-colors group">
                                                <div className="w-full h-24 bg-white rounded border border-zinc-200 shadow-sm flex flex-col p-2 space-y-2 mb-3">
                                                    <div className="h-4 w-1/3 bg-zinc-200 rounded"></div>
                                                    <div className="h-full w-full bg-zinc-100 rounded"></div>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-bold text-zinc-900">Light</span>
                                                    <div className="w-4 h-4 rounded-full border border-zinc-300"></div>
                                                </div>
                                            </div>

                                            {/* Dark Mode Mock */}
                                            <div className="border-2 border-indigo-500 rounded-2xl p-4 bg-zinc-950 cursor-pointer shadow-sm relative overflow-hidden group">
                                                <div className="w-full h-24 bg-zinc-900 rounded border border-zinc-800 shadow-sm flex flex-col p-2 space-y-2 mb-3">
                                                    <div className="h-4 w-1/3 bg-zinc-800 rounded"></div>
                                                    <div className="h-full w-full bg-zinc-950 rounded border border-zinc-800/50"></div>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-bold text-zinc-100">Dark</span>
                                                    <div className="w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center">
                                                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* System Sync Mock */}
                                            <div className="border-2 border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 bg-zinc-50 dark:bg-zinc-900 cursor-pointer hover:border-indigo-500 transition-colors group">
                                                <div className="w-full h-24 rounded border border-zinc-200 dark:border-zinc-800 shadow-sm flex overflow-hidden mb-3">
                                                    <div className="w-1/2 h-full bg-white p-2">
                                                        <div className="h-4 w-2/3 bg-zinc-200 rounded mb-2"></div>
                                                    </div>
                                                    <div className="w-1/2 h-full bg-zinc-950 p-2 border-l border-zinc-800">
                                                        <div className="h-4 w-2/3 bg-zinc-800 rounded mb-2"></div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">System Sync</span>
                                                    <div className="w-4 h-4 rounded-full border border-zinc-300 dark:border-zinc-600"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* NOTIFICATIONS SETTINGS */}
                        {activeTab === "notifications" && (
                            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div>
                                    <h1 className="text-3xl font-black text-zinc-900 dark:text-white mb-2">Notifications</h1>
                                    <p className="text-zinc-500 dark:text-zinc-400 font-medium">Choose what you want to be notified about.</p>
                                </div>

                                <div className="space-y-6 max-w-2xl">
                                    <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
                                        <div>
                                            <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm mb-1">New PYQ Uploads</h4>
                                            <p className="text-xs text-zinc-500">Get notified when someone uploads a new past paper for your course.</p>
                                        </div>
                                        <div className="w-11 h-6 bg-indigo-500 rounded-full relative cursor-pointer shadow-inner">
                                            <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm transition-all text-indigo-500 flex items-center justify-center">
                                                <CheckCircle2 className="h-3 w-3" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
                                        <div>
                                            <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm mb-1">Community Announcements</h4>
                                            <p className="text-xs text-zinc-500">Receive updates about exams, events, and library maintenance.</p>
                                        </div>
                                        <div className="w-11 h-6 bg-indigo-500 rounded-full relative cursor-pointer shadow-inner">
                                            <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm transition-all text-indigo-500 flex items-center justify-center">
                                                <CheckCircle2 className="h-3 w-3" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl opacity-60">
                                        <div>
                                            <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm mb-1">Marketing Emails</h4>
                                            <p className="text-xs text-zinc-500">Occasional promotional emails and offers.</p>
                                        </div>
                                        <div className="w-11 h-6 bg-zinc-300 dark:bg-zinc-800 rounded-full relative cursor-pointer shadow-inner border border-zinc-400/20">
                                            <div className="w-5 h-5 bg-white dark:bg-zinc-500 rounded-full absolute left-0.5 top-0.5 shadow-sm transition-all"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Save Actions */}
                        <div className="mt-12 pt-6 border-t border-zinc-200 dark:border-zinc-800/60 flex items-center gap-4 justify-end">
                            <button className="px-5 py-2.5 text-sm font-bold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors">
                                Cancel
                            </button>
                            <ClickSpark>
                                <button className="px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-md shadow-indigo-600/20 active:scale-95">
                                    Save Changes
                                </button>
                            </ClickSpark>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
