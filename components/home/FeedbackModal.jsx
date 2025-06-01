import Colors from "@/constants/Colors";
import { useMeal } from "@/contexts/MealContext";
import {
    calculateMealAnalysis,
    getScoreForGrade,
} from "@/utils/mealGradeCalculator";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useMemo, useState } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import NutriScoreBadge from "./NutriScoreBadge";
import { BlurView } from "expo-blur";

export default function FeedbackModal({ visible, tip, onClose, onEdit }) {
    const {
        getMealMetrics,
        mealScore,
        cycleMealScore,
        parsedMeal,
        driverReasons,
        gradeComment,
        //mealAnalysis,
    } = useMeal();
    const meal = getMealMetrics();

    if (!meal) return null;

    // States to track badge grades for animation testing
    const [nutriScoreGrade, setNutriScoreGrade] = useState(
        meal.nutriScore || "C"
    );
    const [showDetails, setShowDetails] = useState(false);

    // Calculate meal score and grade based on the provided rules
    const mealAnalysis = useMemo(() => {
        return calculateMealAnalysis(meal);
    }, [meal]);

    // State for the meal score grade with initial value from mealAnalysis
    const [mealScoreGrade, setMealScoreGrade] = useState(mealAnalysis.grade);
    const [mealScoreValue, setMealScoreValue] = useState(mealAnalysis.score);

    // Function to cycle through grades
    const cycleGrade = (currentGrade, setGradeFunction) => {
        const grades = ["A", "B", "C", "D", "E"];
        const currentIndex = grades.indexOf(currentGrade);
        const nextIndex = (currentIndex + 1) % grades.length;
        setGradeFunction(grades[nextIndex]);

        // Add haptic feedback
        try {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } catch (e) {
            console.log("Haptics not available");
        }
    };

    // Update score when mealScoreGrade changes
    React.useEffect(() => {
        setMealScoreValue(getScoreForGrade(mealScoreGrade));
    }, [mealScoreGrade]);

    return (
        <Modal
            visible={visible}
            transparent={true}
            
            animationType="slide"
            onRequestClose={onClose}
        >
            <BlurView intensity={40} tint="dark" className="flex-1 justify-end">
                <View className="bg-white rounded-t-3xl pb-[30px]">
                    {/* <View className="flex-row items-center justify-between p-4 border-b border-gray-100">
                            <Text className="text-lg font-semibold text-gray-900">
                                Meal Analysis
                            </Text>
                            <TouchableOpacity onPress={onClose} className="p-1">
                                <Ionicons
                                    name="close"
                                    size={24}
                                    color={Colors.gray[500]}
                                />
                            </TouchableOpacity>
                        </View> */}

                    <ScrollView className="max-h-[400px]">
                        <View className="p-4">
                            <View className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
                                <View className="flex-row items-center justify-between">
                                    <View className="flex-1 mr-4">
                                        <Text
                                            className="text-[22px] font-bold text-gray-900"
                                            ellipsizeMode="tail"
                                        >
                                            {meal.name}
                                        </Text>
                                        {/* {meal.calories !== undefined && (
                                                <Text className="text-base text-gray-700 mt-1">
                                                    Total Calories:{" "}
                                                    <Text className="font-semibold">
                                                        {meal.calories}
                                                    </Text>
                                                </Text>
                                            )} */}
                                    </View>
                                    <TouchableOpacity
                                        onPress={() =>
                                            cycleGrade(
                                                mealScoreGrade,
                                                setMealScoreGrade
                                            )
                                        }
                                        activeOpacity={0.8}
                                    >
                                        <NutriScoreBadge
                                            grade={mealScoreGrade}
                                            size="large"
                                            score={mealScoreValue}
                                            showScore={true}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {gradeComment && (
                                <View className="border border-green-200 bg-green-50 rounded-lg p-4 w-full mb-4 shadow-sm">
                                    <Text className="text-base font-semibold text-green-800 mb-2">
                                        Feedback
                                    </Text>
                                    <Text
                                        className="text-[16px] text-green-900 font-medium"
                                        style={{ lineHeight: 22 }}
                                    >
                                        {gradeComment}
                                    </Text>
                                </View>
                            )}

                            <TouchableOpacity
                                onPress={() => setShowDetails(!showDetails)}
                                className="flex-row items-center mb-4"
                            >
                                <Text className="text-blue-500 font-medium mr-1">
                                    {showDetails ? "See less" : "See more"}
                                </Text>
                                <Ionicons
                                    name={
                                        showDetails
                                            ? "chevron-up"
                                            : "chevron-down"
                                    }
                                    size={16}
                                    color={Colors.primary}
                                />
                            </TouchableOpacity>

                            {showDetails && (
                                <>
                                    {meal.calories !== undefined && (
                                        <Text className="text-base text-gray-700 mt-1">
                                            Total Calories:{" "}
                                            <Text className="font-semibold">
                                                {meal.calories}
                                            </Text>
                                        </Text>
                                    )}

                                    {/* Individual Dishes Section */}
                                    {parsedMeal?.dishes &&
                                        parsedMeal.dishes.length > 0 && (
                                            <View className="mt-2 border border-gray-200 rounded-lg p-4 w-full mb-4">
                                                <Text className="text-base font-semibold text-gray-800 mb-3">
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
                                                                    {(dish
                                                                        .nutrition
                                                                        .fiber_g ||
                                                                        dish
                                                                            .nutrition
                                                                            .sugar_g ||
                                                                        dish
                                                                            .nutrition
                                                                            .sodium_mg) && (
                                                                        <Text className="text-sm text-gray-500 mt-1">
                                                                            {[
                                                                                dish
                                                                                    .nutrition
                                                                                    .fiber_g &&
                                                                                    `Fiber: ${
                                                                                        Math.round(
                                                                                            dish
                                                                                                .nutrition
                                                                                                .fiber_g *
                                                                                                10
                                                                                        ) /
                                                                                        10
                                                                                    }g`,
                                                                                dish
                                                                                    .nutrition
                                                                                    .sugar_g &&
                                                                                    `Sugar: ${
                                                                                        Math.round(
                                                                                            dish
                                                                                                .nutrition
                                                                                                .sugar_g *
                                                                                                10
                                                                                        ) /
                                                                                        10
                                                                                    }g`,
                                                                                dish
                                                                                    .nutrition
                                                                                    .sodium_mg &&
                                                                                    `Sodium: ${Math.round(
                                                                                        dish
                                                                                            .nutrition
                                                                                            .sodium_mg
                                                                                    )}mg`,
                                                                            ]
                                                                                .filter(
                                                                                    Boolean
                                                                                )
                                                                                .join(
                                                                                    " • "
                                                                                )}
                                                                        </Text>
                                                                    )}
                                                                </View>
                                                            )}
                                                            {dish.ingredients &&
                                                                dish.ingredients
                                                                    .length >
                                                                    0 && (
                                                                    <View className="ml-2 mt-2">
                                                                        <Text className="text-xs text-gray-500">
                                                                            Ingredients:{" "}
                                                                            {dish.ingredients
                                                                                .map(
                                                                                    (
                                                                                        ing
                                                                                    ) =>
                                                                                        ing.name
                                                                                )
                                                                                .join(
                                                                                    ", "
                                                                                )}
                                                                        </Text>
                                                                    </View>
                                                                )}
                                                        </View>
                                                    )
                                                )}
                                            </View>
                                        )}

                                    {/* --- SCORE CALCULATION BREAKDOWN (COMMENTED OUT) --- */}
                                    {false && (
                                        <View className="mt-2 border border-gray-200 rounded-lg p-4 w-full">
                                            <Text className="text-base font-semibold text-gray-800 mb-3">
                                                Score Calculation
                                            </Text>
                                            <View className="mb-2">
                                                <Text className="text-gray-700 font-medium">
                                                    Starting score: 60 points
                                                </Text>
                                            </View>
                                            {/* ...rest of score breakdown... */}
                                        </View>
                                    )}

                                    {/* Key factors (if any) */}
                                    {driverReasons.length > 0 && (
                                        <View className="mt-4 w-full">
                                            <Text className="text-sm text-gray-600 mb-1">
                                                Key factors
                                            </Text>
                                            <View className="flex-row flex-wrap">
                                                {mealAnalysis.driverReasons.map(
                                                    (reason, index) => (
                                                        <View
                                                            key={index}
                                                            className="bg-gray-100 rounded-full px-3 py-1 mr-2 mb-2"
                                                        >
                                                            <Text className="text-xs text-gray-800">
                                                                {reason}
                                                            </Text>
                                                        </View>
                                                    )
                                                )}
                                            </View>
                                        </View>
                                    )}
                                </>
                            )}
                        </View>
                    </ScrollView>

                    <View className="p-4 border-t border-gray-100">
                        <View className="flex-row space-x-3 gap-6">
                            <TouchableOpacity
                                className="flex-1 bg-primary py-4 rounded-lg items-center"
                                onPress={onClose}
                            >
                                <Text className="text-white font-semibold text-base">
                                    Got it
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                className="flex-1 border border-gray-300 py-4 rounded-lg items-center"
                                onPress={onEdit}
                            >
                                <Text className="text-gray-600 font-medium">
                                    Edit meal
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </BlurView>
        </Modal>
    );
}
