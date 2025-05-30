import Colors from "@/constants/Colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
    useAnimatedProps,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface VitalScoreRingProps {
    score: number;
    size?: number;
    strokeWidth?: number;
    showLabel?: boolean;
}

export default function VitalScoreRing({
    score,
    size = 180,
    strokeWidth = 10,
    showLabel = true,
}: VitalScoreRingProps) {
    // Calculate ring properties
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const halfCircle = size / 2;

    // Normalize score to between 0 and 1
    const normalizedScore = Math.min(Math.max(score, 0), 100) / 100;

    // Calculate stroke dash offset based on score
    const animatedValue = useSharedValue(0);

    React.useEffect(() => {
        animatedValue.value = withTiming(normalizedScore, { duration: 1500 });
    }, [normalizedScore]);

    const animatedProps = useAnimatedProps(() => {
        const strokeDashoffset = circumference * (1 - animatedValue.value);
        return {
            strokeDashoffset,
        };
    });

    // Get color based on score
    const getScoreColor = (score: number) => {
        if (score >= 80) return Colors.nutriScore.A;
        if (score >= 60) return Colors.nutriScore.B;
        if (score >= 40) return Colors.nutriScore.C;
        if (score >= 20) return Colors.nutriScore.D;
        return Colors.nutriScore.E;
    };

    return (
        <View style={styles.container}>
            <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {/* Background circle */}
                <Circle
                    cx={halfCircle}
                    cy={halfCircle}
                    r={radius}
                    stroke={Colors.gray[200]}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                />

                {/* Score circle */}
                <AnimatedCircle
                    cx={halfCircle}
                    cy={halfCircle}
                    r={radius}
                    stroke={getScoreColor(score)}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    animatedProps={animatedProps}
                    rotation="-90"
                    origin={`${halfCircle}, ${halfCircle}`}
                />
            </Svg>

            {showLabel && (
                <View style={styles.scoreContainer}>
                    <Text style={styles.scoreText}>{score}</Text>
                    <Text style={styles.scoreLabel}>VITAL</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
    },
    scoreContainer: {
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
    },
    scoreText: {
        fontWeight: "700",
        fontSize: 36,
        color: Colors.gray[800],
    },
    scoreLabel: {
        fontSize: 12,
        fontWeight: "600",
        color: Colors.gray[500],
        letterSpacing: 1,
    },
});
