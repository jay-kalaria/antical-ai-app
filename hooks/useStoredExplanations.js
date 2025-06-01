import { supabase } from "@/utils/supabase";
import { useQuery } from "@tanstack/react-query";

/**
 * Simple hook to fetch stored AI explanations from database
 */
export function useStoredExplanationsHistory(days = 7) {
    return useQuery({
        queryKey: ["storedExplanationsHistory", days],
        queryFn: async () => {
            const explanations = [];
            const today = new Date();

            for (let i = 1; i < days; i++) {
                // Skip today
                const date = new Date(today);
                date.setDate(today.getDate() - i);
                const dateString = date.toISOString().split("T")[0];

                const { data: dailyGrade } = await supabase
                    .from("daily_grades")
                    .select("*")
                    .eq("date", dateString)
                    .single();

                if (dailyGrade) {
                    explanations.push({
                        date: dateString,
                        dayName: date.toLocaleDateString("en-US", {
                            weekday: "short",
                        }),
                        statement:
                            dailyGrade.ai_explanation ||
                            "Processing your day...",
                        keyFactors: dailyGrade.ai_key_factors || [],
                        grade: dailyGrade.average_grade,
                        source: dailyGrade.explanation_source || "pending",
                    });
                }
            }

            return explanations;
        },
        staleTime: 1000 * 60 * 15, // 15 minutes
        refetchOnWindowFocus: false,
    });
}
