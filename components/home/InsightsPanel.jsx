import React from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { useInsights } from "../../hooks/useInsights";
import TipCard from "./TipCard";

export default function InsightsPanel() {
    const { data: insights, isLoading, error } = useInsights();

    // Show loading state
    if (isLoading) {
        return (
            <View className="bg-white">
                <Text className="text-lg font-semibold text-gray-900 ml-1 mb-2">
                    Want an A today?
                </Text>
                <View className="h-32 justify-center items-center">
                    <ActivityIndicator size="large" color="#16a34a" />
                    <Text className="text-gray-600 mt-2">
                        Generating insights...
                    </Text>
                </View>
            </View>
        );
    }

    // Show error state with fallback
    if (error || !insights) {
        console.error("Error loading insights:", error);
        // Show fallback tips if there's an error
        const fallbackTips = [
            {
                id: "fallback-1",
                emoji: "🥗",
                title: "Eat more vegetables",
                description:
                    "Aim to fill half your plate with colorful vegetables.",
                actionable: true,
                category: "nutrition",
            },
        ];

        return (
            <View className="bg-white">
                <Text className="text-lg font-semibold text-gray-900 ml-1 mb-2">
                    Want an A today?
                </Text>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View className="">
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                        >
                            {fallbackTips.map((tip) => (
                                <TipCard key={tip.id} tip={tip} />
                            ))}
                        </ScrollView>
                    </View>
                </ScrollView>
            </View>
        );
    }

    return (
        <View className="bg-white">
            <Text className="text-lg font-semibold text-gray-900 ml-1 mb-2">
                Want an A today?
            </Text>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Tips section */}
                <View className="">
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                    >
                        {insights.map((tip) => (
                            <TipCard key={tip.id} tip={tip} />
                        ))}
                    </ScrollView>
                </View>

                {/* Nutrient Summary section */}
                {/* <View className="mb-4">
                    <Text className="text-base font-semibold text-gray-800 mb-4">
                        Nutrient Summary
                    </Text>
                    <View className="flex-row justify-between">
                        <View className="w-[30%] bg-gray-50 rounded-xl p-4 items-center">
                            <Text className="text-lg font-bold text-gray-900">
                                68g
                            </Text>
                            <Text className="text-sm text-gray-600 mt-1">
                                Protein
                            </Text>
                        </View>
                        <View className="w-[30%] bg-gray-50 rounded-xl p-4 items-center">
                            <Text className="text-lg font-bold text-gray-900">
                                26g
                            </Text>
                            <Text className="text-sm text-gray-600 mt-1">
                                Fiber
                            </Text>
                        </View>
                        <View className="w-[30%] bg-gray-50 rounded-xl p-4 items-center">
                            <Text className="text-lg font-bold text-gray-900">
                                1,840
                            </Text>
                            <Text className="text-sm text-gray-600 mt-1">
                                Calories
                            </Text>
                        </View>
                    </View>
                </View> */}

                {/* Today's meals section */}
                {/* <View className="mb-4">
                    <Text className="text-base font-semibold text-gray-800 mb-4">
                        Today's meals
                    </Text>
                    <View className="bg-gray-50 rounded-xl p-4">
                        <Text className="text-base font-semibold text-gray-800">
                            3 meals logged today
                        </Text>
                        <Text className="text-sm text-gray-600 mt-1">
                            Mostly plant-based (72%)
                        </Text>
                    </View>
                </View> */}
            </ScrollView>
        </View>
    );
}
