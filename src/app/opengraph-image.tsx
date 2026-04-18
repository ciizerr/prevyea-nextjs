import { ImageResponse } from "next/og";
import { getLandingStats } from "@/actions/public";
import fs from "fs";
import path from "path";


// export const runtime = "edge";


export const alt = "PU Digital Library - Your College Companion";
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = "image/png";

export default async function Image() {
    const stats = await getLandingStats();
    
    // Read local logo for embedding
    const logoPath = path.join(process.cwd(), "public", "img-512x512.png");
    const logoBase64 = fs.readFileSync(logoPath).toString("base64");
    const logoData = `data:image/png;base64,${logoBase64}`;



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
                    fontFamily: "sans-serif",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* Stunning Gradient Background (Plasma Style) */}
                <div
                    style={{
                        position: "absolute",
                        top: "-20%",
                        left: "-10%",
                        width: "60%",
                        height: "80%",
                        background: "radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, transparent 70%)",
                        filter: "blur(80px)",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        bottom: "-20%",
                        right: "-10%",
                        width: "60%",
                        height: "80%",
                        background: "radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 70%)",
                        filter: "blur(80px)",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        top: "30%",
                        left: "40%",
                        width: "40%",
                        height: "50%",
                        background: "radial-gradient(circle, rgba(236, 72, 153, 0.05) 0%, transparent 70%)",
                        filter: "blur(60px)",
                    }}
                />

                {/* Main Content Container */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                        zIndex: 10,
                    }}
                >
                    {/* Floating Badge */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "8px 16px",
                            background: "white",
                            border: "1px solid #e4e4e7",
                            borderRadius: "99px",
                            marginBottom: "32px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                        }}
                    >
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981" }} />
                        <span style={{ fontSize: 14, fontWeight: 900, color: "#71717a", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                            The Community Library
                        </span>
                    </div>

                    {/* Header: Logo + Title */}
                    <div style={{ display: "flex", alignItems: "center", gap: "40px", marginBottom: "32px" }}>
                        {/* App Logo */}
                        <div style={{ display: "flex" }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img 
                                src={logoData}
                                alt="Logo"

                                width="140"
                                height="140"
                                style={{ borderRadius: "32px" }}
                            />
                        </div>

                        {/* Massive Branded Title */}
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", textAlign: "left" }}>
                            <h1
                                style={{
                                    fontSize: 84,
                                    fontWeight: 900,
                                    color: "#18181b",
                                    margin: 0,
                                    letterSpacing: "-0.05em",
                                    lineHeight: 1.1,
                                }}
                            >
                                PU DIGITAL
                            </h1>
                            <h1
                                style={{
                                    fontSize: 84,
                                    fontWeight: 900,
                                    margin: 0,
                                    letterSpacing: "-0.05em",
                                    lineHeight: 0.9,
                                    background: "linear-gradient(to right, #3b82f6, #8b5cf6)",
                                    backgroundClip: "text",
                                    color: "transparent",
                                }}
                            >
                                LIBRARY
                            </h1>
                        </div>
                    </div>

                    {/* Tagline */}
                    <p
                        style={{
                            fontSize: 28,
                            color: "#52525b",
                            marginTop: "32px",
                            fontWeight: 600,
                            maxWidth: "800px",
                        }}
                    >
                        Your college companion — Access PYQs, Notes, and Syllabus in one single place.
                    </p>

                    {/* Dynamic Stats Row */}
                    <div
                        style={{
                            display: "flex",
                            gap: "40px",
                            marginTop: "60px",
                        }}
                    >
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <span style={{ fontSize: 48, fontWeight: 900, color: "#18181b" }}>{stats.pyqsCount}+</span>
                            <span style={{ fontSize: 14, fontWeight: 800, color: "#a1a1aa", textTransform: "uppercase", letterSpacing: "0.1em" }}>Materials</span>
                        </div>
                        <div style={{ width: "1px", height: "60px", background: "#e4e4e7" }} />
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <span style={{ fontSize: 48, fontWeight: 900, color: "#18181b" }}>{stats.subjectsCount}</span>
                            <span style={{ fontSize: 14, fontWeight: 800, color: "#a1a1aa", textTransform: "uppercase", letterSpacing: "0.1em" }}>Subjects</span>
                        </div>
                        <div style={{ width: "1px", height: "60px", background: "#e4e4e7" }} />
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <span style={{ fontSize: 48, fontWeight: 900, color: "#18181b" }}>100%</span>
                            <span style={{ fontSize: 14, fontWeight: 800, color: "#a1a1aa", textTransform: "uppercase", letterSpacing: "0.1em" }}>Verified</span>
                        </div>
                    </div>
                </div>

                {/* Bottom Decorative Line */}
                <div
                    style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: "8px",
                        background: "linear-gradient(to right, #3b82f6, #8b5cf6, #ec4899)",
                    }}
                />
            </div>
        ),
        { ...size }
    );
}
