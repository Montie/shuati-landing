import React from "react";
import {
    useCurrentFrame,
    useVideoConfig,
    spring,
    interpolate,
    AbsoluteFill,
} from "remotion";
import { BRAND } from "../design";

export const Scene4BrandOutro: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps, durationInFrames } = useVideoConfig();

    // === Phase 1: Logo Entrance (0-60) ===
    const logoSpring = spring({
        frame,
        fps,
        config: { damping: 10, stiffness: 80, mass: 1.5 },
    });

    const logoScale = interpolate(logoSpring, [0, 1], [0.1, 1]);
    const logoOpacity = interpolate(logoSpring, [0, 1], [0, 1]);

    // === Phase 2: Slogan (60-120) ===
    // Main slogan: 刷題，進化了。
    const sloganChars = ["刷", "題", "，", "進", "化", "了", "。"];
    const sloganAppearStart = 60;

    // Sub-slogan: 每一題，都不白刷。
    const subSloganSpring = spring({
        frame: frame - 130,
        fps,
        config: { damping: 12, stiffness: 100 },
    });

    // === Phase 3: CTA (150-200) ===
    const ctaSpring = spring({
        frame: frame - 170,
        fps,
        config: { damping: 14, stiffness: 120 },
    });

    // === Background Effects ===

    // Pulsing rings behind logo
    const ringPulse1 = interpolate(frame, [0, 300], [0, 12], {
        extrapolateRight: "extend",
    });
    const ringPulse2 = interpolate(frame, [0, 300], [0, 8], {
        extrapolateRight: "extend",
    });

    // Radial particles emanating from center
    const particles = Array.from({ length: 30 }, (_, i) => {
        const angle = (i / 30) * Math.PI * 2;
        const speed = 1.5 + (i % 5) * 0.8;
        const burstFrame = 20 + (i % 10) * 3;
        const progress = Math.max(0, (frame - burstFrame) / 60);
        const radius = progress * 400 * speed;
        const opacity = interpolate(progress, [0, 0.1, 0.6, 1], [0, 0.5, 0.2, 0], {
            extrapolateRight: "clamp",
        });
        return {
            x: Math.cos(angle) * radius,
            y: Math.sin(angle) * radius,
            opacity,
            size: 2 + (i % 3) * 2,
        };
    });

    // Exit fade
    const exitOpacity = interpolate(
        frame,
        [durationInFrames - 15, durationInFrames],
        [1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );

    // === QR Code / URL ===
    const urlSpring = spring({
        frame: frame - 200,
        fps,
        config: { damping: 14, stiffness: 120 },
    });

    return (
        <AbsoluteFill
            style={{
                background: `linear-gradient(170deg, ${BRAND.dark} 0%, #0a0f2e 40%, #0d1b3e 100%)`,
                fontFamily: '"Noto Sans TC", sans-serif',
                overflow: "hidden",
                opacity: exitOpacity,
            }}
        >
            {/* Ambient background gradient */}
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    width: 600,
                    height: 600,
                    transform: "translate(-50%, -50%)",
                    background: `radial-gradient(circle, ${BRAND.blue}15 0%, transparent 70%)`,
                    filter: "blur(60px)",
                }}
            />

            {/* Pulsing rings */}
            {[1, 2, 3].map((ring) => {
                const ringSize = 200 + ring * 120 + Math.sin(ringPulse1 + ring) * 20;
                const ringOpacity = interpolate(
                    logoSpring,
                    [0, 1],
                    [0, 0.08 / ring]
                );
                return (
                    <div
                        key={ring}
                        style={{
                            position: "absolute",
                            top: "38%",
                            left: "50%",
                            width: ringSize,
                            height: ringSize,
                            transform: "translate(-50%, -50%)",
                            border: `1.5px solid ${BRAND.blue}`,
                            borderRadius: "50%",
                            opacity: ringOpacity,
                        }}
                    />
                );
            })}

            {/* Burst particles */}
            {particles.map((p, i) => (
                <div
                    key={i}
                    style={{
                        position: "absolute",
                        top: `calc(38% + ${p.y}px)`,
                        left: `calc(50% + ${p.x}px)`,
                        width: p.size,
                        height: p.size,
                        borderRadius: "50%",
                        background: i % 3 === 0 ? BRAND.blue : i % 3 === 1 ? BRAND.orange : "#60a5fa",
                        opacity: p.opacity,
                    }}
                />
            ))}

            {/* Logo Area */}
            <div
                style={{
                    position: "absolute",
                    top: "28%",
                    left: "50%",
                    transform: `translate(-50%, -50%) scale(${logoScale})`,
                    opacity: logoOpacity,
                    textAlign: "center",
                }}
            >
                {/* Rocket + Brand */}
                <div style={{ fontSize: 100, marginBottom: 20 }}>🚀</div>
                <div
                    style={{
                        fontSize: 72,
                        fontWeight: 900,
                        color: BRAND.white,
                        letterSpacing: 6,
                        textShadow: `0 0 40px ${BRAND.blue}60, 0 4px 24px rgba(0,0,0,0.5)`,
                    }}
                >
                    刷題王
                </div>
                <div
                    style={{
                        fontSize: 18,
                        fontWeight: 600,
                        color: "#94a3b8",
                        marginTop: 8,
                        letterSpacing: 4,
                    }}
                >
                    AI 智慧刷題平台
                </div>
            </div>

            {/* Main Slogan: 刷題，進化了。 */}
            <div
                style={{
                    position: "absolute",
                    top: "55%",
                    width: "100%",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "center",
                    gap: 4,
                }}
            >
                {sloganChars.map((char, i) => {
                    const charSpring = spring({
                        frame: frame - sloganAppearStart - i * 4,
                        fps,
                        config: { damping: 10, stiffness: 200, mass: 0.6 },
                    });

                    const charScale = interpolate(charSpring, [0, 1], [0, 1]);
                    const charOpacity = interpolate(charSpring, [0, 1], [0, 1]);
                    const charY = interpolate(charSpring, [0, 1], [40, 0]);

                    const isHighlighted = i >= 3 && i <= 5; // 進化了

                    return (
                        <span
                            key={i}
                            style={{
                                display: "inline-block",
                                fontSize: 64,
                                fontWeight: 900,
                                color: isHighlighted ? BRAND.blue : BRAND.white,
                                opacity: charOpacity,
                                transform: `translateY(${charY}px) scale(${charScale})`,
                                textShadow: isHighlighted
                                    ? `0 0 30px ${BRAND.blue}80`
                                    : "0 4px 16px rgba(0,0,0,0.3)",
                            }}
                        >
                            {char}
                        </span>
                    );
                })}
            </div>

            {/* Sub-slogan: 每一題，都不白刷。 */}
            <div
                style={{
                    position: "absolute",
                    top: "65%",
                    width: "100%",
                    textAlign: "center",
                    opacity: interpolate(subSloganSpring, [0, 1], [0, 1]),
                    transform: `translateY(${interpolate(subSloganSpring, [0, 1], [15, 0])}px)`,
                }}
            >
                <div
                    style={{
                        fontSize: 30,
                        fontWeight: 700,
                        color: "#94a3b8",
                        letterSpacing: 3,
                    }}
                >
                    每一題，都不白刷。
                </div>
            </div>

            {/* CTA Button */}
            <div
                style={{
                    position: "absolute",
                    top: "76%",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    opacity: interpolate(ctaSpring, [0, 1], [0, 1]),
                    transform: `scale(${interpolate(ctaSpring, [0, 1], [0.8, 1])})`,
                }}
            >
                <div
                    style={{
                        background: `linear-gradient(135deg, ${BRAND.blue}, #2563eb)`,
                        color: BRAND.white,
                        fontSize: 28,
                        fontWeight: 800,
                        padding: "18px 50px",
                        borderRadius: 16,
                        boxShadow: `0 8px 32px ${BRAND.blue}50, 0 0 60px ${BRAND.blue}20`,
                        letterSpacing: 2,
                    }}
                >
                    🚀 免費開始刷題
                </div>
            </div>

            {/* URL */}
            <div
                style={{
                    position: "absolute",
                    bottom: 260,
                    width: "100%",
                    textAlign: "center",
                    opacity: interpolate(urlSpring, [0, 1], [0, 1]),
                    transform: `translateY(${interpolate(urlSpring, [0, 1], [10, 0])}px)`,
                }}
            >
                <div
                    style={{
                        display: "inline-block",
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 12,
                        padding: "10px 30px",
                    }}
                >
                    <span
                        style={{
                            fontSize: 22,
                            fontWeight: 600,
                            color: "#64748b",
                            letterSpacing: 1,
                            fontFamily: "monospace",
                        }}
                    >
                        shuati.tw
                    </span>
                </div>
            </div>

            {/* Bottom branding bar */}
            <div
                style={{
                    position: "absolute",
                    bottom: 120,
                    width: "100%",
                    textAlign: "center",
                    opacity: interpolate(urlSpring, [0, 1], [0, 0.4]),
                }}
            >
                <div style={{ fontSize: 14, color: "#475569", letterSpacing: 1 }}>
                    © 2026 刷題王 Shuati — 你的 AI 隨身家教
                </div>
            </div>

            {/* Corner decorations */}
            <div
                style={{
                    position: "absolute",
                    bottom: 50,
                    left: 40,
                    width: 30,
                    height: 30,
                    borderBottom: `2px solid ${BRAND.blue}30`,
                    borderLeft: `2px solid ${BRAND.blue}30`,
                    borderRadius: "0 0 0 4px",
                    opacity: interpolate(ctaSpring, [0, 1], [0, 0.5]),
                }}
            />
            <div
                style={{
                    position: "absolute",
                    bottom: 50,
                    right: 40,
                    width: 30,
                    height: 30,
                    borderBottom: `2px solid ${BRAND.blue}30`,
                    borderRight: `2px solid ${BRAND.blue}30`,
                    borderRadius: "0 0 4px 0",
                    opacity: interpolate(ctaSpring, [0, 1], [0, 0.5]),
                }}
            />
        </AbsoluteFill>
    );
};
