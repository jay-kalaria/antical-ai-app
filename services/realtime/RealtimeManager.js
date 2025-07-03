import { supabase } from "../../utils/supabase";

class RealtimeManager {
    constructor(queryClient) {
        this.queryClient = queryClient;
        this.subscription = null;
        this.isConnected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
    }

    connect() {
        if (this.subscription) {
            console.log("RealtimeManager: Already connected");
            return;
        }

        console.log("RealtimeManager: Connecting...");

        // Single subscription for ALL tables
        this.subscription = supabase
            .channel("app_changes") // One channel for everything
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "meal_logs",
                },
                (payload) => this.handleMealLogsChange(payload)
            )
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "meal_ingredients",
                },
                (payload) => this.handleMealIngredientsChange(payload)
            )
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "meal_nutrition",
                },
                (payload) => this.handleMealNutritionChange(payload)
            )
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "daily_grades",
                },
                (payload) => {
                    console.log(
                        "RealtimeManager: Daily grades changed:",
                        payload
                    );
                    this.handleDailyGradesChange(payload);
                }
            )
            .subscribe((status, err) => {
                if (status === "SUBSCRIBED") {
                    this.isConnected = true;
                    this.reconnectAttempts = 0;
                    console.log("RealtimeManager: Connected successfully");
                } else if (status === "CHANNEL_ERROR") {
                    this.isConnected = false;
                    console.error("RealtimeManager: Channel error:", err);
                    this.handleReconnect();
                } else if (status === "TIMED_OUT") {
                    this.isConnected = false;
                    console.error("RealtimeManager: Connection timed out");
                    this.handleReconnect();
                } else if (status === "CLOSED") {
                    this.isConnected = false;
                    console.log("RealtimeManager: Connection closed");
                }
            });
    }

    handleReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            const delay = Math.min(
                1000 * Math.pow(2, this.reconnectAttempts),
                30000
            );

            console.log(
                `RealtimeManager: Attempting reconnect ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${delay}ms`
            );

            setTimeout(() => {
                this.disconnect();
                this.connect();
            }, delay);
        } else {
            console.error("RealtimeManager: Max reconnection attempts reached");
        }
    }

    handleMealLogsChange(payload) {
        console.log(
            "RealtimeManager: Meal logs changed:",
            payload.eventType,
            payload.new?.id || payload.old?.id
        );

        // Invalidate meals list
        this.queryClient.invalidateQueries({ queryKey: ["meals"] });

        // Invalidate specific meal if we have an ID
        if (payload.new?.id) {
            this.queryClient.invalidateQueries({
                queryKey: ["meal", payload.new.id],
            });
        }
        if (payload.old?.id) {
            this.queryClient.invalidateQueries({
                queryKey: ["meal", payload.old.id],
            });
        }

        // Invalidate date-based queries
        const mealDate = payload.new?.meal_date || payload.old?.meal_date;
        if (mealDate) {
            const dateString = new Date(mealDate).toISOString().split("T")[0];

            // Invalidate daily grade for the meal's date
            this.queryClient.invalidateQueries({
                queryKey: ["dailyGrade", dateString],
            });

            // Invalidate insights for the date
            this.queryClient.invalidateQueries({
                queryKey: ["insights", dateString],
            });

            // Invalidate stored explanations for history view
            this.queryClient.invalidateQueries({
                queryKey: ["storedExplanationsHistory"],
            });
        }

        // For optimistic updates, you can also directly update the cache
        if (payload.eventType === "INSERT" && payload.new) {
            this.queryClient.setQueryData(["meals"], (oldData) => {
                if (!oldData) return [payload.new];
                // Check if meal already exists (to avoid duplicates from optimistic updates)
                const exists = oldData.some(
                    (meal) => meal.id === payload.new.id
                );
                if (exists) return oldData;
                return [payload.new, ...oldData];
            });
        } else if (payload.eventType === "DELETE" && payload.old) {
            this.queryClient.setQueryData(["meals"], (oldData) => {
                if (!oldData) return [];
                return oldData.filter((meal) => meal.id !== payload.old.id);
            });
        } else if (payload.eventType === "UPDATE" && payload.new) {
            this.queryClient.setQueryData(["meals"], (oldData) => {
                if (!oldData) return [payload.new];
                return oldData.map((meal) =>
                    meal.id === payload.new.id ? payload.new : meal
                );
            });
        }
    }

    handleMealIngredientsChange(payload) {
        const mealId = payload.new?.meal_id || payload.old?.meal_id;
        console.log(
            "RealtimeManager: Meal ingredients changed for meal:",
            mealId
        );

        if (mealId) {
            this.queryClient.invalidateQueries({
                queryKey: ["mealIngredients", mealId],
            });

            // Also invalidate the meal itself as ingredients affect the meal
            this.queryClient.invalidateQueries({
                queryKey: ["meal", mealId],
            });
        }
    }

    handleMealNutritionChange(payload) {
        const mealId = payload.new?.meal_id || payload.old?.meal_id;
        console.log(
            "RealtimeManager: Meal nutrition changed for meal:",
            mealId
        );

        if (mealId) {
            this.queryClient.invalidateQueries({
                queryKey: ["mealNutrition", mealId],
            });

            // Also invalidate the meal itself as nutrition affects the meal
            this.queryClient.invalidateQueries({
                queryKey: ["meal", mealId],
            });
        }
    }

    handleDailyGradesChange(payload) {
        const date = payload.new?.date || payload.old?.date;
        console.log("RealtimeManager: Daily grades changed for date:", date);

        if (date) {
            this.queryClient.invalidateQueries({
                queryKey: ["dailyGrade", date],
            });

            // Also invalidate insights for the same date
            this.queryClient.invalidateQueries({
                queryKey: ["insights", date],
            });

            // Invalidate stored explanations as they depend on daily grades
            this.queryClient.invalidateQueries({
                queryKey: ["storedExplanationsHistory"],
            });
        }
    }

    disconnect() {
        if (this.subscription) {
            console.log("RealtimeManager: Disconnecting...");
            this.subscription.unsubscribe();
            this.subscription = null;
            this.isConnected = false;
        }
    }

    getConnectionStatus() {
        return {
            isConnected: this.isConnected,
            reconnectAttempts: this.reconnectAttempts,
        };
    }
}

// Singleton instance
let realtimeManager = null;

export function getRealtimeManager(queryClient) {
    if (!realtimeManager && queryClient) {
        realtimeManager = new RealtimeManager(queryClient);
    }
    return realtimeManager;
}

export function resetRealtimeManager() {
    if (realtimeManager) {
        realtimeManager.disconnect();
        realtimeManager = null;
    }
}
