"use client";

import { useState, useEffect, useTransition } from "react";
import { User, Shield, Bell, Key, Image as ImageIcon, CheckCircle2, Briefcase, XCircle, Loader2, Link2, Camera, Trash2 } from "lucide-react";
import ClickSpark from "@/components/reactbits/ClickSpark";
import { getUserProfileAction, updateProfileAction } from "@/actions/user";
import { getCoursesAction } from "@/actions/curriculum";
import { getCollegesAction } from "@/actions/management";
import { getMyApplicationsAction } from "@/actions/roles";
import RolesTab, { type RoleApp } from "@/components/settings/roles-tab";
import AppearanceTab from "@/components/settings/appearance-tab";
import NotificationsTab from "@/components/settings/notifications-tab";
import SecurityTab from "@/components/settings/security-tab";

interface UserProfile {
    id: string;
    name: string;
    username: string;
    email: string;
    image: string;
    role: string;
    course: string;
    session: string;
    collegeId: string;
}

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("profile");
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [courses, setCourses] = useState<{ id: string; name: string; collegeId: string | null }[]>([]);
    const [colleges, setColleges] = useState<{ id: string; name: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [isPending, startTransition] = useTransition();
    const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);
    const [showUrlInput, setShowUrlInput] = useState(false);

    // Roles state
    const [roleApps, setRoleApps] = useState<RoleApp[]>([]);

    // Form state
    const [name, setName] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [selectedCourse, setSelectedCourse] = useState("");
    const [selectedSession, setSelectedSession] = useState("");
    const [selectedCollege, setSelectedCollege] = useState("");

    useEffect(() => {
        async function load() {
            const [profileRes, coursesRes, rolesRes, collegesRes] = await Promise.all([
                getUserProfileAction(),
                getCoursesAction(),
                getMyApplicationsAction(),
                getCollegesAction(),
            ]);
            if (profileRes.success && profileRes.data) {
                const p = profileRes.data as UserProfile;
                setProfile(p);
                setName(p.name || "");
                setImageUrl(p.image || "");
                setSelectedCourse(p.course || "");
                setSelectedSession(p.session || "");
                setSelectedCollege(p.collegeId || "");
            }
            if (coursesRes.success && coursesRes.data) {
                setCourses(coursesRes.data as { id: string; name: string; collegeId: string | null }[]);
            }
            if (rolesRes.success && rolesRes.data) {
                setRoleApps(rolesRes.data as RoleApp[]);
            }
            if (collegesRes.success && collegesRes.data) {
                setColleges(collegesRes.data);
            }
            setLoading(false);
        }
        load();
    }, []);

    const handleSave = () => {
        setStatus(null);
        startTransition(async () => {
            const formData = new FormData();
            formData.append("name", name);
            if (imageUrl) formData.append("image", imageUrl);
            if (selectedCourse) formData.append("course", selectedCourse);
            if (selectedSession) formData.append("session", selectedSession);
            if (selectedCollege) formData.append("collegeId", selectedCollege);

            const result = await updateProfileAction(formData);
            if (result.success) {
                setStatus({ success: true, message: "Profile updated successfully!" });
                setShowUrlInput(false);
                if (profile) setProfile({ ...profile, name, image: imageUrl, course: selectedCourse, session: selectedSession, collegeId: selectedCollege });
            } else {
                setStatus({ success: false, message: result.error || "Failed to update profile." });
            }
        });
    };

    const handleCancel = () => {
        if (profile) {
            setName(profile.name || "");
            setImageUrl(profile.image || "");
            setSelectedCourse(profile.course || "");
            setSelectedSession(profile.session || "");
            setSelectedCollege(profile.collegeId || "");
            setShowUrlInput(false);
        }
        setStatus(null);
    };

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
                                    onClick={() => { setActiveTab(tab.id); setStatus(null); }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id
                                        ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 shadow-sm"
                                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                        }`}
                                >
                                    <Icon className="h-4 w-4" />
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

                        {/* Loading State */}
                        {loading && (
                            <div className="flex items-center justify-center py-20">
                                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                            </div>
                        )}

                        {/* PROFILE SETTINGS */}
                        {!loading && activeTab === "profile" && profile && (
                            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div>
                                    <h1 className="text-3xl font-black text-zinc-900 dark:text-white mb-2">Public Profile</h1>
                                    <p className="text-zinc-500 dark:text-zinc-400 font-medium">This information will be displayed on your public profile.</p>
                                </div>

                                {/* Avatar */}
                                <div className="flex items-center gap-6 pb-8 border-b border-zinc-200 dark:border-zinc-800/60">
                                    <div className="relative group shrink-0">
                                        <div className="w-24 h-24 rounded-full bg-indigo-100 dark:bg-indigo-500/20 border-4 border-white dark:border-zinc-900 shadow-md flex items-center justify-center overflow-hidden">
                                            {imageUrl ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={imageUrl} alt={profile.name || "Avatar"} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                            ) : (
                                                <User className="h-10 w-10 text-indigo-500 dark:text-indigo-400" />
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setShowUrlInput(true)}
                                                className="px-4 py-2 text-sm font-bold bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors flex items-center gap-2"
                                            >
                                                <Camera className="h-4 w-4" /> Change Avatar
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => { setImageUrl(""); setShowUrlInput(false); }}
                                                className="px-4 py-2 text-sm font-bold text-red-600 bg-red-50 dark:bg-red-900/10 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2"
                                            >
                                                <Trash2 className="h-4 w-4" /> Remove
                                            </button>
                                        </div>
                                        {showUrlInput && (
                                            <div className="relative animate-in fade-in slide-in-from-top-2 duration-200">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Link2 className="h-4 w-4 text-zinc-400" />
                                                </div>
                                                <input
                                                    type="url"
                                                    value={imageUrl}
                                                    onChange={(e) => setImageUrl(e.target.value)}
                                                    placeholder="Paste image URL here..."
                                                    autoFocus
                                                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all font-medium text-sm"
                                                />
                                            </div>
                                        )}
                                        <p className="text-xs text-zinc-500 font-medium">{showUrlInput ? "Paste a direct image URL and click Save Changes." : "JPG, PNG or GIF. Use any public image URL."}</p>
                                    </div>
                                </div>

                                {/* Forms */}
                                <div className="space-y-6 max-w-2xl">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Display Name</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all font-medium"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Email Address</label>
                                        <input
                                            type="email"
                                            value={profile.email}
                                            disabled
                                            className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900/50 text-zinc-500 dark:text-zinc-400 cursor-not-allowed font-medium"
                                        />
                                        <p className="text-xs text-zinc-500">Email is linked to your OAuth provider and cannot be changed.</p>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Username</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <span className="text-zinc-400 font-bold">@</span>
                                            </div>
                                            <input
                                                type="text"
                                                value={profile.username}
                                                disabled
                                                className="w-full pl-9 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900/50 text-zinc-500 dark:text-zinc-400 cursor-not-allowed font-medium"
                                            />
                                        </div>
                                        <p className="text-xs text-zinc-500">Username is permanent and cannot be changed.</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">College / University</label>
                                            <select
                                                value={selectedCollege}
                                                onChange={(e) => {
                                                    setSelectedCollege(e.target.value);
                                                    setSelectedCourse(""); // Reset course when college changes
                                                    setSelectedSession("");
                                                }}
                                                className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all font-medium appearance-none"
                                            >
                                                <option value="">Select College</option>
                                                {colleges.map((c) => (
                                                    <option key={c.id} value={c.id}>{c.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Course</label>
                                            <select
                                                value={selectedCourse}
                                                onChange={(e) => {
                                                    setSelectedCourse(e.target.value);
                                                    setSelectedSession(""); // Reset session when course changes
                                                }}
                                                disabled={!selectedCollege}
                                                className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all font-medium appearance-none disabled:opacity-50"
                                            >
                                                <option value="">{selectedCollege ? "Select Course" : "Select College First"}</option>
                                                {courses.filter(c => c.collegeId === selectedCollege).map((c) => (
                                                    <option key={c.id} value={c.id}>{c.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Session</label>
                                            <input
                                                type="text"
                                                value={selectedSession}
                                                onChange={(e) => setSelectedSession(e.target.value)}
                                                disabled={!selectedCourse}
                                                placeholder="e.g. 2023-2027"
                                                className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all font-medium disabled:opacity-50"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Role</label>
                                        <div className="px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900/50">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold ${profile.role === "ADMIN" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                                                profile.role === "MODERATOR" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                                                    profile.role === "REVIEWER" ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400" :
                                                        "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                                                }`}>
                                                {profile.role}
                                            </span>
                                        </div>
                                        <p className="text-xs text-zinc-500">Roles are assigned by admins. Apply via the Roles & Permissions tab.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ROLES & PERMISSIONS */}
                        {!loading && activeTab === "roles" && (
                            <RolesTab
                                profile={profile}
                                roleApps={roleApps}
                                setRoleApps={setRoleApps}
                            />
                        )}

                        {/* APPEARANCE SETTINGS */}
                        {!loading && activeTab === "appearance" && (
                            <AppearanceTab />
                        )}

                        {/* NOTIFICATIONS SETTINGS */}
                        {!loading && activeTab === "notifications" && (
                            <NotificationsTab />
                        )}

                        {/* SECURITY TAB */}
                        {!loading && activeTab === "security" && (
                            <SecurityTab />
                        )}

                        {/* Status message */}
                        {status && (
                            <div className={`mt-6 p-4 rounded-xl border flex items-center gap-3 ${status.success ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400" : "bg-red-50 border-red-200 text-red-700 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400"}`}>
                                {status.success ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <XCircle className="h-5 w-5 shrink-0" />}
                                <p className="text-sm font-semibold">{status.message}</p>
                            </div>
                        )}

                        {/* Save Actions (only on profile tab) */}
                        {!loading && activeTab === "profile" && (
                            <div className="mt-12 pt-6 border-t border-zinc-200 dark:border-zinc-800/60 flex items-center gap-4 justify-end">
                                <button
                                    onClick={handleCancel}
                                    className="px-5 py-2.5 text-sm font-bold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <ClickSpark>
                                    <button
                                        onClick={handleSave}
                                        disabled={isPending}
                                        className="px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-md shadow-indigo-600/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : "Save Changes"}
                                    </button>
                                </ClickSpark>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
