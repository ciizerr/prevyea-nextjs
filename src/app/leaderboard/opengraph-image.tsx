import { ImageResponse } from "next/og";
import { getLeaderboardAction } from "@/actions/leaderboard";
import fs from "fs";
import path from "path";

export const alt = "Leaderboard - PU Digital Library Hall of Fame";
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = "image/png";

export default async function Image() {
    const { data: contributors } = await getLeaderboardAction();
    const topThree = contributors?.slice(0, 3) || [];
    const totalCount = contributors?.length || 0;

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
                    backgroundColor: "#fcfcfd",
                    fontFamily: "sans-serif",
                    position: "relative",
                    overflow: "hidden",
                    padding: "40px",
                }}
            >
                {/* Background Decorative Mesh */}
                <div
                    style={{
                        position: "absolute",
                        top: "-5%",
                        right: "-5%",
                        width: "45%",
                        height: "45%",
                        display: "flex",
                        background: "radial-gradient(circle, rgba(234, 179, 8, 0.12) 0%, transparent 70%)",
                        filter: "blur(60px)",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        bottom: "-5%",
                        left: "-5%",
                        width: "45%",
                        height: "45%",
                        display: "flex",
                        background: "radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, transparent 70%)",
                        filter: "blur(60px)",
                    }}
                />

                {/* Header Branding */}
                <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px", width: "100%", justifyContent: "center" }}>
                    <img 
                        src={logoData}
                        alt="Logo"
                        width="48"
                        height="48"
                        style={{ borderRadius: "12px" }}
                    />
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ display: "flex", fontSize: 24, fontWeight: 900, color: "#18181b", letterSpacing: "-0.02em" }}>PU DIGITAL LIBRARY</span>
                        <span style={{ display: "flex", fontSize: 10, fontWeight: 900, color: "#eab308", textTransform: "uppercase", letterSpacing: "0.2em" }}>Hall of Fame</span>
                    </div>
                </div>

                {/* Title Section */}
                <div style={{ display: "flex", marginBottom: "40px" }}>
                    <h1 style={{ display: "flex", fontSize: 60, fontWeight: 900, color: "#18181b", margin: 0, letterSpacing: "-0.04em" }}>
                        <span>Top Contributors</span>
                    </h1>
                </div>

                {/* Podium Section - Controlled Spacing */}
                <div style={{ display: "flex", alignItems: "flex-end", gap: "24px", width: "100%", justifyContent: "center", marginTop: "auto", marginBottom: "auto" }}>
                    {/* Rank 2 */}
                    {topThree[1] && (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
                            <div style={{ width: 110, height: 110, borderRadius: "36px", background: "#f4f4f5", border: "4px solid #d4d4d8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 42, fontWeight: 900, color: "#a1a1aa", position: "relative", overflow: "hidden" }}>
                                {topThree[1].image ? (
                                    <img src={topThree[1].image} alt={topThree[1].name || ""} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                ) : (
                                    <span>{topThree[1].name?.[0] || "?"}</span>
                                )}
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "12px 20px", background: "white", borderRadius: "24px", border: "1px solid #e4e4e7", width: "190px" }}>
                                <span style={{ display: "flex", fontSize: 16, fontWeight: 900, color: "#18181b", textAlign: "center", width: "100%", overflow: "hidden" }}><span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{topThree[1].name}</span></span>
                                <span style={{ display: "flex", fontSize: 13, fontWeight: 700, color: "#71717a" }}><span>{topThree[1].uploadCount} Items</span></span>
                                <div style={{ display: "flex", marginTop: "6px", padding: "4px 10px", background: "#f4f4f5", borderRadius: "8px", fontSize: 10, fontWeight: 800, color: "#71717a" }}><span>RANK 2</span></div>
                            </div>
                        </div>
                    )}

                    {/* Rank 1 */}
                    {topThree[0] && (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", paddingBottom: "30px" }}>
                            <div style={{ width: 140, height: 140, borderRadius: "48px", background: "#fefce8", border: "6px solid #eab308", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 56, fontWeight: 900, color: "#eab308", position: "relative", overflow: "hidden", boxShadow: "0 15px 30px rgba(234, 179, 8, 0.1)" }}>
                                {topThree[0].image ? (
                                    <img src={topThree[0].image} alt={topThree[0].name || ""} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                ) : (
                                    <span>{topThree[0].name?.[0] || "?"}</span>
                                )}
                                <div style={{ position: "absolute", top: 0, right: 0, display: "flex", padding: "6px", background: "#eab308", borderBottomLeftRadius: "16px" }}>
                                    <div style={{ width: 12, height: 12, background: "white", borderRadius: "50%" }} />
                                </div>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "16px 24px", background: "white", borderRadius: "28px", border: "2px solid #fef08a", width: "230px", boxShadow: "0 8px 20px rgba(0,0,0,0.04)" }}>
                                <span style={{ display: "flex", fontSize: 20, fontWeight: 900, color: "#18181b", textAlign: "center", width: "100%", overflow: "hidden" }}><span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{topThree[0].name}</span></span>
                                <span style={{ display: "flex", fontSize: 16, fontWeight: 700, color: "#eab308" }}><span>{topThree[0].uploadCount} Items</span></span>
                                <div style={{ display: "flex", marginTop: "8px", padding: "6px 14px", background: "#eab308", borderRadius: "10px", fontSize: 12, fontWeight: 900, color: "white" }}><span>CHAMPION #1</span></div>
                            </div>
                        </div>
                    )}

                    {/* Rank 3 */}
                    {topThree[2] && (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
                            <div style={{ width: 100, height: 100, borderRadius: "32px", background: "#fff7ed", border: "4px solid #ea580c", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 38, fontWeight: 900, color: "#ea580c", position: "relative", overflow: "hidden" }}>
                                {topThree[2].image ? (
                                    <img src={topThree[2].image} alt={topThree[2].name || ""} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                ) : (
                                    <span>{topThree[2].name?.[0] || "?"}</span>
                                )}
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "12px 18px", background: "white", borderRadius: "24px", border: "1px solid #fed7aa", width: "180px" }}>
                                <span style={{ display: "flex", fontSize: 15, fontWeight: 900, color: "#18181b", textAlign: "center", width: "100%", overflow: "hidden" }}><span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{topThree[2].name}</span></span>
                                <span style={{ display: "flex", fontSize: 12, fontWeight: 700, color: "#71717a" }}><span>{topThree[2].uploadCount} Items</span></span>
                                <div style={{ display: "flex", marginTop: "6px", padding: "4px 10px", background: "#fff7ed", borderRadius: "8px", fontSize: 10, fontWeight: 800, color: "#ea580c" }}><span>RANK 3</span></div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Label - Fixed Overlap */}
                <div style={{ position: "absolute", bottom: "32px", display: "flex", alignItems: "center", gap: "12px", opacity: 0.5 }}>
                    <span style={{ display: "flex", fontSize: 14, fontWeight: 800, color: "#71717a", letterSpacing: "0.1em" }}>
                        <span>{totalCount} TOTAL {totalCount === 1 ? "CONTRIBUTOR" : "CONTRIBUTORS"} BUILDING THE ARCHIVE</span>
                    </span>
                </div>
            </div>
        ),
        { ...size }
    );
}
