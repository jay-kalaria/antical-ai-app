import { useDailyGrade } from "@/hooks/useDailyGrade";
import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
    Easing,
    useAnimatedProps,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import Svg, {
    Circle,
    Defs,
    G,
    Line,
    LinearGradient,
    Path,
    Stop,
    Text as SvgText,
} from "react-native-svg";

const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedLine = Animated.createAnimatedComponent(Line);

// Angle (deg) and brand colour for each score
const SCORE_CONFIG = {
    A: { angle: -90, color: "#16a34a" }, // Point to leftmost position (green)
    B: { angle: -45, color: "#85BB2F" }, // Point towards left-center (light green)
    C: { angle: 0, color: "#FECB02" }, // Point to top center (yellow)
    D: { angle: 45, color: "#FFB84D" }, // Point towards right-center (orange)
    E: { angle: 90, color: "#E63E11" }, // Point to rightmost position (red)
};

function polarToCartesian(cx, cy, r, angle) {
    const rad = (Math.PI / 180) * angle;
    return {
        x: cx + r * Math.cos(rad),
        y: cy - r * Math.sin(rad),
    };
}

function describeArc(cx, cy, r, startAngle, endAngle) {
    const start = polarToCartesian(cx, cy, r, endAngle);
    const end = polarToCartesian(cx, cy, r, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}

export default function MealGauge({
    score = "NA",
    size = 260,
    strokeWidth = 18,
    animationDuration = 800,
}) {
    const { data: dailyGrade, isLoading } = useDailyGrade();

    // Use daily grade if available, otherwise fall back to prop score
    //const displayScore = dailyGrade?.average_grade || score;
    const displayScore = "A";
    console.log("displayScore", displayScore);

    const radius = size / 2 - strokeWidth / 2;
    const cx = size / 2;
    const cy = size / 2;

    // Shared animated value for the pointer angle
    const pointerAngle = useSharedValue(
        SCORE_CONFIG[displayScore]?.angle ?? 90
    );

    // Whenever the score prop changes, animate the pointer to the new angle
    useEffect(() => {
        pointerAngle.value = withTiming(
            SCORE_CONFIG[displayScore]?.angle ?? 90,
            {
                duration: animationDuration,
                easing: Easing.bezier(0.4, 0, 0.2, 1),
            }
        );
    }, [displayScore, animationDuration]);

    // Guitar pick shape (triangle with rounded base)
    const pickLength = radius - strokeWidth - 55; // length from center to tip
    const pickWidth = 20; // width of the base of the pick
    const pickBaseRadius = 10; // how rounded the base is

    // Path for a guitar pick, centered at (0,0), pointing up
    function getPickPath() {
        // Tip at (0, -pickLength)
        // Base left at (-pickWidth/2, 0)
        // Base right at (pickWidth/2, 0)
        // Use arc for rounded base
        return (
            `M 0,${-pickLength} ` +
            `L ${-pickWidth / 2},0 ` +
            `A ${pickBaseRadius},${pickBaseRadius} 0 0 0 ${pickWidth / 2},0 Z`
        );
    }

    // Animated props for the group rotation
    const animatedGroupProps = useAnimatedProps(() => ({
        // SVG rotate(angle, cx, cy)
        // react-native-svg expects the prop as a string: "angle cx cy"
        rotate: `${pointerAngle.value} ${cx} ${cy}`,
    }));

    // Static arc path – half‑circle from 180° to 0°
    const arcPath = describeArc(cx, cy, radius, 180, 0);

    // Unique gradient id for multiple component instances in the same tree
    const gradientId = React.useMemo(
        () => `grad-${Math.random().toString(36).slice(2, 9)}`,
        []
    );

    return (
        <View>
            <View style={{ width: size, height: size / 2 + strokeWidth }}>
                <Svg width={size} height={size / 2 + strokeWidth}>
                    <Defs>
                        <LinearGradient
                            id={gradientId}
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="0%"
                        >
                            <Stop offset="0%" stopColor="#16a34a" />
                            <Stop offset="25%" stopColor="#85BB2F" />
                            <Stop offset="50%" stopColor="#FECB02" />
                            <Stop offset="75%" stopColor="#FFB84D" />
                            <Stop offset="100%" stopColor="#E63E11" />
                        </LinearGradient>
                    </Defs>

                    {/* Grey background track */}
                    <Path
                        d={arcPath}
                        stroke="#e5e7eb"
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        fill="none"
                    />

                    {/* Gradient arc on top of the track */}
                    <Path
                        d={arcPath}
                        stroke={`url(#${gradientId})`}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        fill="none"
                    />

                    {/* Guitar pick needle (animated group for rotation) */}
                    <AnimatedG
                        animatedProps={animatedGroupProps}
                        originX={cx}
                        originY={cy}
                    >
                        <Path
                            d={getPickPath()}
                            fill="#16a34a"
                            opacity={0.95}
                            x={cx}
                            y={cy}
                        />
                    </AnimatedG>

                    {/* Center knob */}
                    <Circle
                        cx={cx}
                        cy={cy}
                        r={strokeWidth / 2}
                        fill="#16a34a"
                    />

                    {/* Letter label */}
                    <SvgText
                        x={cx}
                        y={cy - radius / 2}
                        fontSize={48}
                        fontWeight="700"
                        fill={SCORE_CONFIG[displayScore]?.color ?? "#374151"}
                        textAnchor="middle"
                    >
                        {displayScore}
                    </SvgText>
                </Svg>
            </View>
            {/* <Text className="text-xs text-primary -mt-1 mb-1 text-center">
                Tap to change grade
            </Text> */}
        </View>
    );
}
