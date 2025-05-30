import Colors from "@/constants/Colors";
import * as Haptics from "expo-haptics";
import React, { useEffect, useRef } from "react";
import {
    ActivityIndicator,
    Animated,
    Image,
    Platform,
    TouchableOpacity,
    View,
} from "react-native";

export default function CaptureButton({
    onPress,
    size,
    isRecording = false,
    isProcessing = false,
}) {
    const pulseAnim = useRef(new Animated.Value(1)).current;

    const triggerHaptic = () => {
        if (Platform.OS !== "web") {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
    };

    useEffect(() => {
        if (isRecording) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.1,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        } else {
            pulseAnim.setValue(1);
        }
    }, [isRecording, pulseAnim]);

    const handlePress = () => {
        if (isProcessing) return; // Disable button while processing
        triggerHaptic();
        onPress();
    };

    return (
        <View className="items-center justify-center">
            <Animated.View
                style={{
                    transform: [{ scale: pulseAnim }],
                }}
            >
                <TouchableOpacity
                    activeOpacity={isProcessing ? 1 : 0.8}
                    onPress={handlePress}
                    disabled={isProcessing}
                >
                    {isProcessing ? (
                        <ActivityIndicator
                            size="large"
                            color={Colors.primary}
                        />
                    ) : (
                        <Image
                            source={require("@/assets/app_images/avacodo.png")}
                            style={{
                                width: size,
                                height: size,
                                resizeMode: "contain",
                            }}
                        />
                    )}
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
}
