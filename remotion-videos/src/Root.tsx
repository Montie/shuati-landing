import { Composition } from "remotion";
import { Scene3ExamCards } from "./compositions/Scene3ExamCards";
import { Scene3PaperToDigital } from "./compositions/Scene3PaperToDigital";
import { Scene4BrandOutro } from "./compositions/Scene4BrandOutro";
import { EP4Full } from "./compositions/EP4Full";

export const RemotionRoot: React.FC = () => {
    return (
        <>
            {/* Individual scenes for preview */}
            <Composition
                id="Scene3-ExamCards"
                component={Scene3ExamCards}
                durationInFrames={120}
                fps={30}
                width={1080}
                height={1920}
            />
            <Composition
                id="Scene3-PaperToDigital"
                component={Scene3PaperToDigital}
                durationInFrames={120}
                fps={30}
                width={1080}
                height={1920}
            />
            <Composition
                id="Scene4-BrandOutro"
                component={Scene4BrandOutro}
                durationInFrames={300}
                fps={30}
                width={1080}
                height={1920}
            />
            {/* Full Scene 3 + 4 combined */}
            <Composition
                id="EP4-Scene3and4"
                component={EP4Full}
                durationInFrames={450}
                fps={30}
                width={1080}
                height={1920}
            />
        </>
    );
};
