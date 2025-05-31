import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    createMeal,
    createMealIngredient,
    createMealNutrition,
    deleteMeal,
    deleteMealIngredient,
    deleteMealNutrition,
    getMealById,
    getMealIngredients,
    getMealNutrition,
    getMeals,
    updateMeal,
    updateMealIngredient,
    updateMealNutrition,
} from "../services/api/mealService";

// Meal Hooks
export function useMeals() {
    return useQuery({
        queryKey: ["meals"],
        queryFn: getMeals,
    });
}

export function useMeal(id) {
    return useQuery({
        queryKey: ["meal", id],
        queryFn: () => getMealById(id),
        enabled: !!id,
    });
}

export function useCreateMeal() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (meal) => createMeal(meal),
        onSuccess: () => {
            // Invalidate meals list
            queryClient.invalidateQueries({ queryKey: ["meals"] });

            // Invalidate daily grade for today
            const today = new Date().toISOString().split("T")[0];
            queryClient.refetchQueries({
                queryKey: ["dailyGrade", today],
                type: "active",
            });

            // Invalidate insights for today
            queryClient.invalidateQueries({
                queryKey: ["insights", today],
            });
        },
    });
}

export function useUpdateMeal() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, updates }) => updateMeal(id, updates),
        onSuccess: (updatedMeal) => {
            queryClient.invalidateQueries({ queryKey: ["meals"] });
            queryClient.invalidateQueries({
                queryKey: ["meal", updatedMeal.id],
            });
        },
    });
}

export function useDeleteMeal() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => deleteMeal(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ["meals"] });
            queryClient.invalidateQueries({ queryKey: ["meal", id] });
        },
    });
}

// Meal Ingredients Hooks
export function useMealIngredients(mealId) {
    return useQuery({
        queryKey: ["mealIngredients", mealId],
        queryFn: () => getMealIngredients(mealId),
        enabled: !!mealId,
    });
}

export function useCreateMealIngredient() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (ingredient) => createMealIngredient(ingredient),
        onSuccess: (newIngredient) => {
            queryClient.invalidateQueries({
                queryKey: ["mealIngredients", newIngredient.meal_id],
            });
        },
    });
}

export function useUpdateMealIngredient() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, updates, mealId }) =>
            updateMealIngredient(id, updates),
        onSuccess: (_, { mealId }) => {
            queryClient.invalidateQueries({
                queryKey: ["mealIngredients", mealId],
            });
        },
    });
}

export function useDeleteMealIngredient() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, mealId }) => deleteMealIngredient(id),
        onSuccess: (_, { mealId }) => {
            queryClient.invalidateQueries({
                queryKey: ["mealIngredients", mealId],
            });
        },
    });
}

// Meal Nutrition Hooks
export function useMealNutrition(mealId) {
    return useQuery({
        queryKey: ["mealNutrition", mealId],
        queryFn: () => getMealNutrition(mealId),
        enabled: !!mealId,
    });
}

export function useCreateMealNutrition() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (nutrition) => createMealNutrition(nutrition),
        onSuccess: (newNutrition) => {
            queryClient.invalidateQueries({
                queryKey: ["mealNutrition", newNutrition.meal_id],
            });
        },
    });
}

export function useUpdateMealNutrition() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, updates, mealId }) =>
            updateMealNutrition(id, updates),
        onSuccess: (_, { mealId }) => {
            queryClient.invalidateQueries({
                queryKey: ["mealNutrition", mealId],
            });
        },
    });
}

export function useDeleteMealNutrition() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, mealId }) => deleteMealNutrition(id),
        onSuccess: (_, { mealId }) => {
            queryClient.invalidateQueries({
                queryKey: ["mealNutrition", mealId],
            });
        },
    });
}
