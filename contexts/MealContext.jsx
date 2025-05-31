import { useCreateMeal } from "@/hooks/useMeals";
import { parseAndAnalyzeMeal } from "@/utils/mealParser";
import { useQueryClient } from "@tanstack/react-query";
import React, { createContext, useContext, useState } from "react";

const MealContext = createContext();

export function MealProvider({ children }) {
    const [parsedMeal, setParsedMeal] = useState(null);
    const [mealAnalysis, setMealAnalysis] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [transcript, setTranscript] = useState("");
    const queryClient = useQueryClient();

    // Use React Query mutation hook
    const createMealMutation = useCreateMeal();

    const transformMealData = (parsedMeal) => {
        if (!parsedMeal?.dishes) {
            return {
                name: transcript || "No meal data available",
                nutriScore: "C",
                ultraProcessedPercentage: 0,
                fiber: 0,
                protein: 0,
                addedSugar: 0,
                saturatedFat: 0,
                sodium: 0,
                calories: 0,
            };
        }

        return {
            name: parsedMeal.dishes
                .map((dish) => `${dish.quantity} ${dish.unit} ${dish.name}`)
                .join(", "),
            nutriScore: mealAnalysis?.grade || "C",
            ultraProcessedPercentage: 0,
            fiber: parsedMeal.totalNutrition?.fiber_g || 0,
            protein: parsedMeal.totalNutrition?.protein_g || 0,
            addedSugar: parsedMeal.totalNutrition?.sugar_g || 0,
            saturatedFat: parsedMeal.totalNutrition?.fat_g || 0,
            sodium: parsedMeal.totalNutrition?.sodium_mg || 0,
            calories: parsedMeal.totalNutrition?.calories || 0,
        };
    };

    const saveMeal = async (description) => {
        try {
            setIsProcessing(true);

            // Parse and analyze the meal
            const {
                parsedMeal: newParsedMeal,
                mealAnalysis: newMealAnalysis,
                description: mealDescription,
            } = await parseAndAnalyzeMeal(description);

            // Transform meal data for saving
            const mealData = {
                meal_name: newParsedMeal.dishes
                    .map((dish) => `${dish.quantity} ${dish.unit} ${dish.name}`)
                    .join(", "),
                meal_description: mealDescription,
                meal_grade: newMealAnalysis.grade,
                meal_date: new Date().toISOString(),
                calories: newParsedMeal.totalNutrition?.calories || null,
                protein: newParsedMeal.totalNutrition?.protein_g || null,
                carbs: newParsedMeal.totalNutrition?.carbohydrates_g || null,
                fat: newParsedMeal.totalNutrition?.fat_g || null,
                sugar: newParsedMeal.totalNutrition?.sugar_g || null,
                fiber: newParsedMeal.totalNutrition?.fiber_g || null,
                sodium: newParsedMeal.totalNutrition?.sodium_mg || null,
                additional_nutrients: {},
            };

            // Save to database using React Query mutation
            const savedMeal = await createMealMutation.mutateAsync(mealData);

            // Update context state
            setParsedMeal(newParsedMeal);
            setMealAnalysis(newMealAnalysis);

            // Invalidate insights for today to trigger refresh
            const today = new Date().toISOString().split("T")[0];
            queryClient.invalidateQueries({
                queryKey: ["insights", today],
            });

            return savedMeal;
        } catch (error) {
            console.error("Error saving meal:", error);
            throw error;
        } finally {
            setIsProcessing(false);
        }
    };

    const getMealMetrics = () => transformMealData(parsedMeal);

    const value = {
        isProcessing,
        transcript,
        setTranscript,
        saveMeal,
        getMealMetrics,
        parsedMeal,
        mealAnalysis,
    };

    return (
        <MealContext.Provider value={value}>{children}</MealContext.Provider>
    );
}

export function useMeal() {
    const context = useContext(MealContext);
    if (!context) {
        throw new Error("useMeal must be used within a MealProvider");
    }
    return context;
}
