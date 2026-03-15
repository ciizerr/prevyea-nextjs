import { ImageResponse } from "next/og";
import { getSubjectByIdAction } from "@/actions/curriculum";
import fs from "fs";
import path from "path";

// export const runtime = "edge";

export const alt = "Syllabus Preview";
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = "image/png";

export default async function Image({ params }: { params: { id: string } }) {
    const { id } = params;
    const { data: subject } = await getSubjectByIdAction(id);

    // Read local logo for embedding
    const logoPath = path.join(process.cwd(), "public", "img-512x512.png");
    const logoBase64 = fs.readFileSync(logoPath).toString("base64");
    const logoData = `data:image/png;base64,${logoBase64}`;

    if (!subject) {
        return new ImageResponse(
            (
                <div style={{ height: "100%", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#050505", color: "white" }}>
                    Subject Not Found
                </div>
            ),
            { ...size }
        );
    }

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
                    padding: "60px",
                }}
            >
                {/* Background Decorative Mesh */}
                <div
                    style={{
                        position: "absolute",
                        top: "-10%",
                        right: "-10%",
                        width: "60%",
                        height: "80%",
                        background: "radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
                        filter: "blur(80px)",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        bottom: "-10%",
                        left: "-10%",
                        width: "60%",
                        height: "80%",
                        background: "radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)",
                        filter: "blur(80px)",
                    }}
                />

                {/* Main Card */}
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        background: "rgba(255, 255, 255, 0.8)",
                        borderRadius: "50px",
                        border: "1px solid #e4e4e7",
                        padding: "60px",
                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.05)",
                    }}
                >
                    {/* Header Branding */}
                    <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "40px" }}>
                        <img 
                            src={logoData}
                            alt="Logo"
                            width="50"
                            height="50"
                            style={{ borderRadius: "14px" }}
                        />
                        <span style={{ fontSize: 24, fontWeight: 900, color: "#18181b", letterSpacing: "-0.02em" }}>PU DIGITAL LIBRARY</span>
                        <div style={{ flex: 1 }} />
                        <div style={{ padding: "8px 20px", background: "#3b82f6", borderRadius: "14px", color: "white", fontSize: 13, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                            Academic Syllabus
                        </div>
                    </div>

                    {/* Content Section */}
                    <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center" }}>
                        <div style={{ fontSize: 14, fontWeight: 900, color: "#3b82f6", textTransform: "uppercase", letterSpacing: "0.3em", marginBottom: "16px" }}>
                            CURRICULUM ARCHIVE
                        </div>
                        <div style={{ fontSize: 100, fontWeight: 900, color: "#18181b", letterSpacing: "-0.05em", lineHeight: 0.85, marginBottom: "24px" }}>
                            {subject.name}
                        </div>
                        <div style={{ fontSize: 32, fontWeight: 700, color: "#71717a" }}>
                            Official Syllabus for {subject.courseName}
                        </div>
                    </div>

                    {/* Bottom Meta */}
                    <div style={{ display: "flex", alignItems: "center", gap: "30px", paddingTop: "40px", borderTop: "1px solid #f4f4f5", marginTop: "auto" }}>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <span style={{ fontSize: 12, fontWeight: 900, color: "#a1a1aa", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "4px" }}>Semester</span>
                            <span style={{ fontSize: 20, fontWeight: 800, color: "#18181b" }}>{subject.semester}</span>
                        </div>
                        <div style={{ width: "1px", height: "40px", background: "#f4f4f5" }} />
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <span style={{ fontSize: 12, fontWeight: 900, color: "#a1a1aa", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "4px" }}>Program</span>
                            <span style={{ fontSize: 20, fontWeight: 800, color: "#18181b" }}>{subject.courseName}</span>
                        </div>
                        <div style={{ flex: 1 }} />
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                             <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#3b82f6" }} />
                             <span style={{ fontSize: 14, fontWeight: 900, color: "#3b82f6", textTransform: "uppercase", letterSpacing: "0.1em" }}>Verified Official Record</span>
                        </div>
                    </div>
                </div>
            </div>
        ),
        { ...size }
    );
}
