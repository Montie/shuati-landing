import React from "react";
import {
    useCurrentFrame,
    useVideoConfig,
    spring,
    interpolate,
    AbsoluteFill,
} from "remotion";
import { BRAND } from "../design";

// Floating paper sheets that scatter and dissolve
const PaperSheet: React.FC<{
    x: number;
    y: number;
    rotation: number;
    delay: number;
    index: number;
}> = ({ x, y, rotation, delay, index }) => {
    const frame = useCurrentFrame();

    // Phase 1: Papers are static/floating (0-30)
    // Phase 2: Papers scatter and fade (30-60)
    const scatterProgress = interpolate(frame, [30, 55], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    const scatterX = x + scatterProgress * (index % 2 === 0 ? 150 : -150);
    const scatterY = y + scatterProgress * 200;
    const scatterRotation =
        rotation + scatterProgress * (index % 2 === 0 ? 45 : -30);
    const scatterOpacity = interpolate(frame, [35, 55], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    // Subtle float before scatter
    const floatY =
        frame < 30 ? Math.sin(frame * 0.08 + index * 1.5) * 5 : 0;

    return (
        <div
            style={{
                position: "absolute",
                left: scatterX,
                top: scatterY + floatY,
                width: 160,
                height: 220,
                background: "linear-gradient(145deg, #fafaf9, #e7e5e4)",
                borderRadius: 6,
                transform: `rotate(${scatterRotation}deg)`,
                opacity: scatterOpacity,
                boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                overflow: "hidden",
            }}
        >
            {/* Paper lines */}
            {[...Array(8)].map((_, i) => (
                <div
                    key={i}
                    style={{
                        position: "absolute",
                        left: 18,
                        right: 18,
                        top: 30 + i * 22,
                        height: 2,
                        background: "#d4d4d4",
                        borderRadius: 1,
                        opacity: 0.6,
                    }}
                />
            ))}
            {/* Red margin line */}
            <div
                style={{
                    position: "absolute",
                    left: 35,
                    top: 0,
                    bottom: 0,
                    width: 1.5,
                    background: "#fca5a5",
                    opacity: 0.5,
                }}
            />
            {/* Header area */}
            <div
                style={{
                    position: "absolute",
                    top: 8,
                    left: 18,
                    right: 18,
                    height: 14,
                    background: "#d1d5db",
                    borderRadius: 2,
                    opacity: 0.5,
                }}
            />
        </div>
    );
};

export const Scene3PaperToDigital: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Papers data
    const papers = [
        { x: 80, y: 500, rotation: -12 },
        { x: 320, y: 450, rotation: 8 },
        { x: 600, y: 520, rotation: -5 },
        { x: 200, y: 700, rotation: 15 },
        { x: 500, y: 680, rotation: -18 },
        { x: 150, y: 880, rotation: 10 },
        { x: 450, y: 850, rotation: -8 },
        { x: 700, y: 750, rotation: 6 },
    ];

    // Phase 2: Phone appears (frame 50-80)
    const phoneAppear = spring({
        frame: frame - 55,
        fps,
        config: { damping: 11, stiffness: 100, mass: 1.2 },
    });

    const phoneScale = interpolate(phoneAppear, [0, 1], [0.5, 1]);
    const phoneOpacity = interpolate(phoneAppear, [0, 1], [0, 1]);
    const phoneY = interpolate(phoneAppear, [0, 1], [200, 0]);

    // Background transition from warm (paper) to cool (digital)
    const bgTransition = interpolate(frame, [25, 60], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    // Text animations
    const oldTextOpacity = interpolate(frame, [0, 10, 25, 35], [0, 1, 1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    const newTextAppear = spring({
        frame: frame - 70,
        fps,
        config: { damping: 12, stiffness: 120 },
    });

    // Screen content shimmer
    const shimmer = interpolate(frame - 70, [0, 40], [-50, 150], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
    });

    return (
        <AbsoluteFill
            style={{
                fontFamily: '"Noto Sans TC", sans-serif',
                overflow: "hidden",
            }}
        >
            {/* Background transition */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background: interpolate(
                        bgTransition,
                        [0, 1],
                        [0, 1]
                    )
                        ? `linear-gradient(170deg, ${BRAND.dark} 0%, #1a1a3e 50%, #0d1b3e 100%)`
                        : "#e5e1d8",
                    transition: "none",
                }}
            />
            {/* Warm bg for paper phase */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(135deg, #fef3c7 0%, #e5e1d8 50%, #d4c6a2 100%)",
                    opacity: 1 - bgTransition,
                }}
            />
            {/* Dark bg for digital phase */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background: `linear-gradient(170deg, ${BRAND.dark} 0%, #1a1a3e 50%, #0d1b3e 100%)`,
                    opacity: bgTransition,
                }}
            />

            {/* OLD label text */}
            <div
                style={{
                    position: "absolute",
                    top: 200,
                    width: "100%",
                    textAlign: "center",
                    opacity: oldTextOpacity,
                }}
            >
                <div
                    style={{
                        fontSize: 40,
                        fontWeight: 900,
                        color: "#78716c",
                        letterSpacing: 2,
                    }}
                >
                    📄 還在翻紙本考卷？
                </div>
                <div
                    style={{
                        fontSize: 22,
                        color: "#a8a29e",
                        marginTop: 10,
                        fontWeight: 500,
                    }}
                >
                    2026 了，是時候進化了。
                </div>
            </div>

            {/* Scattered papers */}
            {papers.map((paper, i) => (
                <PaperSheet key={i} {...paper} delay={i * 2} index={i} />
            ))}

            {/* Phone mockup */}
            <div
                style={{
                    position: "absolute",
                    top: 450,
                    left: "50%",
                    transform: `translateX(-50%) translateY(${phoneY}px) scale(${phoneScale})`,
                    opacity: phoneOpacity,
                }}
            >
                {/* Phone frame */}
                <div
                    style={{
                        width: 340,
                        height: 700,
                        background: "#1a1a1a",
                        borderRadius: 44,
                        padding: 12,
                        boxShadow: `0 0 60px ${BRAND.blue}40, 0 20px 60px rgba(0,0,0,0.5)`,
                    }}
                >
                    {/* Notch */}
                    <div
                        style={{
                            position: "absolute",
                            top: 12,
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: 120,
                            height: 28,
                            background: "#1a1a1a",
                            borderBottomLeftRadius: 16,
                            borderBottomRightRadius: 16,
                            zIndex: 10,
                        }}
                    />

                    {/* Screen */}
                    <div
                        style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: 34,
                            background: `linear-gradient(180deg, #0f172a 0%, #1e293b 100%)`,
                            overflow: "hidden",
                            position: "relative",
                        }}
                    >
                        {/* App header */}
                        <div
                            style={{
                                padding: "50px 20px 16px",
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                            }}
                        >
                            <span style={{ fontSize: 24 }}>🚀</span>
                            <span
                                style={{
                                    fontSize: 18,
                                    fontWeight: 900,
                                    color: BRAND.white,
                                }}
                            >
                                刷題王
                            </span>
                            <div style={{ flex: 1 }} />
                            <div
                                style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: "50%",
                                    background: BRAND.blue,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 14,
                                    color: BRAND.white,
                                }}
                            >
                                👤
                            </div>
                        </div>

                        {/* Mini exam cards on screen */}
                        <div style={{ padding: "0 16px" }}>
                            <div
                                style={{
                                    fontSize: 14,
                                    color: "#94a3b8",
                                    fontWeight: 600,
                                    marginBottom: 12,
                                }}
                            >
                                📚 選擇考試類別
                            </div>

                            {/* Mini card grid */}
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 1fr",
                                    gap: 8,
                                }}
                            >
                                {[
                                    { icon: "📝", name: "國中會考", color: "#10b981" },
                                    { icon: "🎓", name: "學測", color: "#3b82f6" },
                                    { icon: "🔥", name: "分科測驗", color: "#f43f5e" },
                                    { icon: "🛠️", name: "統測", color: "#f97316" },
                                    { icon: "⚖️", name: "律師國考", color: "#d97706" },
                                    { icon: "🏥", name: "醫療國考", color: "#14b8a6" },
                                ].map((card, i) => {
                                    const cardAppear = spring({
                                        frame: frame - 70 - i * 5,
                                        fps,
                                        config: { damping: 12, stiffness: 180 },
                                    });

                                    return (
                                        <div
                                            key={i}
                                            style={{
                                                background: "rgba(255,255,255,0.05)",
                                                borderRadius: 12,
                                                padding: "10px 8px",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 8,
                                                border: `1px solid ${card.color}30`,
                                                opacity: cardAppear,
                                                transform: `scale(${interpolate(cardAppear, [0, 1], [0.8, 1])})`,
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: 28,
                                                    height: 28,
                                                    borderRadius: 8,
                                                    background: `${card.color}20`,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    fontSize: 14,
                                                }}
                                            >
                                                {card.icon}
                                            </div>
                                            <span
                                                style={{
                                                    fontSize: 11,
                                                    fontWeight: 700,
                                                    color: "#e2e8f0",
                                                }}
                                            >
                                                {card.name}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Shimmer effect over screen */}
                        <div
                            style={{
                                position: "absolute",
                                inset: 0,
                                background: `linear-gradient(115deg, transparent ${shimmer - 20}%, rgba(255,255,255,0.06) ${shimmer}%, transparent ${shimmer + 20}%)`,
                                pointerEvents: "none",
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* NEW label text */}
            <div
                style={{
                    position: "absolute",
                    bottom: 280,
                    width: "100%",
                    textAlign: "center",
                    opacity: interpolate(newTextAppear, [0, 1], [0, 1]),
                    transform: `translateY(${interpolate(newTextAppear, [0, 1], [20, 0])}px)`,
                }}
            >
                <div
                    style={{
                        fontSize: 36,
                        fontWeight: 900,
                        color: BRAND.white,
                        textShadow: `0 0 30px ${BRAND.blue}60`,
                        letterSpacing: 2,
                    }}
                >
                    所有考試<span style={{ color: BRAND.blue }}>，一機搞定</span>
                </div>
            </div>
        </AbsoluteFill>
    );
};
