import { ImageResponse } from "next/og";
import fs from "fs";
import path from "path";

export const alt = "PU Digital Library";
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = "image/png";

export default async function Image() {
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
                {/* Plasma Gradient Background */}
                <div
                    style={{
                        position: "absolute",
                        top: "-20%",
                        left: "-10%",
                        width: "60%",
                        height: "80%",
                        background: "radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
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
                        background: "radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)",
                        filter: "blur(80px)",
                    }}
                />

                {/* Main Branding Card */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "40px",
                        background: "white",
                        padding: "60px 80px",
                        borderRadius: "60px",
                        border: "1px solid #e4e4e7",
                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.05)",
                    }}
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                        src={logoData}
                        alt="Logo"
                        width="140"
                        height="140"
                        style={{ borderRadius: "32px" }}
                    />
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <h1 style={{ fontSize: 72, fontWeight: 900, color: "#18181b", margin: 0, letterSpacing: "-0.04em", lineHeight: 1 }}>
                                PU DIGITAL
                            </h1>
                            <h1 style={{ fontSize: 72, fontWeight: 900, margin: 0, letterSpacing: "-0.04em", lineHeight: 0.9, background: "linear-gradient(to right, #3b82f6, #8b5cf6)", backgroundClip: "text", color: "transparent" }}>
                                LIBRARY
                            </h1>
                        </div>
                        <p style={{ fontSize: 22, color: "#71717a", marginTop: "20px", fontWeight: 700, letterSpacing: "0.02em" }}>
                            Your ultimate college companion.
                        </p>
                    </div>
                </div>

                {/* Footer Tagline */}
                <div style={{ position: "absolute", bottom: "60px", display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981" }} />
                    <span style={{ fontSize: 16, fontWeight: 900, color: "#a1a1aa", textTransform: "uppercase", letterSpacing: "0.2em" }}>
                        Built for the students of Patna University
                    </span>
                </div>
            </div>
        ),
        { ...size }
    );
}
