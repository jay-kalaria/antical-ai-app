import { supabase } from "@/utils/supabase";

export const fetchDailyGrade = async (date = new Date()) => {
    try {
        const dateString = date.toISOString().split("T")[0];
        console.log("Fetching daily grade for date:", dateString);

        // First try to get from daily_grades table
        const { data: dailyGrade, error: dailyGradeError } = await supabase
            .from("daily_grades")
            .select("*")
            .eq("date", dateString)
            .single();

        if (!dailyGradeError && dailyGrade) {
            console.log("Found daily grade in daily_grades table:", dailyGrade);
            return {
                date: dateString,
                average_grade: dailyGrade.average_grade,
                meal_count: dailyGrade.meal_count,
                grade_score: dailyGrade.grade_score,
                source: "daily_grades",
            };
        }

        console.log("No daily grade found, calculating from meal_logs...");

        // Fallback: Fetch all meals for the given date and calculate
        const { data: meals, error } = await supabase
            .from("meal_logs")
            .select("meal_grade")
            .gte("meal_date", `${dateString}T00:00:00`)
            .lt("meal_date", `${dateString}T23:59:59`);

        console.log("Supabase query result:", { meals, error });

        if (error) {
            console.error("Error fetching meals for daily grade:", error);
            throw error;
        }

        // If no meals found, return null
        if (!meals || meals.length === 0) {
            console.log("No meals found for date:", dateString);
            return null;
        }

        console.log("Found meals:", meals);

        // Calculate average grade
        const gradeValues = { A: 5, B: 4, C: 3, D: 2, E: 1 };
        const gradeLetters = ["E", "D", "C", "B", "A"];

        const totalValue = meals.reduce((sum, meal) => {
            return sum + (gradeValues[meal.meal_grade] || 3); // Default to C if invalid grade
        }, 0);

        const averageValue = Math.round(totalValue / meals.length);
        const averageGrade = gradeLetters[averageValue - 1] || "C";

        const result = {
            date: dateString,
            average_grade: averageGrade,
            meal_count: meals.length,
            grades: meals.map((m) => m.meal_grade),
            source: "calculated",
        };

        console.log("Calculated daily grade result:", result);
        return result;
    } catch (error) {
        console.error("Error in fetchDailyGrade:", error);
        return null;
    }
};
