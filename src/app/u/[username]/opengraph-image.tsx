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
                                <span style={{ display: "flex", fontSize: 36, color: "#18181b", fontWeight: 900 }}>{totalContributions}</span>
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
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#181717">
                                        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.011-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                                    </svg>
                                    <span style={{ fontSize: 20, color: "#334155", fontWeight: 800 }}>GitHub</span>
                                </div>
                            )}
                            {userProfile.instagram && (
                                <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "#fff1f2", padding: "12px 24px", borderRadius: "24px", border: "1px solid #ffe4e6" }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#E4405F">
                                        <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zM12 5.837a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" />
                                    </svg>
                                    <span style={{ fontSize: 20, color: "#334155", fontWeight: 800 }}>Instagram</span>
                                </div>
                            )}
                            {userProfile.discord && (
                                <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "#eef2ff", padding: "12px 24px", borderRadius: "24px", border: "1px solid #e0e7ff" }}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#5865F2">
                                        <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037 19.736 19.736 0 00-4.885 1.515.069.069 0 00-.032.027C.533 9.048-.32 13.572.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.054-3.03.076.076 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.086 2.157 2.419 0 1.334-.947 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.086 2.157 2.419 0 1.334-.946 2.419-2.157 2.419z" />
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

