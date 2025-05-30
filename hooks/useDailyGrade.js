import { fetchDailyGrade } from "@/services/api/gradeService";
import { useQuery } from "@tanstack/react-query";

export function useDailyGrade(date = new Date()) {
    return useQuery({
        queryKey: ["dailyGrade", date.toISOString().split("T")[0]],
        queryFn: () => fetchDailyGrade(date),
    });
}
