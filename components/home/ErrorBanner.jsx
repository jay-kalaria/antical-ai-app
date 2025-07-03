import { useMeal } from "@/contexts/MealContext";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function ErrorBanner() {
    const { errorState, clearError } = useMeal();

    if (!errorState) return null;

    const getErrorMessage = () => {
        switch (errorState.type) {
            case "FOOD_RECOGNITION":
                return "I couldn't understand the food you described. Please try again with more specific details.";
            case "NON_FOOD_INPUT":
                return "Please describe a meal or food items you'd like me to analyze.";
            case "GENERAL_ERROR":
            default:
                return "Something went wrong. Please try again.";
        }
    };

    return (
        <View className="mx-4 mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
            <View className="flex-row items-start">
                <Ionicons
                    name="alert-circle-outline"
                    size={20}
                    color="#ef4444"
                    style={{ marginTop: 2, marginRight: 12 }}
                />
                <View className="flex-1">
                    <Text className="font-semibold text-gray-800 mb-1">
                        Error
                    </Text>
                    <Text className="text-gray-600 text-sm mb-3">
                        {getErrorMessage()}
                    </Text>
                    <TouchableOpacity
                        onPress={clearError}
                        className="border border-gray-300 px-4 py-2 rounded-lg self-start"
                    >
                        <Text className="text-gray-600 font-medium text-sm">
                            Dismiss
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
