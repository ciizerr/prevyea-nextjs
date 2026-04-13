"use client";

import { useState, useEffect, useTransition, useRef } from "react";
import { useSession } from "next-auth/react";
import { User, CheckCircle2, XCircle, Loader2, Link2, Camera, Trash2, Briefcase, Key, RefreshCcw } from "lucide-react";
import { SimpleInstagram, SimpleGithub, SimpleDiscord } from "@/components/si-icons";
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
    instagram?: string;
    discord?: string;
    github?: string;
    notifyPyqs: boolean;
    notifyNotices: boolean;
    semester: string;
}

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

export default function SettingsPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
        }>
            <SettingsContent />
        </Suspense>
    );
}

function SettingsContent() {
    const { data: session, update } = useSession();
    const searchParams = useSearchParams();
    const activeTab = searchParams.get("tab") || "profile";

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [courses, setCourses] = useState<{ id: string; name: string; collegeId: string | null }[]>([]);
    const [colleges, setColleges] = useState<{ id: string; name: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [isPending, startTransition] = useTransition();
    const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);
    const [showUrlInput, setShowUrlInput] = useState(false);
    const syncTriedRef = useRef(false);

    // Roles state
    const [roleApps, setRoleApps] = useState<RoleApp[]>([]);

    // Form state
    const [name, setName] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [selectedCourse, setSelectedCourse] = useState("");
    const [selectedSemester, setSelectedSemester] = useState("");
    const [selectedSession, setSelectedSession] = useState("");
    const [selectedCollege, setSelectedCollege] = useState("");
    const [instagram, setInstagram] = useState("");
    const [discord, setDiscord] = useState("");
    const [github, setGithub] = useState("");

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
                setSelectedSemester(p.semester || "");
                setSelectedSession(p.session || "");
                setSelectedCollege(p.collegeId || "");
                setInstagram(p.instagram || "");
                setDiscord(p.discord || "");
                setGithub(p.github || "");
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

    // Session Sync Effect: Keep client-side session role and image updated with database
    useEffect(() => {
        if (!profile || !session?.user || syncTriedRef.current) return;
        
        // @ts-expect-error - session user typings
        const sessionRole = session.user.role || "USER";
        const sessionImage = session.user.image;

        if (sessionRole !== profile.role || sessionImage !== profile.image) {
            console.log("Syncing session...");
            syncTriedRef.current = true;
            update();
        }
    }, [profile, session, update]);

    const handleSave = () => {
        setStatus(null);
        startTransition(async () => {
            const formData = new FormData();
            formData.append("name", name);
            if (imageUrl) formData.append("image", imageUrl);
            if (selectedCourse) formData.append("course", selectedCourse);
            if (selectedSemester) formData.append("semester", selectedSemester);
            if (selectedSession) formData.append("session", selectedSession);
            if (selectedCollege) formData.append("collegeId", selectedCollege);
            if (instagram) formData.append("instagram", instagram);
            if (discord) formData.append("discord", discord);
            if (github) formData.append("github", github);

            const result = await updateProfileAction(formData);
            if (result.success) {
                setStatus({ success: true, message: "Profile updated successfully!" });
                setShowUrlInput(false);
                if (profile) setProfile({
                    ...profile, name, image: imageUrl, course: selectedCourse, semester: selectedSemester, session: selectedSession, collegeId: selectedCollege,
                    instagram, discord, github
                });
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
            setSelectedSemester(profile.semester || "");
            setSelectedSession(profile.session || "");
            setSelectedCollege(profile.collegeId || "");
            setInstagram(profile.instagram || "");
            setDiscord(profile.discord || "");
            setGithub(profile.github || "");
            setShowUrlInput(false);
        }
        setStatus(null);
    };


    return (
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 w-full max-w-6xl mx-auto">
            {/* Main Content Pane */}
            <div className="flex-1 space-y-6">
                <div className="bg-white/40 dark:bg-zinc-950/40 backdrop-blur-md border border-zinc-200/60 dark:border-zinc-800/60 rounded-[3rem] p-6 sm:p-8 md:p-12 shadow-2xl shadow-zinc-200/10 dark:shadow-none relative overflow-hidden h-full flex flex-col">
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
                                    <h1 className="text-3xl font-black text-zinc-900 dark:text-white mb-2">My Profile</h1>
                                    <p className="text-zinc-500 dark:text-zinc-400 font-medium">Update your public identity and curriculum details.</p>
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

                                {/* Sections Grid */}
                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                                    {/* Left Column: Personal & Academic */}
                                    <div className="space-y-10">
                                        {/* Identity Section */}
                                        <section className="space-y-6">
                                            <div className="flex items-center gap-3 pb-2 border-b border-zinc-200 dark:border-zinc-800/60">
                                                <User className="h-4 w-4 text-indigo-500" />
                                                <h3 className="text-sm font-black uppercase tracking-widest text-zinc-900 dark:text-white">Identity</h3>
                                            </div>
                                            <div className="space-y-4">
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
                                                </div>
                                            </div>
                                        </section>

                                        {/* Academic Section */}
                                        <section className="space-y-6">
                                            <div className="flex items-center gap-3 pb-2 border-b border-zinc-200 dark:border-zinc-800/60">
                                                <Briefcase className="h-4 w-4 text-emerald-500" />
                                                <h3 className="text-sm font-black uppercase tracking-widest text-zinc-900 dark:text-white">Academic Details</h3>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">College / University</label>
                                                    <select
                                                        value={selectedCollege}
                                                        onChange={(e) => {
                                                            setSelectedCollege(e.target.value);
                                                            setSelectedCourse(""); 
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
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Course</label>
                                                        <select
                                                            value={selectedCourse}
                                                            onChange={(e) => {
                                                                setSelectedCourse(e.target.value);
                                                                setSelectedSemester("");
                                                                setSelectedSession(""); 
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
                                                        <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Semester</label>
                                                        <select
                                                            value={selectedSemester}
                                                            onChange={(e) => setSelectedSemester(e.target.value)}
                                                            disabled={!selectedCourse}
                                                            className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all font-medium appearance-none disabled:opacity-50"
                                                        >
                                                            <option value="">{selectedCourse ? "Select Semester" : "Select Course First"}</option>
                                                            {Array.from({ length: (courses.find(c => c.id === selectedCourse) as any)?.totalSemesters || 0 }).map((_, i) => (
                                                                <option key={i} value={`Sem ${i + 1}`}>Sem {i + 1}</option>
                                                            ))}
                                                        </select>
                                                    </div>
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
                                        </section>
                                    </div>

                                    {/* Right Column: Account Type & Socials */}
                                    <div className="space-y-10">
                                        {/* Status Section */}
                                        <section className="space-y-6">
                                            <div className="flex items-center gap-3 pb-2 border-b border-zinc-200 dark:border-zinc-800/60">
                                                <Key className="h-4 w-4 text-amber-500" />
                                                <h3 className="text-sm font-black uppercase tracking-widest text-zinc-900 dark:text-white">Account Status</h3>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Account Type</label>
                                                <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900/40">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${profile.role === "ADMIN" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                                                        profile.role === "MODERATOR" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                                                            profile.role === "REVIEWER" ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400" :
                                                                "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                                                        }`}>
                                                        {profile.role === "ADMIN" ? "Administrator" : profile.role === "MODERATOR" ? "Moderator" : profile.role === "REVIEWER" ? "Reviewer" : "Student"}
                                                    </span>

                                                    {/* Manual Sync Button if session is out of sync */}
                                                    {/* @ts-expect-error - user role check */}
                                                    {(session?.user?.role !== profile.role || session?.user?.image !== profile.image) && (
                                                        <button
                                                            onClick={() => update()}
                                                            title="Sync Account State"
                                                            className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-lg transition-all"
                                                        >
                                                            <RefreshCcw className="h-3.5 w-3.5" />
                                                            Sync
                                                        </button>
                                                    )}
                                                </div>
                                                <p className="text-[11px] text-zinc-500 font-medium">Special roles provide additional platform capabilities.</p>
                                            </div>
                                        </section>

                                        {/* Social Section */}
                                        <section className="space-y-6">
                                            <div className="flex items-center gap-3 pb-2 border-b border-zinc-200 dark:border-zinc-800/60">
                                                <SimpleInstagram size={16} className="text-[#E4405F]" />
                                                <h3 className="text-sm font-black uppercase tracking-widest text-zinc-900 dark:text-white">Social Presence</h3>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Instagram</label>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                                            <SimpleInstagram size={14} className="text-[#E4405F]" />
                                                        </div>
                                                        <input
                                                            type="text"
                                                            value={instagram}
                                                            onChange={(e) => setInstagram(e.target.value)}
                                                            placeholder="username"
                                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all font-medium"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Discord</label>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                                            <SimpleDiscord size={14} className="text-[#5865F2]" />
                                                        </div>
                                                        <input
                                                            type="text"
                                                            value={discord}
                                                            onChange={(e) => setDiscord(e.target.value)}
                                                            placeholder="username"
                                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all font-medium"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">GitHub</label>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                                            <SimpleGithub size={14} className="text-[#181717] dark:text-white" />
                                                        </div>
                                                        <input
                                                            type="text"
                                                            value={github}
                                                            onChange={(e) => setGithub(e.target.value)}
                                                            placeholder="username"
                                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all font-medium"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </section>
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
                        {!loading && activeTab === "notifications" && profile && (
                            <NotificationsTab
                                initialPyqs={profile.notifyPyqs}
                                initialNotices={profile.notifyNotices}
                            />
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
