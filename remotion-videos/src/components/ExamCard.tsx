import React from "react";
import {
    useCurrentFrame,
    useVideoConfig,
    spring,
    interpolate,
} from "remotion";

interface ExamCardProps {
    icon: string;
    name: string;
    color: string;
    bgGlow: string;
    label: string;
    comingSoon?: boolean;
    delay: number; // in frames
    index: number;
}

export const ExamCard: React.FC<ExamCardProps> = ({
    icon,
    name,
    color,
    bgGlow,
    label,
    comingSoon,
    delay,
    index,
}) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // Entry animation with spring
    const appear = spring({
        frame: frame - delay,
        fps,
        config: { damping: 12, stiffness: 200, mass: 0.8 },
    });

    const scale = interpolate(appear, [0, 1], [0.3, 1]);
    const opacity = interpolate(appear, [0, 1], [0, 1]);
    const translateY = interpolate(appear, [0, 1], [60, 0]);
    const rotate = interpolate(appear, [0, 1], [-8, 0]);

    // Subtle floating after landing
    const floatOffset = Math.sin((frame - delay) * 0.04 + index * 1.2) * 3;

    // Shine sweep effect (after card has appeared)
    const shineProgress = interpolate(
        frame - delay - 10,
        [0, 20],
        [-100, 200],
        { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
    );

    return (
        <div
            style={{
                opacity,
                transform: `translateY(${translateY + floatOffset}px) scale(${scale}) rotate(${rotate}deg)`,
                width: 280,
                position: "relative",
            }}
        >
            {/* Glow behind card */}
            <div
                style={{
                    position: "absolute",
                    inset: -20,
                    background: `radial-gradient(circle, ${bgGlow} 0%, transparent 70%)`,
                    borderRadius: 40,
                    filter: "blur(20px)",
                    opacity: appear * 0.6,
                }}
            />

            {/* Card body */}
            <div
                style={{
                    position: "relative",
                    background: "rgba(255, 255, 255, 0.95)",
                    borderRadius: 24,
                    border: `3px solid ${color}40`,
                    padding: "28px 24px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 16,
                    overflow: "hidden",
                    boxShadow: `0 8px 32px ${color}20, 0 2px 8px rgba(0,0,0,0.06)`,
                }}
            >
                {/* Shine sweep */}
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: `${shineProgress}%`,
                        width: "40%",
                        height: "100%",
                        background:
                            "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                        transform: "skewX(-20deg)",
                        pointerEvents: "none",
                    }}
                />

                {/* Icon circle */}
                <div
                    style={{
                        width: 80,
                        height: 80,
                        borderRadius: "50%",
                        background: `linear-gradient(135deg, ${color}15, ${color}30)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 42,
                        boxShadow: `inset 0 2px 8px ${color}10`,
                    }}
                >
                    {icon}
                </div>

                {/* Name */}
                <div
                    style={{
                        fontSize: 26,
                        fontWeight: 900,
                        color: "#1e293b",
                        letterSpacing: 1,
                        fontFamily: '"Noto Sans TC", sans-serif',
                    }}
                >
                    {name}
                </div>

                {/* Label badge */}
                <div
                    style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: comingSoon ? "#94a3b8" : color,
                        background: comingSoon ? "#f1f5f920" : `${color}12`,
                        padding: "4px 14px",
                        borderRadius: 20,
                        border: comingSoon
                            ? "1.5px dashed #cbd5e1"
                            : `1.5px solid ${color}30`,
                        letterSpacing: 0.5,
                        fontFamily: '"Noto Sans TC", sans-serif',
                    }}
                >
                    {label}
                </div>

                {/* Coming Soon overlay */}
                {comingSoon && (
                    <div
                        style={{
                            position: "absolute",
                            top: 12,
                            right: 12,
                            fontSize: 10,
                            fontWeight: 800,
                            color: "#8b5cf6",
                            background: "#ede9fe",
                            padding: "3px 10px",
                            borderRadius: 8,
                            fontFamily: '"Noto Sans TC", sans-serif',
                        }}
                    >
                        🔜 即將上線
                    </div>
                )}
            </div>
        </div>
    );
};
