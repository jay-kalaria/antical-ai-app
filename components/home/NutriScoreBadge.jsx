import React, { useEffect } from "react";
import Animated, {
    Easing,
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSequence,
    withTiming,
} from "react-native-reanimated";

const nutriScoreColors = {
    A: "#038C4C",
    B: "#85BB2F",
    C: "#FECB02",
    D: "#EF8200",
    E: "#E63E11",
};

export default function NutriScoreBadge({
    grade,
    size = "medium",
    score,
    showScore = false,
}) {
    // Animation shared values
    const scale = useSharedValue(1);
    const rotation = useSharedValue(0);
    const colorProgress = useSharedValue(0);
    const textOpacity = useSharedValue(1);
    const scoreOpacity = useSharedValue(showScore ? 1 : 0);

    // Track previous grade to detect changes
    const [prevGrade, setPrevGrade] = React.useState(grade);
    const [prevScore, setPrevScore] = React.useState(score);

    const getSize = () => {
        switch (size) {
            case "small":
                return "h-5 w-5";
            case "large":
                return showScore ? "h-24 w-24" : "h-20 w-20";
            default:
                return showScore ? "h-14 w-14" : "h-12 w-12";
        }
    };

    const getTextSize = () => {
        switch (size) {
            case "small":
                return "text-xs";
            case "large":
                return "text-4xl";
            default:
                return "text-2xl";
        }
    };

    const getScoreTextSize = () => {
        switch (size) {
            case "small":
                return "text-[8px]";
            case "large":
                return "text-lg";
            default:
                return "text-xs";
        }
    };

    // Calculate numeric value for grades for interpolation
    const getGradeValue = (grade) => {
        const values = { A: 0, B: 0.25, C: 0.5, D: 0.75, E: 1 };
        return values[grade] || 0;
    };

    useEffect(() => {
        // Only animate if grade changed
        if (grade !== prevGrade || (showScore && score !== prevScore)) {
            // Animate badge when grade changes
            textOpacity.value = withTiming(0, { duration: 200 }); // Fade out text

            // Animate after text fades out
            setTimeout(() => {
                // Set the progress value based on the new grade
                colorProgress.value = withTiming(getGradeValue(grade), {
                    duration: 500,
                    easing: Easing.inOut(Easing.quad),
                });

                // Add some playful animations
                scale.value = withSequence(
                    withTiming(1.2, { duration: 200 }),
                    withTiming(1, { duration: 300 })
                );

                rotation.value = withSequence(
                    withTiming(rotation.value - 15, { duration: 150 }),
                    withTiming(rotation.value + 30, { duration: 300 }),
                    withTiming(0, { duration: 150 })
                );

                // Fade text back in
                textOpacity.value = withDelay(
                    200,
                    withTiming(1, { duration: 300 })
                );

                if (showScore) {
                    scoreOpacity.value = withDelay(
                        350,
                        withTiming(1, { duration: 200 })
                    );
                }

                setPrevGrade(grade);
                setPrevScore(score);
            }, 200);
        }
    }, [grade, score, showScore]);

    // Create animated styles
    const animatedContainerStyle = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(
            colorProgress.value,
            [0, 0.25, 0.5, 0.75, 1],
            [
                nutriScoreColors.A,
                nutriScoreColors.B,
                nutriScoreColors.C,
                nutriScoreColors.D,
                nutriScoreColors.E,
            ]
        );

        return {
            backgroundColor,
            transform: [
                { scale: scale.value },
                { rotate: `${rotation.value}deg` },
            ],
        };
    });

    const animatedTextStyle = useAnimatedStyle(() => {
        return {
            opacity: textOpacity.value,
        };
    });

    const animatedScoreStyle = useAnimatedStyle(() => {
        return {
            opacity: scoreOpacity.value,
        };
    });

    return (
        <Animated.View
            className={`items-center justify-center rounded-full shadow-sm ${getSize()}`}
            style={animatedContainerStyle}
        >
            <Animated.Text
                className={`text-white font-extrabold ${getTextSize()}`}
                style={animatedTextStyle}
            >
                {grade}
            </Animated.Text>

            {/* {showScore && score !== undefined && (
                <Animated.Text
                    className={`text-white font-medium ${getScoreTextSize()}`}
                    style={animatedScoreStyle}
                >
                    {score}/100
                </Animated.Text>
            )} */}
        </Animated.View>
    );
}
