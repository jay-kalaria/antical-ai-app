import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function MealDetailsSection({
    meal,
    parsedMeal,
    gradientColors,
}) {
    const [showDetails, setShowDetails] = useState(false);

    const toggleDetails = () => {
        setShowDetails(!showDetails);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    return (
        <>
            {/* Expandable Details Toggle */}
            <TouchableOpacity
                onPress={toggleDetails}
                className="px-6 py-3 flex-row items-center justify-center "
            >
                <Text className="text-gray-600 font-medium mr-2">
                    {showDetails ? "Hide" : "Show"} Details
                </Text>
                <Ionicons
                    name={showDetails ? "chevron-up" : "chevron-down"}
                    size={16}
                    color="#6b7280"
                />
            </TouchableOpacity>

            {/* Details Content */}
            {showDetails && (
                <View className="px-6 pb-4">
                    {/* Nutrition Breakdown */}
                    <View className="border border-gray-200 rounded-xl p-4 mb-4">
                        <Text className="text-gray-800 font-semibold mb-3">
                            Nutrition Breakdown
                        </Text>
                        <View className="space-y-2">
                            <View className="flex-row justify-between">
                                <Text className="text-gray-600">Calories</Text>
                                <Text className="font-medium">
                                    {Math.round(meal.calories)} kcal
                                </Text>
                            </View>
                            <View className="flex-row justify-between">
                                <Text className="text-gray-600">Protein</Text>
                                <Text className="font-medium">
                                    {Math.round(meal.protein)}g
                                </Text>
                            </View>
                            <View className="flex-row justify-between">
                                <Text className="text-gray-600">Fiber</Text>
                                <Text className="font-medium">
                                    {Math.round(meal.fiber)}g
                                </Text>
                            </View>
                            <View className="flex-row justify-between">
                                <Text className="text-gray-600">
                                    Added Sugar
                                </Text>
                                <Text className="font-medium">
                                    {Math.round(meal.addedSugar)}g
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Individual Dishes */}
                    {parsedMeal?.dishes && parsedMeal.dishes.length > 0 && (
                        <View className="rounded-xl p-4 mb-4">
                            <Text className="text-gray-800 font-semibold mb-3">
                                Individual Dishes
                            </Text>
                            {parsedMeal.dishes.map((dish, index) => (
                                <View
                                    key={index}
                                    className="mb-3 pb-3 border-b border-gray-100 last:border-b-0"
                                >
                                    <Text className="font-medium text-gray-800">
                                        {dish.emoji} {dish.quantity} {dish.unit}{" "}
                                        {dish.name}
                                    </Text>
                                    <Text className="text-sm text-gray-600 mt-1">
                                        {Math.round(
                                            dish.nutrition?.calories || 0
                                        )}{" "}
                                        cal,{" "}
                                        {Math.round(
                                            dish.nutrition?.protein_g || 0
                                        )}
                                        g protein
                                    </Text>
                                </View>
                            ))}
                        </View>
                    )}
                </View>
            )}
        </>
    );
}
