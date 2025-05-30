import { useDailyGrade } from "@/hooks/useDailyGrade";
import React from "react";
import { View } from "react-native";
import Svg, { Circle, G, Path, Text as SvgText } from "react-native-svg";

const GRADE_CONFIG = {
    A: { color: "#16a34a", mood: "happy" },
    B: { color: "#85BB2F", mood: "content" },
    C: { color: "#FECB02", mood: "neutral" },
    D: { color: "#FFB84D", mood: "worried" },
    E: { color: "#E63E11", mood: "sad" },
};

// Avocado SVG paths for different moods
const AVOCADO_PATHS = {
    happy: {
        body: "M50,20 C60,20 70,30 70,40 C70,50 60,60 50,60 C40,60 30,50 30,40 C30,30 40,20 50,20 Z",
        eyes: "M40,35 L45,35 M55,35 L60,35",
        mouth: "M40,45 Q50,55 60,45",
    },
    content: {
        body: "M50,20 C60,20 70,30 70,40 C70,50 60,60 50,60 C40,60 30,50 30,40 C30,30 40,20 50,20 Z",
        eyes: "M40,35 L45,35 M55,35 L60,35",
        mouth: "M40,45 Q50,50 60,45",
    },
    neutral: {
        body: "M50,20 C60,20 70,30 70,40 C70,50 60,60 50,60 C40,60 30,50 30,40 C30,30 40,20 50,20 Z",
        eyes: "M40,35 L45,35 M55,35 L60,35",
        mouth: "M40,45 L60,45",
    },
    worried: {
        body: "M50,20 C60,20 70,30 70,40 C70,50 60,60 50,60 C40,60 30,50 30,40 C30,30 40,20 50,20 Z",
        eyes: "M40,35 L45,35 M55,35 L60,35",
        mouth: "M40,45 Q50,40 60,45",
    },
    sad: {
        body: "M50,20 C60,20 70,30 70,40 C70,50 60,60 50,60 C40,60 30,50 30,40 C30,30 40,20 50,20 Z",
        eyes: "M40,35 L45,35 M55,35 L60,35",
        mouth: "M40,45 Q50,35 60,45",
    },
};

export default function AvocadoRing({ size = 200, strokeWidth = 12 }) {
    const { data: dailyGrade, isLoading } = useDailyGrade();
    // const displayScore = dailyGrade?.average_grade || "NA";
    const displayScore = "C";
    const gradeConfig = GRADE_CONFIG[displayScore] || GRADE_CONFIG.C;

    const radius = size / 2 - strokeWidth / 2;
    const center = size / 2;

    return (
        <View style={{ width: size, height: size }}>
            <Svg width={size} height={size}>
                {/* Background ring */}
                <Circle
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke="#e5e7eb"
                    strokeWidth={strokeWidth}
                    fill="none"
                />

                {/* Colored ring */}
                <Circle
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke={gradeConfig.color}
                    strokeWidth={strokeWidth}
                    fill="none"
                />

                {/* Avocado mascot */}
                <G transform={`translate(${center - 50}, ${center - 50})`}>
                    {/* Body */}
                    <Path
                        d={AVOCADO_PATHS[gradeConfig.mood].body}
                        fill="#86a53c"
                        stroke="#4a5c1f"
                        strokeWidth="2"
                    />

                    {/* Eyes */}
                    <Path
                        d={AVOCADO_PATHS[gradeConfig.mood].eyes}
                        stroke="#4a5c1f"
                        strokeWidth="2"
                        fill="none"
                    />

                    {/* Mouth */}
                    <Path
                        d={AVOCADO_PATHS[gradeConfig.mood].mouth}
                        stroke="#4a5c1f"
                        strokeWidth="2"
                        fill="none"
                    />
                </G>

                {/* Grade text */}
                <SvgText
                    x={center}
                    y={center + size * 0.2}
                    fontSize={32}
                    fontWeight="700"
                    fill={gradeConfig.color}
                    textAnchor="middle"
                >
                    {displayScore}
                </SvgText>
            </Svg>
        </View>
    );
}
