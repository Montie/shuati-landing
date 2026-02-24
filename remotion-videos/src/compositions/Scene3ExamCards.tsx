import React from "react";
import {
    useCurrentFrame,
    useVideoConfig,
    spring,
    interpolate,
    AbsoluteFill,
} from "remotion";
import { ExamCard } from "../components/ExamCard";
import { EXAM_CARDS, BRAND } from "../design";

export const Scene3ExamCards: React.FC = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Background particles
    const particles = Array.from({ length: 20 }, (_, i) => ({
        x: 15 + (i * 37) % 85,
        y: 10 + (i * 53) % 80,
        size: 3 + (i % 4) * 2,
        speed: 0.3 + (i % 3) * 0.2,
        delay: i * 3,
    }));

    // Title animation
    const titleAppear = spring({
        frame,
        fps,
        config: { damping: 14, stiffness: 120 },
    });

    // Voiceover text timing (for "你的考試，我們——都有。")
    const voiceoverAppear = spring({
        frame: frame - 95,
        fps,
        config: { damping: 12, stiffness: 100 },
    });

    const voiceoverScale = interpolate(voiceoverAppear, [0, 1], [0.8, 1]);
    const voiceoverOpacity = interpolate(voiceoverAppear, [0, 1], [0, 1]);

    // Grid layout for 7 cards in a nice arrangement
    // Row 1: 3 cards, Row 2: 2 cards, Row 3: 2 cards
    const cardPositions = [
        // Row 1 - Upgrade exams
        { x: 120, y: 440 },
        { x: 400, y: 440 },
        { x: 680, y: 440 },
        // Row 2 - TVE + Law
        { x: 200, y: 700 },
        { x: 540, y: 700 },
        // Row 3 - Medical + Civil
        { x: 200, y: 960 },
        { x: 540, y: 960 },
    ];

    return (
        <AbsoluteFill
            style={{
                background: `linear-gradient(170deg, ${BRAND.dark} 0%, #1a1a3e 40%, #0d1b3e 100%)`,
                fontFamily: '"Noto Sans TC", sans-serif',
                overflow: "hidden",
            }}
        >
            {/* Animated background particles */}
            {particles.map((p, i) => {
                const pOpacity = interpolate(
                    frame - p.delay,
                    [0, 15, 60, 75],
                    [0, 0.15, 0.15, 0],
                    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                );
                const pY = p.y - frame * p.speed * 0.3;
                return (
                    <div
                        key={i}
                        style={{
                            position: "absolute",
                            left: `${p.x}%`,
                            top: `${pY % 100}%`,
                            width: p.size,
                            height: p.size,
                            borderRadius: "50%",
                            background: BRAND.blue,
                            opacity: pOpacity,
                            filter: "blur(1px)",
                        }}
                    />
                );
            })}

            {/* Background grid pattern */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
                    backgroundSize: "60px 60px",
                    opacity: 0.5,
                }}
            />

            {/* Section Header */}
            <div
                style={{
                    position: "absolute",
                    top: 140,
                    width: "100%",
                    textAlign: "center",
                    opacity: titleAppear,
                    transform: `translateY(${interpolate(titleAppear, [0, 1], [30, 0])}px)`,
                }}
            >
                {/* Small badge */}
                <div
                    style={{
                        display: "inline-block",
                        padding: "6px 20px",
                        borderRadius: 20,
                        background: "rgba(99, 102, 241, 0.15)",
                        border: "1px solid rgba(99, 102, 241, 0.3)",
                        color: "#a5b4fc",
                        fontSize: 14,
                        fontWeight: 700,
                        letterSpacing: 2,
                        marginBottom: 20,
                    }}
                >
                    📚 考試類別
                </div>

                {/* Title */}
                <div
                    style={{
                        fontSize: 48,
                        fontWeight: 900,
                        color: BRAND.white,
                        lineHeight: 1.3,
                        textShadow: "0 4px 20px rgba(0,0,0,0.3)",
                    }}
                >
                    選擇你的
                    <br />
                    <span
                        style={{
                            background: `linear-gradient(135deg, ${BRAND.blue}, #60a5fa)`,
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                    >
                        戰場
                    </span>
                </div>
            </div>

            {/* Exam Cards Grid */}
            {EXAM_CARDS.map((card, i) => (
                <div
                    key={card.id}
                    style={{
                        position: "absolute",
                        left: cardPositions[i].x,
                        top: cardPositions[i].y,
                        transformOrigin: "center center",
                    }}
                >
                    <ExamCard
                        icon={card.icon}
                        name={card.name}
                        color={card.color}
                        bgGlow={card.bgGlow}
                        label={card.label}
                        comingSoon={card.comingSoon}
                        delay={15 + i * 10}
                        index={i}
                    />
                </div>
            ))}

            {/* Bottom voiceover text */}
            <div
                style={{
                    position: "absolute",
                    bottom: 280,
                    width: "100%",
                    textAlign: "center",
                    opacity: voiceoverOpacity,
                    transform: `scale(${voiceoverScale})`,
                }}
            >
                <div
                    style={{
                        fontSize: 52,
                        fontWeight: 900,
                        color: BRAND.white,
                        textShadow: `0 0 40px ${BRAND.blue}80, 0 4px 16px rgba(0,0,0,0.4)`,
                        letterSpacing: 3,
                    }}
                >
                    你的考試
                    <br />
                    我們<span style={{ color: BRAND.blue }}>都有。</span>
                </div>
            </div>

            {/* Decorative corner accents */}
            <div
                style={{
                    position: "absolute",
                    top: 60,
                    left: 40,
                    width: 40,
                    height: 40,
                    borderTop: `3px solid ${BRAND.blue}40`,
                    borderLeft: `3px solid ${BRAND.blue}40`,
                    borderRadius: "4px 0 0 0",
                    opacity: titleAppear * 0.5,
                }}
            />
            <div
                style={{
                    position: "absolute",
                    top: 60,
                    right: 40,
                    width: 40,
                    height: 40,
                    borderTop: `3px solid ${BRAND.blue}40`,
                    borderRight: `3px solid ${BRAND.blue}40`,
                    borderRadius: "0 4px 0 0",
                    opacity: titleAppear * 0.5,
                }}
            />
        </AbsoluteFill>
    );
};
