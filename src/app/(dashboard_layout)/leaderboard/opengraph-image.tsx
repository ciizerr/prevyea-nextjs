import { ImageResponse } from "next/og";
import { getLeaderboardAction } from "@/actions/leaderboard";
import fs from "fs";
import path from "path";

// export const runtime = "edge";

export const alt = "Leaderboard - PU Digital Library Hall of Fame";
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = "image/png";

export default async function Image() {
    const { data: contributors } = await getLeaderboardAction();
    const topThree = contributors?.slice(0, 3) || [];

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
                    padding: "40px",
                }}
            >
                {/* Background Decorative Mesh */}
                <div
                    style={{
                        position: "absolute",
                        top: "-10%",
                        right: "-10%",
                        width: "50%",
                        height: "80%",
                        background: "radial-gradient(circle, rgba(234, 179, 8, 0.08) 0%, transparent 70%)",
                        filter: "blur(80px)",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        bottom: "-10%",
                        left: "-10%",
                        width: "50%",
                        height: "80%",
                        background: "radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)",
                        filter: "blur(80px)",
                    }}
                />

                {/* Header Branding */}
                <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "40px" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                        src={logoData}
                        alt="Logo"

                        width="60"
                        height="60"
                        style={{ borderRadius: "16px" }}
                    />
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontSize: 28, fontWeight: 900, color: "#18181b", letterSpacing: "-0.02em" }}>PU DIGITAL LIBRARY</span>
                        <span style={{ fontSize: 12, fontWeight: 900, color: "#eab308", textTransform: "uppercase", letterSpacing: "0.2em" }}>Hall of Fame</span>
                    </div>
                </div>

                <h1 style={{ fontSize: 72, fontWeight: 900, color: "#18181b", margin: "0 0 60px 0", letterSpacing: "-0.04em" }}>
                    Top Contributors
                </h1>

                {/* Podium Section */}
                <div style={{ display: "flex", alignItems: "flex-end", gap: "30px", width: "100%", justifyContent: "center" }}>
                    {/* Rank 2 */}
                    {topThree[1] && (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
                            <div style={{ width: 120, height: 120, borderRadius: "40px", background: "#f4f4f5", border: "4px solid #d4d4d8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, fontWeight: 900, color: "#a1a1aa", position: "relative", overflow: "hidden" }}>
                                {topThree[1].image ? (
                                    <img src={topThree[1].image} alt={topThree[1].name || "Contributor"} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                ) : (
                                    <span>{topThree[1].name?.[0] || "?"}</span>
                                )}

                            </div>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "16px 24px", background: "white", borderRadius: "24px", border: "1px solid #e4e4e7", width: "200px" }}>
                                <span style={{ fontSize: 18, fontWeight: 900, color: "#18181b", textAlign: "center" }}>{topThree[1].name}</span>
                                <span style={{ fontSize: 14, fontWeight: 700, color: "#71717a" }}>#{topThree[1].uploadCount} Items</span>
                                <div style={{ marginTop: "8px", padding: "4px 12px", background: "#f4f4f5", borderRadius: "10px", fontSize: 12, fontWeight: 800, color: "#71717a" }}>RANK 2</div>
                            </div>
                        </div>
                    )}

                    {/* Rank 1 */}
                    {topThree[0] && (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", marginBottom: "40px" }}>
                            <div style={{ width: 160, height: 160, borderRadius: "54px", background: "#fefce8", border: "6px solid #eab308", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 64, fontWeight: 900, color: "#eab308", position: "relative", overflow: "hidden", boxShadow: "0 20px 40px rgba(234, 179, 8, 0.15)" }}>
                                {topThree[0].image ? (
                                    <img src={topThree[0].image} alt={topThree[0].name || "Champion"} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                ) : (
                                    <span>{topThree[0].name?.[0] || "?"}</span>
                                )}

                                <div style={{ position: "absolute", top: 0, right: 0, padding: "8px", background: "#eab308", borderBottomLeftRadius: "20px" }}>
                                    <div style={{ width: 16, height: 16, background: "white", borderRadius: "50%" }} />
                                </div>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 32px", background: "white", borderRadius: "32px", border: "2px solid #fef08a", width: "260px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
                                <span style={{ fontSize: 24, fontWeight: 900, color: "#18181b", textAlign: "center" }}>{topThree[0].name}</span>
                                <span style={{ fontSize: 18, fontWeight: 700, color: "#eab308" }}>{topThree[0].uploadCount} Uploader</span>

                                <div style={{ marginTop: "12px", padding: "6px 16px", background: "#eab308", borderRadius: "12px", fontSize: 14, fontWeight: 900, color: "white" }}>CHAMPION #1</div>
                            </div>
                        </div>
                    )}

                    {/* Rank 3 */}
                    {topThree[2] && (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
                            <div style={{ width: 110, height: 110, borderRadius: "36px", background: "#fff7ed", border: "4px solid #ea580c", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 42, fontWeight: 900, color: "#ea580c", position: "relative", overflow: "hidden" }}>
                                {topThree[2].image ? (
                                    <img src={topThree[2].image} alt={topThree[2].name || "Contributor"} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                ) : (
                                    <span>{topThree[2].name?.[0] || "?"}</span>
                                )}

                            </div>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "16px 20px", background: "white", borderRadius: "24px", border: "1px solid #fed7aa", width: "190px" }}>
                                <span style={{ fontSize: 16, fontWeight: 900, color: "#18181b", textAlign: "center" }}>{topThree[2].name}</span>
                                <span style={{ fontSize: 13, fontWeight: 700, color: "#71717a" }}>#{topThree[2].uploadCount} Items</span>
                                <div style={{ marginTop: "8px", padding: "4px 12px", background: "#fff7ed", borderRadius: "10px", fontSize: 11, fontWeight: 800, color: "#ea580c" }}>RANK 3</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Label */}
                <div style={{ position: "absolute", bottom: "40px", display: "flex", alignItems: "center", gap: "12px", opacity: 0.6 }}>
                    <span style={{ fontSize: 16, fontWeight: 800, color: "#71717a", letterSpacing: "0.1em" }}>{contributors?.length || 0} TOTAL CONTRIBUTORS BUILDING THE ARCHIVE</span>
                </div>
            </div>
        ),
        { ...size }
    );
}
