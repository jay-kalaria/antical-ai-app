import { supabase } from "@/utils/supabase";

export const fetchDailyGrade = async (date = new Date()) => {
    try {
        const dateString = date.toISOString().split("T")[0];

        // Fetch all meals for the given date
        const { data: meals, error } = await supabase
            .from("meal_logs")
            .select("meal_grade")
            .gte("meal_date", `${dateString}T00:00:00`)
            .lt("meal_date", `${dateString}T23:59:59`);

        if (error) {
            console.error("Error fetching meals for daily grade:", error);
            throw error;
        }

        // If no meals found, return null
        if (!meals || meals.length === 0) {
            return null;
        }

        // Calculate average grade
        const gradeValues = { A: 5, B: 4, C: 3, D: 2, E: 1 };
        const gradeLetters = ["E", "D", "C", "B", "A"];

        const totalValue = meals.reduce((sum, meal) => {
            return sum + (gradeValues[meal.meal_grade] || 3); // Default to C if invalid grade
        }, 0);

        const averageValue = Math.round(totalValue / meals.length);
        const averageGrade = gradeLetters[averageValue - 1] || "C";

        return {
            date: dateString,
            average_grade: averageGrade,
            meal_count: meals.length,
            grades: meals.map((m) => m.meal_grade),
        };
    } catch (error) {
        console.error("Error in fetchDailyGrade:", error);
        return null;
    }
};
