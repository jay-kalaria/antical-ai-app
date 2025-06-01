import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    createMealIngredient,
    deleteMealIngredient,
    getMealIngredients,
    updateMealIngredient,
} from "../services/api/mealService";

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
        // Optimistic update
        onMutate: async (newIngredient) => {
            await queryClient.cancelQueries({
                queryKey: ["mealIngredients", newIngredient.meal_id],
            });

            const previousIngredients = queryClient.getQueryData([
                "mealIngredients",
                newIngredient.meal_id,
            ]);

            const optimisticIngredient = {
                ...newIngredient,
                id: `temp-${Date.now()}`,
                created_at: new Date().toISOString(),
            };

            queryClient.setQueryData(
                ["mealIngredients", newIngredient.meal_id],
                (old) =>
                    old
                        ? [...old, optimisticIngredient]
                        : [optimisticIngredient]
            );

            return { previousIngredients };
        },
        onError: (err, newIngredient, context) => {
            queryClient.setQueryData(
                ["mealIngredients", newIngredient.meal_id],
                context.previousIngredients
            );
        },
        onSettled: () => {
            // RealtimeManager handles the sync
        },
    });
}

export function useUpdateMealIngredient() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, updates, mealId }) =>
            updateMealIngredient(id, updates),
        onSettled: () => {
            // RealtimeManager handles the sync
        },
    });
}

export function useDeleteMealIngredient() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, mealId }) => deleteMealIngredient(id),
        onSettled: () => {
            // RealtimeManager handles the sync
        },
    });
}
