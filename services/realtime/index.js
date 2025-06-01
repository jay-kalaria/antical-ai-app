export { getRealtimeManager, resetRealtimeManager } from "./RealtimeManager";

// Helper to determine which queries to invalidate based on table changes
export const getInvalidationRules = (table, payload) => {
    const rules = {
        meal_logs: [
            { queryKey: ["meals"] },
            { queryKey: ["meal", payload.new?.id || payload.old?.id] },
            // Date-based invalidations
            ...(payload.new?.meal_date || payload.old?.meal_date
                ? [
                      {
                          queryKey: [
                              "dailyGrade",
                              new Date(
                                  payload.new?.meal_date ||
                                      payload.old?.meal_date
                              )
                                  .toISOString()
                                  .split("T")[0],
                          ],
                      },
                      {
                          queryKey: [
                              "insights",
                              new Date(
                                  payload.new?.meal_date ||
                                      payload.old?.meal_date
                              )
                                  .toISOString()
                                  .split("T")[0],
                          ],
                      },
                  ]
                : []),
        ],
        meal_ingredients: [
            {
                queryKey: [
                    "mealIngredients",
                    payload.new?.meal_id || payload.old?.meal_id,
                ],
            },
        ],
        meal_nutrition: [
            {
                queryKey: [
                    "mealNutrition",
                    payload.new?.meal_id || payload.old?.meal_id,
                ],
            },
        ],
        daily_grades: [
            {
                queryKey: [
                    "dailyGrade",
                    payload.new?.date || payload.old?.date,
                ],
            },
            { queryKey: ["insights", payload.new?.date || payload.old?.date] },
        ],
    };

    return rules[table] || [];
};

// Connection status constants
export const CONNECTION_STATUS = {
    DISCONNECTED: "DISCONNECTED",
    CONNECTING: "CONNECTING",
    CONNECTED: "CONNECTED",
    ERROR: "ERROR",
    RECONNECTING: "RECONNECTING",
};
