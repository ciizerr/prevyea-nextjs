import { ImageResponse } from "next/og";
import { getNoticeByIdAction } from "@/actions/notice";
import fs from "fs";
import path from "path";

// export const runtime = "edge";

export const alt = "Notice Board Announcement";
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { data: notice } = await getNoticeByIdAction(id);

    // Read local logo for embedding
    const logoPath = path.join(process.cwd(), "public", "img-512x512.png");
    const logoBase64 = fs.readFileSync(logoPath).toString("base64");
    const logoData = `data:image/png;base64,${logoBase64}`;

    if (!notice) {
        return new ImageResponse(
            (
                <div style={{ height: "100%", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#050505", color: "white" }}>
                    Notice Not Found
                </div>
            ),
            { ...size }
        );
    }

    const typeColors: Record<string, string> = {
        "Exam": "#e11d48", // Rose 600
        "Event": "#d97706", // Amber 600
        "Holiday": "#059669", // Emerald 600
        "Result": "#7c3aed", // Violet 600
        "General": "#2563eb", // Blue 600
    };

    const typeBg = typeColors[notice.type] || "#2563eb";

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
                        background: `radial-gradient(circle, ${typeBg}1A 0%, transparent 70%)`,
                        filter: "blur(80px)",
                    }}
                />
                
                {/* Vertical Accent Bar */}
                <div 
                    style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: "15px",
                        background: typeBg,
                    }}
                />

                {/* Main Content Area */}
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        background: "rgba(255, 255, 255, 0.9)",
                        borderRadius: "40px",
                        border: "1px solid #e4e4e7",
                        padding: "60px",
                        boxShadow: "0 30px 60px -12px rgba(0, 0, 0, 0.08)",
                        position: "relative",
                    }}
                >
                    {/* Header Branding */}
                    <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "50px" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                            src={logoData}
                            alt="Logo"
                            width="54"
                            height="54"
                            style={{ borderRadius: "16px" }}
                        />
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <span style={{ fontSize: 26, fontWeight: 900, color: "#18181b", letterSpacing: "-0.04em", lineHeight: 1 }}>PU DIGITAL LIBRARY</span>
                            <span style={{ fontSize: 13, fontWeight: 700, color: "#71717a", textTransform: "uppercase", letterSpacing: "0.2em", marginTop: "4px" }}>Notice Board</span>
                        </div>
                        <div style={{ flex: 1 }} />
                        <div style={{ 
                            padding: "10px 24px", 
                            background: typeBg, 
                            borderRadius: "16px", 
                            color: "white", 
                            fontSize: 14, 
                            fontWeight: 900, 
                            textTransform: "uppercase", 
                            letterSpacing: "0.15em",
                            boxShadow: `0 10px 20px -5px ${typeBg}4D`
                        }}>
                            {notice.type}
                        </div>
                    </div>

                    {/* Notice Title Section */}
                    <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center" }}>
                        <div style={{ 
                            display: "flex", 
                            fontSize: 76, 
                            fontWeight: 900, 
                            color: "#09090b", 
                            letterSpacing: "-0.04em", 
                            lineHeight: 1.1, 
                            marginBottom: "30px",
                            maxHeight: "250px",
                            overflow: "hidden"
                        }}>
                            <span>{notice.title}</span>
                        </div>
                        <div style={{ 
                            display: "flex", 
                            fontSize: 24, 
                            fontWeight: 500, 
                            color: "#52525b", 
                            lineHeight: 1.5,
                            maxHeight: "110px",
                            overflow: "hidden",
                        }}>
                            <span>{notice.content.length > 250 ? notice.content.substring(0, 250) + "..." : notice.content}</span>
                        </div>
                    </div>

                    {/* Bottom Meta */}
                    <div style={{ display: "flex", alignItems: "center", gap: "30px", borderTop: "1px solid #f4f4f5", paddingTop: "40px", marginTop: "40px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                            <div style={{ width: 44, height: 44, borderRadius: "14px", background: "#f4f4f5", display: "flex", alignItems: "center", justifyContent: "center", color: "#a1a1aa" }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                <span style={{ fontSize: 11, fontWeight: 900, color: "#a1a1aa", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "2px" }}>Issued By</span>
                                <span style={{ fontSize: 18, fontWeight: 800, color: "#18181b" }}>{notice.authorName}</span>
                            </div>
                        </div>
                        
                        <div style={{ width: "1px", height: "40px", background: "#e4e4e7" }} />
                        
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <span style={{ fontSize: 11, fontWeight: 900, color: "#a1a1aa", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "2px" }}>Date Posted</span>
                            <span style={{ fontSize: 18, fontWeight: 800, color: "#18181b" }}>{notice.createdAt ? new Date(notice.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Recently"}</span>
                        </div>

                        <div style={{ flex: 1 }} />
                        
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                             <div style={{ width: 10, height: 10, borderRadius: "50%", background: typeBg }} />
                             <span style={{ fontSize: 13, fontWeight: 900, color: "#18181b", textTransform: "uppercase", letterSpacing: "0.12em" }}>Official Announcement</span>
                        </div>
                    </div>
                </div>
            </div>
        ),
        { ...size }
    );
}
