import Colors from "@/constants/Colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Speedometer, {
    Arc,
    Background,
    Indicator,
    Marks,
    Needle,
    Progress,
} from "react-native-cool-speedometer";

// Use our theme's nutriscore colors
const mapping = {
    A: { value: 90, color: Colors.nutriScore.A },
    B: { value: 70, color: Colors.nutriScore.B },
    C: { value: 50, color: Colors.nutriScore.C },
    D: { value: 30, color: Colors.nutriScore.D },
    E: { value: 10, color: Colors.nutriScore.E },
};

export default function MealSpeedometer({ score = "A", size = 260 }) {
    // Use primary color as fallback
    const { value, color } = mapping[score] ?? {
        value: 0,
        color: Colors.primary,
    };

    console.log("MealSpeedometer color:", color); // Debug log

    return (
        <View style={styles.container}>
            <Speedometer
                value={value}
                min={0}
                max={100}
                angle={180} // half-circle
                width={size}
                height={size * 0.6} // keep some margin at the bottom
            >
                <Background angle={180} color="#E5E7EB" />
                <Arc arcWidth={18} color="#E5E7EB" />
                <Progress accentColor={color} arcWidth={18} />
                <Needle color={Colors.gray[600]} baseColor={Colors.gray[600]} />
                <Marks step={20} color={Colors.gray[400]} />
                <Indicator>
                    {(_, textProps) => (
                        <Text
                            {...textProps}
                            y={size * 0.55}
                            fontSize={48}
                            fill={color}
                            textAnchor="middle"
                        >
                            {score}
                        </Text>
                    )}
                </Indicator>
            </Speedometer>
            <Text style={[styles.scoreLabel, { color: Colors.gray[500] }]}>
                Today's Score
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 20,
    },
    scoreLabel: {
        fontSize: 16,
        marginTop: 10,
    },
});
