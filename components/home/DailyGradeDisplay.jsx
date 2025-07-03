import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withTiming,
} from "react-native-reanimated";

const gradeColors = {
    A: "#038C4C", // Green
    B: "#85BB2F", // Light green
    C: "#FECB02", // Yellow
    D: "#EF8200", // Orange
    E: "#E63E11", // Red
};

export default function DailyGradeDisplay({
    currentGrade = "A",
    size = "medium",
    showLabel = true,
}) {
    const grades = ["A", "B", "C", "D", "E"];

    // Animation shared values for the highlight effect
    const highlightScale = useSharedValue(1);

    // Track previous grade to detect changes
    const [prevGrade, setPrevGrade] = React.useState(currentGrade);

    const getSizeClasses = () => {
        switch (size) {
            case "small":
                return {
                    container: "h-8",
                    gradeSegment: "flex-1 h-8",
                    text: "text-sm",
                    borderRadius: 16,
                };
            case "large":
                return {
                    container: "h-16",
                    gradeSegment: "flex-1 h-16",
                    text: "text-2xl",
                    borderRadius: 32,
                };
            default:
                return {
                    container: "h-12",
                    gradeSegment: "flex-1 h-12",
                    text: "text-lg",
                    borderRadius: 24,
                };
        }
    };

    const sizeClasses = getSizeClasses();

    useEffect(() => {
        if (currentGrade !== prevGrade) {
            // Animate when grade changes
            highlightScale.value = withSequence(
                withTiming(1.05, {
                    duration: 200,
                    easing: Easing.out(Easing.quad),
                }),
                withTiming(1, { duration: 200 })
            );
            setPrevGrade(currentGrade);
        }
    }, [currentGrade]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: highlightScale.value }],
        };
    });

    const getSegmentStyle = (grade, index) => {
        const isActive = grade === currentGrade;
        const baseColor = gradeColors[grade];

        // For inactive grades, use a muted version (50% opacity overlay with white)
        const backgroundColor = isActive ? baseColor : `${baseColor}80`; // 80 = 50% opacity in hex

        let borderRadius = {};

        // First segment gets left rounded corners
        if (index === 0) {
            borderRadius = {
                borderTopLeftRadius: sizeClasses.borderRadius,
                borderBottomLeftRadius: sizeClasses.borderRadius,
            };
        }
        // Last segment gets right rounded corners
        else if (index === grades.length - 1) {
            borderRadius = {
                borderTopRightRadius: sizeClasses.borderRadius,
                borderBottomRightRadius: sizeClasses.borderRadius,
            };
        }

        return {
            backgroundColor,
            ...borderRadius,
        };
    };

    return (
        <View className="items-center">
            {showLabel && (
                <Animated.Text className="text-gray-600 text-xs font-medium mb-2 uppercase tracking-wider">
                    Daily Grade
                </Animated.Text>
            )}

            <Animated.View
                className={`flex-row ${sizeClasses.container} shadow-sm`}
                style={[
                    animatedStyle,
                    {
                        borderRadius: sizeClasses.borderRadius,
                        overflow: "hidden",
                    },
                ]}
            >
                {grades.map((grade, index) => (
                    <View
                        key={grade}
                        className={`${sizeClasses.gradeSegment} items-center justify-center`}
                        style={getSegmentStyle(grade, index)}
                    >
                        <Animated.Text
                            className={`font-extrabold ${sizeClasses.text} ${
                                grade === currentGrade
                                    ? "text-white"
                                    : "text-white opacity-70"
                            }`}
                        >
                            {grade}
                        </Animated.Text>
                    </View>
                ))}
            </Animated.View>
        </View>
    );
}
