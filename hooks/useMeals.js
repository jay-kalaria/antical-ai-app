import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    createMeal,
    deleteMeal,
    getMealById,
    getMeals,
    updateMeal,
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
        // Optimistic update for better UX
        onMutate: async (newMeal) => {
            await queryClient.cancelQueries({ queryKey: ["meals"] });

            const previousMeals = queryClient.getQueryData(["meals"]);

            // Optimistically add the meal with a temporary ID
            const optimisticMeal = {
                ...newMeal,
                id: `temp-${Date.now()}`,
                created_at: new Date().toISOString(),
            };

            queryClient.setQueryData(["meals"], (old) =>
                old ? [optimisticMeal, ...old] : [optimisticMeal]
            );

            return { previousMeals, optimisticMeal };
        },
        onError: (err, newMeal, context) => {
            // Rollback on error
            queryClient.setQueryData(["meals"], context.previousMeals);
        },
        onSettled: () => {
            // RealtimeManager will handle the final state sync
            // No need for manual invalidation here
        },
    });
}

export function useUpdateMeal() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, updates }) => updateMeal(id, updates),
        // Optimistic update
        onMutate: async ({ id, updates }) => {
            await queryClient.cancelQueries({ queryKey: ["meals"] });
            await queryClient.cancelQueries({ queryKey: ["meal", id] });

            const previousMeals = queryClient.getQueryData(["meals"]);
            const previousMeal = queryClient.getQueryData(["meal", id]);

            // Optimistically update the meals list
            queryClient.setQueryData(["meals"], (old) =>
                old
                    ? old.map((meal) =>
                          meal.id === id ? { ...meal, ...updates } : meal
                      )
                    : []
            );

            // Optimistically update the specific meal
            queryClient.setQueryData(["meal", id], (old) =>
                old ? { ...old, ...updates } : null
            );

            return { previousMeals, previousMeal };
        },
        onError: (err, { id }, context) => {
            queryClient.setQueryData(["meals"], context.previousMeals);
            queryClient.setQueryData(["meal", id], context.previousMeal);
        },
        onSettled: () => {
            // RealtimeManager handles the sync
        },
    });
}

export function useDeleteMeal() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => deleteMeal(id),
        // Optimistic update
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ["meals"] });

            const previousMeals = queryClient.getQueryData(["meals"]);

            // Optimistically remove the meal
            queryClient.setQueryData(["meals"], (old) =>
                old ? old.filter((meal) => meal.id !== id) : []
            );

            return { previousMeals };
        },
        onError: (err, id, context) => {
            queryClient.setQueryData(["meals"], context.previousMeals);
        },
        onSettled: () => {
            // RealtimeManager handles the sync
        },
    });
}
