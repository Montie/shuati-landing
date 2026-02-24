import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Scene3ExamCards } from "./Scene3ExamCards";
import { Scene3PaperToDigital } from "./Scene3PaperToDigital";
import { Scene4BrandOutro } from "./Scene4BrandOutro";

/**
 * EP4 Full: Combined Scene 3 + Scene 4
 * 
 * Timeline (at 30fps):
 * - [0-120]   Scene 3-1: Exam Cards showcase (4s)
 * - [120-240] Scene 3-2: Paper to Digital transition (4s)
 * - [240-450] Scene 4:   Brand Outro with slogan (7s)
 * 
 * Total: 15 seconds of motion graphics
 * 
 * The first ~35s of EP4 (Scenes 1-2) will be AI-generated live action
 * and composited separately in video editing software.
 */
export const EP4Full: React.FC = () => {
    return (
        <AbsoluteFill>
            {/* Scene 3-1: Exam Cards (0s - 4s) */}
            <Sequence from={0} durationInFrames={120} name="Scene3-ExamCards">
                <Scene3ExamCards />
            </Sequence>

            {/* Scene 3-2: Paper to Digital (4s - 8s) */}
            <Sequence from={120} durationInFrames={120} name="Scene3-PaperToDigital">
                <Scene3PaperToDigital />
            </Sequence>

            {/* Scene 4: Brand Outro with Slogan (8s - 15s) */}
            <Sequence from={240} durationInFrames={210} name="Scene4-BrandOutro">
                <Scene4BrandOutro />
            </Sequence>
        </AbsoluteFill>
    );
};
