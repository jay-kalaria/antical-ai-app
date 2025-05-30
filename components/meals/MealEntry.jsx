import React, { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import {
    useCreateMeal,
    useDeleteMeal,
    useMeal,
    useMealIngredients,
    useMealNutrition,
    useUpdateMeal,
} from "../../hooks/useMeals";
import MealGauge from "../home/MealGauge";

const grades = ["A", "B", "C", "D", "E"];

export default function MealEntry({ mealId, onSuccess }) {
    const [currentGrade, setCurrentGrade] = useState("C");
    const [mealName, setMealName] = useState("");

    // Queries
    const { data: meal, isLoading: isMealLoading } = useMeal(mealId || "");
    const { data: ingredients } = useMealIngredients(mealId || "");
    const { data: nutrition } = useMealNutrition(mealId || "");

    // Mutations
    const createMealMutation = useCreateMeal();
    const updateMealMutation = useUpdateMeal();
    const deleteMealMutation = useDeleteMeal();

    // Update local state when meal data is loaded
    useEffect(() => {
        if (meal) {
            setCurrentGrade(meal.meal_grade);
            setMealName(meal.meal_name);
        }
    }, [meal]);

    // Handle creating or updating a meal
    const handleSaveMeal = async () => {
        if (!mealName.trim()) {
            Alert.alert("Error", "Please enter a meal name");
            return;
        }

        try {
            const mealData = {
                meal_name: mealName,
                meal_grade: currentGrade,
            };

            if (mealId) {
                // Update existing meal
                await updateMealMutation.mutateAsync({
                    id: mealId,
                    updates: mealData,
                });
            } else {
                // Create new meal
                await createMealMutation.mutateAsync(mealData);
            }

            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            Alert.alert("Error", "Failed to save meal");
            console.error(error);
        }
    };

    // Handle deleting a meal
    const handleDeleteMeal = async () => {
        if (!mealId) return;

        try {
            await deleteMealMutation.mutateAsync(mealId);
            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            Alert.alert("Error", "Failed to delete meal");
            console.error(error);
        }
    };

    // Toggle through grades when gauge is tapped
    const handleGradeChange = () => {
        const currentIndex = grades.indexOf(currentGrade);
        const nextIndex = (currentIndex + 1) % grades.length;
        setCurrentGrade(grades[nextIndex]);
    };

    if (mealId && isMealLoading) {
        return (
            <View style={styles.container}>
                <Text>Loading meal...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                {mealId ? "Edit Meal" : "Add New Meal"}
            </Text>

            {/* Text input for meal name */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Meal Name</Text>
                <View style={styles.textInput}>
                    <Text>{mealName}</Text>
                </View>
            </View>

            {/* Meal Grade Gauge */}
            <Pressable onPress={handleGradeChange}>
                <MealGauge score={currentGrade} />
            </Pressable>

            {/* Display nutrition summary if available */}
            {nutrition && (
                <View style={styles.nutritionContainer}>
                    <Text style={styles.sectionTitle}>Nutrition Summary</Text>
                    <Text>Calories: {nutrition.calories} kcal</Text>
                    {nutrition.protein && (
                        <Text>Protein: {nutrition.protein}g</Text>
                    )}
                    {nutrition.carbs && <Text>Carbs: {nutrition.carbs}g</Text>}
                    {nutrition.fat && <Text>Fat: {nutrition.fat}g</Text>}
                </View>
            )}

            {/* Display ingredients if available */}
            {ingredients && ingredients.length > 0 && (
                <View style={styles.ingredientsContainer}>
                    <Text style={styles.sectionTitle}>Ingredients</Text>
                    {ingredients.map((ingredient) => (
                        <Text key={ingredient.id}>
                            {ingredient.quantity} {ingredient.unit}{" "}
                            {ingredient.food_name}
                        </Text>
                    ))}
                </View>
            )}

            {/* Action buttons */}
            <View style={styles.buttonsContainer}>
                <Pressable
                    style={[styles.button, styles.saveButton]}
                    onPress={handleSaveMeal}
                    disabled={
                        createMealMutation.isPending ||
                        updateMealMutation.isPending
                    }
                >
                    <Text style={styles.buttonText}>
                        {createMealMutation.isPending ||
                        updateMealMutation.isPending
                            ? "Saving..."
                            : "Save Meal"}
                    </Text>
                </Pressable>

                {mealId && (
                    <Pressable
                        style={[styles.button, styles.deleteButton]}
                        onPress={handleDeleteMeal}
                        disabled={deleteMealMutation.isPending}
                    >
                        <Text style={styles.buttonText}>
                            {deleteMealMutation.isPending
                                ? "Deleting..."
                                : "Delete Meal"}
                        </Text>
                    </Pressable>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
    },
    inputContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    textInput: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    nutritionContainer: {
        marginTop: 16,
        padding: 12,
        backgroundColor: "#f5f5f5",
        borderRadius: 8,
    },
    ingredientsContainer: {
        marginTop: 16,
        padding: 12,
        backgroundColor: "#f5f5f5",
        borderRadius: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
    },
    buttonsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 24,
    },
    button: {
        flex: 1,
        padding: 16,
        borderRadius: 8,
        alignItems: "center",
        marginHorizontal: 4,
    },
    saveButton: {
        backgroundColor: "#24C08B",
    },
    deleteButton: {
        backgroundColor: "#E63E11",
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
});
