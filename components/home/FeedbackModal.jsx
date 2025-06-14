import { useMeal } from "@/contexts/MealContext";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
    Alert,
    Animated,
    Dimensions,
    Modal,
    ScrollView,
    Share,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function FeedbackModal({ visible, tip, onClose, onEdit }) {
    const {
        getMealMetrics,
        parsedMeal,
        driverReasons,
        gradeComment,
        mealAnalysis,
    } = useMeal();
    const meal = getMealMetrics();

    if (!meal) return null;

    const [showDetails, setShowDetails] = useState(false);
    const [shareLoading, setShareLoading] = useState(false);

    // Get grade and score from context mealAnalysis
    const mealScoreGrade = mealAnalysis?.grade || "NA";
    const mealScoreValue = mealAnalysis?.score || 0;

    // Animation values
    const bounceAnim = useState(new Animated.Value(0))[0];
    const fadeAnim = useState(new Animated.Value(0))[0];

    // Start animations when modal opens
    React.useEffect(() => {
        if (visible) {
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
        }
    }, [visible]);

    // Get gradient colors based on grade
    const getGradientColors = (grade) => {
        switch (grade) {
            case "A":
                return ["#22c55e", "#16a34a"]; // Green
            case "B":
                return ["#84cc16", "#65a30d"]; // Lime
            case "C":
                return ["#eab308", "#ca8a04"]; // Yellow
            case "D":
                return ["#f97316", "#ea580c"]; // Orange
            case "E":
                return ["#ef4444", "#dc2626"]; // Red
            default:
                return ["#6b7280", "#4b5563"]; // Gray
        }
    };

    // Share functionality
    const handleShare = async () => {
        try {
            setShareLoading(true);
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

            const shareMessage = `🥑 Just got my meal analyzed!\n\n${
                meal.name
            }\nMeal Grade: ${mealScoreGrade}\n\n${
                gradeComment ? gradeComment + "\n\n" : ""
            }#MealGrade #HealthyEating #Nutricado`;

            const result = await Share.share({
                message: shareMessage,
                title: "My Meal Grade",
            });

            if (result.action === Share.sharedAction) {
                // Shared successfully
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

    const gradientColors = getGradientColors(mealScoreGrade);

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
                        colors={[...gradientColors, "#ffffff"]}
                        locations={[0, 0.4, 1]}
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

                        {/* Main Grade Display */}
                        <View className="items-center px-6 pt-8">
                            <Text className="text-white/80 text-sm font-medium mb-8 text-center uppercase tracking-wider">
                                YOUR MEAL GRADE
                            </Text>

                            {/* Grade Letter */}
                            <Animated.View
                                style={{
                                    transform: [
                                        {
                                            scale: bounceAnim.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [0.8, 1],
                                            }),
                                        },
                                    ],
                                }}
                                className="w-32 h-32 bg-white/20 rounded-full items-center justify-center border-4 border-white/30 mb-6"
                            >
                                <Text className="text-white text-8xl font-black">
                                    {mealScoreGrade}
                                </Text>
                            </Animated.View>

                            <Text
                                className="text-white text-xl font-bold text-center mb-6"
                                numberOfLines={2}
                                ellipsizeMode="tail"
                            >
                                {meal.name}
                            </Text>
                        </View>

                        {/* Share Button - Prominent */}
                        <View className="px-6">
                            <TouchableOpacity
                                onPress={handleShare}
                                disabled={shareLoading}
                                className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl py-4 flex-row items-center justify-center"
                                style={{ opacity: shareLoading ? 0.7 : 1 }}
                            >
                                <Ionicons
                                    name={
                                        shareLoading
                                            ? "hourglass"
                                            : "share-outline"
                                    }
                                    size={20}
                                    color="white"
                                />
                                <Text className="text-white font-semibold text-base ml-2">
                                    {shareLoading
                                        ? "Sharing..."
                                        : "Share My Grade"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </LinearGradient>

                    {/* Content Section */}
                    <View className="bg-white">
                        {gradeComment && (
                            <View className="px-6 py-4">
                                <View
                                    className="bg-gray-50 rounded-2xl p-4 border-l-4"
                                    style={{
                                        borderLeftColor: gradientColors[0],
                                    }}
                                >
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
                                    <Text className="text-gray-700 text-[15px] leading-5">
                                        {gradeComment}
                                    </Text>
                                </View>
                            </View>
                        )}

                        {/* Key Factors */}
                        {driverReasons && driverReasons.length > 0 && (
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
                        )}

                        {/* Expandable Details */}
                        <TouchableOpacity
                            onPress={() => {
                                setShowDetails(!showDetails);
                                Haptics.impactAsync(
                                    Haptics.ImpactFeedbackStyle.Light
                                );
                            }}
                            className="px-6 py-3 flex-row items-center justify-center border-t border-gray-100"
                        >
                            <Text className="text-gray-600 font-medium mr-1">
                                {showDetails
                                    ? "Show Less"
                                    : "Show Detailed Breakdown"}
                            </Text>
                            <Ionicons
                                name={
                                    showDetails ? "chevron-up" : "chevron-down"
                                }
                                size={16}
                                color="#6b7280"
                            />
                        </TouchableOpacity>

                        {showDetails && (
                            <ScrollView className="max-h-60 px-6 pb-4">
                                {/* Individual Dishes Section */}
                                {parsedMeal?.dishes &&
                                    parsedMeal.dishes.length > 0 && (
                                        <View className="border border-gray-200 rounded-xl p-4 mb-4">
                                            <Text className="text-gray-800 font-semibold mb-3">
                                                Individual Dishes
                                            </Text>
                                            {parsedMeal.dishes.map(
                                                (dish, index) => (
                                                    <View
                                                        key={index}
                                                        className="mb-3 pb-3 border-b border-gray-100 last:border-b-0"
                                                    >
                                                        <Text className="text-gray-800 font-medium mb-2">
                                                            {dish.quantity}{" "}
                                                            {dish.unit}{" "}
                                                            {dish.name}
                                                        </Text>
                                                        {dish.nutrition && (
                                                            <View className="ml-2">
                                                                <Text className="text-sm text-gray-600">
                                                                    {[
                                                                        dish
                                                                            .nutrition
                                                                            .calories &&
                                                                            `Calories: ${Math.round(
                                                                                dish
                                                                                    .nutrition
                                                                                    .calories
                                                                            )}`,
                                                                        dish
                                                                            .nutrition
                                                                            .protein_g &&
                                                                            `Protein: ${
                                                                                Math.round(
                                                                                    dish
                                                                                        .nutrition
                                                                                        .protein_g *
                                                                                        10
                                                                                ) /
                                                                                10
                                                                            }g`,
                                                                        dish
                                                                            .nutrition
                                                                            .carbohydrates_g &&
                                                                            `Carbs: ${
                                                                                Math.round(
                                                                                    dish
                                                                                        .nutrition
                                                                                        .carbohydrates_g *
                                                                                        10
                                                                                ) /
                                                                                10
                                                                            }g`,
                                                                        dish
                                                                            .nutrition
                                                                            .fat_g &&
                                                                            `Fat: ${
                                                                                Math.round(
                                                                                    dish
                                                                                        .nutrition
                                                                                        .fat_g *
                                                                                        10
                                                                                ) /
                                                                                10
                                                                            }g`,
                                                                    ]
                                                                        .filter(
                                                                            Boolean
                                                                        )
                                                                        .join(
                                                                            " • "
                                                                        )}
                                                                </Text>
                                                            </View>
                                                        )}
                                                    </View>
                                                )
                                            )}
                                        </View>
                                    )}
                            </ScrollView>
                        )}

                        {/* Action Buttons */}
                        <View className="px-6 pt-4 pb-8 border-t border-gray-100">
                            <View className="flex-row space-x-3">
                                <TouchableOpacity
                                    className="flex-1 py-4 rounded-xl items-center mr-3"
                                    style={{
                                        backgroundColor: gradientColors[0],
                                    }}
                                    onPress={onClose}
                                >
                                    <Text className="text-white font-semibold text-base">
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
