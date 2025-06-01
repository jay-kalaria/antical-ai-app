import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    createMealNutrition,
    deleteMealNutrition,
    getMealNutrition,
    updateMealNutrition,
} from "../services/api/mealService";

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
        onSettled: () => {
            // RealtimeManager handles the sync
        },
    });
}

export function useUpdateMealNutrition() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, updates, mealId }) =>
            updateMealNutrition(id, updates),
        onSettled: () => {
            // RealtimeManager handles the sync
        },
    });
}

export function useDeleteMealNutrition() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, mealId }) => deleteMealNutrition(id),
        onSettled: () => {
            // RealtimeManager handles the sync
        },
    });
}
