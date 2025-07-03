import { useCreateMeal, useUpdateMeal } from "@/hooks/useMeals";
import {
    FoodRecognitionError,
    NonFoodInputError,
    parseAndAnalyzeMeal,
} from "@/utils/mealParser";
import React, { createContext, useContext, useState } from "react";

const MealContext = createContext();

export function MealProvider({ children }) {
    const [parsedMeal, setParsedMeal] = useState(null);
    const [mealAnalysis, setMealAnalysis] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [driverReasons, setDriverReasons] = useState([]);
    const [gradeComment, setGradeComment] = useState("");
    const [errorState, setErrorState] = useState(null);
    const [showCustomAlert, setShowCustomAlert] = useState(false);
    const [alertConfig, setAlertConfig] = useState({});
    const [currentMealId, setCurrentMealId] = useState(null);

    // Use React Query mutation hooks
    const createMealMutation = useCreateMeal();
    const updateMealMutation = useUpdateMeal();

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

    // Function to show custom alert instead of error banner
    const showAlert = (
        title,
        message,
        showCancel = false,
        onConfirm = null
    ) => {
        setAlertConfig({
            title,
            message,
            showCancel,
            onConfirm: onConfirm || (() => setShowCustomAlert(false)),
            onCancel: () => setShowCustomAlert(false),
        });
        setShowCustomAlert(true);
    };

    // Helper function to upgrade grade
    const upgradeGrade = (currentGrade) => {
        const gradeMap = { E: "D", D: "C", C: "B", B: "A", A: "A" };
        return gradeMap[currentGrade] || currentGrade;
    };

    // Function to follow tip and upgrade grade
    const followTip = async () => {
        try {
            if (!currentMealId || !mealAnalysis?.grade) {
                throw new Error("No meal data available for upgrade");
            }

            const currentGrade = mealAnalysis.grade;
            if (currentGrade === "A") {
                throw new Error("Grade A cannot be upgraded");
            }

            const upgradedGrade = upgradeGrade(currentGrade);

            // Update meal in backend
            await updateMealMutation.mutateAsync({
                id: currentMealId,
                updates: {
                    meal_grade: upgradedGrade,
                    original_grade: currentGrade,
                    tip_followed: true,
                },
            });

            // Update local state
            setMealAnalysis((prev) => ({
                ...prev,
                grade: upgradedGrade,
                originalGrade: currentGrade,
            }));

            return upgradedGrade;
        } catch (error) {
            throw error;
        }
    };

    const saveMeal = async (description) => {
        try {
            setIsProcessing(true);
            setErrorState(null);

            const {
                parsedMeal: newParsedMeal,
                mealAnalysis: newMealAnalysis,
                gradeComment,
                description: mealDescription,
                driverReasons,
            } = await parseAndAnalyzeMeal(description);

            const mealData = {
                meal_name: newParsedMeal.dishes
                    .map(
                        (dish) =>
                            `${dish.emoji} ${dish.quantity} ${dish.unit} ${dish.name}`
                    )
                    .join(", "),
                meal_description: mealDescription,
                meal_grade: newMealAnalysis.grade,
                original_grade: newMealAnalysis.grade, // Store original grade
                comment: gradeComment,
                meal_date: new Date().toISOString(),
                calories: newParsedMeal.totalNutrition?.calories || null,
                protein: newParsedMeal.totalNutrition?.protein_g || null,
                carbs: newParsedMeal.totalNutrition?.carbohydrates_g || null,
                fat: newParsedMeal.totalNutrition?.fat_g || null,
                sugar: newParsedMeal.totalNutrition?.sugar_g || null,
                fiber: newParsedMeal.totalNutrition?.fiber_g || null,
                sodium: newParsedMeal.totalNutrition?.sodium_mg || null,
                additional_nutrients: {},
                tip_followed: false, // Initialize as false
            };

            const savedMeal = await createMealMutation.mutateAsync(mealData);

            setParsedMeal(newParsedMeal);
            setMealAnalysis(newMealAnalysis);
            setDriverReasons(driverReasons);
            setGradeComment(gradeComment);
            setCurrentMealId(savedMeal.id); // Store meal ID for later updates

            return savedMeal;
        } catch (error) {
            if (error instanceof FoodRecognitionError) {
                //setErrorState({ type: "FOOD_RECOGNITION" });
                // Option to show custom alert instead:
                showAlert(
                    "Food Recognition Issue",
                    "I couldn't understand the food you described. Please try again with more specific details."
                );
            } else if (error instanceof NonFoodInputError) {
                //setErrorState({ type: "NON_FOOD_INPUT" });
                // Option to show custom alert instead:
                showAlert(
                    "Not Food Related",
                    "Please describe a meal or food items you'd like me to analyze."
                );
            } else {
                setErrorState({ type: "GENERAL_ERROR" });
                // Option to show custom alert instead:
                showAlert("Error", "Something went wrong. Please try again.");
            }
            throw error;
        } finally {
            setIsProcessing(false);
        }
    };

    const clearError = () => {
        setErrorState(null);
    };

    const getMealMetrics = () => transformMealData(parsedMeal);

    const value = {
        isProcessing,
        transcript,
        setTranscript,
        saveMeal,
        followTip,
        getMealMetrics,
        parsedMeal,
        mealAnalysis,
        driverReasons,
        gradeComment,
        errorState,
        clearError,
        showCustomAlert,
        setShowCustomAlert,
        alertConfig,
        showAlert,
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
