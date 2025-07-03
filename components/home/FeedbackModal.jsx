import { useMeal } from "@/contexts/MealContext";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
    Alert,
    Animated,
    Modal,
    Share,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import MealDetailsSection from "./MealDetailsSection";

export default function FeedbackModal({ visible, tip, onClose, onEdit }) {
    const {
        getMealMetrics,
        parsedMeal,
        driverReasons,
        gradeComment,
        mealAnalysis,
        followTip,
    } = useMeal();
    const meal = getMealMetrics();

    if (!meal) return null;

    const [shareLoading, setShareLoading] = useState(false);
    const [tipFollowed, setTipFollowed] = useState(false);
    const [originalGrade, setOriginalGrade] = useState(null);

    // Get grade and score from context
    const mealScoreGrade = mealAnalysis?.grade || "NA";

    // Initialize original grade when modal opens
    React.useEffect(() => {
        if (visible && !originalGrade) {
            setOriginalGrade(mealScoreGrade);
        }
    }, [visible, mealScoreGrade, originalGrade]);

    // Helper function to get upgraded grade
    const getUpgradedGrade = (grade) => {
        const gradeMap = { E: "D", D: "C", C: "B", B: "A", A: "A" };
        return gradeMap[grade] || grade;
    };

    // Animation values
    const bounceAnim = useState(new Animated.Value(0))[0];
    const fadeAnim = useState(new Animated.Value(0))[0];

    // Start animations when modal opens
    React.useEffect(() => {
        if (visible) {
            // Reset states when modal opens
            setTipFollowed(false);
            setShareLoading(false);

            Animated.parallel([
                Animated.spring(bounceAnim, {
                    toValue: 1,
                    useNativeDriver: true,
                    tension: 50,
                    friction: 8,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            bounceAnim.setValue(0);
            fadeAnim.setValue(0);
            setTipFollowed(false);
            setShareLoading(false);
            setOriginalGrade(null);
        }
    }, [visible]);

    // Handle following tip
    const handleFollowTip = async () => {
        try {
            //console.log("Following tip...");
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            await followTip();
            setTipFollowed(true);
            //console.log("Tip followed successfully");
        } catch (error) {
            console.error("Follow tip error:", error);
            Alert.alert("Error", "Unable to upgrade grade at this time");
        }
    };

    // Share functionality
    const handleShare = async () => {
        try {
            setShareLoading(true);
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

            const shareMessage = `🥑 Just got my meal analyzed!\n\n${
                meal.name
            }\nMeal Grade: ${displayGrade}${
                tipFollowed ? " (Upgraded!)" : ""
            }\n\n${
                gradeComment ? gradeComment + "\n\n" : ""
            }#MealGrade #HealthyEating #Nutricado`;

            const result = await Share.share({
                message: shareMessage,
                title: "My Meal Grade",
            });

            if (result.action === Share.sharedAction) {
                await Haptics.notificationAsync(
                    Haptics.NotificationFeedbackType.Success
                );
            }
        } catch (error) {
            Alert.alert("Error", "Unable to share at this time");
        } finally {
            setShareLoading(false);
        }
    };

    // Get current display grade - use original grade for proper upgrading
    const baseGrade = originalGrade || mealScoreGrade;
    const displayGrade = tipFollowed
        ? getUpgradedGrade(baseGrade)
        : mealScoreGrade;

    // Get gradient colors based on grade
    const getGradientColors = (grade) => {
        switch (grade) {
            case "A":
                return ["#22c55e", "#16a34a"];
            case "B":
                return ["#84cc16", "#65a30d"];
            case "C":
                return ["#eab308", "#ca8a04"];
            case "D":
                return ["#f97316", "#ea580c"];
            case "E":
                return ["#ef4444", "#dc2626"];
            default:
                return ["#6b7280", "#4b5563"];
        }
    };

    const gradientColors = getGradientColors(displayGrade);

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="none"
            onRequestClose={onClose}
        >
            <BlurView intensity={50} tint="dark" className="flex-1 justify-end">
                <Animated.View
                    style={{
                        transform: [
                            {
                                translateY: bounceAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [400, 0],
                                }),
                            },
                        ],
                        opacity: fadeAnim,
                    }}
                    className="rounded-t-3xl overflow-hidden"
                >
                    {/* Hero Section with Gradient */}
                    <LinearGradient
                        colors={["#22c55e", "#22c55e", "#dcfce7"]}
                        locations={[0, 0.5, 1]}
                        className="pt-6 pb-8"
                    >
                        {/* Close Button */}
                        <TouchableOpacity
                            onPress={onClose}
                            className="absolute top-4 right-4 z-10 w-8 h-8 bg-black/20 rounded-full items-center justify-center"
                            style={{ marginTop: 8 }}
                        >
                            <Ionicons name="close" size={20} color="white" />
                        </TouchableOpacity>

                        {/* Share Button */}
                        <TouchableOpacity
                            onPress={handleShare}
                            disabled={shareLoading}
                            className="absolute top-4 left-4 z-10 bg-white/20 rounded-full px-3 py-2 flex-row items-center"
                            style={{
                                marginTop: 8,
                                opacity: shareLoading ? 0.7 : 1,
                            }}
                        >
                            <Ionicons
                                name={
                                    shareLoading ? "hourglass" : "share-outline"
                                }
                                size={16}
                                color="white"
                            />
                            <Text className="text-white font-medium text-sm ml-1">
                                Share
                            </Text>
                        </TouchableOpacity>

                        {/* Main Grade Display */}
                        <View className="items-center px-6 pt-8">
                            <Text className="text-white/80 text-sm font-medium mb-8 text-center uppercase tracking-wider">
                                YOUR MEAL GRADE
                            </Text>

                            {/* Grade Letter */}
                            <View className="w-32 h-32 rounded-full bg-white/20 border-4 border-white/30 items-center justify-center mb-6">
                                <Text
                                    className="text-white text-8xl font-black"
                                    style={{
                                        textAlign: "center",
                                        textAlignVertical: "center",
                                        includeFontPadding: false,
                                        lineHeight: 96, // Roughly matches the text size for better centering
                                    }}
                                >
                                    {displayGrade}
                                </Text>
                            </View>

                            {tipFollowed && (
                                <View className="bg-white/20 rounded-full px-4 py-2 mb-4">
                                    <Text className="text-white font-semibold text-sm">
                                        Upgraded from {baseGrade}!
                                    </Text>
                                </View>
                            )}

                            <Text
                                className="text-white text-xl font-bold text-center mb-6"
                                numberOfLines={2}
                                ellipsizeMode="tail"
                            >
                                {meal.name}
                            </Text>
                        </View>
                    </LinearGradient>

                    {/* Content Section */}
                    <View className="bg-white">
                        {gradeComment && (
                            <View className="px-6 py-4">
                                <View className="bg-gray-50 rounded-2xl p-4 border-l-4 border-green-500">
                                    <View className="flex-row items-center mb-2">
                                        <Ionicons
                                            name="bulb-outline"
                                            size={16}
                                            color={gradientColors[0]}
                                        />
                                        <Text className="text-gray-800 font-semibold ml-2">
                                            Personalized Feedback
                                        </Text>
                                    </View>
                                    <Text className="text-gray-700 text-[15px] leading-5 mb-4">
                                        {gradeComment}
                                    </Text>

                                    

                                    {/* Tip Follow Button */}
                                    {!tipFollowed && mealScoreGrade !== "A" && (
                                        <TouchableOpacity
                                            onPress={handleFollowTip}
                                            className="bg-white py-3 px-4 rounded-lg flex-row items-center justify-center"
                                        >
                                            <Ionicons
                                                name="checkmark-circle"
                                                size={18}
                                                color="#22c55e"
                                            />
                                            <Text className="text-green-700 font-semibold ml-2">
                                                I followed this tip!
                                            </Text>
                                        </TouchableOpacity>
                                    )}

                                    {tipFollowed && (
                                        <View className="bg-green-100 py-3 px-4 rounded-lg flex-row items-center justify-center">
                                            <Ionicons
                                                name="checkmark-circle"
                                                size={18}
                                                color="#22c55e"
                                            />
                                            <Text className="text-green-700 font-semibold ml-2">
                                                Great job! Grade upgraded from{" "}
                                                {baseGrade} to{" "}
                                                {getUpgradedGrade(baseGrade)}!
                                            </Text>
                                        </View>
                                    )}

                                    {/* {mealScoreGrade === "A" && (
                                        <View className="bg-yellow-100 py-3 px-4 rounded-lg flex-row items-center justify-center">
                                            <Ionicons
                                                name="star"
                                                size={18}
                                                color="#eab308"
                                            />
                                            <Text className="text-yellow-700 font-semibold ml-2">
                                                Perfect grade! Keep it up!
                                            </Text>
                                        </View>
                                    )} */}
                                </View>
                            </View>
                        )}

                        {/* Key Factors */}
                        {/* {driverReasons && driverReasons.length > 0 && (
                            <View className="px-6 pb-4">
                                <Text className="text-gray-500 text-xs font-medium mb-3 uppercase tracking-wide">
                                    Key Factors
                                </Text>
                                <View className="flex-row flex-wrap">
                                    {driverReasons.map((reason, index) => (
                                        <View
                                            key={index}
                                            className="bg-gray-100 rounded-full px-3 py-2 mr-2 mb-2 border"
                                            style={{
                                                borderColor:
                                                    gradientColors[0] + "20",
                                            }}
                                        >
                                            <Text className="text-gray-700 text-xs font-medium">
                                                {reason}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        )} */}

                        {/* Modular Details Section */}
                        <MealDetailsSection
                            meal={meal}
                            parsedMeal={parsedMeal}
                            gradientColors={gradientColors}
                        />

                        {/* Action Buttons */}
                        <View className="px-6 pt-4 pb-8 border-t border-gray-100">
                            <View className="flex-row space-x-3">
                                <TouchableOpacity
                                    className="bg-green-100 flex-1 py-4 rounded-xl items-center mr-3"
                                    onPress={onClose}
                                >
                                    <Text className=" text-green-700 font-semibold text-base">
                                        Awesome!
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    className="flex-1 border border-gray-300 py-4 rounded-xl items-center"
                                    onPress={onEdit}
                                >
                                    <Text className="text-gray-600 font-medium">
                                        Edit Meal
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Animated.View>
            </BlurView>
        </Modal>
    );
}
