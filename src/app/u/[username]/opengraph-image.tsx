import { ImageResponse } from "next/og";
import { db } from "@/db";
import { users, pyqs, courses } from "@/db/schema";
import { eq, count, and } from "drizzle-orm";
import dayjs from "dayjs";
import fs from "fs";
import path from "path";





// export const runtime = "edge";


export const alt = "User Profile";
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = "image/png";

export default async function Image({ params }: { params: { username: string } }) {
    const { username } = await params;

    const userProfile = await db.query.users.findFirst({
        where: eq(users.username, username.toLowerCase()),
    });

    if (!userProfile) {
        return new ImageResponse(
            (
                <div
                    style={{
                        height: "100%",
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#fcfcfd",
                        color: "#18181b",
                        fontFamily: "sans-serif",
                    }}
                >
                    <div style={{ fontSize: 60, fontWeight: "bold" }}>User Not Found</div>
                </div>
            ),
            { ...size }
        );
    }

    // Read local logo for embedding
    const logoPath = path.join(process.cwd(), "public", "img-512x512.png");
    const logoBase64 = fs.readFileSync(logoPath).toString("base64");
    const logoData = `data:image/png;base64,${logoBase64}`;



    // Get Course Name

    let courseName = userProfile.course;
    if (userProfile.course) {
        const courseData = await db.query.courses.findFirst({
            where: eq(courses.id, userProfile.course),
        });
        if (courseData) {
            courseName = courseData.name;
        }
    }

    // Member Since
    let joinedDateString = "Unknown";
    try {
        if (userProfile.createdAt) {
            joinedDateString = dayjs(userProfile.createdAt).format("MMM YYYY");
        }
    } catch { }



    // Get total contributions
    const contributions = await db
        .select({ value: count() })
        .from(pyqs)
        .where(
            and(
                eq(pyqs.uploaderId, userProfile.id),
                eq(pyqs.status, "APPROVED")
            )
        );
    
    const totalContributions = contributions[0]?.value || 0;

    return new ImageResponse(
        (
            <div
                style={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#fcfcfd", // Match page background
                    padding: "60px",
                    fontFamily: "sans-serif",
                }}
            >
                {/* Background Decorative Mesh - Mirroring the page */}
                <div
                    style={{
                        position: "absolute",
                        top: -150,
                        right: -150,
                        width: 600,
                        height: 600,
                        borderRadius: "50%",
                        background: "rgba(59, 130, 246, 0.08)",
                        filter: "blur(100px)",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        bottom: -150,
                        left: -150,
                        width: 600,
                        height: 600,
                        borderRadius: "50%",
                        background: "rgba(139, 92, 246, 0.08)",
                        filter: "blur(100px)",
                    }}
                />

                {/* Main Card */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "flex-start",
                        gap: "60px",
                        width: "100%",
                        background: "white",
                        border: "1px solid #e4e4e7",
                        borderRadius: "80px", // Match rounded-[2.5rem]
                        padding: "80px",
                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.05)",
                        position: "relative",
                    }}
                >
                    {/* Avatar with Glow/Border */}
                    <div style={{ display: "flex", position: "relative", width: 220, height: 220 }}>
                        <div 
                            style={{ 
                                position: "absolute", 
                                inset: -20, 
                                background: "rgba(59, 130, 246, 0.15)", 
                                filter: "blur(30px)",
                                borderRadius: "80px"
                            }} 
                        />
                        {userProfile.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={userProfile.image}
                                alt={userProfile.username || ""}
                                width="220"
                                height="220"
                                style={{
                                    borderRadius: "48px", // Match rounded-[2rem]
                                    border: "8px solid #f9fafb",
                                    objectFit: "cover",
                                    position: "relative",
                                }}
                            />
                        ) : (
                            <div
                                style={{
                                    width: 220,
                                    height: 220,
                                    borderRadius: "48px",
                                    backgroundColor: "#f4f4f5",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 80,
                                    color: "#a1a1aa",
                                    border: "8px solid #f9fafb",
                                    position: "relative",
                                }}
                            >
                                {userProfile.username?.[0]?.toUpperCase() || "U"}
                            </div>
                        )}
                        
                        {userProfile.role === "ADMIN" && (
                            <div
                                style={{
                                    position: "absolute",
                                    bottom: -10,
                                    right: -10,
                                    backgroundColor: "#18181b",
                                    color: "white",
                                    width: 64,
                                    height: 64,
                                    borderRadius: "24px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    border: "8px solid white",
                                    boxShadow: "0 10px 15px rgba(0,0,0,0.1)",
                                }}
                            >
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M20 6L9 17L4 12" />
                                </svg>
                            </div>
                        )}
                    </div>


                    {/* Content Area */}
                    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "4px" }}>
                            <h1
                                style={{
                                    fontSize: 64,
                                    fontWeight: 900,
                                    color: "#18181b",
                                    margin: 0,
                                    letterSpacing: "-0.04em",
                                }}
                            >
                                <span>{userProfile.name || `@${userProfile.username}`}</span>
                            </h1>
                            <div
                                style={{
                                    padding: "6px 14px",
                                    background: "#eff6ff",
                                    color: "#2563eb",
                                    fontSize: 14,
                                    fontWeight: 900,
                                    borderRadius: "99px",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.1em",
                                    border: "1px solid #dbeafe",
                                }}
                            >
                                {userProfile.role}
                            </div>
                        </div>
                        <p style={{ display: "flex", fontSize: 26, color: "#71717a", margin: 0, fontWeight: 500, marginBottom: "40px" }}>
                            @{userProfile.username}
                        </p>

                        <div style={{ display: "flex", gap: "20px" }}>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    background: "#f9fafb",
                                    padding: "20px 30px",
                                    borderRadius: "32px",
                                    border: "1px solid #f1f1f4",
                                    minWidth: "180px",
                                }}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                                        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                                        <path d="M4 22h16" />
                                        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                                        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                                        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                                    </svg>
                                    <span style={{ fontSize: 13, color: "#a1a1aa", fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase" }}>Uploads</span>
                                </div>
                                <span style={{ display: "flex", fontSize: 36, color: "#18181b", fontWeight: 900 }}>{totalContributions} Items</span>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    background: "#f9fafb",
                                    padding: "20px 30px",
                                    borderRadius: "32px",
                                    border: "1px solid #f1f1f4",
                                    minWidth: "180px",
                                }}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                                        <path d="M6 12v5c3 3 9 3 12 0v-5" />
                                    </svg>
                                    <span style={{ fontSize: 13, color: "#a1a1aa", fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase" }}>Course</span>
                                </div>
                                <span style={{ display: "flex", fontSize: 24, color: "#18181b", fontWeight: 700 }}>{courseName || "General"}</span>
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    background: "#f9fafb",
                                    padding: "20px 30px",
                                    borderRadius: "32px",
                                    border: "1px solid #f1f1f4",
                                    minWidth: "180px",
                                }}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                                        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                                        <line x1="16" x2="16" y1="2" y2="6" />
                                        <line x1="8" x2="8" y1="2" y2="6" />
                                        <line x1="3" x2="21" y1="10" y2="10" />
                                    </svg>
                                    <span style={{ fontSize: 13, color: "#a1a1aa", fontWeight: 900, letterSpacing: "0.1em", textTransform: "uppercase" }}>Member Since</span>
                                </div>
                                <span style={{ display: "flex", fontSize: 24, color: "#18181b", fontWeight: 700 }}>{joinedDateString || "Unknown"}</span>
                            </div>
                        </div>

                        {/* Social Row */}
                        <div style={{ display: "flex", gap: "16px", marginTop: "30px" }}>
                            {userProfile.github && (
                                <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "#f8fafc", padding: "12px 24px", borderRadius: "24px", border: "1px solid #e2e8f0" }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                                    </svg>
                                    <span style={{ fontSize: 20, color: "#334155", fontWeight: 800 }}>GitHub</span>
                                </div>
                            )}
                            {userProfile.instagram && (
                                <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "#fff1f2", padding: "12px 24px", borderRadius: "24px", border: "1px solid #ffe4e6" }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e11d48" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                                    </svg>
                                    <span style={{ fontSize: 20, color: "#334155", fontWeight: 800 }}>Instagram</span>
                                </div>
                            )}
                            {userProfile.discord && (
                                <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "#eef2ff", padding: "12px 24px", borderRadius: "24px", border: "1px solid #e0e7ff" }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                    </svg>
                                    <span style={{ fontSize: 20, color: "#334155", fontWeight: 800 }}>Discord</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Label */}
                <div style={{ marginTop: "50px", display: "flex", alignItems: "center", gap: "16px" }}>
                    <div style={{ height: "1px", width: "40px", background: "#e4e4e7" }} />
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                            src={logoData}
                            alt="Logo"

                            width="32"
                            height="32"
                            style={{ borderRadius: "8px" }}
                        />

                        <span style={{ fontSize: 22, color: "#a1a1aa", fontWeight: 700, letterSpacing: "0.05em" }}>PU DIGITAL LIBRARY</span>
                    </div>
                    <div style={{ height: "1px", width: "40px", background: "#e4e4e7" }} />
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}

